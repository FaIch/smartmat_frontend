<template>
  <div class="my-fridge">
    <div class="search-div">
      <SearchBar id="search-bar" :search-placeholder="searchPlaceholder" @search="searchProducts" v-if="props.fridge"/>
      <button class="products-button" @click="toggleProductSelector">Se alle produkter</button>
      <div v-if="showProductSelector" class="popup-overlay" @click="toggleProductSelector"></div>
      <div v-if="showProductSelector" class="product-selector-popup">
        <button class="close-button" @click="toggleProductSelector">x</button>
        <ProductSelector :shopping-list-items="products" :button-type="buttonType" @select="handleSelect" @refresh-page="refreshShoppingList" />
      </div>
    </div>
    <div class="update-message">
      {{ updateMessage }}
    </div>
    <div class="item-cards" v-for="product in filteredProducts" :key="product.id">
      <FridgeItemCard :product="product" @update="onUpdate" @selection-changed="onSelectionChanged"/>
    </div>
    <div class="buttons">
      <button
        v-if="products.length > 0"
        class="fridge-button delete-button"
        @click="markAsWaste"
        v-bind:disabled="!isAnyProductSelected"
        v-bind:class="{ 'disabled-button': !isAnyProductSelected }"
      >
      Jeg har kastet dette
      </button>
      <button
        v-if="products.length > 0"
        class="fridge-button add-button"
        @click="markAsEaten"
        v-bind:disabled="!isAnyProductSelected"
        v-bind:class="{ 'disabled-button': !isAnyProductSelected }"
      >
      Jeg har spist dette
      </button>
      <div  v-if="products.length === 0" class="no-items">
        <h2 v-if="!props.fridge">Ingen utgåtte varer i kjøleskapet</h2>
        <h2 v-if="props.fridge">Ingen varer i kjøleskapet</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import SearchBar from './SearchBarComp.vue'
import { FridgeItemCardInterface } from '../components/types'
import { useUserStore } from '../stores/UserStore'
import FridgeItemCard from './FridgeItemCardComp.vue'
import ProductSelector from './ProductSelectorComp.vue'
import api from '../utils/httputils'

const props = defineProps({
  fridge: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['handle-swap', 'handle-decrement', 'refresh-page'])
const products = ref<FridgeItemCardInterface[]>([])
const selectedProducts = ref<FridgeItemCardInterface[]>([])
const userStore = useUserStore()
const updateMessage = ref('')
const searchPlaceholder = ref('Søk i kjøleskapet...')
const searchQuery = ref('')
const showProductSelector = ref(false)
const buttonType = ref(false)
const isAnyProductSelected = computed(() => selectedProducts.value.length > 0)

onMounted(() => {
  getItemsInFridge()
})

async function getItemsInFridge () {
  const path =
    props.fridge
      ? '/fridge/get'
      : '/fridge/get/expired'

  await api.get(path)
    .then(async (response) => {
      if (response.status === 200) {
        products.value = response.data
      }
    })
    .catch((error) => {
      if (error.response.status === 400) {
        updateMessage.value = error.response.data.message
      } else if (error.response.status === 600) {
        userStore.logout()
      }
    })
}

async function onUpdate (updatedProduct: FridgeItemCardInterface) {
  const path = '/fridge/edit/' + updatedProduct.id

  await api.put(path, updatedProduct)
    .then(async (response) => {
      if (response.status === 200) {
        const index = products.value.findIndex(
          (product) => product.id === updatedProduct.id
        )
        if ((checkExpirationDate(updatedProduct.expirationDate) && !props.fridge) ||
            (!checkExpirationDate(updatedProduct.expirationDate) && props.fridge)) {
          if (index !== -1) {
            products.value.splice(index, 1)
            const moved = props.fridge ? '"Utgåtte varer"' : '"Kjøleskap"'
            emit('handle-swap', props.fridge)
            updateMessage.value = `Vare flyttet til ${moved}`
          }
        } else {
          if (index !== -1) {
            products.value[index] = updatedProduct
            products.value = [...products.value]
            updateMessage.value = 'Vare redigert'
          }
        }
        setTimeout(() => {
          updateMessage.value = ''
        }, 5000)
      }
    })
    .catch((error) => {
      if (error.response.status === 400) {
        updateMessage.value = error.response.data.message
      } else if (error.response.status === 600) {
        userStore.logout()
      }
    })
}

function onSelectionChanged (event: { selected: boolean; product: FridgeItemCardInterface }) {
  if (event.selected) {
    selectedProducts.value.push(event.product)
  } else {
    selectedProducts.value = selectedProducts.value.filter((item) => item.id !== event.product.id)
  }
}

function searchProducts (query: string) {
  searchQuery.value = query
}

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  return products.value.filter((product) =>
    product.item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const toggleProductSelector = () => {
  showProductSelector.value = !showProductSelector.value
}

const handleSelect = () => {
  showProductSelector.value = false
}

function refreshShoppingList () {
  emit('refresh-page')
  getItemsInFridge()
  toggleProductSelector()
}

const checkExpirationDate = (date: string) => {
  const currentDate = normalizeDate(new Date())
  const inputDate = normalizeDate(new Date(date))
  return inputDate >= currentDate
}

const normalizeDate = (date: Date) => {
  return new Date(date.setHours(0, 0, 0, 0))
}

async function markAsEaten () {
  await axiosMarkAsEaten()
  emit('handle-decrement', props.fridge, selectedProducts.value.length)
  selectedProducts.value = []
}

async function axiosMarkAsEaten () {
  const selectedIds = selectedProducts.value.map((item) => item.id)
  const goNextAxios = ref<boolean>(false)

  const pathRemove = '/fridge/remove'
  const request = selectedIds

  await api.delete(pathRemove, { data: request })
    .then(async (response) => {
      if (response.status === 200) {
        updateMessage.value = 'Varer spist'
        products.value = products.value.filter((product) => !selectedIds.includes(product.id))
        goNextAxios.value = true

        setTimeout(() => {
          updateMessage.value = ''
        }, 5000)
      }
    })
    .catch((error) => {
      if (error.response.status === 600) {
        userStore.logout()
      } else if (error.response.status === 400) {
        updateMessage.value = error.response.data.message
      }
    })

  products.value = products.value.filter((product) => !selectedIds.includes(product.id))
  return goNextAxios
}

async function markAsWaste () {
  const selectedProductsCopy = [...selectedProducts.value]
  const goNextAxios = await axiosMarkAsEaten()

  if (!goNextAxios.value) {
    return false
  }
  const totalWeight = selectedProductsCopy.reduce(
    (sum, item) => sum + item.item.weightPerUnit * item.quantity,
    0
  )
  const wasteRequest = {
    weight: totalWeight,
    entryDate: new Date().toISOString().split('T')[0]
  }

  const pathAddWaste = '/waste/add?weight=' + totalWeight
  await api.post(pathAddWaste, wasteRequest)
    .then(async (response) => {
      if (response.status === 200) {
        updateMessage.value = 'Varer kastet'
        emit('handle-decrement', props.fridge, selectedProducts.value.length)
        selectedProducts.value = []
      }
    })
    .catch((error) => {
      if (error.response.status === 600) {
        userStore.logout()
      }
      if (error.response.status === 400) {
        updateMessage.value = error.response.data.message
      }
    })
}
</script>

<style scoped>

.search-div {
  margin-top: 10px;
  display: flex;
  width: 100%;
  max-width: 1000px;
  justify-content: center;
  align-items: center;
  justify-self: center;
  align-self: center;
}

.products-button {
  background-color: #1A7028;
  color: white;
  height: 40px;
  width: 200px;
  border-radius: 100px;
  border: none;
  margin: 0;
  padding: 0;
  z-index: 4;
  margin-left: -50px;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.product-selector-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  width: 50%;
  min-width: 300px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  max-height: 80%;
  overflow-y: auto;
}

.close-button {
  position: absolute;
  top: -15px;
  right: 0px;
  background: none;
  border: none;
  font-size: 40px;
  color: black;
  font-weight: 500;
  cursor: pointer;
}

.close-button:focus {
  outline: none;
}
.my-fridge {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#search-bar {
  text-align: center;
  justify-self: center;
  align-self: center;
  color: black;
  max-width: 1000px;
  width: 70%;
  z-index: 3;
  margin-right: 0;
  scale: 0.8;
}
.update-message {
  margin-top: 30px;
  font-size: 20px;
}

.no-items {
  margin-top: 80px;
}

.item-cards {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.add-button {
  background-color: #1A7028;
}

.add-button:hover {
  background-color: #25A13A;
}

.fridge-button {
  color: white;
  height: 40px;
  width: 200px;
  margin-top: 60px;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 100px;
  border-radius: 100px;
  border: none;
}

.fridge-button:hover {
  transform: scale(1.1);
  color: white;
  box-shadow: 0px 15px 25px -5px rgba(darken(dodgerblue, 40%));
}

.fridge-button:active {
  background-color: black;
  box-shadow: 0px 4px 8px rgba(darken(dodgerblue, 30%));
  transform: scale(.90);
}

.delete-button {
  background-color: rgb(147, 0, 0);
}

.delete-button:hover {
  background-color: rgb(179, 6, 6);
}

.disabled-button {
  background-color: #bbb;
  color: black;
  cursor: not-allowed;
  opacity: 0.6;
}

.disabled-button:hover {
  background-color: #bbb;
  color: black;
  transform: scale(1);
}

</style>

<template>
  <div class="my-fridge">
    <NewSearchBarComp :with-dropdown="false" v-if="props.fridge" id="search-bar"/>
    <div class="update-message">
      {{ updateMessage }}
    </div>
    <div class="item-cards" v-for="product in products" :key="product.id">
      <FridgeItemCardComp :product="product" @update="onUpdate" @selection-changed="onSelectionChanged"/>
    </div>
    <div class="buttons">
      <button v-if="products.length > 0" class="fridge-button" @click="markAsEaten">Jeg har spist dette</button>
      <button v-if="products.length > 0" class="fridge-button" @click="markAsWaste">Jeg har kastet dette</button>
      <div  v-if="products.length === 0" class="no-items">
        <h2 v-if="!props.fridge">Ingen utgåtte varer i kjøleskapet</h2>
        <h2 v-if="props.fridge">Ingen varer i kjøleskapet</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NewSearchBarComp from './NewSearchBarComp.vue'
import { FridgeItemCardInterface } from '../components/types'
import { useUserStore } from '../stores/UserStore'
import FridgeItemCardComp from './FridgeItemCardComp.vue'
import axios from 'axios'

const props = defineProps({
  fridge: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['handle-swap', 'handle-decrement'])
const products = ref<FridgeItemCardInterface[]>([])
const selectedProducts = ref<FridgeItemCardInterface[]>([])
const userStore = useUserStore()
const updateMessage = ref('')
const config = {
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
}

onMounted(() => {
  getItemsInFridge()
})

async function getItemsInFridge () {
  const path =
    props.fridge
      ? 'http://localhost:8080/fridge/get'
      : 'http://localhost:8080/fridge/get/expired'

  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }
  await axios.get(path, config)
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
  const path = 'http://localhost:8080/fridge/edit/' + updatedProduct.id

  await axios.put(path, updatedProduct, config)
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
  emit('handle-decrement', props.fridge)
}

async function axiosMarkAsEaten () {
  const selectedIds = selectedProducts.value.map((item) => item.id)
  const goNextAxios = ref<boolean>(false)

  const pathRemove = 'http://localhost:8080/fridge/remove'
  const request = selectedIds

  await axios.delete(pathRemove, { data: request, headers: config.headers, withCredentials: config.withCredentials })
    .then(async (response) => {
      if (response.status === 200) {
        updateMessage.value = 'Varer spist'
        products.value = products.value.filter((product) => !selectedIds.includes(product.id))
        selectedProducts.value = []
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
  selectedProducts.value = []

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

  const pathAddWaste = 'http://localhost:8080/waste/add?weight=' + totalWeight
  await axios.post(pathAddWaste, wasteRequest, { headers: config.headers, withCredentials: config.withCredentials })
    .then(async (response) => {
      if (response.status === 200) {
        updateMessage.value = 'Varer kastet'
        emit('handle-decrement', props.fridge)
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
#search-bar{
    position: relative;
    text-align: center;
    left: 25%;
    margin-top: 10px;
    color: black;
    width: 50%;
    max-width: 1000px;
    z-index: 3;
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
  margin: 0;
  margin-bottom: -40px;
}

.fridge-button {
  background-color: #1A7028;
  color: white;
  height: 40px;
  width: 200px;
  margin: 60px;
  margin-bottom: 100px;
  border-radius: 100px;
  border: none;
}

.fridge-button:hover {
  transform: scale(1.1);
  background-color: #25A13A;
  color: white;
  box-shadow: 0px 15px 25px -5px rgba(darken(dodgerblue, 40%));
}

.fridge-button:active {
  background-color: black;
  box-shadow: 0px 4px 8px rgba(darken(dodgerblue, 30%));
  transform: scale(.90);
}
</style>

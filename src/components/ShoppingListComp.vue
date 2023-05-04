<template>
  <div class="page-container">
    <div class="loading" v-if="isLoading">Laster...</div>
    <div v-else>
      <div class="shopping-list-container">
        <div class="search-div">
          <SearchBarComp id="search-bar" :search-placeholder="searchPlaceholder" @search="searchProducts"/>
          <button v-if="userStore.role === Role.PARENT" class="products-button" @click="toggleProductSelector" data-cy="allProducts">Se alle produkter</button>
          <div v-if="showProductSelector" class="popup-overlay" @click="toggleProductSelector"></div>
          <div v-if="showProductSelector" class="product-selector-popup">
            <button class="close-button" @click="toggleProductSelector">x</button>
            <ProductSelectorView :shopping-list-items="products" :button-type="buttonType" @select="handleSelect" @refresh-page="refreshShoppingList" />
          </div>
        </div>
        <div class="update-message">
          {{ updateMessage }}
        </div>
        <div class="item-cards" v-for="product in filteredProducts" :key="product.id">
          <ShoppingListItemCardComp
            :on-wishlist="false"
            :product="product"
            @update-quantity="updateProductQuantity"
            @checked="updateCheckedStatus"
            @remove-shopping-list="removeItem(product.id)"
          />
        </div>
      </div>
      <div v-if="products.length > 0" class="buttons">
        <button
          class="shopping-list-button remove-button"
          @click="removeAll"
          v-bind:disabled="!isAnyChecked || userStore.role === Role.CHILD"
          v-bind:class="{ 'disabled-button': !isAnyChecked || userStore.role === Role.CHILD}"
        >
          Fjern valgte
        </button>
        <button
          class="shopping-list-button add-button"
          @click="sendToFridge"
          v-bind:disabled="!isAnyChecked || userStore.role === Role.CHILD"
          v-bind:class="{ 'disabled-button': !isAnyChecked || userStore.role === Role.CHILD}"
        >
          Legg til i kjøleskap
        </button>
      </div>
      <div v-else class="no-items">
        <h2>Ingen varer i handleliste</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchBarComp from '../components/SearchBarComp.vue'
import { onMounted, ref, computed } from 'vue'
import { AxiosError } from 'axios'
import { ShoppingListItemCardInterface, Role } from '../components/types'
import ProductSelectorView from '../components/ProductSelectorComp.vue'
import ShoppingListItemCardComp from './ShoppingListItemCardComp.vue'
import { useUserStore } from '../stores/UserStore'
import api from '../utils/httputils'

const products = ref<ShoppingListItemCardInterface[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const searchPlaceholder = ref('Søk i handlelisten...')
const checkedProducts = ref<{ [key: number]: boolean }>({})
const updateMessage = ref('')
const userStore = useUserStore()
const showProductSelector = ref(false)
const buttonType = ref('shopping')
const emit = defineEmits(['refresh-page'])
let messageTimeout: ReturnType<typeof setTimeout> | null = null

function showUpdateMessage (newMessage: string) {
  if (messageTimeout) {
    clearTimeout(messageTimeout)
  }
  updateMessage.value = newMessage
  messageTimeout = setTimeout(() => {
    updateMessage.value = ''
  }, 5000)
}

onMounted(() => {
  loadProducts()
})

const getCheckedProducts = () => {
  return products.value.filter((product) => checkedProducts.value[product.id])
}

const isAnyChecked = computed(() => {
  return Object.values(checkedProducts.value).some(status => status === true)
})

const updateCheckedStatus = ({ product, selected }: { product: ShoppingListItemCardInterface, selected: boolean }) => {
  checkedProducts.value[product.id] = selected
}
function searchProducts (query: string) {
  searchQuery.value = query
}

const toggleProductSelector = () => {
  showProductSelector.value = !showProductSelector.value
}
const handleSelect = () => {
  showProductSelector.value = false
}

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  return products.value.filter((product) =>
    product.item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function refreshShoppingList () {
  emit('refresh-page')
  loadProducts()
  toggleProductSelector()
}

async function loadProducts () {
  const path = '/shopping-list/get'

  await api.get(path)
    .then(async (response) => {
      if (response.status === 200) {
        products.value = response.data
        isLoading.value = false
      }
    })
    .catch((error) => {
      if (error.response.status === 401) {
        userStore.logout()
      }
      showUpdateMessage(error.response.data.message)
    })
}

async function removeAll () {
  const checkedProductsData = ref<Array<number>>(getCheckedProducts().map((product) => Number(product.id)))

  const config = {
    params: {
      shoppingListItemIds: checkedProductsData.value.join(',')
    }
  }

  const path = '/shopping-list/remove'
  try {
    const response = await api.delete(path, config)
    if (response.status === 200) {
      await loadProducts()
      emit('refresh-page')
      removeCheckedProducts()
      showUpdateMessage('Varer fjernet fra liste')
      await new Promise(resolve => setTimeout(resolve, 0))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response && error.response.status === 401) {
      userStore.logout()
    }
  }
}

async function sendToFridge () {
  const checkedProductsData = getCheckedProducts().map((product) => ({
    itemId: product.item.id,
    quantity: product.quantity * product.item.baseAmount,
    expirationDate: '2023-05-20'
  }))

  const path = '/fridge/add'
  try {
    const response = await api.post(path, checkedProductsData)
    if (response.status === 200) {
      await removeAll()
      showUpdateMessage('Varer sendt til ditt kjøleskap')
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response && error.response.status === 401) {
      userStore.logout()
    }
  }
}

async function updateItem (updatedProduct: ShoppingListItemCardInterface) {
  const path = '/shopping-list/update'

  const requestBody = {
    itemId: updatedProduct.id,
    quantity: updatedProduct.quantity
  }
  const requestArray = [requestBody]

  await api.put(path, requestArray)
    .catch((error) => {
      if (error.response.status === 401) {
        userStore.logout()
      }
      updateMessage.value = error.response.data
    })
}

function updateProductQuantity (updatedProduct: ShoppingListItemCardInterface) {
  const productIndex = products.value.findIndex(
    (product) => product.id === updatedProduct.id
  )

  if (productIndex !== -1) {
    products.value[productIndex].quantity = updatedProduct.quantity
    updateItem(updatedProduct)
  }
}

function removeCheckedProducts () {
  products.value = products.value.filter((product) => !checkedProducts.value[product.id])
  checkedProducts.value = {}
}

async function removeItem (itemId: number) {
  const config = {
    params: {
      shoppingListItemIds: itemId
    }
  }

  const path = '/shopping-list/remove'
  try {
    const response = await api.delete(path, config)
    if (response.status === 200) {
      await loadProducts()
      emit('refresh-page')
      showUpdateMessage('Vare fjernet fra liste')
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response && error.response.status === 401) {
      userStore.logout()
    }
  }
}

</script>

<style scoped>

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
  background-color: rgb(224, 224, 224);
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  max-width: 1500px;
  width: 80%;
  min-width: 300px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  height: 80%;
  overflow-y: scroll;
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

.page-container {
  display: flex;
  flex-direction: column;
}

.shopping-list-container {
  justify-content: center;
  align-content: center;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.no-items {
  margin-top: 80px;
}

.loading {
  width: 100%;
  position: absolute;
  top: 50%;
  font-size: 30px;
}

.item-cards {
  display: flex;
  align-self: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.update-message {
  margin-top: 30px;
  font-size: 20px;
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
.shopping-list-button {
  background-color: #1A7028;
  color: white;
  height: 40px;
  width: 200px;
  margin-top: 60px;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 100px;
  border-radius: 100px;
  align-self: center;
  border: none;
}

.shopping-list-button:hover {
  transform: scale(1.1);
  background-color: #25A13A;
  color: white;
  box-shadow: 0px 15px 25px -5px rgba(darken(dodgerblue, 40%));
}

.shopping-list-button:active {
  background-color: black;
  box-shadow: 0px 4px 8px rgba(darken(dodgerblue, 30%));
  transform: scale(.90);
}

.remove-button {
  background-color: rgb(147, 0, 0);
}

.remove-button:hover {
  background-color: rgb(179, 6, 6);
}

.add-button {
  background-color: #1A7028;
}

.add-button:hover {
  background-color: #25A13A;
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

@media only screen and (max-width: 800px) {
  .search-div {
    flex-direction: column;
    justify-content: center;
  }
  #search-bar {
    width: 400px;
  }
  .products-button {
    margin: 0;
    margin-top: 10px;
  }
}

@media only screen and (max-width: 600px) {
  .shopping-list-button {
    margin-top: 20px;
    margin-bottom: 0px;
  }
  .buttons {
    display: flex;
    flex-direction: column;
    margin-bottom: 50px;
  }
  .item-cards {
    width: 80%;
    min-width: 280px;
  }
}

@media only screen and (max-width: 360px) {
  #search-bar {
    width: 100%;
  }
  .product-selector-popup {
    width: 270px;
    max-width: 270px;
    min-width: 270px;
  }
}
</style>

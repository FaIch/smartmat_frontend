<template>
  <div class="page-container">
    <div class="loading" v-if="isLoading">Loading...</div>
    <div v-else>
      <ProductSelectorButton />
      <div class="shopping-list-container">
        <SearchBarComp id="search-bar" :search-placeholder="searchPlaceholder" @search="searchProducts"/>
        <div class="update-message">
          {{ updateMessage }}
        </div>
        <div class="item-cards" v-for="product in filteredProducts" :key="product.id">
          <NewShoppingListItemCardComp
            :product="product"
            @update-quantity="updateProductQuantity"
            @checked="updateCheckedStatus"
          />
        </div>
      </div>
      <div class="buttons">
        <button class="shopping-list-button remove-button" @click="removeAll" v-bind:disabled="!isAnyChecked" v-bind:class="{ 'disabled-button': !isAnyChecked }">Fjern valgte</button>
        <button class="shopping-list-button add-button" @click="sendToFridge" v-bind:disabled="!isAnyChecked" v-bind:class="{ 'disabled-button': !isAnyChecked }">Legg til i kjøleskap</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchBarComp from '../components/SearchBarComp.vue'
import { onMounted, ref, computed } from 'vue'
import axios, { AxiosError } from 'axios'
import { ShoppingListItemCardInterface } from '../components/types'
import ProductSelectorButton from '../components/ProductSelectorButton.vue'
import NewShoppingListItemCardComp from '../components/NewShoppingListItemCardComp.vue'
import { useUserStore } from '../stores/UserStore'

const products = ref<ShoppingListItemCardInterface[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const searchPlaceholder = ref('Søk i handlelisten...')
const checkedProducts = ref<{ [key: number]: boolean }>({})
const updateMessage = ref('')
const userStore = useUserStore()

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

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  return products.value.filter((product) =>
    product.item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

async function loadProducts () {
  const config = {
    headers: {
      'Content-type': 'application/json'
    },
    withCredentials: true
  }

  isLoading.value = true
  const path = 'http://localhost:8080/shopping-list/get'
  await axios.get(path, config)
    .then(async (response) => {
      if (response.status === 200) {
        products.value = response.data
        isLoading.value = false
      }
    })
    .catch((error) => {
      if (error.response.status === 600) {
        userStore.logout()
      }
      updateMessage.value = error.response.data.message
    })
  setTimeout(() => {
    updateMessage.value = ''
  }, 5000)
}

async function removeAll () {
  const checkedProductsData = ref<Array<number>>(getCheckedProducts().map((product) => Number(product.id)))

  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true,
    params: {
      shoppingListItemIds: checkedProductsData.value.join(',')
    }
  }

  const path = 'http://localhost:8080/shopping-list/remove'
  try {
    const response = await axios.delete(path, config)
    if (response.status === 200) {
      await loadProducts()
      updateMessage.value = 'Varer fjernet fra liste'
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response && error.response.status === 600) {
      userStore.logout()
    }
  }
}

async function sendToFridge () {
  const checkedProductsData = getCheckedProducts().map((product) => ({
    itemId: product.item.id,
    quantity: product.quantity * product.item.baseAmount,
    expirationDate: '2023-05-01'
  }))
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }

  const path = 'http://localhost:8080/fridge/add'
  try {
    const response = await axios.post(path, checkedProductsData, config)
    if (response.status === 200) {
      await removeAll()
      updateMessage.value = 'Varer sendt til ditt kjøleskap'
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response && error.response.status === 600) {
      userStore.logout()
    }
  }
}

async function updateItem (updatedProduct: ShoppingListItemCardInterface) {
  const path = 'http://localhost:8080/shopping-list/update'
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }

  const requestBody = {
    itemId: updatedProduct.id,
    quantity: updatedProduct.quantity
  }

  await axios.put(path, requestBody, config)
    .catch((error) => {
      if (error.response.status === 600) {
        userStore.logout()
      }
      updateMessage.value = error.response.data
    })
  setTimeout(() => {
    updateMessage.value = ''
  }, 5000)
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
</script>

<style scoped>

.page-container {
  display: flex;
  flex-direction: column;
  padding-top: 75px;
  min-height: 100vh;
  height: 100%;
}
.shopping-list-container {
  justify-content: center;
  align-content: center;
  padding-top: 5vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.loading {
  width: 100%;
  position: absolute;
  top: 50%;
  font-size: 30px;
}

.item-cards {
  display: flex;
  justify-content: center;
  margin: 0;
  margin-bottom: -40px;
}

.update-message {
  margin-top: 30px;
  font-size: 20px;
}

#search-bar{
  text-align: center;
  justify-self: center;
  align-self: center;
  margin-top: 10px;
  color: black;
  width: 50%;
  max-width: 1000px;
  z-index: 3;
  scale: 0.8;
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

</style>

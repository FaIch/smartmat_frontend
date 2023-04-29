<template>
  <div class="navbar"></div>
  <ProductSelectorButton />
  <div class="container">
    <div v-if="isLoading">Loading...</div>
    <div class="product-container" v-else>
      <button @click="sendToFridge">Send to fridge</button>
      <button @click="removeAll">Remove Selected</button>
      <SearchBarComp :with-dropdown="false" @search="searchProducts"/>
      <div class="product-table" v-for="product in filteredProducts" :key="product.id">
        <ShoppingListItemCardComp
        :product="product"
        :checked="checkedProducts[product.id] || false"
        @checked-changed="updateCheckedStatus(product.id, $event)"
        v-on:remove="removeProduct(product)"/>
      </div>
    </div>
    <SuggestedProducts
    :checkedProducts="checkedProducts"
    @add-to-shopping-list="addSuggestedProductToShoppingList"
  />
  </div>
</template>

<script setup lang="ts">
import SearchBarComp from '../components/SearchBarComp.vue'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import axios from 'axios'
import ShoppingListItemCardComp from '../components/ShoppingListItemCardComp.vue'
import { ShoppingListItemCardInterface } from '../components/types'
import { useUserStore } from '../stores/UserStore'
import { useUtilityStore } from '../stores/UtilityStore'
import ProductSelectorButton from '../components/ProductSelectorButton.vue'
import SuggestedProducts from '../components/SuggestedProducts.vue'

const products = ref<ShoppingListItemCardInterface[]>([])
const isLoading = ref(true)
const utilityStore = useUtilityStore()
const userStore = useUserStore()
const searchQuery = ref('')

const checkedProducts = ref<{ [key: number]: boolean }>({})
const updateCheckedStatus = (id: number, checked: boolean) => {
  checkedProducts.value[id] = checked
}
const getCheckedProducts = () => {
  return products.value.filter((product) => checkedProducts.value[product.id])
}

function searchProducts (query: string) {
  searchQuery.value = query
}

const addSuggestedProductToShoppingList = (product: ShoppingListItemCardInterface) => {
  if (!products.value.find((p) => p.id === product.id)) {
    products.value.push(product)
    updateCheckedStatus(product.id, false)
  }
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

  console.log(userStore.loggedIn)

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
      if (error.response.status === 400) {
        console.error(error)
      }
    })
}

const removeProduct = async (product: ShoppingListItemCardInterface) => {
  const config = {
    headers: {
      'Response-type': 'application/json'
    },
    withCredentials: true
  }
  const path = `http://localhost:8080/shopping-list/remove?=${product.id}`
  axios.delete(path, config)
    .then(async (response) => {
      if (response.status === 200) {
        products.value = products.value.filter(p => p.id !== product.id)
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

const removeAll = async () => {
  const checkedProductsData = ref<Array<number>>(getCheckedProducts().map((product) => Number(product.id)))
  console.log(checkedProductsData)

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
      console.log('Checked products data sent successfully:', response.data)
      loadProducts()
    }
  } catch (error) {
    console.error('Error sending checked products data:', error)
  }
}

const sendToFridge = async () => {
  const checkedProductsData = getCheckedProducts().map((product) => ({
    itemId: product.item.id,
    quantity: product.quantity * product.item.baseAmount,
    expirationDate: '2023-05-01'
  }))

  console.log(checkedProductsData)

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
      console.log('Checked products data sent successfully:', response.data)
      removeAll()
    }
  } catch (error) {
    console.error('Error sending checked products data:', error)
  }
}

onMounted(() => {
  utilityStore.setTransparentStatus(false)
  loadProducts()
  userStore.loggedIn = true
})

onUnmounted(() => {
  products.value = []
})

</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-content: center;
  padding-top: 5vh;
  height: 100vh;
  background-color: white;
}

.product-container{
  min-width: 700px;
}

.product-table {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
}

Button {
  background-color: #1A7028;
  color: white;
  height: 40px;
  width: 200px;
  margin: 20px;
  border-radius: 100px;
  border: none;
}

Button:hover {
  transform: scale(1.1);
  background-color: #25A13A;
  color: white;
  box-shadow: 0px 15px 25px -5px rgba(darken(dodgerblue, 40%));
}

Button:active {
  background-color: black;
  box-shadow: 0px 4px 8px rgba(darken(dodgerblue, 30%));
  transform: scale(.90);
}

.navbar {
  height: 15vh;
}

.product-table {
  margin-top: 0;
}

</style>

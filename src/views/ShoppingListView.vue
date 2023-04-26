<template>
  <div class="container">
    <h1>Product List</h1>
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <ProductSelectorButton></ProductSelectorButton>
      <button @click="sendToFridge">Send to fridge</button>
      <button @click="showAddForm = true">Add Item</button>
      <button @click="removeAll">Remove Selected</button>
      <div v-if="showAddForm">
        <input type="number" v-model="newItem.quantity" placeholder="Quantity" />
        <input type="number" v-model="newItem.id" placeholder="Id" />
        <button @click="addItem">Add</button>
      </div>
      <SearchBarComp id="search-bar" />
      <div class="product-table" v-for="product in products" :key="product.id">
        <ShoppingListItemCardComp
        :product="product"
        :checked="checkedProducts[product.id] || false"
        @checked-changed="updateCheckedStatus(product.id, $event)"
        v-on:remove="removeProduct(product)"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchBarComp from '../components/SearchBarComp.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import axios from 'axios'
import ShoppingListItemCardComp from '../components/ShoppingListItemCardComp.vue'
import { ShoppingListItemCardInterface } from '../components/types'
import { useUserStore } from '../stores/UserStore'
import { useUtilityStore } from '../stores/UtilityStore'
import ProductSelectorButton from '../components/ProductSelectorButton.vue'

const products = ref<ShoppingListItemCardInterface[]>([])
const isLoading = ref(true)
const showAddForm = ref(false)
const newItem = ref({ id: 0, quantity: 0 })
const utilityStore = useUtilityStore()
const userStore = useUserStore()

const checkedProducts = ref<{ [key: number]: boolean }>({})
const updateCheckedStatus = (id: number, checked: boolean) => {
  checkedProducts.value[id] = checked
}
const getCheckedProducts = () => {
  return products.value.filter((product) => checkedProducts.value[product.id])
}

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

async function addItem () {
  const config = {
    headers: {
      'Response-type': 'application/json'
    },
    withCredentials: true
  }
  const data = {
    itemId: newItem.value.id,
    quantity: newItem.value.quantity
  }
  const path = 'http://localhost:8080/shopping-list/add'
  await axios.post(path, data, config)
    .then(async (response) => {
      if (response.status === 200) {
        console.log(response.data)
        products.value.push(response.data)
        newItem.value = { id: 0, quantity: 0 }
        showAddForm.value = false
        loadProducts()
      }
    })
    .catch((error) => {
      console.error(error)
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
    quantity: product.quantity,
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

<style>
.container {
  display: flex;
  justify-content: center;
  padding-top: 15vh;
  height: 100vh;
  background-color: white;
}

.product-table {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
}

</style>

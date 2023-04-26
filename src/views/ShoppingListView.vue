<template>
  <div class="container">
    <h1>Product List</h1>
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <button @click="showAddForm = true">Add Item</button>
      <div v-if="showAddForm">
        <input type="number" v-model="newItem.quantity" placeholder="Quantity" />
        <input type="number" v-model="newItem.id" placeholder="Id" />
        <button @click="addItem">Add</button>
      </div>
      <SearchBarComp id="search-bar" />
      <div class="product-table" v-for="product in products" :key="product.id">
        <ShoppingListItemCardComp :product="product" v-on:remove="removeProduct(product)"/>
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

const products = ref<ShoppingListItemCardInterface[]>([])
const isLoading = ref(true)
const showAddForm = ref(false)
const newItem = ref({ id: 0, quantity: 0 })
const utilityStore = useUtilityStore()
const userStore = useUserStore()

async function loadProducts () {
  const config = {
    headers: {
      'Content-type': 'application/json'
    },
    withCredentials: true
  }

  console.log(userStore.loggedIn)

  isLoading.value = true
  const path = 'http://localhost:8080/user/shopping-list/get'
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
    withCredentials: true,
    params: {
      id: newItem.value.id,
      quantity: newItem.value.quantity
    }
  }
  const path = 'http://localhost:8080/shopping-list/add'
  axios.post(path, null, config)
    .then(async (response) => {
      if (response.status === 200) {
        products.value.push(response.data)
        newItem.value = { id: 0, quantity: 0 }
        showAddForm.value = false
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

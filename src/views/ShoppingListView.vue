<template>
    <div>
      <h1>Product List</h1>
      <div v-if="isLoading">Loading...</div>
        <div v-else>
          <SearchBarComp id="search-bar"/>
          <div class="product-table" v-for="product in products" :key="product.id">
            <ShoppingListItemCardComp :product="product" />
          </div>
        </div>
    </div>
  </template>

<script setup lang="ts">
import SearchBarComp from '../components/SearchBarComp.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import axios from 'axios'
import ShoppingListItemCardComp from '../components/ShoppingListItemCardComp.vue'
import { ShoppingListItemCardInterface } from '@/components/types'
import { useUserStore } from '../stores/UserStore'

// import { useUtilityStore } from '../stores/UtilityStore'

// const navbarStore = useUtilityStore()

const userStore = useUserStore()
const products = ref<ShoppingListItemCardInterface[]>([])
const isLoading = ref(true)

const loadProducts = async () => {
  const config = {
    headers: {
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + userStore.token,
      'Response-type': 'application/json'
    }
  }

  isLoading.value = true
  console.log(userStore.token)
  const path = 'http://localhost:8080/user/shopping-list-items'
  axios.get(path, config)
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

// const removeProduct = () => {
//   // Emit a custom event to the parent component to remove the product
//   props.onRemove(product.id);
// }

onMounted(() => {
  // navbarStore.setTransparentStatus(false)
  // navbarStore.showItems = false
  loadProducts()
})

onUnmounted(() => {
// navbarStore.showItems = true
})

</script>

<style>

.product-table {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
}
</style>

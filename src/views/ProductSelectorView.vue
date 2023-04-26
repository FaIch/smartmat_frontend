<template>
    <div class="product-selector-view">
      <h1>Select a Product</h1>
      <Button @click="addToFridge">Add to fridge</Button>
      <Button @click="addToShoppingList">Add to shopping list</Button>
      <ProductGrid :searchQuery="searchQuery" @update-selected-products="updateSelectedProducts"/>
    </div>
  </template>

<script setup lang="ts">
import axios from 'axios'
import ProductGrid from '../components/ProductGrid.vue'
import { ref } from 'vue'

const searchQuery = ref('')
const selectedProductsInParent = ref<number[]>([])

const addToFridge = async () => {
  const checkedProductsData = selectedProductsInParent.value.map((value) => ({
    itemId: value,
    quantity: 1,
    expirationDate: '2023-05-01'
  }))

  console.log(checkedProductsData)

  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }

  const path = 'http://localhost:8080/fridge/add-list'
  try {
    const response = await axios.post(path, checkedProductsData, config)
    if (response.status === 200) {
      console.log('Checked products data sent successfully:', response.data)
      selectedProductsInParent.value = []
    }
  } catch (error) {
    console.error('Error sending checked products data:', error)
  }
}

function updateSelectedProducts (updatedList: number[]) {
  // Use the updatedList to update the parent's state
  // For example, if you have a ref for selected products in the parent component:
  selectedProductsInParent.value = updatedList
}

const addToShoppingList = async () => {
  const checkedProductsData = selectedProductsInParent.value.map((value) => ({
    itemId: value,
    quantity: 1
  }))

  console.log(checkedProductsData)

  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }

  const path = 'http://localhost:8080/shopping-list/add-list'
  try {
    const response = await axios.post(path, checkedProductsData, config)
    if (response.status === 200) {
      console.log('Checked products data sent successfully:', response.data)
      selectedProductsInParent.value = []
    }
  } catch (error) {
    console.error('Error sending checked products data:', error)
  }
}

</script>

  <style scoped>
  .product-selector-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
  }

  h1 {
    margin-bottom: 1.5rem;
  }
  </style>

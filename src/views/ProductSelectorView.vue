<template>
    <div class="product-selector-view">
      <h2>Selected ({{ numberSelected }})</h2>
      <div class="button-container">
      <Button @click="addToFridge">Add to fridge</Button>
      <Button @click="addToShoppingList">Add to shopping list</Button>
      </div>
      <ProductGrid :searchQuery="searchQuery" @update-selected-products="updateSelectedProducts"/>
    </div>
  </template>

<script setup lang="ts">
import axios from 'axios'
import ProductGrid from '../components/ProductGrid.vue'
import { ref } from 'vue'
import { ItemInterface } from '../components/types'

const searchQuery = ref('')
const selectedProductsInParent = ref<ItemInterface[]>([])
const numberSelected = ref(0)

const addToFridge = async () => {
  const checkedProductsData = selectedProductsInParent.value.map((value) => ({
    itemId: value.id,
    quantity: value.baseAmount,
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
      selectedProductsInParent.value = []
    }
  } catch (error) {
    console.error('Error sending checked products data:', error)
  }
}

function updateSelectedProducts (updatedList: ItemInterface[]) {
  // Use the updatedList to update the parent's state
  // For example, if you have a ref for selected products in the parent component:
  selectedProductsInParent.value = updatedList
  numberSelected.value = selectedProductsInParent.value.length
}

const addToShoppingList = async () => {
  const checkedProductsData = selectedProductsInParent.value.map((value) => ({
    itemId: value.id,
    quantity: 1
  }))

  console.log(checkedProductsData)

  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }

  const path = 'http://localhost:8080/shopping-list/add'
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
    margin-top: 2vh;
    padding: 2rem;
    background-color: white;
    border-style: solid;
  }

  h1 {
    margin-bottom: 1.5rem;
  }

  h2 {
    color: black;
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

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
  </style>

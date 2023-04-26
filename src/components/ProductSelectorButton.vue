<template>
    <div id="app">
      <PlusButton @click="openProductSelector" />
      <div v-if="showProductSelector" class="product-selector-popup">
        <ProductSelectorView @select="handleSelect" />
      </div>
      <!-- Add the rest of your application's components here -->
    </div>
  </template>

<script setup lang="ts">
import PlusButton from '../components/PlusButton.vue'
import ProductSelectorView from '../views/ProductSelectorView.vue'
import { ref } from 'vue'

const showProductSelector = ref(false)

const openProductSelector = () => {
  showProductSelector.value = true
}

const handleSelect = (productId: number) => {
  console.log('Selected product ID:', productId)
  // Handle the selected product ID here, e.g., close the popup
  showProductSelector.value = false
}
</script>

  <style>
  /* Add your global styles here */
  .product-selector-popup {
    position: fixed;
    margin-top: 400px;
    top: 0;
    left: 0;
    width: 60%;
    height: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  </style>

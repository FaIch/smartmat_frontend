<template>
    <div class="product-selector-view">
      <h1>Select a Product</h1>
      <SearchBarComp @search="searchProducts" />
      <ProductGrid @select="handleSelect" :searchQuery="searchQuery" />
    </div>
  </template>

<script setup lang="ts">
import SearchBarComp from '../components/SearchBarComp.vue'
import ProductGrid from '../components/ProductGrid.vue'
import { ref } from 'vue'

const searchQuery = ref('')

const searchProducts = (query: string) => {
  searchQuery.value = query
}

const handleSelect = (productId: number) => {
  console.log('Selected product ID:', productId)
  // Handle the selected product ID here, e.g., emit the event to the parent component
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

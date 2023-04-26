<template>
  <div id="app">
    <div class="plus-button-container">
      <PlusButton @click="toggleProductSelector" />
      <div v-if="showProductSelector" class="product-selector-popup">
        <ProductSelectorView @select="handleSelect" />
      </div>
    </div>
    <!-- Add the rest of your application's components here -->
  </div>
</template>

<script setup lang="ts">
import PlusButton from '../components/PlusButton.vue'
import ProductSelectorView from '../views/ProductSelectorView.vue'
import { ref } from 'vue'

const showProductSelector = ref(false)

const toggleProductSelector = () => {
  showProductSelector.value = !showProductSelector.value
  console.log(showProductSelector.value)
}

const handleSelect = (productId: number) => {
  // Handle the selected product ID here, e.g., close the popup
  showProductSelector.value = false
}
</script>

<style>
/* Add your global styles here */
.plus-button-container {
  position: relative;
  background-color: white;
}

.product-selector-popup {
  position: absolute;
  top: 100%; /* Set the top to 100% to position the popup right below the PlusButton */
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 80%;
  z-index: 1000;
  background-color: white;
}

.ProductSelectorView {
  width: 100%;
  height: 100%;
}
</style>

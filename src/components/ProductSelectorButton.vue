<template>
  <button class="products-button" @click="toggleProductSelector">Se alle produkter</button>
  <div v-if="showProductSelector" class="product-selector-popup">
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showProductSelector = ref(false)

const toggleProductSelector = () => {
  showProductSelector.value = !showProductSelector.value
  console.log(showProductSelector.value)
}
// eslint-disable-next-line
const handleSelect = (productId: number) => {
  // Handle the selected product ID here, e.g., close the popup
  showProductSelector.value = false
}
</script>

<style scoped>

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

.products-button {
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

.products-button:hover {
  transform: scale(1.1);
  background-color: #25A13A;
  color: white;
  box-shadow: 0px 15px 25px -5px rgba(darken(dodgerblue, 40%));
}

.products-button:active {
  background-color: black;
  box-shadow: 0px 4px 8px rgba(darken(dodgerblue, 30%));
  transform: scale(.90);
}
</style>

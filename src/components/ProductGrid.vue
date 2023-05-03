<template>
  <div class="product-grid-container">
    <SearchBarComp id="search-bar" :search-placeholder="searchPlaceholder" @search="searchProducts" />
    <div class="grid-container">
      <div
        v-for="product in displayedProducts"
        :key="product.id"
        class="grid-item"
        @click="toggleProductSelection(product)"
        :class="{ selected: selectedProducts.includes(product) }"
      >
        <img :src="product.image" :alt="product.name" />
        <div>{{ product.name }}</div>
      </div>
    </div>
    <div class="pagination">
      <button class="page-button" @click="previousPage" :disabled="currentPage === 1">Previous</button>
      <span>Side {{ currentPage }} of {{ totalPages }}</span>
      <button class="page-button" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios, { AxiosError } from 'axios'
import SearchBarComp from './SearchBarComp.vue'
import { ItemInterface } from './types'
import { useUserStore } from '../stores/UserStore'

const userStore = useUserStore()
const products = ref<ItemInterface[]>([])
const searchQuery = ref('')
const itemsPerPage = 20
const currentPage = ref(1)
const searchPlaceholder = ref('Søk etter varer...')
const selectedProducts = ref<ItemInterface[]>([])
const emits = defineEmits(['update-selected-products'])

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  return products.value.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const displayedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredProducts.value.slice(startIndex, endIndex)
})

function toggleProductSelection (product: ItemInterface) {
  const index = selectedProducts.value.indexOf(product)
  if (index >= 0) {
    selectedProducts.value.splice(index, 1)
  } else {
    selectedProducts.value.push(product)
  }
  emits('update-selected-products', selectedProducts.value)
}

async function fetchProducts () {
  const config = {
    headers: {
      'Content-type': 'application/json'
    },
    withCredentials: true
  }
  try {
    const response = await axios.get('http://localhost:8080/items/list', config)
    if (response.status === 200) {
      products.value = response.data
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response && error.response.status === 401) {
      userStore.logout()
    }
  }
}

function nextPage () {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function previousPage () {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function searchProducts (query: string) {
  searchQuery.value = query
  currentPage.value = 1
}

onMounted(fetchProducts)
</script>

<style scoped>

#search-bar{
  text-align: center;
  justify-self: center;
  align-self: center;
  margin-top: 10px;
  margin-bottom: 20px;
  color: black;
  width: 100%;
  max-width: 1000px;
  z-index: 3;
  scale: 0.8;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 16px;
  margin-bottom: 16px;
  min-width: 300px;
}

.product-grid-container {
  min-width: 300px;
  width: 100%;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-self: center;
  height: 250px;
  width: 250px;
  cursor: pointer;
  padding: 16px;
  border: 3px solid #ccc;
  border-radius: 8px;
  transition: background-color 0.2s;
  font-size: 18px;
  font-weight: bold;
}

.grid-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.grid-item img {
  max-width: 90%;
  max-height: 90%;
  object-fit: cover;
  margin: auto;
  padding: 0.5em;
  border-radius: 0.7em;
}

.grid-item.selected {
  background-color: rgba(35, 173, 58, 0.6);
}

.page-button {
  background-color: #1A7028;
  color: white;
  height: 40px;
  width: 200px;
  margin: 20px;
  border-radius: 100px;
  border: none;
}

.page-button:hover {
  transform: scale(1.1);
  background-color: #25A13A;
  color: white;
  box-shadow: 0px 15px 25px -5px rgba(darken(dodgerblue, 40%));
}

.page-button:active {
  background-color: black;
  box-shadow: 0px 4px 8px rgba(darken(dodgerblue, 30%));
  transform: scale(.90);
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

</style>

<template>
    <div>
      <SearchBarComp :search-placeholder="searchPlaceholder" @search="searchProducts" />
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
        <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import SearchBarComp from './SearchBarComp.vue'
import { ItemInterface } from './types'

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
  // Emit the updated selectedProducts array to the parent component
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
  } catch (error) {
    console.error('Error fetching products:', error)
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
  .grid-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 16px;
    margin-bottom: 16px;
  }

  .grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 250px; /* Set a fixed height for the grid item */
  cursor: pointer;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: background-color 0.2s;
}

  .grid-item:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .grid-item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  margin: auto;
  padding: 0.5em;
  border-radius: 0.7em;
}

.grid-item.selected {
    background-color: rgba(144, 238, 144, 0.3);
  }

  </style>

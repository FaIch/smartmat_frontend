<template>
  <div class="product-selector-view">
    <h2>Selected ({{ numberSelected }})</h2>
    <div class="button-container">
      <button class="selector-button" v-if="!props.buttonType" @click="addToFridge">Legg til i kjøleskap</button>
      <button class="selector-button" v-else @click="addToShoppingList" data-cy="addShopping">Legg til i handleliste</button>
    </div>
    <ProductGrid :searchQuery="searchQuery" @update-selected-products="updateSelectedProducts"/>
  </div>
</template>

<script setup lang="ts">
import axios, { AxiosError } from 'axios'
import { useUserStore } from '../stores/UserStore'
import ProductGrid from './ProductGrid.vue'
import { ref } from 'vue'
import { ItemInterface, ShoppingListItemCardInterface } from './types'

const userStore = useUserStore()
const searchQuery = ref('')
const selectedProductsInParent = ref<ItemInterface[]>([])
const numberSelected = ref(0)
const emit = defineEmits(['refresh-page'])
const props = defineProps({
  buttonType: {
    type: Boolean,
    required: true
  },
  shoppingListItems: {
    type: Array as () => ShoppingListItemCardInterface[],
    default: () => []
  }
})

const addToFridge = async () => {
  const checkedProductsData = selectedProductsInParent.value.map((value) => ({
    itemId: value.id,
    quantity: value.baseAmount,
    expirationDate: '2023-05-20'
  }))

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
      selectedProductsInParent.value = []
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response && error.response.status === 600) {
      userStore.logout()
    }
  }
  emit('refresh-page')
}

function updateSelectedProducts (updatedList: ItemInterface[]) {
  selectedProductsInParent.value = updatedList
  numberSelected.value = selectedProductsInParent.value.length
}

const addToShoppingList = async () => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }

  const updateList = []
  const addList = []

  for (const product of selectedProductsInParent.value) {
    const existingItem = props.shoppingListItems.find(item => item.item.id === product.id)
    if (existingItem) {
      updateList.push({
        itemId: existingItem.id,
        quantity: existingItem.quantity + 1
      })
    } else {
      addList.push({
        itemId: product.id,
        quantity: 1
      })
    }
  }
  if (addList.length > 0) {
    try {
      await axios.post('http://localhost:8080/shopping-list/add', addList, config)
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response && error.response.status === 600) {
        userStore.logout()
      }
    }
  }

  if (updateList.length > 0) {
    try {
      await axios.put('http://localhost:8080/shopping-list/update', updateList, config)
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response && error.response.status === 600) {
        userStore.logout()
      }
    }
  }
  selectedProductsInParent.value = []
  emit('refresh-page')
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
}

h1 {
  margin-bottom: 1.5rem;
}

h2 {
  color: black;
}

.selector-button {
  background-color: #1A7028;
  color: white;
  height: 40px;
  width: 200px;
  margin: 20px;
  border-radius: 100px;
  border: none;
}

.selector-button:hover {
  transform: scale(1.1);
  background-color: #25A13A;
  color: white;
  box-shadow: 0px 15px 25px -5px rgba(darken(dodgerblue, 40%));
}

.selector-button:active {
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

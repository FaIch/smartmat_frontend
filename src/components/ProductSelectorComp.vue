<template>
  <div class="product-selector-view">
    <h2>Selected ({{ numberSelected }})</h2>
    <div class="button-container">
      <button class="selector-button" v-if="!props.buttonType" @click="addToFridge">Legg til i kjøleskap</button>
      <button class="selector-button" v-else @click="addToShoppingList" data-cy="addShopping">{{ addToShoppingListButtonText }}</button>
    </div>
    <ProductGrid :searchQuery="searchQuery" @update-selected-products="updateSelectedProducts"/>
  </div>
</template>

<script setup lang="ts">
import axios, { AxiosError } from 'axios'
import { useUserStore } from '../stores/UserStore'
import ProductGrid from './ProductGrid.vue'
import { ref, computed } from 'vue'
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
  },
  wishList: {
    type: Boolean,
    required: true
  }
})

const addToShoppingListButtonText = computed(() => {
  return props.wishList ? 'Legg til i ønskeliste' : 'Legg til i handleliste'
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
    if (error instanceof AxiosError && error.response && error.response.status === 401) {
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

  const updateShoppingList = []
  const addShoppingList = []
  const updateWishlist = []
  const addWishlist = []
  for (const product of selectedProductsInParent.value) {
    const existingItem = props.shoppingListItems.find(item => item.item.id === product.id)
    // TODO: FIX
    const a = 2
    if (existingItem && a === 2) {
      console.log('test1')
      updateWishlist.push({
        itemId: existingItem.id,
        quantity: existingItem.quantity + 1
      })
    } else if (existingItem) {
      console.log('test2')
      updateShoppingList.push({
        itemId: existingItem.id,
        quantity: existingItem.quantity + 1
      })
    } else if (props.wishList) {
      console.log('test3')
      addShoppingList.push({
        itemId: product.id,
        quantity: 1
      })
    } else {
      console.log('test4')
      addWishlist.push({
        itemId: product.id,
        quantity: 1
      })
    }
  }
  if (addShoppingList.length > 0 || addWishlist.length > 0) {
    try {
      const path =
        props.wishList
          ? 'http://localhost:8080/shopping-list/add/wished'
          : 'http://localhost:8080/shopping-list/add'
      const data = props.wishList ? addWishlist : addShoppingList
      console.log('addTo', path, data)
      await axios.post(path, data, config)
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response && error.response.status === 401) {
        userStore.logout()
      }
    }
  }

  if (updateShoppingList.length > 0 || updateWishlist.length > 0) {
    try {
      const data = props.wishList ? addWishlist : addShoppingList
      console.log('updateItem', data)
      await axios.put('http://localhost:8080/shopping-list/update', data, config)
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response && error.response.status === 401) {
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

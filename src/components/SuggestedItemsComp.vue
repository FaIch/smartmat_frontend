<template>
  <div class="page-container">
    <div class="loading" v-if="isLoading">Loading...</div>
    <div v-else>
      <div class="shopping-list-container">
        <div class="update-message">
          {{ updateMessage }}
        </div>
        <div class="item-cards" v-for="product in products" :key="product.id">
          <SuggestedItemCardComp
            :product="product"
            @checked="updateCheckedStatus"
          />
        </div>
      </div>
      <div v-if="products.length > 0" class="buttons">
        <button class="shopping-list-button add-button" @click="sendToShoppingList"  v-bind:disabled="!isAnyChecked" v-bind:class="{ 'disabled-button': !isAnyChecked }">Legg til i handleliste</button>
      </div>
      <div v-else class="no-items">
        <h2>Ingen flere foreslåtte varer.</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import axios from 'axios'
import { ItemInterface } from '../components/types'
import SuggestedItemCardComp from '../components/SuggestedItemCardComp.vue'
import { useUserStore } from '../stores/UserStore'

const products = ref<ItemInterface[]>([])
const isLoading = ref(true)
const checkedProducts = ref<{ [key: number]: boolean }>({})
const updateMessage = ref('')
const userStore = useUserStore()
const emit = defineEmits(['refresh-page'])
onMounted(() => {
  loadProducts()
})

const getCheckedProducts = () => {
  return products.value.filter((product) => checkedProducts.value[product.id])
}

const isAnyChecked = computed(() => {
  return Object.values(checkedProducts.value).some(status => status === true)
})

const updateCheckedStatus = ({ product, selected }: { product: ItemInterface, selected: boolean }) => {
  checkedProducts.value[product.id] = selected
}

async function loadProducts () {
  const path = 'http://localhost:8080/shopping-list/get/suggestions'
  const config = {
    headers: {
      'Content-type': 'application/json'
    },
    withCredentials: true
  }

  isLoading.value = true
  if (path == null) {
    return
  }
  await axios.get(path, config)
    .then(async (response) => {
      if (response.status === 200) {
        products.value = response.data
        isLoading.value = false
      }
    })
    .catch((error) => {
      if (error.response.status === 401) {
        userStore.logout()
      }
      updateMessage.value = error.response.data.message
    })
  setTimeout(() => {
    updateMessage.value = ''
  }, 5000)
}

async function sendToShoppingList () {
  const path = 'http://localhost:8080/shopping-list/add'
  const config = {
    headers: {
      'Content-type': 'application/json'
    },
    withCredentials: true
  }
  const checkedProductsArray = getCheckedProducts()
  const shoppingListItems = checkedProductsArray.map((product) => {
    return {
      itemId: product.id,
      quantity: 1
    }
  })

  await axios.post(path, shoppingListItems, config)
    .then((response) => {
      if (response.status === 200) {
        updateMessage.value = 'Shopping list items added'
        removeCheckedProducts()
        emit('refresh-page')
      }
    })
    .catch((error) => {
      if (error.response.status === 401) {
        userStore.logout()
      }
      updateMessage.value = error.response.data.message
    })
}

function removeCheckedProducts () {
  products.value = products.value.filter((product) => !checkedProducts.value[product.id])
  checkedProducts.value = {}
}
</script>

<style scoped>

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100%;
}

.shopping-list-container {
  justify-content: center;
  align-content: center;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.loading {
  width: 100%;
  position: absolute;
  top: 50%;
  font-size: 30px;
}

.item-cards {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.update-message {
  margin-top: 30px;
  font-size: 20px;
}

.shopping-list-button {
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

.shopping-list-button:hover {
  transform: scale(1.1);
  background-color: #25A13A;
  color: white;
  box-shadow: 0px 15px 25px -5px rgba(darken(dodgerblue, 40%));
}

.shopping-list-button:active {
  background-color: black;
  box-shadow: 0px 4px 8px rgba(darken(dodgerblue, 30%));
  transform: scale(.90);
}

.add-button {
  background-color: #1A7028;
}

.add-button:hover {
  background-color: #25A13A;
}

.disabled-button {
  background-color: #bbb;
  color: black;
  cursor: not-allowed;
  opacity: 0.6;
}

.disabled-button:hover {
  background-color: #bbb;
  color: black;
  transform: scale(1);
}

.no-items {
  margin-top: 160px;
}

</style>

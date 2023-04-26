<template>
  <div class="fridge-container">
    <div class="task-bar">
      <h1>Mitt kjøleskap</h1>
      <h1>|</h1>
      <h1>Utgåtte varer</h1>
    </div>
    <div class="my-fridge">
      <SearchBarComp id="search-bar"/>
      <div class="update-message">
        {{ updateMessage }}
      </div>
      <div class="item-cards" v-for="product in products" :key="product.id">
        <FridgeItemCardComp :product="product" @update="onUpdate" @selection-changed="onSelectionChanged"/>
      </div>
    </div>
    <div class="buttons">
      <button v-if="products.length > 0" class="fridge-button" @click="markAsEaten">Jeg har spist dette</button>
      <button v-if="products.length > 0" class="fridge-button" @click="markAsWaste">Jeg har kastet dette</button>
      <div  v-if="products.length === 0" class="no-items">
        <h2>Ingen varer i kjøleskapet</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchBarComp from '../components/SearchBarComp.vue'
import FridgeItemCardComp from '../components/FridgeItemCardComp.vue'
import { onMounted, ref } from 'vue'
import { useUtilityStore } from '../stores/UtilityStore'
import { FridgeItemCardInterface } from '../components/types'
import { useUserStore } from '../stores/UserStore'
import axios from 'axios'

const products = ref<FridgeItemCardInterface[]>([])
const selectedProducts = ref<FridgeItemCardInterface[]>([])
const userStore = useUserStore()
const utilityStore = useUtilityStore()
const config = {
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
}
const updateMessage = ref('')

onMounted(() => {
  utilityStore.setTransparentStatus(false)
  getItemsInFridge()
})

async function getItemsInFridge () {
  const path = 'http://localhost:8080/fridge/get'
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }
  await axios.get(path, config)
    .then(async (response) => {
      if (response.status === 200) {
        products.value = response.data
      }
    })
    .catch((error) => {
      if (error.response.status === 400) {
        updateMessage.value = error.response.data.message
      } else if (error.response.status === 600) {
        userStore.logout()
      }
    })
}

async function onUpdate (updatedProduct: FridgeItemCardInterface) {
  const path = 'http://localhost:8080/fridge/edit/' + updatedProduct.id

  await axios.put(path, updatedProduct, config)
    .then(async (response) => {
      if (response.status === 200) {
        const index = products.value.findIndex(
          (product) => product.id === updatedProduct.id
        )
        updateMessage.value = 'Vare redigert'
        if (index !== -1) {
          products.value[index] = updatedProduct
          products.value = [...products.value]
        }
      }
    })
    .catch((error) => {
      if (error.response.status === 400) {
        updateMessage.value = error.response.data.message
      } else if (error.response.status === 600) {
        userStore.logout()
      }
    })
}

function onSelectionChanged (event: { selected: boolean; product: FridgeItemCardInterface }) {
  if (event.selected) {
    selectedProducts.value.push(event.product)
  } else {
    selectedProducts.value = selectedProducts.value.filter((item) => item.id !== event.product.id)
  }
}

async function markAsEaten () {
  const selectedIds = selectedProducts.value.map((item) => item.id)
  const goNextAxios = ref<boolean>(false)

  const pathRemove = 'http://localhost:8080/fridge/remove'
  const request = selectedIds

  await axios.delete(pathRemove, { data: request, headers: config.headers, withCredentials: config.withCredentials })
    .then(async (response) => {
      if (response.status === 200) {
        updateMessage.value = 'Varer spist'
        products.value = products.value.filter((product) => !selectedIds.includes(product.id))
        selectedProducts.value = []
        goNextAxios.value = true

        setTimeout(() => {
          updateMessage.value = ''
        }, 5000)
      }
    })
    .catch((error) => {
      if (error.response.status === 600) {
        userStore.logout()
      } else if (error.response.status === 400) {
        updateMessage.value = error.response.data.message
      }
    })

  products.value = products.value.filter((product) => !selectedIds.includes(product.id))
  selectedProducts.value = []

  return goNextAxios
}

async function markAsWaste () {
  const selectedProductsCopy = [...selectedProducts.value]
  const goNextAxios = await markAsEaten()

  if (!goNextAxios.value) {
    return false
  }
  const totalWeight = selectedProductsCopy.reduce(
    (sum, item) => sum + item.item.weight * item.quantity,
    0
  )
  const wasteRequest = {
    weight: totalWeight,
    entryDate: new Date().toISOString().split('T')[0]
  }

  const pathAddWaste = 'http://localhost:8080/waste/add?weight=' + totalWeight
  await axios.post(pathAddWaste, wasteRequest, { headers: config.headers, withCredentials: config.withCredentials })
    .then(async (response) => {
      if (response.status === 200) {
        updateMessage.value = 'Varer kastet'
      }
    })
    .catch((error) => {
      if (error.response.status === 600) {
        userStore.logout()
      }
      if (error.response.status === 400) {
        updateMessage.value = error.response.data.message
      }
    })
}
</script>

<style scoped>
.fridge-container {
  display: flex;
  flex-direction: column;
  padding-top: 15vh;
  height: 100vh;
}

.task-bar {
  display: flex;
  justify-content: center;
  background-color: white;
  height: 100px;
  width: 100%;
}

#search-bar{
    position: relative;
    text-align: center;
    left: 25%;
    margin-top: 10px;
    color: black;
    width: 50%;
    max-width: 1000px;
    z-index: 3;
    scale: 0.8;
}

.update-message {
  margin-top: 30px;
  font-size: 20px;
}

.no-items {
  margin-top: 80px;
}

.item-cards {
  display: flex;
  justify-content: center;
  margin: 0;
  margin-bottom: -40px;
}

.fridge-button {
  background-color: #1A7028;
  color: white;
  height: 40px;
  width: 200px;
  margin: 60px;
  margin-bottom: 100px;
  border-radius: 100px;
  border: none;
}

.fridge-button:hover {
  transform: scale(1.1);
  background-color: #25A13A;
  color: white;
  box-shadow: 0px 15px 25px -5px rgba(darken(dodgerblue, 40%));
}

.fridge-button:active {
  background-color: black;
  box-shadow: 0px 4px 8px rgba(darken(dodgerblue, 30%));
  transform: scale(.90);
}
</style>

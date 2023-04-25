<template>
  <div class="fridge-container">
    <div class="task-bar">
      <h1>Mitt kjøleskap</h1>
      <h1>|</h1>
      <h1>Utgåtte varer</h1>
    </div>
    <div class="my-fridge">
      <SearchBarComp id="search-bar"/>
      <div class="item-cards" v-for="product in products" :key="product.id">
        <FridgeItemCardComp :product="product" @update="onUpdate" @selection-changed="onSelectionChanged"/>
      </div>
    </div>
    <div class="buttons">
      <button class="fridge-button">Jeg har spist dette</button>
      <button class="fridge-button" @click="removeSelectedItems">Jeg har kastet dette</button>
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

onMounted(() => {
  utilityStore.setTransparentStatus(false)
  getItemsInFridge()
})

async function getItemsInFridge () {
  const path = 'http://localhost:8080/user/fridge-items'
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
      console.log(error)
      if (error.response.status === 400) {
        console.log('error')
      } else if (error.response.status === 600) {
        userStore.logout()
      }
    })
}

async function onUpdate (updatedProduct: FridgeItemCardInterface) {
  const path = 'http://localhost:8080/fridge-items/edit/' + updatedProduct.id

  await axios.put(path, updatedProduct, config)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('success')
        const index = products.value.findIndex(
          (product) => product.id === updatedProduct.id
        )
        if (index !== -1) {
          products.value[index] = updatedProduct
          products.value = [...products.value]
        }
      }
    })
    .catch((error) => {
      console.log(error)
      if (error.response.status === 400) {
        console.log('error')
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

async function removeSelectedItems () {
  const selectedIds = selectedProducts.value.map((item) => item.id)
  const totalWeight = selectedProducts.value.reduce((sum, item) => sum + item.item.weight, 0)
  const goNextAxios = ref<boolean>(false)
  // Remove items from the backend
  const pathRemove = 'http://localhost:8080/fridge-items/remove-list'

  const request = selectedIds

  await axios.delete(pathRemove, { data: request, headers: config.headers, withCredentials: config.withCredentials })
    .then(async (response) => {
      if (response.status === 200) {
        console.log('removed item')
        products.value = products.value.filter((product) => !selectedIds.includes(product.id))
        selectedProducts.value = []
        goNextAxios.value = true
      }
    })
    .catch((error) => {
      console.log('remove:', error)
      if (error.response.status === 400) {
        console.log(error.response.data.message)
      }
    })

  products.value = products.value.filter((product) => !selectedIds.includes(product.id))
  selectedProducts.value = []

  if (goNextAxios.value) {
    const pathAddWaste = 'http://localhost:8080/waste/add?weight=' + totalWeight
    await axios.post(pathAddWaste, null, { headers: config.headers, withCredentials: config.withCredentials })
      .then(async (response) => {
        if (response.status === 200) {
          console.log('Added to waste')
        }
      })
      .catch((error) => {
        console.log('waste', error)
        if (error.response.status === 600) {
          userStore.logout()
        }
        if (error.response.status === 400) {
          console.log(error.response)
        }
      })
  }
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

.item-cards {
  display: flex;
  justify-content: center;
}

.fridge-button {
  background-color: #1A7028;
  color: white;
  height: 40px;
  width: 200px;
  margin: 20px;
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

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
        <FridgeItemCardComp :product="product" @update="onUpdate"/>
      </div>
    </div>
    <div class="buttons">
      <button class="fridge-button">Jeg har spist dette</button>
      <button class="fridge-button">Jeg har kastet dette</button>
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
const userStore = useUserStore()
const utilityStore = useUtilityStore()

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
        console.log(response.data)
        products.value = response.data
        console.log('success')
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
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }

  await axios.put(path, updatedProduct, config)
    .then(async (response) => {
      if (response.status === 200) {
        console.log(response.data)
        // You can update the product in the local state here.
        console.log('success')
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

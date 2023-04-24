<template>
  <div class="fridge-container">
    <div class="task-bar">
      <h1>Mitt kjøleskap</h1>
      <h1>|</h1>
      <h1>Utgåtte varer</h1>
    </div>
    <div class="my-fridge">
      <SearchBarComp id="search-bar"/>
      <div class="product-table" v-for="product in products" :key="product.id">
        <div class="item-cards">
            <FridgeItemCardComp :product="product" />
          </div>
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

const utilityStore = useUtilityStore()
const userStore = useUserStore()
const products = ref<FridgeItemCardInterface[]>([])
const isLoading = ref(true)

const loadProducts = async () => {
  const config = {
    headers: {
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + userStore.token,
      'Response-type': 'application/json'
    }
  }

  isLoading.value = true
  console.log(userStore.token)
  const path = 'http://localhost:8080/user/fridge-items'
  axios.get(path, config)
    .then(async (response) => {
      if (response.status === 200) {
        products.value = response.data
        console.log(response.data)
        isLoading.value = false
      }
    })
    .catch((error) => {
      if (error.response.status === 400) {
        console.error(error)
      }
    })
}

onMounted(() => {
  utilityStore.setTransparentStatus(false)
  loadProducts()
})

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
</style>

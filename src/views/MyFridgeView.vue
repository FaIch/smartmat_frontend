<template>
  <div class="fridge-container">
    <div class="task-bar">
      <h1>Mitt kjøleskap</h1>
      <h1>|</h1>
      <h1>Utgåtte varer</h1>
    </div>
    <div class="my-fridge">
      <SearchBarComp id="search-bar"/>
      <div class="item-cards">
        <FridgeItemCardComp />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchBarComp from '../components/SearchBarComp.vue'
import FridgeItemCardComp from '@/components/FridgeItemCardComp.vue'
import { onMounted } from 'vue'
import { useUtilityStore } from '../stores/UtilityStore'
import axios from 'axios'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()
const utilityStore = useUtilityStore()

onMounted(() => {
  utilityStore.setTransparentStatus(false)
  getItemsInFridge()
  userStore.loggedIn = true
})

async function getItemsInFridge () {
  const path = 'http://localhost:8080/user/fridge-items'
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }
  console.log(userStore.loggedIn)
  await axios.get(path, config)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('success')
      }
    })
    .catch((error) => {
      if (error.response.status === 400) {
        console.log('error')
      } else if (error.response.status === 403) {
        console.log('403')
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
</style>

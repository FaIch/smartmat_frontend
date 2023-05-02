<template>
  <div class="fridge-container">
    <div class="task-bar">
      <h2 :class="{ active: fridge, inactive: !fridge }" @click="showFridge">
        Mitt kjøleskap ({{ numberOfUnexpiredItems }})
      </h2>
      <div class="separator">
      </div>
      <h2 :class="{ active: !fridge, inactive: fridge }" @click="showExpiredItems">
        Utgåtte varer ({{ numberOfExpiredItems }})
      </h2>
    </div>
    <fridge-comp :key="Number(fridge)" :fridge="fridge" @handle-swap="handleSwap" @handle-decrement="handleDecrement" @refresh-page="refreshPage"/>
  </div>
</template>

<script setup lang="ts">
import FridgeComp from '../components/FridgeComp.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '../stores/UserStore'

const numberOfUnexpiredItems = ref()
const numberOfExpiredItems = ref()
const userStore = useUserStore()
const fridge = ref(true)
onMounted(() => {
  getNumberOfFridgeItems()
})

async function getNumberOfFridgeItems () {
  const path = 'http://localhost:8080/fridge/get/number'

  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }
  await axios.get(path, config)
    .then(async (response) => {
      if (response.status === 200) {
        numberOfUnexpiredItems.value = response.data.unexpired
        numberOfExpiredItems.value = response.data.expired
      }
    }).catch((error) => {
      if (error.response.status === 600) {
        userStore.logout()
      }
    })
}

const showFridge = () => {
  fridge.value = true
}

const showExpiredItems = () => {
  fridge.value = false
}

function handleSwap (fridge: boolean) {
  if (fridge) {
    numberOfExpiredItems.value++
    numberOfUnexpiredItems.value--
  } else {
    numberOfExpiredItems.value--
    numberOfUnexpiredItems.value++
  }
}

function handleDecrement (fridge: boolean, number: number) {
  if (fridge) {
    numberOfUnexpiredItems.value -= number
  } else {
    numberOfExpiredItems.value -= number
  }
}

function refreshPage () {
  getNumberOfFridgeItems()
}
</script>

<style scoped>
.fridge-container {
  display: flex;
  flex-direction: column;
  padding-top: 120px;
  min-height: 100vh;
  height: 100%;
}

.task-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60px;
  width: 100%;
}
.separator {
  position: relative;
  width: 2rem;
  height: 100%;
  font-size: 50px;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.separator::before {
  content: "|";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

h1 {
  padding: 0;
}

h2 {
  cursor: pointer;
  transition: font-size 0.5s;
  padding: 0;
  margin: 0;
  font-weight: normal;
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
}

.active {
  font-size: 40px;
}

.inactive {
  font-size: 20px;
}
</style>

<template>
  <div class="notification-view">
    <p class="notification-info">Du har {{ numberOfItems }} produkter som snart går ut på dato</p>
    <div class="list-of-items" v-for="product in products" :key="product.id">
      <NotificationItemCardComp :product="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { FridgeItemCardInterface } from '../components/types'
import { useUserStore } from '../stores/UserStore'
import NotificationItemCardComp from '../components/NotificationItemCardComp.vue'

const numberOfItems = ref<number>(0)
const products = ref<FridgeItemCardInterface[]>([])
const userStore = useUserStore()

async function getItems () {
  const path = 'http://localhost:8080/fridge/get/notification'

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
        numberOfItems.value = products.value.length
      }
    })
    .catch((error) => {
      if (error.response.status === 400) {
        userStore.logout()
      }
    })
}

onMounted(() => {
  getItems()
})

</script>

<style scoped>
.notification-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  padding-top: 2rem;
  background-color: white;
  border-style: solid;
}

.notification-info {
  font-size: large;
  font-weight: bold;
}
</style>

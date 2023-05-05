<template>
  <div  v-if="isViewOpen">
  <div class="notification-view">
    <p class="notification-info">Du har {{ numberOfItemsExpired }} produkter som har gått ut på dato</p>
    <div class="list-of-items" v-for="productExipred in productsExpired" :key="productExipred.id">
      <NotificationItemCardComp :product="productExipred"/>
    </div>
  </div>
  <div class="notification-view">
    <p class="notification-info">Du har {{ numberOfItems }} produkter som snart går ut på dato</p>
    <div class="list-of-items" v-for="product in products" :key="product.id">
      <NotificationItemCardComp :product="product"/>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import api from '../utils/httputils'
import { onMounted, ref } from 'vue'
import { FridgeItemCardInterface } from '../components/types'
import { useUserStore } from '../stores/UserStore'
import NotificationItemCardComp from '../components/NotificationItemCardComp.vue'

const numberOfItems = ref<number>(0)
const numberOfItemsExpired = ref<number>(0)
const products = ref<FridgeItemCardInterface[]>([])
const productsExpired = ref<FridgeItemCardInterface[]>([])
const userStore = useUserStore()
const isViewOpen = ref(true)

onMounted(() => {
  getItemsExpired()
  getItemsAlmostExpired()
})

async function getItemsAlmostExpired () {
  const path = '/fridge/get/notification'

  await api.get(path)
    .then(async (response) => {
      if (response.status === 200) {
        products.value = response.data
        numberOfItems.value = products.value.length
      }
    })
    .catch((error) => {
      if (error.response.status === 401) {
        userStore.logout()
      }
    })
}

async function getItemsExpired () {
  const path = '/fridge/get/expired'

  await api.get(path)
    .then(async (response) => {
      if (response.status === 200) {
        productsExpired.value = response.data
        numberOfItemsExpired.value = productsExpired.value.length
      }
    })
    .catch((error) => {
      if (error.response.status === 401) {
        userStore.logout()
      }
    })
}

</script>

<style scoped>
.notification-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  padding-top: 2rem;

}

.notification-info {
  font-size: large;
  font-weight: bold;
}
</style>

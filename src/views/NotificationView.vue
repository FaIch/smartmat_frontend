<template>
    <div class="notification-view">
        <p>Du har {{ numberOfItems }} som snart går ut på dato!</p>
        <div class="list-of-items" v-for="product in products" :key="product.id">
            <FridgeItemCardComp :product="product" />
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { FridgeItemCardInterface } from '../components/types'
import { useUserStore } from '../stores/UserStore'

const numberOfItems = ref(0)
// const itemList: string[] = ['potet', 'gulrot']
const products = ref<FridgeItemCardInterface[]>([])
const userStore = useUserStore()
const updateMessage = ref('')

/* function displayItems() {
    const listContainer = document.getElementById('list-of-items')

    if (listContainer) {
        const ul = document.createElement('ul')

        itemList.forEach(item => {
            const li = document.createElement('li')
            li.innerText = item
            ul.appendChild(li)
        })
        listContainer.appendChild(ul)
    }
} */

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

onMounted(() => {
  // displayItems()
  getItems()
})

</script>

<style scoped>
.notification-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2vh;
    padding: 2rem;
    background-color: white;
    border-style: solid;
}
</style>

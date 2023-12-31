<template>
  <div class="fridge-container">
    <div class="task-bar">
      <h2 :class="{ active: activeTab === 1, inactive: activeTab !== 1 }" @click="showShoppingList">
        Handleliste ({{ numberOfShoppingListItems }})
      </h2>
      <div class="separator"></div>
      <h2 :class="{ active: activeTab === 2, inactive: activeTab !== 2 }" @click="showSuggestions">
        Foreslåtte varer ({{ numberOfSuggestions }})
      </h2>
      <div class="separator">
      </div>
      <h2 :class="{ active: activeTab === 3, inactive: activeTab !== 3 }" @click="showWishlist">
        Ønskeliste ({{ numberOfWishListItems }})
      </h2>
    </div>
    <ShoppingListComp v-if="activeTab === 1" @refresh-page="refreshPage"/>
    <SuggestedItemsComp v-if="activeTab === 2" @refresh-page="refreshPage"/>
    <WishListComp v-if="activeTab === 3" @refresh-page="refreshPage"/>
  </div>
</template>

<script setup lang="ts">
import ShoppingListComp from '../components/ShoppingListComp.vue'
import SuggestedItemsComp from '../components/SuggestedItemsComp.vue'
import WishListComp from '../components/WishListComp.vue'
import { ref, onMounted } from 'vue'
import api from '../utils/httputils'
import { useUserStore } from '../stores/UserStore'

const numberOfShoppingListItems = ref()
const numberOfSuggestions = ref()
const numberOfWishListItems = ref()
const userStore = useUserStore()
const activeTab = ref(1)

onMounted(() => {
  getNumberOfShoppingListItems()
})

async function getNumberOfShoppingListItems () {
  const path = '/shopping-list/get/number'

  await api.get(path)
    .then(async (response) => {
      if (response.status === 200) {
        numberOfShoppingListItems.value = response.data.shoppingListItemsNumber
        numberOfSuggestions.value = response.data.suggestedItemsNumber
        numberOfWishListItems.value = response.data.wishedItemsNumber
      }
    }).catch((error) => {
      if (error.response.status === 401) {
        userStore.logout()
      }
    })
}

function refreshPage () {
  getNumberOfShoppingListItems()
}

const showShoppingList = () => {
  activeTab.value = 1
}

const showSuggestions = () => {
  activeTab.value = 2
}

const showWishlist = () => {
  activeTab.value = 3
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
  min-height: 72px;
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

@media only screen and (max-width: 800px) {
  .active {
    font-size: 30px;
  }
  .inactive {
    font-size: 15px;
  }
}

@media only screen and (max-width: 500px) {
  .active {
    font-size: 25px;
  }
  .inactive {
    font-size: 14px;
  }
}
</style>

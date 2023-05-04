<template>
  <div class="container" v-if="weekMenuData">
    <h1 class="title">Din {{type}} ukemeny </h1>
    <p> Ukes menyen består av fem ulike retter. Du kan klikke deg inn på hver rett for mer informasjon.</p>
    <br>
    <p>Ingredienser: {{weekMenuData.totalAmountOfItems}}</p>
    <p>Mangler: {{weekMenuData.totalAmountOfMissingItems}}</p>
    <p>Antall datovarer:  {{weekMenuData.totalAmountOfItemsToExpire}}</p>
    <br>
    <button class="button" v-if="!recipeStore.getHasWeekMenu()" @click="saveMenu" :class="{'dark-green': isButtonClicked}">Lagre Ukesmeny</button>
    <button class="button" v-else @click="removeMenu">Fjern Ukesmeny</button>
    <div class="recipe-row">
      <RecipeCardCompWeekMenu v-for="(recipe, index) in recipes" :key="index" :recipe="recipe"/>
    </div>
    <div class="required-ingredients">
      <li v-for="(ingredient, index) in recipeItems" :key="index">{{ ingredient.item.name + " " + ingredient.quantity + " " + ingredient.item.unit}} </li>
  </div>
  </div>
</template>

<script setup lang="ts">
// TODO: hvorfor forsvinner på refresh?!

import { onMounted, ref } from 'vue'
import api from '../utils/httputils'
import { useUserStore } from '../stores/UserStore'
import { RecipeCardInterface, RecipeIngredientInterface, ShoppingListItemCardInterface, FridgeItemCardInterface } from '../components/types'
import RecipeCardCompWeekMenu from '../components/RecipeCardCompWeekMenu.vue'
import router from '../router'
const userStore = useUserStore()

const isButtonClicked = ref(false)
const recipes = ref<RecipeCardInterface[]>([])
const recipeItems = ref<RecipeIngredientInterface[]>([])
const shoppingList = ref<ShoppingListItemCardInterface[]>([])
const fridgeItems = ref<FridgeItemCardInterface[]>([])
// const selectedItems = ref<ShoppingListItem[]>([])

onMounted(() => {
  getWeekMenu()
  getShoppingList()
  getFridgeItems()
})

async function getWeekMenu () {
  const path = '/week-menu/get'
  await api.get(path)
    .then(async (response) => {
      if (response.status === 200) {
        console.log(response.data)
        // recipes.value = response.data
      }
    })
    .catch((error) => {
      if (error.response.status === 400) {
        console.log('error')
      } else if (error.response.status === 600) {
        userStore.logout()
      }
    })
}

async function getShoppingList () {
  const path = '/shopping-list/get'
  await api.get(path)
    .then(async (response) => {
      if (response.status === 200) {
        shoppingList.value = response.data
      }
    })
    .catch((error) => {
      if (error.response.status === 401) {
        userStore.logout()
      }
      console.log(error)
    })
}

async function getFridgeItems () {
  const path = '/fridge/get'
  await api.get(path)
    .then(async (response) => {
      if (response.status === 200) {
        // Aggregate the quantities of items with the same ID
        const aggregatedFridgeItems: FridgeItemCardInterface[] = response.data.reduce((acc: FridgeItemCardInterface[], item: FridgeItemCardInterface) => {
          const existingItemIndex = acc.findIndex((accItem: FridgeItemCardInterface) => accItem.item.id === item.item.id)

          if (existingItemIndex !== -1) {
            acc[existingItemIndex].quantity += item.quantity
          } else {
            acc.push(item)
          }

          return acc
        }, [])
        fridgeItems.value = aggregatedFridgeItems
      }
    })
    .catch((error) => {
      if (error.response.status === 401) {
        userStore.logout()
      }
      console.log(error)
    })
}

async function saveMenu () {
  isButtonClicked.value = true
  const weekMenuRequest = {
  }

  const path = '/week-menu/save'
  await api.post(path, weekMenuRequest)
    .then(async (response) => {
      if (response.status === 200) {
        console.log(response.data)
        await router.push('/specificMenu')
      }
    })
    .catch((error) => {
      if (error.response.status === 400) {
        console.log('error')
      } else if (error.response.status === 600) {
        userStore.logout()
      }
    })
}

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
}

.title {
  padding: 20px;
}

.dark-green {
  opacity: 0;
}

.recipe-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

@media screen and (max-width: 768px) {
  .recipe-row {
    flex-direction: column;
    align-items: center;
  }
}

.button {
  background-color: #1A7028;
  color: white;
  height: 40px;
  width: 200px;
  border-radius: 100px;
  border: none;
  margin: 0;
  padding: 0;
  z-index: 0;
  margin-left: 10px;
}

a {
  display: block;
  text-decoration: none;
  color: inherit;
}

.recipe-items-fridge p {
  margin-bottom: 0;
  color: black;
}
</style>

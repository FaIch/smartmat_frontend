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
  </div>
</template>

<script setup lang="ts">
// TODO: hvorfor forsvinner på refresh?!

import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useUserStore } from '../stores/UserStore'
import { useRecipeStore } from '../stores/RecipeStore'
import { RecipeCardInterface, WeekMenuData } from '../components/types'
import RecipeCardCompWeekMenu from '../components/RecipeCardCompWeekMenu.vue'
import router from '../router'
const userStore = useUserStore()
const recipeStore = useRecipeStore()
const recipes = ref<RecipeCardInterface[]>([])
const weekMenuData = ref<WeekMenuData>()
const recipeIds: number[] = recipeStore.getRecipeIds()
const type = recipeStore.getType()
const isButtonClicked = ref(false)

onMounted(() => {
  console.log(recipeStore.getRecipeIdsCompleted())
  getRecipesWeekMenu(recipeIds)
  getWeekMenuData(recipeIds)
})

async function getRecipesWeekMenu (intList: number[]): Promise<void> {
  const path = '/week-menu/get-recipes-by-id'
  await axios.post(path, intList)
    .then(async (response) => {
      if (response.status === 200) {
        recipes.value = response.data
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

async function getWeekMenuData (intList: number[]): Promise<void> {
  const path = '/week-menu/get-data-week-menu'
  await axios.post(path, intList)
    .then(async (response) => {
      if (response.status === 200) {
        weekMenuData.value = response.data
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

async function saveMenu () {
  isButtonClicked.value = true
  const weekMenuRequest = {
    intList: recipeIds,
    message: type
  }

  const path = '/week-menu/save'
  await axios.post(path, weekMenuRequest)
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

async function removeMenu () {
  const path = '/week-menu/remove'
  await axios.get(path)
    .then(async (response) => {
      if (response.status === 200) {
        recipeStore.setHasWeekMenu(false)
        recipeStore.setType('')
        recipeStore.setRecipeIds([])
        recipeStore.setWeekMenu([])
        recipeStore.getRecipeIdsCompleted()
        await router.push('/weekMenu')
      }
    })
    .catch((error) => {
      if (error.response.status === 404) {
        console.log('no week menu for user in db')
      }
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

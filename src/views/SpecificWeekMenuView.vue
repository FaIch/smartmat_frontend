<template>
  <div class="container">
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
      <RecipeCardComp v-for="(recipe, index) in recipes" :key="index" :recipe="recipe"/>
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
import RecipeCardComp from '../components/RecipeCardComp.vue'
import router from '../router'
const userStore = useUserStore()
const recipeStore = useRecipeStore()
const recipes = ref<RecipeCardInterface[]>([])
const weekMenuData = ref<WeekMenuData[]>([])
const recipeIds: number[] = recipeStore.getRecipeIds()
const type = recipeStore.getType()
const isButtonClicked = ref(false)

onMounted(() => {
  getRecipesWeekMenu(recipeIds)
  getWeekMenuData(recipeIds)
})

async function getRecipesWeekMenu (intList: number[]): Promise<void> {
  const path = 'http://localhost:8080/week-menu/get-recipes-by-id'
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }
  await axios.post(path, intList, config)
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
  const path = 'http://localhost:8080/week-menu/get-data-week-menu'
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }
  await axios.post(path, intList, config)
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

  const path = 'http://localhost:8080/week-menu/save'
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }
  await axios.post(path, weekMenuRequest, config)
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
  const path = 'http://localhost:8080/week-menu/remove'
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }
  await axios.get(path, config)
    .then(async (response) => {
      if (response.status === 200) {
        recipeStore.setHasWeekMenu(false)
        recipeStore.setType('')
        recipeStore.setRecipeIds([])
        recipeStore.setWeekMenu([])
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

.recipes {
  margin-left: 40vh;
  margin-top: 10px;
  width: 80%;
}

.recipe-title {
  text-align: left;
}

.recipe-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  empty-cells: hide;
  gap: 20px;
  margin: 20px;
}

a {
  display: block;
  text-decoration: none;
  color: inherit;
}

.recipe-card {
  display: grid;
  grid-template-areas:
    "recipe-image"
    "recipe-details";
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  min-width: 250px;
  min-height: 300px;
}

.recipe-image {
  width: 100%;
  max-height: 300px;
}

.recipe-details {
  display: grid;
  grid-template-areas:
    "recipe-title"
    "recipe-comment"
    "recipe-time recipe-button";
  background-color: #fff;
}

.recipe-title {
  margin-top: 0;
  margin-bottom: 2px;
  font-size: 24px;
  font-weight: bold;
  color: black;
}

.recipe-comment, .recipe-items-fridge {
  margin-top: 0;
}

.recipe-items-fridge p {
  margin-bottom: 0;
  color: black;
}

.recipe-button {
  background-color: #1A7028;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border-radius: 10px;
  transition: background-color 0.2s ease-in-out;
  margin-top: 0;
  margin-bottom: 10px;
  margin-left: 10px;
  margin-right: 10px;
  padding: 6px
}

.recipe-button:hover {
  background-color: #25A13A;
}
</style>

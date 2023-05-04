<template>
  <div class="week-menu-container">
    <h1 class="title">Uke menyer</h1>
    <p>Nedenfor har du to ulike ukesmenyer du kan velge mellom<br><br>
      Den første består av anbefalte retter som inneholder de varene du har mest av i  kjøleskapet,<br>
      og som snarest går ut på dato. Denne menyen vil hjelpe deg redusere matsvinn<br><br>
      Den andre består av helt tilfeldige retter som kan gi inspirasjon</p>
    <div class="week-menus">
      <WeekMenuCardComp :week-menu="recommendedMenu" @click="goToMenu(recipeItemsIdListRecommended,'Anbefalte Oppskrifter')"/>
      <WeekMenuCardComp :week-menu="randomMenu" @click="goToMenu(recipeItemsIdListRandom,'Inspirerende Oppskrifter')"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { useUserStore } from '../stores/UserStore'
import { useRecipeStore } from '../stores/RecipeStore'
import axios from 'axios'
import { RecipeInterface, WeekMenuCardInterface } from '../components/types'
import router from '../router'
const WeekMenuCardComp = defineAsyncComponent(
  () => import('../components/WeekMenuCardComp.vue')
)

const userStore = useUserStore()
const recipeStore = useRecipeStore()
const recipes = ref<RecipeInterface[]>([])
const recipeItemsIdListRandom: number[] = []
const recipeItemsIdListRecommended: number[] = []
const randomMenu = ref<WeekMenuCardInterface>({
  firstRecipeImage: '',
  type: 'Inspirerende Oppskrifter'
})

const recommendedMenu = ref<WeekMenuCardInterface>({
  firstRecipeImage: '',
  type: 'Anbefalte Oppskrifter'
})

onMounted(() => {
  checkForWeekMenuStored()
  getWeekMenuRandom()
  getWeekMenuRecommended()
})

async function checkForWeekMenuStored () {
  await recipeStore.checkForWeekMenu()
  if (recipeStore.getHasWeekMenu()) {
    await router.push('/specificMenu')
  }
}

async function getWeekMenuRandom () {
  const path = '/week-menu/list-random'
  await axios.get(path)
    .then(async (response) => {
      if (response.status === 200) {
        recipes.value = response.data

        let counter = 0
        recipes.value.forEach((recipe) => {
          if (counter === 0) {
            randomMenu.value = {
              firstRecipeImage: recipe.image,
              type: 'Inspirerende Oppskrifter'
            }
          }
          recipeItemsIdListRandom.push(recipe.id)
          counter++
        })
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

async function getWeekMenuRecommended () {
  const path = '/week-menu/list-recommended'
  await axios.get(path)
    .then(async (response) => {
      if (response.status === 200) {
        recipes.value = response.data

        let counter = 0
        recipes.value.forEach((recipe) => {
          if (counter === 0) {
            recommendedMenu.value = {
              firstRecipeImage: recipe.image,
              type: 'Anbefalte Oppskrifter'
            }
          }
          recipeItemsIdListRecommended.push(recipe.id)
          counter++
        })
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

function goToMenu (menuIds: number[], type: string) {
  console.log('ids ' + menuIds)
  recipeStore.setRecipeIds(menuIds)
  recipeStore.setType(type)
  router.push('/specificMenu')
}
</script>

<style scoped>

.week-menu-container {
  display: flex;
  flex-direction: column;
  padding-top: 120px;
  height: 100%;
  min-height: 100vh;
}

h1 {
  font-size: 40px;
  margin: 5px 0 0;
  font-weight: normal;
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
}

p {
  margin-top: 30px;
  margin-bottom: 30px;
  font-size: 17px;
}

.week-menus {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  max-width: 2000px;
  width: 100%;
  align-self: center;
}

</style>

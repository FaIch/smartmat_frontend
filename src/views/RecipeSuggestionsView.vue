<template>
  <div class="recipe-container">
    <h1 class="title">Middagsforslag-tittel</h1>
    <SearchBarComp class="search-bar" :with-dropdown="false"  id="search-bar"/>
    <div class="recipe-row">
      <RecipeCardComp v-for="(recipe, index) in recipes" :key="index" :recipe="recipe" />
    </div>
  </div>
</template>

<script setup lang="ts">
import RecipeCardComp from '../components/RecipeCardComp.vue'
import SearchBarComp from '../components/SearchBarComp.vue'
import { onMounted, ref } from 'vue'
import { useUtilityStore } from '../stores/UtilityStore'
import axios from 'axios'
import { useUserStore } from '../stores/UserStore'
import { RecipeCardInterface } from '../components/types'
const userStore = useUserStore()
const utilityStore = useUtilityStore()
const recipes = ref<RecipeCardInterface[]>([])

onMounted(() => {
  utilityStore.setTransparentStatus(false)
  getRecipies()
})
async function getRecipies () {
  const path = 'http://localhost:8080/recipe/list/sorted'
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }
  await axios.get(path, config)
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
</script>

<style scoped>

.recipe-container {
  /* Fixed distance from nav bar, need to change this so it corresponds with window size */
  display: grid;
  margin-top: 75px;
  height: 100vh;
}

.title {
  padding: 20px;
}

.recipe-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  empty-cells: hide;
  gap: 20px;
  margin: 20px;
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

</style>

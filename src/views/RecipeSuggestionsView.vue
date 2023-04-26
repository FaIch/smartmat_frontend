<template>
  <div class="container">
    <h1 class="title">Middagsforslag-tittel</h1>
    <SearchBarComp /> Modify search bar for recipe view
    <div class="recipe-row">
      <RecipeCardComp v-for="(recipe, index) in recipes" :key="index" :recipe="recipe" />
      <div class="recipe-details">
        <h2 class="recipe-title"><b> {{  recipe.name }} </b></h2>
<!--        <h4 class="recipe-comment">{{ dishComment }}</h4>-->
        <!--<p class="recipe-time-and-info">{{ dishTime }}, {{ missingIngredients }}</p>-->
        <button class="recipe-button">Gå til oppskrift</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RecipeCardComp from '../components/RecipeCardComp.vue'
import SearchBarComp from '../components/SearchBarComp.vue'
import { onMounted, ref } from 'vue'
import { useUtilityStore } from '../stores/UtilityStore'
import axios from 'axios'
// import { useUserStore } from '@/stores/UserStore'
import { RecipeCardInterface } from '../components/types'
// const userStore = useUserStore()
const utilityStore = useUtilityStore()
const recipes = ref<RecipeCardInterface[]>([])

onMounted(() => {
  utilityStore.setTransparentStatus(false)
  getRecipies()
})
async function getRecipies () {
  const path = 'https://localhost:8080/recipe/sorted-by-fridge'
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }
  // console.log(userStore.loggedIn)
  await axios.get(path, config)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('success')
        response.data = recipes
      }
    })
    .catch((error) => {
      if (error.response.status === 400) {
        console.log('error')
      } else if (error.response.status === 600) {
        // userStore.logOut()
      }
    })
}
</script>

<style scoped>
.container {
  /* Fixed distance from nav bar, need to change this so it corresponds with window size */
  display: grid;
  margin-top: 100px;
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
</style>

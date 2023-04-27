<template>
  <div class="container">
    <h1 class="title">Middagsforslag-tittel</h1>
    <SearchBarComp :with-dropdown="false" /> Modify search bar for recipe view
    <div class="recipe-row">
<!--      <RecipeCardComp v-for="(recipe, index) in recipes" :key="index" :recipe="recipe" />-->
      <div v-for="recipe in recipes" :key="recipe.recipe.id">
        <div class="recipe-card">
        <div class="recipe-details">
          <h2 class="recipe-title"><b>{{ recipe.recipe.name }}</b></h2>
          <img class="recipe-image" :src="'data:image/png;base64,' + recipe.recipe.image" alt="">
          <h4 class="recipe-comment">{{ recipe.recipe.estimated_time }}</h4>
          <h5 class="recipe-comment">{{ recipe.amountInFridge }} / {{recipe.recipe.numberOfItems}}</h5>
          <h5 class="recipe-comment">Amount nearly exipred ({{ recipe.amountNearlyExpired }})</h5>
          <button class="recipe-button">Gå til oppskrift</button>
        </div>
        </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
// import RecipeCardComp from '../components/RecipeCardComp.vue'
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
        console.log('success')
        console.log(response.data)
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

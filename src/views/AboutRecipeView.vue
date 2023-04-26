<template>
  <div class="container">
    <h1 class="title">{{ recipe.name }}</h1>
    <img class="recipe-image" :src="'data:image/png;base64,' + recipe.image" alt="">
    <h2 class="recipe-title">Ingredients</h2>
    <ul>
      <li v-for="(ingredient, index) in recipe.ingredients" :key="index">{{ ingredient }}</li>
    </ul>
    <h2 class="recipe-title">Instructions</h2>
    <ol>
      <li v-for="(instruction, index) in recipe.instructions" :key="index">{{ instruction }}</li>
    </ol>
    <h2 class="recipe-title">Estimated time</h2>
    <p>{{ recipe.estimated_time }}</p>
    <h2 class="recipe-title">Number of items in fridge</h2>
    <p>{{ recipe.numberOfItemsFridge }}</p>
    <h2 class="recipe-title">Number of items needed for recipe</h2>
    <p>{{ recipe.numberOfItemsRecipe }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUtilityStore } from '../stores/UtilityStore'
import { useUserStore } from '../stores/UserStore'

import axios from 'axios'
import { RecipeInterface } from '../components/types'

const utilityStore = useUtilityStore()
const userStore = useUserStore()
const route = useRoute()

const recipeId = computed(() => {
  return route.params.id
})

const recipe = ref<RecipeInterface>()

onMounted(() => {
  fetchRecipe()
})

async function fetchRecipe () {
  const path = `http://localhost:8080/recipe/${recipeId.value}`
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
        recipe.value = response.data
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

utilityStore.setTransparentStatus(false)

</script>
<style scoped>
.container {
  /* Fixed distance from nav bar, need to change this so it corresponds with window size */
  display: grid;
  margin-top: 100px;
  border: 2px
}

.title {
  padding: 20px;
}

.title {
  color: #25A13A;
  border-bottom-color: black;
}
</style>

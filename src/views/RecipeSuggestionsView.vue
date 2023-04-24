<template>
  <div class="container">
    <h1 class="title">Middagsforslag-tittel</h1>
    <SearchBarComp /> <!--Modify search bar for recipe view-->
    <div class="recipe-row">
      <!--<RecipeCardComp v-for="(recipe, index) in recipes" :key="index" :recipe="recipe" />-->
    </div>
  </div>
</template>

<script setup lang="ts">
/* import RecipeCardComp from '../components/RecipeCardComp.vue'
import SearchBarComp from '../components/SearchBarComp.vue'
import { onMounted, ref } from 'vue'
import { useUtilityStore } from '../stores/UtilityStore'
import axios from 'axios'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()
const utilityStore = useUtilityStore()
const recipes = ref([])

async function getRecipies () {
  const path = 'https://localhost:8080/recipe/list'
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }
  console.log(userStore.loggedIn)
  await axios.get(path, config)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('success')
        axios.get('https://localhost:8080/recipe/list', { headers: { Authorization: 'Bearer ' + userStore.token } })
          .then(response => response.data)
          .then(data => recipes.value = data)
          .catch(error => console.log(error))
      }
    })
    .catch((error) => {
      if (error.response.status === 400) {
        console.log('error')
      } else if (error.response.status === 600) {
        userStore.logOut()
      }
    })
}

onMounted(() => {
  utilityStore.setTransparentStatus(false)
  getRecipies()
}) */
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

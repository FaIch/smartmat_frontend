<template>
  <div class="recipes-container">
    <div class="recipes-title">
      <h1>Middagsforslag</h1>
    </div>
    <div class="search-div">
      <SearchBarComp :search-placeholder="searchPlaceholder" id="search-bar" @search="filterRecipes"/>
      <div class="selector-outer">
        <h4>Porsjoner:</h4>
        <div class="selector">
          <img
            src="../assets/icons/remove.svg"
            @click="decrement"
          />
          <input class="input-field"
            v-model.number="quantity"
            id="quantity"
            disabled
            ref="quantityInput"
          />
          <img
            src="../assets/icons/add.svg"
            @click="increment"
          />
        </div>
      </div>
    </div>
    <div v-if="updateMessage.length === 0" class="recipes-grid">
      <RecipeCardComp class="recipe-card" v-for="(recipe, index) in filteredRecipes" :key="index" :recipe="recipe"/>
    </div>
    <div v-if="updateMessage.length > 0" class="update-message">
      <h3> {{ updateMessage }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchBarComp from '../components/SearchBarComp.vue'
import RecipeCardComp from '../components/RecipeCardComp.vue'
import { ref, onMounted } from 'vue'
import { AxiosError } from 'axios'
import api from '../utils/httputils'
import { useUserStore } from '../stores/UserStore'
import { RecipeCardInterface } from '../components/types'

const userStore = useUserStore()
const searchPlaceholder = ref('Søk etter oppskrifter...')
const recipes = ref<RecipeCardInterface[]>([])

const updateMessage = ref('')
const filteredRecipes = ref<RecipeCardInterface[]>([])
const quantity = ref(4)

async function getRecipes () {
  const params = {
    params: {
      amount: quantity.value
    }
  }
  const path = '/recipe/list/sorted'
  try {
    console.log(params)
    const response = await api.get(path, params)

    if (response.status === 200) {
      recipes.value = response.data
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response && error.response.status === 401) {
        userStore.logout()
      } else {
        if (error.message && error.message === 'Network Error') {
          updateMessage.value = 'Kunne ikke nå server.'
        } else {
          updateMessage.value = error.message
        }
      }
    }
  }
}

async function filterRecipes (searchInput: string) {
  filteredRecipes.value = recipes.value.filter((recipeCard: RecipeCardInterface) => {
    return recipeCard.recipe.name.toLowerCase().includes(searchInput.toLowerCase())
  })
}

async function fetchUserData () {
  api.get('/user/details').then((response) => {
    if (response.status === 200) {
      console.log(response.data.numberOfHouseholdMembers)
      quantity.value = response.data.numberOfHouseholdMembers
    }
  })
}

function increment () {
  if (quantity.value >= 150) {
    return
  }
  quantity.value++
  updateQuantity()
}

function decrement () {
  if (quantity.value <= 1) {
    return
  }
  quantity.value--
  updateQuantity()
}

function updateQuantity () {
  getRecipes().then(() => {
    filteredRecipes.value = recipes.value
  })
}

onMounted(() => {
  fetchUserData().then(() => {
    getRecipes().then(() => {
      filteredRecipes.value = recipes.value
    })
  })
})

</script>

<style scoped>

.recipes-container {
  min-height: 100vh;
  height: 100%;
  padding-top: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.recipes-title h1 {
  font-size: 40px;
  margin: 0;
  margin-top: 5px;
  font-weight: normal;
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
}

.recipes-title {
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
}

.selector-outer {
  margin-top: -30px;
}

.selector {
  display: flex;
  flex-direction: row;
  justify-self: right;
  align-self: right;
}

.selector input {
  height: 40px;
  width: 60px;
  border-radius: 20px;
  background-color: #e9f1fe;
  text-align: center;
  margin-top: 5px;
}

.selector img {
  cursor: pointer;
}

#search-bar {
  text-align: center;
  justify-self: center;
  align-self: center;
  color: black;
  max-width: 1000px;
  width: 70%;
  z-index: 3;
  margin-right: 0;
  scale: 0.8;
}

.recipes-grid {
  margin-top: 30px;
  margin-bottom: 50px;
  min-width: 300px;
  width: 80%;
  max-width: 1500px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 40px;
}

.update-message {
  margin-top: 80px;
}

.search-div {
  margin-top: 10px;
  display: flex;
  width: 100%;
  max-width: 1000px;
  justify-content: center;
  align-items: center;
  justify-self: center;
  align-self: center;
}

@media only screen and (max-width: 600px) {
  .search-div {
    flex-direction: column;
  }

  #search-bar {
    width: 400px;
  }

  .selector-outer {
    margin: 0;
    margin-top: 10px;
  }
}

@media only screen and (max-width: 360px) {

  .recipes-title h1 {
    font-size: 30px;
  }
  .recipe-card {
    scale: 0.8;
  }
  #search-bar {
    width: 100%;
  }

  .recipes-grid {
    display: flex;
    flex-direction: column;
  }
}

@media only screen and (max-width: 300px) {
  .recipe-card {
    scale: 0.7;
  }
  .recipes-grid {
    min-width: 0px;
    width: 250px;
    justify-content: center;
    align-items: center;
    flex-wrap:nowrap;
  }
}
</style>

<template>
  <div v-if="recipe" class="container">
    <h1 class="title">{{ recipe.name }}</h1>
    <img class="recipe-image" :src="'data:image/png;base64,' + recipe.image" alt="">
    <h2 class="recipe-title">Ingredients</h2>
  <button @click="addAllToShoppingList">Add All to Shopping List</button>
  <table>
    <thead>
      <tr>
        <th>Amount & Unit</th>
        <th>Ingredient</th>
        <th>Availability</th>
        <th>Add to Shopping List</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(ingredient, index) in recipeItems" :key="index">
        <td>{{ ingredient.quantity }} {{ ingredient.item.unit }}</td>
        <td>{{ ingredient.item.name }}</td>
        <td>
          <span v-if="ingredientAvailable(ingredient)">
            In fridge
          </span>
          <span v-else-if="inShoppingList(ingredient)">
            In shopping list
          </span>
          <span v-else>
            Not enough
          </span>
        </td>
        <td>
          <input
      v-if="!ingredientAvailable(ingredient) && !inShoppingList(ingredient)"
      type="checkbox"
      @change="toggleSelectedItem(ingredient)"
    />
        </td>
      </tr>
    </tbody>
  </table>
    <h2 class="recipe-title">Instructions</h2>
    <ol>
      <!-- <li v-for="(instruction, index) in recipe.instructions" :key="index">{{ instruction }}</li> -->
    </ol>
    <h2 class="recipe-title">Estimated time</h2>
    <p>{{ recipe.estimated_time }}</p>
    <!-- <h2 class="recipe-title">Number of items in fridge</h2>
    <p>{{ recipe.numberOfItemsFridge }}</p>
    <h2 class="recipe-title">Number of items needed for recipe</h2>
    <p>{{ recipe.numberOfItemsRecipe }}</p> -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUtilityStore } from '../stores/UtilityStore'
import { useUserStore } from '../stores/UserStore'
import axios from 'axios'
import { RecipeInterface, RecipeIngredientInterface, ShoppingListItemCardInterface, FridgeItemCardInterface, ShoppingListItem } from '../components/types'

const utilityStore = useUtilityStore()
const userStore = useUserStore()
const route = useRoute()

const recipeId = computed(() => {
  return route.params.id
})

const recipe = ref<RecipeInterface>()
const recipeItems = ref<RecipeIngredientInterface[]>([])
const shoppingList = ref<ShoppingListItemCardInterface[]>([])
const fridgeItems = ref<FridgeItemCardInterface[]>([])
const selectedItems = ref<ShoppingListItem[]>([])

onMounted(() => {
  fetchRecipe()
  fetchRecipeItems()
  fetchShoppingList()
  fetchFridgeItems()
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

async function fetchRecipeItems () {
  const path = `http://localhost:8080/recipe/recipe-items/${recipeId.value}`
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
        recipeItems.value = response.data
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

async function fetchShoppingList () {
  const path = 'http://localhost:8080/shopping-list/get'
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }
  await axios.get(path, config)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('Shopping list:')
        console.log(response.data)
        shoppingList.value = response.data
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

async function fetchFridgeItems () {
  const path = 'http://localhost:8080/fridge/get'
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }
  await axios.get(path, config)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('Fridge')
        console.log(response.data)
        fridgeItems.value = response.data
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

function toggleSelectedItem (ingredient: RecipeIngredientInterface) {
  const index = selectedItems.value.findIndex(
    (item) => item.id === ingredient.item.id
  )
  if (index === -1) {
    // Add the item with its id and quantity
    selectedItems.value.push({ id: ingredient.item.id, quantity: Math.ceil(ingredient.quantity / ingredient.item.baseAmount) })
    console.log(selectedItems.value)
  } else {
    // Remove the item from the list
    selectedItems.value.splice(index, 1)
  }
}

function ingredientAvailable (ingredient: RecipeIngredientInterface): boolean {
  const fridgeItem = fridgeItems.value.find(item => item.item.id === ingredient.item.id)
  if (fridgeItem) {
    return fridgeItem.quantity >= ingredient.quantity
  }
  return false
}

function inShoppingList (item: ShoppingListItemCardInterface): boolean {
  return shoppingList.value.some(listItem => listItem.item.id === item.id)
}

async function addAllToShoppingList () {
  const checkedProductsData = selectedItems.value.map((item) => ({
    itemId: item.id,
    quantity: item.quantity
  }))

  console.log(checkedProductsData)
  if (checkedProductsData.length) {
    const path = 'http://localhost:8080/shopping-list/add'
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }
    await axios.post(path, checkedProductsData, config)
      .then(async (response) => {
        if (response.status === 200) {
          console.log('All selected items added to the shopping list')
          // Refresh the shopping list
          fetchShoppingList()
          // Clear the selected items
          selectedItems.value = []
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
}

utilityStore.setTransparentStatus(false)

</script>
<style scoped>
.container {
  display: grid;
  margin-top: 100px;
  border: 2px;
}

.title {
  padding: 20px;
}

.title {
  color: #25A13A;
  border-bottom-color: black;
}

.recipe-image {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 400px;
  height: 400px;
  max-width: 50%;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  border: 1px solid #ddd;
  text-align: left;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>

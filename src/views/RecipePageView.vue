<template>
  <div v-if="recipe" class="container">
    <h1 class="title">{{ recipe.name }}</h1>
    <img class="recipe-image" :src="recipe.image" alt="">
    <h2 class="recipe-title">Ingredients</h2>
  <button @click="addAllToShoppingList">Add All to Shopping List</button>
  <table>
    <thead>
      <tr>
        <th>Amount & Unit</th>
        <th>Ingredient</th>
        <th>Availability</th>
        <th>
          <input
            type="checkbox"
            @change="toggleSelectAll"
            v-model="selectAllChecked"
          />
        </th>
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
        <td class="checkbox-cell">
          <input
      v-if="!ingredientAvailable(ingredient) && !inShoppingList(ingredient)"
      type="checkbox"
      @change="toggleSelectedItem(ingredient)"
      v-model="ingredient.selected"
    />
        </td>
      </tr>
    </tbody>
  </table>
    <h2 class="recipe-title">Instructions</h2>
    <div v-html="formattedText">
    </div>
    <h2 class="recipe-title">Estimated time</h2>
    <p>{{ recipe.estimatedTime }}</p>
    <!-- <h2 class="recipe-title">Number of items in fridge</h2>
    <p>{{ recipe.numberOfItemsFridge }}</p>
    <h2 class="recipe-title">Number of items needed for recipe</h2>
    <p>{{ recipe.numberOfItemsRecipe }}</p> -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
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

const formattedText = computed(() => recipe.value?.description.replace(/\n/g, '<br>'))
const selectAllChecked = ref(false)

watch(
  () => selectAllChecked.value,
  (newValue) => {
    recipeItems.value.forEach((ingredient) => {
      ingredient.selected = newValue
      toggleSelectedItem(ingredient)
    })
  }
)

function toggleSelectAll () {
  if (selectAllChecked.value) {
    recipeItems.value.forEach((ingredient) => {
      if (
        !ingredientAvailable(ingredient) &&
        !inShoppingList(ingredient) &&
        !ingredient.selected
      ) {
        ingredient.selected = true
        toggleSelectedItem(ingredient)
      }
    })
  } else {
    recipeItems.value.forEach((ingredient) => {
      if (ingredient.selected) {
        ingredient.selected = false
        toggleSelectedItem(ingredient)
      }
    })
  }
}

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
        console.log(recipe.value?.description)
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

function toggleSelectedItem (ingredient: any) {
  const index = selectedItems.value.findIndex(
    (item) => item.id === ingredient.item.id
  )
  if (index === -1) {
    selectedItems.value.push({
      id: ingredient.item.id,
      quantity: Math.ceil(ingredient.quantity / ingredient.item.baseAmount)
    })
  } else {
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
  const shoppingListItem = shoppingList.value.find(listItem => listItem.item.id === item.item.id)
  if (shoppingListItem) {
    console.log(shoppingListItem.item.name + shoppingListItem.quantity)
    return (shoppingListItem.quantity * shoppingListItem.item.baseAmount) >= item.quantity
  }
  return false
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
.checkbox-cell {
  width: 1%;
  white-space: nowrap;
}
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
  float: left;
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

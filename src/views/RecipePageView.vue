<template>
  <div v-if="recipe" class="container">
    <h1 class="title">{{ recipe.name }}</h1>
    <div class="recipe-info">
      <div class="image-container">
        <img class="recipe-image" :src="recipe.image" alt="">
      </div>
      <div class="recipe-stats">
        <div class="portion-stats">
          <h2 for="portions" class="recipe-title">Number of portions:</h2>
          <img src="../assets/icons/portion.svg" class="icon"/>
          <div class="edit-quantity-div">
              <img
                src="../assets/icons/remove.svg"
                @click="decrement"
              />
              <div class="portion-number">
                {{ portions }}
              </div>
              <img
                src="../assets/icons/add.svg"
                @click="increment"
              />
          </div>
        </div>
        <div class="estimated-time-stats">
          <h2 class="recipe-title">Estimated time</h2>
          <img src="../assets/icons/clock.svg" class="icon"/>
          <p>{{ recipe.estimatedTime }}</p>
        </div>

      </div>
    </div>
    <div class="recipe-steps">
      <div class="ingredients">
        <h2 class="recipe-title">Ingredients</h2>
        <button @click="addAllToShoppingList">Add All to Shopping List</button>
        <button @click="removeFromFridge">I've cooked this recipe</button>
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
            <tr v-for="(ingredient, index) in adjustedRecipeItems" :key="index">
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
      </div>
      <div class="instructions">
        <h2 class="recipe-title">Instructions</h2>
        <div v-html="formattedText"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../stores/UserStore'
import axios from 'axios'
import { RecipeInterface, RecipeIngredientInterface, ShoppingListItemCardInterface, FridgeItemCardInterface, ShoppingListItem } from '../components/types'

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
const portions = ref(4)

// Create a computed property to adjust the ingredient quantities
const adjustedRecipeItems = computed(() => {
  return recipeItems.value.map((ingredient) => {
    const adjustedQuantity = Math.ceil((ingredient.quantity * (portions.value / 4)))
    return {
      ...ingredient,
      quantity: adjustedQuantity
    }
  })
})

function increment () {
  portions.value++
}

function decrement () {
  if (portions.value > 1) {
    portions.value--
  }
}

watch(
  () => selectAllChecked.value,
  (newValue) => {
    recipeItems.value.forEach((ingredient) => {
      if (!ingredientAvailable(ingredient) && !inShoppingList(ingredient)) {
        ingredient.selected = newValue
        toggleSelectedItem(ingredient)
      }
    })
  }
)

function toggleSelectAll () {
  if (selectAllChecked.value) {
    adjustedRecipeItems.value.forEach(ingredient => {
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
    adjustedRecipeItems.value.forEach(ingredient => {
      if (
        !ingredientAvailable(ingredient) &&
        !inShoppingList(ingredient) &&
        ingredient.selected
      ) {
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

        // Aggregate the quantities of items with the same ID
        const aggregatedFridgeItems = response.data.reduce((acc, item) => {
          const existingItemIndex = acc.findIndex(accItem => accItem.item.id === item.item.id)

          if (existingItemIndex !== -1) {
            acc[existingItemIndex].quantity += item.quantity
          } else {
            acc.push(item)
          }

          return acc
        }, [])
        fridgeItems.value = aggregatedFridgeItems
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

function toggleSelectedItem (ingredient) {
  const adjustedIngredient = adjustedRecipeItems.value.find(
    item => item.item.id === ingredient.item.id
  )

  if (!adjustedIngredient) return

  const index = selectedItems.value.findIndex(
    item => item.id === adjustedIngredient.item.id
  )

  const fridgeItem = fridgeItems.value.find(
    item => item.item.id === adjustedIngredient.item.id
  )

  const shoppingListItem = shoppingList.value.find(
    listItem => listItem.item.id === adjustedIngredient.item.id
  )

  let requiredQuantity =
    fridgeItem && fridgeItem.quantity < adjustedIngredient.quantity
      ? Math.ceil(
        (adjustedIngredient.quantity - fridgeItem.quantity) /
            adjustedIngredient.item.baseAmount
      )
      : Math.ceil(
        adjustedIngredient.quantity / adjustedIngredient.item.baseAmount
      )

  requiredQuantity = shoppingListItem
    ? requiredQuantity - shoppingListItem.quantity
    : requiredQuantity

  if (index === -1) {
    selectedItems.value.push({
      id: adjustedIngredient.item.id,
      quantity: requiredQuantity
    })
  } else {
    selectedItems.value[index].quantity = requiredQuantity
  }
}

function ingredientAvailable (ingredient: RecipeIngredientInterface): boolean {
  const adjustedIngredient = adjustedRecipeItems.value.find(
    (item) => item.item.id === ingredient.item.id
  )

  if (!adjustedIngredient) return false

  const fridgeItem = fridgeItems.value.find(
    (item) => item.item.id === adjustedIngredient.item.id
  )

  if (fridgeItem) {
    return fridgeItem.quantity >= adjustedIngredient.quantity
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

          // Uncheck the added items
          recipeItems.value.forEach((ingredient) => {
            if (!ingredientAvailable(ingredient) && !inShoppingList(ingredient)) {
              ingredient.selected = false
            }
          })
          // Uncheck the 'select all' checkbox
          selectAllChecked.value = false
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

async function removeFromFridge () {
  const fridgeItemsToRemove = adjustedRecipeItems.value.filter(ingredient => ingredientAvailable(ingredient))
  const itemsData = fridgeItemsToRemove.map(item => ({
    itemId: item.item.id,
    quantity: (item.quantity)
  }))

  if (itemsData.length) {
    const path = 'http://localhost:8080/fridge/remove/byRecipe'
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }

    await axios.post(path, itemsData, config)
      .then(async (response) => {
        if (response.status === 200) {
          console.log('All items removed from the fridge')
          // Refresh the fridge items
          fetchFridgeItems()
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

</script>

<style scoped>
.checkbox-cell{
  width: 1%;
  white-space: nowrap;
}
.container {
  display: flex;
  margin-top: 100px;
  border: 2px;
  flex-direction: column;
  background-color: lightblue;
}

.recipe-info {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
  background-color: lightgreen;
}

.title {
  padding: 20px;
  color: #25A13A;
  border-bottom-color: black;
}

.icon {
  width: 150px;
  height: 150px;
  margin: 10px;
  font-size: 30px;
  text-align: center;
  line-height: 50px;
}

.ingredients{
  display: flex;
  flex-direction: column;
  margin: 0px;
  background-color: lightyellow;
}

.edit-quantity-div {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0px;
  background-color: lightpink;
}

.instructions{
  background-color: red;
  width: 40%;
}

.image-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgb(9, 134, 175);
}

.recipe-image {
  margin-left: auto;
  margin-right: auto;
  width: 90%;
  height: 90%;
  aspect-ratio: 1/1;
}

.recipe-steps {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  background-color: magenta;
}

.recipe-stats {
  display: grid;
  grid-template: auto / auto auto auto;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  background-color: lightpink;
}

.portion-stats {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  background-color: lightpink;

}

.portion-number {
  font-size: 34px;
  margin-right: 20px;
  margin-left: 20px;
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
  background-color: #ffffff;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

</style>

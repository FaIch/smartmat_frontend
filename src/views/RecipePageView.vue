<template>
  <div v-if="recipe" class="container">
    <h1 class="title">{{ recipe.name }}</h1>
    <div class="recipe-info">
      <div class="image-container">
        <img class="recipe-image" :src="recipe.image" alt="">
      </div>
      <div class="recipe-stats">
        <div class="portion-stats">
          <h2 for="portions" class="recipe-title">Porsjoner</h2>
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
          <h2 class="recipe-title">Beregned tid</h2>
          <img src="../assets/icons/clock.svg" class="icon"/>
          <div class="portion-number">{{ recipe.estimatedTime }}</div>
        </div>
      </div>
    </div>
    <div class="recipe-steps">
      <div class="ingredients">
        <h2 class="recipe-title">Ingredients</h2>
        <div class="buttons">
          <button @click="addAllToShoppingList">Legg til i handlelista</button>
          <button @click="removeFromFridge">Jeg har laget denne oppskriften</button>
        </div>
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
import { useRecipeStore } from '../stores/RecipeStore'
import api from '../utils/httputils'
import { RecipeInterface, RecipeIngredientInterface, ShoppingListItemCardInterface, FridgeItemCardInterface, ShoppingListItem } from '../components/types'

const recipeStore = useRecipeStore()
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
  const path = `/recipe/${recipeId.value}`
  await api.get(path)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('success')
        console.log(response.data)
        recipe.value = response.data
        console.log(recipe.value?.description)
      }
    })
    .catch((error) => {
      if (error.response.status === 401) {
        userStore.logout()
      }
      console.log(error.response.data.message)
    })
}

async function fetchRecipeItems () {
  const path = `/recipe/recipe-items/${recipeId.value}`

  await api.get(path)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('success')
        console.log(response.data)
        recipeItems.value = response.data
      }
    })
    .catch((error) => {
      if (error.response.status === 401) {
        userStore.logout()
      }
      console.log(error)
    })
}

async function fetchShoppingList () {
  const path = '/shopping-list/get'
  await api.get(path)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('Shopping list:')
        console.log(response.data)
        shoppingList.value = response.data
      }
    })
    .catch((error) => {
      if (error.response.status === 401) {
        userStore.logout()
      }
      console.log(error)
    })
}

async function fetchFridgeItems () {
  const path = '/fridge/get'
  await api.get(path)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('Fridge')
        console.log(response.data)

        // Aggregate the quantities of items with the same ID
        const aggregatedFridgeItems: FridgeItemCardInterface[] = response.data.reduce((acc: FridgeItemCardInterface[], item: FridgeItemCardInterface) => {
          const existingItemIndex = acc.findIndex((accItem: FridgeItemCardInterface) => accItem.item.id === item.item.id)

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
      if (error.response.status === 401) {
        userStore.logout()
      }
      console.log(error)
    })
}

function toggleSelectedItem (ingredient: RecipeIngredientInterface) {
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
    const path = '/shopping-list/add'
    await api.post(path, checkedProductsData)
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
        if (error.response.status === 401) {
          userStore.logout()
        }
        console.log(error)
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
    const path = '/fridge/remove/byRecipe'

    await api.post(path, itemsData)
      .then(async (response) => {
        if (response.status === 200) {
          console.log('All items removed from the fridge')
          // Refresh the fridge items
          fetchFridgeItems()
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          userStore.logout()
        }
        console.log(error)
      })
  }

  if (recipeStore.getHasWeekMenu() && recipe.value && recipeStore.getRecipeIds().includes(recipe.value.id)) {
    console.log('eaten ' + recipe.value.id)
    recipeStore.getRecipeIdsCompleted().push(recipe.value.id)
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
  line-height: 50px;
}

.ingredients{
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  width: min(100%, 800px);
}

.edit-quantity-div {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0px;
}

.instructions{
  margin: auto;
  margin-top: 30px;
}

.image-container {
  display: flex;
  align-self: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  flex-grow: 9999;
  max-width: min(90%, 500px);
}

.recipe-image {
  margin-left: auto;
  margin-right: auto;
  width: 90%;
  height: 90%;
  aspect-ratio: 1/1;
  border: black;
  border-style: solid;
}

.recipe-steps {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
}

.recipe-stats {
  display: flex;
  flex-direction: row;
  flex: 1 1 0px;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  justify-content: center;
  gap: 10%;
}

.recipe-info {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;

}

.portion-stats {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-right: 20px;
  justify-content: center;
  align-items: center;
}

.estimated-time-stats {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-right: 20px;
  justify-content: center;
  align-items: center;
}
.portion-number {
  font-size: 34px;
  margin-right: 20px;
  margin-left: 20px;
}

.buttons {
  display: flex;
  flex-direction: row;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  justify-content: space-evenly;
}

button {
  width: 40%;
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

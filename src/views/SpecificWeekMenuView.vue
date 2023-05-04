<template>
  <div class="container" v-if="menu">
    <h1 class="title">Din ukemeny </h1>
    <p> Ukes menyen består av fem ulike retter. Du kan klikke deg inn på hver rett for mer informasjon.</p>
    <br>
    <div class="recipe-row">
      <RecipeCardCompWeekMenu v-for="(recipe, index) in menu?.weekMenuRecipes" :key="index" :recipe="recipe" @update-card="updateCard"/>
    </div>
    <div class="required-ingredients">
      <button @click="toggleDropdown">Toggle Ingredients</button>
      <div v-show="isDropdownOpen">
        <button @click="addAllToShoppingList">Legg til handlelist</button>
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
  </div>
  </div>
</template>

<script setup lang="ts">
// TODO: hvorfor forsvinner på refresh?!

import { computed, onMounted, ref, watch } from 'vue'
import api from '../utils/httputils'
import { useUserStore } from '../stores/UserStore'
import { ShoppingListItem, MenuInterface, RecipeIngredientInterface, ShoppingListItemCardInterface, FridgeItemCardInterface } from '../components/types'
import RecipeCardCompWeekMenu from '../components/RecipeCardCompWeekMenu.vue'
import router from '../router'
const userStore = useUserStore()
const isDropdownOpen = ref(false)
const isButtonClicked = ref(false)
const menu = ref<MenuInterface>()
const recipeItems = ref<RecipeIngredientInterface[]>([])
const shoppingList = ref<ShoppingListItemCardInterface[]>([])
const fridgeItems = ref<FridgeItemCardInterface[]>([])
const selectAllChecked = ref(false)
const portions = ref(4)
const selectedItems = ref<ShoppingListItem[]>([])

// const selectedItems = ref<ShoppingListItem[]>([])

onMounted(() => {
  fetchData()
})

async function fetchData () {
  getWeekMenu()
  getShoppingList()
  getFridgeItems()
}

const updateCard = () => {
  // Update your data here, e.g., fetch the new data from the API
  fetchData()
}

const adjustedRecipeItems = computed(() => {
  return recipeItems.value.map((ingredient) => {
    const adjustedQuantity = Math.ceil((ingredient.quantity * (portions.value / 4)))
    return {
      ...ingredient,
      quantity: adjustedQuantity
    }
  })
})

async function getWeekMenu () {
  const path = '/week-menu/get'
  await api.get(path)
    .then(async (response) => {
      if (response.status === 200) {
        console.log(response.data)
        menu.value = response.data
        getIngredientList()
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

async function getIngredientList () {
  const path = '/week-menu/get-recipes-items'
  const body = menu.value?.weekMenuRecipes.map((recipe) => recipe.recipe.id)
  console.log(body)
  await api.post(path, body)
    .then(async (response) => {
      if (response.status === 200) {
        console.log(response.data)
        recipeItems.value = response.data
        console.log(recipeItems.value)
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

async function getShoppingList () {
  const path = '/shopping-list/get'
  await api.get(path)
    .then(async (response) => {
      if (response.status === 200) {
        shoppingList.value = response.data
        console.log(response.data)
      }
    })
    .catch((error) => {
      if (error.response.status === 401) {
        userStore.logout()
      }
      console.log(error)
    })
}

async function getFridgeItems () {
  const path = '/fridge/get'
  await api.get(path)
    .then(async (response) => {
      if (response.status === 200) {
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
        console.log(fridgeItems.value)
      }
    })
    .catch((error) => {
      if (error.response.status === 401) {
        userStore.logout()
      }
      console.log(error)
    })
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
          getShoppingList()
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

function toggleDropdown () {
  isDropdownOpen.value = !isDropdownOpen.value
}

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
}

.title {
  padding: 20px;
}

.dark-green {
  opacity: 0;
}

.recipe-row {
  display: flex;
  direction: column;
  flex-wrap: wrap;
  justify-content: center;
}

@media screen and (max-width: 768px) {
  .recipe-row {
    flex-direction: column;
    align-items: center;
  }
}

.button {
  background-color: #1A7028;
  color: white;
  height: 40px;
  width: 200px;
  border-radius: 100px;
  border: none;
  margin: 0;
  padding: 0;
  z-index: 0;
  margin-left: 10px;
}

a {
  display: block;
  text-decoration: none;
  color: inherit;
}

.recipe-items-fridge p {
  margin-bottom: 0;
  color: black;
}
</style>

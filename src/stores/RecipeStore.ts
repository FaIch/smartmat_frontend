import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRecipeStore = defineStore('recipeStore', () => {
  const recipeIds = ref<number[]>([])

  function setRecipeIds (ids: number[]) {
    recipeIds.value = ids
  }

  function getRecipeIds () {
    return recipeIds.value
  }

  return {
    setRecipeIds,
    getRecipeIds
  }
})

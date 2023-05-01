import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useRecipeStore = defineStore('recipeStore', () => {
  const recipeIds = ref<number[]>([])
  const type = ref('')
  const weekMenu = ref<boolean>(false)

  function setRecipeIds (ids: number[]) {
    recipeIds.value = ids
  }

  function getRecipeIds () {
    return recipeIds.value
  }

  function getType () {
    return type.value
  }

  function setType (value: string) {
    type.value = value
  }

  async function checkForWeekMenu () {
    const path = 'http://localhost:8080/week-menu/check-for-week-menu'
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }
    await axios.get(path, config)
      .then(async (response) => {
        if (response.status === 200) {
          console.log(response.data.checkForWeekMenu)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          console.log('error')
        } else if (error.response.status === 600) {
          console.log('wat')
        }
      })
  }

  return {
    setRecipeIds,
    getRecipeIds,
    checkForWeekMenu,
    getType,
    setType,
    weekMenu
  }
})

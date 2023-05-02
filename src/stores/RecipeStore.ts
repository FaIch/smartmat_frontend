import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { WeekMenu } from '../components/types'

export const useRecipeStore = defineStore('recipeStore', () => {
  const recipeIds = ref<number[]>([])
  const type = ref('')
  const hasWeekMenu = ref<boolean>(false)
  const weekMenu = ref<WeekMenu[]>([])

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
  function setHasWeekMenu (value: boolean) {
    hasWeekMenu.value = value
  }

  function getHasWeekMenu () {
    return hasWeekMenu.value
  }
  function getWeekMenu () {
    return weekMenu.value
  }
  function setWeekMenu (newWeekMenu: WeekMenu[]) {
    weekMenu.value = newWeekMenu
  }
  // TODO: exception if week menu not in db but that should not be exception...
  async function checkForWeekMenu () {
    const path = 'http://localhost:8080/week-menu/get'
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }
    await axios.get(path, config)
      .then(async (response) => {
        if (response.status === 200) {
          const weekMenuData = response.data
          setType(weekMenuData.type)
          setHasWeekMenu(true)
          const recipeIdsData = Object.values(weekMenuData)
            .slice(1)
            .map((recipe: any) => recipe?.id)
            .filter((id: any) => id !== null)

          setRecipeIds(recipeIdsData)
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
    getHasWeekMenu,
    setHasWeekMenu,
    getWeekMenu,
    setWeekMenu
  }
})

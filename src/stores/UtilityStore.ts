import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUtilityStore = defineStore('utilityStore', () => {
  const transparent = ref(true)
  const showItems = ref(true)

  function setTransparentStatus (status: boolean) {
    transparent.value = status
  }

  function hideItems (status: boolean) {
    showItems.value = status
  }

  return { transparent, showItems, setTransparentStatus, hideItems }
},
{
  persist: true
})

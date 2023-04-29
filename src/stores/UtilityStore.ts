import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUtilityStore = defineStore('utilityStore', () => {
  const showItems = ref(true)

  function hideItems (status: boolean) {
    showItems.value = status
  }

  return { showItems, hideItems }
},
{
  persist: true
})

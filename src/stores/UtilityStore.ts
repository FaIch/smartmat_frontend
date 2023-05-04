import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUtilityStore = defineStore('utilityStore', () => {
  const navBarItems = ref(false)

  function hideItems () {
    navBarItems.value = false
  }
  function showItems () {
    navBarItems.value = true
  }

  return { showItems, hideItems, navBarItems }
},
{
  persist: true
})

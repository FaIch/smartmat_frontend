<template>
  <!-- Tab content -->
  <div id="Login" class="tabcontent">
    <label for="username"> Brukernavn: </label>
    <input
      type="text"
      id="username"
      aria-required="true"
      data-ok="false"
      placeholder="Skriv brukernavn her..."
      v-model="username"
    />
    <p></p>
    <label for="pass"> Passord: </label>
    <input
      type="password"
      id="pass"
      aria-required="true"
      data-ok="false"
      placeholder="Skriv passord her..."
      v-model="password"
    />
    <p></p>
    <button id="loginbutton">Logg inn</button>
  </div>
</template>

<script setup lang="ts">
// import { login, createuser } from "../utils/loginutils"
import { ref, onMounted, onUnmounted } from 'vue'
import { useUtilityStore } from '../stores/UtilityStore'

const store = useUtilityStore()
const username = ref('')
const password = ref('')

function setTransparentStatus () {
  if (window.scrollY > 80) {
    store.setTransparentStatus(false)
  } else {
    store.setTransparentStatus(true)
  }
}
onMounted(() => {
  window.addEventListener('scroll', setTransparentStatus)
  store.setTransparentStatus(false)
})

onUnmounted(() => {
  window.removeEventListener('scroll', setTransparentStatus)
  store.setTransparentStatus(false)
})

</script>

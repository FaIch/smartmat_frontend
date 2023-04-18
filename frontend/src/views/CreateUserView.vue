<template>
  <div id="Registry" class="tabcontent">
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
    <label for="pass"> Skriv passordet på nytt: </label>
    <input
      type="password"
      id="pass"
      aria-required="true"
      data-ok="false"
      placeholder="Skriv passord her..."
      v-model="confirmPassword"
    />
    <p></p>
    <button id="loginbutton">Lag bruker</button>
  </div>
</template>

<script setup lang="ts">
// import { login, createuser } from '../utils/loginutils'
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')

</script>

<style></style>

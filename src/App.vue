<template>
  <navbar-comp />
  <router-view />
</template>

<script setup lang="ts">
import NavbarComp from './components/NavbarComp.vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  background-color: rgb(224, 224, 224);
}

body,html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
}

body {
  overflow-y: scroll;
}

* {
    box-sizing: border-box;
}
</style>

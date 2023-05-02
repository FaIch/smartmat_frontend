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

::-webkit-scrollbar {
  background-color: black;
}

::-webkit-scrollbar-track {
  background-color: rgb(224, 224, 224); /* Background color of the scrollbar track */
}

::-webkit-scrollbar-thumb {
  background-color: #555; /* Background color of the scrollbar thumb */
}

::-webkit-scrollbar-thumb:hover {
  background-color: #888; /* Background color of the scrollbar thumb when hovered */
}

* {
  box-sizing: border-box;
}
</style>

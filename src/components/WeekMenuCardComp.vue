<template>
  <div class="menu-card">
    <img class="menu-image" :src="props.weekMenu.firstRecipeImage" alt="">
    <div class="menu-details">
      <h2 class="menu-title-type">{{ props.weekMenu.type}}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WeekMenuCardInterface } from '../components/types'

const props = defineProps({
  weekMenu: {
    type: Object as () => WeekMenuCardInterface,
    required: true
  }
})
</script>

<style scoped>
.menu-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  width: 300px;
  height: 280px;
  cursor: pointer;
  border: solid 2px black;
}

.menu-card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}

.menu-image {
  width: 100%;
  max-height: 200px;
  border-bottom: solid 2px black;
}

.menu-details {
  background-color: #fff;
  align-content: center;
  height: 100%;
}

.menu-title-type {
  margin-top: 10px;
  padding: 0;
  font-size: 20px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  width: 100%;
  height: 100%;
}

</style>

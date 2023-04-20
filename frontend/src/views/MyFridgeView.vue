<template>
  <div class="fridge-container">
    <div class="task-bar">
      <h1>Mitt kjøleskap</h1>
      <h1>|</h1>
      <h1>Utgåtte varer</h1>
    </div>
    <div class="my-fridge">
      <SearchBarComp id="search-bar"/>
      <div class="item-cards">
        <IngredientItemCardComp />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchBarComp from '@/components/SearchBarComp.vue'
import IngredientItemCardComp from '@/components/IngredientItemCardComp.vue'
</script>

<style scoped>
.fridge-container {
  display: flex;
  flex-direction: column;
  padding-top: 15vh;
  height: 100vh;
}

.task-bar {
  display: flex;
  justify-content: center;
  background-color: white;
  height: 100px;
  width: 100%;
}

#search-bar{
    position: relative;
    text-align: center;
    left: 25%;
    margin-top: 10px;
    color: black;
    width: 50%;
    max-width: 1000px;
    z-index: 3;
    scale: 0.8;
}

.item-cards {
  background-color: wheat;
  display: flex;
  justify-content: center;
}
</style>

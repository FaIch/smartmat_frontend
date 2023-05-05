<template>
  <div class="recipe-container">
    <div class="recipe-card" @click="goToRecipe(props.recipe.recipe.id)">
      <img class="recipe-image" :src="props.recipe.recipe.image" alt="">
      <div class="recipe-details">
        <div class="recipe-details-top">
          <h2 class="recipe-title">{{ props.recipe.recipe.name }}</h2>
        </div>
        <div class="recipe-details-bot">
          <div class="recipe-time">
            <h4>{{ props.recipe.recipe.estimatedTime }}</h4>
          </div>
        </div>
      </div>
    </div>
    <div class="completed-overlay" v-if="props.recipe.completed">
      <i class="fas fa-check completed-checkmark"></i>
    </div>
    <div class="recipeButtons">
      <button class="prepared checkmark-icon" @click="prepared" v-if="props.recipe.completed"><i class="fas fa-check"></i></button>
      <button class="prepared checkmark-icon" @click="prepared" v-else><i class="fas fa-check"></i></button>
      <button class="reroll refresh-icon" @click="reroll"><i class="fas fa-sync"></i></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WeekMenuRecipeInterface } from './types'
import router from '../router/index'
import api from '../utils/httputils'

const emits = defineEmits(['update-card'])

const props = defineProps({
  recipe: {
    type: Object as () => WeekMenuRecipeInterface,
    required: true
  }
})

const goToRecipe = (id: number) => {
  router.push({
    name: 'recipe',
    params: { id },
    query: {
      myProp: props.recipe.id
    }
  })
}

async function prepared () {
  console.log(props.recipe.completed)
  const path = `/week-menu/${props.recipe.id}/toggle-completed`
  api.put(path)
    .then((response) => {
      console.log(response)
      emits('update-card')
    })
    .catch((error) => {
      console.log(error)
    })
}

async function reroll () {
  const path = `/week-menu/reroll/${props.recipe.recipe.id}`
  api.put(path)
    .then((response) => {
      console.log(response)
      emits('update-card')
    })
    .catch((error) => {
      console.log(error)
    })
}

</script>

<style scoped>

.recipe-container {
  position: relative;
  display: inline-block;
}

.recipeButtons {
  display: flex;
  justify-content: space-between;
  width: 300px;
  margin-top: 15px;
}

.prepared, .reroll {
  width: 50%;
  height: 40px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkmark-icon i, .refresh-icon i {
  margin: 0;
}

.completed-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 280px; /* match the height of the recipe card */
  background-color: rgba(255, 255, 255, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.completed-checkmark {
  color: #1A7028;
  font-size: 48px;
}

.recipe-card {
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  max-width: 300px;
  max-height: 280px;
  cursor: pointer;
  margin: 15px;
}

.recipe-card.completed {
  position: relative;
}

.recipe-card.completed::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 255, 0, 0.75);
  z-index: 1;
}

.recipe-card.completed .recipe-image {
  filter: grayscale(100%);
}

.recipe-card.completed .recipe-title {
  color: #fff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
}

.recipe-card-saved-menu {
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  max-width: 300px;
  max-height: 310px;
  cursor: pointer;
  margin: 15px;
}

.recipe-card:hover {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
}

.recipe-image {
  width: 100%;
  max-height: 150px;
}

.recipe-details {
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.recipe-details-top {
  height: 60px;
  width: 300px;
  padding-top: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
}

.recipe-title {
  margin: 0;
  padding: 0;
  font-size: 16px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  width: 200px;
  height: 100%;
  text-align: center;
}

.recipe-warning {
  display: flex;
  height: 60px;
  position: absolute;
  right: 0;
  top: 0;
  margin-right: 10px;
}

.recipe-warning h5 {
  font-size: 16px;
  align-self: center;
  margin: 0;
  padding: 0;
  margin-top: 6px;
  margin-left: -12px;
}

.recipe-warning img {
  scale: 0.6;
  padding-top: 10px;
}

.recipe-details-bot{
  display: flex;
  justify-content: space-between;
  height: 60px;
  padding: 10px;
}

.recipe-time {
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
}

.recipe-time h4 {
  padding: 0;
  margin: 0;
  font-size: 17px;
}

.recipe-missing {
  margin-right: 10px;
  height: 36px;
  width: 120px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
}

.recipe-missing h5 {
  margin: 0;
  margin-top: 1px;
  padding: 0;
  font-size: 15px;
  text-align: right;
}

.recipe-alerts {
  display: grid;
}

.green-border {
  border: 2px solid green;
}

.completed {
  border: solid 2px red;
}
</style>

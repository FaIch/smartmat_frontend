<template>
  <div class="recipe-container">
    <div v-if="userStore.role === Role.PARENT" class="buttons">
      <div v-tippy="'Bytt med tilfeldig'" class="reroll" v-if="!props.recipe.completed">
        <img
          src="../assets/icons/refresh.svg"
          class="refresh-icon"
          @click="reroll"/>
      </div>
      <div v-tippy="'Marker som lagd'" class="checkmark" v-if="!props.recipe.completed">
        <img
          src="../assets/icons/check.svg"
          class="checkmark-icon"
          @click="prepared">
      </div>
    </div>
    <div class="recipe-card" @click="handleClick()">
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
        <div class="completed-overlay" v-if="props.recipe.completed">
         <img
          src="../assets/icons/check.svg"
          class="marked-completed"
          >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WeekMenuRecipeInterface, Role } from './types'
import router from '../router/index'
import api from '../utils/httputils'
import { useUserStore } from '../stores/UserStore'
const emits = defineEmits(['update-card'])
const userStore = useUserStore()
const handleClick = () => {
  if (!props.recipe.completed) {
    goToRecipe(props.recipe.recipe.id)
  }
}

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
  const path = `/week-menu/${props.recipe.id}/toggle-completed`
  api.put(path)
    .then(() => {
      emits('update-card')
    })
    .catch((error) => {
      if (error.response.status === 401) {
        userStore.logout()
      }
    })
}
async function reroll () {
  const path = `/week-menu/reroll/${props.recipe.recipe.id}`
  api.put(path)
    .then(() => {
      emits('update-card')
    })
    .catch((error) => {
      if (error.response.status === 401) {
        userStore.logout()
      }
    })
}
</script>

<style scoped>

.recipe-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.buttons {
  display: flex;
  flex-direction: row;
  height: 40px;
}

.checkmark {
  margin-left: 30px;
}

.reroll ,
.checkmark {
  width: 40px;
  height: 40px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-icon ,
.checkmark-icon {
  width: 40px;
  cursor: pointer;
}

.completed-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.4);
  cursor:auto;
}

.marked-completed {
  position: absolute;
  top: 0;
  right: 0;
}

.completed-checkmark {
  color: #1A7028;
  font-size: 48px;
}

.recipe-card {
  position: relative;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  max-width: 300px;
  max-height: 280px;
  cursor: pointer;
  margin-top: 15px;
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

@media only screen and (max-width: 400px) {
  .recipe-container {
    scale: 0.9;
  }
}

@media only screen and (max-width: 300px) {
  .recipe-container {
    scale: 0.8;
  }
}
</style>

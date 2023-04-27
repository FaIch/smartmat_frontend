<template>
  <div class="recipe-card">
    <img class="recipe-image" :src="props.recipe.recipe.image" alt="">
    <div class="recipe-details">
      <div class="recipe-details-top">
        <h2 class="recipe-title">{{ props.recipe.recipe.name }}</h2>
        <div class="recipe-warning">
          <img v-show="props.recipe.amountNearlyExpired > 0" src="../assets/icons/warning.svg"/>
          <h3>{{ props.recipe.amountNearlyExpired }}</h3>
        </div>
      </div>
      <div class="recipe-details-bot">
        <div class="recipe-time">
          <h4>{{ props.recipe.recipe.estimatedTime }}</h4>
        </div>
        <div class="recipe-missing">
          <h5> {{ missingIngredients }} </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RecipeCardInterface } from './types'
import { computed } from 'vue'

const props = defineProps({
  recipe: {
    type: Object as () => RecipeCardInterface,
    required: true
  }
})

const missingIngredients = computed(() => {
  console.log('yo', props.recipe.amountNearlyExpired)
  const numberMissing = props.recipe.recipe.numberOfItems - props.recipe.amountInFridge
  if (numberMissing === 0) {
    return 'Du har alt'
  } else {
    return `Du mangler ${numberMissing} ingredienser`
  }
})

</script>

<style scoped>

.recipe-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  width: 300px;
  height: 280px;
  cursor: pointer;
}

.recipe-card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  scale: 1.005;
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

.recipe-warning h3 {
  font-size: 20px;
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
</style>

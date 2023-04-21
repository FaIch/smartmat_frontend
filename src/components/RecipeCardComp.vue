<template>
  <div class="recipe-card">
    <a href="recipe.html">
      <!--<img class="recipe-image" :src="recipe.imageUrl" />-->
      <img class="recipe-image" src="../assets/pexels-alleksana-5949902.jpg" />
      <div class="recipe-details">
        <h2 class="recipe-title"><b>{{ dishName }}</b></h2>
        <h4 class="recipe-comment">{{ dishComment }}</h4>
        <p class="recipe-time-and-info">{{ dishTime }}, {{ missingIngredients }}</p>
        <button class="recipe-button">Gå til oppskrift</button>
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">

// imageUrl: string - TODO: fix image path problem
const dishName = 'Lasagne'
const dishComment = 'm/saus'
const dishTime = '40 min'
const missingIngredients = 'Mangler 2 ingredienser'
</script>

<style scoped>
a {
  display: block;
  text-decoration: none;
  color: inherit;
}

.recipe-card {
  display: grid;
  grid-template-areas:
    "recipe-image"
    "recipe-details";
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.recipe-image {
  width: 100%;
}

.recipe-details {
  display: grid;
  grid-template-areas:
    "recipe-title"
    "recipe-comment"
    "recipe-time recipe-button";
  background-color: #fff;
}

.recipe-title {
  margin-top: 0;
  margin-bottom: 2px;
  font-size: 24px;
  font-weight: bold;
}

.recipe-comment {
  margin-top: 0;
}

.recipe-time-and-info p {
  margin-bottom: 0;
}

.recipe-button {
  background-color: #1A7028;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border-radius: 10px;
  transition: background-color 0.2s ease-in-out;
  margin-top: 0;
  margin-bottom: 10px;
  margin-left: 10px;
  margin-right: 10px;
  padding: 6px
}

.recipe-button:hover {
  background-color: #25A13A;
}
</style>

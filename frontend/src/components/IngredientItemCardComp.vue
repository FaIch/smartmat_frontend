<template>
  <div class="card-container">
    <div class="item-image">
      <img
        src="../assets/logo.png"
        />
    </div>
    <div v-if="true" class="fridge-item">
      <div class="fridge-item-info">
        <h1>Karbonadedeig</h1>
        <h2>Utløpsdato: Imorgen</h2>
      </div>
      <div class="fridge-item-info">
        <h2>400g</h2>
        <h2>Antall: 1</h2>
      </div>
    </div>
    <div v-if="false" class="shopping-list-item"></div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>

.card-container {
  height: 180px;
  width: 40%;
  background-color: red;
  justify-self: center;
  align-self: center;
  display: flex;
  flex-direction: row;
}

.item-image{
  max-width: 30%;
  min-width: 30%;
  justify-content: center;
  display: flex;
  overflow: hidden;
}

.item-image img {
  width: 100%;
}

.fridge-item {
  display: flex;
}

.fridge-item-info {
  display: grid;
  margin: 0;
  padding: 0;
  margin-left: 10px;
}

@media screen and (max-width: 1000px) {
  .card-container {
    flex-direction: column;
  }
}

</style>

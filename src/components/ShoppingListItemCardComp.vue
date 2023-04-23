<template>
  <div class="card">
    <img src="../assets/kanelboller.png" class="card-img-top" alt="...">
    <div class="card-body">
      <div class="text-section-one" id="shopping-list-section-one">
        <h5 class="card-title">{{ props.product.name }}</h5>
        <div class="shopping-list-quantity-div">
          <img
            src="../assets/icons/remove.svg"
            />
          <input class="input-field" :disabled="true" :placeholder="quantity" id="shopping-list-quantity"/>
          <img
            src="../assets/icons/add.svg"
            />
        </div>
      </div>
      <div class="text-section-two">
        <h5 class="card-title" id="shopping-list-item-unit">{{ itemUnit }}</h5>
      </div>
      <div class="text-section-three" id="shopping-list-check">
        <input
          id="shopping-list-item-checkbox"
          type="checkbox"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'

interface props {
  product: object;
}

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const itemName = ref('Karbonadedeig')
const itemUnit = ref('400g')
const quantity = ref('4')

</script>

<style scoped>

.shopping-list-quantity-div {
  display: flex;
}
#shopping-list-quantity{
  width: 80px;
  height: 40px;
}

#shopping-list-section-one {
  display: grid;
}

#shopping-list-item-unit {
  margin-top: 3px;
}
#shopping-list-check {
  justify-content: center;
}

#shopping-list-item-checkbox {
  margin: 0 20px 0 0;
  padding: 0;
  width: 20px;
  height: 20px;
}

.card-title {
  font-size: 22px;
  font-weight: bold;
}
.input-field {
  width: 80%;
  border-radius: 20px;
  text-align: center;
}

.card {
  max-width: 550px;
  flex-direction: row;
  background-color: rgba(35, 173, 58, 0.3);
  border: 0;
  box-shadow: 0 7px 7px rgba(0, 0, 0, 0.18);
  margin: 3em auto;
}

.card img {
  max-width: 25%;
  margin: auto;
  padding: 0.5em;
  border-radius: 0.7em;
}

.card-body {
  display: flex;
  padding: 30px 0 30px 0;
  align-items: center;
}

.text-section-one,
.text-section-two {
  max-width: 50%;
  position: relative;
  height: 100%;
  align-items: center;
  justify-content: space-between;
}

.text-section-two {
  min-width: 20%;
  text-align: right;
}
.text-section-three {
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  padding-right: 15px;
}

</style>

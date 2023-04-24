<template>
<div class="card">
    <img src="../assets/kanelboller.png" class="card-img-top" alt="...">
    <div class="card-body">
      <div class="text-section-one">
        <h5 class="card-title">{{ $props.product.item.name }}</h5>
        <div class="expiration-date-div">
          <p class="card-text">Utløpsdato:</p>
          <input class="input-field" :disabled="true" :placeholder="props.product.expirationDate" id="expiration-date"/>
        </div>
      </div>
      <div class="text-section-two">
        <h5 class="card-title">{{ props.product.item.weight }}</h5>
        <div class="quantity-div">
          <p class="card-text">Antall:</p>
          <input class="input-field" :disabled="true" :placeholder="props.product.quantity.toString" id="quantity"/>
        </div>
      </div>
      <div class="text-section-three">
        <input
          id="fridge-item-checkbox"
          type="checkbox"
        />
        <a href="#" class="btn btn-dark">Rediger</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { defineProps } from 'vue'
import { FridgeItemCardInterface } from './types'

const props = defineProps({
  product: {
    type: Object as () => FridgeItemCardInterface,
    required: true
  }
})

</script>

<style scoped>
.expiration-date-div {
  display: grid;
  text-align: left;
  position: absolute;
  bottom: 0;
}

.quantity-div {
  display: grid;
  position: absolute;
  right: 0;
  bottom: 0;
}

#fridge-item-checkbox {
  margin: 0;
  padding: 0;
  width: 20px;
  height: 20px;
}

.card-title {
  font-size: 22px;
  font-weight: bold;
}
.card-text {
  margin: 0;
}

.input-field {
  width: 80%;
  border-radius: 20px;
  text-align: center;
}

#quantity {
  justify-self: right;
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

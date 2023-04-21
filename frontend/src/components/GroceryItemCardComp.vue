<template>
  <div v-if="fridgeView" class="card">
    <img src="../assets/kanelboller.png" class="card-img-top" alt="...">
    <div class="card-body">
      <div class="text-section-one">
        <h5 class="card-title">Karbonadedeig</h5>
        <div class="expiration-date-div">
          <p class="card-text">Utløpsdato:</p>
          <input class="input-field" :disabled="true" :placeholder="expirationDate" id="expiration-date"/>
        </div>
      </div>
      <div class="text-section-two">
        <h5 class="card-title">400g</h5>
        <div class="quantity-div">
          <p class="card-text">Antall:</p>
          <input class="input-field" :disabled="true" :placeholder="quantity" id="quantity"/>
        </div>
      </div>
      <div class="text-section-three">
        <input
          id="item-checkbox"
          type="checkbox"
        />
        <a href="#" class="btn btn-dark">Rediger</a>
      </div>
    </div>
  </div>
  <div v-if="shoppingCartView" class="card">
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fridgeView = ref(true)
const shoppingCartView = ref(false)
const expirationDate = ref('23.05.23')
const quantity = ref('1')
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

#item-checkbox {
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

/* Code from: https://codepen.io/codingyaar/pen/ZEqEpem */
/* Taken from date: 21.04.23 */
.card {
  max-width: 600px;
  flex-direction: row;
  background-color: rgba(35, 173, 58, 0.3);
  border: 0;
  box-shadow: 0 7px 7px rgba(0, 0, 0, 0.18);
  margin: 3em auto;
}

.card img {
  max-width: 30%;
  margin: auto;
  padding: 0.5em;
  border-radius: 0.7em;
}

.card-body {
  display: flex;
  padding: 30px 0 30px 0;
  align-items: center;
}
.text-section-one, .text-section-two {
  max-width: 50%;
  position: relative;
  height: 100%;
  align-items: center;
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

/* End of code from: https://codepen.io/codingyaar/pen/ZEqEpem */

</style>

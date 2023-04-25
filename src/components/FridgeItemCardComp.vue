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
        <button v-if="edit" id="edit-button" class="btn btn-dark" @click="activateEdit">Rediger</button>
        <button v-if="!edit" id="save-button" class="btn btn-dark" @click="activateSave">Lagre</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { defineProps, ref } from 'vue'
import { FridgeItemCardInterface } from './types'

const expirationDate = ref('expirationDate')
const quantity = ref(0)
const edit = ref(true)

const emit = defineEmits(['update'])

const props = defineProps({
  product: {
    type: Object as () => FridgeItemCardInterface,
    required: true
  }
})

const activateEdit = () => {
  const expirationDateInput = document.getElementById('expiration-date') as HTMLInputElement
  const quantityInput = document.getElementById('quantity') as HTMLInputElement

  expirationDateInput.disabled = false
  quantityInput.disabled = false
  expirationDateInput.focus()
  edit.value = false
  console.log(props)
}

const activateSave = () => {
  const expirationDateInput = document.getElementById('expiration-date') as HTMLInputElement
  const quantityInput = document.getElementById('quantity') as HTMLInputElement

  expirationDateInput.disabled = true
  quantityInput.disabled = true
  edit.value = true

  // Check if the values have been changed
  if (
    expirationDate.value !== props.product.expirationDate ||
    quantity.value !== props.product.quantity
  ) {
    // Emit the update event with the updated item data
    emit('update', {
      ...props.product,
      expirationDate: expirationDate.value,
      quantity: quantity.value
    })
  }
}

</script>

<style scoped>
.expiration-date-div {
  display: grid;
  text-align: left;
  position: absolute;
  bottom: 0;
}

#expiration-date {
  width: 120px;
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
  justify-self: left;
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
  position: relative;
  height: 100%;
  align-items: center;
  justify-content: space-between;
}

.text-section-one {
  min-width: 42%;
  max-width: 42%;
  text-align: left;
}

.text-section-two {
  min-width: 25%;
  max-width: 25%;
  text-align: left;
}

.text-section-three {
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

#edit-button {
  height: 40px;
  width: 90px;
}

#save-button {
  background-color: #1A7028;
  color: white;
  height: 40px;
  width: 90px;
}

#save-button:hover {
  transform: scale(1.1);
  background-color: #25A13A;
  box-shadow: 0px 15px 25px -5px rgba(darken(dodgerblue, 40%));
}

#edit-button:hover {
  transform: scale(1.1);
  box-shadow: 0px 15px 25px -5px rgba(darken(dodgerblue, 40%));
}

</style>

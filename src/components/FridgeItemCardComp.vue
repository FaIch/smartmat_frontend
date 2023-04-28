<template>
  <div class="card">
    <img :src=props.product.item.image class="card-img-top" alt="...">
    <div class="card-body">
      <div class="text-section-one">
        <h5 class="card-title" :style="{ fontSize: titleFontSize }">{{ props.product.item.name }}</h5>
        <div class="expiration-date-div">
          <p class="card-text">Utløpsdato:</p>
          <input type="date" class="input-field" :disabled="edit" id="expiration-date" v-model="expirationDate"
          ref="expirationDateInput"/>
        </div>
      </div>
      <div class="text-section-two">
        <h5 class="card-title">{{ props.product.item.weightPerUnit }}</h5>
        <div class="quantity-div">
          <p class="card-text">Antall:</p>
          <input class="input-field"
            :disabled="edit"
            v-model.number="quantity"
            id="quantity"
            ref="quantityInput"
          />
        </div>
      </div>
      <div class="text-section-three">
        <input
          id="fridge-item-checkbox"
          type="checkbox"
          v-model="selected"
          @change="onCheckboxChange"
        />
        <button v-if="edit" id="edit-button" class="btn btn-dark" @click="activateEdit">Rediger</button>
        <button v-if="!edit" id="save-button" class="btn btn-dark" @click="activateSave">Lagre</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, watch, computed } from 'vue'
import { FridgeItemCardInterface } from './types'

const edit = ref(true)
const emit = defineEmits(['update', 'selection-changed'])

const props = defineProps({
  product: {
    type: Object as () => FridgeItemCardInterface,
    required: true
  }
})

const titleFontSize = computed(() => {
  const length = props.product.item.name.length
  if (length <= 10) {
    return '1.8rem'
  } else if (length <= 20) {
    return '1.2rem'
  } else {
    return '1rem' // Smallest font size
  }
})

const expirationDate = ref(props.product.expirationDate)
const quantity = ref(props.product.quantity)
const selected = ref(false)
const expirationDateInput = ref<HTMLInputElement | null>(null)
const quantityInput = ref<HTMLInputElement | null>(null)

const activateEdit = () => {
  if (!expirationDateInput.value || !quantityInput.value) {
    return
  }
  expirationDateInput.value.disabled = false
  quantityInput.value.disabled = false
  expirationDateInput.value.focus()
  edit.value = false
}

const validateQuantity = (quantity: number) => {
  return quantity > 0
}

const activateSave = () => {
  if (!expirationDateInput.value || !quantityInput.value) {
    return
  }
  const isQuantityValid = validateQuantity(quantity.value)

  if (!isQuantityValid) {
    expirationDate.value = props.product.expirationDate
    quantity.value = props.product.quantity
    alert('Ugyldig antall.')
    return
  }

  expirationDateInput.value.disabled = true
  quantityInput.value.disabled = true
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

function onCheckboxChange () {
  emit('selection-changed', {
    selected: selected.value,
    product: props.product
  })
}

watch(
  () => props.product,
  (newProduct, oldProduct) => {
    if (newProduct !== oldProduct) {
      expirationDate.value = newProduct.expirationDate
      quantity.value = newProduct.quantity
    }
  },
  { deep: true }
)

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
  padding: 0;
  color: black;
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
  height: 160px;
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

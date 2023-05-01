<template>
  <div :class="cardClass" @click="toggleCheckbox">
    <div class="card-image">
      <img :src=props.product.item.image class="card-img-top" alt="...">
    </div>
    <div class="card-body">
      <div class="section-one">
        <h5 class="card-title" :style="{ fontSize: titleFontSize }">{{ props.product.item.name }}</h5>
        <div class="edits">
          <div class="expiration-date-div">
            <p class="card-text">Utløpsdato:</p>
            <input type="date" class="input-field" :disabled="edit" id="expiration-date" v-model="expirationDate"
            ref="expirationDateInput"/>
          </div>
          <div class="quantity-div">
            <p class="card-text">{{ unitType }}</p>
            <input class="input-field"
              :disabled="edit"
              v-model.number="quantity"
              id="quantity"
              ref="quantityInput"
            />
          </div>
        </div>
      </div>
      <div class="section-two">
        <input
          id="fridge-item-checkbox"
          type="checkbox"
          v-model="selected"
          @change="onCheckboxChange"
          :disabled="!edit"
        />
        <button v-if="edit" id="edit-button" class="btn btn-dark" @click="activateEdit">Rediger</button>
        <button v-if="!edit" id="save-button" class="btn btn-dark" @click.stop="activateSave">Lagre</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, watch, computed } from 'vue'
import { FridgeItemCardInterface, Unit } from './types'

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
  } else if (length <= 15) {
    return '1.5rem'
  } else if (length <= 20) {
    return '1.3rem'
  } else if (length <= 25) {
    return '1.1rem'
  } else {
    return '1rem' // Smallest font size
  }
})

const unitType = computed(() => {
  switch (props.product.item.unit) {
    case Unit.GRAMS:
      return 'Vekt (g)'
    case Unit.MILLILITER:
      return 'Mengde (mL)'
    case Unit.ITEM:
      return 'Antall'
    default:
      return ''
  }
})

const cardClass = computed(() => ({
  card: true,
  'card-checked': selected.value
}))

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

function toggleCheckbox (event: MouseEvent) {
  const isExpirationDateInput = (event.target as HTMLElement).closest('#expiration-date')
  const isQuantityInput = (event.target as HTMLElement).closest('#quantity')
  const isEditButton = (event.target as HTMLElement).closest('#edit-button')
  const isCheckbox = (event.target as HTMLElement) === document.getElementById('checkbox')

  if (edit.value) {
    if (!isEditButton && !isCheckbox && !isExpirationDateInput && !isQuantityInput) {
      selected.value = !selected.value
      onCheckboxChange()
    }
  }
}

</script>

<style scoped>
.expiration-date-div {
  display: grid;
  text-align: left;
}

#expiration-date {
  width: 120px;
}

.quantity-div {
  display: grid;
  justify-content: center;
  align-items: center;
}

#quantity {
  justify-self: center;
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
  text-align: left;
}

.card-text {
  margin: 0;
  padding: 0;
  color: black;
}

.input-field {
  width: 50%;
  border-radius: 20px;
  text-align: center;
}

.card {
  width: 550px;
  flex-direction: row;
  background-color: rgba(35, 173, 58, 0.3);
  height: 150px; /* Set a fixed height for the grid item */
  border: 0;
  box-shadow: 0 7px 7px rgba(0, 0, 0, 0.18);
  cursor: pointer;
}

.card-checked {
  background-color: rgba(35, 173, 58, 0.6);
}

.card-image {
  width: 35%;
  max-height: 150px; /* Increase max-height value */
  margin: auto;
  padding: 0.5em;
  border-radius: 0.7em;
  overflow: hidden;
}

.card-img-top {
  max-width: 100%;
  max-height: 140px;
  width: auto;
  height: auto;
  object-fit: contain;
}

.card-body {
  display: flex;
  padding: 30px 0 30px 0;
  align-items: center;
  height: 160px;
}

.section-one {
  position: relative;
  height: 100%;
  justify-content: space-between;
  min-width: 67%;
  max-width: 67%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
}

.edits {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

.section-two {
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

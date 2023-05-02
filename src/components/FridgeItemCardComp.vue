<template>
  <div :class="cardClass" @click="toggleCheckbox" :style="{cursor: disableCardPointer ? 'default' : 'pointer'}">
    <div
      v-tippy="'Kast i søpla'"
      class="trash-icon-container"
      :class="{ 'disable-hover': disableHover }"
      @click.stop="deleteCard"
    >
      <img src="../assets/icons/trash.svg" alt="Trash Icon" class="trash-icon" />
      <img src="../assets/icons/white-trash.svg" alt="Trash Icon Hover" class="trash-icon trash-icon-hover" />
    </div>
    <div
      v-tippy="'Marker som spist'"
      class="eaten-icon-container"
      :class="{ 'disable-hover': disableHover }"
      @click.stop="itemEaten"
    >
      <img src="../assets/icons/utensils.svg" alt="Eaten Icon" class="eaten-icon" />
      <img src="../assets/icons/white-utensils.svg" alt="Eaten Icon Hover" class="eaten-icon eaten-icon-hover" />
    </div>
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
      </div>
    </div>
    <div v-if="popup" class="popup">
      <div class="edits">
        <div class="popup-expiration-date-div">
          <p class="card-text">Utløpsdato:</p>
          <input type="date" class="input-field" id="expiration-date" v-model="expirationDate" ref="expirationDateInput" />
        </div>
        <div class="popup-quantity-div">
          <p class="card-text">{{ unitType }}</p>
          <input
            class="input-field"
            v-model.number="quantity"
            id="quantity"
            ref="quantityInput"
            @input="onQuantityChange"/>
        </div>
        <div class="outer-new-quantity-div">
          <div v-if="quantityChanged" class="popup-new-quantity-div">
            <p v-if="unitsReduced > 0">{{ unitsReduced }} {{ unit }}</p>
            <p v-if="unitsReduced > 0">fjernet.</p>
            <p v-if="unitsReduced < 0">{{ -unitsReduced }} {{ unit }}</p>
            <p v-if="unitsReduced < 0">lagt til.</p>
            <div class="buttons-div">
              <div class="checkboxes-div">
                <label v-if="checkboxDisabled">
                  <input
                    type="radio"
                    class="fridge-checkbox"
                    name="fridge-item-action"
                    v-model="action"
                    value="eaten"
                  />
                  Spist?
                </label>
                <label v-if="checkboxDisabled">
                  <input
                    type="radio"
                    class="fridge-checkbox"
                    name="fridge-item-action"
                    v-model="action"
                    value="thrown"
                  />
                  Kastet?
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="popup-save-button">
          <button
            id="save-button"
            class="btn btn-dark"
            @click.stop="activateSave"
            :disabled="saveButtonDisabled"
          >
            Lagre
          </button>
        </div>
      </div>
    </div>
    <div v-if="confirmEat || confirmThrow" class="confirm-popup">
      <div class="confirm-div">
        <p v-if="confirmThrow">Vil du markere '{{ product.item.name }}' som kastet?</p>
        <p v-if="confirmEat">Vil du markere '{{ product.item.name }}' som spist?</p>
        <button class="confirm-button confirm-yes-button" @click.stop="confirmAction">Ja</button>
        <button class="confirm-button confirm-no-button" @click.stop="cancelAction">Nei</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, watch, computed } from 'vue'
import { FridgeItemCardInterface, Unit } from './types'

const edit = ref(true)
const emit = defineEmits(['update', 'selection-changed', 'item-eaten', 'item-thrown', 'item-partially-thrown'])
const popup = ref(false)
const confirmThrow = ref(false)
const confirmEat = ref(false)
const unitsReduced = ref(0)
const quantityChanged = ref(false)
const disableHover = ref(false)
const disableCheckboxToggle = ref(false)
const disableCardPointer = ref(false)
const saveButtonDisabled = ref(false)
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
    return '1rem'
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

const unit = computed(() => {
  switch (props.product.item.unit) {
    case Unit.GRAMS:
      return 'g'
    case Unit.MILLILITER:
      return 'mL'
    case Unit.ITEM:
      return 'stk'
    default:
      return ''
  }
})

const checkboxDisabled = computed(() => {
  return (quantity.value < props.product.quantity) && quantityChanged
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
const action = ref('')

const activateEdit = () => {
  if (!expirationDateInput.value || !quantityInput.value) {
    return
  }
  expirationDateInput.value.disabled = false
  quantityInput.value.disabled = false
  expirationDateInput.value.focus()
  edit.value = false
  popup.value = true
}

const validateQuantity = (quantity: number) => {
  return quantity > 0 && quantity < 30000
}

const activateSave = () => {
  if (!expirationDateInput.value || !quantityInput.value) {
    return
  }
  const isQuantityValid = validateQuantity(quantity.value)
  console.log('Quantity', props.product.quantity)
  console.log('Base amount', props.product.item.baseAmount)
  console.log('Weight per unit', props.product.item.weightPerUnit)
  if (!isQuantityValid) {
    expirationDate.value = props.product.expirationDate
    quantity.value = props.product.quantity
    alert('Ugyldig antall.')
    return
  }

  expirationDateInput.value.disabled = true
  quantityInput.value.disabled = true
  edit.value = true

  if (
    expirationDate.value !== props.product.expirationDate ||
    quantity.value !== props.product.quantity
  ) {
    if (quantity.value < props.product.quantity) {
      if (action.value === 'thrown') {
        console.log(unitsReduced.value)
        emit('item-partially-thrown', {
          ...props.product,
          expirationDate: expirationDate.value,
          quantity: quantity.value
        },
        unitsReduced.value)
        unitsReduced.value = 0
      }
    } else {
      emit('update', {
        ...props.product,
        expirationDate: expirationDate.value,
        quantity: quantity.value
      })
    }
  }
  popup.value = false
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

watch(
  () => quantity.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      saveButtonDisabled.value = !action.value
    }
  }
)

watch(
  () => action.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      saveButtonDisabled.value = !newValue
    }
  }
)

function toggleCheckbox (event: MouseEvent) {
  if (disableCheckboxToggle.value) {
    return
  }
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

function disableToggleCheckbox () {
  disableCheckboxToggle.value = true
  disableCardPointer.value = true
}

function enableToggleCheckbox () {
  disableCheckboxToggle.value = false
  disableCardPointer.value = false
}

function onQuantityChange () {
  quantityChanged.value = quantity.value !== props.product.quantity
  if (quantityChanged.value) {
    unitsReduced.value = props.product.quantity - quantity.value
    saveButtonDisabled.value = !action.value
  } else {
    unitsReduced.value = 0
    saveButtonDisabled.value = false
  }
}

function deleteCard () {
  confirmThrow.value = true
  disableHover.value = true
  disableToggleCheckbox()
}

function itemEaten () {
  confirmEat.value = true
  disableHover.value = true
  disableToggleCheckbox()
}

function confirmAction () {
  console.log('Action confirmed')
  confirmThrow.value = false
  confirmEat.value = false
  disableHover.value = false
  enableToggleCheckbox()
}

function cancelAction () {
  console.log('Action canceled')
  if (confirmThrow.value) {
    emit('item-thrown', props.product)
  } else if (confirmEat.value) {
    emit('item-eaten', props.product)
  }
  confirmThrow.value = false
  confirmEat.value = false
  disableHover.value = false
  enableToggleCheckbox()
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
  cursor: pointer;
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

.card::before {
  content: '';
  position: absolute;
  left: 10%;
  top: 15%;
  bottom: 15%;
  width: 2px;
  border-radius: 50% / 100%;
  z-index: 0;
}

.card {
  width: 550px;
  flex-direction: row;
  background-color: rgba(35, 173, 58, 0.3);
  height: 150px;
  border: 0;
  box-shadow: 0 7px 7px rgba(0, 0, 0, 0.18);
  cursor: pointer;
  position: relative;
  padding-left: 10%;
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

.popup {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #949594;
  z-index: 2;
}

.confirm-popup {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.95);
  z-index: 10;
}

.popup-expiration-date-div{
  margin-left: 10px;
}

.popup-save-button {
  margin-right: 10px;
}

.outer-new-quantity-div {
  width: 20%;
}

.popup-expiration-date-div,
.popup-quantity-div,
.popup-new-quantity-div,
.outer-new-quantity-div,
.popup-save-button {
  align-self: center;
}

.popup-quantity-div {
  width: 25%;
}
.popup-new-quantity-div {
  width: 100%;
}
.popup-new-quantity-div p {
  text-align: center;
}

.popup-expiration-date-div p,
.popup-quantity-div p,
.popup-new-quantity-div p {
  color: black;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  padding: 0;
}

.checkboxes-div {
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
  margin-top: 10px;
  font-size: 19px;
  font-weight: 600;
  color: black;
}

.fridge-checkbox {
  margin-right: 5px;
  scale: 1.4;
}

.trash-icon-container {
  position: absolute;
  left: 0;
  top: 0;
  height: 50%;
  bottom: 0;
  width: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  cursor: pointer;
  z-index: 1;
  transition: all 0.3s ease;
}

.trash-icon-container:hover {
  background-color: red;
  transform: translateX(10px);
  width: 12%;
  height: 50%; /* Add this to make the trash icon grow to fit half of the height */
  margin-left: -10px;
  top: 0; /* Add this to center the trash icon vertically */
}

.trash-icon {
  width: 50%;
  height: 50%;
}

.trash-icon-hover {
  display: none;
}

.trash-icon-container:hover .trash-icon {
  display: none;
}

.trash-icon-container:hover .trash-icon-hover {
  display: block;
}

.eaten-icon-container {
  position: absolute;
  left: 0;
  top: 50%;
  bottom: 0;
  width: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  cursor: pointer;
  z-index: 1;
  transition: all 0.3s ease;
}

.eaten-icon-container:hover {
  background-color: green;
  transform: translateX(10px);
  width: 12%;
  margin-left: -10px;
}

.eaten-icon {
  width: 50%;
  height: 50%;
}

.eaten-icon-hover {
  display: none;
}

.eaten-icon-container:hover .eaten-icon {
  display: none;
}

.eaten-icon-container:hover .eaten-icon-hover {
  display: block;
}

.disable-hover .trash-icon-hover,
.disable-hover .eaten-icon-hover {
  display: none;
}

.confirm-div {
  color: white;
  font-size: 20px;
}

.confirm-button {
  color: white;
  height: 40px;
  width: 100px;
  margin-left: 20px;
  margin-right: 20px;
  border-radius: 100px;
  border: none;
  font-size: 20px;
}

.confirm-button:hover {
  transform: scale(1.1);
  color: white;
  box-shadow: 0px 15px 25px -5px rgba(darken(dodgerblue, 40%));
}

.confirm-button:active {
  background-color: black;
  box-shadow: 0px 4px 8px rgba(darken(dodgerblue, 30%));
  transform: scale(.90);
}

.confirm-yes-button {
  background-color: #1A7028;
}

.confirm-yes-button {
  background-color: #25A13A;
}

.confirm-no-button {
  background-color: rgb(147, 0, 0);
}

.confirm-no-button {
  background-color: rgb(179, 6, 6);
}
</style>

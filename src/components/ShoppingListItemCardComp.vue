<template>
  <div :class="[cardClass, { disabled: disableInteractions }]" @click="toggleCheckbox" :style="{cursor: disableCardPointer ? 'default' : 'pointer'}">
    <div
      v-tippy="'Kast i søpla'"
      class="trash-icon-container"
      :class="{ 'disable-hover': disableHover }"
      @click.stop="deleteCard"
    >
      <img src="../assets/icons/trash.svg" alt="Trash Icon" class="trash-icon" />
      <img src="../assets/icons/white-trash.svg" alt="Trash Icon Hover" class="trash-icon trash-icon-hover" />
    </div>
    <div class="card-image">
      <img :src=props.product.item.image class="card-img-top" alt="...">
    </div>
    <div class="card-body">
      <div class="section-one">
        <h5 class="card-title" :style="{ fontSize: titleFontSize }">{{ props.product.item.name }}</h5>
        <div class="section-one-bot">
          <div class="quantity-div">
            <p class="card-text">Antall: </p>
            <div class="edit-quantity-div">
              <img
                src="../assets/icons/remove.svg"
                @click="decrement"
              />
              <input class="input-field"
                v-model.number="quantity"
                id="quantity"
                disabled
                ref="quantityInput"
              />
              <img
                src="../assets/icons/add.svg"
                @click="increment"
              />
            </div>
          </div>
          <div class="amount">
            <h5> {{ props.product.quantity * props.product.item.baseAmount }}</h5>
            <h6> {{ unitType }}</h6>
          </div>
        </div>
      </div>
      <div class="section-two">
        <input
          id="checkbox"
          type="checkbox"
          v-model="selected"
          @change="onCheckboxChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ShoppingListItemCardInterface, Unit, Role } from './types'
import { useUserStore } from '../stores/UserStore'

const emit = defineEmits(['update-quantity', 'checked', 'remove-wishlist', 'remove-shopping-list'])
const props = defineProps({
  product: {
    type: Object as () => ShoppingListItemCardInterface,
    required: true
  },
  onWishlist: {
    type: Boolean,
    required: true
  }
})
const userStore = useUserStore()
const quantity = ref(props.product.quantity)
const selected = ref(false)
const quantityInput = ref<HTMLInputElement | null>(null)
const disableCardPointer = ref(false)
const disableHover = ref(false)

const unitType = computed(() => {
  switch (props.product.item.unit) {
    case Unit.GRAMS:
      return 'g'
    case Unit.MILLILITER:
      return 'ml'
    case Unit.ITEM:
      return 'stk'
    default:
      return ''
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

const cardClass = computed(() => ({
  card: true,
  'card-checked': selected.value
}))

const disableInteractions = computed(() => {
  return userStore.role === Role.CHILD && !props.onWishlist
})

function onCheckboxChange () {
  emit('checked', {
    product: props.product,
    selected: selected.value
  })
}

function decrement () {
  if (quantity.value > 1) {
    quantity.value--
    emit('update-quantity', { ...props.product, quantity: quantity.value })
  }
}

function increment () {
  if (quantity.value >= 50) {
    alert('Maks verdi nådd (100)')
    return
  }
  quantity.value++
  emit('update-quantity', { ...props.product, quantity: quantity.value })
}

function toggleCheckbox (event: MouseEvent) {
  if (
    !(event.target as HTMLElement).closest('.edit-quantity-div') &&
    (event.target as HTMLElement) !== document.getElementById('checkbox')
  ) {
    selected.value = !selected.value
    onCheckboxChange()
  }
}

function deleteCard () {
  if (props.onWishlist) {
    emit('remove-wishlist', props.product)
  } else {
    emit('remove-shopping-list', props.product)
  }
}

watch(
  () => props.product.quantity,
  (newQuantity) => {
    quantity.value = newQuantity
  }
)
</script>

<style scoped>

.quantity-div {
  display: grid;
  align-items: flex-start;
  text-align: left;
}

#quantity {
  justify-self: left;
}

#checkbox:checked {
  background-color: royalblue;
  border-color: royalblue;
}

#checkbox {
  margin: 0;
  padding: 0;
  width: 20px;
  height: 20px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: #fff;
  border: 1px solid #1A7028;
  border-radius: 2px;
  cursor: pointer;
}

#checkbox:checked:after {
  content: '✔';
  display: block;
  position: relative;
  left: 3px;
  bottom: 2px;
  color: #fff;
}

.card-title {
  font-size: 22px;
  font-weight: bold;
  text-align: left;
}

.card-text {
  margin: 0;
  padding: 0;
  padding-left: 30px;
  color: black;
}

.edit-quantity-div {
  display: flex;
  align-items: center;
  width: 120px;
}

.edit-quantity-div img{
  width: 30px;
  cursor: pointer;
}
.input-field {
  width: 100%;
  border-radius: 20px;
  text-align: center;
}

.input-field:disabled {
  background-color: white;
}

.card {
  width: 550px;
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
  margin-left: 50px;
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
  display: flex;
  flex-direction: column;
}

.section-two {
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.amount {
  width: 50%;
  display: flex;
  align-items: flex-end;
  margin-left: 50px;
}

.amount h5{
  font-size: 20px;
  padding-bottom: 3px;
  margin: 0;
}
.amount h6 {
  margin: 0;
  padding-left: 5px;
  padding-bottom: 4px;
}

.section-one-bot {
  display: flex;
}

.disabled {
  pointer-events: none;
  opacity: 0.7;
}

.trash-icon-container {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  bottom: 0;
  min-width: 40px;
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
  height: 100%;
  margin-left: -10px;
  top: 0;
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

@media only screen and (max-width: 600px) {
  .card-image {
    display: none;
  }
  .card {
    width: 100%;
  }
  .section-one {
    width: 90%;
    max-width: 100%;
  }

  .amount {
    margin: 0;
    justify-content: flex-end;
  }
  .section-two {
    width: 7%;
  }
  .card-body {
    width: 80%;
    margin-left: 20%;
  }
}
</style>

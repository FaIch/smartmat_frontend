<template>
  <div class="card">
    <div class="card-image">
      <img :src=props.product.image class="card-img-top" alt="...">
    </div>
    <div class="card-body">
      <div class="section-one">
        <h5 class="card-title" :style="{ fontSize: titleFontSize }">{{ props.product.name }}</h5>
        <div class="section-one-bot">
          <div class="amount">
            <h5> {{ props.product.baseAmount }}</h5>
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
import { ref, computed } from 'vue'
import { ItemInterface, Unit } from './types'

const emit = defineEmits(['update-quantity', 'checked'])
const props = defineProps({
  product: {
    type: Object as () => ItemInterface,
    required: true
  }
})

const selected = ref(false)

const unitType = computed(() => {
  switch (props.product.unit) {
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
  const length = props.product.name.length
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

function onCheckboxChange () {
  emit('checked', {
    product: props.product,
    selected: selected.value
  })
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

.edit-quantity-div img{
  width: 30px;
  cursor: pointer;
}
.input-field {
  width: 30%;
  border-radius: 20px;
  text-align: center;
}

.input-field:disabled {
  background-color: white;
}

.card {
  width: 550px;
  flex-direction: row;
  background-color: rgba(35, 173, 58, 0.3);
  height: 150px; /* Set a fixed height for the grid item */
  border: 0;
  box-shadow: 0 7px 7px rgba(0, 0, 0, 0.18);
  margin: 3em auto;
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
</style>

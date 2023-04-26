<template>
  <div v-if = "productProps.product.item.name != undefined">
  <div class="card">
    <img :src=productProps.product.item.image class="card-img-top" alt="...">
    <div class="card-body">
      <div class="text-section-one" id="shopping-list-section-one">
        <h5 class="card-title">{{ productProps.product.item.name }}</h5>
        <div class="shopping-list-quantity-div">
          <img
            src="../assets/icons/remove.svg"
            />
          <input class="input-field" :disabled="true" :placeholder="productProps.product.quantity.toString()" id="shopping-list-quantity"/>
          <img
            src="../assets/icons/add.svg"
            />
        </div>
      </div>
      <!-- <div class="text-section-two">
        <h5 class="card-title" id="shopping-list-item-unit">{{ productProps.product.quantity }}</h5>
      </div> -->
      <div class="text-section-three" id="shopping-list-check">
        <input
          id="shopping-list-item-checkbox"
          type="checkbox"
          :checked="checked"
          @change="$emit('checked-changed', ($event.target as HTMLInputElement)?.checked)"
        />
      </div>
    </div>
    </div>
  </div>
    <div v-else>Loading ...</div>
</template>

<script setup lang="ts">
import { ShoppingListItemCardInterface } from './types'

const productProps = defineProps({
  product: {
    type: Object as () => ShoppingListItemCardInterface,
    required: true
  },
  checked: {
    type: Boolean,
    default: false
  }
})

// const props = defineEmits(['remove'])

// const removeProduct = () => {
//   props.remove(product)
// }

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
  font-size: 18px;
  font-weight: bold;
  max-width: 100%; /* Set a max-width for the card-title */
  white-space: nowrap; /* Prevent the text from wrapping */
  overflow: hidden; /* Hide any overflowing text */
  text-overflow: ellipsis; /* Display an ellipsis when the text overflows */
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
  margin: 1em auto;
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

.text-section-one {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 15px;

}
.text-section-two {
  width: 70%;
  position: relative;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  text-align: right;

}

.text-section-three {
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  padding-right: 15px;
}

</style>

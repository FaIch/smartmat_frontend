<template>
  <div class="suggested-products">
    <h3>Suggested Products</h3>
    <div class="suggested-products-list" ref="suggestedProductsList">
      <div
        v-for="product in props.suggestedProducts"
        :key="product.id"
        class="suggested-product"
        @click="addToShoppingList(product)"
      >
        {{ product.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShoppingListItemCardInterface } from './types'

const emit = defineEmits(['add-to-shopping-list'])

const props = defineProps<{
  checkedProducts: object,
  suggestedProducts: ShoppingListItemCardInterface[],
}>()

// const filteredSuggestedProducts = computed(() => {
//   return props.suggestedProducts.filter(
//     (product) => product && !props.checkedProducts[product.id]
//   )
// })

const addToShoppingList = (product: ShoppingListItemCardInterface) => {
  emit('add-to-shopping-list', product)
}
</script>

<style scoped>
.suggested-products {
  position: fixed;
  right: 0;
  top: 15vh;
  width: 250px;
  height: 85vh;
  background-color: #f2f2f2;
  padding: 20px;
  border-left: 1px solid #ccc;
}

.suggested-products-list {
  overflow-y: auto;
  height: calc(85vh - 40px);
}

.suggested-product {
  cursor: pointer;
  padding: 10px;
  border: 1px solid transparent;
  border-radius: 5px;
  margin-bottom: 10px;
}

.suggested-product:hover {
  border-color: #1a7028;
  background-color: #e8f0e8;
}
</style>

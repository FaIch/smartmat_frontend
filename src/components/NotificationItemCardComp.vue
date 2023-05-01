<template>
    <div class="card">
        <div class="card-image">
            <img :src=props.product.item.image class="card-img-top" alt="...">
        </div>
        <div class="card-body">
            <div class="section-one">
                <h5 class="card-title">{{ props.product.item.name }}</h5>
                <div class="card-info">
                    <p class="expDate">Utløpsdato: {{ props.product.expirationDate }} </p>
                    <p class="quantity">Antall: {{ props.product.quantity }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FridgeItemCardInterface } from './types'

const props = defineProps({
  product: {
    type: Object as () => FridgeItemCardInterface,
    required: true
  }
})
</script>

<style scoped>
.card-title {
    font-size: 22px;
    font-weight: bold;
    text-align: left;
}

.card {
    width: 500px;
    flex-direction: row;
    background-color: rgba(35, 173, 58, 0.3);
    height: 120px;
    border: 0;
    box-shadow: 0 7px 7px rgba(0, 0, 0, 0.18);
    margin: 0.75em;
}

.card-image {
    width: 35%;
    max-height: 150px;
    /* Increase max-height value */
    margin: auto;
    padding: 0.5em;
    border-radius: 0.7em;
    overflow: hidden;
}

.card-img-top {
    max-width: 100%;
    max-height: 100px;
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
</style>

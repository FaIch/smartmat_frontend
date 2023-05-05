<template>
    <div class="card" @click="goToFridge()">
        <div class="card-image">
            <img :src=props.product.item.image class="card-img-top" alt="...">
        </div>
        <div class="card-body">
          <h5 class="card-title">
            {{ props.product.item.name }}
            <span v-if="expired" class="expired-text">(Utløpt)</span>
          </h5>
                <div class="card-info">
                    <p>Utløpsdato: {{ props.product.expirationDate }} <br> {{ props.product.quantity }} {{ unitType }} </p>
                </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FridgeItemCardInterface, Unit } from './types'
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
  product: {
    type: Object as () => FridgeItemCardInterface,
    required: true
  }
})

const expired = computed(() => {
  const expirationDate = new Date(props.product.expirationDate)
  const currentDate = new Date()
  return expirationDate < currentDate
})

const unitType = computed(() => {
  switch (props.product.item.unit) {
    case Unit.GRAMS:
      return 'g'
    case Unit.MILLILITER:
      return 'mL'
    case Unit.ITEM:
      return 'Stk'
    default:
      return ''
  }
})

function goToFridge () {
  router.push('/fridge')
}
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
    position: relative;
    height: 100%;
    justify-content: space-between;
    min-width: 67%;
    max-width: 67%;
    display: grid;
    grid-template-columns: 1fr;
}

.card-info {
    padding: 0;
    text-align: left;
}

@media only screen and (max-width: 640px) {
  .card-image {
    display: none;
  }

  .card-title {
    text-align: center;
  }

  .card-info {
    text-align: center;
  }
}

</style>

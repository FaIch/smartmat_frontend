<template>
    <div>
      <div class="search-section">
        <input v-model="eanCode" type="text" placeholder="Enter EAN code" />
        <button @click="findProduct">Find Product</button>
      </div>

      <div class="inputs-section">
      <div v-if="productData">
        <img :src="productData.image" />
        <input v-model="formData.name" type="text" placeholder="Name" />
        <input v-model="formData.image" type="text" placeholder="Image URL" />
        <input v-model="formData.price" type="text" placeholder="Price" />
        <input v-model="formData.shortDesc" type="text" placeholder="Short Description" />
        <select v-model="formData.category" class="dropdown">
          <option disabled value="">Select a category</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>

        <select v-model="formData.unit" class="dropdown">
          <option disabled value="">Select a unit</option>
          <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
        </select>

        <input v-model="formData.weightPerUnit" type="text" placeholder="Weight per unit" :disabled="formData.unit === 'GRAMS'" />
        <input v-model="formData.baseAmount" type="text" placeholder="Base Amount" />

        <button @click="submitProduct">Submit</button>
        </div>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import api from '../utils/httputils'
import { ItemInterface, Unit } from '../components/types'

const eanCode = ref('')
const productData = ref<ItemInterface>()
const formData = reactive<ItemInterface>({
  id: 0,
  name: '',
  shortDesc: '',
  category: '',
  unit: Unit.ITEM,
  price: 0,
  weightPerUnit: 0,
  image: '',
  baseAmount: 0
})

const categories = ref([])
const units = ref([])
const path = '/items'

watch(
  () => formData.unit,
  (newUnit) => {
    if (newUnit === 'GRAMS') {
      formData.weightPerUnit = 1
    }
  }
)

const findProduct = async () => {
  // Replace with your actual API call
  const response = await api.get(`https://kassal.app/api/v1/products/ean/${eanCode.value}`, {
    headers: {
      Authorization: 'Bearer YrzNOzoCrOnQ76PmBymhEK8pgOESFcT5yhNyVl5w',
      'Response-type': 'application/json'
    }
  })
  productData.value = {
    ...response.data.data.products[0],
    shortDesc: response.data.data.products[0].description,
    price: response.data.data.products[0].current_price.price
  }
  console.log(response.data.data.products[0])

  formData.name = productData.value?.name ?? ''
  formData.shortDesc = productData.value?.shortDesc ?? ''
  formData.price = productData.value?.price ?? 0
  formData.image = productData.value?.image ?? ''
}

const fetchCategories = async () => {
  // Replace with your actual API call
  const response = await api.get(path + '/categories')
  categories.value = response.data
}

const fetchUnits = async () => {
  // Replace with your actual API call
  const response = await api.get(path + '/units')
  units.value = response.data
  console.log(response.data)
}

const submitProduct = async () => {
  // Replace with your actual API call
  console.log(formData)
  await api.post(path + '/add', formData)

  eanCode.value = ''
  productData.value = undefined
  Object.assign(formData, {
    name: '',
    shortDesc: '',
    category: '',
    unit: '',
    price: '',
    weightPerUnit: '',
    image: '',
    baseAmount: ''
  })
}

onMounted(async () => {
  await fetchCategories()
  await fetchUnits()
})
</script>

<style scoped>
.search-section {
  padding-top: 15vh;
}

.dropdown {
  color: black;
  display: block;
  width: 100%;
  margin: 1rem 0;
}

.inputs-section {
  padding-top: 5vh;
  max-width: 80%;
}

input,
select {
  box-sizing: border-box;
  display: block;
  width: 70%;
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #000;
  border-radius: 5px;

}

img {
  max-height: 200px;
  max-width: 200px;
  display: block;
  margin: 1rem 0;
}

input.disabled {
  background-color: #f3f3f3;
  color: #999;
}
</style>

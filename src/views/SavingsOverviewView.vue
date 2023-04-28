<template>
  <div class="savings">
    <h1>Sparingsoversikt</h1>
    <div class="numbers">
      <div>
        <h2>Totalt matsvinn</h2>
        <p class="mainNumbers">{{ totalFoodWaste }} kg</p>
        <p>Årlig gjennomsnitt per nordmann:<br> {{ averageFoodWaste }}kg</p>
      </div>
      <div>
        <h2>Penger tapt</h2>
        <p class="mainNumbers">{{ moneyLost }} kr</p>
        <p>Årlig gjennomsnitt per nordmann:<br> {{ averageMoneyLost }}kr</p>
      </div>
      <div>
        <h2>CO2-ekvivalenter</h2>
        <p class="mainNumbers">{{ co2Emissions }} kg</p>
        <p>Årlig gjennomsnitt per nordmann:<br> {{ averageCo2Emissions }}kg</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue'
import axios from 'axios'

// Average values for a Norwegian consumer
const averageFoodWaste = 84.7 // kg per year
const averageMoneyLost = 5322 // kr per year
const averageCo2Emissions = 305 // kg per year

const totalFoodWaste = ref(0.0)
const moneyLost = ref(0.0)
const co2Emissions = ref(0.0)

const fetchTotalWaste = async () => {
  const response = await axios.get('/waste/total')
  totalFoodWaste.value = response.data
}

const fetchMoneyLost = async () => {
  const response = await axios.get('/waste/money')
  moneyLost.value = response.data
}

const fetchCo2Emissions = async () => {
  const response = await axios.get('/waste/emissions')
  co2Emissions.value = response.data
}

onMounted(() => {
  fetchTotalWaste()
  fetchMoneyLost()
  fetchCo2Emissions()
})

</script>

<style scoped>
.savings {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url("../assets/startpagebackground3.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
h1, h2, p {
  color: white;
  margin: 1rem;
  padding: 1rem;
}
.numbers {
  display: flex;
}
.numbers > div {
  margin-right: 20px;
}

.mainNumbers {
  font-weight: bolder;
  font-size: 50px;
  color: white;
  margin: 1rem;
  padding: 1rem;
}
</style>

/*
Tar man utgangspunkt i Miljødirektoratets beregninger fra 2016 vil 84,7kg matsvinn
tilsvare et tap på omtrent 5 322 norske kroner. I den samme rapporten estimeres det
at 1kg matsvinn tilsvarer 3,6kg CO2-ekvivalenter, hvilket betyr at en gjennomsnittlig
forbruker står for omtrent 305kg CO2-ekvivalenter per år. Dette utslippet tilsvarer
1906km kjøring med bensinbil og mer enn tre tur-retur flygninger mellom Trondheim og Oslo.
*/

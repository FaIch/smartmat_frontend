<template>
  <div class="savings">
    <h1>Sparingsoversikt</h1>
    <div class="numbers">
      <div>
        <h2>Totalt matsvinn</h2>
        <p class="mainNumbers">{{ foodWaste }} kg</p>
        <p class="averages"><br> {{ averageFoodWaste }}</p>
      </div>
      <div>
        <h2>Penger tapt</h2>
        <p class="mainNumbers">{{ moneyLost }} kr</p>
        <p class="averages">Gjennomsnitt:<br> {{ averageMoneyLost }}</p>
      </div>
      <div>
        <h2>CO2-ekvivalenter</h2>
        <p class="mainNumbers">{{ co2Emissions }} kg</p>
        <p class="averages">Gjennomsnitt:<br> {{ averageCO2Emissions }}</p>
      </div>
    </div>
    <div class="menu">
      <button class="selector" @click="showAllTime()">All Time</button>
      <button class="selector" @click="showLastYear()">Last Year</button>
      <button class="selector" @click="showLastMonth()">Last Month</button>
      <button class="selector" @click="showLastWeek()">Last Week</button>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// Average values for a Norwegian consumer
const averageFoodWaste = computed(() => {
  if (flag.value === 'yearly') {
    return `Årlig gjennomsnitt: ${foodWaste.value} kg`
  } else if (flag.value === 'monthly') {
    return `Månedtlig gjennomsnitt: ${foodWaste.value / 12} kg`
  } else if (flag.value === 'weekly') {
    return `Ukentlig gjennomsnitt: ${foodWaste.value / 52} kg`
  } else {
    return ''
  }
}) // kg per year
const averageMoneyLost = 5322 // kr per year
const averageCO2Emissions = 305 // kg per year

const flag = ref('')
const foodWaste = ref<number>(0)
const moneyLost = ref<number>(0)
const co2Emissions = ref<number>(0)

const config = {
  headers: {
    'Content-type': 'application/json'
  },
  withCredentials: true
}

const showAllTime = () => {
  axios.get('http://localhost:8080/waste/total/all-time',
    config
  )
    .then((response) => {
      const data = response.data
      foodWaste.value = data[0] / 1000
      moneyLost.value = data[1] / 1000
      co2Emissions.value = data[2] / 1000
      flag.value = 'allTime'
    })
}

const showLastYear = () => {
  axios.get('http://localhost:8080/waste/total/last-year',
    config
  )
    .then((response) => {
      const data = response.data
      foodWaste.value = data[0] / 1000
      moneyLost.value = data[1] / 1000
      co2Emissions.value = data[2] / 1000
      flag.value = 'yearly'
    })
}

const showLastMonth = () => {
  axios.get('http://localhost:8080/waste/total/last-month',
    config
  )
    .then((response) => {
      const data = response.data
      foodWaste.value = data[0] / 1000
      moneyLost.value = data[1] / 1000
      co2Emissions.value = data[2] / 1000
      flag.value = 'monthly'
    })
}

const showLastWeek = () => {
  axios.get('http://localhost:8080/waste/total/last-week',
    config
  )
    .then((response) => {
      const data = response.data
      foodWaste.value = data[0] / 1000
      moneyLost.value = data[1] / 1000
      co2Emissions.value = data[2] / 1000
      flag.value = 'weekly'
    })
}

onMounted(() => {
  showAllTime()
  showLastYear()
  showLastMonth()
  showLastWeek()
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
.menu {
  display: flex;
}

.selector {
  width: 120px;
  height: 40px;
  margin: 10px;
  color: #fff;
  background: #25A13A;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: .2s ease-in;
}

.selector:hover {
  color: #25A13A;
  background: #fff;
}

h1 {
  font-weight: bolder;
  font-size: 50px;
  color: white;
  margin: 2rem 0 0;
  padding: 0.5rem;
}

h2 {
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin: 0.5rem;
  padding: 0.5rem;
}

p {
  font-weight: bold;
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
  font-size: 60px;
  color: white;
  margin: 1rem;
  padding: 1rem;
  text-shadow: 0 0 10px #25A13A, 0 0 20px #25A13A, 0 0 30px #25A13A,
  0 0 40px #FEFF01, 0 0 70px #FEFF01, 0 0 80px #FEFF01;
}

.averages {
  font-weight: bold;
  font-size: 20px;
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

<template>
  <div class="savings">
    <h1>Sparingsoversikt</h1>
    <div class="numbers">
      <div>
        <h2>Matsvinn</h2>
        <p class="mainNumbers">{{ foodWaste }} kg</p>
        <p class="averages">{{ averageFoodWaste }}</p>
      </div>
      <div>
        <h2>Penger tapt</h2>
        <p class="mainNumbers">{{ moneyLost }} kr</p>
        <p class="averages">{{ averageMoneyLost }}</p>
      </div>
      <div>
        <h2>CO2-utslipp</h2>
        <p class="mainNumbers">{{ co2Emissions }} kg</p>
        <p class="averages">{{ averageCO2Emissions }}</p>
      </div>
    </div>
    <div class="menu">
      <button :class="{'selector': true, 'selected': flag === 'weekly'}" @click="showLastWeek()">Siste Uke</button>
      <button :class="{'selector': true, 'selected': flag === 'monthly'}" @click="showLastMonth()">Siste Måned</button>
      <button :class="{'selector': true, 'selected': flag === 'yearly'}" @click="showLastYear()">Siste År</button>
      <button :class="{'selector': true, 'selected': flag === 'allTime'}" @click="showAllTime()">Total</button>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// Calculating percentage for each time period based on the average value for money lost
const averageMoneyLostYear = 5322.0 // kr per year
const averageMoneyLost = computed(() => {
  if (flag.value === 'yearly') {
    return `${(moneyLost.value * 100 / averageMoneyLostYear * numberOfHouseholdMembers.value)
        .toFixed(1)}% av årlig gjennomsnitt for husholdninger med
        ${numberOfHouseholdMembers.value} personer`
  } else if (flag.value === 'monthly') {
    return `${(moneyLost.value * 100 / (averageMoneyLostYear * numberOfHouseholdMembers.value / 12))
        .toFixed(1)}% av månedtlig gjennomsnitt for husholdninger med
        ${numberOfHouseholdMembers.value} personer`
  } else if (flag.value === 'weekly') {
    return `${(moneyLost.value * 100 / (averageMoneyLostYear * numberOfHouseholdMembers.value / 52))
        .toFixed(1)}% av ukentlig gjennomsnitt for husholdninger med
        ${numberOfHouseholdMembers.value} personer`
  } else if (flag.value === 'allTime') {
    return `Dette matsvinnet tilsvarer utslipp fra ${(co2Emissions.value * 6.25)
        .toFixed(1)}km kjøring med bensinbil`
  } else {
    return ''
  }
})

const flag = ref('')
const foodWaste = ref<number>(0)
const moneyLost = ref<number>(0)
const co2Emissions = ref<number>(0)
const numberOfHouseholdMembers = ref<number>(1)

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

const fetchNumberOfHouseholdMembers = async () => {
  try {
    const response = await axios.get('http://localhost:8080/user/numberOfHouseholdMembers',
      config
    )
    numberOfHouseholdMembers.value = response.data
  } catch (error) {
    console.error('Error fetching numberOfHouseholdMembers:', error)
  }
}

onMounted(async () => {
  showLastWeek()
  await fetchNumberOfHouseholdMembers()
})

</script>

<style scoped>
.savings {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-image: url("../assets/startpagebackground3.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.selector {
  width: 150px;
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

.selector.selected {
  color: #25A13A;
  background: #fff;
}

h1 {
  font-weight: bolder;
  font-size: 40px;
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
  max-width: 400px;
  font-weight: bold;
  font-size: 20px;
  margin: 1rem;
  padding: 1rem;
}

/* Media Query added for devices with a max width of 768px */
@media screen and (max-width: 768px) {
  h1 {
    font-weight: bolder;
    font-size: 30px;
    color: white;
    margin: 5.5rem 0 0;
    padding: 0;
  }
  .numbers {
    flex-direction: column;
    align-items: center;
  }
  .menu {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .mainNumbers {
    font-size: 50px;
    margin: 0;
    padding: 0;
  }
}

</style>

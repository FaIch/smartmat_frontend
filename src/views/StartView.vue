<template>
  <div class="start-page">
    <h1>Bli MatSmart På 1-2-3</h1>
    <div class="icon-container">
      <div class="icon-wrapper">
        <img src="../assets/fridge.png" alt="Icon 1">
        <p>Virtuelt kjøleskap som<br> gir deg oversikt over<br> maten du har hjemme</p>
      </div>
      <div class="icon-wrapper">
        <img src="../assets/shopping-list.png" alt="Icon 2">
        <p>Digital handleliste koblet<br> til ditt kjøleskap for<br> full oversikt over innkjøp</p>
      </div>
      <div class="icon-wrapper">
        <img src="../assets/dinner.png" alt="Icon 3">
        <p>Skreddersydde middager<br> og ukesmenyer basert på<br> matvarer i ditt kjøleskap</p>
      </div>
    </div>
    <div id="register">
      <button id="register-button" @click="navigateToLogin()">Registrer deg nå</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateToLogin () {
  router.push('/login')
}
</script>

<style scoped>

.start-page {
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

h1 {
  color: white;
  font-size: 40px;
  margin-top: 2rem;
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1rem;
}

.icon-wrapper img {
  max-width: 50%;
  height: auto;
}

.icon-wrapper p {
  color: white;
  font-family: 'Lato', sans-serif;
  font-size: 17px;
  margin-top: 0.5rem;
  text-align: center;
}

#register-button {
  height: 50px;
  margin: 12px auto 10%;
  color: #fff;
  background: #25A13A;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: .2s ease-in;
  display: inline-block;
}

#register-button:hover{
  color: #1A7028;
  background: white;
}
</style>

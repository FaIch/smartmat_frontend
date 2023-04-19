<template>
  <div class="container">
    <div class="main">
      <div class="update-div">
        <p class="update">{{ update }}</p>
      </div>
      <input type="checkbox" id="chk" aria-hidden="true">
      <div class="login">
        <form class="form" @submit.prevent="submitLogin">
          <label id="login" for="chk" aria-hidden="true">Logg inn</label>
          <input class="input" type="text" autocomplete="email" name="email" placeholder="Email"
            v-model="loginInputs.email" @input="resetUpdate">
          <input class="input" type="password" name="pswd" placeholder="Passord" v-model="loginInputs.password"
            @input="resetUpdate">
          <button type="submit">Logg inn</button>
        </form>
      </div>
      <div class="signup">
        <form class="form" @submit.prevent="submitSignup">
          <label id="signup" for="chk" aria-hidden="true">Registrer deg</label>
          <input class="input" type="text" autocomplete="email" name="email" placeholder="Email"
            v-model="signupInput.email" @input="resetUpdate">
          <input class="input" type="password" name="pswd" placeholder="Passord"
            v-model="signupInput.password" @input="resetUpdate">
          <input class="input" type="password" name="pswd" placeholder="Bekreft passord"
            v-model="signupInput.confirmPassword" @input="resetUpdate">
          <button id="sign-up-button" type="submit">Registrer</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useUserStore } from '../stores/UserStore'
import router from '../router/index'
import { useUtilityStore } from '../stores/UtilityStore'
import axios from 'axios'
import { SHA256 } from 'crypto-js'

const userStore = useUserStore()
const navbarStore = useUtilityStore()
const update = ref('')
const emailRegex = ref(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

const loginInputs = ref({
  email: '',
  password: ''
})

const signupInput = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

onMounted(() => {
  navbarStore.setTransparentStatus(false)
  navbarStore.showItems = false
})

onUnmounted(() => {
  navbarStore.showItems = true
})

function resetUpdate () {
  update.value = ''
}

function validateLogin () {
  if (loginInputs.value.email === '' || loginInputs.value.password === '') {
    update.value = 'Please fill out all fields.'
    return false
  }
  if (!emailRegex.value.test(String(loginInputs.value.email).toLowerCase())) {
    update.value = 'Invalid email.'
    return false
  }
  if (loginInputs.value.email.length > 50) {
    update.value = 'Email too long.'
    return false
  }
  if (loginInputs.value.password.length > 200) {
    update.value = 'Password too long.'
    return false
  }
  return true
}

function validateSignup () {
  if (signupInput.value.email === '' || signupInput.value.password === '' || signupInput.value.confirmPassword === '') {
    update.value = 'Please fill out all fields.'
    return false
  }
  if (!emailRegex.value.test(String(signupInput.value.email).toLowerCase())) {
    update.value = 'Invalid email.'
    return false
  }
  if (signupInput.value.password !== signupInput.value.confirmPassword) {
    update.value = 'Passwords are not the same.'
    return false
  }
  if (signupInput.value.email.length > 50) {
    update.value = 'Email too long'
    return false
  }
  if (signupInput.value.password.length > 200) {
    update.value = 'Password too long'
    return false
  }
  return true
}

async function submitLogin () {
  if (validateLogin()) {
    const path = 'http://localhost:8080/login'
    const hashedPassword = SHA256(loginInputs.value.password)
    const request = {
      email: loginInputs.value.email,
      password: hashedPassword.toString()
    }

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    await axios.post(path, request, config)
      .then(async (response) => {
        if (response.status === 200) {
          userStore.email = response.data.userRequest.email
          userStore.login(response.data.userRequest.password)
          router.push('/profile')
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          update.value = error.response.data.message
        }
      })
  }
}

function submitSignup () {
  if (validateSignup()) {
    const path = 'http://localhost:8080/user'
    const hashedPassword = SHA256(signupInput.value.password)

    const data = {
      email: signupInput.value.email,
      password: hashedPassword.toString()
    }

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    axios.post(path, data, config).then(response => {
      if (response.status === 200) {
        update.value = response.data
        router.push('/login')
      }
    }).catch((error) => {
      if (error.response.status === 409) {
        update.value = error.response.data
      }
    })
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  padding-top: 15vh;
  height: 100vh;
  background-color: white;
}

.update {
  margin: 0;
  margin-top: 20px;
  font-family: 'Lato', sans-serif;
  font-size: 25px;
  color: red;
}

.update-div {
  margin-bottom: 0;
  margin-top: 30px;
  min-height: 35px;
}

.main {
  scale: 1.5;
  width: 450px;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  height: 500px;
  overflow: hidden;
  border-radius: 12px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/*checkbox to switch from sign up to login*/
#chk {
  display: none;
}

/*Login*/
.login {
  position: relative;
  width: 100%;
  height: 100%;
}

.login label {
  margin: 10% 0 5%;
}

label {
  color: black;
  font-size: 2rem;
  justify-content: center;
  display: flex;
  font-weight: bold;
  cursor: pointer;
  transition: .5s ease-in-out;
  margin-bottom: 20px;
}

.input {
  height: 40px;
  font-size: 1.2rem;
  background: #e0dede;
  margin: 10px;
  padding-left: 10px;
  border: none;
  outline: none;
  border-radius: 4px;
}

/*Register*/
.signup {
  background-color: #1A7028;
  border-radius: 60% / 10%;
  transform: translateY(5%);
  transition: .8s ease-in-out;
}

.signup input {
  margin: 0;
  margin-left: 20px;
  margin-right: 20px;
}

.signup label {
  padding-top: 10px;
  color: white;
  transform: scale(.6);
  margin-top: 0;
}

.signup form {
  height: 400px;
}

#chk:checked~.signup {
  transform: translateY(-68%);
}

#chk:checked~.signup label {
  transform: scale(1);
  margin: 10% 0 5%;
}

#chk:checked~.login label {
  transform: scale(.6);
  margin: 5% 0 5%;
}

/*Button*/
.form button {
  width: 85%;
  height: 40px;
  margin: 12px auto 10%;
  color: #fff;
  background: #1A7028;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: .2s ease-in;
}

#sign-up-button {
  background-color: #FFC306;
  color: black;
}

#sign-up-button:hover {
  background-color: #ffff06;
}

.form button:hover {
  background-color: #25A13A;
}

button:disabled {
  opacity: 0.6;
  cursor: auto;
}

button:disabled:hover {
  background-color: #573b8a;
}

@media screen and (max-width: 1700px) {
  .main {
    scale: 1.1;
  }
}

@media screen and (max-width: 700px) {
  .main {
    scale: 1.2;
  }
}

@media screen and (max-width: 550px) {
  .main {
    scale: 1;
  }
}

@media screen and (max-width: 450px) {
  .main {
    width: 350px;
    height: 520px;
  }

  .input {
    height: 60px;
  }

  .signup input {
    margin-top: 2px;
    margin-bottom: 2px;
  }

  #chk:checked~.signup {
    transform: translateY(-71%);
  }

}

@media screen and (max-width: 300px) {
  .main {
    width: 280px;
    height: 525px;
  }

  #chk:checked~.signup {
    transform: translateY(-70%);
  }
}</style>

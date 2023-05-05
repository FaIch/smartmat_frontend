<template>
    <div class="formBody">
        <form @submit.prevent="submitForm">
            <fieldset class="row">
              <h1>Innloggingsdetaljer</h1>
                <div class="form-group">
                    <label for="email">E-post Adresse</label>
                    <input id="email" type="email" name="email" autocomplete="email" v-model="email" placeholder="Din e-post adresse" readonly disabled>
                    <label for="oldPassword">Gammelt Passord</label>
                    <input minlength="8" id="oldPassword" type="password" name="oldPassword" v-model="oldPassword" placeholder="Ditt gamle passord">
                    <div v-if="wrongOldPassword" class="error-message">
                        Feil gammelt passord
                    </div>
                    <label for="newPassword">Nytt Passord</label>
                    <input minlength="8" id="newPassword" type="password" name="newPassword" v-model="newPassword" placeholder="Ditt nye passord">
                </div>
            </fieldset>
            <fieldset class="row">
              <h1>Personlige Detaljer</h1>
                <div class="form-group">
                    <label for="mobileNumber">Mobilnummer</label>
                    <input id="mobileNumber" type="number" name="mobileNumber" autocomplete="tel" v-model="phoneNumber" placeholder="Ditt mobilnummer">
                    <label for="address">Adresse</label>
                  <input id="address" type="text" name="address" autocomplete="street-address" v-model="address" placeholder="Din adresse">
                  <br><label for="numberOfHouseholdMembers">Antall personer i husstanden</label>
                  <div class="input-box">
                    <i class="fas fa-users"></i>
                    <select
                        name="household-members"
                        id="household-members"
                        v-model="numberOfHouseholdMembers"
                        required
                    >
                      <option value="" disabled selected>Hvor mange i din husstand?</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                    </select>
                    <div class="select-arrow"></div>
                  </div><br>
                    <label id="errorLabel"> {{ errorMessage }}</label>
                </div>
            </fieldset>
            <div v-if="changesMade && !wrongOldPassword" id="response-wrapper">
              <h3 >Endringer lagret </h3>
              <i class="material-symbols-outlined">task_alt</i>
            </div>
            <div class="submit-button">
                <button id="submit-button" type="submit">Lagre Endringer</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/UserStore'
import { AxiosError } from 'axios'
import api from '../utils/httputils'
import { SHA256 } from 'crypto-js'

const userStore = useUserStore()

const email = ref(userStore.email)
const phoneNumber = ref('')
const oldPassword = ref('')
const newPassword = ref('')
const address = ref('')
const wrongOldPassword = ref(false)
const numberOfHouseholdMembers = ref('')
const changesMade = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  if (userStore.loggedIn) {
    await api.get('/user/details')
      .then((response) => {
        phoneNumber.value = response.data.phoneNumber
        address.value = response.data.address
        numberOfHouseholdMembers.value = response.data.numberOfHouseholdMembers
      })
      .catch((error) => {
        if (error.response.status === 401) {
          userStore.logout()
        }
      })
  }
})

const submitForm = async () => {
  changesMade.value = false
  wrongOldPassword.value = false
  errorMessage.value = ''

  if (phoneNumber.value) {
    const phoneNumberRegex = /^\d{8}$/
    if (!phoneNumberRegex.test(phoneNumber.value)) {
      errorMessage.value = 'Ugyldig mobilnummer'
      return
    }
    await api.put('/user/edit/phone?phoneNumber=' + phoneNumber.value, null)
      .then(() => {
        changesMade.value = true
      })
      .catch((error) => {
        if (error.response.status === 401) {
          userStore.logout()
        }
      })
  }

  if (address.value) {
    const addressRegex = /^[a-zA-ZøæåØÆÅ\s]+\d+/
    if (!addressRegex.test(address.value)) {
      errorMessage.value = 'Ugyldig adresse format'
      return
    }
    await api.put('/user/edit/address?address=' + address.value, null)
      .then(() => {
        changesMade.value = true
      })
      .catch((error) => {
        if (error.response.status === 401) {
          userStore.logout()
        }
      })
  }

  if (oldPassword.value && newPassword.value) {
    const hashedOldPassword = SHA256(oldPassword.value)
    const hashedNewPassword = SHA256(newPassword.value)
    try {
      const response = await api.put(
        '/user/edit/password?oldPassword=' + hashedOldPassword + '&newPassword=' + hashedNewPassword, null)
      if (response.data.error) {
        wrongOldPassword.value = true
        changesMade.value = false
        throw new Error(response.data.error)
      }
      changesMade.value = true
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response && error.response.data === 'Feil passord') {
        wrongOldPassword.value = true
        changesMade.value = false
      }
    }
  }

  if (numberOfHouseholdMembers.value) {
    await api.put(
      '/user/edit/household?numberOfHouseholdMembers=' + numberOfHouseholdMembers.value, null)
      .then(() => {
        changesMade.value = true
      })
      .catch((error) => {
        if (error.response.status === 401) {
          userStore.logout()
        }
      })
  }
}

defineExpose({
  submitForm,
  changesMade
})
</script>

<style scoped>

.formBody {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding-top: 90px;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-family: Arial, sans-serif;
    background-image: url("../assets/startpagebackground3.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.row {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

.form-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
}

#response-wrapper {
  justify-self: center;
  align-self: center;
  align-content: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  text-align: center;
}
.material-symbols-outlined {
  color: white;
  font-size: 30px;
  font-variation-settings:
  'FILL' 1,
  'wght' 600,
  'GRAD' 0,
  'opsz' 248
}

#errorLabel {
  color: red
}

h1 {
    text-align: center;
    padding-top: 20px;
    margin-bottom: 20px;
    color: white;
    font-size: 2em;
    font-weight: bold;
}

h3 {
    color: white;
    font-size: 1,5em;
}

label {
    color: white;
    display: block;
    margin-bottom: 5px;
    display: inline-block;
    align-self: left;
    justify-self: left;
}

input {
    width: 70%;
    padding: 10px;
    margin: 10px 0 10px 0;
    border: 1px solid #ccc;
    background-color: #e9f1fe;
    border-radius: 4px;
    align-self: center;
    justify-self: center;
}

.submit-button {
    text-align: center;
    height: 50px;
    margin: 12px auto 10%;
    font-size: 1.2rem;
    font-weight: bold;
    transition: .2s ease-in;
    display: inline-block;
}

#submit-button {
    color: black;
    background: #eaf214;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    cursor: pointer;
}

#submit-button:hover {
    color: #1A7028;
    background: white;
}

.success-message {
    color: white;
    margin-left: 10px;
    margin-top: 5px;
    max-height: 30px;
    max-width: 30px;
}

.checkmarkPosition {
    display: flex;
    flex-direction: row;
}
input:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
}
.error-message {
    color: red;
    font-size: 0.8em;
    margin-top: 2px;
}
@media only screen and (max-width: 768px) {
    .container {
        padding-top: 100px;
    }

    .row {
        flex-direction: column;
    }
    .submit-button {
        width: 100%;
    }
}

@media only screen and (max-width: 480px) {
    h1 {
        font-size: 1.5em;
    }

    .submit-button {
        width: 100%;
    }
}

</style>

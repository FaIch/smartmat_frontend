<template>
    <div class="formBody">
        <form @submit.prevent="submitForm">
            <fieldset class="row">
              <h1>Innloggingsdetaljer</h1>
                <div class="form-group">
                    <label for="email">E-post Adresse</label>
                    <input id="email" type="email" name="email" autocomplete="email" v-model="email" placeholder="Email adresse" readonly disabled>
                    <label for="oldPassword">Gammelt Passord</label>
                    <input id="oldPassword" type="password" name="oldPassword" v-model="oldPassword" placeholder="Gammelt passord">
                    <div v-if="wrongOldPassword" class="error-message">
                        Incorrect old password
                    </div>
                    <label for="newPassword">Nytt Passord</label>
                    <input id="newPassword" type="password" name="newPassword" v-model="newPassword" placeholder="Nytt passord">
                </div>
            </fieldset>
            <fieldset class="row">
              <h1>Personlige detaljer</h1>
                <div class="form-group">
                    <label for="mobileNumber">Mobilnummer</label>
                    <input id="mobileNumber" type="tel" name="mobileNumber" autocomplete="tel" v-model="phoneNumber" placeholder="Telefon nummer">
                    <label for="address">Adresse</label>
                    <input id="address" type="text" name="address" autocomplete="street-address" v-model="address" placeholder="Din adresse">
                    <label for="numberOfHouseholdMembers">Antall Personer I Husholdningen</label>
                    <input id="numberOfHouseholdMembers" type="number" name="postalCode" autocomplete="postal-code" v-model="numberOfHouseholdMembers" placeholder="Antall i husholdning">
                </div>
            </fieldset>
            <div v-if="changesMade" id="response-wrapper">
              <h3 >Endringer lagret! </h3>
              <i class="material-symbols-outlined">task_alt</i>
            </div>
            <div class="submit-button">
                <button id="submit-button" type="submit">Lagre Endringer</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineExpose } from 'vue'
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

onMounted(async () => {
  if (userStore.loggedIn) {
    await api.get('/user/details')
      .then((response) => {
        phoneNumber.value = response.data.phoneNumber
        address.value = response.data.address
        numberOfHouseholdMembers.value = response.data.numberOfHouseholdMembers
        console.log(response)
      })
      .catch((error) => {
        if (error.response.status === 401) {
          userStore.logout()
        }
        console.error(error)
      })
  }
})

const submitForm = async () => {
  changesMade.value = false

  if (!userStore.loggedIn) {
    console.error('You are not logged in')
    return
  }

  if (phoneNumber.value) {
    const phoneNumberRegex = /^\d{8}$/
    if (!phoneNumberRegex.test(phoneNumber.value)) {
      console.error('Invalid phone format')
      return
    }
    try {
      await api.put('/user/edit/phone?phoneNumber=' + phoneNumber.value, null)
      changesMade.value = true
    } catch (error) {
      console.error('Error updating phone number', error)
    }
  }

  if (address.value) {
    const addressRegex = /^[a-zA-Z\s]+\d+/
    if (!addressRegex.test(address.value)) {
      console.error('Invalid address format')
      return
    }
    try {
      await api.put('/user/edit/address?address=' + address.value, null)
      changesMade.value = true
    } catch (error) {
      console.error('Error updating address', error)
    }
  }

  if (oldPassword.value && newPassword.value) {
    const hashedOldPassword = SHA256(oldPassword.value)
    const hashedNewPassword = SHA256(newPassword.value)
    try {
      const response = await api.put(
        '/user/edit/password?oldPassword=' + hashedOldPassword + '&newPassword=' + hashedNewPassword, null)
      if (response.data.error) {
        throw new Error(response.data.error)
      }
      changesMade.value = true
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response && error.response.data === 'Incorrect password') {
        // Handle the incorrect old password exception here
        console.error('Error: Incorrect old password')
        wrongOldPassword.value = true
      } else {
        console.error('Error updating password', error)
      }
    }
  }

  if (numberOfHouseholdMembers.value) {
    try {
      await api.put(
        '/user/edit/household?numberOfHouseholdMembers=' + numberOfHouseholdMembers.value, null)
    } catch (error) {
      console.error('Error updating household members', error)
    }
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

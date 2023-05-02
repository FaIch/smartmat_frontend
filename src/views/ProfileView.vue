<template>
    <div class="formBody">
        <form @submit.prevent="submitForm">
            <fieldset class="row">
              <h1>Innloggings Detaljer</h1>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input id="email" type="email" name="email" autocomplete="email" v-model="email" placeholder="Your email address" readonly disabled>
                    <label for="oldPassword">Gammelt Passord</label>
                    <input id="oldPassword" type="password" name="oldPassword" v-model="oldPassword" placeholder="Your old password">
                    <div class="checkmarkPosition">
                        <img v-if="passwordUpdated" class="success-message" src="../assets/Checkmark.png">
                    </div>
                    <div v-if="wrongOldPassword" class="error-message">
                        Incorrect old password
                    </div>
                    <label for="newPassword">Nytt Passord</label>
                    <input id="newPassword" type="password" name="newPassword" v-model="newPassword" placeholder="Your new password">
                    <div class="checkmarkPosition">
                        <img v-if="passwordUpdated" class="success-message" src="../assets/Checkmark.png">
                    </div>
                </div>
            </fieldset>
            <fieldset class="row">
              <h1>Personlige detaljer</h1>
                <div class="form-group">
                    <label for="mobileNumber">Telefon Nummer</label>
                    <input id="mobileNumber" type="tel" name="mobileNumber" autocomplete="tel" v-model="phoneNumber" placeholder="Your mobile number">
                    <div class="checkmarkPosition">
                        <img v-if="phoneNumberUpdated" class="success-message" src="../assets/Checkmark.png">
                    </div>
                    <label for="address">Adresse</label>
                    <input id="address" type="text" name="address" autocomplete="street-address" v-model="address" placeholder="Your address">
                    <div class="checkmarkPosition">
                        <img v-if="addressUpdated" class="success-message" src="../assets/Checkmark.png">
                    </div>
                    <label for="numberOfHouseholdMembers">Antall I Husholdning</label>
                    <input id="numberOfHouseholdMembers" type="text" name="postalCode" autocomplete="postal-code" v-model="numberOfHouseholdMembers" placeholder="Your postal code">
                </div>
            </fieldset>
            <div class="submit-button">
                <button id="submit-button" type="submit">Save Changes</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineExpose } from 'vue'
import { useUserStore } from '../stores/UserStore'
import axios from 'axios'
import { SHA256 } from 'crypto-js'

// Use the user store
const userStore = useUserStore()

// Define refs for form fields
const email = ref(userStore.email)
const phoneNumber = ref('')
const oldPassword = ref('')
const newPassword = ref('')
const address = ref('')
const numberOfHouseholdMembers = ref('')
const phoneNumberUpdated = ref(false)
const addressUpdated = ref(false)
const passwordUpdated = ref(false)
const wrongOldPassword = ref(false)
const config = {
  headers: {
    'Content-type': 'application/json'
  },
  withCredentials: true
}

// Fetch user data on component creation
onMounted(async () => {
  if (userStore.loggedIn) {
    await axios.get('http://localhost:8080/user/details', config)
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
  phoneNumberUpdated.value = false
  addressUpdated.value = false
  passwordUpdated.value = false

  // Make sure the user is logged in
  if (!userStore.loggedIn) {
    console.error('You are not logged in')
    return
  }

  // Update the phone number
  if (phoneNumber.value) {
    const phoneNumberRegex = /^\d{8}$/
    if (!phoneNumberRegex.test(phoneNumber.value)) {
      console.error('Invalid phone format')
      return
    }
    try {
      await axios.put('http://localhost:8080/user/edit/phone?phoneNumber=' + phoneNumber.value, null,
        config
      )
      phoneNumberUpdated.value = true
    } catch (error) {
      console.error('Error updating phone number', error)
    }
  }

  // Update the address
  if (address.value) {
    const addressRegex = /^[a-zA-Z\s]+\d+/
    if (!addressRegex.test(address.value)) {
      console.error('Invalid address format')
      return
    }
    try {
      await axios.put(
        'http://localhost:8080/user/edit/address?address=' + address.value, null,
        config
      )
      addressUpdated.value = true
    } catch (error) {
      console.error('Error updating address', error)
    }
  }

  // Update the password
  if (oldPassword.value && newPassword.value) {
    const hashedOldPassword = SHA256(oldPassword.value)
    const hashedNewPassword = SHA256(newPassword.value)
    try {
      const response = await axios.put(
        'http://localhost:8080/user/edit/password?oldPassword=' + hashedOldPassword + '&newPassword=' + hashedNewPassword, null,
        config
      )
      if (response.data.error) {
        throw new Error(response.data.error)
      }
      passwordUpdated.value = true
    } catch (error) {
      if (error.response && error.response.data === 'Incorrect password') {
        // Handle the incorrect old password exception here
        console.error('Error: Incorrect old password')
        wrongOldPassword.value = true
      } else {
        console.error('Error updating password', error)
      }
    }
  }

  // Update the postal code
  if (numberOfHouseholdMembers.value) {
    try {
      await axios.put(
        'http://localhost:8080/user/edit/postalCode?postalCode=' + numberOfHouseholdMembers.value, null,
        config
      )
    } catch (error) {
      console.error('Error updating postal code', error)
    }
  }
}

// Expose the submitForm function
defineExpose({
  submitForm,
  phoneNumberUpdated,
  addressUpdated,
  passwordUpdated
})
</script>

<style scoped>

.formBody {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    height: 100%;
    margin-top: 30px;
    padding-top: 90px;
    align-items: center;
    justify-content: center;
    height: 100vh;
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

h1 {
    text-align: center;
    padding-top: 20px;
    margin-bottom: 20px;
    color: white;
    font-size: 2em;
    font-weight: bold;
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
    color: #fff;
    background: #25A13A;
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

    .form-group {
        margin-left: 20px;
        margin-right: 20px;
    }

    .submit-button {
        width: 100%;
    }
}

@media only screen and (max-width: 480px) {
    h1 {
        font-size: 1.5em;
    }

    .form-group {
        margin-left: 10px;
        margin-right: 10px;
    }

    .submit-button {
        width: 100%;
    }
}

</style>

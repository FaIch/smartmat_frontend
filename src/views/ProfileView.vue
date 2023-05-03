<template>
    <div class="container">
        <h1>User Information</h1>
        <form @submit.prevent="submitForm">
            <fieldset class="row">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input id="email" type="email" name="email" autocomplete="email" v-model="email" placeholder="Your email address" readonly disabled>
                </div>
                <div class="form-group">
                    <label for="mobileNumber">Mobile Number</label>
                    <div class="checkmarkPosition">
                        <input id="mobileNumber" type="tel" name="mobileNumber" autocomplete="tel" v-model="phoneNumber" placeholder="Your mobile number">
                        <img v-if="phoneNumberUpdated" class="success-message" src="../assets/Checkmark.png">
                    </div>
                </div>
            </fieldset>
            <fieldset class="row">
                <div class="form-group">
                    <label for="oldPassword">Old Password</label>
                    <div class="checkmarkPosition">
                        <input id="oldPassword" type="password" name="oldPassword" v-model="oldPassword" placeholder="Your old password">
                        <img v-if="passwordUpdated" class="success-message" src="../assets/Checkmark.png">
                    </div>
                    <div v-if="wrongOldPassword" class="error-message">
                        Incorrect old password
                    </div>
                </div>
                <div class="form-group">
                    <label for="newPassword">New Password</label>
                    <div class="checkmarkPosition">
                        <input id="newPassword" type="password" name="newPassword" v-model="newPassword" placeholder="Your new password">
                        <img v-if="passwordUpdated" class="success-message" src="../assets/Checkmark.png">
                    </div>
                </div>
            </fieldset>
            <fieldset class="row">
                <div class="form-group">
                    <label for="address">Address</label>
                    <div class="checkmarkPosition">
                        <input id="address" type="text" name="address" autocomplete="street-address" v-model="address" placeholder="Your address">
                        <img v-if="addressUpdated" class="success-message" src="../assets/Checkmark.png">
                    </div>
                </div>
                <div class="form-group">
                    <label for="postalCode">Postal Code</label>
                    <input id="postalCode" type="text" name="postalCode" autocomplete="postal-code" v-model="postalCode" placeholder="Your postal code">
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
const postalCode = ref('')
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
    await fetchUserData()
  }
})

async function fetchUserData () {
  try {
    const response = await axios.get('http://localhost:8080/user/details', config)
    phoneNumber.value = response.data.mobileNumber
    address.value = response.data.address
    postalCode.value = response.data.postalCode
    console.log(response)
  } catch (error) {
    console.error('Error', error)
  }
}

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
  if (postalCode.value) {
    try {
      await axios.put(
        'http://localhost:8080/user/edit/postalCode?postalCode=' + postalCode.value, null,
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

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    padding-top: 150px;
    background-image: url("../assets/startpagebackground3.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.row {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 10px;
    flex-wrap: wrap;
}

.form-group {
    display: flex;
    flex-direction: column;
    border: none;
    margin-left: 40px;
    margin-right: 40px;
    flex: 1;
    margin-bottom: 20px;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
    color: white;
    font-size: 2em;
    font-weight: bold;
}

.form-group {
    margin-bottom: 15px;
}

label {
    color: white;
    display: block;
    margin-bottom: 5px;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
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

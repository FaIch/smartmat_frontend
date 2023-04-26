<template>
  <div class="container">
    <h1>Edit User Details</h1>
    <form @submit.prevent="submitForm">
      <fieldset class="row">
        <legend>User Information</legend>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" name="email" autocomplete="email" v-model="email" placeholder="Your email address">
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
          <label for="firstname">First Name</label>
          <input id="firstname" type="text" name="firstname" autocomplete="given-name" placeholder="Your first name">
        </div>
        <div class="form-group">
          <label for="lastname">Last Name</label>
          <input id="lastname" type="text" name="lastname" autocomplete="family-name" placeholder="Your last name">
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
          <input id="postalCode" type="text" name="postalCode" autocomplete="postal-code" placeholder="Your postal code">
        </div>
      </fieldset>
      <div class="submit-button">
        <button id="submit-button" type="submit">Save Changes</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, defineExpose, onMounted } from 'vue'
import { useUserStore } from '@/stores/UserStore'
import axios from 'axios'

// Use the user store
const userStore = useUserStore()

// Define refs for form fields
const email = ref(userStore.email)
const phoneNumber = ref('')
const address = ref('')
const phoneNumberUpdated = ref(false)
const addressUpdated = ref(false)
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
    email.value = response.data.email
    phoneNumber.value = response.data.mobileNumber
    address.value = response.data.address
    // firstName.value = response.data.firstName // Assuming the User model has firstName property
    // lastName.value = response.data.lastName // Assuming the User model has lastName property
    // postalCode.value = response.data.postalCode // Assuming the User model has postalCode property
    console.log(response)
  } catch (error) {
    console.error('Error', error)
  }
}

// Add a submitForm function
const submitForm = async () => {
  phoneNumberUpdated.value = false
  addressUpdated.value = false
  // Make sure the user is logged in
  if (!userStore.loggedIn) {
    console.error('Du er ikke logget inn')
    return
  }

  // Validate phone number (must be exactly 8 digits)
  const phoneNumberRegex = /^\d{8}$/
  if (!phoneNumberRegex.test(phoneNumber.value)) {
    console.error('Invalid phone format')
    return
  }

  // Validate address (string followed by a space and a number)
  const addressRegex = /^[a-zA-Z\s]+\d+/
  if (!addressRegex.test(address.value)) {
    console.error('Invalid address format')
    return
  }
  // Update the phone number
  try {
    await axios.put('http://localhost:8080/user/edit/phone?phoneNumber=' + phoneNumber.value, null,
      config
    )
    phoneNumberUpdated.value = true
  } catch (error) {
    console.error('Error updating phone number', error)
  }

  // Update the address
  try {
    await axios.put(
      'http://localhost:8080/user/edit/address?address=' + address.value, null,
      config
    )
    addressUpdated.value = true
  } catch (error) {
    console.error('Error updating address', error)
  }
  // Additional fields following the same pattern can be added
}

// Expose the submitForm function
defineExpose({
  submitForm,
  phoneNumberUpdated,
  addressUpdated
})
</script>

<style>

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  max-width: 600px;
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
}

legend {
  color: white;
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px;
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

</style>

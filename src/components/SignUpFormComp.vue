<template>
  <div class="signup-form" id="signup">
    <div class="title">Registrer deg</div>
    <div class="update-message">
      <h4> {{ updateMessage }}</h4>
    </div>
    <form @submit.prevent="submitSignup">
      <div class="input-boxes">
        <div class="input-box">
          <i class="fas fa-envelope"></i>
          <input
            type="email"
            v-model="email"
            placeholder="Email..."
            @input="resetUpdate"
            required
          >
        </div>
        <div class="input-box">
          <i class="fas fa-lock"></i>
          <input
            type="password"
            v-model="password"
            placeholder="Passord..."
            @input="resetUpdate"
            required
          >
        </div>
        <div class="input-box">
          <i class="fas fa-lock"></i>
          <input
            type="password"
            v-model="confirmPassword"
            placeholder="Bekreft passord..."
            @input="resetUpdate"
            required
          >
        </div>
        <div class="input-box">
          <i class="fas fa-users"></i>
          <select
            name="household-members"
            id="household-members"
            v-model="selectedHouseholdMembers"
            @change="updateDefaultOption"
            @input="resetUpdate"
            :class="{ 'default-option': isDefaultOptionSelected }"
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
        </div>
        <div class="input-box custom-checkbox">
          <input
            type="checkbox"
            id="add-child-user"
            v-model="addChildUser"
            @input="resetUpdate"
          />
          <label id="checkbox" for="add-child-user">Legg til bruker for barn?</label>
        </div>
        <div class="button input-box">
          <input type="submit" value="Registrer">
        </div>
        <div class="text sign-up-text">Har du allerede bruker?
          <label data-cy="switch-to-login" @click="emit('switch-view')">Logg inn</label>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'
import { SHA256 } from 'crypto-js'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const updateMessage = ref('')
const selectedHouseholdMembers = ref('')
const isDefaultOptionSelected = ref(true)
const addChildUser = ref(false)
const emit = defineEmits(['switch-view'])

watch(selectedHouseholdMembers, (newValue) => {
  isDefaultOptionSelected.value = newValue === ''
})

function updateDefaultOption () {
  isDefaultOptionSelected.value = false
}

function validateSignup () {
  const emailRegex = ref(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

  if (email.value === '' || password.value === '' || confirmPassword.value === '') {
    updateMessage.value = 'Please fill out all fields.'
    return false
  }
  if (!emailRegex.value.test(String(email.value).toLowerCase())) {
    updateMessage.value = 'Invalid email.'
    return false
  }
  if (password.value !== confirmPassword.value) {
    updateMessage.value = 'Passwords are not the same.'
    return false
  }
  if (email.value.length > 50) {
    updateMessage.value = 'Email is too long.'
    return false
  }
  if (password.value.length < 8) {
    updateMessage.value = 'Password must be at least 8 characters.'
    return false
  }
  if (password.value.length > 200) {
    updateMessage.value = 'Password is too long.'
    return false
  }
  return true
}

function resetUpdate () {
  updateMessage.value = ''
}

async function submitSignup () {
  resetUpdate()
  if (validateSignup()) {
    const path =
      addChildUser.value
        ? 'http://localhost:8080/user/create/child'
        : 'http://localhost:8080/user/create'

    const hashedPassword = SHA256(password.value)

    const data = {
      email: email.value,
      password: hashedPassword.toString(),
      numberOfHouseholdMembers: selectedHouseholdMembers.value
    }

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    axios.post(path, data, config).then(response => {
      if (response.status === 200) {
        updateMessage.value = response.data
      }
    }).catch((error) => {
      updateMessage.value = error.response.data
    })
  }
}

</script>

<style scoped>

.input-box select {
  height: 100%;
  width: 100%;
  outline: none;
  border: none;
  padding: 0 30px;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 2px solid rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  appearance: none;
  background: none;
  color: inherit;
  cursor: pointer;
}

.input-box .select-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.input-box .select-arrow:before {
  content: '\25BC';
  font-size: 15px;
}

.input-box select.default-option {
  color: rgba(0, 0, 0, 0.65);
}

.input-box select option {
  color: black;
}

.input-box select {
  color: black;
}

.input-box.custom-checkbox {
  display: flex;
  align-items: flex-start;
  height: auto;
  position: relative;
  margin-top: 10px;
}

.input-box.custom-checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.input-box.custom-checkbox label {
  margin: 0;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  user-select: none;
}

.input-box.custom-checkbox label:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.input-box.custom-checkbox input:checked ~ label:before {
  border-color: #1A7028;
  background-color: #1A7028;
}

.input-box.custom-checkbox label:after {
  content: "";
  position: absolute;
  left: 6px;
  top: 3px;
  width: 8px;
  height: 13px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(0) scaleX(0);
  transition: all 0.15s ease;
}

.input-box.custom-checkbox input:checked ~ label:after {
  transform: rotate(45deg) scaleX(1);
}

#checkbox {
  color: black;
}

.update-message {
  margin-top: 20px;
  height: 30px;
  padding: 0;
}

.update-message h4 {
  font-size: 17px;
  padding: 0;
  margin: 0;
}

@media only screen and (max-width: 600px){
  .input-box select {
    padding-left: 0;
    text-align: left;
  }
}
</style>

<template>
  <div class="container">
    <div class="main">
      <h1 class="title">Velg Bruker</h1>
      <div class="user-list">
        <div
            v-for="(user, index) in users"
            :key="index"
            class="user-item"
            :class="{ 'user-item-selected': selectedUser && selectedIndex === index }"
            @click="user.role === 'PARENT' ? showPasscodeInput(user, index) : null"
        >
          <img :src="user.avatar" :alt="user.name" class="avatar" />
          <p>{{ user.nickname }}</p>
          <div
              v-if="selectedUser && selectedIndex === index"
              class="passcode-wrapper"
              @click.stop="() => {}"
          >
            <div class="passcode-input">
              <input
                  v-model="passcodeInput"
                  type="password"
                  @input="validatePasscode"
                  placeholder="Passcode"
                  maxlength="4"
              />
              <p class="error" v-if="passcodeError">{{ passcodeError }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import logo from '@/assets/logo.png'
import { onMounted, ref } from 'vue'
import axios from 'axios'

const users = ref([])
const selectedUser = ref(null)
const passcodeInput = ref('')
const passcodeError = ref('')
const selectedIndex = ref(null)
const config = {
  headers: {
    'Content-type': 'application/json'
  },
  withCredentials: true
}

async function fetchUsers () {
  try {
    const response = await axios.get('http://localhost:8080/user/sub-user/get', config)
    users.value = response.data
    console.log(response.data)
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

onMounted(() => {
  fetchUsers()
})

/*
async function validatePasscode () {
  if (passcodeInput.value.length === 4) {
    try {
      const response = await axios.post('http://localhost:8080/user', {
        userId: selectedUser.value.id, // assuming each user has a unique id
        passcode: passcodeInput.value
      })

      if (response.data.valid) {
        // Passcode is correct
        console.log('Tilgang godkjent for bruker')
        passcodeError.value = ''
        passcodeInput.value = ''
        selectedUser.value = null
      } else {
        passcodeError.value = 'Feil kode. PrÃ¸v igjen!'
        passcodeInput.value = ''
      }
    } catch (error) {
      console.error('Error validating passcode:', error)
    }
  } else {
    passcodeError.value = ''
  }
}
*/

function showPasscodeInput (user, index) {
  if (selectedUser.value === user) {
    selectedUser.value = null
    selectedIndex.value = null
  } else {
    selectedUser.value = user
    selectedIndex.value = index
  }
}

</script>

<style scoped>

.passcode-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  transform: translateY(100%);
  transition: transform 0.3s ease-in-out;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #4a4a4a;
}

.main {
  width: 1000px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #4a4a4a;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}

.user-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
}

.user-item {
  cursor: pointer;
  width: 150px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background-color: #f1f1f1;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.user-item:hover {
  background-color: #e0e0e0;
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  z-index: 2;
  position: relative;
}

.passcode-input {
  position: absolute;
  bottom: 45px; /* Adjust this value to move the passcode input box vertically */
  left: 0;
  width: 100%;
  padding: 20px;
  background-color: white;
  border-top: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  transform: translateY(100%);
  transition: transform 0.3s ease-in-out;
  z-index: 3; /* Increase the z-index value to prevent the input from disappearing when clicked */
}

.passcode-input input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.passcode-input input:focus {
  border-color: #90caf9;
  box-shadow: 0 0 0 1px #90caf9, 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error {
  color: #f44336;
  font-size: 1rem;
  font-weight: 500;
}
.user-item-selected .passcode-wrapper {
  transform: translateY(0%);
}
.user-item p {
  z-index: 2;
  position: relative;
}
</style>

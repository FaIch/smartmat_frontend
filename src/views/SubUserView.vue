<template>
  <div class="sub-user-page-container">
    <h1 class="update-message"> {{ updateMessage }}</h1>
    <div class="sub-user-container">
      <div
        class="profile-image-container"
        v-for="(subuser, index) in subUsers"
        :key="index"
        @click="selectAccount(subuser, index)"
      >
        <div class="user-info-div">
          <img v-if="subuser.role === 'PARENT'"
            src="../assets/capybara.jpg"
            alt="Profile image"
            class="profile-image"
          />
          <img v-if="subuser.role === 'CHILD'"
            src="../assets/baby-capybara.jpg"
            alt="Profile image"
            class="profile-image"
          />
          <div class="user-name">
            <h1> {{ subuser.nickname }}</h1>
            <img src="../assets/icons/lock.svg" v-if="subuser.role === 'PARENT'">
          </div>
        </div>
        <div
          class="pin-code-field"
          v-show="subuser.role === 'PARENT' && selectedIndex === index"
          @click.stop
        >
          <div class="pin-inputs">
            <h2 v-if="subuser.passcode !== 0">PIN:</h2>
            <h2 v-if="subuser.passcode === 0">Sett PIN:</h2>
            <div class="pin-row">
              <input
                v-for="(_, pinIndex) in Array(4)"
                :key="pinIndex"
                v-model="pinCodes[index][pinIndex]"
                class="pin-input"
                type="text"
                maxlength="1"
                @input="focusNextInput($event, pinIndex)"
                @keydown="navigateInput($event, pinIndex)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SubUser } from '../components/types'
import { onMounted, ref } from 'vue'
import api from '../utils/httputils'
import { useUserStore } from '../stores/UserStore'
import router from '../router/index'

const userStore = useUserStore()
const subUsers = ref<SubUser[]>([])
const selectedIndex = ref<number | null>(null)
const pinCodes = ref<Array<Array<string>>>([])
const updateMessage = ref('')

onMounted(() => {
  getSubUsers()
})

async function getSubUsers () {
  const path = '/user/sub-user/get'
  await api.get(path)
    .then(async (response) => {
      if (response.status === 200) {
        subUsers.value = response.data
        pinCodes.value = subUsers.value.map(() => Array(4).fill(''))
      }
    }).catch((error) => {
      if (error.response.status === 600) {
        userStore.logout()
      }
    })
}

function selectAccount (subuser: SubUser, index: number) {
  resetUpdate()
  if (subuser.role === 'CHILD') {
    userStore.subUserLogin(subuser)
    router.push('/fridge')
    return
  }
  if (selectedIndex.value === index) {
    pinCodes.value[index] = Array(4).fill('')
    selectedIndex.value = null
  } else {
    selectedIndex.value = index
  }
}

function isDigitsOnly (input: string): boolean {
  return /^\d+$/.test(input)
}

function resetUpdate () {
  updateMessage.value = ''
}

async function validateAndLogin (subuser: SubUser, index: number) {
  const pin = pinCodes.value[index].join('')

  if (!isDigitsOnly(pin)) {
    selectAccount(subuser, index)
    updateMessage.value = 'PIN-kode kan bare være tall.'
    return
  }
  if (subuser.passcode === 0) {
    selectAccount(subuser, index)
    subuser.passcode = parseInt(pin, 10)
    setSubUserPasscode(subuser)
    return
  }

  const isPinCorrect = pin === subuser.passcode.toString()
  if (isPinCorrect) {
    userStore.subUserLogin(subuser)
    router.push('/fridge')
  } else {
    selectAccount(subuser, index)
    updateMessage.value = 'Feil PIN-kode'
    pinCodes.value[index] = Array(4).fill('')
  }
}

function focusNextInput (event: Event, pinIndex: number) {
  resetUpdate()
  const target = event.target as HTMLInputElement
  if (target.value.length === 1 && pinIndex < 3) {
    (target.nextElementSibling as HTMLInputElement)?.focus()
  } else if (target.value.length === 1 && pinIndex === 3) {
    const index = selectedIndex.value
    if (index !== null) {
      validateAndLogin(subUsers.value[index], index)
    }
  }
}

function navigateInput (event: KeyboardEvent, pinIndex: number) {
  const target = event.target as HTMLInputElement

  if (event.key === 'ArrowRight' && pinIndex < 3) {
    const nextInput = target.nextElementSibling as HTMLInputElement
    nextInput?.focus()
    setTimeout(() => {
      nextInput?.setSelectionRange(nextInput.value.length, nextInput.value.length) // Set the cursor to the end
    }, 0)
  } else if (event.key === 'ArrowLeft' && pinIndex > 0) {
    const prevInput = target.previousElementSibling as HTMLInputElement
    prevInput?.focus()
    setTimeout(() => {
      prevInput?.setSelectionRange(prevInput.value.length, prevInput.value.length) // Set the cursor to the end
    }, 0)
  }
}

async function setSubUserPasscode (subuser: SubUser) {
  const path = '/user/sub-user/edit'
  const subUserRequest = {
    userEmail: subuser.email,
    nickname: subuser.nickname,
    role: subuser.role,
    passcode: subuser.passcode
  }
  await api.put(path, subUserRequest)
    .then(async (response) => {
      if (response.status === 200) {
        updateMessage.value = `PIN kode satt: ${subuser.passcode}`
      }
    }).catch((error) => {
      if (error.response.status === 600) {
        userStore.logout()
      } else {
        updateMessage.value = 'Kunne ikke sette PIN-kode.'
      }
    })
}
</script>

<style scoped>

.update-message {
  color: white;
  height: 50px;
  margin: 0;
  padding: 0;
  font-size: 30px;
}

.sub-user-page-container {
  background-image: url("../assets/startpagebackground3.png");
  display: flex;
  flex-direction: column;
  padding-top: 75px;
  min-height: 100vh;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.sub-user-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-wrap: wrap;
  gap: 16px;
}

.profile-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 350px;
  height: 450px;
  position: relative;
  margin: 30px;
  cursor: pointer;
}

.user-info-div {
  height: 100%;
  padding-top: 10px;
}

.profile-image {
  border-radius: 50%;
  width: 300px;
  height: 300px;
  object-fit: cover;
  margin-bottom: 10px;
}

.user-name {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.user-name h1 {
  color: rgba(255, 255, 255, 0.8);
  font-size: 30px;
  margin: 0;
  transition: color 0.1s;
}

.profile-image-container:hover .profile-image {
  box-shadow: 0 0 10px white, 0 0 20px white;
  transition: box-shadow 0.1s;
}

/* Change text color to white on hover */
.profile-image-container:hover .user-name h1 {
  color: #fff;
}
.pin-code-field {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.pin-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 10px;
  width: 200px;
  height: 50px;
  background-color: white;
}

.pin-inputs {
  justify-content: center;
  align-items: center;
}

.pin-inputs h2{
  color: white;
  font-size: 25px;
}
.pin-input {
  width: 100%;
  height: 100%;
  text-align: center;
  border: 0.1px solid #ccc;
  border-radius: 4px;
  padding: 5px;
  font-size: 22px;
  font-weight: normal;
  outline: none;
}

@media only screen and (max-width: 400px){
  .profile-image-container {
    width: 200px;
    height: 300px;
  }
  .profile-image {
    border-radius: 50%;
    width: 100%;
    height: 200px;
    object-fit: cover;
    margin-bottom: 10px;
  }
  .sub-user-page-container {
    padding-top: 60px;
  }
}

@media only screen and (max-width: 835px) {
  .profile-image-container {
    padding: 0;
    padding-top: 20px;
    margin-bottom: 30px;
  }
}

</style>

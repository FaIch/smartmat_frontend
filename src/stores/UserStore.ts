import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import api from '../utils/httputils'
import router from '../router/index'
import { Role, SubUser } from '../components/types'

export const useUserStore = defineStore('userStore', () => {
  const email = ref('')
  const loggedIn = ref(false)
  const subUserLoggedIn = ref(false)
  const role = ref<Role>()
  const subUser = ref<SubUser>()
  const refreshTokenTimeoutId = ref<ReturnType<typeof setTimeout> | null>(null)

  async function refreshToken () {
    const path = '/user/auth/refreshToken'
    try {
      await api.post(path, null)
    } catch (error: unknown) {
      logout()
    } finally {
      startRefreshTimer()
    }
  }

  function startRefreshTimer () {
    if (refreshTokenTimeoutId.value) {
      clearTimeout(refreshTokenTimeoutId.value)
    }
    refreshTokenTimeoutId.value = setTimeout(refreshToken, 8 * 60 * 1000)
  }

  onMounted(() => {
    if (subUserLoggedIn.value) {
      startRefreshTimer()
    }
  })

  function stopRefreshTimer () {
    if (refreshTokenTimeoutId.value) {
      clearTimeout(refreshTokenTimeoutId.value)
      refreshTokenTimeoutId.value = null
    }
  }

  async function login (userEmail: string) {
    email.value = userEmail
    loggedIn.value = true
    startRefreshTimer()
  }

  function subUserLogin (subUserParam: SubUser) {
    subUser.value = subUserParam
    subUserLoggedIn.value = true
    role.value = subUser.value.role
  }

  function noSubUserLogin () {
    subUserLoggedIn.value = true
    role.value = Role.PARENT
  }

  async function logout () {
    email.value = ''
    role.value = undefined
    loggedIn.value = false
    subUser.value = undefined
    subUserLoggedIn.value = false
    stopRefreshTimer()
    router.push('/login')
  }
  return {
    email,
    role,
    loggedIn,
    refreshToken,
    login,
    logout,
    subUserLogin,
    noSubUserLogin,
    subUserLoggedIn
  }
},
{
  persist: true
})

export async function checkIsSubUserLoggedIn () {
  const userStore = useUserStore()
  return userStore.subUserLoggedIn
}

export async function checkIsUserLoggedIn () {
  const userStore = useUserStore()
  return userStore.loggedIn
}

export async function checkIfUserIsParent () {
  const userStore = useUserStore()
  return userStore.role === Role.PARENT
}

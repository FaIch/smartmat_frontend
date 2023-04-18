import axios from 'axios'
import { useUserStore } from '../stores/UserStore'
import router from '../router'

// NOTES: should password be string?

/**
 * Function for logging in a user.
 * @param inputUsername - The username of the user.
 * @param password - The password of the user.
 * @returns Promise<void> - A Promise that resolves to void.
 */
export async function login (inputUsername: string, inputPassword: string): Promise<void> {
  const userStore = useUserStore()

  try {
    const response = await axios.post('http://localhost:3333/token', {
      username: inputUsername,
      password: inputPassword
    })

    userStore.token = response.data

    await axios.get('http://localhost:3333/', {
      headers: {
        Authorization: `Bearer ${userStore.token}`
      }
    })
  } catch (error) {
    // Handle error
    console.error(error)
  }
}

/**
 * Function for creating a user.
 * @param inputUsername - The username of the user.
 * @param inputPassword - The password of the user.
 * @returns Promise<void> - A Promise that resolves to void.
 */
export async function createuser (
  inputUsername: string,
  inputPassword: string
): Promise<void> {
  try {
    /*
    const response = await axios.post('http://localhost:3333/login', {
      username: inputUsername,
      password: inputPassword
    })
    */
    router.push('/')
  } catch (error) {
    // Handle error
    console.error(error)
  }
}

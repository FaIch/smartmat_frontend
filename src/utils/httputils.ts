import axios, { AxiosError } from 'axios'

const api = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  baseURL: 'http://localhost:8080',
  withCredentials: true // This will allow cookies to be sent with requests
})
api.interceptors.request.use((request) => {
  console.log('Request:', request)
  return request
})

api.interceptors.response.use((response) => {
  console.log('Response:', response)
  return response
}, (error) => {
  return Promise.reject(error)
})

const handleTokenExpiration = async <T>(error: AxiosError, retryCallback: () => Promise<T>): Promise<T> => {
  if (error.response && error.response.status === 403) {
    // Check if the refresh token is present in the cookies
    const refreshToken = document.cookie.split('; ').find(row => row.startsWith('JWTRefreshToken='))
    if (refreshToken) {
      try {
        await api.post('/auth/refreshToken')
        // Retry the original request
        return await retryCallback()
      } catch (refreshError) {
        // Handle refresh token error
        console.error(refreshError)
        throw error
      }
    } else {
      console.error('Refresh token is not present in the cookies')
      throw error
    }
  }
  return Promise.reject(error)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFridgeItemsByUserId = async (): Promise<any> => {
  try {
    const response = await api.get('/user/fridge-items').catch((error) =>
      handleTokenExpiration(error, getFridgeItemsByUserId)
    )
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export default api

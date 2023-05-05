import axios from 'axios'

const api = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  baseURL: 'http://localhost:8080',
  withCredentials: true
})
api.interceptors.request.use((request) => {
  return request
})

api.interceptors.response.use((response) => {
  return response
}, (error) => {
  return Promise.reject(error)
})

export default api

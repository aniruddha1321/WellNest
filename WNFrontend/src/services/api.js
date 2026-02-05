import axios from 'axios'

const API_URL = 'http://localhost:8080/api/auth'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/login', { email, password })
    return response.data
  },

  signup: async (fullName, email, password, phoneNumber) => {
    const response = await api.post('/signup', { fullName, email, password, phoneNumber })
    return response.data
  }
}

export default api
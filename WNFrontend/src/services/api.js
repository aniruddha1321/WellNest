import axios from 'axios'

const API_URL = 'http://localhost:8080/api/auth'
const PROFILE_API_URL = 'http://localhost:8080/api/profile'
const WATER_API_URL = 'http://localhost:8080/api/water-intake'
const WORKOUT_API_URL = 'http://localhost:8080/api/workouts'
const SLEEP_API_URL = 'http://localhost:8080/api/sleep'
const MEAL_API_URL = 'http://localhost:8080/api/meals'
const HEALTH_TIP_API_URL = 'http://localhost:8080/api/health-tips'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const profileApi = axios.create({
  baseURL: PROFILE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const waterApi = axios.create({
  baseURL: WATER_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const workoutApi = axios.create({
  baseURL: WORKOUT_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const sleepApi = axios.create({
  baseURL: SLEEP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const mealApi = axios.create({
  baseURL: MEAL_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const healthTipApi = axios.create({
  baseURL: HEALTH_TIP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/login', { username, password })
    return response.data
  },

  signup: async (fullName, username, email, password, phoneNumber) => {
    const response = await api.post('/signup', { fullName, username, email, password, phoneNumber })
    return response.data
  },

  verifyEmail: async (email, code) => {
    const response = await api.post('/verify-email', null, { params: { email, code } })
    return response.data
  },

  sendVerificationEmail: async (email) => {
    const response = await api.post('/send-verification', null, { params: { email } })
    return response.data
  },

  forgotPassword: async (email) => {
    const response = await api.post('/forgot-password', null, { params: { email } })
    return response.data
  },

  resetPassword: async (email, code, newPassword) => {
    const response = await api.post('/reset-password', null, { params: { email, code, newPassword } })
    return response.data
  }
}

export const profileService = {
  updateProfile: async (email, profileData) => {
    const response = await profileApi.post('/update', profileData, { params: { email } })
    return response.data
  },

  getProfile: async (email) => {
    const response = await profileApi.get('/get', { params: { email } })
    return response.data
  }
}

export const waterService = {
  logWaterIntake: async (payload) => {
    const response = await waterApi.post('/log', payload)
    return response.data
  },
  getWaterIntake: async (email) => {
    const response = await waterApi.get('/logs', { params: { email } })
    return response.data
  },
  deleteWaterIntake: async (email, id) => {
    const response = await waterApi.delete(`/logs/${id}`, { params: { email } })
    return response.data
  }
}

export const workoutService = {
  logWorkout: async (payload) => {
    const response = await workoutApi.post('/log', payload)
    return response.data
  },
  getWorkouts: async (email) => {
    const response = await workoutApi.get('/logs', { params: { email } })
    return response.data
  },
  deleteWorkout: async (email, id) => {
    const response = await workoutApi.delete(`/logs/${id}`, { params: { email } })
    return response.data
  }
}

export const sleepService = {
  logSleep: async (payload) => {
    const response = await sleepApi.post('/log', payload)
    return response.data
  },
  getSleepLogs: async (email) => {
    const response = await sleepApi.get('/logs', { params: { email } })
    return response.data
  },
  deleteSleepLog: async (email, id) => {
    const response = await sleepApi.delete(`/logs/${id}`, { params: { email } })
    return response.data
  }
}

export const mealService = {
  logMeal: async (payload) => {
    const response = await mealApi.post('/log', payload)
    return response.data
  },
  getMeals: async (email) => {
    const response = await mealApi.get('/logs', { params: { email } })
    return response.data
  },
  deleteMeal: async (email, id) => {
    const response = await mealApi.delete(`/logs/${id}`, { params: { email } })
    return response.data
  }
}

export const healthTipService = {
  getRandomHealthTip: async (category = 'general') => {
    const response = await healthTipApi.get('/random', { params: { category } })
    return response.data
  },
  getHomeHealthTip: async (category = 'general') => {
    const response = await healthTipApi.get('/home', { params: { category } })
    return response.data
  }
}

export default api
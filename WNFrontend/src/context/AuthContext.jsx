import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = {
      fullName: localStorage.getItem('fullName'),
      email: localStorage.getItem('email')
    }

    if (storedToken && storedUser.fullName) {
      setToken(storedToken)
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    setToken(userData.token)
    localStorage.setItem('token', userData.token)
    localStorage.setItem('fullName', userData.fullName)
    localStorage.setItem('email', userData.email)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('fullName')
    localStorage.removeItem('email')
  }

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
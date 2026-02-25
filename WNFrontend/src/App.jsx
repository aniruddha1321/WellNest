import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import UserProfile from './components/UserProfile'
import Profile from './components/Profile'
import VerifyEmail from './components/VerifyEmail'
import WaterIntake from './components/WaterIntake'
import SleepLogs from './components/SleepLogs'
import WorkoutTracker from './components/WorkoutTracker'
import MealTracker from './components/MealTracker'
import AddWorkoutLog from './components/AddWorkoutLog'
import AddWaterLog from './components/AddWaterLog'
import AddSleepLog from './components/AddSleepLog'
import AddMealLog from './components/AddMealLog'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/water-intake" element={
            <ProtectedRoute>
              <WaterIntake />
            </ProtectedRoute>
          } />
          <Route path="/sleep-logs" element={
            <ProtectedRoute>
              <SleepLogs />
            </ProtectedRoute>
          } />
          <Route path="/workout-tracker" element={
            <ProtectedRoute>
              <WorkoutTracker />
            </ProtectedRoute>
          } />
          <Route path="/meal-tracker" element={
            <ProtectedRoute>
              <MealTracker />
            </ProtectedRoute>
          } />
          <Route path="/add-workout" element={
            <ProtectedRoute>
              <AddWorkoutLog />
            </ProtectedRoute>
          } />
          <Route path="/add-water" element={
            <ProtectedRoute>
              <AddWaterLog />
            </ProtectedRoute>
          } />
          <Route path="/add-sleep" element={
            <ProtectedRoute>
              <AddSleepLog />
            </ProtectedRoute>
          } />
          <Route path="/add-meal" element={
            <ProtectedRoute>
              <AddMealLog />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Home.css'

const Home = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getFirstName = () => {
    return user?.fullName?.split(' ')[0] || 'User'
  }

  const getUserInitial = () => {
    return user?.fullName?.charAt(0).toUpperCase() || 'U'
  }

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-brand">🏥 WellNest</div>
        <div className="navbar-user">
          <div className="user-info">
            <div className="user-avatar">{getUserInitial()}</div>
            <span>{user?.fullName}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="welcome-section">
          <h1>Welcome back, {getFirstName()}!</h1>
          <p>Ready to continue your wellness journey? Let's make today count.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">💪</div>
            <div className="card-title">Fitness Tracker</div>
            <div className="card-description">
              Track your workouts, set goals, and monitor your progress with our comprehensive fitness tools.
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🍎</div>
            <div className="card-title">Nutrition Guide</div>
            <div className="card-description">
              Plan your meals, track calories, and get personalized nutrition recommendations.
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">😴</div>
            <div className="card-title">Sleep Monitor</div>
            <div className="card-description">
              Monitor your sleep patterns and get insights to improve your rest quality.
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🧘</div>
            <div className="card-title">Wellness Hub</div>
            <div className="card-description">
              Access meditation guides, stress management tools, and mental health resources.
            </div>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">Workouts This Week</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">Calories Burned</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">Hours Slept</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">Wellness Score</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
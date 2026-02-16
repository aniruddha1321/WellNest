import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { profileService } from '../services/api'
import './Home.css'

const Home = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const waterGoal = 8
  const waterIntake = 0
  const waterPercent = Math.min(100, Math.round((waterIntake / waterGoal) * 100))
  const workoutTargetMinutes = 30
  const workoutMinutes = 0
  const workoutPercent = Math.min(100, Math.round((workoutMinutes / workoutTargetMinutes) * 100))
  const sleepHours = 0

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.email) {
          const response = await profileService.getProfile(user.email)
          setProfile(response.data)
        }
      } catch (err) {
        console.log('Profile not yet set up')
      }
    }
    fetchProfile()
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleProfileClick = () => {
    navigate('/profile')
  }

  const handleSettingsClick = () => {
    setIsUserMenuOpen(false)
  }

  const handleMenuToggle = () => {
    setIsUserMenuOpen(prev => !prev)
  }

  const handleLogoutClick = () => {
    setIsUserMenuOpen(false)
    handleLogout()
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
          <div className="user-menu">
            <button
              className="user-info-btn"
              onClick={handleMenuToggle}
              aria-haspopup="menu"
              aria-expanded={isUserMenuOpen}
            >
              <span className="user-info">
                <span className="user-avatar">{getUserInitial()}</span>
                <span>{user?.fullName}</span>
              </span>
            </button>
            {isUserMenuOpen && (
              <div className="user-menu-dropdown" role="menu">
                <button className="menu-item" role="menuitem" onClick={handleProfileClick}>
                  <span className="menu-item-content">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M4 20c1.8-4 5-6 8-6s6.2 2 8 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span>Profile</span>
                  </span>
                </button>
                <button className="menu-item" role="menuitem" onClick={handleSettingsClick}>
                  <span className="menu-item-content">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M3.5 12a8.5 8.5 0 0 1 .1-1.2l2.2-.6.6-1.5-1.4-1.8a8.7 8.7 0 0 1 1.7-1.7l1.8 1.4 1.5-.6.6-2.2A8.5 8.5 0 0 1 12 3.5c.4 0 .8 0 1.2.1l.6 2.2 1.5.6 1.8-1.4a8.7 8.7 0 0 1 1.7 1.7l-1.4 1.8.6 1.5 2.2.6c.1.4.1.8.1 1.2s0 .8-.1 1.2l-2.2.6-.6 1.5 1.4 1.8a8.7 8.7 0 0 1-1.7 1.7l-1.8-1.4-1.5.6-.6 2.2c-.4.1-.8.1-1.2.1s-.8 0-1.2-.1l-.6-2.2-1.5-.6-1.8 1.4a8.7 8.7 0 0 1-1.7-1.7l1.4-1.8-.6-1.5-2.2-.6c-.1-.4-.1-.8-.1-1.2Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                    <span>Settings</span>
                  </span>
                </button>
                <button className="menu-item" role="menuitem" onClick={handleLogoutClick}>
                  <span className="menu-item-content">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M10 12h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M12 9l-3 3 3 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4 12h5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span>Logout</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="welcome-section section-card animate delay-1">
          <h1>Welcome back, {getFirstName()}!</h1>
          <p>Ready to continue your wellness journey? Let's make today count.</p>
        </div>

        <div className="account-section section-card animate delay-2">
          <div className="account-header">
            <div>
              <h2>Profile Overview</h2>
              <p>Your account snapshot and readiness for today.</p>
            </div>
            <div className="account-badges">
              <span className={`status-pill ${profile?.profileCompleted ? 'complete' : 'incomplete'}`}>
                {profile?.profileCompleted ? 'Profile Complete' : 'Profile Incomplete'}
              </span>
              <span className="status-pill outline">Active Member</span>
            </div>
          </div>
          <div className="account-grid">
            <div className="account-card">
              <div className="account-label">Full Name</div>
              <div className="account-value">{user?.fullName || 'Not set'}</div>
            </div>
            <div className="account-card">
              <div className="account-label">Body Metrics</div>
              <div className="account-value">
                {profile?.height && profile?.weight
                  ? `${profile.height} cm / ${profile.weight} kg`
                  : 'Add height and weight'}
              </div>
            </div>
            <div className="account-card">
              <div className="account-label">BMI</div>
              <div className="account-value">
                {profile?.height && profile?.weight
                  ? ((profile.weight / ((profile.height / 100) ** 2)).toFixed(1))
                  : 'Not available'}
              </div>
            </div>
          </div>
        </div>

        <div className="trackers-section section-card animate delay-3">
          <div className="section-title-row">
            <h2>Daily Trackers</h2>
            <span className="section-note">Log small wins to build big habits.</span>
          </div>
          <div className="trackers-grid">
            <div className="tracker-card">
              <div className="tracker-head">
                <div>
                  <div className="tracker-title">Workout Tracker</div>
                  <div className="tracker-meta">Today's target: {workoutTargetMinutes} min</div>
                </div>
                <div className="tracker-icon">💪</div>
              </div>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${workoutPercent}%` }} />
              </div>
              <div className="tracker-meta">{workoutMinutes} min logged</div>
              <button className="ghost-btn">Log Workout</button>
            </div>

            <div className="tracker-card">
              <div className="tracker-head">
                <div>
                  <div className="tracker-title">Meal Tracker</div>
                  <div className="tracker-meta">Plan your day in three bites</div>
                </div>
                <div className="tracker-icon">🍽️</div>
              </div>
              <ul className="meal-list">
                <li><span>Breakfast</span><strong>Not logged</strong></li>
                <li><span>Lunch</span><strong>Not logged</strong></li>
                <li><span>Dinner</span><strong>Not logged</strong></li>
              </ul>
              <button className="ghost-btn">Add Meal</button>
            </div>

            <div className="tracker-card">
              <div className="tracker-head">
                <div>
                  <div className="tracker-title">Water Intake</div>
                  <div className="tracker-meta">Stay hydrated</div>
                </div>
                <div className="tracker-icon">💧</div>
              </div>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${waterPercent}%` }} />
              </div>
              <div className="tracker-meta">{waterIntake} / {waterGoal} glasses</div>
              <button className="ghost-btn">Add Glass</button>
            </div>

            <div className="tracker-card">
              <div className="tracker-head">
                <div>
                  <div className="tracker-title">Sleep Log</div>
                  <div className="tracker-meta">Last night</div>
                </div>
                <div className="tracker-icon">🌙</div>
              </div>
              <div className="sleep-hours">{sleepHours} hrs</div>
              <div className="tracker-meta">Aim for 7-9 hours</div>
              <button className="ghost-btn">Log Sleep</button>
            </div>
          </div>
        </div>

        <div className="dashboard-grid section-card animate delay-5">
         

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

        <div className="stats-section section-card animate delay-6">
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
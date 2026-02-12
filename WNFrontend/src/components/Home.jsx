import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { profileService } from '../services/api'
import './Home.css'

const Home = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editFormData, setEditFormData] = useState({
    age: '',
    height: '',
    weight: '',
    recentHealthIssues: [],
    pastHealthIssues: []
  })

  const healthIssuesOptions = [
    'Diabetes',
    'Hypertension',
    'Heart Disease',
    'Asthma',
    'Thyroid Issues',
    'Depression/Anxiety',
    'Obesity',
    'High Cholesterol',
    'Arthritis',
    'Back Pain',
    'Migraine',
    'Sleep Disorder',
    'PCOD/PCOS',
    'Allergies',
    'None'
  ]

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.email) {
          const response = await profileService.getProfile(user.email)
          setProfile(response.data)
          setEditFormData({
            age: response.data.age || '',
            height: response.data.height || '',
            weight: response.data.weight || '',
            recentHealthIssues: response.data.recentHealthIssues || [],
            pastHealthIssues: response.data.pastHealthIssues || []
          })
        }
      } catch (err) {
        console.log('Profile not yet set up')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user])

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

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'age') {
      const age = parseInt(value) || ''
      if (age === '' || (age >= 10 && age <= 120)) {
        setEditFormData({ ...editFormData, [name]: age })
      }
    } else if (name === 'height' || name === 'weight') {
      const num = parseFloat(value) || ''
      if (num === '' || num > 0) {
        setEditFormData({ ...editFormData, [name]: num })
      }
    }
  }

  const handleHealthIssueChange = (issue, type) => {
    setEditFormData(prev => {
      const issuesKey = type === 'recent' ? 'recentHealthIssues' : 'pastHealthIssues'
      const currentIssues = prev[issuesKey]
      
      if (currentIssues.includes(issue)) {
        return {
          ...prev,
          [issuesKey]: currentIssues.filter(i => i !== issue)
        }
      } else {
        return {
          ...prev,
          [issuesKey]: [...currentIssues, issue]
        }
      }
    })
  }

  const handleSaveProfile = async () => {
    try {
      const updated = await profileService.updateProfile(user.email, editFormData)
      setProfile(updated.data)
      setIsEditingProfile(false)
    } catch (err) {
      console.error('Failed to update profile')
    }
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

        {/* Health Profile Section */}
        <div className="profile-section">
          <div className="profile-header">
            <h2>📋 Your Health Profile</h2>
            <button 
              className="edit-profile-btn"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
            >
              {isEditingProfile ? '✕ Cancel' : '✏️ Edit Profile'}
            </button>
          </div>

          {loading ? (
            <p>Loading profile...</p>
          ) : !isEditingProfile ? (
            // Display Profile
            <div className="profile-display">
              {profile && profile.profileCompleted ? (
                <div className="profile-grid">
                  <div className="profile-item">
                    <div className="profile-label">Age</div>
                    <div className="profile-value">{profile.age} years</div>
                  </div>
                  <div className="profile-item">
                    <div className="profile-label">Height</div>
                    <div className="profile-value">{profile.height} cm</div>
                  </div>
                  <div className="profile-item">
                    <div className="profile-label">Weight</div>
                    <div className="profile-value">{profile.weight} kg</div>
                  </div>
                  <div className="profile-item">
                    <div className="profile-label">BMI</div>
                    <div className="profile-value">
                      {((profile.weight / ((profile.height / 100) ** 2)).toFixed(1))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-profile">
                  <p>Complete your health profile to get started</p>
                  <button 
                    className="complete-profile-btn"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    Complete Profile Now
                  </button>
                </div>
              )}

              {profile && profile.recentHealthIssues && profile.recentHealthIssues.length > 0 && (
                <div className="health-issues-display">
                  <div className="issues-section">
                    <h4>Recent Health Issues:</h4>
                    <div className="issues-list">
                      {profile.recentHealthIssues.map((issue, idx) => (
                        <span key={idx} className="issue-badge">{issue}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {profile && profile.pastHealthIssues && profile.pastHealthIssues.length > 0 && (
                <div className="health-issues-display">
                  <div className="issues-section">
                    <h4>Past Health Issues:</h4>
                    <div className="issues-list">
                      {profile.pastHealthIssues.map((issue, idx) => (
                        <span key={idx} className="issue-badge past">{issue}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Edit Profile Form
            <div className="profile-edit-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Age (years) *</label>
                  <input
                    type="number"
                    name="age"
                    value={editFormData.age}
                    onChange={handleEditInputChange}
                    min="10"
                    max="120"
                  />
                </div>
                <div className="form-group">
                  <label>Height (cm) *</label>
                  <input
                    type="number"
                    name="height"
                    value={editFormData.height}
                    onChange={handleEditInputChange}
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label>Weight (kg) *</label>
                  <input
                    type="number"
                    name="weight"
                    value={editFormData.weight}
                    onChange={handleEditInputChange}
                    step="0.1"
                  />
                </div>
              </div>

              <div className="form-group-full">
                <label>Recent Health Issues</label>
                <div className="health-issues-grid">
                  {healthIssuesOptions.map(issue => (
                    <div key={`recent-${issue}`} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`recent-${issue}`}
                        checked={editFormData.recentHealthIssues.includes(issue)}
                        onChange={() => handleHealthIssueChange(issue, 'recent')}
                      />
                      <label htmlFor={`recent-${issue}`}>{issue}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group-full">
                <label>Past Health Issues</label>
                <div className="health-issues-grid">
                  {healthIssuesOptions.map(issue => (
                    <div key={`past-${issue}`} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`past-${issue}`}
                        checked={editFormData.pastHealthIssues.includes(issue)}
                        onChange={() => handleHealthIssueChange(issue, 'past')}
                      />
                      <label htmlFor={`past-${issue}`}>{issue}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-save" onClick={handleSaveProfile}>
                  Save Profile
                </button>
                <button 
                  className="btn-cancel" 
                  onClick={() => setIsEditingProfile(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
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
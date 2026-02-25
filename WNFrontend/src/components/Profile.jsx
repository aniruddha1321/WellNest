import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { profileService } from '../services/api'
import './Home.css'

const Profile = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
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
            age: response.data.age != null ? String(response.data.age) : '',
            height: response.data.height != null ? String(response.data.height) : '',
            weight: response.data.weight != null ? String(response.data.weight) : '',
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

  const handleHomeClick = () => {
    navigate('/home')
  }

  const getUserInitial = () => {
    return user?.fullName?.charAt(0).toUpperCase() || 'U'
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target

    if (name === 'age') {
      if (!/^\d{0,3}$/.test(value)) {
        return
      }
      setEditFormData({ ...editFormData, [name]: value })
      return
    }

    if (name === 'height' || name === 'weight') {
      if (!/^\d*\.?\d*$/.test(value)) {
        return
      }
      setEditFormData({ ...editFormData, [name]: value })
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
      }

      return {
        ...prev,
        [issuesKey]: [...currentIssues, issue]
      }
    })
  }

  const handleSaveProfile = async () => {
    try {
      const payload = {
        ...editFormData,
        age: editFormData.age === '' ? null : Number(editFormData.age),
        height: editFormData.height === '' ? null : Number(editFormData.height),
        weight: editFormData.weight === '' ? null : Number(editFormData.weight)
      }
      const updated = await profileService.updateProfile(user.email, payload)
      setProfile(updated.data)
      setIsEditingProfile(false)
    } catch (err) {
      console.error('Failed to update profile')
    }
  }

  return (
    <div className="home-container">
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="navbar-brand">🏥 WellNest</div>
          <button
            onClick={handleHomeClick}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              fontWeight: '500',
              color: '#333',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#0ea5a6'}
            onMouseLeave={(e) => e.target.style.color = '#333'}
          >
            🏠 Home
          </button>
        </div>
        <div className="navbar-user">
          <button className="user-info-btn" onClick={handleHomeClick}>
            <span className="user-info">
              <span className="user-avatar">{getUserInitial()}</span>
              <span>{user?.fullName}</span>
            </span>
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="profile-section section-card animate delay-1">
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
      </div>
    </div>
  )
}

export default Profile

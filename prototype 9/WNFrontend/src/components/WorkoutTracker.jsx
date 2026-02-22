import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { workoutService } from '../services/api'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'
import './Home.css'
import './TrackerPages.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend)

const WorkoutTracker = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [workouts, setWorkouts] = useState([])
  const [chartData, setChartData] = useState({ minutes: [0,0,0,0,0,0,0], calories: [0,0,0,0,0,0,0] })
  const [apiError, setApiError] = useState('')
  const [dataLoaded, setDataLoaded] = useState(false)

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const minutesData = {
    labels,
    datasets: [
      {
        label: 'Minutes',
        data: chartData.minutes,
        borderColor: '#0ea5a6',
        backgroundColor: 'rgba(14, 165, 166, 0.18)',
        fill: true,
        tension: 0.35
      }
    ]
  }

  const caloriesData = {
    labels,
    datasets: [
      {
        label: 'Calories',
        data: chartData.calories,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderRadius: 8,
        maxBarThickness: 32
      }
    ]
  }

  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  }

  const getUserInitial = () => user?.fullName?.charAt(0).toUpperCase() || 'U'

  const buildWeeklyTotals = (logs) => {
    const minutes = [0, 0, 0, 0, 0, 0, 0]
    const calories = [0, 0, 0, 0, 0, 0, 0]
    logs.forEach((log) => {
      const timestamp = log.timestamp ? new Date(log.timestamp) : new Date()
      const dayIndex = (timestamp.getDay() + 6) % 7
      minutes[dayIndex] += parseInt(log.durationMinutes || 0, 10)
      calories[dayIndex] += parseInt(log.calories || 0, 10)
    })
    return { minutes, calories }
  }

  const refreshFromLogs = (logs) => {
    setWorkouts(logs)
    setChartData(buildWeeklyTotals(logs))
  }

  const formatLogDate = (log) => {
    if (!log.timestamp) {
      return '—'
    }
    return new Date(log.timestamp).toLocaleDateString()
  }

  useEffect(() => {
    if (!user?.email) {
      return
    }

    const loadLogs = async () => {
      setApiError('')
      try {
        const result = await workoutService.getWorkouts(user.email)
        const logs = result?.data ?? result ?? []
        refreshFromLogs(logs)
      } catch (error) {
        setApiError('Unable to load workout logs right now.')
      } finally {
        setDataLoaded(true)
      }
    }

    loadLogs()
  }, [user?.email])

  // Redirect to add log page if no logs exist
  useEffect(() => {
    if (dataLoaded && workouts.length === 0 && user?.email) {
      navigate('/add-workout')
    }
  }, [dataLoaded, workouts.length, user?.email, navigate])

  const handleDeleteLog = async (index) => {
    if (!window.confirm('Are you sure you want to delete this log?')) {
      return
    }

    const logToDelete = workouts[index]
    
    try {
      await workoutService.deleteWorkout(user.email, logToDelete.id || index)
      const updatedWorkouts = workouts.filter((_, i) => i !== index)
      refreshFromLogs(updatedWorkouts)
    } catch (error) {
      setApiError('Failed to delete log. Please try again.')
    }
  }



  const totalMinutes = chartData.minutes.reduce((a, b) => a + b, 0)
  const totalCalories = chartData.calories.reduce((a, b) => a + b, 0)
  const sessionsCount = workouts.length
  const hasLogs = workouts.length > 0

  return (
    <div className="home-container">
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="navbar-brand">🏥 WellNest</div>
          <button
            onClick={() => navigate('/home')}
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
          <button className="user-info-btn" onClick={() => navigate('/home')}>
            <span className="user-info">
              <span className="user-avatar">{getUserInitial()}</span>
              <span>{user?.fullName}</span>
            </span>
          </button>
          <button className="logout-btn" onClick={() => { logout(); navigate('/login') }}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <section className="section-card tracker-hero animate delay-1">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: '0.5rem 1rem',
                background: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              ← Back
            </button>
            <div>
              <h1>Workout Tracker</h1>
              <p>Log your daily workouts and track your progress.</p>
            </div>
            <button
              className="ghost-btn"
              onClick={() => navigate('/add-workout')}
              style={{ marginLeft: 'auto' }}
            >
              + Add Workout Log
            </button>
          </div>
        </section>

        {hasLogs && (
          <>
            <section className="section-card tracker-grid animate delay-3">
              <div className="stat-tile">
                <div className="stat-title">This Week</div>
                <div className="stat-value">{totalMinutes} min</div>
                <div className="stat-sub">{sessionsCount} sessions</div>
              </div>
              <div className="stat-tile">
                <div className="stat-title">Calories Burned</div>
                <div className="stat-value">{totalCalories}</div>
                <div className="stat-sub">Estimated total</div>
              </div>
              <div className="stat-tile">
                <div className="stat-title">Focus</div>
                <div className="stat-value">{workouts[0]?.type || 'N/A'}</div>
                <div className="stat-sub">Latest workout</div>
              </div>
              <div className="stat-tile">
                <div className="stat-title">Avg Duration</div>
                <div className="stat-value">{sessionsCount > 0 ? Math.round(totalMinutes / sessionsCount) : 0} min</div>
                <div className="stat-sub">Per session</div>
              </div>
            </section>

            <section className="section-card chart-grid animate delay-4">
              <div className="chart-card">
                <div className="chart-title">Workout Minutes</div>
                <div className="chart-subtitle">Daily time spent training.</div>
                <Line data={minutesData} options={lineOptions} />
              </div>
              <div className="chart-card">
                <div className="chart-title">Calories Burned</div>
                <div className="chart-subtitle">Estimated burn by day.</div>
                <Bar data={caloriesData} options={lineOptions} />
              </div>
            </section>

            <section className="section-card log-card animate delay-5">
              <div className="chart-title">Recent Sessions</div>
              <div className="chart-subtitle">Your logged workouts.</div>
              <ul className="log-list">
                {workouts.map((item, index) => (
                  <li key={index} className="log-row">
                    <div>
                      <strong>{formatLogDate(item)}</strong>
                      <div className="stat-sub">{item.exerciseType}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className="badge">{item.durationMinutes} min</span>
                      {item.calories > 0 && <span className="stat-sub">{item.calories} cal</span>}
                      <button
                        onClick={() => handleDeleteLog(index)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          backgroundColor: '#ff6b6b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default WorkoutTracker

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { waterService } from '../services/api'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import './Home.css'
import './TrackerPages.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler)

const WaterIntake = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [intakeLogs, setIntakeLogs] = useState([])
  const [chartData, setChartData] = useState({ glasses: [0, 0, 0, 0, 0, 0, 0] })
  const [apiError, setApiError] = useState('')
  const [dataLoaded, setDataLoaded] = useState(false)

  const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const goalGlasses = 8

  const weeklyLineData = {
    labels: weeklyLabels,
    datasets: [
      {
        label: 'Glasses',
        data: chartData.glasses,
        borderColor: '#0ea5a6',
        backgroundColor: 'rgba(14, 165, 166, 0.18)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const hydrationBars = {
    labels: weeklyLabels,
    datasets: [
      {
        label: 'Hydration %',
        data: chartData.glasses.map(value => Math.round((value / goalGlasses) * 100)),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderRadius: 8,
        maxBarThickness: 32
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 2 }
      }
    }
  }

  const getUserInitial = () => user?.fullName?.charAt(0).toUpperCase() || 'U'

  const totalGlassesToday = chartData.glasses[(new Date().getDay() + 6) % 7] || 0
  const totalLitersToday = intakeLogs.reduce((sum, log) => sum + (parseFloat(log.liters) || 0), 0)
  const totalCupsToday = intakeLogs.reduce((sum, log) => sum + (parseFloat(log.cups) || 0), 0)
  const hasLogs = intakeLogs.length > 0

  const buildWeeklyGlasses = (logs) => {
    const glasses = [0, 0, 0, 0, 0, 0, 0]
    logs.forEach((log) => {
      const timestamp = log.timestamp ? new Date(log.timestamp) : new Date()
      const dayIndex = (timestamp.getDay() + 6) % 7
      const liters = parseFloat(log.liters) || 0
      const cups = parseFloat(log.cups) || 0
      const totalGlasses = Math.round(liters * 4 + cups)
      glasses[dayIndex] += totalGlasses
    })
    return glasses
  }

  const refreshFromLogs = (logs) => {
    setIntakeLogs(logs)
    setChartData({ glasses: buildWeeklyGlasses(logs) })
  }

  const formatLogTime = (log) => {
    if (!log.timestamp) {
      return '—'
    }
    return new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  useEffect(() => {
    if (!user?.email) {
      return
    }

    const loadLogs = async () => {
      setApiError('')
      try {
        const result = await waterService.getWaterIntake(user.email)
        const logs = result?.data ?? result ?? []
        refreshFromLogs(logs)
      } catch (error) {
        setApiError('Unable to load water intake logs right now.')
      } finally {
        setDataLoaded(true)
      }
    }

    loadLogs()
  }, [user?.email])

  // Redirect to add log page if no logs exist
  useEffect(() => {
    if (dataLoaded && intakeLogs.length === 0 && user?.email) {
      navigate('/add-water')
    }
  }, [dataLoaded, intakeLogs.length, user?.email, navigate])

  const handleDeleteLog = async (index) => {
    if (!window.confirm('Are you sure you want to delete this log?')) {
      return
    }

    const logToDelete = intakeLogs[index]
    
    try {
      await waterService.deleteWaterIntake(user.email, logToDelete.id || index)
      const updatedLogs = intakeLogs.filter((_, i) => i !== index)
      refreshFromLogs(updatedLogs)
    } catch (error) {
      setApiError('Failed to delete log. Please try again.')
    }
  }

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
              <h1>Water Intake</h1>
              <p>Keep your hydration steady and hit your daily target.</p>
            </div>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => navigate('/add-water')}
              style={{ whiteSpace: 'nowrap', marginLeft: 'auto' }}
            >
              + Add Water Log
            </button>
          </div>
        </section>

        {hasLogs && (
          <>
            <section className="section-card tracker-grid animate delay-3">
              <div className="stat-tile">
                <div className="stat-title">Today</div>
                <div className="stat-value">{totalGlassesToday} / {goalGlasses}</div>
                <div className="stat-sub">Glasses logged</div>
              </div>
              <div className="stat-tile">
                <div className="stat-title">Liters</div>
                <div className="stat-value">{totalLitersToday.toFixed(1)} L</div>
                <div className="stat-sub">Today's intake</div>
              </div>
              <div className="stat-tile">
                <div className="stat-title">Cups</div>
                <div className="stat-value">{totalCupsToday} cups</div>
                <div className="stat-sub">Today's intake</div>
              </div>
              <div className="stat-tile">
                <div className="stat-title">Goal</div>
                <div className="stat-value">{goalGlasses} glasses</div>
                <div className="stat-sub">Daily target</div>
              </div>
            </section>

            <section className="section-card chart-grid animate delay-4">
              <div className="chart-card">
                <div className="chart-title">Weekly Intake</div>
                <div className="chart-subtitle">Track how close you are to the goal each day.</div>
                <Line data={weeklyLineData} options={chartOptions} />
              </div>
              <div className="chart-card">
                <div className="chart-title">Hydration Score</div>
                <div className="chart-subtitle">Percent of goal reached each day.</div>
                <Bar data={hydrationBars} options={chartOptions} />
              </div>
            </section>

            {intakeLogs.length > 0 && (
              <section className="section-card log-card animate delay-5">
                <div className="chart-title">Recent Logs</div>
                <div className="chart-subtitle">Your logged water intake.</div>
                <ul className="log-list">
                  {intakeLogs.map((log, index) => (
                    <li key={index} className="log-row">
                      <div>
                        <strong>{formatLogTime(log)}</strong>
                        <div className="stat-sub">Logged intake</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {log.liters > 0 && <span className="badge">{log.liters} L</span>}
                        {log.cups > 0 && <span className="badge">{log.cups} cups</span>}
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
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default WaterIntake

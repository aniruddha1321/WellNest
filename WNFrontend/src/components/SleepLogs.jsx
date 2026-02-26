import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { sleepService } from '../services/api'
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
import Navbar from './Navbar'
import './Home.css'
import './TrackerPages.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend)

const SleepLogs = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sleepLogs, setSleepLogs] = useState([])
  const [chartData, setChartData] = useState({ hours: [0, 0, 0, 0, 0, 0, 0] })
  const [apiError, setApiError] = useState('')
  const [dataLoaded, setDataLoaded] = useState(false)

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const sleepData = {
    labels,
    datasets: [
      {
        label: 'Hours Slept',
        data: chartData.hours,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.18)',
        tension: 0.35,
        fill: true
      }
    ]
  }

  const qualityData = {
    labels,
    datasets: [
      {
        label: 'Sleep Quality %',
        data: chartData.hours.map(h => Math.min(Math.round((h / 8) * 100), 100)),
        backgroundColor: 'rgba(14, 165, 166, 0.65)',
        borderRadius: 8,
        maxBarThickness: 32
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, max: 10 } }
  }

  const qualityOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, max: 100 } }
  }

  const getUserInitial = () => user?.fullName?.charAt(0).toUpperCase() || 'U'

  const buildWeeklyHours = (logs) => {
    const hours = [0, 0, 0, 0, 0, 0, 0]
    logs.forEach((log) => {
      const timestamp = log.timestamp ? new Date(log.timestamp) : new Date()
      const dayIndex = (timestamp.getDay() + 6) % 7
      hours[dayIndex] += parseFloat(log.durationHours || 0)
    })
    return hours
  }

  const refreshFromLogs = (logs) => {
    setSleepLogs(logs)
    setChartData({ hours: buildWeeklyHours(logs) })
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
        const result = await sleepService.getSleepLogs(user.email)
        const logs = result?.data ?? result ?? []
        refreshFromLogs(logs)
      } catch (error) {
        setApiError('Unable to load sleep logs right now.')
      } finally {
        setDataLoaded(true)
      }
    }

    loadLogs()
  }, [user?.email])

  // Redirect to add log page if no logs exist
  useEffect(() => {
    if (dataLoaded && sleepLogs.length === 0 && user?.email) {
      navigate('/add-sleep')
    }
  }, [dataLoaded, sleepLogs.length, user?.email, navigate])

  const handleDeleteLog = async (index) => {
    if (!window.confirm('Are you sure you want to delete this log?')) {
      return
    }

    const logToDelete = sleepLogs[index]
    
    try {
      await sleepService.deleteSleepLog(user.email, logToDelete.id || index)
      const updatedLogs = sleepLogs.filter((_, i) => i !== index)
      refreshFromLogs(updatedLogs)
    } catch (error) {
      setApiError('Failed to delete log. Please try again.')
    }
  }

  const totalHours = chartData.hours.reduce((sum, h) => sum + h, 0)
  const avgHours = sleepLogs.length > 0 ? (totalHours / sleepLogs.length).toFixed(1) : 0
  const lastNightHours = chartData.hours[(new Date().getDay() + 6) % 7] || 0
  const hasLogs = sleepLogs.length > 0

  return (
    <div className="home-container">
      <Navbar />

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
              <h1>Sleep Logs</h1>
              <p>See how your sleep adds up and keep a steady bedtime routine.</p>
            </div>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => navigate('/add-sleep')}
              style={{ whiteSpace: 'nowrap', marginLeft: 'auto' }}
            >
              + Add Sleep Log
            </button>
          </div>
        </section>

        {hasLogs && (
          <>
            <section className="section-card tracker-grid animate delay-3">
              <div className="stat-tile">
                <div className="stat-title">Last Night</div>
                <div className="stat-value">{lastNightHours} hrs</div>
                <div className="stat-sub">Hours slept</div>
              </div>
              <div className="stat-tile">
                <div className="stat-title">Average</div>
                <div className="stat-value">{avgHours} hrs</div>
                <div className="stat-sub">Per night</div>
              </div>
              <div className="stat-tile">
                <div className="stat-title">Total Logs</div>
                <div className="stat-value">{sleepLogs.length}</div>
                <div className="stat-sub">Entries recorded</div>
              </div>
              <div className="stat-tile">
                <div className="stat-title">Goal</div>
                <div className="stat-value">7-8 hrs</div>
                <div className="stat-sub">Recommended</div>
              </div>
            </section>

            <section className="section-card chart-grid animate delay-4">
              <div className="chart-card">
                <div className="chart-title">Hours Slept</div>
                <div className="chart-subtitle">Your sleep duration through the week.</div>
                <Line data={sleepData} options={chartOptions} />
              </div>
              <div className="chart-card">
                <div className="chart-title">Sleep Quality</div>
                <div className="chart-subtitle">How refreshed you felt each morning.</div>
                <Bar data={qualityData} options={qualityOptions} />
              </div>
            </section>

            {sleepLogs.length > 0 && (
              <section className="section-card log-card animate delay-5">
                <div className="chart-title">Recent Notes</div>
                <div className="chart-subtitle">Quick notes to spot patterns.</div>
                <ul className="log-list">
                  {sleepLogs.map((log, index) => (
                    <li key={index} className="log-row">
                      <div>
                        <strong>{formatLogDate(log)}</strong>
                        <div className="stat-sub">{log.notes || 'No notes'}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span className="badge">{log.durationHours} hrs</span>
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

export default SleepLogs

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
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

const SleepLogs = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    duration: '',
    notes: ''
  })
  const [sleepLogs, setSleepLogs] = useState([])
  const [chartData, setChartData] = useState({ hours: [0, 0, 0, 0, 0, 0, 0] })
  const [showCharts, setShowCharts] = useState(false)

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

  const totalHours = chartData.hours.reduce((sum, h) => sum + h, 0)
  const avgHours = sleepLogs.length > 0 ? (totalHours / sleepLogs.length).toFixed(1) : 0
  const lastNightHours = chartData.hours[(new Date().getDay() + 6) % 7] || 0

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const dayIndex = (new Date().getDay() + 6) % 7
    
    const newLog = {
      date: new Date().toLocaleDateString(),
      duration: parseFloat(formData.duration),
      notes: formData.notes,
      timestamp: new Date()
    }
    
    setSleepLogs([newLog, ...sleepLogs])
    
    const newHours = [...chartData.hours]
    newHours[dayIndex] = parseFloat(formData.duration) || 0
    setChartData({ hours: newHours })
    
    setShowCharts(true)
    setFormData({ duration: '', notes: '' })
  }

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-brand">🏥 WellNest</div>
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
          <div>
            <h1>Sleep Logs</h1>
            <p>See how your sleep adds up and keep a steady bedtime routine.</p>
          </div>
        </section>

        <section className="section-card animate delay-2" style={{ 
          background: 'white', 
          padding: '2.5rem', 
          borderRadius: '20px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
          maxWidth: '700px', 
          margin: '0 auto 2rem auto',
          border: '1px solid rgba(10, 61, 61, 0.08)'
        }}>
          <h3 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: '700', color: '#0a3d3d' }}>Log Your Sleep</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Sleep Duration (hours)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                min="0"
                max="24"
                step="0.5"
                placeholder="e.g., 7.5"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Notes (optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Sleep quality, hydration habits, or any observations..."
                rows="3"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', resize: 'vertical' }}
              />
            </div>
            
            <button type="submit" className="ghost-btn" style={{ 
              marginTop: '1rem', 
              width: '100%', 
              padding: '0.875rem',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              Log Sleep
            </button>
          </form>
        </section>

        {showCharts && (
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
                        <strong>{log.date}</strong>
                        <div className="stat-sub">{log.notes || 'No notes'}</div>
                      </div>
                      <span className="badge">{log.duration} hrs</span>
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

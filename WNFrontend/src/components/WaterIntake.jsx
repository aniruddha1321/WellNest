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
  Legend,
  Filler
} from 'chart.js'
import './Home.css'
import './TrackerPages.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler)

const WaterIntake = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    liters: '',
    cups: ''
  })
  const [intakeLogs, setIntakeLogs] = useState([])
  const [chartData, setChartData] = useState({ glasses: [0, 0, 0, 0, 0, 0, 0] })
  const [showCharts, setShowCharts] = useState(false)

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const dayIndex = (new Date().getDay() + 6) % 7
    
    const newLog = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      liters: parseFloat(formData.liters) || 0,
      cups: parseFloat(formData.cups) || 0,
      timestamp: new Date()
    }
    
    setIntakeLogs([...intakeLogs, newLog])
    
    const glassesFromLiters = (parseFloat(formData.liters) || 0) * 4
    const glassesFromCups = parseFloat(formData.cups) || 0
    const totalGlasses = Math.round(glassesFromLiters + glassesFromCups)
    
    const newGlasses = [...chartData.glasses]
    newGlasses[dayIndex] = (newGlasses[dayIndex] || 0) + totalGlasses
    setChartData({ glasses: newGlasses })
    
    setShowCharts(true)
    setFormData({ liters: '', cups: '' })
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
            <h1>Water Intake</h1>
            <p>Keep your hydration steady and hit your daily target.</p>
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
          <h3 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: '700', color: '#0a3d3d' }}>Log Water Intake</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Liters</label>
                <input
                  type="number"
                  name="liters"
                  value={formData.liters}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  placeholder="e.g., 0.5"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Cups</label>
                <input
                  type="number"
                  name="cups"
                  value={formData.cups}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  placeholder="e.g., 2"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
              </div>
            </div>
            
            <button type="submit" className="ghost-btn" style={{ 
              marginTop: '1rem', 
              width: '100%', 
              padding: '0.875rem',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              Log Water
            </button>
          </form>
        </section>

        {showCharts && (
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
                        <strong>{log.time}</strong>
                        <div className="stat-sub">Logged intake</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {log.liters > 0 && <span className="badge">{log.liters} L</span>}
                        {log.cups > 0 && <span className="badge">{log.cups} cups</span>}
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

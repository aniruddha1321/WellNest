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
  const [showLogForm, setShowLogForm] = useState(false)
  const [sleepLog, setSleepLog] = useState({
    bedtime: '',
    waketime: '',
    quality: '',
    notes: ''
  })

  const handleChange = (e) => {
    setSleepLog({ ...sleepLog, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (sleepLog.bedtime && sleepLog.waketime && sleepLog.quality) {
      // Calculate hours slept
      const bed = new Date(`2000-01-01 ${sleepLog.bedtime}`)
      const wake = new Date(`2000-01-01 ${sleepLog.waketime}`)
      let hours = (wake - bed) / (1000 * 60 * 60)
      if (hours < 0) hours += 24 // Handle overnight sleep
      
      console.log('Sleep logged:', {
        ...sleepLog,
        hoursSlept: hours.toFixed(1),
        date: new Date().toLocaleDateString()
      })
      
      // Reset form and hide it
      setSleepLog({ bedtime: '', waketime: '', quality: '', notes: '' })
      setShowLogForm(false)
      alert('Sleep logged successfully!')
    }
  }

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = [6.5, 7.2, 7.8, 6.9, 8.1, 7.4, 7.9]
  const quality = [78, 82, 88, 75, 90, 85, 87]

  const sleepData = {
    labels,
    datasets: [
      {
        label: 'Hours Slept',
        data: hours,
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
        data: quality,
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

  const sleepNotes = [
    { date: 'Sunday', detail: 'Fell asleep at 11:05 PM, woke at 6:55 AM' },
    { date: 'Saturday', detail: 'Late workout, asleep by 12:10 AM' },
    { date: 'Friday', detail: 'Cool room, deeper sleep' }
  ]

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
          <div className="tracker-actions">
            <button className="ghost-btn" onClick={() => setShowLogForm(!showLogForm)}>
              {showLogForm ? 'Close Form' : 'Log Sleep'}
            </button>
            <button className="ghost-btn" onClick={() => navigate('/water-intake')}>View Hydration</button>
          </div>
        </section>

        {showLogForm && (
          <section className="section-card tracker-hero animate delay-2" >
            <div className="workout-log-box" style={{ maxWidth: '300%', margin: '20px auto', boxShadow: 'none' }}>
              <h3>Log Your Sleep</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="time"
                  name="bedtime"
                  value={sleepLog.bedtime}
                  onChange={handleChange}
                  placeholder="Bedtime"
                  required
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                />
                <label style={{ fontSize: '12px', color: '#666', marginTop: '-8px' }}>Bedtime</label>

                <input
                  type="time"
                  name="waketime"
                  value={sleepLog.waketime}
                  onChange={handleChange}
                  placeholder="Wake Time"
                  required
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                />
                <label style={{ fontSize: '12px', color: '#666', marginTop: '-8px' }}>Wake Time</label>

                <select
                  name="quality"
                  value={sleepLog.quality}
                  onChange={handleChange}
                  required
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                >
                  <option value="">Sleep Quality</option>
                  <option value="Excellent">Excellent (90-100%)</option>
                  <option value="Good">Good (70-89%)</option>
                  <option value="Fair">Fair (50-69%)</option>
                  <option value="Poor">Poor (Below 50%)</option>
                </select>

                <textarea
                  name="notes"
                  value={sleepLog.notes}
                  onChange={handleChange}
                  placeholder="Notes (optional) - e.g., woke up feeling refreshed, had trouble falling asleep..."
                  rows="3"
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', resize: 'vertical', maxWidth: '100%' }}
                />

                <button 
                  type="submit"
                  style={{ 
                    background: '#0ea5a6', 
                    color: 'white', 
                    border: 'none', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    cursor: 'pointer',
                    marginTop: '12px'
                  }}
                >
                  Log Sleep
                </button>
              </form>
            </div>
          </section>
        )}

        <section className={`section-card tracker-grid animate ${showLogForm ? 'delay-3' : 'delay-2'}`}>
          <div className="stat-tile">
            <div className="stat-title">Last Night</div>
            <div className="stat-value">7.9 hrs</div>
            <div className="stat-sub">Deep sleep 2.1 hrs</div>
          </div>
          <div className="stat-tile">
            <div className="stat-title">Weekly Average</div>
            <div className="stat-value">7.4 hrs</div>
            <div className="stat-sub">Target 7.5 hrs</div>
          </div>
          <div className="stat-tile">
            <div className="stat-title">Consistency</div>
            <div className="stat-value">82%</div>
            <div className="stat-sub">Bedtime regularity</div>
          </div>
          <div className="stat-tile">
            <div className="stat-title">Recovery</div>
            <div className="stat-value">Good</div>
            <div className="stat-sub">Based on 3 nights</div>
          </div>
        </section>

        <section className={`section-card chart-grid animate ${showLogForm ? 'delay-4' : 'delay-3'}`}>
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

        <section className={`section-card log-card animate ${showLogForm ? 'delay-5' : 'delay-4'}`}>
          <div className="chart-title">Recent Notes</div>
          <div className="chart-subtitle">Quick notes to spot patterns.</div>
          <ul className="log-list">
            {sleepNotes.map((note) => (
              <li key={note.date} className="log-row">
                <div>
                  <strong>{note.date}</strong>
                  <div className="stat-sub">{note.detail}</div>
                </div>
                <span className="badge">Journal</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default SleepLogs

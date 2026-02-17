import React from 'react'
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

  const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weeklyGlasses = [5, 7, 6, 8, 4, 6, 7]
  const goalGlasses = 8

  const weeklyLineData = {
    labels: weeklyLabels,
    datasets: [
      {
        label: 'Glasses',
        data: weeklyGlasses,
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
        data: weeklyGlasses.map(value => Math.round((value / goalGlasses) * 100)),
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

  const recentLogs = [
    { time: '07:30 AM', amount: '1 glass', note: 'Before breakfast' },
    { time: '11:00 AM', amount: '2 glasses', note: 'Post workout' },
    { time: '03:15 PM', amount: '1 glass', note: 'Afternoon boost' },
    { time: '08:45 PM', amount: '1 glass', note: 'After dinner' }
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
            <h1>Water Intake</h1>
            <p>Keep your hydration steady and hit your daily target.</p>
          </div>
          <div className="tracker-actions">
            <button className="ghost-btn">Log a Glass</button>
            <button className="ghost-btn" onClick={() => navigate('/sleep-logs')}>View Sleep</button>
          </div>
        </section>

        <section className="section-card tracker-grid animate delay-2">
          <div className="stat-tile">
            <div className="stat-title">Today</div>
            <div className="stat-value">6 / {goalGlasses}</div>
            <div className="stat-sub">Glasses logged</div>
          </div>
          <div className="stat-tile">
            <div className="stat-title">Streak</div>
            <div className="stat-value">4 days</div>
            <div className="stat-sub">At least {goalGlasses} glasses</div>
          </div>
          <div className="stat-tile">
            <div className="stat-title">Next Reminder</div>
            <div className="stat-value">2:30 PM</div>
            <div className="stat-sub">Tap to reschedule</div>
          </div>
          <div className="stat-tile">
            <div className="stat-title">Goal</div>
            <div className="stat-value">{goalGlasses} glasses</div>
            <div className="stat-sub">Adjust daily target</div>
          </div>
        </section>

        <section className="section-card chart-grid animate delay-3">
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

        <section className="section-card log-card animate delay-4">
          <div className="chart-title">Today&apos;s Logs</div>
          <div className="chart-subtitle">Quick snapshot of your hydration moments.</div>
          <ul className="log-list">
            {recentLogs.map((log) => (
              <li key={log.time} className="log-row">
                <div>
                  <strong>{log.time}</strong>
                  <div className="stat-sub">{log.note}</div>
                </div>
                <span className="badge">{log.amount}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default WaterIntake

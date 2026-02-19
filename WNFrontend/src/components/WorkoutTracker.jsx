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
  Legend
} from 'chart.js'
import './Home.css'
import './TrackerPages.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend)

const WorkoutTracker = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const minutes = [20, 35, 0, 45, 30, 50, 25]
  const calories = [180, 260, 0, 340, 230, 410, 200]

  const minutesData = {
    labels,
    datasets: [
      {
        label: 'Minutes',
        data: minutes,
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
        data: calories,
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

  const workouts = [
    { day: 'Sunday', type: 'HIIT + Core', duration: '25 min', intensity: 'High' },
    { day: 'Saturday', type: 'Strength Training', duration: '50 min', intensity: 'Medium' },
    { day: 'Friday', type: 'Cycling', duration: '30 min', intensity: 'Medium' }
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
            <h1>Workout Tracker</h1>
            <p>Plan sessions, log activity, and keep momentum steady.</p>
          </div>
          <div className="tracker-actions">
            <button className="ghost-btn">Log Workout</button>
            <button className="ghost-btn" onClick={() => navigate('/meal-tracker')}>View Meals</button>
          </div>
        </section>

        <section className="section-card tracker-grid animate delay-2">
          <div className="stat-tile">
            <div className="stat-title">This Week</div>
            <div className="stat-value">205 min</div>
            <div className="stat-sub">4 sessions</div>
          </div>
          <div className="stat-tile">
            <div className="stat-title">Calories Burned</div>
            <div className="stat-value">1,620</div>
            <div className="stat-sub">Estimated total</div>
          </div>
          <div className="stat-tile">
            <div className="stat-title">Focus</div>
            <div className="stat-value">Strength</div>
            <div className="stat-sub">2 sessions logged</div>
          </div>
          <div className="stat-tile">
            <div className="stat-title">Recovery</div>
            <div className="stat-value">72%</div>
            <div className="stat-sub">Based on sleep + load</div>
          </div>
        </section>

        <section className="section-card chart-grid animate delay-3">
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

        <section className="section-card log-card animate delay-4">
          <div className="chart-title">Recent Sessions</div>
          <div className="chart-subtitle">Quick overview of the latest workouts.</div>
          <ul className="log-list">
            {workouts.map((item) => (
              <li key={item.day} className="log-row">
                <div>
                  <strong>{item.day}</strong>
                  <div className="stat-sub">{item.type}</div>
                </div>
                <span className="badge">{item.duration}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default WorkoutTracker

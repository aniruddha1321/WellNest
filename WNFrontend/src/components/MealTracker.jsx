import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'
import './Home.css'
import './TrackerPages.css'

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend)

const MealTracker = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const calories = [1850, 2100, 1980, 2200, 2050, 2300, 1950]

  const calorieData = {
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

  const macroData = {
    labels: ['Carbs', 'Protein', 'Fats'],
    datasets: [
      {
        data: [50, 28, 22],
        backgroundColor: ['#10b981', '#0ea5a6', '#f2b94b'],
        borderWidth: 0
      }
    ]
  }

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  }

  const doughnutOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  }

  const getUserInitial = () => user?.fullName?.charAt(0).toUpperCase() || 'U'

  const meals = [
    { meal: 'Breakfast', detail: 'Overnight oats + berries', calories: '420 kcal' },
    { meal: 'Lunch', detail: 'Grilled chicken salad', calories: '560 kcal' },
    { meal: 'Snack', detail: 'Greek yogurt + nuts', calories: '240 kcal' },
    { meal: 'Dinner', detail: 'Salmon, quinoa, greens', calories: '630 kcal' }
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
            <h1>Meal Tracker</h1>
            <p>Balance macros, log meals, and watch your daily intake.</p>
          </div>
          <div className="tracker-actions">
            <button className="ghost-btn">Add Meal</button>
            <button className="ghost-btn" onClick={() => navigate('/workout-tracker')}>View Workouts</button>
          </div>
        </section>

        <section className="section-card tracker-grid animate delay-2">
          <div className="stat-tile">
            <div className="stat-title">Today</div>
            <div className="stat-value">1,850 kcal</div>
            <div className="stat-sub">Target 2,000 kcal</div>
          </div>
          <div className="stat-tile">
            <div className="stat-title">Protein</div>
            <div className="stat-value">118 g</div>
            <div className="stat-sub">Goal 130 g</div>
          </div>
          <div className="stat-tile">
            <div className="stat-title">Hydration Pairing</div>
            <div className="stat-value">6 glasses</div>
            <div className="stat-sub">Based on today&apos;s meals</div>
          </div>
          <div className="stat-tile">
            <div className="stat-title">Meal Streak</div>
            <div className="stat-value">5 days</div>
            <div className="stat-sub">Logging all meals</div>
          </div>
        </section>

        <section className="section-card chart-grid animate delay-3">
          <div className="chart-card">
            <div className="chart-title">Calories Trend</div>
            <div className="chart-subtitle">Daily calorie intake this week.</div>
            <Bar data={calorieData} options={barOptions} />
          </div>
          <div className="chart-card">
            <div className="chart-title">Macro Split</div>
            <div className="chart-subtitle">Recommended balance for today.</div>
            <Doughnut data={macroData} options={doughnutOptions} />
          </div>
        </section>

        <section className="section-card log-card animate delay-4">
          <div className="chart-title">Today&apos;s Meals</div>
          <div className="chart-subtitle">Track what you ate so far.</div>
          <ul className="log-list">
            {meals.map((meal) => (
              <li key={meal.meal} className="log-row">
                <div>
                  <strong>{meal.meal}</strong>
                  <div className="stat-sub">{meal.detail}</div>
                </div>
                <span className="badge">{meal.calories}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default MealTracker

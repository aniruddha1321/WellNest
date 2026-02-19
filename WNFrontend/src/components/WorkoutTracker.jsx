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

const WorkoutTracker = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    exerciseType: '',
    duration: '',
    calories: ''
  })
  const [workouts, setWorkouts] = useState([])
  const [chartData, setChartData] = useState({ minutes: [0,0,0,0,0,0,0], calories: [0,0,0,0,0,0,0] })

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const today = days[new Date().getDay()]
    const dayIndex = (new Date().getDay() + 6) % 7
    
    const newWorkout = {
      day: today,
      type: formData.exerciseType,
      duration: `${formData.duration} min`,
      calories: formData.calories || 0
    }
    
    setWorkouts([newWorkout, ...workouts])
    
    const newMinutes = [...chartData.minutes]
    const newCalories = [...chartData.calories]
    newMinutes[dayIndex] = (newMinutes[dayIndex] || 0) + parseInt(formData.duration)
    newCalories[dayIndex] = (newCalories[dayIndex] || 0) + parseInt(formData.calories || 0)
    
    setChartData({ minutes: newMinutes, calories: newCalories })
    setFormData({ exerciseType: '', duration: '', calories: '' })
  }

  const totalMinutes = chartData.minutes.reduce((a, b) => a + b, 0)
  const totalCalories = chartData.calories.reduce((a, b) => a + b, 0)
  const sessionsCount = workouts.length

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
            <p>Log your daily workouts and track your progress.</p>
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
          <h3 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: '700', color: '#0a3d3d' }}>Log Your Workout</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Exercise Type</label>
              <select
                name="exerciseType"
                value={formData.exerciseType}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
              >
                <option value="">Select exercise type</option>
                <option value="Cardio">Cardio</option>
                <option value="Strength">Strength</option>
                <option value="Yoga">Yoga</option>
                <option value="HIIT">HIIT</option>
                <option value="Cycling">Cycling</option>
                <option value="Running">Running</option>
                <option value="Swimming">Swimming</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                min="1"
                placeholder="e.g., 30"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Calories Burned (optional)</label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleInputChange}
                min="0"
                placeholder="e.g., 250"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
              />
            </div>
            
            <button type="submit" className="ghost-btn" style={{ 
              marginTop: '1rem', 
              width: '100%', 
              padding: '0.875rem',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              Submit Workout
            </button>
          </form>
        </section>

        {workouts.length > 0 && (
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
                      <strong>{item.day}</strong>
                      <div className="stat-sub">{item.type}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className="badge">{item.duration}</span>
                      {item.calories > 0 && <span className="stat-sub">{item.calories} cal</span>}
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

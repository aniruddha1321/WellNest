import React, { useState } from 'react'
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
  const [formData, setFormData] = useState({
    mealType: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  })
  const [meals, setMeals] = useState([])
  const [chartData, setChartData] = useState({ calories: [0, 0, 0, 0, 0, 0, 0] })
  const [showCharts, setShowCharts] = useState(false)

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const calorieData = {
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

  const totalProtein = meals.reduce((sum, meal) => sum + (meal.protein || 0), 0)
  const totalCarbs = meals.reduce((sum, meal) => sum + (meal.carbs || 0), 0)
  const totalFats = meals.reduce((sum, meal) => sum + (meal.fats || 0), 0)
  const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0)

  const macroData = {
    labels: ['Carbs', 'Protein', 'Fats'],
    datasets: [
      {
        data: [totalCarbs, totalProtein, totalFats],
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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const dayIndex = (new Date().getDay() + 6) % 7
    
    const newMeal = {
      meal: formData.mealType,
      detail: 'Custom meal',
      calories: parseInt(formData.calories) || 0,
      protein: parseInt(formData.protein) || 0,
      carbs: parseInt(formData.carbs) || 0,
      fats: parseInt(formData.fats) || 0
    }
    
    setMeals([...meals, newMeal])
    
    const newCalories = [...chartData.calories]
    newCalories[dayIndex] = (newCalories[dayIndex] || 0) + newMeal.calories
    setChartData({ calories: newCalories })
    
    setShowCharts(true)
    setFormData({ mealType: '', calories: '', protein: '', carbs: '', fats: '' })
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
            <h1>Meal Tracker</h1>
            <p>Balance macros, log meals, and watch your daily intake.</p>
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
          <h3 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: '700', color: '#0a3d3d' }}>Log Your Meal</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Meal Type</label>
              <select
                name="mealType"
                value={formData.mealType}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
              >
                <option value="">Select meal type</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Calories</label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleInputChange}
                required
                min="1"
                placeholder="e.g., 350"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Protein (g)</label>
                <input
                  type="number"
                  name="protein"
                  value={formData.protein}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="20"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Carbs (g)</label>
                <input
                  type="number"
                  name="carbs"
                  value={formData.carbs}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="45"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Fats (g)</label>
                <input
                  type="number"
                  name="fats"
                  value={formData.fats}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="15"
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
              Log Meal
            </button>
          </form>
        </section>

        {showCharts && (
          <>
            <section className="section-card tracker-grid animate delay-3">
              <div className="stat-tile">
                <div className="stat-title">Today</div>
                <div className="stat-value">{totalCalories} kcal</div>
                <div className="stat-sub">Target 2,000 kcal</div>
              </div>
              <div className="stat-tile">
                <div className="stat-title">Protein</div>
                <div className="stat-value">{totalProtein} g</div>
                <div className="stat-sub">Goal 130 g</div>
              </div>
              <div className="stat-tile">
                <div className="stat-title">Carbs</div>
                <div className="stat-value">{totalCarbs} g</div>
                <div className="stat-sub">Goal 250 g</div>
              </div>
              <div className="stat-tile">
                <div className="stat-title">Fats</div>
                <div className="stat-value">{totalFats} g</div>
                <div className="stat-sub">Goal 65 g</div>
              </div>
            </section>

            <section className="section-card chart-grid animate delay-4">
              <div className="chart-container">
                <h3>Weekly Calories</h3>
                <Bar data={calorieData} options={barOptions} />
              </div>
              <div className="chart-container">
                <h3>Today's Macros</h3>
                <Doughnut data={macroData} options={doughnutOptions} />
              </div>
            </section>

            <section className="section-card animate delay-5">
              <h3>Recent Meals</h3>
              <div className="meals-list">
                {meals.map((meal, index) => (
                  <div key={index} className="meal-item">
                    <div className="meal-info">
                      <strong>{meal.meal}</strong>
                      <span>{meal.detail}</span>
                    </div>
                    <div className="meal-stats">
                      <span>{meal.calories} cal</span>
                      <span>P: {meal.protein}g</span>
                      <span>C: {meal.carbs}g</span>
                      <span>F: {meal.fats}g</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default MealTracker
import React, { useState } from 'react'
import './WorkoutLogBox.css'

const WorkoutLogBox = ({ onLogWorkout }) => {
  const [workout, setWorkout] = useState({
    type: '',
    duration: '',
    calories: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (workout.type && workout.duration) {
      onLogWorkout({
        ...workout,
        date: new Date().toLocaleDateString(),
        id: Date.now()
      })
      setWorkout({ type: '', duration: '', calories: '' })
    }
  }

  const handleChange = (e) => {
    setWorkout({ ...workout, [e.target.name]: e.target.value })
  }

  return (
    <div className="workout-log-box">
      <h3>Log Workout</h3>
      <form onSubmit={handleSubmit}>
        <select 
          name="type" 
          value={workout.type} 
          onChange={handleChange}
          required
        >
          <option value="">Exercise Type</option>
          <option value="Cardio">Cardio</option>
          <option value="Strength">Strength</option>
          <option value="Yoga">Yoga</option>
          <option value="HIIT">HIIT</option>
          <option value="Running">Running</option>
        </select>
        
        <input
          type="number"
          name="duration"
          value={workout.duration}
          onChange={handleChange}
          placeholder="Duration (min)"
          min="1"
          required
        />
        
        <input
          type="number"
          name="calories"
          value={workout.calories}
          onChange={handleChange}
          placeholder="Calories (optional)"
          min="0"
        />
        
        <button type="submit">Log Workout</button>
      </form>
    </div>
  )
}

export default WorkoutLogBox
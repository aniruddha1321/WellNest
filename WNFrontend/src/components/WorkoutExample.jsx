import React, { useState } from 'react'
import WorkoutLogBox from './WorkoutLogBox'

const WorkoutExample = () => {
  const [workouts, setWorkouts] = useState([])

  const handleLogWorkout = (workout) => {
    setWorkouts([workout, ...workouts])
    console.log('Workout logged:', workout)
  }

  return (
    <div>
      <WorkoutLogBox onLogWorkout={handleLogWorkout} />
      
      {workouts.length > 0 && (
        <div style={{ maxWidth: '300px', margin: '20px auto' }}>
          <h4>Recent Workouts:</h4>
          {workouts.slice(0, 3).map(workout => (
            <div key={workout.id} style={{ 
              background: '#f5f5f5', 
              padding: '10px', 
              margin: '5px 0', 
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              <strong>{workout.type}</strong> - {workout.duration}min
              {workout.calories && <span> ({workout.calories} cal)</span>}
              <div style={{ color: '#666', fontSize: '12px' }}>{workout.date}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WorkoutExample
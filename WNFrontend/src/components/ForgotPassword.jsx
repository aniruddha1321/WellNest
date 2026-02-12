import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../services/api'
import './Signup.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email) {
      setError('Email is required')
      return
    }

    try {
      setLoading(true)
      const data = await authService.forgotPassword(email)
      setMessage(data.message || 'If this email exists, a reset link has been sent to your inbox')
      setSubmitted(true)
      setEmail('')
    } catch (err) {
      setError(err.response?.data?.message || 'Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Reset Password</h2>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your registered email"
                required 
              />
              <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                We'll send you a link to reset your password
              </small>
            </div>

            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              ✓ Reset link has been sent to your email. Please check your inbox and follow the link to reset your password.
            </p>
            <p style={{ fontSize: '13px', color: '#999', marginBottom: '20px' }}>
              The link will expire in 15 minutes.
            </p>
            <button 
              className="btn"
              style={{ backgroundColor: '#6c757d', marginBottom: '10px' }}
              onClick={() => setSubmitted(false)}
            >
              Send Another Link
            </button>
          </div>
        )}

        <div className="divider">OR</div>

        <div className="login-link">
          Remember your password? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

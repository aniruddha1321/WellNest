import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { authService } from '../services/api'
import './Signup.css'

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [passwordStrength, setPasswordStrength] = useState('')

  useEffect(() => {
    // Get email and code from URL query parameters
    const emailParam = searchParams.get('email')
    const codeParam = searchParams.get('token')
    
    if (emailParam) setEmail(emailParam)
    if (codeParam) setCode(codeParam)
    
    // Fallback to location state if URL params not found
    if (!emailParam && location.state?.email) {
      setEmail(location.state.email)
    }
  }, [searchParams, location])

  // Validate password strength
  const validatePasswordStrength = (password) => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[@#$%^&+=]/.test(password)
    const isLongEnough = password.length >= 6

    if (!isLongEnough) {
      return { valid: false, message: 'Password must be at least 6 characters' }
    }
    if (!hasUpperCase) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' }
    }
    if (!hasLowerCase) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' }
    }
    if (!hasNumbers) {
      return { valid: false, message: 'Password must contain at least one number' }
    }
    if (!hasSpecialChar) {
      return { valid: false, message: 'Password must contain at least one special character (@#$%^&+=)' }
    }
    return { valid: true, message: 'Password is strong' }
  }

  const handlePasswordChange = (e) => {
    const password = e.target.value
    setNewPassword(password)
    if (password) {
      const strength = validatePasswordStrength(password)
      setPasswordStrength(strength.message)
    } else {
      setPasswordStrength('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email) {
      setError('Email is required')
      return
    }
    if (!code) {
      setError('Reset code is required')
      return
    }
    
    // Password validation
    const passwordValidation = validatePasswordStrength(newPassword)
    if (!passwordValidation.valid) {
      setError(passwordValidation.message)
      return
    }

    // Password should not start with '0'
    if (newPassword && newPassword.startsWith('0')) {
      setError('Password should not start with 0')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const data = await authService.resetPassword(email, code, newPassword)
      if (data.message && data.message.toLowerCase().includes('successful')) {
        setMessage('Password reset successful. Redirecting to login...')
        setTimeout(() => navigate('/login'), 1200)
      } else {
        setError(data.message || 'Reset failed')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error')
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Reset Password</h2>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        {!email || !code ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ color: '#dc3545', marginBottom: '20px' }}>
              ⚠️ Invalid or expired reset link
            </p>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Please request a new password reset link
            </p>
            <Link to="/forgot-password" className="btn" style={{ display: 'inline-block', textDecoration: 'none', padding: '12px 30px' }}>
              Go to Forgot Password
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email"
                value={email} 
                readOnly 
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              />
              <small style={{ color: '#999', marginTop: '5px', display: 'block' }}>
                Reset link sent to this email
              </small>
            </div>

            <div className="form-group">
              <label>Reset Code</label>
              <input 
                type="text"
                value={code} 
                readOnly 
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              />
              <small style={{ color: '#999', marginTop: '5px', display: 'block' }}>
                Automatically verified
              </small>
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={handlePasswordChange} 
                placeholder="Enter your new password"
                required 
              />
              {newPassword && (
                <small
                  style={{
                    color: passwordStrength === 'Password is strong' ? '#28a745' : '#dc3545',
                    marginTop: '5px',
                    display: 'block',
                    fontWeight: '500'
                  }}
                >
                  {passwordStrength}
                </small>
              )}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Confirm your new password"
                required 
              />
            </div>

            <button className="btn" type="submit">Reset Password</button>
          </form>
        )}

        <div className="divider">OR</div>

        <div className="login-link">
          Remember your password? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword

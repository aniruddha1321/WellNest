import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/api'
import './Signup.css'

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [signupComplete, setSignupComplete] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [otp, setOtp] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

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
      return { valid: false, message: 'Password must contain at least one special character (@#$%^&+=' }
    }
    return { valid: true, message: 'Password is strong' }
  }

  const validatePhoneNumber = (phone) => {
    // Must be exactly 10 digits and not start with 0
    return /^[1-9]\d{9}$/.test(phone)
  }

  const validateEmail = (email) => {
    // Basic email format and must not start with '0'
    if (!email || email.trim().length === 0) return false
    if (email.trim().startsWith('0')) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Update password strength indicator
    if (name === 'password') {
      const strength = validatePasswordStrength(value)
      setPasswordStrength(strength.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Full name validation
    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      setError('Full name must be at least 2 characters long')
      return
    }

    // Email validation
    if (!formData.email || !formData.email.trim()) {
      setError('Email is required')
      return
    }
    if (formData.email.trim().startsWith('0')) {
      setError('Email should not start with 0')
      return
    }
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    // Phone number validation
    if (!formData.phoneNumber || !formData.phoneNumber.trim()) {
      setError('Phone number is required')
      return
    }
    if (formData.phoneNumber.trim().startsWith('0')) {
      setError('Phone number should not start with 0')
      return
    }
    if (!validatePhoneNumber(formData.phoneNumber)) {
      setError('Phone number must be exactly 10 digits and not start with 0')
      return
    }

    // Password validation
    const passwordValidation = validatePasswordStrength(formData.password)
    if (!passwordValidation.valid) {
      setError(passwordValidation.message)
      return
    }

    // Password should not start with '0'
    if (formData.password && formData.password.startsWith('0')) {
      setError('Password should not start with 0')
      return
    }
    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    try {
      const data = await authService.signup(
        formData.fullName,
        formData.username,
        formData.email,
        formData.password,
        formData.phoneNumber
      )

      if (data.token) {
        login(data)
        setSuccess('Account created successfully! Redirecting...')
        setTimeout(() => navigate('/home'), 1000)
      } else {
        // Signup created but not verified yet
        setSuccess(data.message || 'Signup complete. Please verify your email')
        setSignupComplete(true)
        // Automatically send verification email after signup so user receives OTP
        try {
          setSendingOtp(true)
          setSuccess('Sending verification code...')
          const sendRes = await authService.sendVerificationEmail(formData.email)
          setOtpSent(true)
          setSuccess(sendRes.message || 'Verification code sent to your email')
        } catch (sendErr) {
          setError(sendErr.response?.data?.message || 'Failed to send verification email. Please click Verify to resend.')
        } finally {
          setSendingOtp(false)
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Connection error. Please make sure the server is running.')
    }
  }

  const handleSendOtp = async () => {
    setError('')
    setSuccess('')
    try {
      setSendingOtp(true)
      setSuccess('Sending verification code...')
      const data = await authService.sendVerificationEmail(formData.email)
      setOtpSent(true)
      setSuccess(data.message || 'Verification code sent')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code')
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    setError('')
    setSuccess('')
    try {
      const data = await authService.verifyEmail(formData.email, otp)
      if (data.token) {
        setEmailVerified(true)
        setSuccess('Email verified ✔')
        // auto-login and redirect to profile setup
        login(data)
        setTimeout(() => navigate('/user-profile', { state: { email: formData.email } }), 800)
      } else {
        setError(data.message || 'Verification failed')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification error')
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-form">
        <div className="logo">
          <h1>🏥 WellNest</h1>
          <p>Smart Health & Fitness Companion</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="email">Email Address</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ flex: 1 }}
              />
              <button type="button" className="verify-btn" onClick={handleSendOtp} disabled={!formData.email || otpSent} style={{ padding: '10px 5px' }}>
                {sendingOtp ? 'Sending...' : otpSent ? 'Sent' : 'Verify'}
              </button>
            </div>
            {emailVerified && (
              <div style={{ color: '#28a745', marginTop: '6px', fontWeight: '600' }}>Verified ✔</div>
            )}
          </div>

          {otpSent && !emailVerified && (
            <div className="form-group">
              <label>Verification Code</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter code" />
                <button type="button" className="btn" onClick={handleVerifyOtp}>Verify</button>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number (10 digits)</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter your 10-digit phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              maxLength="10"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {formData.password && (
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
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn" disabled={signupComplete && !emailVerified}>Create Account</button>
        </form>

        <div className="divider">OR</div>

        <div className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
import React, { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/api'
import './Signup.css'

const VerifyEmail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const email = useMemo(() => location.state?.email || '', [location.state])
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const handleSend = async () => {
    setError('')
    setSuccess('')

    if (!email) {
      setError('Email not found. Please sign up again.')
      return
    }

    try {
      setSending(true)
      setSuccess('Sending verification code...')
      const data = await authService.sendVerificationEmail(email)
      setSuccess(data.message || 'Verification code sent')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code')
    } finally {
      setSending(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email) {
      setError('Email not found. Please sign up again.')
      return
    }

    if (!code.trim()) {
      setError('Please enter the verification code')
      return
    }

    try {
      setVerifying(true)
      const data = await authService.verifyEmail(email, code.trim())
      if (data.token) {
        login(data)
        setSuccess('Email verified. Redirecting...')
        setTimeout(() => navigate('/user-profile', { state: { email } }), 800)
        return
      }
      setError(data.message || 'Verification failed')
    } catch (err) {
      setError(err.response?.data?.message || 'Verification error')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-form">
        <div className="logo">
          <h1>🏥 WellNest</h1>
          <p>Verify Your Email</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {!email && (
          <div className="login-link">
            Email is missing. <Link to="/signup">Go back to sign up</Link>
          </div>
        )}

        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="code">Verification Code</label>
            <input
              type="text"
              id="code"
              name="code"
              placeholder="Enter the code from your email"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn" onClick={handleSend} disabled={!email || sending} style={{ flex: 1 }}>
              {sending ? 'Sending...' : 'Send Code'}
            </button>
            <button type="submit" className="btn" disabled={!email || verifying} style={{ flex: 1 }}>
              {verifying ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>
        </form>

        <div className="divider">OR</div>

        <div className="login-link">
          Already verified? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail

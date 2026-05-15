import React, { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { UserPlus, User, Lock, Mail, Loader2, Sparkles, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { register, isAuthenticated } from '../services/api'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password || !confirmPassword) {
      return toast.error('Please fill in all required fields')
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match')
    }

    setLoading(true)
    try {
      await register(username, password, email)
      toast.success('Account created! You can now log in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px]" style={{ background: 'var(--accent)' }} />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[120px]" style={{ background: 'var(--coral)' }} />
      </div>

      <div 
        className="w-full max-w-md p-8 rounded-2xl border relative animate-fade-up"
        style={{ 
          background: 'var(--bg-card)', 
          borderColor: 'var(--border)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Link 
          to="/login"
          className="absolute left-6 top-6 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} />
        </Link>

        <div className="text-center mb-8">
          <div 
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 transform -rotate-6 transition-transform hover:rotate-0"
            style={{ background: 'rgba(199,125,255,0.15)', color: '#c77dff' }}
          >
            <UserPlus size={28} />
          </div>
          <h1 
            className="text-2xl font-bold mb-1" 
            style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}
          >
            Create Account
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Start tracking your finances today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-widest ml-1" style={{ color: 'var(--text-muted)' }}>
              Username
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className="w-full py-2.5 pl-10 pr-4 rounded-xl outline-none transition-all border text-sm"
                style={{ 
                  background: 'var(--bg-primary)', 
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  fontFamily: 'DM Sans, sans-serif'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-widest ml-1" style={{ color: 'var(--text-muted)' }}>
              Email (Optional)
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full py-2.5 pl-10 pr-4 rounded-xl outline-none transition-all border text-sm"
                style={{ 
                  background: 'var(--bg-primary)', 
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  fontFamily: 'DM Sans, sans-serif'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-widest ml-1" style={{ color: 'var(--text-muted)' }}>
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-2.5 pl-10 pr-4 rounded-xl outline-none transition-all border text-sm"
                style={{ 
                  background: 'var(--bg-primary)', 
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  fontFamily: 'DM Sans, sans-serif'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-widest ml-1" style={{ color: 'var(--text-muted)' }}>
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-2.5 pl-10 pr-4 rounded-xl outline-none transition-all border text-sm"
                style={{ 
                  background: 'var(--bg-primary)', 
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  fontFamily: 'DM Sans, sans-serif'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2"
            style={{ 
              background: 'var(--accent)', 
              color: '#0d0d16',
              fontFamily: 'Syne, sans-serif',
              boxShadow: '0 8px 24px -8px var(--accent-dim)'
            }}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <UserPlus size={20} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { LogIn, User, Lock, Loader2, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { login, isAuthenticated } from '../services/api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      return toast.error('Please fill in all fields')
    }

    setLoading(true)
    try {
      await login(username, password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid credentials')
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
        <div className="text-center mb-10">
          <div 
            className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6 transform rotate-12 transition-transform hover:rotate-0"
            style={{ background: 'var(--accent)', color: '#0d0d16' }}
          >
            <Sparkles size={32} />
          </div>
          <h1 
            className="text-3xl font-bold mb-2" 
            style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}
          >
            FinanceOS
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to manage your finances</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Username
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full py-3 pl-10 pr-4 rounded-xl outline-none transition-all border"
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

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-3 pl-10 pr-4 rounded-xl outline-none transition-all border"
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
            className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
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
                <LogIn size={20} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Single-user deployment. Contact admin for access.
          </p>
        </div>
      </div>
    </div>
  )
}

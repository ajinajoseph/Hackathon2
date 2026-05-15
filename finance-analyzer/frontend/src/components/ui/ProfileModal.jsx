import React from 'react'
import { X, User, Mail, Calendar, Shield } from 'lucide-react'
import { format } from 'date-fns'

export default function ProfileModal({ isOpen, onClose, userProfile }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Content */}
      <div 
        className="relative w-full max-w-md rounded-2xl border p-6 shadow-2xl animate-fade-up"
        style={{ 
          background: 'var(--bg-card)', 
          borderColor: 'var(--border)',
          fontFamily: 'DM Sans, sans-serif'
        }}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div 
            className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center text-3xl font-bold mb-4"
            style={{ 
              background: 'var(--accent)', 
              color: '#0d0d16',
              fontFamily: 'Syne, sans-serif',
              boxShadow: '0 0 30px var(--accent-dim)'
            }}
          >
            {userProfile.username.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
            Account Profile
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage your personal information</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl border" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(200,241,53,0.1)', color: 'var(--accent)' }}>
                <User size={16} />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Username</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{userProfile.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(116,185,255,0.1)', color: '#74b9ff' }}>
                <Mail size={16} />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Email Address</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{userProfile.email || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(199,125,255,0.1)', color: '#c77dff' }}>
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Member Since</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {userProfile.date_joined ? format(new Date(userProfile.date_joined), 'MMMM dd, yyyy') : 'Recently joined'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border flex items-center gap-3" style={{ background: 'rgba(255,107,107,0.05)', borderColor: 'rgba(255,107,107,0.1)' }}>
            <Shield size={16} style={{ color: 'var(--coral)' }} />
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Security features and password changes are currently restricted in this version.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-3 rounded-xl font-bold transition-all active:scale-[0.98]"
          style={{ 
            background: 'var(--bg-primary)', 
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontFamily: 'Syne, sans-serif'
          }}
        >
          Close View
        </button>
      </div>
    </div>
  )
}

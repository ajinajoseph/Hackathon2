import React from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, Search, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { getProfile } from '../../services/api'
import ProfileModal from '../ui/ProfileModal'

const pageTitles = {
  '/dashboard': { title: 'Dashboard', sub: 'Your financial overview' },
  '/add-expense': { title: 'Add Expense', sub: 'Record a new transaction' },
  '/analytics': { title: 'Analytics', sub: 'Deep dive into your spending' },
  '/ai-insights': { title: 'AI Insights', sub: 'Intelligent financial guidance' },
}

export default function Navbar() {
  const location = useLocation()
  const page = pageTitles[location.pathname] || { title: 'FinanceOS', sub: '' }
  const [showSearch, setShowSearch] = React.useState(false)
  const [showProfile, setShowProfile] = React.useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false)
  const [userProfile, setUserProfile] = React.useState({
    username: localStorage.getItem('username') || 'User',
    email: ''
  })

  React.useEffect(() => {
    getProfile()
      .then(data => {
        setUserProfile(data)
        localStorage.setItem('username', data.username)
      })
      .catch(err => {
        console.error("Failed to fetch profile", err)
      })
  }, [])

  // Close dropdowns on click outside
  React.useEffect(() => {
    const close = () => {
      setShowProfile(false)
      setShowSearch(false)
    }
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [])

  return (
    <>
      <header
        className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0 relative"
        style={{
          background: 'rgba(13,13,22,0.8)',
          backdropFilter: 'blur(12px)',
          borderColor: 'var(--border)',
          zIndex: 100,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div>
          <h1
            className="text-lg"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.2,
            }}
          >
            {page.title}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {page.sub}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date */}
          <div
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            <Calendar size={12} />
            {format(new Date(), 'MMM dd, yyyy')}
          </div>

          {/* Avatar & Dropdown */}
          <div className="relative">
            <div
              onClick={(e) => {
                e.stopPropagation()
                setShowProfile(!showProfile)
                setShowSearch(false)
              }}
              className="flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer transition-all hover:bg-white/5 active:scale-95"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ 
                  background: showProfile ? 'var(--text-primary)' : 'var(--accent)', 
                  color: '#0d0d16', 
                  fontFamily: 'Syne, sans-serif',
                  boxShadow: showProfile ? '0 0 15px var(--accent)' : 'none'
                }}
              >
                {userProfile.username.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif' }}>
                {userProfile.username}
              </span>
            </div>
            
            {showProfile && (
              <div 
                className="absolute right-0 mt-2 w-48 rounded-xl border z-50 overflow-hidden animate-fade-in"
                style={{ 
                  background: 'var(--bg-card)', 
                  borderColor: 'var(--border)',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.4)',
                }}
              >
                <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>SIGNED IN AS</p>
                  <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                    {userProfile.username}
                  </p>
                  {userProfile.email && (
                    <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                      {userProfile.email}
                    </p>
                  )}
                </div>
                <div className="p-1">
                  <button 
                    className="w-full text-left px-3 py-2 text-xs rounded-lg transition-colors hover:bg-white/5"
                    style={{ color: 'var(--text-secondary)' }}
                    onClick={() => {
                      setIsProfileModalOpen(true)
                      setShowProfile(false)
                    }}
                  >
                    Profile Settings
                  </button>
                  <button 
                    className="w-full text-left px-3 py-2 text-xs rounded-lg transition-colors hover:bg-red-500/10"
                    style={{ color: 'var(--coral)' }}
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('refresh');
                      localStorage.removeItem('username');
                      window.location.href = '/login';
                    }}
                  >
                    Logout Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        userProfile={userProfile} 
      />
    </>
  )
}

import React from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, Search, Calendar } from 'lucide-react'
import { format } from 'date-fns'

const pageTitles = {
  '/dashboard': { title: 'Dashboard', sub: 'Your financial overview' },
  '/add-expense': { title: 'Add Expense', sub: 'Record a new transaction' },
  '/analytics': { title: 'Analytics', sub: 'Deep dive into your spending' },
  '/ai-insights': { title: 'AI Insights', sub: 'Intelligent financial guidance' },
}

export default function Navbar() {
  const location = useLocation()
  const page = pageTitles[location.pathname] || { title: 'FinanceOS', sub: '' }

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
      style={{
        background: 'rgba(13,13,22,0.8)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--border)',
      }}
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
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
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

        {/* Search */}
        <button
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
          }}
        >
          <Search size={15} />
        </button>

        {/* Notifications */}
        <button
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors relative"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
          }}
        >
          <Bell size={15} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: 'var(--accent)' }}
          />
        </button>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer"
          style={{ background: 'var(--accent)', color: '#0d0d16', fontFamily: 'Syne, sans-serif' }}
        >
          U
        </div>
      </div>
    </header>
  )
}

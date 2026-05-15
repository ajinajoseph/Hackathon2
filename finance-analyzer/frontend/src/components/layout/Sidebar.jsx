import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, PlusCircle, BarChart3, Sparkles,
  Wallet, ChevronRight, TrendingUp, LogOut
} from 'lucide-react'
import { logout } from '../../services/api'
import { useSummary } from '../../hooks/useExpenses'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/add-expense', icon: PlusCircle, label: 'Add Expense' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/ai-insights', icon: Sparkles, label: 'AI Insights' },
]

export default function Sidebar() {
  const location = useLocation()
  const { summary } = useSummary()
  
  const monthlyTotal = summary?.total_month || 0
  const budget = 50000 // Default budget
  const healthPct = Math.min(Math.round((monthlyTotal / budget) * 100), 100)

  return (
    <aside
      className="w-64 flex-shrink-0 flex flex-col border-r"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent)', color: '#0d0d16' }}
          >
            <TrendingUp size={18} strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-display font-700 text-sm tracking-tight" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              FinanceOS
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Personal Finance</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs font-mono mb-3 px-3" style={{ color: 'var(--text-muted)' }}>
          NAVIGATION
        </p>
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path
          return (
            <NavLink
              key={path}
              to={path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group"
              style={{
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: isActive ? 500 : 400,
              }}
            >
              <Icon
                size={17}
                strokeWidth={isActive ? 2.5 : 2}
                style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}
              />
              <span style={{ fontFamily: 'DM Sans, sans-serif' }}>{label}</span>
              {isActive && (
                <ChevronRight
                  size={14}
                  className="ml-auto"
                  style={{ color: 'var(--accent)' }}
                />
              )}
            </NavLink>
          )
        })}

      </nav>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div
          className="p-3 rounded-lg"
          style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-accent)' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Wallet size={14} style={{ color: 'var(--accent)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>BUDGET HEALTH</span>
          </div>
          <div
            className="w-full h-1.5 rounded-full mt-2"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <div
              className="h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${healthPct}%`, background: healthPct > 90 ? 'var(--coral)' : 'var(--accent)' }}
            />
          </div>
          <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
            {healthPct}% of monthly budget used
          </p>
        </div>
      </div>
    </aside>
  )
}

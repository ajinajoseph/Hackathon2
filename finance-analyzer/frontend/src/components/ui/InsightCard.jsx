import React from 'react'
import { Sparkles, AlertTriangle, CheckCircle, Info } from 'lucide-react'

const typeConfig = {
  info: {
    icon: Info,
    color: 'var(--sky)',
    dim: 'var(--sky-dim)',
    border: 'rgba(116,185,255,0.2)',
  },
  warning: {
    icon: AlertTriangle,
    color: '#ffd43b',
    dim: 'rgba(255,212,59,0.1)',
    border: 'rgba(255,212,59,0.2)',
  },
  success: {
    icon: CheckCircle,
    color: 'var(--accent)',
    dim: 'var(--accent-dim)',
    border: 'var(--border-accent)',
  },
  ai: {
    icon: Sparkles,
    color: '#c77dff',
    dim: 'rgba(199,125,255,0.1)',
    border: 'rgba(199,125,255,0.2)',
  },
}

export default function InsightCard({ type = 'info', title, description, badge, delay = 0 }) {
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div
      className="rounded-xl p-4 border opacity-0 animate-fade-up"
      style={{
        background: config.dim,
        borderColor: config.border,
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: `${config.color}20` }}
        >
          <Icon size={14} style={{ color: config.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}
            >
              {title}
            </p>
            {badge && (
              <span
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  background: config.dim,
                  color: config.color,
                  border: `1px solid ${config.border}`,
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

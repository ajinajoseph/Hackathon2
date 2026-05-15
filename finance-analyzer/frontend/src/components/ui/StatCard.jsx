import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function StatCard({ title, value, change, changeLabel, icon: Icon, accent = 'lime', delay = 0 }) {
  const accentMap = {
    lime: { color: 'var(--accent)', dim: 'var(--accent-dim)' },
    coral: { color: 'var(--coral)', dim: 'var(--coral-dim)' },
    sky: { color: 'var(--sky)', dim: 'var(--sky-dim)' },
    purple: { color: '#c77dff', dim: 'rgba(199,125,255,0.15)' },
  }
  const colors = accentMap[accent] || accentMap.lime

  const isPositive = change > 0
  const isNeutral = change === 0

  return (
    <div
      className="rounded-xl p-5 border card-hover opacity-0 animate-fade-up"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <p
          className="text-xs font-mono uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          {title}
        </p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: colors.dim }}
        >
          {Icon && <Icon size={15} style={{ color: colors.color }} strokeWidth={2} />}
        </div>
      </div>

      <p
        className="text-2xl mb-2"
        style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1,
        }}
      >
        {value}
      </p>

      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          <div
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs"
            style={{
              background: isNeutral
                ? 'rgba(255,255,255,0.05)'
                : isPositive
                  ? 'rgba(200,241,53,0.1)'
                  : 'rgba(255,107,107,0.1)',
              color: isNeutral
                ? 'var(--text-muted)'
                : isPositive
                  ? 'var(--accent)'
                  : 'var(--coral)',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {isNeutral ? (
              <Minus size={10} />
            ) : isPositive ? (
              <TrendingUp size={10} />
            ) : (
              <TrendingDown size={10} />
            )}
            {Math.abs(change)}%
          </div>
          {changeLabel && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

import React, { useState } from 'react'
import BarChart from '../components/charts/BarChart'
import LineChart from '../components/charts/LineChart'
import PieChartComponent from '../components/charts/PieChart'
import { useCategoryBreakdown, useMonthlyTrend } from '../hooks/useExpenses'
import { getDailySpending } from '../services/api'
import { useEffect } from 'react'

const FILTERS = ['3 Months', '6 Months', '1 Year', 'All Time']

export default function Analytics() {
  const [activeFilter, setActiveFilter] = useState('6 Months')
  const [dailyData, setDailyData] = useState([])

  const { data: categoryData } = useCategoryBreakdown()
  const { data: trendData } = useMonthlyTrend()

  useEffect(() => {
    getDailySpending().then(d => setDailyData(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  const pieData = categoryData.map(c => ({ name: c.category, value: c.total }))
  const barData = categoryData.map(c => ({ name: c.category.split(' ')[0], value: c.total }))
  const lineData = trendData.map(t => ({ name: t.month, value: t.total }))

  const ChartCard = ({ title, subtitle, children, delay = 0 }) => (
    <div
      className="rounded-xl p-5 border opacity-0 animate-fade-up"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards',
      }}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Filter bar */}
      <div
        className="flex items-center gap-2 opacity-0 animate-fade-up"
        style={{ animationFillMode: 'forwards' }}
      >
        <span className="text-xs font-mono mr-2" style={{ color: 'var(--text-muted)' }}>PERIOD:</span>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs transition-all"
            style={{
              background: activeFilter === f ? 'var(--accent-dim)' : 'var(--bg-card)',
              color: activeFilter === f ? 'var(--accent)' : 'var(--text-secondary)',
              border: `1px solid ${activeFilter === f ? 'var(--border-accent)' : 'var(--border)'}`,
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Monthly Spending" subtitle="Total expenditure per month" delay={50}>
          <LineChart data={lineData} dataKey="value" xKey="name" color="#c8f135" />
        </ChartCard>

        <ChartCard title="Category Distribution" subtitle="Where your money goes" delay={100}>
          <PieChartComponent data={pieData} />
        </ChartCard>

        <ChartCard title="Spending by Category" subtitle="Comparative bar view" delay={150}>
          <BarChart data={barData} dataKey="value" xKey="name" color="#74b9ff" />
        </ChartCard>

        <ChartCard title="Daily Spending" subtitle="Last 30 days breakdown" delay={200}>
          <LineChart
            data={dailyData.map(d => ({ name: d.day, value: d.total }))}
            dataKey="value"
            xKey="name"
            color="#ff6b6b"
          />
        </ChartCard>
      </div>

      {/* Category table */}
      <div
        className="rounded-xl p-5 border opacity-0 animate-fade-up"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border)',
          animationDelay: '250ms',
          animationFillMode: 'forwards',
        }}
      >
        <h3
          className="text-sm font-semibold mb-4"
          style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}
        >
          Category Breakdown
        </h3>

        <div className="space-y-3">
          {categoryData.map((cat, i) => {
            const pct = categoryData.length > 0
              ? (cat.total / categoryData.reduce((s, c) => s + c.total, 0) * 100).toFixed(1)
              : 0
            const colors = ['#c8f135', '#74b9ff', '#ff6b6b', '#c77dff', '#ffd43b', '#fd9644', '#26de81', '#45aaf2']
            const color = colors[i % colors.length]

            return (
              <div key={cat.category} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                <p className="text-sm w-36 truncate" style={{ color: 'var(--text-secondary)' }}>
                  {cat.category}
                </p>
                <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
                <p
                  className="text-sm w-16 text-right"
                  style={{ color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}
                >
                  ₹{cat.total.toFixed(0)}
                </p>
                <p
                  className="text-xs w-10 text-right"
                  style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {pct}%
                </p>
              </div>
            )
          })}

          {categoryData.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
              No data yet. Add some expenses to see analytics.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import {
  PieChart as RechartsPie, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'

const COLORS = ['#c8f135', '#74b9ff', '#ff6b6b', '#c77dff', '#ffd43b', '#fd9644', '#26de81', '#45aaf2']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-lg text-sm"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        <p style={{ color: payload[0].payload.fill, fontWeight: 600 }}>
          {payload[0].name}
        </p>
        <p style={{ color: 'var(--text-secondary)' }}>
          ₹{payload[0].value.toFixed(2)}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
          {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%
        </p>
      </div>
    )
  }
  return null
}

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 justify-center">
    {payload?.map((entry, index) => (
      <div key={index} className="flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: entry.color }}
        />
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {entry.value}
        </span>
      </div>
    ))}
  </div>
)

export default function PieChart({ data = [] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const enriched = data.map(d => ({ ...d, total }))

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48" style={{ color: 'var(--text-muted)' }}>
        <p className="text-sm">No data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsPie>
        <Pie
          data={enriched}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
        >
          {enriched.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </RechartsPie>
    </ResponsiveContainer>
  )
}

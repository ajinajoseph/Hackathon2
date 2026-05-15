import React from 'react'
import {
  BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
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
        <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
        <p style={{ color: '#c8f135' }}>₹{payload[0].value.toFixed(2)}</p>
      </div>
    )
  }
  return null
}

export default function BarChart({ data = [], dataKey = 'value', xKey = 'name', color = '#c8f135' }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48" style={{ color: 'var(--text-muted)' }}>
        <p className="text-sm">No data available</p>
      </div>
    )
  }

  const maxVal = Math.max(...data.map(d => d[dataKey]))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsBar data={data} barSize={28}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
          vertical={false}
        />
        <XAxis
          dataKey={xKey}
          tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${v}`}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey={dataKey} radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry[dataKey] === maxVal ? color : `${color}60`}
            />
          ))}
        </Bar>
      </RechartsBar>
    </ResponsiveContainer>
  )
}

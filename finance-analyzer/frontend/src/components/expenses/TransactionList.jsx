import React, { useState } from 'react'
import { Trash2, Edit2, Search, ChevronDown, ArrowUpDown, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { deleteExpense } from '../../services/api'
import toast from 'react-hot-toast'

const CATEGORY_COLORS = {
  'Food & Dining': '#c8f135',
  'Transportation': '#74b9ff',
  'Housing': '#c77dff',
  'Entertainment': '#fd9644',
  'Healthcare': '#26de81',
  'Shopping': '#ff6b6b',
  'Utilities': '#ffd43b',
  'Education': '#45aaf2',
  'Travel': '#ff5e57',
  'Other': '#9191a8',
}

export default function TransactionList({ expenses = [], onRefresh, onEdit, loading = false }) {
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [deleting, setDeleting] = useState(null)

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return
    setDeleting(id)
    try {
      await deleteExpense(id)
      toast.success('Expense deleted')
      if (onRefresh) onRefresh()
      window.dispatchEvent(new CustomEvent('expenseUpdated'))
    } catch {
      toast.error('Failed to delete expense')
    } finally {
      setDeleting(null)
    }
  }

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const filtered = expenses
    .filter(e =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let va = a[sortField], vb = b[sortField]
      if (sortField === 'amount') { va = Number(va); vb = Number(vb) }
      if (sortField === 'date') { va = new Date(va); vb = new Date(vb) }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-4">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search transactions..."
          className="w-full text-sm"
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            borderRadius: '10px',
            padding: '9px 12px 9px 34px',
            fontFamily: 'DM Sans, sans-serif',
            outline: 'none',
          }}
        />
      </div>

      {/* Header */}
      <div
        className="grid text-xs font-mono uppercase tracking-wider px-3 py-2 rounded-lg mb-2"
        style={{
          gridTemplateColumns: '1fr 120px 100px 80px 80px',
          background: 'var(--bg-primary)',
          color: 'var(--text-muted)',
        }}
      >
        {[
          { label: 'Transaction', field: 'title' },
          { label: 'Category', field: 'category' },
          { label: 'Date', field: 'date' },
          { label: 'Amount', field: 'amount' },
        ].map(({ label, field }) => (
          <button
            key={field}
            className="flex items-center gap-1 text-left transition-colors"
            onClick={() => toggleSort(field)}
            style={{ color: sortField === field ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            {label}
            <ArrowUpDown size={10} />
          </button>
        ))}
        <span />
      </div>

      {/* Rows */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={20} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
          <p className="text-sm">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((expense, i) => {
            const catColor = CATEGORY_COLORS[expense.category] || '#9191a8'
            return (
              <div
                key={expense.id}
                className="grid items-center px-3 py-3 rounded-lg transition-colors cursor-default group"
                style={{
                  gridTemplateColumns: '1fr 120px 100px 80px 80px',
                  background: 'var(--bg-card)',
                  border: '1px solid transparent',
                  animationDelay: `${i * 30}ms`,
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
              >
                <div className="min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {expense.title}
                  </p>
                  {expense.description && (
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {expense.description}
                    </p>
                  )}
                </div>

                <div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: `${catColor}18`,
                      color: catColor,
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    {expense.category}
                  </span>
                </div>

                <p
                  className="text-xs"
                  style={{ color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {format(new Date(expense.date), 'MMM dd, yy')}
                </p>

                <p
                  className="text-sm font-medium"
                  style={{
                    color: 'var(--coral)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 500,
                  }}
                >
                  -₹{Number(expense.amount).toFixed(2)}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(expense.id)}
                    disabled={deleting === expense.id}
                    className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: 'var(--coral-dim)',
                      color: 'var(--coral)',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {deleting === expense.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                  </button>

                  <button
                    onClick={() => onEdit(expense)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: 'var(--accent-dim)',
                      color: 'var(--accent)',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <Edit2 size={12} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-xs mt-3 text-right" style={{ color: 'var(--text-muted)' }}>
          {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Receipt } from 'lucide-react'
import ExpenseForm from '../components/expenses/ExpenseForm'
import TransactionList from '../components/expenses/TransactionList'
import { useExpenses } from '../hooks/useExpenses'

export default function AddExpense() {
  const navigate = useNavigate()
  const { expenses, loading, refetch } = useExpenses({ limit: 20 })
  const [editingExpense, setEditingExpense] = React.useState(null)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 opacity-0 animate-fade-up" style={{ animationFillMode: 'forwards' }}>
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--text-primary)' }}>
            {editingExpense ? 'Edit Transaction' : 'Record Expense'}
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Add a new transaction to your tracker
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div
          className="lg:col-span-3 rounded-xl p-6 border opacity-0 animate-fade-up animate-stagger-1"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border)',
            animationFillMode: 'forwards',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent-dim)' }}
            >
              <Receipt size={16} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h3
                className="text-sm font-semibold"
                style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}
              >
                Expense Details
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Fill in the transaction information
              </p>
            </div>
          </div>
          <ExpenseForm 
            onSuccess={() => {
              refetch()
              setEditingExpense(null)
            }}
            initialData={editingExpense}
            onCancel={() => setEditingExpense(null)}
          />
        </div>

        {/* Tips */}
        <div
          className="lg:col-span-2 rounded-xl p-6 border opacity-0 animate-fade-up animate-stagger-2"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border)',
            animationFillMode: 'forwards',
          }}
        >
          <h3
            className="text-sm font-semibold mb-4"
            style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}
          >
            Tips
          </h3>
          <div className="space-y-3">
            {[
              { tip: 'Use descriptive titles', detail: 'Makes searching and categorizing easier later.' },
              { tip: 'Be consistent with categories', detail: 'Consistent categories improve AI accuracy.' },
              { tip: 'Log expenses immediately', detail: 'Prevents forgotten transactions and gaps in data.' },
              { tip: 'Add descriptions', detail: 'Notes help you remember context for unusual expenses.' },
            ].map(({ tip, detail }, i) => (
              <div key={i} className="flex gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-mono"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{tip}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent */}
      <div
        className="rounded-xl p-6 border opacity-0 animate-fade-up animate-stagger-3"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border)',
          animationFillMode: 'forwards',
        }}
      >
        <h3
          className="text-sm font-semibold mb-4"
          style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}
        >
          Recent Transactions
        </h3>
        <TransactionList 
          expenses={expenses} 
          onRefresh={refetch} 
          onEdit={setEditingExpense}
          loading={loading} 
        />
      </div>
    </div>
  )
}

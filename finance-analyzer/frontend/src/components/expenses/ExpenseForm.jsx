import React, { useState } from 'react'
import { IndianRupee, Tag, FileText, Calendar, Loader2, Plus, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { createExpense, updateExpense } from '../../services/api'

const CATEGORIES = [
  'Food & Dining', 'Transportation', 'Housing', 'Entertainment',
  'Healthcare', 'Shopping', 'Utilities', 'Education', 'Travel', 'Other'
]

const initialForm = {
  title: '',
  amount: '',
  category: '',
  date: new Date().toISOString().split('T')[0],
  description: '',
}

const Field = ({ label, error, children }) => (
  <div>
    <label
      className="block text-xs font-mono uppercase tracking-wider mb-2"
      style={{ color: error ? 'var(--coral)' : 'var(--text-muted)' }}
    >
      {label}
    </label>
    {children}
    {error && (
      <p className="text-xs mt-1" style={{ color: 'var(--coral)' }}>{error}</p>
    )}
  </div>
)

const inputStyle = (hasError) => ({
  background: 'var(--bg-primary)',
  border: `1px solid ${hasError ? 'var(--coral)' : 'var(--border)'}`,
  color: 'var(--text-primary)',
  borderRadius: '10px',
  padding: '10px 12px',
  fontSize: '14px',
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.15s ease',
})

export default function ExpenseForm({ onSuccess, initialData = null, onCancel = null }) {
  const isEditing = !!initialData
  const [form, setForm] = useState(initialData || initialForm)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  React.useEffect(() => {
    if (initialData) {
      setForm(initialData)
    }
  }, [initialData])

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Valid amount required'
    if (!form.category) e.category = 'Category is required'
    if (!form.date) e.date = 'Date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const payload = {
        title: form.title,
        amount: parseFloat(form.amount),
        category: form.category,
        date: form.date,
        description: form.description,
      }

      if (isEditing) {
        await updateExpense(initialData.id, payload)
        toast.success('Expense updated successfully!')
      } else {
        await createExpense(payload)
        toast.success('Expense added successfully!')
      }

      setForm(initialForm)
      setErrors({})
      if (onSuccess) onSuccess()
      window.dispatchEvent(new CustomEvent('expenseUpdated'))
    } catch (err) {
      toast.error(err.response?.data?.detail || `Failed to ${isEditing ? 'update' : 'add'} expense`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Title */}
        <Field label="Title" error={errors.title}>
          <div className="relative">
            <FileText
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="e.g. Grocery shopping"
              style={{ ...inputStyle(errors.title), paddingLeft: '36px' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = errors.title ? 'var(--coral)' : 'var(--border)'}
            />
          </div>
        </Field>

        {/* Amount */}
        <Field label="Amount (₹)" error={errors.amount}>
          <div className="relative">
            <IndianRupee
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="number"
              value={form.amount}
              onChange={e => handleChange('amount', e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              style={{ ...inputStyle(errors.amount), paddingLeft: '36px', fontFamily: 'JetBrains Mono, monospace' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = errors.amount ? 'var(--coral)' : 'var(--border)'}
            />
          </div>
        </Field>

        {/* Category */}
        <Field label="Category" error={errors.category}>
          <div className="relative">
            <Tag
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-muted)', zIndex: 1 }}
            />
            <select
              value={form.category}
              onChange={e => handleChange('category', e.target.value)}
              style={{ ...inputStyle(errors.category), paddingLeft: '36px', cursor: 'pointer' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = errors.category ? 'var(--coral)' : 'var(--border)'}
            >
              <option value="" disabled>Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </Field>

        {/* Date */}
        <Field label="Date" error={errors.date}>
          <div className="relative">
            <Calendar
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="date"
              value={form.date}
              onChange={e => handleChange('date', e.target.value)}
              style={{ ...inputStyle(errors.date), paddingLeft: '36px', colorScheme: 'dark' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = errors.date ? 'var(--coral)' : 'var(--border)'}
            />
          </div>
        </Field>
      </div>

      {/* Description */}
      <Field label="Description (optional)">
        <textarea
          value={form.description}
          onChange={e => handleChange('description', e.target.value)}
          placeholder="Add any notes..."
          rows={3}
          style={{
            ...inputStyle(false),
            resize: 'vertical',
            minHeight: '80px',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </Field>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200"
        style={{
          background: loading ? 'rgba(200,241,53,0.4)' : 'var(--accent)',
          color: '#0d0d16',
          fontFamily: 'Syne, sans-serif',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          border: 'none',
          transform: loading ? 'none' : undefined,
        }}
        onMouseEnter={e => { if (!loading) e.target.style.background = '#b5e020' }}
        onMouseLeave={e => { e.target.style.background = loading ? 'rgba(200,241,53,0.4)' : 'var(--accent)' }}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : isEditing ? (
          <Sparkles size={16} />
        ) : (
          <Plus size={16} />
        )}
        {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Expense' : 'Add Expense')}
      </button>

      {isEditing && onCancel && (
        <button
          onClick={onCancel}
          className="ml-3 px-6 py-3 rounded-xl text-sm font-medium transition-colors"
          style={{ 
            background: 'var(--bg-primary)', 
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            fontFamily: 'Syne, sans-serif'
          }}
        >
          Cancel
        </button>
      )}
    </div>
  )
}

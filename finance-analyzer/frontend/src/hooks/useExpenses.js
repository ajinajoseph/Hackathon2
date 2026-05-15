import { useState, useEffect, useCallback } from 'react'
import { getExpenses, getSummary, getCategoryBreakdown, getMonthlyTrend } from '../services/api'

export function useExpenses(params = {}) {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getExpenses(params)
      setExpenses(Array.isArray(data) ? data : data.results || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch expenses')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { fetch() }, [fetch])

  useEffect(() => {
    const handleUpdate = () => fetch()
    window.addEventListener('expenseUpdated', handleUpdate)
    return () => window.removeEventListener('expenseUpdated', handleUpdate)
  }, [fetch])

  return { expenses, loading, error, refetch: fetch }
}

export function useSummary(params = {}) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getSummary(params)
      setSummary(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch summary')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { fetch() }, [fetch])

  useEffect(() => {
    const handleUpdate = () => fetch()
    window.addEventListener('expenseUpdated', handleUpdate)
    return () => window.removeEventListener('expenseUpdated', handleUpdate)
  }, [fetch])

  return { summary, loading, error, refetch: fetch }
}

export function useCategoryBreakdown(params = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getCategoryBreakdown(params)
      setData(Array.isArray(res) ? res : [])
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { fetch() }, [fetch])

  useEffect(() => {
    const handleUpdate = () => fetch()
    window.addEventListener('expenseUpdated', handleUpdate)
    return () => window.removeEventListener('expenseUpdated', handleUpdate)
  }, [fetch])

  return { data, loading, refetch: fetch }
}

export function useMonthlyTrend(params = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getMonthlyTrend(params)
      setData(Array.isArray(res) ? res : [])
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { fetch() }, [fetch])

  useEffect(() => {
    const handleUpdate = () => fetch()
    window.addEventListener('expenseUpdated', handleUpdate)
    return () => window.removeEventListener('expenseUpdated', handleUpdate)
  }, [fetch])

  return { data, loading, refetch: fetch }
}

export default useExpenses

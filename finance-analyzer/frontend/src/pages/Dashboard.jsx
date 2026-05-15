import React from 'react'
import { DollarSign, TrendingDown, Calendar, PieChart, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../components/ui/StatCard'
import InsightCard from '../components/ui/InsightCard'
import LineChart from '../components/charts/LineChart'
import PieChartComponent from '../components/charts/PieChart'
import TransactionList from '../components/expenses/TransactionList'
import { useExpenses, useSummary, useCategoryBreakdown, useMonthlyTrend } from '../hooks/useExpenses'

export default function Dashboard() {
  const { expenses, loading: expLoading, refetch: refetchExpenses } = useExpenses({ limit: 10 })
  const { summary, refetch: refetchSummary } = useSummary()
  const { data: categoryData, refetch: refetchCategories } = useCategoryBreakdown()
  const { data: trendData, refetch: refetchTrend } = useMonthlyTrend()

  const handleRefresh = () => {
    refetchExpenses()
    refetchSummary()
    refetchCategories()
    refetchTrend()
  }

  const pieData = categoryData.map(c => ({ name: c.category, value: c.total }))
  const lineData = trendData.map(t => ({ name: t.month, value: t.total }))

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total This Month"
          value={summary ? `₹${Number(summary.total_month || 0).toFixed(2)}` : '₹—'}
          change={summary?.month_change}
          changeLabel="vs last month"
          icon={DollarSign}
          accent="lime"
          delay={50}
        />
        <StatCard
          title="Avg Daily Spend"
          value={summary ? `₹${Number(summary.avg_daily || 0).toFixed(2)}` : '₹—'}
          change={summary?.daily_change}
          changeLabel="vs last month"
          icon={TrendingDown}
          accent="coral"
          delay={100}
        />
        <StatCard
          title="This Week"
          value={summary ? `₹${Number(summary.total_week || 0).toFixed(2)}` : '₹—'}
          icon={Calendar}
          accent="sky"
          delay={150}
        />
        <StatCard
          title="Total Expenses"
          value={summary ? `${summary.count || 0}` : '—'}
          changeLabel="all time"
          icon={PieChart}
          accent="purple"
          delay={200}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line chart */}
        <div
          className="lg:col-span-2 rounded-xl p-5 border opacity-0 animate-fade-up animate-stagger-3"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
                Spending Trend
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Monthly overview</p>
            </div>
          </div>
          <LineChart data={lineData} dataKey="value" xKey="name" color="#c8f135" />
        </div>

        {/* Pie chart */}
        <div
          className="rounded-xl p-5 border opacity-0 animate-fade-up animate-stagger-4"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', animationFillMode: 'forwards' }}
        >
          <div className="mb-3">
            <h3 className="text-sm font-semibold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
              By Category
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Breakdown this month</p>
          </div>
          <PieChartComponent data={pieData} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Transactions */}
        <div
          className="lg:col-span-2 rounded-xl p-5 border opacity-0 animate-fade-up animate-stagger-4"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
              Recent Transactions
            </h3>
            <Link
              to="/add-expense"
              className="flex items-center gap-1 text-xs transition-colors"
              style={{ color: 'var(--accent)', fontFamily: 'DM Sans, sans-serif' }}
            >
              Add new <ArrowRight size={12} />
            </Link>
          </div>
          <TransactionList expenses={expenses} onRefresh={handleRefresh} loading={expLoading} />
        </div>

        {/* Quick insights */}
        <div className="space-y-3">
          <h3
            className="text-sm font-semibold opacity-0 animate-fade-up animate-stagger-4"
            style={{
              fontFamily: 'Syne, sans-serif',
              color: 'var(--text-primary)',
              animationFillMode: 'forwards',
            }}
          >
            Quick Insights
          </h3>
          
          {summary && (
            <>
              <InsightCard
                type={summary.month_change <= 0 ? "success" : "warning"}
                title={summary.month_change <= 0 ? "On Track" : "Spending Up"}
                description={summary.month_change <= 0 
                  ? `You're spending ${Math.abs(summary.month_change)}% less than last month. Keep it up!`
                  : `Your spending is up by ${summary.month_change}% compared to last month.`
                }
                badge={summary.month_change <= 0 ? "GOOD" : "WATCH"}
                delay={300}
              />
              
              {categoryData.length > 0 && (
                <InsightCard
                  type="info"
                  title="Top Category"
                  description={`Your highest spending is in ${categoryData[0].category}, totaling ₹${categoryData[0].total.toFixed(2)}.`}
                  badge="TOP"
                  delay={350}
                />
              )}

              <InsightCard
                type="ai"
                title="Daily Average"
                description={`You're averaging ₹${summary.avg_daily} per day this month.`}
                badge="AI"
                delay={400}
              />
            </>
          )}

          {!summary && (
            <div className="p-4 rounded-xl border border-dashed text-center" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Loading insights...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

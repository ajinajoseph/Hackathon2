import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import Dashboard from './pages/Dashboard'
import AddExpense from './pages/AddExpense'
import Analytics from './pages/Analytics'
import AIInsights from './pages/AIInsights'

import Login from './pages/Login'
import { isAuthenticated } from './services/api'

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

const Layout = ({ children }) => (
  <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/add-expense" element={<AddExpense />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/ai-insights" element={<AIInsights />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#c8f135', secondary: '#0d0d16' },
          },
          error: {
            iconTheme: { primary: '#ff6b6b', secondary: '#0d0d16' },
          },
        }}
      />
    </BrowserRouter>
  )
}

import React, { useState, useEffect, useRef } from 'react'
import { Sparkles, Send, Loader2, Bot, User, RefreshCw } from 'lucide-react'
import { getInsights, getChatInsight } from '../services/api'
import InsightCard from '../components/ui/InsightCard'

export default function AIInsights() {
  const [insights, setInsights] = useState([])
  const [insightsLoading, setInsightsLoading] = useState(true)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI financial advisor. Ask me anything about your spending patterns, savings goals, or get personalized recommendations based on your transaction history.",
    }
  ])
  const [input, setInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    getInsights()
      .then(d => setInsights(Array.isArray(d) ? d : []))
      .catch(() => setInsights([]))
      .finally(() => setInsightsLoading(false))
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || chatLoading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setChatLoading(true)

    try {
      const res = await getChatInsight(userMsg)
      setMessages(prev => [...prev, { role: 'assistant', content: res.response || res.message || 'I couldn\'t process that. Please try again.' }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I couldn\'t connect to the AI service. Make sure your API key is configured in the backend.',
      }])
    } finally {
      setChatLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const SUGGESTIONS = [
    'Where am I overspending?',
    'How can I save more money?',
    'What\'s my biggest expense?',
    'Give me a budget plan',
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chat */}
        <div
          className="lg:col-span-3 rounded-xl border flex flex-col opacity-0 animate-fade-up"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border)',
            height: '600px',
            animationFillMode: 'forwards',
          }}
        >
          {/* Chat header */}
          <div
            className="flex items-center gap-3 p-4 border-b"
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(199,125,255,0.15)' }}
            >
              <Sparkles size={15} style={{ color: '#c77dff' }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
                AI Financial Advisor
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Powered by Google Gemini</p>
            </div>
            <div
              className="ml-auto flex items-center gap-1.5 text-xs px-2 py-1 rounded-full"
              style={{ background: 'rgba(38,222,129,0.15)', color: '#26de81' }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#26de81' }} />
              Online
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: msg.role === 'user' ? 'var(--accent-dim)' : 'rgba(199,125,255,0.15)',
                  }}
                >
                  {msg.role === 'user'
                    ? <User size={13} style={{ color: 'var(--accent)' }} />
                    : <Bot size={13} style={{ color: '#c77dff' }} />
                  }
                </div>
                <div
                  className="rounded-xl px-4 py-2.5 text-sm max-w-xs lg:max-w-md leading-relaxed"
                  style={{
                    background: msg.role === 'user' ? 'var(--accent-dim)' : 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    border: `1px solid ${msg.role === 'user' ? 'var(--border-accent)' : 'var(--border)'}`,
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(199,125,255,0.15)' }}
                >
                  <Bot size={13} style={{ color: '#c77dff' }} />
                </div>
                <div
                  className="rounded-xl px-4 py-2.5"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                >
                  <Loader2 size={14} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your finances..."
                rows={1}
                className="flex-1 text-sm resize-none"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontFamily: 'DM Sans, sans-serif',
                  outline: 'none',
                  maxHeight: '100px',
                }}
                onFocus={e => e.target.style.borderColor = '#c77dff'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || chatLoading}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: input.trim() && !chatLoading ? '#c77dff' : 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  color: input.trim() && !chatLoading ? '#0d0d16' : 'var(--text-muted)',
                  cursor: input.trim() && !chatLoading ? 'pointer' : 'not-allowed',
                }}
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Insights panel */}
        <div
          className="lg:col-span-2 space-y-4 opacity-0 animate-fade-up animate-stagger-2"
          style={{ animationFillMode: 'forwards' }}
        >
          <div className="flex items-center justify-between">
            <h3
              className="text-sm font-semibold"
              style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}
            >
              Auto Insights
            </h3>
            <button
              onClick={() => {
                setInsightsLoading(true)
                getInsights().then(d => setInsights(Array.isArray(d) ? d : [])).finally(() => setInsightsLoading(false))
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <RefreshCw size={12} className={insightsLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          {insightsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={18} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
            </div>
          ) : insights.length > 0 ? (
            insights.map((insight, i) => (
              <InsightCard
                key={i}
                type={insight.type || 'ai'}
                title={insight.title}
                description={insight.description}
                badge={insight.badge}
                delay={i * 50}
              />
            ))
          ) : (
            <div className="space-y-3">
              <InsightCard type="ai" title="Add more expenses" description="Add at least 5 expenses to get personalized AI insights." badge="START" delay={0} />
              <InsightCard type="info" title="Connect API key" description="Set GEMINI_API_KEY in backend .env to enable AI features." delay={50} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

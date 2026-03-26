'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import {
  Activity, TrendingUp, Brain, Shield, Zap, BarChart3,
  ArrowUpRight, ArrowDownRight, Clock, Target, Cpu,
  Radio, Layers, Sparkles, ChevronRight, Hexagon, Eye, Menu, X
} from 'lucide-react';

// ============== MOCK DATA ==============
const MARKET_DATA = [
  { name: 'NIFTY 50', value: 22850.25, change: 0.85, symbol: '^NSEI' },
  { name: 'SENSEX', value: 75680.50, change: 0.72, symbol: '^BSESN' },
  { name: 'BANK NIFTY', value: 48500.30, change: -0.45, symbol: '^NSEBANK' },
  { name: 'NIFTY IT', value: 35200.80, change: 1.25, symbol: '^NSEIT' },
];

const SIGNALS_DATA = [
  { id: 1, stock: 'RELIANCE', type: 'BREAKOUT', direction: 'BUY', price: 2950.25, confidence: 92, rule: 'Price broke above 20-day high with volume spike' },
  { id: 2, stock: 'INFY', type: 'RSI_OVERSOLD', direction: 'BUY', price: 1520.80, confidence: 88, rule: 'RSI below 30, potential reversal' },
  { id: 3, stock: 'TCS', type: 'MACD_CROSS', direction: 'SELL', price: 4250.50, confidence: 78, rule: 'MACD bearish crossover' },
  { id: 4, stock: 'HDFCBANK', type: 'MA_CROSS', direction: 'BUY', price: 1680.25, confidence: 85, rule: '50-day MA crossed above 200-day MA' },
  { id: 5, stock: 'TATAMOTORS', type: 'VOLUME_SPIKE', direction: 'BUY', price: 980.50, confidence: 90, rule: 'Volume 3x average with price action' },
];

const BACKTEST_DATA = [
  { month: 'Jan', returns: 4.2, benchmark: 2.1 },
  { month: 'Feb', returns: 6.8, benchmark: 1.5 },
  { month: 'Mar', returns: -2.1, benchmark: -0.8 },
  { month: 'Apr', returns: 8.5, benchmark: 3.2 },
  { month: 'May', returns: 5.2, benchmark: 2.8 },
  { month: 'Jun', returns: 10.1, benchmark: 4.5 },
];

const PORTFOLIO_DATA = [
  { name: 'IT', value: 35, color: '#06b6d4' },
  { name: 'Finance', value: 25, color: '#8b5cf6' },
  { name: 'Energy', value: 20, color: '#10b981' },
  { name: 'Healthcare', value: 12, color: '#f59e0b' },
  { name: 'Others', value: 8, color: '#64748b' },
];

const AI_DECISION = {
  decision: 'BUY',
  confidence: 94,
  stock: 'RELIANCE',
  price: 2950.25,
  reasoning: [
    { step: 'Technical Analysis', result: 'Bullish', detail: 'Price broke above 20-day high with 2.5x volume' },
    { step: 'RSI Indicator', result: 'Neutral', detail: 'RSI at 55, not overbought' },
    { step: 'MACD', result: 'Bullish', detail: 'Histogram turning positive' },
    { step: 'Support/Resistance', result: 'Bullish', detail: 'Strong support at ₹2900' },
  ],
  timeline: [
    { time: '09:30', event: 'Price opened at ₹2925' },
    { time: '10:15', event: 'Volume spike detected (2.1x)' },
    { time: '11:00', event: 'Breakout confirmed above ₹2940' },
    { time: '11:30', event: 'AI generated BUY signal (94% confidence)' },
  ]
};

const TICKER_ITEMS = [
  'RELIANCE ▲ 2.5%', 'TCS ▼ 0.8%', 'INFY ▲ 1.2%', 'HDFCBANK ▲ 3.1%',
  'WIPRO ▼ 1.5%', 'BAJFINANCE ▲ 2.8%', 'TATAMOTORS ▲ 4.2%', 'SUNPHARMA ▼ 0.5%',
  'ITC ▲ 1.1%', 'SBIN ▲ 2.3%', 'MARUTI ▼ 0.9%', 'LT ▲ 1.8%',
];

// ============== COMPONENTS ==============

// Animated Counter Component
function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="font-mono"
    >
      {prefix}{value.toLocaleString('en-IN')}{suffix}
    </motion.span>
  );
}

// Glass Card Component
function GlassCard({ children, className = '', glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`glass-card ${glow ? 'glow-cyan' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Market Index Card
function MarketIndexCard({ name, value, change }: { name: string; value: number; change: number }) {
  const isPositive = change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="glass-card p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400 uppercase tracking-wider">{name}</span>
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(change).toFixed(2)}%
        </div>
      </div>
      <div className="text-2xl font-bold text-white">
        <AnimatedCounter value={value} />
      </div>
    </motion.div>
  );
}

// Signal Card Component
function SignalCard({ signal }: { signal: typeof SIGNALS_DATA[0] }) {
  const isBuy = signal.direction === 'BUY';
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-xl border-l-4 ${isBuy ? 'signal-buy' : 'signal-sell'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white">{signal.stock}</span>
          <span className={isBuy ? 'badge-buy' : 'badge-sell'}>{signal.direction}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${signal.confidence}%` }}
              transition={{ duration: 0.8 }}
              className={`h-full rounded-full ${isBuy ? 'bg-emerald-400' : 'bg-red-400'}`}
            />
          </div>
          <span className="text-xs text-slate-400">{signal.confidence}%</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">{signal.type.replace('_', ' ')}</span>
        <span className="text-white font-mono">₹{signal.price.toFixed(2)}</span>
      </div>
      <p className="text-xs text-slate-500 mt-2">{signal.rule}</p>
    </motion.div>
  );
}

// AI Decision Panel
function AIDecisionPanel() {
  const isBuy = AI_DECISION.decision === 'BUY';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`glass-card relative overflow-hidden ${isBuy ? 'glow-emerald' : 'glow-red'}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl" />

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-cyan-500/20 rounded-lg">
          <Brain className="w-5 h-5 text-cyan-400" />
        </div>
        <span className="text-sm text-slate-400">AI Decision Engine</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-3xl font-bold text-white mb-1">{AI_DECISION.stock}</div>
          <div className="text-slate-400">₹{AI_DECISION.price.toFixed(2)}</div>
        </div>
        <div className={`px-4 py-2 rounded-xl font-bold text-lg ${isBuy ? 'badge-buy' : 'badge-sell'}`}>
          {AI_DECISION.decision}
        </div>
      </div>

      {/* Confidence Ring */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
            <motion.circle
              cx="32" cy="32" r="28"
              stroke={isBuy ? '#10b981' : '#ef4444'}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: 0, strokeDashoffset: 176 }}
              whileInView={{ strokeDasharray: 176, strokeDashoffset: 176 - (176 * AI_DECISION.confidence / 100) }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white">{AI_DECISION.confidence}%</span>
          </div>
        </div>
        <span className="text-sm text-slate-400">Confidence Score</span>
      </div>

      {/* Reasoning Chain */}
      <div className="space-y-3">
        <span className="text-xs text-slate-500 uppercase tracking-wider">Reasoning Chain</span>
        {AI_DECISION.reasoning.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50"
          >
            <div className={`w-2 h-2 rounded-full mt-1.5 ${step.result === 'Bullish' ? 'bg-emerald-400' : step.result === 'Bearish' ? 'bg-red-400' : 'bg-amber-400'}`} />
            <div>
              <div className="text-sm text-white font-medium">{step.step}</div>
              <div className="text-xs text-slate-400">{step.detail}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Timeline */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <span className="text-xs text-slate-500 uppercase tracking-wider">Audit Trail</span>
        <div className="mt-2 space-y-2">
          {AI_DECISION.timeline.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-xs">
              <span className="text-cyan-400 font-mono">{item.time}</span>
              <span className="text-slate-400">{item.event}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Ticker Tape
function TickerTape() {
  return (
    <div className="w-full overflow-hidden py-3 bg-slate-900/50 border-y border-slate-800">
      <div className="flex ticker-tape">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="flex items-center gap-2 px-6 text-sm font-mono text-slate-300 whitespace-nowrap">
            {item.includes('▲') ? (
              <span className="text-emerald-400">●</span>
            ) : (
              <span className="text-red-400">●</span>
            )}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============== MAIN PAGE ==============

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('signals');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-grid-pattern bg-dots opacity-50" />
      <div className="fixed inset-0 bg-radial-glow" />

      {/* Ticker Tape */}
      <TickerTape />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-xl">
              <Hexagon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">InvestorCopilot</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
            <Link href="/alerts" className="text-sm text-slate-400 hover:text-white transition-colors">Alerts</Link>
            <Link href="/portfolio" className="text-sm text-slate-400 hover:text-white transition-colors">Portfolio</Link>
            <Link href="/stock/RELIANCE.NS" className="btn-primary text-sm">
              Launch App
            </Link>
          </div>
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 px-6 py-4 flex flex-col gap-3 bg-slate-900/95">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-slate-300 hover:text-white"
            >
              Features
            </a>
            <Link href="/alerts" onClick={() => setMobileMenuOpen(false)} className="text-sm text-slate-300 hover:text-white">
              Alerts
            </Link>
            <Link href="/portfolio" onClick={() => setMobileMenuOpen(false)} className="text-sm text-slate-300 hover:text-white">
              Portfolio
            </Link>
            <Link href="/stock/RELIANCE.NS" onClick={() => setMobileMenuOpen(false)} className="btn-primary text-sm text-center">
              Launch App
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6"
            >
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-sm text-cyan-400">Live Signal Detection</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-white">AI That Trades</span>
              <br />
              <span className="gradient-text">Smarter Than You</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-slate-400 max-w-2xl mx-auto mb-10"
            >
              Institutional-grade AI trading signals, backtesting, and portfolio analysis.
              Powered by 50+ indicators and neural networks.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center justify-center gap-4"
            >
              <button className="btn-glow">
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Start Free Trial
                </span>
              </button>
              <Link href="/stock/RELIANCE.NS" className="btn-secondary flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Demo
              </Link>
            </motion.div>
          </div>

          {/* Live Market Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {MARKET_DATA.map((market, i) => (
              <MarketIndexCard key={i} {...market} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Modules Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-white mb-4"
            >
              Trading Intelligence Suite
            </motion.h2>
            <p className="text-slate-400">Everything you need to trade like a pro</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {['signals', 'backtest', 'portfolio', 'ai'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === tab
                    ? 'bg-cyan-500 text-slate-900'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab === 'signals' && '⚡ Signals'}
                {tab === 'backtest' && '📊 Backtest'}
                {tab === 'portfolio' && '💼 Portfolio'}
                {tab === 'ai' && '🧠 AI Decision'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'signals' && (
              <motion.div
                key="signals"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white mb-4">Live Signals</h3>
                  {SIGNALS_DATA.map((signal) => (
                    <SignalCard key={signal.id} signal={signal} />
                  ))}
                </div>
                <GlassCard className="h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">NIFTY 50</h3>
                    <span className="text-emerald-400">▲ 0.85%</span>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={BACKTEST_DATA}>
                        <defs>
                          <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip
                          contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                          labelStyle={{ color: '#94a3b8' }}
                        />
                        <Area type="monotone" dataKey="returns" stroke="#06b6d4" strokeWidth={2} fill="url(#colorReturns)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === 'backtest' && (
              <motion.div
                key="backtest"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                <GlassCard className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-white mb-4">Equity Curve</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={BACKTEST_DATA}>
                        <defs>
                          <linearGradient id="colorReturns2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip
                          contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                        />
                        <Area type="monotone" dataKey="returns" stroke="#10b981" strokeWidth={2} fill="url(#colorReturns2)" />
                        <Line type="monotone" dataKey="benchmark" stroke="#64748b" strokeWidth={1} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
                <div className="space-y-4">
                  <GlassCard>
                    <div className="text-sm text-slate-400 mb-1">Win Rate</div>
                    <div className="text-3xl font-bold text-emerald-400">78.5%</div>
                    <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '78.5%' }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                      />
                    </div>
                  </GlassCard>
                  <GlassCard>
                    <div className="text-sm text-slate-400 mb-1">Sharpe Ratio</div>
                    <div className="text-3xl font-bold text-cyan-400">2.34</div>
                  </GlassCard>
                  <GlassCard>
                    <div className="text-sm text-slate-400 mb-1">Max Drawdown</div>
                    <div className="text-3xl font-bold text-red-400">-4.2%</div>
                  </GlassCard>
                  <GlassCard>
                    <div className="text-sm text-slate-400 mb-1">Total Return</div>
                    <div className="text-3xl font-bold text-emerald-400">+32.7%</div>
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {activeTab === 'portfolio' && (
              <motion.div
                key="portfolio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <GlassCard>
                  <h3 className="text-xl font-bold text-white mb-4">Sector Allocation</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={PORTFOLIO_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {PORTFOLIO_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {PORTFOLIO_DATA.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                        <span className="text-sm text-slate-400">{item.name} {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
                <div className="space-y-4">
                  <GlassCard>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-slate-400">Total Portfolio Value</div>
                        <div className="text-3xl font-bold text-white">₹10,00,000</div>
                      </div>
                      <div className="text-emerald-400">+12.5%</div>
                    </div>
                  </GlassCard>
                  <GlassCard>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-slate-400">Daily P&L</div>
                        <div className="text-2xl font-bold text-emerald-400">+₹12,500</div>
                      </div>
                      <ArrowUpRight className="w-8 h-8 text-emerald-400" />
                    </div>
                  </GlassCard>
                  <GlassCard>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-slate-400">Risk Score</div>
                        <div className="text-2xl font-bold text-amber-400">Medium</div>
                      </div>
                      <Shield className="w-8 h-8 text-amber-400" />
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {activeTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <AIDecisionPanel />
                <div className="space-y-4">
                  <GlassCard>
                    <div className="flex items-center gap-3 mb-4">
                      <Cpu className="w-5 h-5 text-cyan-400" />
                      <span className="text-lg font-bold text-white">AI Models</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'LSTM Neural Network', accuracy: 94, status: 'active' },
                        { name: 'Random Forest', accuracy: 89, status: 'active' },
                        { name: 'XGBoost Ensemble', accuracy: 91, status: 'active' },
                        { name: 'Transformer Model', accuracy: 96, status: 'training' },
                      ].map((model, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${model.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                            <span className="text-sm text-white">{model.name}</span>
                          </div>
                          <span className="text-sm text-cyan-400">{model.accuracy}%</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                  <GlassCard>
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="w-5 h-5 text-violet-400" />
                      <span className="text-lg font-bold text-white">Signal Performance</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-xl bg-slate-800/50">
                        <div className="text-2xl font-bold text-emerald-400">1,247</div>
                        <div className="text-xs text-slate-400">Signals Generated</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-slate-800/50">
                        <div className="text-2xl font-bold text-cyan-400">78.5%</div>
                        <div className="text-xs text-slate-400">Accuracy</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-slate-800/50">
                        <div className="text-2xl font-bold text-violet-400">2.4</div>
                        <div className="text-xs text-slate-400">Avg Sharpe</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-slate-800/50">
                        <div className="text-2xl font-bold text-amber-400">+32.7%</div>
                        <div className="text-xs text-slate-400">Total Return</div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Activity, value: '50+', label: 'Technical Indicators' },
              { icon: Brain, value: '1M+', label: 'Data Points Analyzed' },
              { icon: Target, value: '78.5%', label: 'Signal Accuracy' },
              { icon: Zap, value: '24/7', label: 'Real-time Monitoring' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/20 mb-4">
                  <stat.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card text-center p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-violet-500/10" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Trade Smarter?</h2>
              <p className="text-xl text-slate-400 mb-8">
                Join 10,000+ traders using AI to make better decisions
              </p>
              <div className="flex items-center justify-center gap-4">
                <button className="btn-glow">
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Start Free Trial
                  </span>
                </button>
                <Link href="/alerts" className="btn-secondary flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Open Live Alerts
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-xl">
                <Hexagon className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">InvestorCopilot</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-sm text-slate-500">
              © 2026 InvestorCopilot. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
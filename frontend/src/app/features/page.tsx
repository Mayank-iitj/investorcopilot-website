'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Bell, Brain, GalleryVerticalEnd, PieChart, ScanLine, ShieldCheck, Sparkles, TableProperties } from 'lucide-react';

const FEATURE_CARDS = [
  { title: 'Signal Studio', desc: 'Adaptive signal narratives with confidence layers and explainable snapshots.', icon: ScanLine },
  { title: 'Alert Theater', desc: 'Motion-driven event stream with timeline memory and contextual annotations.', icon: Bell },
  { title: 'Portfolio Atlas', desc: 'Allocation stories, concentration maps, and scenario-oriented risk blocks.', icon: PieChart },
  { title: 'Decision Lens', desc: 'Reasoning chain cards designed for demo clarity and investor communication.', icon: Brain },
];

const CHART_DATA = [
  { week: 'W1', alpha: 18, baseline: 12 },
  { week: 'W2', alpha: 24, baseline: 14 },
  { week: 'W3', alpha: 20, baseline: 15 },
  { week: 'W4', alpha: 31, baseline: 17 },
  { week: 'W5', alpha: 28, baseline: 20 },
  { week: 'W6', alpha: 36, baseline: 22 },
];

const TABLE_ROWS = [
  { area: 'Landing Experience', delivered: 'Ticker, hero narrative, module preview tabs', impact: 'High clarity onboarding' },
  { area: 'Alerts Surface', delivered: 'Animated stream + filterable timeline', impact: 'Faster story scanning' },
  { area: 'Portfolio View', delivered: 'Risk blocks, allocation bars, interactive cards', impact: 'Decision-ready summaries' },
  { area: 'Stock Detail', delivered: 'Synthetic chart + backtest narratives', impact: 'Rich demos without backend' },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#05090f] pt-24 pb-16 px-6">
      <div className="fixed inset-0 bg-grid-pattern bg-dots opacity-20" />
      <div className="pointer-events-none fixed -top-20 left-1/2 h-96 w-[64rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400/25 via-emerald-300/20 to-indigo-500/20 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-3 py-1 rounded-full text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Product Features
          </div>
          <h1 className="mt-4 text-5xl font-bold text-white leading-tight">InvestorCopilot Visual Intelligence Stack</h1>
          <p className="mt-3 text-slate-400 max-w-3xl">A polished illustration-first UI system for showcasing how signals, portfolio insight, and decision context flow together.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {FEATURE_CARDS.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass-card">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mb-3">
                <item.icon className="w-5 h-5 text-cyan-300" />
              </div>
              <h3 className="text-lg text-white font-semibold">{item.title}</h3>
              <p className="text-sm text-slate-400 mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card lg:col-span-2">
            <div className="flex items-center gap-2 text-white font-semibold mb-4">
              <GalleryVerticalEnd className="w-5 h-5 text-emerald-300" /> Motion Performance Illustration
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="alphaLine" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="baselineLine" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#213042" />
                  <XAxis dataKey="week" stroke="#7691a9" />
                  <YAxis stroke="#7691a9" />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #223247', borderRadius: '10px' }} />
                  <Area type="monotone" dataKey="alpha" stroke="#22d3ee" fill="url(#alphaLine)" strokeWidth={2} />
                  <Area type="monotone" dataKey="baseline" stroke="#34d399" fill="url(#baselineLine)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card">
            <div className="flex items-center gap-2 text-white font-semibold mb-4">
              <ShieldCheck className="w-5 h-5 text-cyan-300" /> Visual Standards
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">Consistent InvestorCopilot branding iconography</li>
              <li className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">Smooth route transitions and staggered section reveals</li>
              <li className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">Backend-independent demo behavior for stable showcases</li>
            </ul>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card !p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 text-white font-semibold flex items-center gap-2">
            <TableProperties className="w-5 h-5 text-cyan-300" /> Delivery Matrix
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="table-header">Area</th>
                  <th className="table-header">Delivered</th>
                  <th className="table-header">Impact</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/55 transition-colors">
                    <td className="table-cell text-white font-medium">{row.area}</td>
                    <td className="table-cell">{row.delivered}</td>
                    <td className="table-cell text-cyan-300">{row.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-3">
          <Link href="/alerts" className="btn-secondary">View Alerts</Link>
          <Link href="/portfolio" className="btn-secondary">View Portfolio</Link>
          <a href="https://github.com/Mayank-iitj/investorcopilot.git" target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center gap-2">
            <img src="/favicon.jpg" alt="InvestorCopilot" className="w-4 h-4 rounded object-cover" />
            Open GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
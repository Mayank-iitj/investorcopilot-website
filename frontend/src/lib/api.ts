export async function apiFetch<T = any>(data: T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return data;
}

const MOCK_SIGNALS = [
  { id: 1, stock: 'RELIANCE.NS', type: 'MOMENTUM', direction: 'BUY', strength: 0.9, rule: 'Momentum continuation profile active.', price: 2891.4, created_at: new Date().toISOString() },
  { id: 2, stock: 'INFY.NS', type: 'REVERSAL', direction: 'SELL', strength: 0.64, rule: 'Short-term reversal probability increased.', price: 1534.6, created_at: new Date(Date.now() - 120000).toISOString() },
];

export const getSignals = (symbol?: string) => apiFetch(symbol ? MOCK_SIGNALS.filter((s) => s.stock === symbol) : MOCK_SIGNALS);
export const scanSignals = (_symbol: string) => apiFetch({ ok: true, generated: true });
export const getStrategies = () => apiFetch(['ma_crossover', 'rsi', 'macd', 'breakout', 'volume_spike']);

export const runBacktest = (strategy: string, symbol: string) => apiFetch({ strategy_name: strategy, symbol, win_rate_pct: 72, sharpe_ratio: 1.4 });
export const getBacktestResults = (strategy: string, symbol?: string) => apiFetch([{ strategy, symbol: symbol || 'RELIANCE.NS', win_rate: 71.8 }]);
export const getImpactModel = () => apiFetch({ projected_return_if_followed: '+24.6%' });

export const createPortfolio = (holdings: any[]) => apiFetch({ portfolio_id: 1, holdings });
export const getPortfolioAnalysis = (_portfolioId = 1) => apiFetch({ xirr: 0.14, portfolio_volatility: 0.18, portfolio_beta: 0.96, risk_concentration: 'MEDIUM' });
export const getPortfolio = (_portfolioId = 1) => apiFetch({ id: 1, holdings: [] });

export const getRecommendation = (stock: string) => apiFetch({ symbol: stock, action: 'BUY', confidence: 0.84, reasoning: ['Momentum alignment stable.'], active_signals: 5, backtested_strategies: 4 });
export const getMarketOverview = () => apiFetch({ nifty: 22890, sensex: 75740 });
export const getAuditLogs = () => apiFetch([]);

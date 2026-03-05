'use client';

import { motion } from 'framer-motion';
import { portfolio, user } from '@/data/mockData';
import { ChartPie } from '@phosphor-icons/react';

interface Props {
  onAnalyticsOpen: () => void;
}

export default function BalanceCard({ onAnalyticsOpen }: Props) {
  const fmt = (n: number) => n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
      className="rounded-2xl p-6"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          На всех счетах: {fmt(portfolio.allAccountsValue)} ₽
        </span>
      </div>

      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {user.contract} · Весь портфель
        </span>
      </div>

      <motion.p
        className="text-3xl font-bold font-mono mb-2"
        style={{ color: 'var(--text-primary)' }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {fmt(portfolio.totalValue)} ₽
      </motion.p>

      <div className="flex items-center gap-3 mb-5">
        <span
          className="text-sm font-mono"
          style={{ color: portfolio.dailyPnL < 0 ? 'var(--danger)' : 'var(--accent)' }}
        >
          {portfolio.dailyPnL < 0 ? '↓' : '↑'} {fmt(Math.abs(portfolio.dailyPnL))} ₽ ({Math.abs(portfolio.dailyPnLPercent).toFixed(2)}%)
        </span>
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>за сегодня</span>
        <span
          className="text-xs px-2 py-0.5 rounded-full cursor-pointer"
          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
        >
          за всё время
        </span>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onAnalyticsOpen}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors"
        style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
      >
        <ChartPie size={16} weight="fill" className="text-accent" />
        Аналитика
      </motion.button>
    </motion.div>
  );
}

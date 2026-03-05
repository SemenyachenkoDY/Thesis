'use client';

import { motion } from 'framer-motion';
import { currencies } from '@/data/mockData';

export default function CurrencyTicker() {
  const fmt = (n: number) => n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex flex-wrap gap-4 mt-6 mb-6"
    >
      {currencies.map((c, i) => (
        <motion.div
          key={c.code}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i + 0.3, type: 'spring', stiffness: 150, damping: 20 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
        >
          <span className="text-xl">{c.flag}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{c.name}</span>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{c.code}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {fmt(c.rate)}₽
              </span>
              <span
                className="font-mono text-xs"
                style={{ color: c.isPositive ? 'var(--accent)' : 'var(--danger)' }}
              >
                {c.isPositive ? '↑' : '↓'} {fmt(Math.abs(c.change))}
                {c.changePercent ? ` (${c.changePercent.toFixed(2)}%)` : ''}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

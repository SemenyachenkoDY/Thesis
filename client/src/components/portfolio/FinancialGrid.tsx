'use client';

import { motion } from 'framer-motion';
import { portfolio } from '@/data/mockData';
import { Info } from '@phosphor-icons/react';

const metrics = [
  { label: 'Плановые средства', value: portfolio.planned, tooltip: true },
  { label: 'Доступно к торговле', value: portfolio.available },
  { label: 'Гарантийное обеспечение', value: portfolio.guarantee, tooltip: true },
  { label: 'Собственные средства', value: portfolio.own, tooltip: true },
  { label: 'Доступно к торговле (с плечом)', value: portfolio.availableLeverage },
  { label: 'Вариационная маржа', value: portfolio.variationMargin, tooltip: true },
];

export default function FinancialGrid() {
  const fmt = (n: number) => n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-xl font-semibold mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        Денежные средства
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i + 0.35, type: 'spring', stiffness: 120, damping: 20 }}
            className="rounded-xl px-5 py-4"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{m.label}</span>
              {m.tooltip && <Info size={12} style={{ color: 'var(--text-tertiary)' }} />}
            </div>
            <p className="font-mono text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {fmt(m.value)} ₽
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

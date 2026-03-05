'use client';

import { motion } from 'framer-motion';
import { taxData } from '@/data/mockData';
import { CalendarBlank, Info } from '@phosphor-icons/react';

export default function TaxesTab() {
  const fmt = (n: number) => n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div>
      {/* Year Selector */}
      <div className="flex items-center gap-3 mb-6">
        <CalendarBlank size={18} style={{ color: 'var(--text-tertiary)' }} />
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Налоговый период:</span>
        <div className="px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
        >
          Год {taxData.year}
        </div>
      </div>

      {/* Tax Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="rounded-2xl p-6"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
      >
        <h3 className="text-base font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
          Удерживаемые налоги
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Налогооблагаемая база или убыток</span>
              <Info size={14} style={{ color: 'var(--text-tertiary)' }} />
            </div>
            <span className="font-mono text-sm font-semibold"
              style={{ color: taxData.taxBase < 0 ? 'var(--danger)' : 'var(--text-primary)' }}
            >
              {fmt(taxData.taxBase)} ₽
            </span>
          </div>
          <div className="h-px" style={{ background: 'var(--border)' }} />
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>К уплате</span>
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {fmt(taxData.toPay)} ₽
            </span>
          </div>
          <div className="h-px" style={{ background: 'var(--border)' }} />
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Уплачено</span>
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--accent)' }}>
              {fmt(taxData.paid)} ₽
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

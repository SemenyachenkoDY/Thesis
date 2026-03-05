'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { reports as mockReports } from '@/data/mockData';
import { DownloadSimple, Info } from '@phosphor-icons/react';

const filterPills = ['Сформированные', 'Формируются', 'Все'];

export default function ReportsTab() {
  const [filter, setFilter] = useState('Все');

  const filtered = mockReports.filter(r => {
    if (filter === 'Сформированные') return r.status === 'FORMED';
    if (filter === 'Формируются') return r.status === 'FORMING';
    return true;
  });

  return (
    <div>
      {/* Info Banner */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5" style={{ background: 'var(--accent-muted)' }}>
        <Info size={16} style={{ color: 'var(--accent)' }} />
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Отчёты доступны в течение 14 дней после формирования
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5">
        {filterPills.map(f => (
          <motion.button
            key={f}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={{
              background: filter === f ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: filter === f ? 'white' : 'var(--text-secondary)',
            }}
          >
            {f}
          </motion.button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        {/* Header */}
        <div className="grid grid-cols-[1fr_180px_80px] gap-2 px-5 py-3 text-xs font-medium uppercase" style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border)' }}>
          <span>Название отчёта</span>
          <span>Сформирован</span>
          <span className="text-center">Скачать</span>
        </div>

        {/* Rows */}
        {filtered.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, type: 'spring', stiffness: 120, damping: 20 }}
            className="grid grid-cols-[1fr_180px_80px] gap-2 px-5 py-3.5 items-center transition-colors hover:bg-[var(--bg-tertiary)]"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{report.title}</span>
            <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{report.createdAt}</span>
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <DownloadSimple size={18} style={{ color: 'var(--accent)' }} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--text-tertiary)' }}>
          <p className="text-sm">Нет отчётов</p>
        </div>
      )}
    </div>
  );
}

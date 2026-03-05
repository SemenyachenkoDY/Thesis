'use client';

import { motion } from 'framer-motion';
import { marginCalls } from '@/data/mockData';
import { DownloadSimple } from '@phosphor-icons/react';

export default function MarginCallTab() {
  return (
    <div>
      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div className="grid grid-cols-[1fr_180px_80px] gap-2 px-5 py-3 text-xs font-medium uppercase"
          style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border)' }}
        >
          <span>Название</span>
          <span>Сформирован</span>
          <span className="text-center">Скачать</span>
        </div>

        {marginCalls.map((mc, i) => (
          <motion.div
            key={mc.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, type: 'spring', stiffness: 120, damping: 20 }}
            className="grid grid-cols-[1fr_180px_80px] gap-2 px-5 py-3.5 items-center transition-colors hover:bg-[var(--bg-tertiary)]"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{mc.title}</span>
            <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{mc.createdAt}</span>
            <div className="flex justify-center">
              <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="p-1.5 rounded-lg">
                <DownloadSimple size={18} style={{ color: 'var(--accent)' }} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        {[1, 2, 3, '...', 76].map((p, i) => (
          <button key={i} className="w-8 h-8 rounded-lg text-xs font-medium flex items-center justify-center"
            style={{ background: p === 1 ? 'var(--accent)' : 'var(--bg-tertiary)', color: p === 1 ? 'white' : 'var(--text-secondary)' }}
          >{p}</button>
        ))}
      </div>
    </div>
  );
}

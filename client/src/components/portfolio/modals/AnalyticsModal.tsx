'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { analyticsComposition } from '@/data/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Props { isOpen: boolean; onClose: () => void; }

const tabs = ['Портфель', 'Состав'];

export default function AnalyticsModal({ isOpen, onClose }: Props) {
  const [tab, setTab] = useState(1);
  const total = 64594;

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} title="Аналитика" maxWidth="560px">
          <div className="flex gap-2 mb-5">
            {tabs.map((t, i) => (
              <motion.button key={t} whileTap={{ scale: 0.95 }} onClick={() => setTab(i)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                style={{ background: tab === i ? 'var(--bg-tertiary)' : 'transparent', color: tab === i ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              >{t}</motion.button>
            ))}
          </div>

          {tab === 1 && (
            <>
              {/* Donut */}
              <div className="relative w-full h-[280px] mb-4">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={analyticsComposition} dataKey="value" cx="50%" cy="50%" innerRadius={85} outerRadius={120} paddingAngle={2} cornerRadius={4} strokeWidth={0}>
                      {analyticsComposition.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-2xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{total.toLocaleString('ru-RU')} ₽</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Из них 1 330,5 ₽ в short</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>8 видов активов</p>
                </div>
              </div>

              {/* Filter pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {['Активы', 'Компании', 'Отрасли', 'Валюты и металлы'].map((f, i) => (
                  <button key={f} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                    style={{ background: i === 0 ? 'var(--bg-tertiary)' : 'transparent', color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                  >{f}</button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-2">
                {analyticsComposition.map((item, i) => (
                  <motion.div key={item.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                    <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                      <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                    </div>
                    <span className="font-mono text-sm w-16 text-right" style={{ color: 'var(--text-primary)' }}>{item.value}%</span>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {tab === 0 && (
            <div className="flex items-center justify-center h-[300px]" style={{ color: 'var(--text-tertiary)' }}>
              <p className="text-sm">График портфеля будет доступен через Superset</p>
            </div>
          )}
        </Modal>
      )}
    </AnimatePresence>
  );
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { portfolio } from '@/data/mockData';

interface Props { isOpen: boolean; onClose: () => void; }

const tabs = ['Через СБП', 'С карты', 'По реквизитам'];

export default function DepositModal({ isOpen, onClose }: Props) {
  const [tab, setTab] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const fmt = (n: number) => n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const commission = tab === 0 ? 0.004 : 0;
  const commVal = amount ? (parseFloat(amount) * commission) : 0;
  const toCredit = amount ? (parseFloat(amount) - commVal) : 0;

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Пополнение на ${amount} ₽`,
          doc_type: 'DEPOSIT',
          client_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Seed user ID
          scenario: 'TO_BE',
          department: 'Financial'
        }),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} title="Пополнение счёта">
          {/* ... (previous implementation remains same up to submit button) */}
          {/* Tabs */}
          <div className="flex gap-2 mb-5">
            {tabs.map((t, i) => (
              <motion.button key={t} whileTap={{ scale: 0.95 }} onClick={() => setTab(i)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                style={{ background: tab === i ? 'var(--bg-tertiary)' : 'transparent', color: tab === i ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              >{t}</motion.button>
            ))}
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>Куда</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
              <div className="w-8 h-8 rounded-full bg-[var(--accent-muted)] flex items-center justify-center">💰</div>
              <div>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>МО-01 Брокерский счёт</p>
                <p className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{fmt(portfolio.planned)} ₽</p>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
              <input type="number" placeholder="Введите сумму перевода" value={amount} onChange={e => setAmount(e.target.value)}
                className="bg-transparent outline-none flex-1 text-sm" style={{ color: 'var(--text-primary)' }}
              />
              <span className="text-sm font-mono" style={{ color: 'var(--text-tertiary)' }}>₽</span>
            </div>
          </div>

          {tab === 0 && (
            <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
              <span>Комиссия СБП (0,4%)</span>
              <span className="font-mono">≈{fmt(commVal)} ₽</span>
            </div>
          )}
          <div className="flex justify-between text-xs mb-5" style={{ color: 'var(--text-secondary)' }}>
            <span>Сумма к зачислению</span>
            <span className="font-mono">≈{fmt(toCredit)} ₽</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: 'var(--accent)', opacity: loading ? 0.7 : 1 }}
            onClick={handleDeposit}
          >
            {loading ? 'Обработка...' : 'Пополнить счёт'}
          </motion.button>
        </Modal>
      )}
    </AnimatePresence>
  );
}

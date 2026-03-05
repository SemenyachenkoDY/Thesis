'use client';

import { motion } from 'framer-motion';
import { ArrowDown, ArrowsLeftRight, Plus } from '@phosphor-icons/react';

interface Props {
  onDeposit: () => void;
  onTransfer: () => void;
  onWithdraw: () => void;
}

export default function OperationsCard({ onDeposit, onTransfer, onWithdraw }: Props) {
  const operations = [
    { label: 'Пополнить', icon: Plus, onClick: onDeposit, accent: true },
    { label: 'Перевод между счетами', icon: ArrowsLeftRight, onClick: onTransfer, accent: false },
    { label: 'Вывод', icon: ArrowDown, onClick: onWithdraw, accent: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.15 }}
      className="rounded-2xl p-6"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
    >
      <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
        Операции с денежными средствами
      </h3>
      <div className="flex flex-col gap-2">
        {operations.map((op, i) => (
          <motion.button
            key={op.label}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i + 0.2, type: 'spring', stiffness: 150, damping: 20 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={op.onClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left"
            style={{
              background: op.accent ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: op.accent ? 'white' : 'var(--text-primary)',
            }}
          >
            <op.icon size={18} weight="bold" />
            {op.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Wrench } from '@phosphor-icons/react';

export default function MarketsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <motion.div
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="mb-6"
      >
        <Wrench size={64} weight="duotone" style={{ color: 'var(--accent)' }} />
      </motion.div>
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Рынки</h1>
      <p className="text-base" style={{ color: 'var(--text-secondary)' }}>Раздел в разработке</p>
      <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
        Здесь будут котировки, графики и торговые инструменты
      </p>
    </motion.div>
  );
}

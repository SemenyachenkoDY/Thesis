'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { user } from '@/data/mockData';
import { User, GearSix, Question, SignOut, Moon, Sun } from '@phosphor-icons/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: User, label: 'Профиль' },
  { icon: GearSix, label: 'Настройки' },
  { icon: Question, label: 'Помощь' },
];

export default function ProfileDropdown({ isOpen, onClose }: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="absolute right-0 top-14 w-72 rounded-2xl overflow-hidden z-50"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
          }}
        >
          {/* User Info */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold"
                style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
              >
                {user.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {user.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--accent)' }}>
                  {user.status}
                </p>
              </div>
            </div>
            <p className="text-xs px-1" style={{ color: 'var(--text-tertiary)' }}>
              Договор №{user.contract} от {user.contractDate}
            </p>
          </div>

          <div className="h-px mx-4" style={{ background: 'var(--border)' }} />

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i, type: 'spring', stiffness: 200, damping: 20 }}
                className="w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors hover:bg-[var(--bg-tertiary)]"
                style={{ color: 'var(--text-primary)' }}
                onClick={onClose}
              >
                <item.icon size={18} style={{ color: 'var(--text-secondary)' }} />
                {item.label}
              </motion.button>
            ))}
          </div>

          <div className="h-px mx-4" style={{ background: 'var(--border)' }} />

          {/* Sign Out */}
          <div className="py-2">
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
              className="w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors hover:bg-[var(--bg-tertiary)]"
              style={{ color: 'var(--danger)' }}
              onClick={onClose}
            >
              <SignOut size={18} />
              Выйти
            </motion.button>
          </div>

          <div className="h-px mx-4" style={{ background: 'var(--border)' }} />

          {/* Theme Toggle */}
          <div className="px-5 py-3 flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Тёмная тема</span>
            <motion.button
              onClick={toggleTheme}
              className="relative w-11 h-6 rounded-full transition-colors"
              style={{ background: theme === 'dark' ? 'var(--accent)' : 'var(--bg-tertiary)' }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className="absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: 'white' }}
                animate={{ left: theme === 'dark' ? 22 : 2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {theme === 'dark' ? <Moon size={12} className="text-gray-800" /> : <Sun size={12} className="text-amber-500" />}
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

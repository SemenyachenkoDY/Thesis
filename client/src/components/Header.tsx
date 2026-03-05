'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Bell, Headset, Wallet } from '@phosphor-icons/react';
import ProfileDropdown from './ProfileDropdown';
import { portfolio, user } from '@/data/mockData';

const navItems = [
  { href: '/', label: 'Портфель', icon: '📊' },
  { href: '/markets', label: 'Рынки', icon: '📈' },
  { href: '/showcase', label: 'Витрина', icon: '🏪' },
  { href: '/documents', label: 'Документооборот', badge: 88, icon: '📄' },
];

export default function Header() {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fmt = (n: number) =>
    n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="sticky top-0 z-50 glass"
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <Wallet weight="bold" className="text-white" size={18} />
          </div>
          <span className="font-semibold text-lg hidden md:block" style={{ color: 'var(--text-primary)' }}>
            ИнвестПорт
          </span>
        </Link>

        {/* Nav Pills */}
        <nav className="flex items-center gap-1 rounded-full px-2 py-1.5" style={{ background: 'var(--bg-secondary)' }}>
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className="relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors"
                  style={{
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'var(--bg-tertiary)' }}
                      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                  {item.badge && (
                    <span className="relative z-10 ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-[var(--accent)]">
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <Bell size={20} style={{ color: 'var(--text-secondary)' }} />
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white bg-[var(--accent)] px-1">
              107
            </span>
          </motion.button>

          {/* Support */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <Headset size={20} style={{ color: 'var(--text-secondary)' }} />
          </motion.button>

          {/* Balance */}
          <div className="hidden lg:flex flex-col items-end">
            <div className="flex items-center gap-1.5">
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{user.contract}</span>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>·</span>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Весь портфель</span>
            </div>
            <span className="font-mono font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              {fmt(portfolio.totalValue)} ₽
            </span>
            <span
              className="font-mono text-xs"
              style={{ color: portfolio.dailyPnL < 0 ? 'var(--danger)' : 'var(--accent)' }}
            >
              {portfolio.dailyPnL < 0 ? '↓' : '↑'} {fmt(Math.abs(portfolio.dailyPnL))} ₽ ({Math.abs(portfolio.dailyPnLPercent).toFixed(2)}%)
            </span>
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
            >
              {user.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </motion.button>
            <ProfileDropdown isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
          </div>
        </div>
      </div>
    </motion.header>
  );
}

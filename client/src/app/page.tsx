'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import BalanceCard from '@/components/portfolio/BalanceCard';
import OperationsCard from '@/components/portfolio/OperationsCard';
import CurrencyTicker from '@/components/portfolio/CurrencyTicker';
import FinancialGrid from '@/components/portfolio/FinancialGrid';
import PortfolioTable from '@/components/portfolio/PortfolioTable';
import DepositModal from '@/components/portfolio/modals/DepositModal';
import TransferModal from '@/components/portfolio/modals/TransferModal';
import WithdrawModal from '@/components/portfolio/modals/WithdrawModal';
import AnalyticsModal from '@/components/portfolio/modals/AnalyticsModal';

export default function PortfolioPage() {
  const [depositOpen, setDepositOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  return (
    <>
      {/* Top Grid: Balance + Operations + Promo */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px_320px] gap-4 mb-6">
        <BalanceCard onAnalyticsOpen={() => setAnalyticsOpen(true)} />
        <OperationsCard
          onDeposit={() => setDepositOpen(true)}
          onTransfer={() => setTransferOpen(true)}
          onWithdraw={() => setWithdrawOpen(true)}
        />
        {/* Promo Card */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a2332 0%, #0f1923 100%)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', filter: 'blur(30px)' }}
          />
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Аналитический портал
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Статьи и обзоры от аналитиков D8
          </p>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
          >
            Подробнее
          </button>
        </div>
      </div>

      {/* Currency Ticker */}
      <CurrencyTicker />

      {/* Financial Grid */}
      <FinancialGrid />

      {/* Products Section */}
      <div className="mt-8 mb-4">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Продукты для вас
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Устойчивый портфель', desc: 'Сбалансированная стратегия с минимальным риском', tag: 'Рекомендуем', gradient: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)' },
            { title: 'Большая четвёрка', desc: 'Инвестиции в 4 крупнейшие компании РФ', tag: 'Популярное', gradient: 'linear-gradient(135deg, #1e1b4b 0%, #0f0a2e 100%)' },
            { title: 'S&P 500', desc: 'Доступ к американскому рынку через фонд', tag: 'Новинка', gradient: 'linear-gradient(135deg, #4a1d2e 0%, #2d0f1c 100%)' },
          ].map((p) => (
            <div
              key={p.title}
              className="rounded-2xl p-5 cursor-pointer transition-transform hover:scale-[1.02]"
              style={{ background: p.gradient, border: '1px solid var(--border)' }}
            >
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-[var(--accent)] mb-3">
                {p.tag}
              </span>
              <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{p.title}</h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Table */}
      <PortfolioTable />

      {/* Modals */}
      <AnimatePresence>
        <DepositModal isOpen={depositOpen} onClose={() => setDepositOpen(false)} />
        <TransferModal isOpen={transferOpen} onClose={() => setTransferOpen(false)} />
        <WithdrawModal isOpen={withdrawOpen} onClose={() => setWithdrawOpen(false)} />
        <AnalyticsModal isOpen={analyticsOpen} onClose={() => setAnalyticsOpen(false)} />
      </AnimatePresence>
    </>
  );
}

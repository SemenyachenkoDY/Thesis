// ============================================================
// Fast Sign / ИнвестПорт — Mock Data
// Fallback when backend is unavailable
// ============================================================

export const user = {
  name: 'Уткин Виталий Федорович',
  status: 'Квалифицированный инвестор',
  contract: 'BP76701',
  contractDate: '08.02.2024',
};

export const portfolio = {
  accountCode: 'BP76701',
  totalValue: 64096.32,
  dailyPnL: -4713.52,
  dailyPnLPercent: -6.92,
  allAccountsValue: 63845.05,
  planned: 26625.78,
  available: 25545.99,
  guarantee: 130.02,
  own: 25295.28,
  availableLeverage: 25295.28,
  variationMargin: 130.02,
};

export const currencies = [
  { code: 'USD', name: 'Доллар США', flag: '🇺🇸', rate: 77.80, change: 0.19, isPositive: true },
  { code: 'EUR', name: 'Евро', flag: '🇪🇺', rate: 90.75, change: -0.32, isPositive: false },
  { code: 'CNY', name: 'Китайский юань', flag: '🇨🇳', rate: 11.27, change: 0.0135, isPositive: true, changePercent: 0.93 },
];

export const stocks = [
  { ticker: 'GAZP', name: 'ГАЗПРОМ ао', type: 'Акции', qty: 10, buyPrice: 126.99, currentPrice: 127.64, value: 1276.4, pnl: 6.5, pnlPercent: 0.51, color: '#3B82F6' },
  { ticker: 'VTBR', name: 'ВТБ ао', type: 'Акции', qty: 9, buyPrice: 87.7, currentPrice: 86.14, value: 775.26, pnl: -14.01, pnlPercent: -1.77, color: '#1E40AF' },
  { ticker: 'TGKN', name: 'ТГК-14', type: 'Акции', qty: 100000, buyPrice: 0.00662, currentPrice: 0.00634, value: 634, pnl: -28, pnlPercent: -4.23, color: '#10B981' },
  { ticker: 'HYDR', name: 'РусГидро-1-ао', type: 'Акции', qty: -3000, buyPrice: 0.44375, currentPrice: 0.4405, value: -1321.5, pnl: 9.75, pnlPercent: 0.73, color: '#0EA5E9' },
  { ticker: 'SGZH', name: 'Сегежа', type: 'Акции', qty: 100, buyPrice: 1.24, currentPrice: 1.2255, value: 122.55, pnl: -1.35, pnlPercent: -1.09, color: '#84CC16' },
  { ticker: 'GECO', name: 'ГЕНЕТИКО', type: 'Акции', qty: 20, buyPrice: 24.9, currentPrice: 24.3, value: 486, pnl: -11.9, pnlPercent: -2.39, color: '#F43F5E' },
  
  { ticker: 'RU000A10CL64', name: 'Сегежа ЗР7R', type: 'Облигации', qty: 2, buyPrice: 95.5, currentPrice: 96.83, value: 2207.72, pnl: 63.12, pnlPercent: 2.94, color: '#6B7280', nkd: 8.77, coupon: 1.07 },
  { ticker: 'RU000A10A794', name: 'Автом01CNY', type: 'Облигации', qty: 1, buyPrice: 106.09, currentPrice: 104.9, value: 1195.86, pnl: 3.36, pnlPercent: 0.28, color: '#9CA3AF', nkd: 1.35, coupon: 5.24 },

  { ticker: 'NGM-3.26', name: 'Фьючерс Natural Gas', type: 'Фьючерсы', qty: 1, buyPrice: 3.01, currentPrice: 2.996, value: 234.26, pnl: -1.09, pnlPercent: -0.46, color: '#14B8A6', go: 115.07, margin: -1.09 },
  { ticker: 'SiZ6', name: 'Фьючерс USD/RUB', type: 'Фьючерсы', qty: 2, buyPrice: 78000, currentPrice: 78150, value: 156300, pnl: 300, pnlPercent: 0.38, color: '#38BDF8', go: 8400.5, margin: 300 },
];

export const products = [
  { title: 'Устойчивый портфель', description: 'Сбалансированная стратегия с минимальным риском', tag: 'Рекомендуем' },
  { title: 'Большая четвёрка', description: 'Инвестиции в 4 крупнейшие компании РФ', tag: 'Популярное' },
  { title: 'S&P 500', description: 'Доступ к американскому рынку через фонд', tag: 'Новинка' },
];

// ===== ДОКУМЕНТООБОРОТ =====

export interface DocumentItem {
  id: string;
  groupId?: string;
  title: string;
  docType: string;
  status: 'CREATED' | 'SIGNATURE_REQUESTED' | 'SIGNED' | 'FAILED' | 'EXPIRED';
  createdAt: string;
  signedAt?: string;
}

export const documents: DocumentItem[] = [
  { id: 'doc-1', groupId: 'g-765934', title: 'Уведомление о конфликте интересов', docType: 'notification', status: 'SIGNATURE_REQUESTED', createdAt: '02.02.2026 16:10' },
  { id: 'doc-2', groupId: 'g-765934', title: 'Уведомление о конфликте интересов', docType: 'notification', status: 'SIGNATURE_REQUESTED', createdAt: '02.02.2026 16:10' },
  { id: 'doc-3', groupId: 'g-765934', title: 'Поручение на сделку ОТС (Произвольный документ)', docType: 'order', status: 'SIGNATURE_REQUESTED', createdAt: '02.02.2026 16:10' },
  { id: 'doc-4', title: 'Технический протокол', docType: 'protocol', status: 'SIGNATURE_REQUESTED', createdAt: '05.02.2026 03:00' },
  { id: 'doc-5', title: 'Анкета клиента (физического лица)', docType: 'questionnaire', status: 'SIGNATURE_REQUESTED', createdAt: '02.02.2026 03:00' },
  { id: 'doc-6', title: 'Уведомление о расторжении договора', docType: 'notification', status: 'CREATED', createdAt: '28.01.2026 03:00' },
];

export interface ReportItem {
  id: string;
  title: string;
  reportType: string;
  status: 'FORMED' | 'FORMING' | 'EXPIRED';
  createdAt: string;
}

export const reports: ReportItem[] = [
  { id: 'r-1', title: 'Отчёт брокера 01.01.2026-23.01.2026', reportType: 'broker', status: 'FORMED', createdAt: '26.02.2026 22:39' },
  { id: 'r-2', title: 'Реестр поручений за 11.02.2026', reportType: 'registry', status: 'FORMED', createdAt: '26.02.2026 22:39' },
  { id: 'r-3', title: 'Отчёт брокера 01.09.2025-25.02.2026', reportType: 'broker', status: 'FORMED', createdAt: '26.02.2026 22:39' },
  { id: 'r-4', title: 'Отчёт брокера 01.09.2025-26.02.2026', reportType: 'broker', status: 'FORMED', createdAt: '26.02.2026 22:39' },
  { id: 'r-5', title: 'Реестр поручений за 09.02.2026', reportType: 'registry', status: 'FORMED', createdAt: '26.02.2026 22:39' },
  { id: 'r-6', title: 'Реестр поручений за 22.02.2026', reportType: 'registry', status: 'FORMED', createdAt: '26.02.2026 22:39' },
];

export interface CorpAction {
  id: string;
  title: string;
  actionType: string;
  createdAt: string;
  isRead: boolean;
}

export const corpActions: CorpAction[] = [
  { id: 'ca-1', title: '(INTR) О корпоративном действии "Выплата купонного дохода" с ценными бумагами эмитента ООО "АвтоМое Опт" ИНН 5905058800 (облигация 4B02-01-00176-L / ISIN RU000A10A794)', actionType: 'INTR', createdAt: '04.03.2026 17:23', isRead: false },
  { id: 'ca-2', title: '(CAPG) О корпоративном действии "Выплата дохода по паям/ису" - Биржевой ПИФ "Т-Капитал Пассивный Доход" (пай 6287 / ISIN RU000A108WX3)', actionType: 'CAPG', createdAt: '04.03.2026 17:18', isRead: false },
  { id: 'ca-3', title: '(INTR) О корпоративном действии "Выплата купонного дохода" с ценными бумагами эмитента ПАО "Сегежа Групп" ИНН 9703024202 (облигация 4B02-07-87154-H-003P / ISIN RU000A10CL64)', actionType: 'INTR', createdAt: '04.03.2026 17:17', isRead: false },
  { id: 'ca-4', title: '(CAPG) О корпоративном действии "Выплата дохода по паям/ису" - Биржевой ПИФ "Т-Капитал Пассивный Доход" (пай 6287 / ISIN RU000A108WX3)', actionType: 'CAPG', createdAt: '04.03.2026 17:10', isRead: false },
];

export interface MarginCall {
  id: string;
  title: string;
  createdAt: string;
}

export const marginCalls: MarginCall[] = [
  { id: 'mc-1', title: 'Величина обеспечения опустилась ниже размера начальной маржи', createdAt: '19.01.2026 14:13' },
  { id: 'mc-2', title: 'Величина обеспечения опустилась ниже размера начальной маржи', createdAt: '19.01.2026 11:33' },
  { id: 'mc-3', title: 'Величина обеспечения опустилась ниже размера начальной маржи', createdAt: '16.01.2026 19:13' },
  { id: 'mc-4', title: 'Величина обеспечения опустилась ниже размера начальной маржи', createdAt: '16.01.2026 17:44' },
  { id: 'mc-5', title: 'Величина обеспечения опустилась ниже размера начальной маржи', createdAt: '16.01.2026 14:14' },
  { id: 'mc-6', title: 'Недостаточно средств для гарантийного обеспечения', createdAt: '16.01.2026 11:33' },
];

export const taxData = {
  year: 2026,
  taxBase: -724.59,
  toPay: 0,
  paid: 1,
};

// ===== ANALYTICS (donut chart) =====
export const analyticsComposition = [
  { name: 'Акции', value: 14.2, color: '#F59E0B' },
  { name: 'Акции (short)', value: 2.06, color: '#6366F1' },
  { name: 'Фьючерсы', value: 7.84, color: '#22C55E' },
  { name: 'Облигации', value: 6.68, color: '#A855F7' },
  { name: 'Валюты', value: 45.18, color: '#EC4899' },
  { name: 'Фонды', value: 10.7, color: '#3B82F6' },
  { name: 'Денежные средства', value: 13.34, color: '#14B8A6' },
];

export const portfolioEvents = [
  { id: 'e-1', dateGroup: 'Сегодня', title: 'Комиссия по сделке: Продажа ЦБ на бирже 1шт. ВТБ ао', ticker: 'VTBR', value: -0.01, isPositive: null },
  { id: 'e-2', dateGroup: 'Сегодня', title: 'Продажа 1 инструмента Акции ВТБ ао по цене 85 ₽', ticker: 'VTBR', value: 85, isPositive: true },
  { id: 'e-3', dateGroup: 'Сегодня', title: 'Продажа РЕПО 3 000 инструментов Акции РусГидро-1-ао по цене 0,44375 ₽', ticker: 'HYDR', value: 1331.25, isPositive: true },
  { id: 'e-4', dateGroup: 'Сегодня', title: 'Покупка РЕПО 3 000 инструментов Акции РусГидро-1-ао по цене 0,44375 ₽', ticker: 'HYDR', value: -1331.25, isPositive: false },
  { id: 'e-5', dateGroup: 'Вчера', title: 'Покупка 1 инструмента Паи WIMM ETF по цене 1,94 ₽', ticker: 'LQDT', value: -1.94, isPositive: false },
];

export const portfolioOrders = [
  { id: 'o-1', dateGroup: 'Сегодня', title: 'Продажа по рыночной', ticker: 'VTBR', status: 'Исполнена', qty: 1, price: 85, value: 85 },
  { id: 'o-2', dateGroup: 'Сегодня', title: 'Продажа лимитная', ticker: 'HYDR', status: 'Отменена', qty: 3000, price: 0.45, value: 1350 },
  { id: 'o-3', dateGroup: 'Вчера', title: 'Покупка лимитная', ticker: 'LQDT', status: 'Исполнена', qty: 1, price: 1.94, value: -1.94 },
];

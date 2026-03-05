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
  { ticker: 'GAZP', name: 'ГАЗПРОМ ао', qty: 20, buyPrice: 126.02, currentPrice: 128.16, value: 2563.2, pnl: -3709, pnlPercent: -59.13, color: '#3B82F6' },
  { ticker: 'VTBR', name: 'ВТБ ао', qty: 11, buyPrice: 87.47, currentPrice: 84.065, value: 924.72, pnl: -37.5, pnlPercent: -3.9, color: '#1E40AF' },
  { ticker: 'TGKN', name: 'ТГК-14', qty: 100000, buyPrice: 0.00662, currentPrice: 0.00623, value: 623, pnl: -39, pnlPercent: -5.89, color: '#10B981' },
  { ticker: 'HYDR', name: 'РусГидро-1-ао', qty: -3000, buyPrice: 0.44638, currentPrice: 0.4434, value: -1330.2, pnl: 8.94, pnlPercent: 0.67, color: '#0EA5E9' },
  { ticker: 'VKCO', name: 'VK-гдр', qty: 2, buyPrice: 308.85, currentPrice: 303.2, value: 606.4, pnl: -11.3, pnlPercent: -1.83, color: '#6366F1' },
  { ticker: 'SGZH', name: 'Сегежа', qty: 100, buyPrice: 1.24, currentPrice: 1.269, value: 126.9, pnl: 3, pnlPercent: 2.42, color: '#84CC16' },
  { ticker: 'GECO', name: 'ГЕНЕТИКО', qty: 20, buyPrice: 24.9, currentPrice: 24.23, value: 484.6, pnl: -13.3, pnlPercent: -2.67, color: '#F43F5E' },
  { ticker: 'GAZP_R', name: 'ГАЗПРОМ ао Репо', qty: 30, buyPrice: 132.44, currentPrice: 128.16, value: 3844.8, pnl: 0, pnlPercent: 0, color: '#3B82F6' },
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

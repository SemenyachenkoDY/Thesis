const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch {
    console.warn(`API call failed: ${endpoint}. Using mock data.`);
    return null;
  }
}

// ===== Documents =====
export const api = {
  // Documents
  getDocuments: (filter?: string) => fetchAPI(`/documents${filter ? `?status=${filter}` : ''}`),
  createDocument: (data: { title: string; docType: string; clientId: string; scenario: string }) =>
    fetchAPI('/documents', { method: 'POST', body: JSON.stringify(data) }),
  signDocument: (id: string) =>
    fetchAPI(`/documents/${id}/sign`, { method: 'POST', body: JSON.stringify({ signature_type: 'FAST_SIGN' }) }),
  confirmSign: (id: string, smsCode: string) =>
    fetchAPI(`/documents/${id}/confirm`, { method: 'POST', body: JSON.stringify({ sms_code: smsCode }) }),

  // Reports
  getReports: (filter?: string) => fetchAPI(`/reports${filter ? `?status=${filter}` : ''}`),
  orderReport: (data: { reportType: string; periodStart: string; periodEnd: string }) =>
    fetchAPI('/reports', { method: 'POST', body: JSON.stringify(data) }),

  // Corp Actions
  getCorpActions: () => fetchAPI('/corp-actions'),

  // Taxes
  getTaxes: (year: number) => fetchAPI(`/taxes/${year}`),

  // Margin Calls
  getMarginCalls: () => fetchAPI('/margin-calls'),

  // Analytics KPI
  getKpi: (period?: string) => fetchAPI(`/analytics/kpi${period ? `?period=${period}` : ''}`),

  // Health
  health: () => fetchAPI('/health'),
};

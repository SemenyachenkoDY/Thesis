import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';

const outfit = Outfit({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ИнвестПорт — Fast Sign',
  description: 'Микросервис быстрой подписи документов для B2B-платформы',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-theme="dark" className={`${outfit.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body className="min-h-screen" style={{ fontFamily: 'var(--font-sans)' }}>
        <ThemeProvider>
          <Header />
          <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

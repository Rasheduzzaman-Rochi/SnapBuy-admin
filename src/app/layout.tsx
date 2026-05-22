import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { DashboardSearchProvider } from '@/components/providers/DashboardSearchProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SnapBuy Admin Dashboard',
  description: 'Admin panel for SnapBuy e-commerce platform',
  icons: {
    icon: '/snapbuy-logo.png',
    shortcut: '/snapbuy-logo.png',
    apple: '/snapbuy-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <DashboardSearchProvider>{children}</DashboardSearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

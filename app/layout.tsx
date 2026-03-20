import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';

export const metadata: Metadata = {
  title: "Maître D' | نظام إدارة المطاعم",
  description: 'نظام CRM متكامل لإدارة الحجوزات والعملاء والعروض للمطاعم والمقاهي',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#944A00',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Material Symbols Outlined icon font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
        {/* Plus Jakarta Sans + Tajawal */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Tajawal:wght@300;400;500;700;800&display=swap"
        />
      </head>
      <body>
        <div className="app-shell">
          <Sidebar />
          <main className="app-main">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}

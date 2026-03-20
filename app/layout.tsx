import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Culinary CRM MVP',
  description: 'Reservations-first CRM for restaurants and cafes',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

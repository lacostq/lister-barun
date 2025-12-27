import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LanguageProvider } from '@/components/providers/language-provider';
import { Toaster } from 'sonner';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: false, // Отключаем обязательную предзагрузку, чтобы не зависеть от серверов Гугла
});

export const metadata: Metadata = {
  title: 'Alpine Essence Soap | Premium Natural Swiss Soap',
  description: 'Handmade natural soaps from the Swiss Alps. 100% organic, zero waste, cruelty-free products from Fribourg, Switzerland.',
  openGraph: {
    title: 'Alpine Essence Soap',
    description: 'Premium natural soaps from the Swiss Alps',
    images: [
      {
        url: 'https://images.pexels.com/photos/3621519/pexels-photo-3621519.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://images.pexels.com/photos/3621519/pexels-photo-3621519.jpeg?auto=compress&cs=tinysrgb&w=1200',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <LanguageProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}

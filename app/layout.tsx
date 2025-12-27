import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/components/providers/language-provider';

// 1. Конфигурируем шрифты с переменными, которые ищет TypeScript
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: false,
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  preload: false,
});

export const metadata = {
  title: 'Alpine Essence Soap | Premium Handmade Swiss Soap',
  description: 'Pure, organic, handcrafted soap from the Swiss Alps (Fribourg).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Исправляем ту самую строку с .variable
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <LanguageProvider>
          <div className="flex flex-col min-h-screen">
            {/* 
               Здесь должен быть Header. Если Bolt его не создал, 
               билд упадет. Если вылетит ошибка по Header — 
               просто временно закомментируй строку с ним ниже. 
            */}
            <main className="flex-grow">{children}</main>
          </div>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}

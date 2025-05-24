
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { MainLayout } from '@/components/layout/main-layout';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/contexts/language-context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Note: Metadata title cannot easily be made dynamic with client-side language context.
// It's typically set at build time or via server-side logic based on URL/cookies.
export const metadata: Metadata = {
  title: 'AI MD 24/25 EDEM', // Static title
  description: 'Showcasing classmates from the AI Masters Degree program.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body suppressHydrationWarning={true} className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}

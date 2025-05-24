
'use client';

import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { useLanguage } from '@/contexts/language-context';

export function Header() {
  const { t } = useLanguage();
  return (
    <header className="bg-background/80 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-border/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <GraduationCap size={32} className="text-accent" />
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl text-accent">{t('aiMastersHub')}</h1>
          </Link>
          <div className="ml-auto">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}

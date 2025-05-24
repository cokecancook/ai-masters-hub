
'use client';

import { useLanguage } from "@/contexts/language-context";

export function Footer() {
  const { t } = useLanguage();
  const currentYear = 2025; // Changed to static year 2025

  return (
    <footer className="bg-card text-muted-foreground py-8 text-center border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm">
          {t('footerRights', undefined, { year: currentYear })}
        </p>
        <p className="text-xs mt-1">
          {t('footerSlogan')}
        </p>
      </div>
    </footer>
  );
}

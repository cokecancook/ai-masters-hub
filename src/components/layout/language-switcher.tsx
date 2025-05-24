
'use client';

import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const buttonText = language === 'en' ? 'ES' : 'EN';
  const ariaLabel = language === 'en' ? t('switchToSpanish') : t('switchToEnglish');

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-sm h-9"
      aria-label={ariaLabel}
    >
      <Globe size={16} />
      {buttonText}
    </Button>
  );
}


'use client';

import type { Classmate, SingleClassmateLangs } from '@/lib/types';
import { ClassmateProfile } from '@/components/classmates/classmate-profile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserX, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { useMemo } from 'react';


interface ClassmateProfilePageClientProps {
  initialClassmateData: SingleClassmateLangs; 
}

export function ClassmateProfilePageClient({ initialClassmateData }: ClassmateProfilePageClientProps) {
  const { language, t } = useLanguage();

  const classmate = useMemo(() => {
    return initialClassmateData[language] || initialClassmateData.es; // Fallback to Spanish
  }, [initialClassmateData, language]);

  if (!classmate) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 min-h-[calc(100vh-10rem)]">
        <UserX size={64} className="text-destructive mb-4" />
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle className="text-2xl">{t('classmateNotFound')}</AlertTitle>
          <AlertDescription className="text-lg">
            {t('classmateNotFoundDescription')}
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-8 hover:bg-accent hover:text-accent-foreground">
          <Link href="/">
            <ArrowLeft size={18} className="mr-2" />
            {t('backToAllClassmates')}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="hover:bg-accent hover:text-accent-foreground">
        <Link href="/">
          <ArrowLeft size={16} className="mr-2" />
          {t('backToAllClassmates')}
        </Link>
      </Button>
      <ClassmateProfile classmate={classmate} />
    </div>
  );
}

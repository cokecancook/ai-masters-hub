
'use client';

import type { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface SearchFilterProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export function SearchFilter({ onSearchChange, searchQuery }: SearchFilterProps) {
  const { t } = useLanguage();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <div className="">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={handleInputChange}
          className="pl-12 text-base py-3 h-12 rounded-lg shadow-sm bg-card border-border focus:ring-2 focus:ring-accent focus:border-accent transition-all"
          aria-label={t('searchPlaceholder')}
        />
      </div>
    </div>
  );
}


'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Classmate, AllClassmatesLangs } from '@/lib/types';
import { ClassmateCard } from '@/components/classmates/classmate-card';
import { ClassmateListItem } from '@/components/classmates/classmate-list-item';
import { SearchFilter } from '@/components/classmates/search-filter';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Users, LayoutGrid, List, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';
import { useIsMobile } from '@/hooks/use-mobile'; // Added import

interface ClassmateHomePageClientProps {
  initialAllClassmatesData: AllClassmatesLangs;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'lastName';
type SortOrder = 'asc' | 'desc';

export function ClassmateHomePageClient({ initialAllClassmatesData }: ClassmateHomePageClientProps) {
  const { language, t } = useLanguage();
  const isMobile = useIsMobile(); // Added hook usage
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid'); // Default to grid, will be adjusted by useEffect
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [hasUserSorted, setHasUserSorted] = useState<boolean>(false);
  const [shuffledClassmateIds, setShuffledClassmateIds] = useState<string[]>([]);
  const [hasUserSelectedViewMode, setHasUserSelectedViewMode] = useState<boolean>(false); // New state

  const currentLanguageClassmates = useMemo(() => {
    return initialAllClassmatesData[language] || initialAllClassmatesData.en; // Fallback to English
  }, [initialAllClassmatesData, language]);

  // Effect to establish the initial shuffled order of IDs
  useEffect(() => {
    const baseClassmatesForIdShuffle = initialAllClassmatesData.es || initialAllClassmatesData.en;
    if (baseClassmatesForIdShuffle && baseClassmatesForIdShuffle.length > 0 && shuffledClassmateIds.length === 0) {
      const ids = baseClassmatesForIdShuffle.map(c => c.id);
      const shuffledIds = [...ids].sort(() => Math.random() - 0.5);
      setShuffledClassmateIds(shuffledIds);
    } else if ((!baseClassmatesForIdShuffle || baseClassmatesForIdShuffle.length === 0) && shuffledClassmateIds.length === 0) {
      setShuffledClassmateIds([]);
    }
  }, [initialAllClassmatesData, shuffledClassmateIds.length]);

  // Effect for automatic view mode setting based on screen size
  useEffect(() => {
    if (!hasUserSelectedViewMode) {
      setViewMode(isMobile ? 'list' : 'grid');
    }
  }, [isMobile, hasUserSelectedViewMode]);

  const sortedAndFilteredClassmates = useMemo(() => {
    let classmatesToProcess: Classmate[];

    if (hasUserSorted) {
      classmatesToProcess = [...currentLanguageClassmates];
    } else {
      if (shuffledClassmateIds.length > 0 && currentLanguageClassmates.length > 0) {
        const classmatesMap = new Map(currentLanguageClassmates.map(c => [c.id, c]));
        classmatesToProcess = shuffledClassmateIds
          .map(id => classmatesMap.get(id))
          .filter((c): c is Classmate => c !== undefined);
      } else {
        classmatesToProcess = [...currentLanguageClassmates];
      }
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      classmatesToProcess = classmatesToProcess.filter(
        (classmate) =>
          classmate.name.toLowerCase().includes(lowerCaseQuery) ||
          classmate.bio.toLowerCase().includes(lowerCaseQuery) ||
          (classmate.interests && classmate.interests.some((interest) => interest.toLowerCase().includes(lowerCaseQuery)))
      );
    }

    if (hasUserSorted) {
        classmatesToProcess.sort((a, b) => {
          let comparison = 0;
          const nameA_parts = a.name.split(' ');
          const nameB_parts = b.name.split(' ');

          const firstNameA = nameA_parts[0]?.toLowerCase() || '';
          const firstNameB = nameB_parts[0]?.toLowerCase() || '';
          const lastNameA = nameA_parts.length > 1 ? nameA_parts[nameA_parts.length - 1]?.toLowerCase() : '';
          const lastNameB = nameB_parts.length > 1 ? nameB_parts[nameB_parts.length - 1]?.toLowerCase() : '';

          if (sortBy === 'name') {
            comparison = firstNameA.localeCompare(firstNameB, language);
            if (comparison === 0) {
              if (lastNameA && lastNameB) {
                comparison = lastNameA.localeCompare(lastNameB, language);
              } else if (lastNameA) {
                comparison = -1;
              } else if (lastNameB) {
                comparison = 1;
              }
            }
          } else if (sortBy === 'lastName') {
            if (lastNameA && lastNameB) {
              comparison = lastNameA.localeCompare(lastNameB, language);
              if (comparison === 0) {
                comparison = firstNameA.localeCompare(firstNameB, language);
              }
            } else if (lastNameA) {
              comparison = -1;
            } else if (lastNameB) {
              comparison = 1;
            } else {
               comparison = firstNameA.localeCompare(firstNameB, language);
            }
          }
          return sortOrder === 'asc' ? comparison : -comparison;
        });
    }
    return classmatesToProcess;
  }, [searchQuery, currentLanguageClassmates, sortBy, sortOrder, language, hasUserSorted, shuffledClassmateIds]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSortByChange = (value: string) => {
    setSortBy(value as SortBy);
    setHasUserSorted(true);
  };

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value as SortOrder);
    setHasUserSorted(true);
  };

  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    setHasUserSelectedViewMode(true); // User has made a manual selection
  };

  const SortOptionLabel: Record<SortBy, string> = useMemo(() => ({
    name: t('firstName'),
    lastName: t('lastName'),
  }), [t]);

  const sortButtonText = useMemo(() => {
    if (hasUserSorted) {
      return `${t('sortBy')} ${SortOptionLabel[sortBy]} (${sortOrder === 'asc' ? t('sortAscAbbreviation') : t('sortDescAbbreviation')})`;
    }
    return `${t('sortBy')} ${t('selectAnOption')}`;
  }, [hasUserSorted, t, SortOptionLabel, sortBy, sortOrder]);


  return (
    <div className="space-y-8">
      {/* Controls Container (div top) */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">

        {/* Search Filter Container (div search) */}
        <div className="w-full md:max-w-sm lg:max-w-md">
         <SearchFilter onSearchChange={handleSearchChange} searchQuery={searchQuery} />
        </div>

        {/* Sort and View Toggles Group (div options) */}
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center md:flex-1 md:justify-between md:gap-2">
          {/* Sort Dropdown Trigger (div order) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 w-full px-4 sm:flex-1">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                {sortButtonText}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>{t('sortBy')}</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sortBy} onValueChange={handleSortByChange}>
                <DropdownMenuRadioItem value="name">{t('firstName')}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="lastName">{t('lastName')}</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>{t('sortOrderLabel')}</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sortOrder} onValueChange={handleSortOrderChange}>
                <DropdownMenuRadioItem value="asc">{t('sortAscAbbreviation')}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="desc">{t('sortDescAbbreviation')}</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Toggle Buttons Container (div buttons) */}
          <div className="flex w-full items-center justify-center gap-2 sm:w-auto">
            <Button
              variant={viewMode === 'grid' ? 'outline' : 'ghost'}
              onClick={() => handleSetViewMode('grid')}
              aria-label={t('gridView')}
              className={cn(
                'h-12 p-0 flex-1 items-center justify-center',
                'sm:w-12 sm:flex-none', // Compact square from sm upwards
                viewMode === 'grid' && 'bg-accent/20 border-accent text-accent'
              )}
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'outline' : 'ghost'}
              onClick={() => handleSetViewMode('list')}
              aria-label={t('listView')}
              className={cn(
                'h-12 p-0 flex-1 items-center justify-center',
                'sm:w-12 sm:flex-none', // Compact square from sm upwards
                viewMode === 'list' && 'bg-accent/20 border-accent text-accent'
              )}
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {sortedAndFilteredClassmates.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sortedAndFilteredClassmates.map((classmate) => (
              <ClassmateCard key={classmate.id} classmate={classmate} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAndFilteredClassmates.map((classmate) => (
              <ClassmateListItem key={classmate.id} classmate={classmate} />
            ))}
          </div>
        )
      ) : (
        <Alert className="mt-8 border-accent text-accent-foreground bg-accent/10">
          <Users className="h-5 w-5 text-accent" />
          <AlertTitle className="text-accent">{t('noClassmatesFoundTitle')}</AlertTitle>
          <AlertDescription>
            {t('noClassmatesFoundDescription')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

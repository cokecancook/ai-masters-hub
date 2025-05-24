
import { loadAllClassmatesData, getClassmateByIdFromAllLangs, getAllClassmateIds } from '@/lib/classmate-data';
import type { AllClassmatesLangs, SingleClassmateLangs } from '@/lib/types';
import { ClassmateProfilePageClient } from '@/components/classmates/classmate-profile-page-client';
import type { Metadata } from 'next';
import type { Language } from '@/contexts/language-context';

interface ClassmatePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ClassmatePageProps): Promise<Metadata> {
  // For metadata, we might fetch a default language or the first available
  const allData = loadAllClassmatesData(); // Load all data to find the specific classmate
  const classmateData = getClassmateByIdFromAllLangs(params.id, allData);
  
  // Default to English for metadata, or Spanish if English is not found, or a generic title
  const classmateForMeta = classmateData.en || classmateData.es; 

  if (!classmateForMeta) {
    return {
      title: 'Classmate Not Found | AI MD 24/25 EDEM',
    };
  }
  return {
    title: `${classmateForMeta.name} | AI MD 24/25 EDEM`,
    description: `Profile of ${classmateForMeta.name}, a student in the AI Masters program. ${classmateForMeta.bio}`,
  };
}

export default async function ClassmatePage({ params }: ClassmatePageProps) {
  const allClassmates = loadAllClassmatesData();
  const classmateData = getClassmateByIdFromAllLangs(params.id, allClassmates);

  return <ClassmateProfilePageClient initialClassmateData={classmateData} />;
}

export async function generateStaticParams() {
  return getAllClassmateIds();
}

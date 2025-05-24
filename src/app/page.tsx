
import { loadAllClassmatesData } from '@/lib/classmate-data';
import { ClassmateHomePageClient } from '@/components/classmates/classmate-home-page-client';

export default async function HomePage() {
  const allClassmatesData = loadAllClassmatesData();

  return <ClassmateHomePageClient initialAllClassmatesData={allClassmatesData} />;
}

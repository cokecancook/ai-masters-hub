
import fs from 'fs';
import path from 'path';
import type { Classmate, AllClassmatesLangs, SingleClassmateLangs } from '@/lib/types';
import type { Language } from '@/contexts/language-context';

// Define sample interests
const sampleEnglishInterests = ['mathematics', 'computer science', 'sample data'];
const sampleSpanishInterests = ['matemáticas', 'informática', 'datos de muestra'];

const baseSampleClassmate = {
  id: 'ada-lovelace-fallback',
  name: 'Ada Lovelace (Sample)',
  email: 'ada.lovelace@aimasters.edu',
  photoFileName: 'images/students/ada-lovelace.png',
  photoAiHint: 'portrait woman',
  linkedinUrl: 'https://www.linkedin.com/company/example',
  githubUrl: 'https://github.com/example',
  cvFileName: 'ada_lovelace_cv_sample.pdf',
};

const sampleAllClassmatesData: AllClassmatesLangs = {
  en: [{
    ...baseSampleClassmate,
    bio: "Pioneering mathematician. (Sample data - ensure students-info-en.json exists or check its content)",
    fullDescription:
      "This is English sample data because 'public/students-info-en.json' was not found or could not be processed. Augusta Ada King, Countess of Lovelace was an English mathematician and writer, chiefly known for her work on Charles Babbage's proposed mechanical general-purpose computer, the Analytical Engine.",
    interests: sampleEnglishInterests,
  }],
  es: [{
    ...baseSampleClassmate,
    bio: "Matemática pionera. (Datos de muestra: asegúrate de que students-info-es.json exista o revisa su contenido)",
    fullDescription:
      "Estos son datos de muestra en español porque 'public/students-info-es.json' no se encontró o no se pudo procesar. Augusta Ada King, Condesa de Lovelace, fue una matemática y escritora inglesa, conocida principalmente por su trabajo sobre el motor analítico de Charles Babbage.",
    interests: sampleSpanishInterests, // Use Spanish sample interests for fallback
  }]
};

function loadClassmatesForLanguage(language: Language): Classmate[] {
  const fileName = `students-info-${language}.json`;
  const filePath = path.join(process.cwd(), 'public', fileName);

  try {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      if (fileContents.trim() === '') {
        console.warn(`File 'public/${fileName}' is empty. Serving sample data for ${language}.`);
        return sampleAllClassmatesData[language];
      }
      const rawData: Array<any> = JSON.parse(fileContents);

      if (rawData.length === 0) {
        console.warn(`File 'public/${fileName}' contains an empty array. Serving sample data for ${language}.`);
        return sampleAllClassmatesData[language];
      }

      return rawData.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        photoUrl: `/${student.photoFileName.startsWith('/') ? student.photoFileName.substring(1) : student.photoFileName}`,
        photoAiHint: student.photoAiHint || 'portrait student',
        bio: student.bio,
        fullDescription: student.fullDescription,
        linkedinUrl: student.linkedinUrl,
        githubUrl: student.githubUrl,
        cvFileName: student.cvFileName,
        interests: student.interests || [],
      }));
    } else {
      console.warn(`File 'public/${fileName}' not found. Serving sample data for ${language}.`);
      return sampleAllClassmatesData[language];
    }
  } catch (error: any) {
    console.error(`Failed to load or parse 'public/${fileName}' (Reason: ${error.message}). Falling back to sample data for ${language}.`);
    return sampleAllClassmatesData[language];
  }
}

export function loadAllClassmatesData(): AllClassmatesLangs {
  const englishClassmates = loadClassmatesForLanguage('en');
  const spanishClassmates = loadClassmatesForLanguage('es');

  // Directly use content from students-info-es.json for Spanish interests
  return {
    en: englishClassmates,
    es: spanishClassmates,
  };
}

export function getClassmateByIdFromAllLangs(id: string, allData: AllClassmatesLangs): SingleClassmateLangs {
  return {
    en: allData.en.find(c => c.id === id),
    es: allData.es.find(c => c.id === id),
  };
}

// Used for generateStaticParams - can read from one language file as IDs should be consistent
export async function getAllClassmateIds(): Promise<Array<{ id: string }>> {
  // Reading from 'en' file for IDs, assuming IDs are consistent.
  const classmatesEn = loadClassmatesForLanguage('en');
  return classmatesEn.map((classmate) => ({
    id: classmate.id,
  }));
}

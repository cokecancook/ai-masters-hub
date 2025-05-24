
import fs from 'fs';
import path from 'path';
import type { Classmate, AllClassmatesLangs, SingleClassmateLangs } from '@/lib/types';
import type { Language } from '@/contexts/language-context';

// Helper function to generate a slug from a name
function slugifyName(name: string): string {
  if (!name) return 'unknown-student';
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^\w\s-]/g, '') // Remove non-word characters except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single
}

// Helper function to get the expected CV filename based on name and language convention
function generateCvBaseFilename(name: string, targetLanguage: Language): string {
  const slug = slugifyName(name);
  const suffix = targetLanguage === 'en' ? 'resume.pdf' : 'cv.pdf';
  return `${slug}-${suffix}`;
}

const baseSampleClassmate = {
  id: 'ada-lovelace-fallback',
  name: 'Ada Lovelace (Sample)',
  email: 'ada.lovelace@aimasters.edu',
  photoFileName: 'images/students/ada-lovelace.png', // Path from public folder
  photoAiHint: 'portrait woman',
  linkedinUrl: 'https://www.linkedin.com/company/example',
  githubUrl: 'https://github.com/example',
  cvFileName: 'ada_lovelace_cv_sample.pdf', // Legacy, can be removed or ignored if new convention is primary
};

const sampleAllClassmatesData: AllClassmatesLangs = {
  en: [{
    ...baseSampleClassmate,
    bio: "Pioneering mathematician. (Sample data - ensure students-info-en.json exists or check its content)",
    fullDescription:
      "This is English sample data because 'public/students-info-en.json' was not found or could not be processed. Augusta Ada King, Countess of Lovelace was an English mathematician and writer, chiefly known for her work on Charles Babbage's proposed mechanical general-purpose computer, the Analytical Engine.",
    interests: ['mathematics', 'computer science', 'algorithms'],
    cvAvailable: true, 
    actualCvPath: `/resumes/en/${generateCvBaseFilename(baseSampleClassmate.name, 'en')}`, // Assuming sample CV exists for EN
  }],
  es: [{
    ...baseSampleClassmate,
    name: 'Ada Lovelace (Muestra)',
    bio: "Matemática pionera. (Datos de muestra: asegúrate de que students-info-es.json exista o revisa su contenido)",
    fullDescription:
      "Estos son datos de muestra en español porque 'public/students-info-es.json' no se encontró o no se pudo procesar. Augusta Ada King, Condesa de Lovelace, fue una matemática y escritora inglesa, conocida principalmente por su trabajo sobre el motor analítico de Charles Babbage.",
    interests: ['matemáticas', 'informática', 'algoritmos'], // Sample interests for ES
    cvAvailable: true, 
    actualCvPath: `/resumes/es/${generateCvBaseFilename(baseSampleClassmate.name, 'es')}`, // Assuming sample CV exists for ES
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

      return rawData.map(student => {
        const studentName = student.name || 'unknown-student';
        let cvAvailable = false;
        let actualCvPath = '';

        // Determine CV availability and path based on the NEW conventions
        if (language === 'en') {
          const enCvBaseFilename = generateCvBaseFilename(studentName, 'en');
          const enCvServerPath = path.join(process.cwd(), 'public', 'resumes', 'en', enCvBaseFilename);
          const enFileExists = fs.existsSync(enCvServerPath);

          if (enFileExists) {
            cvAvailable = true;
            actualCvPath = `/resumes/en/${enCvBaseFilename}`;
          } else {
            // Fallback to Spanish version for English view
            const esCvBaseFilenameForFallback = generateCvBaseFilename(studentName, 'es');
            const esCvServerPathForFallback = path.join(process.cwd(), 'public', 'resumes', 'es', esCvBaseFilenameForFallback);
            const esFileForFallbackExists = fs.existsSync(esCvServerPathForFallback);
            if (esFileForFallbackExists) {
              cvAvailable = true;
              actualCvPath = `/resumes/es/${esCvBaseFilenameForFallback}`;
            }
          }
        } else { // language === 'es'
          const esCvBaseFilename = generateCvBaseFilename(studentName, 'es');
          const esCvServerPath = path.join(process.cwd(), 'public', 'resumes', 'es', esCvBaseFilename);
          const esFileExists = fs.existsSync(esCvServerPath);

          if (esFileExists) {
            cvAvailable = true;
            actualCvPath = `/resumes/es/${esCvBaseFilename}`;
          }
          // No fallback from Spanish to English for CVs in the Spanish view
        }
        
        return {
          id: student.id,
          name: studentName,
          email: student.email || '', // Ensure email is at least an empty string
          photoUrl: `/${student.photoFileName.startsWith('/') ? student.photoFileName.substring(1) : student.photoFileName}`,
          photoAiHint: student.photoAiHint || 'portrait student',
          bio: student.bio,
          fullDescription: student.fullDescription,
          linkedinUrl: student.linkedinUrl,
          githubUrl: student.githubUrl,
          cvFileName: student.cvFileName || '', // Original CV filename from JSON, kept for reference
          cvAvailable: cvAvailable,
          actualCvPath: actualCvPath,
          interests: student.interests || [],
        };
      });
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
  const classmatesEn = loadClassmatesForLanguage('en'); // Or 'es', assuming IDs are consistent
  return classmatesEn.map((classmate) => ({
    id: classmate.id,
  }));
}


export interface Classmate {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  photoAiHint: string; // Max 2 words
  bio: string; 
  fullDescription: string;
  linkedinUrl: string;
  githubUrl: string;
  cvFileName: string; // Stores only the filename, e.g., "john_doe_cv.pdf"
  interests: string[];
}

// Structure to hold classmates data for all supported languages
export interface AllClassmatesLangs {
  en: Classmate[];
  es: Classmate[];
}

// Structure to hold a single classmate's data for all supported languages
export interface SingleClassmateLangs {
  en: Classmate | undefined;
  es: Classmate | undefined;
}

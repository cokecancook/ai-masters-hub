
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
  cvFileName: string; // Original filename from JSON, kept for reference
  cvAvailable: boolean; // True if a CV (considering language and fallback) exists
  actualCvPath: string; // The actual URL path to the CV file
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

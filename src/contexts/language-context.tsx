
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useCallback } from 'react';

export type Language = 'en' | 'es';

// Define translations
// In a larger app, these would likely be in separate JSON files per language.
const translations = {
  es: {
    appTitle: "AI MD 24/25 EDEM",
    aiMastersHub: "AI Master's Hub",
    footerRights: "© {year} AI Master's Hub. Todos los derechos reservados.",
    footerSlogan: "Conectando las mentes brillantes del mañana en IA.",
    searchPlaceholder: "Buscar por nombre, bio o intereses...",
    sortBy: "Ordenar por:",
    firstName: "Nombre",
    lastName: "Apellido",
    sortAscending: "Ascendente",
    sortDescending: "Descendente",
    sortOrderLabel: "Orden",
    selectAnOption: "(Selecciona una opción)",
    sortAscAbbreviation: "Asc.",
    sortDescAbbreviation: "Desc.",
    gridView: "Vista de cuadrícula",
    listView: "Vista de lista",
    noClassmatesFoundTitle: "No se encontraron compañeros",
    noClassmatesFoundDescription: "Ningún compañero coincide con tus filtros. Intenta con otro término de búsqueda o ajusta el orden.",
    viewProfile: "Ver Perfil",
    profile: "Perfil",
    aboutMe: "Sobre Mí",
    interests: "Intereses",
    classmateNotFound: "Compañero No Encontrado",
    classmateNotFoundDescription: "El perfil que buscas no existe o no pudo ser encontrado.",
    backToAllClassmates: "Volver a Todos los Compañeros",
    contactTitle: "Contactar a {name}",
    contactDescription: "Envía un mensaje a {name}. (Este es un formulario de demostración y no enviará un correo electrónico real).",
    yourName: "Tu Nombre",
    yourEmail: "Tu Email",
    message: "Mensaje",
    sendMessage: "Enviar Mensaje",
    sending: "Enviando...",
    messageSentToastTitle: "Mensaje Enviado (Simulado)",
    messageSentToastDescription: "Tu mensaje a {name} ha sido \"enviado\". En una aplicación real, esto sería un correo electrónico.",
    switchToEnglish: "Cambiar a Inglés",
    switchToSpanish: "Cambiar a Español",
    classmateCV: "CV de {name}",
    emailClassmate: "Enviar email a {name}",
    linkedinClassmate: "LinkedIn de {name}",
    githubClassmate: "GitHub de {name}",
  },
  en: {
    appTitle: "AI MD 24/25 EDEM",
    aiMastersHub: "AI Master's Hub",
    footerRights: "© {year} AI Master's Hub. All rights reserved.",
    footerSlogan: "Connecting the bright minds of tomorrow's AI.",
    searchPlaceholder: "Search by name, bio, or interests...",
    sortBy: "Sort by:",
    firstName: "First Name",
    lastName: "Last Name",
    sortAscending: "Ascending",
    sortDescending: "Descending",
    sortOrderLabel: "Order",
    selectAnOption: "(Select an option)",
    sortAscAbbreviation: "Asc.",
    sortDescAbbreviation: "Desc.",
    gridView: "Grid view",
    listView: "List view",
    noClassmatesFoundTitle: "No Classmates Found",
    noClassmatesFoundDescription: "No classmates match your current filters. Try a different search term or adjust sorting.",
    viewProfile: "View Profile",
    profile: "Profile",
    aboutMe: "About Me",
    interests: "Interests",
    classmateNotFound: "Classmate Not Found",
    classmateNotFoundDescription: "The profile you are looking for does not exist or could not be found.",
    backToAllClassmates: "Back to All Classmates",
    contactTitle: "Contact {name}",
    contactDescription: "Send a message to {name}. (This is a demo form and won't actually send an email).",
    yourName: "Your Name",
    yourEmail: "Your Email",
    message: "Message",
    sendMessage: "Send Message",
    sending: "Sending...",
    messageSentToastTitle: "Message Sent (Simulated)",
    messageSentToastDescription: "Your message to {name} has been \"sent\". In a real app, this would be an actual email.",
    switchToEnglish: "Switch to English",
    switchToSpanish: "Switch to Spanish",
    classmateCV: "{name}'s CV",
    emailClassmate: "Send email to {name}",
    linkedinClassmate: "{name}'s LinkedIn",
    githubClassmate: "{name}'s GitHub",
  },
};

type TranslationKey = keyof typeof translations.es; // Use 'es' as the base for keys, assuming it's complete

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, fallback?: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('es'); // Default to Spanish

  const t = useCallback((key: TranslationKey, fallback?: string, replacements?: Record<string, string | number>): string => {
    let text = translations[language]?.[key] || translations.en[key]; // Fallback to English if key missing in current lang
    if (text === undefined) {
        text = fallback || key; // Use provided fallback or the key itself if no translation found
        console.warn(`Translation key "${key}" not found for language "${language}" or fallback "en". Using fallback/key: "${text}"`);
    }
    if (replacements) {
      Object.keys(replacements).forEach(rKey => {
        const regex = new RegExp(`\\{${rKey}\\}`, 'g');
        text = text.replace(regex, String(replacements[rKey]));
      });
    }
    return text;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

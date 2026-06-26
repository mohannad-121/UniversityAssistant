import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { repairMojibake } from "@/lib/text-encoding";

export type Language = "en" | "ar";

type TranslationValue = string | Record<string, TranslationValue>;

const translations = {
  en: {
    language: {
      label: "Language",
      english: "English",
      arabic: "Arabic",
      switchTo: "Switch to Arabic",
    },
    nav: {
      home: "Home",
      chatbot: "Chatbot",
      courses: "Courses",
      instructors: "Instructors",
      departments: "Departments",
      faq: "FAQ",
      login: "Login",
      admin: "Admin",
      startChatting: "Start Chatting",
      subtitle: "Smart University Chatbot",
      menu: "Toggle menu",
    },
    footer: {
      tagline: "University AI Chatbot - Smart Academic Assistant",
      copyright: "Built for academic guidance.",
    },
    home: {
      eyebrow: "Smart Academic Assistant",
      title: "Your Smart University Assistant",
      subtitle:
        "Ask about courses, prerequisites, instructors, departments, offices, and university services.",
      browseCourses: "Browse Courses",
      featuresTitle: "Everything a student needs, in one place",
      featuresSubtitle:
        "مرشدي brings academic information together so you can find answers in seconds.",
      ctaTitle: "Ready to ask your first question?",
      ctaSubtitle:
        "Start a conversation and let مرشدي help you navigate courses, instructors, and campus services.",
    },
    courses: {
      eyebrow: "Academics",
      title: "University Courses",
      subtitle: "Search the catalog and filter by department to plan your next semester.",
      search: "Search by name or course code...",
      allDepartments: "All departments",
      showing: "Showing {shown} of {total} courses",
      creditHours: "Credit hours",
      prerequisites: "Prerequisites",
      none: "None",
      empty: "No courses match your search.",
    },
    instructors: {
      eyebrow: "Faculty",
      title: "Instructors & Doctors",
      subtitle: "Contact details, office locations, and office hours for the IT faculty staff.",
      search: "Search by name, department, or course...",
      office: "Office",
      email: "Email",
      officeHours: "Office hours",
      coursesTaught: "Courses taught",
      empty: "No instructors match your search.",
    },
    departments: {
      eyebrow: "Faculty of IT",
      title: "Departments",
      subtitle: "The academic departments within the Faculty of Information Technology.",
      mainCourses: "Main courses",
      contact: "Contact",
      head: "Head",
      supportSubtitle:
        "Your first stop for accounts, network, portal, and lab support across campus.",
      office: "Office",
      email: "Email",
      phone: "Phone",
      hours: "Hours",
    },
    faq: {
      eyebrow: "Help Center",
      title: "Frequently Asked Questions",
      subtitle: "Quick answers to the most common student questions.",
      all: "All",
    },
    chatbot: {
      status: "Online - University Knowledge Base",
      greeting:
        "Hi! I'm مرشدي. Ask me about courses, prerequisites, instructors, departments, offices, or IT support.",
      placeholder: "Ask about courses, prerequisites, instructors...",
    },
  },
  ar: {
    language: {
      label: "Ø§Ù„Ù„غة",
      english: "English",
      arabic: "Ø§Ù„Ø¹Ø±Ø¨ÙŠة",
      switchTo: "Ø§Ù„ØªØ¨Ø¯ÙŠÙ„ Ø¥Ù„Ù‰ Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠة",
    },
    nav: {
      home: "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠة",
      chatbot: "Ø§Ù„Ù…ساعد",
      courses: "Ø§Ù„Ù…Ùˆاد",
      instructors: "Ø§Ù„Ù…Ø¯Ø±Ø³ÙˆÙ†",
      departments: "Ø§Ù„Ø£Ù‚Ø³Ø§Ù…",
      faq: "Ø§Ù„Ø£Ø³Ø¦Ù„ة",
      admin: "Ø§Ù„إدارة",
      startChatting: "Ø§Ø¨Ø¯Ø£ Ø§Ù„Ù…حادثة",
      subtitle: "Ù…Ø³Ø§Ø¹Ø¯ Ø§Ù„Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø°ÙƒÙŠ",
      menu: "ÙØªØ­ Ø§Ù„Ù‚Ø§Ø¦Ù…ة",
    },
    footer: {
      tagline: "Ù…Ø³Ø§Ø¹Ø¯ Ø§Ù„Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ø°ÙƒÙŠ - Ø¥Ø±Ø´Ø§Ø¯ Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ Ø°ÙƒÙŠ",
      copyright: "ØµÙ…Ù… Ù„Ù„Ø¥Ø±Ø´Ø§Ø¯ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ.",
    },
    home: {
      eyebrow: "Ù…Ø³Ø§Ø¹Ø¯ Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠ Ø°ÙƒÙŠ",
      title: "Ù…Ø³Ø§Ø¹Ø¯Ùƒ Ø§Ù„Ø¬Ø§Ù…Ø¹ÙŠ Ø§Ù„Ø°ÙƒÙŠ",
      subtitle: "Ø§Ø³Ø£Ù„ Ø¹Ù† Ø§Ù„Ù…ÙˆØ§Ø¯ØŒ Ø§Ù„Ù…ØªØ·Ù„Ø¨Ø§Øª Ø§Ù„Ø³Ø§Ø¨Ù‚Ø©ØŒ Ø§Ù„Ù…Ø¯Ø±Ø³ÙŠÙ†ØŒ Ø§Ù„Ø£Ù‚Ø³Ø§Ù…ØŒ Ø§Ù„Ù…ÙƒØ§ØªØ¨ØŒ ÙˆØ®Ø¯Ù…Ø§Øª Ø§Ù„Ø¬Ø§Ù…عة.",
      browseCourses: "ØªØµÙØ­ Ø§Ù„Ù…Ùˆاد",
      featuresTitle: "ÙƒÙ„ Ù…Ø§ ÙŠØ­ØªØ§Ø¬Ù‡ Ø§Ù„Ø·Ø§Ù„Ø¨ ÙÙŠ Ù…ÙƒØ§Ù† Ùˆاحد",
      featuresSubtitle: "ÙŠØ¬Ù…Ø¹ مرشدي Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ù„ØªØ¬Ø¯ Ø§Ù„Ø¥Ø¬Ø§Ø¨Ø§Øª Ø®Ù„Ø§Ù„ Ø«ÙˆØ§Ù†.",
      ctaTitle: "Ø¬Ø§Ù‡Ø² Ù„Ø·Ø±Ø­ Ø£ÙˆÙ„ Ø³Ø¤Ø§Ù„ØŸ",
      ctaSubtitle: "Ø§Ø¨Ø¯Ø£ Ù…Ø­Ø§Ø¯Ø«Ø© ÙˆØ¯Ø¹ مرشدي ÙŠØ³Ø§Ø¹Ø¯Ùƒ ÙÙŠ Ø§Ù„Ù…ÙˆØ§Ø¯ØŒ Ø§Ù„Ù…Ø¯Ø±Ø³ÙŠÙ†ØŒ ÙˆØ®Ø¯Ù…Ø§Øª Ø§Ù„Ø­Ø±Ù… Ø§Ù„Ø¬Ø§Ù…Ø¹ÙŠ.",
    },
    courses: {
      eyebrow: "Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠات",
      title: "Ù…ÙˆØ§Ø¯ Ø§Ù„Ø¬Ø§Ù…عة",
      subtitle: "Ø§Ø¨Ø­Ø« ÙÙŠ Ø¯Ù„ÙŠÙ„ Ø§Ù„Ù…ÙˆØ§Ø¯ ÙˆØµÙ Ø­Ø³Ø¨ Ø§Ù„Ù‚Ø³Ù… Ù„ØªØ®Ø·Ø· Ù„ÙØµÙ„Ùƒ Ø§Ù„Ù‚Ø§Ø¯Ù….",
      search: "Ø§Ø¨Ø­Ø« Ø¨Ø§Ù„Ø§Ø³Ù… Ø£Ùˆ Ø±Ù…Ø² Ø§Ù„Ù…ادة...",
      allDepartments: "ÙƒÙ„ Ø§Ù„Ø£Ù‚Ø³Ø§Ù…",
      showing: "عرض {shown} Ù…Ù† Ø£ØµÙ„ {total} Ù…ادة",
      creditHours: "Ø§Ù„Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ù…Ø¹ØªÙ…دة",
      prerequisites: "Ø§Ù„Ù…ØªØ·Ù„Ø¨Ø§Øª Ø§Ù„Ø³Ø§Ø¨Ù‚ة",
      none: "Ù„Ø§ ÙŠÙˆجد",
      empty: "Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…ÙˆØ§Ø¯ ØªØ·Ø§Ø¨Ù‚ Ø¨Ø­Ø«Ùƒ.",
    },
    instructors: {
      eyebrow: "Ø§Ù„Ù‡ÙŠØ¦Ø© Ø§Ù„ØªØ¯Ø±ÙŠØ³ÙŠة",
      title: "Ø§Ù„Ù…Ø¯Ø±Ø³ÙˆÙ† ÙˆØ§Ù„Ø¯Ùƒاترة",
      subtitle: "Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„ØªÙˆØ§ØµÙ„ØŒ Ù…ÙˆØ§Ù‚Ø¹ Ø§Ù„Ù…ÙƒØ§ØªØ¨ØŒ ÙˆØ§Ù„Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ù…ÙƒØªØ¨ÙŠØ© Ù„Ù‡ÙŠØ¦Ø© ÙƒÙ„ÙŠØ© ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§ Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…ات.",
      search: "Ø§Ø¨Ø­Ø« Ø¨Ø§Ù„Ø§Ø³Ù… Ø£Ùˆ Ø§Ù„Ù‚Ø³Ù… Ø£Ùˆ Ø§Ù„Ù…ادة...",
      office: "Ø§Ù„Ù…Ùƒتب",
      email: "Ø§Ù„Ø¨Ø±ÙŠد",
      officeHours: "Ø§Ù„Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ù…ÙƒØªØ¨ÙŠة",
      coursesTaught: "Ø§Ù„Ù…ÙˆØ§Ø¯ Ø§Ù„ØªÙŠ ÙŠØ¯Ø±Ø³Ù‡ا",
      empty: "Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ø¯Ø±Ø³ÙˆÙ† ÙŠØ·Ø§Ø¨Ù‚ÙˆÙ† Ø¨Ø­Ø«Ùƒ.",
    },
    departments: {
      eyebrow: "ÙƒÙ„ÙŠØ© ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§ Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…ات",
      title: "Ø§Ù„Ø£Ù‚Ø³Ø§Ù…",
      subtitle: "Ø§Ù„Ø£Ù‚Ø³Ø§Ù… Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø¯Ø§Ø®Ù„ ÙƒÙ„ÙŠØ© ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§ Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…ات.",
      mainCourses: "Ø§Ù„Ù…ÙˆØ§Ø¯ Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠة",
      contact: "Ø§Ù„ØªÙˆØ§ØµÙ„",
      head: "Ø±Ø¦ÙŠØ³ Ø§Ù„Ù‚Ø³Ù…",
      supportSubtitle: "ÙˆØ¬Ù‡ØªÙƒ Ø§Ù„Ø£ÙˆÙ„Ù‰ Ù„Ø¯Ø¹Ù… Ø§Ù„Ø­Ø³Ø§Ø¨Ø§ØªØŒ Ø§Ù„Ø´Ø¨ÙƒØ©ØŒ Ø§Ù„Ø¨ÙˆØ§Ø¨Ø©ØŒ ÙˆØ§Ù„Ù…Ø®ØªØ¨Ø±Ø§Øª ÙÙŠ Ø§Ù„Ø­Ø±Ù… Ø§Ù„Ø¬Ø§Ù…Ø¹ÙŠ.",
      office: "Ø§Ù„Ù…Ùƒتب",
      email: "Ø§Ù„Ø¨Ø±ÙŠد",
      phone: "Ø§Ù„Ù‡اتف",
      hours: "Ø§Ù„ساعات",
    },
    faq: {
      eyebrow: "Ù…Ø±ÙƒØ² Ø§Ù„Ù…ساعدة",
      title: "Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„شائعة",
      subtitle: "Ø¥Ø¬Ø§Ø¨Ø§Øª Ø³Ø±ÙŠØ¹Ø© Ø¹Ù„Ù‰ Ø£ÙƒØ«Ø± Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ø·Ù„Ø§Ø¨ Ø´ÙŠÙˆعا.",
      all: "Ø§Ù„ÙƒÙ„",
    },
    chatbot: {
      status: "Ù…ØªØµÙ„ - Ù‚Ø§Ø¹Ø¯Ø© Ù…Ø¹Ø±ÙØ© Ø§Ù„Ø¬Ø§Ù…عة",
      greeting:
        "Ù…Ø±Ø­Ø¨Ø§! Ø£Ù†Ø§ مرشدي. Ø§Ø³Ø£Ù„Ù†ÙŠ Ø¹Ù† Ø§Ù„Ù…ÙˆØ§Ø¯ØŒ Ø§Ù„Ù…ØªØ·Ù„Ø¨Ø§Øª Ø§Ù„Ø³Ø§Ø¨Ù‚Ø©ØŒ Ø§Ù„Ù…Ø¯Ø±Ø³ÙŠÙ†ØŒ Ø§Ù„Ø£Ù‚Ø³Ø§Ù…ØŒ Ø§Ù„Ù…ÙƒØ§ØªØ¨ØŒ Ø£Ùˆ Ø¯Ø¹Ù… ØªÙ‚Ù†ÙŠØ© Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…ات.",
      placeholder: "Ø§Ø³Ø£Ù„ Ø¹Ù† Ø§Ù„Ù…ÙˆØ§Ø¯ØŒ Ø§Ù„Ù…ØªØ·Ù„Ø¨Ø§Øª Ø§Ù„Ø³Ø§Ø¨Ù‚Ø©ØŒ Ø§Ù„Ù…Ø¯Ø±Ø³ÙŠÙ†...",
    },
  },
} as const;

type LanguageContextValue = {
  language: Language;
  direction: "ltr" | "rtl";
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem("murshidi-language") === "ar" ? "ar" : "en";
}

function lookupTranslation(language: Language, key: string) {
  return key.split(".").reduce<TranslationValue | undefined>(
    (value, part) => {
      if (!value || typeof value === "string") return undefined;
      return value[part];
    },
    translations[language] as Record<string, TranslationValue>,
  );
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(readStoredLanguage);
  const direction = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    window.localStorage.setItem("murshidi-language", language);
  }, [direction, language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      direction,
      setLanguage,
      toggleLanguage: () => setLanguage((current) => (current === "en" ? "ar" : "en")),
      t: (key) => {
        const translated = lookupTranslation(language, key);
        if (typeof translated === "string") return repairMojibake(translated);
        const fallback = lookupTranslation("en", key);
        return typeof fallback === "string" ? repairMojibake(fallback) : key;
      },
    }),
    [direction, language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}





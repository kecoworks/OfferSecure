import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Check } from "lucide-react";
import { CONFIG } from "../config";
import type { TranslationPayload } from "../types";
import { speakMultilingualText, stopSpeech } from "../utils/speechService";

interface TranslationDrawerProps {
  translations: TranslationPayload;
  riskCategory: string;
  threatIndex: number;
  isDarkMode: boolean;
  activeLanguage: string;
  onLanguageChange: (langCode: string) => void;
}

export const TranslationDrawer: React.FC<TranslationDrawerProps> = ({
  translations,
  threatIndex,
  isDarkMode,
  activeLanguage,
  onLanguageChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const supportedLanguages = CONFIG.TRANSLATION.SUPPORTED_LANGUAGES;

  // Language mapping
  const getTranslationText = (code: string): string => {
    switch (code) {
      case "te":
        return translations.telugu || "హెచ్చరిక: సంభావ్య మోసం గుర్తించబడింది.";
      case "ta":
        return translations.tamil || "எச்சரிக்கை: சாத்தியமான மோசடி கண்டறியப்பட்டது.";
      case "kn":
        return translations.kannada || "ಎಚ್ಚರಿಕೆ: ಸಂಭಾವ್ಯ ವಂಚನೆ ಪತ್ತೆಯಾಗಿದೆ.";
      case "ml":
        return translations.malayalam || "മുന്നറിയിപ്പ്: സാധ്യമായ തട്ടിപ്പ് കണ്ടെത്തി.";
      case "hi":
        return translations.hindi || "चेतावनी: संभावित धोखाधड़ी का पता चला है।";
      case "ur":
        return translations.urdu || "انتباہ: ممکنہ دھوکہ دہی کا پتہ چلا ہے۔";
      case "fr":
        return translations.french || "Alerte : Fraude potentielle détectée.";
      case "de":
        return translations.german || "Warnung: Möglicher Betrug erkannt.";
      case "mr":
        return translations.marathi || "సాवधान: संभाव्य फसवणूक आढळली आहे.";
      case "en":
      default:
        return threatIndex >= 70
          ? "Warning: Fraudulent recruitment offer detected. Never pay advance fees for equipment or training."
          : threatIndex > 30
          ? "Caution: Suspicious indicators detected. Verify the recruiter through official company channels."
          : "Safe to proceed: Standard recruitment attributes detected.";
    }
  };

  const currentTranslationText = getTranslationText(activeLanguage);

  // Stop active speech if language changes
  useEffect(() => {
    stopSpeech();
    setIsPlayingAudio(false);
  }, [activeLanguage]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Audio speech synthesis with explicit dynamic voice resolution
  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const success = speakMultilingualText(
      currentTranslationText,
      activeLanguage,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );

    if (!success) {
      setIsPlayingAudio(false);
    }
  };

  const currentLangObj = supportedLanguages.find((l) => l.code === activeLanguage) || {
    name: "English",
    nativeName: "English",
    code: "en",
  };

  return (
    <div id="floating-lang-trigger" ref={dropdownRef} className="fixed bottom-5 right-5 z-50">
      {/* Compact Round Icon (48px x 48px) matching specification */}
      <button
        id="btn-lang-floating"
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Select Language"
        title={`Language: ${currentLangObj.nativeName}`}
      >
        <span className="text-xl leading-none">🌐</span>
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          id="langDropdown"
          className={`absolute bottom-16 right-0 w-64 rounded-xl border shadow-xl overflow-hidden transition-all animate-in fade-in duration-150 ${
            isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          {/* Header */}
          <div className={`p-3 border-b text-xs flex items-center justify-between ${isDarkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Regional Language</span>
            <button
              onClick={handlePlayAudio}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium"
              title="Play voice pronunciation"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </>
              )}
            </button>
          </div>

          {/* Active summary preview */}
          <div className="p-3 text-xs leading-relaxed border-b border-slate-100 dark:border-slate-800 bg-blue-50/40 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200">
            <span className="text-[10px] uppercase font-bold text-blue-600 block mb-0.5">
              {currentLangObj.nativeName} ({currentLangObj.name}):
            </span>
            <p className="line-clamp-3">"{currentTranslationText}"</p>
          </div>

          {/* Language Options List */}
          <div className="max-h-60 overflow-y-auto py-1 text-xs">
            <button
              type="button"
              onClick={() => {
                onLanguageChange("en");
              }}
              className={`w-full px-3.5 py-2 text-left flex items-center justify-between transition ${
                activeLanguage === "en"
                  ? "bg-blue-50 dark:bg-slate-800 text-blue-600 font-semibold"
                  : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <span>English</span>
              {activeLanguage === "en" && <Check className="w-3.5 h-3.5 text-blue-600" />}
            </button>

            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  onLanguageChange(lang.code);
                }}
                className={`w-full px-3.5 py-2 text-left flex items-center justify-between transition ${
                  activeLanguage === lang.code
                    ? "bg-blue-50 dark:bg-slate-800 text-blue-600 font-semibold"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div>
                  <span className="font-medium mr-1.5">{lang.nativeName}</span>
                  <span className="text-[11px] text-slate-400">({lang.name})</span>
                </div>
                {activeLanguage === lang.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

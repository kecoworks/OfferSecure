import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ScannerInput } from "./components/ScannerInput";
import { ThreatIndexDial } from "./components/ThreatIndexDial";
import { InteractiveHighlighter } from "./components/InteractiveHighlighter";
import { DomainAnalysisCard } from "./components/DomainAnalysisCard";
import { ActionChecklistCard } from "./components/ActionChecklistCard";
import { TranslationDrawer } from "./components/TranslationDrawer";
import { CybercrimeDossierModal } from "./components/CybercrimeDossierModal";
import { ChromeExtensionSimulator } from "./components/ChromeExtensionSimulator";
import { JsonContractModal } from "./components/JsonContractModal";
import { analyzeOfferShield } from "./engine/scoringEngine";
import { SAMPLE_SCENARIOS } from "./data/sampleScenarios";
import type { OfferShieldScanResult, ScannerInputData } from "./types";
import { CONFIG } from "./config";
import { ShieldCheck, Globe, Volume2, Lock } from "lucide-react";
import { speakMultilingualText } from "./utils/speechService";

export default function App() {
  // Clean Freebox-style Light Mode by default
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<OfferShieldScanResult | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string>("en");

  // Modal states
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [isExtensionOpen, setIsExtensionOpen] = useState<boolean>(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);

  // Run initial scan on first load
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const initialPayload = SAMPLE_SCENARIOS[0].data;
      const result = await analyzeOfferShield(initialPayload);
      if (isMounted) {
        setScanResult(result);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRunAnalysis = async (input: ScannerInputData) => {
    setIsAnalyzing(true);
    setTimeout(async () => {
      const result = await analyzeOfferShield(input);
      setScanResult(result);
      setIsAnalyzing(false);
    }, 350);
  };

  const handlePipedStateTransfer = (pipedResult: OfferShieldScanResult) => {
    setScanResult(pipedResult);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Sync dark and light-mode class to html and body for Chameleon system
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Get active translation text
  const getActiveTranslation = () => {
    if (!scanResult) return null;
    const p = scanResult.translation_payload;
    switch (activeLanguage) {
      case "te":
        return { name: "తెలుగు (Telugu)", text: p.telugu };
      case "ta":
        return { name: "தமிழ் (Tamil)", text: p.tamil };
      case "kn":
        return { name: "ಕನ್ನಡ (Kannada)", text: p.kannada };
      case "ml":
        return { name: "മലയാളം (Malayalam)", text: p.malayalam };
      case "hi":
        return { name: "हिन्दी (Hindi)", text: p.hindi };
      case "ur":
        return { name: "اردو (Urdu)", text: p.urdu };
      case "fr":
        return { name: "Français", text: p.french };
      case "de":
        return { name: "Deutsch", text: p.german };
      case "mr":
        return { name: "मराठी (Marathi)", text: p.marathi };
      default:
        return null;
    }
  };

  const activeTranslation = getActiveTranslation();

  return (
    <div
      id="offershield-app"
      className={`min-h-screen flex flex-col font-sans transition-colors duration-150 ${
        isDarkMode ? "bg-slate-950 text-slate-100" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      {/* Header Bar */}
      <Header
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onOpenExtension={() => setIsExtensionOpen(true)}
        onOpenDossier={() => setIsDossierOpen(true)}
        onOpenJson={() => setIsJsonModalOpen(true)}
        threatIndex={scanResult?.scam_threat_index}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5 overflow-hidden">
        {/* Subtle Engine Telemetry Bar - Hidden on mobile screens to de-clutter */}
        <div
          id="engine-telemetry-banner"
          className={`hidden sm:flex flex-wrap items-center justify-between p-2.5 px-3.5 rounded-md border text-xs font-mono ${
            isDarkMode
              ? "bg-slate-900 border-slate-800 text-slate-400"
              : "bg-white border-slate-200 text-slate-600 shadow-sm"
          }`}
        >
          <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="font-semibold">{CONFIG.SYSTEM.NAME} Engine v{CONFIG.SYSTEM.VERSION}</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-[11px] text-slate-500">In-Memory Volatile Security Analysis</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span>Low Risk: ≤{CONFIG.THRESHOLDS.LOW_RISK_MAX}%</span>
            <span>Moderate: {CONFIG.THRESHOLDS.LOW_RISK_MAX + 1}-{CONFIG.THRESHOLDS.MODERATE_RISK_MAX}%</span>
            <span className="text-red-600 font-bold">High Risk: ≥{CONFIG.THRESHOLDS.HIGH_RISK_MIN}%</span>
          </div>
        </div>

        {/* Input Ingestion Card (Text, Screenshot OCR, PDF, Headers) */}
        <ScannerInput
          onAnalyze={handleRunAnalysis}
          isAnalyzing={isAnalyzing}
          isDarkMode={isDarkMode}
        />

        {/* Regional Language Guidance Banner (when non-English is chosen) */}
        {activeTranslation && scanResult && (
          <div className="p-3.5 rounded-md bg-blue-50 border border-blue-200 text-xs flex items-center justify-between">
            <div className="flex items-start space-x-2">
              <Globe className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-blue-900 block mb-0.5">
                  {activeTranslation.name} Guidance:
                </span>
                <p className="text-blue-950 font-medium">"{activeTranslation.text}"</p>
              </div>
            </div>
            <button
              onClick={() => {
                speakMultilingualText(activeTranslation.text || "", activeLanguage);
              }}
              className="px-2.5 py-1 rounded bg-blue-600 text-white text-[11px] font-medium hover:bg-blue-700 flex items-center space-x-1 shrink-0 ml-3"
            >
              <Volume2 className="w-3 h-3" />
              <span>Read Aloud</span>
            </button>
          </div>
        )}

        {/* Scan Results View */}
        {scanResult && (
          <div className="space-y-5">
            {/* Row 1: Threat Index Dial & 3-Step Action Checklist Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              <div className="md:col-span-6">
                <ThreatIndexDial
                  result={scanResult}
                  isDarkMode={isDarkMode}
                  activeLanguage={activeLanguage}
                />
              </div>
              <div className="md:col-span-6">
                <ActionChecklistCard
                  result={scanResult}
                  onOpenDossier={() => setIsDossierOpen(true)}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>

            {/* Row 2: Interactive Mail Highlighter */}
            <InteractiveHighlighter
              rawText={scanResult.original_text}
              flags={scanResult.flagged_indicators}
              isDarkMode={isDarkMode}
            />

            {/* Row 3: Domain & Identity Forensics */}
            <DomainAnalysisCard
              domainAnalysis={scanResult.domain_analysis}
              atsCrossReference={scanResult.ats_cross_reference}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
      </main>

      {/* Floating Regional Translation Trigger in Lower Right (Compact 48px Icon) */}
      {scanResult && (
        <TranslationDrawer
          translations={scanResult.translation_payload}
          riskCategory={scanResult.risk_category}
          threatIndex={scanResult.scam_threat_index}
          isDarkMode={isDarkMode}
          activeLanguage={activeLanguage}
          onLanguageChange={setActiveLanguage}
        />
      )}

      {/* Forensic Cybercrime Dossier & Takedown Modal */}
      {scanResult && (
        <CybercrimeDossierModal
          result={scanResult}
          isOpen={isDossierOpen}
          onClose={() => setIsDossierOpen(false)}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Chrome Extension Simulator Modal */}
      {scanResult && (
        <ChromeExtensionSimulator
          result={scanResult}
          isOpen={isExtensionOpen}
          onClose={() => setIsExtensionOpen(false)}
          onPipedStateTransfer={handlePipedStateTransfer}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Standardized JSON Response Contract Modal (Schema IV.2) */}
      {scanResult && (
        <JsonContractModal
          result={scanResult}
          isOpen={isJsonModalOpen}
          onClose={() => setIsJsonModalOpen(false)}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Minimal Footer */}
      <footer
        id="app-footer"
        className={`border-t py-4 text-xs transition-colors ${
          isDarkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-500"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{CONFIG.SYSTEM.NAME}</span>
            <span>—</span>
            <span>Single-Page Security Scanner & Chrome Extension</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <button
              onClick={() => setIsExtensionOpen(true)}
              className="hover:text-blue-600 transition"
            >
              Gmail Extension
            </button>
            <button
              onClick={() => setIsDossierOpen(true)}
              className="hover:text-blue-600 transition"
            >
              Law Enforcement Dossier
            </button>
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="hover:text-blue-600 transition"
            >
              Schema IV.2 Spec
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

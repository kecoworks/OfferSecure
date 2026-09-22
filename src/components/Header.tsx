import React from "react";
import { ShieldCheck, ShieldAlert, Chrome, FileText, Code2, Sun, Moon } from "lucide-react";
import { CONFIG } from "../config";

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenExtension: () => void;
  onOpenDossier: () => void;
  onOpenJson: () => void;
  threatIndex?: number;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleTheme,
  onOpenExtension,
  onOpenDossier,
  onOpenJson,
  threatIndex,
}) => {
  return (
    <header
      id="header-nav"
      className={`border-b sticky top-0 z-40 transition-colors ${
        isDarkMode
          ? "bg-slate-900 border-slate-800 text-slate-100"
          : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Identity - Visible and High-Contrast in both Light and Dark Modes */}
        <div className="flex items-center space-x-2.5">
          {/* Brand icon badge with fixed #2563eb fill */}
          <div
            id="navbar-logo-badge"
            className="w-8 h-8 rounded-md bg-[#2563eb] text-white flex items-center justify-center shrink-0 shadow-sm"
          >
            {threatIndex !== undefined && threatIndex >= CONFIG.THRESHOLDS.HIGH_RISK_MIN ? (
              <ShieldAlert className="w-4 h-4 text-white" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-white" />
            )}
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span
              id="brand-title"
              className="navbar-logo-text brand-title text-base font-bold tracking-tight"
            >
              OfferShield
            </span>
            {/* Subtitle hidden on mobile screens (max-width: 640px) */}
            <span className="hidden sm:inline text-[11px] font-normal text-slate-500">
              Phishing & Offer Letter Verification
            </span>
          </div>
        </div>

        {/* Right side navigation: Secondary buttons hidden on mobile screens (<=640px), only essential theme toggle shown */}
        <div className="flex items-center space-x-2 text-xs">
          {/* Secondary buttons hidden on mobile */}
          <button
            id="btn-open-extension"
            onClick={onOpenExtension}
            className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition border ${
              isDarkMode
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <Chrome className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Chrome Extension</span>
          </button>

          <button
            id="btn-open-dossier"
            onClick={onOpenDossier}
            className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition border ${
              isDarkMode
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Legal Dossier</span>
          </button>

          <button
            id="btn-open-json-contract"
            onClick={onOpenJson}
            className={`hidden sm:flex p-1.5 rounded-md border text-slate-500 hover:text-slate-900 dark:hover:text-white transition ${
              isDarkMode ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-100"
            }`}
            title="Inspect Schema Contract (IV.2)"
          >
            <Code2 className="w-4 h-4" />
          </button>

          {/* Essential Theme Toggle Switch - Always visible on all screen sizes */}
          <button
            id="btn-toggle-theme"
            onClick={onToggleTheme}
            className={`p-1.5 rounded-md border text-slate-500 hover:text-slate-900 dark:hover:text-white transition ${
              isDarkMode ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-100"
            }`}
            title="Toggle theme"
            aria-label="Toggle dark/light theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};

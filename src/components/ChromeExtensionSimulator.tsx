import React, { useState } from "react";
import { Chrome, ShieldAlert, ShieldCheck, ArrowRight, X, Copy, Check, Lock } from "lucide-react";
import type { OfferShieldScanResult } from "../types";
import { CONFIG } from "../config";

interface ChromeExtensionSimulatorProps {
  result: OfferShieldScanResult;
  isOpen: boolean;
  onClose: () => void;
  onPipedStateTransfer: (result: OfferShieldScanResult) => void;
  isDarkMode: boolean;
}

export const ChromeExtensionSimulator: React.FC<ChromeExtensionSimulatorProps> = ({
  result,
  isOpen,
  onClose,
  onPipedStateTransfer,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<"simulator" | "manifest">("simulator");
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const score = result.scam_threat_index;
  const isHighRisk = score >= CONFIG.THRESHOLDS.HIGH_RISK_MIN;
  const isModRisk = score > CONFIG.THRESHOLDS.LOW_RISK_MAX && score < CONFIG.THRESHOLDS.HIGH_RISK_MIN;

  const handleFullInfoPiped = () => {
    onPipedStateTransfer(result);
    onClose();
  };

  const copyCode = (code: string, fileName: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  // Manifest V3 definitions for the Chrome Extension
  const manifestJson = `{
  "manifest_version": 3,
  "name": "OfferShield.io — Gmail Phishing & Scam Scanner",
  "version": "1.0.0",
  "description": "Protects job seekers and renters from fake offers and advance fee scams in Gmail via Scam Threat Index (0-100%).",
  "permissions": ["activeTab", "storage"],
  "host_permissions": ["https://mail.google.com/*"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "content_scripts": [
    {
      "matches": ["https://mail.google.com/*"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ]
}`;

  const contentScriptJs = `// OfferShield.io Gmail Content Script (manifest v3)
(() => {
  function extractGmailPayload() {
    const emailBody = document.querySelector(".a3s.aiL")?.innerText || "";
    const senderElem = document.querySelector("span[email]");
    const senderEmail = senderElem?.getAttribute("email") || "";
    const subject = document.querySelector("h2.hP")?.innerText || "";

    return {
      text: emailBody,
      sender_email: senderEmail,
      subject: subject,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
  }

  // Listen for popup inquiries
  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.action === "PARSE_CURRENT_EMAIL") {
      const payload = extractGmailPayload();
      chrome.storage.local.set({ offershield_current_scan: payload }, () => {
        sendResponse({ success: true, payload });
      });
      return true;
    }
  });
})();`;

  return (
    <div
      id="chrome-extension-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="chrome-extension-modal-card"
        className={`relative w-full max-w-2xl rounded-xl border shadow-xl transition-all overflow-hidden ${
          isDarkMode ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-300 text-slate-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Clean Chrome/Google aesthetic */}
        <div className={`flex items-center justify-between px-5 py-3.5 border-b ${
          isDarkMode ? "bg-slate-850 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <Chrome className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Chrome Extension Companion
              </h2>
              <p className="text-[11px] text-slate-500">Live Gmail In-Browser Scanner</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`flex p-0.5 rounded-lg border text-xs ${
              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"
            }`}>
              <button
                onClick={() => setActiveTab("simulator")}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  activeTab === "simulator"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                Extension Popup
              </button>
              <button
                onClick={() => setActiveTab("manifest")}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  activeTab === "manifest"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                Manifest V3
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: Live Chrome Extension Simulator */}
        {activeTab === "simulator" && (
          <div className={`p-6 flex flex-col items-center justify-center ${
            isDarkMode ? "bg-slate-950/50" : "bg-slate-100/70"
          }`}>
            {/* Simulated Chrome Browser Address Bar */}
            <div className={`w-full max-w-sm mb-4 px-3 py-2 rounded-lg border shadow-xs flex items-center justify-between text-xs ${
              isDarkMode ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-white border-slate-200 text-slate-700"
            }`}>
              <div className="flex items-center space-x-2 truncate">
                <div className="flex space-x-1 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                </div>
                <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-300 truncate">
                  <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">https://mail.google.com/mail/u/0/#inbox</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-blue-600 shrink-0 font-medium text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Protected</span>
              </div>
            </div>

            {/* Authentic Google Chrome Extension Popup (Clean White Card) */}
            <div
              id="extension-popup-container"
              style={{ width: "360px" }}
              className={`rounded-xl border shadow-lg p-4 space-y-3 font-sans transition-colors ${
                isDarkMode ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              {/* Extension Top Bar */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      OfferShield.io
                    </div>
                    <span className="text-[10px] text-slate-500 font-sans">Chrome Scanner</span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    isHighRisk
                      ? "bg-red-600 text-white"
                      : isModRisk
                      ? "bg-amber-400 text-slate-950 font-black"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {result.risk_category}
                </span>
              </div>

              {/* Threat Index Summary Box */}
              <div className={`p-3 rounded-lg border ${
                isDarkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
                      Threat Index
                    </span>
                    <div className="flex items-baseline space-x-1.5">
                      <span
                        className={`text-2xl font-black ${
                          isHighRisk ? "text-red-600" : isModRisk ? "text-amber-600" : "text-emerald-600"
                        }`}
                      >
                        {score}%
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {result.plain_language_guidance.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block font-medium">Sender Domain</span>
                    <span className="text-[11px] font-mono font-semibold text-blue-600 bg-blue-50 dark:bg-slate-800 dark:text-blue-400 px-1.5 py-0.5 rounded border border-blue-200 dark:border-slate-700 inline-block">
                      {result.domain_analysis.sender_domain}
                    </span>
                  </div>
                </div>
              </div>

              {/* Flagged Indicators List */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                  Detected Red Flags ({result.flagged_indicators.length}):
                </span>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {result.flagged_indicators.slice(0, 3).map((flag, idx) => (
                    <div
                      key={idx}
                      className={`detected-red-flags-item red-flag-card p-2 rounded-md border text-[11px] flex items-start space-x-1.5 ${
                        isDarkMode ? "bg-slate-950/40 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700"
                      }`}
                    >
                      <span
                        className={`text-[9px] font-bold px-1 py-0.2 rounded uppercase mt-0.5 shrink-0 ${
                          flag.severity === "CRITICAL"
                            ? "badge-critical bg-red-100 text-red-800 border border-red-200"
                            : "badge-red bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {flag.severity}
                      </span>
                      <span className="leading-tight text-slate-800 dark:text-slate-200">{flag.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Standard Clean Blue Action Button */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  id="btn-full-info-pipe"
                  onClick={handleFullInfoPiped}
                  className="w-full py-2 px-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition shadow-sm"
                >
                  <span>Full Incident Analysis & Forensic Sheet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] text-slate-500 text-center block mt-1.5">
                  Synchronizes scan data directly to web dashboard
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manifest V3 Source Files */}
        {activeTab === "manifest" && (
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            <p className="text-slate-600 dark:text-slate-400 font-sans text-xs">
              Install the extension directly in Google Chrome via <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">chrome://extensions</code> (Developer Mode &gt; Load unpacked).
            </p>

            {/* manifest.json */}
            <div className="rounded-lg border border-slate-800 p-4 space-y-2 bg-[#0f172a] text-[#f8fafc]">
              <div className="flex items-center justify-between border-b pb-2 border-slate-800">
                <span className="font-bold text-[#f8fafc] font-mono">manifest.json (v3)</span>
                <button
                  onClick={() => copyCode(manifestJson, "manifest")}
                  className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-blue-400"
                >
                  {copiedFile === "manifest" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFile === "manifest" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <pre className="text-[#f8fafc] text-[11px] overflow-x-auto whitespace-pre font-mono leading-relaxed">
                {manifestJson}
              </pre>
            </div>

            {/* content.js */}
            <div className="rounded-lg border border-slate-800 p-4 space-y-2 bg-[#0f172a] text-[#f8fafc]">
              <div className="flex items-center justify-between border-b pb-2 border-slate-800">
                <span className="font-bold text-[#f8fafc] font-mono">content.js (DOM Parser)</span>
                <button
                  onClick={() => copyCode(contentScriptJs, "content")}
                  className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-blue-400"
                >
                  {copiedFile === "content" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFile === "content" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <pre className="text-[#f8fafc] text-[11px] overflow-x-auto whitespace-pre font-mono leading-relaxed">
                {contentScriptJs}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

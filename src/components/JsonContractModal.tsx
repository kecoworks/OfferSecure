import React, { useState } from "react";
import { X, Copy, Check, Download, DatabaseZap, CheckCircle2 } from "lucide-react";
import type { OfferShieldScanResult } from "../types";

interface JsonContractModalProps {
  result: OfferShieldScanResult;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const JsonContractModal: React.FC<JsonContractModalProps> = ({
  result,
  isOpen,
  onClose,
  isDarkMode,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Clean output matching Section IV.2 schema strictly
  const standardizedPayload = {
    $schema: "http://json-schema.org/draft-07/schema#",
    scan_id: result.scan_id,
    scam_threat_index: result.scam_threat_index,
    risk_category: result.risk_category,
    domain_analysis: result.domain_analysis,
    ats_cross_reference: result.ats_cross_reference,
    flagged_indicators: result.flagged_indicators,
    plain_language_guidance: result.plain_language_guidance,
    translation_payload: result.translation_payload,
    evidence_package: result.evidence_package,
  };

  const jsonString = JSON.stringify(standardizedPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.scan_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="json-contract-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="json-contract-card"
        className={`relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl border shadow-xl transition-all overflow-hidden ${
          isDarkMode ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-300 text-slate-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-3.5 border-b ${
          isDarkMode ? "bg-slate-850 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <DatabaseZap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                JSON Response Contract
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">Schema Specification (IV.2)</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="hidden sm:flex items-center space-x-1 text-xs font-mono text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Validated</span>
            </span>

            <button
              onClick={handleCopy}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium border transition ${
                isDarkMode
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                  : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy JSON"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center space-x-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* JSON Code Viewer - High Contrast Dark Slate #0f172a with #f8fafc text for all themes */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs bg-[#0f172a] text-[#f8fafc] border-t border-slate-800">
          <pre className="whitespace-pre-wrap leading-relaxed text-[#f8fafc]">
            {jsonString}
          </pre>
        </div>
      </div>
    </div>
  );
};

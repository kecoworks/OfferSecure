import React, { useState } from "react";
import { ShieldAlert, ShieldCheck, AlertTriangle, Calculator, ChevronDown, ChevronUp, Info, Image as ImageIcon } from "lucide-react";
import type { OfferShieldScanResult } from "../types";
import { CONFIG } from "../config";

interface ThreatIndexDialProps {
  result: OfferShieldScanResult;
  isDarkMode: boolean;
  activeLanguage?: string;
}

export const ThreatIndexDial: React.FC<ThreatIndexDialProps> = ({
  result,
  isDarkMode,
  activeLanguage = "en",
}) => {
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const score = result.scam_threat_index;

  // Crisp status styling (Freebox utility style) with bold, solid risk badges
  let dialColor = "#16A34A"; // Low Risk Green
  let solidBadgeClass = "bg-emerald-600 text-white border-emerald-700 shadow-sm";
  let statusIcon = <ShieldCheck className="w-4 h-4 text-white" />;
  let pillBadgeClass = "bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800";

  if (score >= CONFIG.THRESHOLDS.HIGH_RISK_MIN) {
    dialColor = "#DC2626"; // High Risk Red
    solidBadgeClass = "bg-red-600 text-white border-red-700 shadow-sm";
    statusIcon = <ShieldAlert className="w-4 h-4 text-white" />;
    pillBadgeClass = "bg-red-50 text-red-950 border-red-300 dark:bg-red-950/40 dark:text-red-200 dark:border-red-800";
  } else if (score > CONFIG.THRESHOLDS.LOW_RISK_MAX) {
    dialColor = "#D97706"; // Moderate Risk Amber
    solidBadgeClass = "bg-amber-400 text-slate-950 border-amber-500 shadow-sm";
    statusIcon = <AlertTriangle className="w-4 h-4 text-slate-950" />;
    pillBadgeClass = "bg-amber-50 text-amber-950 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800";
  }

  // Dial mathematics
  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const arcPercentage = 0.75;
  const arcLength = circumference * arcPercentage;
  const progressOffset = arcLength - (score / 100) * arcLength;

  return (
    <div
      id="threat-index-card"
      className={`p-5 rounded-lg border shadow-sm transition-colors ${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
            Threat Evaluation
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Scam Threat Index</h2>
        </div>
        <div className="flex items-center space-x-2.5">
          {result.input_source === "screenshot_ocr" && (
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center space-x-1">
              <ImageIcon className="w-3 h-3" />
              <span>Screenshot OCR</span>
            </span>
          )}
          {/* Crisp score indicator alongside bold solid risk badge */}
          <span className="font-extrabold text-sm font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700">
            {score}%
          </span>
          <span
            id="risk-category-badge"
            className={`px-3 py-1 rounded text-xs font-black uppercase tracking-wider border ${solidBadgeClass}`}
          >
            {result.risk_category}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
        {/* SVG Dial Gauge - Clean sharp track without low-contrast shadows */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center relative py-1">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-225" viewBox="0 0 160 160">
              {/* Background Track with crisp contrast */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={isDarkMode ? "#334155" : "#e2e8f0"}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeLinecap="round"
              />
              {/* Active Score Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={dialColor}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Centered Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span id="threat-score-number" className="text-3xl font-black tracking-tight" style={{ color: dialColor }}>
                {score}
                <span className="text-lg font-normal text-slate-600 dark:text-slate-400 font-sans">%</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                Threat Level
              </span>
            </div>
          </div>

          <div
            id="plain-guidance-pill"
            className={`mt-1 flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-bold border ${pillBadgeClass}`}
          >
            <span className="shrink-0">{statusIcon}</span>
            <span>{result.plain_language_guidance.status}</span>
          </div>
        </div>

        {/* Evaluation Summary & Breakdown */}
        <div className="sm:col-span-7 space-y-3">
          <div
            id="evaluation-summary-box"
            className={`p-3.5 rounded-md border text-xs leading-relaxed ${
              isDarkMode ? "bg-slate-950/60 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          >
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {result.plain_language_guidance.summary}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-mono">
                  Incident ID: <span className="font-semibold text-slate-900 dark:text-slate-200">{result.scan_id}</span> • Time:{" "}
                  <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Telemetry Numbers */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`p-2.5 rounded-md border ${isDarkMode ? "bg-slate-950/40 border-slate-800" : "bg-white border-slate-200"}`}>
              <span className="text-slate-600 dark:text-slate-400 block text-[10px] mb-0.5 font-bold uppercase tracking-wider">Gross Risk Points</span>
              <span className="text-base font-black text-red-600">
                +{result.score_audit?.gross_risk_points ?? score}
              </span>
            </div>

            <div className={`p-2.5 rounded-md border ${isDarkMode ? "bg-slate-950/40 border-slate-800" : "bg-white border-slate-200"}`}>
              <span className="text-slate-600 dark:text-slate-400 block text-[10px] mb-0.5 font-bold uppercase tracking-wider">Trust Offsets</span>
              <span className="text-base font-black text-emerald-600">
                -{result.score_audit?.total_trust_offsets ?? 0}
              </span>
            </div>
          </div>

          {/* Formula Inspector Accordion */}
          <button
            id="btn-inspect-formula"
            onClick={() => setShowFormulaModal(!showFormulaModal)}
            className={`w-full py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-between border transition ${
              isDarkMode
                ? "bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700"
                : "bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300"
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <Calculator className="w-3.5 h-3.5 text-blue-600" />
              <span>Audit Formula & Calculation Breakdown</span>
            </div>
            {showFormulaModal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Formula Audit Details */}
      {showFormulaModal && result.score_audit && (
        <div
          id="score-formula-breakdown"
          className={`mt-3 p-3 rounded-md border text-xs space-y-2.5 ${
            isDarkMode ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
          }`}
        >
          <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Formula:</span>
            <code className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-mono text-[11px]">
              Threat Index = min(100, max(0, Σ Risk - Σ Trust))
            </code>
          </div>

          <div className="space-y-1">
            {result.score_audit.audit_trail.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1 px-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.type === "RISK" ? "bg-red-500" : "bg-emerald-500"
                    }`}
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.rule}</span>
                  <span className="text-slate-400">({item.description})</span>
                </div>
                <span
                  className={`font-mono font-bold ${
                    item.type === "RISK" ? "text-red-600" : "text-emerald-600"
                  }`}
                >
                  {item.type === "RISK" ? `+${item.points}` : `-${item.points}`}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-500">Calculated Score:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {score}% ({result.risk_category})
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

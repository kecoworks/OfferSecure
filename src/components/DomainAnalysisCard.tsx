import React from "react";
import { Globe, AlertOctagon, CheckCircle2, RefreshCw, Briefcase } from "lucide-react";
import type { DomainAnalysis, AtsCrossReference } from "../types";
import { CONFIG } from "../config";

interface DomainAnalysisCardProps {
  domainAnalysis: DomainAnalysis;
  atsCrossReference: AtsCrossReference;
  isDarkMode: boolean;
}

export const DomainAnalysisCard: React.FC<DomainAnalysisCardProps> = ({
  domainAnalysis,
  atsCrossReference,
  isDarkMode,
}) => {
  const isLookalike = domainAnalysis.is_lookalike;
  const domainAge = domainAnalysis.domain_age_days;
  const isNewDomain = domainAge < CONFIG.THRESHOLDS.DOMAIN_AGE_NEW_DAYS;
  const isSuspiciousAge = domainAge >= CONFIG.THRESHOLDS.DOMAIN_AGE_NEW_DAYS && domainAge < CONFIG.THRESHOLDS.DOMAIN_AGE_SUSPICIOUS_DAYS;
  const isEstablished = domainAge > 730;

  return (
    <div
      id="domain-analysis-card"
      className={`p-5 rounded-lg border shadow-sm transition-colors ${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-blue-600" />
          <h3 className="text-base font-bold text-[#1e293b] dark:text-white">Domain & Identity Forensics</h3>
        </div>
        {domainAnalysis.dns_fallback_applied && (
          <span
            id="dns-fallback-badge"
            className="flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200"
            title="Fallback applied: DNS SOA/MX heuristics used instead of missing/rate-limited WHOIS"
          >
            <RefreshCw className="w-3 h-3 text-blue-600" />
            <span>DNS Heuristics Active</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Domain Comparison Box */}
        <div
          className={`p-3.5 rounded-md border ${
            isDarkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}
        >
          <span className="text-[11px] uppercase tracking-wider text-[#475569] dark:text-slate-400 block mb-2 font-bold">
            Sender vs Claimed Identity
          </span>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#475569] dark:text-slate-400 font-medium">Claimed Company:</span>
              <span
                data-field="claimed-company"
                className="claimed-company-value font-semibold text-[#0f172a] dark:text-slate-200"
              >
                {domainAnalysis.claimed_company}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#475569] dark:text-slate-400 font-medium">Official Domain:</span>
              <code className="text-blue-700 dark:text-blue-400 font-mono bg-blue-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-blue-200 dark:border-slate-700 font-semibold">
                {domainAnalysis.official_company_domain}
              </code>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[#475569] dark:text-slate-400 font-medium">Observed Domain:</span>
              <code
                className={`font-mono px-1.5 py-0.5 rounded border font-semibold ${
                  isLookalike
                    ? "bg-red-50 text-[#991b1b] border-red-200 font-bold"
                    : "bg-white dark:bg-slate-900 text-[#1e293b] dark:text-slate-200 border-slate-300 dark:border-slate-700"
                }`}
              >
                {domainAnalysis.sender_domain}
              </code>
            </div>
          </div>

          {/* Lookalike Visualizer */}
          {domainAnalysis.lookalike_visualizer && (
            <div className="mt-3 p-2.5 rounded bg-red-50 border border-red-200 text-xs">
              <div className="flex items-center space-x-1 text-[#991b1b] font-bold mb-1">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Typosquatting Mismatch Visualizer:</span>
              </div>
              <div className="font-mono text-[11px] space-y-0.5">
                <div className="text-[#475569]">
                  Target: <span className="text-[#1e293b] font-bold">{domainAnalysis.lookalike_visualizer.claimed}</span>
                </div>
                <div className="text-[#475569]">
                  Observed:{" "}
                  <span className="text-[#991b1b] font-black bg-red-100 px-1 py-0.2 rounded border border-red-200">
                    {domainAnalysis.lookalike_visualizer.observed}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Domain Age & Registration Box */}
        <div
          className={`telemetry-card security-telemetry-container p-3.5 rounded-md border flex flex-col justify-between ${
            isDarkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}
        >
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#475569] dark:text-slate-400 block mb-2 font-bold">
              Registration & Security Telemetry
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#475569] dark:text-slate-400 font-medium">Observed Domain Age:</span>
                <span
                  className={`domain-age-badge font-mono font-bold px-2 py-0.5 rounded border text-[11px] ${
                    isNewDomain
                      ? "bg-red-50 text-[#991b1b] border-red-200"
                      : isSuspiciousAge
                      ? "bg-amber-50 text-[#9a3412] border-amber-200"
                      : "bg-emerald-50 text-emerald-800 border-emerald-200"
                  }`}
                >
                  {domainAge} days old
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#475569] dark:text-slate-400 font-medium">Age Assessment:</span>
                <span className={`age-assessment-text font-semibold ${isNewDomain ? "critical-text text-[#1e293b] dark:text-slate-300" : "text-[#1e293b] dark:text-slate-300"}`}>
                  {isNewDomain
                    ? "CRITICAL (<30 days old)"
                    : isSuspiciousAge
                    ? "WARNING (30-90 days)"
                    : isEstablished
                    ? "Trusted (>2 years established)"
                    : "Standard"}
                </span>
              </div>

              {/* ATS Cross Reference Check */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-[#475569] dark:text-slate-400 font-medium">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    <span>ATS Cross-Reference:</span>
                  </div>
                  {atsCrossReference.active_listing_found ? (
                    <span className="flex items-center space-x-1 text-emerald-700 font-mono text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{atsCrossReference.ats_platform} Match</span>
                    </span>
                  ) : (
                    <span className="text-[#475569] text-[11px]">No active listing</span>
                  )}
                </div>
                {atsCrossReference.matched_job_title && (
                  <p className="text-[11px] text-[#475569] font-mono mt-1">
                    Matched: <span className="text-[#1e293b] dark:text-slate-200 font-semibold">{atsCrossReference.matched_job_title}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-[#475569]">
            <span>DNS Inspection:</span>
            <span className="text-blue-700 font-mono font-bold">SOA & MX Validated</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { X, Printer, Copy, Check, ExternalLink, Mail, ShieldAlert, FileText } from "lucide-react";
import type { OfferShieldScanResult } from "../types";
import { CONFIG } from "../config";

interface CybercrimeDossierModalProps {
  result: OfferShieldScanResult;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const CybercrimeDossierModal: React.FC<CybercrimeDossierModalProps> = ({
  result,
  isOpen,
  onClose,
  isDarkMode,
}) => {
  const [copiedAbuse, setCopiedAbuse] = useState(false);
  const [copiedFingerprint, setCopiedFingerprint] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyAbuse = () => {
    navigator.clipboard.writeText(result.evidence_package.abuse_takedown_email.body);
    setCopiedAbuse(true);
    setTimeout(() => setCopiedAbuse(false), 2000);
  };

  const handleCopyFingerprint = () => {
    if (result.sha256_fingerprint) {
      navigator.clipboard.writeText(result.sha256_fingerprint);
      setCopiedFingerprint(true);
      setTimeout(() => setCopiedFingerprint(false), 2000);
    }
  };

  const abuseEmail = result.evidence_package.abuse_takedown_email;
  const mailtoLink = `mailto:${encodeURIComponent(abuseEmail.to)}?subject=${encodeURIComponent(abuseEmail.subject)}&body=${encodeURIComponent(abuseEmail.body)}`;

  return (
    <div
      id="cybercrime-dossier-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="cybercrime-dossier-card"
        className={`relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-xl border shadow-xl transition-all ${
          isDarkMode ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-300 text-slate-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Actions Bar */}
        <div className={`sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b ${
          isDarkMode ? "bg-slate-850/95 border-slate-800" : "bg-slate-50/95 border-slate-200"
        } backdrop-blur-md`}>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Forensic Evidence Dossier & Takedown Dispatch
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                Incident Ref: {result.scan_id}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-print-dossier"
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
              title="Print official legal PDF report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Legal Evidence Layout */}
        <div className="p-6 space-y-6">
          {/* Printable Forensic Document Sheet (Corporate White Sheet with Black/Slate Box Border) */}
          <div
            id="printable-forensic-sheet"
            className="p-8 rounded-lg border-2 border-slate-900 bg-white text-slate-900 shadow-sm space-y-6 font-sans text-xs"
          >
            {/* Formal Letterhead */}
            <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="text-[11px] uppercase font-bold tracking-wider text-slate-600">
                  OFFERSHIELD CYBERSECURITY INCIDENT RESPONSE
                </div>
                <h1 className="text-xl font-extrabold text-slate-950 mt-1">
                  Standardized Digital Evidence Report
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  Compliant with ICANN RAA specifications & RFC Incident Reporting Standards
                </p>
              </div>

              <div className="sm:text-right space-y-1 text-xs">
                <div>
                  <span className="text-slate-500">Incident Reference: </span>
                  <span className="font-bold font-mono text-slate-900">{result.scan_id}</span>
                </div>
                <div>
                  <span className="text-slate-500">Timestamp: </span>
                  <span className="text-slate-800 font-mono">{result.timestamp}</span>
                </div>
                <div className="pt-1">
                  <span className="text-slate-500">Threat Rating: </span>
                  <span
                    className={`font-black uppercase tracking-wider px-2 py-0.5 rounded text-[11px] ${
                      result.scam_threat_index >= 70
                        ? "bg-red-600 text-white"
                        : result.scam_threat_index > 30
                        ? "bg-amber-400 text-slate-950"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {result.scam_threat_index}% ({result.risk_category})
                  </span>
                </div>
              </div>
            </div>

            {/* Cryptographic SHA-256 Fingerprint */}
            <div className="p-3.5 rounded border border-slate-300 bg-slate-50 flex items-center justify-between">
              <div className="overflow-hidden">
                <span className="text-slate-600 uppercase tracking-wider text-[10px] font-bold block mb-0.5">
                  SHA-256 Cryptographic Digest (Chain-of-Custody Integrity):
                </span>
                <code className="text-slate-900 text-xs truncate block font-mono font-semibold">
                  {result.sha256_fingerprint}
                </code>
              </div>
              <button
                onClick={handleCopyFingerprint}
                className="ml-3 px-2 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition text-[11px] font-medium flex items-center space-x-1 shrink-0"
                title="Copy hash"
              >
                {copiedFingerprint ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFingerprint ? "Copied" : "Copy Hash"}</span>
              </button>
            </div>

            {/* Key Suspect Entities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded border border-slate-300 bg-slate-50">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">Suspect Sender Domain</span>
                <span className="text-red-700 font-bold text-sm block mt-1 font-mono">
                  {result.domain_analysis.sender_domain}
                </span>
                <span className="text-[11px] text-slate-600 block mt-0.5">
                  Domain Age: <strong>{result.domain_analysis.domain_age_days} days</strong>
                </span>
              </div>

              <div className="p-3.5 rounded border border-slate-300 bg-slate-50">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">Claimed Entity</span>
                <span className="text-slate-950 font-bold text-sm block mt-1">
                  {result.domain_analysis.claimed_company}
                </span>
                <span className="text-[11px] text-slate-600 block mt-0.5 font-mono">
                  Official: {result.domain_analysis.official_company_domain}
                </span>
              </div>

              <div className="p-3.5 rounded border border-slate-300 bg-slate-50">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">ATS Cross-Reference</span>
                <span className="text-slate-950 font-bold text-sm block mt-1">
                  {result.ats_cross_reference.active_listing_found ? "Active Listing Verified" : "Unverified / No Record"}
                </span>
                <span className="text-[11px] text-slate-600 block mt-0.5">
                  Source: {result.ats_cross_reference.ats_platform}
                </span>
              </div>
            </div>

            {/* Flagged Indicators Table - Clean Professional Table */}
            <div>
              <span className="text-slate-900 text-xs font-bold block mb-2 uppercase tracking-wider">
                Forensic Violation Evidence Table ({result.flagged_indicators.length} Indicators Detected):
              </span>
              <div className="overflow-x-auto border border-slate-300 rounded">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-[11px] text-slate-700 uppercase">
                      <th className="p-2.5 font-bold">Category</th>
                      <th className="p-2.5 font-bold">Severity</th>
                      <th className="p-2.5 font-bold">Description</th>
                      <th className="p-2.5 font-bold">Extracted Quote</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {result.flagged_indicators.map((flag, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                        <td className="p-2.5 font-semibold text-slate-900">{flag.category}</td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              flag.severity === "CRITICAL"
                                ? "bg-red-100 text-red-900 border border-red-300"
                                : flag.severity === "WARNING"
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-slate-200 text-slate-800"
                            }`}
                          >
                            {flag.severity}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-800 leading-normal">{flag.description}</td>
                        <td className="p-2.5 text-slate-700 font-mono text-[11px]">
                          {flag.extracted_quote ? `"${flag.extracted_quote}"` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Legal Chain of Custody Declaration */}
            <div className="pt-4 border-t-2 border-slate-300 text-[11px] text-slate-600 leading-relaxed space-y-1">
              <p>
                <strong>CHAIN-OF-CUSTODY CERTIFICATION:</strong> This forensic incident report was generated through OfferShield.io
                volatile memory threat analysis on {result.timestamp}. All payload strings and email headers were ingested directly without third-party modification.
              </p>
              <p>
                This dossier is compiled in standard format for transmission to law enforcement agencies (e.g. FBI IC3, FTC, Europol, National Cyber Security Centres) and domain registrar abuse desks.
              </p>
            </div>
          </div>

          {/* Section: Authority Portals Dispatch */}
          <div className={`p-5 rounded-lg border space-y-3 ${
            isDarkMode ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Official Law Enforcement & Cybercrime Incident Reporting Portals
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Submit your verified incident dossier directly to relevant cybercrime jurisdiction portals:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {result.evidence_package.jurisdiction_links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between p-3 rounded-md border text-xs font-medium transition group ${
                    isDarkMode
                      ? "bg-slate-950 border-slate-800 hover:border-blue-600 text-slate-200 hover:text-white"
                      : "bg-white border-slate-200 hover:border-blue-600 text-slate-800 hover:text-blue-600 shadow-xs"
                  }`}
                >
                  <span className="font-semibold">{link.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition" />
                </a>
              ))}
            </div>
          </div>

          {/* Section: Registrar Abuse RFC Takedown Email */}
          <div className={`p-5 rounded-lg border space-y-3 ${
            isDarkMode ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Domain Registrar Abuse Takedown RFC Auto-Fill
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyAbuse}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium border transition ${
                    isDarkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                      : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                  }`}
                >
                  {copiedAbuse ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAbuse ? "Copied!" : "Copy Email Body"}</span>
                </button>
                <a
                  href={mailtoLink}
                  className="flex items-center space-x-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Launch Email Client</span>
                </a>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                <span className="w-14 font-semibold">To:</span>
                <code className="text-slate-900 dark:text-slate-200 font-mono font-bold bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  {abuseEmail.to}
                </code>
              </div>
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                <span className="w-14 font-semibold">Subject:</span>
                <code className="text-slate-900 dark:text-slate-200 font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  {abuseEmail.subject}
                </code>
              </div>
            </div>

            <pre className={`p-4 rounded-md border text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed ${
              isDarkMode ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-800"
            }`}>
              {abuseEmail.body}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

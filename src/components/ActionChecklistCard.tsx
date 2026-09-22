import React, { useState } from "react";
import { CheckSquare, Square, ShieldBan, PhoneCall, FileCheck2, ArrowRight } from "lucide-react";
import type { OfferShieldScanResult } from "../types";

interface ActionChecklistCardProps {
  result: OfferShieldScanResult;
  onOpenDossier: () => void;
  isDarkMode: boolean;
}

export const ActionChecklistCard: React.FC<ActionChecklistCardProps> = ({
  result,
  onOpenDossier,
  isDarkMode,
}) => {
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({
    halt: false,
    verify: false,
    evidence: false,
  });

  const toggleStep = (step: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [step]: !prev[step],
    }));
  };

  const steps = [
    {
      id: "halt",
      title: "Step 1: Halt Payments & Protect Accounts",
      icon: <ShieldBan className="w-4 h-4 text-red-600" />,
      actionText: "Do not send advance funds, cash checks, or share personal banking credentials under any circumstance.",
      highlight: "Never deposit checks from prospective employers to purchase home office equipment.",
      badge: "Immediate Action",
      badgeColor: "bg-red-100 text-[#991b1b] border-red-300 font-bold",
    },
    {
      id: "verify",
      title: "Step 2: Out-of-Band Corporate Verification",
      icon: <PhoneCall className="w-4 h-4 text-amber-600" />,
      actionText: "Confirm recruiter identity through official corporate telephone directories or listed verified LinkedIn pages.",
      highlight: `Verify directly with ${domainAnalysisCompany(result)} through official domain (${domainAnalysisDomain(result)}).`,
      badge: "Verification",
      badgeColor: "bg-amber-100 text-[#9a3412] border-amber-300 font-bold",
    },
    {
      id: "evidence",
      title: "Step 3: Forensic Evidence & Registrar Takedown",
      icon: <FileCheck2 className="w-4 h-4 text-blue-600" />,
      actionText: "Download the 1-click forensic PDF, block sender headers, and dispatch abuse reports to the domain registrar.",
      highlight: "Pre-compiled RFC-compliant dossier and authority portal dispatches.",
      badge: "Takedown",
      badgeColor: "bg-blue-100 text-[#1e40af] border-blue-300 font-bold",
      cta: {
        label: "Open Forensic Dossier & Abuse Dispatch",
        onClick: onOpenDossier,
      },
    },
  ];

  function domainAnalysisCompany(res: OfferShieldScanResult) {
    return res.domain_analysis?.claimed_company || "the company";
  }

  function domainAnalysisDomain(res: OfferShieldScanResult) {
    return res.domain_analysis?.official_company_domain || "official channels";
  }

  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  return (
    <div
      id="action-checklist-card"
      className={`p-5 rounded-lg border shadow-sm transition-colors ${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#475569] dark:text-slate-400 font-bold block">
            Response Protocol
          </span>
          <h3 className="text-base font-bold text-[#1e293b] dark:text-white">
            3-Step Protective Action Checklist
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#475569] dark:text-slate-400 font-medium">
            Completed: <span className="font-bold text-blue-600">{completedCount}/3</span>
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {steps.map((step) => {
          const isDone = completedSteps[step.id];

          return (
            <div
              key={step.id}
              className={`p-3 rounded-md border transition-all ${
                isDone
                  ? isDarkMode
                    ? "bg-slate-950/40 border-slate-800 opacity-70"
                    : "bg-slate-50 border-slate-200 opacity-70"
                  : isDarkMode
                  ? "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  onClick={() => toggleStep(step.id)}
                  className="mt-0.5 text-slate-400 hover:text-blue-600 transition"
                  aria-label={`Mark ${step.title} complete`}
                >
                  {isDone ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-xs font-semibold ${isDone ? "line-through text-slate-400" : "text-[#1e293b] dark:text-slate-100"}`}>
                      {step.title}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${step.badgeColor}`}>
                      {step.badge}
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDone ? "text-slate-400" : "text-[#475569] dark:text-slate-300"}`}>
                    {step.actionText}
                  </p>

                  <p className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                    Guidance: {step.highlight}
                  </p>

                  {step.cta && (
                    <div className="pt-1.5">
                      <button
                        onClick={step.cta.onClick}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
                      >
                        <span>{step.cta.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

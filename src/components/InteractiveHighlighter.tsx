import React, { useState } from "react";
import { AlertCircle, Eye, EyeOff, Copy, Check } from "lucide-react";
import { HIGHLIGHT_CATEGORIES } from "../config";
import type { FlaggedIndicator } from "../types";

interface InteractiveHighlighterProps {
  rawText: string;
  flags: FlaggedIndicator[];
  isDarkMode: boolean;
}

interface HighlightSpan {
  text: string;
  category?: "PAYMENT" | "CHAT_ROUTING" | "URGENCY";
  matchKey?: string;
  description?: string;
}

export const InteractiveHighlighter: React.FC<InteractiveHighlighterProps> = ({
  rawText,
  flags,
  isDarkMode,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isRawMode, setIsRawMode] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parseHighlightedSpans = (text: string): HighlightSpan[] => {
    if (!text) return [];

    const paymentRegex = HIGHLIGHT_CATEGORIES.PAYMENT_ADVANCE_FEE.regex;
    const chatRegex = HIGHLIGHT_CATEGORIES.CHAT_ROUTING.regex;
    const urgencyRegex = HIGHLIGHT_CATEGORIES.URGENCY_TACTIC.regex;

    paymentRegex.lastIndex = 0;
    chatRegex.lastIndex = 0;
    urgencyRegex.lastIndex = 0;

    type MatchRange = { start: number; end: number; category: "PAYMENT" | "CHAT_ROUTING" | "URGENCY"; text: string; desc: string };
    const matches: MatchRange[] = [];

    let m: RegExpExecArray | null;
    while ((m = paymentRegex.exec(text)) !== null) {
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        category: "PAYMENT",
        text: m[0],
        desc: "Advance fee / equipment payment trigger or check deposit demand",
      });
    }

    while ((m = chatRegex.exec(text)) !== null) {
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        category: "CHAT_ROUTING",
        text: m[0],
        desc: "Recruiter diverting conversation to unverified encrypted messenger (Telegram/WhatsApp)",
      });
    }

    while ((m = urgencyRegex.exec(text)) !== null) {
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        category: "URGENCY",
        text: m[0],
        desc: "Artificial urgency pressure tactic to force rash compliance",
      });
    }

    matches.sort((a, b) => a.start - b.start);

    const filteredMatches: MatchRange[] = [];
    let lastEnd = 0;
    for (const match of matches) {
      if (match.start >= lastEnd) {
        filteredMatches.push(match);
        lastEnd = match.end;
      }
    }

    const spans: HighlightSpan[] = [];
    let currentPos = 0;

    for (const match of filteredMatches) {
      if (match.start > currentPos) {
        spans.push({
          text: text.substring(currentPos, match.start),
        });
      }
      spans.push({
        text: text.substring(match.start, match.end),
        category: match.category,
        matchKey: `${match.category}-${match.start}`,
        description: match.desc,
      });
      currentPos = match.end;
    }

    if (currentPos < text.length) {
      spans.push({
        text: text.substring(currentPos),
      });
    }

    return spans;
  };

  const spans = parseHighlightedSpans(rawText);

  return (
    <div
      id="interactive-highlighter-container"
      className={`p-5 rounded-lg border shadow-sm transition-colors ${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
            Forensic Text Inspector
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Interactive Mail Highlighter</h3>
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            <span>Advance Fee / Check</span>
          </span>
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            <span>Chat Routing</span>
          </span>
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-600"></span>
            <span>Urgency</span>
          </span>

          <div className="flex items-center space-x-1 pl-1">
            <button
              onClick={() => setIsRawMode(!isRawMode)}
              className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
              title={isRawMode ? "Show Highlighted Text" : "Show Plain Text"}
            >
              {isRawMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleCopy}
              className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
              title="Copy text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Rendered Text Body */}
      <div className="mt-3">
        {isRawMode ? (
          <pre
            id="raw-text-view"
            className={`p-3.5 rounded-md font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto ${
              isDarkMode ? "bg-slate-950 text-slate-300 border border-slate-800" : "bg-slate-50 text-slate-800 border border-slate-200"
            }`}
          >
            {rawText}
          </pre>
        ) : (
          <div
            id="highlighted-mail-view"
            className={`p-4 rounded-md text-xs sm:text-sm leading-relaxed max-h-80 overflow-y-auto whitespace-pre-line font-sans ${
              isDarkMode ? "bg-slate-950/80 text-slate-200 border border-slate-800" : "bg-slate-50 text-slate-800 border border-slate-200"
            }`}
          >
            {spans.map((span, index) => {
              if (!span.category) {
                return <span key={index}>{span.text}</span>;
              }

              let highlightClass = "";

              if (span.category === "PAYMENT") {
                highlightClass = "bg-red-100 text-red-900 font-semibold px-1 py-0.5 rounded cursor-pointer border-b-2 border-red-500";
              } else if (span.category === "CHAT_ROUTING") {
                highlightClass = "bg-amber-100 text-amber-900 font-semibold px-1 py-0.5 rounded cursor-pointer border-b-2 border-amber-500";
              } else if (span.category === "URGENCY") {
                highlightClass = "bg-yellow-100 text-yellow-900 font-semibold px-1 py-0.5 rounded cursor-pointer border-b-2 border-yellow-500";
              }

              return (
                <span
                  key={index}
                  className={`relative inline-block transition-colors ${highlightClass}`}
                  onClick={() => setActiveTooltip(activeTooltip === span.matchKey ? null : (span.matchKey || null))}
                  title={span.description}
                >
                  {span.text}

                  {activeTooltip === span.matchKey && (
                    <span
                      className={`absolute z-30 bottom-full left-0 mb-1.5 w-60 p-2.5 rounded-md text-xs font-normal shadow-lg border ${
                        isDarkMode ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-white border-slate-300 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center space-x-1 font-bold text-[10px] uppercase mb-1 text-red-600">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{span.category.replace("_", " ")} DETECTED</span>
                      </div>
                      <p className="text-[11px] leading-tight">{span.description}</p>
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Flagged Indicators Chips */}
      {flags.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 block mb-1.5 font-semibold">
            Identified Threat Vectors ({flags.length}):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {flags.map((flag, idx) => {
              let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
              let badgeTagClass = "";
              if (flag.severity === "CRITICAL") {
                badgeStyle = "bg-red-50 text-red-700 border-red-200";
                badgeTagClass = "badge-critical";
              } else if (flag.severity === "WARNING") {
                badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
                badgeTagClass = "badge-red";
              } else if (flag.severity === "CAUTION") {
                badgeStyle = "bg-yellow-50 text-yellow-700 border-yellow-200";
              }

              return (
                <div
                  key={idx}
                  className={`detected-red-flags-item red-flag-card text-xs px-2 py-0.5 rounded border flex items-center space-x-1.5 ${badgeStyle}`}
                >
                  <span className={`font-bold text-[10px] uppercase px-1 py-0.2 rounded ${badgeTagClass}`}>[{flag.severity}]</span>
                  <span className="font-medium">{flag.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * ==============================================================================
 * OFFERSHIELD.IO DYNAMIC CONFIGURATION VARIABLES
 * ==============================================================================
 * Hardcoded weights, threshold brackets, and regex definitions remain isolated
 * in this dedicated configuration file, completely separate from evaluation logic.
 */

export const CONFIG = {
  SYSTEM: {
    NAME: "OfferShield.io",
    DOMAIN: "offershield.io",
    VERSION: "1.0.0",
    THEME: "clean-minimal-light",
    PRIVACY_NOTICE: "Processed in volatile memory, never persisted.",
  },

  THRESHOLDS: {
    LOW_RISK_MAX: 30,
    MODERATE_RISK_MAX: 69,
    HIGH_RISK_MIN: 70,
    DOMAIN_AGE_NEW_DAYS: 30,
    DOMAIN_AGE_SUSPICIOUS_DAYS: 90,
  },

  RISK_WEIGHTS: {
    DOMAIN_AGE_UNDER_30_DAYS: 35,
    DOMAIN_AGE_30_TO_90_DAYS: 20,
    TYPOSQUATTING_OR_HOMOGRAPH: 30,
    FREE_EMAIL_FOR_ENTERPRISE_CLAIM: 25,
    ADVANCE_FEE_PAYMENT_DEMAND: 35,
    UNCONVENTIONAL_PAYMENT_RAILS: 25,
    ROUTING_TO_ENCRYPTED_CHAT: 20,
    INSTANT_HIRE_NO_FORMAL_INTERVIEW: 20,
    ARTIFICIAL_URGENCY_PRESSURE: 10,
  },

  TRUST_OFFSETS: {
    VERIFIED_ATS_ACTIVE_JOB_MATCH: 30,
    AUTHENTICATED_SPF_DKIM_DMARC_PASS: 15,
    DOMAIN_AGE_OVER_2_YEARS: 10,
  },

  TRANSLATION: {
    DEFAULT_LANGUAGE: "en",
    SUPPORTED_LANGUAGES: [
      { code: "te", name: "Telugu", nativeName: "తెలుగు" },
      { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
      { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
      { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
      { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
      { code: "ur", name: "Urdu", nativeName: "اردو" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "de", name: "German", nativeName: "Deutsch" },
      { code: "mr", name: "Marathi", nativeName: "मराठी" },
    ],
  },

  AUTHORITY_PORTALS: {
    INDIA: "https://cybercrime.gov.in",
    USA: "https://www.ic3.gov",
    UK: "https://www.actionfraud.police.uk",
    GLOBAL_SAFE_BROWSING: "https://safebrowsing.google.com/safebrowsing/report_phish/",
  },
} as const;

export const KNOWN_ENTERPRISES: Record<string, { domain: string; ats: 'Greenhouse' | 'Lever' | 'Workday' | 'Other' }> = {
  google: { domain: "google.com", ats: "Other" },
  alphabet: { domain: "abc.xyz", ats: "Other" },
  meta: { domain: "meta.com", ats: "Other" },
  facebook: { domain: "meta.com", ats: "Other" },
  apple: { domain: "apple.com", ats: "Other" },
  amazon: { domain: "amazon.com", ats: "Other" },
  microsoft: { domain: "microsoft.com", ats: "Other" },
  netflix: { domain: "netflix.com", ats: "Other" },
  stripe: { domain: "stripe.com", ats: "Greenhouse" },
  airbnb: { domain: "airbnb.com", ats: "Greenhouse" },
  uber: { domain: "uber.com", ats: "Other" },
  spotify: { domain: "spotify.com", ats: "Greenhouse" },
  slack: { domain: "slack.com", ats: "Workday" },
  salesforce: { domain: "salesforce.com", ats: "Workday" },
  adobe: { domain: "adobe.com", ats: "Workday" },
  goldman: { domain: "goldmansachs.com", ats: "Other" },
  deloitte: { domain: "deloitte.com", ats: "Other" },
  ey: { domain: "ey.com", ats: "Other" },
  mckinsey: { domain: "mckinsey.com", ats: "Other" },
  zillow: { domain: "zillow.com", ats: "Workday" },
  apartments: { domain: "apartments.com", ats: "Other" },
};

export const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "ymail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "aol.com",
  "mail.com",
  "proton.me",
  "protonmail.com",
  "zoho.com",
  "icloud.com",
  "gmx.com",
  "yandex.com",
];

// Highlight regex categories for the interactive text highlighter
export const HIGHLIGHT_CATEGORIES = {
  PAYMENT_ADVANCE_FEE: {
    color: "red",
    bgClass: "bg-rose-500/20 text-rose-300 border-b border-rose-500",
    badgeClass: "bg-rose-500/10 text-rose-400 border border-rose-500/30",
    label: "Advance Fee / Check Demand",
    regex: /(?:equipment\s+(?:check|deposit|fee|costs?|fund)|cashier(?:'s)?\s+check|purchase\s+(?:your\s+own\s+)?(?:laptop|equipment|home\s+office|supplies|hardware)|training\s+(?:fee|deposit|cost)|security\s+deposit\s+(?:before\s+viewing|prior\s+to\s+lease)|courier\s+(?:fee|charge)|refundable\s+(?:insurance|security\s+deposit|equipment\s+fee)|send\s+(?:us\s+)?\$?\d[\d,]*(?:\.\d{2})?|wire\s+transfer|zelle|venmo|cash\s*app|crypto(?:currency)?|bitcoin|usdt|apple\s+gift\s+card|amazon\s+gift\s+card|target\s+gift\s+card|western\s+union|moneygram)/gi,
  },
  CHAT_ROUTING: {
    color: "orange",
    bgClass: "bg-amber-500/20 text-amber-300 border-b border-amber-500",
    badgeClass: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
    label: "Encrypted / External Chat Routing",
    regex: /(?:telegram(?:\.me|\.org|\s+app|\s+messenger|\s+channel|\s+handle)?|@\w+_hr|whatsapp(?:\s+message|\s+number|\s+group)?|\+\d{1,3}[\s-]?\d{3,4}[\s-]?\d{3,4}|signal\s+(?:app|messenger)|skype\s+interview|download\s+telegram|contact\s+(?:our\s+hiring\s+manager|hr\s+director)\s+on\s+telegram)/gi,
  },
  URGENCY_TACTIC: {
    color: "yellow",
    bgClass: "bg-yellow-500/20 text-yellow-300 border-b border-yellow-500",
    badgeClass: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
    label: "Artificial Urgency Pressure",
    regex: /(?:within\s+(?:12|24|48)\s+hours|confirm\s+within\s+\d+\s+hours|offer\s+(?:will\s+be\s+)?void(?:ed)?|immediate\s+(?:acceptance|confirmation|response\s+required)|spots?\s+(?:are\s+)?strictly\s+limited|offer\s+expires\s+today|act\s+immediately|must\s+reply\s+by\s+end\s+of\s+day)/gi,
  },
} as const;

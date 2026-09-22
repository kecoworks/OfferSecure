export type RiskCategory = 'Low Risk' | 'Moderate Risk' | 'High Risk';
export type GuidanceStatus = 'Safe to proceed' | 'Exercise caution' | 'Block & report';
export type IndicatorCategory = 'DOMAIN' | 'PAYMENT' | 'CHAT_ROUTING' | 'URGENCY' | 'PROCESS';
export type IndicatorSeverity = 'CRITICAL' | 'WARNING' | 'CAUTION';
export type AtsPlatform = 'Greenhouse' | 'Lever' | 'Workday' | 'None' | 'Other';
export type InputSource = 'text_copy' | 'email_header' | 'document_pdf' | 'target_url' | 'screenshot_ocr';

export interface OcrMetadata {
  processed_image: boolean;
  extracted_text_length: number;
  image_name?: string;
  confidence?: number;
}

export interface LookalikeVisualizer {
  claimed: string;
  observed: string;
  mismatch_indices: number[];
}

export interface DomainAnalysis {
  sender_domain: string;
  claimed_company: string;
  official_company_domain: string;
  is_lookalike: boolean;
  domain_age_days: number;
  dns_fallback_applied: boolean;
  lookalike_visualizer?: LookalikeVisualizer;
}

export interface AtsCrossReference {
  checked: boolean;
  ats_platform: AtsPlatform;
  active_listing_found: boolean;
  matched_job_title: string | null;
}

export interface FlaggedIndicator {
  category: IndicatorCategory;
  severity: IndicatorSeverity;
  extracted_quote: string;
  description: string;
}

export interface PlainLanguageGuidance {
  status: GuidanceStatus;
  summary: string;
}

export interface TranslationPayload {
  telugu?: string;
  tamil?: string;
  kannada?: string;
  malayalam?: string;
  hindi?: string;
  urdu?: string;
  french?: string;
  german?: string;
  marathi?: string;
  [key: string]: string | undefined;
}

export interface JurisdictionLink {
  name: string;
  url: string;
}

export interface AbuseTakedownEmail {
  to: string;
  subject: string;
  body: string;
}

export interface EvidencePackage {
  jurisdiction_links: JurisdictionLink[];
  abuse_takedown_email: AbuseTakedownEmail;
}

export interface ScoreAuditItem {
  type: 'RISK' | 'TRUST_OFFSET';
  rule: string;
  points: number;
  description: string;
}

export interface OfferShieldScanResult {
  scan_id: string;
  timestamp: string;
  input_source: InputSource;
  scam_threat_index: number;
  risk_category: RiskCategory;
  ocr_metadata?: OcrMetadata;
  domain_analysis: DomainAnalysis;
  ats_cross_reference: AtsCrossReference;
  flagged_indicators: FlaggedIndicator[];
  plain_language_guidance: PlainLanguageGuidance;
  translation_payload: TranslationPayload;
  evidence_package: EvidencePackage;
  // Audit calculation telemetry
  score_audit?: {
    gross_risk_points: number;
    total_trust_offsets: number;
    audit_trail: ScoreAuditItem[];
  };
  sha256_fingerprint?: string;
  original_text: string;
}

export interface ScannerInputData {
  text: string;
  input_source?: InputSource;
  ocr_metadata?: OcrMetadata;
  claimed_company?: string;
  sender_domain?: string;
  sender_email?: string;
  raw_headers?: string;
  target_url?: string;
  job_title?: string;
  document_name?: string;
  screenshot_data_url?: string;
}

import type { ScannerInputData } from "../types";

export interface ScenarioPreset {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  expectedThreat: string;
  data: ScannerInputData;
}

export const SAMPLE_SCENARIOS: ScenarioPreset[] = [
  {
    id: "meta-equipment-scam",
    title: "Fake Meta Recruiter Equipment Fee Scam",
    subtitle: "Lookalike domain, fake cashier's check equipment purchase, Telegram routing",
    badge: "High Risk (95%)",
    badgeColor: "rose",
    expectedThreat: "High Risk",
    data: {
      claimed_company: "Meta",
      sender_domain: "meta-recruiting-ops.xyz",
      sender_email: "recruiting-coordinator@meta-recruiting-ops.xyz",
      job_title: "Remote Data Analytics Specialist",
      text: `Dear Candidate,

Congratulations! Following an evaluation of your resume by our senior technical board, we are thrilled to extend an immediate formal offer of employment for the position of Remote Data Analytics Specialist at Meta Platforms Inc.

Your compensation package will be $68.50 per hour ($142,000 annually), with comprehensive medical insurance and 401(k) matching.

NEXT STEPS & HOME OFFICE SETUP:
To facilitate your remote workspace immediately, our finance department will issue an electronic cashier's check of $4,850.00 to your personal bank account. You are required to deposit this check and immediately purchase your specialized Apple MacBook Pro and encrypted VPN hardware from our certified vendor.

IMPORTANT: Please transfer the vendor balance of $3,900.00 via Zelle or wire transfer within 24 hours of receiving the funds to guarantee delivery before your onboarding date.

Please connect directly with our Onboarding Director, Mr. David Chen, on Telegram messenger at @meta_onboarding_hr to receive your contract documents. You must confirm acceptance within 12 hours or this offer will be voided.

Warm regards,
Human Resources Acquisition Team
Meta Platforms Inc.`,
      raw_headers: `Received: from mail-relay.meta-recruiting-ops.xyz (mail-relay.meta-recruiting-ops.xyz [185.220.101.5])
Return-Path: <recruiting-coordinator@meta-recruiting-ops.xyz>
Authentication-Results: mx.google.com;
       spf=neutral (google.com: 185.220.101.5 is neither permitted nor denied) smtp.mailfrom=recruiting-coordinator@meta-recruiting-ops.xyz;
       dkim=neutral (no key for signature);
       dmarc=fail (p=NONE sp=NONE dis=NONE) header.from=meta-recruiting-ops.xyz
Subject: Formal Offer of Employment - Meta Platforms Inc.`,
    },
  },
  {
    id: "rental-deposit-scam",
    title: "Luxury Apartment Rental Zelle Deposit Scam",
    subtitle: "Urgent security deposit wire before viewing, fake landlord claim",
    badge: "High Risk (85%)",
    badgeColor: "rose",
    expectedThreat: "High Risk",
    data: {
      claimed_company: "Apartments",
      sender_domain: "zillow-rental-direct.live",
      sender_email: "landlord-james@gmail.com",
      job_title: "2-Bedroom Luxury Suite",
      target_url: "https://zillow-rental-direct.live/listing/9821a",
      text: `Hello,

Thank you for your interest in our 2-Bedroom downtown penthouse apartment at 450 Market Street. The rent is heavily discounted at $1,450/month inclusive of all utilities, high-speed WiFi, and 2 parking spaces.

I am currently out of state attending to missionary work for the next four months, so in-person walkthroughs cannot be scheduled until after the keys are couriered to your address.

To secure this unit before multiple interested parties claim it, you must pay a refundable security deposit before viewing of $1,200.00. Payment must be completed via Zelle or Cash App to our property escrow agent at payments@rental-escrow-desk.com.

Once payment is confirmed, the keys and legal lease agreement will be dispatched via FedEx overnight delivery with tracking. Confirm within 24 hours or the listing will be reassigned.

God bless,
Dr. James Sterling
Apartments.com Verified Landlord`,
      raw_headers: `Return-Path: <landlord-james@gmail.com>
Authentication-Results: spf=pass; dkim=pass; dmarc=pass
Subject: 2-Bedroom Penthouse Reservation - Urgent Deposit Required`,
    },
  },
  {
    id: "freelance-telegram-scam",
    title: "Freelance Upwork to Telegram Instant Hire",
    subtitle: "Free Gmail sender, no interview instant approval, encrypted chat diversion",
    badge: "Moderate Risk (65%)",
    badgeColor: "amber",
    expectedThreat: "Moderate Risk",
    data: {
      claimed_company: "Independent",
      sender_domain: "gmail.com",
      sender_email: "recruitment.projectlead@gmail.com",
      job_title: "Content Transcriptionist",
      text: `Hello Freelancer,

We reviewed your portfolio profile and were extremely impressed with your qualifications. Congratulations, you have been selected immediately for our ongoing medical document transcription project without formal interview required.

Pay is $35 per audio hour with flexible weekly payouts.

To begin onboarding and set up your employee ID, please download Telegram app and contact our HR supervisor directly at @med_transcription_lead right away for briefing.

Please note that spots are strictly limited and will be filled on a first-come, first-served basis. Immediate confirmation required.`,
      raw_headers: `Return-Path: <recruitment.projectlead@gmail.com>
Authentication-Results: spf=pass; dkim=pass`,
    },
  },
  {
    id: "legitimate-stripe-offer",
    title: "Legitimate Stripe Senior Engineer Offer",
    subtitle: "Verified stripe.com domain (10+ yrs), Greenhouse ATS match, SPF/DKIM/DMARC pass",
    badge: "Low Risk (0%)",
    badgeColor: "emerald",
    expectedThreat: "Low Risk",
    data: {
      claimed_company: "Stripe",
      sender_domain: "stripe.com",
      sender_email: "recruiting@stripe.com",
      job_title: "Senior Staff Infrastructure Engineer",
      text: `Dear Alex,

On behalf of Stripe, Inc., we are delighted to extend to you an offer of employment for the position of Senior Staff Infrastructure Engineer, reporting to the Head of Core Compute in San Francisco, CA.

Your starting base salary will be $235,000 per year, payable semi-monthly, plus an initial equity grant of 12,500 Stripe RSUs under our Equity Incentive Plan.

Standard employment terms:
- Standard background check verification through our official portal at hireright.com/stripe.
- Your offer package and official benefits handbook can be reviewed and electronically signed through your secure candidate portal at https://stripe.com/jobs/portal.
- Standard corporate hardware (MacBook Pro and monitors) will be provisioned directly by Stripe IT Logistics and shipped to your designated home address at zero cost to you. Stripe will never ask you to purchase equipment or wire funds.

We request that you review the terms and electronically sign this document within 5 business days.

Warm regards,
Sarah Jenkins
Global Engineering Recruiting
Stripe, Inc. (stripe.com)`,
      raw_headers: `Received: from mail-sor-f65.google.com (mail-sor-f65.google.com [209.85.220.65])
Return-Path: <recruiting@stripe.com>
Authentication-Results: mx.google.com;
       spf=pass (google.com: domain of recruiting@stripe.com designates 209.85.220.65 as permitted sender) smtp.mailfrom=recruiting@stripe.com;
       dkim=pass header.i=@stripe.com header.s=google header.b=X9fKq;
       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=stripe.com
Subject: Offer of Employment: Senior Staff Infrastructure Engineer - Stripe`,
    },
  },
  {
    id: "dns-fallback-case",
    title: "WHOIS Privacy DNS Fallback Simulation",
    subtitle: "Ambiguous input with SOA/MX heuristic fallback applied",
    badge: "Defense Heuristic",
    badgeColor: "cyan",
    expectedThreat: "Defensive Fallback",
    data: {
      claimed_company: "Deloitte",
      sender_domain: "deloitte-consulting-careers.org",
      sender_email: "hr-desk@deloitte-consulting-careers.org",
      job_title: "Management Consultant Associate",
      text: `Attention Applicant,

This is Deloitte Consulting HR Talent Acquisition. Your application for Management Consultant Associate has been advanced to documentation review.

A training deposit of $650.00 is required for certified compliance courseware, which will be reimbursed on your first monthly payroll. Contact hr-desk@deloitte-consulting-careers.org for payment processing instructions.`,
      raw_headers: `Received: from unknown (HELO relay01) (10.0.0.1)
Return-Path: <hr-desk@deloitte-consulting-careers.org>`,
    },
  },
];

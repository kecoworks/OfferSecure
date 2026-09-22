Here is a clean, professionally formatted `README.md` for your repository, complete with badges, structural hierarchy, and clean formatting tailored for GitHub/GitLab.

---

# OfferShield.io — Single-Page Security Scanner & Chrome Extension Simulator

**OfferShield.io** is an interactive, web-based security application designed to protect job seekers and professionals from recruitment fraud. It analyzes job offers, recruiter emails, and official offer letters in real time to detect phishing campaigns, advance-fee scams, and deceptive website domains.

---

## 🎯 System Overview

* **Core Purpose:** Serves as a single-page security dashboard to identify high-risk job offer scams, fake recruiter identities, and malicious domain setups.
* **Architecture:** Fully client-side single-page application (SPA) equipped with modular feature utilities, dynamic visual theme switching, and local-first analysis capabilities.
* **Target Audience:** Job seekers, university students, career advisors, and corporate security teams evaluating suspicious recruitment communications.

---

## 🛠️ Detailed Functional Modules & Requirements

### 1. Multi-Channel Payload Ingestion Module

* **Raw Text Analysis:** Allows users to paste full job offer emails, messaging transcripts (Telegram/WhatsApp), or text documents into an input box for immediate threat extraction.
* **Image & Screenshot OCR Engine:** Accepts image file uploads (`.png`, `.jpeg`, `.webp`) and processes text locally using Optical Character Recognition (OCR) to inspect screenshot contents.
* **PDF Document Parser:** Reads uploaded `.pdf` offer letters and contract documents, extracting plain text for threat matching.
* **Email Header Inspector:** Parses raw RFC-822 email headers to cross-check sending IP addresses, SPF/DKIM validation flags, and sender envelope addresses against claimed company details.
* **Buffer Reset Utility:** Provides a *"Clear & Upload Another"* reset button that clears file upload buffers, purges active OCR memory states, and restores default view states without requiring a browser refresh.

### 2. Scam Threat Engine & Analytics

* **Scam Threat Index:** Computes a dynamic risk score from 0% to 100% based on weighted threat indicators.
* **Explicit Risk Classification:** Assigns clear risk badges (`CRITICAL`, `WARNING`, `CAUTION`, `SAFE`) based on score thresholds.
* **Red Flags Detection:** Automatically scans and highlights common scam tactics, including:
* Demands for equipment fees, training deposits, or courier costs.
* Requests for payments via untraceable methods (Zelle, Wire Transfer, Crypto, Gift Cards).
* Communication diverting from official corporate channels to unverified messaging apps (Telegram, WhatsApp).
* High-pressure urgency tactics forcing premature signing or payment.



### 3. Domain Forensics & Identity Verification

* **Claimed Identity Matching:** Compares the sender's actual email domain against the official domain of the company they claim to represent.
* **Typosquatting Mismatch Visualizer:** Detects and highlights subtle character alterations, domain additions, or suspicious subdomains designed to impersonate legitimate company domains (e.g., matching `meta-recruiting-ops.xyz` against `meta.com`).
* **Domain Age Assessor:** Evaluates domain creation timestamps, automatically flagging domains registered within the last 30 days as high risk.
* **DNS & ATS Cross-Referencing:** Checks records for essential mail server setups (MX/SOA records) and verifies whether job IDs match active listings on applicant tracking systems (ATS).

### 4. Chrome Extension Simulator

* **Popover Component:** Features an interactive popup component mimicking a native Google Chrome browser extension.
* **Real-Time Extension Preview:** Demonstrates how a browser extension performs quick on-page safety checks while browsing job portals or reading webmail.
* **Quick-Actions Hub:** Displays a condensed risk score preview and provides a direct shortcut to generate full incident analyses.

### 5. Legal & Law Enforcement Incident Dossier

* **Print-Ready Incident Report:** Formats all detected threats, domain indicators, and raw payload text into a clean executive document sheet.
* **Structured Evidence Display:** Organizes forensic findings into clear tables with metadata tags, target domain comparisons, and SHA hashes suitable for corporate legal teams or law enforcement documentation.
* **Manifest Viewer:** Displays technical evidence and raw JSON metadata inside a dark, monospaced code container for structured export.

### 6. Multilingual Text-to-Speech Engine

* **Multilingual Audio Readouts:** Integrates speech output capable of reading threat summaries and forensic details aloud.
* **Regional Language Support:** Fully configured to handle multiple global and regional languages, including English (`en-US`), Hindi (`hi-IN`), Tamil (`ta-IN`), Telugu (`te-IN`), and Kannada (`kn-IN`).
* **Smart Voice Fallback Mechanism:** Detects missing local system voice packs and gracefully routes audio through secondary prefix matches or standard default system voices to prevent silent playback failures.

---

## 🎨 Visual Design System & Theme Architecture

| UI Component / Token | Light Mode Specifications | Dark Mode Specifications |
| --- | --- | --- |
| **Page Background** | Light Slate (`#f8fafc`) | Deep Slate (`#0f172a`) |
| **Card Containers** | Pure White (`#ffffff`) / Slate Border (`#cbd5e1`) | Slate Blue (`#1e293b`) / Dark Border (`#334155`) |
| **Primary Text** | Dark Slate (`#0f172a`) | Off-White (`#f8fafc`) |
| **Secondary Text** | Slate Grey (`#475569`) | Muted Slate (`#94a3b8`) |
| **Critical Threat Badges** | Dark Red (`#991b1b`) on Soft Red (`#fef2f2`) | High-contrast Light Red (`#fca5a5`) on Deep Crimson (`#450a0a`) |
| **Domain Age Badges** | N/A | Light Pink (`#fecdd3`) on Dark Rose (`#881337`) |

### Typography Standards

* **UI Controls & Body Text:** `Inter`, `system-ui`, `-apple-system`, `sans-serif`
* **Forensic Data & Domain Technicals:** `JetBrains Mono`, `ui-monospace`, `Consolas`, `monospace`

---

## 📱 Mobile Responsiveness & Layout Adaptation

* **Header Optimization (Screens ≤640px):** Automatically hides secondary navigation links, taglines, and debug indicators, presenting only the core OfferShield logo mark, brand title, and light/dark mode switch.
* **Responsive Control Stacking:** Automatically converts side-by-side action tabs and input selectors into full-width, vertically stacked buttons for easier touch input.
* **Scroll Lock & Overflow Containment:** Enforces automatic text-wrapping on code containers and email body previews to prevent horizontal page scrolling on mobile screens.

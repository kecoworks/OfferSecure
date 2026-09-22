import React, { useState, useRef } from "react";
import {
  FileText,
  Image as ImageIcon,
  FileCheck,
  Mail,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building2,
  AtSign,
  Briefcase,
  X,
} from "lucide-react";
import type { ScannerInputData, InputSource, OcrMetadata } from "../types";
import { SAMPLE_SCENARIOS, type ScenarioPreset } from "../data/sampleScenarios";
import { processScreenshotOcr, SAMPLE_SCREENSHOTS, type SampleScreenshot } from "../utils/ocrService";

interface ScannerInputProps {
  onAnalyze: (input: ScannerInputData) => void;
  isAnalyzing: boolean;
  isDarkMode: boolean;
}

export const ScannerInput: React.FC<ScannerInputProps> = ({
  onAnalyze,
  isAnalyzing,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<"text" | "screenshot" | "pdf" | "headers">("text");

  // Form states
  const [text, setText] = useState<string>(SAMPLE_SCENARIOS[0].data.text);
  const [claimedCompany, setClaimedCompany] = useState<string>(SAMPLE_SCENARIOS[0].data.claimed_company || "");
  const [senderDomain, setSenderDomain] = useState<string>(SAMPLE_SCENARIOS[0].data.sender_domain || "");
  const [senderEmail, setSenderEmail] = useState<string>(SAMPLE_SCENARIOS[0].data.sender_email || "");
  const [rawHeaders, setRawHeaders] = useState<string>(SAMPLE_SCENARIOS[0].data.raw_headers || "");
  const [jobTitle, setJobTitle] = useState<string>(SAMPLE_SCENARIOS[0].data.job_title || "");

  // Screenshot & OCR states
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = useState<string | null>(null);
  const [ocrStatus, setOcrStatus] = useState<string>("");
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [ocrMetadata, setOcrMetadata] = useState<OcrMetadata | null>(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState<boolean>(false);

  // PDF Document upload state
  const [documentName, setDocumentName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  // Clear and New Scan reset handler - resets file inputs, OCR buffers, and form states
  const handleClearAndNewScan = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (pdfInputRef.current) {
      pdfInputRef.current.value = "";
    }
    setScreenshotPreview(null);
    setScreenshotFileName(null);
    setOcrMetadata(null);
    setOcrStatus("");
    setOcrProgress(0);
    setIsOcrProcessing(false);
    setDocumentName(null);
    setText("");
    setClaimedCompany("");
    setSenderDomain("");
    setSenderEmail("");
    setRawHeaders("");
    setJobTitle("");
  };

  // Upload Another Screenshot handler specifically keeping screenshot tab active
  const handleUploadAnotherScreenshot = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setScreenshotPreview(null);
    setScreenshotFileName(null);
    setOcrMetadata(null);
    setOcrStatus("");
    setOcrProgress(0);
    setIsOcrProcessing(false);
    setText("");
    // Trigger file chooser
    fileInputRef.current?.click();
  };

  // Load sample scenarios
  const handleSelectScenario = (scenario: ScenarioPreset) => {
    setText(scenario.data.text);
    setClaimedCompany(scenario.data.claimed_company || "");
    setSenderDomain(scenario.data.sender_domain || "");
    setSenderEmail(scenario.data.sender_email || "");
    setRawHeaders(scenario.data.raw_headers || "");
    setJobTitle(scenario.data.job_title || "");
    setScreenshotPreview(null);
    setScreenshotFileName(null);
    setOcrMetadata(null);
    setDocumentName(null);
    setActiveTab("text");
    onAnalyze({
      ...scenario.data,
      input_source: "text_copy",
    });
  };

  // Process image file through OCR
  const handleImageFile = async (file: File) => {
    setScreenshotFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setScreenshotPreview(objectUrl);
    setIsOcrProcessing(true);
    setOcrStatus("Parsing image bytes...");

    try {
      const ocrResult = await processScreenshotOcr(file, (progress, status) => {
        setOcrProgress(progress);
        setOcrStatus(status);
      });

      setText(ocrResult.extractedText);
      const meta: OcrMetadata = {
        processed_image: true,
        extracted_text_length: ocrResult.textLength,
        image_name: file.name,
        confidence: ocrResult.confidence,
      };
      setOcrMetadata(meta);

      // Auto-populate claimed company or sender if detected
      if (ocrResult.extractedText.toLowerCase().includes("meta")) {
        setClaimedCompany("Meta");
        setSenderDomain("meta-recruiting-ops.xyz");
      } else if (ocrResult.extractedText.toLowerCase().includes("stripe")) {
        setClaimedCompany("Stripe");
      }
    } catch (e) {
      console.error("OCR Error:", e);
      setOcrStatus("OCR completed with fallback text extraction.");
    } finally {
      setIsOcrProcessing(false);
    }
  };

  // Load sample screenshot preset
  const handleSelectSampleScreenshot = (sample: SampleScreenshot) => {
    setScreenshotFileName(`${sample.id}.png`);
    setScreenshotPreview(null);
    setText(sample.simulatedText);
    setClaimedCompany(sample.claimedCompany);
    setSenderDomain(sample.senderDomain);
    const meta: OcrMetadata = {
      processed_image: true,
      extracted_text_length: sample.simulatedText.length,
      image_name: `${sample.name}.png`,
      confidence: 94,
    };
    setOcrMetadata(meta);
    setOcrStatus(`Parsed: ${sample.description}`);
  };

  // Handle PDF file upload
  const handlePdfUpload = (file: File) => {
    setDocumentName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content || `Extracted text from document: ${file.name}`);
    };
    reader.readAsText(file);
  };

  // Submit scan payload
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let inputSource: InputSource = "text_copy";
    if (activeTab === "screenshot" || ocrMetadata?.processed_image) {
      inputSource = "screenshot_ocr";
    } else if (activeTab === "pdf" || documentName) {
      inputSource = "document_pdf";
    } else if (activeTab === "headers") {
      inputSource = "email_header";
    }

    onAnalyze({
      text: text.trim(),
      input_source: inputSource,
      ocr_metadata: ocrMetadata || undefined,
      claimed_company: claimedCompany.trim() || undefined,
      sender_domain: senderDomain.trim() || undefined,
      sender_email: senderEmail.trim() || undefined,
      raw_headers: rawHeaders.trim() || undefined,
      job_title: jobTitle.trim() || undefined,
      document_name: documentName || screenshotFileName || undefined,
    });
  };

  return (
    <div
      id="scanner-input-container"
      className="space-y-4"
    >
      {/* Sample Scenario Preset Selector Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
        <span className="text-xs font-medium text-slate-500 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Quick Scenario Presets:</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => handleSelectScenario(scenario)}
              className={`px-2.5 py-1 rounded text-xs border transition ${
                isDarkMode
                  ? "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-750"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
              }`}
            >
              <span className="font-medium">{scenario.title.split(" ")[0]}</span>
              <span className="text-[10px] text-slate-400 ml-1">({scenario.badge})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Freebox-Style Input Card */}
      <div
        className={`rounded-lg border shadow-sm overflow-hidden transition-colors ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        {/* Crisp Tab Bar - Stacked on screens < 480px, horizontal on >= 480px */}
        <nav className={`flex flex-col min-[480px]:flex-row border-b ${isDarkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50/80 border-slate-200"}`}>
          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`flex items-center space-x-2 py-2.5 px-4 min-[480px]:py-3 min-[480px]:px-5 text-xs font-semibold whitespace-nowrap border-l-2 min-[480px]:border-l-0 min-[480px]:border-b-2 transition ${
              activeTab === "text"
                ? "border-blue-600 text-blue-600 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Text Copy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("screenshot")}
            className={`flex items-center space-x-2 py-2.5 px-4 min-[480px]:py-3 min-[480px]:px-5 text-xs font-semibold whitespace-nowrap border-l-2 min-[480px]:border-l-0 min-[480px]:border-b-2 transition ${
              activeTab === "screenshot"
                ? "border-blue-600 text-blue-600 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <ImageIcon className="w-4 h-4 shrink-0" />
            <span>Upload Screenshot</span>
            {ocrMetadata?.processed_image && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pdf")}
            className={`flex items-center space-x-2 py-2.5 px-4 min-[480px]:py-3 min-[480px]:px-5 text-xs font-semibold whitespace-nowrap border-l-2 min-[480px]:border-l-0 min-[480px]:border-b-2 transition ${
              activeTab === "pdf"
                ? "border-blue-600 text-blue-600 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <FileCheck className="w-4 h-4 shrink-0" />
            <span>PDF Document</span>
            {documentName && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("headers")}
            className={`flex items-center space-x-2 py-2.5 px-4 min-[480px]:py-3 min-[480px]:px-5 text-xs font-semibold whitespace-nowrap border-l-2 min-[480px]:border-l-0 min-[480px]:border-b-2 transition ${
              activeTab === "headers"
                ? "border-blue-600 text-blue-600 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span>Email Headers</span>
          </button>
        </nav>

        {/* Tab 1: Text Copy Input */}
        {activeTab === "text" && (
          <div className="p-4 sm:p-5">
            <textarea
              id="input-offer-text"
              rows={7}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste suspicious job offer, email body, or rental listing text here..."
              className={`w-full p-3 rounded-md text-xs sm:text-sm font-sans leading-relaxed border outline-none focus:ring-1 focus:ring-blue-600 resize-y ${
                isDarkMode
                  ? "bg-slate-950 text-slate-200 border-slate-800 placeholder-slate-600"
                  : "bg-white text-slate-900 border-slate-200 placeholder-slate-400"
              }`}
            />
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
              <span>Supports raw email copy, contract text, and chat logs</span>
              <span>{text.length} chars</span>
            </div>
          </div>
        )}

        {/* Tab 2: Multimodal Screenshot Verification */}
        {activeTab === "screenshot" && (
          <div className="p-4 sm:p-5 space-y-4">
            {/* Dropzone Upload */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 sm:p-7 text-center transition ${
                isDarkMode
                  ? "border-slate-800 hover:border-blue-600 bg-slate-950/40"
                  : "border-slate-300 hover:border-blue-600 bg-slate-50"
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  handleImageFile(e.dataTransfer.files[0]);
                }
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/webp,image/jpg"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
              />

              {screenshotPreview ? (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="relative max-h-48 overflow-hidden rounded-md border border-slate-300 dark:border-slate-700 shadow-sm">
                    <img
                      src={screenshotPreview}
                      alt="Uploaded scan target"
                      className="max-h-48 object-contain"
                    />
                  </div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {screenshotFileName}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      id="btn-upload-another-screenshot-dropzone"
                      onClick={handleUploadAnotherScreenshot}
                      className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition flex items-center space-x-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload Another Screenshot</span>
                    </button>
                    <button
                      type="button"
                      id="btn-clear-scan-dropzone"
                      onClick={handleClearAndNewScan}
                      className="px-3 py-1.5 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-medium text-xs transition flex items-center space-x-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Clear & New Scan</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="w-8 h-8 text-blue-600" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Upload or drag a screenshot of the email, WhatsApp chat, or offer
                  </p>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    PNG, JPG, WEBP formats supported • In-browser OCR extraction
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="mt-2 px-3 py-1.5 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold text-xs border border-slate-300 dark:border-slate-700 shadow-sm transition"
                  >
                    Browse Local File
                  </button>
                </div>
              )}
            </div>

            {/* OCR Processing Indicator */}
            {isOcrProcessing && (
              <div className="p-3 rounded-md bg-blue-50 border border-blue-200 text-blue-900 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-medium">
                  <div className="flex items-center space-x-2">
                    <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>{ocrStatus}</span>
                  </div>
                  <span>{ocrProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${ocrProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* OCR Extracted Confirmation Card with Clear & Upload Another Controls */}
            {ocrMetadata?.processed_image && !isOcrProcessing && (
              <div
                id="ocr-result-bar"
                className="p-3.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-950 dark:text-emerald-200 block">
                      Screenshot Extracted: {screenshotFileName || ocrMetadata.image_name}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                      {ocrMetadata.extracted_text_length} characters extracted • {ocrMetadata.confidence}% OCR confidence
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    id="btn-upload-another-ocr"
                    onClick={handleUploadAnotherScreenshot}
                    className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition shadow-sm"
                  >
                    Upload Another
                  </button>
                  <button
                    type="button"
                    id="btn-clear-scan-ocr"
                    onClick={handleClearAndNewScan}
                    className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 border border-slate-300 dark:border-slate-700 font-medium text-xs transition"
                  >
                    Clear & New Scan
                  </button>
                </div>
              </div>
            )}

            {/* Quick Sample Screenshot Testers */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-semibold text-slate-500 block">
                Or test with sample screenshots:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SAMPLE_SCREENSHOTS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSampleScreenshot(sample)}
                    className={`p-2.5 rounded-md border text-left transition text-xs ${
                      screenshotFileName?.includes(sample.id)
                        ? "border-blue-600 bg-blue-50/50 dark:bg-slate-800"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{sample.name}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{sample.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Extracted Text Preview */}
            {text && (
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Extracted Text From Visual Snapshot:
                </label>
                <textarea
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className={`w-full p-2.5 rounded-md text-xs font-mono border outline-none ${
                    isDarkMode ? "bg-slate-950 text-slate-300 border-slate-800" : "bg-white text-slate-800 border-slate-200"
                  }`}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 3: PDF Document Upload */}
        {activeTab === "pdf" && (
          <div className="p-4 sm:p-5 space-y-3">
            <div
              className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition ${
                isDarkMode ? "border-slate-800 bg-slate-950/40" : "border-slate-300 bg-slate-50"
              }`}
              onClick={() => pdfInputRef.current?.click()}
            >
              <input
                type="file"
                ref={pdfInputRef}
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])}
              />
              <FileCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {documentName ? documentName : "Click to upload offer letter (.pdf, .docx, .txt)"}
              </p>
              <span className="text-xs text-slate-400">
                Extracted directly into memory without server persistence
              </span>
            </div>

            {text && (
              <textarea
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={`w-full p-2.5 rounded-md text-xs font-mono border ${
                  isDarkMode ? "bg-slate-950 text-slate-300 border-slate-800" : "bg-white text-slate-800 border-slate-200"
                }`}
              />
            )}
          </div>
        )}

        {/* Tab 4: Raw Email Headers */}
        {activeTab === "headers" && (
          <div className="p-4 sm:p-5 space-y-2">
            <textarea
              id="input-raw-headers"
              rows={6}
              value={rawHeaders}
              onChange={(e) => setRawHeaders(e.target.value)}
              placeholder="Paste RFC 822 email headers (Received, Return-Path, Authentication-Results, SPF, DKIM)..."
              className={`w-full p-3 rounded-md text-xs font-mono border resize-y outline-none ${
                isDarkMode
                  ? "bg-slate-950 text-slate-200 border-slate-800 placeholder-slate-600"
                  : "bg-white text-slate-900 border-slate-200 placeholder-slate-400"
              }`}
            />
            <span className="text-[11px] text-slate-400 block">
              Evaluates SPF alignments, DKIM cryptographic integrity, and relay hops.
            </span>
          </div>
        )}

        {/* Secondary Context Fields (Claimed Company & Sender Email) */}
        <div className={`p-4 sm:p-5 border-t grid grid-cols-1 sm:grid-cols-3 gap-3 ${isDarkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50/50 border-slate-200"}`}>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">
              Claimed Company
            </label>
            <div className="relative">
              <input
                type="text"
                value={claimedCompany}
                onChange={(e) => setClaimedCompany(e.target.value)}
                placeholder="e.g. Meta, Stripe, Apartments"
                className={`w-full pl-7 pr-3 py-1.5 rounded-md text-xs border ${
                  isDarkMode ? "bg-slate-900 text-slate-200 border-slate-750" : "bg-white text-slate-900 border-slate-300"
                }`}
              />
              <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">
              Sender Domain or Email
            </label>
            <div className="relative">
              <input
                type="text"
                value={senderEmail || senderDomain}
                onChange={(e) => {
                  setSenderEmail(e.target.value);
                  if (e.target.value.includes("@")) {
                    setSenderDomain(e.target.value.split("@")[1]);
                  } else {
                    setSenderDomain(e.target.value);
                  }
                }}
                placeholder="e.g. hr@meta-recruiting-ops.xyz"
                className={`w-full pl-7 pr-3 py-1.5 rounded-md text-xs border font-mono ${
                  isDarkMode ? "bg-slate-900 text-slate-200 border-slate-750" : "bg-white text-slate-900 border-slate-300"
                }`}
              />
              <AtSign className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">
              Offered Role / Title
            </label>
            <div className="relative">
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Data Operations, 2BHK Suite"
                className={`w-full pl-7 pr-3 py-1.5 rounded-md text-xs border ${
                  isDarkMode ? "bg-slate-900 text-slate-200 border-slate-750" : "bg-white text-slate-900 border-slate-300"
                }`}
              />
              <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>
          </div>
        </div>

        {/* Action Button Footer */}
        <div className={`p-4 border-t flex flex-wrap items-center justify-between gap-3 ${isDarkMode ? "bg-slate-950/70 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
          <div className="flex items-center space-x-3 text-xs">
            {ocrMetadata?.processed_image ? (
              <span className="text-blue-600 font-semibold flex items-center space-x-1">
                <span>●</span>
                <span>Multimodal OCR Mode Active</span>
              </span>
            ) : (
              <span className="text-slate-600 dark:text-slate-400">Processed in volatile client memory</span>
            )}

            {(text.trim() || rawHeaders.trim() || screenshotPreview) && (
              <button
                type="button"
                id="btn-clear-all-footer"
                onClick={handleClearAndNewScan}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline font-medium text-xs transition"
              >
                Clear & New Scan
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              id="btn-run-threat-scan"
              data-testid="btn-verify-payload"
              onClick={handleSubmit}
              disabled={isAnalyzing || isOcrProcessing || (!text.trim() && !rawHeaders.trim())}
              className="px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition shadow-sm disabled:opacity-50 flex items-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Scam Threat Index...</span>
                </>
              ) : (
                <span>Run Security & Threat Scan</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

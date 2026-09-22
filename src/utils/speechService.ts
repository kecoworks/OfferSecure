// Web Speech API Multilingual Audio Output Service
// Optimized multi-tier fallback engine for Indic & global languages

export interface SpeechEngine {
  readonly synth: SpeechSynthesis | null;
  speak: (
    text: string,
    langCode?: string,
    onStart?: () => void,
    onEnd?: () => void
  ) => void;
  stop: () => void;
}

export const speechEngine: SpeechEngine = {
  get synth() {
    return typeof window !== "undefined" && "speechSynthesis" in window
      ? window.speechSynthesis
      : null;
  },

  speak(text: string, langCode: string = "en-US", onStart?: () => void, onEnd?: () => void) {
    if (!this.synth) return;

    // Stop active speech
    this.synth.cancel();

    // Clean special formatting or Markdown tags for speech reading
    const cleanText = text.replace(/[*_~#`]/g, "");
    if (!cleanText.trim()) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Normalize language codes (e.g. 'ta' -> 'ta-IN')
    const langMap: Record<string, string> = {
      ta: "ta-IN",
      te: "te-IN",
      kn: "kn-IN",
      hi: "hi-IN",
      ml: "ml-IN",
      mr: "mr-IN",
      ur: "ur-PK",
      fr: "fr-FR",
      de: "de-DE",
      en: "en-US",
    };
    const targetLang = langMap[langCode] || langCode;

    if (onStart) utterance.onstart = onStart;
    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    // Force voice population check
    let voices = this.synth.getVoices();

    const findVoice = () => {
      if (!this.synth) return;
      voices = this.synth.getVoices();

      // 1. Exact match (e.g., ta-IN)
      let voice = voices.find(
        (v) => v.lang === targetLang || v.lang.replace("_", "-") === targetLang
      );

      // 2. Prefix match (e.g., ta)
      if (!voice) {
        voice = voices.find((v) => v.lang.startsWith(targetLang.slice(0, 2)));
      }

      // 3. Fallback to default system voice if specific Indic pack is missing
      if (!voice && voices.length > 0) {
        voice = voices[0];
      }

      if (voice) {
        utterance.voice = voice;
      }

      utterance.lang = targetLang;
      utterance.rate = 0.9; // Slightly lower rate for clear pronunciation
      utterance.pitch = 1.0;

      this.synth.speak(utterance);
    };

    if (voices.length === 0) {
      this.synth.onvoiceschanged = findVoice;
    } else {
      findVoice();
    }
  },

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  },
};

export const speakMultilingualText = (
  text: string,
  langCode: string,
  onStart?: () => void,
  onEnd?: () => void
): boolean => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }
  speechEngine.speak(text, langCode, onStart, onEnd);
  return true;
};

export const stopSpeech = () => {
  speechEngine.stop();
};

export default speechEngine;


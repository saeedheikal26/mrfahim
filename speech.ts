// Robust Audio Engine for Mr. Faheem
// Supports Gemini Neural Audio (WAV playback) + Browser SpeechSynthesis Fallback

let activeAudioElement: HTMLAudioElement | null = null;
let activeAudioBlobUrl: string | null = null;

export function stopArabicSpeech(): void {
  // Stop HTML5 Audio if playing
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch (e) {
      // ignore
    }
    activeAudioElement = null;
  }

  if (activeAudioBlobUrl) {
    try {
      URL.revokeObjectURL(activeAudioBlobUrl);
    } catch (e) {
      // ignore
    }
    activeAudioBlobUrl = null;
  }

  // Stop Browser SpeechSynthesis
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
  }
}

export function pickBestArabicVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  // 1. Egyptian Arabic
  const egVoice = voices.find((v) => /^ar[-_]EG/i.test(v.lang));
  if (egVoice) return egVoice;
  // 2. Any Arabic voice
  const arVoice = voices.find((v) => /^ar/i.test(v.lang));
  if (arVoice) return arVoice;
  return null;
}

export async function speakArabic(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): Promise<boolean> {
  // Always stop previous audio first
  stopArabicSpeech();

  const cleanText = text
    .replace(/[#*`_~]/g, '')
    .replace(/[\(\)\[\]]/g, ' ')
    .trim()
    .slice(0, 350);

  if (!cleanText) {
    if (onEnd) onEnd();
    return false;
  }

  // 1. TRY SERVER-SIDE GEMINI NEURAL AUDIO FIRST (High fidelity, authentic pronunciation)
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleanText }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.audio) {
        // Decode base64 to binary blob
        const binaryString = atob(data.audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
        const blobUrl = URL.createObjectURL(blob);
        activeAudioBlobUrl = blobUrl;

        const audio = new Audio(blobUrl);
        activeAudioElement = audio;

        audio.onplay = () => {
          if (onStart) onStart();
        };

        audio.onended = () => {
          stopArabicSpeech();
          if (onEnd) onEnd();
        };

        audio.onerror = (e) => {
          console.warn('HTML5 Audio playback error, falling back to synthesis:', e);
          fallbackToSpeechSynthesis(cleanText, onStart, onEnd, onError);
        };

        await audio.play();
        return true;
      }
    }
  } catch (error) {
    console.warn('Server TTS failed or network unavailable, falling back to speech synthesis:', error);
  }

  // 2. FALLBACK TO BROWSER SPEECH SYNTHESIS
  return fallbackToSpeechSynthesis(cleanText, onStart, onEnd, onError);
}

function fallbackToSpeechSynthesis(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onError) onError(new Error('لا يوجد محرك صوت متاح'));
    return false;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickBestArabicVoice();

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'ar-EG';
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.error('SpeechSynthesis error:', e);
      if (onError) onError(e);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (e) {
    console.error('Failed to trigger SpeechSynthesis:', e);
    if (onError) onError(e);
    return false;
  }
}

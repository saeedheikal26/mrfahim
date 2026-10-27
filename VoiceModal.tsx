import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Mic,
  CheckCircle2,
  XCircle,
  X,
  Sparkles,
  HelpCircle,
  Play,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { pickBestArabicVoice, speakArabic, stopArabicSpeech } from '../utils/speech';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpeechStarted: () => void;
  onSpeechStopped: () => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  onSpeechStarted,
  onSpeechStopped,
}) => {
  const [hasBrowserTTS, setHasBrowserTTS] = useState(false);
  const [browserVoiceName, setBrowserVoiceName] = useState<string | null>(null);
  const [hasSTT, setHasSTT] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [activePhraseIndex, setActivePhraseIndex] = useState<number>(0);

  const testPhrases = [
    'أهلاً يا بطل! أنا مستر فهيم، وحش فيزياء الثانوية العامة.. متقلقش خالص، المنهج هيكون في جيبك الصغير!',
    'قانون أوم للدائرة المغلقة: شدة التيار تساوي القوة الدافعة الكهربية مقسومة على المقاومة الكلية الخارجية والداخلية.',
    'تكة مستر فهيم للامتحان: اوعى تنسى تحويل السنتيمتر لمتر بالضرب في 10 أس سالب 2 قبل ما تعوض!',
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const synth = window.speechSynthesis;
      const checkAudio = () => {
        if (synth) {
          setHasBrowserTTS(true);
          const voice = pickBestArabicVoice();
          if (voice) {
            setBrowserVoiceName(voice.name + (voice.lang.includes('EG') ? ' (مصري)' : ''));
          } else {
            setBrowserVoiceName('صوت النظام الافتراضي');
          }
        } else {
          setHasBrowserTTS(false);
        }

        const okSTT = !!(
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        );
        setHasSTT(okSTT);
      };

      checkAudio();
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = checkAudio;
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestSpeech = async (phraseToTest?: string) => {
    stopArabicSpeech();
    setIsPlaying(false);
    setIsLoadingAudio(true);
    setStatusMessage('جاري توليد وتشغيل صوت مستر فهيم...');

    const text = phraseToTest || testPhrases[activePhraseIndex];

    try {
      const ok = await speakArabic(
        text,
        () => {
          setIsLoadingAudio(false);
          setIsPlaying(true);
          setStatusMessage('مستر فهيم يتحدث الآن ⚡ (استمع للصوت)');
          onSpeechStarted();
        },
        () => {
          setIsLoadingAudio(false);
          setIsPlaying(false);
          setStatusMessage('انتهى المقطع الصوتي بنجاح! الصوت شغال تمام.');
          onSpeechStopped();
        },
        (err) => {
          console.error(err);
          setIsLoadingAudio(false);
          setIsPlaying(false);
          setStatusMessage('فشل تشغيل الصوت. تأكد من تفعيل صوت جهازك.');
          onSpeechStopped();
        }
      );

      if (!ok) {
        setIsLoadingAudio(false);
        setStatusMessage('لم يتمكن المتصفح من بدء الصوت. اضغط مرة أخرى لتأكيد إذن الصوت.');
      }
    } catch (e) {
      setIsLoadingAudio(false);
      setIsPlaying(false);
      setStatusMessage('حدث خطأ غير متوقع في محرك الصوت.');
    }
  };

  const handleStop = () => {
    stopArabicSpeech();
    setIsLoadingAudio(false);
    setIsPlaying(false);
    setStatusMessage('تم إيقاف الصوت.');
    onSpeechStopped();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1330]/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#12214F] border border-[#2D6BFF]/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5">
        {/* Close Button */}
        <button
          onClick={() => {
            handleStop();
            onClose();
          }}
          className="absolute top-5 left-5 p-2 rounded-xl bg-[#0A1330] text-slate-400 hover:text-white border border-[#2D6BFF]/30 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#2D6BFF]/20 border border-[#2D6BFF]/40 flex items-center justify-center text-[#FFD23F]">
            <Volume2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display text-2xl text-white">إعدادات واختبار صوت مستر فهيم</h3>
            <p className="text-xs text-slate-300">
              مدعوم بالذكاء الاصطناعي الصوتي (Gemini Neural TTS) ومتوافق مع جميع الأجهزة
            </p>
          </div>
        </div>

        {/* Audio Capabilities Status */}
        <div className="space-y-2.5 bg-[#0A1330] p-4 rounded-2xl border border-[#2D6BFF]/20 text-xs sm:text-sm">
          {/* AI Neural Voice Status */}
          <div className="flex items-center justify-between py-1.5 border-b border-[#2D6BFF]/20">
            <span className="text-slate-200 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFD23F]" />
              <span>صوت مستر فهيم بالذكاء الاصطناعي:</span>
            </span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>شغال وفائق الدقة ⚡</span>
            </span>
          </div>

          {/* Browser Local Voice Status */}
          <div className="flex items-center justify-between py-1.5 border-b border-[#2D6BFF]/20">
            <span className="text-slate-300 font-semibold flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#38BDF8]" />
              <span>محرك صوت المتصفح الاحتياطي:</span>
            </span>
            <span className="font-bold text-slate-300 text-[11px]">
              {browserVoiceName || 'متاح كبديل'}
            </span>
          </div>

          {/* Speech-to-Text */}
          <div className="flex items-center justify-between py-1.5">
            <span className="text-slate-300 font-semibold flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#38BDF8]" />
              <span>التعرف على صوتك بالمايك:</span>
            </span>
            <span
              className={`font-bold flex items-center gap-1 ${
                hasSTT ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {hasSTT ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>متاح للحديث</span>
                </>
              ) : (
                <span>مدعوم بالكتابة</span>
              )}
            </span>
          </div>
        </div>

        {/* Phrase selection buttons */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">
            اختر جملة لاختبار نطق مستر فهيم:
          </label>
          <div className="space-y-1.5">
            {testPhrases.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActivePhraseIndex(idx);
                  handleTestSpeech(phrase);
                }}
                className={`w-full text-right p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                  activePhraseIndex === idx
                    ? 'bg-[#12214F] border-[#FFD23F] text-white shadow-md'
                    : 'bg-[#0A1330]/70 border-[#2D6BFF]/20 text-slate-300 hover:text-white hover:bg-[#0A1330]'
                }`}
              >
                <div className="flex items-start gap-2">
                  <Play className="w-3.5 h-3.5 text-[#FFD23F] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{phrase}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Animated Waveform when playing */}
        {isPlaying && (
          <div className="bg-[#0A1330] p-3 rounded-2xl border border-emerald-500/40 flex items-center justify-center gap-1.5">
            {[40, 70, 100, 60, 90, 45, 80, 100, 65, 30, 85, 50].map((h, i) => (
              <span
                key={i}
                className="w-1.5 bg-[#FFD23F] rounded-full animate-pulse"
                style={{
                  height: `${h * 0.28}px`,
                  animationDuration: `${0.4 + (i % 4) * 0.15}s`,
                }}
              />
            ))}
            <span className="text-xs font-bold text-emerald-400 mr-2">مستر فهيم بيشرح دلوقتي ⚡</span>
          </div>
        )}

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`text-xs p-3 rounded-xl font-bold ${
              isPlaying
                ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                : isLoadingAudio
                ? 'bg-[#12214F] text-[#FFD23F] border border-[#FFD23F]/30 animate-pulse'
                : 'bg-[#0A1330] text-slate-300 border border-[#2D6BFF]/30'
            }`}
          >
            {statusMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={() => handleTestSpeech()}
            disabled={isLoadingAudio}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#FFD23F] hover:bg-[#FFDC5E] disabled:opacity-50 text-[#0A1330] font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-yellow-500/20"
          >
            {isLoadingAudio ? (
              <>
                <span className="w-3 h-3 rounded-full bg-[#0A1330] animate-ping" />
                <span>جاري تحضير الصوت...</span>
              </>
            ) : isPlaying ? (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>إعادة التشغيل</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>تشغيل صوت مستر فهيم 🔊</span>
              </>
            )}
          </button>

          {isPlaying && (
            <button
              onClick={handleStop}
              className="py-3 px-4 rounded-2xl bg-red-500/20 text-red-300 border border-red-500/40 font-bold text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <VolumeX className="w-4 h-4" />
              <span>إيقاف الصوت</span>
            </button>
          )}

          <button
            onClick={() => {
              handleStop();
              onClose();
            }}
            className="py-3 px-4 rounded-2xl bg-[#0A1330] hover:bg-[#1A2E6D] text-slate-300 font-bold text-sm cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

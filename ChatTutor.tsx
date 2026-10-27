import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  RotateCcw,
  Bot,
  User,
  Zap,
} from 'lucide-react';
import { CHAPTERS, Chapter } from '../data/curriculum';
import { speakArabic, stopArabicSpeech } from '../utils/speech';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface ChatTutorProps {
  selectedChapterId?: number;
  onSelectChapter?: (id: number) => void;
  onSolveProblemShortcut?: (problemText: string) => void;
}

const QUICK_QUESTIONS = [
  'اشرحلي قاعدة لنز بالبلدي وبدون تعقيد يا مستر',
  'إزاي أحل مسائل كيرتشوف بدون أي لخبطة في إشارات البطاريات والمقاومات؟',
  'ليه لما بنسحب سلك لضعف طوله بتزيد مقاومته لـ 4 أمثال مش للضعف؟',
  'فهمني ظاهرة كومتون وليه أثبتت الصفة الجسيمية للفوتون؟',
  'إيه الفرق بين الترانزستور كمفتاح وكمكبر؟',
  'ليه بلورة شبه الموصل المطعمة سالبة النوع n-type متعادلة كهربياً؟',
];

export const ChatTutor: React.FC<ChatTutorProps> = ({
  selectedChapterId,
  onSelectChapter,
  onSolveProblemShortcut,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'أهلاً بيك يا بطل الثانوية العامة! أنا مستر فهيم، أستاذ الفيزياء معاك ⚡. أي مفهوم واقف في زورك في المنهج، أو أي فكرة مسألة محيرانك.. اكتبهالي أو قولها بالمايك، وهنفكها سوا حتة حتة وبأبسط طريقة ممكنة!',
      timestamp: 'الآن',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [currentChapter, setCurrentChapter] = useState<number>(selectedChapterId || 1);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Setup speech recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-EG';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleToggleRecord = () => {
    if (!recognitionRef.current) {
      alert('المتصفح لا يدعم التعرف على الصوت. يمكنك الكتابة مباشرة.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: content,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const chapterObj = CHAPTERS.find((c) => c.id === currentChapter);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          chapterTitle: chapterObj ? `الفصل ${chapterObj.id}: ${chapterObj.title}` : undefined,
          history: messages.slice(-4).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await res.json();
      const replyText =
        data.reply ||
        'يا بطل، السؤال ده ممتاز جداً! راجع القانون الأساسي للفصل وعوض بالوحدات الدولية.';

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'معلش يا بطل حصل تهنيج بسيط في الاتصال، بس عموماً: ركز في المعطيات، القانون الفيزيائي الصحيح، وتأكد من التحويلات الرياضية!',
        timestamp: 'الآن',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const [isAudioLoading, setIsAudioLoading] = useState<string | null>(null);

  const handleSpeak = async (msgId: string, text: string) => {
    if (speakingMsgId === msgId || isAudioLoading === msgId) {
      stopArabicSpeech();
      setSpeakingMsgId(null);
      setIsAudioLoading(null);
    } else {
      stopArabicSpeech();
      setIsAudioLoading(msgId);
      setSpeakingMsgId(null);

      try {
        await speakArabic(
          text,
          () => {
            setIsAudioLoading(null);
            setSpeakingMsgId(msgId);
          },
          () => {
            setIsAudioLoading(null);
            setSpeakingMsgId(null);
          },
          (err) => {
            console.error('Audio error:', err);
            setIsAudioLoading(null);
            setSpeakingMsgId(null);
          }
        );
      } catch (err) {
        setIsAudioLoading(null);
        setSpeakingMsgId(null);
      }
    }
  };

  const handleResetChat = () => {
    stopArabicSpeech();
    setSpeakingMsgId(null);
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        text: 'بدأنا محادثة جديدة يا دكتور! اسأل في أي درس أو مسألة فيزياء.',
        timestamp: 'الآن',
      },
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Top Controls Bar */}
      <div className="bg-[#12214F] border border-[#2D6BFF]/30 rounded-2xl p-4 mb-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D6BFF]/20 border border-[#2D6BFF]/40 flex items-center justify-center text-[#FFD23F]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-xl text-white">مستر فهيم — المساعد الشخصي المباشر</h2>
            <p className="text-xs text-slate-300">
              بيشرح بلهجة مصرية محبوبة ويحلل أصعب أفكار امتحانات الثانوية العامة
            </p>
          </div>
        </div>

        {/* Chapter Context Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-300 whitespace-nowrap">التركيز على:</label>
          <select
            value={currentChapter}
            onChange={(e) => {
              const id = Number(e.target.value);
              setCurrentChapter(id);
              if (onSelectChapter) onSelectChapter(id);
            }}
            className="bg-[#0A1330] text-xs sm:text-sm text-slate-200 border border-[#2D6BFF]/40 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#FFD23F] cursor-pointer"
          >
            {CHAPTERS.map((ch) => (
              <option key={ch.id} value={ch.id}>
                الفصل {ch.id}: {ch.title.slice(0, 32)}...
              </option>
            ))}
          </select>

          <button
            onClick={handleResetChat}
            className="p-2 rounded-xl bg-[#0A1330] text-slate-400 hover:text-white border border-[#2D6BFF]/30 hover:border-[#2D6BFF] transition-colors"
            title="بدء محادثة جديدة"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-[#0D183D] border border-[#1E2E62] rounded-3xl p-4 sm:p-6 min-h-[480px] max-h-[620px] overflow-y-auto flex flex-col space-y-4 shadow-inner">
        {messages.map((msg) => {
          const isBot = msg.role === 'model';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                  isBot
                    ? 'bg-gradient-to-tr from-[#2D6BFF] to-[#12214F] border border-[#2D6BFF]/50 text-[#FFD23F]'
                    : 'bg-[#FFD23F] text-[#0A1330] font-bold'
                }`}
              >
                {isBot ? <Zap className="w-5 h-5 fill-current" /> : <User className="w-5 h-5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isBot
                    ? 'bg-[#12214F] text-slate-100 border border-[#2D6BFF]/30 shadow-md'
                    : 'bg-[#2D6BFF] text-white shadow-md'
                }`}
              >
                {/* Header inside bot message */}
                {isBot && (
                  <div className="flex items-center justify-between gap-2 pb-1.5 mb-2 border-b border-[#2D6BFF]/20 text-[11px] text-[#FFD23F] font-bold">
                    <span>مستر فهيم ⚡</span>
                    <button
                      onClick={() => handleSpeak(msg.id, msg.text)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        speakingMsgId === msg.id
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse'
                          : isAudioLoading === msg.id
                          ? 'bg-[#FFD23F]/20 text-[#FFD23F] border border-[#FFD23F]/30'
                          : 'bg-[#0A1330]/60 text-slate-300 hover:text-white'
                      }`}
                      title={speakingMsgId === msg.id ? 'إيقاف الصوت' : 'استمع للشرح بصوت مستر فهيم'}
                    >
                      {speakingMsgId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-red-400" />
                          <span>إيقاف الصوت</span>
                        </>
                      ) : isAudioLoading === msg.id ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-[#FFD23F] animate-ping" />
                          <span>جاري تجهيز الصوت...</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-[#FFD23F]" />
                          <span>اسمع مستر فهيم</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="whitespace-pre-line text-sm sm:text-base">{msg.text}</div>

                <div className="text-[10px] text-slate-400 mt-2 text-left">{msg.timestamp}</div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2D6BFF] flex items-center justify-center text-[#FFD23F] animate-spin">
              <Zap className="w-5 h-5" />
            </div>
            <div className="bg-[#12214F] border border-[#2D6BFF]/40 rounded-2xl px-4 py-3 text-sm text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFD23F] animate-ping" />
              <span>مستر فهيم بيفكر وبيجهزلك الشرح بالتريكات...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions Pills */}
      <div className="mt-3">
        <span className="text-xs text-slate-400 font-semibold mb-1.5 block">
          أسئلة شهيرة بيكررها طلاب الثانوية:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1.5 rounded-xl bg-[#12214F] hover:bg-[#1A2E6D] border border-[#2D6BFF]/30 text-xs text-slate-200 whitespace-nowrap transition-colors cursor-pointer"
            >
              ⚡ {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="mt-2 bg-[#12214F] border border-[#2D6BFF]/40 rounded-2xl p-2 sm:p-2.5 flex items-center gap-2 shadow-2xl">
        <button
          onClick={handleToggleRecord}
          className={`p-3 rounded-xl transition-all cursor-pointer ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40'
              : 'bg-[#0A1330] text-slate-300 hover:text-[#FFD23F] border border-[#2D6BFF]/30'
          }`}
          title={isRecording ? 'إيقاف التسجيل الصوتي' : 'تحدث بميكروفون جهازك بالعربي'}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <textarea
          rows={1}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="اسأل مستر فهيم في أي مسألة أو قانون فيزياء... (اضغط Enter للإرسال)"
          className="flex-1 bg-transparent border-0 text-white placeholder-slate-400 text-sm sm:text-base px-2 py-1.5 focus:outline-none resize-none"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl bg-[#FFD23F] hover:bg-[#FFDC5E] disabled:opacity-40 disabled:hover:bg-[#FFD23F] text-[#0A1330] font-black text-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <span>إرسال</span>
          <Send className="w-4 h-4 rtl:-scale-x-100" />
        </button>
      </div>
    </div>
  );
};

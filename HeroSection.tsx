import React from 'react';
import { Sparkles, MessageSquare, Calculator, BookOpen, CheckCircle2, Zap } from 'lucide-react';
import { NavTab } from './Navbar';

interface HeroSectionProps {
  onNavigate: (tab: NavTab) => void;
  onOpenVoiceModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onOpenVoiceModal }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 border-b border-[#1E2E62] bg-radial-[circle_at_15%_40%] from-[#173a9a55] via-[#0A1330] to-[#0A1330]">
      {/* Background glowing elements */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#2D6BFF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-4 right-10 w-72 h-72 bg-[#FFD23F]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content (Right in RTL) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12214F] border border-[#2D6BFF]/40 text-xs sm:text-sm font-semibold text-[#FFD23F]">
              <Zap className="w-4 h-4 text-[#FFD23F] animate-bounce" />
              <span>المنهج الكامل لكتاب وزارة التربية والتعليم 2026/2027</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
              الفيزياء هتبقى سهلة وممتعة مع{' '}
              <span className="text-[#FFD23F] underline decoration-[#2D6BFF] decoration-wavy decoration-2">
                مستر فهيم!
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              مدرس فيزياء ذكي بالعربي المصري لطلاب الصف الثالث الثانوي. بيبدأ معاك من الصفر، وبيفك رموز كتاب المدرسة خطوة بخطوة، وبيحل المسائل معاك بدون حفظ، ومش بيديك الحل جاهز غير لما تفهم الفكرة!
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('overview')}
                className="px-6 py-3.5 rounded-xl bg-[#FFD23F] hover:bg-[#FFDC5E] text-[#0A1330] font-black text-base transition-all transform hover:-translate-y-0.5 shadow-lg shadow-yellow-500/20 flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-5 h-5" />
                <span>ابدأ المذاكرة (8 فصول)</span>
              </button>

              <button
                onClick={() => onNavigate('chat')}
                className="px-6 py-3.5 rounded-xl bg-[#2D6BFF] hover:bg-[#3D78FF] text-white font-bold text-base transition-all transform hover:-translate-y-0.5 shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
                <span>اتكلم مع مستر فهيم</span>
              </button>

              <button
                onClick={() => onNavigate('solver')}
                className="px-5 py-3.5 rounded-xl bg-[#12214F] hover:bg-[#1A2E6D] text-slate-200 border border-[#2D6BFF]/40 font-bold text-sm sm:text-base transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calculator className="w-5 h-5 text-[#FFD23F]" />
                <span>حل مسألة خطوة بخطوة</span>
              </button>
            </div>

            {/* Highlights row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#1E2E62]/80 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>شرح مبسط بالعامية المصرية</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>تحذير من تريكات الامتحانات</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>معامل ومحاكاة كهربائية حية</span>
              </div>
            </div>
          </div>

          {/* SVG Artwork (Left in RTL) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-[#12214F]/40 p-4 sm:p-6 rounded-3xl border border-[#2D6BFF]/30 shadow-2xl shadow-blue-950/60 backdrop-blur-sm">
              <svg
                viewBox="0 0 540 400"
                className="w-full h-auto drop-shadow-md select-none"
                role="img"
                aria-label="رسم كرتوني لمستر فهيم مدرس الفيزياء بالبالطو الأبيض وهو يشير إلى قانون أوم على السبورة"
              >
                {/* Chalkboard */}
                <rect x="10" y="30" width="340" height="230" rx="16" fill="#12214F" stroke="#8FA8FF" strokeWidth="7" />
                <text
                  x="180"
                  y="105"
                  textAnchor="middle"
                  fontFamily="'Lalezar', 'Cairo', sans-serif"
                  fontSize="58"
                  fill="#fff"
                  direction="ltr"
                >
                  V = I × R
                </text>

                {/* Circuit with animated electrons */}
                <path
                  className="electron-flow"
                  d="M60 150H300V225H60Z"
                  fill="none"
                  stroke="#FFD23F"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <rect x="40" y="170" width="40" height="34" rx="4" fill="#12214F" stroke="#fff" strokeWidth="3" />
                <text x="60" y="193" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff" fontFamily="Cairo, sans-serif">
                  V
                </text>
                {/* Resistor zig-zag */}
                <path
                  d="M150 150v0M170 150l8-14 14 28 14-28 14 28 14-28 8 14"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="3.5"
                  transform="translate(-30 0)"
                />

                {/* Mr. Faheem Character Body & Coat */}
                <path d="M352 400L358 262Q418 228 480 262L486 400Z" fill="#fff" stroke="#C9D6FF" strokeWidth="3" />
                {/* Tie */}
                <path d="M396 244L418 300L440 244Z" fill="#2D6BFF" />
                {/* Neck */}
                <rect x="408" y="212" width="22" height="34" fill="#E3A678" />

                {/* Pointing arm */}
                <path d="M368 274L308 208" stroke="#C9D6FF" strokeWidth="30" strokeLinecap="round" />
                <path d="M368 274L308 208" stroke="#fff" strokeWidth="24" strokeLinecap="round" />
                <circle cx="303" cy="202" r="13" fill="#F0BD93" />
                <path d="M303 202L262 160" stroke="#FFD23F" strokeWidth="6" strokeLinecap="round" />

                {/* Other arm holding Physics textbook */}
                <path d="M478 276L496 344" stroke="#C9D6FF" strokeWidth="30" strokeLinecap="round" />
                <path d="M478 276L496 344" stroke="#fff" strokeWidth="24" strokeLinecap="round" />
                <rect x="486" y="338" width="40" height="52" rx="5" fill="#2D6BFF" stroke="#0A1330" strokeWidth="2.5" />
                <circle cx="496" cy="346" r="11" fill="#F0BD93" />

                {/* Head */}
                <circle cx="366" cy="172" r="9" fill="#E3A678" />
                <circle cx="470" cy="172" r="9" fill="#E3A678" />
                <circle cx="418" cy="166" r="54" fill="#F0BD93" />
                {/* Hair */}
                <path d="M364 158Q366 106 418 106Q470 106 472 158Q450 134 418 136Q386 134 364 158Z" fill="#1B1B2F" />
                {/* Lightning hair tuft (electric brainstorm spark) */}
                <path
                  d="M410 62h26l-11 28h20l-40 44 10-34h-19z"
                  fill="#FFD23F"
                  stroke="#0A1330"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  className="animate-pulse"
                />
                {/* Glasses */}
                <circle cx="398" cy="168" r="15" fill="#fff" fillOpacity="0.55" stroke="#0A1330" strokeWidth="3" />
                <circle cx="438" cy="168" r="15" fill="#fff" fillOpacity="0.55" stroke="#0A1330" strokeWidth="3" />
                <path d="M413 168h10" stroke="#0A1330" strokeWidth="3" />
                {/* Eyes */}
                <circle cx="398" cy="169" r="4.5" fill="#0A1330" />
                <circle cx="438" cy="169" r="4.5" fill="#0A1330" />
                {/* Eyebrows */}
                <path d="M385 146q13-9 26-1M425 145q13-8 26 1" stroke="#1B1B2F" strokeWidth="4" fill="none" strokeLinecap="round" />
                {/* Mustache & Warm Egyptian Smile */}
                <path d="M398 188Q418 178 438 188Q418 198 398 188Z" fill="#1B1B2F" />
                <path d="M400 199Q418 214 436 199" stroke="#7A2E1D" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-300 px-2">
                <span className="font-bold text-[#FFD23F]">⚡ مع مستر فهيم: الفهم أولاً ثم الدرجة النهائية!</span>
                <button
                  onClick={onOpenVoiceModal}
                  className="text-blue-400 hover:text-blue-300 underline font-semibold cursor-pointer"
                >
                  جرّب صوته الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import {
  Calculator,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { CHAPTERS } from '../data/curriculum';
import { speakArabic, stopArabicSpeech } from '../utils/speech';

interface SolutionStructure {
  givens: string[];
  target: string;
  formula: string;
  formulaExplanation: string;
  steps: string[];
  finalAnswer: string;
  unit: string;
  examTrick: string;
}

export const ProblemSolver: React.FC = () => {
  const [problemText, setProblemText] = useState(
    'سلك مقاومته 8 أوم، تم سحبه بانتظام حتى أصبح طوله ثلاثة أمثال طوله الأصلي. احسب مقاومته الجديدة.'
  );
  const [selectedTopic, setSelectedTopic] = useState('الفصل 1: التيار والمقاومة وقانون أوم');
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<SolutionStructure | null>({
    givens: [
      'المقاومة الأصلية: R₁ = 8 Ω',
      'الطول الجديد بعد السحب: L₂ = 3 L₁',
      'الحجم الكلي للسلك يظل ثابتاً (Vol = A · L = ثابت)',
      'مساحة المقطع الجديدة تقل للثلث: A₂ = A₁ / 3',
    ],
    target: 'حساب المقاومة الجديدة للسلك (R₂)',
    formula: 'R = ρₑ · (L / A) ومنها R₂ / R₁ = (L₂ / L₁) × (A₁ / A₂) = (L₂ / L₁)² = 3² = 9',
    formulaExplanation: 'عند سحب السلك يزداد الطول على حساب مساحة المقطع فيكون التناسب مع مربع الطول طردياً.',
    steps: [
      'الخطوة 1: نحدد نسبة التغير في الطول: L₂ / L₁ = 3',
      'الخطوة 2: بما أن الحجم ثابت، فإن المساحة تقل إلى الثلث: A₂ = ⅓ A₁',
      'الخطوة 3: نعوض في نسبة المقاومات: R₂ / R₁ = (L₂ / L₁)² = 3² = 9',
      'الخطوة 4: نحسب المقاومة الجديدة: R₂ = 9 × R₁ = 9 × 8 = 72 أوم',
    ],
    finalAnswer: '72',
    unit: 'أوم (Ω)',
    examTrick:
      'إياك أن تقول إن المقاومة تزداد إلى 3 أمثال فقط! لأن السحب يغير الطول والمساحة معاً، فتزداد المقاومة بنسبة مربع الزيادة في الطول (3² = 9 أمثال).',
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const sampleProblems = [
    {
      title: 'سحب السلك وتغير المقاومة',
      topic: 'الفصل 1: المقاومة الكهربية',
      text: 'سلك مقاومته 8 أوم، تم سحبه بانتظام حتى أصبح طوله ثلاثة أمثال طوله الأصلي. احسب مقاومته الجديدة.',
    },
    {
      title: 'نقطة التعادل بين سلكين مستقيمين',
      topic: 'الفصل 2: التأثير المغناطيسي',
      text: 'سلكان مستقيمان متوازيان المسافة بينهما 20 سم يمر في الأول تيار 2 أمبير وفي الثاني تيار 6 أمبير في نفس الاتجاه. حدد موضع نقطة التعادل بالنسبة للسلك الأول.',
    },
    {
      title: 'القوة الدافعة اللحظية للدينامو',
      topic: 'الفصل 3: الحث الكهرومغناطيسي',
      text: 'ملف دينامو 100 لفة ومساحته 0.05 م² يدور في مجال مغناطيسي 0.2 تسلا بتردد 50 هرتز. احسب القوة الدافعة بعد مضي 1/300 ثانية من الوضع العمودي.',
    },
    {
      title: 'معاوقة دائرة تيار متردد RLC',
      topic: 'الفصل 4: دوائر التيار المتردد',
      text: 'دائرة RLC تحتوي على مقاومة 30 أوم وملف حث مفاعلته 70 أوم ومكثف مفاعلته 30 أوم. احسب المعاوقة الكلية للدائرة وزاوية الطور.',
    },
    {
      title: 'طاقة حركة الإلكترون الكهروضوئي',
      topic: 'الفصل 5: ازدواجية الموجة والجسيم',
      text: 'سقط ضوء تردده 1.2 × 10¹⁵ هرتز على سطح فلز دالة شغله 3 إلكترون فولت. احسب طاقة الحركة العظمى للإلكترونات المنبعثة بوحدة الإلكترون فولت.',
    },
    {
      title: 'معامل تكبير الترانزستور',
      topic: 'الفصل 8: الإلكترونيات الحديثة',
      text: 'ترانزستور تيار مجمعه 9.8 مللي أمبير وتيار باعثه 10 مللي أمبير. احسب تيار القاعدة، ونسبة التوزيع، ومعامل التكبير.',
    },
  ];

  const handleSolve = async () => {
    if (!problemText.trim() || isLoading) return;

    setIsLoading(true);
    stopArabicSpeech();
    setIsSpeaking(false);

    try {
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemText,
          topic: selectedTopic,
        }),
      });

      const data = await res.json();
      if (data.solution) {
        setSolution(data.solution);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const handleSpeakSolution = async () => {
    if (!solution) return;

    if (isSpeaking || isAudioLoading) {
      stopArabicSpeech();
      setIsSpeaking(false);
      setIsAudioLoading(false);
    } else {
      stopArabicSpeech();
      setIsAudioLoading(true);
      setIsSpeaking(false);

      const speechText = `حل المسألة مع مستر فهيم. المعطيات: ${solution.givens.join(
        '، '
      )}. المطلوب: ${solution.target}. القانون المستخدم: ${solution.formula}. النتيجة النهائية هي ${
        solution.finalAnswer
      } ${solution.unit}. وتكة مستر فهيم للامتحان: ${solution.examTrick}`;

      try {
        await speakArabic(
          speechText,
          () => {
            setIsAudioLoading(false);
            setIsSpeaking(true);
          },
          () => {
            setIsAudioLoading(false);
            setIsSpeaking(false);
          },
          (err) => {
            console.error('Audio error in solver:', err);
            setIsAudioLoading(false);
            setIsSpeaking(false);
          }
        );
      } catch (err) {
        setIsAudioLoading(false);
        setIsSpeaking(false);
      }
    }
  };

  const handleCopySolution = () => {
    if (!solution) return;
    const text = `
حل مسألة مع مستر فهيم ⚡
المعطيات:
${solution.givens.map((g) => `- ${g}`).join('\n')}

المطلوب: ${solution.target}
القانون: ${solution.formula}
التفسير: ${solution.formulaExplanation}

خطوات الحل:
${solution.steps.map((s, i) => `${i + 1}) ${s}`).join('\n')}

الناتج النهائي: ${solution.finalAnswer} ${solution.unit}
⚡ تكة مستر فهيم: ${solution.examTrick}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12214F] border border-[#2D6BFF]/40 text-xs font-bold text-[#FFD23F] mb-3">
          <Calculator className="w-4 h-4" />
          <span>المحلل الذكي المنهجي لفيزياء 3 ثانوي</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-white">
          حل المسائل خطوة بخطوة مع مستر فهيم
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-2">
          مش مجرد رقم وخلاص! بنستخرج المعطيات، بنحوّل الوحدات، بنشرح سبب اختيار القانون، وبنحذرك من مطب الامتحان.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#12214F] border border-[#2D6BFF]/30 rounded-3xl p-5 shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                اختر الفصل أو الموضوع:
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-[#0A1330] text-sm text-slate-200 border border-[#2D6BFF]/40 rounded-xl px-3 py-2 focus:outline-none focus:border-[#FFD23F]"
              >
                {CHAPTERS.map((c) => (
                  <option key={c.id} value={`الفصل ${c.id}: ${c.title}`}>
                    الفصل {c.id}: {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                اكتب أو الصق نص المسألة هنا:
              </label>
              <textarea
                rows={5}
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                placeholder="مثال: ملف دائري قطره 10 سم وعدد لفاته 50 لفة يمر به تيار 2 أمبير..."
                className="w-full bg-[#0A1330] text-sm text-slate-100 border border-[#2D6BFF]/40 rounded-2xl p-3 focus:outline-none focus:border-[#FFD23F] leading-relaxed resize-none"
              />
            </div>

            <button
              onClick={handleSolve}
              disabled={isLoading || !problemText.trim()}
              className="w-full py-3.5 rounded-2xl bg-[#FFD23F] hover:bg-[#FFDC5E] disabled:opacity-50 text-[#0A1330] font-black text-base shadow-lg shadow-yellow-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calculator className="w-5 h-5" />
              <span>{isLoading ? 'مستر فهيم بيحلل المسألة...' : 'حل المسألة خطوة بخطوة ⚡'}</span>
            </button>
          </div>

          {/* Quick Problem Samples */}
          <div className="bg-[#12214F]/60 border border-[#1E2E62] rounded-3xl p-5">
            <h4 className="text-xs font-bold text-[#FFD23F] mb-3 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>نماذج مسائل امتحانات جاهزة للحل:</span>
            </h4>
            <div className="space-y-2">
              {sampleProblems.map((sp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setProblemText(sp.text);
                    setSelectedTopic(sp.topic);
                  }}
                  className="w-full text-right p-2.5 rounded-xl bg-[#0A1330]/80 hover:bg-[#0A1330] border border-[#2D6BFF]/20 hover:border-[#2D6BFF]/60 text-xs text-slate-300 transition-all block cursor-pointer"
                >
                  <div className="font-bold text-white mb-0.5">{sp.title}</div>
                  <div className="text-[11px] text-slate-400 truncate">{sp.text}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Solution Output (7 cols) */}
        <div className="lg:col-span-7">
          {solution ? (
            <div className="bg-[#12214F] border border-[#2D6BFF]/40 rounded-3xl p-6 shadow-2xl space-y-6">
              {/* Solution Header */}
              <div className="flex items-center justify-between border-b border-[#2D6BFF]/30 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2D6BFF] flex items-center justify-center text-[#FFD23F]">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-white">خطوات الحل التفصيلي</h3>
                    <span className="text-xs text-slate-300">معتمد على منهج كتاب الوزارة</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSpeakSolution}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isSpeaking
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                        : isAudioLoading
                        ? 'bg-[#FFD23F]/20 text-[#FFD23F] border border-[#FFD23F]/30'
                        : 'bg-[#0A1330] text-slate-200 hover:text-white border border-[#2D6BFF]/40'
                    }`}
                    title={isSpeaking ? 'إيقاف الصوت' : 'استمع للشرح بصوت مستر فهيم'}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-red-400" />
                        <span>إيقاف الصوت</span>
                      </>
                    ) : isAudioLoading ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFD23F] animate-ping" />
                        <span>جاري تجهيز الصوت...</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-[#FFD23F]" />
                        <span>اسمع الحل</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCopySolution}
                    className="p-2 rounded-xl bg-[#0A1330] text-slate-300 hover:text-white border border-[#2D6BFF]/40 cursor-pointer"
                    title="نسخ الحل"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 1. Givens and Target */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#0A1330] rounded-2xl p-4 border border-[#2D6BFF]/20">
                  <h4 className="text-xs font-bold text-[#FFD23F] mb-2">1. المعطيات (مع التحويل):</h4>
                  <ul className="text-xs sm:text-sm text-slate-200 space-y-1.5 list-disc list-inside">
                    {solution.givens.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#0A1330] rounded-2xl p-4 border border-[#2D6BFF]/20">
                  <h4 className="text-xs font-bold text-[#2D6BFF] mb-2">2. المطلوب حسابه:</h4>
                  <p className="text-xs sm:text-sm text-slate-200 font-semibold">{solution.target}</p>
                </div>
              </div>

              {/* 2. Formula */}
              <div className="bg-gradient-to-r from-[#0D183D] to-[#12214F] rounded-2xl p-4 border border-[#2D6BFF]/40">
                <h4 className="text-xs font-bold text-slate-400 mb-1">3. القانون الفيزيائي المستخدم:</h4>
                <div className="font-mono-math text-base sm:text-lg font-bold text-[#FFD23F] my-1" dir="ltr">
                  {solution.formula}
                </div>
                <p className="text-xs text-slate-300 mt-1">{solution.formulaExplanation}</p>
              </div>

              {/* 3. Step-by-Step Substitution */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-2.5">4. خطوات التعويض والحل الرياضي:</h4>
                <div className="space-y-2">
                  {solution.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0A1330] rounded-xl p-3 border border-[#1E2E62] text-xs sm:text-sm text-slate-100 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#2D6BFF]/20 text-[#2D6BFF] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Final Answer Box */}
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400 block">الناتج النهائي:</span>
                  <div className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                    {solution.finalAnswer}{' '}
                    <span className="text-sm font-bold text-emerald-300">{solution.unit}</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-7 h-7" />
                </div>
              </div>

              {/* 5. Exam Trap / Mr. Faheem's Trick */}
              <div className="bg-[#FFD23F]/10 border border-[#FFD23F]/40 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-[#FFD23F] font-bold text-sm mb-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>تكة مستر فهيم ومطب الامتحان ⚡:</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
                  {solution.examTrick}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-[#12214F]/40 border border-dashed border-[#2D6BFF]/30 rounded-3xl p-12 text-center text-slate-400">
              <Calculator className="w-12 h-12 mx-auto text-[#2D6BFF] mb-3 opacity-60" />
              <p>أدخل نص أي مسألة على اليمين واضغط "حل المسألة خطوة بخطوة" عشان تشوف التحليل بالتفصيل.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

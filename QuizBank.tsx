import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  Clock,
  ArrowRight,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import { CHAPTERS, QuizQuestion } from '../data/curriculum';

interface QuizBankProps {
  initialChapterId?: number;
}

export const QuizBank: React.FC<QuizBankProps> = ({ initialChapterId = 1 }) => {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(initialChapterId);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [dynamicQuestions, setDynamicQuestions] = useState<QuizQuestion[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const activeChapter = CHAPTERS.find((c) => c.id === selectedChapterId) || CHAPTERS[0];

  // Combine static chapter questions with any dynamically generated questions
  const questionsList = [...activeChapter.questions, ...dynamicQuestions];
  const currentQuestion = questionsList[currentQuestionIdx] || questionsList[0];

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !quizFinished) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, quizFinished]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswerIdx(idx);
    setIsAnswerSubmitted(true);

    if (idx === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx + 1 < questionsList.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedAnswerIdx(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      setIsTimerRunning(false);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswerIdx(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  const handleGenerateMoreAIQuestions = async () => {
    setIsLoadingMore(true);
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterNumber: activeChapter.id,
          topicName: activeChapter.title,
        }),
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        const formatted: QuizQuestion[] = data.questions.map((q: any, i: number) => ({
          id: `ai-${Date.now()}-${i}`,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          tip: q.tip,
        }));
        setDynamicQuestions((prev) => [...prev, ...formatted]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12214F] border border-[#2D6BFF]/40 text-xs font-bold text-[#FFD23F] mb-3">
          <GraduationCap className="w-4 h-4" />
          <span>بنك الأسئلة والامتحانات التجريبية</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-white">
          اختبر فهمك على طريقة امتحانات الثانوية العامة
        </h2>
        <p className="text-sm text-slate-300 mt-2">
          أسئلة اختيار من متعدد تفكير عليا مع توضيح فوري لسبب صحة الاختيار وخطأ البدائل.
        </p>
      </div>

      {/* Chapter Selection Bar */}
      <div className="bg-[#12214F] border border-[#2D6BFF]/30 rounded-2xl p-3 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300">اختر الفصل:</span>
          <select
            value={selectedChapterId}
            onChange={(e) => {
              setSelectedChapterId(Number(e.target.value));
              setDynamicQuestions([]);
              handleRestartQuiz();
            }}
            className="bg-[#0A1330] text-xs sm:text-sm text-slate-100 border border-[#2D6BFF]/40 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#FFD23F] cursor-pointer"
          >
            {CHAPTERS.map((ch) => (
              <option key={ch.id} value={ch.id}>
                الفصل {ch.id}: {ch.title.slice(0, 36)}
              </option>
            ))}
          </select>
        </div>

        {/* Timer & Score Tracker */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-[#38BDF8] bg-[#0A1330] px-3 py-1.5 rounded-xl border border-[#2D6BFF]/30">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono-math">{formatTimer(timerSeconds)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#FFD23F] bg-[#0A1330] px-3 py-1.5 rounded-xl border border-[#2D6BFF]/30">
            <Trophy className="w-3.5 h-3.5" />
            <span>
              الدرجة: {score} / {questionsList.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Quiz Card */}
      {!quizFinished && currentQuestion ? (
        <div className="bg-[#12214F] border border-[#2D6BFF]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Question Index Progress */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold border-b border-[#2D6BFF]/20 pb-3">
            <span>
              السؤال {currentQuestionIdx + 1} من {questionsList.length}
            </span>
            <div className="flex gap-1.5">
              {questionsList.map((_, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full ${
                    i === currentQuestionIdx
                      ? 'bg-[#FFD23F]'
                      : i < currentQuestionIdx
                      ? 'bg-emerald-500'
                      : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {currentQuestion.question}
          </h3>

          {/* Options List */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, optIdx) => {
              let optStyle =
                'bg-[#0A1330] text-slate-200 border-[#2D6BFF]/30 hover:border-[#2D6BFF] hover:bg-[#0D183D]';

              if (isAnswerSubmitted) {
                if (optIdx === currentQuestion.correctIndex) {
                  optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md';
                } else if (optIdx === selectedAnswerIdx) {
                  optStyle = 'bg-red-950/60 border-red-500 text-red-200';
                } else {
                  optStyle = 'bg-[#0A1330]/50 border-slate-700 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-right p-4 rounded-2xl border text-sm sm:text-base font-semibold transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-[#12214F] border border-[#2D6BFF]/40 text-xs flex items-center justify-center font-bold text-[#FFD23F]">
                      {['أ', 'ب', 'ج', 'د'][optIdx]}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isAnswerSubmitted && optIdx === currentQuestion.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted &&
                    optIdx === selectedAnswerIdx &&
                    selectedAnswerIdx !== currentQuestion.correctIndex && (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation Box */}
          {isAnswerSubmitted && (
            <div className="mt-4 space-y-3 pt-4 border-t border-[#2D6BFF]/30 animate-fadeIn">
              <div
                className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                  selectedAnswerIdx === currentQuestion.correctIndex
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-100'
                }`}
              >
                <div className="font-bold mb-1.5 flex items-center gap-1.5 text-base">
                  {selectedAnswerIdx === currentQuestion.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>الله ينور عليك يا بطل! إجابة صحيحة ⚡</span>
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-5 h-5 text-amber-400" />
                      <span>ركز معايا عشان نفهم الفكرة صح:</span>
                    </>
                  )}
                </div>
                <p>{currentQuestion.explanation}</p>
                <div className="mt-2 text-xs font-bold text-[#FFD23F]">
                  ⚡ نصيحة مستر فهيم: {currentQuestion.tip}
                </div>
              </div>

              {/* Next Question Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-2xl bg-[#FFD23F] hover:bg-[#FFDC5E] text-[#0A1330] font-black text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-yellow-500/20"
                >
                  <span>
                    {currentQuestionIdx + 1 < questionsList.length
                      ? 'السؤال التالي'
                      : 'عرض النتيجة النهائية'}
                  </span>
                  <ArrowLeft className="w-4 h-4 rtl:rotate-0" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Final Score Card */
        <div className="bg-[#12214F] border border-[#2D6BFF]/40 rounded-3xl p-8 sm:p-12 text-center shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FFD23F] to-amber-500 text-[#0A1330] flex items-center justify-center mx-auto shadow-xl shadow-yellow-500/30">
            <Trophy className="w-10 h-10" />
          </div>

          <h3 className="font-display text-3xl sm:text-4xl text-white">
            عاش يا وحش الفيزياء! أنهيت الاختبار
          </h3>

          <div className="max-w-xs mx-auto bg-[#0A1330] border border-[#2D6BFF]/40 rounded-2xl p-4 text-center">
            <span className="text-xs text-slate-400 font-bold block mb-1">النتيجة النهائية:</span>
            <div className="text-4xl font-black text-[#FFD23F]">
              {score} / {questionsList.length}
            </div>
            <span className="text-xs text-emerald-400 font-bold block mt-1">
              النسبة المئوية: {Math.round((score / (questionsList.length || 1)) * 100)}%
            </span>
          </div>

          <p className="text-sm text-slate-300 max-w-md mx-auto">
            {score === questionsList.length
              ? 'ممتاز جداً! فهمك للمفاهيم ممتاز وتريكات الامتحان مش هتقف قدامك.'
              : 'مجهود رائع! راجع النقاط اللي غلطت فيها وراجع ملخص الفصل وهتبقى أستاذ.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-3 rounded-2xl bg-[#2D6BFF] hover:bg-[#3D78FF] text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار</span>
            </button>

            <button
              onClick={handleGenerateMoreAIQuestions}
              disabled={isLoadingMore}
              className="px-6 py-3 rounded-2xl bg-[#FFD23F] hover:bg-[#FFDC5E] disabled:opacity-50 text-[#0A1330] font-black text-sm flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoadingMore ? 'مستر فهيم بيجهز أسئلة جديدة...' : 'توليد أسئلة ذكاء اصطناعي جديدة ⚡'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

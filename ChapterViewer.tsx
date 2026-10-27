import React, { useState } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  Calculator,
  MessageSquare,
  GraduationCap,
  BookmarkCheck,
  Zap,
} from 'lucide-react';
import { CHAPTERS, Chapter } from '../data/curriculum';
import { NavTab } from './Navbar';

interface ChapterViewerProps {
  onNavigate: (tab: NavTab) => void;
  onSelectChapterForChat: (id: number) => void;
  onSolveProblemText: (text: string) => void;
  onStartQuizForChapter: (id: number) => void;
}

export const ChapterViewer: React.FC<ChapterViewerProps> = ({
  onNavigate,
  onSelectChapterForChat,
  onSolveProblemText,
  onStartQuizForChapter,
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const [expandedTopicIdx, setExpandedTopicIdx] = useState<number | null>(0);

  const selectedChapter = CHAPTERS.find((c) => c.id === selectedChapterId) || CHAPTERS[0];

  const unit1Chapters = CHAPTERS.filter((c) => c.unitId === 1);
  const unit2Chapters = CHAPTERS.filter((c) => c.unitId === 2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12214F] border border-[#2D6BFF]/40 text-xs font-bold text-[#FFD23F] mb-3">
          <BookOpen className="w-4 h-4" />
          <span>فهرس كتاب الوزارة الكامل — 8 فصول</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-white">
          منهج فيزياء الصف الثالث الثانوي خطوة بخطوة
        </h2>
        <p className="text-sm text-slate-300 mt-2">
          اختر أي فصل لقراءة ملخص المفاهيم، مراجعة القوانين، تجنب تريكات الامتحانات، وبدء التدريب التفاعلي.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Chapters List (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Unit 1 */}
          <div className="bg-[#12214F] border border-[#2D6BFF]/30 rounded-3xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2D6BFF]/30">
              <span className="font-display text-base text-[#FFD23F]">الوحدة الأولى: الكهربية</span>
              <span className="text-[11px] text-slate-400 font-semibold">ص 1 – 105</span>
            </div>
            <div className="space-y-1.5">
              {unit1Chapters.map((ch) => {
                const isSelected = ch.id === selectedChapterId;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setSelectedChapterId(ch.id);
                      setExpandedTopicIdx(0);
                    }}
                    className={`w-full text-right p-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#2D6BFF] text-white shadow-md shadow-blue-600/30'
                        : 'bg-[#0A1330]/70 text-slate-300 hover:text-white hover:bg-[#0A1330]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white text-[#0A1330]' : 'bg-[#12214F] text-[#FFD23F]'
                        }`}
                      >
                        {ch.id}
                      </span>
                      <span className="truncate">{ch.title}</span>
                    </div>
                    <span className="text-[10px] opacity-75 shrink-0">{ch.pageRange}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unit 2 */}
          <div className="bg-[#12214F] border border-[#2D6BFF]/30 rounded-3xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2D6BFF]/30">
              <span className="font-display text-base text-[#38BDF8]">الوحدة الثانية: الفيزياء الحديثة</span>
              <span className="text-[11px] text-slate-400 font-semibold">ص 106 – 174</span>
            </div>
            <div className="space-y-1.5">
              {unit2Chapters.map((ch) => {
                const isSelected = ch.id === selectedChapterId;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setSelectedChapterId(ch.id);
                      setExpandedTopicIdx(0);
                    }}
                    className={`w-full text-right p-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#2D6BFF] text-white shadow-md shadow-blue-600/30'
                        : 'bg-[#0A1330]/70 text-slate-300 hover:text-white hover:bg-[#0A1330]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white text-[#0A1330]' : 'bg-[#12214F] text-[#38BDF8]'
                        }`}
                      >
                        {ch.id}
                      </span>
                      <span className="truncate">{ch.title}</span>
                    </div>
                    <span className="text-[10px] opacity-75 shrink-0">{ch.pageRange}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Main Content: Selected Chapter Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Chapter Header Banner */}
          <div className="bg-gradient-to-r from-[#12214F] to-[#0D183D] border border-[#2D6BFF]/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#FFD23F] font-bold mb-2">
              <span>{selectedChapter.unitName}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#0A1330] border border-[#FFD23F]/30">
                صفحات الكتاب: {selectedChapter.pageRange}
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl text-white mb-2">
              الفصل {selectedChapter.id}: {selectedChapter.title}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {selectedChapter.summary}
            </p>

            {/* Quick Actions for this Chapter */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[#2D6BFF]/30">
              <button
                onClick={() => {
                  onSelectChapterForChat(selectedChapter.id);
                  onNavigate('chat');
                }}
                className="px-4 py-2 rounded-xl bg-[#2D6BFF] hover:bg-[#3D78FF] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>اسأل مستر فهيم في هذا الفصل</span>
              </button>

              <button
                onClick={() => {
                  onSolveProblemText(selectedChapter.quickProblemExample.text);
                  onNavigate('solver');
                }}
                className="px-4 py-2 rounded-xl bg-[#0A1330] hover:bg-[#12214F] text-slate-200 border border-[#2D6BFF]/40 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5 text-[#FFD23F]" />
                <span>حل مسألة نموذجية</span>
              </button>

              <button
                onClick={() => {
                  onStartQuizForChapter(selectedChapter.id);
                  onNavigate('quiz');
                }}
                className="px-4 py-2 rounded-xl bg-[#FFD23F] hover:bg-[#FFDC5E] text-[#0A1330] text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>بدء اختبار الفصل</span>
              </button>
            </div>
          </div>

          {/* Interactive Subtopics Accordion */}
          <div className="bg-[#12214F] border border-[#2D6BFF]/30 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="font-display text-xl text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#FFD23F]" />
              <span>دروس ومفاهيم الفصل:</span>
            </h4>

            <div className="space-y-2.5">
              {selectedChapter.topics.map((topic, idx) => {
                const isOpen = expandedTopicIdx === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[#2D6BFF]/30 rounded-2xl overflow-hidden bg-[#0A1330]/80 transition-all"
                  >
                    <button
                      onClick={() => setExpandedTopicIdx(isOpen ? null : idx)}
                      className="w-full text-right p-4 flex items-center justify-between text-sm sm:text-base font-bold text-white hover:bg-[#12214F] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-[#2D6BFF]/20 text-[#2D6BFF] text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span>{topic.title}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isOpen ? 'rotate-180 text-[#FFD23F]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="p-4 pt-1 border-t border-[#1E2E62] bg-[#0A1330]/50 space-y-3 text-xs sm:text-sm text-slate-300">
                        <p className="leading-relaxed">{topic.description}</p>
                        <div className="bg-[#12214F] rounded-xl p-3 border border-[#2D6BFF]/20">
                          <span className="text-[11px] font-bold text-[#FFD23F] block mb-1.5">
                            النقاط والقوانين المحورية:
                          </span>
                          <ul className="space-y-1 list-disc list-inside text-slate-200">
                            {topic.keyPoints.map((pt, pIdx) => (
                              <li key={pIdx}>{pt}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Formulas in this Chapter */}
          <div className="bg-[#12214F] border border-[#2D6BFF]/30 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="font-display text-xl text-white flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-[#38BDF8]" />
              <span>أهم قوانين الفصل:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedChapter.formulas.map((form, fIdx) => (
                <div
                  key={fIdx}
                  className="bg-[#0A1330] border border-[#2D6BFF]/30 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-300 block mb-1">{form.name}</span>
                    <div className="font-mono-math text-base sm:text-lg font-bold text-[#FFD23F] my-1" dir="ltr">
                      {form.expression}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#1E2E62] text-[11px] text-slate-400">
                    {form.note}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Traps Alert */}
          <div className="bg-[#FFD23F]/10 border border-[#FFD23F]/40 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 text-[#FFD23F] font-bold text-base mb-3">
              <AlertTriangle className="w-5 h-5" />
              <span>تريكات ومطبات امتحانات الوزارة في الفصل {selectedChapter.id} ⚡:</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-amber-100 list-disc list-inside leading-relaxed">
              {selectedChapter.examTraps.map((trap, tIdx) => (
                <li key={tIdx}>{trap}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

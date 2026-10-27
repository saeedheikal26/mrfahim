import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ChapterViewer } from './components/ChapterViewer';
import { ChatTutor } from './components/ChatTutor';
import { ProblemSolver } from './components/ProblemSolver';
import { InteractiveLabs } from './components/InteractiveLabs';
import { QuizBank } from './components/QuizBank';
import { FormulaSheet } from './components/FormulaSheet';
import { VoiceModal } from './components/VoiceModal';
import { stopArabicSpeech } from './utils/speech';
import { Zap, Heart, BookOpen, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);

  const handleStopSpeaking = () => {
    stopArabicSpeech();
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-[#0A1330] text-slate-100 flex flex-col selection:bg-[#FFD23F] selection:text-[#0A1330]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        isSpeaking={isSpeaking}
        onStopSpeaking={handleStopSpeaking}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Render Hero only on overview tab */}
        {activeTab === 'overview' && (
          <HeroSection
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          />
        )}

        {/* Tab Views */}
        {activeTab === 'overview' && (
          <ChapterViewer
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectChapterForChat={(id) => {
              setSelectedChapterId(id);
              setActiveTab('chat');
            }}
            onSolveProblemText={(text) => {
              setActiveTab('solver');
            }}
            onStartQuizForChapter={(id) => {
              setSelectedChapterId(id);
              setActiveTab('quiz');
            }}
          />
        )}

        {activeTab === 'chat' && (
          <ChatTutor
            selectedChapterId={selectedChapterId}
            onSelectChapter={(id) => setSelectedChapterId(id)}
          />
        )}

        {activeTab === 'solver' && <ProblemSolver />}

        {activeTab === 'labs' && <InteractiveLabs />}

        {activeTab === 'quiz' && <QuizBank initialChapterId={selectedChapterId} />}

        {activeTab === 'formulas' && <FormulaSheet />}
      </main>

      {/* Footer */}
      <footer className="bg-[#070D22] border-t border-[#1E2E62] py-8 text-xs sm:text-sm text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2D6BFF]/20 border border-[#2D6BFF]/40 flex items-center justify-center text-[#FFD23F]">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <span className="font-display text-lg text-white block">مستر فهيم — وحش الفيزياء</span>
              <span className="text-[11px] text-slate-400">
                مدرس ذكاء اصطناعي تفاعلي لمنهج الثانوية العامة المصرية (كتاب المدرسة).
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-300">
              صُنع بحب لطلاب مصر 🇪🇬 ⚡ الفهم أولاً ثم الدرجة النهائية!
            </span>
          </div>
        </div>
      </footer>

      {/* Voice Testing Dialog */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSpeechStarted={() => setIsSpeaking(true)}
        onSpeechStopped={() => setIsSpeaking(false)}
      />
    </div>
  );
}

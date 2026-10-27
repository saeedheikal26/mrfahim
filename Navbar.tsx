import React from 'react';
import {
  Sparkles,
  BookOpen,
  MessageSquareText,
  Calculator,
  FlaskConical,
  GraduationCap,
  BookmarkCheck,
  Volume2,
} from 'lucide-react';

export type NavTab = 'overview' | 'chat' | 'solver' | 'labs' | 'quiz' | 'formulas';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenVoiceModal: () => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenVoiceModal,
  isSpeaking,
  onStopSpeaking,
}) => {
  const tabs = [
    { id: 'overview' as NavTab, label: 'المنهج والوحدات', icon: BookOpen },
    { id: 'chat' as NavTab, label: 'كلّم مستر فهيم', icon: MessageSquareText, badge: 'ذكاء اصطناعي' },
    { id: 'solver' as NavTab, label: 'محلل المسائل', icon: Calculator, badge: 'خطوة بخطوة' },
    { id: 'labs' as NavTab, label: 'المعمل التفاعلي', icon: FlaskConical },
    { id: 'quiz' as NavTab, label: 'بنك الامتحانات', icon: GraduationCap },
    { id: 'formulas' as NavTab, label: 'مفكرة القوانين', icon: BookmarkCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A1330]/95 backdrop-blur-md border-b border-[#1E2E62]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <button
            onClick={() => onTabChange('overview')}
            className="flex items-center gap-3 text-right group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#2D6BFF] to-[#12214F] border border-[#3E7BFF]/40 flex items-center justify-center shadow-lg shadow-blue-900/40 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#FFD23F] fill-current animate-pulse">
                <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
              </svg>
            </div>
            <div>
              <span className="font-display text-2xl sm:text-3xl tracking-wide text-white block leading-tight">
                مستر فهيم
              </span>
              <span className="text-xs text-[#FFD23F] font-bold tracking-wider -mt-1 block">
                وحش فيزياء 3 ثانوي ⚡
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#2D6BFF] text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-[#12214F]/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-[#FFD23F] text-[#0A1330]'
                          : 'bg-[#2D6BFF]/30 text-[#8FB3FF] border border-[#2D6BFF]/40'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isSpeaking && (
              <button
                onClick={onStopSpeaking}
                className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors animate-pulse"
                title="إيقاف الصوت"
              >
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                إيقاف مستر فهيم
              </button>
            )}

            <button
              onClick={onOpenVoiceModal}
              className="px-3 sm:px-4 py-2 rounded-xl bg-[#12214F] hover:bg-[#1B2F6E] border border-[#2D6BFF]/40 text-xs sm:text-sm font-bold text-[#E6EEFF] flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              title="إعدادات واختبار الصوت العربي"
            >
              <Volume2 className="w-4 h-4 text-[#FFD23F]" />
              <span className="hidden sm:inline">صوت مستر فهيم</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet scrollable navigation */}
        <div className="lg:hidden flex items-center gap-2 py-2.5 overflow-x-auto no-scrollbar border-t border-[#1E2E62]/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'bg-[#2D6BFF] text-white shadow-sm'
                    : 'bg-[#12214F]/60 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

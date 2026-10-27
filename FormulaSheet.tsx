import React, { useState } from 'react';
import { BookmarkCheck, Search, Copy, Check, Zap, Layers } from 'lucide-react';
import { CHAPTERS, PHYSICAL_CONSTANTS } from '../data/curriculum';

export const FormulaSheet: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<number | 'all'>('all');
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);

  const allFormulas = CHAPTERS.flatMap((ch) =>
    ch.formulas.map((f) => ({
      ...f,
      chapterId: ch.id,
      chapterTitle: ch.title,
    }))
  );

  const filteredFormulas = allFormulas.filter((f) => {
    const matchesChapter = selectedChapterFilter === 'all' || f.chapterId === selectedChapterFilter;
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.expression.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.chapterTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesChapter && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSymbol(id);
    setTimeout(() => setCopiedSymbol(null), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12214F] border border-[#2D6BFF]/40 text-xs font-bold text-[#FFD23F] mb-3">
          <BookmarkCheck className="w-4 h-4" />
          <span>مفكرة القوانين والثوابت الفيزيائية الكاملة</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-white">
          كل قوانين وثوابت فيزياء 3 ثانوي في مكان واحد
        </h2>
        <p className="text-sm text-slate-300 mt-2">
          بحث فوري بالاسم، الرمز، أو الفصل مع الوحدات الدولية والملاحظات الهامة.
        </p>
      </div>

      {/* Physical Constants Strip */}
      <div className="bg-[#12214F] border border-[#2D6BFF]/30 rounded-3xl p-5 mb-8 shadow-xl">
        <h3 className="font-display text-lg text-white mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#FFD23F]" />
          <span>الثوابت الفيزيائية العامة المقررة:</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {PHYSICAL_CONSTANTS.map((c) => (
            <div
              key={c.symbol}
              onClick={() => handleCopy(`${c.name}: ${c.symbol} = ${c.value} ${c.unit}`, c.symbol)}
              className="bg-[#0A1330] border border-[#2D6BFF]/20 hover:border-[#FFD23F]/50 rounded-2xl p-3 cursor-pointer transition-all hover:scale-102 flex flex-col justify-between"
              title="انقر لنسخ القيمة"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>{c.name}</span>
                  {copiedSymbol === c.symbol ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-40" />
                  )}
                </div>
                <div className="font-mono-math text-base font-bold text-[#FFD23F]">
                  {c.symbol} = {c.value}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">{c.unit}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-[#12214F]/70 p-3 rounded-2xl border border-[#2D6BFF]/30">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن أي قانون (مثال: أوم، فاراداي، كومتون، رنين)..."
            className="w-full bg-[#0A1330] text-sm text-slate-100 placeholder-slate-400 border border-[#2D6BFF]/40 rounded-xl pr-9 pl-3 py-2 focus:outline-none focus:border-[#FFD23F]"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-300 font-bold whitespace-nowrap">الفصل:</label>
          <select
            value={selectedChapterFilter}
            onChange={(e) =>
              setSelectedChapterFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="bg-[#0A1330] text-xs sm:text-sm text-slate-200 border border-[#2D6BFF]/40 rounded-xl px-3 py-2 focus:outline-none focus:border-[#FFD23F] cursor-pointer"
          >
            <option value="all">كل الفصول الثمانية</option>
            {CHAPTERS.map((ch) => (
              <option key={ch.id} value={ch.id}>
                فصل {ch.id}: {ch.title.slice(0, 30)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Formulas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFormulas.map((form, idx) => (
          <div
            key={idx}
            className="bg-[#12214F] border border-[#2D6BFF]/30 rounded-3xl p-5 shadow-lg flex flex-col justify-between hover:border-[#2D6BFF]/70 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-bold text-[#38BDF8]">
                  فصل {form.chapterId}: {form.chapterTitle}
                </span>
                <button
                  onClick={() => handleCopy(`${form.name}: ${form.expression}`, `f-${idx}`)}
                  className="p-1.5 rounded-lg bg-[#0A1330] text-slate-300 hover:text-white border border-[#2D6BFF]/20"
                  title="نسخ القانون"
                >
                  {copiedSymbol === `f-${idx}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <h4 className="font-bold text-white text-base mb-2">{form.name}</h4>

              <div
                className="bg-[#0A1330] border border-[#2D6BFF]/40 rounded-2xl p-3 my-2 font-mono-math text-base sm:text-lg font-black text-[#FFD23F] text-center"
                dir="ltr"
              >
                {form.expression}
              </div>

              {/* Variables List */}
              <div className="space-y-1.5 mt-3 pt-3 border-t border-[#1E2E62] text-xs">
                <span className="font-bold text-slate-300 block mb-1">دلالة الرموز والوحدات:</span>
                {form.variables.map((v, vIdx) => (
                  <div key={vIdx} className="flex justify-between items-center text-slate-300 py-0.5">
                    <span>
                      <b className="text-white font-mono">{v.symbol}</b>: {v.name}
                    </span>
                    <span className="text-[11px] text-[#38BDF8] font-mono bg-[#0A1330] px-1.5 py-0.5 rounded">
                      {v.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-[#2D6BFF]/20 text-[11px] text-amber-200">
              ⚡ <b>ملاحظة وتكة:</b> {form.note}
            </div>
          </div>
        ))}
      </div>

      {filteredFormulas.length === 0 && (
        <div className="text-center py-12 text-slate-400 bg-[#12214F]/40 rounded-3xl border border-dashed border-[#2D6BFF]/30">
          لم يتم العثور على قوانين تطابق بحثك. جرب كلمة بحث أخرى!
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Sliders,
  Zap,
  Activity,
  Layers,
  Lightbulb,
  Cpu,
  RefreshCw,
  Info,
  CheckCircle2,
} from 'lucide-react';

type LabType = 'ohms' | 'resonance' | 'logic';

export const InteractiveLabs: React.FC = () => {
  const [activeLab, setActiveLab] = useState<LabType>('ohms');

  // Ohm's Lab State
  const [voltage, setVoltage] = useState(12); // Volts
  const [resistor1, setResistor1] = useState(6); // Ohms
  const [resistor2, setResistor2] = useState(6); // Ohms
  const [connectionMode, setConnectionMode] = useState<'single' | 'series' | 'parallel'>('single');

  // AC Resonance Lab State
  const [inductanceMilliH, setInductanceMilliH] = useState(20); // mH
  const [capacitanceMicroF, setCapacitanceMicroF] = useState(50); // microF
  const [resistorAC, setResistorAC] = useState(10); // Ohm

  // Logic Gates Lab State
  const [selectedGate, setSelectedGate] = useState<'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR'>('AND');
  const [inputA, setInputA] = useState<0 | 1>(1);
  const [inputB, setInputB] = useState<0 | 1>(0);

  // Ohm's Law Computations
  let equivalentResistance = resistor1;
  if (connectionMode === 'series') {
    equivalentResistance = resistor1 + resistor2;
  } else if (connectionMode === 'parallel') {
    equivalentResistance = Number(((resistor1 * resistor2) / (resistor1 + resistor2)).toFixed(2));
  }
  const current = Number((voltage / (equivalentResistance || 1)).toFixed(2));
  const power = Number((voltage * current).toFixed(2));
  // Bulb brightness calculation (0 to 1)
  const bulbBrightness = Math.min(1, power / 100);

  // Resonance Calculations
  const L_Henrys = inductanceMilliH * 1e-3;
  const C_Farads = capacitanceMicroF * 1e-6;
  const resonanceFreqHz = Number((1 / (2 * Math.PI * Math.sqrt(L_Henrys * C_Farads))).toFixed(1));
  const omega = 2 * Math.PI * resonanceFreqHz;
  const XL = Number((omega * L_Henrys).toFixed(1));
  const XC = Number((1 / (omega * C_Farads)).toFixed(1));

  // Logic Gate Output Computation
  let gateOutput: 0 | 1 = 0;
  if (selectedGate === 'AND') {
    gateOutput = inputA === 1 && inputB === 1 ? 1 : 0;
  } else if (selectedGate === 'OR') {
    gateOutput = inputA === 1 || inputB === 1 ? 1 : 0;
  } else if (selectedGate === 'NOT') {
    gateOutput = inputA === 1 ? 0 : 1;
  } else if (selectedGate === 'NAND') {
    gateOutput = !(inputA === 1 && inputB === 1) ? 1 : 0;
  } else if (selectedGate === 'NOR') {
    gateOutput = !(inputA === 1 || inputB === 1) ? 1 : 0;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12214F] border border-[#2D6BFF]/40 text-xs font-bold text-[#FFD23F] mb-3">
          <Activity className="w-4 h-4" />
          <span>المعمل الافتراضي التفاعلي</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-white">
          جرّب الفيزياء بنفسك ولا تحفظ بدون فهم
        </h2>
        <p className="text-sm text-slate-300 mt-2">
          غيّر القيم في الدوائر وشاهد بالعين حركة الإلكترونات، إضاءة المصابيح، حالة الرنين، وجداول الصواب للبوابات المنطقية.
        </p>
      </div>

      {/* Lab Selector Tabs */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setActiveLab('ohms')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeLab === 'ohms'
              ? 'bg-[#2D6BFF] text-white shadow-lg shadow-blue-600/30'
              : 'bg-[#12214F] text-slate-300 hover:text-white border border-[#2D6BFF]/30'
          }`}
        >
          <Zap className="w-4 h-4 text-[#FFD23F]" />
          <span>معمل قانون أوم والمقاومات</span>
        </button>

        <button
          onClick={() => setActiveLab('resonance')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeLab === 'resonance'
              ? 'bg-[#2D6BFF] text-white shadow-lg shadow-blue-600/30'
              : 'bg-[#12214F] text-slate-300 hover:text-white border border-[#2D6BFF]/30'
          }`}
        >
          <Activity className="w-4 h-4 text-[#FFD23F]" />
          <span>معمل الرنين في دوائر التيار المتردد</span>
        </button>

        <button
          onClick={() => setActiveLab('logic')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeLab === 'logic'
              ? 'bg-[#2D6BFF] text-white shadow-lg shadow-blue-600/30'
              : 'bg-[#12214F] text-slate-300 hover:text-white border border-[#2D6BFF]/30'
          }`}
        >
          <Cpu className="w-4 h-4 text-[#FFD23F]" />
          <span>معمل البوابات المنطقية (الفصل 8)</span>
        </button>
      </div>

      {/* LAB 1: OHM'S LAW */}
      {activeLab === 'ohms' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 bg-[#12214F] border border-[#2D6BFF]/30 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="font-display text-xl text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#FFD23F]" />
              <span>التحكم في قيم الدائرة:</span>
            </h3>

            {/* Connection Mode */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">نوع توصيل المقاومات:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'single', label: 'مقاومة مفردة' },
                  { id: 'series', label: 'توالي (R1+R2)' },
                  { id: 'parallel', label: 'توازي (R1||R2)' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setConnectionMode(mode.id as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      connectionMode === mode.id
                        ? 'bg-[#FFD23F] text-[#0A1330]'
                        : 'bg-[#0A1330] text-slate-300 hover:text-white border border-[#2D6BFF]/30'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voltage Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-200 mb-1">
                <span>فرق الجهد الكهربي (V):</span>
                <span className="font-mono-math text-sm text-[#FFD23F] font-bold">{voltage} V</span>
              </div>
              <input
                type="range"
                min="1"
                max="48"
                step="1"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full accent-[#FFD23F] cursor-pointer"
              />
            </div>

            {/* Resistor 1 Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-200 mb-1">
                <span>المقاومة R1:</span>
                <span className="font-mono-math text-sm text-[#38BDF8] font-bold">{resistor1} Ω</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={resistor1}
                onChange={(e) => setResistor1(Number(e.target.value))}
                className="w-full accent-[#38BDF8] cursor-pointer"
              />
            </div>

            {/* Resistor 2 Slider (if series or parallel) */}
            {connectionMode !== 'single' && (
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-200 mb-1">
                  <span>المقاومة R2:</span>
                  <span className="font-mono-math text-sm text-[#38BDF8] font-bold">{resistor2} Ω</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={resistor2}
                  onChange={(e) => setResistor2(Number(e.target.value))}
                  className="w-full accent-[#38BDF8] cursor-pointer"
                />
              </div>
            )}

            {/* Calculations Dashboard */}
            <div className="bg-[#0A1330] rounded-2xl p-4 border border-[#2D6BFF]/40 space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-[#2D6BFF]/20 pb-2">
                <span className="text-slate-400">المقاومة المكافئة (Req):</span>
                <span className="font-mono-math font-bold text-white text-base">
                  {equivalentResistance} Ω
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-[#2D6BFF]/20 pb-2">
                <span className="text-slate-400">شدة التيار المار (I = V/R):</span>
                <span className="font-mono-math font-black text-emerald-400 text-lg">
                  {current} A
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">القدرة الكهربية المستهلكة (P = V·I):</span>
                <span className="font-mono-math font-bold text-[#FFD23F] text-base">
                  {power} Watt
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Circuit Visualization (7 cols) */}
          <div className="lg:col-span-7 bg-[#0D183D] border border-[#2D6BFF]/40 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#FFD23F]">محاكاة الدائرة الكهربية وحركة الشحنات</span>
              <span className="text-xs text-slate-400">سرعة الإلكترونات تتناسب طردياً مع التيار I</span>
            </div>

            {/* Visual Circuit Diagram SVG */}
            <div className="relative py-4 flex items-center justify-center">
              <svg viewBox="0 0 500 280" className="w-full max-w-lg h-auto select-none">
                {/* Wires */}
                <rect
                  x="50"
                  y="40"
                  width="400"
                  height="200"
                  rx="16"
                  fill="none"
                  stroke="#2D6BFF"
                  strokeWidth="6"
                />

                {/* Animated electron flow */}
                <rect
                  x="50"
                  y="40"
                  width="400"
                  height="200"
                  rx="16"
                  fill="none"
                  stroke="#FFD23F"
                  strokeWidth="3"
                  className="electron-flow"
                  style={{
                    animationDuration: `${Math.max(0.3, 2.5 / (current || 0.1))}s`,
                  }}
                />

                {/* Battery at bottom */}
                <g transform="translate(210, 220)">
                  <rect x="-30" y="-15" width="80" height="30" rx="4" fill="#12214F" stroke="#8FA8FF" strokeWidth="2" />
                  {/* Positive Long plate */}
                  <line x1="-10" y1="-12" x2="-10" y2="12" stroke="#FFD23F" strokeWidth="4" />
                  {/* Negative Short plate */}
                  <line x1="5" y1="-7" x2="5" y2="7" stroke="#fff" strokeWidth="4" />
                  <text x="25" y="5" fill="#FFD23F" fontSize="12" fontWeight="bold">
                    {voltage}V
                  </text>
                  <text x="-22" y="5" fill="#FFD23F" fontSize="11" fontWeight="bold">
                    +
                  </text>
                </g>

                {/* Light Bulb at Top */}
                <g transform="translate(250, 40)">
                  {/* Glowing halo */}
                  <circle
                    cx="0"
                    cy="0"
                    r={20 + bulbBrightness * 25}
                    fill="#FFD23F"
                    opacity={bulbBrightness * 0.75}
                    className="transition-all duration-300"
                  />
                  {/* Bulb body */}
                  <circle cx="0" cy="0" r="16" fill="#12214F" stroke="#FFD23F" strokeWidth="3" />
                  {/* Filament */}
                  <path d="M-6 6 L0 -6 L6 6" fill="none" stroke="#FFD23F" strokeWidth="2.5" />
                  <text x="0" y="32" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">
                    المصباح ({power}W)
                  </text>
                </g>

                {/* Resistor(s) on Left Wire */}
                <g transform="translate(50, 140)">
                  {connectionMode === 'single' && (
                    <g>
                      <rect x="-18" y="-30" width="36" height="60" rx="6" fill="#12214F" stroke="#38BDF8" strokeWidth="3" />
                      <text x="0" y="5" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="bold">
                        {resistor1}Ω
                      </text>
                    </g>
                  )}

                  {connectionMode === 'series' && (
                    <g>
                      <rect x="-16" y="-55" width="32" height="45" rx="5" fill="#12214F" stroke="#38BDF8" strokeWidth="2.5" />
                      <text x="0" y="-28" textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="bold">
                        R1: {resistor1}Ω
                      </text>
                      <rect x="-16" y="10" width="32" height="45" rx="5" fill="#12214F" stroke="#38BDF8" strokeWidth="2.5" />
                      <text x="0" y="38" textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="bold">
                        R2: {resistor2}Ω
                      </text>
                    </g>
                  )}

                  {connectionMode === 'parallel' && (
                    <g>
                      {/* Parallel branch 1 */}
                      <path d="M0 -40 H-25 V40 H0" fill="none" stroke="#2D6BFF" strokeWidth="4" />
                      <rect x="-35" y="-18" width="20" height="36" rx="4" fill="#12214F" stroke="#38BDF8" strokeWidth="2" />
                      <text x="-25" y="4" textAnchor="middle" fill="#38BDF8" fontSize="9" fontWeight="bold">
                        {resistor1}Ω
                      </text>

                      {/* Parallel branch 2 */}
                      <path d="M0 -40 H25 V40 H0" fill="none" stroke="#2D6BFF" strokeWidth="4" />
                      <rect x="15" y="-18" width="20" height="36" rx="4" fill="#12214F" stroke="#38BDF8" strokeWidth="2" />
                      <text x="25" y="4" textAnchor="middle" fill="#38BDF8" fontSize="9" fontWeight="bold">
                        {resistor2}Ω
                      </text>
                    </g>
                  )}
                </g>

                {/* Ammeter on Right Wire */}
                <g transform="translate(450, 140)">
                  <circle cx="0" cy="0" r="22" fill="#12214F" stroke="#10B981" strokeWidth="3" />
                  <text x="0" y="-3" textAnchor="middle" fill="#10B981" fontSize="13" fontWeight="bold">
                    A
                  </text>
                  <text x="0" y="13" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                    {current}A
                  </text>
                </g>
              </svg>
            </div>

            {/* Explanation Note */}
            <div className="bg-[#12214F] rounded-2xl p-4 border border-[#2D6BFF]/30 text-xs text-slate-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#FFD23F] shrink-0 mt-0.5" />
              <div>
                <b className="text-[#FFD23F]">ملاحظة مستر فهيم:</b> لاحظ أن توصيل المقاومات على التوازي جعل المقاومة المكافئة ({equivalentResistance} أوم) أصغر من أي مقاومة فيهما، مما رفع شدة التيار الكهربي الكلي وزاد من توهج المصباح!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAB 2: AC RESONANCE */}
      {activeLab === 'resonance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-[#12214F] border border-[#2D6BFF]/30 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="font-display text-xl text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#FFD23F]" />
              <span>معامل الحث وسعة المكثف:</span>
            </h3>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-200 mb-1">
                <span>معامل الحث الذاتي للملف (L):</span>
                <span className="font-mono-math text-sm text-[#FFD23F] font-bold">{inductanceMilliH} mH</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={inductanceMilliH}
                onChange={(e) => setInductanceMilliH(Number(e.target.value))}
                className="w-full accent-[#FFD23F] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-200 mb-1">
                <span>سعة المكثف (C):</span>
                <span className="font-mono-math text-sm text-[#38BDF8] font-bold">{capacitanceMicroF} μF</span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={capacitanceMicroF}
                onChange={(e) => setCapacitanceMicroF(Number(e.target.value))}
                className="w-full accent-[#38BDF8] cursor-pointer"
              />
            </div>

            <div className="bg-[#0A1330] rounded-2xl p-4 border border-[#2D6BFF]/40 space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-[#2D6BFF]/20 pb-2">
                <span className="text-slate-400">تردد الرنين (f₀ = 1 / 2π√LC):</span>
                <span className="font-mono-math font-black text-[#FFD23F] text-lg">
                  {resonanceFreqHz} Hz
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-[#2D6BFF]/20 pb-2">
                <span className="text-slate-400">المفاعلة الحثية (XL = 2πfL):</span>
                <span className="font-mono-math font-bold text-white text-sm">{XL} Ω</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-[#2D6BFF]/20 pb-2">
                <span className="text-slate-400">المفاعلة السعوية (XC = 1/2πfC):</span>
                <span className="font-mono-math font-bold text-white text-sm">{XC} Ω</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">حالة الدائرة:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  رنين تام (XL = XC, Z = R, θ = 0°)
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#0D183D] border border-[#2D6BFF]/40 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
            <h4 className="font-display text-lg text-white mb-2">منحنى الرنين وشهدة التيار:</h4>
            <p className="text-xs text-slate-300 mb-4">
              في حالة الرنين تكون المعاوقة Z أقل ما يمكن وتساوي المقاومة الأومية R، وبالتالي يمر أقصى تيار ممكن في الدائرة!
            </p>

            {/* SVG Resonance Curve */}
            <div className="bg-[#0A1330] rounded-2xl p-4 border border-[#1E2E62]">
              <svg viewBox="0 0 500 220" className="w-full h-auto select-none">
                {/* Axes */}
                <line x1="50" y1="180" x2="450" y2="180" stroke="#52608A" strokeWidth="2" />
                <line x1="50" y1="180" x2="50" y2="20" stroke="#52608A" strokeWidth="2" />
                <text x="450" y="200" fill="#9FB3F2" fontSize="12" textAnchor="end">
                  التردد f (Hz)
                </text>
                <text x="40" y="25" fill="#9FB3F2" fontSize="12" textAnchor="end">
                  التيار I (A)
                </text>

                {/* Bell-shaped resonance curve */}
                <path
                  d="M60 175 Q200 170 240 100 Q250 40 260 100 Q300 170 440 175"
                  fill="none"
                  stroke="#2D6BFF"
                  strokeWidth="4"
                />

                {/* Peak point indicator */}
                <circle cx="250" cy="40" r="7" fill="#FFD23F" className="animate-ping" />
                <circle cx="250" cy="40" r="6" fill="#FFD23F" />
                <line x1="250" y1="40" x2="250" y2="180" stroke="#FFD23F" strokeWidth="1.5" strokeDasharray="4 4" />

                <text x="250" y="30" textAnchor="middle" fill="#FFD23F" fontSize="12" fontWeight="bold">
                  أقصى تيار (I_max = V / R)
                </text>
                <text x="250" y="200" textAnchor="middle" fill="#FFD23F" fontSize="12" fontWeight="bold">
                  تردد الرنين f₀ = {resonanceFreqHz} Hz
                </text>
              </svg>
            </div>

            <div className="bg-[#12214F] rounded-2xl p-4 border border-[#2D6BFF]/30 mt-4 text-xs text-slate-300">
              ⚡ <b className="text-[#FFD23F]">سؤال امتحان مشهور:</b> ماذا يحدث لتردد الرنين إذا زاد معامل الحث للملف للضعف ونقصت سعة المكثف للنصف؟ الإجابة: يظل ثابتاً لأن حاصل ضرب (L · C) يظل ثابتاً!
            </div>
          </div>
        </div>
      )}

      {/* LAB 3: LOGIC GATES */}
      {activeLab === 'logic' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-[#12214F] border border-[#2D6BFF]/30 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="font-display text-xl text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#FFD23F]" />
              <span>اختر البوابة المنطقية:</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {(['AND', 'OR', 'NOT', 'NAND', 'NOR'] as const).map((gate) => (
                <button
                  key={gate}
                  onClick={() => setSelectedGate(gate)}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                    selectedGate === gate
                      ? 'bg-[#FFD23F] text-[#0A1330]'
                      : 'bg-[#0A1330] text-slate-300 hover:text-white border border-[#2D6BFF]/30'
                  }`}
                >
                  بوابة {gate}
                </button>
              ))}
            </div>

            {/* Inputs toggle */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between bg-[#0A1330] p-3 rounded-2xl border border-[#2D6BFF]/30">
                <span className="text-xs font-bold text-slate-200">المدخل الأول (Input A):</span>
                <button
                  onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
                    inputA === 1
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-600/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  {inputA} ({inputA === 1 ? 'High / On' : 'Low / Off'})
                </button>
              </div>

              {selectedGate !== 'NOT' && (
                <div className="flex items-center justify-between bg-[#0A1330] p-3 rounded-2xl border border-[#2D6BFF]/30">
                  <span className="text-xs font-bold text-slate-200">المدخل الثاني (Input B):</span>
                  <button
                    onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                    className={`px-4 py-1.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
                      inputB === 1
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-600/40'
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {inputB} ({inputB === 1 ? 'High / On' : 'Low / Off'})
                  </button>
                </div>
              )}
            </div>

            {/* Live Output Card */}
            <div
              className={`rounded-2xl p-5 border text-center transition-all ${
                gateOutput === 1
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-950/50'
                  : 'bg-red-950/30 border-red-500/40'
              }`}
            >
              <span className="text-xs font-bold text-slate-300 block mb-1">الخرج النهائي (Output):</span>
              <div className="text-4xl font-black text-white">{gateOutput}</div>
              <span
                className={`text-xs font-bold mt-1 inline-block ${
                  gateOutput === 1 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {gateOutput === 1 ? 'المصباح مضيء 💡' : 'المصباح مطفأ ❌'}
              </span>
            </div>
          </div>

          {/* Truth Table & Interactive Schematic (7 cols) */}
          <div className="lg:col-span-7 bg-[#0D183D] border border-[#2D6BFF]/40 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <h4 className="font-display text-xl text-white mb-2">
                جدول التحقق (Truth Table) لبوابة {selectedGate}:
              </h4>
              <p className="text-xs text-slate-300 mb-4">
                الصف المميز باللون الأصفر يمثل الحالة الحالية للمدخلات في معملك الآن.
              </p>

              {/* Dynamic Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#12214F] text-[#FFD23F] font-bold border-b border-[#2D6BFF]/40">
                      <th className="py-2.5 px-3">المدخل A</th>
                      {selectedGate !== 'NOT' && <th className="py-2.5 px-3">المدخل B</th>}
                      <th className="py-2.5 px-3">الخرج (Output)</th>
                      <th className="py-2.5 px-3">حالة المصباح</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedGate === 'NOT' ? (
                      [
                        { a: 0, out: 1 },
                        { a: 1, out: 0 },
                      ].map((row, idx) => {
                        const isCurrent = inputA === row.a;
                        return (
                          <tr
                            key={idx}
                            className={`border-b border-[#1E2E62] transition-colors ${
                              isCurrent ? 'bg-[#FFD23F]/20 font-bold text-[#FFD23F]' : 'text-slate-300'
                            }`}
                          >
                            <td className="py-2.5 px-3">{row.a}</td>
                            <td className="py-2.5 px-3">{row.out}</td>
                            <td className="py-2.5 px-3">{row.out === 1 ? 'مضيء 💡' : 'مطفأ'}</td>
                          </tr>
                        );
                      })
                    ) : (
                      [
                        { a: 0, b: 0 },
                        { a: 0, b: 1 },
                        { a: 1, b: 0 },
                        { a: 1, b: 1 },
                      ].map((row, idx) => {
                        let out: 0 | 1 = 0;
                        if (selectedGate === 'AND') out = row.a === 1 && row.b === 1 ? 1 : 0;
                        if (selectedGate === 'OR') out = row.a === 1 || row.b === 1 ? 1 : 0;
                        if (selectedGate === 'NAND') out = !(row.a === 1 && row.b === 1) ? 1 : 0;
                        if (selectedGate === 'NOR') out = !(row.a === 1 || row.b === 1) ? 1 : 0;

                        const isCurrent = inputA === row.a && inputB === row.b;

                        return (
                          <tr
                            key={idx}
                            className={`border-b border-[#1E2E62] transition-colors ${
                              isCurrent ? 'bg-[#FFD23F]/20 font-bold text-[#FFD23F]' : 'text-slate-300'
                            }`}
                          >
                            <td className="py-2.5 px-3">{row.a}</td>
                            <td className="py-2.5 px-3">{row.b}</td>
                            <td className="py-2.5 px-3">{out}</td>
                            <td className="py-2.5 px-3">{out === 1 ? 'مضيء 💡' : 'مطفأ'}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#12214F] rounded-2xl p-4 border border-[#2D6BFF]/30 mt-6 text-xs text-slate-300">
              ⚡ <b className="text-[#FFD23F]">توضيح مستر فهيم:</b> بوابة AND مثل مفتاحين متصلين على التوالي (لا يمر تيار إلا إذا أُغلق الاثنان معاً)، بينما بوابة OR مثل مفتاحين متصلين على التوازي (يمر تيار إذا أُغلق أي منهما).
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

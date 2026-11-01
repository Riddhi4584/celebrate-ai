import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  XCircle,
  TrendingDown,
  TrendingUp,
  HelpCircle,
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { TradeOffOption } from '../types';
import { formatCurrency } from '../utils/formatters';

export const TradeOffPage: React.FC = () => {
  const { activeEvent } = useEventContext();
  const [selectedTradeOffId, setSelectedTradeOffId] = useState<string | null>(null);

  if (!activeEvent) {
    return <div className="p-8 text-center text-stone-500">Please select an event.</div>;
  }

  const tradeOffs: TradeOffOption[] = activeEvent.plan?.tradeOffOptions || [
    {
      id: 'trade_venue_vs_decor',
      title: 'Option A: Luxury Ballroom vs. Boutique Garden with Enhanced Fairy Lights',
      deltaAmount: -45000,
      description: 'Switch from a formal hotel ballroom to a lush outdoor boutique lawn with custom tenting and warm filament lighting.',
      pros: ['Saves ₹45,000 on venue minimum spend', 'Vibrant natural outdoor golden hour photos', 'More relaxed social layout for mingling'],
      cons: ['Requires weather tent rental contingency', 'Slightly earlier municipal sound cutoff'],
    },
    {
      id: 'trade_band_vs_dj',
      title: 'Option B: 5-Piece Live Instrumental Band vs. DJ & Acoustic Duo',
      deltaAmount: -25000,
      description: 'Replace full multi-member live ensemble with an acoustic duo during dinner followed by high-energy DJ set.',
      pros: ['Saves ₹25,000 in artist rider & staging fees', 'Unlimited genre variety across English, Bollywood & Classics', 'Quicker sound check timeline'],
      cons: ['Less formal orchestral prestige during ceremonial entry'],
    },
    {
      id: 'trade_catering_stations',
      title: 'Option C: Sit-down 4-Course Plated Service vs. Curated Live Chef Stations',
      deltaAmount: -18000,
      description: 'Replace formal white-glove table service with 4 interactive live cooking counters (chaat cart, wood-fired appetizers, dessert bar).',
      pros: ['Saves ₹18,000 in service staff labor', 'Guests can customize spices & portions', 'High interactive energy for guests'],
      cons: ['Requires 20% more open hall floor circulation area'],
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E05368]">
            <Scale className="w-4 h-4" />
            Decision Intelligence & Trade-Off Engine
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1236]">
            Smart Budget Trade-Offs: {activeEvent.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Compare alternative strategies side-by-side with quantified cost savings and honest pros & cons.
          </p>
        </div>
      </div>

      {/* Trade-Off Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tradeOffs.map((option) => {
          const isSelected = selectedTradeOffId === option.id;
          const isSavings = option.deltaAmount < 0;

          return (
            <div
              key={option.id}
              className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between space-y-5 ${
                isSelected
                  ? 'border-[#E05368] ring-2 ring-[#E05368]/20 shadow-md'
                  : 'border-stone-200/90 shadow-2xs hover:shadow-md'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                    Alternative Proposal
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      isSavings
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {isSavings ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                    {isSavings ? `Saves ${formatCurrency(Math.abs(option.deltaAmount), activeEvent.currency)}` : `+${formatCurrency(option.deltaAmount, activeEvent.currency)}`}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-[#2D1236] leading-snug">
                  {option.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {option.description}
                </p>

                {/* Pros */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Key Advantages
                  </span>
                  <ul className="text-xs text-stone-700 space-y-1">
                    {option.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Potential Compromises
                  </span>
                  <ul className="text-xs text-stone-700 space-y-1">
                    {option.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <button
                  onClick={() => setSelectedTradeOffId(isSelected ? null : option.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#FAF8F5] hover:bg-stone-100 text-[#2D1236] border border-stone-200'
                  }`}
                >
                  {isSelected ? 'Selected for Decision Review ✓' : 'Mark as Preferred Alternative'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Explainer Box */}
      <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-stone-200/90 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E05368]">
          <HelpCircle className="w-4 h-4" />
          How Assumptions are Formulated
        </div>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          CelebrateAI’s trade-off engine models spending reallocations based on historical vendor rate cards in {activeEvent.city}. Savings are calculated against baseline luxury quotes while maintaining food safety, guest comfort, and aesthetic standards.
        </p>
      </div>
    </div>
  );
};

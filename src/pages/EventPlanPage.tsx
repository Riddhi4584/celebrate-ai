import React, { useState } from 'react';
import {
  Sparkles,
  Palette,
  Utensils,
  PartyPopper,
  ShieldAlert,
  Mail,
  Share2,
  RefreshCw,
  Copy,
  Check,
  Edit3,
  Save,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export const EventPlanPage: React.FC = () => {
  const { activeEvent, updateEvent, regeneratePlan } = useEventContext();
  const [activeTab, setActiveTab] = useState<'concept' | 'decor' | 'catering' | 'activities' | 'risks' | 'invites'>('concept');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [isEditingTheme, setIsEditingTheme] = useState(false);
  const [editedTheme, setEditedTheme] = useState(activeEvent?.preferences.theme || '');
  const [editedAtmosphere, setEditedAtmosphere] = useState(activeEvent?.preferences.atmosphere || '');

  if (!activeEvent) {
    return (
      <div className="p-8 text-center text-stone-500">
        No celebration selected. Please select or create an event first.
      </div>
    );
  }

  const plan = activeEvent.plan;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleSaveThemeEdits = () => {
    updateEvent({
      ...activeEvent,
      preferences: {
        ...activeEvent.preferences,
        theme: editedTheme,
        atmosphere: editedAtmosphere,
      },
    });
    setIsEditingTheme(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header with Title and Regenerate Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E05368]">
            <Sparkles className="w-4 h-4" />
            AI Generative Event Architecture
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1236]">
            Personalized Event Plan: {activeEvent.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Synthesized specifically for {activeEvent.guestCount} guests in {activeEvent.city} with a {formatCurrency(activeEvent.totalBudget, activeEvent.currency)} budget.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => regeneratePlan()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#2D1236] bg-white hover:bg-stone-50 border border-stone-200 shadow-2xs transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#E05368]" />
            Regenerate AI Concepts
          </button>
        </div>
      </div>

      {/* Concept Summary & Color Palette Showcase Banner */}
      <div className="bg-gradient-to-br from-white to-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Core Celebration Theme</span>
              {!isEditingTheme ? (
                <button
                  onClick={() => {
                    setEditedTheme(activeEvent.preferences.theme);
                    setEditedAtmosphere(activeEvent.preferences.atmosphere);
                    setIsEditingTheme(true);
                  }}
                  className="text-stone-400 hover:text-[#E05368] transition-colors"
                  title="Edit Theme"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>

            {isEditingTheme ? (
              <div className="space-y-3 pt-1">
                <input
                  type="text"
                  value={editedTheme}
                  onChange={(e) => setEditedTheme(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E05368] text-base font-bold text-[#2D1236] outline-none"
                />
                <textarea
                  value={editedAtmosphere}
                  onChange={(e) => setEditedAtmosphere(e.target.value)}
                  placeholder="Atmosphere & vibe description..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-700 outline-none resize-none h-16"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveThemeEdits}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#E05368]"
                  >
                    <Save className="w-3 h-3" /> Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditingTheme(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-500 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-2xl font-bold text-[#2D1236]">
                  {activeEvent.preferences.theme}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
                  "{plan?.conceptSummary || activeEvent.preferences.atmosphere}"
                </p>
              </>
            )}
          </div>

          {/* Color Palette Swatches */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Curated Color Swatches
            </span>
            <div className="flex items-center gap-2.5">
              {(plan?.colorPalette || activeEvent.preferences.colorPalette || []).map((color, idx) => (
                <div key={idx} className="group relative flex flex-col items-center">
                  <div
                    className="w-9 h-9 rounded-xl shadow-xs border border-stone-300/60 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-[10px] font-mono font-medium text-stone-600 mt-1">
                    {color.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-stone-200 overflow-x-auto gap-2">
        {[
          { id: 'concept', label: 'Theme & Decor', icon: Palette },
          { id: 'catering', label: 'Catering & Menus', icon: Utensils },
          { id: 'activities', label: 'Activities & Music', icon: PartyPopper },
          { id: 'risks', label: 'Risks & Contingencies', icon: ShieldAlert },
          { id: 'invites', label: 'Invites & Social Captions', icon: Mail },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 font-semibold text-xs transition-colors shrink-0 ${
                isActive
                  ? 'border-[#E05368] text-[#E05368]'
                  : 'border-transparent text-stone-500 hover:text-[#2D1236]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: THEME & DECOR */}
      {activeTab === 'concept' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-200">
          {/* Decor Recommendations */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <Palette className="w-5 h-5 text-[#E05368]" />
              <h3 className="font-serif text-lg font-bold text-[#2D1236]">Decor & Floral Recommendations</h3>
            </div>
            <div className="space-y-3">
              {(plan?.decorationIdeas || []).map((idea, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FAF0F2] text-[#E05368] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">{idea}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Setup & Cleanup Logistics */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-serif text-lg font-bold text-[#2D1236]">Setup & Breakdown Logistics</h3>
            </div>
            <div className="space-y-3">
              {(plan?.setupAndCleanup || []).map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900 space-y-1">
              <span className="font-bold block uppercase tracking-wider text-[10px]">Planner Pro Tip:</span>
              <p>All load-in agreements should be shared with your decorator at least 14 days prior to ensure proper scaffolding permits.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: CATERING & MENUS */}
      {activeTab === 'catering' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(plan?.cateringSuggestions || []).map((cat, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="font-serif text-base font-bold text-[#2D1236]">{cat.mealType}</span>
                    <Utensils className="w-4 h-4 text-[#E05368]" />
                  </div>
                  <ul className="space-y-2">
                    {cat.items.map((dish, dIdx) => (
                      <li key={dIdx} className="text-xs sm:text-sm text-stone-700 font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E05368]" />
                        <span>{dish}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 text-xs text-stone-500 italic">
                  "{cat.notes}"
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
            <span>Dietary tags accommodated: {activeEvent.preferences.dietaryRequirements.join(' • ')}</span>
            <span className="font-semibold text-[#E05368]">Live Food Counters Recommended</span>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: ACTIVITIES & MUSIC */}
      {activeTab === 'activities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <PartyPopper className="w-5 h-5 text-[#E05368]" />
              <h3 className="font-serif text-lg font-bold text-[#2D1236]">Guest Engagement & Activities</h3>
            </div>
            <div className="space-y-3">
              {(plan?.activityIdeas || []).map((activity, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#E05368] mt-2 shrink-0" />
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">{activity}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <Sparkles className="w-5 h-5 text-[#9C88FF]" />
              <h3 className="font-serif text-lg font-bold text-[#2D1236]">Entertainment & Music Curation</h3>
            </div>
            <div className="space-y-3">
              {(plan?.entertainmentOptions || []).map((ent, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#9C88FF] mt-2 shrink-0" />
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">{ent}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: RISKS & CONTINGENCIES */}
      {activeTab === 'risks' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="space-y-1 mb-2">
            <h3 className="font-serif text-xl font-bold text-[#2D1236]">Risk Identification & Prevention Protocols</h3>
            <p className="text-xs text-stone-500">Every realistic vulnerability has a concrete mitigation and switchover plan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(plan?.risksAndContingencies || []).map((riskItem, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      {riskItem.severity.toUpperCase()} RISK
                    </span>
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#2D1236] leading-snug">
                    {riskItem.risk}
                  </h4>
                  <div className="space-y-1 text-xs">
                    <span className="text-stone-400 font-bold uppercase tracking-wider block text-[10px]">Preventive Measure:</span>
                    <p className="text-stone-700 leading-relaxed">{riskItem.preventiveMeasure}</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900 space-y-1">
                  <span className="font-bold uppercase tracking-wider text-[10px] block">Contingency Backup:</span>
                  <p className="leading-relaxed">{riskItem.contingencyPlan}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: INVITATIONS & SOCIAL CAPTIONS */}
      {activeTab === 'invites' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-200">
          {/* Invitation Copy Options */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <Mail className="w-5 h-5 text-[#E05368]" />
              <h3 className="font-serif text-lg font-bold text-[#2D1236]">Invitation Wording Options</h3>
            </div>

            {plan?.invitationWording && (
              <div className="space-y-4">
                {[
                  { label: 'Warm & Heartfelt', text: plan.invitationWording.warm, id: 'inv_warm' },
                  { label: 'Modern & Celebratory', text: plan.invitationWording.modern, id: 'inv_mod' },
                  { label: 'Traditional & Formal', text: plan.invitationWording.formal, id: 'inv_form' },
                ].map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#E05368] uppercase tracking-wider">{item.label}</span>
                      <button
                        onClick={() => handleCopy(item.text, item.id)}
                        className="text-stone-400 hover:text-[#2D1236] text-xs flex items-center gap-1 font-medium transition-colors"
                      >
                        {copiedItem === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                      "{item.text}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Social Captions */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <Share2 className="w-5 h-5 text-[#9C88FF]" />
              <h3 className="font-serif text-lg font-bold text-[#2D1236]">Social Media & Photo-Post Captions</h3>
            </div>

            <div className="space-y-3">
              {(plan?.socialCaptions || []).map((caption, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Option {idx + 1}</span>
                    <button
                      onClick={() => handleCopy(caption, `cap_${idx}`)}
                      className="text-stone-400 hover:text-[#2D1236] text-xs flex items-center gap-1 font-medium transition-colors"
                    >
                      {copiedItem === `cap_${idx}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                    {caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

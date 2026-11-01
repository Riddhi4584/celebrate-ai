import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Printer,
  Sparkles,
  Calendar,
  MapPin,
  Users,
  AlertTriangle,
  ListTodo,
  Store,
} from 'lucide-react';
import { CelebrationEvent } from '../../types';
import { calculateReadinessScore } from '../../services/readinessScore';
import { formatCurrency, formatDate, getDaysRemaining } from '../../utils/formatters';

interface Props {
  event: CelebrationEvent;
  isOpen: boolean;
  onClose: () => void;
}

const getReportDateString = (): string => new Date().toLocaleDateString();

export const OneClickSummaryModal: React.FC<Props> = ({ event, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const readiness = calculateReadinessScore(event);
  const daysInfo = getDaysRemaining(event.date);

  if (!isOpen) return null;

  const totalActual = event.expenses.reduce(
    (sum, e) => sum + (e.actualCost || e.estimatedCost || 0),
    0
  );
  const remaining = event.totalBudget - totalActual;
  const completedTasks = event.tasks.filter((t) => t.isCompleted).length;
  const bookedVendors = event.vendors.filter((v) => v.status === 'booked').length;
  const attendingGuests = event.guests.filter((g) => g.rsvpStatus === 'attending').length;

  const generateMarkdownSummary = (): string => {
    return `# 🌟 CELEBRATEAI EVENT EXECUTIVE SUMMARY: ${event.title.toUpperCase()}
Generated on: ${getReportDateString()}
------------------------------------------------------------
📍 Location: ${event.city} ${event.venueName ? `(${event.venueName})` : ''}
📅 Date: ${formatDate(event.date)} [${daysInfo.label}]
👥 Planned Headcount: ${event.guestCount} guests (${attendingGuests} confirmed attending)
🎯 Readiness Score: ${readiness.totalScore}% (${readiness.status})

💰 FINANCIAL OVERVIEW:
- Total Budget: ${formatCurrency(event.totalBudget, event.currency)}
- Actual Committed: ${formatCurrency(totalActual, event.currency)}
- Remaining Buffer: ${formatCurrency(remaining, event.currency)}
- Utilization: ${Math.round((totalActual / event.totalBudget) * 100)}%

🎨 THEME & CONCEPT:
- Theme: ${event.preferences.theme}
- Atmosphere: ${event.preferences.atmosphere}
- Concept: ${event.plan?.conceptSummary || 'Custom personalized celebration'}

📋 CRITICAL MILESTONES & TASKS:
- Task Progress: ${completedTasks}/${event.tasks.length} tasks completed
${event.tasks
  .slice(0, 5)
  .map(
    (t) =>
      `  [${t.isCompleted ? 'x' : ' '}] ${t.title} (${t.priority.toUpperCase()} - Due: ${formatDate(t.dueDate)})`
  )
  .join('\n')}

🤝 CONFIRMED VENDORS (${bookedVendors}/${event.vendors.length} Booked):
${event.vendors.map((v) => `  - ${v.category}: ${v.name} [Status: ${v.status.toUpperCase()}, Quoted: ${formatCurrency(v.quotedCost, event.currency)}]`).join('\n')}

⚠️ TOP RISKS & CONTINGENCIES:
${(event.plan?.risksAndContingencies || [])
  .map((r) => `  - Risk: ${r.risk}\n    Prevention: ${r.preventiveMeasure}\n    Backup: ${r.contingencyPlan}`)
  .join('\n\n')}

🚀 RECOMMENDED NEXT ACTIONS:
${readiness.recommendations.map((rec) => `  - ${rec}`).join('\n')}
------------------------------------------------------------
Planned with CelebrateAI — Intelligent Event Planning Engine
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdownSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#2D1236] to-[#431A50] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FF6B6B]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 id="summary-modal-title" className="font-serif text-xl font-bold">One-Click Planning Summary</h3>
              <p className="text-xs text-stone-300">Executive brief ready to share with family, clients, or vendors</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close summary modal"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#2D1236]">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/80">
            <div>
              <span className="text-xs text-stone-500 font-medium">Readiness Score</span>
              <p className="text-xl font-bold text-[#2D1236]">{readiness.totalScore}% <span className="text-xs font-normal text-emerald-600">({readiness.status})</span></p>
            </div>
            <div>
              <span className="text-xs text-stone-500 font-medium">Budget Spent</span>
              <p className="text-xl font-bold text-[#E05368]">{formatCurrency(totalActual, event.currency)}</p>
            </div>
            <div>
              <span className="text-xs text-stone-500 font-medium">Tasks Completed</span>
              <p className="text-xl font-bold text-[#2D1236]">{completedTasks}/{event.tasks.length}</p>
            </div>
            <div>
              <span className="text-xs text-stone-500 font-medium">Confirmed Vendors</span>
              <p className="text-xl font-bold text-[#2D1236]">{bookedVendors}/{event.vendors.length}</p>
            </div>
          </div>

          {/* Event Context Card */}
          <div className="border border-stone-200 rounded-2xl p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <h4 className="font-serif text-lg font-bold text-[#2D1236]">{event.title}</h4>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF0F2] text-[#E05368] border border-[#E05368]/20">
                {daysInfo.label}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-stone-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#E05368]" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E05368]" />
                <span>{event.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#E05368]" />
                <span>{event.guestCount} Guests</span>
              </div>
            </div>
            <p className="text-xs text-stone-500 italic bg-[#FAF8F5] p-3 rounded-xl border border-stone-200/60">
              "{event.plan?.conceptSummary || event.preferences.atmosphere}"
            </p>
          </div>

          {/* Vendors & Milestones Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-stone-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#2D1236]">
                <Store className="w-4 h-4 text-[#E05368]" />
                Vendor Status
              </div>
              <div className="space-y-2 text-xs">
                {event.vendors.slice(0, 4).map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-2 rounded-lg bg-stone-50">
                    <span className="font-medium text-stone-700">{v.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                      v.status === 'booked' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {v.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-stone-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#2D1236]">
                <ListTodo className="w-4 h-4 text-[#E05368]" />
                Upcoming Deadlines
              </div>
              <div className="space-y-2 text-xs">
                {event.tasks.filter(t => !t.isCompleted).slice(0, 4).map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-stone-50">
                    <span className="truncate max-w-[180px] font-medium text-stone-700">{t.title}</span>
                    <span className="text-[11px] text-stone-500 font-mono">{formatDate(t.dueDate)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Next Actions */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
              <AlertTriangle className="w-4 h-4" />
              Smart Next Actions
            </div>
            <ul className="text-xs text-amber-900 space-y-1.5 list-disc list-inside">
              {readiness.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-200/70 transition-colors border border-stone-300"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56] hover:brightness-105 shadow-md shadow-[#E05368]/20 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Executive Brief
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

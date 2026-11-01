import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  DollarSign,
  ListTodo,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  AlertTriangle,
  PartyPopper,
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { calculateReadinessScore } from '../services/readinessScore';
import { formatCurrency, formatDate, getDaysRemaining } from '../utils/formatters';

const getTodayFormattedString = (): string => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { events, activeEvent, setActiveEventId, toggleTaskComplete } = useEventContext();

  const todayStr = getTodayFormattedString();

  // Calculate real metrics across state
  const totalEvents = events.length;
  const upcomingEvents = events.filter((e) => {
    const days = getDaysRemaining(e.date);
    return !days.isPast;
  });

  const totalPlannedBudget = events.reduce((sum, e) => sum + (e.totalBudget || 0), 0);
  const outstandingTasks = events.reduce(
    (sum, e) => sum + e.tasks.filter((t) => !t.isCompleted).length,
    0
  );

  const activeReadiness = activeEvent ? calculateReadinessScore(activeEvent) : null;

  // Real upcoming deadlines across all events or active event
  const allPendingTasks = (activeEvent ? activeEvent.tasks : events.flatMap((e) => e.tasks))
    .filter((t) => !t.isCompleted)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const activeActualSpent = activeEvent
    ? activeEvent.expenses.reduce((s, e) => s + (e.actualCost || e.estimatedCost || 0), 0)
    : 0;

  const budgetUtilization = activeEvent
    ? Math.min(100, Math.round((activeActualSpent / activeEvent.totalBudget) * 100))
    : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-500">
            {todayStr}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D1236]">
            Welcome Back to Celebrate<span className="text-[#E05368]">AI</span>
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Real-time celebration analytics, milestone readiness, and AI planning assistant.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/app/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56] hover:brightness-105 shadow-md shadow-[#E05368]/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Plan New Celebration
          </Link>
        </div>
      </div>

      {/* Summary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Celebrations</span>
            <PartyPopper className="w-5 h-5 text-[#E05368]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#2D1236]">{totalEvents}</span>
            <span className="text-xs text-stone-500 font-medium">events in portfolio</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Upcoming Events</span>
            <Calendar className="w-5 h-5 text-[#9C88FF]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#2D1236]">{upcomingEvents.length}</span>
            <span className="text-xs text-stone-500 font-medium">ahead on calendar</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Planned Capital</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#2D1236]">
              {formatCurrency(totalPlannedBudget, activeEvent?.currency || 'INR')}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Outstanding Tasks</span>
            <ListTodo className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#2D1236]">{outstandingTasks}</span>
            <span className="text-xs text-stone-500 font-medium">tasks pending</span>
          </div>
        </div>
      </div>

      {/* Empty State if no events */}
      {events.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF0F2] text-[#E05368] flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#2D1236]">No celebrations planned yet</h3>
          <p className="text-sm text-stone-500 leading-relaxed">
            Let's create your first celebration! Our AI planner will generate a customized budget, milestone timeline, and creative ideas in 60 seconds.
          </p>
          <Link
            to="/app/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56] shadow-md shadow-[#E05368]/25"
          >
            <PlusCircle className="w-4 h-4" />
            Plan Your First Celebration
          </Link>
        </div>
      ) : (
        <>
          {/* Active Event Spotlight Card */}
          {activeEvent && (
            <div className="bg-gradient-to-br from-[#2D1236] via-[#381643] to-[#431A50] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-96 h-96 bg-[#FF6B6B]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-[#FF6B6B] border border-white/10">
                      Primary Active Workspace
                    </span>
                    <span className="text-xs text-stone-300 capitalize">• {activeEvent.eventType} in {activeEvent.city}</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold">{activeEvent.title}</h2>
                  <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                    {activeEvent.plan?.conceptSummary || activeEvent.preferences.atmosphere}
                  </p>
                </div>

                {/* Readiness Circular / Pill Badge */}
                {activeReadiness && (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-stone-300 uppercase tracking-wider block">Readiness Score</span>
                      <strong className="text-2xl font-bold text-[#FF6B6B]">{activeReadiness.totalScore}%</strong>
                      <span className="text-[10px] block text-emerald-400 font-semibold">{activeReadiness.status}</span>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-emerald-400 flex items-center justify-center font-bold text-sm bg-white/10">
                      {activeReadiness.totalScore}
                    </div>
                  </div>
                )}
              </div>

              {/* Spotlight Fast Links */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link
                  to={`/app/events/${activeEvent.id}/plan`}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-between group"
                >
                  <div className="truncate">
                    <span className="block text-[10px] text-stone-400 uppercase tracking-wider">AI Concept</span>
                    <span className="text-xs font-bold text-white truncate block">View Full Plan</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#FF6B6B] group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to={`/app/events/${activeEvent.id}/budget`}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-between group"
                >
                  <div className="truncate">
                    <span className="block text-[10px] text-stone-400 uppercase tracking-wider">Budget Spent</span>
                    <span className="text-xs font-bold text-white truncate block">
                      {formatCurrency(activeActualSpent, activeEvent.currency)} ({budgetUtilization}%)
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#FF6B6B] group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to={`/app/events/${activeEvent.id}/tasks`}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-between group"
                >
                  <div className="truncate">
                    <span className="block text-[10px] text-stone-400 uppercase tracking-wider">Timeline</span>
                    <span className="text-xs font-bold text-white truncate block">
                      {activeEvent.tasks.filter((t) => t.isCompleted).length}/{activeEvent.tasks.length} Done
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#FF6B6B] group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to={`/app/events/${activeEvent.id}/assistant`}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-between group"
                >
                  <div className="truncate">
                    <span className="block text-[10px] text-stone-400 uppercase tracking-wider">AI Assistant</span>
                    <span className="text-xs font-bold text-white truncate block">Chat with Partner</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#FF6B6B] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )}

          {/* 2-Column Section: Upcoming Deadlines + AI Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-[#E05368]" />
                  <h3 className="font-serif text-lg font-bold text-[#2D1236]">Upcoming Deadlines</h3>
                </div>
                {activeEvent && (
                  <Link
                    to={`/app/events/${activeEvent.id}/tasks`}
                    className="text-xs font-semibold text-[#E05368] hover:underline"
                  >
                    View All Tasks →
                  </Link>
                )}
              </div>

              {allPendingTasks.length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-xs">
                  All current deadlines completed! 🎉
                </div>
              ) : (
                <div className="space-y-2.5">
                  {allPendingTasks.map((task) => {
                    const taskDays = getDaysRemaining(task.dueDate);
                    return (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-between gap-3 hover:border-stone-300 transition-colors"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <button
                            onClick={() => toggleTaskComplete(task.id)}
                            className="w-5 h-5 rounded-md border border-stone-300 hover:border-[#E05368] flex items-center justify-center shrink-0 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4 text-transparent hover:text-stone-300" />
                          </button>
                          <div className="truncate">
                            <span className="text-sm font-semibold text-[#2D1236] block truncate">
                              {task.title}
                            </span>
                            <span className="text-[11px] text-stone-500 font-medium">
                              {task.category} • Due {formatDate(task.dueDate)}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                            taskDays.isPast
                              ? 'bg-rose-100 text-rose-700'
                              : task.priority === 'urgent'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {taskDays.isPast ? 'OVERDUE' : taskDays.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* AI Smart Action Recommendations */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-[#E05368]" />
                    <h3 className="font-serif text-lg font-bold text-[#2D1236]">AI Recommended Actions</h3>
                  </div>
                  <span className="text-xs font-mono text-[#E05368] font-semibold bg-[#FAF0F2] px-2.5 py-1 rounded-full">
                    Context-Aware
                  </span>
                </div>

                <div className="space-y-3">
                  {activeReadiness?.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex items-start gap-3"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-900 leading-relaxed font-medium">
                        {rec}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {activeEvent && (
                <div className="pt-4 border-t border-stone-100">
                  <Link
                    to={`/app/events/${activeEvent.id}/assistant`}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#2D1236] bg-[#FAF8F5] hover:bg-stone-100 border border-stone-200 flex items-center justify-center gap-2 transition-colors"
                  >
                    Ask AI Assistant to resolve these recommendations →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* All Celebrations Portfolio Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-[#2D1236]">Your Celebrations Portfolio</h3>
              <Link
                to="/app/create"
                className="text-xs font-semibold text-[#E05368] hover:underline flex items-center gap-1"
              >
                + Add Another Celebration
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((ev) => {
                const days = getDaysRemaining(ev.date);
                const isCurrentActive = ev.id === activeEvent?.id;
                const readiness = calculateReadinessScore(ev);

                return (
                  <div
                    key={ev.id}
                    className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
                      isCurrentActive
                        ? 'border-[#E05368] ring-2 ring-[#E05368]/20 shadow-md'
                        : 'border-stone-200/90 hover:border-stone-300 shadow-2xs'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FAF0F2] text-[#E05368]">
                          {ev.eventType}
                        </span>
                        <span className="text-xs font-semibold text-stone-500">
                          {days.label}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-serif text-lg font-bold text-[#2D1236] leading-snug">
                          {ev.title}
                        </h4>
                        <span className="text-xs text-stone-500 font-medium">
                          {formatDate(ev.date)} • {ev.city}
                        </span>
                      </div>

                      <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-stone-200/60 space-y-1.5 text-xs text-stone-600">
                        <div className="flex justify-between">
                          <span>Planned Budget:</span>
                          <strong className="text-[#2D1236]">
                            {formatCurrency(ev.totalBudget, ev.currency)}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Readiness:</span>
                          <strong className="text-emerald-700">{readiness.totalScore}%</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Guests:</span>
                          <strong className="text-[#2D1236]">{ev.guestCount}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                      <button
                        onClick={() => {
                          setActiveEventId(ev.id);
                          navigate(`/app/events/${ev.id}/plan`);
                        }}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          isCurrentActive
                            ? 'bg-gradient-to-r from-[#E05368] to-[#D43D56] text-white shadow-xs'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        Open Workspace
                      </button>

                      {!isCurrentActive && (
                        <button
                          onClick={() => setActiveEventId(ev.id)}
                          className="px-3 py-2 rounded-xl text-xs font-medium text-stone-500 hover:text-[#2D1236] border border-stone-200 hover:bg-stone-50"
                        >
                          Make Active
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

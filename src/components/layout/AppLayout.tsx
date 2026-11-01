import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  PieChart,
  ListTodo,
  Store,
  Users,
  MessageSquare,
  Scale,
  Settings,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  FileText,
  Calendar,
  PartyPopper,
} from 'lucide-react';
import { useEventContext } from '../../context/EventContext';
import { calculateReadinessScore } from '../../services/readinessScore';
import { formatCurrency, getDaysRemaining } from '../../utils/formatters';
import { OneClickSummaryModal } from './OneClickSummaryModal';

interface Props {
  children: React.ReactNode;
}

export const AppLayout: React.FC<Props> = ({ children }) => {
  const { events, activeEvent, setActiveEventId } = useEventContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const readiness = activeEvent ? calculateReadinessScore(activeEvent) : null;
  const daysInfo = activeEvent ? getDaysRemaining(activeEvent.date) : null;

  const totalActual = activeEvent
    ? activeEvent.expenses.reduce((s, e) => s + (e.actualCost || e.estimatedCost || 0), 0)
    : 0;

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/app/dashboard',
    },
    {
      label: 'AI Event Plan',
      icon: Sparkles,
      path: activeEvent ? `/app/events/${activeEvent.id}/plan` : '/app/dashboard',
    },
    {
      label: 'Budget & Expenses',
      icon: PieChart,
      path: activeEvent ? `/app/events/${activeEvent.id}/budget` : '/app/dashboard',
    },
    {
      label: 'Timeline & Tasks',
      icon: ListTodo,
      path: activeEvent ? `/app/events/${activeEvent.id}/tasks` : '/app/dashboard',
    },
    {
      label: 'Vendor Management',
      icon: Store,
      path: activeEvent ? `/app/events/${activeEvent.id}/vendors` : '/app/dashboard',
    },
    {
      label: 'Guest List & RSVPs',
      icon: Users,
      path: activeEvent ? `/app/events/${activeEvent.id}/guests` : '/app/dashboard',
    },
    {
      label: 'AI Planning Partner',
      icon: MessageSquare,
      path: activeEvent ? `/app/events/${activeEvent.id}/assistant` : '/app/dashboard',
    },
    {
      label: 'Trade-Off Optimizer',
      icon: Scale,
      path: activeEvent ? `/app/events/${activeEvent.id}/tradeoffs` : '/app/dashboard',
    },
    {
      label: 'Settings & Backups',
      icon: Settings,
      path: '/app/settings',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row text-[#2D1236]">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-stone-200 sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#E05368] to-[#9C88FF] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-lg text-[#2D1236]">Celebrate<span className="text-[#E05368]">AI</span></span>
        </Link>

        <div className="flex items-center gap-2">
          {activeEvent && (
            <button
              onClick={() => setShowSummaryModal(true)}
              className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium"
              title="Quick Summary"
            >
              <FileText className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-stone-700 hover:bg-stone-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation (Desktop) */}
      <aside className={`
        fixed md:sticky top-0 h-screen w-72 bg-white border-r border-stone-200/80 z-40 flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Top brand & event selector */}
        <div className="p-5 border-b border-stone-100 space-y-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E05368] to-[#9C88FF] flex items-center justify-center text-white shadow-md shadow-[#E05368]/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#2D1236]">Celebrate<span className="text-[#E05368]">AI</span></span>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-[#2D1236]/60">Intelligent Event Planner</span>
            </div>
          </Link>

          {/* Active Event Switcher */}
          <div className="relative">
            <button
              onClick={() => setSwitcherOpen(!switcherOpen)}
              className="w-full text-left p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200 hover:border-[#E05368]/40 transition-colors flex items-center justify-between group"
            >
              <div className="truncate pr-2">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#E05368]">Active Event</span>
                <span className="block text-sm font-bold text-[#2D1236] truncate">
                  {activeEvent ? activeEvent.title : 'No active celebration'}
                </span>
                {daysInfo && (
                  <span className="block text-[11px] text-stone-500 font-medium">
                    {daysInfo.label}
                  </span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-stone-400 group-hover:text-[#E05368] transition-transform ${switcherOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Switcher Dropdown */}
            {switcherOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1.5">
                  Your Celebrations ({events.length})
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {events.map((ev) => (
                    <button
                      key={ev.id}
                      onClick={() => {
                        setActiveEventId(ev.id);
                        setSwitcherOpen(false);
                        // Redirect to same view with new ID if on event route
                        if (location.pathname.includes('/events/')) {
                          const tab = location.pathname.split('/').pop();
                          navigate(`/app/events/${ev.id}/${tab}`);
                        }
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                        ev.id === activeEvent?.id
                          ? 'bg-[#FAF0F2] text-[#E05368] font-bold'
                          : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <span className="truncate max-w-[170px]">{ev.title}</span>
                      <span className="text-[10px] text-stone-400 uppercase font-mono">{ev.eventType}</span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-stone-100 pt-2 mt-1">
                  <Link
                    to="/app/create"
                    onClick={() => setSwitcherOpen(false)}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-[#E05368] hover:bg-[#FAF0F2] transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Plan New Celebration
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5 overflow-y-auto flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2D1236] to-[#431A50] text-white shadow-sm font-semibold'
                      : 'text-stone-600 hover:text-[#2D1236] hover:bg-stone-100/70'
                  }
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Info */}
        {activeEvent && (
          <div className="p-4 border-t border-stone-100 space-y-3 bg-[#FAF8F5]/60">
            {readiness && (
              <div className="bg-white p-3 rounded-xl border border-stone-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                  <span>Event Readiness</span>
                  <span className="text-[#E05368] font-bold">{readiness.totalScore}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#FF6B6B] to-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${readiness.totalScore}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-400">
                  <span>{readiness.status}</span>
                  <button
                    onClick={() => setShowSummaryModal(true)}
                    className="text-[#E05368] font-semibold hover:underline"
                  >
                    View Brief
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowSummaryModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-[#2D1236] bg-white border border-stone-200 hover:bg-stone-50 transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-[#E05368]" />
              Executive Event Summary
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="hidden md:flex h-16 bg-white/80 backdrop-blur-md border-b border-stone-200 items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 text-sm">
            {activeEvent ? (
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FAF0F2] text-[#E05368] border border-[#E05368]/20">
                  {activeEvent.eventType}
                </span>
                <h2 className="font-serif font-bold text-base text-[#2D1236] truncate max-w-md">
                  {activeEvent.title}
                </h2>
                <span className="text-xs text-stone-400">|</span>
                <span className="text-xs text-stone-500 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#E05368]" />
                  {activeEvent.city} • {daysInfo?.label}
                </span>
              </div>
            ) : (
              <span className="text-stone-500">Welcome to CelebrateAI Planning Suite</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {activeEvent && (
              <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-stone-600 bg-[#FAF8F5] px-3.5 py-1.5 rounded-xl border border-stone-200">
                <span>
                  Budget: <strong className="text-[#2D1236]">{formatCurrency(totalActual, activeEvent.currency)}</strong> / {formatCurrency(activeEvent.totalBudget, activeEvent.currency)}
                </span>
                <span className="text-stone-300">•</span>
                <button
                  onClick={() => setShowSummaryModal(true)}
                  className="text-[#E05368] font-semibold hover:underline flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  1-Click Summary
                </button>
              </div>
            )}

            <Link
              to="/app/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56] hover:brightness-105 shadow-sm shadow-[#E05368]/25 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              New Celebration
            </Link>
          </div>
        </header>

        {/* Main Content Body */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>

      {/* One-Click Executive Summary Modal */}
      {activeEvent && (
        <OneClickSummaryModal
          event={activeEvent}
          isOpen={showSummaryModal}
          onClose={() => setShowSummaryModal(false)}
        />
      )}
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Calendar, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#2D1236]/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E05368] to-[#9C88FF] flex items-center justify-center text-white shadow-md shadow-[#E05368]/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#2D1236]">Celebrate<span className="text-[#E05368]">AI</span></span>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-[#2D1236]/60">Intelligent Celebration Planner</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#2D1236]/80">
          <a href="#how-it-works" className="hover:text-[#E05368] transition-colors">How It Works</a>
          <a href="#categories" className="hover:text-[#E05368] transition-colors">Celebration Types</a>
          <a href="#capabilities" className="hover:text-[#E05368] transition-colors">AI Capabilities</a>
          <a href="#sample-plan" className="hover:text-[#E05368] transition-colors">Sample Plan</a>
          <a href="#faq" className="hover:text-[#E05368] transition-colors">FAQ</a>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <Link
            to="/app/dashboard"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#2D1236] hover:bg-[#2D1236]/5 transition-colors border border-[#2D1236]/15"
          >
            <LayoutDashboard className="w-4 h-4 text-[#E05368]" />
            Dashboard
          </Link>

          <Link
            to="/app/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56] hover:from-[#CE4559] hover:to-[#BD3048] shadow-md shadow-[#E05368]/25 hover:shadow-lg hover:shadow-[#E05368]/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Calendar className="w-4 h-4" />
            Plan My Event
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>
      </div>
    </header>
  );
};

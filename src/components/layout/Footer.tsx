import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#210B28] text-white border-t border-white/10 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E05368] to-[#9C88FF] flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight">Celebrate<span className="text-[#FF6B6B]">AI</span></span>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed">
              Your perfect event starts with a smarter plan. AI-powered budget balancing, timelines, themes, and vendor discovery.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#FF6B6B] font-medium bg-white/5 px-3 py-2 rounded-lg border border-white/10 w-fit">
              <Shield className="w-3.5 h-3.5" />
              100% Client-Side Privacy Safe
            </div>
          </div>

          {/* Celebration Types */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-amber-200/90 mb-4 font-mono">Celebrations</h4>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li><Link to="/app/create?type=wedding" className="hover:text-white transition-colors">Weddings & Receptions</Link></li>
              <li><Link to="/app/create?type=birthday" className="hover:text-white transition-colors">Milestone Birthdays</Link></li>
              <li><Link to="/app/create?type=anniversary" className="hover:text-white transition-colors">Anniversaries</Link></li>
              <li><Link to="/app/create?type=corporate" className="hover:text-white transition-colors">Corporate Summits</Link></li>
              <li><Link to="/app/create?type=baby_shower" className="hover:text-white transition-colors">Baby Showers</Link></li>
              <li><Link to="/app/create?type=community" className="hover:text-white transition-colors">Community Festivals</Link></li>
            </ul>
          </div>

          {/* AI Features */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-amber-200/90 mb-4 font-mono">Intelligence</h4>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li><Link to="/app/dashboard" className="hover:text-white transition-colors">Budget Optimizer</Link></li>
              <li><Link to="/app/dashboard" className="hover:text-white transition-colors">Timeline Generator</Link></li>
              <li><Link to="/app/dashboard" className="hover:text-white transition-colors">Vendor Match Criteria</Link></li>
              <li><Link to="/app/dashboard" className="hover:text-white transition-colors">Event Readiness Score</Link></li>
              <li><Link to="/app/dashboard" className="hover:text-white transition-colors">Weather & Risk Backups</Link></li>
              <li><Link to="/app/dashboard" className="hover:text-white transition-colors">Interactive AI Assistant</Link></li>
            </ul>
          </div>

          {/* Quick Start */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-amber-200/90 mb-4 font-mono">Get Started</h4>
            <p className="text-sm text-stone-300">
              Experience the power of generative event planning in 60 seconds with no signup required.
            </p>
            <Link
              to="/app/create"
              className="block text-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56] hover:brightness-110 transition-all shadow-md"
            >
              Plan an Event Now
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© 2026 CelebrateAI. Built for hackathon excellence with React, TypeScript, Vite & Tailwind CSS.</p>
          <div className="flex items-center gap-1 text-stone-400">
            Designed with <Heart className="w-3.5 h-3.5 text-[#FF6B6B] fill-current mx-1 inline" /> for unforgettable celebrations.
          </div>
        </div>
      </div>
    </footer>
  );
};

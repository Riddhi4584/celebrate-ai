import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  PieChart,
  ListTodo,
  Store,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Heart,
  Palette,
  Clock,
  HelpCircle,
  Gem,
  Cake,
  Building,
  Users,
  GraduationCap,
  Briefcase,
  Flame,
  Star,
  Quote,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const LandingPage: React.FC = () => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const celebrationTypes = [
    { id: 'wedding', title: 'Weddings & Receptions', icon: Gem, desc: 'Pheras, Sangeet, mandap styling, and royal feast management.', budgetExample: '₹8,00,000 – ₹50,00,000+' },
    { id: 'birthday', title: 'Milestone Birthdays', icon: Cake, desc: 'Themes, custom cakes, sound rigs, balloon artistry, and party games.', budgetExample: '₹20,000 – ₹2,50,000' },
    { id: 'anniversary', title: 'Silver & Golden Anniversaries', icon: Heart, desc: 'Romantic candlelight dinners, live acoustic sets, and memory galleries.', budgetExample: '₹50,000 – ₹5,00,000' },
    { id: 'corporate', title: 'Corporate Summits & Galas', icon: Briefcase, desc: 'Keynote setups, executive banquets, branded badges, and AV coordination.', budgetExample: '₹1,50,000 – ₹15,00,000' },
    { id: 'college', title: 'College Fests & Proms', icon: GraduationCap, desc: 'Artist performances, campus security, food trucks, and crowd logistics.', budgetExample: '₹1,00,000 – ₹10,00,000' },
    { id: 'community', title: 'Community Celebrations', icon: Users, desc: 'Neighborhood festivals, seating marquees, potlucks, and cultural stages.', budgetExample: '₹40,000 – ₹4,00,000' },
    { id: 'engagement', title: 'Engagement Ceremonies', icon: Sparkles, desc: 'Intimate ring exchange, floral arches, canapes, and candid photo-ops.', budgetExample: '₹1,00,000 – ₹8,00,000' },
    { id: 'baby_shower', title: 'Baby Showers', icon: Heart, desc: 'Pastel backdrops, interactive nursery games, high-tea and mom favors.', budgetExample: '₹25,000 – ₹1,50,000' },
    { id: 'festival', title: 'Family Festivals & Poojas', icon: Flame, desc: 'Sacred floral setups, traditional feast catering, and sweet hampers.', budgetExample: '₹30,000 – ₹3,00,000' },
    { id: 'custom', title: 'Custom Celebrations', icon: Star, desc: 'Tailored milestone celebrations designed completely around your vision.', budgetExample: 'Flexible' },
  ];

  const faqs = [
    {
      q: 'Does CelebrateAI work without configuring paid AI credentials?',
      a: 'Yes, absolutely! CelebrateAI includes a built-in Intelligent Contextual Demo Engine that generates tailored plans, category-level budgets, milestone timelines, and assistant suggestions based on your exact event inputs. If you wish to connect your own OpenAI or Gemini API key, you can do so in Settings.',
    },
    {
      q: 'How does the AI optimize my budget without exceeding the limit?',
      a: 'Our algorithmic budget engine benchmarks historical spending proportions for each celebration type (e.g. Weddings require ~30% for food & 28% for venue, whereas Birthdays allocate more to cakes, games, and entertainment). The allocations always mathematically total exactly 100% of your budget, and give real-time overspending alerts.',
    },
    {
      q: 'Will my data persist if I close or refresh my browser?',
      a: 'Yes! All your celebrations, budget line items, tasks, vendor quotes, and guest RSVPs are saved in your browser’s local storage. You can also export a full JSON backup or print an Executive Event Summary at any time.',
    },
    {
      q: 'Can I edit the AI-generated recommendations?',
      a: 'Yes, every aspect of CelebrateAI is 100% editable. You can adjust budget categories, modify task due dates, add your own real vendors, edit invitation wording, and customize color palettes.',
    },
    {
      q: 'How is the Event Readiness Score calculated?',
      a: 'The Readiness Score combines 5 practical components: task execution (up to 30 pts), budget discipline (up to 25 pts), confirmed vendor contracts (up to 25 pts), timeline proximity (up to 10 pts), and guest RSVP tracking (up to 10 pts). It translates to real next-step action items.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D1236] flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
        {/* Soft background ambient glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#FF6B6B]/15 via-[#9C88FF]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#FAF0F2] rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#FAF0F2] text-[#E05368] border border-[#E05368]/25 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E05368] animate-spin" />
              <span>Next-Gen Celebration Planning Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#2D1236] leading-[1.12]">
              Your Perfect Event Starts with a <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#E05368] via-[#D43D56] to-[#9C88FF]">Smarter Plan.</span>
            </h1>

            {/* Supporting Subtext */}
            <p className="text-lg sm:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed font-normal">
              From intimate birthdays to unforgettable weddings, let AI transform your ideas into personalized plans, realistic budgets, seamless timelines, and celebrations worth remembering.
            </p>

            {/* Hero CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/app/create"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56] hover:from-[#CE4559] hover:to-[#BD3048] shadow-lg shadow-[#E05368]/30 hover:shadow-xl hover:shadow-[#E05368]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Calendar className="w-5 h-5" />
                Plan My Event
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-base font-semibold text-[#2D1236] bg-white hover:bg-stone-50 border border-stone-200/90 shadow-sm transition-all"
              >
                Explore Features
              </a>
            </div>

            {/* Trust points */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant 6-Step Plan Creation
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> INR & Multi-Currency Support
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zero Sign-up Required
              </span>
            </div>
          </div>

          {/* Interactive Hero Illustration / Preview Glass Card */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-2xl shadow-stone-400/20">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF0F2] flex items-center justify-center text-[#E05368]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E05368]">AI Live Event Studio</span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2D1236]">Aanya & Kabir's Royal Jaipur Wedding</h3>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Readiness Score: 88% (Ready to Celebrate)
                  </span>
                  <Link
                    to="/app/dashboard"
                    className="text-xs font-semibold text-[#E05368] hover:underline flex items-center gap-1"
                  >
                    Open Live Demo <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* 3 Interactive Showcase Cards */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Budget Optimizer */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/70 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider">
                    <span>Budget Allocation</span>
                    <PieChart className="w-4 h-4 text-[#E05368]" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-[#2D1236]">₹18,00,000</span>
                    <p className="text-xs text-stone-500">100% Mathematically Balanced</p>
                  </div>
                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>Catering & Feast (32%)</span>
                      <strong className="text-[#2D1236]">₹5,80,000</strong>
                    </div>
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#E05368] h-full w-[32%]" />
                    </div>

                    <div className="flex justify-between">
                      <span>Palace Lawns & Decor (44%)</span>
                      <strong className="text-[#2D1236]">₹8,00,000</strong>
                    </div>
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#9C88FF] h-full w-[44%]" />
                    </div>

                    <div className="flex justify-between">
                      <span>Photography & Music (14%)</span>
                      <strong className="text-[#2D1236]">₹2,40,000</strong>
                    </div>
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#D4AF37] h-full w-[14%]" />
                    </div>
                  </div>
                </div>

                {/* 2. Timeline Generator */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/70 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider">
                    <span>Adaptive Milestones</span>
                    <Clock className="w-4 h-4 text-[#E05368]" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-[#2D1236]">42 Days</span>
                    <p className="text-xs text-stone-500">Relative Time-Aware Deadlines</p>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 flex items-center justify-between">
                      <div className="truncate pr-2">
                        <span className="font-semibold text-stone-800 block truncate">Lock Palace Lawns</span>
                        <span className="text-[10px] text-stone-400">Completed on schedule</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">DONE</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 flex items-center justify-between">
                      <div className="truncate pr-2">
                        <span className="font-semibold text-stone-800 block truncate">Food Tasting in Jaipur</span>
                        <span className="text-[10px] text-stone-400">Jain counters verified</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">DONE</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 flex items-center justify-between">
                      <div className="truncate pr-2">
                        <span className="font-semibold text-stone-800 block truncate">Sangeet Track Mix</span>
                        <span className="text-[10px] text-stone-400">Due Nov 25</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">IN PROGRESS</span>
                    </div>
                  </div>
                </div>

                {/* 3. AI Planning Assistant */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/70 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                      <span>Contextual Assistant</span>
                      <Sparkles className="w-4 h-4 text-[#E05368]" />
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-stone-200/80 text-xs text-stone-700 space-y-1.5 shadow-2xs">
                      <span className="text-[10px] font-bold text-[#E05368] block">YOU ASKED:</span>
                      <p className="font-medium italic">"Reduce my budget by 15% without compromising food quality."</p>
                    </div>
                    <div className="mt-2.5 bg-[#FAF0F2] p-3 rounded-xl border border-[#E05368]/20 text-xs text-[#2D1236] space-y-1">
                      <span className="text-[10px] font-bold text-[#E05368] block">CELEBRATEAI PROPOSAL:</span>
                      <p className="text-[11px] leading-relaxed">
                        Saved <strong>₹2,70,000</strong> by transitioning to reusable modular brass floral arches & bundled DJ sound.
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/app/events/event_wedding_jaipur/assistant"
                    className="w-full text-center py-2 rounded-xl text-xs font-semibold text-white bg-[#2D1236] hover:bg-[#431A50] transition-colors"
                  >
                    Test Assistant in Workspace
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E05368]">Seamless Planning Journey</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D1236]">How CelebrateAI Works</h2>
            <p className="text-stone-600 text-base">
              From an initial spark of an idea to celebrating stress-free, our intelligent engine handles the cognitive overhead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Share Your Celebration Vision',
                desc: 'Enter event type, date, city, budget, guest count, and your desired vibe or cultural traditions.',
                icon: Palette,
              },
              {
                step: '02',
                title: 'AI Generates Your Foundation',
                desc: 'Get an instant, mathematical budget breakdown, tailored milestone timeline, and curated decor themes.',
                icon: Sparkles,
              },
              {
                step: '03',
                title: 'Manage Vendors & Expenses',
                desc: 'Track vendor quotes, mark paid deposits, manage guest RSVPs, and resolve potential weather risks.',
                icon: Store,
              },
              {
                step: '04',
                title: 'Execute Stress-Free',
                desc: 'Track your real-time Readiness Score, export an executive brief, and celebrate with confidence.',
                icon: Heart,
              },
            ].map((st, idx) => {
              const Icon = st.icon;
              return (
                <div key={idx} className="relative p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-4 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-[#E05368] shadow-2xs font-mono font-bold text-sm">
                    {st.step}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#2D1236]">{st.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Celebration Categories Gallery */}
      <section id="categories" className="py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E05368]">Universal Versatility</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D1236]">10 Diverse Celebration Types Supported</h2>
            <p className="text-stone-600 text-base">
              Every event type has unique budgeting dynamics and timing requirements. CelebrateAI adapts specifically to each one.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {celebrationTypes.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  to={`/app/create?type=${cat.id}`}
                  className="p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-[#E05368]/50 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] text-[#E05368] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#2D1236] group-hover:text-[#E05368] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-stone-500">
                    <span>{cat.budgetExample}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E05368] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Capabilities Deep-Dive */}
      <section id="capabilities" className="py-20 bg-white border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E05368]">Core AI Architecture</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D1236]">Intelligence That Serves Real Planning Needs</h2>
            <p className="text-stone-600 text-base">
              No generic chatbot answers or hollow placeholders. CelebrateAI delivers structured, actionable planning recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-3xl bg-[#FAF8F5] border border-stone-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E05368]/10 text-[#E05368] flex items-center justify-center">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2D1236]">Mathematical Budget Optimizer</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Allocates total capital across venue, catering, styling, and contingency with 100% precision. Never leaves unassigned funds and alerts on category overspending.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FAF8F5] border border-stone-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#9C88FF]/10 text-[#9C88FF] flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2D1236]">Adaptive Timeline Generator</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Generates proportional milestones relative to your event date. If your party is in 10 days, tasks are scheduled within 10 days—never hallucinating impossible deadlines.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FAF8F5] border border-stone-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2D1236]">Risk & Weather Contingencies</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Identifies real vulnerabilities (rain, vendor delays, dietary mismatches) and provides concrete prevention and switchover plans with designated decision cutoffs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators & Readiness Score Preview */}
      <section className="py-20 bg-gradient-to-br from-[#2D1236] to-[#431A50] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B6B] font-mono">Differentiating Feature</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                Transparent Event Readiness Score & Trade-Off Engine
              </h2>
              <p className="text-stone-300 text-base leading-relaxed">
                Planning anxiety happens when you don't know what you don't know. CelebrateAI quantifies your readiness from 0 to 100% across tasks, budgets, vendor bookings, and timelines.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-[#FF6B6B]/20 text-[#FF6B6B] mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-sm font-semibold text-white block">Smart Budget Trade-Offs</strong>
                    <span className="text-xs text-stone-300">Compare Option A (Live Band) vs Option B (DJ + Enhanced Florals) with instant cost differential analysis.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-[#FF6B6B]/20 text-[#FF6B6B] mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-sm font-semibold text-white block">1-Click Executive Summary</strong>
                    <span className="text-xs text-stone-300">Generate an exportable briefing document with complete budgets, contacts, and milestones.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-[#FF6B6B]/20 text-[#FF6B6B] mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-sm font-semibold text-white block">Client-Side Privacy Safe</strong>
                    <span className="text-xs text-stone-300">Your guest data and personal contacts are never sent to external servers unnecessarily.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/app/create"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-[#2D1236] bg-white hover:bg-stone-100 transition-colors shadow-lg"
                >
                  Create Your First Plan
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Score Visual Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/15 space-y-6">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div>
                  <span className="text-xs text-stone-300 uppercase tracking-wider block">Live Calculation</span>
                  <h4 className="font-serif text-2xl font-bold">Event Readiness Score</h4>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-bold text-[#FF6B6B]">88%</span>
                  <span className="block text-[11px] text-emerald-400 font-semibold">Ready to Celebrate</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-stone-200">
                <div className="flex justify-between">
                  <span>Task Execution (30 max)</span>
                  <strong className="text-white">26 pts</strong>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[86%]" />
                </div>

                <div className="flex justify-between">
                  <span>Budget Health & Discipline (25 max)</span>
                  <strong className="text-white">24 pts</strong>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[96%]" />
                </div>

                <div className="flex justify-between">
                  <span>Vendor Booking Confirmations (25 max)</span>
                  <strong className="text-white">22 pts</strong>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[88%]" />
                </div>

                <div className="flex justify-between">
                  <span>Timeline & Date Proximity (10 max)</span>
                  <strong className="text-white">8 pts</strong>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[80%]" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-amber-200 space-y-1">
                <span className="font-bold uppercase tracking-wider text-[10px] block">Next Most Impactful Action:</span>
                <p>Confirm the final 2 vendor contracts to achieve a 95%+ Readiness Score.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E05368]">Got Questions?</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D1236]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-stone-200 bg-[#FAF8F5] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full text-left p-5 flex items-center justify-between text-base font-semibold text-[#2D1236] hover:text-[#E05368] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className={`text-xl font-mono ml-4 transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-stone-600 leading-relaxed border-t border-stone-200/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-[#FAF0F2] border-t border-[#E05368]/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D1236]">
            Ready to Plan a Celebration Worth Remembering?
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto text-base">
            Start right now with our 6-step wizard. No login or credit card required.
          </p>
          <div className="pt-2">
            <Link
              to="/app/create"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56] hover:brightness-105 shadow-xl shadow-[#E05368]/30 transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-5 h-5" />
              Plan My Event Now
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

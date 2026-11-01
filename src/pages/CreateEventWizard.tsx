import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Check,
  DollarSign,
  Users,
  Palette,
  Target,
  FileCheck,
  AlertCircle,
  Gem,
  Cake,
  Heart,
  Briefcase,
  GraduationCap,
  Flame,
  Star,
} from 'lucide-react';
import {
  BudgetTier,
  Currency,
  EventDuration,
  EventPriority,
  EventType,
  VenueStatus,
} from '../types';
import { useEventContext } from '../context/EventContext';
import { CURRENCY_SYMBOLS, formatCurrency } from '../utils/formatters';

const STEPS = [
  { id: 1, label: 'Basics', icon: Calendar },
  { id: 2, label: 'Budget', icon: DollarSign },
  { id: 3, label: 'Guests', icon: Users },
  { id: 4, label: 'Style & Vibe', icon: Palette },
  { id: 5, label: 'Priorities', icon: Target },
  { id: 6, label: 'Review & Plan', icon: FileCheck },
];

const EVENT_TYPES: { id: EventType; label: string; icon: any; defaultBudget: number }[] = [
  { id: 'wedding', label: 'Wedding & Reception', icon: Gem, defaultBudget: 1500000 },
  { id: 'birthday', label: 'Birthday Party', icon: Cake, defaultBudget: 50000 },
  { id: 'anniversary', label: 'Anniversary', icon: Heart, defaultBudget: 100000 },
  { id: 'corporate', label: 'Corporate Event', icon: Briefcase, defaultBudget: 350000 },
  { id: 'college', label: 'College Fest / Gala', icon: GraduationCap, defaultBudget: 250000 },
  { id: 'community', label: 'Community Festival', icon: Users, defaultBudget: 120000 },
  { id: 'engagement', label: 'Engagement Ceremony', icon: Sparkles, defaultBudget: 300000 },
  { id: 'baby_shower', label: 'Baby Shower', icon: Heart, defaultBudget: 60000 },
  { id: 'festival', label: 'Family Pooja / Festival', icon: Flame, defaultBudget: 80000 },
  { id: 'custom', label: 'Custom Celebration', icon: Star, defaultBudget: 100000 },
];

const PRIORITIES_LIST: { id: EventPriority; label: string; desc: string }[] = [
  { id: 'venue', label: 'Stunning Venue & Setting', desc: 'Ambiance, space, and aesthetic architecture' },
  { id: 'food', label: 'Exquisite Food & Catering', desc: 'Memorable taste, live stations & beverage hospitality' },
  { id: 'photography', label: 'Photography & Filmmaking', desc: 'Timeless candid frames, drone shots & reels' },
  { id: 'decorations', label: 'Decor, Florals & Lighting', desc: 'Immersive theme styling, florals, and stage backdrops' },
  { id: 'entertainment', label: 'Music & Entertainment', desc: 'DJ, live acoustic artists, emcee, and dance floor energy' },
  { id: 'guest_experience', label: 'Guest Comfort & Hospitality', desc: 'Effortless seating, welcome kits, and accessibility' },
  { id: 'sustainability', label: 'Eco-Friendly & Sustainable', desc: 'Zero plastic, digital invites, and minimal waste' },
  { id: 'affordability', label: 'Cost Efficiency & Value', desc: 'Smart bargains, maximum ROI, and zero debt' },
];

export const CreateEventWizard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createEvent, settings } = useEventContext();

  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStepText, setGenerationStepText] = useState('Initializing AI Planning Engine...');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState(() => ({
    title: '',
    eventType: (searchParams.get('type') as EventType) || 'wedding',
    date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
    duration: 'full_day' as EventDuration,
    city: 'Mumbai',
    venueStatus: 'searching' as VenueStatus,
    venueName: '',
    indoorOutdoor: 'hybrid' as 'indoor' | 'outdoor' | 'hybrid',

    totalBudget: 800000,
    currency: (settings.defaultCurrency || 'INR') as Currency,
    budgetTier: 'balanced' as BudgetTier,

    guestCount: 120,
    adultsCount: 100,
    childrenCount: 20,
    accessibilityNeeds: [] as string[],

    theme: 'Modern Festive Elegance',
    atmosphere: 'Warm, vibrant, heartfelt celebration',
    culturalTraditions: 'Traditional greetings with modern cocktail reception',
    dietaryRequirements: ['Vegetarian', 'Non-Vegetarian'],
    specialRequests: '',

    priorities: ['venue', 'food', 'decorations'] as EventPriority[],
  }));

  const updateField = (field: string, value: any) => {
    if (field === 'eventType') {
      const typeObj = EVENT_TYPES.find((t) => t.id === value);
      setFormData((prev) => ({
        ...prev,
        eventType: value,
        totalBudget: typeObj ? typeObj.defaultBudget : prev.totalBudget,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    setErrorMsg('');
  };

  const handleNext = () => {
    // Step Validations
    if (currentStep === 1) {
      if (!formData.title.trim()) {
        setErrorMsg('Please enter a name for your celebration.');
        return;
      }
      if (!formData.city.trim()) {
        setErrorMsg('Please specify the city or region.');
        return;
      }
      if (!formData.date) {
        setErrorMsg('Please choose an event date.');
        return;
      }
    }

    if (currentStep === 2) {
      if (formData.totalBudget <= 0 || isNaN(formData.totalBudget)) {
        setErrorMsg('Please enter a valid budget amount.');
        return;
      }
    }

    if (currentStep === 3) {
      if (formData.guestCount <= 0 || isNaN(formData.guestCount)) {
        setErrorMsg('Please enter an estimated guest count.');
        return;
      }
    }

    if (currentStep === 5) {
      if (formData.priorities.length === 0) {
        setErrorMsg('Please select at least 1 priority for your celebration.');
        return;
      }
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleFinalGenerate();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrorMsg('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalGenerate = () => {
    setIsGenerating(true);

    const steps = [
      'Calibrating event parameters & guest count...',
      'Optimizing mathematical budget allocation categories...',
      'Synthesizing time-aware milestone deadlines...',
      'Generating theme swatches, decor concepts & catering ideas...',
      'Creating risk contingency backups...',
      'Finalizing your celebration workspace...',
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setGenerationStepText(steps[stepIndex]);
      } else {
        clearInterval(interval);
        // Persist event
        const newEvent = createEvent({
          title: formData.title,
          eventType: formData.eventType,
          date: formData.date,
          duration: formData.duration,
          city: formData.city,
          venueStatus: formData.venueStatus,
          venueName: formData.venueName,
          totalBudget: formData.totalBudget,
          currency: formData.currency,
          budgetTier: formData.budgetTier,
          guestCount: formData.guestCount,
          adultsCount: formData.adultsCount,
          childrenCount: formData.childrenCount,
          priorities: formData.priorities,
          preferences: {
            theme: formData.theme,
            colorPalette: [
              { name: 'Warm Coral', hex: '#FF6B6B' },
              { name: 'Gold', hex: '#D4AF37' },
              { name: 'Ivory', hex: '#FAF8F5' },
              { name: 'Midnight', hex: '#2D1236' },
            ],
            atmosphere: formData.atmosphere,
            culturalTraditions: formData.culturalTraditions,
            dietaryRequirements: formData.dietaryRequirements,
            accessibilityNeeds: formData.accessibilityNeeds,
            specialRequests: formData.specialRequests,
            indoorOutdoor: formData.indoorOutdoor,
          },
        });

        setIsGenerating(false);
        navigate(`/app/events/${newEvent.id}/plan`);
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D1236] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 py-4 px-6 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#E05368] to-[#9C88FF] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-serif font-bold text-lg text-[#2D1236]">Celebrate<span className="text-[#E05368]">AI</span></span>
          </Link>

          <Link
            to="/app/dashboard"
            className="text-xs font-semibold text-stone-500 hover:text-[#2D1236] transition-colors"
          >
            Cancel & Exit
          </Link>
        </div>
      </header>

      {/* Main Wizard Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        {/* Step Progress Pills */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-stone-200 w-full z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#E05368] transition-all duration-300 z-0"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />

            {STEPS.map((step) => {
              const isPast = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const Icon = step.icon;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPast
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isCurrent
                        ? 'bg-[#E05368] text-white shadow-md ring-4 ring-[#E05368]/20'
                        : 'bg-white text-stone-400 border border-stone-300'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`hidden sm:block text-[11px] font-semibold mt-2 ${
                      isCurrent ? 'text-[#E05368]' : isPast ? 'text-stone-700' : 'text-stone-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-200/90 relative overflow-hidden">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: BASICS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1 border-b border-stone-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E05368]">Step 1 of 6</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1236]">Let's begin with the essentials</h2>
                <p className="text-sm text-stone-500">What celebration are we bringing to life?</p>
              </div>

              {/* Event Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Celebration Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Maya's 25th Sunset Birthday or Rahul & Sneha's Wedding"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#E05368] focus:ring-2 focus:ring-[#E05368]/20 outline-none text-base"
                />
              </div>

              {/* Event Type Grid */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Celebration Type *</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {EVENT_TYPES.map((t) => {
                    const Icon = t.icon;
                    const isSelected = formData.eventType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => updateField('eventType', t.id)}
                        className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'bg-[#FAF0F2] border-[#E05368] text-[#E05368] shadow-2xs ring-2 ring-[#E05368]/20'
                            : 'bg-[#FAF8F5] border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-semibold block leading-tight">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Event Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#E05368] outline-none text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Duration</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => updateField('duration', e.target.value as EventDuration)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#E05368] outline-none text-sm bg-white"
                  >
                    <option value="few_hours">A Few Hours (Evening Party)</option>
                    <option value="half_day">Half Day (4–6 hours)</option>
                    <option value="full_day">Full Day Celebration</option>
                    <option value="multi_day">Multi-Day Gala (2–3 days)</option>
                  </select>
                </div>
              </div>

              {/* City, Venue Status & Indoor/Outdoor */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Host City *</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Jaipur, Bengaluru"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#E05368] outline-none text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Venue Status</label>
                  <select
                    value={formData.venueStatus}
                    onChange={(e) => updateField('venueStatus', e.target.value as VenueStatus)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#E05368] outline-none text-sm bg-white"
                  >
                    <option value="searching">Still Searching / Need Suggestions</option>
                    <option value="shortlisted">Have Shortlisted Options</option>
                    <option value="booked">Already Booked</option>
                    <option value="home_or_private">Home / Private Property</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Setting Preference</label>
                  <select
                    value={formData.indoorOutdoor}
                    onChange={(e) => updateField('indoorOutdoor', e.target.value as any)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#E05368] outline-none text-sm bg-white"
                  >
                    <option value="indoor">Indoor (AC Banquet / Hall)</option>
                    <option value="outdoor">Outdoor (Lawn / Terrace / Beach)</option>
                    <option value="hybrid">Hybrid (Indoor + Lawn)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BUDGET */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1 border-b border-stone-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E05368]">Step 2 of 6</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1236]">Budget & Financial Strategy</h2>
                <p className="text-sm text-stone-500">Every rupee or dollar is accounted for by the AI optimizer.</p>
              </div>

              {/* Total Budget & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Total Planned Budget *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-lg">
                      {CURRENCY_SYMBOLS[formData.currency]}
                    </span>
                    <input
                      type="number"
                      min="1000"
                      step="5000"
                      value={formData.totalBudget}
                      onChange={(e) => updateField('totalBudget', Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-300 focus:border-[#E05368] outline-none text-lg font-bold"
                    />
                  </div>
                  <span className="text-xs text-stone-500">
                    Formatted: <strong className="text-[#2D1236]">{formatCurrency(formData.totalBudget, formData.currency)}</strong>
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => updateField('currency', e.target.value as Currency)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#E05368] outline-none text-sm bg-white"
                  >
                    <option value="INR">INR (₹ - Indian Rupee)</option>
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                  </select>
                </div>
              </div>

              {/* Budget Flexibility Tier */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Celebration Scale Tier</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'low_cost', title: 'Value & Low-Cost', desc: 'Focus on smart DIY, essential vendors, and maximum efficiency.' },
                    { id: 'balanced', title: 'Balanced & Polished', desc: 'Optimal blend of quality catering, ambient decor, and guest comforts.' },
                    { id: 'premium', title: 'Luxury & Grandeur', desc: 'High-end experiential styling, top-tier vendors, and bespoke touches.' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => updateField('budgetTier', tier.id as BudgetTier)}
                      className={`p-4 rounded-2xl text-left border transition-all space-y-1.5 ${
                        formData.budgetTier === tier.id
                          ? 'bg-[#FAF0F2] border-[#E05368] text-[#2D1236] ring-2 ring-[#E05368]/20 shadow-2xs'
                          : 'bg-[#FAF8F5] border-stone-200 hover:border-stone-300 text-stone-600'
                      }`}
                    >
                      <strong className="block text-sm font-serif font-bold">{tier.title}</strong>
                      <p className="text-xs text-stone-500 leading-relaxed">{tier.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: GUESTS */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1 border-b border-stone-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E05368]">Step 3 of 6</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1236]">Guest Count & Accessibility</h2>
                <p className="text-sm text-stone-500">Catering, seating, and venue sizing adapt to these numbers.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Total Estimated Guests *</label>
                  <input
                    type="number"
                    min="2"
                    max="10000"
                    value={formData.guestCount}
                    onChange={(e) => {
                      const count = Number(e.target.value);
                      updateField('guestCount', count);
                      updateField('adultsCount', Math.round(count * 0.85));
                      updateField('childrenCount', Math.round(count * 0.15));
                    }}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#E05368] outline-none text-lg font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Adult Attendees</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.adultsCount}
                    onChange={(e) => updateField('adultsCount', Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#E05368] outline-none text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Children / Toddlers</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.childrenCount}
                    onChange={(e) => updateField('childrenCount', Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#E05368] outline-none text-sm"
                  />
                </div>
              </div>

              {/* Accessibility Accommodations */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Special Accommodations</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    'Wheelchair ramps & step-free access',
                    'Elderly-friendly priority seating near stage',
                    'Designated baby care & nursing lounge',
                    'Elevator access for rooftop / mezzanine',
                  ].map((item) => {
                    const isChecked = formData.accessibilityNeeds.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            updateField('accessibilityNeeds', formData.accessibilityNeeds.filter((n) => n !== item));
                          } else {
                            updateField('accessibilityNeeds', [...formData.accessibilityNeeds, item]);
                          }
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                          isChecked ? 'bg-[#FAF0F2] border-[#E05368] text-[#E05368] font-semibold' : 'bg-[#FAF8F5] border-stone-200 text-stone-600'
                        }`}
                      >
                        <span>{item}</span>
                        {isChecked && <Check className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: STYLE & PREFERENCES */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1 border-b border-stone-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E05368]">Step 4 of 6</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1236]">Aesthetic Style & Traditions</h2>
                <p className="text-sm text-stone-500">What mood, colors, and culinary choices will define this day?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Theme Concept</label>
                  <input
                    type="text"
                    value={formData.theme}
                    onChange={(e) => updateField('theme', e.target.value)}
                    placeholder="e.g. Royal Rajasthani, Bohemian Garden, Neon Retro"
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#E05368] outline-none text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Desired Atmosphere</label>
                  <input
                    type="text"
                    value={formData.atmosphere}
                    onChange={(e) => updateField('atmosphere', e.target.value)}
                    placeholder="e.g. Regal & emotional, High energy dance party, Intimate & cozy"
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#E05368] outline-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Cultural or Traditional Elements</label>
                <input
                  type="text"
                  value={formData.culturalTraditions}
                  onChange={(e) => updateField('culturalTraditions', e.target.value)}
                  placeholder="e.g. Sangeet with Marwari Pheras, South Indian traditional lunch on banana leaves"
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#E05368] outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Dietary Requirements</label>
                <div className="flex flex-wrap gap-2 text-xs">
                  {['Vegetarian', 'Non-Vegetarian', 'Jain Options', 'Vegan', 'Halal', 'Gluten-Free'].map((item) => {
                    const isChecked = formData.dietaryRequirements.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            updateField('dietaryRequirements', formData.dietaryRequirements.filter((d) => d !== item));
                          } else {
                            updateField('dietaryRequirements', [...formData.dietaryRequirements, item]);
                          }
                        }}
                        className={`px-3 py-2 rounded-xl border transition-colors flex items-center gap-1.5 ${
                          isChecked ? 'bg-[#FAF0F2] border-[#E05368] text-[#E05368] font-bold' : 'bg-[#FAF8F5] border-stone-200 text-stone-600'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PRIORITIES */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1 border-b border-stone-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E05368]">Step 5 of 6</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1236]">Define Your Celebration Priorities</h2>
                <p className="text-sm text-stone-500">The AI optimizer weights budget and vendor suggestions towards your priorities.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRIORITIES_LIST.map((p) => {
                  const isSelected = formData.priorities.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          updateField('priorities', formData.priorities.filter((item) => item !== p.id));
                        } else {
                          updateField('priorities', [...formData.priorities, p.id]);
                        }
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all space-y-1 ${
                        isSelected
                          ? 'bg-[#FAF0F2] border-[#E05368] text-[#2D1236] ring-2 ring-[#E05368]/20 shadow-2xs'
                          : 'bg-[#FAF8F5] border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-sm font-serif font-bold text-[#2D1236]">{p.label}</strong>
                        {isSelected && <Check className="w-4 h-4 text-[#E05368]" />}
                      </div>
                      <p className="text-xs text-stone-500">{p.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW & SUMMARY */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1 border-b border-stone-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E05368]">Step 6 of 6</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1236]">Review & Generate Your Plan</h2>
                <p className="text-sm text-stone-500">Verify your details before the AI builds your custom celebration plan.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Event Basics</span>
                  <p className="font-serif text-lg font-bold text-[#2D1236]">{formData.title}</p>
                  <p className="text-xs text-stone-600">Type: <strong className="uppercase">{formData.eventType}</strong></p>
                  <p className="text-xs text-stone-600">Date: <strong>{formData.date}</strong> in <strong>{formData.city}</strong></p>
                  <p className="text-xs text-stone-600">Setting: <strong className="capitalize">{formData.indoorOutdoor}</strong> ({formData.venueStatus})</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Budget & Scale</span>
                  <p className="text-2xl font-bold text-[#E05368]">{formatCurrency(formData.totalBudget, formData.currency)}</p>
                  <p className="text-xs text-stone-600">Scale Tier: <strong className="capitalize">{formData.budgetTier}</strong></p>
                  <p className="text-xs text-stone-600">Guests: <strong>{formData.guestCount}</strong> ({formData.adultsCount} Adults, {formData.childrenCount} Children)</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Vibe & Theme</span>
                  <p className="text-sm font-bold text-[#2D1236]">{formData.theme}</p>
                  <p className="text-xs text-stone-600">Atmosphere: {formData.atmosphere}</p>
                  <p className="text-xs text-stone-600">Dietary: {formData.dietaryRequirements.join(', ')}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Priorities</span>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.priorities.map((p) => (
                      <span key={p} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white border border-stone-200 uppercase">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Action Footer */}
          <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Step
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56] hover:brightness-105 shadow-md shadow-[#E05368]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {currentStep === 6 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate AI Event Plan
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Generating AI Plan Loading Overlay Modal */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 border border-stone-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#E05368] to-[#9C88FF] text-white flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-[#2D1236]">Building Your Celebration</h3>
              <p className="text-xs font-mono text-[#E05368] animate-pulse">{generationStepText}</p>
            </div>

            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#E05368] to-[#9C88FF] h-full w-full animate-[progress_2.5s_ease-in-out_infinite]" />
            </div>

            <p className="text-xs text-stone-400">
              Personalizing budget proportions, timeline milestones, and theme swatches for {formData.title}...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

import {
  BudgetCategory,
  CelebrationEvent,
  ChatMessage,
  Expense,
  GeneratedEventPlan,
  StructuredProposal,
  Task,
  Vendor,
} from '../types';
import { generateId } from '../utils/formatters';

// Budget allocation presets by event type (percentages summing to 100%)
const BUDGET_PROPORTIONS: Record<string, { name: string; pct: number; icon: string }[]> = {
  wedding: [
    { name: 'Venue & Staging', pct: 28, icon: 'Castle' },
    { name: 'Catering & Beverages', pct: 30, icon: 'Utensils' },
    { name: 'Decor, Mandap & Florals', pct: 15, icon: 'Flower2' },
    { name: 'Photography & Cinematography', pct: 11, icon: 'Camera' },
    { name: 'Bridal & Groom Attire / Hair-Makeup', pct: 6, icon: 'Sparkles' },
    { name: 'Music, Sound & Entertainment', pct: 4, icon: 'Music' },
    { name: 'Invitations & Favors', pct: 2, icon: 'Mail' },
    { name: 'Emergency Contingency Reserve', pct: 4, icon: 'ShieldAlert' },
  ],
  birthday: [
    { name: 'Venue / Space Rental', pct: 25, icon: 'Home' },
    { name: 'Food & Custom Birthday Cake', pct: 35, icon: 'Cake' },
    { name: 'Themed Decor & Balloon Styling', pct: 15, icon: 'PartyPopper' },
    { name: 'Entertainment & Games/DJ', pct: 12, icon: 'Gamepad2' },
    { name: 'Return Gifts & Favors', pct: 8, icon: 'Gift' },
    { name: 'Contingency & Supplies', pct: 5, icon: 'ShieldAlert' },
  ],
  anniversary: [
    { name: 'Venue / Dining Room', pct: 30, icon: 'Building' },
    { name: 'Gourmet Dinner & Cocktails', pct: 35, icon: 'Wine' },
    { name: 'Intimate Lighting & Floral Styling', pct: 15, icon: 'Flower2' },
    { name: 'Live Acoustic Musician / Saxophone', pct: 10, icon: 'Music' },
    { name: 'Photography & Keepsakes', pct: 6, icon: 'Camera' },
    { name: 'Contingency', pct: 4, icon: 'ShieldAlert' },
  ],
  corporate: [
    { name: 'Conference Venue & Audio/Visual', pct: 35, icon: 'Monitor' },
    { name: 'Executive Catering & Refreshments', pct: 30, icon: 'Coffee' },
    { name: 'Keynote Speaker & Host', pct: 15, icon: 'Mic' },
    { name: 'Branded Collateral & Welcome Kits', pct: 10, icon: 'Briefcase' },
    { name: 'Logistics, Badges & Check-in', pct: 5, icon: 'QrCode' },
    { name: 'Contingency Reserve', pct: 5, icon: 'ShieldAlert' },
  ],
  college: [
    { name: 'Auditorium / Ground Setup & Sound', pct: 30, icon: 'Speaker' },
    { name: 'Artist / DJ Performance', pct: 25, icon: 'Disc' },
    { name: 'Food Trucks & Snacks', pct: 20, icon: 'Utensils' },
    { name: 'Security, First Aid & Crowd Control', pct: 10, icon: 'Shield' },
    { name: 'Marketing, Badges & Wristbands', pct: 8, icon: 'Tag' },
    { name: 'Contingency', pct: 7, icon: 'ShieldAlert' },
  ],
  community: [
    { name: 'Ground/Hall Rental & Permits', pct: 25, icon: 'MapPin' },
    { name: 'Community Feast / Potluck Setup', pct: 30, icon: 'UtensilsCrossed' },
    { name: 'Seating, Tents & Sound System', pct: 20, icon: 'Armchair' },
    { name: 'Children Activities & Cultural Stage', pct: 15, icon: 'Smile' },
    { name: 'Safety, Waste Management & Cleanup', pct: 5, icon: 'Recycle' },
    { name: 'Contingency Reserve', pct: 5, icon: 'ShieldAlert' },
  ],
  engagement: [
    { name: 'Venue & Backdrops', pct: 30, icon: 'Sparkles' },
    { name: 'Dinner & Hors d’oeuvres', pct: 35, icon: 'Utensils' },
    { name: 'Ring Ceremony Styling & Florals', pct: 15, icon: 'Gem' },
    { name: 'Candid Photography', pct: 10, icon: 'Camera' },
    { name: 'Music & Ambient Lighting', pct: 6, icon: 'Music' },
    { name: 'Contingency', pct: 4, icon: 'ShieldAlert' },
  ],
  baby_shower: [
    { name: 'Venue / Garden Space', pct: 25, icon: 'Home' },
    { name: 'Brunch / High-Tea Catering & Desserts', pct: 35, icon: 'Coffee' },
    { name: 'Pastel Floral & Balloon Photo Backdrop', pct: 20, icon: 'Heart' },
    { name: 'Interactive Baby Shower Games & Host', pct: 10, icon: 'Smile' },
    { name: 'Mom-to-be Favors & Guest Gifts', pct: 6, icon: 'Gift' },
    { name: 'Contingency', pct: 4, icon: 'ShieldAlert' },
  ],
  festival: [
    { name: 'Pooja / Sacred Setup & Sacred Decor', pct: 25, icon: 'Flame' },
    { name: 'Traditional Feast / Prasadam Catering', pct: 35, icon: 'Utensils' },
    { name: 'Fairy Lighting, Diyas & Floral Garlands', pct: 20, icon: 'Sparkles' },
    { name: 'Traditional Musicians / Bhajans / Folk', pct: 10, icon: 'Music' },
    { name: 'Sweets & Gift Hampers for Relatives', pct: 6, icon: 'Gift' },
    { name: 'Contingency & Cleaning', pct: 4, icon: 'ShieldAlert' },
  ],
  custom: [
    { name: 'Venue & Facilities', pct: 30, icon: 'Building' },
    { name: 'Food & Beverage Service', pct: 35, icon: 'Utensils' },
    { name: 'Decor, Lighting & Staging', pct: 15, icon: 'Sparkles' },
    { name: 'Entertainment & Activities', pct: 10, icon: 'PartyPopper' },
    { name: 'Photography & Mementos', pct: 5, icon: 'Camera' },
    { name: 'Contingency Reserve', pct: 5, icon: 'ShieldAlert' },
  ],
};

export class AiPlanningEngine {
  /**
   * Generates tailored budget categories strictly summing up to totalBudget
   */
  static generateBudgetCategories(event: Partial<CelebrationEvent>): BudgetCategory[] {
    const total = event.totalBudget || 50000;
    const type = event.eventType || 'custom';
    const breakdown = BUDGET_PROPORTIONS[type] || BUDGET_PROPORTIONS.custom;

    let allocatedSum = 0;
    const categories: BudgetCategory[] = breakdown.map((item, index) => {
      // Last category absorbs any rounding difference to ensure sum === total exactly
      const amount =
        index === breakdown.length - 1
          ? total - allocatedSum
          : Math.round((item.pct / 100) * total);

      allocatedSum += amount;

      return {
        id: generateId('cat'),
        name: item.name,
        allocatedAmount: amount,
        iconName: item.icon,
        notes: `AI suggested ${item.pct}% based on ${type} benchmarks and ${event.guestCount || 50} guests.`,
      };
    });

    return categories;
  }

  /**
   * Generates realistic initial expenses mapped to categories
   */
  static generateInitialExpenses(
    categories: BudgetCategory[],
    _tier: string = 'balanced'
  ): Expense[] {
    const expenses: Expense[] = [];

    categories.forEach((cat) => {
      // Create 1 or 2 typical line-items per category
      if (cat.name.includes('Venue')) {
        expenses.push({
          id: generateId('exp'),
          categoryId: cat.id,
          title: 'Primary Venue Deposit / Advance',
          estimatedCost: Math.round(cat.allocatedAmount * 0.5),
          actualCost: 0,
          isPaid: false,
          notes: 'Standard 50% advance booking confirmation deposit.',
          createdAt: new Date().toISOString(),
        });
      } else if (cat.name.includes('Catering') || cat.name.includes('Food')) {
        expenses.push({
          id: generateId('exp'),
          categoryId: cat.id,
          title: 'Catering Per-Plate Advance Booking',
          estimatedCost: Math.round(cat.allocatedAmount * 0.4),
          actualCost: 0,
          isPaid: false,
          notes: 'Menu finalized with live food counters.',
          createdAt: new Date().toISOString(),
        });
      } else if (cat.name.includes('Decor')) {
        expenses.push({
          id: generateId('exp'),
          categoryId: cat.id,
          title: 'Entrance Arch & Stage Floral Concepts',
          estimatedCost: Math.round(cat.allocatedAmount * 0.6),
          actualCost: 0,
          isPaid: false,
          notes: 'Includes ambient fairy lighting and drape work.',
          createdAt: new Date().toISOString(),
        });
      } else if (cat.name.includes('Photography')) {
        expenses.push({
          id: generateId('exp'),
          categoryId: cat.id,
          title: 'Photographer & Reel/Drone Retainer',
          estimatedCost: Math.round(cat.allocatedAmount * 0.45),
          actualCost: 0,
          isPaid: false,
          notes: 'Full-day candid coverage + digital album.',
          createdAt: new Date().toISOString(),
        });
      }
    });

    return expenses;
  }

  /**
   * Generates timeline tasks with smart deadlines relative to event date
   */
  static generateTimelineTasks(event: Partial<CelebrationEvent>): Task[] {
    const eventDate = event.date ? new Date(event.date) : new Date(Date.now() + 30 * 86400000);
    const now = new Date();
    const daysUntilEvent = Math.max(1, Math.round((eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24)));

    // Helper to calculate milestone date
    const getMilestoneDate = (ratioBefore: number): string => {
      // ratioBefore: 0.8 means 80% of available time remains (early), 0.1 means near the event
      const offsetDays = Math.max(1, Math.round(daysUntilEvent * (1 - ratioBefore)));
      const taskDate = new Date(now.getTime() + offsetDays * 86400000);
      if (taskDate > eventDate) return eventDate.toISOString().split('T')[0];
      return taskDate.toISOString().split('T')[0];
    };

    const type = event.eventType || 'celebration';
    const city = event.city || 'your city';

    const tasks: Task[] = [
      {
        id: generateId('tsk'),
        title: `Lock and confirm venue in ${city}`,
        description: 'Verify capacity, parking, noise curfew, and power backup arrangements.',
        dueDate: getMilestoneDate(0.85),
        priority: 'urgent',
        category: 'Venue & Logistics',
        isCompleted: event.venueStatus === 'booked',
        phase: 'early_planning',
      },
      {
        id: generateId('tsk'),
        title: 'Finalize menu tasting & dietary requirements',
        description: `Confirm choices catering to ${event.guestCount || 40} guests including vegetarian and kids options.`,
        dueDate: getMilestoneDate(0.7),
        priority: 'high',
        category: 'Catering',
        isCompleted: false,
        phase: 'booking',
      },
      {
        id: generateId('tsk'),
        title: `Select theme mood board and color swatches for ${type}`,
        description: `Align decor rentals with the chosen ${event.preferences?.theme || 'elegant'} palette.`,
        dueDate: getMilestoneDate(0.6),
        priority: 'medium',
        category: 'Decor & Styling',
        isCompleted: false,
        phase: 'preparation',
      },
      {
        id: generateId('tsk'),
        title: 'Dispatch digital invitations & track RSVPs',
        description: 'Send personalized digital invitations with venue map links and RSVP deadline.',
        dueDate: getMilestoneDate(0.5),
        priority: 'high',
        category: 'Guest Management',
        isCompleted: false,
        phase: 'preparation',
      },
      {
        id: generateId('tsk'),
        title: 'Book candid photographer and audio/DJ setup',
        description: 'Review portfolio, agree on shot list, deliverables timeline, and sound checklist.',
        dueDate: getMilestoneDate(0.4),
        priority: 'medium',
        category: 'Entertainment & Media',
        isCompleted: false,
        phase: 'booking',
      },
      {
        id: generateId('tsk'),
        title: 'Conduct final vendor coordination call',
        description: 'Confirm load-in times, contact numbers, stage layout, and electrical cords.',
        dueDate: getMilestoneDate(0.15),
        priority: 'urgent',
        category: 'Coordination',
        isCompleted: false,
        phase: 'final_week',
      },
      {
        id: generateId('tsk'),
        title: 'Prepare emergency kit & final cash disbursements',
        description: 'First aid, extra safety pins, power banks, and labeled envelopes for vendor balance tips.',
        dueDate: getMilestoneDate(0.05),
        priority: 'high',
        category: 'Event Day',
        isCompleted: false,
        phase: 'final_week',
      },
    ];

    return tasks;
  }

  /**
   * Generates illustrative vendor criteria and suggestions
   */
  static generateVendors(event: Partial<CelebrationEvent>): Vendor[] {
    const city = event.city || 'Metro';
    const total = event.totalBudget || 50000;

    return [
      {
        id: generateId('vnd'),
        name: `The Grand Heritage & Banquets (${city})`,
        category: 'Venue',
        contactPerson: 'Venue Operations Desk',
        phone: '+91 98765 43210',
        email: 'events@grandheritage.sample',
        estimatedCost: Math.round(total * 0.28),
        quotedCost: Math.round(total * 0.26),
        paidAmount: event.venueStatus === 'booked' ? Math.round(total * 0.1) : 0,
        status: event.venueStatus === 'booked' ? 'booked' : 'negotiating',
        notes: 'Includes indoor AC hall, generator backup, and 4 green rooms.',
        paymentDeadline: event.date,
        isAiSuggested: true,
      },
      {
        id: generateId('vnd'),
        name: `Saffron & Spice Gourmet Catering`,
        category: 'Catering',
        contactPerson: 'Chef Raghav Sharma',
        phone: '+91 91234 56789',
        email: 'raghav@saffronspice.sample',
        estimatedCost: Math.round(total * 0.3),
        quotedCost: Math.round(total * 0.28),
        paidAmount: 0,
        status: 'quote_received',
        notes: 'Live counters: Chaat station, wood-fired appetizers, customized mocktail bar.',
        paymentDeadline: event.date,
        isAiSuggested: true,
      },
      {
        id: generateId('vnd'),
        name: `Bloom & Shimmer Luxury Styling`,
        category: 'Decorations',
        contactPerson: 'Priya Mehra',
        phone: '+91 99887 76655',
        email: 'priya@bloomandshimmer.sample',
        estimatedCost: Math.round(total * 0.15),
        quotedCost: Math.round(total * 0.15),
        paidAmount: 0,
        status: 'contacted',
        notes: 'Fabric drapes, fairy-light canopies, and fresh floral photo-op booth.',
        paymentDeadline: event.date,
        isAiSuggested: true,
      },
      {
        id: generateId('vnd'),
        name: `Candid Moments Studios`,
        category: 'Photography',
        contactPerson: 'Arun Varma',
        phone: '+91 97654 32109',
        email: 'arun@candidmoments.sample',
        estimatedCost: Math.round(total * 0.1),
        quotedCost: Math.round(total * 0.09),
        paidAmount: 0,
        status: 'researching',
        notes: 'Includes 2 candid photographers, 1 videographer, and 4K highlight teaser.',
        paymentDeadline: event.date,
        isAiSuggested: true,
      },
    ];
  }

  /**
   * Generates comprehensive personalized event plan
   */
  static generateComprehensivePlan(event: Partial<CelebrationEvent>): GeneratedEventPlan {
    const type = event.eventType || 'birthday';
    const city = event.city || 'your city';
    const guestCount = event.guestCount || 50;
    const themeName = event.preferences?.theme || 'Timeless Royal Elegance';
    const isOutdoor = event.preferences?.indoorOutdoor === 'outdoor';

    const colorPalettes: Record<string, { name: string; hex: string }[]> = {
      wedding: [
        { name: 'Royal Plum', hex: '#3B1443' },
        { name: 'Champagne Gold', hex: '#D4AF37' },
        { name: 'Blush Rose', hex: '#F4C2C2' },
        { name: 'Ivory Silk', hex: '#FDFBF7' },
      ],
      birthday: [
        { name: 'Sunset Coral', hex: '#FF6B6B' },
        { name: 'Warm Amber', hex: '#FFB84D' },
        { name: 'Soft Lavender', hex: '#9C88FF' },
        { name: 'Clean Cream', hex: '#FAF8F5' },
      ],
      corporate: [
        { name: 'Midnight Navy', hex: '#1E293B' },
        { name: 'Burnished Copper', hex: '#C27803' },
        { name: 'Cool Slate', hex: '#64748B' },
        { name: 'Crisp Snow', hex: '#FFFFFF' },
      ],
      college: [
        { name: 'Electric Violet', hex: '#8B5CF6' },
        { name: 'Neon Coral', hex: '#F43F5E' },
        { name: 'Cyan Glow', hex: '#06B6D4' },
        { name: 'Charcoal Night', hex: '#0F172A' },
      ],
      anniversary: [
        { name: 'Burgundy Velvet', hex: '#651528' },
        { name: 'Antique Gold', hex: '#C5A059' },
        { name: 'Tuscan Cream', hex: '#F7E7CE' },
        { name: 'Rosewood', hex: '#9E4770' },
      ],
    };

    const palette = colorPalettes[type] || colorPalettes.birthday;

    return {
      conceptSummary: `A sophisticated, guest-centric ${type} celebration in ${city} carefully calibrated for ${guestCount} attendees. Designed to balance warm hospitality with seamless operational timing and aesthetic grandeur.`,
      suggestedTheme: themeName,
      colorPalette: palette,
      decorationIdeas: [
        'Cascading warm fairy-light tunnel or floral archway at the main greeting threshold',
        'Personalized memory wall / chronological milestone gallery with soft uplighting',
        'Minimalist low-profile floral table centerpieces allowing natural across-table conversation',
        'Cohesive welcome signage in acrylic/brass with bespoke typography and guest greetings',
        'Dedicated interactive photo-lounge featuring textured botanical backing and neon quote',
      ],
      activityIdeas: [
        'Interactive guestbook experience with Polaroid instant camera prints and handwritten well-wishes',
        'Curated 15-minute signature spotlight segment (video montage / heartfelt toast / celebration toast)',
        'Live acoustic set during cocktails transitioning into dynamic upbeat tracks for dancing',
        'Trivia quiz or crowd-interactive icebreaker game highlighting fun moments of the celebrants',
      ],
      cateringSuggestions: [
        {
          mealType: 'Welcome Sips & Canapés',
          items: ['Artisanal Spiced Cooler / Virgin Mojito', 'Mini Truffle Tartlets', 'Paneer Tikka Crostini', 'Crispy Lotus Stem Bites'],
          notes: 'Circulated by waitstaff as guests arrive to keep entry vibrant and relaxed.',
        },
        {
          mealType: 'Main Celebration Course',
          items: ['Dum Biryani / Pilaf with Burani Raita', 'Slow-cooked Dal Makhani / Velvety Gravy', 'Grilled Herb Vegetable Medley', 'Assorted Tandoori Breads'],
          notes: 'Hot live buffet counters with dedicated chef assistants to minimize queuing.',
        },
        {
          mealType: 'Sweet Finale & Midnight Treats',
          items: ['Warm Gulab Jamun Cheesecake', 'Artisan Gelato Bar', 'Single-Origin Filter Coffee & Herbal Infusion Bar'],
          notes: 'Dessert spread stays open until the conclusion of the event.',
        },
      ],
      entertainmentOptions: [
        'Live unplugged duo (vocalist + acoustic guitarist) for welcome & dinner',
        'DJ with curated genre-blended playlist tailored to mixed generational preferences',
        'Professional Master of Ceremonies (Emcee) to maintain event pace and engage guests',
      ],
      guestExperienceTips: [
        'Provide a clear digital itinerary QR code on entry table to prevent "what happens next" confusion',
        'Designate a quiet lounge corner with plush seating for senior family members and infants',
        'Offer dedicated coat/bag storage and convenient phone charging station',
      ],
      setupAndCleanup: [
        'Vendor load-in access required minimum 3.5 hours before guest arrival time',
        'Sound & microphone check scheduled 60 minutes prior to doors opening',
        'All decor breakdown and rental return completed within 90 minutes post-event',
      ],
      risksAndContingencies: [
        {
          risk: isOutdoor ? 'Sudden rainfall or gusty winds affecting outdoor setup' : 'Air conditioning cooling imbalance during peak room occupancy',
          severity: 'high',
          preventiveMeasure: isOutdoor ? 'Reserve waterproof canopy marquee structures and covered patio backup' : 'Confirm dual HVAC compressors with venue manager 24 hours prior',
          contingencyPlan: isOutdoor ? 'Seamless 20-minute transition plan to venue indoor hall' : 'Pre-position portable silent industrial air-coolers',
        },
        {
          risk: 'Guest count exceeds RSVP by 10-15%',
          severity: 'medium',
          preventiveMeasure: 'Request final headcount confirmation 72 hours in advance with RSVP follow-up calls',
          contingencyPlan: 'Caterer contracted with a 15% buffet buffer margin and standby tables ready',
        },
        {
          risk: 'Delay in key vendor arrival due to city transit traffic',
          severity: 'medium',
          preventiveMeasure: 'Schedule arrival times 90 minutes ahead of ceremony time and track live location',
          contingencyPlan: 'Secondary backup contacts for DJ audio and sound gear on call',
        },
      ],
      tradeOffOptions: [
        {
          id: 'trade_1',
          title: 'Option A: Premium Live Band vs. Curated DJ with Enhanced Lighting',
          deltaAmount: -12000,
          description: 'Opt for a high-energy DJ set paired with intelligent moving-head lighting instead of a 5-piece live band.',
          pros: ['Saves ₹12,000 for floral decor', 'Wider song variety across decades', 'Fewer technical sound-check delays'],
          cons: ['Less acoustic intimacy during dinner'],
        },
        {
          id: 'trade_2',
          title: 'Option B: Sit-down Plated Service vs. Luxury Interactive Live Food Stations',
          deltaAmount: -8000,
          description: 'Switch from formal table plate-by-plate delivery to curated chef-assisted live stations.',
          pros: ['Saves ₹8,000 in service labor', 'Guests can customize their portions', 'More social movement and mingling'],
          cons: ['Slightly more floor space needed for stations'],
        },
      ],
      invitationWording: {
        formal: `With immense joy and gratitude, we cordially request the honor of your gracious presence as we celebrate the occasion of ${event.title || 'our Celebration'}. Date: ${event.date || 'Soon'}. Venue: ${city}.`,
        warm: `Life’s sweetest moments are made truly unforgettable when shared with people we hold dear. Join us for an evening filled with laughter, delicious food, and celebration!`,
        modern: `Let’s make memories together! You’re invited to celebrate ${event.title || 'with us'} on ${event.date || 'the big day'}. RSVP to save your spot on the dance floor!`,
      },
      socialCaptions: [
        `Moments like this remind us how blessed we are. ✨ CelebrateAI planned, heart delivered! #${type.toUpperCase()} #CelebrationMoments`,
        `Good food, golden lights, and the warmest hearts in one room. Celebrating life’s best chapters! 🥂`,
        `Every detail told a story. Thank you to everyone who made this evening unforgettable! 💫`,
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Interactive Assistant Chat Responder
   * Context-aware, answers queries, and generates structured proposals
   */
  static async processUserChat(
    userMessage: string,
    event: CelebrationEvent,
    _apiKey?: string
  ): Promise<ChatMessage> {
    const lower = userMessage.toLowerCase();
    const city = event.city || 'your city';
    const totalBudget = event.totalBudget || 50000;
    const currency = event.currency || 'INR';

    // 1. Check for budget reduction request
    if (lower.includes('reduce') && (lower.includes('budget') || lower.includes('%') || lower.includes('save') || lower.includes('cheaper'))) {
      const percentage = lower.includes('15') ? 15 : lower.includes('10') ? 10 : lower.includes('20') ? 20 : 12;
      const reductionAmount = Math.round((totalBudget * percentage) / 100);
      const newBudget = totalBudget - reductionAmount;

      const proposal: StructuredProposal = {
        type: 'budget_reduction',
        description: `Optimize and reduce total event budget by ${percentage}% (saving ${reductionAmount.toLocaleString()} ${currency}) while protecting food and core guest experience.`,
        changesSummary: [
          `Adjust total budget from ${totalBudget.toLocaleString()} to ${newBudget.toLocaleString()}`,
          `Trim decor expenditure by 18% by switching to reusable modular floral frames`,
          `Reallocate sound/lighting to package deals saving 10%`,
          `Keep catering quality 100% intact with smart seasonal menu substitutions`,
        ],
        payload: {
          totalBudgetDelta: -reductionAmount,
          categoryAdjustments: event.categories.map((c) => {
            if (c.name.includes('Decor') || c.name.includes('Styling')) {
              return { categoryId: c.id, newAllocated: Math.round(c.allocatedAmount * 0.82) };
            }
            if (c.name.includes('Music') || c.name.includes('Entertainment')) {
              return { categoryId: c.id, newAllocated: Math.round(c.allocatedAmount * 0.88) };
            }
            return { categoryId: c.id, newAllocated: Math.round(c.allocatedAmount * (1 - (percentage / 100) * 0.7)) };
          }),
        },
      };

      return {
        id: generateId('msg'),
        sender: 'ai',
        content: `I have analyzed your **${event.title}** budget of **${totalBudget.toLocaleString()} ${currency}**. 

Here is a strategic plan to reduce spending by **${percentage}%** without compromising food quality or hospitality:

1. **Decor & Lighting Optimization**: Transition from single-use fresh flower cutouts to reusable brass/wood frameworks with fairy lights. Saves ~18% in decor.
2. **Seasonal Catering Tweaks**: Retain signature items and live counters, but feature in-season produce and localized specialties.
3. **Vendor Bundle Synergy**: Bundle sound and DJ with the venue's approved in-house provider to eliminate external generator surcharges.

Would you like me to apply this **${reductionAmount.toLocaleString()} ${currency}** adjustment to your budget categories? Click **"Review & Apply Changes"** below:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredProposal: proposal,
      };
    }

    // 2. Checklist / Preparation tasks request
    if (lower.includes('checklist') || lower.includes('tasks') || lower.includes('week') || lower.includes('timeline') || lower.includes('prepare')) {
      const proposal: StructuredProposal = {
        type: 'add_tasks',
        description: 'Add 4 high-priority preparation tasks to your live event timeline.',
        changesSummary: [
          'Add "Confirm final guest headcount with caterer" (Due 3 days before)',
          'Add "Prepare assigned seating chart & VIP name cards"',
          'Add "Run microphone & audio level check with DJ"',
          'Add "Assemble emergency day-of kit (tapes, chargers, pins, first-aid)"',
        ],
        payload: {
          tasksToAdd: [
            {
              title: 'Confirm final headcount with caterer',
              description: 'Give finalized plate numbers with vegetarian / vegan breakdown.',
              priority: 'urgent',
              category: 'Catering',
              dueDate: event.date,
              isCompleted: false,
              phase: 'final_week',
            },
            {
              title: 'Prepare table placement & VIP name cards',
              description: 'Place cards at entry desk to ensure seamless seating.',
              priority: 'high',
              category: 'Guest Management',
              dueDate: event.date,
              isCompleted: false,
              phase: 'final_week',
            },
            {
              title: 'DJ & audio equipment frequency test',
              description: 'Check wireless handheld mics, backup batteries, and Spotify playlist.',
              priority: 'medium',
              category: 'Entertainment',
              dueDate: event.date,
              isCompleted: false,
              phase: 'final_week',
            },
            {
              title: 'Pack day-of emergency essentials kit',
              description: 'Power banks, safety pins, wet wipes, tape, and vendor tip envelopes.',
              priority: 'high',
              category: 'Logistics',
              dueDate: event.date,
              isCompleted: false,
              phase: 'event_day',
            },
          ],
        },
      };

      return {
        id: generateId('msg'),
        sender: 'ai',
        content: `Here is your high-impact **Preparation Checklist** specifically tailored for **${event.title}** (${event.guestCount} guests in ${city}):

- 📋 **7 Days Before**: Lock final headcount and re-confirm plate numbers with your caterer.
- 🎵 **4 Days Before**: Test the speech microphone and confirm the exact playlist transition points with your music host.
- 🪑 **2 Days Before**: Finalize table placements and ensure VIP/elderly seating is positioned away from sound speakers.
- 🎒 **Day of Event**: Pack your essentials kit with emergency cash envelopes, phone chargers, and backup itinerary prints.

I can automatically append these four actionable tasks directly to your **Tasks & Timeline** board. Review the proposal below:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredProposal: proposal,
      };
    }

    // 3. Rain / Weather / Contingency plan request
    if (lower.includes('rain') || lower.includes('weather') || lower.includes('contingency') || lower.includes('backup') || lower.includes('risk')) {
      return {
        id: generateId('msg'),
        sender: 'ai',
        content: `Here is your comprehensive **Weather & Contingency Plan** for **${event.title}**:

### 🌧️ Rain & Wind Mitigation Protocol:
1. **The 3-Hour Decision Window**: Establish a firm cutoff with your venue manager (e.g., 1:00 PM on event day) to trigger the move indoors, preventing last-minute panic.
2. **Elevated Electricals**: Ensure all sound cables, stage amplifiers, and power outlets are taped down with industrial weather-rated covers and lifted on wooden pallets.
3. **Guest Arrival Dry-Zone**: Set up a designated canopy umbrella-check stall with dry towels and warm welcome drinks right at the valet arrival point.
4. **Lighting Transformation**: If transitioning indoors, double down on amber fairy lights and warm uplights to replicate the natural golden outdoor ambiance.

Would you like me to add an indoor backup task to your event checklist?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }

    // 4. Menu & Catering request
    if (lower.includes('menu') || lower.includes('food') || lower.includes('vegetarian') || lower.includes('catering') || lower.includes('dish')) {
      return {
        id: generateId('msg'),
        sender: 'ai',
        content: `Here is a chef-curated **Vegetarian & Inclusive Celebration Menu** crafted for **${event.guestCount} guests** for **${event.title}**:

### 🥗 Welcome Appetizers & Live Counters:
- **Crispy Lotus Stem Bites** with sweet chili reduction
- **Paneer Tikka Herb Skewers** served with smoked mint chutney
- **Mini Beetroot & Quinoa Kebabs** with pomegranate molasses
- **Live Chaat Cart**: Sev Puri, Dahi Bhalla, and Pani Puri with mineral water

### 🍲 Main Course Spread:
- **Dal Bukhara** (Slow-simmered black lentils finished with cream)
- **Paneer Makhani Lababdar** (Silky cottage cheese in spiced tomato cashew sauce)
- **Tawa Exotic Vegetables** (Asparagus, baby corn, florets in aromatic spices)
- **Kashmiri Zafrani Dum Biryani** with roasted cumin raita & papad
- **Artisan Bread Basket**: Amritsari Kulcha, Garlic Naan, Laccha Paratha

### 🍨 Dessert Trio:
- **Warm Angoori Rasmalai** steeped in saffron milk
- **Belgian Dark Chocolate Mousse Cups**
- **Masala Chai & Espresso Counter** for after-dinner warmth

This menu accommodates both traditional preferences and modern palettes with zero compromise on luxury.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }

    // 5. Default Contextual Intelligence
    return {
      id: generateId('msg'),
      sender: 'ai',
      content: `I'm tracking **${event.title}** (${event.eventType}) scheduled for **${event.date || 'upcoming'}** with **${event.guestCount} guests** in **${city}**.

Your current budget is **${totalBudget.toLocaleString()} ${currency}**.

Here are some high-leverage things I can help you with right now:
- 💡 **"Reduce my budget by 15% without hurting food quality"**
- 📋 **"Generate a 7-day final preparation checklist"**
- ☔ **"Create a weather & rain contingency backup plan"**
- 🍽️ **"Curate a signature vegetarian catering menu"**
- 🎨 **"Suggest theme-aligned photo-booth and entrance ideas"**

What would you like to refine?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }
}

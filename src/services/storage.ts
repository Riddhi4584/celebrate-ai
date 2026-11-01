import {
  AppSettings,
  CelebrationEvent,
} from '../types';
import { AiPlanningEngine } from './aiService';

const STORAGE_KEY_EVENTS = 'celebrate_ai_events_v2';
const STORAGE_KEY_SETTINGS = 'celebrate_ai_settings_v2';

export const INITIAL_DEMO_EVENTS: CelebrationEvent[] = [
  {
    id: 'event_wedding_jaipur',
    title: "Aanya & Kabir's Royal Jaipur Wedding",
    eventType: 'wedding',
    date: '2026-12-18',
    duration: 'multi_day',
    city: 'Jaipur, Rajasthan',
    venueStatus: 'booked',
    venueName: 'The Fairmont Royal Palace & Lawns',
    totalBudget: 1800000,
    currency: 'INR',
    budgetTier: 'premium',
    guestCount: 220,
    adultsCount: 190,
    childrenCount: 30,
    priorities: ['venue', 'food', 'photography', 'decorations', 'guest_experience'],
    preferences: {
      theme: 'Royal Rajasthani Heritage & Sunset Warmth',
      colorPalette: [
        { name: 'Royal Plum', hex: '#3B1443' },
        { name: 'Champagne Gold', hex: '#D4AF37' },
        { name: 'Blush Rose', hex: '#F4C2C2' },
        { name: 'Ivory Silk', hex: '#FDFBF7' },
      ],
      atmosphere: 'Regal, culturally resonant, emotionally celebratory, warm hospitality',
      culturalTraditions: 'Traditional Marwari & Punjabi fusion with vibrant Sangeet',
      dietaryRequirements: ['Vegetarian', 'Jain counter required', 'Nut-free desserts labeled'],
      accessibilityNeeds: ['Golf cart mobility for grandparents', 'Ramp to main mandap'],
      specialRequests: 'Drone coverage for sunset pheras, live Shehnai at entrance gate',
      indoorOutdoor: 'hybrid',
    },
    categories: [
      { id: 'cat_w_1', name: 'Palace Venue & Lawns', allocatedAmount: 540000, iconName: 'Castle', notes: 'Includes 2 days lawn rental and 12 guest suite rooms.' },
      { id: 'cat_w_2', name: 'Royal Feast & Live Counters', allocatedAmount: 580000, iconName: 'Utensils', notes: '4 meals across 2 days including high tea and gala reception.' },
      { id: 'cat_w_3', name: 'Mandap, Floral Styling & Lighting', allocatedAmount: 260000, iconName: 'Flower2', notes: 'Marigold cascades, fairy-light canopies, and brass diyas.' },
      { id: 'cat_w_4', name: 'Candid Photography & Cinematic Film', allocatedAmount: 180000, iconName: 'Camera', notes: '4 photographers, 2 reels editors, same-day teaser.' },
      { id: 'cat_w_5', name: 'Bridal & Groom Couture / Trousseau', allocatedAmount: 110000, iconName: 'Sparkles', notes: 'Custom sherwani and bridal lehenga tailoring.' },
      { id: 'cat_w_6', name: 'Sangeet DJ, Sound & Dhol Artists', allocatedAmount: 60000, iconName: 'Music', notes: 'Stage truss, moving lights, and 4 Punjabi dhol players.' },
      { id: 'cat_w_7', name: 'Invitations, Favors & Welcome Hampers', allocatedAmount: 35000, iconName: 'Gift', notes: 'Handcrafted box with organic teas and sweets.' },
      { id: 'cat_w_8', name: 'Emergency Contingency Reserve', allocatedAmount: 35000, iconName: 'ShieldAlert', notes: 'Buffer for overtime generator and guest requests.' },
    ],
    expenses: [
      {
        id: 'exp_w_1',
        categoryId: 'cat_w_1',
        title: 'Palace Lawn Advance Booking Deposit',
        estimatedCost: 270000,
        actualCost: 270000,
        isPaid: true,
        paidDate: '2026-10-15',
        notes: '50% advance cleared via RTGS with contract signed.',
        createdAt: '2026-10-15T10:00:00Z',
      },
      {
        id: 'exp_w_2',
        categoryId: 'cat_w_2',
        title: 'Catering Advance & Tasting Menu Lock',
        estimatedCost: 200000,
        actualCost: 200000,
        isPaid: true,
        paidDate: '2026-10-20',
        notes: 'Includes Jain food counter commitment.',
        createdAt: '2026-10-20T11:00:00Z',
      },
      {
        id: 'exp_w_3',
        categoryId: 'cat_w_3',
        title: 'Floral Mandap Structure Deposit',
        estimatedCost: 100000,
        actualCost: 95000,
        isPaid: true,
        paidDate: '2026-10-25',
        notes: 'Negotiated 5% discount for early booking.',
        createdAt: '2026-10-25T14:30:00Z',
      },
      {
        id: 'exp_w_4',
        categoryId: 'cat_w_4',
        title: 'Candid Studio Retainer',
        estimatedCost: 75000,
        actualCost: 75000,
        isPaid: true,
        paidDate: '2026-10-28',
        notes: 'Pre-wedding couple shoot included.',
        createdAt: '2026-10-28T09:00:00Z',
      },
      {
        id: 'exp_w_5',
        categoryId: 'cat_w_6',
        title: 'Sangeet DJ Sound Rig & Moving Heads',
        estimatedCost: 35000,
        actualCost: 35000,
        isPaid: false,
        notes: 'Payment due on stage setup morning.',
        createdAt: '2026-10-29T16:00:00Z',
      },
    ],
    tasks: [
      {
        id: 'tsk_w_1',
        title: 'Finalize Palace Contract & Lawns Agreement',
        description: 'Verify noise curfew (10 PM outdoors, shifting to banquet hall post 10 PM).',
        dueDate: '2026-10-20',
        priority: 'urgent',
        category: 'Venue & Logistics',
        isCompleted: true,
        completedAt: '2026-10-18T12:00:00Z',
        phase: 'early_planning',
      },
      {
        id: 'tsk_w_2',
        title: 'Complete Catering Food Tasting in Jaipur',
        description: 'Taste Dal Baati Churma, live Chaat counters, and Rasmalai cheesecake.',
        dueDate: '2026-10-25',
        priority: 'high',
        category: 'Catering',
        isCompleted: true,
        completedAt: '2026-10-24T18:00:00Z',
        phase: 'booking',
      },
      {
        id: 'tsk_w_3',
        title: 'Dispatch Digital Save-the-Dates & RSVP links',
        description: 'Ensure outstation guests receive flight and hotel booking recommendations.',
        dueDate: '2026-11-05',
        priority: 'high',
        category: 'Guest Management',
        isCompleted: true,
        completedAt: '2026-11-01T10:00:00Z',
        phase: 'preparation',
      },
      {
        id: 'tsk_w_4',
        title: 'Finalize Sangeet Track Mix & Choreographer Rehearsals',
        description: 'Collect couple and family dance song mashup (max 4 minutes per group).',
        dueDate: '2026-11-25',
        priority: 'medium',
        category: 'Entertainment',
        isCompleted: false,
        phase: 'preparation',
      },
      {
        id: 'tsk_w_5',
        title: 'Review Mandap Floral Mockup & Drape Fabric',
        description: 'Confirm sunset glow lighting test with decorator Priya Mehra.',
        dueDate: '2026-12-02',
        priority: 'high',
        category: 'Decor & Styling',
        isCompleted: false,
        phase: 'preparation',
      },
      {
        id: 'tsk_w_6',
        title: 'Conduct Final Hotel Rooming List Coordination Call',
        description: 'Assign rooms for 65 outstation family members with arrival flight times.',
        dueDate: '2026-12-10',
        priority: 'urgent',
        category: 'Logistics',
        isCompleted: false,
        phase: 'final_week',
      },
      {
        id: 'tsk_w_7',
        title: 'Prepare Emergency Kit & Priest Pooja Material Checklist',
        description: 'Pooja samagri, dry fruits, fresh rose petals, and vendor cash gratuity envelopes.',
        dueDate: '2026-12-16',
        priority: 'high',
        category: 'Event Day',
        isCompleted: false,
        phase: 'final_week',
      },
    ],
    vendors: [
      {
        id: 'vnd_w_1',
        name: 'The Fairmont Royal Palace & Lawns',
        category: 'Venue',
        contactPerson: 'Vikramaditya Rathore',
        phone: '+91 98290 11223',
        email: 'weddings@fairmontjaipur.sample',
        estimatedCost: 540000,
        quotedCost: 540000,
        paidAmount: 270000,
        status: 'booked',
        notes: 'Includes amphitheater setup and 2 suites. Final 50% due on check-in.',
        paymentDeadline: '2026-12-17',
      },
      {
        id: 'vnd_w_2',
        name: 'Royal Rajputana Gourmet Catering',
        category: 'Catering',
        contactPerson: 'Chef Devendra Singh',
        phone: '+91 94140 44556',
        email: 'catering@rajputanacuisine.sample',
        estimatedCost: 580000,
        quotedCost: 560000,
        paidAmount: 200000,
        status: 'booked',
        notes: 'Live Jalebi station, wood-fired tandoor, and dedicated Jain kitchen.',
        paymentDeadline: '2026-12-18',
      },
      {
        id: 'vnd_w_3',
        name: 'Shimmer & Silk Bespoke Florals',
        category: 'Decorations',
        contactPerson: 'Priya Mehra',
        phone: '+91 99887 76655',
        email: 'priya@shimmersilk.sample',
        estimatedCost: 260000,
        quotedCost: 250000,
        paidAmount: 95000,
        status: 'booked',
        notes: 'Includes floating flower candles in palace water fountains.',
        paymentDeadline: '2026-12-15',
      },
      {
        id: 'vnd_w_4',
        name: 'Heritage Candid Frames Studio',
        category: 'Photography',
        contactPerson: 'Arun Varma',
        phone: '+91 97654 32109',
        email: 'arun@heritagecandid.sample',
        estimatedCost: 180000,
        quotedCost: 175000,
        paidAmount: 75000,
        status: 'booked',
        notes: 'Drone operator licensed. Includes 3 photo-books and teaser reel in 48 hours.',
        paymentDeadline: '2026-12-19',
      },
    ],
    guests: [
      { id: 'g_w_1', name: 'Rajesh & Sunita Singhania', group: 'family', rsvpStatus: 'attending', dietaryPreference: 'vegetarian', plusOnes: 1, notes: 'Groom’s uncle, requires ground floor room.' },
      { id: 'g_w_2', name: 'Meenakshi & Suresh Goel', group: 'family', rsvpStatus: 'attending', dietaryPreference: 'jain', plusOnes: 2, notes: 'Strict Jain meal without root vegetables.' },
      { id: 'g_w_3', name: 'Rohan Deshmukh', group: 'friends', rsvpStatus: 'attending', dietaryPreference: 'no_restriction', plusOnes: 1, notes: 'College roommate, flying in from London.' },
      { id: 'g_w_4', name: 'Dr. Alok Nath (VIP)', group: 'vip', rsvpStatus: 'attending', dietaryPreference: 'vegetarian', plusOnes: 1, notes: 'Seat at Front Row VIP table.' },
      { id: 'g_w_5', name: 'Sneha & Karan Kapoor', group: 'friends', rsvpStatus: 'tentative', dietaryPreference: 'vegetarian', plusOnes: 1, notes: 'Awaiting leave confirmation.' },
    ],
    plan: AiPlanningEngine.generateComprehensivePlan({
      title: "Aanya & Kabir's Royal Jaipur Wedding",
      eventType: 'wedding',
      city: 'Jaipur, Rajasthan',
      guestCount: 220,
      totalBudget: 1800000,
      preferences: {
        theme: 'Royal Rajasthani Heritage & Sunset Warmth',
        indoorOutdoor: 'hybrid',
      } as any,
    }),
    chatHistory: [
      {
        id: 'msg_w_init',
        sender: 'ai',
        content: "Welcome to CelebrateAI! I'm your dedicated planning partner for Aanya & Kabir's Royal Jaipur Wedding. I've balanced your ₹18,00,000 budget across 8 categories and structured a milestone timeline. How can I assist you today?",
        timestamp: '10:00 AM',
      },
    ],
    createdAt: '2026-10-15T09:00:00Z',
    updatedAt: '2026-11-01T08:30:00Z',
  },
  {
    id: 'event_birthday_arjun',
    title: "Arjun's 30th Neon Sunset Rooftop Bash",
    eventType: 'birthday',
    date: '2026-11-28',
    duration: 'few_hours',
    city: 'Indiranagar, Bengaluru',
    venueStatus: 'booked',
    venueName: 'Skyline Terrace Lounge & Bar',
    totalBudget: 120000,
    currency: 'INR',
    budgetTier: 'balanced',
    guestCount: 45,
    adultsCount: 45,
    childrenCount: 0,
    priorities: ['venue', 'food', 'entertainment', 'decorations'],
    preferences: {
      theme: 'Retro Synthwave Neon Glow & Sunset Cocktails',
      colorPalette: [
        { name: 'Neon Coral', hex: '#FF4D6D' },
        { name: 'Electric Violet', hex: '#8B5CF6' },
        { name: 'Cyan Glow', hex: '#00F0FF' },
        { name: 'Midnight Charcoal', hex: '#12121A' },
      ],
      atmosphere: 'High-energy, stylish, celebratory, modern cocktail vibes',
      culturalTraditions: 'Modern milestone party with signature cocktail menu and DJ',
      dietaryRequirements: ['Vegetarian appetizers', 'Cocktails with zero-sugar options'],
      accessibilityNeeds: ['Elevator access to rooftop terrace'],
      specialRequests: 'Custom LED neon sign with "Arjun 3.0", Polaroid guest book',
      indoorOutdoor: 'outdoor',
    },
    categories: [
      { id: 'cat_b_1', name: 'Rooftop Venue & Bar Service', allocatedAmount: 42000, iconName: 'Home', notes: 'Private terrace rental with dedicated bartenders.' },
      { id: 'cat_b_2', name: 'Gourmet Sliders, Canapes & Custom Cake', allocatedAmount: 42000, iconName: 'Cake', notes: 'Artisan sliders, truffle fries, and 2kg custom cake.' },
      { id: 'cat_b_3', name: 'Neon Lighting & Balloon Installations', allocatedAmount: 18000, iconName: 'PartyPopper', notes: 'Custom LED sign and geometric arches.' },
      { id: 'cat_b_4', name: 'DJ & Sound Gear', allocatedAmount: 12000, iconName: 'Gamepad2', notes: 'Electronic & 90s hip-hop playlist.' },
      { id: 'cat_b_5', name: 'Favors & Contingency', allocatedAmount: 6000, iconName: 'Gift', notes: 'LED party shades, glow sticks, emergency fund.' },
    ],
    expenses: [
      {
        id: 'exp_b_1',
        categoryId: 'cat_b_1',
        title: 'Terrace Minimum Spend Advance',
        estimatedCost: 20000,
        actualCost: 20000,
        isPaid: true,
        paidDate: '2026-10-22',
        notes: 'Deposit credited toward final F&B bill.',
        createdAt: '2026-10-22T12:00:00Z',
      },
      {
        id: 'exp_b_2',
        categoryId: 'cat_b_3',
        title: 'Custom "Arjun 3.0" LED Neon Sign',
        estimatedCost: 6500,
        actualCost: 6200,
        isPaid: true,
        paidDate: '2026-10-28',
        notes: 'Delivered and tested.',
        createdAt: '2026-10-28T15:00:00Z',
      },
    ],
    tasks: [
      {
        id: 'tsk_b_1',
        title: 'Confirm Rooftop Sound Curfew Rules',
        description: 'Verify headphone party option if music curfew starts at 10:30 PM.',
        dueDate: '2026-11-10',
        priority: 'urgent',
        category: 'Venue',
        isCompleted: true,
        completedAt: '2026-10-25T11:00:00Z',
        phase: 'early_planning',
      },
      {
        id: 'tsk_b_2',
        title: 'Order Two-Tier Dark Chocolate Orange Cake',
        description: 'Gluten-friendly base with neon drip frosting.',
        dueDate: '2026-11-18',
        priority: 'high',
        category: 'Catering',
        isCompleted: false,
        phase: 'preparation',
      },
      {
        id: 'tsk_b_3',
        title: 'Collect RSVP Counts for Bartender Stocking',
        description: 'Ensure accurate gin, craft beer, and mocktail tonic supplies.',
        dueDate: '2026-11-20',
        priority: 'high',
        category: 'Guest Management',
        isCompleted: false,
        phase: 'preparation',
      },
    ],
    vendors: [
      {
        id: 'vnd_b_1',
        name: 'Skyline Terrace Lounge',
        category: 'Venue & Drinks',
        contactPerson: 'Manager Karthik',
        phone: '+91 98450 77889',
        email: 'terrace@skylinelounge.sample',
        estimatedCost: 42000,
        quotedCost: 42000,
        paidAmount: 20000,
        status: 'booked',
        notes: 'Rooftop private section blocked from 6 PM to midnight.',
        paymentDeadline: '2026-11-28',
      },
      {
        id: 'vnd_b_2',
        name: 'DJ Ray - Deep House & Retro Beats',
        category: 'DJ & Sound',
        contactPerson: 'Rayhaan',
        phone: '+91 97410 99221',
        email: 'djray@bengalurubeats.sample',
        estimatedCost: 12000,
        quotedCost: 11000,
        paidAmount: 0,
        status: 'quote_received',
        notes: 'Bringing 2 active speakers and Pioneer controller.',
        paymentDeadline: '2026-11-28',
      },
    ],
    guests: [
      { id: 'g_b_1', name: 'Tanvi Shah', group: 'friends', rsvpStatus: 'attending', dietaryPreference: 'vegetarian', plusOnes: 1 },
      { id: 'g_b_2', name: 'Vikram Joshi', group: 'colleagues', rsvpStatus: 'attending', dietaryPreference: 'non_vegetarian', plusOnes: 0 },
      { id: 'g_b_3', name: 'Pooja Hegde', group: 'friends', rsvpStatus: 'pending', dietaryPreference: 'vegetarian', plusOnes: 1 },
    ],
    plan: AiPlanningEngine.generateComprehensivePlan({
      title: "Arjun's 30th Neon Sunset Rooftop Bash",
      eventType: 'birthday',
      city: 'Bengaluru',
      guestCount: 45,
      totalBudget: 120000,
      preferences: {
        theme: 'Retro Synthwave Neon Glow',
        indoorOutdoor: 'outdoor',
      } as any,
    }),
    chatHistory: [],
    createdAt: '2026-10-20T10:00:00Z',
    updatedAt: '2026-11-01T08:30:00Z',
  },
];

export class StorageService {
  static getAllEvents(): CelebrationEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_EVENTS);
      if (!data) {
        // Initialize with realistic rich demo events
        this.saveAllEvents(INITIAL_DEMO_EVENTS);
        return INITIAL_DEMO_EVENTS;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return INITIAL_DEMO_EVENTS;
    } catch (e) {
      console.error('Failed reading events from localStorage:', e);
      return INITIAL_DEMO_EVENTS;
    }
  }

  static getEventById(id: string): CelebrationEvent | undefined {
    const events = this.getAllEvents();
    return events.find((e) => e.id === id);
  }

  static saveAllEvents(events: CelebrationEvent[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error('Failed saving events to localStorage:', e);
    }
  }

  static saveEvent(event: CelebrationEvent): void {
    const events = this.getAllEvents();
    const index = events.findIndex((e) => e.id === event.id);
    if (index >= 0) {
      events[index] = { ...event, updatedAt: new Date().toISOString() };
    } else {
      events.unshift({ ...event, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.saveAllEvents(events);
  }

  static deleteEvent(id: string): void {
    const events = this.getAllEvents().filter((e) => e.id !== id);
    this.saveAllEvents(events);
  }

  static resetToDemoData(): CelebrationEvent[] {
    this.saveAllEvents(INITIAL_DEMO_EVENTS);
    return INITIAL_DEMO_EVENTS;
  }

  static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (!data) {
        const defaults: AppSettings = {
          defaultCurrency: 'INR',
          useDemoAi: true,
          activeEventId: INITIAL_DEMO_EVENTS[0]?.id,
        };
        this.saveSettings(defaults);
        return defaults;
      }
      return JSON.parse(data);
    } catch {
      return {
        defaultCurrency: 'INR',
        useDemoAi: true,
        activeEventId: INITIAL_DEMO_EVENTS[0]?.id,
      };
    }
  }

  static saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed saving settings:', e);
    }
  }

  static exportBackup(): string {
    const events = this.getAllEvents();
    const settings = this.getSettings();
    return JSON.stringify({ version: '2.0', exportedAt: new Date().toISOString(), events, settings }, null, 2);
  }

  static importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.events)) {
        this.saveAllEvents(parsed.events);
        if (parsed.settings) {
          this.saveSettings(parsed.settings);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

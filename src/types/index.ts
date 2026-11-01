export type EventType =
  | 'wedding'
  | 'birthday'
  | 'anniversary'
  | 'community'
  | 'college'
  | 'corporate'
  | 'engagement'
  | 'baby_shower'
  | 'festival'
  | 'custom';

export type EventDuration = 'few_hours' | 'half_day' | 'full_day' | 'multi_day';

export type VenueStatus = 'booked' | 'shortlisted' | 'searching' | 'home_or_private';

export type BudgetTier = 'low_cost' | 'balanced' | 'premium';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export type EventPriority =
  | 'venue'
  | 'food'
  | 'photography'
  | 'decorations'
  | 'entertainment'
  | 'guest_experience'
  | 'sustainability'
  | 'affordability';

export interface EventPreferences {
  theme: string;
  colorPalette: { name: string; hex: string }[];
  atmosphere: string;
  culturalTraditions: string;
  dietaryRequirements: string[];
  accessibilityNeeds: string[];
  specialRequests: string;
  indoorOutdoor: 'indoor' | 'outdoor' | 'hybrid';
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocatedAmount: number;
  iconName?: string;
  notes?: string;
}

export interface Expense {
  id: string;
  categoryId: string;
  title: string;
  estimatedCost: number;
  actualCost: number;
  isPaid: boolean;
  paidDate?: string;
  vendorId?: string;
  notes?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  isCompleted: boolean;
  completedAt?: string;
  assignedTo?: string;
  notes?: string;
  phase?: 'early_planning' | 'booking' | 'preparation' | 'final_week' | 'event_day' | 'post_event';
}

export type VendorStatus =
  | 'researching'
  | 'contacted'
  | 'quote_received'
  | 'negotiating'
  | 'booked'
  | 'cancelled';

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  estimatedCost: number;
  quotedCost: number;
  paidAmount: number;
  status: VendorStatus;
  notes?: string;
  paymentDeadline?: string;
  isAiSuggested?: boolean;
}

export type GuestGroup = 'family' | 'friends' | 'vip' | 'colleagues' | 'other';

export type RsvpStatus = 'attending' | 'declined' | 'pending' | 'tentative';

export type DietaryPreference =
  | 'vegetarian'
  | 'non_vegetarian'
  | 'vegan'
  | 'jain'
  | 'halal'
  | 'gluten_free'
  | 'no_restriction';

export interface Guest {
  id: string;
  name: string;
  group: GuestGroup;
  rsvpStatus: RsvpStatus;
  dietaryPreference: DietaryPreference;
  accessibilityNeeds?: string;
  plusOnes: number;
  notes?: string;
}

export interface CateringSuggestion {
  mealType: string;
  items: string[];
  notes: string;
}

export interface RiskContingency {
  risk: string;
  severity: 'low' | 'medium' | 'high';
  preventiveMeasure: string;
  contingencyPlan: string;
}

export interface TradeOffOption {
  id: string;
  title: string;
  deltaAmount: number; // positive = cost increase, negative = savings
  description: string;
  pros: string[];
  cons: string[];
}

export interface GeneratedEventPlan {
  conceptSummary: string;
  suggestedTheme: string;
  colorPalette: { name: string; hex: string }[];
  decorationIdeas: string[];
  activityIdeas: string[];
  cateringSuggestions: CateringSuggestion[];
  entertainmentOptions: string[];
  guestExperienceTips: string[];
  setupAndCleanup: string[];
  risksAndContingencies: RiskContingency[];
  tradeOffOptions?: TradeOffOption[];
  invitationWording?: {
    formal: string;
    warm: string;
    modern: string;
  };
  socialCaptions?: string[];
  generatedAt: string;
}

export interface StructuredProposal {
  type: 'budget_reduction' | 'add_tasks' | 'adjust_allocation' | 'add_vendor';
  description: string;
  changesSummary: string[];
  payload: {
    tasksToAdd?: Partial<Task>[];
    categoryAdjustments?: { categoryId: string; newAllocated: number }[];
    vendorToAdd?: Partial<Vendor>;
    totalBudgetDelta?: number;
  };
  applied?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
  structuredProposal?: StructuredProposal;
}

export interface CelebrationEvent {
  id: string;
  title: string;
  eventType: EventType;
  date: string;
  duration: EventDuration;
  city: string;
  venueStatus: VenueStatus;
  venueName?: string;
  totalBudget: number;
  currency: Currency;
  budgetTier: BudgetTier;
  guestCount: number;
  adultsCount?: number;
  childrenCount?: number;
  priorities: EventPriority[];
  preferences: EventPreferences;
  categories: BudgetCategory[];
  expenses: Expense[];
  tasks: Task[];
  vendors: Vendor[];
  guests: Guest[];
  plan?: GeneratedEventPlan;
  chatHistory: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ReadinessBreakdown {
  totalScore: number; // 0 - 100
  tasksScore: number; // 0 - 30
  budgetScore: number; // 0 - 25
  vendorScore: number; // 0 - 25
  timelineScore: number; // 0 - 10
  guestScore: number; // 0 - 10
  status: 'Critical Attention' | 'In Progress' | 'Good Shape' | 'Ready to Celebrate';
  recommendations: string[];
}

export interface AppSettings {
  defaultCurrency: Currency;
  geminiApiKey?: string;
  openaiApiKey?: string;
  useDemoAi: boolean;
  activeEventId?: string;
}

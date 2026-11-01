import { describe, it, expect } from 'vitest';
import { AiPlanningEngine } from '../services/aiService';
import { CelebrationEvent, EventType } from '../types';

describe('AiPlanningEngine Algorithmic Generator Suite', () => {
  const ALL_EVENT_TYPES: EventType[] = [
    'wedding',
    'birthday',
    'anniversary',
    'corporate',
    'college',
    'community',
    'engagement',
    'baby_shower',
    'festival',
    'custom',
  ];

  it('generates distinct, valid budget categories for all 10 celebration types', () => {
    ALL_EVENT_TYPES.forEach((type) => {
      const categories = AiPlanningEngine.generateBudgetCategories({
        eventType: type,
        totalBudget: 100000,
      });

      expect(categories.length).toBeGreaterThanOrEqual(4);
      const totalAllocated = categories.reduce((sum, c) => sum + c.allocatedAmount, 0);
      expect(totalAllocated).toBe(100000);
    });
  });

  it('generates structured initial expenses matching the created categories', () => {
    const categories = AiPlanningEngine.generateBudgetCategories({
      eventType: 'wedding',
      totalBudget: 500000,
    });
    const expenses = AiPlanningEngine.generateInitialExpenses(categories, 'balanced');

    expect(expenses.length).toBeGreaterThan(0);
    expenses.forEach((exp) => {
      expect(exp.categoryId).toBeDefined();
      expect(exp.estimatedCost).toBeGreaterThan(0);
      expect(categories.some((c) => c.id === exp.categoryId)).toBe(true);
    });
  });

  it('generates full comprehensive plan with color palettes, menus, and contingencies', () => {
    const plan = AiPlanningEngine.generateComprehensivePlan({
      title: 'Grand Silver Jubilee Anniversary',
      eventType: 'anniversary',
      city: 'Udaipur',
      date: '2026-12-25',
      duration: 'half_day',
      guestCount: 80,
      totalBudget: 350000,
      currency: 'INR',
      venueStatus: 'booked',
      preferences: {
        theme: 'Silver Glamour',
        colorPalette: [
          { name: 'Silver', hex: '#C0C0C0' },
          { name: 'Deep Plum', hex: '#4A154B' },
        ],
        atmosphere: 'Romantic & Elegant',
        culturalTraditions: 'Classic cake cutting ceremony',
        dietaryRequirements: ['Vegetarian', 'Jain'],
        accessibilityNeeds: ['Wheelchair access'],
        specialRequests: '',
        indoorOutdoor: 'hybrid',
      },
    });

    expect(plan.conceptSummary).toBeDefined();
    expect(plan.colorPalette.length).toBeGreaterThanOrEqual(3);
    expect(plan.cateringSuggestions.length).toBeGreaterThanOrEqual(2);
    expect(plan.decorationIdeas.length).toBeGreaterThanOrEqual(2);
    expect(plan.activityIdeas.length).toBeGreaterThanOrEqual(2);
  });

  it('processes user chat requests and returns actionable responses', async () => {
    const mockEvent: CelebrationEvent = {
      id: 'mock_test_evt',
      title: 'Product Launch Party',
      eventType: 'corporate',
      date: '2026-11-20',
      duration: 'half_day',
      city: 'Bangalore',
      venueStatus: 'booked',
      totalBudget: 300000,
      currency: 'INR',
      budgetTier: 'balanced',
      guestCount: 100,
      priorities: ['venue', 'food'],
      preferences: {
        theme: 'Corporate Tech Launch',
        colorPalette: [],
        atmosphere: 'Professional & High-Energy',
        culturalTraditions: '',
        dietaryRequirements: ['Vegetarian'],
        accessibilityNeeds: [],
        specialRequests: '',
        indoorOutdoor: 'indoor',
      },
      categories: [
        { id: 'c1', name: 'Venue & Staging', allocatedAmount: 150000 },
        { id: 'c2', name: 'Gourmet Catering', allocatedAmount: 150000 },
      ],
      expenses: [],
      tasks: [],
      vendors: [],
      guests: [],
      chatHistory: [],
      createdAt: '',
      updatedAt: '',
    };

    // Test budget cut intent detection
    const chatResponse = await AiPlanningEngine.processUserChat(
      'Can you help reduce our budget by 15%?',
      mockEvent
    );

    expect(chatResponse.sender).toBe('ai');
    expect(chatResponse.content).toBeDefined();
    expect(chatResponse.structuredProposal).toBeDefined();
    expect(chatResponse.structuredProposal?.type).toBe('budget_reduction');
    expect(chatResponse.structuredProposal?.payload?.totalBudgetDelta).toBe(-45000); // 15% of 300000
  });
});

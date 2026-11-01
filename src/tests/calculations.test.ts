import { describe, it, expect } from 'vitest';
import { formatCurrency, getDaysRemaining } from '../utils/formatters';
import { AiPlanningEngine } from '../services/aiService';
import { calculateReadinessScore } from '../services/readinessScore';
import { CelebrationEvent } from '../types';

describe('Currency and Date Formatter Logic', () => {
  it('formats INR correctly with Indian numbering system and symbol', () => {
    const formatted = formatCurrency(1500000, 'INR');
    expect(formatted).toContain('₹');
    expect(formatted).toBe('₹15,00,000');
  });

  it('formats USD correctly with comma separators', () => {
    const formatted = formatCurrency(50000, 'USD');
    expect(formatted).toBe('$50,000');
  });

  it('calculates days remaining accurately', () => {
    const today = new Date().toISOString().split('T')[0];
    const result = getDaysRemaining(today);
    expect(result.days).toBe(0);
    expect(result.isToday).toBe(true);

    const future = new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0];
    const futureResult = getDaysRemaining(future);
    expect(futureResult.days).toBe(10);
    expect(futureResult.isPast).toBe(false);

    const past = new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0];
    const pastResult = getDaysRemaining(past);
    expect(pastResult.isPast).toBe(true);
  });
});

describe('AI Planning Engine - Budget Optimizer', () => {
  it('generates budget categories that sum up exactly to the total budget', () => {
    const testBudgets = [25000, 120000, 500000, 1800000, 7500000];

    testBudgets.forEach((total) => {
      const categories = AiPlanningEngine.generateBudgetCategories({
        eventType: 'wedding',
        totalBudget: total,
      });

      const sum = categories.reduce((s, c) => s + c.allocatedAmount, 0);
      expect(sum).toBe(total);
    });
  });

  it('adapts budget categories specifically to celebration type', () => {
    const weddingCats = AiPlanningEngine.generateBudgetCategories({
      eventType: 'wedding',
      totalBudget: 1000000,
    });
    const birthdayCats = AiPlanningEngine.generateBudgetCategories({
      eventType: 'birthday',
      totalBudget: 50000,
    });

    const hasMandap = weddingCats.some((c) => c.name.toLowerCase().includes('mandap') || c.name.toLowerCase().includes('staging'));
    const hasCake = birthdayCats.some((c) => c.name.toLowerCase().includes('cake') || c.name.toLowerCase().includes('birthday'));

    expect(hasMandap).toBe(true);
    expect(hasCake).toBe(true);
  });

  it('generates time-aware milestones without impossible deadlines', () => {
    const eventDate = new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0];
    const tasks = AiPlanningEngine.generateTimelineTasks({
      eventType: 'birthday',
      date: eventDate,
      city: 'Delhi',
    });

    expect(tasks.length).toBeGreaterThanOrEqual(5);

    // Verify all generated task deadlines are on or before the event date
    tasks.forEach((task) => {
      expect(new Date(task.dueDate).getTime()).toBeLessThanOrEqual(new Date(eventDate).getTime());
    });
  });
});

describe('Event Readiness Score Algorithm', () => {
  it('calculates score transparently across all 5 dimensions', () => {
    const mockEvent: CelebrationEvent = {
      id: 'test_evt',
      title: 'Test Gala',
      eventType: 'corporate',
      date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      duration: 'half_day',
      city: 'Pune',
      venueStatus: 'booked',
      totalBudget: 100000,
      currency: 'INR',
      budgetTier: 'balanced',
      guestCount: 50,
      priorities: ['venue', 'food'],
      preferences: {
        theme: 'Modern',
        colorPalette: [],
        atmosphere: 'Professional',
        culturalTraditions: '',
        dietaryRequirements: ['Vegetarian'],
        accessibilityNeeds: [],
        specialRequests: '',
        indoorOutdoor: 'indoor',
      },
      categories: [
        { id: 'c1', name: 'Venue', allocatedAmount: 50000 },
        { id: 'c2', name: 'Catering', allocatedAmount: 50000 },
      ],
      expenses: [
        { id: 'e1', categoryId: 'c1', title: 'Advance', estimatedCost: 20000, actualCost: 20000, isPaid: true, createdAt: '' },
      ],
      tasks: [
        { id: 't1', title: 'Book AV', description: '', dueDate: '2026-12-01', priority: 'high', category: 'AV', isCompleted: true },
        { id: 't2', title: 'Order badges', description: '', dueDate: '2026-12-05', priority: 'medium', category: 'Ops', isCompleted: false },
      ],
      vendors: [
        { id: 'v1', name: 'Hotel Pune', category: 'Venue', estimatedCost: 50000, quotedCost: 50000, paidAmount: 20000, status: 'booked' },
      ],
      guests: [
        { id: 'g1', name: 'John Doe', group: 'colleagues', rsvpStatus: 'attending', dietaryPreference: 'vegetarian', plusOnes: 0 },
      ],
      chatHistory: [],
      createdAt: '',
      updatedAt: '',
    };

    const breakdown = calculateReadinessScore(mockEvent);
    expect(breakdown.totalScore).toBeGreaterThanOrEqual(0);
    expect(breakdown.totalScore).toBeLessThanOrEqual(100);
    expect(breakdown.tasksScore).toBe(15); // 1 out of 2 completed = 50% of 30 pts = 15
    expect(breakdown.vendorScore).toBe(25); // 1 of 1 booked = 100% of 25 pts = 25
    expect(breakdown.budgetScore).toBe(25); // exactly 100k allocated and no overspending
    expect(breakdown.recommendations).toBeInstanceOf(Array);
  });
});

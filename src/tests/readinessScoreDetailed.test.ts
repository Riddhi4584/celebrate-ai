import { describe, it, expect } from 'vitest';
import { calculateReadinessScore } from '../services/readinessScore';
import { CelebrationEvent } from '../types';

describe('Readiness Score Mathematical Proof & Edge Cases Suite', () => {
  const createBaseEvent = (overrides?: Partial<CelebrationEvent>): CelebrationEvent => ({
    id: 'test_score_evt',
    title: 'Metric Assessment Event',
    eventType: 'wedding',
    date: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
    duration: 'full_day',
    city: 'Mumbai',
    venueStatus: 'searching',
    totalBudget: 100000,
    currency: 'INR',
    budgetTier: 'balanced',
    guestCount: 100,
    priorities: ['venue', 'food'],
    preferences: {
      theme: 'Classic',
      colorPalette: [],
      atmosphere: 'Warm',
      culturalTraditions: '',
      dietaryRequirements: [],
      accessibilityNeeds: [],
      specialRequests: '',
      indoorOutdoor: 'indoor',
    },
    categories: [
      { id: 'cat1', name: 'Venue', allocatedAmount: 50000 },
      { id: 'cat2', name: 'Food', allocatedAmount: 50000 },
    ],
    expenses: [],
    tasks: [],
    vendors: [],
    guests: [],
    chatHistory: [],
    createdAt: '',
    updatedAt: '',
    ...overrides,
  });

  it('awards minimum task points when no tasks are completed', () => {
    const event = createBaseEvent({
      tasks: [
        { id: 't1', title: 'Task 1', description: '', dueDate: '2026-12-01', priority: 'high', category: 'General', isCompleted: false },
        { id: 't2', title: 'Task 2', description: '', dueDate: '2026-12-05', priority: 'medium', category: 'General', isCompleted: false },
      ],
    });

    const score = calculateReadinessScore(event);
    expect(score.tasksScore).toBe(0);
    expect(score.recommendations.some((r) => r.toLowerCase().includes('task'))).toBe(true);
  });

  it('awards full 30 points when all tasks are completed', () => {
    const event = createBaseEvent({
      tasks: [
        { id: 't1', title: 'Task 1', description: '', dueDate: '2026-12-01', priority: 'high', category: 'General', isCompleted: true },
        { id: 't2', title: 'Task 2', description: '', dueDate: '2026-12-05', priority: 'medium', category: 'General', isCompleted: true },
      ],
    });

    const score = calculateReadinessScore(event);
    expect(score.tasksScore).toBe(30);
  });

  it('penalizes budget score when expenses exceed total budget cap', () => {
    const balancedEvent = createBaseEvent({
      expenses: [
        { id: 'e1', categoryId: 'cat1', title: 'Advance', estimatedCost: 40000, actualCost: 40000, isPaid: true, createdAt: '' },
      ],
    });
    const overBudgetEvent = createBaseEvent({
      expenses: [
        { id: 'e2', categoryId: 'cat1', title: 'Overspend', estimatedCost: 140000, actualCost: 140000, isPaid: true, createdAt: '' },
      ],
    });

    const balancedScore = calculateReadinessScore(balancedEvent);
    const overScore = calculateReadinessScore(overBudgetEvent);

    expect(balancedScore.budgetScore).toBeGreaterThan(overScore.budgetScore);
    expect(overScore.recommendations.some((r) => r.toLowerCase().includes('budget') || r.toLowerCase().includes('over'))).toBe(true);
  });

  it('evaluates vendor bookings accurately across 25 total vendor points', () => {
    const eventAllBooked = createBaseEvent({
      vendors: [
        { id: 'v1', name: 'Vendor 1', category: 'Venue', estimatedCost: 50000, quotedCost: 50000, paidAmount: 20000, status: 'booked' },
        { id: 'v2', name: 'Vendor 2', category: 'Food', estimatedCost: 50000, quotedCost: 50000, paidAmount: 20000, status: 'booked' },
      ],
    });
    const eventHalfBooked = createBaseEvent({
      vendors: [
        { id: 'v1', name: 'Vendor 1', category: 'Venue', estimatedCost: 50000, quotedCost: 50000, paidAmount: 20000, status: 'booked' },
        { id: 'v2', name: 'Vendor 2', category: 'Food', estimatedCost: 50000, quotedCost: 50000, paidAmount: 0, status: 'researching' },
      ],
    });

    const fullVendorScore = calculateReadinessScore(eventAllBooked);
    const halfVendorScore = calculateReadinessScore(eventHalfBooked);

    expect(fullVendorScore.vendorScore).toBe(25);
    expect(halfVendorScore.vendorScore).toBeLessThan(25);
  });

  it('grades overall readiness status appropriately from Starting Out to Ceremony Ready', () => {
    const perfectEvent = createBaseEvent({
      venueStatus: 'booked',
      tasks: [{ id: 't1', title: 'Task', description: '', dueDate: '2026-12-01', priority: 'high', category: 'Ops', isCompleted: true }],
      vendors: [{ id: 'v1', name: 'Venue', category: 'Venue', estimatedCost: 50000, quotedCost: 50000, paidAmount: 50000, status: 'booked' }],
      guests: [{ id: 'g1', name: 'Guest', group: 'family', rsvpStatus: 'attending', dietaryPreference: 'vegetarian', plusOnes: 0 }],
      expenses: [{ id: 'e1', categoryId: 'cat1', title: 'Deposit', estimatedCost: 50000, actualCost: 50000, isPaid: true, createdAt: '' }],
    });

    const result = calculateReadinessScore(perfectEvent);
    expect(result.totalScore).toBeGreaterThanOrEqual(80);
    expect(['Ready to Celebrate', 'Good Shape', 'In Progress']).toContain(result.status);
  });
});

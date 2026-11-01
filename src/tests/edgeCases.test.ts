import { describe, it, expect } from 'vitest';
import { AiPlanningEngine } from '../services/aiService';
import { formatCurrency, getDaysRemaining } from '../utils/formatters';

describe('System Edge Cases & Boundary Resilience Suite', () => {
  it('handles micro and macro budgets without rounding loss', () => {
    // Extreme micro budget: 500 INR
    const microCats = AiPlanningEngine.generateBudgetCategories({
      eventType: 'birthday',
      totalBudget: 500,
    });
    const microSum = microCats.reduce((s, c) => s + c.allocatedAmount, 0);
    expect(microSum).toBe(500);

    // Extreme mega budget: 10 Crore INR (100,000,000)
    const megaCats = AiPlanningEngine.generateBudgetCategories({
      eventType: 'wedding',
      totalBudget: 100000000,
    });
    const megaSum = megaCats.reduce((s, c) => s + c.allocatedAmount, 0);
    expect(megaSum).toBe(100000000);
  });

  it('safely handles empty or missing dates without throwing exceptions', () => {
    const emptyResult = getDaysRemaining('');
    expect(emptyResult.days).toBe(0);
    expect(emptyResult.label).toBe('Date not set');

    const invalidResult = getDaysRemaining('invalid-date-string-xyz');
    expect(invalidResult.days).toBe(0);
  });

  it('handles zero guest count and extreme guest count cleanly', () => {
    const zeroGuestPlan = AiPlanningEngine.generateComprehensivePlan({
      title: 'Elopement Ceremony',
      eventType: 'wedding',
      guestCount: 0,
      totalBudget: 50000,
    });
    expect(zeroGuestPlan.conceptSummary).toBeDefined();

    const megaGuestPlan = AiPlanningEngine.generateComprehensivePlan({
      title: 'Mass Community Mela',
      eventType: 'community',
      guestCount: 50000,
      totalBudget: 2500000,
    });
    expect(megaGuestPlan.conceptSummary).toBeDefined();
    expect(megaGuestPlan.conceptSummary).toContain('50000');
  });

  it('formats non-standard numeric values without crashing', () => {
    expect(formatCurrency(NaN, 'INR')).toBe('₹0');
    expect(formatCurrency(undefined as unknown as number, 'INR')).toBe('₹0');
    expect(formatCurrency(9999999999, 'USD')).toBe('$9,999,999,999');
  });
});

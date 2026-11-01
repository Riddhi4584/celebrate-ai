import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  generateId,
  getDaysRemaining,
} from '../utils/formatters';

describe('Formatters & Utility Helpers Suite', () => {
  describe('formatCurrency', () => {
    it('formats Indian Rupees (INR) with Indian Lakhs/Crores numbering convention', () => {
      expect(formatCurrency(100000, 'INR')).toBe('₹1,00,000');
      expect(formatCurrency(2500000, 'INR')).toBe('₹25,00,000');
      expect(formatCurrency(500, 'INR')).toBe('₹500');
    });

    it('formats US Dollars (USD) correctly', () => {
      expect(formatCurrency(125000, 'USD')).toBe('$125,000');
      expect(formatCurrency(0, 'USD')).toBe('$0');
    });

    it('formats Euros (EUR) and British Pounds (GBP) correctly', () => {
      expect(formatCurrency(8500, 'EUR')).toContain('8,500');
      expect(formatCurrency(4200, 'GBP')).toContain('4,200');
    });

    it('handles negative or zero currency values gracefully', () => {
      expect(formatCurrency(0, 'INR')).toBe('₹0');
      expect(formatCurrency(-5000, 'INR')).toBe('₹-5,000');
    });
  });

  describe('generateId', () => {
    it('generates unique string identifiers with custom prefix', () => {
      const id1 = generateId('evt');
      const id2 = generateId('evt');
      const id3 = generateId('tsk');

      expect(id1.startsWith('evt_')).toBe(true);
      expect(id3.startsWith('tsk_')).toBe(true);
      expect(id1).not.toBe(id2);
    });
  });

  describe('getDaysRemaining & formatDate', () => {
    it('accurately identifies future, today, and past dates', () => {
      const now = new Date();
      const todayISO = now.toISOString().split('T')[0];
      const todayStatus = getDaysRemaining(todayISO);
      expect(todayStatus.isToday).toBe(true);
      expect(todayStatus.label).toBe('Happening Today!');

      const futureISO = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const tomorrowStatus = getDaysRemaining(futureISO);
      expect(tomorrowStatus.label).toBe('1 day to go');

      const fiveDaysFuture = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];
      expect(getDaysRemaining(fiveDaysFuture).label).toBe('5 days to go');

      const threeDaysPast = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];
      const pastStatus = getDaysRemaining(threeDaysPast);
      expect(pastStatus.isPast).toBe(true);
      expect(pastStatus.label).toBe('3 days ago');
    });

    it('formats dates into readable human strings', () => {
      const formatted = formatDate('2026-11-25');
      expect(formatted).toContain('2026');
      expect(formatted).toContain('Nov');
    });
  });
});

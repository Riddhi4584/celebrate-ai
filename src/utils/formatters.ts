import { Currency } from '../types';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export function formatCurrency(amount: number, currency: Currency = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';
  const validAmount = isNaN(amount) ? 0 : amount;

  if (currency === 'INR') {
    // Format according to Indian number format (lakhs, crores)
    const formatter = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    });
    return `${symbol}${formatter.format(validAmount)}`;
  }

  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  });
  return `${symbol}${formatter.format(validAmount)}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'Not set';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getDaysRemaining(targetDateString: string): {
  days: number;
  label: string;
  isPast: boolean;
  isToday: boolean;
} {
  if (!targetDateString) {
    return { days: 0, label: 'Date not set', isPast: false, isToday: false };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(targetDateString);
  if (isNaN(target.getTime())) {
    return { days: 0, label: 'Date not set', isPast: false, isToday: false };
  }
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const days = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return {
      days: Math.abs(days),
      label: `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`,
      isPast: true,
      isToday: false,
    };
  }

  if (days === 0) {
    return { days: 0, label: 'Happening Today!', isPast: false, isToday: true };
  }

  return {
    days,
    label: `${days} day${days === 1 ? '' : 's'} to go`,
    isPast: false,
    isToday: false,
  };
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
}

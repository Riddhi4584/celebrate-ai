import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../services/storage';

class LocalStorageMock {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }
}

if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = new LocalStorageMock() as any;
}

describe('StorageService Persistence & Integrity Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads seed events automatically when local storage is empty', () => {
    const events = StorageService.getAllEvents();
    expect(events.length).toBeGreaterThanOrEqual(2);
    expect(events[0].title).toBeDefined();
    expect(events[0].totalBudget).toBeGreaterThan(0);
  });

  it('retrieves an event by ID accurately', () => {
    const events = StorageService.getAllEvents();
    const firstId = events[0].id;
    const found = StorageService.getEventById(firstId);
    expect(found).toBeDefined();
    expect(found?.id).toBe(firstId);
  });

  it('saves and updates an event correctly', () => {
    const events = StorageService.getAllEvents();
    const target = { ...events[0], title: 'Updated Celebration Title 2026' };
    StorageService.saveEvent(target);

    const refreshed = StorageService.getEventById(target.id);
    expect(refreshed?.title).toBe('Updated Celebration Title 2026');
  });

  it('deletes an event cleanly from storage', () => {
    const events = StorageService.getAllEvents();
    const toDeleteId = events[0].id;
    StorageService.deleteEvent(toDeleteId);

    const remaining = StorageService.getAllEvents();
    expect(remaining.some((e) => e.id === toDeleteId)).toBe(false);
  });

  it('exports and restores JSON state without corruption', () => {
    const originalEvents = StorageService.getAllEvents();
    const originalSettings = StorageService.getSettings();
    expect(originalSettings).toBeDefined();

    const exportedJson = StorageService.exportBackup();
    expect(exportedJson).toContain('events');
    expect(exportedJson).toContain('settings');

    // Clear and restore
    localStorage.clear();
    const success = StorageService.importBackup(exportedJson);
    expect(success).toBe(true);

    const restoredEvents = StorageService.getAllEvents();
    expect(restoredEvents.length).toBe(originalEvents.length);
    expect(restoredEvents[0].id).toBe(originalEvents[0].id);
  });

  it('safely handles corrupted or invalid JSON import without crashing', () => {
    const badJson = '{ invalid_json_syntax: true, missing_closing_bracket ';
    const success = StorageService.importBackup(badJson);
    expect(success).toBe(false);
  });

  it('resets to default demo state upon user request', () => {
    localStorage.clear();
    StorageService.saveEvent({
      id: 'temp_event',
      title: 'Temporary Event',
      eventType: 'custom',
      date: '2026-12-31',
      duration: 'half_day',
      city: 'Delhi',
      venueStatus: 'searching',
      totalBudget: 10000,
      currency: 'INR',
      budgetTier: 'balanced',
      guestCount: 20,
      priorities: ['venue'],
      preferences: {
        theme: 'Default Theme',
        colorPalette: [],
        atmosphere: 'Casual',
        culturalTraditions: '',
        dietaryRequirements: [],
        accessibilityNeeds: [],
        specialRequests: '',
        indoorOutdoor: 'indoor',
      },
      categories: [],
      expenses: [],
      tasks: [],
      vendors: [],
      guests: [],
      chatHistory: [],
      createdAt: '',
      updatedAt: '',
    });

    expect(StorageService.getEventById('temp_event')).toBeDefined();

    StorageService.resetToDemoData();
    expect(StorageService.getEventById('temp_event')).toBeUndefined();
    expect(StorageService.getAllEvents().length).toBeGreaterThanOrEqual(2);
  });
});

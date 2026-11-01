/* eslint-disable react/only-export-components */
import React, { createContext, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AppSettings,
  CelebrationEvent,
  Expense,
  Guest,
  StructuredProposal,
  Task,
  Vendor,
} from '../types';
import { AiPlanningEngine } from '../services/aiService';
import { StorageService } from '../services/storage';
import { generateId } from '../utils/formatters';

interface EventContextType {
  events: CelebrationEvent[];
  activeEvent: CelebrationEvent | null;
  activeEventId: string | null;
  setActiveEventId: (id: string) => void;
  createEvent: (data: Partial<CelebrationEvent>) => CelebrationEvent;
  updateEvent: (event: CelebrationEvent) => void;
  deleteEvent: (id: string) => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetDemoData: () => void;

  // Granular modifiers for active event
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;

  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  toggleTaskComplete: (id: string) => void;
  deleteTask: (id: string) => void;

  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  updateVendor: (vendor: Vendor) => void;
  deleteVendor: (id: string) => void;

  addGuest: (guest: Omit<Guest, 'id'>) => void;
  updateGuest: (guest: Guest) => void;
  deleteGuest: (id: string) => void;
  importGuests: (guests: Omit<Guest, 'id'>[]) => void;

  applyStructuredProposal: (proposal: StructuredProposal) => void;
  regeneratePlan: () => void;
}

export const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CelebrationEvent[]>(() => StorageService.getAllEvents());
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());
  const [activeEventId, setActiveEventIdState] = useState<string | null>(() => {
    const saved = StorageService.getSettings();
    if (saved.activeEventId && StorageService.getEventById(saved.activeEventId)) {
      return saved.activeEventId;
    }
    const initialEvents = StorageService.getAllEvents();
    return initialEvents[0]?.id || null;
  });

  const activeEvent = events.find((e) => e.id === activeEventId) || events[0] || null;

  const setActiveEventId = (id: string) => {
    setActiveEventIdState(id);
    const updated = { ...settings, activeEventId: id };
    setSettings(updated);
    StorageService.saveSettings(updated);
  };

  const updateEvent = (updated: CelebrationEvent) => {
    StorageService.saveEvent(updated);
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const createEvent = (data: Partial<CelebrationEvent>): CelebrationEvent => {
    const id = generateId('evt');
    const currency = data.currency || settings.defaultCurrency || 'INR';
    const totalBudget = data.totalBudget || 50000;

    const categories = AiPlanningEngine.generateBudgetCategories({
      ...data,
      totalBudget,
      currency,
    });

    const expenses = AiPlanningEngine.generateInitialExpenses(categories, data.budgetTier || 'balanced');
    const tasks = AiPlanningEngine.generateTimelineTasks({ ...data, date: data.date });
    const vendors = AiPlanningEngine.generateVendors({ ...data, totalBudget });
    const plan = AiPlanningEngine.generateComprehensivePlan({ ...data, totalBudget });

    const newEvent: CelebrationEvent = {
      id,
      title: data.title || 'My Celebration',
      eventType: data.eventType || 'birthday',
      date: data.date || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      duration: data.duration || 'full_day',
      city: data.city || 'My City',
      venueStatus: data.venueStatus || 'searching',
      venueName: data.venueName || '',
      totalBudget,
      currency,
      budgetTier: data.budgetTier || 'balanced',
      guestCount: data.guestCount || 50,
      adultsCount: data.adultsCount || data.guestCount || 50,
      childrenCount: data.childrenCount || 0,
      priorities: data.priorities || ['venue', 'food', 'decorations'],
      preferences: data.preferences || {
        theme: 'Modern Festive Elegance',
        colorPalette: [
          { name: 'Warm Coral', hex: '#FF6B6B' },
          { name: 'Gold', hex: '#D4AF37' },
          { name: 'Cream', hex: '#FAF8F5' },
        ],
        atmosphere: 'Joyful & warm',
        culturalTraditions: '',
        dietaryRequirements: ['Vegetarian', 'Non-Vegetarian'],
        accessibilityNeeds: [],
        specialRequests: '',
        indoorOutdoor: 'hybrid',
      },
      categories,
      expenses,
      tasks,
      vendors,
      guests: [],
      plan,
      chatHistory: [
        {
          id: generateId('msg'),
          sender: 'ai',
          content: `Welcome to **${data.title || 'your event'}**! I have initialized a personalized plan with a ${totalBudget.toLocaleString()} ${currency} budget allocation, milestone timeline, and theme suggestions. How can I assist you right now?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageService.saveEvent(newEvent);
    setEvents((prev) => [newEvent, ...prev]);
    setActiveEventId(id);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }

    return newEvent;
  };

  const deleteEvent = (id: string) => {
    StorageService.deleteEvent(id);
    const remaining = events.filter((e) => e.id !== id);
    setEvents(remaining);
    if (activeEventId === id) {
      const nextId = remaining[0]?.id || null;
      setActiveEventIdState(nextId);
      if (nextId) {
        StorageService.saveSettings({ ...settings, activeEventId: nextId });
      }
    }
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    StorageService.saveSettings(updated);
  };

  const resetDemoData = () => {
    const demo = StorageService.resetToDemoData();
    setEvents(demo);
    if (demo[0]) {
      setActiveEventId(demo[0].id);
    }
  };

  // --- Granular Active Event Modifiers ---

  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    if (!activeEvent) return;
    const newExpense: Expense = {
      ...expenseData,
      id: generateId('exp'),
      createdAt: new Date().toISOString(),
    };
    updateEvent({
      ...activeEvent,
      expenses: [...activeEvent.expenses, newExpense],
    });
  };

  const updateExpense = (updated: Expense) => {
    if (!activeEvent) return;
    updateEvent({
      ...activeEvent,
      expenses: activeEvent.expenses.map((e) => (e.id === updated.id ? updated : e)),
    });
  };

  const deleteExpense = (id: string) => {
    if (!activeEvent) return;
    updateEvent({
      ...activeEvent,
      expenses: activeEvent.expenses.filter((e) => e.id !== id),
    });
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    if (!activeEvent) return;
    const newTask: Task = {
      ...taskData,
      id: generateId('tsk'),
    };
    updateEvent({
      ...activeEvent,
      tasks: [...activeEvent.tasks, newTask],
    });
  };

  const updateTask = (updated: Task) => {
    if (!activeEvent) return;
    updateEvent({
      ...activeEvent,
      tasks: activeEvent.tasks.map((t) => (t.id === updated.id ? updated : t)),
    });
  };

  const toggleTaskComplete = (id: string) => {
    if (!activeEvent) return;
    const task = activeEvent.tasks.find((t) => t.id === id);
    if (!task) return;

    const willComplete = !task.isCompleted;
    if (willComplete) {
      try {
        confetti({
          particleCount: 40,
          spread: 45,
          origin: { y: 0.7 },
        });
      } catch {
        // safe
      }
    }

    const updatedTasks = activeEvent.tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            isCompleted: willComplete,
            completedAt: willComplete ? new Date().toISOString() : undefined,
          }
        : t
    );

    updateEvent({
      ...activeEvent,
      tasks: updatedTasks,
    });
  };

  const deleteTask = (id: string) => {
    if (!activeEvent) return;
    updateEvent({
      ...activeEvent,
      tasks: activeEvent.tasks.filter((t) => t.id !== id),
    });
  };

  const addVendor = (vendorData: Omit<Vendor, 'id'>) => {
    if (!activeEvent) return;
    const newVendor: Vendor = {
      ...vendorData,
      id: generateId('vnd'),
    };
    updateEvent({
      ...activeEvent,
      vendors: [...activeEvent.vendors, newVendor],
    });
  };

  const updateVendor = (updated: Vendor) => {
    if (!activeEvent) return;
    updateEvent({
      ...activeEvent,
      vendors: activeEvent.vendors.map((v) => (v.id === updated.id ? updated : v)),
    });
  };

  const deleteVendor = (id: string) => {
    if (!activeEvent) return;
    updateEvent({
      ...activeEvent,
      vendors: activeEvent.vendors.filter((v) => v.id !== id),
    });
  };

  const addGuest = (guestData: Omit<Guest, 'id'>) => {
    if (!activeEvent) return;
    const newGuest: Guest = {
      ...guestData,
      id: generateId('gst'),
    };
    updateEvent({
      ...activeEvent,
      guests: [...activeEvent.guests, newGuest],
    });
  };

  const updateGuest = (updated: Guest) => {
    if (!activeEvent) return;
    updateEvent({
      ...activeEvent,
      guests: activeEvent.guests.map((g) => (g.id === updated.id ? updated : g)),
    });
  };

  const deleteGuest = (id: string) => {
    if (!activeEvent) return;
    updateEvent({
      ...activeEvent,
      guests: activeEvent.guests.filter((g) => g.id !== id),
    });
  };

  const importGuests = (imported: Omit<Guest, 'id'>[]) => {
    if (!activeEvent) return;
    const newGuests: Guest[] = imported.map((g) => ({
      ...g,
      id: generateId('gst'),
    }));
    updateEvent({
      ...activeEvent,
      guests: [...activeEvent.guests, ...newGuests],
    });
  };

  const applyStructuredProposal = (proposal: StructuredProposal) => {
    if (!activeEvent) return;
    let updatedEvent = { ...activeEvent };

    // Apply category adjustments
    if (proposal.payload.categoryAdjustments) {
      const map = new Map(proposal.payload.categoryAdjustments.map((a) => [a.categoryId, a.newAllocated]));
      updatedEvent.categories = updatedEvent.categories.map((c) => {
        if (map.has(c.id)) {
          return { ...c, allocatedAmount: map.get(c.id)! };
        }
        return c;
      });
    }

    // Apply total budget change if present
    if (proposal.payload.totalBudgetDelta) {
      updatedEvent.totalBudget = Math.max(1000, updatedEvent.totalBudget + proposal.payload.totalBudgetDelta);
    }

    // Apply tasks to add
    if (proposal.payload.tasksToAdd && proposal.payload.tasksToAdd.length > 0) {
      const newTasks: Task[] = proposal.payload.tasksToAdd.map((t) => ({
        id: generateId('tsk'),
        title: t.title || 'New Task',
        description: t.description || '',
        dueDate: t.dueDate || activeEvent.date,
        priority: t.priority || 'high',
        category: t.category || 'Planning',
        isCompleted: false,
        phase: t.phase || 'preparation',
      }));
      updatedEvent.tasks = [...updatedEvent.tasks, ...newTasks];
    }

    // Mark proposal applied in chat history
    updatedEvent.chatHistory = updatedEvent.chatHistory.map((m) => {
      if (m.structuredProposal?.description === proposal.description) {
        return {
          ...m,
          structuredProposal: {
            ...m.structuredProposal,
            applied: true,
          },
        };
      }
      return m;
    });

    updateEvent(updatedEvent);

    try {
      confetti({
        particleCount: 50,
        spread: 50,
      });
    } catch {
      // safe
    }
  };

  const regeneratePlan = () => {
    if (!activeEvent) return;
    const newPlan = AiPlanningEngine.generateComprehensivePlan(activeEvent);
    updateEvent({
      ...activeEvent,
      plan: newPlan,
    });
  };

  return (
    <EventContext.Provider
      value={{
        events,
        activeEvent,
        activeEventId,
        setActiveEventId,
        createEvent,
        updateEvent,
        deleteEvent,
        settings,
        updateSettings,
        resetDemoData,
        addExpense,
        updateExpense,
        deleteExpense,
        addTask,
        updateTask,
        toggleTaskComplete,
        deleteTask,
        addVendor,
        updateVendor,
        deleteVendor,
        addGuest,
        updateGuest,
        deleteGuest,
        importGuests,
        applyStructuredProposal,
        regeneratePlan,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export { useEventContext } from './useEventContext';

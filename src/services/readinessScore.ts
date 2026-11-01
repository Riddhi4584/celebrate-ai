import { CelebrationEvent, ReadinessBreakdown } from '../types';
import { getDaysRemaining } from '../utils/formatters';

export function calculateReadinessScore(event: CelebrationEvent): ReadinessBreakdown {
  const recommendations: string[] = [];

  // 1. Task Execution Score (Max 30 points)
  let tasksScore = 0;
  const totalTasks = event.tasks.length;
  if (totalTasks > 0) {
    const completedTasks = event.tasks.filter((t) => t.isCompleted).length;
    const taskRatio = completedTasks / totalTasks;
    tasksScore = Math.round(taskRatio * 30);

    const pendingUrgent = event.tasks.filter((t) => !t.isCompleted && (t.priority === 'urgent' || t.priority === 'high'));
    if (pendingUrgent.length > 0) {
      recommendations.push(`Complete ${pendingUrgent.length} high/urgent pending task${pendingUrgent.length > 1 ? 's' : ''}`);
    }
  } else {
    recommendations.push('Generate or add your initial planning checklist');
  }

  // 2. Budget Health Score (Max 25 points)
  let budgetScore = 25;
  const totalActual = event.expenses.reduce((sum, e) => sum + (e.actualCost || e.estimatedCost || 0), 0);
  const totalAllocated = event.categories.reduce((sum, c) => sum + (c.allocatedAmount || 0), 0);

  if (event.totalBudget <= 0) {
    budgetScore = 0;
    recommendations.push('Establish a clear total budget for realistic planning');
  } else {
    // If overspent actuals
    if (totalActual > event.totalBudget) {
      budgetScore = Math.max(5, Math.round(25 - ((totalActual - event.totalBudget) / event.totalBudget) * 30));
      recommendations.push(`Review expenses: current spending exceeds total budget by ${Math.round(((totalActual - event.totalBudget) / event.totalBudget) * 100)}%`);
    } else if (totalAllocated === 0) {
      budgetScore = 12;
      recommendations.push('Allocate your budget into specific categories (Catering, Venue, etc.)');
    } else if (Math.abs(totalAllocated - event.totalBudget) > event.totalBudget * 0.1) {
      budgetScore = 18;
      recommendations.push('Rebalance category allocations to match your total budget');
    }
  }

  // 3. Vendor Booking Progress (Max 25 points)
  let vendorScore = 0;
  const totalVendors = event.vendors.length;
  if (totalVendors > 0) {
    const bookedVendors = event.vendors.filter((v) => v.status === 'booked').length;
    const contractedVendors = event.vendors.filter((v) => v.status === 'negotiating' || v.status === 'quote_received').length;
    
    // booked = 1.0 weight, negotiating/quote = 0.5 weight
    const vendorPoints = (bookedVendors * 1.0 + contractedVendors * 0.5) / totalVendors;
    vendorScore = Math.round(Math.min(25, vendorPoints * 25));

    const unconfirmed = event.vendors.filter((v) => v.status !== 'booked' && v.status !== 'cancelled');
    if (unconfirmed.length > 0) {
      recommendations.push(`Finalize agreements with ${unconfirmed.length} pending vendor${unconfirmed.length > 1 ? 's' : ''}`);
    }
  } else {
    vendorScore = 5;
    recommendations.push('Shortlist vendors for essential services');
  }

  // 4. Critical Timeline & Date Proximity (Max 10 points)
  let timelineScore = 10;
  const daysInfo = getDaysRemaining(event.date);

  const overdueTasks = event.tasks.filter((t) => {
    if (t.isCompleted || !t.dueDate) return false;
    const taskDays = getDaysRemaining(t.dueDate);
    return taskDays.isPast;
  });

  if (overdueTasks.length > 0) {
    timelineScore = Math.max(2, 10 - overdueTasks.length * 2);
    recommendations.push(`Resolve ${overdueTasks.length} overdue task deadline${overdueTasks.length > 1 ? 's' : ''}`);
  }

  // 5. Guest Management & Key Information (Max 10 points)
  let guestScore = 0;
  if (event.guestCount > 0) {
    guestScore += 4;
  }
  if (event.guests && event.guests.length > 0) {
    const confirmedCount = event.guests.filter((g) => g.rsvpStatus === 'attending' || g.rsvpStatus === 'declined').length;
    const rsvpRatio = confirmedCount / event.guests.length;
    guestScore += Math.round(rsvpRatio * 6);

    const pendingGuests = event.guests.filter((g) => g.rsvpStatus === 'pending' || g.rsvpStatus === 'tentative').length;
    if (pendingGuests > 0 && daysInfo.days <= 14 && !daysInfo.isPast) {
      recommendations.push(`Follow up on ${pendingGuests} pending guest RSVP${pendingGuests > 1 ? 's' : ''}`);
    }
  } else {
    recommendations.push('Build your guest list to track dietary requirements and RSVPs');
  }

  const totalScore = Math.min(100, Math.max(0, tasksScore + budgetScore + vendorScore + timelineScore + guestScore));

  let status: ReadinessBreakdown['status'] = 'In Progress';
  if (totalScore >= 85) {
    status = 'Ready to Celebrate';
  } else if (totalScore >= 65) {
    status = 'Good Shape';
  } else if (totalScore < 40) {
    status = 'Critical Attention';
  }

  // Deduplicate recommendations and limit to top 4 most actionable
  const uniqueRecommendations = Array.from(new Set(recommendations)).slice(0, 4);

  return {
    totalScore,
    tasksScore,
    budgetScore,
    vendorScore,
    timelineScore,
    guestScore,
    status,
    recommendations: uniqueRecommendations.length > 0 ? uniqueRecommendations : ['Keep tracking tasks and confirmed bookings as your date approaches.'],
  };
}

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { EventProvider, useEventContext } from './context/EventContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { CreateEventWizard } from './pages/CreateEventWizard';
import { DashboardPage } from './pages/DashboardPage';
import { EventPlanPage } from './pages/EventPlanPage';
import { BudgetPage } from './pages/BudgetPage';
import { TasksPage } from './pages/TasksPage';
import { VendorsPage } from './pages/VendorsPage';
import { GuestsPage } from './pages/GuestsPage';
import { AssistantPage } from './pages/AssistantPage';
import { TradeOffPage } from './pages/TradeOffPage';
import { SettingsPage } from './pages/SettingsPage';

// Helper component to synchronize URL param :id with activeEventId in context
const EventRouteSync: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { id } = useParams<{ id: string }>();
  const { activeEventId, setActiveEventId, events } = useEventContext();

  useEffect(() => {
    if (id && id !== activeEventId) {
      const exists = events.some((e) => e.id === id);
      if (exists) {
        setActiveEventId(id);
      }
    }
  }, [id, activeEventId, events, setActiveEventId]);

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <EventProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Standalone Event Creation Wizard */}
          <Route path="/app/create" element={<CreateEventWizard />} />

          {/* Dashboard and Workspace inside AppLayout */}
          <Route
            path="/app"
            element={<Navigate to="/app/dashboard" replace />}
          />

          <Route
            path="/app/dashboard"
            element={
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            }
          />

          <Route
            path="/app/settings"
            element={
              <AppLayout>
                <SettingsPage />
              </AppLayout>
            }
          />

          {/* Event-specific Workspace Sub-routes */}
          <Route
            path="/app/events/:id/plan"
            element={
              <AppLayout>
                <EventRouteSync>
                  <EventPlanPage />
                </EventRouteSync>
              </AppLayout>
            }
          />

          <Route
            path="/app/events/:id/budget"
            element={
              <AppLayout>
                <EventRouteSync>
                  <BudgetPage />
                </EventRouteSync>
              </AppLayout>
            }
          />

          <Route
            path="/app/events/:id/tasks"
            element={
              <AppLayout>
                <EventRouteSync>
                  <TasksPage />
                </EventRouteSync>
              </AppLayout>
            }
          />

          <Route
            path="/app/events/:id/vendors"
            element={
              <AppLayout>
                <EventRouteSync>
                  <VendorsPage />
                </EventRouteSync>
              </AppLayout>
            }
          />

          <Route
            path="/app/events/:id/guests"
            element={
              <AppLayout>
                <EventRouteSync>
                  <GuestsPage />
                </EventRouteSync>
              </AppLayout>
            }
          />

          <Route
            path="/app/events/:id/assistant"
            element={
              <AppLayout>
                <EventRouteSync>
                  <AssistantPage />
                </EventRouteSync>
              </AppLayout>
            }
          />

          <Route
            path="/app/events/:id/tradeoffs"
            element={
              <AppLayout>
                <EventRouteSync>
                  <TradeOffPage />
                </EventRouteSync>
              </AppLayout>
            }
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </EventProvider>
  );
};

export default App;

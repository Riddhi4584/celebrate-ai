# CelebrateAI — AI-Powered Celebration & Event Planner

**CelebrateAI** is a production-quality, responsive, GenAI-powered celebration and event planning web application. Designed for weddings, milestone birthdays, corporate summits, anniversaries, community festivals, and more, it combines sophisticated design with mathematical budget optimization, adaptive milestone timelines, vendor tracking, guest RSVP coordination, and a context-aware conversational AI planning assistant.

---

## 🎥 Screen Recordings & Live Demo

- **Live Production Application**: [https://celebrate-ai-self.vercel.app](https://celebrate-ai-self.vercel.app)
- **Complete Product Tour Recording (WebP Video)**: [recordings/celebrate_ai_walkthrough.webp](recordings/celebrate_ai_walkthrough.webp)
- **6-Step Creation Wizard Live Demo (WebP Video)**: [recordings/celebrate_ai_wizard_creation_demo.webp](recordings/celebrate_ai_wizard_creation_demo.webp)
- **Curated Screenshots**: [screenshots/](screenshots/)

---

## 🌟 Key Features

### 1. Public Landing Page
- **Hero Showcase**: Headline *"Your Perfect Event Starts with a Smarter Plan"* with instant CTAs ("Plan My Event" and "Explore Features").
- **Live Event Studio Preview**: Interactive glassmorphism preview featuring real budget allocations, time-aware milestones, and AI proposal previews.
- **10 Supported Celebration Types**: Dedicated workflows for Weddings, Birthdays, Anniversaries, Corporate Events, College Fests, Community Festivals, Engagements, Baby Showers, Cultural Poojas/Festivals, and Custom Events.
- **How It Works & FAQ**: 4-step visual journey and expandable interactive FAQs.

### 2. 6-Step Event Creation Wizard
- **Step 1: Basics**: Celebration name, event type, date, duration, city, venue status, and setting preference (indoor/outdoor/hybrid).
- **Step 2: Budget & Scale**: Total planned budget with currency selector (INR ₹ default, USD $, EUR €, GBP £) and scale tiers (Low-Cost, Balanced, Premium).
- **Step 3: Guests & Accessibility**: Estimated attendee counts with adult/child breakdown and accessibility requirements (ramps, elderly seating, nursing lounges).
- **Step 4: Style & Preferences**: Theme, desired atmosphere, cultural traditions, and dietary requirements (Vegetarian, Non-Veg, Jain, Vegan, Halal, Gluten-Free).
- **Step 5: Celebration Priorities**: Weighted ranking for venue, catering, decor, photography, entertainment, guest experience, and affordability.
- **Step 6: Review & Plan Generation**: Real-time summary review with an animated multi-stage AI generator that constructs custom budget allocations, milestones, and initial vendor quotes.

### 3. Dedicated Event Workspace & Dashboard
- **Dynamic Metrics**: Portfolio-wide live KPIs (Total Events, Upcoming Events, Total Planned Capital, Outstanding Tasks).
- **Active Event Spotlight**: Countdown timer ("45 days to go"), budget progress, and full plan summary.
- **Transparent Event Readiness Score**: Real-time 0–100% score computed across 5 weighted dimensions (Tasks: 30%, Budget: 25%, Vendors: 25%, Timeline: 10%, Guests: 10%) with actionable next steps.
- **Portfolio Grid**: Switch between celebrations effortlessly with state synchronization across the URL bar.

### 4. Mathematical Budget Optimizer & Expense Register
- **Deterministic Proportions**: Automatically allocates 100% of the total budget based on event-type historical benchmarks (e.g. 30% Catering for weddings vs 35% custom cakes & food for birthdays).
- **Recharts Visualizations**: Interactive donut chart for category distributions and bar chart comparing allocated budget vs. actually paid funds.
- **Overspending Warnings**: Clear alerts when actual payments exceed target allocations or total funds.
- **Itemized Register**: Add, edit, and delete expense line-items, and toggle between Paid and Unpaid status without distorting cash balances.

### 5. Adaptive Timeline & Task Management
- **Time-Aware Deadlines**: Milestones automatically adjust to the remaining days before the event (never generates impossible deadlines).
- **Dual Views**: Seamless toggle between interactive Checklist and Milestone Phase Timeline.
- **Instant Confetti Feedback**: Completing tasks triggers instant particle confetti and syncs metrics with the dashboard and readiness score.
- **Filtering & Search**: Filter by status (All, Pending, Completed, Overdue), priority (Urgent, High, Medium, Low), or keyword search.

### 6. Vendor Coordination & Contract Tracker
- **Booking Pipeline**: Track vendors across 6 statuses (*Researching, Contacted, Quote Received, Negotiating, Booked, Cancelled*).
- **Cost Tracking**: Compare estimated vs. quoted vs. paid advance amounts.
- **Contact & Payment Deadlines**: Manage point-of-contact details, phone, email, and contractual payment due dates.
- **AI Distinction**: Clear visual badges distinguish AI recommendations from manually booked vendor agreements.

### 7. Guest List, RSVPs & Dietary Breakdown
- **Guest Management**: Add, edit, delete, and group guests (*Family, Friends, VIP, Colleagues, Other*).
- **Catering Dietary Roster**: Real-time headcount aggregations for Jain, Vegetarian, Vegan, Halal, and Gluten-Free meals (including plus-ones).
- **CSV Portability**: Full CSV Export and CSV Import capabilities.
- **Client-Side Privacy Safe**: Guest data remains strictly in local storage and is never transmitted to external AI endpoints.

### 8. Interactive AI Planning Partner & Assistant
- **Event-Context Aware**: Pre-loaded with event title, budget, headcount, city, and theme.
- **Actionable Structured Proposals**: Proposes concrete changes (e.g. *"Reduce my budget by 15% without compromising food quality"* or *"Add 4 final-week preparation tasks"*).
- **Review & Confirm Dialog**: Shows a diff preview before applying changes; never silently overwrites data.
- **Suggested Prompts**: 1-click chip suggestions for rain contingencies, vegetarian menu curations, and task checklists.
- **Copy & Export**: 1-click clipboard copy for all AI recommendations.

### 9. Differentiating Features
- **Smart Budget Trade-Off Analysis**: Side-by-side alternative comparison (e.g. *Option A: Ballroom vs Option B: Boutique Garden with Fairy Lights*) with quantified savings and honest pros & cons.
- **1-Click Executive Planning Summary**: Modal dialog generating a comprehensive executive brief ready to copy or print/save as PDF for family, clients, or vendors.
- **Local Persistence & Portability**: Backup and restore all events via JSON export/import with a 1-click sample demo reset.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React icons, Recharts
- **Micro-Interactions**: Canvas-Confetti, CSS animations, responsive slide drawers
- **Routing**: React Router DOM v7
- **Persistence**: LocalStorage abstraction layer (`StorageService`) with pre-seeded realistic celebrations (*Aanya & Kabir's Royal Jaipur Wedding* and *Arjun's 30th Neon Sunset Rooftop Bash*)
- **AI Architecture**: Provider-independent service supporting Google Gemini, OpenAI, or the built-in Intelligent Contextual Demo AI Engine
- **Unit Testing**: Vitest

---

## 🚀 Installation & Local Launch

### Prerequisites
- Node.js (v18+ recommended, tested on Node v24)
- npm (v9+)

### Steps

1. **Clone or open the repository**:
   ```bash
   cd d:/PROJECTS/PW_Challenge_5
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables (Optional)**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Note: If no API keys are provided, CelebrateAI automatically operates using its built-in Intelligent Contextual Demo Engine.*

4. **Run the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/`.

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **Run unit tests**:
   ```bash
   npm test
   ```

---

## 🧪 Testing Verification

CelebrateAI includes automated unit tests with Vitest covering critical domain logic:

```bash
npm test
```

### Verified Test Cases:
1. `Currency and Date Formatter Logic`: Validates Indian numbering system (`₹15,00,000`), USD comma formatting, and days-remaining relative calculations.
2. `Budget Optimizer Proportions`: Verifies that generated category allocations strictly sum up to 100% of the total budget across varying amounts.
3. `Category Adaptation`: Verifies that wedding plans include Mandap & Staging while birthdays prioritize Cakes & Balloons.
4. `Timeline Feasibility`: Ensures that generated task deadlines are always on or before the target event date.
5. `Event Readiness Score Algorithm`: Confirms scoring across tasks, budget discipline, vendor bookings, timelines, and guest management.

In addition, full end-to-end browser testing was completed using the browser agent:
- Landing page rendered with hero and navigation.
- 6-step event wizard created a custom engagement event.
- Budget Recharts pie and bar graphs rendered accurately.
- Tasks completed with confetti feedback.
- AI Assistant chat successfully processed budget reduction query and applied a 15% reduction to the workspace.
- Executive summary modal generated and verified.

---

## 🔒 Security & Privacy

- **No Hardcoded Keys**: Private API credentials are never bundled in source code.
- **Safe Persistence**: Event records and guest lists reside in the client's local storage.
- **Provider Fallback**: Missing credentials do not crash the app; CelebrateAI falls back to its deterministic contextual engine.

---

## 📄 License

Built for hackathon excellence. Released under the MIT License.

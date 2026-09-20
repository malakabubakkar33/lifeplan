# LifePlan — Plan Today. Secure Tomorrow.

A production-grade, full-stack Personal & Family Financial Management Progressive Web App (PWA) engineered with modern web technologies, military-grade financial budgeting models (50/30/20 framework), real-time offline persistence, and contextual AI assistance.

![LifePlan Hero Banner](/icons/icon-512x512.png)

---

## 🌟 Key Highlights & Architectural Features

### 1. 🔐 Enterprise Authentication & Onboarding
- **Clerk Authentication**: Sign-in, Sign-up, social logins, and secure session management.
- **Custom Emerald Dark Theme**: Styled with LifePlan's signature emerald palette (`#19D98A`, `#0B110E`, `#050806`).
- **Animated Splash Screen & Onboarding**: Smooth Framer Motion transitions with auto-redirect logic.
- **11-Step Interactive Financial Profile Wizard**: Dynamic live 50/30/20 preview at each step for currency, salary, housing, utilities, groceries, transport, family, debt, healthcare, and savings targets.

### 2. 📊 Cash Flow & Salary Runway Management
- **Monthly Salary Tracker**: Live countdown to next payday with payday cycle alerts.
- **Daily Safe-To-Spend Indicator**: Discretionary spending metric dynamically computed after deducting fixed bills, rent, and monthly savings commitments.
- **Cash Flow Velocity**: Real-time inflow vs. outflow ratio tracking.

### 3. 🧠 Smart 50/30/20 Monthly Planning Engine
- **Needs (50%)**: Housing, utilities, groceries, transportation, loan minimums.
- **Wants (30%)**: Personal leisure, family entertainment, dining out.
- **Savings (20%)**: High-yield reserves, liquid emergency funds, long-term wealth.
- **Fine-Tune Sliders**: Real-time slider adjustments with instant budget surplus recalculation.
- **Budget Alerts**: Real-time notifications when category spending exceeds safe thresholds.

### 4. 👨‍👩‍👧‍👦 Family & Children Expenses
- **Family Member Profiles**: Assign custom monthly allowances to spouse, kids, and dependents.
- **Children Ledger**: Dedicated categorization for school tuition, academic supplies, sports, activities, and pediatric care.
- **Per-Member Ledger View**: Individual transaction history and budget progress bars.

### 5. 🛡️ Emergency Reserve & Savings Vaults
- **3-6 Months Living Expense Runway Calculator**: Automated benchmark calculation based on actual fixed living requirements.
- **Multi-Goal Vaults**: Milestone targets with deadlines, required monthly savings rate, and one-tap contributions.

### 6. 🗓️ Bills & Subscriptions Calendar
- **Due Date Automation**: Visual indicators for Overdue, Due Soon (within 5 days), and Settled payments.
- **One-Tap Payment Settlement**: Instantly toggle bills as paid/pending with automatic ledger sync.

### 7. 📈 Interactive Analytics & Statements
- **Recharts Integration**:
  - Monthly Inflow vs Outflow Bar Chart.
  - Expense Allocation Donut Chart.
  - Historical Savings Rate Progression Area Chart.
- **Printable Statements**: Clean financial statements with browser print support.
- **Audit Exports**: One-click CSV transaction exports and encrypted JSON vault backups with restore support.

### 8. 🤖 AI Financial Advisor
- **Contextual Financial Intelligence**: Directly queries current salary, remaining budget, bills schedule, and emergency fund status to answer questions accurately.
- **Actionable Advice**: Instant responses for budget optimization, vacation affordability checks, and utility bill reductions.

### 9. 📱 Progressive Web App (PWA) & Offline Resiliency
- **Installable Native Experience**: Web app manifest (`manifest.json`) supporting standalone display, shortcut actions, and complete icon suite (32px to 512px).
- **Service Worker (`sw.js`)**: Intelligent cache-first and network-first strategies.
- **Offline Fallback Page (`/offline`)**: Beautiful network recovery screen.
- **Offline Banner**: In-app alert notifying users when running in local offline mode.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org) with React 19
- **Authentication**: [Clerk](https://clerk.com)
- **Database / Backend**: [Supabase](https://supabase.com) (PostgreSQL with Row Level Security)
- **Styling**: Tailwind CSS v4 + Custom Emerald Design Tokens
- **UI Primitives**: Radix UI (Dialog, Tabs, Progress, Switch, Slot)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Validation**: Zod & TypeScript

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### 2. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Clerk and Supabase credentials:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

### 3. Database Migration
Run the SQL migration script located in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL Editor to establish all 11 database tables and Row Level Security (RLS) policies.

*(Note: If Supabase keys are not set, LifePlan automatically operates in resilient local storage mode with full demo data seeded!)*

### 4. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Privacy

LifePlan is built with a privacy-first mindset:
- Data is isolated per user using Clerk authentication tokens.
- All database queries are protected with PostgreSQL Row Level Security (RLS) enforcing `clerk_user_id = auth.uid()`.
- Client storage operates locally via encrypted browser storage.

---

*LifePlan — Plan Today. Secure Tomorrow.*

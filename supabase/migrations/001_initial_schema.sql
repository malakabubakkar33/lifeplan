-- ================================================================
-- LifePlan Financial Management App — Supabase Database Schema
-- Run this entire file in the Supabase SQL Editor
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- TABLE: users_profiles
-- ================================================================
CREATE TABLE IF NOT EXISTS public.users_profiles (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id     TEXT UNIQUE NOT NULL,
  full_name         TEXT,
  email             TEXT,
  avatar_url        TEXT,
  currency          TEXT NOT NULL DEFAULT 'PKR',
  country           TEXT DEFAULT 'Pakistan',
  timezone          TEXT DEFAULT 'Asia/Karachi',
  monthly_salary    NUMERIC(15,2) DEFAULT 0,
  payday            INTEGER DEFAULT 1 CHECK (payday BETWEEN 1 AND 31),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  setup_completed   BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- TABLE: financial_profiles
-- ================================================================
CREATE TABLE IF NOT EXISTS public.financial_profiles (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id     TEXT UNIQUE NOT NULL,
  monthly_salary    NUMERIC(15,2) DEFAULT 0,
  salary_type       TEXT DEFAULT 'monthly' CHECK (salary_type IN ('monthly','biweekly','weekly')),
  payday            INTEGER DEFAULT 1 CHECK (payday BETWEEN 1 AND 31),
  rent              NUMERIC(15,2) DEFAULT 0,
  utilities         NUMERIC(15,2) DEFAULT 0,
  groceries         NUMERIC(15,2) DEFAULT 0,
  transportation    NUMERIC(15,2) DEFAULT 0,
  education         NUMERIC(15,2) DEFAULT 0,
  healthcare        NUMERIC(15,2) DEFAULT 0,
  debt              NUMERIC(15,2) DEFAULT 0,
  insurance         NUMERIC(15,2) DEFAULT 0,
  personal_budget   NUMERIC(15,2) DEFAULT 0,
  savings_target    NUMERIC(15,2) DEFAULT 0,
  emergency_target  NUMERIC(15,2) DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- TABLE: family_members
-- ================================================================
CREATE TABLE IF NOT EXISTS public.family_members (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id     TEXT NOT NULL,
  name              TEXT NOT NULL,
  relationship      TEXT NOT NULL DEFAULT 'other',
  date_of_birth     DATE,
  avatar_url        TEXT,
  monthly_budget    NUMERIC(15,2) DEFAULT 0,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- TABLE: categories
-- ================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id     TEXT NOT NULL,
  name              TEXT NOT NULL,
  icon              TEXT DEFAULT 'circle',
  color             TEXT DEFAULT '#19D98A',
  type              TEXT NOT NULL DEFAULT 'expense' CHECK (type IN ('income','expense','transfer')),
  is_default        BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- TABLE: transactions
-- ================================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id     TEXT NOT NULL,
  category_id       UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  family_member_id  UUID REFERENCES public.family_members(id) ON DELETE SET NULL,
  type              TEXT NOT NULL CHECK (type IN ('income','expense','transfer')),
  amount            NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  description       TEXT NOT NULL,
  transaction_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method    TEXT DEFAULT 'cash',
  receipt_url       TEXT,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- TABLE: bills
-- ================================================================
CREATE TABLE IF NOT EXISTS public.bills (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id     TEXT NOT NULL,
  name              TEXT NOT NULL,
  amount            NUMERIC(15,2) NOT NULL CHECK (amount >= 0),
  due_date          INTEGER NOT NULL CHECK (due_date BETWEEN 1 AND 31),
  recurring         BOOLEAN DEFAULT TRUE,
  recurrence_type   TEXT DEFAULT 'monthly' CHECK (recurrence_type IN ('monthly','quarterly','yearly','once')),
  category_id       UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  status            TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','overdue','cancelled')),
  paid_at           TIMESTAMPTZ,
  reminder_enabled  BOOLEAN DEFAULT TRUE,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- TABLE: budgets
-- ================================================================
CREATE TABLE IF NOT EXISTS public.budgets (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id     TEXT NOT NULL,
  month             INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year              INTEGER NOT NULL CHECK (year BETWEEN 2020 AND 2100),
  category_id       UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  planned_amount    NUMERIC(15,2) DEFAULT 0,
  actual_amount     NUMERIC(15,2) DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(clerk_user_id, month, year, category_id)
);

-- ================================================================
-- TABLE: savings_goals
-- ================================================================
CREATE TABLE IF NOT EXISTS public.savings_goals (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id     TEXT NOT NULL,
  name              TEXT NOT NULL,
  target_amount     NUMERIC(15,2) NOT NULL CHECK (target_amount > 0),
  current_amount    NUMERIC(15,2) DEFAULT 0 CHECK (current_amount >= 0),
  deadline          DATE,
  icon              TEXT DEFAULT 'target',
  color             TEXT DEFAULT '#19D98A',
  status            TEXT DEFAULT 'active' CHECK (status IN ('active','completed','paused','cancelled')),
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- TABLE: monthly_plans
-- ================================================================
CREATE TABLE IF NOT EXISTS public.monthly_plans (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id             TEXT NOT NULL,
  month                     INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year                      INTEGER NOT NULL CHECK (year BETWEEN 2020 AND 2100),
  salary                    NUMERIC(15,2) DEFAULT 0,
  total_fixed_expenses      NUMERIC(15,2) DEFAULT 0,
  total_variable_expenses   NUMERIC(15,2) DEFAULT 0,
  total_savings             NUMERIC(15,2) DEFAULT 0,
  emergency_fund            NUMERIC(15,2) DEFAULT 0,
  remaining_amount          NUMERIC(15,2) DEFAULT 0,
  notes                     TEXT,
  is_finalized              BOOLEAN DEFAULT FALSE,
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(clerk_user_id, month, year)
);

-- ================================================================
-- TABLE: notifications
-- ================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id     TEXT NOT NULL,
  title             TEXT NOT NULL,
  message           TEXT NOT NULL,
  type              TEXT DEFAULT 'info' CHECK (type IN ('info','warning','success','error','bill','goal','budget')),
  read              BOOLEAN DEFAULT FALSE,
  action_url        TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- TABLE: financial_goals
-- ================================================================
CREATE TABLE IF NOT EXISTS public.financial_goals (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id     TEXT NOT NULL,
  title             TEXT NOT NULL,
  description       TEXT,
  target_amount     NUMERIC(15,2) NOT NULL CHECK (target_amount > 0),
  current_amount    NUMERIC(15,2) DEFAULT 0 CHECK (current_amount >= 0),
  deadline          DATE,
  status            TEXT DEFAULT 'active' CHECK (status IN ('active','completed','paused','cancelled')),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- INDEXES — Performance
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_transactions_clerk_user    ON public.transactions(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date          ON public.transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_month_year    ON public.transactions(clerk_user_id, EXTRACT(YEAR FROM transaction_date), EXTRACT(MONTH FROM transaction_date));
CREATE INDEX IF NOT EXISTS idx_transactions_type          ON public.transactions(clerk_user_id, type);
CREATE INDEX IF NOT EXISTS idx_transactions_category      ON public.transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_bills_clerk_user           ON public.bills(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_bills_status               ON public.bills(clerk_user_id, status);
CREATE INDEX IF NOT EXISTS idx_categories_clerk_user      ON public.categories(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_period             ON public.budgets(clerk_user_id, year, month);
CREATE INDEX IF NOT EXISTS idx_savings_goals_clerk        ON public.savings_goals(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_plans_period       ON public.monthly_plans(clerk_user_id, year, month);
CREATE INDEX IF NOT EXISTS idx_notifications_clerk        ON public.notifications(clerk_user_id, read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_family_members_clerk       ON public.family_members(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_financial_goals_clerk      ON public.financial_goals(clerk_user_id);

-- ================================================================
-- UPDATED_AT TRIGGER
-- ================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_profiles_updated_at
  BEFORE UPDATE ON public.users_profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_financial_profiles_updated_at
  BEFORE UPDATE ON public.financial_profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_bills_updated_at
  BEFORE UPDATE ON public.bills
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_savings_goals_updated_at
  BEFORE UPDATE ON public.savings_goals
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_monthly_plans_updated_at
  BEFORE UPDATE ON public.monthly_plans
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_family_members_updated_at
  BEFORE UPDATE ON public.family_members
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_financial_goals_updated_at
  BEFORE UPDATE ON public.financial_goals
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ================================================================
-- ROW LEVEL SECURITY — Enable on all tables
-- ================================================================
ALTER TABLE public.users_profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_plans      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_goals    ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- RLS POLICIES
-- NOTE: We use clerk_user_id from JWT claims. 
-- In Supabase, set a custom JWT claim via Clerk webhook or 
-- pass clerk_user_id as a header and verify server-side.
-- For simplicity, policies use the service role on server 
-- and the app verifies ownership via API routes.
-- ================================================================

-- users_profiles policies
CREATE POLICY "Users can view own profile"
  ON public.users_profiles FOR SELECT
  USING (clerk_user_id = current_setting('app.clerk_user_id', TRUE));

CREATE POLICY "Users can insert own profile"
  ON public.users_profiles FOR INSERT
  WITH CHECK (clerk_user_id = current_setting('app.clerk_user_id', TRUE));

CREATE POLICY "Users can update own profile"
  ON public.users_profiles FOR UPDATE
  USING (clerk_user_id = current_setting('app.clerk_user_id', TRUE));

-- financial_profiles policies
CREATE POLICY "Users can CRUD own financial profile"
  ON public.financial_profiles FOR ALL
  USING (clerk_user_id = current_setting('app.clerk_user_id', TRUE));

-- family_members policies
CREATE POLICY "Users can CRUD own family members"
  ON public.family_members FOR ALL
  USING (clerk_user_id = current_setting('app.clerk_user_id', TRUE));

-- categories policies
CREATE POLICY "Users can CRUD own categories"
  ON public.categories FOR ALL
  USING (clerk_user_id = current_setting('app.clerk_user_id', TRUE));

-- transactions policies
CREATE POLICY "Users can CRUD own transactions"
  ON public.transactions FOR ALL
  USING (clerk_user_id = current_setting('app.clerk_user_id', TRUE));

-- bills policies
CREATE POLICY "Users can CRUD own bills"
  ON public.bills FOR ALL
  USING (clerk_user_id = current_setting('app.clerk_user_id', TRUE));

-- budgets policies
CREATE POLICY "Users can CRUD own budgets"
  ON public.budgets FOR ALL
  USING (clerk_user_id = current_setting('app.clerk_user_id', TRUE));

-- savings_goals policies
CREATE POLICY "Users can CRUD own savings goals"
  ON public.savings_goals FOR ALL
  USING (clerk_user_id = current_setting('app.clerk_user_id', TRUE));

-- monthly_plans policies
CREATE POLICY "Users can CRUD own monthly plans"
  ON public.monthly_plans FOR ALL
  USING (clerk_user_id = current_setting('app.clerk_user_id', TRUE));

-- notifications policies
CREATE POLICY "Users can manage own notifications"
  ON public.notifications FOR ALL
  USING (clerk_user_id = current_setting('app.clerk_user_id', TRUE));

-- financial_goals policies
CREATE POLICY "Users can CRUD own financial goals"
  ON public.financial_goals FOR ALL
  USING (clerk_user_id = current_setting('app.clerk_user_id', TRUE));

-- ================================================================
-- DEFAULT CATEGORIES (seeded per user via application logic)
-- ================================================================
-- Categories are created per user on first setup via API.
-- See: app/api/setup/categories/route.ts

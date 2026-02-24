-- sukusuku-navi Initial Schema
-- Created: 2026-02-20

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  locale TEXT DEFAULT 'ja' CHECK (locale IN ('ja', 'en')),
  push_subscription JSONB,
  line_user_id TEXT UNIQUE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  migrated_from_localstorage BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  birth_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.completed_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(child_id, item_id)
);

CREATE TABLE public.vaccination_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  vaccine_slug TEXT NOT NULL,
  dose_number INTEGER NOT NULL,
  administered_date DATE,
  scheduled_date DATE,
  clinic_name TEXT,
  lot_number TEXT,
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'skipped')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(child_id, vaccine_slug, dose_number)
);

CREATE TABLE public.milestone_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  milestone_id TEXT NOT NULL,
  achieved_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(child_id, milestone_id)
);

CREATE TABLE public.action_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  action_id TEXT NOT NULL,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  deadline DATE,
  reminder_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(child_id, action_id)
);

CREATE TABLE public.saved_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  article_slug TEXT NOT NULL,
  saved_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id, article_slug)
);

CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  invited_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(family_id, member_id)
);

CREATE TABLE public.push_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT now(),
  clicked_at TIMESTAMPTZ
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_children_family_id ON public.children(family_id);
CREATE INDEX idx_completed_items_child_id ON public.completed_items(child_id);
CREATE INDEX idx_vaccination_records_child_id ON public.vaccination_records(child_id);
CREATE INDEX idx_milestone_records_child_id ON public.milestone_records(child_id);
CREATE INDEX idx_action_records_child_id ON public.action_records(child_id);
CREATE INDEX idx_saved_articles_profile_id ON public.saved_articles(profile_id);
CREATE INDEX idx_family_members_member_id ON public.family_members(member_id);
CREATE INDEX idx_push_notifications_profile_id ON public.push_notifications(profile_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccination_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestone_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_notifications ENABLE ROW LEVEL SECURITY;

-- profiles: own profile only
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- children: own family or shared family
CREATE POLICY "children_own_or_shared" ON public.children
  FOR ALL USING (
    family_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.family_members fm
      WHERE fm.family_id = children.family_id
      AND fm.member_id = auth.uid()
      AND fm.accepted_at IS NOT NULL
    )
  );

-- completed_items: via child access
CREATE POLICY "completed_items_via_child" ON public.completed_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = completed_items.child_id
      AND (
        c.family_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.family_members fm
          WHERE fm.family_id = c.family_id
          AND fm.member_id = auth.uid()
          AND fm.accepted_at IS NOT NULL
        )
      )
    )
  );

-- vaccination_records: via child access
CREATE POLICY "vaccination_records_via_child" ON public.vaccination_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = vaccination_records.child_id
      AND (
        c.family_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.family_members fm
          WHERE fm.family_id = c.family_id
          AND fm.member_id = auth.uid()
          AND fm.accepted_at IS NOT NULL
        )
      )
    )
  );

-- milestone_records: via child access
CREATE POLICY "milestone_records_via_child" ON public.milestone_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = milestone_records.child_id
      AND (
        c.family_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.family_members fm
          WHERE fm.family_id = c.family_id
          AND fm.member_id = auth.uid()
          AND fm.accepted_at IS NOT NULL
        )
      )
    )
  );

-- action_records: via child access
CREATE POLICY "action_records_via_child" ON public.action_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = action_records.child_id
      AND (
        c.family_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.family_members fm
          WHERE fm.family_id = c.family_id
          AND fm.member_id = auth.uid()
          AND fm.accepted_at IS NOT NULL
        )
      )
    )
  );

-- saved_articles: own profile only
CREATE POLICY "saved_articles_own" ON public.saved_articles
  FOR ALL USING (profile_id = auth.uid());

-- family_members: owner can manage, member can view own
CREATE POLICY "family_members_owner" ON public.family_members
  FOR ALL USING (family_id = auth.uid());
CREATE POLICY "family_members_self" ON public.family_members
  FOR SELECT USING (member_id = auth.uid());

-- push_notifications: own only
CREATE POLICY "push_notifications_own" ON public.push_notifications
  FOR ALL USING (profile_id = auth.uid());

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER children_updated_at
  BEFORE UPDATE ON public.children
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER vaccination_records_updated_at
  BEFORE UPDATE ON public.vaccination_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER action_records_updated_at
  BEFORE UPDATE ON public.action_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

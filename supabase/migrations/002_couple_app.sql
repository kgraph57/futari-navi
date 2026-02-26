-- futari-navi Couple App Schema
-- Paired-style two-player question/quiz/prediction game
-- Created: 2026-02-27

-- ============================================================
-- TABLES: Couple Pairing
-- ============================================================

CREATE TABLE public.couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_a UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_b UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invite_code TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'dissolved')),
  created_at TIMESTAMPTZ DEFAULT now(),
  paired_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TABLES: Two-Player Daily Answers
-- ============================================================

CREATE TABLE public.couple_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_date DATE NOT NULL DEFAULT CURRENT_DATE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  answered_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(couple_id, question_id, question_date, user_id)
);

-- ============================================================
-- TABLES: Quiz System
-- ============================================================

CREATE TABLE public.quiz_packs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '💬',
  question_count INTEGER NOT NULL DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.quiz_questions (
  id TEXT PRIMARY KEY,
  pack_id TEXT NOT NULL REFERENCES public.quiz_packs(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE public.quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  pack_id TEXT NOT NULL REFERENCES public.quiz_packs(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  compatibility_score NUMERIC(5,2),
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  answered_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(session_id, question_id, user_id)
);

-- ============================================================
-- TABLES: Prediction Game
-- ============================================================

CREATE TABLE public.prediction_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  round_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  winner_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(couple_id, question_id, round_date)
);

CREATE TABLE public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES public.prediction_rounds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  my_answer TEXT NOT NULL,
  predicted_partner_answer TEXT NOT NULL,
  accuracy_score INTEGER,
  answered_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(round_id, user_id)
);

-- ============================================================
-- TABLES: Couple Stats / Streaks
-- ============================================================

CREATE TABLE public.couple_stats (
  couple_id UUID PRIMARY KEY REFERENCES public.couples(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_questions_answered INTEGER DEFAULT 0,
  total_quizzes_completed INTEGER DEFAULT 0,
  total_predictions_played INTEGER DEFAULT 0,
  total_prediction_points_a INTEGER DEFAULT 0,
  total_prediction_points_b INTEGER DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_couples_partner_a ON public.couples(partner_a);
CREATE INDEX idx_couples_partner_b ON public.couples(partner_b);
CREATE INDEX idx_couples_invite_code ON public.couples(invite_code);
CREATE INDEX idx_couple_answers_couple_date ON public.couple_answers(couple_id, question_date);
CREATE INDEX idx_couple_answers_user ON public.couple_answers(user_id);
CREATE INDEX idx_quiz_questions_pack ON public.quiz_questions(pack_id);
CREATE INDEX idx_quiz_sessions_couple ON public.quiz_sessions(couple_id);
CREATE INDEX idx_quiz_answers_session ON public.quiz_answers(session_id);
CREATE INDEX idx_prediction_rounds_couple ON public.prediction_rounds(couple_id);
CREATE INDEX idx_predictions_round ON public.predictions(round_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_stats ENABLE ROW LEVEL SECURITY;

-- Helper: check if user is in a couple
CREATE OR REPLACE FUNCTION is_couple_member(couple_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.couples
    WHERE id = couple_uuid
    AND (partner_a = auth.uid() OR partner_b = auth.uid())
    AND status = 'active'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- couples: own couples
CREATE POLICY "couples_select" ON public.couples
  FOR SELECT USING (partner_a = auth.uid() OR partner_b = auth.uid());
CREATE POLICY "couples_insert" ON public.couples
  FOR INSERT WITH CHECK (partner_a = auth.uid());
CREATE POLICY "couples_update" ON public.couples
  FOR UPDATE USING (partner_a = auth.uid() OR partner_b = auth.uid());

-- couple_answers: couple members only
CREATE POLICY "couple_answers_select" ON public.couple_answers
  FOR SELECT USING (is_couple_member(couple_id));
CREATE POLICY "couple_answers_insert" ON public.couple_answers
  FOR INSERT WITH CHECK (is_couple_member(couple_id) AND user_id = auth.uid());

-- quiz_packs: public read
CREATE POLICY "quiz_packs_select" ON public.quiz_packs
  FOR SELECT USING (true);

-- quiz_questions: public read
CREATE POLICY "quiz_questions_select" ON public.quiz_questions
  FOR SELECT USING (true);

-- quiz_sessions: couple members
CREATE POLICY "quiz_sessions_select" ON public.quiz_sessions
  FOR SELECT USING (is_couple_member(couple_id));
CREATE POLICY "quiz_sessions_insert" ON public.quiz_sessions
  FOR INSERT WITH CHECK (is_couple_member(couple_id));
CREATE POLICY "quiz_sessions_update" ON public.quiz_sessions
  FOR UPDATE USING (is_couple_member(couple_id));

-- quiz_answers: couple members, own answers only for insert
CREATE POLICY "quiz_answers_select" ON public.quiz_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions qs
      WHERE qs.id = quiz_answers.session_id
      AND is_couple_member(qs.couple_id)
    )
  );
CREATE POLICY "quiz_answers_insert" ON public.quiz_answers
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- prediction_rounds: couple members
CREATE POLICY "prediction_rounds_select" ON public.prediction_rounds
  FOR SELECT USING (is_couple_member(couple_id));
CREATE POLICY "prediction_rounds_insert" ON public.prediction_rounds
  FOR INSERT WITH CHECK (is_couple_member(couple_id));
CREATE POLICY "prediction_rounds_update" ON public.prediction_rounds
  FOR UPDATE USING (is_couple_member(couple_id));

-- predictions: couple members via round
CREATE POLICY "predictions_select" ON public.predictions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.prediction_rounds pr
      WHERE pr.id = predictions.round_id
      AND is_couple_member(pr.couple_id)
    )
  );
CREATE POLICY "predictions_insert" ON public.predictions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- couple_stats: couple members
CREATE POLICY "couple_stats_select" ON public.couple_stats
  FOR SELECT USING (is_couple_member(couple_id));
CREATE POLICY "couple_stats_update" ON public.couple_stats
  FOR UPDATE USING (is_couple_member(couple_id));

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER couples_updated_at
  BEFORE UPDATE ON public.couples
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER couple_stats_updated_at
  BEFORE UPDATE ON public.couple_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create couple_stats when couple becomes active
CREATE OR REPLACE FUNCTION handle_couple_activated()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status != 'active') THEN
    INSERT INTO public.couple_stats (couple_id)
    VALUES (NEW.id)
    ON CONFLICT (couple_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_couple_activated
  AFTER INSERT OR UPDATE ON public.couples
  FOR EACH ROW EXECUTE FUNCTION handle_couple_activated();

-- ============================================================
-- SEED: Quiz Packs
-- ============================================================

INSERT INTO public.quiz_packs (id, title, description, category, icon, question_count, sort_order) VALUES
  ('comm-basics', 'コミュニケーション基本', 'ふたりの会話スタイルを知ろう', 'communication', '💬', 6, 1),
  ('future-plans', '将来の夢', 'ふたりの未来を描こう', 'dreams', '✨', 6, 2),
  ('love-language', '愛情表現', '愛の伝え方、受け取り方', 'intimacy', '💕', 6, 3),
  ('money-values', 'お金の価値観', '金銭感覚のすり合わせ', 'values', '💰', 6, 4),
  ('stress-support', 'ストレス対処', '困ったときの支え方', 'support', '🤝', 6, 5),
  ('fun-personality', '性格クイズ', 'お互いの意外な一面', 'fun', '🎭', 6, 6);

-- Communication Basics Quiz
INSERT INTO public.quiz_questions (id, pack_id, text, sort_order) VALUES
  ('comm-1', 'comm-basics', '意見が合わないとき、すぐに話し合いたい', 1),
  ('comm-2', 'comm-basics', '大事な話はLINEより直接会って話したい', 2),
  ('comm-3', 'comm-basics', '相手の話を最後まで聞いてから自分の意見を言う方だ', 3),
  ('comm-4', 'comm-basics', '感情的になっても冷静に話せる方だ', 4),
  ('comm-5', 'comm-basics', '不満があるとき、相手にすぐ伝えられる', 5),
  ('comm-6', 'comm-basics', '「ありがとう」「ごめんね」は毎日言いたい', 6);

-- Future Plans Quiz
INSERT INTO public.quiz_questions (id, pack_id, text, sort_order) VALUES
  ('future-1', 'future-plans', '5年以内に結婚したい（or結婚生活を深めたい）', 1),
  ('future-2', 'future-plans', '将来は都会より田舎で暮らしたい', 2),
  ('future-3', 'future-plans', '子どもは欲しいと思っている', 3),
  ('future-4', 'future-plans', 'ペットと一緒に暮らしたい', 4),
  ('future-5', 'future-plans', '仕事よりプライベートを優先したい', 5),
  ('future-6', 'future-plans', '海外に住んでみたい', 6);

-- Love Language Quiz
INSERT INTO public.quiz_questions (id, pack_id, text, sort_order) VALUES
  ('love-1', 'love-language', '言葉で「好き」と言われると嬉しい', 1),
  ('love-2', 'love-language', 'スキンシップ（手をつなぐ、ハグ）は大事', 2),
  ('love-3', 'love-language', 'プレゼントをもらうと愛を感じる', 3),
  ('love-4', 'love-language', '一緒に時間を過ごすことが一番の愛情表現', 4),
  ('love-5', 'love-language', '相手が家事を手伝ってくれると愛を感じる', 5),
  ('love-6', 'love-language', 'サプライズは嬉しいより驚く方が大きい', 6);

-- Money Values Quiz
INSERT INTO public.quiz_questions (id, pack_id, text, sort_order) VALUES
  ('money-1', 'money-values', '将来のために貯金は大事だと思う', 1),
  ('money-2', 'money-values', '外食より自炊派だ', 2),
  ('money-3', 'money-values', '欲しいものは我慢せず買いたい', 3),
  ('money-4', 'money-values', '家計はふたりで管理したい', 4),
  ('money-5', 'money-values', '旅行にはお金を惜しまない', 5),
  ('money-6', 'money-values', '投資や資産運用に興味がある', 6);

-- Stress Support Quiz
INSERT INTO public.quiz_questions (id, pack_id, text, sort_order) VALUES
  ('stress-1', 'stress-support', '落ち込んだとき、ひとりになりたい', 1),
  ('stress-2', 'stress-support', '相手が悩んでいるとき、アドバイスより共感が大事', 2),
  ('stress-3', 'stress-support', 'ストレスは運動で発散する方だ', 3),
  ('stress-4', 'stress-support', '仕事の愚痴は相手に聞いてほしい', 4),
  ('stress-5', 'stress-support', '困ったとき、まず相手に相談する', 5),
  ('stress-6', 'stress-support', '相手の体調が悪いとき、そばにいたい', 6);

-- Fun Personality Quiz
INSERT INTO public.quiz_questions (id, pack_id, text, sort_order) VALUES
  ('fun-1', 'fun-personality', '朝型より夜型だ', 1),
  ('fun-2', 'fun-personality', '計画を立てるより即興が好き', 2),
  ('fun-3', 'fun-personality', '大人数のパーティーより少人数が好き', 3),
  ('fun-4', 'fun-personality', '映画は恋愛よりアクション派', 4),
  ('fun-5', 'fun-personality', '休日は外出よりおうちが好き', 5),
  ('fun-6', 'fun-personality', 'SNSは見る専より発信する方', 6);

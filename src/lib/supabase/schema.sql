-- ================================================
-- SafeeBot Supabase Schema
-- Real bazada tətbiq olunmuş strukturlar
-- ================================================

-- ================================================
-- 1. Profiles (Auth extensions)
-- ================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  avatar_url TEXT,
  has_access BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ================================================
-- 2. Chat Sessions
-- ================================================
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Yeni Söhbət',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own chat sessions"
  ON public.chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own chat sessions"
  ON public.chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions"
  ON public.chat_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat sessions"
  ON public.chat_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- ================================================
-- 3. Chat Messages
-- ================================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('user', 'bot')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert messages into their own chat sessions"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_sessions
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view messages from their own chat sessions"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages from their own chat sessions"
  ON public.chat_messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ================================================
-- 4. JSA Analysis Logs
-- ================================================
CREATE TABLE IF NOT EXISTS public.jsa_analysis_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.jsa_analysis_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own jsa logs"
  ON public.jsa_analysis_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert jsa logs"
  ON public.jsa_analysis_logs FOR INSERT
  WITH CHECK (true);

-- JSA rate limit RPC
CREATE OR REPLACE FUNCTION public.check_jsa_limits(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_last_request TIMESTAMPTZ;
  v_daily_count INT;
  v_monthly_count INT;
BEGIN
  SELECT created_at INTO v_last_request
  FROM jsa_analysis_logs
  WHERE user_id = p_user_id
  ORDER BY created_at DESC LIMIT 1;

  IF v_last_request IS NOT NULL AND v_last_request > NOW() - INTERVAL '10 seconds' THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'Siz son 10 saniyə ərzində onsuz da sorğu göndərmisiniz. Xahiş edirik bir az gözləyin.', 'code', 429);
  END IF;

  SELECT COUNT(*) INTO v_daily_count
  FROM jsa_analysis_logs
  WHERE user_id = p_user_id AND created_at > NOW() - INTERVAL '24 hours';

  IF v_daily_count >= 5 THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'Günlük analiz limitiniz (5) bitmişdir. Lütfən sabah yenidən sınayın.', 'code', 403);
  END IF;

  SELECT COUNT(*) INTO v_monthly_count
  FROM jsa_analysis_logs
  WHERE user_id = p_user_id AND created_at > NOW() - INTERVAL '30 days';

  IF v_monthly_count >= 30 THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'Aylıq analiz limitiniz (30) bitmişdir.', 'code', 403);
  END IF;

  INSERT INTO jsa_analysis_logs (user_id) VALUES (p_user_id);
  RETURN jsonb_build_object('allowed', true);
END;
$$;

-- ================================================
-- 5. CV Builder Usage (Rate Limiting)
-- ================================================
CREATE TABLE IF NOT EXISTS public.cv_builder_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('generate', 'analyze', 'cover_letter')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cv_builder_usage_user_action
  ON cv_builder_usage(user_id, action, created_at);

ALTER TABLE public.cv_builder_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cv usage"
  ON public.cv_builder_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert cv usage"
  ON public.cv_builder_usage FOR INSERT
  WITH CHECK (true);

-- CV rate limit RPC
CREATE OR REPLACE FUNCTION public.check_cv_limits(p_user_id UUID, p_action TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  usage_count INT;
  max_limit INT;
  limit_label TEXT;
BEGIN
  IF p_action = 'generate' THEN
    max_limit := 5;
    limit_label := 'Gündə 5 CV yarada bilərsiniz.';
  ELSIF p_action = 'analyze' THEN
    max_limit := 10;
    limit_label := 'Gündə 10 analiz edə bilərsiniz.';
  ELSIF p_action = 'cover_letter' THEN
    max_limit := 5;
    limit_label := 'Gündə 5 müraciət məktubu yarada bilərsiniz.';
  ELSE
    RETURN json_build_object('allowed', false, 'reason', 'Naməlum əməliyyat.');
  END IF;

  SELECT COUNT(*) INTO usage_count
  FROM cv_builder_usage
  WHERE user_id = p_user_id
    AND action = p_action
    AND created_at >= CURRENT_DATE;

  IF usage_count >= max_limit THEN
    RETURN json_build_object('allowed', false, 'reason', limit_label);
  END IF;

  INSERT INTO cv_builder_usage (user_id, action) VALUES (p_user_id, p_action);
  RETURN json_build_object('allowed', true, 'remaining', max_limit - usage_count - 1);
END;
$$;

-- ================================================
-- 6. Account Deletion RPC
-- ================================================
CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  calling_user_id UUID;
BEGIN
  calling_user_id := auth.uid();
  IF calling_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  DELETE FROM auth.users WHERE id = calling_user_id;
END;
$$;

REVOKE ALL ON FUNCTION delete_own_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION delete_own_account() TO authenticated;

-- ================================================
-- Indexes
-- ================================================
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);

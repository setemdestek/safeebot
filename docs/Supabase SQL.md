1. KOD1
-- Köhnə qaydanı sil
DROP POLICY "Public profiles are viewable by everyone." ON public.profiles;

-- Yeni qayda: hər kəs yalnız öz profilini görsün
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

2. KOD2
-- ALTER TABLE public.jsa_analysis_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own jsa logs"
ON public.jsa_analysis_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service can insert jsa logs"
ON public.jsa_analysis_logs FOR INSERT
WITH CHECK (true);

3. KOD3
ALTER TABLE public.jsa_analysis_logs
DROP CONSTRAINT jsa_analysis_logs_user_id_fkey;

ALTER TABLE public.jsa_analysis_logs
ADD CONSTRAINT jsa_analysis_logs_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

4. KOD4
ALTER TABLE public.jsa_analysis_logs
DROP CONSTRAINT jsa_analysis_logs_user_id_fkey;

ALTER TABLE public.jsa_analysis_logs
ADD CONSTRAINT jsa_analysis_logs_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

5. KOD5
-- 1. CV Builder rate limit table
CREATE TABLE IF NOT EXISTS cv_builder_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('generate', 'analyze', 'cover_letter')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_cv_builder_usage_user_action 
ON cv_builder_usage(user_id, action, created_at);

-- RLS enable
ALTER TABLE cv_builder_usage ENABLE ROW LEVEL SECURITY;

-- Users can only see their own usage
CREATE POLICY "Users can view own cv usage" ON cv_builder_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Only server (service role) can insert
CREATE POLICY "Service can insert cv usage" ON cv_builder_usage
  FOR INSERT WITH CHECK (true);

-- 2. check_cv_limits function
CREATE OR REPLACE FUNCTION check_cv_limits(p_user_id UUID, p_action TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  usage_count INT;
  max_limit INT;
  limit_label TEXT;
BEGIN
  -- Set limits per action
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

  -- Count today's usage
  SELECT COUNT(*) INTO usage_count
  FROM cv_builder_usage
  WHERE user_id = p_user_id
    AND action = p_action
    AND created_at >= CURRENT_DATE;

  -- Check limit
  IF usage_count >= max_limit THEN
    RETURN json_build_object('allowed', false, 'reason', limit_label);
  END IF;

  -- Log usage and allow
  INSERT INTO cv_builder_usage (user_id, action) VALUES (p_user_id, p_action);

  RETURN json_build_object('allowed', true, 'remaining', max_limit - usage_count - 1);
END;
$$;

6. KOD6
-- 1. Chat Sessions cədvəli
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'Yeni Söhbət',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Chat Messages cədvəli
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK (role IN ('user', 'bot')) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Avtomatik updated_at triggeri chat_sessions üçün
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chat_sessions_updated_at
BEFORE UPDATE ON public.chat_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Təhlükəsizlik qaydaları (Row Level Security - RLS)
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- İstifadəçi yalnız öz sessiyalarını (chat_sessions) idarə edə bilər
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

-- İstifadəçi yalnız öz xüsusi sessiyalarına aid mesajları (chat_messages) idarə edə bilər
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

7. KOD7
-- 1. Cədvəlin yaradılması (Əgər yoxdursa)
CREATE TABLE IF NOT EXISTS public.jsa_analysis_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. İstifadəçi limitlərini Atomik Yoxlayan və Yazan (RPC) Funksiya
CREATE OR REPLACE FUNCTION public.check_jsa_limits(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_request TIMESTAMPTZ;
  v_daily_count INT;
  v_monthly_count INT;
BEGIN
  -- 1. Bot qorunması: son istəkdən 10 saniyə keçibmi?
  SELECT created_at INTO v_last_request 
  FROM jsa_analysis_logs 
  WHERE user_id = p_user_id 
  ORDER BY created_at DESC 
  LIMIT 1;

  IF v_last_request IS NOT NULL AND v_last_request > NOW() - INTERVAL '10 seconds' THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'Siz son 10 saniyə ərzində onsuz da sorğu göndərmisiniz. Xahiş edirik bir az gözləyin.', 'code', 429);
  END IF;

  -- 2. Günlük limit: son 24 saatda maks 5 istək
  SELECT COUNT(*) INTO v_daily_count 
  FROM jsa_analysis_logs 
  WHERE user_id = p_user_id AND created_at > NOW() - INTERVAL '24 hours';

  IF v_daily_count >= 5 THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'Günlük analiz limitiniz (5) bitmişdir. Lütfən sabah yenidən sınayın.', 'code', 403);
  END IF;

  -- 3. Aylıq limit: son 30 gündə maks 30 istək
  SELECT COUNT(*) INTO v_monthly_count 
  FROM jsa_analysis_logs 
  WHERE user_id = p_user_id AND created_at > NOW() - INTERVAL '30 days';

  IF v_monthly_count >= 30 THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'Aylıq analiz limitiniz (30) bitmişdir.', 'code', 403);
  END IF;

  -- Bütün yoxlamalardan keçdisə, yeni rekordu Atomik şəkildə yaz və icazə ver
  INSERT INTO jsa_analysis_logs (user_id) VALUES (p_user_id);

  RETURN jsonb_build_object('allowed', true);
END;
$$;

8. KOD8
-- 1. Profiles cədvəlinin yaradılması
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  first_name text,
  last_name text,
  email text,
  avatar_url text,
  has_access boolean default true, -- Hələlik hər kəsə açıqdır
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- 2. Təhlükəsizlik qaydaları (Row Level Security - RLS)
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );
create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 3. Trigger funksiyası (Auth-da kimsə yarananda profili avtomatik formalaşdırsın)
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, email, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- 4. Trigger-in özü (Aktivləşdirici)
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

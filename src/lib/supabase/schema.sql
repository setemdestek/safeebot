-- ================================================
-- SafeeBot Supabase Schema (DEAKTIV — strukturlar hazır)
-- Bu faylı Supabase-ə tətbiq etmək üçün aktiv etimək lazımdır
-- ================================================

-- Users table (Supabase Auth extensions)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  locale TEXT DEFAULT 'az' CHECK (locale IN ('az', 'en', 'ru')),
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat sessions
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'Yeni Söhbət',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'bot')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CV data (future)
CREATE TABLE IF NOT EXISTS public.cv_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- Row Level Security (RLS) Policies — HAZIR, AKTİV DEYİL
-- ================================================

-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.cv_data ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/update their own
-- CREATE POLICY "Users can view own profile" ON public.profiles
--   FOR SELECT USING (auth.uid() = id);
-- CREATE POLICY "Users can update own profile" ON public.profiles
--   FOR UPDATE USING (auth.uid() = id);

-- Chat sessions: users can only access their own
-- CREATE POLICY "Users can view own sessions" ON public.chat_sessions
--   FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Users can create sessions" ON public.chat_sessions
--   FOR INSERT WITH CHECK (auth.uid() = user_id);
-- CREATE POLICY "Users can delete own sessions" ON public.chat_sessions
--   FOR DELETE USING (auth.uid() = user_id);

-- Chat messages: users can only access messages from their sessions
-- CREATE POLICY "Users can view own messages" ON public.chat_messages
--   FOR SELECT USING (
--     session_id IN (SELECT id FROM public.chat_sessions WHERE user_id = auth.uid())
--   );
-- CREATE POLICY "Users can insert messages" ON public.chat_messages
--   FOR INSERT WITH CHECK (
--     session_id IN (SELECT id FROM public.chat_sessions WHERE user_id = auth.uid())
--   );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_cv_data_user_id ON public.cv_data(user_id);

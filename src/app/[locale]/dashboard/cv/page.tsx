import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function CvPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login?redirect=/${locale}/dashboard/cv`);
  }

  // User is authenticated — redirect to Reactive Resume (served at /cv/dashboard)
  // Locale is passed via cookie (Supabase session carries the user, Lingui reads locale from cookie)
  redirect('/cv/dashboard');
}

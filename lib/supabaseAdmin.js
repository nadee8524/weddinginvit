import { createClient } from '@supabase/supabase-js';
export const db = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
// Verifies the Supabase session token server-side and checks it belongs to ADMIN_EMAIL.
export async function requireAdmin(req) {
  const t = (req.headers.get('authorization') || '').replace('Bearer ', '');
  if (!t) return false;
  const { data } = await db().auth.getUser(t);
  const e = data?.user?.email?.toLowerCase();
  return !!e && e === (process.env.ADMIN_EMAIL || '').toLowerCase();
}

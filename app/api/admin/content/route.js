import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db, requireAdmin } from '@/lib/supabaseAdmin';
import { getContent, getRaw } from '@/lib/content';
import { FIELDS } from '@/lib/defaults';
export const dynamic = 'force-dynamic';
const no = () => NextResponse.json({ error: 'Not authorised' }, { status: 401 });
export async function GET(req) { if (!(await requireAdmin(req))) return no(); return NextResponse.json(await getContent()); }
export async function PUT(req) {
  if (!(await requireAdmin(req))) return no();
  const b = await req.json(); const next = { ...(await getRaw()) };
  for (const [k] of FIELDS) if (typeof b[k] === 'string') next[k] = b[k].slice(0, 2000);
  const okDate = !next.date || /^\d{4}-\d{2}-\d{2}$/.test(next.date);
  const okTime = ['arrival', 'poruwa', 'end'].every((k) => !next[k] || /^\d{2}:\d{2}$/.test(next[k]));
  if (!okDate || !okTime) return NextResponse.json({ error: 'Invalid date or time' }, { status: 400 });
  const { error } = await db().from('site_content').upsert({ id: 1, data: next, updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath('/'); return NextResponse.json({ ok: true });
}

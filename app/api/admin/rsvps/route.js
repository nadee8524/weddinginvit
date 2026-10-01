import { NextResponse } from 'next/server';
import { db, requireAdmin } from '@/lib/supabaseAdmin';
export const dynamic = 'force-dynamic';
export async function GET(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'Not authorised' }, { status: 401 });
  const { data, error } = await db().from('rsvps').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rows: data });
}

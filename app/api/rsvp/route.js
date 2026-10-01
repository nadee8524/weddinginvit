import { NextResponse } from 'next/server';
import { db } from '@/lib/supabaseAdmin';
const bad = (m, s = 400) => NextResponse.json({ error: m }, { status: s });
export async function POST(req) {
  let b; try { b = await req.json(); } catch { return bad('Invalid request.'); }
  if (b.website) return NextResponse.json({ ok: true }); // honeypot: silently drop bots
  const name = String(b.name || '').trim().slice(0, 120);
  if (!name) return bad('Please enter your name.');
  if (!['yes', 'no'].includes(b.attending)) return bad('Please choose whether you can attend.');
  const yes = b.attending === 'yes';
  const { error } = await db().from('rsvps').insert({
    guest_name: name, attending: yes,
    guest_count: yes ? Math.min(10, Math.max(1, parseInt(b.count) || 1)) : 0,
    guest_names: yes ? String(b.names || '').trim().slice(0, 500) : '',
    message: String(b.message || '').trim().slice(0, 1000),
  });
  if (error) return bad('We could not save your RSVP. Please try again.', 500);
  return NextResponse.json({ ok: true });
}

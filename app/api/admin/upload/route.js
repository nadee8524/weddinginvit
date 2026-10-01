import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db, requireAdmin } from '@/lib/supabaseAdmin';
import { getRaw } from '@/lib/content';
import { PHOTO_SLOTS } from '@/lib/defaults';
export const dynamic = 'force-dynamic';
const err = (m, s = 400) => NextResponse.json({ error: m }, { status: s });
export async function POST(req) {
  if (!(await requireAdmin(req))) return err('Not authorised', 401);
  const fd = await req.formData(); const file = fd.get('file'); const slot = String(fd.get('slot'));
  const isMusic = slot === 'music';
  if (!file || (!isMusic && !PHOTO_SLOTS.some(([k]) => k === slot))) return err('Invalid upload');
  if (file.size > 4_000_000) return err('File must be under 4 MB');
  if (isMusic ? !file.type.startsWith('audio/') : !file.type.startsWith('image/')) return err('Wrong file type');
  const ext = isMusic ? 'mp3' : 'jpg'; const path = `${slot}-${Date.now()}.${ext}`;
  const sb = db();
  const up = await sb.storage.from('invitation').upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: true });
  if (up.error) return err(up.error.message, 500);
  const url = sb.storage.from('invitation').getPublicUrl(path).data.publicUrl;
  const cur = await getRaw();
  const next = isMusic ? { ...cur, musicUrl: url } : { ...cur, photos: { ...(cur.photos || {}), [slot]: url } };
  const { error } = await sb.from('site_content').upsert({ id: 1, data: next, updated_at: new Date().toISOString() });
  if (error) return err(error.message, 500);
  revalidatePath('/'); return NextResponse.json({ url });
}

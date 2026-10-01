import { db } from './supabaseAdmin';
import { DEFAULTS } from './defaults';
export async function getRaw() { try { const { data } = await db().from('site_content').select('data').eq('id', 1).maybeSingle(); return data?.data || {}; } catch { return {}; } }
export async function getContent() { const d = await getRaw(); return { ...DEFAULTS, ...d, photos: { ...DEFAULTS.photos, ...(d.photos || {}) } }; }

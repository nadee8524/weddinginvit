'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FIELDS, PHOTO_SLOTS } from '@/lib/defaults';
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'x');
async function api(url, opts = {}) {
  const { data } = await sb.auth.getSession();
  return fetch(url, { ...opts, headers: { ...(opts.headers || {}), ...(opts.body && typeof opts.body === 'string' ? { 'Content-Type': 'application/json' } : {}), Authorization: 'Bearer ' + data.session?.access_token } });
}
const fmt = (d) => new Date(d).toLocaleString('en-GB', { timeZone: 'Asia/Colombo', dateStyle: 'medium', timeStyle: 'short' });
const esc = (v) => { let s = String(v ?? ''); if (/^[=+\-@]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };

export default function Admin() {
  const [s, setS] = useState(undefined); const [tab, setTab] = useState('rsvp');
  useEffect(() => { sb.auth.getSession().then(({ data }) => setS(data.session)); const { data: l } = sb.auth.onAuthStateChange((_, x) => setS(x)); return () => l.subscription.unsubscribe(); }, []);
  if (s === undefined) return null;
  if (!s) return <Login />;
  return (
    <div className="adm">
      <header><h1>Invitation Admin</h1>
        {[['rsvp', 'RSVPs'], ['content', 'Wording & Details'], ['photos', 'Photos & Music']].map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
        <button onClick={() => sb.auth.signOut()}>Sign out</button></header>
      {tab === 'rsvp' && <Rsvps />}{tab === 'content' && <Content />}{tab === 'photos' && <Photos />}
    </div>
  );
}
function Login() {
  const [e, setE] = useState(''); const [p, setP] = useState(''); const [m, setM] = useState('');
  async function go(ev) { ev.preventDefault(); const { error } = await sb.auth.signInWithPassword({ email: e, password: p }); if (error) setM('Sign-in failed. Check your email and password.'); }
  return <div className="adm"><form className="login" onSubmit={go}><h1>Invitation Admin</h1><input type="email" placeholder="Email" value={e} onChange={(x) => setE(x.target.value)} required /><input type="password" placeholder="Password" value={p} onChange={(x) => setP(x.target.value)} required /><button className="pri">Sign in</button>{m && <p className="msg">{m}</p>}</form></div>;
}
function Rsvps() {
  const [rows, setRows] = useState([]); const [q, setQ] = useState(''); const [flt, setFlt] = useState('all'); const [asc, setAsc] = useState(false); const [err, setErr] = useState('');
  useEffect(() => { api('/api/admin/rsvps').then(async (r) => { const j = await r.json(); r.ok ? setRows(j.rows) : setErr(j.error); }); }, []);
  const view = useMemo(() => rows.filter((r) => (flt === 'all' || (flt === 'yes') === r.attending) && `${r.guest_name} ${r.guest_names} ${r.message}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (asc ? 1 : -1) * (new Date(a.created_at) - new Date(b.created_at))), [rows, q, flt, asc]);
  const yes = rows.filter((r) => r.attending);
  function csv() {
    const lines = [['Guest name', 'Status', 'Guests', 'Guest names', 'Message', 'Submitted (Sri Lanka time)'], ...view.map((r) => [r.guest_name, r.attending ? 'Attending' : 'Not attending', r.guest_count, r.guest_names, r.message, fmt(r.created_at)])].map((a) => a.map(esc).join(','));
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv' })); a.download = 'rsvps.csv'; a.click();
  }
  return <>
    {err && <p className="msg">{err}</p>}
    <div className="cards">{[['Total responses', rows.length], ['Attending', yes.length], ['Not attending', rows.length - yes.length], ['Guests attending', yes.reduce((n, r) => n + r.guest_count, 0)]].map(([l, v]) => <div className="card" key={l}><b>{v}</b>{l}</div>)}</div>
    <div className="tools"><input placeholder="Search name, guests or message" value={q} onChange={(e) => setQ(e.target.value)} />
      <select value={flt} onChange={(e) => setFlt(e.target.value)}><option value="all">All responses</option><option value="yes">Attending</option><option value="no">Not attending</option></select>
      <button onClick={() => setAsc(!asc)}>{asc ? 'Oldest first' : 'Newest first'}</button><button className="pri" onClick={csv}>Export CSV</button></div>
    <div className="tw"><table><thead><tr><th>Guest</th><th>Status</th><th>Guests</th><th>Guest names</th><th>Message</th><th>Submitted</th></tr></thead>
      <tbody>{view.map((r) => <tr key={r.id}><td>{r.guest_name}</td><td>{r.attending ? 'Attending' : 'Not attending'}</td><td>{r.guest_count}</td><td>{r.guest_names}</td><td>{r.message}</td><td>{fmt(r.created_at)}</td></tr>)}
        {!view.length && <tr><td colSpan={6}>No responses yet.</td></tr>}</tbody></table></div></>;
}
function Content() {
  const [c, setC] = useState(null); const [m, setM] = useState('');
  useEffect(() => { api('/api/admin/content').then((r) => r.json()).then(setC); }, []);
  if (!c) return null;
  async function save(e) { e.preventDefault(); setM('Saving…'); const r = await api('/api/admin/content', { method: 'PUT', body: JSON.stringify(c) }); setM(r.ok ? 'Saved. The invitation updates within about 30 seconds.' : (await r.json()).error); }
  return <form className="form" onSubmit={save}>{FIELDS.map(([k, l, t]) => <label key={k}>{l}{t === 'area' ? <textarea rows={k === 'address' ? 2 : 4} value={c[k] || ''} onChange={(e) => setC({ ...c, [k]: e.target.value })} /> : <input type={t || 'text'} value={c[k] || ''} onChange={(e) => setC({ ...c, [k]: e.target.value })} />}</label>)}
    <button className="pri">Save changes</button>{m && <p className="msg">{m}</p>}</form>;
}
async function shrink(file) {
  const b = await createImageBitmap(file); const k = Math.min(1, 1800 / Math.max(b.width, b.height));
  const cv = document.createElement('canvas'); cv.width = Math.round(b.width * k); cv.height = Math.round(b.height * k); cv.getContext('2d').drawImage(b, 0, 0, cv.width, cv.height);
  return new Promise((r) => cv.toBlob(r, 'image/jpeg', 0.85));
}
function Photos() {
  const [c, setC] = useState(null); const [m, setM] = useState('');
  const load = useCallback(() => api('/api/admin/content').then((r) => r.json()).then(setC), []);
  useEffect(() => { load(); }, [load]);
  async function up(slot, f) {
    if (!f) return; setM('Uploading…');
    const fd = new FormData(); fd.append('slot', slot); fd.append('file', slot === 'music' ? f : await shrink(f), slot === 'music' ? f.name : 'photo.jpg');
    const r = await api('/api/admin/upload', { method: 'POST', body: fd }); const j = await r.json();
    setM(r.ok ? 'Updated. The invitation shows the new file within about 30 seconds.' : j.error); if (r.ok) load();
  }
  if (!c) return null;
  return <><p className="msg">{m}</p><div className="slots">{PHOTO_SLOTS.map(([k, l]) => <div className="slot" key={k}><b>{l}</b><img src={c.photos[k]} alt="" /><input type="file" accept="image/*" onChange={(e) => up(k, e.target.files[0])} /></div>)}
    <div className="slot"><b>Background music (MP3, under 4 MB)</b><audio controls src={c.musicUrl} style={{ width: '100%' }} /><input type="file" accept="audio/*" onChange={(e) => up('music', e.target.files[0])} /></div></div></>;
}

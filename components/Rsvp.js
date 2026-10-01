'use client';
import { useState } from 'react';
export default function Rsvp() {
  const [f, setF] = useState({ name: '', attending: '', count: 1, names: '', message: '', website: '' });
  const [st, setSt] = useState('idle'); const [err, setErr] = useState('');
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const yes = f.attending === 'yes';
  async function submit(e) {
    e.preventDefault();
    if (!f.attending) { setErr('Please choose whether you can attend.'); return; }
    setSt('busy'); setErr('');
    try {
      const r = await fetch('/api/rsvp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Something went wrong. Please try again.');
      setSt('done');
    } catch (x) { setErr(x.message); setSt('idle'); }
  }
  if (st === 'done') return <div className="rsvp-done"><h3>Thank you, {f.name.trim()}</h3><p>{yes ? 'We look forward to celebrating this beautiful day with you.' : 'You will be missed. Thank you for letting us know.'}</p></div>;
  return (
    <form className="rsvp" onSubmit={submit}>
      <label>Guest Name<input required maxLength={120} value={f.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" /></label>
      <fieldset><legend>Will you attend?</legend>
        <div className="pills">
          <label><input type="radio" name="a" checked={yes} onChange={() => set('attending', 'yes')} /><span>Joyfully accepts</span></label>
          <label><input type="radio" name="a" checked={f.attending === 'no'} onChange={() => set('attending', 'no')} /><span>Regretfully declines</span></label>
        </div>
      </fieldset>
      <div className={'field' + (yes ? '' : ' off')}>
        <span className="lbl">Number of Guests Attending</span>
        <div className="step">
          <button type="button" disabled={!yes || f.count <= 1} onClick={() => set('count', f.count - 1)} aria-label="Fewer guests">−</button>
          <output>{yes ? f.count : '—'}</output>
          <button type="button" disabled={!yes || f.count >= 10} onClick={() => set('count', f.count + 1)} aria-label="More guests">+</button>
        </div>
      </div>
      {yes && f.count > 1 && <label>Guest Names<textarea rows={2} maxLength={500} placeholder="Names of everyone joining you" value={f.names} onChange={(e) => set('names', e.target.value)} /></label>}
      <label>Message <em>(optional)</em><textarea rows={3} maxLength={1000} value={f.message} onChange={(e) => set('message', e.target.value)} /></label>
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={(e) => set('website', e.target.value)} />
      {err && <p className="err" role="alert">{err}</p>}
      <button className="btn solid" disabled={st === 'busy'}>{st === 'busy' ? 'Sending…' : 'Confirm RSVP'}</button>
    </form>
  );
}

export const t12 = (hm) => { const [h, m] = hm.split(':').map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
export const dateParts = (iso) => { const d = new Date(iso + 'T00:00:00Z'); const o = { timeZone: 'UTC' };
  return { weekday: d.toLocaleDateString('en-GB', { ...o, weekday: 'long' }), full: d.toLocaleDateString('en-GB', { ...o, day: 'numeric', month: 'long', year: 'numeric' }) }; };
export const gcalUrl = (c) => { const d = c.date.replace(/-/g, ''); const f = (x) => `${d}T${x.replace(':', '')}00`;
  return 'https://calendar.google.com/calendar/render?' + new URLSearchParams({ action: 'TEMPLATE', text: `${c.bride} & ${c.groom} — Wedding Celebration`,
    dates: `${f(c.arrival)}/${f(c.end)}`, ctz: 'Asia/Colombo', location: `${c.venue}, ${c.hotel}, ${c.address}`.replace(/\s*\n\s*/g, ' '),
    details: `Poruwa Ceremony at ${t12(c.poruwa)}. All times Sri Lanka time.` }).toString(); };

'use client';
import { useEffect, useState } from 'react';
export default function Countdown({ target }) {
  const [n, setN] = useState(null);
  useEffect(() => { setN(Date.now()); const i = setInterval(() => setN(Date.now()), 1000); return () => clearInterval(i); }, []);
  const s = n === null ? 0 : Math.floor(Math.max(0, new Date(target) - n) / 1000);
  const u = [['Days', Math.floor(s / 86400)], ['Hours', Math.floor((s % 86400) / 3600)], ['Minutes', Math.floor((s % 3600) / 60)], ['Seconds', s % 60]];
  return <div className="cd" role="timer">{u.map(([l, v]) => <div key={l} className="cd-cell"><b key={v} className="tick">{String(v).padStart(2, '0')}</b><small>{l}</small></div>)}</div>;
}

'use client';
import { useEffect } from 'react';
// Tries to autoplay; if the browser blocks it, starts on the first tap/scroll/key. No visible controls.
export default function Music({ src }) {
  useEffect(() => {
    if (!src) return;
    const a = new Audio(src); a.loop = true; a.volume = 0;
    const evs = ['pointerdown', 'touchend', 'keydown', 'wheel', 'scroll'];
    let on = false;
    const off = () => evs.forEach((e) => removeEventListener(e, start));
    function start() {
      if (on) return;
      a.play().then(() => { on = true; off(); let v = 0; const i = setInterval(() => { v = Math.min(0.35, v + 0.02); a.volume = v; if (v >= 0.35) clearInterval(i); }, 150); }).catch(() => {});
    }
    evs.forEach((e) => addEventListener(e, start, { passive: true }));
    start();
    return () => { off(); a.pause(); };
  }, [src]);
  return null;
}

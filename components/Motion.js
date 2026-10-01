'use client';
import { Fragment, useEffect, useRef } from 'react';
export function Reveal({ children, className = '', delay = 0 }) {
  const r = useRef();
  useEffect(() => {
    const el = r.current;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } }, { threshold: 0.18 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={r} className={'reveal ' + className} style={{ transitionDelay: delay + 'ms' }}>{children}</div>;
}
// Masked, staggered text. Animates when an ancestor Reveal gets the "in" class.
export function Split({ text, as: T = 'span', className = '', chars = false, step = 55, delay = 0 }) {
  let i = 0;
  return (
    <T className={'split ' + className} aria-label={text}>
      {text.split(' ').map((w, wi) => (
        <Fragment key={wi}>
          <span className="wd" aria-hidden="true">
            {(chars ? [...w] : [w]).map((ch, ci) => <span key={ci} className="sw"><span style={{ transitionDelay: delay + i++ * step + 'ms' }}>{ch}</span></span>)}
          </span>{' '}
        </Fragment>
      ))}
    </T>
  );
}
export function Parallax({ src, pos = '50% 30%', speed = 0.06, eager = false }) {
  const box = useRef(), img = useRef();
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const f = () => { raf = 0; const b = box.current.getBoundingClientRect(); img.current.style.transform = `translate3d(0,${(b.top + b.height / 2 - innerHeight / 2) * speed}px,0) scale(1.08)`; };
    const on = () => { if (!raf) raf = requestAnimationFrame(f); };
    f(); addEventListener('scroll', on, { passive: true }); addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); };
  }, [speed]);
  return <div ref={box} className="plx"><img ref={img} src={src} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" style={{ objectPosition: pos }} /></div>;
}

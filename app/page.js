import { getContent } from '@/lib/content';
import { t12, dateParts, gcalUrl } from '@/lib/format';
import { Reveal, Split, Parallax } from '@/components/Motion';
import Countdown from '@/components/Countdown';
import Music from '@/components/Music';
import Rsvp from '@/components/Rsvp';
export const revalidate = 30;

export default async function Page() {
  const c = await getContent(); const p = c.photos; const d = dateParts(c.date);
  const [dd, mm, yy] = d.full.split(' ');
  const target = `${c.date}T${c.arrival}:00+05:30`;
  return (
    <main>
      <Music src={c.musicUrl} />

     <section className="sec open">
  <img
    className="opening-bg"
    src="/photos/opening-v3.jpg"
    alt=""
  />

  <div className="opening-v3">
    <p className="opening-intro">
      {c.intro}
    </p>

    <div className="opening-rule" />

    <div className="opening-names">
      <div className="opening-name">{c.bride}</div>

      <div className="opening-amp">&amp;</div>

      <div className="opening-name">{c.groom}</div>
    </div>
        <br></br> 
    <div className="opening-bottom">
  <div className="opening-rule" />
  <p className="opening-intro">{c.intro1}</p>
</div>
  </div>

  <span className="cue" />
</section>

      <section className="sec paper std">
        <div className="std-in">
          <Reveal className="plate"><Parallax src={p.saveDate} pos="50% 30%" /></Reveal>
         <Reveal className="std-txt" delay={250}>
  <p className="kicker">Save the Date</p>
  <div className="rule l" />

  <p className="day">{d.weekday}</p>

  <p className="num">
  {dd}<span className="ordinal">th</span>
</p>

  <p className="mon">{mm} {yy}</p>
</Reveal>
        </div>
      </section>

      <section className="sec dark cdsec">
        <Reveal className="z">
          <p className="label">Counting the days</p><div className="rule" />
          <Countdown target={target} />
        </Reveal>
      </section>

      <section className="chapter wine" style={{ '--bg': '#3d1019' }}>
        <div className="chapter-img"><Parallax src={p.loveStory} pos="50% 25%" /></div>
        <div className="chapter-body">
          <Reveal><h2 className="h2"><Split text={c.quoteTitle} /></h2><div className="rule" /><blockquote className="quote">“{c.quote}”</blockquote></Reveal>
          <Reveal delay={150}><p className="para">{c.body1}</p><p className="para">{c.body2}</p><p className="para em">{c.body3}</p></Reveal>
        </div>
      </section>

      <section className="sec paper topo">
        <Reveal className="z">
          <p className="label dk">The Venue</p><div className="rule" />
          <h2 className="h2 venue">{c.venue}</h2><p className="hotel">{c.hotel}</p><p className="addr">{c.address}</p>
          <a className="btn dark" href={c.mapsUrl} target="_blank" rel="noopener noreferrer">View Location</a>
        </Reveal>
      </section>

      <section className="chapter flip" style={{ '--bg': '#2b1a14' }}>
        <div className="chapter-img"><Parallax src={p.celebration} pos="50% 30%" /></div>
        <div className="chapter-body">
          <Reveal>
            <h2 className="h2"><Split text="The Wedding Timeline" /></h2><div className="rule" />
            <div className="tl">
              <div><b>{t12(c.arrival)}</b><span>Welcoming Guests</span></div>
              <div><b>{t12(c.poruwa)}</b><span>Poruwa Ceremony</span></div>
              <div><b>{t12(c.lunch)}</b><span>Lunch</span></div>
              <div><b>{t12(c.dance)}</b><span>Dance Floor</span></div>
              <div><b>{t12(c.end)}</b><span>Celebration concludes</span></div>
            </div>
            
            <a className="btn" href={gcalUrl(c)} target="_blank" rel="noopener noreferrer">Add to Calendar</a>
          </Reveal>
        </div>
      </section>

      <section className="final"><Reveal className="plate full"><Parallax src={p.final} pos="50% 55%" speed={0.05} /></Reveal><div className="ov fade" /></section>

      <section className="sec paper rsvp-sec" id="rsvp">
        <Reveal className="z"><h2 className="h2"><Split text="RSVP" chars /></h2><div className="rule" /><p className="lead lead-first">We would be delighted to celebrate this special day with you.</p>
        <p className="lead lead-deadline rsvp-date">Kindly RSVP by 10th of October.</p></Reveal>
        <Reveal delay={120} className="z formwrap"><Rsvp /></Reveal>
        <p className="foot">{c.bride} &amp; {c.groom} · {d.full}</p>
      </section>
    </main>
  );
}

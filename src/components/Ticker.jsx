import { ticker } from '../data/portfolio'
import { Marquee, MarqueeZone } from './Marquee'

const chip = ([name, abbr, color, bg]) => (
  <div className="tool glass-chip">
    <span className="ic" style={{ background: bg, color, boxShadow: `inset 0 0 0 1.5px ${color}55` }}>{abbr}</span>
    {name}
  </div>
)

/** What AMDV Solutions delivers: two slow, endless left-to-right tickers (second one slower, from another start point). */
export default function Ticker() {
  const half = Math.ceil(ticker.length / 2)
  return (
    <section id="capabilities" className="sec arsenal">
      <div className="head">
        <span className="eyebrow">Innovate • Build • Grow Together</span>
        <h2 className="h2" data-reveal>What We Deliver.</h2>
        <div className="bar" />
      </div>
      <MarqueeZone label="What AMDV Solutions delivers">
        <Marquee items={ticker.slice(0, half)} speed={42} render={chip} label="What AMDV Solutions delivers" />
        <Marquee items={ticker.slice(half)} speed={34} offset={1} render={chip} label="More from AMDV Solutions" />
      </MarqueeZone>
    </section>
  )
}

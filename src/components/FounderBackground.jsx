import { useEffect, useRef } from 'react'
import { addFrameTask, finePointer, lerp, mouse, onRealResize, reduce, sStyle, view } from '../lib/runtime'

/**
 * Founder & CEO backdrop: a calm, premium "boardroom in 3D" instead of code.
 *  - a slowly turning gold / navy gradient mesh and a soft light beam
 *  - two rails of glass cards (left and right edge) that keep the centre column clear for content
 *  - every card is a clean leadership / innovation emblem: vision, leadership, innovation, growth,
 *    web solutions, the Innovate → Develop → Deliver workflow, secure & scalable, fast & reliable,
 *    dedicated support, delivery. Only brand words and abstract graphics: no figures are claimed.
 *  - three depth tiers (near / mid / far), real CSS 3D tilt towards the page, scroll parallax by
 *    depth, gentle float and pointer shift. Transforms only; one still frame under reduced motion.
 */

const Card = ({ title, children }) => (
  <div className="cwin">
    <div className="chead"><i />{title}</div>
    <svg viewBox="0 0 120 64" className="cart" fill="none" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  </div>
)

const GOLD = '#2dd4bf'
const SKY = '#a78bfa'

const ITEMS = [
  ['l', 'near', 'm1', (
    <Card title="Vision">
      <circle cx="60" cy="32" r="26" stroke={SKY} strokeWidth="1.4" opacity=".5" />
      <circle cx="60" cy="32" r="17" stroke={GOLD} strokeWidth="1.6" className="a-pulse" />
      <circle cx="60" cy="32" r="8" stroke={GOLD} strokeWidth="1.6" />
      <circle cx="60" cy="32" r="2.5" fill={GOLD} />
      <path d="M60 32 92 8m0 0v11m0-11H81" stroke="#fff" strokeWidth="1.8" />
    </Card>
  )],
  ['l', 'mid', 'm0', (
    <Card title="Innovate · Develop · Deliver">
      <path d="M22 32h38M60 32h38" stroke={GOLD} strokeWidth="1.5" strokeDasharray="3 4" className="a-flow" />
      {[22, 60, 98].map((cx, i) => <circle key={cx} cx={cx} cy="32" r="9" fill="#0d0a1f" stroke={i === 1 ? SKY : GOLD} strokeWidth="1.8" />)}
      <path d="M22 27.5l1.6 3.4 3.7.5-2.7 2.6.7 3.7L22 36l-3.3 1.7.7-3.7-2.7-2.6 3.7-.5z" fill={GOLD} stroke="none" />
      <circle cx="60" cy="32" r="3.2" stroke={SKY} strokeWidth="1.6" />
      <path d="M93.5 32.5l3 3 5.5-6" stroke={GOLD} strokeWidth="1.8" />
    </Card>
  )],
  ['l', 'far', 'm0', (
    <Card title="Growth">
      {[0.3, 0.42, 0.38, 0.58, 0.7, 0.86, 1].map((v, i) => (
        <rect key={i} x={12 + i * 15} y={56 - 40 * v} width="9" height={40 * v} rx="2" fill={GOLD} opacity=".7" className="a-bar" style={{ '--i': i }} />
      ))}
      <path d="M16 42 31 38 46 41 61 29 76 23 91 15 106 8" stroke={SKY} strokeWidth="1.6" />
    </Card>
  )],
  ['l', 'mid', 'm1', (
    <Card title="Web Solutions">
      <circle cx="60" cy="32" r="24" stroke={SKY} strokeWidth="1.5" />
      <path d="M36 32h48M40 21h40M40 43h40" stroke={SKY} strokeWidth="1" opacity=".55" />
      {[0, 1, 2].map((i) => <ellipse key={i} cx="60" cy="32" rx="24" ry="24" stroke={GOLD} strokeWidth="1.2" className="a-globe" style={{ '--i': i }} />)}
    </Card>
  )],
  ['l', 'far', 'm0', (
    <Card title="Dedicated Support">
      <rect x="22" y="12" width="52" height="28" rx="8" stroke={GOLD} strokeWidth="1.7" />
      <path d="M36 40v7l9-7" stroke={GOLD} strokeWidth="1.7" />
      <rect x="58" y="26" width="42" height="24" rx="8" fill="#0d0a1f" stroke={SKY} strokeWidth="1.7" />
      <path d="M68 35h22M68 41h14" stroke={SKY} strokeWidth="1.5" />
    </Card>
  )],
  ['r', 'near', 'm1', (
    <Card title="Leadership">
      <path d="M60 12 28 52M60 12l32 40M28 52h64" stroke={GOLD} strokeWidth="1.3" opacity=".6" />
      {[[60, 12], [28, 52], [92, 52]].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="8" fill="#0d0a1f" stroke={GOLD} strokeWidth="1.8" />
          <circle cx={cx} cy={cy - 2} r="2.6" fill={GOLD} stroke="none" /><path d={`M${cx - 4.6} ${cy + 4.6}a4.6 4 0 0 1 9.2 0`} stroke={GOLD} strokeWidth="1.5" />
        </g>
      ))}
      <circle cx="60" cy="38" r="3" fill={SKY} stroke="none" className="a-pulse" />
    </Card>
  )],
  ['r', 'mid', 'm0', (
    <Card title="Innovation">
      <circle cx="60" cy="32" r="12" stroke={GOLD} strokeWidth="1.8" />
      <g className="a-spin">
        {Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return <path key={i} d={`M${60 + Math.cos(a) * 18} ${32 + Math.sin(a) * 18}L${60 + Math.cos(a) * 25} ${32 + Math.sin(a) * 25}`} stroke={i % 2 ? SKY : GOLD} strokeWidth="1.8" /> })}
      </g>
      <path d="M55 33l3.5 3.5 7-8" stroke="#fff" strokeWidth="1.6" />
    </Card>
  )],
  ['r', 'mid', 'm1', (
    <Card title="Secure & Scalable">
      <path d="M60 8 82 16v15c0 13-9 21-22 25-13-4-22-12-22-25V16z" stroke={GOLD} strokeWidth="1.8" fill="rgba(45,212,191,.07)" />
      <path d="M50 31l7 7 14-14" stroke={SKY} strokeWidth="2" />
    </Card>
  )],
  ['r', 'far', 'm0', (
    <Card title="Delivered">
      <circle cx="60" cy="32" r="22" stroke="#fff" strokeWidth="1.2" opacity=".15" />
      <circle cx="60" cy="32" r="22" stroke={GOLD} strokeWidth="2.4" strokeDasharray="138" className="a-ring" transform="rotate(-90 60 32)" />
      <path d="M50 32l7 7 13-14" stroke="#fff" strokeWidth="2" />
    </Card>
  )],
  ['r', 'far', 'm0', (
    <Card title="Fast & Reliable">
      <path d="M26 50a34 34 0 0 1 68 0" stroke="#fff" strokeWidth="1.2" opacity=".18" />
      <path d="M26 50a34 34 0 0 1 68 0" stroke={GOLD} strokeWidth="2.4" strokeDasharray="107" strokeDashoffset="30" />
      <g className="a-needle"><path d="M60 50 82 28" stroke={SKY} strokeWidth="2" /></g>
      <circle cx="60" cy="50" r="3.4" fill={SKY} stroke="none" />
    </Card>
  )],
]

const TIER = { near: 1, mid: 0.72, far: 0.5 }

export default function FounderBackground() {
  const root = useRef(null)

  useEffect(() => {
    const el = root.current
    const nodes = [...el.querySelectorAll('.rail-item')]
    let cfg = []
    let W = innerWidth
    let H = innerHeight
    let sm = view.y

    const layout = () => {
      W = innerWidth
      H = innerHeight
      cfg = nodes.map((n) => ({ n, lane: n.dataset.lane, z: +n.dataset.z, ph: +n.dataset.ph, w: n.offsetWidth, slot: 0, cnt: 1, live: n.offsetParent !== null }))
      for (const lane of ['l', 'r']) {
        const live = cfg.filter((c) => c.lane === lane && c.live)
        live.forEach((c, i) => { c.slot = i; c.cnt = live.length })
      }
    }
    layout()
    const offR = onRealResize(layout)
    window.addEventListener('load', layout)

    const paint = (t, still) => {
      const s = still ? view.y : sm
      const T = still || reduce ? 0 : t / 1000
      const span = H + 480
      const edge = W >= 1700 ? 40 : W >= 1366 ? -10 : W >= 1100 ? -44 : W >= 760 ? -70 : -60
      const fade = W < 760 ? 0.22 : W < 1100 ? 0.7 : 1
      for (const c of cfg) {
        if (!c.live) continue
        const P = span / c.cnt
        const y0 = c.slot * P - s * (0.34 + 0.5 * c.z)
        const py = ((y0 % span) + span) % span - 260 + Math.sin(T * 0.5 + c.ph) * 7 * c.z
        const px = (c.lane === 'l' ? edge + (c.slot % 2) * 18 : W - c.w - edge - (c.slot % 2) * 18) + Math.cos(T * 0.4 + c.ph) * 5 * c.z - (reduce ? 0 : mouse.nx) * 16 * c.z
        const ry = (c.lane === 'l' ? 18 : -18) + mouse.nx * -3 + Math.sin(s * 0.0015 + c.ph) * 2.5
        const rx = 5 + mouse.ny * -2.5
        sStyle(c.n, 'transform', `translate3d(${px.toFixed(1)}px,${py.toFixed(1)}px,${((c.z - 1) * 260).toFixed(0)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`)
        sStyle(c.n, 'opacity', ((0.2 + 0.46 * c.z * c.z) * fade).toFixed(3))
      }
    }

    paint(0, true)
    const small = !finePointer
    const off = addFrameTask((t) => {
      sm = lerp(sm, view.y, small ? 0.14 : 0.1)
      if (Math.abs(view.y - sm) < 0.05) sm = view.y
      paint(t, false)
    })
    return () => { off(); offR(); window.removeEventListener('load', layout) }
  }, [])

  return (
    <div className="fndbg" ref={root} aria-hidden="true">
      <div className="fnd-mesh" />
      <div className="fnd-beam" />
      {ITEMS.map(([lane, tier, mob, node], i) => (
        <div className="rail-item" key={i} data-lane={lane} data-tier={tier} data-m={mob === 'm1' ? 1 : 0} data-z={TIER[tier]} data-ph={(i * 1.7).toFixed(2)}>
          {node}
        </div>
      ))}
    </div>
  )
}

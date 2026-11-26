import { useEffect, useRef } from 'react'
import { addFrameTask, clamp, lerp, mouse, onRealResize, reduce, sStyle, view } from '../lib/runtime'

/**
 * Page-length backdrop for the Founder & CEO theme.
 *
 * Unlike a fixed wallpaper, this layer is as tall as the whole page and lives in document space, so it
 * scrolls with the content. On top of that native scroll every piece gets its own depth rate
 * (far pieces lag, near pieces lead), which is the parallax. Contents:
 *  - soft violet / teal / rose light fields that breathe (the animated gradient)
 *  - floating 3D leadership / innovation shapes: orbit rings, hex cubes, growth stairs, network, diamonds, dot grids
 *    that turn as you scroll past them
 * Transforms and opacity only, one shared rAF loop, off-screen pieces are skipped. Under reduced motion
 * the layer still scrolls with the page and follows scroll; only the ambient float and breathing stop.
 */

const COLORS = ['124,92,255', '45,212,191', '217,70,239', '79,70,229', '94,234,212', '167,139,250']
const KINDS = ['ring', 'hex', 'stairs', 'net', 'dia', 'dots', 'net', 'ring', 'dia', 'hex', 'dots', 'stairs']
const TIER = [
  { z: 0, k: 0.62, size: 96, a: 0.26 },
  { z: 1, k: 0.86, size: 140, a: 0.36 },
  { z: 2, k: 1.12, size: 190, a: 0.46 },
]
const N_BLOB = 14
const N_SHAPE = 24

const rnd = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }

const Art = ({ kind }) => {
  const p = { viewBox: '0 0 100 100', fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round', vectorEffect: 'non-scaling-stroke' }
  if (kind === 'ring') return (
    <svg {...p}><circle cx="50" cy="50" r="46" /><circle cx="50" cy="50" r="33" strokeDasharray="3 5" /><circle cx="50" cy="50" r="20" /><circle cx="50" cy="4" r="3.4" fill="currentColor" /></svg>
  )
  if (kind === 'hex') return (
    <svg {...p}><path d="M50 4 90 27v46L50 96 10 73V27z" /><path d="M50 28 70 39v22L50 72 30 61V39z" /><path d="M50 4v24M90 27 70 39M90 73 70 61M50 96V72M10 73 30 61M10 27 30 39" opacity=".7" /></svg>
  )
  if (kind === 'stairs') return (
    <svg {...p}><path d="M8 90h22V72h20V54h20V36h22" /><path d="M8 90h22V72h20V54h20V36h22V90z" fill="currentColor" fillOpacity=".08" stroke="none" /><path d="M64 14h24v24M88 14 52 50" /></svg>
  )
  if (kind === 'net') return (
    <svg {...p}><path d="M50 18 18 72h64zM50 18v36M18 72l32-18 32 18" opacity=".7" /><circle cx="50" cy="18" r="7" /><circle cx="18" cy="72" r="7" /><circle cx="82" cy="72" r="7" /><circle cx="50" cy="54" r="4.5" fill="currentColor" /></svg>
  )
  if (kind === 'dia') return (
    <svg {...p}><path d="M50 4 96 50 50 96 4 50z" /><path d="M50 22 78 50 50 78 22 50z" /><path d="M50 40 60 50 50 60 40 50z" fill="currentColor" /></svg>
  )
  return (
    <svg viewBox="0 0 100 100" fill="currentColor">{Array.from({ length: 36 }, (_, i) => <circle key={i} cx={10 + (i % 6) * 16} cy={10 + Math.floor(i / 6) * 16} r={i % 7 === 0 ? 3 : 1.7} opacity={i % 7 === 0 ? 1 : 0.6} />)}</svg>
  )
}

export default function FlowBackdrop() {
  const root = useRef(null)

  useEffect(() => {
    const el = root.current
    const items = [...el.querySelectorAll('.fb-item')].map((n) => ({
      n,
      blob: n.dataset.t === 'b',
      k: +n.dataset.k,
      u: +n.dataset.u, // 0..1 position along the page
      x: +n.dataset.x, // 0..1 across
      sz: +n.dataset.sz, // px (shapes) or vw (blobs)
      ph: +n.dataset.ph,
      z: +n.dataset.z,
      y0: 0,
      px: 0,
      size: 0,
      hid: true,
    }))
    let W = innerWidth
    let H = innerHeight
    let sm = view.y

    const layout = () => {
      W = innerWidth
      H = innerHeight
      const docH = Math.max(el.offsetHeight, H)
      for (const c of items) {
        c.y0 = c.u * docH
        c.size = c.blob ? (c.sz / 100) * W : c.sz * (W < 760 ? 0.62 : 1)
        c.px = c.x * W
        sStyle(c.n, 'width', c.size.toFixed(0) + 'px')
        sStyle(c.n, 'height', c.size.toFixed(0) + 'px')
      }
    }
    layout()
    const offR = onRealResize(layout)
    const ro = new ResizeObserver(layout)
    ro.observe(document.body)
    window.addEventListener('load', layout)

    const paint = (t) => {
      const T = reduce ? 0 : t / 1000
      const mx = reduce ? 0 : mouse.nx
      for (const c of items) {
        const off = (sm + H * 0.5 - c.y0) * (1 - c.k)
        const ay = c.y0 + off - sm // viewport y of the centre
        const out = ay < -c.size || ay > H + c.size
        if (out !== c.hid) { c.hid = out; sStyle(c.n, 'visibility', out ? 'hidden' : 'visible') }
        if (out) continue
        const fl = Math.sin(T * 0.45 + c.ph) * 10 * (0.4 + c.z * 0.3)
        const x = c.px - c.size / 2 - mx * 14 * (c.z + 0.5) + Math.cos(T * 0.35 + c.ph) * 8
        const y = c.y0 + off - c.size / 2 + fl
        if (c.blob) {
          sStyle(c.n, 'transform', `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`)
        } else {
          const d = sm - c.y0
          const ry = d * 0.06 + c.ph * 22
          const rx = 52 + clamp(d * 0.025, -26, 26) + Math.sin(T * 0.4 + c.ph) * 4
          sStyle(c.n, 'transform', `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) perspective(900px) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg) rotateZ(${(d * -0.012 + c.ph * 9).toFixed(1)}deg)`)
        }
      }
    }
    const small = innerWidth < 760
    paint(0)
    const off = addFrameTask((t) => {
      sm = lerp(sm, view.y, small ? 0.16 : 0.12)
      if (Math.abs(view.y - sm) < 0.05) sm = view.y
      paint(t)
    })
    return () => { off(); offR(); ro.disconnect(); window.removeEventListener('load', layout) }
  }, [])

  const blobs = Array.from({ length: N_BLOB }, (_, i) => {
    const tier = TIER[i % 3]
    return {
      u: (i + 0.5) / N_BLOB,
      x: i % 2 ? 0.74 + rnd(i + 3) * 0.2 : 0.06 + rnd(i + 7) * 0.2,
      sz: 58 + rnd(i + 11) * 26,
      k: 0.55 + tier.k * 0.3 + rnd(i) * 0.12,
      col: COLORS[i % COLORS.length],
      a: 0.2 + rnd(i + 5) * 0.12,
      ph: rnd(i + 2) * 6,
    }
  })
  const shapes = Array.from({ length: N_SHAPE }, (_, i) => {
    const tier = TIER[i % 3]
    const left = i % 2 === 0
    return {
      kind: KINDS[i % KINDS.length],
      u: (i + 0.3 + rnd(i + 20) * 0.4) / N_SHAPE,
      x: left ? 0.06 + rnd(i + 1) * 0.28 : 0.66 + rnd(i + 4) * 0.28,
      sz: tier.size * (0.85 + rnd(i + 9) * 0.35),
      k: tier.k,
      z: tier.z,
      a: tier.a,
      col: i % 3 === 0 ? COLORS[1] : i % 3 === 1 ? COLORS[5] : COLORS[0],
      ph: (rnd(i + 30) - 0.5) * 3,
      m: i % 2 ? 0 : 1,
    }
  })

  return (
    <div className="flowbg" ref={root} aria-hidden="true">
      {blobs.map((b, i) => (
        <div className="fb-item fb-blob" key={'b' + i} data-t="b" data-k={b.k.toFixed(3)} data-u={b.u} data-x={b.x.toFixed(3)} data-sz={b.sz.toFixed(1)} data-ph={b.ph.toFixed(2)} data-z="0"
          style={{ '--c': b.col, '--a': b.a.toFixed(2), '--d': `${(9 + (i % 5) * 2.4).toFixed(1)}s` }}><i /></div>
      ))}
      {shapes.map((s, i) => (
        <div className="fb-item fb-shape" key={'s' + i} data-t="s" data-m={s.m} data-k={s.k} data-u={s.u.toFixed(4)} data-x={s.x.toFixed(3)} data-sz={s.sz.toFixed(0)} data-ph={s.ph.toFixed(2)} data-z={s.z}
          style={{ '--c': s.col, '--a': s.a }}><Art kind={s.kind} /></div>
      ))}
    </div>
  )
}

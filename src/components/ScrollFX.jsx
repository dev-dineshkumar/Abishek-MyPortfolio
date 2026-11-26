import { useEffect, useRef } from 'react'
import { addFrameTask, clamp, finePointer, lerp, onRealResize, reduce, sStyle, view } from '../lib/runtime'

/**
 * Scroll-reactive depth layer that sits inside the fixed background.
 *  - a perspective grid floor that "travels" as you scroll
 *  - a few wireframe cubes / rings / diamonds at different depths that parallax and spin with scroll
 *  - soft light pools that glide across the page as you move through the sections
 *  - thin data streams that stretch a little with scroll speed
 * Everything is transform / opacity only, driven from the shared rAF loop, and uses a smoothed
 * scroll value so it eases rather than snaps. With reduced motion it still follows scroll (that is the user own input) but the ambient drift and speed stretch stop.
 */

// [kind, x (0-1 of width), y (0-1 of loop span), depth 0.35-1, size px, spin speed]
const SHAPES = [
  ['cube', 0.08, 0.1, 0.9, 54, 1],
  ['ring', 0.88, 0.22, 0.6, 78, -0.8],
  ['dia', 0.2, 0.46, 0.45, 40, 1.2],
  ['cube', 0.8, 0.58, 1, 64, -1],
  ['ring', 0.12, 0.74, 0.7, 60, 0.9],
  ['dia', 0.92, 0.88, 0.55, 46, -1.1],
  ['cube', 0.5, 0.96, 0.4, 36, 0.8],
]
const STREAMS = [0.06, 0.27, 0.52, 0.71, 0.94]

export default function ScrollFX() {
  const root = useRef(null)

  useEffect(() => {
    const el = root.current
    const small = innerWidth < 760 || !finePointer
    const shapes = [...el.querySelectorAll('.fx-shape')]
    const spins = [...el.querySelectorAll('.fx-spin')]
    const streams = [...el.querySelectorAll('.fx-stream')]
    const grid = el.querySelector('.fx-floor')
    const gridPlane = el.querySelector('.fx-plane')
    const gridTex = el.querySelector('.fx-tex')
    const pools = [...el.querySelectorAll('.fx-pool')]
    let sm = view.y // smoothed scroll
    let vel = 0
    let span = view.h + 360
    let docH = 1

    const measure = () => { span = view.h + 360; docH = Math.max(1, document.documentElement.scrollHeight - view.h) }
    measure()
    const offR = onRealResize(measure)
    window.addEventListener('load', measure)

    const paint = (t, still) => {
      const s = still ? view.y : sm
      const p = clamp(s / docH, 0, 1)
      const T = still || reduce ? 0 : t / 1000

      for (let i = 0; i < shapes.length; i++) {
        const [, , y, z, , spin] = SHAPES[i]
        const y0 = y * span - s * (0.3 + 0.55 * z) // nearer shapes travel faster
        const py = ((y0 % span) + span) % span - 180
        const fade = clamp(1 - Math.abs(py + 180 - span / 2) / (span / 2 + 20), 0, 1) // fade near the loop seam
        const rx = 24 + s * 0.05 * spin + Math.sin(T * 0.4 + i) * 10
        const ry = 30 + s * 0.09 * spin + T * 8 * spin
        const dx = Math.sin(T * 0.3 + i * 1.7) * 14 * z
        sStyle(shapes[i], 'transform', `translate3d(${dx.toFixed(1)}px,${py.toFixed(1)}px,0)`)
        sStyle(spins[i], 'transform', `rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg)`)
        sStyle(shapes[i], 'opacity', (fade * (0.28 + 0.34 * z) * (small ? 0.65 : 1)).toFixed(3))
      }

      // data streams: slide with scroll, stretch with speed
      const stretch = 1 + Math.min(Math.abs(vel) * 0.02, 1.6)
      for (let i = 0; i < streams.length; i++) {
        const k = 0.18 + i * 0.07
        const py = (((i * 0.37 * span - s * k) % span) + span) % span - 200
        sStyle(streams[i], 'transform', `translate3d(0,${py.toFixed(1)}px,0) scaleY(${stretch.toFixed(2)})`)
      }

      // grid floor: tilts a little as you scroll; the texture slides one 72px tile at a time (transform only)
      if (grid) {
        sStyle(gridPlane, 'transform', `rotateX(${(66 + Math.sin(p * Math.PI * 2) * 4).toFixed(2)}deg) translateZ(0)`)
        sStyle(gridTex, 'transform', `translate3d(0,${((s * 0.35 + T * 6) % 72).toFixed(1)}px,0)`)
      }

      // light pools glide across the page, one sweep per pool
      for (let i = 0; i < pools.length; i++) {
        const dir = i % 2 ? -1 : 1
        const x = lerp(-18, 18, p) * dir
        const y = lerp(-14, 14, (p + i * 0.33) % 1)
        sStyle(pools[i], 'transform', `translate3d(${x.toFixed(2)}vw,${y.toFixed(2)}vh,0) scale(${(1 + 0.18 * Math.sin(p * 6 + i * 2)).toFixed(3)})`)
      }
    }

    paint(0, true)
    const off = addFrameTask((t) => {
      const target = view.y
      const prev = sm
      sm = lerp(sm, target, small ? 0.14 : 0.1)
      if (Math.abs(target - sm) < 0.05) sm = target
      vel = reduce ? 0 : lerp(vel, sm - prev, 0.2)
      paint(t, false)
    })
    return () => { off(); offR(); window.removeEventListener('load', measure) }
  }, [])

  const n = typeof window !== 'undefined' && (innerWidth < 760 || !finePointer) ? 4 : SHAPES.length
  return (
    <div className="fx" ref={root} aria-hidden="true">
      <div className="fx-pool a" /><div className="fx-pool b" />
      <div className="fx-floor"><div className="fx-plane"><i className="fx-tex" /></div></div>
      <div className="fx-scene">
        {STREAMS.slice(0, n > 4 ? 5 : 3).map((x) => <i className="fx-stream" key={x} style={{ left: `${x * 100}%` }} />)}
        {SHAPES.slice(0, n).map(([kind, x, , , size], i) => (
          <span className="fx-shape" key={i} style={{ left: `${x * 100}%`, width: size, height: size }}>
            <span className="fx-spin">
              {kind === 'cube' ? ['f', 'b', 'l', 'r', 't', 'u'].map((f) => <b key={f} className={`cf ${f}`} style={{ '--h': `${size / 2}px` }} />)
                : <b className={kind === 'ring' ? 'rg' : 'dm'} />}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

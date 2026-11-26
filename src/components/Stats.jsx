import { useEffect, useRef } from 'react'
import { stats } from '../data/portfolio'
import { addFrameTask, clamp } from '../lib/runtime'
import { useSpotlight } from '../lib/useSpotlight'

/** "At a glance": three glass panels with a count-up and a light that follows the pointer. */
export default function Stats() {
  const grid = useRef(null)
  useSpotlight(grid, '.stat-panel')

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (!e.isIntersecting) return
        io.unobserve(e.target)
        const el = e.target
        const to = +el.dataset.count
        const t0 = performance.now()
        const off = addFrameTask((t) => {
          const p = clamp((t - t0) / 1800, 0, 1)
          el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4)))
          if (p >= 1) off()
        })
      }),
      { threshold: 0.6 },
    )
    grid.current.querySelectorAll('[data-count]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section id="stats" className="sec">
      <p className="stats-title" data-reveal>At a glance</p>
      <div className="stats glass" data-reveal style={{ '--d': '.1s' }} ref={grid}>
        {stats.map((s) => (
          <div className="stat-panel" key={s.label}>
            <div className="stat-light" />
            <div className="stat-fig">
              <span data-count={s.value}>0</span>
              <span className="stat-suffix">{s.suffix}</span>
            </div>
            <div className="stat-line" />
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

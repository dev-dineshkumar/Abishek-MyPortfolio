import { useEffect, useRef } from 'react'
import { promises } from '../data/portfolio'
import { useSpotlight } from '../lib/useSpotlight'

/** The AMDV Solutions promise: four core values in glass cards with a filling meter. */
export default function WhyAmdv() {
  const grid = useRef(null)
  useSpotlight(grid, '.glass-card')

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }),
      { threshold: 0.5 },
    )
    grid.current.querySelectorAll('.meter').forEach((m) => io.observe(m))
    return () => io.disconnect()
  }, [])

  return (
    <section id="promise" className="sec">
      <div className="head">
        <span className="eyebrow">Innovate • Build • Grow Together</span>
        <h2 className="h2" data-reveal>Why AMDV.</h2>
        <div className="bar" />
      </div>
      <div style={{ position: 'relative' }}>
        <div className="red-halo" />
        <div className="skill-grid grid-blur" ref={grid}>
          {promises.map((s, i) => (
            <div className="skill glass glass-card" key={s.title} data-reveal style={{ '--d': `${i * 0.06}s` }}>
              <span className="card-spotlight" />
              <div><h3>{s.title}</h3><small>{s.small}</small></div>
              <span className="lvl glass-chip">{s.chip}</span>
              <span className="meter"><i style={{ '--w': `${s.w}%` }} /></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Animated "company vision" scene that fills the hero banner: Innovate → Develop → Deliver, growth and promises.
// One offscreen canvas is drawn at ~30fps and copied into each glass shard, so the cost stays
// small no matter how many tiles show it. Everything is drawn in a 1775×785 design space.

import { TRACES, pointAt } from './blueprint'

const DW = 1775
const DH = 785
const SANS = '"Geist", ui-sans-serif, system-ui, sans-serif'
const CYCLE = 20 // seconds before the scene restarts

const C = { ty: '#a78bfa', fn: '#5eead4', pu: '#8c98ad' }

const STEPS = ['Innovate', 'Develop', 'Deliver']
const PROMISES = ['Fast & Reliable', 'Secure & Scalable', 'Dedicated Support']
const BARS = [0.22, 0.32, 0.28, 0.46, 0.58, 0.76, 0.94]
// floating geometric accents: [kind, x, y, size, phase, colour]
const GEO = [
  ['dia', 905, 95, 34, 0.0, C.fn], ['ring', 1405, 80, 30, 1.3, C.ty], ['plus', 810, 385, 30, 2.1, C.fn],
  ['dia', 1725, 330, 26, 0.7, C.ty], ['ring', 1010, 725, 28, 1.9, C.fn], ['plus', 1240, 740, 26, 2.8, C.ty], ['dia', 870, 660, 30, 3.4, C.fn],
]
const CHIPS = [
  ['Websites', 860, 215, 0.4], ['CRM', 1610, 205, 1.6], ['ERP', 1660, 420, 2.5], ['E-commerce', 880, 570, 3.1], ['Portfolio', 1160, 650, 0.9],
]

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

export function createCodeScene(W, H, dpr, art, opts = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(W * dpr)
  canvas.height = Math.round(H * dpr)
  const k = canvas.width / DW
  // Phones: the banner is portrait. The backdrop art covers it (right-hand part of the art), and the windows / chips
  // keep their laptop composition, scaled to the banner width and placed under the copy.
  const mob = !!opts.mobile
  const VX = 800 // design-space window shown on phones: x 800..1760, y 60..745
  const VW = 960
  const VB = 745
  const dp = canvas.width / W
  const sArt = H / DH
  const sScn = (W * 0.96) / VW
  const setArt = () => (mob ? x.setTransform(dp * sArt, 0, 0, dp * sArt, -(DW - W / sArt) * dp * sArt, 0) : x.setTransform(k, 0, 0, k, 0, 0))
  const setScene = () => { if (mob) x.setTransform(dp * sScn, 0, 0, dp * sScn, ((W - VW * sScn) / 2 - VX * sScn) * dp, (H - 12 - VB * sScn) * dp) }
  const x = canvas.getContext('2d')
  document.fonts?.load?.(`700 21px ${SANS}`).catch(() => {})

  const box = (a, b, w, h, r) => { x.beginPath(); x.roundRect(a, b, w, h, r) }

  function windowFrame(a, b, w, h, title, alpha, bob) {
    x.save()
    x.globalAlpha = alpha
    x.translate(0, bob)
    x.shadowColor = 'rgba(45,212,191,0.28)'
    x.shadowBlur = 46
    box(a, b, w, h, 18)
    const g = x.createLinearGradient(0, b, 0, b + h)
    g.addColorStop(0, 'rgba(10,15,28,0.96)')
    g.addColorStop(1, 'rgba(9,6,21,0.96)')
    x.fillStyle = g
    x.fill()
    x.shadowBlur = 0
    x.lineWidth = 2
    x.strokeStyle = 'rgba(94,234,212,0.5)'
    x.stroke()
    x.save()
    box(a, b, w, 44, 18)
    x.clip()
    x.fillStyle = 'rgba(255,255,255,0.05)'
    x.fillRect(a, b, w, 44)
    x.restore()
    x.fillStyle = '#5eead4'
    x.beginPath(); x.moveTo(a + 28, b + 14); x.lineTo(a + 36, b + 22); x.lineTo(a + 28, b + 30); x.lineTo(a + 20, b + 22); x.closePath(); x.fill()
    x.font = `700 16px ${SANS}`
    x.fillStyle = '#c9d1e0'
    x.textBaseline = 'middle'
    x.fillText(title, a + 52, b + 23)
    x.restore()
  }

  function draw(t) {
    const tc = t % CYCLE
    const out = 1 - clamp01((tc - (CYCLE - 1)) / 1) // fade everything out for the last second
    setArt()
    x.globalAlpha = 1
    x.shadowBlur = 0
    x.drawImage(art, 0, 0, DW, DH)

    // light pulses travelling along the blueprint circuit traces
    x.globalCompositeOperation = 'lighter'
    for (const tr of TRACES) {
      const col = tr.gold ? '94,234,212' : '130,190,255'
      for (let n = 0; n < 2; n++) {
        const u = (t * tr.speed + tr.phase + n * 0.5) % 1
        const [px, py] = pointAt(tr, u)
        const g = x.createRadialGradient(px, py, 0, px, py, 22)
        g.addColorStop(0, `rgba(${col},${0.9 * out})`)
        g.addColorStop(1, `rgba(${col},0)`)
        x.fillStyle = g
        x.fillRect(px - 22, py - 22, 44, 44)
      }
    }
    x.globalCompositeOperation = 'source-over'
    setScene()

    // floating geometric accents (behind the panels)
    for (const [kind, gx, gy, size, ph, col] of GEO) {
      x.save()
      x.globalAlpha = (0.3 + 0.2 * Math.sin(t * 0.8 + ph)) * out
      x.translate(gx, gy + Math.sin(t * 0.9 + ph) * 12)
      x.rotate(kind === 'dia' ? Math.PI / 4 + t * 0.2 : kind === 'plus' ? t * 0.3 : 0)
      x.strokeStyle = col
      x.lineWidth = 3
      if (kind === 'ring') { x.beginPath(); x.arc(0, 0, size, 0, 7); x.stroke() }
      else if (kind === 'dia') x.strokeRect(-size / 2, -size / 2, size, size)
      else { x.beginPath(); x.moveTo(-size, 0); x.lineTo(size, 0); x.moveTo(0, -size); x.lineTo(0, size); x.stroke() }
      x.restore()
    }

    // ── vision panel: Innovate → Develop → Deliver, then a growth chart ──
    const ex = 885
    const ey = 125
    const bob = Math.sin(t * 0.7) * 5
    const eAlpha = clamp01(tc / 0.6) * out
    windowFrame(ex, ey, 640, 400, 'AMDV Solutions', eAlpha, bob)
    x.save()
    x.translate(0, bob)
    x.globalAlpha = eAlpha
    const ny = ey + 140
    const nx = [ex + 120, ex + 320, ex + 520]
    for (let i = 0; i < 2; i++) {
      const p = clamp01((tc - (1.0 + i * 0.9)) / 0.8)
      const x0 = nx[i] + 46
      const len = nx[i + 1] - nx[i] - 92
      x.strokeStyle = 'rgba(94,234,212,0.35)'
      x.lineWidth = 3
      x.beginPath(); x.moveTo(x0, ny); x.lineTo(x0 + len * p, ny); x.stroke()
      if (p >= 1) {
        const px = x0 + len * ((t * 0.45 + i * 0.5) % 1)
        const g = x.createRadialGradient(px, ny, 0, px, ny, 16)
        g.addColorStop(0, 'rgba(204,251,241,0.95)')
        g.addColorStop(1, 'rgba(94,234,212,0)')
        x.fillStyle = g
        x.fillRect(px - 16, ny - 16, 32, 32)
      }
    }
    STEPS.forEach((label, i) => {
      const pr = clamp01((tc - (0.6 + i * 0.9)) / 0.6)
      if (pr <= 0) return
      const e = 1 - Math.pow(1 - pr, 3)
      x.save()
      x.translate(nx[i], ny)
      x.scale(0.6 + 0.4 * e, 0.6 + 0.4 * e)
      x.globalAlpha = eAlpha * e
      x.beginPath(); x.arc(0, 0, 40, 0, 7)
      x.fillStyle = 'rgba(22,15,46,0.95)'
      x.shadowColor = 'rgba(45,212,191,0.55)'
      x.shadowBlur = 24
      x.fill()
      x.shadowBlur = 0
      x.lineWidth = 2.5
      x.strokeStyle = 'rgba(94,234,212,0.85)'
      x.stroke()
      x.strokeStyle = '#ccfbf1'
      x.fillStyle = '#ccfbf1'
      x.lineWidth = 3.5
      x.lineCap = 'round'
      x.lineJoin = 'round'
      if (i === 0) { // spark
        x.beginPath()
        for (let k = 0; k < 8; k++) { const r = k % 2 ? 6 : 20; const a = (k * Math.PI) / 4 - Math.PI / 2; x.lineTo(Math.cos(a) * r, Math.sin(a) * r) }
        x.closePath(); x.fill()
      } else if (i === 1) { // gear
        x.beginPath(); x.arc(0, 0, 9, 0, 7); x.stroke()
        x.save(); x.rotate(t * 0.6); x.lineWidth = 7; x.setLineDash([5, 6.5]); x.beginPath(); x.arc(0, 0, 18, 0, 7); x.stroke(); x.restore()
      } else { // check
        x.beginPath(); x.moveTo(-14, 1); x.lineTo(-4, 11); x.lineTo(15, -11); x.stroke()
      }
      x.restore()
      x.save()
      x.globalAlpha = eAlpha * e
      x.font = `700 21px ${SANS}`
      x.textAlign = 'center'
      x.textBaseline = 'alphabetic'
      x.fillStyle = '#f3f4f6'
      x.fillText(label, nx[i], ny + 82)
      x.restore()
    })
    // growth chart (abstract: no figures are claimed)
    const cx0 = ex + 50
    const cw = 540
    const cy1 = ey + 372
    const ch = 118
    x.strokeStyle = 'rgba(255,255,255,0.08)'
    x.lineWidth = 1.5
    for (let g = 0; g < 3; g++) { const gy = cy1 - ch * (g / 2); x.beginPath(); x.moveTo(cx0, gy); x.lineTo(cx0 + cw, gy); x.stroke() }
    const bw = 40
    const gap = (cw - BARS.length * bw) / (BARS.length - 1)
    const pts = []
    BARS.forEach((v, i) => {
      const e = 1 - Math.pow(1 - clamp01((tc - (3.2 + i * 0.35)) / 0.7), 3)
      const hgt = ch * v * e * (1 + 0.03 * Math.sin(t * 1.2 + i))
      const bx = cx0 + i * (bw + gap)
      const gr = x.createLinearGradient(0, cy1 - hgt, 0, cy1)
      gr.addColorStop(0, 'rgba(94,234,212,0.85)')
      gr.addColorStop(1, 'rgba(45,212,191,0.12)')
      x.fillStyle = gr
      box(bx, cy1 - hgt - 2, bw, hgt + 2, 6)
      x.fill()
      pts.push([bx + bw / 2, cy1 - hgt - 16])
    })
    const la = clamp01((tc - 3.4) / 1.2)
    if (la > 0) {
      x.globalAlpha = eAlpha * la
      x.beginPath()
      pts.forEach(([px, py], i) => (i ? x.lineTo(px, py) : x.moveTo(px, py)))
      x.strokeStyle = 'rgba(167,139,250,0.9)'
      x.lineWidth = 3.5
      x.lineJoin = 'round'
      x.stroke()
      const [lx, ly] = pts[pts.length - 1]
      const pulse = 14 + 5 * Math.sin(t * 2.4)
      const g = x.createRadialGradient(lx, ly, 0, lx, ly, pulse)
      g.addColorStop(0, 'rgba(221,214,254,0.95)')
      g.addColorStop(1, 'rgba(167,139,250,0)')
      x.fillStyle = g
      x.fillRect(lx - pulse, ly - pulse, pulse * 2, pulse * 2)
    }
    x.restore()

    // ── promise card ──
    const tIn = clamp01((tc - 7.2) / 0.5)
    if (tIn > 0) {
      const tx = 1370
      const ty = 505
      const fl = Math.sin(t * 0.8 + 1) * 5 + (1 - tIn) * 14
      windowFrame(tx, ty + (1 - tIn) * 14, 330, 190, 'Our promise', tIn * out, Math.sin(t * 0.8 + 1) * 5)
      x.save()
      x.translate(0, fl)
      PROMISES.forEach((label, i) => {
        const pr = clamp01((tc - (7.8 + i * 0.9)) / 0.4)
        if (pr <= 0) return
        const py = ty + 92 + i * 38
        x.globalAlpha = pr * out
        x.beginPath(); x.arc(tx + 34, py - 6, 11, 0, 7)
        x.fillStyle = 'rgba(126,231,135,0.16)'; x.fill()
        x.strokeStyle = '#7ee787'; x.lineWidth = 2.5; x.lineCap = 'round'; x.lineJoin = 'round'
        x.beginPath(); x.moveTo(tx + 28, py - 6); x.lineTo(tx + 33, py - 1); x.lineTo(tx + 41, py - 12); x.stroke()
        x.font = `600 19px ${SANS}`
        x.textAlign = 'left'
        x.textBaseline = 'alphabetic'
        x.fillStyle = '#e5e7eb'
        x.fillText(label, tx + 58, py)
      })
      x.restore()
    }

    // ── offering chips (in front) ──
    x.textBaseline = 'middle'
    x.textAlign = 'center'
    for (const [s, cx, cy, ph] of CHIPS) {
      const y = cy + Math.sin(t * 1.0 + ph * 2) * 10
      x.globalAlpha = 0.95 * out
      x.font = `700 20px ${SANS}`
      const w = x.measureText(s).width + 36
      box(cx - w / 2, y - 20, w, 40, 20)
      x.fillStyle = 'rgba(11,8,26,0.85)'
      x.shadowColor = 'rgba(45,212,191,0.5)'
      x.shadowBlur = 18
      x.fill()
      x.shadowBlur = 0
      x.lineWidth = 1.5
      x.strokeStyle = 'rgba(94,234,212,0.6)'
      x.stroke()
      x.fillStyle = '#ccfbf1'
      x.fillText(s, cx, y + 1)
    }
    x.globalAlpha = 1
  }

  return { canvas, draw, ratio: canvas.width / W }
}

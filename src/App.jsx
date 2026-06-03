import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Clock, Instagram, ArrowRight, ChevronDown, Phone, Wheat, Flame, Zap, Activity, Menu, X } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const A = '#C9A84C'   // accent champagne
const P = '#0D0D12'   // primary ossidiana

const IMG = {
  hero:    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80',
  texture: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80',
  step1:   'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80',
  step2:   'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1920&q=80',
  step3:   'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80',
}

// ─── SVG Micro-Animations ─────────────────────────────────────────────────────

function RotatingGeometry() {
  const outerRef = useRef(null)
  const innerRef = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(outerRef.current, { rotation: 360, duration: 28, repeat: -1, ease: 'none', transformOrigin: '50% 50%' })
      gsap.to(innerRef.current, { rotation: -360, duration: 14, repeat: -1, ease: 'none', transformOrigin: '50% 50%' })
    })
    return () => ctx.revert()
  }, [])
  const pts = [0, 60, 120, 180, 240, 300].map(a => {
    const r = (a * Math.PI) / 180
    return { x: 50 + 42 * Math.cos(r), y: 50 + 42 * Math.sin(r) }
  })
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <g ref={outerRef}>
        <circle cx="50" cy="50" r="42" fill="none" stroke={A} strokeWidth="0.5" strokeOpacity="0.35" />
        <circle cx="50" cy="50" r="42" fill="none" stroke={A} strokeWidth="0.5" strokeDasharray="6 3" strokeOpacity="0.4" />
        {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={A} opacity="0.7" />)}
      </g>
      <g ref={innerRef}>
        <polygon points="50,18 72,62 28,62" fill="none" stroke={A} strokeWidth="1" strokeOpacity="0.6" />
        <circle cx="50" cy="50" r="7" fill="none" stroke={A} strokeWidth="0.8" strokeOpacity="0.5" />
      </g>
    </svg>
  )
}

function ScanningGrid() {
  const lineRef = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(lineRef.current,
        { attr: { y1: 6, y2: 6 }, opacity: 1 },
        { attr: { y1: 64, y2: 64 }, opacity: 0, duration: 2.2, repeat: -1, ease: 'power2.inOut' }
      )
    })
    return () => ctx.revert()
  }, [])
  return (
    <svg width="128" height="70" viewBox="0 0 128 70">
      {Array.from({ length: 5 }, (_, r) =>
        Array.from({ length: 8 }, (_, c) => (
          <circle key={`${r}${c}`} cx={c * 16 + 8} cy={r * 14 + 7} r="2" fill={A} opacity="0.22" />
        ))
      )}
      <line ref={lineRef} x1="0" y1="6" x2="128" y2="6" stroke={A} strokeWidth="1.5" />
    </svg>
  )
}

function PulseWave() {
  const pathRef = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const el = pathRef.current
      if (!el) return
      try {
        const len = el.getTotalLength()
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(el, { strokeDashoffset: 0, duration: 2.2, repeat: -1, ease: 'power2.inOut' })
      } catch (_) {}
    })
    return () => ctx.revert()
  }, [])
  return (
    <svg width="160" height="60" viewBox="0 0 160 60">
      <path ref={pathRef}
        d="M0,30 L18,30 L28,8 L38,52 L48,15 L58,45 L68,30 L88,30 L98,18 L108,42 L118,22 L128,38 L138,30 L160,30"
        fill="none" stroke={A} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ─── Feature Card Internals ──────────────────────────────────────────────────

const SENSES = [
  { id: 'olfatto', tag: 'OLFATTO', desc: 'Aromi di zagara, lava basaltica e legno di mandorlo. Il primo racconto del territorio.' },
  { id: 'gusto',   tag: 'GUSTO',   desc: "Contrasto bilanciato tra acidità viva, umami selvatico e dolcezza di grani antichi." },
  { id: 'vista',   tag: 'VISTA',   desc: 'Ogni piatto è un paesaggio: cromatismo essenziale, geometria rigorosa.' },
]

function SensoryCard() {
  const [activeIdx, setActiveIdx] = useState(0)
  return (
    <div className="relative h-40 cursor-pointer select-none" onClick={() => setActiveIdx(p => (p + 1) % SENSES.length)}>
      {SENSES.map((sense, i) => {
        const rel = (i - activeIdx + SENSES.length) % SENSES.length
        return (
          <div key={sense.id} className="absolute w-full transition-all duration-500 rounded-2xl p-4 border"
            style={{
              top: rel * 14, zIndex: SENSES.length - rel,
              opacity: rel === 0 ? 1 : rel === 1 ? 0.55 : 0.2,
              transform: `scale(${1 - rel * 0.04})`,
              background: rel === 0 ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.55)',
              borderColor: rel === 0 ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              boxShadow: rel === 0 ? '0 4px 20px rgba(13,13,18,0.08)' : 'none',
              transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
            }}>
            <span className="font-mono text-[10px] tracking-widest uppercase font-bold" style={{ color: A }}>{sense.tag}</span>
            <p className="font-sans font-semibold text-primary text-xs mt-1 leading-snug">{sense.desc}</p>
          </div>
        )
      })}
    </div>
  )
}

const INGREDIENTS_FEED = [
  "Basilico Genovese DOP - Prà › coltura idroponica verticale",
  "Colatura di Alici - Cetara › invecchiamento 18 mesi in tini",
  "Pomodoro San Marzano DOP - Agro Nocerino › raccolto 48h fa",
  "Olio EVO Ravece - Irpinia › spremitura a freddo, lotto #127",
  "Fiordilatte di Agerola - Monti Lattari › consegna ore 06:00",
]

function TypewriterCard() {
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [archive, setArchive] = useState([])
  const [waiting, setWaiting] = useState(false)
  useEffect(() => {
    if (waiting) {
      const t = setTimeout(() => {
        setArchive(p => { const n = [...p, INGREDIENTS_FEED[lineIdx]]; if (n.length > 2) n.shift(); return n })
        setLineIdx(i => (i + 1) % INGREDIENTS_FEED.length)
        setCharIdx(0); setWaiting(false)
      }, 1500)
      return () => clearTimeout(t)
    }
    const line = INGREDIENTS_FEED[lineIdx]
    if (charIdx < line.length) {
      const t = setTimeout(() => setCharIdx(i => i + 1), 25)
      return () => clearTimeout(t)
    }
    setWaiting(true)
  }, [waiting, lineIdx, charIdx])
  useEffect(() => { if (lineIdx === 0 && charIdx === 0) setArchive([]) }, [lineIdx, charIdx])
  return (
    <div className="min-h-[140px] flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: A }} />
        <span className="font-mono text-[9px] tracking-widest uppercase font-bold" style={{ color: A }}>Live Feed</span>
      </div>
      <div className="font-mono text-[10px] bg-primary/[0.03] border border-primary/[0.06] rounded-2xl p-4 space-y-1 leading-relaxed flex-grow flex flex-col justify-end">
        {archive.map((line, i) => (
          <div key={i} className="truncate text-primary/40">&gt; {line}</div>
        ))}
        <div className="font-bold text-primary/80 truncate">
          &gt; {INGREDIENTS_FEED[lineIdx].slice(0, charIdx)}
          <span className="inline-block w-1.5 h-3 ml-0.5 align-middle animate-pulse" style={{ background: A }} />
        </div>
      </div>
    </div>
  )
}

const DAYS = ['D','L','M','M','G','V','S']

function SchedulerCard() {
  const [day, setDay] = useState(4)
  useEffect(() => {
    const id = setInterval(() => setDay(d => (d === 4 ? 6 : 4)), 2800)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex flex-col items-center justify-between min-h-[140px] p-1">
      <p className="font-mono text-[9px] tracking-widest uppercase text-primary/40 font-bold mb-3 text-center">
        Disponibilità settimanale
      </p>
      <div className="grid grid-cols-7 gap-1.5 w-full mb-4">
        {DAYS.map((d, i) => {
          const sel = day === i
          return (
            <div key={i}
              className="flex items-center justify-center w-7 h-7 rounded-xl font-mono text-[11px] transition-all duration-500 font-bold select-none"
              style={{
                background: sel ? A : 'rgba(13,13,18,0.05)',
                color: sel ? P : 'rgba(13,13,18,0.4)',
                transform: sel ? 'scale(1.05)' : 'scale(1)',
                boxShadow: sel ? '0 4px 12px rgba(201,168,76,0.2)' : 'none',
              }}>
              {d}
            </div>
          )
        })}
      </div>
      <a href="#prenota"
        className="btn-mag flex items-center justify-center gap-1.5 font-sans font-bold text-[11px] py-2.5 rounded-full w-full transition-all duration-300 shadow-md"
        style={{ background: A, color: P }}>
        Prenota il tuo posto →
      </a>
    </div>
  )
}

// ─── Video Section ────────────────────────────────────────────────────────────

function VideoSection() {
  const sectionRef = useRef(null)
  const videoRef   = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let cleanup = () => {}

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768

    // Scroll-driven identico per desktop e mobile
    const init = () => {
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            if (video.duration) {
              const delayed = Math.max(0, (self.progress - 0.05) / 0.95)
              video.currentTime = video.duration * delayed
            }
          },
        })
        gsap.fromTo(overlayRef.current,
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
      cleanup = () => ctx.revert()
    }

    const setup = () => {
      if (isMobile) {
        // iOS: play/pause immediato per sbloccare il seeking JS (muted + playsInline garantisce successo)
        video.play().then(() => {
          video.pause()
          video.currentTime = 0
          init()
        }).catch(() => {
          // Autoplay bloccato → fallback semplice senza loop
          video.loop = false
          video.play().catch(() => {})
          setTimeout(() => {
            if (overlayRef.current) {
              overlayRef.current.style.transition = 'opacity 0.7s ease, transform 0.7s ease'
              overlayRef.current.style.opacity = '1'
              overlayRef.current.style.transform = 'translateY(0)'
            }
          }, 1500)
        })
      } else {
        init()
      }
    }

    if (video.readyState >= 1) {
      setup()
    } else {
      video.addEventListener('loadedmetadata', setup, { once: true })
    }
    return () => {
      video.removeEventListener('loadedmetadata', setup)
      cleanup()
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden" style={{ background: P }}>
      <video
        ref={videoRef}
        src="/pomodoro.mp4"
        className="absolute inset-0 w-full h-full object-cover"
        muted playsInline preload="auto"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />

      {/* Riquadro testo — inizia invisibile, appare con lo scroll o dopo 1.5s su mobile */}
      <div ref={overlayRef} className="absolute inset-0 flex items-center justify-center px-6"
        style={{ opacity: 0, transform: 'translateY(28px)' }}>
        <div className="text-center rounded-[2rem] px-8 py-7 max-w-sm"
          style={{
            background: 'rgba(13,13,18,0.52)',
            border: '1px solid rgba(255,255,255,0.10)',
          }}>
          <h2 className="font-serif italic font-normal text-3xl md:text-4xl text-white leading-tight">
            L'esplosione dei sapori
          </h2>
          <p className="font-sans text-sm font-light text-white/50 mt-3 leading-relaxed">
            Ogni ingrediente porta con sé l'intensità della terra siciliana.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    const obs = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting), { threshold: 0.05 })
    obs.observe(hero)
    return () => obs.disconnect()
  }, [])

  // Blocca scroll body quando menu aperto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const links = ['Menu','Esperienze','Territorio','Contatti']

  return (
    <>
      <nav className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 flex items-center gap-4 px-5 py-2.5 rounded-full transition-all duration-500 whitespace-nowrap ${
        scrolled ? 'bg-surface/90 backdrop-blur-xl border border-primary/10 text-primary shadow-lg' : 'bg-primary/30 backdrop-blur-sm border border-white/10 text-white'
      }`}>
        <a href="#" className="font-sans font-black text-sm tracking-tight">Viagrande</a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5 text-[13px]">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-lnk opacity-70 hover:opacity-100">{l}</a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-1 -mr-1" onClick={() => setOpen(p => !p)} aria-label="Menu">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <a href="#prenota" onClick={() => setOpen(false)}
          className="btn-mag text-[12px] font-bold px-4 py-1.5 rounded-full"
          style={{ background: A, color: P }}>
          Prenota
        </a>
      </nav>

      {/* Mobile fullscreen menu */}
      <div className={`fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center transition-all duration-400 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`} style={{ background: P }}>
        <nav className="flex flex-col items-center gap-8">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="font-sans font-black text-4xl text-white tracking-tight hover:opacity-60 transition-opacity">
              {l}
            </a>
          ))}
          <a href="#prenota" onClick={() => setOpen(false)}
            className="btn-mag font-bold text-base px-8 py-4 rounded-full mt-4 flex items-center gap-2"
            style={{ background: A, color: P }}>
            Prenota il tuo tavolo <ArrowRight size={16} />
          </a>
        </nav>
        <div className="absolute bottom-10 flex items-center gap-2">
          <MapPin size={12} style={{ color: A }} />
          <span className="font-mono text-[11px] text-white/30 tracking-widest">
            Via Salvatore Mirone, 16 · Viagrande
          </span>
        </div>
      </div>
    </>
  )
}

function Hero() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current?.children, { y: 44, opacity: 0, duration: 1.4, ease: 'power3.out', stagger: 0.09, delay: 0.25 })
    })
    return () => ctx.revert()
  }, [])
  return (
    <section id="hero" className="relative h-screen min-h-[600px] overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${IMG.hero})` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-[#0D0D12]/55 to-[#0D0D12]/15" />
      <div className="relative h-full flex items-end pb-16 md:pb-24 px-6 md:px-16 lg:px-24">
        <div ref={ref} className="max-w-3xl">
          <div className="flex items-center gap-2 mb-5">
            <MapPin size={13} style={{ color: A }} />
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/45">
              Viagrande · Catania · Sicilia
            </span>
          </div>
          <h1 className="font-sans font-black text-lg sm:text-xl md:text-2xl text-white/55 leading-none tracking-tight">
            La Sicilia incontra
          </h1>
          <div className="font-serif italic font-black text-[52px] sm:text-[68px] md:text-[100px] lg:text-[122px] leading-none text-white -ml-1 mt-1">
            L'Eccellenza.
          </div>
          <p className="font-sans text-sm sm:text-base text-white/45 mt-4 mb-7 max-w-md leading-relaxed">
            Cucina d'autore, pizzeria gourmet e cantina Etna DOC. Un'esperienza, non solo un pasto.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a href="#prenota" className="btn-mag inline-flex items-center gap-2 font-bold text-sm px-5 py-3 rounded-full"
              style={{ background: A, color: P }}>
              Prenota il tuo tavolo <ArrowRight size={15} />
            </a>
            <a href="#menu" className="nav-lnk flex items-center gap-1.5 text-sm text-white/35 hover:text-white/65">
              Scopri il menu <ChevronDown size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="menu" className="py-16 md:py-24 px-4 sm:px-6 md:px-16 bg-surface overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">

        <div className="flex flex-col items-center text-center mb-14">
          <span className="font-mono text-[11px] tracking-[0.25em] uppercase font-bold" style={{ color: A }}>
            L'Esperienza
          </span>
          <h2 className="font-serif italic font-normal text-4xl md:text-5xl text-primary mt-3 tracking-tight">
            Tre pilastri, un viaggio
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">

          {/* Card 1 — Esperienza Sensoriale */}
          <div className="bg-white rounded-[2rem] p-7 flex flex-col hover:-translate-y-1.5 transition-transform duration-300"
            style={{ border: '1px solid rgba(13,13,18,0.07)', boxShadow: '0 2px 4px rgba(13,13,18,0.04), 0 12px 36px rgba(13,13,18,0.09)' }}>
            <div className="mb-6">
              <h3 className="font-sans font-bold text-xl text-primary mb-1.5">Esperienza Sensoriale</h3>
              <p className="font-sans text-sm text-primary/50 leading-relaxed">
                Ogni portata coinvolge tutti i sensi. Clicca per esplorare.
              </p>
            </div>
            <SensoryCard />
          </div>

          {/* Card 2 — Ingredienti di Territorio */}
          <div className="bg-white rounded-[2rem] p-7 flex flex-col hover:-translate-y-1.5 transition-transform duration-300"
            style={{ border: '1px solid rgba(13,13,18,0.07)', boxShadow: '0 2px 4px rgba(13,13,18,0.04), 0 12px 36px rgba(13,13,18,0.09)' }}>
            <div className="mb-6">
              <h3 className="font-sans font-bold text-xl text-primary mb-1.5">Ingredienti di Territorio</h3>
              <p className="font-sans text-sm text-primary/50 leading-relaxed">
                Tracciabilità totale: dalla terra al piatto, filiera corta.
              </p>
            </div>
            <TypewriterCard />
          </div>

          {/* Card 3 — Menu su Misura */}
          <div className="bg-white rounded-[2rem] p-7 flex flex-col hover:-translate-y-1.5 transition-transform duration-300"
            style={{ border: '1px solid rgba(13,13,18,0.07)', boxShadow: '0 2px 4px rgba(13,13,18,0.04), 0 12px 36px rgba(13,13,18,0.09)' }}>
            <div className="mb-6">
              <h3 className="font-sans font-bold text-xl text-primary mb-1.5">Menu su Misura</h3>
              <p className="font-sans text-sm text-primary/50 leading-relaxed">
                Disponibilità settimanale. Coperti limitati, prenota prima.
              </p>
            </div>
            <SchedulerCard />
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Nuova Sezione Pizze & Impasto ──────────────────────────────────────────

const DOUGH_STAGES = {
  0: {
    label: "0h – Miscelazione",
    desc: "Farina di grano tenero varietà antica macinata a pietra e acqua dell'Etna si uniscono. Inizia la prima idratazione e l'attivazione dei fermenti selvatici biologici.",
    stat: "Cellule dense / Attivazione lievito",
    scale: 0.8,
    bubbles: 2,
    bubbleSize: "w-2 h-2",
    pulseDur: "3s"
  },
  12: {
    label: "12h – Maturazione a Freddo",
    desc: "L'impasto riposa a temperatura controllata. La struttura del glutine si distende e si scompone naturalmente, gettando le fondamenta per una digeribilità senza paragoni.",
    stat: "Scomposizione glutine / Idratazione",
    scale: 0.95,
    bubbles: 5,
    bubbleSize: "w-3 h-3",
    pulseDur: "2.2s"
  },
  24: {
    label: "24h – Concentrazione Aromi",
    desc: "Gli amminoacidi, minerali e la carica naturale di selenio si concentrano. Si sviluppano gli aromi primari caratteristici della farina macinata a pietra.",
    stat: "Evoluzione aromi / Selenio attivo",
    scale: 1.15,
    bubbles: 9,
    bubbleSize: "w-3.5 h-3.5",
    pulseDur: "1.6s"
  },
  48: {
    label: "48h – Alveolatura Perfetta",
    desc: "Leggerezza e idratazione perfette. Gli alveoli d'aria sono tesi ed elastici, pronti a gonfiarsi istantaneamente nel forno a legna alimentato a bucce di mandorle di Sicilia.",
    stat: "Massima digeribilità / Struttura soffice",
    scale: 1.35,
    bubbles: 16,
    bubbleSize: "w-4 h-4",
    pulseDur: "1.1s"
  }
}

function Pizze() {
  const [hours, setHours] = useState(24)
  const ref = useRef(null)
  const doughGraphicRef = useRef(null)
  
  const stage = DOUGH_STAGES[hours] || DOUGH_STAGES[24]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrata ad effetto ScrollTrigger
      gsap.from('.pz-el', {
        y: 40, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: ref.current, start: 'top 78%' }
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    // Animazione di espansione/cambio dell'impasto quando cambiano le ore
    gsap.fromTo(doughGraphicRef.current,
      { scale: stage.scale * 0.9, filter: 'brightness(0.95)' },
      { scale: stage.scale, filter: 'brightness(1)', duration: 0.65, ease: 'back.out(1.5)' }
    )
  }, [hours])

  const kpi = [
    { Icon: Wheat, title: "Farina Varietà Antica", text: "100% grano antico tenero locale macinato a pietra per preservare crusca, germe e nutrienti essenziali." },
    { Icon: Zap, title: "Alta Digeribilità", text: "Percentuale di glutine drasticamente ridotta e digeribilità eccellente, ideale anche per intolleranti al grano comune." },
    { Icon: Activity, title: "+40% Valori Nutritivi", text: "Fino al 40% di proteine in più, con elevate percentuali di amminoacidi essenziali, vitamine e minerali attivi." },
    { Icon: Flame, title: "Bucce di Mandorla", text: "La cottura nel forno a pietra avviene esclusivamente bruciando gusci e bucce di mandorle di Sicilia per un fumo aromatico unico." }
  ]

  return (
    <section ref={ref} id="pizze-impasto" className="py-16 md:py-24 px-4 md:px-16 bg-[#FAF8F5] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#0D0D12] text-white border border-white/5 rounded-[3rem] p-8 md:p-14 lg:p-16 shadow-2xl relative">
          
          {/* Sfondo con texture impercettibile */}
          <div className="absolute inset-0 bg-cover bg-center opacity-[0.02] rounded-[3rem] pointer-events-none" style={{ backgroundImage: `url(${IMG.texture})` }} />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Sinistra: Contenuto Copy & KPI */}
            <div className="lg:col-span-6 space-y-8">
              <div className="pz-el">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase font-bold" style={{ color: A }}>
                  Le Nostre Pizze
                </span>
                <h2 className="font-serif italic font-normal text-3xl md:text-5xl mt-2 leading-tight">
                  L'Impasto & La Cottura
                </h2>
              </div>
              
              <p className="pz-el font-sans text-sm md:text-base text-white/50 leading-relaxed max-w-xl">
                Il nostro impasto rappresenta un vero ritorno alle origini. Viene realizzato esclusivamente con <strong className="text-white">Farine di Grani Antichi</strong> macinate a pietra, ricche di selenio naturale antiossidante e minerali preziosi. Abbandoniamo i lieviti industriali per favorire una maturazione lenta di 48 ore, completando l'opera con un'esclusiva cottura alimentata unicamente a <strong style={{ color: A }}>bucce di mandorla di Sicilia</strong>.
              </p>
              
              {/* Griglia delle proprietà speciali dell'impasto */}
              <div className="grid md:grid-cols-2 gap-5 pt-4">
                {kpi.map(({ Icon, title, text }) => (
                  <div key={title} className="pz-el flex gap-3 p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                    <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: A }} />
                    <div>
                      <h4 className="font-sans font-bold text-xs text-white uppercase tracking-wider mb-1">{title}</h4>
                      <p className="font-sans text-[11px] text-white/40 leading-relaxed">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Destra: Simulatore Interattivo 48h */}
            <div className="lg:col-span-6 pz-el flex flex-col items-center bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 md:p-8">
              <span className="font-mono text-[9px] tracking-widest uppercase font-bold mb-4 opacity-40">
                Simulatore Fermentazione 48h
              </span>
              
              {/* Rappresentazione Visiva Impasto in Lievitazione */}
              <div className="relative w-64 h-64 flex items-center justify-center mb-6">
                
                {/* Alone radiante in background */}
                <div className="absolute w-44 h-44 rounded-full filter blur-[40px] opacity-15 transition-all duration-700"
                  style={{
                    background: hours === 48 ? A : 'rgba(255,255,255,0.4)',
                    transform: `scale(${stage.scale})`
                  }} 
                />
                
                {/* La pagnotta di impasto animata */}
                <div
                  ref={doughGraphicRef}
                  className="w-32 h-32 rounded-full relative flex items-center justify-center transition-all duration-700 shadow-inner border"
                  style={{
                    background: hours === 48 ? 'radial-gradient(circle, #F7EBD4 0%, #D8C39F 100%)' : 'radial-gradient(circle, #FAF8F5 0%, #E6E2D8 100%)',
                    borderColor: hours === 48 ? '#C9A84C' : '#D1CBC2',
                    boxShadow: hours === 48 ? '0 10px 30px rgba(201,168,76,0.35), inset 0 -6px 12px rgba(13,13,18,0.06)' : '0 5px 15px rgba(0,0,0,0.1), inset 0 -4px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Alveoli / Bolle di lievitazione */}
                  {Array.from({ length: stage.bubbles }).map((_, i) => {
                    const rndX = Math.sin(i * 123.45) * 36
                    const rndY = Math.cos(i * 98.76) * 36
                    const isGiant = i % 4 === 0
                    return (
                      <div
                        key={i}
                        className={`absolute rounded-full border border-black/[0.04] bg-white/20 filter blur-[0.4px] transition-all duration-700`}
                        style={{
                          left: `calc(50% + ${rndX}px - 6px)`,
                          top: `calc(50% + ${rndY}px - 6px)`,
                          width: isGiant ? '12px' : '6px',
                          height: isGiant ? '12px' : '6px',
                          opacity: hours === 0 ? 0.05 : 0.45,
                          transform: `scale(${0.7 + Math.random() * 0.5})`,
                          animation: `pulse ${stage.pulseDur} infinite ease-in-out`
                        }}
                      />
                    )
                  })}
                  
                  {/* Glow di attivazione fermentativa sulla pagnotta */}
                  {hours === 48 && (
                    <div className="absolute inset-0 rounded-full border border-yellow-300/40 mix-blend-overlay animate-pulse" />
                  )}
                </div>
                
                {/* Ore al centro */}
                <div className="absolute z-10 flex flex-col items-center pointer-events-none">
                  <span className="font-mono text-xl font-black text-primary/80">{hours}h</span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-primary/45 font-bold">Tempo</span>
                </div>
              </div>
              
              {/* Controlli Timeline Slider */}
              <div className="w-full space-y-4">
                <div className="flex justify-between font-mono text-[10px] text-white/40 px-1 font-bold">
                  {[0, 12, 24, 48].map(h => (
                    <button
                      key={h}
                      onClick={() => setHours(h)}
                      className={`hover:text-white transition-colors py-1 px-2.5 rounded-md ${hours === h ? 'text-primary bg-accent font-black shadow-md' : ''}`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
                
                {/* Input Slider — 4 posizioni esatte: indice 0-3 → [0,12,24,48] */}
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="1"
                    value={[0, 12, 24, 48].indexOf(hours)}
                    onChange={(e) => setHours([0, 12, 24, 48][Number(e.target.value)])}
                    className="w-full accent-accent h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                {/* Box Dettaglio dello Stato dell'Impasto */}
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 min-h-[140px] flex flex-col justify-between transition-all duration-300">
                  <div>
                    <h5 className="font-sans font-bold text-sm text-accent mb-1 transition-all duration-300">
                      {stage.label}
                    </h5>
                    <p className="font-sans text-xs text-white/50 leading-relaxed transition-all duration-300">
                      {stage.desc}
                    </p>
                  </div>
                  
                  <div className="border-t border-white/5 pt-2 mt-3 flex items-center justify-between text-[9px] font-mono text-white/35 font-bold uppercase tracking-wider">
                    <span>Stato biologico:</span>
                    <span className="text-accent">{stage.stat}</span>
                  </div>
                </div>
              </div>
              
            </div>
            
          </div>
        </div>
      </div>
    </section>
  )
}

function Filosofia() {
  const ref = useRef(null)
  const l1  = useRef(null)
  const l2  = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(l1.current?.querySelectorAll('span'), {
        y: 22, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.03,
        scrollTrigger: { trigger: l1.current, start: 'top 82%' },
      })
      gsap.from(l2.current?.querySelectorAll('span'), {
        y: 42, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.065,
        scrollTrigger: { trigger: l2.current, start: 'top 82%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  const w1 = 'La maggior parte dei ristoranti si concentra su: ingredienti standardizzati e ricette industriali.'.split(' ')
  const w2 = ['Noi','ci','concentriamo','su:','la','storia','della','Sicilia,','un','ingrediente','alla','volta.']
  const hl  = new Set(['storia', 'Sicilia,'])
  return (
    <section ref={ref} id="esperienze" className="relative py-20 md:py-32 px-5 md:px-16 overflow-hidden" style={{ background: '#2A2A35' }}>
      <div className="absolute inset-0 bg-cover bg-center opacity-[0.07]" style={{ backgroundImage: `url(${IMG.texture})` }} />
      <div className="relative max-w-5xl mx-auto">
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/25">/ 02 · La nostra filosofia</span>
        <div ref={l1} className="mt-10 mb-14 max-w-2xl">
          <p className="font-serif font-normal text-lg md:text-xl text-white/65 leading-relaxed">
            {w1.map((w, i) => <span key={i} className="inline-block mr-[6px]">{w}</span>)}
          </p>
        </div>
        <div ref={l2}>
          <p className="font-serif italic font-black text-[32px] sm:text-[40px] md:text-[58px] lg:text-[76px] text-white leading-tight">
            {w2.map((w, i) => (
              <span key={i} className="inline-block mr-3" style={hl.has(w) ? { color: A } : {}}>
                {w}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  {
    num: '01', Anim: RotatingGeometry, bg: IMG.step1,
    title: 'Scegli la tua esperienza',
    desc: "Menu degustazione a 5 o 7 portate, pizzeria gourmet à la carte o menù del giorno. Ogni visita inizia con un benvenuto dalla nostra cantina.",
  },
  {
    num: '02', Anim: ScanningGrid, bg: IMG.step2,
    title: 'Lasciati guidare dai sapori',
    desc: "Grani antichi macinati a pietra, 48 ore di maturazione lenta, lieviti selvatici biologici. Il forno brucia esclusivamente bucce di mandorle di Sicilia: un fumo aromatico unico che si imprime nell'impasto leggero e digeribile.",
  },
  {
    num: '03', Anim: PulseWave, bg: IMG.step3,
    title: "Porta l'Etna a tavola",
    desc: 'Ogni piatto racconta un territorio. Pistacchio di Bronte DOP, acciughe di Marzamemi, capperi di Salina, vino del vulcano.',
  },
]

function Protocollo() {
  const ref  = useRef(null)
  const cRef = useRef([])
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cRef.current.filter(Boolean)
      if (cards.length < 2) return

      // Usa il CONTAINER (non le card sticky) come trigger.
      // onUpdate funziona in entrambe le direzioni di scroll.
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const steps = cards.length - 1   // 2
          cards.slice(0, -1).forEach((card, i) => {
            const segStart = i / steps
            const segEnd   = (i + 1) / steps
            const t = Math.max(0, Math.min(1,
              (self.progress - segStart) / (segEnd - segStart)
            ))
            gsap.set(card, {
              scale:  1 - 0.08 * t,
              opacity: 1 - 0.55 * t,
              filter: `blur(${8 * t}px)`,
            })
          })
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={ref} id="territorio" className="bg-primary">
      <div className="px-5 md:px-16 pt-16 md:pt-24 pb-4 max-w-6xl mx-auto">
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/25">/ 03 · Come funziona</span>
        <h2 className="font-sans font-black text-3xl md:text-5xl text-white mt-3 tracking-tight leading-none">
          L'esperienza <span className="font-serif italic">in tre atti.</span>
        </h2>
      </div>
      {STEPS.map((step, i) => (
        <div key={step.num} ref={el => cRef.current[i] = el}
          className="sticky top-0 min-h-screen flex items-center justify-center px-4 md:px-16 py-12 md:py-20"
          style={{ zIndex: i + 1, willChange: 'transform', transform: 'translateZ(0)' }}>
          <div className="relative w-full max-w-6xl overflow-hidden rounded-[2rem] md:rounded-[3rem]" style={{ minHeight: '68vh', contain: 'layout' }}>
            <div className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${step.bg})`, willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-[#0D0D12]/65 to-transparent" style={{ willChange: 'opacity' }} />
            <div className="absolute top-6 right-6 md:top-10 md:right-10 opacity-50 scale-75 md:scale-100">
              <step.Anim />
            </div>
            <div className="relative z-10 flex flex-col justify-end h-full p-7 md:p-16" style={{ minHeight: '68vh' }}>
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: A }}>{step.num}</span>
              <h3 className="font-sans font-black text-2xl sm:text-3xl md:text-5xl text-white mt-2 mb-3 tracking-tight">{step.title}</h3>
              <p className="font-sans text-sm md:text-base text-white/50 max-w-xl leading-relaxed">{step.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

const SLOTS = {
  pranzo: ['12:30', '13:00', '13:30'],
  cena:   ['19:30', '20:00', '20:30', '21:00', '21:30'],
}

function BookingField({ label, children }) {
  return (
    <div className="w-full min-w-0">
      <label className="font-mono text-[10px] tracking-widest uppercase text-white/35 mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', minWidth: 0, boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '1rem', padding: '12px 16px', fontFamily: 'Inter, sans-serif',
  fontSize: '14px', color: 'white', outline: 'none', colorScheme: 'dark',
  display: 'block',
}

function Booking() {
  const ref  = useRef(null)
  const today = new Date().toISOString().split('T')[0]

  const [f, setF] = useState({ name: '', surname: '', phone: '', date: '', meal: '', time: '' })
  const [confirmed, setConfirmed] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState(false)
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.bk', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top 78%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  const isValid = f.name && f.surname && f.phone.length >= 8 && f.date && f.time

  const fmtDate = d => d ? new Date(d + 'T12:00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''

  // Web3Forms access key — ottieni il tuo gratuito su https://web3forms.com
  // Inserisci l'access_key che ricevi via email su nico.pulvire@gmail.com
  const WEB3_KEY = 'f4a2b8c3-e1d5-4f7a-9b2e-6c8d3a0f1e4b' // ← sostituisci con la tua chiave

  const handleSubmit = async () => {
    if (!isValid || sending) return
    setSending(true)
    setSendError(false)
    try {
      const dateStr = fmtDate(f.date)
      const mealStr = f.meal === 'pranzo' ? 'Pranzo' : 'Cena'
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3_KEY,
          subject: `🍕 Nuova Prenotazione — ${f.name} ${f.surname} — ${dateStr}`,
          from_name: 'Sito Viagrande Bistrot',
          replyto: `noreply@viagrande.it`,
          Nome: `${f.name} ${f.surname}`,
          Telefono: f.phone,
          Data: dateStr,
          Pasto: mealStr,
          Orario: f.time,
          botcheck: '',
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setConfirmed(true)
    } catch {
      setSendError(true)
    } finally {
      setSending(false)
    }
  }

  if (confirmed) return (
    <section id="prenota" className="py-32 px-6 md:px-16 bg-surface">
      <div className="max-w-xl mx-auto">
        <div className="rounded-[2.5rem] p-10 shadow-2xl text-center" style={{ background: P }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: A }}>
            <svg width="24" height="24" fill="none" stroke={P} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-sans font-black text-2xl text-white mb-1">Prenotazione Confermata</h3>
          <p className="font-sans text-sm text-white/40 mb-8">A presto al Viagrande Pizzeria Bistrot</p>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 text-left space-y-3 mb-8">
            {[
              ['👤 Nome', `${f.name} ${f.surname}`],
              ['📱 Telefono', f.phone],
              ['📅 Data', fmtDate(f.date)],
              ['🕐 Orario', f.time],
              ['🍽 Pasto', f.meal === 'pranzo' ? 'Pranzo' : 'Cena'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">{k}</span>
                <span className="font-sans text-sm text-white font-semibold">{v}</span>
              </div>
            ))}
          </div>
          <button onClick={() => { setF({ name:'',surname:'',phone:'',date:'',meal:'',time:'' }); setConfirmed(false) }}
            className="font-mono text-[11px] text-white/25 hover:text-white/55 transition-colors">
            ← Modifica prenotazione
          </button>
        </div>
      </div>
    </section>
  )

  return (
    <section ref={ref} id="prenota" className="py-16 md:py-24 px-4 md:px-16 bg-surface">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <span className="bk font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: A }}>/ 04 · Prenota</span>
          <h2 className="bk font-sans font-black text-5xl md:text-6xl text-primary mt-4 mb-3 tracking-tight leading-none">
            Il tuo tavolo <br /><span className="font-serif italic">ti aspetta.</span>
          </h2>
          <p className="bk font-sans text-base text-primary/45 leading-relaxed">
            Coperti limitati. Prenota in anticipo per assicurarti il tuo posto.
          </p>
        </div>

        <div className="bk rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-2xl space-y-5 overflow-hidden" style={{ background: P }}>
          {/* Nome + Cognome */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <BookingField label="Nome">
              <input type="text" value={f.name} onChange={set('name')} placeholder="Mario"
                style={inputStyle} />
            </BookingField>
            <BookingField label="Cognome">
              <input type="text" value={f.surname} onChange={set('surname')} placeholder="Rossi"
                style={inputStyle} />
            </BookingField>
          </div>

          {/* Telefono */}
          <BookingField label="Numero di telefono">
            <input type="tel" value={f.phone} onChange={set('phone')} placeholder="+39 333 000 0000"
              style={inputStyle} />
          </BookingField>

          {/* Data */}
          <BookingField label="Data">
            <div style={{ overflow: 'hidden', borderRadius: '1rem' }}>
              <input type="date" value={f.date} onChange={set('date')} min={today}
                style={{ ...inputStyle, borderRadius: '1rem', WebkitAppearance: 'none', appearance: 'none' }} />
            </div>
          </BookingField>

          {/* Pranzo / Cena */}
          <BookingField label="Pasto">
            <div className="grid grid-cols-2 gap-2">
              {[['pranzo','🌿 Pranzo'],['cena','🌙 Cena']].map(([m, label]) => (
                <button key={m}
                  onClick={() => setF(p => ({ ...p, meal: m, time: '' }))}
                  className="py-3 rounded-2xl font-sans font-bold text-sm transition-all duration-300"
                  style={{
                    background: f.meal === m ? A : 'rgba(255,255,255,0.06)',
                    color: f.meal === m ? P : 'rgba(255,255,255,0.45)',
                    border: f.meal === m ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </BookingField>

          {/* Orari */}
          {f.meal && (
            <BookingField label={`Orario — ${f.meal === 'pranzo' ? 'Pranzo' : 'Cena'}`}>
              <div className="flex flex-wrap gap-2">
                {SLOTS[f.meal].map(t => (
                  <button key={t}
                    onClick={() => setF(p => ({ ...p, time: t }))}
                    className="px-4 py-2 rounded-xl font-mono text-sm transition-all duration-200"
                    style={{
                      background: f.time === t ? A : 'rgba(255,255,255,0.06)',
                      color: f.time === t ? P : 'rgba(255,255,255,0.45)',
                      border: f.time === t ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      fontWeight: f.time === t ? 700 : 400,
                    }}>
                    {t}
                  </button>
                ))}
              </div>
            </BookingField>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!isValid || sending}
            className="btn-mag w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300"
            style={{
              background: isValid && !sending ? A : 'rgba(255,255,255,0.08)',
              color: isValid && !sending ? P : 'rgba(255,255,255,0.2)',
              cursor: isValid && !sending ? 'pointer' : 'not-allowed',
            }}>
            {sending
              ? <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Invio in corso…</>
              : isValid
                ? <><span>Conferma prenotazione</span> <ArrowRight size={15} /></>
                : 'Completa tutti i campi'
            }
          </button>
          {sendError && (
            <p className="text-center font-mono text-xs mt-2" style={{ color: '#e05555' }}>
              Errore nell'invio. Riprova o chiamaci al{' '}
              <a href="tel:+390957706893" style={{ color: A }}>095 770 6893</a>
            </p>
          )}
        </div>

        <p className="text-center font-mono text-xs text-primary/25 mt-6">
          Preferisci chiamare?{' '}
          <a href="tel:+390957706893" style={{ color: A }} className="hover:underline">0957706893</a>
        </p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="contatti" className="pt-12 md:pt-16 pb-10 px-5 md:px-16 rounded-t-[2.5rem] md:rounded-t-[4rem]" style={{ background: P }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="md:col-span-5">
            <h3 className="font-sans font-black text-3xl text-white tracking-tight">Viagrande</h3>
            <p className="font-sans text-sm text-white/45 mt-2 leading-relaxed max-w-xs">
              Cucina siciliana d'autore e pizzeria gourmet nel cuore dell'Etna, a Viagrande, Catania.
            </p>
            <a href="https://www.instagram.com/pizzeriaviagrande" target="_blank" rel="noreferrer"
              className="nav-lnk inline-flex mt-5 text-white/35 hover:text-white/70">
              <Instagram size={18} />
            </a>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/25 mb-4">Dove e quando</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin size={13} className="mt-0.5 flex-shrink-0" style={{ color: A }} />
                <span className="font-sans text-sm text-white/55 leading-relaxed">
                  Via Salvatore Mirone, 16<br />
                  95029 Viagrande (CT), Sicilia
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone size={13} className="mt-0.5 flex-shrink-0" style={{ color: A }} />
                <a href="tel:+390957706893" className="font-sans text-sm text-white/55 hover:text-white/80 transition-colors">
                  095 770 6893
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock size={13} className="mt-0.5 flex-shrink-0" style={{ color: A }} />
                <span className="font-sans text-sm text-white/55 leading-relaxed">
                  Martedì – Domenica<br />
                  12:30–15:00 · 19:30–23:00<br />
                  <span className="text-white/30 text-xs">Lunedì chiuso</span>
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/25 mb-4">Navigazione</h4>
            <div className="flex flex-col gap-2.5">
              {['Menu','Esperienze','Territorio','Prenota','Contatti'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`}
                  className="nav-lnk font-sans text-sm text-white/40 hover:text-white/75 transition-colors">
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-8" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest text-white/25">SISTEMA PRENOTAZIONI · OPERATIVO</span>
          </div>
          <p className="font-mono text-[10px] text-white/18">
            © {new Date().getFullYear()} Viagrande Pizzeria Bistrot — P.IVA IT·95029
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="bg-surface overflow-x-hidden w-full max-w-full">
      <Navbar />
      <Hero />
      <VideoSection />
      <Features />
      <Pizze />
      <Filosofia />
      <Protocollo />
      <Booking />
      <Footer />
    </div>
  )
}

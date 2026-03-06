import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Phone, MapPin, Clock, Star, ChevronRight,
  Menu, X,
} from 'lucide-react';
import logoImg from '../brand_assets/logo.webp';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────

const HOURS = [
  { day: 'Monday',    hours: '9 AM – 7 PM' },
  { day: 'Tuesday',   hours: '9 AM – 7 PM' },
  { day: 'Wednesday', hours: '9 AM – 7 PM' },
  { day: 'Thursday',  hours: '9 AM – 7 PM' },
  { day: 'Friday',    hours: '9 AM – 7 PM' },
  { day: 'Saturday',  hours: '8 AM – 7 PM' },
  { day: 'Sunday',    hours: '9 AM – 2 PM' },
];

const REVIEWS = [
  {
    name: 'Miguel Chang',
    rating: 5,
    text: 'The salon is modern, clean, and beautifully designed. Rachel did a fantastic job — exactly what I wanted. She is so skilled and truly passionate about her work. Beyond happy with the results.',
    service: 'Haircut',
    time: '1 year ago',
  },
  {
    name: 'Sheng Cheng',
    rating: 5,
    text: 'I got a haircut with Rachel during my lunch break and it turned out fantastic. I called to check on walk-ins — Rachel answered and said to just come in. The entire experience was wonderful.',
    service: 'Haircut',
    time: '4 months ago',
  },
  {
    name: 'Jeremy Villar',
    rating: 5,
    text: "I have loved my recent haircuts and have recommended so many people here — best haircuts I've ever had. Fair prices and A1 customer service. I keep coming back.",
    service: 'Haircut',
    time: '3 months ago',
  },
];

const SERVICES = [
  { name: 'Kids Haircut',                 price: 'Starting at $45', featured: false },
  { name: 'Haircut All Fade',             price: 'Starting at $50', featured: false },
  { name: 'Beard Trim',                   price: 'Starting at $40', featured: false },
  { name: 'Haircut & Beard Trim',         price: 'Starting at $60', featured: true  },
  { name: 'Color for Men',                price: 'Starting at $100', featured: false },
  { name: "Women's Haircut",              price: 'Starting at $65', featured: false },
  { name: 'Touchup Color',               price: 'Starting at $115', featured: false },
  { name: 'Permanent Hair Straightening', price: 'Starting at $450', featured: false },
];

// ─────────────────────────────────────────────────────────────
// RIPPLE BUTTON
// ─────────────────────────────────────────────────────────────

function RippleButton({ as: Tag = 'button', children, className = '', rippleColor = 'rgba(255,255,255,0.18)', onMouseEnter: extEnter, onMouseLeave: extLeave, onMouseMove: extMove, ...props }) {
  const ref = useRef(null);
  const [ripple, setRipple] = useState(null);
  const [hovered, setHovered] = useState(false);

  const handleEnter = useCallback((e) => {
    if (!hovered && ref.current) {
      setHovered(true);
      const rect = ref.current.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, size, key: Date.now() });
    }
    extEnter?.(e);
  }, [hovered, extEnter]);

  const handleLeave = useCallback((e) => {
    setHovered(false);
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, size, key: Date.now(), leaving: true });
    }
    extLeave?.(e);
  }, [extLeave]);

  const handleMove = useCallback((e) => {
    if (hovered && ripple && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setRipple(p => ({ ...p, x: e.clientX - rect.left, y: e.clientY - rect.top }));
    }
    extMove?.(e);
  }, [hovered, ripple, extMove]);

  return (
    <Tag
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      <AnimatePresence>
        {ripple && (
          <motion.span
            key={ripple.key}
            className="absolute rounded-full pointer-events-none z-[1]"
            style={{
              background: rippleColor,
              width: ripple.size,
              height: ripple.size,
              left: ripple.x,
              top: ripple.y,
              x: '-50%',
              y: '-50%',
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: ripple.leaving ? 0 : 1, x: '-50%', y: '-50%' }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            onAnimationComplete={() => { if (ripple.leaving) setRipple(null); }}
          />
        )}
      </AnimatePresence>
    </Tag>
  );
}

// ─────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 rounded-full flex items-center gap-6 px-5 py-2.5 ${
        scrolled
          ? 'bg-dark/75 backdrop-blur-xl border border-gold/20 shadow-2xl shadow-black/50'
          : 'bg-transparent'
      }`}
      style={{ width: 'min(920px, 94vw)' }}
    >
      {/* Logo */}
      <button onClick={() => scrollTo('hero')} className="flex items-center gap-2 flex-shrink-0">
        <img src={logoImg} alt="Bear's Barber" className="h-10 w-auto" />
      </button>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-5 ml-auto">
        {[
          { label: 'Prices', id: 'pricing' },
          { label: 'Reviews', id: 'reviews' },
          { label: 'Contact', id: 'contact' },
        ].map(({ label, id }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="font-montserrat text-xs font-medium uppercase tracking-[0.15em] text-cream/70 hover:text-gold transition-all duration-200 hover:-translate-y-px"
          >
            {label}
          </button>
        ))}
        <RippleButton
          as="a"
          href="https://blismo.com/s/bear-s-barber-830836/appointments"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-full bg-gold text-dark font-montserrat text-xs font-bold uppercase tracking-widest"
          rippleColor="rgba(255,255,255,0.22)"
          style={{ transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Book Now
        </RippleButton>
      </div>

      {/* Mobile toggle */}
      <button
        className="md:hidden ml-auto text-cream p-1"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-dark/95 backdrop-blur-xl border border-gold/20 rounded-3xl py-5 px-6 flex flex-col gap-4">
          {[
            { label: 'Services', id: 'services' },
            { label: 'About', id: 'about' },
            { label: 'Reviews', id: 'reviews' },
            { label: 'FAQ', id: 'faq' },
            { label: 'Contact', id: 'contact' },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="font-montserrat text-sm uppercase tracking-widest text-cream/70 hover:text-gold transition-colors text-left"
            >
              {label}
            </button>
          ))}
          <RippleButton
            as="a"
            href="https://blismo.com/s/bear-s-barber-830836/appointments"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 py-3 rounded-2xl bg-gold text-dark font-montserrat text-sm font-bold uppercase tracking-widest"
            rippleColor="rgba(255,255,255,0.22)"
          >
            Book Your Cut
          </RippleButton>
        </div>
      )}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────

function Hero() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-anim',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 1.1, ease: 'power3.out', delay: 0.2 }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-[100dvh] flex items-end overflow-hidden"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&q=80&fit=crop&crop=center)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Layered gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/55 to-dark/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-transparent to-transparent" />

      {/* Content — bottom-left third */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 pb-20 md:pb-28">
        <div className="max-w-2xl">
          <div className="hero-anim mb-3 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-gold" />
            <span className="font-mono text-gold text-xs uppercase tracking-[0.25em]">
              San Mateo, CA · Premium Barbering
            </span>
          </div>

          <h1 className="hero-anim leading-none">
            <span className="font-bebas text-cream block text-7xl md:text-8xl lg:text-[6.5rem] tracking-wide">
              Craftsmanship
            </span>
            <span className="font-bebas text-cream block text-6xl md:text-7xl lg:text-8xl tracking-wide">
              is the
            </span>
          </h1>

          <div className="hero-anim">
            <span className="font-cinzel italic text-gradient-gold block text-5xl md:text-7xl lg:text-8xl leading-tight">
              Standard.
            </span>
          </div>

          <p className="hero-anim font-montserrat text-cream/65 text-base md:text-lg leading-relaxed mt-6 max-w-sm">
            Precision cuts. Affordable luxury. Walk-ins welcome, 7 days a week.
          </p>

          <div className="hero-anim flex flex-wrap gap-4 mt-8">
            <RippleButton
              as="a"
              href="https://blismo.com/s/bear-s-barber-830836/appointments"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-gold text-dark font-montserrat text-sm font-bold uppercase tracking-widest"
              rippleColor="rgba(255,255,255,0.22)"
              style={{ transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Book Your Cut
            </RippleButton>

            <RippleButton
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-full border border-cream/25 text-cream font-montserrat text-sm font-medium uppercase tracking-widest hover:border-gold hover:text-gold transition-all duration-300 hover:-translate-y-px"
              rippleColor="rgba(201,168,76,0.18)"
            >
              View Services <ChevronRight size={15} />
            </RippleButton>
          </div>

          {/* Rating */}
          <div className="hero-anim flex items-center gap-3 mt-8">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="fill-gold text-gold" />
              ))}
            </div>
            <span className="font-mono text-cream/50 text-xs">5.0 · 34 Google reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// FEATURE CARD 1 — Diagnostic Shuffler
// ─────────────────────────────────────────────────────────────

const SHUFFLER_ITEMS = [
  { label: 'Haircut All Fade',  time: '~45 min', price: '$50+',  tag: 'Most Popular' },
  { label: 'Beard Trim',        time: '~15 min', price: '$40+',  tag: 'Add-On'       },
  { label: 'Haircut & Beard',   time: '~60 min', price: '$60+',  tag: 'Best Value'   },
];

function ShufflerCard() {
  const [stack, setStack] = useState(SHUFFLER_ITEMS);

  useEffect(() => {
    const interval = setInterval(() => {
      setStack((prev) => {
        const next = [...prev];
        next.unshift(next.pop());
        return next;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-surface border border-gold/10 rounded-[2rem] p-7 flex flex-col gap-5 h-full min-h-[340px]">
      <div>
        <p className="font-mono text-gold text-[10px] uppercase tracking-[0.2em] mb-1.5">Our Services</p>
        <h3 className="font-bebas text-cream text-3xl tracking-wide leading-none">Precision Cuts</h3>
        <p className="font-montserrat text-cream/40 text-xs mt-1">Every style, mastered.</p>
      </div>
      <div className="relative flex-1" style={{ minHeight: 180 }}>
        {stack.map((item, i) => (
          <div
            key={item.label}
            className="absolute inset-x-0 rounded-2xl border border-gold/15 p-4"
            style={{
              top: `${i * 16}px`,
              zIndex: stack.length - i,
              background: i === 0 ? 'linear-gradient(135deg, #252018, #1C1812)' : '#1C1812',
              transform: `scale(${1 - i * 0.04})`,
              opacity: 1 - i * 0.28,
              transition: 'all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-gold/50 text-[9px] uppercase tracking-widest">{item.tag}</span>
                <p className="font-bebas text-cream text-xl tracking-wide leading-none mt-0.5">{item.label}</p>
                <p className="font-mono text-cream/40 text-xs mt-0.5">{item.time}</p>
              </div>
              {i === 0 && (
                <span className="px-2.5 py-1 rounded-full bg-gold/15 text-gold font-mono text-xs">
                  {item.price}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FEATURE CARD 2 — Telemetry Typewriter
// ─────────────────────────────────────────────────────────────

const FEED_MESSAGES = [
  '> Client in chair...',
  '> Consultation in progress...',
  '> Preferred style confirmed...',
  '> Precision fade applied...',
  '> Line up and edge work...',
  '> Final styling complete...',
  '> ✓ Customer satisfied.',
];

function TypewriterCard() {
  const [lines, setLines] = useState([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (lineIdx >= FEED_MESSAGES.length) {
      const t = setTimeout(() => {
        setLines([]);
        setLineIdx(0);
        setCharIdx(0);
      }, 2200);
      return () => clearTimeout(t);
    }

    const msg = FEED_MESSAGES[lineIdx];
    if (charIdx < msg.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), 38);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, msg]);
        setLineIdx((l) => l + 1);
        setCharIdx(0);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [charIdx, lineIdx]);

  const currentText = lineIdx < FEED_MESSAGES.length ? FEED_MESSAGES[lineIdx].slice(0, charIdx) : '';

  return (
    <div className="bg-surface border border-gold/10 rounded-[2rem] p-7 flex flex-col gap-5 h-full min-h-[340px]">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" />
          <p className="font-mono text-green-400 text-[10px] uppercase tracking-[0.2em]">Live</p>
        </div>
        <h3 className="font-bebas text-cream text-3xl tracking-wide leading-none">Your Experience</h3>
        <p className="font-montserrat text-cream/40 text-xs mt-1">Every visit, personal.</p>
      </div>
      <div className="flex-1 bg-dark/60 rounded-2xl p-4 font-mono text-xs space-y-1.5 overflow-hidden" style={{ minHeight: 160 }}>
        {lines.map((line, i) => (
          <p key={i} className={line.includes('✓') ? 'text-gold' : 'text-cream/55'}>
            {line}
          </p>
        ))}
        {lineIdx < FEED_MESSAGES.length && (
          <p className="text-cream/80">
            {currentText}
            <span className="inline-block w-[5px] h-3 bg-gold ml-0.5 animate-blink" />
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FEATURE CARD 3 — Cursor Scheduler
// ─────────────────────────────────────────────────────────────

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_HOURS  = ['9–2', '9–7', '9–7', '9–7', '9–7', '9–7', '8–7'];

function SchedulerCard() {
  const [activeDay, setActiveDay] = useState(null);
  const [cursorDay, setCursorDay] = useState(null);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      while (!cancelled) {
        await delay(1200);
        const day = Math.floor(Math.random() * 7);
        if (cancelled) break;
        setCursorDay(day);
        await delay(700);
        if (cancelled) break;
        setClicking(true);
        setActiveDay(day);
        await delay(300);
        if (cancelled) break;
        setClicking(false);
        await delay(2000);
        if (cancelled) break;
        setActiveDay(null);
        setCursorDay(null);
        await delay(600);
      }
    };

    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="bg-surface border border-gold/10 rounded-[2rem] p-7 flex flex-col gap-5 h-full min-h-[340px]">
      <div>
        <p className="font-mono text-gold text-[10px] uppercase tracking-[0.2em] mb-1.5">Availability</p>
        <h3 className="font-bebas text-cream text-3xl tracking-wide leading-none">Walk-Ins Welcome</h3>
        <p className="font-montserrat text-cream/40 text-xs mt-1">Open 7 days a week.</p>
      </div>
      <div className="flex-1 space-y-3">
        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {DAYS_SHORT.map((d, i) => (
            <button
              key={d}
              onClick={() => setActiveDay(activeDay === i ? null : i)}
              className={`rounded-xl py-2 flex flex-col items-center gap-1 transition-all duration-300 ${
                activeDay === i
                  ? 'bg-gold/20 ring-1 ring-gold'
                  : cursorDay === i
                  ? 'bg-gold/10 ring-1 ring-gold/40'
                  : 'bg-dark/50 hover:bg-dark/80'
              } ${clicking && cursorDay === i ? 'scale-95' : 'scale-100'}`}
            >
              <span className="font-mono text-cream/50 text-[9px]">{d}</span>
              <span className={`w-1 h-1 rounded-full ${i === 0 ? 'bg-yellow-500/70' : 'bg-green-400/60'}`} />
            </button>
          ))}
        </div>

        {/* Hours display */}
        <div className="bg-dark/60 rounded-2xl p-4">
          <p className="font-mono text-cream/30 text-[9px] uppercase tracking-widest mb-2">Hours</p>
          {activeDay !== null ? (
            <p className="font-montserrat text-sm">
              <span className="text-gold">{DAYS_SHORT[activeDay]}: </span>
              <span className="text-cream">{DAY_HOURS[activeDay]} PM</span>
            </p>
          ) : (
            <div className="space-y-1">
              {['Mon – Fri · 9 AM – 7 PM', 'Saturday · 8 AM – 7 PM', 'Sunday · 9 AM – 2 PM'].map((h) => (
                <p key={h} className="font-montserrat text-cream/50 text-xs">{h}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FEATURES SECTION
// ─────────────────────────────────────────────────────────────

function Features() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.feat-card',
        { y: 70, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.15,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <p className="font-mono text-gold text-[10px] uppercase tracking-[0.25em] mb-3">What We Offer</p>
          <h2 className="font-bebas text-cream text-5xl md:text-6xl lg:text-7xl tracking-wide">
            Built for Every Cut
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="feat-card"><ShufflerCard /></div>
          <div className="feat-card"><TypewriterCard /></div>
          <div className="feat-card"><SchedulerCard /></div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// PHILOSOPHY
// ─────────────────────────────────────────────────────────────

const PHILO_NEUTRAL = 'Most barbershops focus on getting you in and out.'.split(' ');
const PHILO_BOLD    = ['We', 'focus', 'on:', 'the', 'art', 'of', 'the', 'cut.'];

function Philosophy() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pw',
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.05,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-36 px-6 overflow-hidden"
      style={{ background: '#0A0806' }}
    >
      {/* Parallax texture */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1920&q=60&fit=crop&crop=center)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%) contrast(1.2)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0806] via-transparent to-[#0A0806]" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 mb-14">
          <span className="w-6 h-px bg-gold/50" />
          <p className="font-mono text-gold/50 text-[10px] uppercase tracking-[0.25em]">Our Philosophy</p>
        </div>

        <p className="font-montserrat text-cream/35 text-xl md:text-2xl leading-relaxed mb-10">
          {PHILO_NEUTRAL.map((w, i) => (
            <span key={i} className="pw inline-block mr-[0.3em]">{w}</span>
          ))}
        </p>

        <p className="font-cinzel text-3xl md:text-5xl lg:text-[3.5rem] text-cream leading-[1.2]">
          {PHILO_BOLD.map((w, i) => (
            <span
              key={i}
              className={`pw inline-block mr-3 md:mr-4 ${
                w === 'art' ? 'italic text-gradient-gold' : ''
              }`}
            >
              {w}
            </span>
          ))}
        </p>

        {/* Identity badges */}
        <div className="flex flex-wrap gap-3 mt-16">
          {['LGBTQ+ Friendly', 'Women-Owned', 'Asian-Owned'].map((badge) => (
            <span
              key={badge}
              className="px-4 py-2 rounded-full border border-gold/25 text-gold/60 font-mono text-[10px] uppercase tracking-[0.15em]"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// PROTOCOL — Sticky Stacking Cards
// ─────────────────────────────────────────────────────────────

// SVG 1: Rotating barber pole rings
function BarberPoleAnim() {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20" aria-hidden="true">
      <circle cx="50" cy="50" r="42" stroke="#C9A84C" strokeWidth="1.5" fill="none" opacity="0.15" />
      <circle
        cx="50" cy="50" r="42"
        stroke="#C9A84C" strokeWidth="2" fill="none"
        strokeDasharray="264" strokeDashoffset="88"
        className="animate-spin-slow"
        style={{ transformOrigin: '50px 50px' }}
      />
      <circle cx="50" cy="50" r="28" stroke="#C9A84C" strokeWidth="1" fill="none" opacity="0.2" />
      <circle
        cx="50" cy="50" r="28"
        stroke="#EED05C" strokeWidth="1.5" fill="none"
        strokeDasharray="176" strokeDashoffset="44"
        style={{
          animation: 'spin-slow 6s linear infinite reverse',
          transformOrigin: '50px 50px',
        }}
      />
      <circle cx="50" cy="50" r="8" fill="#C9A84C" opacity="0.7" />
      <line x1="50" y1="10" x2="50" y2="90" stroke="#C9A84C" strokeWidth="0.8" opacity="0.2" />
      <line x1="10" y1="50" x2="90" y2="50" stroke="#C9A84C" strokeWidth="0.8" opacity="0.2" />
    </svg>
  );
}

// SVG 2: Scanning laser line over grid
function ScanningAnim() {
  return (
    <div className="relative w-48 h-14 overflow-hidden rounded-xl bg-dark/60 mx-auto border border-gold/10">
      <div className="grid grid-cols-8 grid-rows-3 gap-0.5 p-1.5 h-full">
        {[...Array(24)].map((_, i) => (
          <div key={i} className="rounded-sm bg-gold/15" />
        ))}
      </div>
      <div
        className="absolute top-0 bottom-0 w-px bg-gold shadow-[0_0_6px_2px_#C9A84C80] animate-scan"
        style={{ left: '0' }}
      />
    </div>
  );
}

// SVG 3: EKG waveform
function WaveformAnim() {
  return (
    <svg viewBox="0 0 260 60" className="w-56 h-14 mx-auto" aria-hidden="true">
      <path
        d="M0,30 L30,30 L40,5 L50,55 L60,5 L70,30 L100,30 L110,18 L120,42 L130,18 L140,30 L170,30 L180,8 L190,52 L200,8 L210,30 L260,30"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="700"
        className="animate-waveform"
      />
      <path
        d="M0,30 L30,30 L40,5 L50,55 L60,5 L70,30 L100,30 L110,18 L120,42 L130,18 L140,30 L170,30 L180,8 L190,52 L200,8 L210,30 L260,30"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="1"
        opacity="0.2"
      />
    </svg>
  );
}

const STEPS = [
  {
    num: '01',
    title: 'Walk Right In',
    desc: 'No appointment needed. Our doors are open 7 days a week — just come as you are. Rachel and the team are always ready.',
    Anim: BarberPoleAnim,
    bg: 'from-[#1A1510] to-[#0D0B08]',
  },
  {
    num: '02',
    title: 'Your Consultation',
    desc: 'Every cut starts with a conversation. We take the time to understand exactly the look you want before we ever pick up the scissors.',
    Anim: ScanningAnim,
    bg: 'from-[#17130A] to-[#0D0B08]',
  },
  {
    num: '03',
    title: 'Leave Looking Sharp',
    desc: 'Walk out with a precision cut at prices that are hard to beat for the quality. Leave feeling like royalty — and come back anytime.',
    Anim: WaveformAnim,
    bg: 'from-[#12100A] to-[#0D0B08]',
  },
];

function Protocol() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.proto-card');

      cards.forEach((card, i) => {
        if (i < cards.length - 1) {
          gsap.to(card, {
            scale: 0.91,
            opacity: 0.45,
            scrollTrigger: {
              trigger: cards[i + 1],
              start: 'top 85%',
              end: 'top top',
              scrub: 1,
            },
          });
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef}>
      {STEPS.map(({ num, title, desc, Anim, bg }, i) => (
        <div
          key={num}
          className={`proto-card sticky top-0 h-[100dvh] flex items-center justify-center bg-gradient-to-b ${bg} overflow-hidden`}
          style={{ zIndex: i + 1 }}
        >
          {/* Subtle radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 60%, #C9A84C08, transparent)',
            }}
          />
          <div className="relative z-10 max-w-xl mx-auto px-8 text-center">
            <p className="font-mono text-gold/40 text-xs tracking-[0.25em] mb-6">{num} / 03</p>
            <div className="mb-8 flex justify-center">
              <Anim />
            </div>
            <h3 className="font-bebas text-cream text-5xl md:text-6xl tracking-wide mb-4">{title}</h3>
            <p className="font-montserrat text-cream/55 text-base md:text-lg leading-relaxed max-w-sm mx-auto">
              {desc}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// SERVICES / PRICING
// ─────────────────────────────────────────────────────────────

function ServicesPricing() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.svc-card',
        { y: 55, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.15,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" ref={sectionRef} className="py-32 px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <p className="font-mono text-gold text-[10px] uppercase tracking-[0.25em] mb-3">Pricing</p>
          <h2 className="font-bebas text-cream text-5xl md:text-6xl lg:text-7xl tracking-wide">
            Fair Prices. Premium Cuts.
          </h2>
          <p className="font-montserrat text-cream/45 text-sm mt-3 max-w-sm">
            Quality that's hard to beat, at prices that prove it.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((svc) => (
            <div
              key={svc.name}
              className={`svc-card rounded-[2rem] p-7 flex flex-col justify-between gap-6 transition-all duration-300 ${
                svc.featured
                  ? 'bg-gold shadow-2xl shadow-gold/25 lg:scale-[1.04]'
                  : 'bg-dark border border-gold/12'
              }`}
            >
              <div className="flex-1">
                {svc.featured && (
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-dark/55 mb-2">★ Most Popular</p>
                )}
                <h3 className={`font-bebas text-3xl tracking-wide leading-tight ${svc.featured ? 'text-dark' : 'text-cream'}`}>
                  {svc.name}
                </h3>
                <p className={`font-montserrat text-sm font-semibold mt-2 ${svc.featured ? 'text-dark/70' : 'text-gold'}`}>
                  {svc.price}
                </p>
              </div>

              <RippleButton
                as="a"
                href="https://blismo.com/s/bear-s-barber-830836/appointments"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 rounded-2xl font-montserrat font-bold text-xs uppercase tracking-widest transition-all duration-300 ${
                  svc.featured
                    ? 'bg-dark text-gold hover:bg-dark/80'
                    : 'bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20'
                }`}
                rippleColor={svc.featured ? 'rgba(201,168,76,0.25)' : 'rgba(201,168,76,0.18)'}
                style={{ transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Book Now
              </RippleButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────────────────────

function Reviews() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.rev-card',
        { y: 45, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.15,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="reviews" ref={sectionRef} className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <p className="font-mono text-gold text-[10px] uppercase tracking-[0.25em] mb-3">Google Reviews</p>
          <div className="flex flex-wrap items-baseline gap-4">
            <h2 className="font-bebas text-cream text-5xl md:text-6xl lg:text-7xl tracking-wide">5.0 Stars</h2>
            <div className="flex gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="fill-gold text-gold" />
              ))}
            </div>
          </div>
          <p className="font-mono text-cream/35 text-xs mt-1">34 verified Google reviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="rev-card bg-surface border border-gold/10 rounded-[2rem] p-8 flex flex-col gap-4"
            >
              <div className="flex gap-0.5">
                {[...Array(r.rating)].map((_, j) => (
                  <Star key={j} size={13} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="font-montserrat text-cream/65 text-sm leading-relaxed flex-1">
                "{r.text}"
              </p>
              <div className="pt-4 border-t border-gold/10">
                <p className="font-bebas text-cream text-lg tracking-wide">{r.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-gold/50 text-[10px] uppercase tracking-widest">{r.service}</span>
                  <span className="font-mono text-cream/25 text-[10px]">{r.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'Is Bear\'s Barber the best barbershop in San Mateo?',
    a: 'Bear\'s Barber is one of San Mateo\'s highest-rated barbershops, holding a perfect 5.0 stars on Google across 34 reviews. Located at 120 South Blvd in San Mateo, CA, our team — led by owner Rachel — delivers precision haircuts and beard trims in a modern, clean, and welcoming environment. Customers consistently call it the best haircut they\'ve ever had, and our prices are hard to beat for the quality.',
  },
  {
    q: 'Does Bear\'s Barber accept walk-ins in San Mateo?',
    a: 'Yes — walk-ins are always welcome at Bear\'s Barber. No appointment needed. We\'re open 7 days a week at 120 South Blvd, San Mateo: Monday through Friday 9 AM–7 PM, Saturday 8 AM–7 PM, and Sunday 9 AM–2 PM. Just come in whenever works for you — no booking required.',
  },
  {
    q: 'How much does a haircut cost at Bear\'s Barber?',
    a: 'Haircuts at Bear\'s Barber typically range from $30–$40 for a classic cut, and $40–$50 for a haircut plus beard trim. Our pricing reflects a commitment to making premium-quality barbering accessible — reviews frequently mention that the price-to-quality ratio is exceptional compared to other barbershops in the San Mateo area.',
  },
  {
    q: 'How long does a haircut take?',
    a: 'Most haircuts at Bear\'s Barber take about 30 to 45 minutes depending on the style. More detailed services like a haircut and beard trim or a fade may take a bit longer. Walk-ins are always welcome and we move efficiently so you\'re never waiting long.',
  },
  {
    q: 'Is there a barber open on weekends near San Mateo?',
    a: 'Yes — Bear\'s Barber is open every weekend. We\'re open Saturdays from 8 AM to 7 PM and Sundays from 9 AM to 2 PM at 120 South Blvd, San Mateo, CA 94402. No appointment necessary on weekends or any day of the week. Give us a call at (650) 302-5070 if you have any questions before stopping in.',
  },
];

function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-item',
        { y: 35, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const toggle = (i) => setOpenIdx((prev) => (prev === i ? null : i));

  return (
    <section id="faq" ref={sectionRef} className="py-32 px-6 bg-surface">
      <div className="max-w-3xl mx-auto">
        <div className="mb-14">
          <p className="font-mono text-gold text-[10px] uppercase tracking-[0.25em] mb-3">FAQ</p>
          <h2 className="font-bebas text-cream text-5xl md:text-6xl lg:text-7xl tracking-wide">
            Common Questions
          </h2>
          <p className="font-montserrat text-cream/45 text-sm mt-3">
            Everything you need to know about Bear's Barber in San Mateo.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className="faq-item bg-dark border border-gold/10 rounded-[1.5rem] overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="font-montserrat text-cream text-sm font-semibold leading-snug group-hover:text-gold transition-colors duration-200">
                    {faq.q}
                  </span>
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full border border-gold/25 flex items-center justify-center transition-all duration-300"
                    style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  >
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <line x1="5.5" y1="0" x2="5.5" y2="11" stroke="#C9A84C" strokeWidth="1.5" />
                      <line x1="0" y1="5.5" x2="11" y2="5.5" stroke="#C9A84C" strokeWidth="1.5" />
                    </svg>
                  </span>
                </button>

                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{ maxHeight: isOpen ? '300px' : '0px' }}
                >
                  <p className="font-montserrat text-cream/60 text-sm leading-relaxed px-7 pb-6">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────

function Footer() {
  const today = new Date().getDay(); // 0=Sun

  return (
    <footer id="contact" className="bg-[#080605] rounded-t-[4rem] pt-20 pb-10 px-8">
      <div className="max-w-7xl mx-auto">

        {/* Google Maps embed */}
        <div className="mb-16 rounded-[2rem] overflow-hidden border border-gold/10" style={{ height: 320 }}>
          <iframe
            title="Bear's Barber location — 120 South Blvd, San Mateo, CA"
            src="https://maps.google.com/maps?q=120+South+Blvd,+San+Mateo,+CA+94402&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.6) brightness(0.85)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-5">
            <img src={logoImg} alt="Bear's Barber" className="h-24 w-auto mb-6" />
            <p className="font-montserrat text-cream/45 text-sm leading-relaxed max-w-xs">
              Premium barbering in the heart of San Mateo. Walk-ins always welcome. Rachel and the team are ready for you.
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              {['LGBTQ+ Friendly', 'Women-Owned', 'Asian-Owned'].map((b) => (
                <span
                  key={b}
                  className="px-3 py-1.5 rounded-full border border-gold/20 text-gold/45 font-mono text-[9px] uppercase tracking-widest"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div className="md:col-span-4">
            <p className="font-bebas text-cream text-2xl tracking-wide mb-5">Hours</p>
            <div className="space-y-2">
              {HOURS.map((h, i) => (
                <div key={h.day} className="flex items-center justify-between">
                  <span className={`font-montserrat text-xs ${i === today ? 'text-gold font-semibold' : 'text-cream/45'}`}>
                    {h.day}
                    {i === today && <span className="ml-2 text-[9px] tracking-widest text-gold/70">(Today)</span>}
                  </span>
                  <span className={`font-mono text-xs ${i === today ? 'text-gold' : 'text-cream/35'}`}>
                    {h.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <p className="font-bebas text-cream text-2xl tracking-wide mb-5">Contact</p>
            <div className="space-y-5">
              <a
                href="tel:6503025070"
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Phone size={13} className="text-gold" />
                </div>
                <span className="font-montserrat text-cream/55 text-sm group-hover:text-cream transition-colors">
                  (650) 302-5070
                </span>
              </a>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={13} className="text-gold" />
                </div>
                <address className="font-montserrat text-cream/55 text-sm not-italic leading-relaxed">
                  120 South Blvd<br />
                  San Mateo, CA 94402
                </address>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                  <Clock size={13} className="text-gold" />
                </div>
                <span className="font-montserrat text-cream/55 text-sm">Walk-ins welcome</span>
              </div>
              <a
                href="https://www.instagram.com/bearsbarberca/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group mt-2"
              >
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="#C9A84C"/>
                  </svg>
                </div>
                <span className="font-montserrat text-cream/55 text-sm group-hover:text-cream transition-colors">
                  @bearsbarberca
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gold/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-cream/25 text-[10px]">
            © {new Date().getFullYear()} Bear's Barber · San Mateo, CA · All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" />
            <span className="font-mono text-cream/25 text-[10px] uppercase tracking-[0.2em]">
              System Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────────────

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// ─────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="bg-dark text-cream overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Philosophy />
      <Protocol />
      <ServicesPricing />
      <Reviews />
      <FAQ />
      <Footer />
    </div>
  );
}

import { useState, useEffect, useRef } from "react";

/* ─── COLOR PALETTE — Fresh White/Light Theme ───────────────────────── */
const C = {
  // Backgrounds — white-dominant
  bg:      "#FFFFFF",
  bgOff:   "#F8FAFF",
  bgCard:  "#FFFFFF",
  bgMid:   "#F1F5FF",
  // Dark navy for hero/footer sections
  dark:    "#0F172A",
  darkMid: "#1E293B",
  darkLt:  "#334155",
  // Accent — vivid indigo
  accent:  "#4F46E5",
  accentLt:"#6366F1",
  accentXl:"#818CF8",
  // Secondary teal
  teal:    "#0EA5E9",
  tealLt:  "#38BDF8",
  // Gold
  gold:    "#F59E0B",
  goldLt:  "#FCD34D",
  // Text
  txt:     "#0F172A",
  txtMid:  "#334155",
  txtSub:  "#64748B",
  txtMute: "#94A3B8",
  // Borders
  bdr:     "#E2E8F0",
  bdrMid:  "#CBD5E1",
  white:   "#FFFFFF",
};

/* ─── GLOBAL CSS ─────────────────────────────────────────────────────── */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
  body{font-family:'Inter',sans-serif;background:#fff;color:#0F172A;overflow-x:hidden;-webkit-font-smoothing:antialiased}
  a{text-decoration:none;color:inherit}
  button{font-family:'Inter',sans-serif;cursor:pointer;border:none;outline:none;background:none}
  img{max-width:100%;display:block}
  input,select,textarea{font-family:'Inter',sans-serif}
  ::-webkit-scrollbar{width:5px}
  ::-webkit-scrollbar-track{background:#f1f5f9}
  ::-webkit-scrollbar-thumb{background:#4F46E5;border-radius:3px}

  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

  .reveal{opacity:0;transform:translateY(32px);transition:opacity .6s ease,transform .6s ease}
  .reveal.vis{opacity:1;transform:translateY(0)}
  .rl{opacity:0;transform:translateX(-32px);transition:opacity .6s ease,transform .6s ease}
  .rl.vis{opacity:1;transform:translateX(0)}
  .rr{opacity:0;transform:translateX(32px);transition:opacity .6s ease,transform .6s ease}
  .rr.vis{opacity:1;transform:translateX(0)}
  .lift{transition:transform .25s ease,box-shadow .25s ease}
  .lift:hover{transform:translateY(-6px);box-shadow:0 20px 48px rgba(79,70,229,.14)}
  .float{animation:floatY 3.5s ease-in-out infinite}

  /* ── RESPONSIVE GRID SYSTEM ── */
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:32px}
  .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
  .g4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
  .g5{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}
  .gf4{display:grid;grid-template-columns:2fr 1fr 1fr 1.4fr;gap:40px}

  @media(max-width:1024px){
    .g4{grid-template-columns:repeat(2,1fr)!important}
    .g5{grid-template-columns:repeat(3,1fr)!important}
    .gf4{grid-template-columns:1fr 1fr!important}
  }
  @media(max-width:768px){
    .g2{grid-template-columns:1fr!important;gap:24px!important}
    .g3{grid-template-columns:1fr!important;gap:16px!important}
    .g4{grid-template-columns:1fr 1fr!important;gap:14px!important}
    .g5{grid-template-columns:1fr 1fr!important;gap:12px!important}
    .gf4{grid-template-columns:1fr!important;gap:28px!important}
    .hide-mob{display:none!important}
    .nav-links{display:none!important}
    .sec{padding:60px 20px!important}
  }
  @media(max-width:480px){
    .g4{grid-template-columns:1fr!important}
    .g5{grid-template-columns:1fr 1fr!important}
    .hero-btns{flex-direction:column!important;align-items:stretch!important}
    .hero-btns a,.hero-btns button{justify-content:center!important;width:100%!important}
    .stats-row{grid-template-columns:1fr 1fr!important}
  }
`;

/* ─── HELPERS ────────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("vis"); }),
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    );
    document.querySelectorAll(".reveal,.rl,.rr").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useCounter(target, dur = 2000, go = false) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!go) return;
    let s;
    const f = t => { if (!s) s = t; const p = Math.min((t - s) / dur, 1); setN(Math.floor(p * target)); if (p < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }, [go, target, dur]);
  return n;
}

const goto = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

/* Star rating renderer — supports half stars */
function Stars({ rating }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map(i => {
        const full = rating >= i;
        const half = !full && rating >= i - 0.5;
        return (
          <svg key={i} width="16" height="16" viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`sg${i}${Math.round(rating*10)}`}>
                <stop offset={half ? "50%" : full ? "100%" : "0%"} stopColor={C.gold} />
                <stop offset={half ? "50%" : full ? "100%" : "0%"} stopColor="#E2E8F0" />
              </linearGradient>
            </defs>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              fill={full ? C.gold : half ? `url(#sg${i}${Math.round(rating*10)})` : "#E2E8F0"}
              stroke={full || half ? C.gold : "#CBD5E1"} strokeWidth="1" />
          </svg>
        );
      })}
    </div>
  );
}

/* Buttons */
function PBtn({ children, onClick, href, style }) {
  const b = {
    display: "inline-flex", alignItems: "center", gap: "8px",
    padding: "13px 26px", borderRadius: "10px", fontWeight: 600, fontSize: "15px",
    background: `linear-gradient(135deg,${C.accent},${C.accentLt})`,
    color: "#fff", boxShadow: `0 4px 18px ${C.accent}40`,
    transition: "all .22s", cursor: "pointer", border: "none", ...style
  };
  const hov = e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 10px 28px ${C.accent}50`; };
  const lv = e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `0 4px 18px ${C.accent}40`; };
  if (href) return <a href={href} style={b} target="_blank" rel="noreferrer" onMouseEnter={hov} onMouseLeave={lv}>{children}</a>;
  return <button style={b} onClick={onClick} onMouseEnter={hov} onMouseLeave={lv}>{children}</button>;
}

function OBtn({ children, onClick, dark = false, style }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        padding: "13px 26px", borderRadius: "10px", fontWeight: 600, fontSize: "15px",
        background: hov ? (dark ? "rgba(255,255,255,.1)" : `${C.accent}08`) : "transparent",
        color: dark ? "#fff" : C.accent,
        border: `1.5px solid ${dark ? "rgba(255,255,255,.3)" : C.accent}`,
        transition: "all .22s", cursor: "pointer", ...style
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >{children}</button>
  );
}

/* Section heading */
function SH({ badge, title, sub, dark = false, center = true }) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: "48px" }}>
      {badge && <span style={{
        display: "inline-block", fontSize: "11px", fontWeight: 700, letterSpacing: ".1em",
        textTransform: "uppercase", padding: "5px 14px", borderRadius: "100px",
        background: dark ? "rgba(255,255,255,.1)" : `${C.accent}10`,
        color: dark ? "rgba(255,255,255,.85)" : C.accentLt,
        border: `1px solid ${dark ? "rgba(255,255,255,.2)" : C.accent + "30"}`,
        marginBottom: "14px"
      }}>{badge}</span>}
      <h2 style={{
        fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
        fontSize: "clamp(1.7rem,3.5vw,2.6rem)",
        color: dark ? "#fff" : C.txt, lineHeight: 1.15, marginBottom: "14px"
      }}>{title}</h2>
      {sub && <p style={{ color: dark ? "rgba(255,255,255,.6)" : C.txtSub, fontSize: "1.05rem", maxWidth: "560px", margin: center ? "0 auto" : "0", lineHeight: 1.75 }}>{sub}</p>}
    </div>
  );
}

/* SVG Icons */
const Ico = ({ n, s = 20, c = "currentColor" }) => {
  const paths = {
    globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    shop:  <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></>,
    lay:   <><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></>,
    edit:  <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    set:   <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    srch:  <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    shld:  <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    phn:   <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.55 5.55l.93-.93a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 15.91z"/></>,
    mail:  <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    map:   <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    star:  <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    chk:   <><polyline points="20 6 9 17 4 12"/></>,
    arr:   <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    hrt:   <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></>,
    zap:   <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    mon:   <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
    bag:   <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
    bld:   <><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22V12h6v10"/></>,
    trk:   <><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
    li:    <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>,
    tw:    <><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></>,
    fb:    <><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></>,
    wa:    <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></>,
    men:   <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    cls:   <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    qt:    <><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></>,
    cod:   <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
    cof:   <><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></>,
    fac:   <><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16z"/></>,
    grad:  <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>,
    pls:   <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    home:  <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    ext:   <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
    img:   <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[n]}
    </svg>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["Home","About","Services","Portfolio","Industries","Contact"];
  const nav = (id) => { goto(id); setOpen(false); };
  return (
    <>
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:1000,
        background: scrolled ? "rgba(255,255,255,.97)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        boxShadow: scrolled ? "0 1px 24px rgba(15,23,42,.08)" : "none",
        padding: scrolled ? "12px clamp(16px,5vw,40px)" : "20px clamp(16px,5vw,40px)",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        transition:"all .3s ease",
      }}>
        {/* Logo */}
        <div onClick={() => nav("home")} style={{ display:"flex",alignItems:"center",gap:"10px",cursor:"pointer" }}>
          <img src="./assets/logo.jpeg" alt="New Binary Solutions Logo"
            style={{ width:42,height:42,borderRadius:"10px",objectFit:"cover",border:`1px solid ${C.bdr}` }}
            onError={e => { e.currentTarget.style.display="none"; e.currentTarget.nextSibling.style.display="flex"; }}
          />
          <div style={{ display:"none",width:42,height:42,borderRadius:"10px",background:`linear-gradient(135deg,#E8251F,#1E90FF)`,alignItems:"center",justifyContent:"center" }}>
            <span style={{ color:"#fff",fontWeight:900,fontSize:"15px" }}>NB</span>
          </div>
          <div>
            <div style={{ color: scrolled ? C.txt : "#fff", fontWeight:700,fontSize:"15px",lineHeight:1,transition:"color .3s" }}>New Binary</div>
            <div style={{ color:C.accent,fontSize:"10px",fontWeight:700,letterSpacing:".07em" }}>SOLUTIONS</div>
          </div>
        </div>
        {/* Desktop links */}
        <div className="nav-links" style={{ display:"flex",gap:"28px",alignItems:"center" }}>
          {links.map(l => (
            <button key={l} onClick={() => nav(l.toLowerCase())} style={{
              color: scrolled ? C.txtSub : "rgba(255,255,255,.8)",
              fontSize:"14px",fontWeight:500,transition:"color .2s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = scrolled ? C.accent : "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = scrolled ? C.txtSub : "rgba(255,255,255,.8)"}
            >{l}</button>
          ))}
          <PBtn onClick={() => nav("contact")} style={{ padding:"10px 20px",fontSize:"13px" }}>Free Quote</PBtn>
        </div>
        {/* Hamburger */}
        <button onClick={() => setOpen(!open)} style={{ display:"flex",padding:"6px",color: scrolled ? C.txt : "#fff" }}>
          <Ico n={open ? "cls" : "men"} s={26} c={scrolled ? C.txt : "#fff"} />
        </button>
      </nav>
      {/* Mobile menu */}
      {open && (
        <div style={{ position:"fixed",inset:0,zIndex:999,background:"#fff",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"24px" }}>
          <button onClick={() => setOpen(false)} style={{ position:"absolute",top:20,right:20 }}>
            <Ico n="cls" s={28} c={C.txt} />
          </button>
          <img src="./assets/logo.jpeg" alt="logo" style={{ width:64,height:64,borderRadius:"14px",objectFit:"cover",marginBottom:"8px" }}
            onError={e => e.currentTarget.style.display = "none"} />
          {links.map(l => (
            <button key={l} onClick={() => nav(l.toLowerCase())} style={{ color:C.txt,fontSize:"22px",fontWeight:700 }}>{l}</button>
          ))}
          <PBtn onClick={() => nav("contact")}>Get Free Quote</PBtn>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   HERO — Dark section
══════════════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section id="home" style={{
      minHeight:"100vh",position:"relative",
      background:`linear-gradient(145deg,${C.dark} 0%,#1a1040 55%,#0f1f3d 100%)`,
      display:"flex",alignItems:"center",overflow:"hidden",
    }}>
      {/* Grid overlay */}
      <div style={{ position:"absolute",inset:0,backgroundImage:`linear-gradient(${C.accent}08 1px,transparent 1px),linear-gradient(90deg,${C.accent}08 1px,transparent 1px)`,backgroundSize:"52px 52px" }} />
      {/* Glow orbs */}
      <div style={{ position:"absolute",top:"-5%",right:"-5%",width:"clamp(300px,50vw,700px)",height:"clamp(300px,50vw,700px)",borderRadius:"50%",background:`radial-gradient(circle,${C.accentLt}16 0%,transparent 65%)`,pointerEvents:"none" }} />
      <div style={{ position:"absolute",bottom:"-10%",left:"-5%",width:"clamp(200px,40vw,500px)",height:"clamp(200px,40vw,500px)",borderRadius:"50%",background:`radial-gradient(circle,${C.teal}0e 0%,transparent 65%)`,pointerEvents:"none" }} />

      <div style={{ maxWidth:"1200px",margin:"0 auto",padding:"clamp(90px,15vw,130px) clamp(20px,5vw,40px) 80px",width:"100%",position:"relative",zIndex:1 }}>
        <div className="g2" style={{ alignItems:"center" }}>
          {/* Left */}
          <div>
            <div style={{ animation:"fadeUp .6s ease both" }}>
              <span style={{ display:"inline-flex",alignItems:"center",gap:"8px",fontSize:"11px",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",padding:"5px 14px",borderRadius:"100px",background:`${C.accentLt}18`,color:C.accentXl,border:`1px solid ${C.accentLt}30` }}>
                <span style={{ width:6,height:6,borderRadius:"50%",background:"#4ADE80",display:"inline-block",animation:"pulse 1.6s ease-in-out infinite" }} />
                Web Design & Development · Kolhapur
              </span>
            </div>
            <h1 style={{
              fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,
              fontSize:"clamp(2rem,5vw,3.5rem)",lineHeight:1.1,color:"#fff",
              margin:"18px 0 18px",
              animation:"fadeUp .7s .1s ease both",opacity:0,animationFillMode:"forwards",
            }}>
              Professional Websites That Help{" "}
              <span style={{ backgroundImage:`linear-gradient(135deg,${C.accentXl},${C.tealLt},${C.goldLt})`,backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",animation:"gradShift 4s ease infinite" }}>
                Businesses Grow
              </span>
            </h1>
            <p style={{ color:"rgba(255,255,255,.65)",fontSize:"clamp(.95rem,2vw,1.1rem)",lineHeight:1.8,maxWidth:"500px",marginBottom:"36px",animation:"fadeUp .7s .2s ease both",opacity:0,animationFillMode:"forwards" }}>
              We design modern, responsive, and conversion-focused websites that help businesses build credibility and generate more customers.
            </p>
            <div className="hero-btns" style={{ display:"flex",gap:"14px",flexWrap:"wrap",animation:"fadeUp .7s .3s ease both",opacity:0,animationFillMode:"forwards" }}>
              <PBtn onClick={() => goto("portfolio")} style={{ fontSize:"15px",padding:"14px 28px" }}>
                <Ico n="mon" s={18} c="#fff" /> View Our Work
              </PBtn>
              <OBtn onClick={() => goto("contact")} dark style={{ fontSize:"15px",padding:"14px 28px" }}>
                <Ico n="phn" s={18} c="#fff" /> Free Consultation
              </OBtn>
            </div>
            {/* Stats */}
            <div className="stats-row" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"20px",marginTop:"52px",animation:"fadeUp .7s .4s ease both",opacity:0,animationFillMode:"forwards" }}>
              {[["50+","Projects"],["30+","Clients"],["24/7","Support"],["10+","Industries"]].map(([n,l]) => (
                <div key={l} style={{ borderRight:`1px solid rgba(255,255,255,.1)`,paddingRight:"16px" }}>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:"clamp(1.4rem,3vw,2rem)",color:"#fff",lineHeight:1 }}>{n}</div>
                  <div style={{ color:"rgba(255,255,255,.45)",fontSize:"11px",marginTop:"4px",letterSpacing:".05em",textTransform:"uppercase" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Right — floating visual */}
          <div className="hide-mob" style={{ display:"flex",justifyContent:"center",alignItems:"center",animation:"fadeIn 1s .5s ease both",opacity:0,animationFillMode:"forwards" }}>
            <div style={{ position:"relative",width:"380px",height:"400px" }}>
              <div style={{ position:"absolute",inset:0,borderRadius:"50%",border:`1.5px dashed ${C.accentLt}20`,animation:"spin 25s linear infinite" }} />
              <div style={{ position:"absolute",inset:"24px",borderRadius:"50%",border:`1px dashed ${C.teal}15`,animation:"spin 18s linear infinite reverse" }} />
              <div className="float" style={{ position:"absolute",inset:"48px",borderRadius:"50%",background:`linear-gradient(145deg,rgba(255,255,255,.06),rgba(255,255,255,.02))`,border:`1px solid rgba(255,255,255,.1)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:`0 30px 80px rgba(0,0,0,.4),0 0 60px ${C.accent}20` }}>
                <img src="./assets/logo.jpeg" alt="NBS Logo" style={{ width:100,height:100,borderRadius:"50%",objectFit:"cover",border:`3px solid ${C.accentLt}40` }}
                  onError={e => { e.currentTarget.style.display="none"; e.currentTarget.nextSibling.style.display="flex"; }} />
                <div style={{ display:"none",width:90,height:90,borderRadius:"50%",background:"linear-gradient(135deg,#E8251F,#1E90FF)",alignItems:"center",justifyContent:"center" }}>
                  <span style={{ color:"#fff",fontWeight:900,fontSize:"26px" }}>NB</span>
                </div>
                <div style={{ color:"#fff",fontWeight:700,fontSize:"13px",marginTop:"12px" }}>New Binary Solutions</div>
                <div style={{ color:"rgba(255,255,255,.45)",fontSize:"11px",marginTop:"3px" }}>Kolhapur, Maharashtra</div>
              </div>
              {[
                { t:"React.js",top:"8%",left:"0%",n:"cod" },
                { t:"Node.js",bottom:"10%",right:"0%",n:"zap" },
                { t:"UI/UX",top:"8%",right:"2%",n:"edit" },
                { t:"SEO",bottom:"8%",left:"3%",n:"srch" },
              ].map(({ t,n,...pos }) => (
                <div key={t} style={{ position:"absolute",...pos,background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",borderRadius:"100px",padding:"7px 14px",display:"flex",alignItems:"center",gap:"6px",color:"#fff",fontSize:"12px",fontWeight:600,backdropFilter:"blur(10px)" }}>
                  <Ico n={n} s={13} c={C.accentXl} />{t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Scroll hint */}
      <div style={{ position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:"5px",animation:"fadeIn 1.2s 1.2s ease both",opacity:0,animationFillMode:"forwards" }}>
        <div style={{ width:1,height:32,background:`linear-gradient(${C.accentXl},transparent)`,animation:"pulse 1.8s ease-in-out infinite" }} />
        <span style={{ color:"rgba(255,255,255,.2)",fontSize:"10px",letterSpacing:".1em" }}>SCROLL</span>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ABOUT — White section
══════════════════════════════════════════════════════════════════════ */
function StatCard({ target, suffix="", label }) {
  const ref = useRef(); const [go, setGo] = useState(false);
  const n = useCounter(target, 2000, go);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setGo(true); obs.disconnect(); } }, { threshold: .5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ textAlign:"center",padding:"28px 16px",background:C.bg,borderRadius:"16px",border:`1px solid ${C.bdr}`,boxShadow:"0 2px 12px rgba(15,23,42,.05)" }}>
      <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:"clamp(1.8rem,4vw,2.4rem)",lineHeight:1,background:`linear-gradient(135deg,${C.accent},${C.teal})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
        {n}{suffix}
      </div>
      <div style={{ color:C.txtSub,fontSize:"12px",marginTop:"8px",letterSpacing:".04em",fontWeight:500 }}>{label}</div>
    </div>
  );
}

function About() {
  useReveal();
  return (
    <section id="about" style={{ padding:"clamp(60px,10vw,100px) clamp(20px,5vw,40px)",background:C.bgOff }} className="sec">
      <div style={{ maxWidth:"1200px",margin:"0 auto" }}>
        <div className="g2" style={{ alignItems:"center",marginBottom:"56px" }}>
          {/* Left */}
          <div className="rl">
            <SH badge="About Us" title={<>Kolhapur's Trusted Partner for <span style={{ color:C.accent }}>Digital Growth</span></>} center={false} />
            <p style={{ color:C.txtMid,lineHeight:1.85,marginBottom:"16px",fontSize:"15px" }}>
              Founded in Kolhapur, Maharashtra, <strong style={{ color:C.txt }}>New Binary Solutions</strong> is led by <strong style={{ color:C.txt }}>Mr. Vishwajeet Khot</strong> and co-founded by <strong style={{ color:C.txt }}>Mr. Deshbhushan Chougule</strong>. We craft high-performance websites that drive real business results.
            </p>
            <p style={{ color:C.txtMid,lineHeight:1.85,fontSize:"15px",marginBottom:"28px" }}>
              Our approach: understand your business deeply, design with purpose, build with precision. Every website we create is a strategic asset — fast, secure, mobile-ready, and built to convert visitors into customers.
            </p>
            <div className="g2" style={{ gap:"14px" }}>
              {[
                { n:"star",t:"Our Mission",d:"Deliver technology that creates real-world business impact for every client." },
                { n:"zap",t:"Our Vision",d:"Be the most trusted IT partner for businesses across India." },
              ].map(({ n,t,d }) => (
                <div key={t} style={{ background:C.bg,borderRadius:"14px",padding:"18px",border:`1px solid ${C.bdr}` }}>
                  <div style={{ width:36,height:36,borderRadius:"10px",background:`${C.accent}10`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"10px" }}>
                    <Ico n={n} s={18} c={C.accent} />
                  </div>
                  <div style={{ color:C.txt,fontWeight:700,fontSize:"13px",marginBottom:"5px" }}>{t}</div>
                  <p style={{ color:C.txtSub,fontSize:"12.5px",lineHeight:1.6 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Right */}
          <div className="rr">
            <h3 style={{ color:C.txt,fontWeight:700,fontSize:"18px",marginBottom:"18px" }}>Why businesses choose us</h3>
            {[
              ["Custom Design","Every website designed from scratch — no templates."],
              ["Mobile-First","100% responsive across all devices and screen sizes."],
              ["SEO Built-In","Optimized for search engines from day one."],
              ["Fast Delivery","Most projects delivered within 2–4 weeks."],
              ["Secure & Reliable","SSL, security headers, and regular updates included."],
              ["Long-term Support","Your digital partner — available post-launch always."],
            ].map(([title, desc]) => (
              <div key={title} style={{ display:"flex",gap:"12px",padding:"13px 15px",borderRadius:"10px",background:C.bg,border:`1px solid ${C.bdr}`,marginBottom:"10px",alignItems:"flex-start" }}>
                <div style={{ width:30,height:30,borderRadius:"8px",background:`${C.accent}10`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:"1px" }}>
                  <Ico n="chk" s={14} c={C.accent} />
                </div>
                <div>
                  <div style={{ color:C.txt,fontWeight:600,fontSize:"14px" }}>{title}</div>
                  <div style={{ color:C.txtSub,fontSize:"12.5px",marginTop:"2px" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Stats */}
        <div className="g4 reveal">
          <StatCard target={50} suffix="+" label="Projects Completed" />
          <StatCard target={30} suffix="+" label="Happy Clients" />
          <StatCard target={24} suffix="/7" label="Support Available" />
          <StatCard target={10} suffix="+" label="Industries Served" />
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SERVICES
══════════════════════════════════════════════════════════════════════ */
const SVCS = [
  { n:"globe",t:"Business Websites",d:"Professional, conversion-focused websites for local businesses and SMBs that build credibility and generate enquiries." },
  { n:"bld",t:"Corporate Websites",d:"Enterprise-grade web presence for large organizations with departments, product lines, and multiple stakeholders." },
  { n:"shop",t:"E-Commerce Websites",d:"Fully functional online stores with product management, Razorpay payment gateway, and a smooth mobile shopping experience." },
  { n:"lay",t:"Landing Pages",d:"High-converting, single-purpose pages designed to capture leads and drive specific marketing campaign goals." },
  { n:"edit",t:"Website Redesign",d:"Transform your outdated website into a modern, fast, and user-friendly platform that reflects your brand." },
  { n:"set",t:"Website Maintenance",d:"Regular updates, security patches, performance optimization, and content changes to keep your site running perfectly." },
  { n:"srch",t:"SEO Ready Websites",d:"Built with clean code, fast load times, and proper structure that search engines love — from day one." },
  { n:"mon",t:"Web Applications",d:"Custom web apps — dashboards, booking systems, management tools — built to your exact specifications." },
];
const SC = [C.accent,C.teal,"#F59E0B","#EC4899","#8B5CF6",C.accentLt,"#10B981","#F97316"];

function Services() {
  useReveal();
  return (
    <section id="services" style={{ padding:"clamp(60px,10vw,100px) clamp(20px,5vw,40px)",background:C.bg }} className="sec">
      <div style={{ maxWidth:"1200px",margin:"0 auto" }}>
        <div className="reveal"><SH badge="Our Services" title="Everything Your Business Needs Online" sub="From design to development to ongoing support — we handle the complete digital lifecycle of your website." /></div>
        <div className="g4">
          {SVCS.map((s,i) => (
            <div key={s.t} className="lift reveal" style={{ transitionDelay:`${i*.06}s`,background:C.bg,borderRadius:"16px",padding:"26px 22px",border:`1px solid ${C.bdr}`,position:"relative",overflow:"hidden",boxShadow:"0 2px 12px rgba(15,23,42,.05)" }}>
              <div style={{ position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,${SC[i]},${SC[i]}60)` }} />
              <div style={{ width:46,height:46,borderRadius:"12px",background:`${SC[i]}12`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"14px",border:`1px solid ${SC[i]}20` }}>
                <Ico n={s.n} s={21} c={SC[i]} />
              </div>
              <h3 style={{ fontWeight:700,fontSize:"15px",color:C.txt,marginBottom:"9px" }}>{s.t}</h3>
              <p style={{ color:C.txtSub,fontSize:"13px",lineHeight:1.7,marginBottom:"18px" }}>{s.d}</p>
              <button onClick={() => goto("contact")} style={{ display:"inline-flex",alignItems:"center",gap:"5px",color:SC[i],fontSize:"13px",fontWeight:600,transition:"gap .2s" }}
                onMouseEnter={e => e.currentTarget.style.gap="9px"}
                onMouseLeave={e => e.currentTarget.style.gap="5px"}
              >Learn More <Ico n="arr" s={13} c={SC[i]} /></button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PORTFOLIO — Real Projects with actual screenshots
══════════════════════════════════════════════════════════════════════ */
const PROJ = [
  {
    img:"./assets/screenshotpant.png",
    name:"Shri Pant Krupa Paper Board",
    industry:"Manufacturing",
    desc:"A professional website for a Kolhapur-based kraft paper and board manufacturer. Features product catalogue, company profile, SEO optimization, and enquiry form targeting packaging industries across India.",
    tech:["HTML5","CSS3","JavaScript","SEO"],
    url:"https://www.shripantkrupapaperboard.com/",
    color:C.gold,
  },
  {
  img: "./assets/screenshotdrl.png",
  name: "DRL Kolhapur",
  industry: "Logistics & Transportation",
  desc: "A custom business management application developed for Deshbhushan and Rushikesh Roadlines to simplify daily transport operations. Features trip management, vehicle records, customer management, billing, and an intuitive dashboard for efficient business workflows.",
  tech: ["Flutter", "Firebase", "Business Management", "Dashboard"],
  url: "",
  color: C.teal,
  },
  {
    img:"./assets/screenshotsc.png",
    name:"SC Global Exports & Imports",
    industry:"International Trade",
    desc:"A polished website for an international export-import business serving 50+ countries. Features product listings, buyer trust elements, global contact integration, and professional UX design.",
    tech:["React","Node.js","Responsive","SEO"],
    url:"https://www.scglobalexports.com/",
    color:C.teal,
  },
  {
    img:"./assets/screenshotbinary.png",
    name:"New Binary Solutions",
    industry:"IT Services",
    desc:"Our own agency website — showcasing software products, services, and team. Demonstrates our capability in clean UI design, mobile responsiveness, and professional brand positioning.",
    tech:["React","Vite","CSS3","Netlify"],
    url:"https://newbinarysolutions.netlify.app/",
    color:C.accent,
  },
];

function ImgWithFallback({ src, alt, color, name }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div style={{ width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`${color}08`,gap:"10px" }}>
        <Ico n="img" s={36} c={`${color}50`} />
        <div style={{ color:`${color}70`,fontSize:"12px",fontWeight:500,textAlign:"center",padding:"0 16px" }}>
          Add screenshot:<br />
          <code style={{ fontSize:"11px",background:`${color}10`,padding:"2px 6px",borderRadius:"4px" }}>
            public/assets/{src.split("/").pop()}
          </code>
        </div>
      </div>
    );
  }
  return (
    <img src={src} alt={alt}
      style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"top center",transition:"transform .5s ease" }}
      onError={() => setErr(true)}
      onMouseEnter={e => e.currentTarget.style.transform="scale(1.04)"}
      onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
    />
  );
}

function Portfolio() {
  useReveal();
  return (
    <section id="portfolio" style={{ padding:"clamp(60px,10vw,100px) clamp(20px,5vw,40px)",background:C.bgOff }} className="sec">
      <div style={{ maxWidth:"1200px",margin:"0 auto" }}>
        <div className="reveal"><SH badge="Our Work" title="Real Projects, Real Results" sub="Websites we've designed and developed for businesses across Kolhapur and beyond." /></div>
        <div className="g3">
          {PROJ.map((p,i) => (
            <div key={p.name} className="lift reveal" style={{ transitionDelay:`${i*.1}s`,background:C.bg,borderRadius:"20px",overflow:"hidden",border:`1px solid ${C.bdr}`,boxShadow:"0 4px 20px rgba(15,23,42,.06)" }}>
              {/* Screenshot */}
              <div style={{ height:"clamp(180px,25vw,230px)",position:"relative",overflow:"hidden",background:`${p.color}06` }}>
                <ImgWithFallback src={p.img} alt={`${p.name} website`} color={p.color} name={p.name} />
                <div style={{ position:"absolute",top:12,right:12,background:`${p.color}15`,color:p.color,fontSize:"11px",fontWeight:700,padding:"4px 12px",borderRadius:"100px",border:`1px solid ${p.color}30`,backdropFilter:"blur(8px)" }}>
                  {p.industry}
                </div>
              </div>
              {/* Content */}
              <div style={{ padding:"22px" }}>
                <h3 style={{ fontWeight:700,fontSize:"17px",color:C.txt,marginBottom:"9px" }}>{p.name}</h3>
                <p style={{ color:C.txtSub,fontSize:"13.5px",lineHeight:1.7,marginBottom:"14px" }}>{p.desc}</p>
                <div style={{ display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"18px" }}>
                  {p.tech.map(t => (
                    <span key={t} style={{ background:C.bgOff,color:C.txtMid,fontSize:"11px",fontWeight:600,padding:"3px 10px",borderRadius:"100px",border:`1px solid ${C.bdr}` }}>{t}</span>
                  ))}
                </div>
                <a href={p.url} target="_blank" rel="noreferrer" style={{
                  display:"flex",alignItems:"center",justifyContent:"center",gap:"7px",
                  width:"100%",padding:"11px",borderRadius:"10px",
                  background:`${p.color}10`,color:p.color,fontWeight:600,fontSize:"14px",
                  border:`1.5px solid ${p.color}25`,transition:"all .22s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background=p.color; e.currentTarget.style.color="#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background=`${p.color}10`; e.currentTarget.style.color=p.color; }}
                >
                  <Ico n="ext" s={15} c="inherit" /> Visit Live Website
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="reveal" style={{ textAlign:"center",marginTop:"36px",padding:"28px",background:C.bg,borderRadius:"14px",border:`1.5px dashed ${C.bdrMid}` }}>
          <Ico n="pls" s={24} c={C.txtMute} />
          <p style={{ color:C.txtMute,fontSize:"14px",marginTop:"8px" }}>
            More projects coming soon.{" "}
            <span style={{ color:C.accent,cursor:"pointer",fontWeight:600 }} onClick={() => goto("contact")}>Contact us to discuss yours →</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   INDUSTRIES
══════════════════════════════════════════════════════════════════════ */
const INDS = [
  { n:"hrt",t:"Healthcare",d:"Hospitals & Clinics" },
  { n:"grad",t:"Education",d:"Schools & Colleges" },
  { n:"home",t:"Real Estate",d:"Builders & Brokers" },
  { n:"cof",t:"Restaurants",d:"Cafes & Chains" },
  { n:"bld",t:"Hotels",d:"Hotels & Resorts" },
  { n:"fac",t:"Manufacturing",d:"Industries & Exporters" },
  { n:"trk",t:"Transport",d:"Logistics & Fleet" },
  { n:"shop",t:"Retail",d:"Stores & Fashion" },
  { n:"zap",t:"Startups",d:"Tech & D2C" },
  { n:"bag",t:"Professional",d:"CAs & Consultants" },
];
const IC = [C.accent,C.teal,C.gold,"#EC4899","#F97316","#8B5CF6","#10B981",C.accentLt,"#14B8A6","#F59E0B"];

function Industries() {
  useReveal();
  return (
    <section id="industries" style={{ padding:"clamp(60px,10vw,100px) clamp(20px,5vw,40px)",background:C.bg }} className="sec">
      <div style={{ maxWidth:"1200px",margin:"0 auto" }}>
        <div className="reveal"><SH badge="Industries We Serve" title="Built for Every Business Sector" sub="We understand every industry has unique needs. Our team has delivered across 10+ verticals." /></div>
        <div className="g5">
          {INDS.map((ind,i) => (
            <div key={ind.t} className="reveal" style={{ transitionDelay:`${i*.05}s`,background:C.bg,border:`1px solid ${C.bdr}`,borderRadius:"14px",padding:"20px 14px",textAlign:"center",transition:"all .25s ease",cursor:"default",boxShadow:"0 2px 8px rgba(15,23,42,.04)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=IC[i]; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 12px 32px ${IC[i]}18`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.bdr; e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 2px 8px rgba(15,23,42,.04)"; }}
            >
              <div style={{ width:42,height:42,borderRadius:"12px",background:`${IC[i]}12`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",border:`1px solid ${IC[i]}20` }}>
                <Ico n={ind.n} s={19} c={IC[i]} />
              </div>
              <div style={{ color:C.txt,fontWeight:700,fontSize:"13px",marginBottom:"3px" }}>{ind.t}</div>
              <div style={{ color:C.txtMute,fontSize:"11px",lineHeight:1.4 }}>{ind.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   WHY CHOOSE US
══════════════════════════════════════════════════════════════════════ */
const WHY = [
  { n:"edit",t:"Custom Design",d:"Every design is tailor-made for your brand — no templates, no cookie-cutter solutions." },
  { n:"mon",t:"Mobile Responsive",d:"Pixel-perfect on every device: phones, tablets, laptops, and desktops." },
  { n:"srch",t:"SEO Friendly",d:"Built with clean code, fast load times, and proper structure search engines love." },
  { n:"zap",t:"Fast Performance",d:"Optimized assets, minimal bloat, and top PageSpeed scores for a snappy experience." },
  { n:"shld",t:"Secure Development",d:"SSL, security headers, safe form handling, and regular security updates." },
  { n:"hrt",t:"Ongoing Support",d:"We're your long-term digital partner — available after launch for updates or issues." },
];
const WC = [C.accent,C.teal,C.gold,"#EC4899","#F97316","#8B5CF6"];

function WhyUs() {
  useReveal();
  return (
    <section style={{ padding:"clamp(60px,10vw,100px) clamp(20px,5vw,40px)",background:C.bgOff }} className="sec">
      <div style={{ maxWidth:"1200px",margin:"0 auto" }}>
        <div className="reveal"><SH badge="Why Choose Us" title="The New Binary Difference" sub="We don't just build websites. We build digital growth engines for your business." /></div>
        <div className="g3">
          {WHY.map((w,i) => (
            <div key={w.t} className="lift reveal" style={{ transitionDelay:`${i*.07}s`,padding:"28px",borderRadius:"16px",background:C.bg,border:`1px solid ${C.bdr}`,boxShadow:"0 2px 12px rgba(15,23,42,.05)" }}>
              <div style={{ width:50,height:50,borderRadius:"14px",marginBottom:"18px",background:`${WC[i]}10`,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${WC[i]}20` }}>
                <Ico n={w.n} s={22} c={WC[i]} />
              </div>
              <h3 style={{ color:C.txt,fontWeight:700,fontSize:"16px",marginBottom:"9px" }}>{w.t}</h3>
              <p style={{ color:C.txtSub,fontSize:"14px",lineHeight:1.7 }}>{w.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   TESTIMONIALS — with real company reviews & star ratings
══════════════════════════════════════════════════════════════════════ */
const TESTI = [
  {
    name:"Go Agreetech",
    role:"AgriTech Company, Kolhapur",
    text:"New Binary Solutions built us a clean, professional website that perfectly represents our agri-tech products. The team understood our niche very well and delivered a fast, mobile-friendly site that has genuinely helped us attract more business partners.",
    rating:4.5,
    ini:"GA",
    color:C.teal,
  },
  {
  name: "DRL Kolhapur",
  role: "Deshbhushan and Rushikesh Roadlines",
  text: "New Binary Solutions developed a reliable business management app that has streamlined our daily transport operations. From trip management to record keeping, everything is now organized in one place. The app is easy to use, saves us valuable time, and has significantly improved our operational efficiency.",
  rating: 4.5,
  ini: "DRL",
  color: C.teal,
  },
  {
    name:"Shri Pant Krupa Paper Board",
    role:"Manufacturing Company, Kolhapur",
    text:"Our paper board company needed a website that looked trustworthy and professional to attract bulk buyers. New Binary Solutions delivered exactly that — a well-structured site with our product range, and enquiries have started coming in regularly since launch.",
    rating:5,
    ini:"PK",
    color:C.gold,
  },
  {
    name:"SC Global Exports & Imports",
    role:"Export-Import Business, Kolhapur",
    text:"As an export company dealing with international buyers, credibility is everything. The website New Binary built for us looks premium and professional. Our overseas clients have complimented the design, and we're seeing more enquiries from new countries.",
    rating:5,
    ini:"SC",
    color:C.accent,
  },
  {
    name:"Aditya Chavan",
    role:"Business Owner, Maharashtra",
    text:"I was impressed by how quickly New Binary Solutions understood my requirements and turned them into a great-looking website. The process was smooth, communication was clear, and the final result was better than I expected. Very satisfied with the outcome.",
    rating:4,
    ini:"AC",
    color:"#8B5CF6",
  },
];

function Testimonials() {
  const [active, setActive] = useState(0);
  useReveal();
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % TESTI.length), 4800);
    return () => clearInterval(t);
  }, []);
  const t = TESTI[active];
  return (
    <section style={{ padding:"clamp(60px,10vw,100px) clamp(20px,5vw,40px)",background:C.bg }} className="sec">
      <div style={{ maxWidth:"1200px",margin:"0 auto" }}>
        <div className="reveal"><SH badge="Client Reviews" title="Trusted by Businesses Across Maharashtra" sub="Real reviews from real clients who've seen real results." /></div>
        {/* Featured testimonial */}
        <div style={{ maxWidth:"700px",margin:"0 auto 40px",textAlign:"center",minHeight:"200px" }} key={active}>
          <Stars rating={t.rating} />
          <div style={{ display:"flex",justifyContent:"center",marginTop:"4px",marginBottom:"18px" }}>
            <span style={{ fontSize:"12px",fontWeight:600,color:C.gold }}>{t.rating} / 5</span>
          </div>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={`${C.accent}20`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin:"0 auto" }}>
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
          </svg>
          <p style={{ fontSize:"clamp(.95rem,2vw,1.1rem)",lineHeight:1.85,color:C.txtMid,margin:"14px 0 22px",fontStyle:"italic",animation:"fadeUp .45s ease both" }}>
            "{t.text}"
          </p>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"12px" }}>
            <div style={{ width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${t.color},${t.color}80)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:"14px",flexShrink:0 }}>{t.ini}</div>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontWeight:700,fontSize:"15px",color:C.txt }}>{t.name}</div>
              <div style={{ color:C.txtMute,fontSize:"12px" }}>{t.role}</div>
            </div>
          </div>
        </div>
        {/* Dots */}
        <div style={{ display:"flex",justifyContent:"center",gap:"8px",marginBottom:"44px" }}>
          {TESTI.map((_,i) => (
            <button key={i} onClick={() => setActive(i)} style={{ width:i===active?"24px":"8px",height:"8px",borderRadius:"100px",background:i===active?C.accent:C.bdr,transition:"all .3s" }} />
          ))}
        </div>
        {/* All 4 cards */}
        <div className="g4">
          {TESTI.map((t,i) => (
            <div key={t.name} className="lift reveal" style={{ transitionDelay:`${i*.08}s`,background:C.bg,borderRadius:"16px",padding:"20px",border:active===i?`2px solid ${t.color}40`:`1px solid ${C.bdr}`,cursor:"pointer",transition:"border .2s,box-shadow .25s",boxShadow:"0 2px 12px rgba(15,23,42,.05)" }}
              onClick={() => setActive(i)}
            >
              {/* Company name + stars */}
              <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"12px",gap:"8px" }}>
                <div style={{ display:"flex",alignItems:"center",gap:"10px" }}>
                  <div style={{ width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${t.color},${t.color}70)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:"12px",flexShrink:0 }}>{t.ini}</div>
                  <div>
                    <div style={{ fontWeight:700,fontSize:"13px",color:C.txt,lineHeight:1.2 }}>{t.name}</div>
                    <div style={{ color:C.txtMute,fontSize:"10.5px",marginTop:"1px" }}>{t.role}</div>
                  </div>
                </div>
                <div style={{ flexShrink:0 }}><Stars rating={t.rating} /></div>
              </div>
              <p style={{ color:C.txtSub,fontSize:"12.5px",lineHeight:1.7 }}>"{t.text.slice(0,120)}..."</p>
              <div style={{ marginTop:"10px",display:"inline-block",background:`${t.color}10`,color:t.color,fontSize:"11px",fontWeight:700,padding:"2px 10px",borderRadius:"100px",border:`1px solid ${t.color}20` }}>
                ★ {t.rating} / 5
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   CONTACT
══════════════════════════════════════════════════════════════════════ */
function Contact() {
  const [form, setForm] = useState({ name:"",email:"",phone:"",service:"",message:"" });
  const [sent, setSent] = useState(false);
  useReveal();
  const inp = {
    width:"100%",padding:"12px 14px",borderRadius:"10px",fontSize:"14px",
    background:"#fff",border:`1.5px solid ${C.bdr}`,
    color:C.txt,outline:"none",transition:"border .2s",
  };
  const submit = e => {
    e.preventDefault(); setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name:"",email:"",phone:"",service:"",message:"" });
  };
  return (
    <section id="contact" style={{ padding:"clamp(60px,10vw,100px) clamp(20px,5vw,40px)",background:C.bgOff }} className="sec">
      <div style={{ maxWidth:"1200px",margin:"0 auto" }}>
        <div className="reveal"><SH badge="Get In Touch" title="Let's Build Your Dream Website" sub="Ready to grow your business online? Get a free consultation and project estimate today." /></div>
        <div className="g2" style={{ alignItems:"start" }}>
          {/* Left info */}
          <div className="rl">
            {/* WhatsApp */}
            <a href="https://wa.me/919921889500?text=Hi%2C%20I%20want%20to%20enquire%20about%20website%20development%20services." target="_blank" rel="noreferrer"
              style={{ display:"flex",alignItems:"center",gap:"14px",background:"linear-gradient(135deg,#25D366,#128C7E)",borderRadius:"14px",padding:"18px 20px",marginBottom:"18px",color:"#fff",transition:"transform .22s,box-shadow .22s",boxShadow:"0 6px 24px rgba(37,211,102,.25)" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 12px 36px rgba(37,211,102,.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 6px 24px rgba(37,211,102,.25)"; }}
            >
              <div style={{ width:44,height:44,borderRadius:"12px",background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <Ico n="wa" s={22} c="#fff" />
              </div>
              <div>
                <div style={{ fontWeight:700,fontSize:"15px" }}>WhatsApp Us Now</div>
                <div style={{ opacity:.85,fontSize:"12.5px",marginTop:"2px" }}>+91 99218 89500 · Quick reply guaranteed</div>
              </div>
            </a>
            {/* Contact cards */}
            {[
              { n:"phn",l:"Phone",v:"+91 99218 89500",h:"tel:+919921889500" },
              { n:"mail",l:"Email",v:"newbinarysolutions@gmail.com",h:"mailto:newbinarysolutions@gmail.com" },
              { n:"map",l:"Address",v:"Flat No.103, Atharva Skylines, Near Coforge Ltd, Ujalaiwadi, Kolhapur, MH 416004" },
            ].map(({ n,l,v,h }) => (
              <div key={l} style={{ display:"flex",gap:"12px",padding:"14px",borderRadius:"12px",background:C.bg,border:`1px solid ${C.bdr}`,marginBottom:"10px",boxShadow:"0 1px 6px rgba(15,23,42,.04)" }}>
                <div style={{ width:38,height:38,borderRadius:"10px",background:`${C.accent}10`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <Ico n={n} s={16} c={C.accent} />
                </div>
                <div>
                  <div style={{ color:C.txtMute,fontSize:"10.5px",letterSpacing:".06em",textTransform:"uppercase",marginBottom:"3px",fontWeight:600 }}>{l}</div>
                  {h ? <a href={h} style={{ color:C.txt,fontSize:"13.5px",fontWeight:500 }}>{v}</a> : <div style={{ color:C.txt,fontSize:"13px",lineHeight:1.6 }}>{v}</div>}
                </div>
              </div>
            ))}
            {/* Socials */}
            <div style={{ marginTop:"18px" }}>
              <div style={{ color:C.txtMute,fontSize:"11px",letterSpacing:".06em",textTransform:"uppercase",marginBottom:"10px",fontWeight:600 }}>Follow Us</div>
              <div style={{ display:"flex",gap:"8px" }}>
                {[
                  { n:"li",h:"https://www.linkedin.com/company/newbinarysolutions/",c:"#0077B5" },
                  { n:"fb",h:"#",c:"#1877F2" },
                  { n:"tw",h:"#",c:"#1DA1F2" },
                  { n:"wa",h:"https://wa.me/919921889500",c:"#25D366" },
                ].map(({ n,h,c }) => (
                  <a key={n} href={h} target="_blank" rel="noreferrer" style={{ width:40,height:40,borderRadius:"10px",background:C.bg,border:`1px solid ${C.bdr}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background=c; e.currentTarget.style.borderColor=c; e.currentTarget.querySelector("svg").style.stroke="#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background=C.bg; e.currentTarget.style.borderColor=C.bdr; e.currentTarget.querySelector("svg").style.stroke=C.txtMid; }}
                  ><Ico n={n} s={16} c={C.txtMid} /></a>
                ))}
              </div>
            </div>
            {/* Map */}
            <div style={{ marginTop:"18px",borderRadius:"14px",overflow:"hidden",border:`1px solid ${C.bdr}` }}>
              <iframe title="New Binary Solutions Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3822.199712470126!2d74.2607938!3d16.6668867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc0ffb41ac35e65%3A0xbdaf3d39572ff9fc!2sBinary%20Solutions%20Pvt.Ltd%20Kolhapur!5e0!3m2!1sen!2sin!4v1736934637020!5m2!1sen!2sin"
                width="100%" height="190" style={{ border:0,display:"block" }} allowFullScreen loading="lazy" />
            </div>
          </div>
          {/* Right form */}
          <div className="rr">
            <form onSubmit={submit} style={{ background:C.bg,border:`1px solid ${C.bdr}`,borderRadius:"20px",padding:"clamp(20px,5vw,36px)",boxShadow:"0 4px 24px rgba(15,23,42,.06)" }}>
              <h3 style={{ color:C.txt,fontWeight:700,fontSize:"19px",marginBottom:"22px" }}>Send us a message</h3>
              {sent && (
                <div style={{ background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.25)",borderRadius:"10px",padding:"12px 16px",color:"#059669",marginBottom:"16px",display:"flex",alignItems:"center",gap:"10px",fontSize:"14px" }}>
                  <Ico n="chk" s={16} c="#059669" /> Message sent! We'll reply within 24 hours.
                </div>
              )}
              <div className="g2" style={{ gap:"12px",marginBottom:"12px" }}>
                {[["Full Name","name","text","Your name"],["Email Address","email","email","your@email.com"]].map(([l,k,t,ph]) => (
                  <div key={k}>
                    <label style={{ color:C.txtSub,fontSize:"12px",display:"block",marginBottom:"5px",fontWeight:500 }}>{l} *</label>
                    <input required type={t} style={inp} placeholder={ph} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
                      onFocus={e => e.target.style.borderColor=C.accent}
                      onBlur={e => e.target.style.borderColor=C.bdr} />
                  </div>
                ))}
              </div>
              <div className="g2" style={{ gap:"12px",marginBottom:"12px" }}>
                <div>
                  <label style={{ color:C.txtSub,fontSize:"12px",display:"block",marginBottom:"5px",fontWeight:500 }}>Phone Number</label>
                  <input style={inp} placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})}
                    onFocus={e => e.target.style.borderColor=C.accent} onBlur={e => e.target.style.borderColor=C.bdr} />
                </div>
                <div>
                  <label style={{ color:C.txtSub,fontSize:"12px",display:"block",marginBottom:"5px",fontWeight:500 }}>Service Needed</label>
                  <select style={{ ...inp,cursor:"pointer" }} value={form.service} onChange={e => setForm({...form,service:e.target.value})}
                    onFocus={e => e.target.style.borderColor=C.accent} onBlur={e => e.target.style.borderColor=C.bdr}>
                    <option value="">Select a service</option>
                    {["Business Website","Corporate Website","E-Commerce","Landing Page","Website Redesign","Maintenance","SEO","Web Application"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom:"18px" }}>
                <label style={{ color:C.txtSub,fontSize:"12px",display:"block",marginBottom:"5px",fontWeight:500 }}>Tell us about your project *</label>
                <textarea required rows={5} style={{ ...inp,resize:"vertical",minHeight:"100px" }} placeholder="Describe your business, what kind of website you need, budget, and timeline..."
                  value={form.message} onChange={e => setForm({...form,message:e.target.value})}
                  onFocus={e => e.target.style.borderColor=C.accent} onBlur={e => e.target.style.borderColor=C.bdr} />
              </div>
              <PBtn style={{ width:"100%",justifyContent:"center",padding:"14px",fontSize:"15px" }}>
                <Ico n="arr" s={18} c="#fff" /> Send Message & Get Free Quote
              </PBtn>
              <p style={{ color:C.txtMute,fontSize:"12px",textAlign:"center",marginTop:"10px" }}>We typically reply within 2–4 business hours.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   FOOTER — Dark section
══════════════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ background:C.dark }}>
      {/* CTA strip */}
      <div style={{ background:`linear-gradient(135deg,${C.accent},#4338CA)`,padding:"clamp(40px,8vw,60px) clamp(20px,5vw,40px)",textAlign:"center" }}>
        <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:"clamp(1.3rem,3vw,2.2rem)",marginBottom:"10px",color:"#fff" }}>
          Ready to Get a Website That Works?
        </h2>
        <p style={{ opacity:.85,fontSize:"15px",marginBottom:"24px",color:"#fff" }}>Join 30+ satisfied businesses that trust New Binary Solutions.</p>
        <div style={{ display:"flex",gap:"14px",justifyContent:"center",flexWrap:"wrap" }}>
          <PBtn onClick={() => goto("contact")} style={{ background:"rgba(255,255,255,.15)",boxShadow:"none",border:"1.5px solid rgba(255,255,255,.3)" }}>
            Get Free Consultation
          </PBtn>
          <a href="https://wa.me/919921889500" target="_blank" rel="noreferrer" style={{ display:"inline-flex",alignItems:"center",gap:"8px",padding:"13px 26px",borderRadius:"10px",fontWeight:600,fontSize:"15px",background:"#25D366",color:"#fff" }}>
            <Ico n="wa" s={18} c="#fff" /> Chat on WhatsApp
          </a>
        </div>
      </div>
      {/* Main footer */}
      <div style={{ padding:"clamp(40px,8vw,60px) clamp(20px,5vw,40px) 28px",maxWidth:"1200px",margin:"0 auto" }}>
        <div className="gf4" style={{ marginBottom:"44px" }}>
          {/* Brand */}
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px" }}>
              <img src="./assets/logo.jpeg" alt="NBS" style={{ width:42,height:42,borderRadius:"10px",objectFit:"cover",border:"1px solid rgba(255,255,255,.1)" }}
                onError={e => e.currentTarget.style.display="none"} />
              <div>
                <div style={{ color:"#fff",fontWeight:700,fontSize:"14px" }}>New Binary Solutions</div>
                <div style={{ color:C.accentXl,fontSize:"10px",letterSpacing:".06em" }}>WEB DESIGN & DEVELOPMENT</div>
              </div>
            </div>
            <p style={{ color:"rgba(255,255,255,.4)",fontSize:"13.5px",lineHeight:1.8,marginBottom:"18px" }}>
              Kolhapur-based web design & development agency. We build fast, beautiful, conversion-focused websites for businesses across India.
            </p>
            <div style={{ display:"flex",gap:"8px" }}>
              {[
                { n:"li",h:"https://www.linkedin.com/company/newbinarysolutions/",c:"#0077B5" },
                { n:"fb",h:"#",c:"#1877F2" },
                { n:"tw",h:"#",c:"#1DA1F2" },
                { n:"wa",h:"https://wa.me/919921889500",c:"#25D366" },
              ].map(({ n,h,c }) => (
                <a key={n} href={h} target="_blank" rel="noreferrer" style={{ width:36,height:36,borderRadius:"8px",background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",transition:"background .2s" }}
                  onMouseEnter={e => e.currentTarget.style.background=c}
                  onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,.06)"}
                ><Ico n={n} s={15} c="#fff" /></a>
              ))}
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h4 style={{ color:"#fff",fontWeight:700,fontSize:"13px",marginBottom:"14px",letterSpacing:".05em",textTransform:"uppercase" }}>Quick Links</h4>
            {["Home","About","Services","Portfolio","Industries","Contact"].map(l => (
              <button key={l} onClick={() => goto(l.toLowerCase())} style={{ display:"block",color:"rgba(255,255,255,.45)",fontSize:"13.5px",marginBottom:"9px",transition:"color .2s",textAlign:"left" }}
                onMouseEnter={e => e.currentTarget.style.color=C.accentXl}
                onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,.45)"}
              >{l}</button>
            ))}
          </div>
          {/* Services */}
          <div>
            <h4 style={{ color:"#fff",fontWeight:700,fontSize:"13px",marginBottom:"14px",letterSpacing:".05em",textTransform:"uppercase" }}>Services</h4>
            {["Business Websites","Corporate Websites","E-Commerce","Landing Pages","Website Redesign","Maintenance","SEO Websites"].map(s => (
              <div key={s} style={{ color:"rgba(255,255,255,.4)",fontSize:"13px",marginBottom:"9px" }}>{s}</div>
            ))}
          </div>
          {/* Contact */}
          <div>
            <h4 style={{ color:"#fff",fontWeight:700,fontSize:"13px",marginBottom:"14px",letterSpacing:".05em",textTransform:"uppercase" }}>Contact Info</h4>
            {[
              { n:"map",v:"Flat No.103, Atharva Skylines, Near Coforge Ltd, Ujalaiwadi, Kolhapur, MH 416004" },
              { n:"phn",v:"+91 99218 89500" },
              { n:"mail",v:"newbinarysolutions@gmail.com" },
            ].map(({ n,v }) => (
              <div key={v} style={{ display:"flex",gap:"9px",marginBottom:"12px",alignItems:"flex-start" }}>
                <Ico n={n} s={14} c={C.accentXl} />
                <span style={{ color:"rgba(255,255,255,.45)",fontSize:"13px",lineHeight:1.6 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop:"14px",padding:"12px 14px",borderRadius:"10px",background:`${C.accent}15`,border:`1px solid ${C.accent}25` }}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px" }}>
                {[["Founder","Mr. Vishwajeet Khot"],["Co-Founder","Mr. Deshbhushan Chougule"]].map(([r,n]) => (
                  <div key={r}>
                    <div style={{ color:C.accentXl,fontSize:"10px",fontWeight:700,letterSpacing:".05em",textTransform:"uppercase" }}>{r}</div>
                    <div style={{ color:"rgba(255,255,255,.7)",fontSize:"12px",marginTop:"2px" }}>{n}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,.07)",paddingTop:"20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px" }}>
          <div style={{ color:"rgba(255,255,255,.3)",fontSize:"13px" }}>© {new Date().getFullYear()} New Binary Solutions, Kolhapur. All rights reserved.</div>
          <div style={{ color:"rgba(255,255,255,.3)",fontSize:"13px" }}>Designed & Developed by <span style={{ color:C.accentXl,fontWeight:600 }}>New Binary Solutions</span></div>
        </div>
      </div>
    </footer>
  );
}

/* ── Floating WhatsApp ───────────────────────────────────────────────── */
function FloatWA() {
  return (
    <a href="https://wa.me/919921889500?text=Hi%2C%20I%20want%20to%20enquire%20about%20website%20development%20services." target="_blank" rel="noreferrer"
      style={{ position:"fixed",bottom:24,right:24,zIndex:998,width:54,height:54,borderRadius:"50%",background:"linear-gradient(135deg,#25D366,#128C7E)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 24px rgba(37,211,102,.45)",transition:"transform .22s, box-shadow .22s" }}
      onMouseEnter={e => { e.currentTarget.style.transform="scale(1.1)"; e.currentTarget.style.boxShadow="0 12px 36px rgba(37,211,102,.6)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 6px 24px rgba(37,211,102,.45)"; }}
    ><Ico n="wa" s={26} c="#fff" /></a>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════════════════════════════════ */
export default function App() {
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = G;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Industries />
      <WhyUs />
      <Testimonials />
      <Contact />
      <Footer />
      <FloatWA />
    </>
  );
}
import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────────────── */
const C = {
  navy:    "#0A1628",
  navyMid: "#0F2044",
  navyLt:  "#162A52",
  accent:  "#2563EB",
  accentLt:"#3B82F6",
  gold:    "#F59E0B",
  white:   "#FFFFFF",
  offWhite:"#F8FAFC",
  gray50:  "#F1F5F9",
  gray100: "#E2E8F0",
  gray300: "#94A3B8",
  gray500: "#64748B",
  gray700: "#334155",
};

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────── */
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:'Inter',sans-serif;background:${C.white};color:${C.navy};overflow-x:hidden}
  a{text-decoration:none;color:inherit}
  button{font-family:'Inter',sans-serif;cursor:pointer;border:none;outline:none}
  img{max-width:100%;display:block}

  /* Scrollbar */
  ::-webkit-scrollbar{width:6px}
  ::-webkit-scrollbar-track{background:${C.navy}}
  ::-webkit-scrollbar-thumb{background:${C.accent};border-radius:3px}

  /* Animations */
  @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes countUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

  .fade-up{animation:fadeUp .7s ease both}
  .fade-in{animation:fadeIn .6s ease both}
  .float{animation:float 4s ease-in-out infinite}

  /* Section utility */
  .section-dark{background:${C.navy};color:${C.white}}
  .section-light{background:${C.offWhite}}
  .section-white{background:${C.white}}

  /* Reveal on scroll */
  .reveal{opacity:0;transform:translateY(40px);transition:opacity .7s ease,transform .7s ease}
  .reveal.visible{opacity:1;transform:translateY(0)}
  .reveal-left{opacity:0;transform:translateX(-40px);transition:opacity .7s ease,transform .7s ease}
  .reveal-left.visible{opacity:1;transform:translateX(0)}
  .reveal-right{opacity:0;transform:translateX(40px);transition:opacity .7s ease,transform .7s ease}
  .reveal-right.visible{opacity:1;transform:translateX(0)}

  /* Card hover */
  .card-hover{transition:transform .3s ease,box-shadow .3s ease}
  .card-hover:hover{transform:translateY(-6px);box-shadow:0 20px 60px rgba(37,99,235,.18)}

  /* Responsive */
  @media(max-width:768px){
    .hide-mobile{display:none!important}
    .grid-2{grid-template-columns:1fr!important}
    .grid-3{grid-template-columns:1fr!important}
    .grid-4{grid-template-columns:1fr 1fr!important}
    .hero-title{font-size:2.2rem!important;line-height:1.2!important}
    .hero-sub{font-size:1rem!important}
    .section-pad{padding:60px 20px!important}
    .nav-links{display:none!important}
  }
  @media(max-width:480px){
    .grid-4{grid-template-columns:1fr!important}
    .hero-title{font-size:1.8rem!important}
  }
`;

/* ─── HELPER COMPONENTS ─────────────────────────────────────────────── */
function Badge({ children, style }) {
  return (
    <span style={{
      display:"inline-block",fontSize:"11px",fontWeight:600,letterSpacing:".1em",
      textTransform:"uppercase",padding:"5px 14px",borderRadius:"100px",
      background:`${C.accent}20`,color:C.accentLt,border:`1px solid ${C.accent}40`,
      ...style
    }}>{children}</span>
  );
}

function SectionTitle({ badge, title, sub, light, center=true }) {
  return (
    <div style={{textAlign:center?"center":"left",marginBottom:"48px"}}>
      {badge && <Badge style={light?{background:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.8)",border:"1px solid rgba(255,255,255,.2)"}:{}}>{badge}</Badge>}
      <h2 style={{
        fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,
        fontSize:"clamp(1.8rem,4vw,2.8rem)",
        color:light?C.white:C.navy,
        marginTop:"14px",marginBottom:"16px",lineHeight:1.15,
      }}>{title}</h2>
      {sub && <p style={{color:light?"rgba(255,255,255,.65)":C.gray500,fontSize:"1.1rem",maxWidth:"580px",margin:"0 auto",lineHeight:1.7}}>{sub}</p>}
    </div>
  );
}

function PrimaryBtn({ children, onClick, href, style }) {
  const s = {
    display:"inline-flex",alignItems:"center",gap:"8px",
    padding:"14px 28px",borderRadius:"8px",fontWeight:600,fontSize:"15px",
    background:`linear-gradient(135deg,${C.accent},${C.accentLt})`,
    color:C.white,boxShadow:`0 4px 20px ${C.accent}50`,
    transition:"all .25s ease",cursor:"pointer",...style
  };
  if(href) return <a href={href} style={s} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 30px ${C.accent}60`}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 4px 20px ${C.accent}50`}}>{children}</a>;
  return <button style={s} onClick={onClick} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)"}} onMouseLeave={e=>{e.currentTarget.style.transform=""}}>{children}</button>;
}

function OutlineBtn({ children, onClick, href, dark, style }) {
  const s = {
    display:"inline-flex",alignItems:"center",gap:"8px",
    padding:"14px 28px",borderRadius:"8px",fontWeight:600,fontSize:"15px",
    background:"transparent",
    color:dark?C.white:C.navy,
    border:`1.5px solid ${dark?"rgba(255,255,255,.35)":C.gray100}`,
    transition:"all .25s ease",cursor:"pointer",...style
  };
  if(href) return <a href={href} style={s} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.accent}} onMouseLeave={e=>{e.currentTarget.style.borderColor=dark?"rgba(255,255,255,.35)":C.gray100;e.currentTarget.style.color=dark?C.white:C.navy}}>{children}</a>;
  return <button style={s} onClick={onClick} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent}} onMouseLeave={e=>{e.currentTarget.style.borderColor=dark?"rgba(255,255,255,.35)":C.gray100}}>{children}</button>;
}

/* ─── ICONS (inline SVG) ────────────────────────────────────────────── */
const Icon = ({ name, size=22, color="currentColor" }) => {
  const icons = {
    globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    shop: <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></>,
    layout: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.55 5.55l.93-.93a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 15.91z"/></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    map: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    arrow: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    heart: <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    monitor: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
    activity: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    building: <><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22V12h6v10"/><path d="M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01"/></>,
    truck: <><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>,
    twitter: <><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></>,
    facebook: <><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></>,
    whatsapp: <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></>,
    menu: <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    quote: <><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></>,
    industry: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V3H8v4"/><line x1="12" y1="12" x2="12" y2="12"/><line x1="8" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="16" y2="12"/></>,
    code: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
    coffee: <><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></>,
    factory: <><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16z"/></>,
    graduation: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

/* ─── SCROLL REVEAL HOOK ─────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal,.reveal-left,.reveal-right").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── COUNTER HOOK ───────────────────────────────────────────────────── */
function useCounter(target, duration=2000, start=false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if(!start) return;
    let startTime;
    const step = ts => {
      if(!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if(progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ══════════════════════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Home","About","Services","Portfolio","Industries","Contact"];
  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setMenuOpen(false); };

  return (
    <>
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:1000,
        background: scrolled ? `rgba(10,22,40,.97)` : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid rgba(255,255,255,.08)` : "none",
        transition:"all .35s ease",padding: scrolled ? "14px 40px" : "22px 40px",
        display:"flex",alignItems:"center",justifyContent:"space-between",
      }}>
        {/* Logo */}
        <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  }}
  onClick={() => scrollTo("home")}
>
  <div
    style={{
      width: 38,
      height: 38,
      borderRadius: "8px",
      background: `linear-gradient(135deg,${C.accent},${C.gold})`,
      overflow: "hidden",
      flexShrink: 0,
    }}
  >
    <img
      src="/assets/logo.jpeg"
      alt="Logo"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain", // or "cover"
      }}
    />
  </div>

  <div>
    <div
      style={{
        color: C.white,
        fontWeight: 700,
        fontSize: "15px",
        lineHeight: 1,
      }}
    >
      New Binary
    </div>
    <div
      style={{
        color: C.accentLt,
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: ".05em",
      }}
    >
      Solutions
    </div>
  </div>
</div>

        {/* Desktop Links */}
        <div className="nav-links" style={{display:"flex",gap:"32px",alignItems:"center"}}>
          {links.map(l=>(
            <button key={l} onClick={()=>scrollTo(l.toLowerCase())} style={{
              background:"none",color:"rgba(255,255,255,.75)",fontSize:"14px",fontWeight:500,
              transition:"color .2s",padding:"4px 0",
            }}
              onMouseEnter={e=>e.currentTarget.style.color=C.white}
              onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.75)"}
            >{l}</button>
          ))}
          <PrimaryBtn onClick={()=>scrollTo("contact")} style={{padding:"10px 22px",fontSize:"14px"}}>
            Get Free Quote
          </PrimaryBtn>
        </div>

        {/* Mobile Hamburger */}
        <button onClick={()=>setMenuOpen(!menuOpen)} style={{display:"none",background:"none",color:C.white}} className="hide-desktop"
          onFocus={()=>{}}
        >
          <Icon name={menuOpen?"x":"menu"} size={26} color={C.white}/>
        </button>
        <button onClick={()=>setMenuOpen(!menuOpen)} style={{background:"none",color:C.white,display:"block"}} className="hide-mobile" onFocus={()=>{}}>
          {/* hidden on desktop */}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div style={{
          position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:999,
          background:C.navy,display:"flex",flexDirection:"column",
          alignItems:"center",justifyContent:"center",gap:"32px"
        }}>
          <button onClick={()=>setMenuOpen(false)} style={{position:"absolute",top:"24px",right:"24px",background:"none",color:C.white}}>
            <Icon name="x" size={28} color={C.white}/>
          </button>
          {links.map(l=>(
            <button key={l} onClick={()=>scrollTo(l.toLowerCase())} style={{
              background:"none",color:C.white,fontSize:"24px",fontWeight:600,
            }}>{l}</button>
          ))}
          <PrimaryBtn onClick={()=>scrollTo("contact")}>Get Free Quote</PrimaryBtn>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════════════════ */
function Hero() {
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  return (
    <section id="home" style={{
      minHeight:"100vh",background:`linear-gradient(145deg,${C.navy} 0%,${C.navyMid} 50%,#0c1f3f 100%)`,
      position:"relative",display:"flex",alignItems:"center",overflow:"hidden",
    }}>
      {/* Animated grid background */}
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(37,99,235,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.07) 1px,transparent 1px)`,backgroundSize:"60px 60px",}}/>
      {/* Glows */}
      <div style={{position:"absolute",top:"-10%",right:"-5%",width:"600px",height:"600px",borderRadius:"50%",background:`radial-gradient(circle,${C.accent}18 0%,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"-20%",left:"-10%",width:"500px",height:"500px",borderRadius:"50%",background:`radial-gradient(circle,${C.gold}10 0%,transparent 70%)`,pointerEvents:"none"}}/>

      <div style={{maxWidth:"1200px",margin:"0 auto",padding:"120px 40px 80px",width:"100%",position:"relative",zIndex:1}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"60px",alignItems:"center"}} className="grid-2">
          {/* Left */}
          <div>
            <div style={{animation:"fadeUp .7s ease both"}}>
              <Badge style={{marginBottom:"20px"}}>🚀 Web Design & Development Agency · Kolhapur</Badge>
            </div>
            <h1 className="hero-title" style={{
              fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,
              fontSize:"clamp(2.2rem,5vw,3.6rem)",lineHeight:1.1,color:C.white,
              marginTop:"16px",animation:"fadeUp .8s .1s ease both",opacity:0,
              animationFillMode:"forwards",
            }}>
              Professional Websites That Help{" "}
              <span style={{backgroundImage:`linear-gradient(135deg,${C.accentLt},${C.gold})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
                Businesses Grow
              </span>
            </h1>
            <p className="hero-sub" style={{
              color:"rgba(255,255,255,.65)",fontSize:"1.15rem",lineHeight:1.75,
              marginTop:"20px",marginBottom:"36px",maxWidth:"520px",
              animation:"fadeUp .8s .2s ease both",opacity:0,animationFillMode:"forwards",
            }}>
              We design modern, responsive, and conversion-focused websites that help businesses build credibility and generate more customers.
            </p>
            <div style={{display:"flex",gap:"14px",flexWrap:"wrap",animation:"fadeUp .8s .3s ease both",opacity:0,animationFillMode:"forwards"}}>
              <PrimaryBtn onClick={()=>scrollTo("portfolio")}>
                <Icon name="monitor" size={18} color={C.white}/>
                View Our Work
              </PrimaryBtn>
              <OutlineBtn onClick={()=>scrollTo("contact")} dark>
                <Icon name="phone" size={18} color={C.white}/>
                Free Consultation
              </OutlineBtn>
            </div>
            {/* Trust bar */}
            <div style={{display:"flex",gap:"28px",marginTop:"48px",animation:"fadeUp .8s .4s ease both",opacity:0,animationFillMode:"forwards",flexWrap:"wrap"}}>
              {[["50+","Projects Done"],["30+","Happy Clients"],["24/7","Support"],["10+","Industries"]].map(([n,l])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:"1.6rem",color:C.white,lineHeight:1}}>{n}</div>
                  <div style={{color:"rgba(255,255,255,.5)",fontSize:"11px",marginTop:"4px",letterSpacing:".05em",textTransform:"uppercase"}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right – Visual */}
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",animation:"fadeIn 1s .4s ease both",opacity:0,animationFillMode:"forwards"}} className="hide-mobile">
            <div style={{position:"relative",width:"420px",height:"420px"}}>
              {/* Rotating ring */}
              <div style={{position:"absolute",inset:0,borderRadius:"50%",border:`2px dashed ${C.accent}30`,animation:"rotateSlow 20s linear infinite"}}/>
              <div style={{position:"absolute",inset:"20px",borderRadius:"50%",border:`1px dashed ${C.accent}20`,animation:"rotateSlow 15s linear infinite reverse"}}/>
              {/* Central card */}
              <div className="float" style={{
                position:"absolute",inset:"40px",borderRadius:"24px",
                background:`linear-gradient(145deg,${C.navyLt},${C.navyMid})`,
                border:`1px solid rgba(255,255,255,.1)`,
                display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                boxShadow:`0 30px 80px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.05)`,
              }}>
                <div style={{width:64,height:64,borderRadius:"16px",background:`linear-gradient(135deg,${C.accent},${C.accentLt})`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"16px",boxShadow:`0 10px 30px ${C.accent}50`}}>
                  <Icon name="code" size={32} color={C.white}/>
                </div>
                <div style={{color:C.white,fontWeight:700,fontSize:"16px",marginBottom:"6px"}}>New Binary Solutions</div>
                <div style={{color:"rgba(255,255,255,.5)",fontSize:"12px",textAlign:"center",padding:"0 20px",lineHeight:1.5}}>Web Design & Development Agency · Kolhapur</div>
              </div>
              {/* Floating chips */}
              {[
                {label:"React.js",top:"6%",left:"0%",icon:"code"},
                {label:"Node.js",bottom:"10%",right:"0%",icon:"zap"},
                {label:"UI/UX",top:"5%",right:"2%",icon:"edit"},
                {label:"SEO",bottom:"8%",left:"0%",icon:"search"},
              ].map(({label,icon,...pos})=>(
                <div key={label} style={{
                  position:"absolute",...pos,
                  background:C.navyMid,border:`1px solid rgba(255,255,255,.1)`,
                  borderRadius:"100px",padding:"8px 14px",
                  display:"flex",alignItems:"center",gap:"6px",
                  color:C.white,fontSize:"12px",fontWeight:600,
                  boxShadow:"0 8px 24px rgba(0,0,0,.3)",whiteSpace:"nowrap",
                }}>
                  <Icon name={icon} size={14} color={C.accentLt}/>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{position:"absolute",bottom:"30px",left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",color:"rgba(255,255,255,.3)",fontSize:"11px",animation:"fadeIn 1s 1s ease both",opacity:0,animationFillMode:"forwards"}}>
        <div style={{width:1,height:36,background:`linear-gradient(${C.accentLt},transparent)`,animation:"pulse 1.8s ease-in-out infinite"}}/>
        SCROLL
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ABOUT
══════════════════════════════════════════════════════════════════════ */
function StatCounter({ target, suffix="", label }) {
  const ref = useRef();
  const [started, setStarted] = useState(false);
  const count = useCounter(target, 2000, started);

  useEffect(()=>{
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting){ setStarted(true); obs.disconnect(); }},{threshold:.5});
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[]);

  return (
    <div ref={ref} style={{textAlign:"center",padding:"28px 20px",background:C.navyLt,borderRadius:"16px",border:`1px solid rgba(255,255,255,.07)`}}>
      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:"2.4rem",color:C.white,lineHeight:1}}>
        {count}{suffix}
      </div>
      <div style={{color:"rgba(255,255,255,.5)",fontSize:"13px",marginTop:"8px",letterSpacing:".04em"}}>{label}</div>
    </div>
  );
}

function About() {
  useReveal();
  return (
    <section id="about" className="section-dark" style={{padding:"100px 40px"}}>
      <div style={{maxWidth:"1200px",margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"80px",alignItems:"center",marginBottom:"80px"}} className="grid-2">
          {/* Left */}
          <div className="reveal-left">
            <Badge style={{background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.8)",border:"1px solid rgba(255,255,255,.15)"}}>About New Binary Solutions</Badge>
            <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:"clamp(1.8rem,3.5vw,2.6rem)",color:C.white,margin:"20px 0 20px",lineHeight:1.2}}>
              Kolhapur's Trusted Partner for{" "}
              <span style={{color:C.accentLt}}>Digital Growth</span>
            </h2>
            <p style={{color:"rgba(255,255,255,.6)",lineHeight:1.8,marginBottom:"18px",fontSize:"15px"}}>
              Founded in Kolhapur, Maharashtra, New Binary Solutions is a technology company led by <strong style={{color:C.white}}>Mr. Vishwajeet Khot</strong> and co-founded by <strong style={{color:C.white}}>Mr. Deshbhushan Chougule</strong>. We specialize in crafting high-performance websites and digital solutions that drive real business results.
            </p>
            <p style={{color:"rgba(255,255,255,.6)",lineHeight:1.8,fontSize:"15px",marginBottom:"28px"}}>
              Our approach is simple: understand your business deeply, design with purpose, and build with precision. Every website we create is a strategic asset — fast, secure, mobile-ready, and built to convert visitors into customers.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
              {[
                {icon:"star",text:"Mission: Deliver technology that creates real-world impact"},
                {icon:"zap",text:"Vision: Be the most trusted IT partner for SMBs across India"},
              ].map(({icon,text})=>(
                <div key={text} style={{background:"rgba(255,255,255,.04)",borderRadius:"12px",padding:"16px",border:"1px solid rgba(255,255,255,.06)"}}>
                  <Icon name={icon} size={20} color={C.accentLt}/>
                  <p style={{color:"rgba(255,255,255,.65)",fontSize:"13px",marginTop:"10px",lineHeight:1.6}}>{text}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Right – Why choose us bullets */}
          <div className="reveal-right">
            <h3 style={{color:C.white,fontWeight:700,fontSize:"20px",marginBottom:"24px"}}>Why businesses choose us</h3>
            {[
              ["Custom Design","Every website is designed from scratch — no templates."],
              ["Mobile-First","100% responsive across all devices and screen sizes."],
              ["SEO Built-In","Optimized for search engines from day one."],
              ["Fast Delivery","Most projects delivered within 2–4 weeks."],
              ["Ongoing Support","Post-launch support so you're never left alone."],
              ["Local Expertise","Kolhapur-based team, global standards."],
            ].map(([title,desc])=>(
              <div key={title} style={{display:"flex",gap:"14px",marginBottom:"16px",padding:"14px 16px",borderRadius:"10px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.05)"}}>
                <div style={{width:32,height:32,borderRadius:"8px",background:`${C.accent}20`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Icon name="check" size={16} color={C.accentLt}/>
                </div>
                <div>
                  <div style={{color:C.white,fontWeight:600,fontSize:"14px"}}>{title}</div>
                  <div style={{color:"rgba(255,255,255,.5)",fontSize:"13px",marginTop:"3px"}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"20px"}} className="grid-4">
          <StatCounter target={50} suffix="+" label="Projects Completed"/>
          <StatCounter target={30} suffix="+" label="Happy Clients"/>
          <StatCounter target={24} suffix="/7" label="Support Available"/>
          <StatCounter target={10} suffix="+" label="Industries Served"/>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SERVICES
══════════════════════════════════════════════════════════════════════ */
const SERVICES = [
  {icon:"globe",title:"Business Websites",desc:"Professional, conversion-focused websites for local businesses and SMBs that build credibility and generate leads."},
  {icon:"building",title:"Corporate Websites",desc:"Enterprise-grade web presence for large organizations with multiple departments, products, and stakeholders."},
  {icon:"shop",title:"E-Commerce Websites",desc:"Fully functional online stores with product management, payment gateways, and a smooth shopping experience."},
  {icon:"layout",title:"Landing Pages",desc:"High-converting, single-purpose pages designed to capture leads and drive specific campaign goals."},
  {icon:"edit",title:"Website Redesign",desc:"Transform your outdated website into a modern, fast, and user-friendly platform that reflects your brand."},
  {icon:"settings",title:"Website Maintenance",desc:"Regular updates, security patches, performance optimization, and content changes to keep your site running perfectly."},
  {icon:"search",title:"SEO Ready Websites",desc:"Every website we build is optimized for search engines — structured data, fast load times, and clean code."},
  {icon:"monitor",title:"Web Applications",desc:"Custom web apps and portals — dashboards, booking systems, management tools — built to your exact specs."},
];

function Services() {
  useReveal();
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  return (
    <section id="services" className="section-light" style={{padding:"100px 40px"}}>
      <div style={{maxWidth:"1200px",margin:"0 auto"}}>
        <div className="reveal">
          <SectionTitle badge="Our Services" title="Everything Your Business Needs Online" sub="From design to development to ongoing support — we handle the complete digital lifecycle of your website." center/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"20px"}} className="grid-4">
          {SERVICES.map((s,i)=>(
            <div key={s.title} className="card-hover reveal" style={{
              animationDelay:`${i*.07}s`,transitionDelay:`${i*.07}s`,
              background:C.white,borderRadius:"16px",padding:"28px 24px",
              border:`1px solid ${C.gray100}`,position:"relative",overflow:"hidden",
            }}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,${C.accent},${C.accentLt})`}}/>
              <div style={{width:48,height:48,borderRadius:"12px",background:`${C.accent}12`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"16px"}}>
                <Icon name={s.icon} size={22} color={C.accent}/>
              </div>
              <h3 style={{fontWeight:700,fontSize:"16px",color:C.navy,marginBottom:"10px"}}>{s.title}</h3>
              <p style={{color:C.gray500,fontSize:"13.5px",lineHeight:1.7,marginBottom:"20px"}}>{s.desc}</p>
              <button onClick={()=>scrollTo("contact")} style={{
                display:"inline-flex",alignItems:"center",gap:"6px",
                color:C.accent,fontSize:"13px",fontWeight:600,background:"none",
                transition:"gap .2s",
              }} onMouseEnter={e=>e.currentTarget.style.gap="10px"} onMouseLeave={e=>e.currentTarget.style.gap="6px"}>
                Learn More <Icon name="arrow" size={14} color={C.accent}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   INDUSTRIES
══════════════════════════════════════════════════════════════════════ */
const INDUSTRIES = [
  {icon:"heart",name:"Healthcare",desc:"Hospitals, Clinics & Diagnostic Centers"},
  {icon:"graduation",name:"Education",desc:"Schools, Colleges & Coaching Institutes"},
  {icon:"home",name:"Real Estate",desc:"Builders, Brokers & Property Portals"},
  {icon:"coffee",name:"Restaurants",desc:"Cafes, Restaurants & Food Chains"},
  {icon:"building",name:"Hotels",desc:"Hotels, Resorts & Hospitality Groups"},
  {icon:"factory",name:"Manufacturing",desc:"Industries, Factories & Exporters"},
  {icon:"truck",name:"Transport",desc:"Logistics, Fleet & Courier Services"},
  {icon:"shop",name:"Retail",desc:"Stores, Supermarkets & Fashion Brands"},
  {icon:"zap",name:"Startups",desc:"Tech, Product & D2C Startups"},
  {icon:"briefcase",name:"Professional Services",desc:"CAs, Lawyers, Consultants & Agencies"},
];

function Industries() {
  useReveal();
  return (
    <section id="industries" className="section-dark" style={{padding:"100px 40px"}}>
      <div style={{maxWidth:"1200px",margin:"0 auto"}}>
        <div className="reveal">
          <SectionTitle light badge="Industries We Serve" title="Built for Every Business Sector" sub="We understand that every industry has unique needs. Our team has delivered websites across 10+ verticals." center/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"16px"}} className="grid-4">
          {INDUSTRIES.map((ind,i)=>(
            <div key={ind.name} className="reveal" style={{
              transitionDelay:`${i*.05}s`,
              background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",
              borderRadius:"16px",padding:"24px 18px",textAlign:"center",cursor:"default",
              transition:"all .3s ease",
            }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(37,99,235,.12)";e.currentTarget.style.borderColor=`${C.accent}40`}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.04)";e.currentTarget.style.borderColor="rgba(255,255,255,.07)"}}
            >
              <div style={{width:44,height:44,borderRadius:"12px",background:`${C.accent}20`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
                <Icon name={ind.icon} size={20} color={C.accentLt}/>
              </div>
              <div style={{color:C.white,fontWeight:700,fontSize:"14px",marginBottom:"4px"}}>{ind.name}</div>
              <div style={{color:"rgba(255,255,255,.4)",fontSize:"11.5px",lineHeight:1.5}}>{ind.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PORTFOLIO
══════════════════════════════════════════════════════════════════════ */
const PORTFOLIO = [
  {
    name:"Business Website Project",
    industry:"Local Business",
    desc:"A modern, conversion-focused website designed to showcase services, build local trust, and generate inbound leads for a Kolhapur-based business.",
    tech:["React","Node.js","Tailwind CSS","SEO"],
    color:C.accent,
    placeholder:true,
  },
  {
    name:"E-Commerce Platform",
    industry:"Retail / D2C",
    desc:"Full-featured online store with product management, Razorpay payment integration, mobile-first design, and admin dashboard.",
    tech:["Next.js","MongoDB","Razorpay","AWS"],
    color:"#10B981",
    placeholder:true,
  },
  {
    name:"Corporate Web Portal",
    industry:"Manufacturing",
    desc:"Multi-page corporate website with enquiry management, product catalogue, team profiles, and SEO-optimized content for a manufacturing company.",
    tech:["React","MySQL","PHP","WordPress"],
    color:C.gold,
    placeholder:true,
  },
];

function Portfolio() {
  useReveal();
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  return (
    <section id="portfolio" className="section-light" style={{padding:"100px 40px"}}>
      <div style={{maxWidth:"1200px",margin:"0 auto"}}>
        <div className="reveal">
          <SectionTitle badge="Our Work" title="Projects That Deliver Results" sub="A growing collection of websites and applications we've built for businesses across industries." center/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"28px",marginBottom:"48px"}} className="grid-3">
          {PORTFOLIO.map((p,i)=>(
            <div key={p.name} className="card-hover reveal" style={{transitionDelay:`${i*.1}s`,background:C.white,borderRadius:"20px",overflow:"hidden",border:`1px solid ${C.gray100}`}}>
              {/* Screenshot placeholder */}
              <div style={{
                height:"220px",background:`linear-gradient(135deg,${p.color}18,${p.color}08)`,
                display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                position:"relative",borderBottom:`1px solid ${C.gray100}`,
              }}>
                <div style={{width:70,height:70,borderRadius:"18px",background:`${p.color}20`,border:`2px solid ${p.color}30`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"12px"}}>
                  <Icon name="monitor" size={30} color={p.color}/>
                </div>
                <div style={{color:p.color,fontSize:"13px",fontWeight:600,opacity:.7}}>Project Screenshot</div>
                <div style={{position:"absolute",top:"14px",right:"14px"}}>
                  <span style={{background:`${p.color}20`,color:p.color,fontSize:"11px",fontWeight:600,padding:"4px 10px",borderRadius:"100px",border:`1px solid ${p.color}30`}}>{p.industry}</span>
                </div>
                {/* Add screenshot note */}
                <div style={{position:"absolute",bottom:"12px",left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,.5)",color:"rgba(255,255,255,.7)",fontSize:"10px",padding:"4px 10px",borderRadius:"100px",whiteSpace:"nowrap"}}>
                  ← Replace with actual screenshot →
                </div>
              </div>
              {/* Info */}
              <div style={{padding:"24px"}}>
                <h3 style={{fontWeight:700,fontSize:"17px",color:C.navy,marginBottom:"10px"}}>{p.name}</h3>
                <p style={{color:C.gray500,fontSize:"13.5px",lineHeight:1.7,marginBottom:"16px"}}>{p.desc}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"20px"}}>
                  {p.tech.map(t=>(
                    <span key={t} style={{background:C.gray50,color:C.gray700,fontSize:"11.5px",fontWeight:600,padding:"3px 10px",borderRadius:"100px",border:`1px solid ${C.gray100}`}}>{t}</span>
                  ))}
                </div>
                <button onClick={()=>scrollTo("contact")} style={{
                  width:"100%",padding:"11px",borderRadius:"8px",
                  background:`${p.color}12`,color:p.color,fontWeight:600,fontSize:"14px",
                  border:`1.5px solid ${p.color}30`,transition:"all .2s",
                }} onMouseEnter={e=>{e.currentTarget.style.background=p.color;e.currentTarget.style.color="#fff"}} onMouseLeave={e=>{e.currentTarget.style.background=`${p.color}12`;e.currentTarget.style.color=p.color}}>
                  Visit Website ↗
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Add project CTA */}
        <div className="reveal" style={{textAlign:"center",padding:"36px",background:C.white,borderRadius:"16px",border:`1.5px dashed ${C.gray100}`}}>
          <Icon name="plus" size={28} color={C.gray300}/>
          <p style={{color:C.gray300,fontSize:"14px",marginTop:"10px"}}>More projects will be added here. <span style={{color:C.accent,cursor:"pointer"}} onClick={()=>scrollTo("contact")}>Contact us to discuss your project.</span></p>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   WHY CHOOSE US
══════════════════════════════════════════════════════════════════════ */
const WHY = [
  {icon:"edit",title:"Custom Design",desc:"Every design is tailor-made for your brand — no templates, no cookie-cutter solutions."},
  {icon:"monitor",title:"Mobile Responsive",desc:"Pixel-perfect on every device: phones, tablets, laptops, and desktops."},
  {icon:"search",title:"SEO Friendly",desc:"Built with clean code, fast load times, and proper structure that search engines love."},
  {icon:"zap",title:"Fast Performance",desc:"Optimized assets, minimal bloat, and top PageSpeed scores for a snappy experience."},
  {icon:"shield",title:"Secure Development",desc:"SSL, best-practice security headers, safe form handling, and regular security updates."},
  {icon:"heart",title:"Ongoing Support",desc:"We're your long-term digital partner — available after launch for any updates or issues."},
];

function WhyUs() {
  useReveal();
  return (
    <section className="section-dark" style={{padding:"100px 40px"}}>
      <div style={{maxWidth:"1200px",margin:"0 auto"}}>
        <div className="reveal">
          <SectionTitle light badge="Why Choose Us" title="The New Binary Difference" sub="We don't just build websites. We build digital growth engines for your business." center/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"24px"}} className="grid-3">
          {WHY.map((w,i)=>(
            <div key={w.title} className="reveal" style={{
              transitionDelay:`${i*.08}s`,
              padding:"32px",borderRadius:"16px",
              background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",
              position:"relative",overflow:"hidden",
            }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=`${C.accent}50`;e.currentTarget.style.background="rgba(37,99,235,.08)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.07)";e.currentTarget.style.background="rgba(255,255,255,.04)"}}
            >
              <div style={{
                width:52,height:52,borderRadius:"14px",marginBottom:"20px",
                background:`linear-gradient(135deg,${C.accent}30,${C.accent}10)`,
                display:"flex",alignItems:"center",justifyContent:"center",
                border:`1px solid ${C.accent}30`,
              }}>
                <Icon name={w.icon} size={24} color={C.accentLt}/>
              </div>
              <h3 style={{color:C.white,fontWeight:700,fontSize:"17px",marginBottom:"10px"}}>{w.title}</h3>
              <p style={{color:"rgba(255,255,255,.55)",fontSize:"14px",lineHeight:1.7}}>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  {name:"Rajesh Patil",role:"Owner, Patil Medical Stores",text:"New Binary Solutions transformed our pharmacy's online presence completely. The website is clean, professional, and we've already seen more customers finding us through Google. Highly recommended!",rating:5,initials:"RP"},
  {name:"Priya Sharma",role:"Principal, Bright Future Academy",text:"We needed a school website that parents would trust immediately. The team at New Binary delivered exactly that — clean design, easy to navigate, and works perfectly on mobile. Excellent work!",rating:5,initials:"PS"},
  {name:"Amit Desai",role:"Director, Desai Properties",text:"Our real estate website looks absolutely premium now. Property listings load fast, the enquiry form works smoothly, and we get more genuine leads than before. Worth every rupee invested.",rating:5,initials:"AD"},
  {name:"Sneha Kulkarni",role:"Owner, Spice Garden Restaurant",text:"The online menu and table booking feature on our website has genuinely increased footfall. The design makes our food look so appealing! New Binary Solutions understands what local businesses need.",rating:5,initials:"SK"},
  {name:"Manoj Kumar",role:"MD, KumarTech Manufacturing",text:"Professional, on-time, and very patient with our requirements. The corporate website they built for our manufacturing company has helped us attract bigger clients from across Maharashtra.",rating:5,initials:"MK"},
];

function Testimonials() {
  const [active, setActive] = useState(0);
  useReveal();
  useEffect(()=>{
    const t = setInterval(()=>setActive(a=>(a+1)%TESTIMONIALS.length),4500);
    return ()=>clearInterval(t);
  },[]);

  const t = TESTIMONIALS[active];
  return (
    <section className="section-white" style={{padding:"100px 40px"}}>
      <div style={{maxWidth:"1200px",margin:"0 auto"}}>
        <div className="reveal">
          <SectionTitle badge="Client Reviews" title="Trusted by Businesses Across Maharashtra" sub="Don't just take our word for it — here's what our clients say." center/>
        </div>
        {/* Main testimonial */}
        <div style={{maxWidth:"720px",margin:"0 auto 40px",textAlign:"center",minHeight:"220px"}} key={active}>
          <div style={{display:"flex",justifyContent:"center",gap:"4px",marginBottom:"20px"}}>
            {[...Array(5)].map((_,i)=><Icon key={i} name="star" size={20} color={C.gold}/>)}
          </div>
          <Icon name="quote" size={36} color={`${C.accent}20`}/>
          <p style={{fontSize:"1.15rem",lineHeight:1.8,color:C.gray700,margin:"16px 0 24px",fontStyle:"italic",animation:"fadeUp .5s ease both"}}>
            "{t.text}"
          </p>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"12px"}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.accentLt})`,display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontWeight:700,fontSize:"14px"}}>
              {t.initials}
            </div>
            <div style={{textAlign:"left"}}>
              <div style={{fontWeight:700,fontSize:"15px",color:C.navy}}>{t.name}</div>
              <div style={{color:C.gray300,fontSize:"13px"}}>{t.role}</div>
            </div>
          </div>
        </div>
        {/* Dots */}
        <div style={{display:"flex",justifyContent:"center",gap:"8px",marginBottom:"48px"}}>
          {TESTIMONIALS.map((_,i)=>(
            <button key={i} onClick={()=>setActive(i)} style={{
              width: i===active?"28px":"8px",height:"8px",borderRadius:"100px",
              background: i===active?C.accent:C.gray100,border:"none",
              transition:"all .3s ease",
            }}/>
          ))}
        </div>
        {/* All testimonials grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"20px"}} className="grid-3">
          {TESTIMONIALS.slice(0,3).map((t,i)=>(
            <div key={t.name} className="reveal" style={{
              transitionDelay:`${i*.1}s`,
              background:C.offWhite,borderRadius:"16px",padding:"24px",
              border:`1px solid ${C.gray100}`,cursor:"pointer",
              outline: active===i?`2px solid ${C.accent}`:"none",
              transition:"outline .2s",
            }} onClick={()=>setActive(i)}>
              <div style={{display:"flex",gap:"3px",marginBottom:"12px"}}>
                {[...Array(5)].map((_,j)=><Icon key={j} name="star" size={14} color={C.gold}/>)}
              </div>
              <p style={{color:C.gray700,fontSize:"13px",lineHeight:1.7,marginBottom:"16px"}}>"{t.text.slice(0,120)}..."</p>
              <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.accentLt})`,display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontWeight:700,fontSize:"12px",flexShrink:0}}>
                  {t.initials}
                </div>
                <div>
                  <div style={{fontWeight:600,fontSize:"13px",color:C.navy}}>{t.name}</div>
                  <div style={{color:C.gray300,fontSize:"11px"}}>{t.role}</div>
                </div>
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
  const [form, setForm] = useState({name:"",email:"",phone:"",service:"",message:""});
  const [sent, setSent] = useState(false);
  useReveal();

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
    setTimeout(()=>setSent(false),4000);
    setForm({name:"",email:"",phone:"",service:"",message:""});
  };

  const inputStyle = {
    width:"100%",padding:"13px 16px",borderRadius:"10px",fontSize:"14px",
    background:"rgba(255,255,255,.06)",border:"1.5px solid rgba(255,255,255,.12)",
    color:C.white,outline:"none",transition:"border .2s",
    fontFamily:"'Inter',sans-serif",
  };

  return (
    <section id="contact" className="section-dark" style={{padding:"100px 40px"}}>
      <div style={{maxWidth:"1200px",margin:"0 auto"}}>
        <div className="reveal">
          <SectionTitle light badge="Get In Touch" title="Let's Build Your Dream Website" sub="Ready to grow your business online? Contact us today for a free consultation and project estimate." center/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1.6fr",gap:"60px",alignItems:"start"}} className="grid-2">
          {/* Left – Contact info */}
          <div className="reveal-left">
            {/* WhatsApp */}
            <a href="https://wa.me/919921889500" target="_blank" rel="noreferrer" style={{
              display:"flex",alignItems:"center",gap:"14px",
              background:"linear-gradient(135deg,#25D366,#128C7E)",
              borderRadius:"14px",padding:"20px 24px",marginBottom:"20px",
              color:C.white,transition:"transform .2s, box-shadow .2s",
              boxShadow:"0 8px 30px rgba(37,211,102,.25)",
            }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 16px 40px rgba(37,211,102,.35)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 8px 30px rgba(37,211,102,.25)"}}
            >
              <div style={{width:48,height:48,borderRadius:"12px",background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon name="whatsapp" size={24} color={C.white}/>
              </div>
              <div>
                <div style={{fontWeight:700,fontSize:"16px"}}>WhatsApp Us Now</div>
                <div style={{opacity:.8,fontSize:"13px",marginTop:"2px"}}>+91 99218 89500 · Quick reply guaranteed</div>
              </div>
            </a>

            {/* Info cards */}
            {[
              {icon:"phone",label:"Phone",value:"+91 99218 89500",href:"tel:+919921889500"},
              {icon:"mail",label:"Email",value:"newbinarysolutions@gmail.com",href:"mailto:newbinarysolutions@gmail.com"},
              {icon:"map",label:"Address",value:"Flat No.103, Atharva Skylines, Near Coforge Ltd, Ujalaiwadi, Kolhapur, MH 416004"},
            ].map(({icon,label,value,href})=>(
              <div key={label} style={{display:"flex",gap:"14px",padding:"16px",borderRadius:"12px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",marginBottom:"12px"}}>
                <div style={{width:40,height:40,borderRadius:"10px",background:`${C.accent}20`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Icon name={icon} size={18} color={C.accentLt}/>
                </div>
                <div>
                  <div style={{color:"rgba(255,255,255,.4)",fontSize:"11px",letterSpacing:".06em",textTransform:"uppercase",marginBottom:"3px"}}>{label}</div>
                  {href ? <a href={href} style={{color:C.white,fontSize:"14px",fontWeight:500}}>{value}</a> : <div style={{color:C.white,fontSize:"13.5px",lineHeight:1.6}}>{value}</div>}
                </div>
              </div>
            ))}

            {/* Social */}
            <div style={{marginTop:"24px"}}>
              <div style={{color:"rgba(255,255,255,.4)",fontSize:"12px",letterSpacing:".06em",textTransform:"uppercase",marginBottom:"12px"}}>Follow Us</div>
              <div style={{display:"flex",gap:"10px"}}>
                {[
                  {icon:"linkedin",href:"https://www.linkedin.com/company/newbinarysolutions/",color:"#0077B5"},
                  {icon:"facebook",href:"#",color:"#1877F2"},
                  {icon:"twitter",href:"#",color:"#1DA1F2"},
                  {icon:"whatsapp",href:"https://wa.me/919921889500",color:"#25D366"},
                ].map(({icon,href,color})=>(
                  <a key={icon} href={href} target="_blank" rel="noreferrer" style={{
                    width:44,height:44,borderRadius:"10px",
                    background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    transition:"all .2s",
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.background=color;e.currentTarget.style.borderColor=color}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.06)";e.currentTarget.style.borderColor="rgba(255,255,255,.1)"}}
                  >
                    <Icon name={icon} size={18} color={C.white}/>
                  </a>
                ))}
              </div>
            </div>

            {/* Map */}
            <div style={{marginTop:"24px",borderRadius:"14px",overflow:"hidden",border:"1px solid rgba(255,255,255,.1)"}}>
              <iframe
                title="New Binary Solutions Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3822.199712470126!2d74.2607938!3d16.6668867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc0ffb41ac35e65%3A0xbdaf3d39572ff9fc!2sBinary%20Solutions%20Pvt.Ltd%20Kolhapur!5e0!3m2!1sen!2sin!4v1736934637020!5m2!1sen!2sin"
                width="100%" height="200" style={{border:0,display:"block",filter:"invert(90%) hue-rotate(180deg)"}}
                allowFullScreen loading="lazy"
              />
            </div>
          </div>

          {/* Right – Form */}
          <div className="reveal-right">
            <form onSubmit={handleSubmit} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",borderRadius:"20px",padding:"36px"}}>
              <h3 style={{color:C.white,fontWeight:700,fontSize:"20px",marginBottom:"24px"}}>Send us a message</h3>
              {sent && (
                <div style={{background:"rgba(16,185,129,.15)",border:"1px solid rgba(16,185,129,.3)",borderRadius:"10px",padding:"14px 18px",color:"#34D399",marginBottom:"20px",display:"flex",alignItems:"center",gap:"10px"}}>
                  <Icon name="check" size={16} color="#34D399"/> Message sent! We'll get back to you within 24 hours.
                </div>
              )}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px",marginBottom:"14px"}}>
                <div>
                  <label style={{color:"rgba(255,255,255,.5)",fontSize:"12px",display:"block",marginBottom:"6px",letterSpacing:".04em"}}>Full Name *</label>
                  <input required style={inputStyle} placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                    onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.12)"}/>
                </div>
                <div>
                  <label style={{color:"rgba(255,255,255,.5)",fontSize:"12px",display:"block",marginBottom:"6px",letterSpacing:".04em"}}>Email Address *</label>
                  <input required type="email" style={inputStyle} placeholder="your@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                    onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.12)"}/>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px",marginBottom:"14px"}}>
                <div>
                  <label style={{color:"rgba(255,255,255,.5)",fontSize:"12px",display:"block",marginBottom:"6px",letterSpacing:".04em"}}>Phone Number</label>
                  <input style={inputStyle} placeholder="+91 98765 43210" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}
                    onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.12)"}/>
                </div>
                <div>
                  <label style={{color:"rgba(255,255,255,.5)",fontSize:"12px",display:"block",marginBottom:"6px",letterSpacing:".04em"}}>Service Needed</label>
                  <select style={{...inputStyle,cursor:"pointer"}} value={form.service} onChange={e=>setForm({...form,service:e.target.value})}
                    onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.12)"}>
                    <option value="" style={{background:C.navy}}>Select a service</option>
                    {["Business Website","Corporate Website","E-Commerce","Landing Page","Website Redesign","Maintenance","SEO","Web Application"].map(s=>(
                      <option key={s} value={s} style={{background:C.navy}}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{marginBottom:"20px"}}>
                <label style={{color:"rgba(255,255,255,.5)",fontSize:"12px",display:"block",marginBottom:"6px",letterSpacing:".04em"}}>Tell us about your project *</label>
                <textarea required rows={5} style={{...inputStyle,resize:"vertical",minHeight:"110px"}} placeholder="Describe your business, what kind of website you need, your budget, and timeline..."
                  value={form.message} onChange={e=>setForm({...form,message:e.target.value})}
                  onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.12)"}/>
              </div>
              <PrimaryBtn style={{width:"100%",justifyContent:"center",padding:"15px"}}>
                <Icon name="arrow" size={18} color={C.white}/>
                Send Message & Get Free Quote
              </PrimaryBtn>
              <p style={{color:"rgba(255,255,255,.3)",fontSize:"12px",textAlign:"center",marginTop:"12px"}}>We typically reply within 2–4 business hours.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════════════════ */
function Footer() {
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  return (
    <footer style={{background:"#050e1d",color:C.white,borderTop:"1px solid rgba(255,255,255,.06)"}}>
      {/* CTA Strip */}
      <div style={{background:`linear-gradient(135deg,${C.accent},${C.navyLt})`,padding:"48px 40px",textAlign:"center"}}>
        <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:"clamp(1.4rem,3vw,2.2rem)",marginBottom:"12px"}}>Ready to Get a Website That Works?</h2>
        <p style={{opacity:.85,fontSize:"15px",marginBottom:"24px"}}>Join 30+ satisfied businesses that trust New Binary Solutions.</p>
        <div style={{display:"flex",gap:"14px",justifyContent:"center",flexWrap:"wrap"}}>
          <PrimaryBtn onClick={()=>scrollTo("contact")} style={{background:"rgba(255,255,255,.15)",backdropFilter:"blur(10px)",boxShadow:"none",border:"1.5px solid rgba(255,255,255,.3)"}}>
            Get Free Consultation
          </PrimaryBtn>
          <a href="https://wa.me/919921889500" target="_blank" rel="noreferrer" style={{
            display:"inline-flex",alignItems:"center",gap:"8px",padding:"14px 28px",borderRadius:"8px",fontWeight:600,fontSize:"15px",
            background:"#25D366",color:C.white,
          }}>
            <Icon name="whatsapp" size={18} color={C.white}/> Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div style={{padding:"60px 40px 30px",maxWidth:"1200px",margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1.4fr",gap:"40px",marginBottom:"48px"}} className="grid-4">
          {/* Brand */}
          <div>
            <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px"}}>
              <div style={{width:38,height:38,borderRadius:"8px",background:`linear-gradient(135deg,${C.accent},${C.gold})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{color:C.white,fontWeight:800,fontSize:"16px"}}>NB</span>
              </div>
              <div>
                <div style={{color:C.white,fontWeight:700,fontSize:"15px"}}>New Binary Solutions</div>
                <div style={{color:C.accentLt,fontSize:"11px"}}>Web Design & Development</div>
              </div>
            </div>
            <p style={{color:"rgba(255,255,255,.4)",fontSize:"13.5px",lineHeight:1.8,marginBottom:"20px"}}>
              Kolhapur-based web design & development agency. We build fast, beautiful, conversion-focused websites for businesses across India.
            </p>
            <div style={{display:"flex",gap:"8px"}}>
              {[
                {icon:"linkedin",href:"https://www.linkedin.com/company/newbinarysolutions/"},
                {icon:"facebook",href:"#"},
                {icon:"twitter",href:"#"},
                {icon:"whatsapp",href:"https://wa.me/919921889500"},
              ].map(({icon,href})=>(
                <a key={icon} href={href} target="_blank" rel="noreferrer" style={{width:36,height:36,borderRadius:"8px",background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",transition:"background .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.background=C.accent}
                  onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.06)"}
                >
                  <Icon name={icon} size={16} color={C.white}/>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{color:C.white,fontWeight:700,fontSize:"14px",marginBottom:"16px",letterSpacing:".04em"}}>Quick Links</h4>
            {["Home","About","Services","Portfolio","Industries","Contact"].map(l=>(
              <button key={l} onClick={()=>scrollTo(l.toLowerCase())} style={{
                display:"block",background:"none",color:"rgba(255,255,255,.45)",fontSize:"13.5px",
                marginBottom:"10px",transition:"color .2s",textAlign:"left",
              }}
                onMouseEnter={e=>e.currentTarget.style.color=C.accentLt}
                onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.45)"}
              >{l}</button>
            ))}
          </div>

          {/* Services */}
          <div>
            <h4 style={{color:C.white,fontWeight:700,fontSize:"14px",marginBottom:"16px",letterSpacing:".04em"}}>Services</h4>
            {["Business Websites","Corporate Websites","E-Commerce","Landing Pages","Website Redesign","Maintenance","SEO Websites"].map(s=>(
              <div key={s} style={{color:"rgba(255,255,255,.45)",fontSize:"13px",marginBottom:"10px"}}>{s}</div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{color:C.white,fontWeight:700,fontSize:"14px",marginBottom:"16px",letterSpacing:".04em"}}>Contact Info</h4>
            {[
              {icon:"map",text:"Flat No.103, Atharva Skylines, Near Coforge Ltd, Ujalaiwadi, Kolhapur, MH 416004"},
              {icon:"phone",text:"+91 99218 89500"},
              {icon:"mail",text:"newbinarysolutions@gmail.com"},
            ].map(({icon,text})=>(
              <div key={text} style={{display:"flex",gap:"10px",marginBottom:"14px",alignItems:"flex-start"}}>
                <Icon name={icon} size={15} color={C.accentLt}/>
                <span style={{color:"rgba(255,255,255,.45)",fontSize:"13px",lineHeight:1.6}}>{text}</span>
              </div>
            ))}
            <div style={{marginTop:"16px",padding:"12px 14px",borderRadius:"10px",background:`${C.accent}15`,border:`1px solid ${C.accent}25`}}>
              <div style={{color:C.accentLt,fontSize:"12px",fontWeight:600,marginBottom:"2px"}}>Founder</div>
              <div style={{color:"rgba(255,255,255,.7)",fontSize:"13px"}}>Mr. Vishwajeet Khot</div>
              <div style={{color:C.accentLt,fontSize:"12px",fontWeight:600,marginTop:"8px",marginBottom:"2px"}}>Co-Founder</div>
              <div style={{color:"rgba(255,255,255,.7)",fontSize:"13px"}}>Mr. Deshbhushan Chougule</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{borderTop:"1px solid rgba(255,255,255,.07)",paddingTop:"24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px"}}>
          <div style={{color:"rgba(255,255,255,.3)",fontSize:"13px"}}>
            © {new Date().getFullYear()} New Binary Solutions, Kolhapur. All rights reserved.
          </div>
          <div style={{color:"rgba(255,255,255,.3)",fontSize:"13px"}}>
            Designed & Developed by{" "}
            <span style={{color:C.accentLt,fontWeight:600}}>New Binary Solutions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   FLOATING WHATSAPP BUTTON
══════════════════════════════════════════════════════════════════════ */
function FloatingWhatsApp() {
  return (
    <a href="https://wa.me/919921889500?text=Hi%2C%20I%20want%20to%20enquire%20about%20website%20development%20services."
      target="_blank" rel="noreferrer"
      style={{
        position:"fixed",bottom:"28px",right:"28px",zIndex:999,
        width:58,height:58,borderRadius:"50%",
        background:"linear-gradient(135deg,#25D366,#128C7E)",
        display:"flex",alignItems:"center",justifyContent:"center",
        boxShadow:"0 8px 30px rgba(37,211,102,.5)",
        transition:"transform .25s, box-shadow .25s",
      }}
      onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.12)";e.currentTarget.style.boxShadow="0 12px 40px rgba(37,211,102,.65)"}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 8px 30px rgba(37,211,102,.5)"}}
    >
      <Icon name="whatsapp" size={26} color={C.white}/>
    </a>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════════════════════════════════ */
export default function App() {
  useEffect(()=>{
    const style = document.createElement("style");
    style.textContent = globalCSS;
    document.head.appendChild(style);
    return ()=>document.head.removeChild(style);
  },[]);

  return (
    <>
      <Navbar/>
      <Hero/>
      <About/>
      <Services/>
      <Industries/>
      <Portfolio/>
      <WhyUs/>
      <Testimonials/>
      <Contact/>
      <Footer/>
      <FloatingWhatsApp/>
    </>
  );
}

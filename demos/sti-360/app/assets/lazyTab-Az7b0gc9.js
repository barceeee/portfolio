import{c as B,r,f as q,u as A,j as t}from"./index-D3Nqo7Vt.js";import{s as v}from"./supabase-DrDKJ_9s.js";import{f as G}from"./personName-D3dh8C-S.js";import{S as V}from"./search-x-C2jN_qZX.js";const F=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],X=B("user",F);function pt(i,s=!0){r.useEffect(()=>{if(!s)return;const o=()=>Object.values(i).forEach(a=>a().catch(()=>null));if("requestIdleCallback"in window){const a=window.requestIdleCallback(o,{timeout:3e3});return()=>window.cancelIdleCallback(a)}const n=window.setTimeout(o,1500);return()=>window.clearTimeout(n)},[i,s])}const S=[];function ft(i){return S.push(i),()=>{const s=S.lastIndexOf(i);s>=0&&S.splice(s,1)}}function $(i){const s=S[S.length-1];return s?(s(i),!1):(i(),!0)}function I(){return window.location.hash.replace("#","")}function bt(i,s){const o=(c=I())=>i.includes(c)?c:s,n=(c=I())=>c&&!i.includes(c)?c:null,[a,d]=r.useState(()=>o()),[p,f]=r.useState(()=>n()),l=r.useRef(a),g=r.useRef(p);r.useEffect(()=>{l.current=a},[a]),r.useEffect(()=>{g.current=p},[p]),r.useEffect(()=>{const c=()=>{const w=I(),u=o(w),k=n(w);if(u===l.current&&k===g.current)return;const z=g.current??l.current;$(()=>{k||history.replaceState(null,"",`#${u}`),r.startTransition(()=>{d(u),f(k)})})||history.pushState(null,"",`#${z}`)};return window.addEventListener("hashchange",c),()=>window.removeEventListener("hashchange",c)},[i,s]);const m=r.useCallback(c=>{$(()=>{window.location.hash=c,r.startTransition(()=>{d(c),f(null)})})},[]);return[a,m,p]}const K="sti360:sessionRole";`${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`;const J={get:i=>{try{return window.localStorage.getItem(i)}catch{return null}},set:(i,s)=>{try{window.localStorage.setItem(i,String(s))}catch{}},del:i=>{try{window.localStorage.removeItem(i)}catch{}},keys:()=>{try{return Object.keys(window.localStorage)}catch{return[]}}};function Q(i){i&&J.set(K,i)}const Z=6e4;let tt=0;function et(i){const s=r.useRef(!1),o=r.useRef(!1);r.useEffect(()=>{if(!i?.id)return;let n=!1,a=!1;const d=async()=>{if(n||a||s.current)return;a=!0;const{data:g,error:m}=await v.rpc("session_heartbeat");a=!1,!(n||m)&&(g==="replaced"?(s.current=!0,q(),await v.auth.signOut({scope:"local"})):g==="claimed"&&!o.current&&(o.current=!0,v.auth.signOut({scope:"others"}).catch(()=>null)))};d();const p=window.setInterval(d,Z),f=()=>{document.visibilityState==="visible"&&d()};document.addEventListener("visibilitychange",f),window.addEventListener("focus",d);const l=v.channel(`active-session-${i.id}-${++tt}`).on("postgres_changes",{event:"*",schema:"public",table:"user_active_sessions",filter:`user_id=eq.${i.id}`},()=>d()).subscribe();return()=>{n=!0,window.clearInterval(p),document.removeEventListener("visibilitychange",f),window.removeEventListener("focus",d),v.removeChannel(l)}},[i?.id])}function it(){document.documentElement.setAttribute("data-theme","light"),document.body.classList.add("sti-light"),document.body.classList.remove("sti-dark");try{localStorage.setItem("sti-theme","light")}catch{}}it();const U={marketing:{label:"Marketing Officer",color:"#ec4899",accent:"#f43f5e",glow:"#ec489933",lightBg:"#f4f5f7"},academic:{label:"Academic Head",color:"#6366f1",accent:"#8b5cf6",glow:"#6366f133",lightBg:"#f4f5f7"},guidance:{label:"Guidance Counselor",color:"#14b8a6",accent:"#06b6d4",glow:"#14b8a633",lightBg:"#f4f5f7"},student:{label:"Student",color:"#3b82f6",accent:"#6366f1",glow:"#3b82f633",lightBg:"#f4f5f7"},frontdesk:{label:"Front Desk",color:"#f59e0b",accent:"#f97316",glow:"#f59e0b33",lightBg:"#f4f5f7"}},st=`

  :root {
    --sti-shell-bg: #f3f4f6;
    --sti-shell-text: #111827;
    --sti-shell-text-soft: #1f2937;
    --sti-shell-text-muted: #374151;
    --sti-shell-text-faint: #6b7280;

    --sti-surface: rgba(255,255,255,.96);
    --sti-surface-sidebar: rgba(248,250,252,.97);
    --sti-surface-floating: rgba(15,23,42,.04);
    --sti-surface-floating-strong: rgba(15,23,42,.07);
    --sti-surface-hover: rgba(15,23,42,.05);
    --sti-surface-hover-soft: rgba(15,23,42,.035);

    --sti-border: rgba(15,23,42,.08);
    --sti-border-soft: rgba(15,23,42,.06);
    --sti-border-strong: rgba(15,23,42,.12);

    --sti-sidebar-item: #475569;
    --sti-sidebar-item-hover: #0f172a;
    --sti-sidebar-item-active: #111827;
    --sti-sidebar-active-bg: rgba(15,23,42,.06);
    --sti-sidebar-active-border: rgba(15,23,42,.12);
    --sti-sidebar-active-accent: #334155;

    --sti-dropdown-bg: rgba(255,255,255,.98);
    --sti-dropdown-border: rgba(15,23,42,.10);
    --sti-dropdown-shadow: 0 16px 40px rgba(15,23,42,.10), 0 0 0 1px rgba(15,23,42,.04);

    --sti-scrollbar: rgba(15,23,42,.14);

    --sti-modal-overlay: rgba(15,23,42,.40);
    --sti-modal-surface: rgba(255,255,255,.72);
    --sti-modal-border: rgba(255,255,255,.55);
    --sti-modal-shadow: 0 24px 60px rgba(15,23,42,.22), 0 0 0 1px rgba(255,255,255,.30), inset 0 1px 0 rgba(255,255,255,.80);

    --sti-danger: #dc2626;
    --sti-danger-bg: #dc2626;
    --sti-danger-bg-hover: #b91c1c;
    --sti-danger-border: rgba(220,38,38,.22);

    --admin-overlay: rgba(15,23,42,.16);
    --admin-surface-elevated: #ffffff;
    --admin-surface-alt: #f8fafc;
    --admin-surface-offset: #f1f5f9;
    --admin-border: rgba(15,23,42,.08);
    --admin-border-strong: rgba(15,23,42,.14);
    --admin-text-strong: #0f172a;
    --admin-text-body: #1f2937;
    --admin-text-muted: #374151;
    --admin-text-faint: #6b7280;
    --admin-primary: #2563eb;
    --admin-primary-hover: #1d4ed8;
    --admin-primary-soft: rgba(37,99,235,.10);
    --admin-primary-border: rgba(37,99,235,.22);
    --admin-success: #16a34a;
    --admin-success-soft: rgba(22,163,74,.10);
    --admin-success-border: rgba(22,163,74,.22);
    --admin-warning: #d97706;
    --admin-warning-soft: rgba(217,119,6,.10);
    --admin-warning-border: rgba(217,119,6,.22);
    --admin-danger: #dc2626;
    --admin-danger-soft: rgba(220,38,38,.10);
    --admin-danger-border: rgba(220,38,38,.22);
    --admin-shadow-card: 0 12px 30px rgba(15,23,42,.08);
  }

  :root[data-theme="light"] {
    --sti-shell-bg: #f3f4f6;
    --sti-shell-text: #111827;
    --sti-shell-text-soft: #1f2937;
    --sti-shell-text-muted: #374151;
    --sti-shell-text-faint: #6b7280;

    --sti-surface: rgba(255,255,255,.96);
    --sti-surface-sidebar: rgba(248,250,252,.97);
    --sti-surface-floating: rgba(15,23,42,.04);
    --sti-surface-floating-strong: rgba(15,23,42,.07);
    --sti-surface-hover: rgba(15,23,42,.05);
    --sti-surface-hover-soft: rgba(15,23,42,.035);

    --sti-border: rgba(15,23,42,.08);
    --sti-border-soft: rgba(15,23,42,.06);
    --sti-border-strong: rgba(15,23,42,.12);

    --sti-sidebar-item: #475569;
    --sti-sidebar-item-hover: #0f172a;
    --sti-sidebar-item-active: #111827;
    --sti-sidebar-active-bg: rgba(15,23,42,.06);
    --sti-sidebar-active-border: rgba(15,23,42,.12);
    --sti-sidebar-active-accent: #334155;

    --sti-dropdown-bg: rgba(255,255,255,.98);
    --sti-dropdown-border: rgba(15,23,42,.10);
    --sti-dropdown-shadow: 0 16px 40px rgba(15,23,42,.10), 0 0 0 1px rgba(15,23,42,.04);

    --sti-scrollbar: rgba(15,23,42,.14);

    --sti-modal-overlay: rgba(15,23,42,.40);
    --sti-modal-surface: rgba(255,255,255,.72);
    --sti-modal-border: rgba(255,255,255,.55);
    --sti-modal-shadow: 0 24px 60px rgba(15,23,42,.22), 0 0 0 1px rgba(255,255,255,.30), inset 0 1px 0 rgba(255,255,255,.80);

    --admin-overlay: rgba(15,23,42,.16);
    --admin-surface-elevated: #ffffff;
    --admin-surface-alt: #f8fafc;
    --admin-surface-offset: #f1f5f9;
    --admin-border: rgba(15,23,42,.08);
    --admin-border-strong: rgba(15,23,42,.14);
    --admin-text-strong: #0f172a;
    --admin-text-body: #1f2937;
    --admin-text-muted: #374151;
    --admin-text-faint: #6b7280;
    --admin-primary: #2563eb;
    --admin-primary-hover: #1d4ed8;
    --admin-primary-soft: rgba(37,99,235,.10);
    --admin-primary-border: rgba(37,99,235,.22);
    --admin-success: #16a34a;
    --admin-success-soft: rgba(22,163,74,.10);
    --admin-success-border: rgba(22,163,74,.22);
    --admin-warning: #d97706;
    --admin-warning-soft: rgba(217,119,6,.10);
    --admin-warning-border: rgba(217,119,6,.22);
    --admin-danger: #dc2626;
    --admin-danger-soft: rgba(220,38,38,.10);
    --admin-danger-border: rgba(220,38,38,.22);
    --admin-shadow-card: 0 12px 30px rgba(15,23,42,.08);
  }

  .sti-shell *, .sti-shell *::before, .sti-shell *::after { box-sizing: border-box; }
  .sti-shell {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--sti-shell-text);
  }

  .sti-shell ::-webkit-scrollbar { width: 5px; }
  .sti-shell ::-webkit-scrollbar-track { background: transparent; }
  .sti-shell ::-webkit-scrollbar-thumb { background: var(--sti-scrollbar); border-radius: 4px; }

  @keyframes sti-fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes sti-fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes sti-dropIn { from { opacity: 0; transform: translateY(-8px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes sti-popIn { from { opacity: 0; transform: scale(.93); } to { opacity: 1; transform: scale(1); } }

  .sti-anim-up { animation: sti-fadeUp .35s ease both; }
  .sti-anim-up-1 { animation: sti-fadeUp .35s .06s ease both; }
  .sti-anim-up-2 { animation: sti-fadeUp .35s .12s ease both; }
  .sti-anim-up-3 { animation: sti-fadeUp .35s .18s ease both; }
  .sti-anim-in { animation: sti-fadeIn .2s ease both; }

  .sti-wrap {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background: var(--sti-shell-bg);
    color: var(--sti-shell-text);
    transition: background .3s, color .3s;
  }

  .sti-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    z-index: 0;
  }

  /* ── Sidebar ──────────────────────────────────────────────────────────── */
  .sti-sidebar {
    width: 240px;
    min-width: 240px;
    height: 100vh;
    background: var(--sti-surface-sidebar);
    backdrop-filter: blur(16px) saturate(1.1);
    border-right: 1px solid var(--sti-border);
    display: flex;
    flex-direction: column;
    transition: width .25s ease, min-width .25s ease, background .3s, border-color .3s;
    position: relative;
    z-index: 20;
    overflow: hidden;
    flex-shrink: 0;
  }

  .sti-sidebar.collapsed { width: 64px; min-width: 64px; }

  .sti-sidebar-header {
    padding: 20px 16px 18px;
    border-bottom: 1px solid var(--sti-border-soft);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-shrink: 0;
    min-height: 64px;
    transition: border-color .3s;
  }

  .sti-sidebar.collapsed .sti-sidebar-header { justify-content: center; }

  .sti-logo-text {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: #2563eb;
    letter-spacing: -.5px;
    white-space: nowrap;
    line-height: 1;
    transition: opacity .2s, max-width .25s, color .3s;
    overflow: hidden;
    max-width: 160px;
  }

  .sti-logo-text span { color: #d97706; }
  .sti-sidebar.collapsed .sti-logo-text { opacity: 0; max-width: 0; }

  .sti-collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    border-radius: 8px;
    border: 1px solid var(--sti-border);
    background: #ffffff;
    cursor: pointer;
    transition: all .18s;
    color: var(--sti-shell-text-muted);
    font-size: 12px;
    font-weight: 700;
  }

  .sti-collapse-btn:hover {
    background: #f8fafc;
    border-color: var(--sti-border-strong);
    color: var(--sti-shell-text);
  }

  .sti-nav-section { flex: 1; overflow-y: auto; padding: 10px; }

  .sti-nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    border-radius: 10px;
    margin-bottom: 3px;
    cursor: pointer;
    color: var(--sti-sidebar-item);
    font-size: 14px;
    font-weight: 600;
    border: 1px solid transparent;
    transition: all .18s;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    background: transparent;
    width: 100%;
    text-align: left;
    font-family: 'DM Sans', sans-serif;
    line-height: 1.4;
  }

  .sti-nav-item:hover { background: var(--sti-surface-hover-soft); color: var(--sti-sidebar-item-hover); }

  /* The open page: a subtle outline in the logo's colours (STI blue → 360 orange). */
  .sti-nav-item.active {
    background:
      linear-gradient(#ffffff, #ffffff) padding-box,
      linear-gradient(135deg, rgba(37,99,235,.45), rgba(217,119,6,.45)) border-box;
    border-color: transparent;
    color: var(--sti-sidebar-item-active);
    font-weight: 700;
    box-shadow: 0 1px 2px rgba(15,23,42,.04);
  }

  .sti-nav-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 55%;
    background: var(--sti-sidebar-active-accent);
    border-radius: 0 3px 3px 0;
  }

  .sti-nav-icon {
    font-size: 16px;
    flex-shrink: 0;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sti-nav-label { font-size: 14px; transition: opacity .2s, width .25s; overflow: hidden; }
  .sti-sidebar.collapsed .sti-nav-label { opacity: 0; width: 0; }
  .sti-sidebar.collapsed .sti-nav-item { justify-content: center; padding: 11px 0; }

  /* ── Main area ────────────────────────────────────────────────────────── */
  .sti-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
  }

  .sti-topbar {
    height: 64px;
    min-height: 64px;
    background: var(--sti-surface);
    backdrop-filter: blur(14px) saturate(1.05);
    border-bottom: 1px solid var(--sti-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    flex-shrink: 0;
    z-index: 30;
    position: relative;
    transition: background .3s, border-color .3s;
    gap: 16px;
  }

  .sti-topbar-brand { display: flex; align-items: center; gap: 14px; min-width: 0; }

  .sti-topbar-brand-floating {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    border-radius: 999px;
    background: #ffffff;
    border: 1px solid var(--sti-border);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 8px 24px rgba(15,23,42,.06);
    flex-shrink: 0;
  }

  .sti-topbar-brand-logo {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: #2563eb;
    letter-spacing: -.5px;
    white-space: nowrap;
    line-height: 1;
  }

  .sti-topbar-brand-logo span { color: #d97706; }
  .sti-topbar-heading { min-width: 0; }

  .sti-topbar-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -.3px;
    transition: color .3s;
  }

  .sti-topbar-sub { font-size: 12px; color: #4b5563; margin-top: 2px; font-weight: 500; }
  .sti-topbar-right { display: flex; align-items: center; gap: 10px; position: relative; flex-shrink: 0; }

  .sti-profile-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 12px 6px 6px;
    border-radius: 28px;
    background: #ffffff;
    border: 1px solid var(--sti-border);
    cursor: pointer;
    transition: all .18s;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 1px 2px rgba(15,23,42,.03);
  }

  .sti-profile-btn:hover { background: #ffffff; border-color: var(--sti-border-strong); }
  .sti-profile-btn.open { border-color: color-mix(in srgb, var(--sti-rc) 35%, transparent); background: #ffffff; }


  .sti-user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    flex-shrink: 0;
    background: linear-gradient(135deg, var(--sti-rc), var(--sti-ra));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    box-shadow: 0 2px 8px var(--sti-rg);
  }

  .sti-user-info { text-align: left; }
  .sti-user-email { font-size: 13px; font-weight: 700; color: #111827; line-height: 1.3; transition: color .3s; }
  .sti-user-role { font-size: 11px; color: #4b5563; line-height: 1.3; font-weight: 500; }
  .sti-chevron { font-size: 9px; color: #6b7280; margin-left: 2px; transition: transform .2s; display: inline-block; }
  .sti-profile-btn.open .sti-chevron { transform: rotate(180deg); }

  /* ── Dropdown ─────────────────────────────────────────────────────────── */
  .sti-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 248px;
    z-index: 999;
    background: var(--sti-dropdown-bg);
    backdrop-filter: blur(20px) saturate(1.05);
    border: 1px solid var(--sti-dropdown-border);
    border-radius: 16px;
    box-shadow: var(--sti-dropdown-shadow);
    color: var(--sti-shell-text);
    overflow: hidden;
    animation: sti-dropIn .2s ease both;
    transition: background .3s, border-color .3s, box-shadow .3s, color .3s;
  }

  .sti-dropdown-accent { height: 2px; background: linear-gradient(90deg, #334155, #94a3b8); }

  .sti-dropdown-head {
    padding: 14px 14px 12px;
    border-bottom: 1px solid var(--sti-border-soft);
    display: flex;
    align-items: center;
    gap: 11px;
    transition: border-color .3s;
  }

  .sti-dropdown-av {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    flex-shrink: 0;
    background: linear-gradient(135deg, var(--sti-rc), var(--sti-ra));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    box-shadow: 0 3px 10px var(--sti-rg);
  }

  .sti-dropdown-em { font-size: 12px; font-weight: 700; color: #111827; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; transition: color .3s; }
  .sti-dropdown-rl { font-size: 10px; color: #4b5563; margin-top: 2px; font-weight: 500; }
  .sti-dropdown-list { padding: 6px; }

  .sti-dd-item {
    border-radius: 9px;
    color: #1f2937;
    border: none;
    background: transparent;
    transition: all .14s;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 9px 11px;
    font-size: 13px;
    font-weight: 600;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }

  .sti-dd-item:hover { background: var(--sti-surface-hover); color: #111827; }
  .sti-dd-icon { width: 15px; flex-shrink: 0; font-size: 13px; text-align: center; opacity: .75; }
  .sti-dd-divider { height: 1px; background: var(--sti-border-soft); margin: 4px 6px; }

  .sti-theme-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 11px;
    border-radius: 9px;
    transition: background .14s;
  }

  .sti-theme-row:hover { background: var(--sti-surface-hover-soft); }
  .sti-theme-left { display: flex; align-items: center; gap: 9px; }
  .sti-theme-label { font-size: 13px; font-weight: 600; color: #1f2937; }

  .sti-toggle {
    width: 40px;
    height: 22px;
    border-radius: 11px;
    flex-shrink: 0;
    background: rgba(15,23,42,.10);
    border: 1px solid var(--sti-border);
    position: relative;
    cursor: pointer;
    transition: background .25s, border-color .25s;
  }

  .sti-toggle.on { background: #334155; border-color: #334155; }

  .sti-toggle-thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #475569;
    transition: transform .22s cubic-bezier(.34,1.56,.64,1), background .22s;
    box-shadow: 0 1px 4px rgba(0,0,0,.18);
  }

  .sti-toggle.on .sti-toggle-thumb { transform: translateX(18px); background: #fff; }

  /* ── Bottom nav (mobile) ──────────────────────────────────────────────── */
  .sti-bottom-nav {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: rgba(255,255,255,.98);
    backdrop-filter: blur(16px) saturate(1.05);
    border-top: 1px solid var(--sti-border);
    height: 60px;
    transition: background .3s, border-color .3s;
  }

  /* Scrolls sideways when the tabs don't fit; the fades show there's more. */
  .sti-bottom-nav-inner {
    display: flex;
    align-items: stretch;
    height: 100%;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x proximity;
    scroll-padding: 0 24px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .sti-bottom-nav::before,
  .sti-bottom-nav::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 22px;
    z-index: 1;
    pointer-events: none;
    opacity: 0;
    transition: opacity .2s;
  }
  .sti-bottom-nav::before { left: 0;  background: linear-gradient(90deg, rgba(255,255,255,.98), rgba(255,255,255,0)); }
  .sti-bottom-nav::after  { right: 0; background: linear-gradient(270deg, rgba(255,255,255,.98), rgba(255,255,255,0)); }
  .sti-bottom-nav.more-left::before,
  .sti-bottom-nav.more-right::after { opacity: 1; }

  .sti-bottom-nav-inner::-webkit-scrollbar { display: none; }

  .sti-bottom-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    flex: 1 0 auto;
    min-width: 64px;
    padding: 6px 10px;
    white-space: nowrap;
    scroll-snap-align: start;
    cursor: pointer;
    color: #6b7280;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: .4px;
    text-transform: uppercase;
    border: none;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    transition: color .15s;
    position: relative;
  }

  .sti-bottom-nav-item.active { color: #111827; }

  .sti-bottom-nav-item.active::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20%;
    right: 20%;
    height: 2px;
    background: var(--sti-sidebar-active-accent);
    border-radius: 0 0 3px 3px;
  }

  .sti-bottom-nav-icon { font-size: 18px; display: flex; align-items: center; justify-content: center; }

  /* ── Sign-out modal — glassmorphism ───────────────────────────────────── */
  .sti-signout-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: var(--sti-modal-overlay);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: sti-fadeIn .18s ease both;
  }

  .sti-signout-modal {
    width: 100%;
    max-width: 340px;
    border-radius: 24px;
    /* NO overflow:hidden — it clips backdrop-filter in Chrome/Safari */
    background: var(--sti-modal-surface);
    backdrop-filter: blur(28px) saturate(1.6);
    -webkit-backdrop-filter: blur(28px) saturate(1.6);
    border: 1px solid var(--sti-modal-border);
    box-shadow: var(--sti-modal-shadow);
    animation: sti-popIn .26s cubic-bezier(.34,1.56,.64,1) both;
    /* Contain children within rounded corners without clipping backdrop-filter */
    isolation: isolate;
  }

  .sti-signout-modal-icon {
    margin: 24px 24px 0;
    width: 46px;
    height: 46px;
    border-radius: 14px;
    background: rgba(239,68,68,.12);
    border: 1px solid rgba(239,68,68,.22);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sti-signout-modal-icon svg {
    width: 21px;
    height: 21px;
    stroke: #dc2626;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .sti-signout-modal-title {
    font-size: 15px;
    font-weight: 700;
    color: #111827;
    margin: 12px 24px 4px;
    font-family: 'DM Sans', sans-serif;
  }

  .sti-signout-modal-desc {
    font-size: 13px;
    color: #4b5563;
    margin: 0 24px;
    line-height: 1.55;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
  }

  /* user pill — frosted */
  .sti-signout-modal-user {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 16px 24px;
    padding: 10px 12px;
    background: rgba(255,255,255,.45);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,.60);
    border-radius: 12px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.70);
  }

  .sti-signout-modal-av {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    flex-shrink: 0;
    background: linear-gradient(135deg, var(--sti-rc), var(--sti-ra));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    box-shadow: 0 2px 10px var(--sti-rg);
  }

  .sti-signout-modal-em { font-size: 12px; font-weight: 700; color: #111827; font-family: 'DM Sans', sans-serif; }
  .sti-signout-modal-rl { font-size: 11px; color: #4b5563; font-family: 'DM Sans', sans-serif; font-weight: 500; }

  .sti-signout-modal-btns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 0 24px 24px;
  }

  /* cancel — frosted glass */
  .sti-signout-modal-cancel {
    padding: 10px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }


  /* sign-out — solid red (intentionally opaque for emphasis) */
  .sti-signout-modal-go {
    padding: 10px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }


  /* ── Unknown tab (404 inside a dashboard) ─────────────────────────────── */
  .sti-notfound {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 440px;
    margin: 48px auto;
    padding: 36px 28px;
    background: var(--sti-surface);
    border: 1px solid var(--sti-border);
    border-radius: 16px;
    font-family: 'DM Sans', sans-serif;
  }
  .sti-notfound-icon { color: var(--sti-rc); margin-bottom: 16px; display: flex; }
  .sti-notfound-code {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--sti-shell-text-faint);
    margin-bottom: 6px;
  }
  .sti-notfound-title { font-size: 20px; font-weight: 800; color: var(--sti-shell-text); margin: 0 0 8px; }
  .sti-notfound-desc { font-size: 13px; line-height: 1.55; color: var(--sti-shell-text-muted); margin: 0 0 22px; }
  .sti-notfound-desc strong { color: var(--sti-shell-text); word-break: break-all; }
  .sti-notfound-btn {
    padding: 10px 18px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Content ──────────────────────────────────────────────────────────── */
  .sti-content {
    flex: 1;
    overflow-y: auto;
    padding: 28px 32px;
    background: var(--sti-shell-bg);
    position: relative;
    z-index: 1;
    transition: background .3s;
  }

  .sti-gc,
  .sti-tbl-card {
    background: #ffffff;
    border: 1px solid rgba(15,23,42,.08);
    box-shadow: 0 1px 2px rgba(15,23,42,.04);
  }

  .sti-kpi-label { color: #374151 !important; }
  .sti-kpi-value, .sti-tbl-title, .sti-td-name, .sti-topbar-title { color: #111827 !important; }
  .sti-empty, .sti-topbar-sub, .sti-user-role { color: #4b5563 !important; }

  .sti-badge.sti-b-gray { background: #e5e7eb !important; color: #1f2937 !important; border: 1px solid #d1d5db !important; }
  .sti-badge.sti-b-blue { background: #dbeafe !important; color: #1d4ed8 !important; border: 1px solid #bfdbfe !important; }
  .sti-progress-track { background: #e5e7eb !important; }
  .sti-tbl-wrap table th { color: #6b7280 !important; font-weight: 700 !important; }
  .sti-tbl-wrap table td { color: #1f2937 !important; }

  /* ── Dashboard design, every role (matches src/components/ui/dashboard) ──
     White cards with a 16px radius and a soft shadow, clear sentence-case
     section titles, and one table-header style. Visual only. */
  .sti-content .sti-gc,
  .sti-content .sti-tbl-card,
  .sti-content .sti-kpi {
    background: #ffffff !important;
    border: 1px solid rgba(148,163,184,.24) !important;
    border-radius: 16px !important;
    box-shadow: 0 1px 2px rgba(15,23,42,.04), 0 4px 16px rgba(15,23,42,.04) !important;
  }
  .sti-content .sti-tbl-title {
    font-size: 14px !important;
    font-weight: 800 !important;
    letter-spacing: 0 !important;
    text-transform: none !important;
    color: #0f172a !important;
  }
  .sti-content .sti-tbl-head { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
  .sti-content .sti-kpi-label {
    font-size: 12px !important;
    font-weight: 700 !important;
    letter-spacing: 0 !important;
    text-transform: none !important;
    color: #64748b !important;
  }
  .sti-content .sti-kpi-value { color: #0f172a !important; font-weight: 800 !important; letter-spacing: -.5px; }
  .sti-content .sti-tbl-wrap table th,
  .sti-content .fd-table th {
    background: #f8fafc;
    font-size: 11px !important;
    font-weight: 800 !important;
    letter-spacing: .06em !important;
    text-transform: uppercase;
    color: #64748b !important;
    border-bottom: 1px solid rgba(148,163,184,.24) !important;
  }
  .sti-content .sti-tbl-wrap table td,
  .sti-content .fd-table td {
    color: #334155 !important;
    border-bottom-color: #f1f5f9 !important;
  }
  .sti-content .sti-tbl-wrap table tbody tr:hover td,
  .sti-content .fd-table tbody tr:hover td { background: #f8fafc; }
  .sti-content .sti-empty { color: #64748b !important; }

  @media (max-width: 1024px) {
    .sti-sidebar { width: 64px; min-width: 64px; }
    .sti-sidebar .sti-nav-label { opacity: 0; width: 0; }
    .sti-sidebar .sti-nav-item { justify-content: center; padding: 11px 0; }
    .sti-sidebar .sti-logo-text { opacity: 0; max-width: 0; }
    .sti-sidebar .sti-sidebar-header { justify-content: center; }
    .sti-sidebar .sti-collapse-btn { display: none; }
    .sti-topbar { padding: 0 20px; }
    .sti-content { padding: 20px 24px; }
  }

  @media (max-width: 640px) {
    .sti-sidebar { display: none; }
    .sti-bottom-nav { display: block; }
    .sti-topbar {
      padding: 0 16px;
      height: 56px;
      min-height: 56px;
      background: var(--sti-surface) !important;
      border-bottom: 1px solid var(--sti-border-strong) !important;
    }
    .sti-topbar-brand { gap: 10px; }
    .sti-topbar-brand-floating { padding: 8px 12px; }
    .sti-topbar-brand-logo { font-size: 16px; }
    .sti-topbar-title { font-size: 15px; }
    .sti-topbar-sub { display: none; }
    .sti-user-info { display: none; }
    .sti-chevron { display: none; }
    .sti-profile-btn { padding: 4px; border-radius: 50%; gap: 0; }
    .sti-content { padding: 16px; padding-bottom: 76px; }
  }
`;function at(){const i=document.getElementById("sti-shell-styles");i&&i.remove();const s=document.createElement("style");s.id="sti-shell-styles",s.textContent=st,document.head.appendChild(s)}function rt({userInitial:i,userName:s,userEmail:o,onCancel:n,onConfirm:a}){return r.useEffect(()=>{const d=p=>p.key==="Escape"&&n();return window.addEventListener("keydown",d),()=>window.removeEventListener("keydown",d)},[n]),t.jsx("div",{className:"sti-signout-overlay",onMouseDown:n,children:t.jsxs("div",{className:"sti-signout-modal",onMouseDown:d=>d.stopPropagation(),children:[t.jsx("div",{className:"sti-signout-modal-icon",children:t.jsxs("svg",{viewBox:"0 0 24 24",children:[t.jsx("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}),t.jsx("polyline",{points:"16 17 21 12 16 7"}),t.jsx("line",{x1:"21",y1:"12",x2:"9",y2:"12"})]})}),t.jsx("p",{className:"sti-signout-modal-title",children:"Sign out of STI 360?"}),t.jsx("p",{className:"sti-signout-modal-desc",children:"You'll be logged out and redirected to the login page."}),t.jsxs("div",{className:"sti-signout-modal-user",children:[t.jsx("div",{className:"sti-signout-modal-av",children:i}),t.jsxs("div",{children:[t.jsx("div",{className:"sti-signout-modal-em",children:s}),t.jsx("div",{className:"sti-signout-modal-rl",children:o})]})]}),t.jsxs("div",{className:"sti-signout-modal-btns",children:[t.jsx("button",{className:"sti-signout-modal-cancel",onClick:n,children:"Cancel"}),t.jsx("button",{className:"sti-signout-modal-go","data-variant":"danger",onClick:a,children:"Sign out"})]})]})})}function ot({tab:i,homeLabel:s,onHome:o}){return t.jsxs("section",{className:"sti-notfound",role:"alert",children:[t.jsx("div",{className:"sti-notfound-icon",children:t.jsx(V,{size:44,strokeWidth:1.5})}),t.jsx("div",{className:"sti-notfound-code",children:"Error 404"}),t.jsx("h1",{className:"sti-notfound-title",children:"Page not found"}),t.jsxs("p",{className:"sti-notfound-desc",children:["This dashboard has no page called ",t.jsxs("strong",{children:["#",i]}),". The link may be old or mistyped."]}),t.jsx("button",{type:"button",className:"sti-notfound-btn",onClick:o,children:s?`Go to ${s}`:"Go to dashboard home"})]})}function gt({nav:i=[],activeNav:s,setActiveNav:o,title:n,user:a,children:d,role:p,onPersonalInfo:f,menuItems:l=[],headerExtras:g=null,notFound:m=null}){const c=A(),w=m?null:s,[u,k]=r.useState(!1),[z,y]=r.useState(!1),[W,R]=r.useState(!1),L=r.useRef(null),E=r.useRef(null),[_,H]=r.useState({left:!1,right:!1}),j=r.useCallback(()=>{const e=E.current;if(!e)return;const b=e.scrollLeft>2,x=e.scrollLeft+e.clientWidth<e.scrollWidth-2;H(h=>h.left===b&&h.right===x?h:{left:b,right:x})},[]);r.useEffect(()=>{const e=E.current;if(!e||typeof ResizeObserver>"u")return;const b=new ResizeObserver(j);return b.observe(e),()=>b.disconnect()},[j]),r.useEffect(()=>{const e=E.current;if(!e)return;const b=window.setTimeout(()=>{const x=e.querySelector(`[data-nav-key="${CSS.escape(String(s))}"]`);if(x&&e.scrollWidth>e.clientWidth){const h=x.offsetLeft-(e.clientWidth-x.offsetWidth)/2;e.scrollTo({left:Math.max(0,h),behavior:"smooth"})}j()},0);return()=>window.clearTimeout(b)},[s,j]);const P=(p||a?.user_metadata?.role||"marketing").toLowerCase(),C=U[P]||U.marketing,M=Array.isArray(i)&&i.length>0;r.useEffect(()=>{at()},[]),r.useEffect(()=>{const e=document.documentElement;e.style.setProperty("--sti-rc",C.color),e.style.setProperty("--sti-ra",C.accent),e.style.setProperty("--sti-rg",C.glow),e.style.setProperty("--sti-light-bg","#f4f5f7")},[C]),r.useEffect(()=>{const e=b=>{L.current&&!L.current.contains(b.target)&&y(!1)};return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[]),r.useEffect(()=>{Q(a?.role)},[a?.role]),et(a);const Y=async()=>{try{await v.from("audit_logs").insert({action:"logout",actor_email:a?.email??null,target_email:a?.email??null,details:`${a?.role??"User"} signed out`})}catch{}await v.auth.signOut({scope:"local"}),c("/",{replace:!0})},N=a?.email??"—",O=a?.full_name||a?.user_metadata?.full_name||"",D=G(O)||N,T=(String(O||N).trim()[0]??a?.email?.[0]??"U").toUpperCase();return t.jsxs("div",{className:"sti-shell sti-wrap light",children:[M&&t.jsxs("aside",{className:`sti-sidebar${u?" collapsed":""}`,children:[t.jsxs("div",{className:"sti-sidebar-header",children:[t.jsxs("div",{className:"sti-logo-text",children:["STI ",t.jsx("span",{children:"360"})]}),t.jsx("button",{className:"sti-collapse-btn","data-variant":"text",onClick:()=>k(e=>!e),title:u?"Expand":"Collapse",children:u?"→":"←"})]}),t.jsx("nav",{className:"sti-nav-section",children:i.map(e=>t.jsxs("button",{"data-variant":"text",className:`sti-nav-item${w===e.key?" active":""}`,onClick:()=>o(e.key),title:u?e.label:void 0,children:[t.jsx("span",{className:"sti-nav-icon",children:typeof e.icon=="function"||typeof e.icon=="object"?t.jsx(e.icon,{size:17,strokeWidth:1.75}):e.icon}),t.jsx("span",{className:"sti-nav-label",children:e.label})]},e.key))})]}),t.jsxs("div",{className:"sti-main",children:[t.jsxs("header",{className:"sti-topbar",children:[t.jsxs("div",{className:"sti-topbar-brand",children:[!M&&t.jsx("div",{className:"sti-topbar-brand-floating",children:t.jsxs("div",{className:"sti-topbar-brand-logo",children:["STI ",t.jsx("span",{children:"360"})]})}),t.jsxs("div",{className:"sti-topbar-heading",children:[t.jsx("div",{className:"sti-topbar-title",children:m?"Page not found":n}),t.jsx("div",{className:"sti-topbar-sub",children:"Overview & performance summary"})]})]}),t.jsxs("div",{className:"sti-topbar-right",ref:L,children:[g,t.jsxs("button",{"data-variant":"text",className:`sti-profile-btn${z?" open":""}`,onClick:()=>y(e=>!e),children:[t.jsx("div",{className:"sti-user-avatar",children:T}),t.jsxs("div",{className:"sti-user-info",children:[t.jsx("div",{className:"sti-user-email",children:D}),t.jsx("div",{className:"sti-user-role",children:N})]}),t.jsx("span",{className:"sti-chevron",children:"▼"})]}),z&&t.jsxs("div",{className:"sti-dropdown",children:[t.jsx("div",{className:"sti-dropdown-accent"}),t.jsxs("div",{className:"sti-dropdown-head",children:[t.jsx("div",{className:"sti-dropdown-av",children:T}),t.jsxs("div",{style:{minWidth:0},children:[t.jsx("div",{className:"sti-dropdown-em",children:D}),t.jsx("div",{className:"sti-dropdown-rl",children:N})]})]}),t.jsxs("div",{className:"sti-dropdown-list",children:[p==="student"&&f&&t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"sti-dd-divider"}),t.jsxs("button",{className:"sti-dd-item","data-variant":"text",onClick:()=>{y(!1),f()},children:[t.jsx("span",{className:"sti-dd-icon",style:{opacity:1,display:"inline-flex"},children:t.jsx(X,{size:15})}),"Personal Info"]})]}),l.length>0&&t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"sti-dd-divider"}),l.map(({key:e,label:b,icon:x,onClick:h})=>t.jsxs("button",{className:"sti-dd-item","data-variant":"text",onClick:()=>{y(!1),h()},children:[t.jsx("span",{className:"sti-dd-icon",style:{opacity:1,display:"inline-flex"},children:x&&t.jsx(x,{size:15})}),b]},e))]}),t.jsx("div",{className:"sti-dd-divider"}),t.jsxs("button",{className:"sti-dd-item","data-variant":"text",style:{color:"var(--sti-danger)"},onClick:()=>{y(!1),R(!0)},children:[t.jsx("span",{className:"sti-dd-icon",style:{opacity:1},children:"↪"}),"Sign out"]})]})]})]})]}),t.jsx("main",{className:"sti-content",children:m?t.jsx(ot,{tab:m,homeLabel:i.find(e=>e.key===s)?.label,onHome:()=>o(s)}):d})]}),M&&t.jsx("nav",{className:`sti-bottom-nav${_.left?" more-left":""}${_.right?" more-right":""}`,children:t.jsx("div",{className:"sti-bottom-nav-inner",ref:E,onScroll:j,children:i.map(e=>t.jsxs("button",{"data-variant":"text",className:`sti-bottom-nav-item${w===e.key?" active":""}`,"data-nav-key":e.key,onClick:()=>o(e.key),children:[t.jsx("span",{className:"sti-bottom-nav-icon",children:typeof e.icon=="function"||typeof e.icon=="object"?t.jsx(e.icon,{size:20,strokeWidth:w===e.key?2.2:1.75}):e.icon}),t.jsx("span",{children:e.label})]},e.key))})}),W&&t.jsx(rt,{userInitial:T,userName:D,userEmail:N,onCancel:()=>R(!1),onConfirm:Y})]})}function xt(i,s){const o=i[s];let n=null,a=null;const d=()=>a??=o().then(l=>(n=l.default,l),l=>{throw a=null,l});i[s]=d;const p=r.lazy(d);function f(l){const[g]=r.useState(()=>n??p);return t.jsx(g,{...l})}return f.displayName=s,f}function mt(i,s,o){return()=>{const n=window.location.hash.replace("#",""),a=s[n]??s[o];return a&&i[a]?i[a]().catch(()=>null):Promise.resolve()}}export{gt as D,X as U,bt as a,xt as l,mt as o,ft as r,pt as u};

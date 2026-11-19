import{c as se,r as t,j as e}from"./index-D3Nqo7Vt.js";import{u as re}from"./useUnsavedChangesWarning-DQK0q1Yo.js";import{I as E}from"./InlineIcon-CofZrkIi.js";import{M as oe,T as te,u as G,a as ae,L as M}from"./leaflet-CMmctJ4H.js";import{s as R}from"./supabase-DrDKJ_9s.js";import{U as ie}from"./UnsavedChangesDialog-DzvcVmKq.js";import{P as ne}from"./Portal-xrIY5Poj.js";import{u as le}from"./useConfirm-BMB5Yoa5.js";import{S as ce}from"./school-C0fqWDdn.js";import{G as de}from"./graduation-cap-CmvBn3tN.js";import{S as pe}from"./search-DK4dsrHa.js";import{M as H}from"./MarketingDashboard-Dfsic2jQ.js";import{T as fe}from"./triangle-alert-7Pgj65oc.js";import"./lazyTab-Az7b0gc9.js";import"./personName-D3dh8C-S.js";import"./search-x-C2jN_qZX.js";import"./useAuthGuard-6HeA-jon.js";import"./useCachedQuery-jsvtVpO2.js";import"./queryCache-w5HkREVU.js";import"./useLiveRefresh-CPJrLllO.js";import"./toast-ooe9A0-5.js";import"./target-ontmMqnS.js";import"./trending-up-CWQfvB36.js";const me=[["path",{d:"M10 18v-7",key:"wt116b"}],["path",{d:"M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z",key:"1m329m"}],["path",{d:"M14 18v-7",key:"vav6t3"}],["path",{d:"M18 18v-7",key:"aexdmj"}],["path",{d:"M3 22h18",key:"8prr45"}],["path",{d:"M6 18v-7",key:"1ivflk"}]],U=se("landmark",me);delete M.Icon.Default.prototype._getIconUrl;M.Icon.Default.mergeOptions({iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"});const xe="",he="https://api.geocodify.com/v2",ue=420;function ge(o){return`${he}/autocomplete?api_key=${xe}&q=${encodeURIComponent(o)}`}function be(o){return(o?.response?.features??[]).filter(a=>Array.isArray(a?.geometry?.coordinates)&&a.geometry.coordinates.length===2).map(a=>({label:a.properties?.label??a.properties?.name??"Unknown location",sublabel:[a.properties?.county,a.properties?.region,a.properties?.country].filter(Boolean).join(", "),lat:a.geometry.coordinates[1],lng:a.geometry.coordinates[0]}))}const ye=M.divIcon({html:`<div style="width:36px;height:48px;">
    <svg width="36" height="48" viewBox="0 0 36 48" xmlns="http://www.w3.org/2000/svg"
      style="filter:drop-shadow(0 4px 10px rgba(0,0,0,.35));">
      <path d="M18,44 C18,44 2,28 2,18 A16,16 0 1 1 34,18 C34,28 18,44 18,44 Z"
        fill="#2563eb" stroke="#93c5fd" stroke-width="2.5"/>
      <circle cx="18" cy="18" r="6" fill="#ffffff"/>
    </svg>
  </div>`,className:"",iconSize:[36,48],iconAnchor:[18,48]}),ve=[14.4168,121.0437],q={deped:{label:"DepEd",color:"#2563eb",bg:"rgba(37,99,235,.08)",border:"rgba(37,99,235,.25)"},ched:{label:"CHED",color:"#7c3aed",bg:"rgba(124,58,237,.08)",border:"rgba(124,58,237,.25)"}},je=["paranaque","parañaque","muntinlupa","san pedro"],I="Parañaque, Muntinlupa, or San Pedro";function ke(o="",a="",r=""){const x=[o,a,r].join(" ").toLowerCase();return je.some(l=>x.includes(l))}const we=`
  /* ── Overlay ── */
  .asm-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,.45); backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
  }

  /* ── Modal card ── */
  .asm-modal {
    background: #ffffff; border-radius: 20px;
    box-shadow: 0 24px 64px rgba(0,0,0,.18);
    width: 100%; max-height: calc(100vh - 32px); max-height: calc(100dvh - 32px);
    display: flex; flex-direction: column; overflow: hidden;
    transition: max-width .25s ease;
  }

  /* ── Header ── */
  .asm-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px 16px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0;
  }
  .asm-title-row { display: flex; align-items: center; gap: 10px; }
  .asm-title-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: #eff6ff; display: flex; align-items: center;
    justify-content: center; font-size: 18px;
  }
  .asm-title-text {
    font-size: 16px; font-weight: 700; color: #111827;
  }
  .asm-close-btn {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
  }

  /* ── Unsaved-changes badge in header ── */
  .asm-unsaved-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
    background: #fffbeb; border: 1px solid #fde68a; color: #92400e;
  }

  /* ── Step bar ── */
  .asm-step-bar {
    display: flex; align-items: center; gap: 4;
    padding: 12px 24px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0;
  }
  .asm-step-dot {
    width: 24px; height: 24px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; flex-shrink: 0;
    transition: background .2s, color .2s;
  }
  .asm-step-dot.active  { background: linear-gradient(135deg,#2563eb,#1d4ed8); color: #fff; }
  .asm-step-dot.done    { background: #d1fae5; color: #059669; }
  .asm-step-dot.inactive{ background: #f1f5f9; color: #9ca3af; }
  .asm-step-label       { font-size: 12px; font-weight: 600; color: #374151; }
  .asm-step-label-inactive { font-size: 12px; font-weight: 500; color: #9ca3af; }
  .asm-step-divider     { flex: 1; height: 2px; margin: 0 8px; border-radius: 2px; transition: background .3s; }

  /* ── Body ── */
  .asm-body {
    overflow-y: auto; flex: 1 1 auto; min-height: 0; overscroll-behavior: contain;
    padding: 20px 24px; display: flex; flex-direction: column; gap: 16px;
    scrollbar-width: thin; scrollbar-color: #e5e7eb transparent;
  }
  .asm-body::-webkit-scrollbar { width: 4px; }
  .asm-body::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }

  /* ── Footer ── */
  .asm-footer {
    display: flex; justify-content: flex-end; gap: 10px;
    padding: 16px 24px; border-top: 1px solid #f1f5f9; flex-shrink: 0;
  }

  /* ── Field & label ── */
  .asm-field { display: flex; flex-direction: column; gap: 6px; }
  .asm-label { font-size: 13px; font-weight: 600; color: #374151; }
  .asm-required { color: #ef4444; }
  .asm-optional { font-size: 12px; font-weight: 400; color: #9ca3af; margin-left: 4px; }

  /* ── Input / select ── */
  .asm-input, .asm-select {
    width: 100%; padding: 10px 14px; border-radius: 10px;
    border: 1.5px solid #e5e7eb; background: #fff;
    font-size: 14px; color: #111827; outline: none;
    transition: border-color .15s, box-shadow .15s;
    font-family: inherit;
  }
  .asm-input::placeholder { color: #9ca3af; }
  .asm-input:focus, .asm-select:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,.12);
  }
  .asm-input.error, .asm-select.error { border-color: #ef4444; }
  .asm-input.error:focus, .asm-select.error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,.12); }

  /* ── City display pill ── */
  .asm-city-display {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 10px;
    border: 1.5px solid #e5e7eb; background: #f8fafc;
    font-size: 14px; color: #374151; font-family: inherit;
  }
  .asm-city-display-icon { font-size: 13px; }

  /* ── Field error ── */
  .asm-field-error { font-size: 12px; color: #ef4444; }

  /* ── Error box ── */
  .asm-err-box {
    background: #fef2f2; border: 1px solid #fecaca;
    border-radius: 10px; padding: 10px 14px;
    font-size: 13px; color: #dc2626;
  }

  /* ── Info / warning / competition boxes ── */
  .asm-info {
    background: #eff6ff; border: 1px solid #bfdbfe;
    border-radius: 10px; padding: 10px 14px;
    font-size: 13px; color: #1d4ed8; line-height: 1.6;
  }
  .asm-warning {
    background: #fffbeb; border: 1px solid #fde68a;
    border-radius: 10px; padding: 10px 14px;
    font-size: 13px; color: #92400e; line-height: 1.6;
  }
  .asm-competition-notice {
    background: #fff5f5; border: 1px solid #fecaca;
    border-radius: 10px; padding: 10px 14px;
    font-size: 13px; color: #b91c1c; line-height: 1.6;
  }

  /* ── Level cards ── */
  .asm-level-card {
    display: flex; align-items: flex-start; gap: 10px; cursor: pointer;
    padding: 12px 14px; border-radius: 10px;
    border: 1.5px solid #e5e7eb; background: #fafafa;
    transition: border-color .15s, background .15s;
  }
  .asm-level-card:hover { background: #f1f5f9; border-color: #d1d5db; }
  .asm-level-card.active-secondary { border-color: #2563eb; background: #eff6ff; }
  .asm-level-card.active-college   { border-color: #ef4444; background: #fff5f5; }
  .asm-level-title { font-size: 13px; font-weight: 600; color: #111827; }
  .asm-level-sub   { font-size: 12px; color: #6b7280; margin-top: 2px; }

  /* ── Registry list ── */
  .asm-reg-list {
    max-height: 260px; overflow-y: auto;
    border: 1.5px solid #e5e7eb; border-radius: 10px; background: #fafafa;
    scrollbar-width: thin; scrollbar-color: #e5e7eb transparent;
  }
  .asm-reg-list::-webkit-scrollbar { width: 4px; }
  .asm-reg-list::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
  .asm-reg-row {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 10px 14px; cursor: pointer;
    border-bottom: 1px solid #f1f5f9; transition: background .1s;
  }
  .asm-reg-row:hover { background: #f1f5f9; }
  .asm-reg-row:last-of-type { border-bottom: none; }
  .asm-reg-name { font-size: 13px; font-weight: 600; color: #111827; }
  .asm-reg-meta { font-size: 11px; color: #6b7280; margin-top: 2px; }
  .asm-reg-count {
    padding: 6px 14px; font-size: 11px; color: #9ca3af; text-align: right;
    border-top: 1px solid #f1f5f9; letter-spacing: .3px;
    position: sticky; bottom: 0; background: #fafafa;
  }
  .asm-source-badge {
    display: inline-flex; align-items: center; padding: 2px 8px;
    border-radius: 20px; font-size: 10px; font-weight: 700; flex-shrink: 0; margin-top: 1px;
  }
  .asm-reg-selected {
    border-radius: 10px; padding: 12px 14px;
    border: 1.5px solid #86efac; background: #f0fdf4;
  }
  .asm-reg-unverified {
    border-radius: 10px; padding: 12px 14px;
    border: 1.5px solid #fde68a; background: #fffbeb;
    font-size: 13px; color: #92400e; line-height: 1.6;
  }

  /* ── Search input ── */
  .asm-search-wrap { position: relative; }
  .asm-search-input {
    width: 100%; box-sizing: border-box;
    padding: 10px 36px 10px 14px; border-radius: 10px;
    border: 1.5px solid #e5e7eb; background: #fff;
    font-size: 13px; color: #111827; outline: none; font-family: inherit;
    transition: border-color .15s, box-shadow .15s;
  }
  .asm-search-input::placeholder { color: #9ca3af; }
  .asm-search-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.12); }
  .asm-search-input.open { border-radius: 10px 10px 0 0; border-bottom-color: transparent; }
  .asm-search-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); }
  .asm-dropdown {
    position: absolute; top: 100%; left: 0; right: 0; z-index: 9999;
    background: #fff; border: 1.5px solid #e5e7eb; border-top: none;
    border-radius: 0 0 10px 10px; max-height: 220px; overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0,0,0,.1);
  }
  .asm-dropdown-row {
    padding: 10px 14px; cursor: pointer;
    border-bottom: 1px solid #f1f5f9; transition: background .1s;
  }
  .asm-dropdown-row:last-of-type { border-bottom: none; }
  .asm-dropdown-row:hover { background: #f8fafc; }
  .asm-dropdown-label { font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 2px; }
  .asm-dropdown-sub   { font-size: 11px; color: #6b7280; }
  .asm-dropdown-credit {
    padding: 5px 14px; font-size: 10px; color: #9ca3af; text-align: right;
    border-top: 1px solid #f1f5f9; letter-spacing: .3px;
  }

  /* ── Spinner ── */
  @keyframes asm-spin { to { transform: rotate(360deg); } }
  .asm-spinner {
    display: inline-block; width: 13px; height: 13px; border-radius: 50%;
    border: 2px solid #bfdbfe; border-top-color: #2563eb;
    animation: asm-spin .7s linear infinite; vertical-align: middle;
  }

  /* ── Coord pill ── */
  .asm-coord-pill {
    display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px;
    border-radius: 20px; font-size: 12px; font-weight: 600;
    background: #eff6ff; border: 1px solid #bfdbfe; color: #2563eb;
  }

  /* ── Preview box ── */
  .asm-preview-box {
    background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px 14px;
  }
  .asm-preview-label {
    font-size: 10px; font-weight: 700; letter-spacing: .8px;
    text-transform: uppercase; color: #9ca3af; margin-bottom: 8px;
  }

  /* ── Map ── */
  .asm-map .leaflet-container { border-radius: 10px; cursor: crosshair !important; }
  .asm-map .leaflet-control-zoom { margin: 8px !important; }
  .asm-map-hint {
    position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
    z-index: 999; background: rgba(255,255,255,.92); backdrop-filter: blur(6px);
    border: 1px solid #e5e7eb; border-radius: 20px; padding: 6px 14px;
    font-size: 12px; color: #6b7280; white-space: nowrap; pointer-events: none;
  }

  /* ── Hint text ── */
  .asm-hint { font-size: 12px; color: #9ca3af; }

  /* ── Buttons ── */
  .asm-btn-outline {
    padding: 9px 18px; font-size: 14px; font-weight: 600;
  }
  .asm-btn-primary {
    padding: 9px 20px; font-size: 14px; font-weight: 600;
    display: flex; align-items: center; gap: 6px;
  }
`;function Se(){if(document.getElementById("asm-styles-v1"))return;const o=document.createElement("style");o.id="asm-styles-v1",o.textContent=we,document.head.appendChild(o)}function Ne({position:o,onPlace:a}){return G({click:r=>a({lat:r.latlng.lat,lng:r.latlng.lng})}),o?e.jsx(ae,{position:[o.lat,o.lng],icon:ye}):null}function Ce({coords:o}){const a=G({});return t.useEffect(()=>{o&&a.flyTo([o.lat,o.lng],16,{duration:1.1})},[o,a]),null}function Ee({initialQuery:o,onPick:a}){const[r,x]=t.useState(""),[l,c]=t.useState([]),[_,u]=t.useState(!1),[k,w]=t.useState(!1),S=t.useRef(null);t.useRef(null),t.useEffect(()=>{o?.trim()&&(x(o),N(o));const p=f=>{S.current&&!S.current.contains(f.target)&&c([])};return document.addEventListener("mousedown",p),()=>document.removeEventListener("mousedown",p)},[]);async function N(p){if(!p||p.length<3){c([]);return}u(!0),w(!1);try{const f=await fetch(ge(p));if(!f.ok)throw new Error(`HTTP ${f.status}`);const n=await f.json();if(n?.meta?.status&&n.meta.status!==200)throw new Error(n.meta.message??"Geocodify error");c(be(n))}catch(f){console.error("[Geocodify]",f.message),w(!0),c([])}finally{u(!1)}}return e.jsxs("div",{className:"asm-warning",children:[e.jsx("strong",{children:"VITE_GEOCODIFY_API_KEY is not set."})," Add it to your ",e.jsx("code",{children:".env"}),"."," ","Get a free key at"," ",e.jsx("a",{href:"https://geocodify.com",target:"_blank",rel:"noreferrer",style:{color:"#92400e",fontWeight:700},children:"geocodify.com"}),"."]})}const _e=t.memo(function({initialName:a,onSelect:r,wantSecondary:x,wantCollege:l}){const[c,_]=t.useState(a??""),[u,k]=t.useState(null),[w,S]=t.useState(!1),N=t.useRef(null),p=t.useRef(null);t.useEffect(()=>{const i=setTimeout(()=>p.current?.focus(),80);return a?.trim().length>=3&&f(a),()=>clearTimeout(i)},[a]);async function f(i){if(!i||i.trim().length<3){k([]);return}S(!0);try{const{data:m,error:g}=await R.rpc("search_school_registry",{query:i.trim(),lim:50});if(g)throw g;const v=(m??[]).filter(C=>!(!ke(C.municipality,C.region,C.classification)||C.source==="deped"&&!x||C.source==="ched"&&!l));k(v)}catch(m){console.error("[RegistrySearch]",m.message),k([])}finally{S(!1)}}const n=t.useCallback(i=>{const m=i.target.value;_(m),clearTimeout(N.current),N.current=setTimeout(()=>f(m),ue)},[]),z=u?u.length:0;return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:10},children:[e.jsxs("div",{style:{position:"relative"},children:[e.jsx("input",{ref:p,className:"asm-search-input",value:c,onChange:n,placeholder:"Type to search DepEd / CHED registry…"}),e.jsx("div",{className:"asm-search-icon",children:w?e.jsx("span",{className:"asm-spinner"}):e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"#9ca3af",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"7"}),e.jsx("line",{x1:"16.5",y1:"16.5",x2:"22",y2:"22"})]})})]}),u!==null&&(u.length>0?e.jsxs("div",{className:"asm-reg-list",children:[u.map((i,m)=>{const g=q[i.source]??q.deped,v=[i.level,i.municipality,i.region].filter(Boolean).join(" · ");return e.jsxs("div",{className:"asm-reg-row",onClick:()=>r(i),children:[e.jsx("span",{className:"asm-source-badge",style:{color:g.color,background:g.bg,border:`1px solid ${g.border}`},children:g.label}),e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{className:"asm-reg-name",children:i.school_name}),v&&e.jsx("div",{className:"asm-reg-meta",children:v})]})]},m)}),e.jsx("div",{className:"asm-reg-count",children:`${z} result${z!==1?"s":""} found`})]}):!w&&c.trim().length>=3&&e.jsxs("div",{className:"asm-reg-unverified",children:[e.jsx(E,{icon:fe}),e.jsxs("strong",{children:['"',c.trim(),'"']})," was not found in the"," ",x&&l?"DepEd or CHED":x?"DepEd":"CHED"," registry for the ",I," area.",e.jsxs("div",{style:{marginTop:5,fontSize:12,color:"#92400e",lineHeight:1.6,opacity:.8},children:["Searching"," ",x&&l?"secondary (DepEd) and college (CHED) schools":x?"secondary schools (DepEd) only":"college / tertiary institutions (CHED) only"," ","in ",I,". Double-check the school name or confirm its location is within the service area."]})]}))]})});function ze(o){return o.offers_college&&!o.offers_secondary?"competitor":o.type}function De(o){const a=[];return o.offers_college&&a.push({text:"Competitor",color:"#ef4444"}),o.offers_secondary&&(o.type==="feeder"&&a.push({text:"Feeder School",color:"#2563eb"}),o.type==="non-feeder"&&a.push({text:"Non-Feeder",color:"#6b7280"})),a}const P={name:"",type:"feeder",city:"",offers_college:!1,offers_secondary:!0},T=[{n:1,label:"School Details"},{n:2,label:"Pin Location"}];function $(o,a,r){return!!(a||r||o.offers_college!==P.offers_college||o.offers_secondary!==P.offers_secondary||o.type!==P.type)}function es({onClose:o,onSaved:a}){const[r,x]=t.useState(P),[l,c]=t.useState({}),[_,u]=t.useState(!1),{confirm:k,confirmDialog:w}=le(),[S,N]=t.useState(!1),[p,f]=t.useState(1),[n,z]=t.useState(null),[i,m]=t.useState(null),[g,v]=t.useState(null),[C,F]=t.useState(!1);t.useEffect(()=>{Se()},[]),t.useEffect(()=>{const s=d=>{d.key==="Escape"&&D()};return document.addEventListener("keydown",s),()=>document.removeEventListener("keydown",s)});const O=$(r,n,i);re(O&&!_);const D=t.useCallback(()=>{$(r,n,i)?F(!0):o()},[r,n,i,o]),Y=t.useCallback(s=>{s.target===s.currentTarget&&D()},[D]),A=t.useCallback(s=>{const{name:d,value:h,type:L,checked:b}=s.target;x(j=>{const y={...j,[d]:L==="checkbox"?b:h};return d==="offers_college"&&!b&&!j.offers_secondary?{...y,offers_secondary:!0}:y}),c(j=>{const y={...j};return delete y[d],delete y.levels,delete y.type,delete y.city,delete y.registry,delete y.pin,y})},[]),B=t.useCallback(()=>{const s={};return!r.offers_college&&!r.offers_secondary&&(s.levels="Select at least one education level."),r.offers_secondary&&!r.type&&(s.type="Please select a relationship type."),c(d=>({...d,...s})),Object.keys(s).length===0},[r]),K=t.useCallback(()=>{if(B()){if(!n||!r.name.trim()){c(s=>({...s,registry:"Please search and verify a school from the registry first."}));return}c(s=>{const d={...s};return delete d.registry,delete d.submit,d}),f(2)}},[B,n,r.name]),V=t.useCallback(async s=>{const d=(s.school_name||"").trim();if(!d){c({registry:"Selected registry record has no school name."});return}N(!0);try{const{data:h,error:L}=await R.from("schools").select("id").ilike("name",d).maybeSingle();if(L)throw L;if(h){c({registry:"A school with this name already exists."});return}if(z(s),x(b=>({...b,name:d,city:s.municipality||b.city||""})),c(b=>{const j={...b};return delete j.registry,delete j.name,delete j.city,j}),s.lat&&s.lng){const b={lat:s.lat,lng:s.lng};m(b),v(b)}else m(null),v(null)}catch(h){c({registry:h.message||"Failed to verify school."})}finally{N(!1)}},[]),Z=t.useCallback(s=>{m(s),v(s)},[]),J=t.useCallback(s=>{m(s)},[]),Q=t.useCallback(async()=>{if(!n||!r.name.trim()){c({registry:"Please verify and select a school from the registry first."}),f(1);return}if(!i){c({pin:"Please drop a pin to confirm the school's exact location."});return}if(await k({title:"Add this school?",description:`${r.name.trim()} will be added to the feeder school network at the pinned location.`,confirmLabel:"Add School"})){u(!0);try{const s={name:r.name.trim(),type:ze(r),offers_college:r.offers_college,offers_secondary:r.offers_secondary,lat:i.lat,lng:i.lng,...r.city.trim()?{city:r.city.trim()}:{},...n?{registry_source:n.source,registry_id:n.registry_id}:{}},{data:d,error:h}=await R.from("schools").insert([s]).select().single();if(h)throw h;a(d)}catch(s){c({submit:s.message||"Failed to save school."}),f(1)}finally{u(!1)}}},[r,i,n,a,k]),W=De(r),X=[r.name,r.city,"Philippines"].filter(Boolean).join(", "),ee=r.offers_secondary;return e.jsx(ne,{children:e.jsxs(e.Fragment,{children:[w,e.jsx(ie,{open:C,onDiscard:o,onKeep:()=>F(!1)}),e.jsx("div",{className:"asm-overlay",onClick:Y,children:e.jsxs("div",{className:"asm-modal",style:{maxWidth:p===2?680:520},role:"dialog","aria-modal":"true","aria-label":"Add School",children:[e.jsxs("div",{className:"asm-header",children:[e.jsxs("div",{className:"asm-title-row",children:[e.jsx("div",{className:"asm-title-icon",children:e.jsx(ce,{size:20,strokeWidth:2})}),e.jsx("div",{children:e.jsx("div",{className:"asm-title-text",children:"Add School"})}),O&&e.jsx("span",{className:"asm-unsaved-badge",children:"● Unsaved changes"})]}),e.jsx("button",{className:"asm-close-btn",onClick:D,"aria-label":"Close",children:"✕"})]}),e.jsx("div",{className:"asm-step-bar",children:T.map((s,d)=>{const h=p>s.n?"done":p===s.n?"active":"inactive";return e.jsxs("div",{style:{display:"flex",alignItems:"center",flex:d<T.length-1?"unset":1},children:[e.jsx("div",{className:`asm-step-dot ${h}`,children:h==="done"?"✓":s.n}),e.jsx("span",{style:{marginLeft:6},className:h==="inactive"?"asm-step-label-inactive":"asm-step-label",children:s.label}),d<T.length-1&&e.jsx("div",{className:"asm-step-divider",style:{background:p>s.n?"#86efac":"#e5e7eb"}})]},s.n)})}),e.jsxs("div",{className:"asm-body",children:[p===1&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"asm-field",children:[e.jsxs("label",{className:"asm-label",children:["Education Level ",e.jsx("span",{className:"asm-required",children:"*"})]}),e.jsxs("div",{style:{display:"flex",gap:10},children:[e.jsxs("label",{className:`asm-level-card${r.offers_secondary?" active-secondary":""}`,style:{flex:1},children:[e.jsx("input",{type:"checkbox",name:"offers_secondary",checked:r.offers_secondary,onChange:A,style:{marginTop:2,accentColor:"#2563eb"}}),e.jsxs("div",{children:[e.jsxs("div",{className:"asm-level-title",children:[e.jsx(E,{icon:de}),"Secondary"]}),e.jsx("div",{className:"asm-level-sub",children:"Junior & Senior High School (DepEd)"})]})]}),e.jsxs("label",{className:`asm-level-card${r.offers_college?" active-college":""}`,style:{flex:1},children:[e.jsx("input",{type:"checkbox",name:"offers_college",checked:r.offers_college,onChange:A,style:{marginTop:2,accentColor:"#ef4444"}}),e.jsxs("div",{children:[e.jsxs("div",{className:"asm-level-title",children:[e.jsx(E,{icon:U}),"College / Tertiary"]}),e.jsx("div",{className:"asm-level-sub",children:"Bachelor's programs (CHED)"})]})]})]}),l.levels&&e.jsx("span",{className:"asm-field-error",children:l.levels})]}),ee&&e.jsxs("div",{className:"asm-field",children:[e.jsxs("label",{className:"asm-label",children:["Relationship Type ",e.jsx("span",{className:"asm-required",children:"*"})]}),e.jsxs("select",{className:`asm-select${l.type?" error":""}`,name:"type",value:r.type,onChange:A,children:[e.jsx("option",{value:"",children:"— select —"}),e.jsx("option",{value:"feeder",children:"Feeder School"}),e.jsx("option",{value:"non-feeder",children:"Non-Feeder"})]}),l.type&&e.jsx("span",{className:"asm-field-error",children:l.type})]}),r.offers_college&&e.jsxs("div",{className:"asm-competition-notice",children:[e.jsx(E,{icon:U}),e.jsx("strong",{children:"Competitor school"})," — this school offers college programs and will be tracked as a competitor regardless of secondary relationship."]}),e.jsxs("div",{className:"asm-field",children:[e.jsxs("label",{className:"asm-label",children:["Search & Verify School ",e.jsx("span",{className:"asm-required",children:"*"}),S&&e.jsx("span",{style:{marginLeft:8,fontWeight:400,color:"#6b7280",fontSize:12},children:"checking…"})]}),e.jsxs("div",{className:"asm-info",style:{marginBottom:8},children:[e.jsx(E,{icon:pe}),"Search for the school in the official DepEd / CHED registry. Only schools in ",e.jsx("strong",{children:I})," are shown."]}),n?e.jsx("div",{children:e.jsx("div",{className:"asm-reg-selected",children:e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:13,fontWeight:700,color:"#111827"},children:n.school_name}),e.jsx("div",{style:{fontSize:11,color:"#6b7280",marginTop:2},children:[n.level,n.municipality,n.region].filter(Boolean).join(" · ")})]}),e.jsx("button",{className:"asm-btn-outline",style:{fontSize:12,padding:"5px 12px"},onClick:()=>{z(null),x(s=>({...s,name:"",city:""})),m(null),v(null)},children:"Change"})]})})}):e.jsx(_e,{initialName:r.name,onSelect:V,wantSecondary:r.offers_secondary,wantCollege:r.offers_college}),l.registry&&e.jsx("span",{className:"asm-field-error",children:l.registry})]}),(n||W.length>0)&&e.jsxs("div",{className:"asm-preview-box",children:[e.jsx("div",{className:"asm-preview-label",children:"Preview"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"},children:[W.map(s=>e.jsx("span",{style:{display:"inline-flex",alignItems:"center",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,color:s.color,background:s.color+"14",border:`1px solid ${s.color}40`},children:s.text},s.text)),n&&e.jsx("span",{style:{fontSize:13,fontWeight:600,color:"#111827"},children:n.school_name})]})]}),l.submit&&e.jsx("div",{className:"asm-err-box",children:l.submit})]}),p===2&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"asm-info",children:[e.jsx(E,{icon:H}),"Drop a pin on the map to mark the school's exact location. You can also search by address."]}),e.jsxs("div",{className:"asm-field",children:[e.jsxs("label",{className:"asm-label",children:["Search Address ",e.jsx("span",{className:"asm-optional",children:"(optional)"})]}),e.jsx(Ee,{initialQuery:X,onPick:Z})]}),e.jsxs("div",{className:"asm-field",children:[e.jsxs("label",{className:"asm-label",children:["Pin Location ",e.jsx("span",{className:"asm-required",children:"*"}),i&&e.jsxs("span",{className:"asm-coord-pill",style:{marginLeft:8},children:[e.jsx(E,{icon:H}),i.lat.toFixed(5),", ",i.lng.toFixed(5)]})]}),e.jsxs("div",{className:"asm-map",style:{position:"relative",height:320,borderRadius:12,overflow:"hidden",border:"1.5px solid #e5e7eb"},children:[e.jsxs(oe,{center:i?[i.lat,i.lng]:ve,zoom:i?16:13,style:{height:"100%",width:"100%"},scrollWheelZoom:!0,children:[e.jsx(te,{url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}),e.jsx(Ne,{position:i,onPlace:J}),g&&e.jsx(Ce,{coords:g})]}),!i&&e.jsx("div",{className:"asm-map-hint",children:"Click on the map to drop a pin"})]}),l.pin&&e.jsx("span",{className:"asm-field-error",children:l.pin})]}),l.submit&&e.jsx("div",{className:"asm-err-box",children:l.submit})]})]}),e.jsx("div",{className:"asm-footer",children:p===1?e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"asm-btn-outline",onClick:D,children:"Cancel"}),e.jsxs("button",{className:"asm-btn-primary",onClick:K,children:["Next: Pin Location",e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"9 18 15 12 9 6"})})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"asm-btn-outline",onClick:()=>f(1),children:"← Back"}),e.jsx("button",{className:"asm-btn-primary",onClick:Q,disabled:_||!i,children:_?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"asm-spinner"})," Saving…"]}):"Save School"})]})})]})})]})})}export{es as default};

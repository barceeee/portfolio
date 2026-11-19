import{j as o}from"./index-D3Nqo7Vt.js";import{I as n}from"./inbox-XSloXYZI.js";const b=`
  :root, [data-theme="light"] {
    --gd-bg:             #ffffff;
    --gd-surface:        #f8fafc;
    --gd-border:         rgba(0,0,0,0.1);
    --gd-border-strong:  rgba(0,0,0,0.15);
    --gd-text:           #1e293b;
    --gd-text-muted:     #475569;
    --gd-text-faint:     #94a3b8;
    --gd-input-bg:       #ffffff;
    --gd-select-bg:      #ffffff;
    --gd-overlay:        rgba(0,0,0,0.45);
    --gd-modal-bg:       #ffffff;
    --gd-modal-border:   rgba(0,0,0,0.1);
    --gd-modal-shadow:   0 32px 64px rgba(0,0,0,0.18);
    --gd-modal-header-border: rgba(0,0,0,0.08);
    --gd-modal-title:    #1e293b;
    --gd-modal-close:    #64748b;
    --gd-empty-color:    #64748b;
    --gd-kpi-label:      #64748b;
    --gd-kpi-value:      #1e293b;
    --gd-kpi-sub:        #94a3b8;
    --gd-section-title:  #64748b;
    --gd-search-bg:      rgba(0,0,0,0.04);
    --gd-search-border:  rgba(0,0,0,0.1);
    --gd-search-text:    #1e293b;
    --gd-search-clear:   #94a3b8;
  }
`;if(typeof document<"u"&&!document.getElementById("gd-shared-theme-vars")){const e=document.createElement("style");e.id="gd-shared-theme-vars",e.textContent=b,document.head.appendChild(e)}function s({status:t}){const e={Employed:{bg:"rgba(20,184,166,.18)",color:"#2dd4bf",border:"rgba(20,184,166,.25)"},"Self-employed":{bg:"rgba(16,185,129,.18)",color:"#34d399",border:"rgba(16,185,129,.25)"},Unemployed:{bg:"rgba(245,158,11,.18)",color:"#fbbf24",border:"rgba(245,158,11,.25)"},"Further Studies":{bg:"rgba(99,102,241,.18)",color:"#a5b4fc",border:"rgba(99,102,241,.25)"},"Not Looking":{bg:"rgba(148,163,184,.12)",color:"#94a3b8",border:"rgba(148,163,184,.2)"}},r=e[t]||e["Not Looking"];return o.jsx("span",{style:{display:"inline-block",padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:r.bg,color:r.color,border:`1px solid ${r.border}`},children:t})}function f({message:t="No data found.",icon:e}){const r=typeof e=="function"||e&&e.$$typeof?e:n;return o.jsxs("div",{style:{textAlign:"center",padding:"3rem 1rem",color:"var(--gd-empty-color)"},children:[o.jsx("div",{style:{display:"flex",justifyContent:"center",marginBottom:10,opacity:.55},children:o.jsx(r,{size:32,strokeWidth:1.5})}),o.jsx("div",{style:{fontSize:13},children:t})]})}function c({name:t="?",size:e=34}){const r=["#14b8a6","#3b82f6","#8b5cf6","#ec4899","#f59e0b","#10b981"],d=r[(t.charCodeAt(0)||0)%r.length],a=t.split(" ").filter(Boolean).slice(0,2).map(g=>g[0].toUpperCase()).join("");return o.jsx("div",{style:{width:e,height:e,borderRadius:"50%",flexShrink:0,background:`${d}22`,border:`1.5px solid ${d}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:e*.34,fontWeight:700,color:d},children:a})}export{c as A,f as E,s as S};

import{r as d,b as v,j as e}from"./index-D3Nqo7Vt.js";import{X as h}from"./x-OoJvVtv7.js";const f="sti-mdl-styles",w=`
  .sti-mdl-overlay {
    position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
    padding: 16px; background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px);
    animation: sti-mdl-fade .15s ease both;
  }
  .sti-mdl-panel {
    display: flex; flex-direction: column; overflow: hidden; width: 100%;
    max-height: calc(100vh - 32px); max-height: calc(100dvh - 32px);
    background: var(--sti-mdl-bg, #ffffff); color: var(--sti-mdl-text, #0f172a);
    border: 1px solid var(--sti-mdl-border-color, rgba(15, 23, 42, 0.08)); border-radius: 16px;
    box-shadow: 0 24px 64px rgba(15, 23, 42, 0.22);
    animation: sti-mdl-pop .18s ease both;
  }
  .sti-mdl-header {
    flex: none; display: flex; align-items: center; gap: 12px; padding: 16px 22px;
    border-bottom: 1px solid var(--sti-mdl-divider, rgba(15, 23, 42, 0.08));
  }
  .sti-mdl-title { margin: 0; font-size: 17px; font-weight: 800; line-height: 1.3; color: var(--sti-mdl-title, #0f172a); }
  .sti-mdl-subtitle { margin: 2px 0 0; font-size: 12px; color: var(--sti-mdl-muted, #64748b); }
  .sti-mdl-close {
    flex: none; margin-left: auto; display: inline-flex; padding: 6px; border-radius: 8px;
    background: none; border: none; cursor: pointer; color: var(--sti-mdl-muted, #64748b);
  }
  .sti-mdl-close:hover:not(:disabled) { background: rgba(15, 23, 42, 0.06); color: var(--sti-mdl-title, #0f172a); }
  .sti-mdl-close:disabled { opacity: .4; cursor: not-allowed; }
  .sti-mdl-body { flex: 1 1 auto; min-height: 0; overflow: auto; overscroll-behavior: contain; padding: 18px 22px 20px; }
  .sti-mdl-footer {
    flex: none; display: flex; justify-content: flex-end; align-items: center; gap: 8px; flex-wrap: wrap;
    padding: 12px 22px; border-top: 1px solid var(--sti-mdl-divider, rgba(15, 23, 42, 0.08));
    background: var(--sti-mdl-footer-bg, #f8fafc);
  }
  @keyframes sti-mdl-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes sti-mdl-pop { from { opacity: 0; transform: translateY(6px) scale(.985); } to { opacity: 1; transform: none; } }
  @media (max-width: 640px) {
    .sti-mdl-overlay { padding: 10px; }
    .sti-mdl-panel { max-height: calc(100dvh - 20px); border-radius: 14px; }
    .sti-mdl-header, .sti-mdl-body, .sti-mdl-footer { padding-left: 16px; padding-right: 16px; }
  }
`;function j(){if(typeof document>"u"||document.getElementById(f))return;const t=document.createElement("style");t.id=f,t.textContent=w,document.head.appendChild(t)}let r=0,x="";function N({title:t,subtitle:n,onClose:o,closeDisabled:l=!1,width:a=640,footer:m,headerExtra:s,bodyStyle:u,zIndex:b=1e4,children:y}){j();const c=d.useId(),p=d.useRef(o);return d.useEffect(()=>{p.current=o}),d.useEffect(()=>(r===0&&(x=document.body.style.overflow,document.body.style.overflow="hidden"),r+=1,()=>{r-=1,r===0&&(document.body.style.overflow=x)}),[]),d.useEffect(()=>{const i=g=>{g.key!=="Escape"||l||document.querySelector(".sti-ud-overlay")||p.current?.()};return window.addEventListener("keydown",i),()=>window.removeEventListener("keydown",i)},[l]),v.createPortal(e.jsx("div",{className:"sti-mdl-overlay",style:{zIndex:b},onMouseDown:i=>{i.target===i.currentTarget&&!l&&o?.()},children:e.jsxs("div",{className:"sti-mdl-panel",role:"dialog","aria-modal":"true","aria-labelledby":c,style:{maxWidth:typeof a=="number"?`${a}px`:a},children:[e.jsxs("div",{className:"sti-mdl-header",children:[e.jsxs("div",{style:{minWidth:0},children:[e.jsx("h3",{id:c,className:"sti-mdl-title",children:t}),n&&e.jsx("p",{className:"sti-mdl-subtitle",children:n})]}),s&&e.jsx("div",{style:{marginLeft:"auto",display:"flex",alignItems:"center",gap:8},children:s}),e.jsx("button",{type:"button",className:"sti-mdl-close","data-variant":"text",style:s?{marginLeft:4}:void 0,onClick:o,disabled:l,"aria-label":"Close",children:e.jsx(h,{size:18})})]}),e.jsx("div",{className:"sti-mdl-body",style:u,children:y}),m&&e.jsx("div",{className:"sti-mdl-footer",children:m})]})}),document.body)}export{N as M};

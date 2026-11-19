import{r as b,b as g,j as t}from"./index-D3Nqo7Vt.js";import{T as x}from"./triangle-alert-7Pgj65oc.js";const r="sti-unsaved-dialog-styles-v4",m=`
  /* ── Overlay — matches .sti-signout-overlay ── */
  .sti-ud-overlay {
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: rgba(15, 23, 42, 0.40);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: sti-ud-fadeIn 0.18s ease both;
  }

  @keyframes sti-ud-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ── Card — matches .sti-signout-modal ── */
  .sti-ud-card {
    width: 100%;
    max-width: 340px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(28px) saturate(1.6);
    -webkit-backdrop-filter: blur(28px) saturate(1.6);
    border: 1px solid rgba(255, 255, 255, 0.55);
    box-shadow:
      0 24px 60px rgba(15, 23, 42, 0.22),
      0 0 0 1px rgba(255, 255, 255, 0.30),
      inset 0 1px 0 rgba(255, 255, 255, 0.80);
    animation: sti-ud-popIn 0.26s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    isolation: isolate;
  }

  @keyframes sti-ud-popIn {
    from { opacity: 0; transform: scale(0.93); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* ── Icon wrap — matches .sti-signout-modal-icon ── */
  .sti-ud-card[data-tone="neutral"] .sti-ud-icon-wrap {
    color: #2563eb;
    background: rgba(37, 99, 235, 0.10);
    border-color: rgba(37, 99, 235, 0.22);
  }

  .sti-ud-icon-wrap {
    color: #dc2626;
    margin: 24px 24px 0;
    width: 46px;
    height: 46px;
    border-radius: 14px;
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.22);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  /* ── Title — matches .sti-signout-modal-title ── */
  .sti-ud-title {
    font-size: 15px;
    font-weight: 700;
    color: #111827;
    margin: 12px 24px 4px;
    font-family: 'DM Sans', sans-serif;
    line-height: 1.3;
  }

  /* ── Body — matches .sti-signout-modal-desc ── */
  .sti-ud-body {
    font-size: 13px;
    color: #4b5563;
    margin: 0 24px 20px;
    line-height: 1.55;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
  }

  /* ── Buttons — matches .sti-signout-modal-btns grid ── */
  .sti-ud-footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 0 24px 24px;
  }

  .sti-ud-btn-keep,
  .sti-ud-btn-discard {
    padding: 10px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }
`;function f(){if(document.getElementById(r))return;const e=document.createElement("style");e.id=r,e.textContent=m,document.head.appendChild(e)}function w({open:e,onDiscard:o,onKeep:a,icon:n=t.jsx(x,{size:24,strokeWidth:1.8}),title:d="Discard unsaved changes?",description:l="You have unsaved changes. If you close now, all your edits will be lost.",confirmLabel:c="Discard & Close",cancelLabel:u="Keep Editing",tone:s="danger"}){return f(),b.useEffect(()=>{if(!e)return;const i=p=>{p.key==="Escape"&&a()};return window.addEventListener("keydown",i),()=>window.removeEventListener("keydown",i)},[e,a]),e?g.createPortal(t.jsx("div",{className:"sti-ud-overlay",onMouseDown:i=>{i.target===i.currentTarget&&a()},children:t.jsxs("div",{className:"sti-ud-card",role:"alertdialog","aria-modal":"true","aria-labelledby":"sti-ud-title","data-tone":s,onMouseDown:i=>i.stopPropagation(),children:[t.jsx("div",{className:"sti-ud-icon-wrap",children:n}),t.jsx("p",{className:"sti-ud-title",id:"sti-ud-title",children:d}),t.jsx("p",{className:"sti-ud-body",children:l}),t.jsxs("div",{className:"sti-ud-footer",children:[t.jsx("button",{className:"sti-ud-btn-keep",onClick:a,children:u}),t.jsx("button",{className:"sti-ud-btn-discard","data-variant":s==="danger"?"danger":void 0,onClick:o,autoFocus:s!=="danger",children:c})]})]})}),document.body):null}export{w as U};

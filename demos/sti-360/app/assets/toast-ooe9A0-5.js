const v="sti-toast-styles",b="sti-toast-portal";const E=`
  #${b} {
    position: fixed; right: 24px; bottom: 24px; z-index: 1000000;
    display: flex; flex-direction: column-reverse; gap: 10px; pointer-events: none;
  }
  .sti-t {
    pointer-events: auto; position: relative; overflow: hidden; display: flex; align-items: flex-start; gap: 10px;
    min-width: 264px; max-width: 360px; padding: 12px 14px 14px; border-radius: 12px;
    background: #ffffff; border: 1px solid rgba(15,23,42,0.1); box-shadow: 0 10px 30px rgba(15,23,42,0.14);
    font-family: inherit; font-size: 13px; line-height: 1.45; color: #0f172a;
    animation: sti-t-in .25s cubic-bezier(.22,1,.36,1) both;
  }
  .sti-t.sti-t-out { animation: sti-t-out .2s ease-in both; }
  .sti-t-icon {
    flex: none; width: 22px; height: 22px; border-radius: 50%; margin-top: 1px;
    display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800;
  }
  .sti-t-success { border-left: 4px solid #16a34a; } .sti-t-success .sti-t-icon { background: #dcfce7; color: #15803d; }
  .sti-t-error   { border-left: 4px solid #dc2626; } .sti-t-error   .sti-t-icon { background: #fee2e2; color: #b91c1c; }
  .sti-t-warning { border-left: 4px solid #d97706; } .sti-t-warning .sti-t-icon { background: #fef3c7; color: #b45309; }
  .sti-t-info    { border-left: 4px solid #2563eb; } .sti-t-info    .sti-t-icon { background: #dbeafe; color: #1d4ed8; }
  .sti-t-body { flex: 1; min-width: 0; }
  .sti-t-title { font-weight: 700; color: #0f172a; }
  .sti-t-msg { color: #475569; margin-top: 1px; word-break: break-word; }
  .sti-t-count {
    margin-left: 6px; padding: 0 6px; border-radius: 999px; font-size: 11px; font-weight: 700;
    background: rgba(15,23,42,0.08); color: #475569; vertical-align: 1px;
  }
  .sti-t-close {
    flex: none; background: none; border: none; cursor: pointer; padding: 2px; margin-top: -1px;
    color: #94a3b8; font-size: 14px; line-height: 1;
  }
  .sti-t-close:hover { color: #0f172a; }
  .sti-t-bar { position: absolute; left: 0; bottom: 0; height: 3px; background: currentColor; opacity: .25; animation: sti-t-bar linear forwards; }
  .sti-t-success .sti-t-bar { color: #16a34a; } .sti-t-error .sti-t-bar { color: #dc2626; }
  .sti-t-warning .sti-t-bar { color: #d97706; } .sti-t-info  .sti-t-bar { color: #2563eb; }
  @keyframes sti-t-in  { from { opacity: 0; transform: translateX(16px) scale(.97); } to { opacity: 1; transform: none; } }
  @keyframes sti-t-out { to { opacity: 0; transform: translateX(12px) scale(.97); } }
  @keyframes sti-t-bar { from { width: 100%; } to { width: 0; } }
  @media (max-width: 640px) {
    #${b} { left: 12px; right: 12px; bottom: 12px; }
    .sti-t { min-width: 0; max-width: none; }
  }
`,C={success:"✓",error:"!",warning:"!",info:"i"},a=new Map;function S(){if(typeof document>"u")return null;if(!document.getElementById(v)){const e=document.createElement("style");e.id=v,e.textContent=E,document.head.appendChild(e)}let t=document.getElementById(b);return t||(t=document.createElement("div"),t.id=b,t.setAttribute("aria-live","polite"),document.body.appendChild(t)),t}function u(t,e){return t.textContent=e==null?"":String(e),t}function f(t,e,o,{duration:c=4500}={}){const h=S();if(!h)return;const x=`${t}|${e??""}|${o??""}`,k=i=>{const p=i.el.querySelector(".sti-t-bar");p.style.animation="none",p.offsetWidth,p.style.animation="",p.style.animationDuration=`${c}ms`},l=i=>{clearTimeout(i.timer),a.get(i.key)===i&&a.delete(i.key),i.el.classList.add("sti-t-out"),i.el.addEventListener("animationend",()=>i.el.remove(),{once:!0})},n=a.get(x);if(n){n.count+=1;let i=n.el.querySelector(".sti-t-count");i||(i=document.createElement("span"),i.className="sti-t-count",(n.el.querySelector(".sti-t-title")||n.el.querySelector(".sti-t-msg")).appendChild(i)),i.textContent=`×${n.count}`,clearTimeout(n.timer),n.timer=setTimeout(()=>l(n),c),k(n);return}const s=document.createElement("div");s.className=`sti-t sti-t-${t}`,s.setAttribute("role",t==="error"?"alert":"status");const w=u(document.createElement("div"),C[t]||"i");w.className="sti-t-icon";const d=document.createElement("div");d.className="sti-t-body",e&&d.appendChild(Object.assign(u(document.createElement("div"),e),{className:"sti-t-title"})),o&&d.appendChild(Object.assign(u(document.createElement("div"),o),{className:"sti-t-msg"}));const r=u(document.createElement("button"),"✕");r.className="sti-t-close",r.type="button",r.setAttribute("aria-label","Dismiss");const g=document.createElement("div");g.className="sti-t-bar",g.style.animationDuration=`${c}ms`,s.append(w,d,r,g);const m={key:x,el:s,count:1,timer:null};a.set(x,m),r.addEventListener("click",()=>l(m)),m.timer=setTimeout(()=>l(m),c),h.appendChild(s);const y=[...a.values()];y.length>4&&l(y[0])}const I={success:(t,e,o)=>f("success",t,e,o),error:(t,e,o)=>f("error",t,e,o),warning:(t,e,o)=>f("warning",t,e,o),info:(t,e,o)=>f("info",t,e,o)};export{I as t};

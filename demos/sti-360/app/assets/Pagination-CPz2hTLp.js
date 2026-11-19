import{c as S,r as j,j as a}from"./index-D3Nqo7Vt.js";const k=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],C=S("chevron-down",k);const I=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],L=S("chevron-left",I);const _=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],E=S("chevron-right",_),$=[10,25,50,100];function K(i,{pageSize:c=10,resetOn:e=[]}={}){const n=Array.isArray(i)?i:[],[s,l]=j.useState(1),[r,u]=j.useState(c),h=JSON.stringify(e),[y,f]=j.useState(h);h!==y&&(f(h),l(1));const x=n.length,b=Math.max(1,Math.ceil(x/r)),g=Math.min(s,b),d=(g-1)*r,o=Math.min(d+r,x);return{items:n.slice(d,o),page:g,setPage:l,pageSize:r,setPageSize:m=>{u(m),l(1)},total:x,totalPages:b,start:d,end:o}}function B({page:i,setPage:c,pageSize:e,setPageSize:n,total:s}){const l=Math.max(1,Math.ceil(s/e)),r=(i-1)*e;return{page:i,setPage:c,pageSize:e,setPageSize:u=>{n(u),c(1)},total:s,totalPages:l,start:r,end:Math.min(r+e,s)}}const z="…";function A(i,c){const e=Math.max(0,Math.floor(Number(c)||0));if(e===0)return[];const n=Math.min(Math.max(1,Math.floor(Number(i)||1)),e),s=[1];return n>2&&s.push(z),n!==1&&n!==e&&s.push(n),n<e-1&&s.push(z),e>1&&s.push(e),s}const M="sti-pager-styles",R=`
  .sti-pager {
    display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
    gap: 12px 16px; padding: 12px 16px; font-size: 13px; color: #334155;
  }
  .sti-pager-left { justify-self: start; display: flex; align-items: center; min-width: 0; }
  .sti-pager-info { justify-self: end; white-space: nowrap; color: #475569; }
  .sti-pager-pages { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center; }
  .sti-pager .sti-pager-btn {
    box-sizing: border-box; min-width: 32px; height: 32px; padding: 0 8px;
    display: inline-flex; align-items: center; justify-content: center;
    background: #ffffff; border: 1px solid #d9dee7; border-radius: 6px;
    color: #334155; font: inherit; font-size: 13px; font-weight: 500; line-height: 1;
    cursor: pointer; transition: border-color .15s, color .15s;
  }
  .sti-pager .sti-pager-btn:hover:not(:disabled):not([aria-current="page"]) { border-color: #2563eb; color: #2563eb; }
  .sti-pager .sti-pager-btn:focus-visible { outline: 2px solid #93c5fd; outline-offset: 2px; }
  .sti-pager .sti-pager-btn[aria-current="page"] { border-color: #2563eb; color: #2563eb; font-weight: 600; cursor: default; }
  .sti-pager .sti-pager-btn:disabled { color: #cbd5e1; border-color: #e5e9f0; cursor: not-allowed; }
  .sti-pager-gap { min-width: 24px; text-align: center; color: #94a3b8; letter-spacing: 2px; font-size: 12px; user-select: none; }
  .sti-pager-size {
    position: relative; display: inline-flex; align-items: center; gap: 6px;
    padding-right: 16px; border-right: 1px solid #e2e8f0; white-space: nowrap; color: #334155;
  }
  .sti-pager-size select {
    appearance: none; -webkit-appearance: none; height: 30px; padding: 0 22px 0 4px;
    background: transparent; border: 1px solid transparent; border-radius: 6px;
    color: #0f172a; font: inherit; font-size: 13px; cursor: pointer;
  }
  .sti-pager-size select:hover { background: #f1f5f9; }
  .sti-pager-size select:focus-visible { outline: 2px solid #93c5fd; outline-offset: 1px; }
  .sti-pager-size svg { position: absolute; right: 20px; pointer-events: none; color: #475569; }
  @media (max-width: 640px) {
    .sti-pager { grid-template-columns: 1fr; justify-items: center; }
    .sti-pager-left, .sti-pager-info { justify-self: center; }
    .sti-pager-pages { order: -1; }
    .sti-pager-size { padding-right: 0; border-right: none; }
    .sti-pager-size svg { right: 4px; }
    .sti-pager-left:empty { display: none; }
  }
`;function q(){if(typeof document>"u"||document.getElementById(M))return;const i=document.createElement("style");i.id=M,i.textContent=R,document.head.appendChild(i)}function G({page:i,setPage:c,onPage:e,pageSize:n,setPageSize:s,onPageSize:l,total:r,totalPages:u,start:h,end:y,pageSizes:f=$,label:x="items",style:b}){if(q(),!r)return null;const g=c??e,d=s??l,o=n||10,m=Math.max(1,u??Math.ceil(r/o)),p=Math.min(Math.max(1,i||1),m),w=h??(p-1)*o,N=y??Math.min(w+o,r),P=f.includes(o)?f:[...f,o].sort((t,v)=>t-v);return a.jsxs("nav",{"aria-label":"Pagination",className:"sti-pager",style:b,children:[a.jsx("div",{className:"sti-pager-left",children:d&&a.jsxs("label",{className:"sti-pager-size",children:["Items per page:",a.jsx("select",{"aria-label":"Items per page",value:o,onChange:t=>d(Number(t.target.value)),children:P.map(t=>a.jsx("option",{value:t,children:t},t))}),a.jsx(C,{size:15,"aria-hidden":"true"})]})}),a.jsxs("div",{className:"sti-pager-pages",children:[a.jsx("button",{type:"button","data-variant":"text",className:"sti-pager-btn","aria-label":"Previous page",disabled:p<=1,onClick:()=>g?.(p-1),children:a.jsx(L,{size:15,"aria-hidden":"true"})}),A(p,m).map((t,v)=>t===z?a.jsx("span",{className:"sti-pager-gap","aria-hidden":"true",children:"•••"},`gap-${v}`):a.jsx("button",{type:"button","data-variant":"text",className:"sti-pager-btn","aria-label":`Page ${t}`,"aria-current":t===p?"page":void 0,onClick:()=>t!==p&&g?.(t),children:t},t)),a.jsx("button",{type:"button","data-variant":"text",className:"sti-pager-btn","aria-label":"Next page",disabled:p>=m,onClick:()=>g?.(p+1),children:a.jsx(E,{size:15,"aria-hidden":"true"})})]}),a.jsxs("span",{className:"sti-pager-info",children:[(w+1).toLocaleString(),"-",N.toLocaleString()," of ",r.toLocaleString()," ",x]})]})}export{G as P,B as s,K as u};

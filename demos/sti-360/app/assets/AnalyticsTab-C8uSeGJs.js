import{c as ee,r as te,j as e,b as $}from"./index-D3Nqo7Vt.js";import{B as oe}from"./BreakdownList-Cw_krVpO.js";import{c as se}from"./SkeletonLoader-DjOiN1TB.js";import{m as ne,D as t,P as le,K as ie,H as N,a as ae,f as b,C as y,b as k,c as re,T as ce,A as de}from"./DashboardKit-BLsdLO2d.js";import{f as O}from"./personName-D3dh8C-S.js";import{C as T}from"./clipboard-list-lOnM7G9c.js";import{S as F}from"./school-C0fqWDdn.js";import{C as z}from"./circle-check-wgng9OM9.js";import{B as he}from"./building-2-CXRkH3EZ.js";import"./refresh-cw-B1Xi0lyH.js";import"./arrow-right-CGJXuWBJ.js";const xe=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]],P=ee("bell",xe),pe={new:t.info,contacted:t.warning,qualified:t.success,pending_documents:t.purple,enrolled:t.teal,lost:t.danger,rejected:t.textSubtle},A={feeder_school:"Feeder School",social_media:"Social Media",walk_in:"Walk-in",referral:"Referral",other:"Other"},M={new:"New",contacted:"Contacted",qualified:"Qualified",pending_documents:"Pending Docs",enrolled:"Enrolled",lost:"Lost",rejected:"Rejected"},me=["new","contacted","qualified","pending_documents","enrolled","lost","rejected"],I={new:"sti-status-new",contacted:"sti-status-contacted",qualified:"sti-status-qualified",pending_documents:"sti-status-pending_documents",enrolled:"sti-status-enrolled",lost:"sti-status-lost",rejected:"sti-status-rejected"};function U(l){return l?new Date(l).toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"}):"—"}function _(l){return[...l].sort((o,r)=>new Date(r.created_at)-new Date(o.created_at)).slice(0,10)}function L(l){const o=new Date,r=new Date(o.getFullYear(),o.getMonth(),1);return l.filter(i=>i.created_at&&new Date(i.created_at)>=r)}function fe(l){if(!l.length)return[];const o={};l.forEach(i=>{const s=i.source||"other";o[s]=(o[s]||0)+1});const r=l.length;return Object.entries(o).sort(([,i],[,s])=>s-i).map(([i,s])=>({key:i,label:A[i]||i,count:s,pct:(s/r*100).toFixed(1)}))}function ue(l){if(!l.length)return[];const o={};l.forEach(i=>{const s=i.status||"new";o[s]=(o[s]||0)+1});const r=l.length;return me.filter(i=>o[i]).map(i=>({key:i,label:M[i]||i,count:o[i],pct:(o[i]/r*100).toFixed(1)}))}function ge(l){const o=l.filter(s=>s.schools?.type==="feeder");if(!o.length)return[];const r={};o.forEach(s=>{const a=s.schools?.id||s.schools?.name||"Unknown";r[a]=r[a]?{...r[a],count:r[a].count+1}:{id:s.schools?.id,name:s.schools?.name||"Unknown",count:1}});const i=o.length;return Object.values(r).sort((s,a)=>a.count-s.count).slice(0,10).map(({id:s,name:a,count:x})=>({id:s,label:a,count:x,pct:(x/i*100).toFixed(1)}))}const be=`
@keyframes atmFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes atmSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.atm-modal {
  background: #ffffff;
  border: 1px solid rgba(15,23,42,0.08);
  border-radius: 18px;
  width: 100%;
  max-width: 700px;
  max-height: calc(100vh - 32px);
  max-height: calc(100dvh - 32px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(15,23,42,0.16);
  animation: atmSlideUp 0.2s cubic-bezier(0.16,1,0.3,1);
  overflow: hidden;
}
.atm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(15,23,42,0.08);
  flex-shrink: 0;
  background: #ffffff;
}
.atm-title {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 10px;
}
.atm-title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  font-size: 16px;
  box-shadow: inset 0 0 0 1px rgba(15,23,42,0.06);
}
.atm-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.atm-meta {
  padding: 10px 22px;
  background: #f8fafc;
  border-bottom: 1px solid rgba(15,23,42,0.06);
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.atm-meta-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #94a3b8;
  display: inline-block;
}
.atm-body {
  overflow-y: auto;
  overflow-x: auto;
  flex: 1 1 auto;
  min-height: 0;
  padding: 0;
  background: #ffffff;
}
.atm-body::-webkit-scrollbar { width: 6px; }
.atm-body::-webkit-scrollbar-track { background: transparent; }
.atm-body::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.14); border-radius: 4px; }
.atm-table {
  width: 100%;
  border-collapse: collapse;
}
.atm-table thead tr {
  background: #f8fafc;
  position: sticky;
  top: 0;
  z-index: 1;
}
.atm-table th {
  padding: 12px 18px;
  text-align: left;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
  border-bottom: 1px solid rgba(15,23,42,0.08);
  white-space: nowrap;
}
.atm-table td {
  padding: 13px 18px;
  font-size: 13px;
  color: #1f2937;
  border-bottom: 1px solid rgba(15,23,42,0.06);
  vertical-align: middle;
}
.atm-table tbody tr:last-child td { border-bottom: none; }
.atm-table tbody tr:hover td { background: rgba(15,23,42,0.03); }
.atm-rank {
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
  text-align: center;
  min-width: 28px;
}
.atm-name {
  font-weight: 700;
  font-size: 13.5px;
  color: #111827;
  letter-spacing: -0.01em;
}
.atm-sub {
  font-size: 12px;
  color: #4b5563;
  margin-top: 3px;
}
.atm-empty {
  text-align: center;
  padding: 48px 20px;
  color: #111827;
  font-size: 14px;
  font-weight: 600;
}
.atm-footer {
  padding: 11px 20px;
  border-top: 1px solid rgba(15,23,42,0.06);
  font-size: 11px;
  font-weight: 600;
  color: #4b5563;
  text-align: center;
  flex-shrink: 0;
  background: #ffffff;
}
`;let R=!1;function je(){if(R)return;const l=document.createElement("style");l.textContent=be,document.head.appendChild(l),R=!0}const q={position:"fixed",top:0,left:0,right:0,bottom:0,width:"100vw",height:"100vh",background:"rgba(15,23,42,0.28)",backdropFilter:"blur(2px)",WebkitBackdropFilter:"blur(2px)",zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",boxSizing:"border-box",animation:"atmFadeIn 0.18s ease"};function ye({title:l,subtitle:o,icon:r,iconBg:i,iconColor:s,leads:a,onClose:x}){const f=_(a);return $.createPortal(e.jsx("div",{style:q,onClick:c=>c.target===c.currentTarget&&x(),children:e.jsxs("div",{className:"atm-modal",role:"dialog","aria-modal":"true","aria-label":l,children:[e.jsxs("div",{className:"atm-header",children:[e.jsxs("div",{className:"atm-title",children:[e.jsx("span",{className:"atm-title-icon",style:{background:i,color:s},children:r}),l]}),e.jsx("button",{className:"atm-close",onClick:x,"aria-label":"Close",children:"✕"})]}),e.jsxs("div",{className:"atm-meta",children:[e.jsx("span",{children:"Top 10 latest"}),e.jsx("span",{className:"atm-meta-dot"}),e.jsx("span",{style:{color:"#111827",fontWeight:800},children:a.length}),e.jsxs("span",{children:["total",o?` · ${o}`:""]})]}),e.jsx("div",{className:"atm-body",children:f.length===0?e.jsx("div",{className:"atm-empty",children:"No leads to display."}):e.jsxs("table",{className:"atm-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"#"}),e.jsx("th",{children:"Name"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Source"}),e.jsx("th",{children:"Added"})]})}),e.jsx("tbody",{children:f.map((c,u)=>e.jsxs("tr",{children:[e.jsx("td",{className:"atm-rank",children:u+1}),e.jsxs("td",{children:[e.jsx("div",{className:"atm-name",children:O(c)}),e.jsx("div",{className:"atm-sub",children:c.email||c.phone||"—"})]}),e.jsx("td",{children:e.jsx("span",{className:`sti-badge ${I[c.status]||"sti-b-gray"}`,children:M[c.status]||c.status||"—"})}),e.jsx("td",{style:{color:"#111827",fontSize:12,fontWeight:700},children:A[c.source]||c.source||"—"}),e.jsx("td",{style:{color:"#111827",fontSize:12,fontWeight:700,whiteSpace:"nowrap"},children:U(c.created_at)})]},c.id))})]})}),a.length>10&&e.jsxs("div",{className:"atm-footer",children:["+",a.length-10," more lead",a.length-10!==1?"s":""," not shown"]})]})}),document.body)}function ke({schoolId:l,schoolName:o,cycleName:r,leads:i,onClose:s}){const a=i.filter(d=>l?d.schools?.id===l:d.schools?.name===o),x=L(a),f=_(a),c=_(x),u=r==="cycle"?c:f,p=r==="cycle"?x.length:a.length,w=r==="cycle"?"this cycle":"all time";return $.createPortal(e.jsx("div",{style:q,onClick:d=>d.target===d.currentTarget&&s(),children:e.jsxs("div",{className:"atm-modal",role:"dialog","aria-modal":"true","aria-label":o,children:[e.jsxs("div",{className:"atm-header",children:[e.jsxs("div",{className:"atm-title",children:[e.jsx("span",{className:"atm-title-icon",style:{background:"rgba(37,99,235,0.10)",color:"#2563eb"},children:e.jsx(F,{size:18,strokeWidth:2})}),o]}),e.jsx("button",{className:"atm-close",onClick:s,"aria-label":"Close",children:"✕"})]}),e.jsxs("div",{className:"atm-meta",children:[e.jsx("span",{children:"Top 10 latest"}),e.jsx("span",{className:"atm-meta-dot"}),e.jsx("span",{style:{color:"#111827",fontWeight:800},children:p}),e.jsxs("span",{children:["leads ",w]}),r!=="cycle"&&x.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"atm-meta-dot"}),e.jsxs("span",{style:{color:"#111827",fontWeight:700},children:[x.length," this cycle"]})]})]}),e.jsx("div",{className:"atm-body",children:u.length===0?e.jsxs("div",{className:"atm-empty",children:["No leads from this school",r==="cycle"?" this cycle":"","."]}):e.jsxs("table",{className:"atm-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"#"}),e.jsx("th",{children:"Name"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Source"}),e.jsx("th",{children:"Added"})]})}),e.jsx("tbody",{children:u.map((d,W)=>e.jsxs("tr",{children:[e.jsx("td",{className:"atm-rank",children:W+1}),e.jsxs("td",{children:[e.jsx("div",{className:"atm-name",children:O(d)}),e.jsx("div",{className:"atm-sub",children:d.email||d.phone||"—"})]}),e.jsx("td",{children:e.jsx("span",{className:`sti-badge ${I[d.status]||"sti-b-gray"}`,children:M[d.status]||d.status||"—"})}),e.jsx("td",{style:{color:"#111827",fontSize:12,fontWeight:700},children:A[d.source]||d.source||"—"}),e.jsx("td",{style:{color:"#111827",fontSize:12,fontWeight:700,whiteSpace:"nowrap"},children:U(d.created_at)})]},d.id))})]})}),p>10&&e.jsxs("div",{className:"atm-footer",children:["+",p-10," more lead",p-10!==1?"s":""," not shown"]})]})}),document.body)}function Ae({summary:l,leads:o=[],schools:r=[],loading:i=!1}){je();const[s,a]=te.useState(null);if(i)return e.jsx(se,{});const x=l?.total_leads??o.length,f=l?.feeder_leads??o.filter(n=>n.schools?.type==="feeder").length,c=l?.total_enrolled??o.filter(n=>n.status==="enrolled").length,u=r.length?r.filter(n=>n.type==="feeder").length:l?.total_schools??0,p=L(o),w=x>0?(c/x*100).toFixed(1):"0.0",d=fe(o),W=ue(o),B=ge(o),H=n=>{n.currentTarget.style.background="rgba(15,23,42,0.035)"},Y=n=>{n.currentTarget.style.background=""},K=()=>a({type:"kpi",title:"Total Leads",subtitle:"all sources",icon:e.jsx(T,{size:18,strokeWidth:2}),iconBg:"rgba(15,23,42,0.06)",iconColor:"#111827",leads:o}),Q=()=>a({type:"kpi",title:"From Feeder Schools",subtitle:"feeder source only",icon:e.jsx(F,{size:18,strokeWidth:2}),iconBg:"rgba(37,99,235,0.10)",iconColor:"#2563eb",leads:o.filter(n=>n.schools?.type==="feeder")}),G=()=>a({type:"kpi",title:"Enrolled Leads",subtitle:"status = enrolled",icon:e.jsx(z,{size:18,strokeWidth:2}),iconBg:"rgba(22,163,74,0.10)",iconColor:"#16a34a",leads:o.filter(n=>n.status==="enrolled")}),V=()=>a({type:"kpi",title:"New This Cycle",subtitle:`added in ${new Date().toLocaleString("en-PH",{month:"long",year:"numeric"})}`,icon:e.jsx(P,{size:18,strokeWidth:2}),iconBg:"rgba(217,119,6,0.10)",iconColor:"#d97706",leads:p}),J=o.filter(n=>n.schools?.type==="feeder"&&L([n]).length).length,D=ne(o,6),X=D.reduce((n,h)=>n+h.count,0),E=W.map(({key:n,label:h,count:m})=>({label:h,value:m,color:pe[n]||t.textSubtle})),j=n=>o.filter(h=>h.status===n),S=(n,h,m,C,g,v)=>()=>a({type:"kpi",title:h,subtitle:m,icon:C,iconBg:g,iconColor:v,leads:j(n)}),Z=[{label:"New leads not contacted yet",value:j("new").length,tone:t.info,soft:t.infoSoft,onClick:S("new","New Leads","status = new",e.jsx(T,{size:18,strokeWidth:2}),t.infoSoft,t.info)},{label:"Qualified, ready to enroll",value:j("qualified").length,tone:t.success,soft:t.successSoft,onClick:S("qualified","Qualified Leads","status = qualified",e.jsx(z,{size:18,strokeWidth:2}),t.successSoft,t.success)},{label:"Pending documents",value:j("pending_documents").length,tone:t.purple,soft:t.purpleSoft,onClick:S("pending_documents","Pending Documents","status = pending documents",e.jsx(T,{size:18,strokeWidth:2}),t.purpleSoft,t.purple)},{label:"Contacted, awaiting reply",value:j("contacted").length,tone:t.warning,soft:t.warningSoft,onClick:S("contacted","Contacted Leads","status = contacted",e.jsx(P,{size:18,strokeWidth:2}),t.warningSoft,t.warning)}];return e.jsxs("div",{style:{display:"grid",gap:20},children:[e.jsx(le,{title:"Analytics",hint:"Where leads come from, how far they get in the pipeline, and which feeder schools send the most."}),e.jsxs(ie,{children:[e.jsx(N,{icon:T,label:"Total Leads",value:b(x),color:t.info,soft:t.infoSoft,delta:ae(o),onClick:K,title:"Click to view latest leads"}),e.jsx(N,{icon:F,label:"From Feeders",value:b(f),color:t.info,soft:t.infoSoft,sub:`${J} in this cycle`,onClick:Q,title:"Click to view feeder school leads"}),e.jsx(N,{icon:z,label:"Enrolled",value:b(c),color:t.success,soft:t.successSoft,sub:`${w}% conversion rate`,onClick:G,title:"Click to view enrolled leads"}),e.jsx(N,{icon:he,label:"Partner Schools",value:b(u),color:t.warning,soft:t.warningSoft,sub:`${p.length} leads this cycle`,onClick:V,title:"Click to view new leads this cycle"})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:14},children:[e.jsxs(y,{children:[e.jsx(k,{title:"Pipeline Status",hint:`${b(o.length)} leads · ${w}% enrolled`}),E.length===0?e.jsx("div",{style:{fontSize:12,color:t.textMuted},children:"No pipeline data yet."}):e.jsx(re,{segments:E,total:o.length,centerLabel:"leads",showPct:!0})]}),e.jsxs(y,{children:[e.jsx(k,{title:"Lead Volume",hint:`${b(X)} new leads in the last 6 months`}),e.jsx(ce,{points:D,color:t.info,ariaLabel:"Leads per month, last 6 months"})]}),e.jsxs(y,{children:[e.jsx(k,{title:"Needs Follow-up",hint:"Leads waiting on Marketing · click to see the latest"}),e.jsx(de,{items:Z,emptyText:"No leads waiting right now."})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 2fr",gap:14},children:[e.jsxs(y,{children:[e.jsx(k,{title:"Lead Sources",hint:"How each lead first reached us",action:e.jsxs("span",{className:"sti-badge sti-b-gray",style:{fontWeight:700,color:t.textStrong},children:[o.length," total"]})}),e.jsx(oe,{items:d.map(({key:n,label:h,count:m})=>({key:n,label:h,count:m,color:t.info})),total:o.length,emptyText:"No leads with source data yet."})]}),e.jsxs(y,{style:{padding:0,overflow:"hidden"},children:[e.jsx("div",{style:{padding:"20px 20px 4px"},children:e.jsx(k,{title:"Feeder School Leads",hint:"Top feeder schools by leads · click a school for its latest leads",action:e.jsxs("span",{className:"sti-badge sti-b-blue",style:{fontWeight:700,color:t.textStrong},children:[r.filter(n=>n.type==="feeder").length," schools"]})})}),e.jsx("div",{className:"sti-tbl-wrap",children:e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{color:t.textMuted,fontSize:11,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",WebkitTextFillColor:t.textMuted},children:"School Name"}),e.jsx("th",{style:{color:t.textMuted,fontSize:11,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",WebkitTextFillColor:t.textMuted},children:"Total Leads"}),e.jsx("th",{style:{color:t.textMuted,fontSize:11,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",WebkitTextFillColor:t.textMuted},children:"This Cycle"}),e.jsx("th",{style:{color:t.textMuted,fontSize:11,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",WebkitTextFillColor:t.textMuted},children:"Share of Feeder Leads"})]})}),e.jsx("tbody",{children:B.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:4,className:"sti-empty",style:{color:t.textStrong,fontWeight:700,WebkitTextFillColor:t.textStrong},children:"No feeder school leads yet. Add leads linked to feeder schools."})}):B.map(({id:n,label:h,count:m,pct:C})=>{const g=L(o.filter(v=>n?v.schools?.id===n:v.schools?.name===h)).length;return e.jsxs("tr",{style:{cursor:"pointer",transition:"background 0.15s ease"},onClick:()=>a({type:"school",schoolId:n,schoolName:h}),onMouseEnter:H,onMouseLeave:Y,title:`Click to view top 10 leads from ${h}`,children:[e.jsx("td",{className:"sti-td-name",style:{fontWeight:700,color:t.textStrong,WebkitTextFillColor:t.textStrong},children:h}),e.jsx("td",{children:e.jsx("span",{style:{fontWeight:800,color:t.textStrong,fontSize:13.5,WebkitTextFillColor:t.textStrong},children:m})}),e.jsx("td",{children:e.jsx("span",{style:{fontWeight:700,color:g>0?t.success:t.textSubtle,fontSize:13,WebkitTextFillColor:g>0?t.success:t.textSubtle},children:g>0?`+${g}`:"—"})}),e.jsx("td",{children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("div",{className:"sti-progress-track",style:{maxWidth:100,height:8,background:t.surfaceMuted,borderRadius:999},children:e.jsx("div",{className:"sti-progress-fill",style:{width:`${C}%`,background:t.info,borderRadius:999}})}),e.jsxs("span",{style:{fontSize:12,color:t.textStrong,fontWeight:700,WebkitTextFillColor:t.textStrong},children:[C,"%"]})]})})]},n||h)})})]})})]})]}),s?.type==="kpi"&&e.jsx(ye,{title:s.title,subtitle:s.subtitle,icon:s.icon,iconBg:s.iconBg,iconColor:s.iconColor,leads:s.leads,onClose:()=>a(null)}),s?.type==="school"&&e.jsx(ke,{schoolId:s.schoolId,schoolName:s.schoolName,cycleName:s.cycleName,leads:o,onClose:()=>a(null)})]})}export{Ae as default};

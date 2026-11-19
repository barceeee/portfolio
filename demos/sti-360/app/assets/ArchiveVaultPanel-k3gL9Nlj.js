import{c as je,r as o,j as e,_ as Se}from"./index-D3Nqo7Vt.js";import{I as _}from"./InlineIcon-CofZrkIi.js";import{u as Ne}from"./useArchive-CeIw2nIK.js";import{m as A,a as te,r as _e}from"./displayLabels-CnRsYVfc.js";import{M as ze}from"./Modal-BHtgS2BU.js";import{P as Ce,s as $e}from"./Pagination-CPz2hTLp.js";import{u as ae,a as Ae}from"./useRowSelection-CRLH5EMo.js";import{r as V,S as re,s as H}from"./selectionStyles-Cm8QzDzt.js";import{T as oe}from"./triangle-alert-7Pgj65oc.js";import{D as W}from"./download-luo3v72T.js";import{R as Re}from"./rotate-ccw-BtVdBDVB.js";const Me=[["path",{d:"M13.659 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v11.5",key:"4pqfef"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M8 12v-1",key:"1ej8lb"}],["path",{d:"M8 18v-2",key:"qcmpov"}],["path",{d:"M8 7V6",key:"1nbb54"}],["circle",{cx:"8",cy:"20",r:"2",key:"ckkr5m"}]],De=je("file-archive",Me),Be=`
  .arc-wrap {
    font-family: inherit;
    color: var(--sti-shell-text);
  }
  .arc-toolbar {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 16px; flex-wrap: wrap;
  }
  .arc-select {
    background: var(--sti-surface-sidebar);
    border: 1px solid var(--sti-border-strong);
    border-radius: 8px; padding: 7px 12px;
    font-size: 12px; color: var(--sti-shell-text-soft); outline: none;
    transition: border-color .15s, background .3s, color .3s; cursor: pointer;
  }
  .arc-select:focus { border-color: var(--admin-primary-border); }
  .arc-btn {
    padding: 7px 16px;
    font-size: 12px; font-weight: 600; cursor: pointer;
  }
  .arc-btn:disabled { opacity: .4; cursor: not-allowed; }
  .arc-badge {
    display: inline-flex; align-items: center;
    padding: 2px 8px; border-radius: 10px;
    font-size: 10px; font-weight: 700;
  }
  .arc-badge-red    { background: var(--admin-danger-soft); color: var(--admin-danger); }
  .arc-badge-orange { background: var(--admin-warning-soft); color: var(--admin-warning); }
  .arc-badge-gray   { background: var(--sti-surface-floating); color: var(--sti-shell-text-muted); }
  .arc-table-wrap {
    border-radius: 10px; overflow: hidden;
    border: 1px solid var(--sti-border);
  }
  .arc-table-scroll { overflow-x: auto; }
  .arc-table {
    width: 100%; border-collapse: collapse; font-size: 12px;
  }
  .arc-table th {
    background: var(--sti-surface-sidebar);
    color: var(--sti-shell-text-faint);
    font-weight: 700; text-transform: uppercase;
    letter-spacing: .5px; padding: 10px 14px;
    text-align: left; border-bottom: 1px solid var(--sti-border);
    white-space: nowrap;
    transition: background .3s, color .3s, border-color .3s;
  }
  .arc-table td {
    padding: 9px 14px; color: var(--sti-shell-text-muted);
    border-bottom: 1px solid var(--sti-border-soft);
    white-space: nowrap; max-width: 200px;
    overflow: hidden; text-overflow: ellipsis;
    transition: color .3s, border-color .3s;
  }
  .arc-table tr:last-child td { border-bottom: none; }
  .arc-table tr:hover td { background: var(--sti-surface-hover-soft); }
  .arc-empty {
    text-align: center; padding: 40px 20px;
    color: var(--sti-shell-text-faint); font-size: 12px;
  }
  .arc-modal-overlay {
    position: fixed; inset: 0; z-index: 1200;
    background: var(--sti-modal-overlay); backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px);
    display: flex; align-items: center; justify-content: center; padding: 20px;
  }
  .arc-modal {
    background: var(--admin-surface-elevated);
    border: 1px solid var(--admin-border);
    border-radius: 14px; width: 100%; max-width: 480px;
    box-shadow: var(--admin-shadow-card); overflow: hidden;
    transition: background .3s, border-color .3s;
    /* Fits the screen: header and footer stay, only the body scrolls. */
    max-height: calc(100vh - 40px); max-height: calc(100dvh - 40px);
    display: flex; flex-direction: column;
  }
  .arc-modal-header, .arc-modal-footer { flex: none; }
  .arc-modal-header {
    padding: 16px 20px 12px;
    border-bottom: 1px solid var(--admin-border);
    font-size: 14px; font-weight: 700; color: var(--admin-text-strong);
    display: flex; align-items: center; justify-content: space-between;
    transition: border-color .3s, color .3s;
  }
  .arc-modal-body {
    flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain;
    padding: 16px 20px; font-size: 12px;
    color: var(--admin-text-muted);
  }
  .arc-modal-footer {
    padding: 12px 20px;
    border-top: 1px solid var(--admin-border);
    display: flex; justify-content: flex-end; gap: 8px;
    transition: border-color .3s;
  }
  .arc-close {
    background: none; border: none; cursor: pointer;
    color: var(--sti-shell-text-faint); font-size: 16px; transition: color .15s;
  }
  .arc-close:hover { color: var(--sti-shell-text-muted); }
  .arc-info-row { display: flex; gap: 8px; margin-bottom: 8px; }
  .arc-info-label { color: var(--admin-text-muted); width: 110px; flex-shrink: 0; }
  .arc-info-value { color: var(--admin-text-body); word-break: break-all; }
  .arc-purge-result {
    padding: 10px 14px; border-radius: 8px; margin-top: 12px;
    background: var(--admin-success-soft);
    border: 1px solid var(--admin-success-border);
    color: var(--admin-success); font-size: 12px; font-weight: 600;
  }
  .arc-error-banner {
    padding: 10px 14px; border-radius: 8px; margin-bottom: 12px;
    background: var(--admin-danger-soft);
    border: 1px solid var(--admin-danger-border);
    color: var(--admin-danger); font-size: 12px; font-weight: 600;
  }
  .arc-count-label {
    margin-left: auto; font-size: 11px;
    color: var(--sti-shell-text-faint);
  }
  .arc-input {
    background: var(--sti-surface-sidebar);
    border: 1px solid var(--sti-border-strong);
    border-radius: 8px; padding: 7px 12px; min-width: 200px;
    font-size: 12px; color: var(--sti-shell-text-soft); outline: none;
  }
  .arc-input:focus { border-color: var(--admin-primary-border); }
  .arc-views { display: inline-flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
  .arc-view-btn {
    padding: 7px 14px; font-size: 12px; font-weight: 700; cursor: pointer;
  }
  .arc-note {
    padding: 10px 14px; border-radius: 8px; margin-bottom: 14px; font-size: 12px;
    background: var(--sti-surface-floating); color: var(--sti-shell-text-muted);
    border: 1px solid var(--sti-border);
  }
  .arc-table td.arc-td-actions { max-width: none; overflow: visible; width: 1%; }
  .arc-table td.arc-td-check, .arc-table th.arc-td-check { width: 36px; max-width: none; overflow: visible; }
  .arc-table tr.arc-row-picked td { background: var(--admin-primary-surface, rgba(37,99,235,.06)); }
  .arc-actions { display: inline-flex; gap: 6px; }
  .arc-actions .arc-btn { padding: 4px 10px; font-size: 11px; }
  .arc-date-field {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; color: var(--sti-shell-text-faint);
  }
  /* Follow the app's theme, not the OS, so the calendar icon stays visible. */
  .arc-date-field .arc-input { min-width: 0; padding: 6px 10px; color-scheme: light; }
  .arc-date-field .arc-input::-webkit-calendar-picker-indicator { cursor: pointer; opacity: .75; }
  .arc-date-field .arc-input::-webkit-calendar-picker-indicator:hover { opacity: 1; }
  /* An empty date reads as a hint, not a chosen value. */
  .arc-date-field .arc-input.arc-date-empty { color: var(--sti-shell-text-faint); }
  .arc-table tr.arc-group-row td {
    background: var(--sti-surface-floating);
    color: var(--sti-shell-text-soft);
    font-size: 11px; font-weight: 700; letter-spacing: .02em;
    padding: 6px 14px; max-width: none;
  }
  .arc-group-count { font-weight: 500; color: var(--sti-shell-text-faint); margin-left: 6px; }
  .arc-section-title {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    margin: 26px 0 6px; font-size: 14px; font-weight: 800; color: var(--sti-shell-text);
  }
  .arc-section-title .arc-btn { margin-left: auto; }
  .arc-section-sub { font-size: 12px; color: var(--sti-shell-text-muted); margin-bottom: 12px; }

  /* Phones: each row becomes a card. The first cells (module badge, record
     name) form the card header; the rest show their data-label beside the
     value; the action buttons sit on their own line. */
  @media (max-width: 640px) {
    .arc-table-cards thead { display: none; }
    .arc-table-cards, .arc-table-cards tbody, .arc-table-cards tr, .arc-table-cards td { display: block; width: 100%; }
    .arc-table-cards tr { padding: 12px 14px; border-bottom: 1px solid var(--sti-border-soft); }
    .arc-table-cards tr:last-child { border-bottom: none; }
    .arc-table-cards td {
      border: none; padding: 3px 0; max-width: none;
      white-space: normal; overflow: visible; text-overflow: clip; overflow-wrap: anywhere;
    }
    .arc-table-cards td[data-label] { display: flex; gap: 10px; align-items: baseline; }
    .arc-table-cards td[data-label]::before {
      content: attr(data-label); flex: 0 0 104px;
      font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
      color: var(--sti-shell-text-faint);
    }
    .arc-table-cards td:first-child { padding-bottom: 4px; }
    .arc-table-cards tr:has(> td.arc-td-check) { position: relative; padding-right: 44px; }
    .arc-table-cards td.arc-td-check { position: absolute; top: 12px; right: 14px; width: auto; padding: 0; }
    .arc-table-cards td.arc-td-actions { padding-top: 10px; width: 100%; }
    .arc-table-cards .arc-actions { display: flex; flex-wrap: wrap; gap: 6px; }
    .arc-table-cards .arc-actions .arc-btn { flex: 1 1 auto; padding: 8px 10px; font-size: 12px; }
    .arc-table-cards td.arc-td-actions > .arc-btn { width: 100%; padding: 8px 10px; font-size: 12px; }
    .arc-table-cards tr.arc-group-row { padding: 0; }
    .arc-table-cards tr.arc-group-row td { padding: 8px 14px; }
    .arc-table-scroll { overflow-x: visible; }
    .arc-toolbar .arc-select, .arc-toolbar .arc-btn { flex: 1 1 auto; }
    .arc-toolbar .arc-count-label { flex-basis: 100%; margin-left: 0; text-align: right; }
    .arc-date-field { flex: 1 1 100%; }
    .arc-date-field .arc-input { flex: 1 1 0; }
  }
`;function Te(){const a=document.getElementById("arc-styles");a&&a.remove();const h=document.createElement("style");h.id="arc-styles",h.textContent=Be,document.head.appendChild(h)}const le="Asia/Manila",F=a=>new Date(a).toLocaleDateString("en-PH",{year:"numeric",month:"short",day:"numeric",timeZone:le}),se=a=>a>=1024*1024?`${(a/1024/1024).toFixed(1)} MB`:a>=1024?`${(a/1024).toFixed(1)} KB`:`${a} B`,X=a=>new Date(a).toLocaleDateString("en-CA",{year:"numeric",month:"2-digit",timeZone:le}).slice(0,7),T=a=>new Date(`${a}-15T00:00:00Z`).toLocaleDateString("en-PH",{year:"numeric",month:"long",timeZone:"UTC"}),ne=()=>{const[a,h]=X(new Date).split("-").map(Number);return h===1?`${a-1}-12`:`${a}-${String(h-1).padStart(2,"0")}`},E=a=>_e(a.summary,a.source_table)||`Record ${String(a.source_id||a.id).slice(0,8)}`;function Ee(a,h){const m=new Blob([JSON.stringify(a,null,2)],{type:"application/json"}),f=URL.createObjectURL(m),n=document.createElement("a");n.href=f,n.download=h,document.body.appendChild(n),n.click(),n.remove(),window.setTimeout(()=>URL.revokeObjectURL(f),1e3)}const Fe=a=>a==null?"":typeof a=="object"?JSON.stringify(a):a;async function Le(a,h){const m=await Se(()=>import("./xlsx-CNerDvZX.js"),[]),f=new Map;for(const c of a.records??[]){const w=c.archive??{},i=w.source_table||"records",S={"Archived on":w.archived_at?F(w.archived_at):"","Archived by":w.archived_by_email||"",Reason:w.archive_reason||""};for(const[z,J]of Object.entries(c.data??{}))S[z]=Fe(J);f.has(i)||f.set(i,[]),f.get(i).push(S)}const n=m.utils.book_new(),R=new Set;for(const[c,w]of f){let i=(A(c)||c).replace(/[[\]:*?/\\]/g," ").slice(0,31);for(let S=2;R.has(i);S++)i=`${i.slice(0,27)} (${S})`;R.add(i),m.utils.book_append_sheet(n,m.utils.json_to_sheet(w),i)}f.size||m.utils.book_append_sheet(n,m.utils.aoa_to_sheet([["No records in this backup."]]),"Backup"),m.writeFile(n,h)}function Xe({canManage:a=!1,modules:h=[]}){const{fetchVault:m,fetchSnapshots:f,vaultAction:n,loading:R}=Ne(),[c,w]=o.useState(""),[i,S]=o.useState(""),[z,J]=o.useState(""),[p,Q]=o.useState(""),[x,G]=o.useState(""),[N,ce]=o.useState([]),[L,ie]=o.useState(0),[Z,C]=o.useState(1),[q,de]=o.useState(25),[P,he]=o.useState([]),[M,pe]=o.useState(ne),[d,$]=o.useState(null),g=ae();Ae(g.clear,[c,z,p,x]);const k=ae(),[u,b]=o.useState(null),[O,s]=o.useState(null);o.useEffect(()=>{Te()},[]),o.useEffect(()=>{const t=window.setTimeout(()=>J(i.trim()),350);return()=>window.clearTimeout(t)},[i]);const I=!!(p&&x&&p>x),D=o.useCallback(async()=>{if(!I)try{const{data:t,total:r}=await m({sourceTable:c||null,search:z,from:p||null,to:x||null,page:Z,pageSize:q});ce(t||[]),ie(r||0)}catch(t){s({kind:"error",text:"Failed to load long-term storage: "+(t?.message??"Unknown error")})}},[m,c,z,p,x,Z,q,I]),U=o.useCallback(async()=>{try{he(await f())}catch(t){s({kind:"error",text:"Failed to load monthly backups: "+(t?.message??"Unknown error")})}},[f]);o.useEffect(()=>{D()},[D]),o.useEffect(()=>{U()},[U]);const xe=()=>{D(),U()},ue=$e({page:Z,setPage:C,pageSize:q,setPageSize:de,total:L}),be=o.useMemo(()=>{const t=[];let r=null;for(const l of N){const v=X(l.archived_at);v!==r&&(r=v,t.push({month:v,count:N.filter(K=>X(K.archived_at)===v).length})),t.push(l)}return t},[N]),B=o.useMemo(()=>{const t=new Map;for(const r of P){const l=t.get(r.month)||{month:r.month,parts:[],records:0,size:0,created_at:r.created_at};l.parts.push(r),l.records+=r.record_count,l.size+=Number(r.size_bytes),t.set(r.month,l)}return[...t.values()]},[P]),Y=o.useMemo(()=>new Set(P.map(t=>t.month)),[P]),me=async t=>{s(null),b(t.id);try{const{url:r}=await n("download",t.id);g.clear(),window.location.assign(r)}catch(r){s({kind:"error",text:"Download failed: "+r.message})}finally{b(null)}},fe=async()=>{s(null),b("bundle");try{const t=await n("bundle",{sourceTable:c||null,from:p||null,to:x||null});Ee(t,`long-term-archive_${c||"all-modules"}_${p||"start"}_to_${x||"today"}.json`),s({kind:"ok",text:`Downloaded ${t.count} record${t.count!==1?"s":""} as one file.`})}catch(t){s({kind:"error",text:"Download failed: "+t.message})}finally{b(null)}},ee=async(t,{clearAfter:r=!1}={})=>{s(null),b(t.id);try{const{url:l}=await n("snapshot_download",{snapshotId:t.id}),v=await fetch(l);if(!v.ok)throw new Error(`the backup file could not be read (${v.status})`);await Le(await v.json(),`archive-backup-${t.month}-part-${t.part}.xlsx`),r&&k.clear()}catch(l){s({kind:"error",text:"Download failed: "+l.message})}finally{b(null)}},ge=async()=>{s(null),b("snapshot");try{const t=await n("snapshot",{month:M});s(t.skipped?{kind:"ok",text:`${T(t.month)}: ${t.reason}`}:{kind:"ok",text:`Backed up ${T(t.month)}: ${t.records} record(s) in ${t.files} file(s).`}),U()}catch(t){s({kind:"error",text:"Backup failed: "+t.message})}finally{b(null)}},ve=async()=>{const{entries:t}=d;s(null),b("bulk");let r=0;const l=[];for(const v of t)try{await n("restore",v.id),r+=1}catch(K){l.push(`${E(v)} (${K.message})`)}s(l.length?{kind:"error",text:`Restored ${r} of ${t.length}. Restore failed for: ${l.join("; ")}`}:{kind:"ok",text:`${r} records were restored.`}),$(null),g.clear(),b(null),D()},ye=async()=>{if(!d)return;if(d.entries)return ve();const{entry:t}=d;s(null),b(t.id);try{await n("restore",t.id),s({kind:"ok",text:`${E(t)} was restored to ${A(t.source_table)}.`}),$(null),g.clear(),D()}catch(r){s({kind:"error",text:"Restore failed: "+r.message}),$(null)}finally{b(null)}},we=d?.entry?.source_table==="authorized_accounts",y=g.pick(N),j=k.pick(B,"month"),ke=!!(z||c||p||x);return e.jsxs("div",{className:"arc-wrap",children:[e.jsxs("div",{className:"arc-note",children:["Records move here 30 days after they're archived and are kept permanently; nothing here can be deleted. Each one is stored as its own checksummed file",a?" and can be restored at any time":"","."]}),O&&e.jsxs("div",{className:O.kind==="error"?"arc-error-banner":"arc-purge-result",style:{marginTop:0,marginBottom:12},children:[O.kind==="error"&&e.jsx(_,{icon:oe}),O.text]}),e.jsxs("div",{className:"arc-toolbar",children:[e.jsxs("select",{className:"arc-select",value:c,onChange:t=>{w(t.target.value),C(1)},children:[e.jsx("option",{value:"",children:"All modules"}),h.map(t=>e.jsx("option",{value:t,children:A(t)},t))]}),e.jsx("input",{className:"arc-input",value:i,onChange:t=>{S(t.target.value),C(1)},placeholder:"Search name, email, student ID, reason…","aria-label":"Search long-term storage"}),e.jsxs("label",{className:"arc-date-field",children:["Archived from",e.jsx("input",{type:"date",className:`arc-input${p?"":" arc-date-empty"}`,"aria-label":"Archived from",value:p,max:x||void 0,onChange:t=>{Q(t.target.value),C(1)}})]}),e.jsxs("label",{className:"arc-date-field",children:["to",e.jsx("input",{type:"date",className:`arc-input${x?"":" arc-date-empty"}`,"aria-label":"Archived to",value:x,min:p||void 0,onChange:t=>{G(t.target.value),C(1)}})]}),(p||x)&&e.jsx("button",{className:"arc-btn arc-cancel-btn",style:{padding:"6px 10px"},onClick:()=>{Q(""),G(""),C(1)},children:"Clear dates"}),e.jsx("button",{className:"arc-btn arc-btn-primary",onClick:xe,disabled:R,children:R?"Loading…":"↻ Refresh"}),e.jsxs("button",{className:"arc-btn arc-btn-primary",onClick:fe,disabled:u==="bundle"||I||L===0,title:"One JSON file with every record matching the module and dates above (search is not applied)",children:[e.jsx(_,{icon:De}),u==="bundle"?"Preparing…":"Download as one file"]}),e.jsxs("span",{className:"arc-count-label",children:[L," record",L!==1?"s":""]})]}),I&&e.jsxs("div",{className:"arc-error-banner",children:[e.jsx(_,{icon:oe}),"The start date is after the end date."]}),e.jsxs("div",{className:"arc-table-wrap",children:[e.jsx("div",{className:"arc-table-scroll",children:e.jsxs("table",{className:"arc-table arc-table-cards",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Module"}),e.jsx("th",{children:"Record"}),e.jsx("th",{children:"Reason"}),e.jsx("th",{children:"Archived By"}),e.jsx("th",{children:"Archived"}),e.jsx("th",{children:"In Long-term Since"}),e.jsx("th",{children:"Size"}),e.jsx("th",{className:"arc-td-check",children:e.jsx("input",{type:"checkbox",style:V,"aria-label":"Select all records on this page",checked:g.allOf(N.map(t=>t.id)),onChange:()=>g.toggleAll(N.map(t=>t.id))})})]})}),e.jsx("tbody",{children:N.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:8,children:e.jsxs("div",{className:"arc-empty",children:["Nothing in long-term storage",ke?" matches":" yet","."]})})}):be.map(t=>t.month?e.jsx("tr",{className:"arc-group-row",children:e.jsxs("td",{colSpan:8,children:["Archived ",T(t.month),e.jsxs("span",{className:"arc-group-count",children:[t.count," on this page"]})]})},`m-${t.month}`):e.jsxs("tr",{className:g.has(t.id)?"arc-row-picked":void 0,children:[e.jsx("td",{children:e.jsx("span",{className:"arc-badge arc-badge-gray",children:A(t.source_table)})}),e.jsxs("td",{children:[e.jsx("div",{children:E(t)}),te(t.summary,t.source_table)&&e.jsx("div",{style:{fontSize:11,color:"var(--sti-shell-text-faint)",marginTop:2},children:te(t.summary,t.source_table)})]}),e.jsx("td",{"data-label":"Reason",children:t.archive_reason||e.jsx("span",{style:{color:"var(--sti-shell-text-faint)"},children:"—"})}),e.jsx("td",{"data-label":"Archived by",children:t.archived_by_email||e.jsx("span",{style:{color:"var(--sti-shell-text-faint)"},children:"System"})}),e.jsx("td",{"data-label":"Archived",children:F(t.archived_at)}),e.jsx("td",{"data-label":"Long-term since",children:F(t.moved_at)}),e.jsx("td",{"data-label":"Size",children:se(t.size_bytes)}),e.jsx("td",{className:"arc-td-check",children:e.jsx("input",{type:"checkbox",style:V,"aria-label":`Select ${E(t)}`,checked:g.has(t.id),onChange:()=>g.toggle(t.id)})})]},t.id))})]})}),e.jsxs(re,{count:y.length,onClear:g.clear,noun:"record",children:[e.jsxs("button",{type:"button",style:H,onClick:()=>me(y[0]),disabled:y.length!==1||u===y[0]?.id,title:y.length!==1?"Select one row":"Download the archived JSON file",children:[e.jsx(_,{icon:W}),"Download"]}),a&&e.jsxs("button",{type:"button",style:H,onClick:()=>{s(null),$(y.length===1?{action:"restore",entry:y[0]}:{action:"restore",entries:y})},disabled:!y.length||!!u,title:y.length?void 0:"Select at least one row",children:[e.jsx(_,{icon:Re}),"Restore"]})]})]}),e.jsx(Ce,{...ue,label:"records"}),e.jsx("div",{className:"arc-section-title",children:"Monthly backups"}),e.jsx("div",{className:"arc-section-sub",children:"On the 1st of each month, every record that entered long-term storage the month before is copied into one backup file in a separate storage bucket. Backups are never changed or deleted after they're written; restoring works on the individual records above."}),a&&e.jsxs("div",{className:"arc-toolbar",children:[e.jsxs("label",{className:"arc-date-field",children:["Back up month",e.jsx("input",{type:"month",className:"arc-input",value:M,max:ne(),onChange:t=>pe(t.target.value)})]}),e.jsx("button",{className:"arc-btn arc-btn-primary",onClick:ge,disabled:!M||u==="snapshot"||Y.has(M),title:Y.has(M)?"This month already has a backup":"Normally done automatically on the 1st",children:u==="snapshot"?"Backing up…":"Back up now"})]}),e.jsxs("div",{className:"arc-table-wrap",children:[e.jsx("div",{className:"arc-table-scroll",children:e.jsxs("table",{className:"arc-table arc-table-cards",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Month"}),e.jsx("th",{children:"Records"}),e.jsx("th",{children:"Files"}),e.jsx("th",{children:"Size"}),e.jsx("th",{children:"Backed Up"}),e.jsx("th",{className:"arc-td-check",children:e.jsx("input",{type:"checkbox",style:V,"aria-label":"Select all monthly backups",checked:k.allOf(B.map(t=>t.month)),onChange:()=>k.toggleAll(B.map(t=>t.month))})})]})}),e.jsx("tbody",{children:B.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:6,children:e.jsx("div",{className:"arc-empty",children:"No monthly backups yet. The first one is written on the 1st of next month."})})}):B.map(t=>e.jsxs("tr",{className:k.has(t.month)?"arc-row-picked":void 0,children:[e.jsx("td",{style:{fontWeight:600,color:"var(--sti-shell-text-soft)"},children:T(t.month)}),e.jsx("td",{"data-label":"Records",children:t.records}),e.jsx("td",{"data-label":"Files",children:t.parts.length}),e.jsx("td",{"data-label":"Size",children:se(t.size)}),e.jsx("td",{"data-label":"Backed up",children:F(t.created_at)}),e.jsx("td",{className:"arc-td-check",children:e.jsx("input",{type:"checkbox",style:V,"aria-label":`Select ${T(t.month)} backup`,checked:k.has(t.month),onChange:()=>k.toggle(t.month)})})]},t.month))})]})}),e.jsx(re,{count:j.length,onClear:k.clear,noun:"backup",children:j.length===1&&j[0].parts.length>1?j[0].parts.map(t=>e.jsxs("button",{type:"button",style:H,onClick:()=>ee(t),disabled:u===t.id,children:[e.jsx(_,{icon:W}),"Part ",t.part]},t.id)):e.jsxs("button",{type:"button",style:H,onClick:()=>ee(j[0].parts[0],{clearAfter:!0}),disabled:j.length!==1||u===j[0]?.parts[0]?.id,title:j.length!==1?"Select one row":"Download as an Excel file, one sheet per module",children:[e.jsx(_,{icon:W}),"Download"]})})]}),d&&e.jsx(ze,{title:"Restore from long-term storage",onClose:()=>$(null),closeDisabled:!!u,width:480,footer:e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"arc-btn arc-cancel-btn",onClick:()=>$(null),disabled:!!u,children:"Cancel"}),e.jsx("button",{className:"arc-btn arc-btn-success",onClick:ye,disabled:!!u,children:u?"Restoring…":"✓ Restore"})]}),children:d.entries?e.jsxs("p",{style:{margin:0,fontSize:13},children:["This puts ",e.jsxs("strong",{children:[d.entries.length," records"]})," back into their modules, together with anything that was archived with them. Restored accounts can sign in again."]}):e.jsxs(e.Fragment,{children:[e.jsxs("p",{style:{margin:"0 0 14px",fontSize:13},children:["This puts ",e.jsx("strong",{children:E(d.entry)})," back into"," ",e.jsx("strong",{children:A(d.entry.source_table)}),we?" and unblocks its sign-in":"",", together with anything that was archived with it."]}),e.jsxs("div",{className:"arc-info-row",children:[e.jsx("span",{className:"arc-info-label",children:"Module"}),e.jsx("span",{className:"arc-info-value",children:A(d.entry.source_table)})]}),e.jsxs("div",{className:"arc-info-row",children:[e.jsx("span",{className:"arc-info-label",children:"Reason"}),e.jsx("span",{className:"arc-info-value",children:d.entry.archive_reason||"—"})]}),e.jsxs("div",{className:"arc-info-row",children:[e.jsx("span",{className:"arc-info-label",children:"Archived"}),e.jsx("span",{className:"arc-info-value",children:F(d.entry.archived_at)})]})]})})]})}export{Xe as A,Te as i};

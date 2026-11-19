import{c as Se,j as e,r as d,b as pe}from"./index-D3Nqo7Vt.js";import{s as P,f as ke}from"./supabase-DrDKJ_9s.js";import{u as we,a as Ne}from"./useServerPagination-Bw09DdrV.js";import{u as Ce}from"./useLiveRefresh-CPJrLllO.js";import{H as Ee}from"./DashboardKit-BLsdLO2d.js";import{I as ie}from"./InlineIcon-CofZrkIi.js";import{u as ue}from"./useFieldErrors-Bhgxkuro.js";import{M as T,i as ee,c as O,N as te,h as ae,a as se}from"./validators-C1Gad3mA.js";import{T as M,t as fe,m as Le}from"./textInput-OZwu5ktJ.js";import{P as xe}from"./pencil-D_8kq8TV.js";import{T as re}from"./triangle-alert-7Pgj65oc.js";import{U as ge}from"./UnsavedChangesDialog-DzvcVmKq.js";import{T as Ie}from"./target-ontmMqnS.js";import{u as $e}from"./useUnsavedChangesWarning-DQK0q1Yo.js";import{u as ze}from"./useConfirm-BMB5Yoa5.js";import{G as Te}from"./graduation-cap-CmvBn3tN.js";import{L as Xe}from"./lock-BDBoB_GM.js";import{B as De}from"./badge-check-BV9HIZQa.js";import{V as Ae}from"./ViewLeadModal-CXjiLj4q.js";import{f as le}from"./personName-D3dh8C-S.js";import{b as Re}from"./SkeletonLoader-DjOiN1TB.js";import{P as Oe}from"./Pagination-CPz2hTLp.js";import{S as Pe}from"./search-DK4dsrHa.js";import"./queryCache-w5HkREVU.js";import"./refresh-cw-B1Xi0lyH.js";import"./arrow-right-CGJXuWBJ.js";import"./lazyTab-Az7b0gc9.js";import"./search-x-C2jN_qZX.js";import"./useArchive-CeIw2nIK.js";import"./Portal-xrIY5Poj.js";import"./archive-DeTdWmhi.js";const Fe=[["path",{d:"M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978",key:"1n3hpd"}],["path",{d:"M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978",key:"rfe1zi"}],["path",{d:"M18 9h1.5a1 1 0 0 0 0-5H18",key:"7xy6bh"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",key:"1mhfuq"}],["path",{d:"M6 9H4.5a1 1 0 0 1 0-5H6",key:"tex48p"}]],Me=Se("trophy",Fe);function oe({label:t,value:i,icon:a,sub:o,accent:r}){return e.jsx(Ee,{label:t,value:i,icon:a,sub:o,color:r})}const ce={deped:{bg:"color-mix(in srgb, #15803d 10%, transparent)",border:"color-mix(in srgb, #15803d 30%, transparent)",color:"var(--color-success, #15803d)",label:"DepEd"},ched:{bg:"color-mix(in srgb, var(--color-primary, #2563eb) 10%, transparent)",border:"color-mix(in srgb, var(--color-primary, #2563eb) 25%, transparent)",color:"var(--color-primary, #2563eb)",label:"CHED"},custom:{bg:"color-mix(in srgb, var(--color-warning, #d97706) 10%, transparent)",border:"color-mix(in srgb, var(--color-warning, #d97706) 25%, transparent)",color:"var(--color-warning, #d97706)",label:"Custom"}};function He({source:t}){const i=ce[t]??ce.custom;return e.jsx("span",{style:{display:"inline-block",padding:"1px 7px",borderRadius:99,fontSize:10,fontWeight:700,background:i.bg,color:i.color,border:`1px solid ${i.border}`},children:i.label})}function be({educationLevel:t,value:i,onChange:a,inputClassName:o="enm-input"}){const[r,f]=d.useState(i?.schoolName??""),[u,x]=d.useState([]),[_,v]=d.useState(!1),[E,c]=d.useState(!1),[m,S]=d.useState(i??null),[w,h]=d.useState(null),[L,b]=d.useState(!1),X=d.useRef(null),N=d.useRef(null),D=t==="any",z=t==="senior_high",C=z||t==="college"||D;d.useEffect(()=>{if(!C||r.length<2){x([]),c(!1);return}return clearTimeout(X.current),X.current=setTimeout(()=>k(r),300),()=>clearTimeout(X.current)},[r,t]);const p=d.useRef(!1);d.useEffect(()=>{if(!p.current){p.current=!0;return}S(null),f(""),x([]),a({schoolId:null,schoolSource:null,schoolName:"",schoolCity:"",schoolRegion:""})},[t]),d.useEffect(()=>{const l=g=>{N.current&&!N.current.contains(g.target)&&c(!1)};return document.addEventListener("mousedown",l),()=>document.removeEventListener("mousedown",l)},[]);async function F(l,g){const $="id, school_name, municipality, province, region, level_label",{data:J,error:s}=await P.from("deped_masterlist").select($).textSearch("search_vec",l,{type:"plain",config:"simple"}).limit(g);let j=J??[];if(!s&&j.length===0){const{data:y}=await P.from("deped_masterlist").select($).ilike("school_name",`%${l}%`).limit(g);j=y??[]}return j.map(y=>({id:y.id,name:y.school_name,sub:[y.municipality,y.province].filter(Boolean).join(", "),region:y.region??"",badge:y.level_label??"DepEd",source:"deped"}))}async function n(l,g){const $="id, institution_name, city_municipality, province, region, type, status",{data:J,error:s}=await P.from("ched_hei_list").select($).textSearch("search_vec",l,{type:"plain",config:"simple"}).limit(g);let j=J??[];if(!s&&j.length===0){const{data:y}=await P.from("ched_hei_list").select($).ilike("institution_name",`%${l}%`).limit(g);j=y??[]}return j.map(y=>({id:y.id,name:y.institution_name,sub:[y.city_municipality,y.province].filter(Boolean).join(", "),region:y.region??"",badge:y.type??"HEI",source:"ched"}))}async function k(l){v(!0);try{if(D){const[g,$]=await Promise.all([n(l,8),F(l,10)]);x([...g,...$])}else x(z?await F(l,12):await n(l,12));c(!0)}catch(g){console.error("[SchoolSearchInput] search error:",g)}finally{v(!1)}}function I(l){S(l),f(l.name),c(!1),a({schoolId:l.id,schoolSource:l.source,schoolName:l.name,schoolCity:l.sub,schoolRegion:l.region})}function A(){S({name:r,source:"custom"}),c(!1),a({schoolId:null,schoolSource:"custom",schoolName:r,schoolCity:"",schoolRegion:""})}function R(){S(null),f(""),x([]),a({schoolId:null,schoolSource:null,schoolName:"",schoolCity:"",schoolRegion:""})}return e.jsxs("div",{ref:N,style:{position:"relative"},children:[e.jsxs("div",{style:{position:"relative"},children:[e.jsx("input",{type:"text",className:o,autoComplete:"off",disabled:!C,placeholder:C?D?"Search any school or college (e.g. STI Las Piñas, Cupang NHS, PLM…)":z?"Search DepEd schools (e.g. Cupang SHS, Antipolo NHS…)":"Search CHED institutions (e.g. UST, PLM, DLSU…)":"Select an education level first",value:r,style:{paddingRight:m?36:14,background:C?void 0:"var(--color-surface-offset, #f3f4f6)",color:C?void 0:"var(--color-text-faint, #9ca3af)",cursor:C?void 0:"not-allowed"},onChange:l=>{const g=l.target.value;f(g),S(null),g||a({schoolId:null,schoolSource:null,schoolName:"",schoolCity:"",schoolRegion:""})},onFocus:()=>{u.length>0&&c(!0)}}),m&&e.jsx("button",{type:"button",onClick:R,"data-variant":"text",style:{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"var(--color-text-faint, #9ca3af)",fontSize:14,padding:0,lineHeight:1},children:"✕"})]}),E&&e.jsxs("div",{style:{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,zIndex:1e3,background:"var(--color-surface, #ffffff)",border:"1px solid var(--color-border, #d1d5db)",borderRadius:10,boxShadow:"0 8px 24px rgba(15, 23, 42, 0.12)",maxHeight:280,overflowY:"auto"},children:[_&&e.jsx("div",{style:{padding:"10px 14px",fontSize:12,color:"var(--color-text-faint, #9ca3af)"},children:"Searching…"}),!_&&u.length===0&&r.length>=2&&e.jsx("div",{style:{padding:"10px 14px",fontSize:12,color:"var(--color-text-faint, #9ca3af)"},children:"No matches in database. Use the option below to save as custom."}),!_&&u.map(l=>e.jsxs("div",{style:{padding:"9px 14px",cursor:"pointer",borderBottom:"1px solid var(--color-divider, #f3f4f6)",background:w===`${l.source}-${l.id}`?"var(--color-surface-2, #f9fafb)":"transparent",transition:"background .1s"},onMouseEnter:()=>h(`${l.source}-${l.id}`),onMouseLeave:()=>h(null),onClick:()=>I(l),children:[e.jsxs("div",{style:{fontSize:12,fontWeight:600,color:"var(--color-text, #111827)",display:"flex",alignItems:"center",gap:6},children:[l.name,e.jsx(He,{source:l.source}),l.badge&&l.badge!=="DepEd"&&l.badge!=="HEI"&&e.jsx("span",{style:{fontSize:10,color:"var(--color-text-faint, #9ca3af)"},children:l.badge})]}),(l.sub||l.region)&&e.jsxs("div",{style:{fontSize:11,color:"var(--color-text-muted, #6b7280)",marginTop:2},children:[l.sub,l.region&&e.jsxs("span",{style:{marginLeft:6,color:"var(--color-text-faint, #9ca3af)"},children:["· ",l.region]})]})]},`${l.source}-${l.id}`)),!_&&r.length>=2&&e.jsxs("div",{style:{padding:"9px 14px",cursor:"pointer",background:L?"color-mix(in srgb, var(--color-warning, #d97706) 12%, transparent)":"color-mix(in srgb, var(--color-warning, #d97706) 6%, transparent)",borderTop:"1px solid color-mix(in srgb, var(--color-warning, #d97706) 30%, transparent)",fontSize:12,color:"var(--color-warning, #d97706)",display:"flex",alignItems:"center",gap:8,transition:"background .1s"},onMouseEnter:()=>b(!0),onMouseLeave:()=>b(!1),onClick:A,children:[e.jsx("span",{style:{display:"inline-flex"},children:e.jsx(xe,{size:13})}),e.jsxs("span",{children:['Use "',e.jsx("strong",{children:r}),'" as custom school name']})]})]}),m?.source&&m.source!=="custom"&&e.jsxs("div",{style:{marginTop:6,fontSize:11,color:"var(--color-success, #15803d)",display:"flex",alignItems:"center",gap:4},children:["✓ Matched to ",m.source==="deped"?"DepEd masterlist":"CHED HEI list"," — will appear in School Origin tracking."]}),m?.source==="custom"&&e.jsxs("div",{style:{marginTop:6,fontSize:11,color:"var(--color-warning, #d97706)"},children:[e.jsx(ie,{icon:re}),"Custom name saved for reference. Add it to the school list for it to appear in School Origin charts."]})]})}const Be=[{value:"feeder_school",label:"Feeder School"},{value:"social_media",label:"Social Media"},{value:"walk_in",label:"Walk-in"},{value:"referral",label:"Referral"},{value:"other",label:"Other"}],ye=[{value:"",label:"No Suffix"},{value:"Jr.",label:"Jr."},{value:"Sr.",label:"Sr."},{value:"II",label:"II"},{value:"III",label:"III"},{value:"IV",label:"IV"},{value:"V",label:"V"}],ne={first_name:"",last_name:"",suffix:"",email:"",phone:"",school_id:"",school_other:"",source:"",status:"new"},Ue=/^(09\d{9}|\+639\d{9})$/,W="__other__",We=new Set(ye.map(t=>t.value)),Ve=`
  .alm-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    background: rgba(15, 23, 42, 0.35);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .alm-modal {
    width: 100%;
    max-width: 540px;
    background: #ffffff;
    color: #111827;
    border: 1px solid #dbe3ee;
    border-radius: 20px;
    box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18);
    overflow: hidden;
    /* Fits the screen: header and footer stay, only the body scrolls. */
    max-height: calc(100vh - 32px);
    max-height: calc(100dvh - 32px);
    display: flex;
    flex-direction: column;
  }

  .alm-header,
  .alm-footer,
  .alm-body {
    background: #ffffff;
    color: #111827;
  }

  .alm-header {
    padding: 22px 24px 16px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .alm-footer {
    padding: 16px 24px 22px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .alm-body {
    padding: 20px 24px;
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
  .alm-header, .alm-footer { flex: none; }

  .alm-title,
  .alm-title * {
    color: #111827;
    opacity: 1;
  }

  .alm-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: "Syne", sans-serif;
    font-size: 17px;
    font-weight: 700;
  }

  .alm-title-icon {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    background: #eff6ff;
    color: #2563eb;
    border: 1px solid #bfdbfe;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
  }

  .alm-close {
    width: 30px;
    height: 30px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .alm-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 16px;
  }

  .alm-field {
    margin-bottom: 14px;
  }

  .alm-field.span-2 {
    grid-column: 1 / -1;
  }

  .alm-label {
    display: block;
    margin-bottom: 8px;
    color: #374151;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .7px;
    text-transform: uppercase;
  }

  .alm-optional-text,
  .alm-school-hint,
  .alm-contact-hint,
  .alm-step-label {
    color: #6b7280;
  }

  .alm-input,
  .alm-select {
    width: 100%;
    background: #f9fafb;
    color: #111827;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
    font-family: "DM Sans", sans-serif;
    box-sizing: border-box;
    outline: none;
    appearance: none;
  }

  .alm-input::placeholder {
    color: #9ca3af;
  }

  .alm-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 38px;
    cursor: pointer;
  }

  .alm-select,
  .alm-select option,
  .alm-select optgroup {
    color: #111827;
    background: #ffffff;
  }

  .alm-input:focus,
  .alm-select:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
  }

  .alm-input.error,
  .alm-select.error {
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12);
  }

  .alm-field-error {
    color: #dc2626;
    font-size: 11px;
    margin-top: 4px;
  }

  .alm-submit-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 12px;
    margin-top: 16px;
    color: #dc2626;
  }

  .alm-divider {
    height: 1px;
    background: #e5e7eb;
    margin: 18px 0;
  }

  .alm-step-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
  }

  .alm-step-dot {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #60a5fa);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
  }

  .alm-btn-outline.sm {
    padding: 6px 14px;
    font-size: 11px;
  }

  .alm-btn-primary.sm {
    padding: 6px 14px;
    font-size: 11px;
  }

  .alm-spinner {
    display: inline-block;
    width: 11px;
    height: 11px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: alm-spin 0.65s linear infinite;
    margin-right: 6px;
    vertical-align: middle;
  }

  @keyframes alm-spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 640px) {
    .alm-grid {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }
`;function qe(){const t=document.getElementById("sti-add-lead-modal-styles");t&&t.remove();const i=document.createElement("style");i.id="sti-add-lead-modal-styles",i.textContent=Ve,document.head.appendChild(i)}function Ge(t){return Object.keys(ne).some(i=>t[i]!==ne[i])}function V({name:t,label:i,optional:a,error:o,span2:r=!1,children:f}){return e.jsxs("div",{className:`alm-field${r?" span-2":""}`,children:[e.jsxs("label",{className:"alm-label",htmlFor:`add-lead-${t}`,children:[i,a&&e.jsx("span",{className:"alm-optional-text",children:" (optional)"})]}),f,o&&e.jsx("div",{className:"alm-field-error",children:o})]})}const K={first_name:M.name,last_name:M.name,email:M.email,phone:M.phPhone,school_other:M.schoolName};function Je({onClose:t,onSaved:i}){const[a,o]=d.useState(ne),[r,f]=d.useState(!1),[u,x]=d.useState([]),[_,v]=d.useState(!0),[E,c]=d.useState(!1);d.useEffect(()=>{qe()},[]),d.useEffect(()=>{P.from("schools").select("id, name, type").order("type").order("name").then(({data:n})=>{x(n||[]),v(!1)})},[]);const m=n=>{const{name:k}=n.target;let{value:I}=n.target;K[k]&&(I=fe(I,K[k],a[k]),I===null)||(o(A=>({...A,[k]:I})),b(k,...k==="email"||k==="phone"?["contact"]:[]))},S=()=>{Ge(a)?c(!0):t()},w=()=>{const n={};a.first_name.trim().length>T.name&&(n.first_name=`First name must not exceed ${T.name} characters.`),a.last_name.trim().length>T.name&&(n.last_name=`Last name must not exceed ${T.name} characters.`),a.email.trim().length>T.email&&(n.email="Enter a valid email address."),a.school_id===W&&a.school_other.trim().length>T.shortText&&(n.school_other=`School name must not exceed ${T.shortText} characters.`);const k=a.first_name;k.trim()?ee(k.trim())||(n.first_name=te):n.first_name="First name is required.";const I=a.last_name;I.trim()?ee(I.trim())||(n.last_name=te):n.last_name="Last name is required.",a.suffix&&!We.has(a.suffix)&&(n.suffix="Please select a valid suffix.");const A=a.email.trim(),R=a.phone.trim().replace(/\s/g,"");if(!A&&!R?n.contact="Please provide at least an email or phone number.":(A&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(A)&&(n.email="Enter a valid email address."),R&&!Ue.test(R)&&(n.phone="Enter a valid PH number (e.g. 09XXXXXXXXX or +639XXXXXXXXX).")),a.source||(n.source="Please select a lead source."),a.school_id||(n.school_id="Please select a school."),a.school_id===W){const l=a.school_other;l.trim()?ae(l)&&(n.school_other=se):n.school_other="Pick the school, or use what you typed."}return n},{errors:h,isValid:L,touch:b,showAll:X,setExtra:N}=ue(w()),D=async()=>{if(!L){X();return}f(!0);try{const n=a.school_id===W?null:a.school_id||null,k=a.school_id===W?O(a.school_other):u.find(g=>g.id===a.school_id)?.name||"",I={first_name:O(a.first_name),last_name:O(a.last_name),status:"new",...a.suffix.trim()?{suffix:a.suffix.trim()}:{},...a.email.trim()?{email:a.email.trim().toLowerCase()}:{},...a.phone.trim()?{phone:a.phone.trim().replace(/\s/g,"")}:{},...n?{school_id:n}:{},...k?{school_name:k}:{},...a.source?{source:a.source}:{}},{data:A,error:R}=await P.from("leads").insert([I]).select(`
          id, first_name, last_name, suffix, email, phone,
          status, source, created_at, school_id, school_name,
          schools(id, name, type)
        `).single();if(R)throw R;const l={...A,_school_other:a.school_id===W?O(a.school_other):null};i(l)}catch(n){N({submit:n.message||"Failed to save lead."})}finally{f(!1)}},z=n=>{n.target===n.currentTarget&&S()},H=u.filter(n=>n.type==="feeder"),C=u.filter(n=>n.type==="competition"),p=u.filter(n=>n.type!=="feeder"&&n.type!=="competition"),F=a.school_id===W;return pe.createPortal(e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"alm-overlay",onClick:z,children:e.jsxs("div",{className:"alm-modal",role:"dialog","aria-modal":"true","aria-labelledby":"sti-add-lead-modal-title",onClick:n=>n.stopPropagation(),children:[e.jsxs("div",{className:"alm-header",children:[e.jsxs("div",{className:"alm-title",id:"sti-add-lead-modal-title",children:[e.jsx("div",{className:"alm-title-icon",children:e.jsx(Ie,{size:20,strokeWidth:2})}),"Add New Lead"]}),e.jsx("button",{className:"alm-close",onClick:S,"aria-label":"Close",type:"button",children:"✕"})]}),e.jsxs("div",{className:"alm-body",children:[e.jsxs("div",{className:"alm-step-header",children:[e.jsx("div",{className:"alm-step-dot",children:"1"}),e.jsx("span",{className:"alm-step-label",children:"Personal Information"})]}),e.jsxs("div",{className:"alm-grid",children:[e.jsx(V,{name:"first_name",label:"First Name *",error:h.first_name,children:e.jsx("input",{id:"add-lead-first_name",maxLength:K.first_name.max,name:"first_name",className:`alm-input${h.first_name?" error":""}`,placeholder:"Juan or Ma.",value:a.first_name,onChange:m,autoFocus:!0})}),e.jsx(V,{name:"last_name",label:"Last Name *",error:h.last_name,children:e.jsx("input",{id:"add-lead-last_name",maxLength:K.last_name.max,name:"last_name",className:`alm-input${h.last_name?" error":""}`,placeholder:"Dela Cruz",value:a.last_name,onChange:m})}),e.jsx(V,{name:"suffix",label:"Suffix",optional:!0,error:h.suffix,children:e.jsx("select",{id:"add-lead-suffix",name:"suffix",className:`alm-select${h.suffix?" error":""}`,value:a.suffix,onChange:m,children:ye.map(n=>e.jsx("option",{value:n.value,children:n.label},n.value))})}),e.jsxs("div",{className:"alm-field span-2",style:{marginBottom:0},children:[e.jsx("p",{className:"alm-contact-hint",style:{fontSize:10.5,marginBottom:6},children:"* At least one contact detail (Email or Phone) is required."}),h.contact&&e.jsx("div",{className:"alm-field-error",style:{marginBottom:6},children:h.contact})]}),e.jsx(V,{name:"email",label:"Email",error:h.email,children:e.jsx("input",{id:"add-lead-email",maxLength:K.email.max,name:"email",type:"email",className:`alm-input${h.email||h.contact?" error":""}`,placeholder:"juan@email.com",value:a.email,onChange:m})}),e.jsx(V,{name:"phone",label:"Phone",error:h.phone,children:e.jsx("input",{id:"add-lead-phone",maxLength:K.phone.max,name:"phone",type:"tel",className:`alm-input${h.phone||h.contact?" error":""}`,placeholder:"09XXXXXXXXX",value:a.phone,onChange:m})})]}),e.jsx("div",{className:"alm-divider"}),e.jsxs("div",{className:"alm-step-header",children:[e.jsx("div",{className:"alm-step-dot",children:"2"}),e.jsx("span",{className:"alm-step-label",children:"Lead Details"})]}),e.jsxs("div",{className:"alm-grid",children:[e.jsx(V,{name:"source",label:"Lead Source *",error:h.source,children:e.jsxs("select",{id:"add-lead-source",name:"source",className:`alm-select${h.source?" error":""}`,value:a.source,onChange:m,children:[e.jsx("option",{value:"",children:"Select source…"}),Be.map(n=>e.jsx("option",{value:n.value,children:n.label},n.value))]})}),e.jsxs(V,{name:"school_id",label:"School *",error:h.school_id,span2:!0,children:[e.jsxs("select",{id:"add-lead-school_id",name:"school_id",className:`alm-select${h.school_id?" error":""}`,value:a.school_id,onChange:m,disabled:_,children:[e.jsx("option",{value:"",children:_?"Loading schools…":"Select school…"}),H.length>0&&e.jsx("optgroup",{label:"Feeder Schools",children:H.map(n=>e.jsx("option",{value:n.id,children:n.name},n.id))}),C.length>0&&e.jsx("optgroup",{label:"Other Tracked Schools",children:C.map(n=>e.jsx("option",{value:n.id,children:n.name},n.id))}),p.length>0&&e.jsx("optgroup",{label:"Other",children:p.map(n=>e.jsx("option",{value:n.id,children:n.name},n.id))}),e.jsx("optgroup",{label:"──────────────",children:e.jsx("option",{value:W,children:"Another school — search all schools"})})]}),F&&e.jsxs("div",{style:{marginTop:8,display:"grid",gap:6},children:[e.jsx(be,{educationLevel:"any",inputClassName:`alm-input${h.school_other?" error":""}`,value:a.school_other?{schoolName:a.school_other,schoolSource:"custom"}:null,onChange:n=>{o(k=>({...k,school_other:n.schoolName||""})),b("school_other")}}),h.school_other&&e.jsx("div",{className:"alm-field-error",children:h.school_other}),e.jsx("div",{className:"alm-school-hint",style:{fontSize:10},children:"Pick the school from the list, or use what you typed if it isn't there. The name is saved with the lead for School Origin."})]})]})]}),h.submit&&e.jsxs("div",{className:"alm-submit-error",children:[e.jsx(ie,{icon:re}),h.submit]})]}),e.jsxs("div",{className:"alm-footer",children:[e.jsx("button",{className:"alm-btn-outline sm",onClick:S,disabled:r,type:"button",children:"Cancel"}),e.jsx("button",{className:"alm-btn-primary sm",onClick:D,disabled:r||!L,type:"button",children:r?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"alm-spinner"}),"Saving…"]}):"＋ Add Lead"})]})]})}),e.jsx(ge,{open:E,onDiscard:t,onKeep:()=>c(!1)})]}),document.body)}const Ye=new Set(["enrolled","lost"]),Ke={new:"New",contacted:"Contacted",qualified:"Qualified",pending_documents:"Pending Docs",enrolled:"Enrolled",lost:"Lost",rejected:"Rejected"},Qe=[{value:"new",label:"New"},{value:"contacted",label:"Contacted"},{value:"qualified",label:"Qualified"},{value:"pending_documents",label:"Pending Docs"},{value:"enrolled",label:"Enrolled"},{value:"lost",label:"Lost"},{value:"rejected",label:"Rejected"}],Ze=[{value:"feeder_school",label:"Feeder School"},{value:"social_media",label:"Social Media"},{value:"walk_in",label:"Walk-in"},{value:"referral",label:"Referral"},{value:"other",label:"Other"}],q="__other__",ve=[{value:"",label:"No Suffix"},{value:"Jr.",label:"Jr."},{value:"Sr.",label:"Sr."},{value:"II",label:"II"},{value:"III",label:"III"},{value:"IV",label:"IV"},{value:"V",label:"V"}],et=new Set(ve.map(t=>t.value)),tt=/^(09\d{9}|\+639\d{9})$/,Q=500,lt=`
  .elm-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    background: rgba(15, 23, 42, 0.35);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .elm-modal {
    width: 100%;
    max-width: 540px;
    background: #ffffff;
    color: #111827;
    border: 1px solid #dbe3ee;
    border-radius: 20px;
    box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18);
    overflow: hidden;
    /* Fits the screen: header and footer stay, only the body scrolls. */
    max-height: calc(100vh - 32px);
    max-height: calc(100dvh - 32px);
    display: flex;
    flex-direction: column;
  }

  .elm-header,
  .elm-footer,
  .elm-body {
    background: #ffffff;
    color: #111827;
  }

  .elm-header {
    padding: 22px 24px 16px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .elm-footer {
    padding: 16px 24px 22px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .elm-body {
    padding: 20px 24px;
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
  .elm-header, .elm-footer { flex: none; }

  .elm-title,
  .elm-title * {
    color: #111827;
    opacity: 1;
  }

  .elm-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: "Syne", sans-serif;
    font-size: 17px;
    font-weight: 700;
  }

  .elm-title-icon {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    background: #eff6ff;
    color: #2563eb;
    border: 1px solid #bfdbfe;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
  }

  .elm-close {
    width: 30px;
    height: 30px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .elm-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 16px;
  }

  .elm-field {
    margin-bottom: 14px;
  }

  .elm-field.span-2 {
    grid-column: 1 / -1;
  }

  .elm-label {
    display: block;
    margin-bottom: 8px;
    color: #374151;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .7px;
    text-transform: uppercase;
  }

  .elm-optional-text,
  .elm-school-hint,
  .elm-notes-counter,
  .elm-contact-hint,
  .elm-step-label {
    color: #6b7280;
  }

  .elm-input,
  .elm-select,
  .elm-textarea {
    width: 100%;
    background: #f9fafb;
    color: #111827;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
    font-family: "DM Sans", sans-serif;
    box-sizing: border-box;
    outline: none;
    appearance: none;
  }

  .elm-input::placeholder,
  .elm-textarea::placeholder {
    color: #9ca3af;
  }

  .elm-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 38px;
    cursor: pointer;
  }

  .elm-select,
  .elm-select option,
  .elm-select optgroup {
    color: #111827;
    background: #ffffff;
  }

  .elm-input:focus,
  .elm-select:focus,
  .elm-textarea:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
  }

  .elm-input.error,
  .elm-select.error,
  .elm-textarea.error {
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12);
  }

  .elm-field-error,
  .elm-submit-error {
    color: #dc2626;
  }

  .elm-enroll-hint {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
    border-radius: 10px;
    padding: 10px 14px;
    margin-bottom: 16px;
    line-height: 1.5;
  }

  .elm-lock-banner {
    border-radius: 10px;
    padding: 10px 14px;
    margin-bottom: 16px;
    line-height: 1.5;
  }

  .elm-lock-banner.enrolled {
    background: #ecfdf5;
    border: 1px solid #bbf7d0;
    color: #15803d;
  }

  .elm-lock-banner.lost {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
  }

  .elm-body.locked .elm-input,
  .elm-body.locked .elm-select,
  .elm-body.locked .elm-textarea {
    background: #f3f4f6;
    color: #374151;
    cursor: not-allowed;
    pointer-events: none;
    opacity: 1;
  }

  .elm-divider {
    height: 1px;
    background: #e5e7eb;
    margin: 18px 0;
  }

  .elm-step-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
  }

  .elm-step-dot {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #60a5fa);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
  }

  .elm-btn-outline.sm {
    padding: 6px 14px;
    font-size: 11px;
  }

  .elm-btn-primary.sm {
    padding: 6px 14px;
    font-size: 11px;
  }

  .elm-spinner {
    display: inline-block;
    width: 11px;
    height: 11px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: elm-spin 0.65s linear infinite;
    margin-right: 6px;
    vertical-align: middle;
  }

  @keyframes elm-spin {
    to { transform: rotate(360deg); }
  }

  .elm-submit-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 12px;
    margin-top: 16px;
  }

  @media (max-width: 640px) {
    .elm-grid {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }
`;function ot(){const t=document.getElementById("sti-edit-modal-styles");t&&t.remove();const i=document.createElement("style");i.id="sti-edit-modal-styles",i.textContent=lt,document.head.appendChild(i)}function B({name:t,label:i,optional:a,error:o,children:r,span2:f=!1}){return e.jsxs("div",{className:`elm-field${f?" span-2":""}`,children:[e.jsxs("label",{className:"elm-label",htmlFor:`edit-lead-${t}`,children:[i,a&&e.jsx("span",{className:"elm-optional-text",children:" (optional)"})]}),r,o&&e.jsx("div",{className:"elm-field-error",children:o})]})}const G={first_name:M.name,last_name:M.name,email:M.email,phone:M.phPhone,school_other:M.schoolName,notes:Le(Q)};function at({lead:t,onClose:i,onSaved:a}){d.useEffect(()=>{ot()},[]);const[o,r]=d.useState({first_name:t.first_name??"",last_name:t.last_name??"",suffix:t.suffix??"",email:t.email??"",phone:t.phone??"",school_id:t.school_id??t.schools?.id??"",school_other:"",source:t.source??"",status:t.status??"new",notes:t.notes??""}),[f,u]=d.useState(null),[x,_]=d.useState(!1),{confirm:v,confirmDialog:E}=ze(),[c,m]=d.useState([]),[S,w]=d.useState(!0),[h,L]=d.useState(!1),b=Ye.has(t.status),X=o.status==="enrolled"&&t.status!=="enrolled";d.useEffect(()=>{u({first_name:t.first_name??"",last_name:t.last_name??"",suffix:t.suffix??"",email:t.email??"",phone:t.phone??"",school_id:t.school_id??t.schools?.id??(t.school_name?q:""),school_other:!(t.school_id??t.schools?.id)&&t.school_name?t.school_name:"",source:t.source??"",status:t.status??"new",notes:t.notes??""})},[t]),d.useEffect(()=>{P.from("schools").select("id, name, type").order("type").order("name").then(({data:s})=>{m(s||[]),w(!1)})},[]);const N=s=>{if(b)return;const{name:j}=s.target;let{value:y}=s.target;G[j]&&(y=fe(y,G[j],o[j]),y===null)||(r(U=>({...U,[j]:y})),n(j,...j==="email"||j==="phone"?["contact"]:[]))},D=f!==null&&JSON.stringify(o)!==JSON.stringify(f);$e(D&&!x);const z=()=>{!b&&D?L(!0):i()},H=s=>{s.target===s.currentTarget&&z()},C=()=>{const s={};o.first_name.trim().length>T.name&&(s.first_name=`First name must not exceed ${T.name} characters.`),o.last_name.trim().length>T.name&&(s.last_name=`Last name must not exceed ${T.name} characters.`),o.email.trim().length>T.email&&(s.email="Enter a valid email address."),o.school_id===q&&o.school_other.trim().length>T.shortText&&(s.school_other=`School name must not exceed ${T.shortText} characters.`);const j=o.first_name;j.trim()?ee(j.trim())||(s.first_name=te):s.first_name="First name is required.",o.suffix&&!et.has(o.suffix)&&(s.suffix="Please select a valid suffix.");const y=o.last_name;y.trim()?ee(y.trim())||(s.last_name=te):s.last_name="Last name is required.";const U=o.email.trim(),Y=o.phone.trim().replace(/\s/g,"");if(!U&&!Y?s.contact="Please provide at least an email or phone number.":(U&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(U)&&(s.email="Enter a valid email address."),Y&&!tt.test(Y)&&(s.phone="Enter a valid PH number (e.g. 09XXXXXXXXX or +639XXXXXXXXX).")),o.status||(s.status="Please select a status."),o.source||(s.source="Please select a lead source."),o.school_id===q){const Z=o.school_other;Z.trim()?ae(Z)&&(s.school_other=se):s.school_other="Pick the school, or use what you typed."}return ae(o.notes)?s.notes=se:O(o.notes,{multiline:!0}).length>Q&&(s.notes=`Notes must not exceed ${Q} characters.`),s},{errors:p,isValid:F,touch:n,showAll:k,setExtra:I}=ue(C(),{showFieldsNow:!0}),A=async()=>{if(!F){k();return}if(await v({title:"Save lead changes?",description:`The record for ${O(o.first_name)} ${O(o.last_name)} will be updated.`})){_(!0);try{const s=o.school_id===q?null:o.school_id||null,j=o.school_id===q?O(o.school_other):c.find(Z=>Z.id===o.school_id)?.name||null,y={first_name:O(o.first_name),last_name:O(o.last_name),suffix:o.suffix||null,status:o.status,source:o.source||null,school_id:s,school_name:j||null,email:o.email.trim().toLowerCase()||null,phone:o.phone.trim().replace(/\s/g,"")||null,notes:O(o.notes,{multiline:!0})||null},{data:U,error:Y}=await P.from("leads").update(y).eq("id",t.id).select(`
          id, first_name, last_name, suffix, email, phone,
          status, source, notes, created_at, school_id, school_name,
          schools(id, name, type)
        `).single();if(Y)throw Y;a(U)}catch(s){I({submit:s.message||"Failed to update lead."})}finally{_(!1)}}},R=c.filter(s=>s.type==="feeder"),l=c.filter(s=>s.type==="competition"),g=c.filter(s=>s.type!=="feeder"&&s.type!=="competition"),$=o.school_id===q,J=o.notes.trim().length;return pe.createPortal(e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"elm-overlay",onClick:H,children:e.jsxs("div",{className:"elm-modal",role:"dialog","aria-modal":"true","aria-labelledby":"sti-edit-lead-modal-title",style:{maxWidth:540},onClick:s=>s.stopPropagation(),children:[e.jsxs("div",{className:"elm-header",children:[e.jsxs("div",{className:"elm-title",id:"sti-edit-lead-modal-title",children:[e.jsx("div",{className:"elm-title-icon",children:e.jsx(xe,{size:20,strokeWidth:2})}),"Edit Lead — ",t.first_name," ",t.last_name]}),e.jsx("button",{className:"elm-close",onClick:z,"aria-label":"Close",type:"button",children:"✕"})]}),e.jsxs("div",{className:`elm-body${b?" locked":""}`,children:[b&&e.jsxs("div",{className:`elm-lock-banner ${t.status}`,children:[e.jsx("span",{style:{display:"inline-flex"},children:t.status==="enrolled"?e.jsx(Te,{size:16}):e.jsx(Xe,{size:16})}),e.jsxs("span",{children:["This lead is ",e.jsx("strong",{children:Ke[t.status]})," and can no longer be edited.",t.status==="enrolled"&&" Enrollment is permanent.",t.status==="lost"&&" Lost leads are archived and cannot be modified."]})]}),X&&e.jsxs("div",{className:"elm-enroll-hint",children:[e.jsx("span",{style:{display:"inline-flex"},children:e.jsx(De,{size:16})}),e.jsxs("span",{children:["You're marking this lead as ",e.jsx("strong",{children:"Enrolled"}),". Make sure all details below are accurate before saving."]})]}),e.jsxs("div",{className:"elm-step-header",children:[e.jsx("div",{className:"elm-step-dot",children:"1"}),e.jsx("span",{className:"elm-step-label",children:"Personal Information"})]}),e.jsxs("div",{className:"elm-grid",children:[e.jsx(B,{name:"first_name",label:"First Name *",error:p.first_name,children:e.jsx("input",{id:"edit-lead-first_name",maxLength:G.first_name.max,name:"first_name",className:`elm-input${p.first_name?" error":""}`,placeholder:"Juan",value:o.first_name,onChange:N,autoFocus:!0,disabled:b})}),e.jsx(B,{name:"last_name",label:"Last Name *",error:p.last_name,children:e.jsx("input",{id:"edit-lead-last_name",maxLength:G.last_name.max,name:"last_name",className:`elm-input${p.last_name?" error":""}`,placeholder:"Dela Cruz",value:o.last_name,onChange:N,disabled:b})}),e.jsx(B,{name:"suffix",label:"Suffix",optional:!0,error:p.suffix,children:e.jsx("select",{id:"edit-lead-suffix",name:"suffix",className:`elm-select${p.suffix?" error":""}`,value:o.suffix,onChange:N,disabled:b,children:ve.map(s=>e.jsx("option",{value:s.value,children:s.label},s.value))})}),!b&&e.jsxs("div",{className:"elm-field span-2",style:{marginBottom:0},children:[e.jsx("p",{className:"elm-contact-hint",style:{fontSize:10.5,marginBottom:6},children:"* At least one contact detail (Email or Phone) is required."}),p.contact&&e.jsx("div",{className:"elm-field-error",style:{marginBottom:6},children:p.contact})]}),e.jsx(B,{name:"email",label:"Email *",error:p.email,children:e.jsx("input",{id:"edit-lead-email",maxLength:G.email.max,name:"email",type:"email",className:`elm-input${p.email||p.contact?" error":""}`,placeholder:"juan@email.com",value:o.email,onChange:N,disabled:b})}),e.jsx(B,{name:"phone",label:"Phone *",error:p.phone,children:e.jsx("input",{id:"edit-lead-phone",maxLength:G.phone.max,name:"phone",type:"tel",className:`elm-input${p.phone||p.contact?" error":""}`,placeholder:"09XXXXXXXXX",value:o.phone,onChange:N,disabled:b})})]}),e.jsx("div",{className:"elm-divider"}),e.jsxs("div",{className:"elm-step-header",children:[e.jsx("div",{className:"elm-step-dot",children:"2"}),e.jsx("span",{className:"elm-step-label",children:"Lead Details"})]}),e.jsxs("div",{className:"elm-grid",children:[e.jsx(B,{name:"status",label:"Status *",error:p.status,children:e.jsx("select",{id:"edit-lead-status",name:"status",className:`elm-select${p.status?" error":""}`,value:o.status,onChange:N,disabled:b,children:Qe.map(s=>e.jsx("option",{value:s.value,children:s.label},s.value))})}),e.jsx(B,{name:"source",label:"Lead Source *",error:p.source,children:e.jsxs("select",{id:"edit-lead-source",name:"source",className:`elm-select${p.source?" error":""}`,value:o.source,onChange:N,disabled:b,children:[e.jsx("option",{value:"",children:"Select source…"}),Ze.map(s=>e.jsx("option",{value:s.value,children:s.label},s.value))]})}),e.jsxs(B,{name:"school_id",label:"School",error:p.school_id,span2:!0,children:[e.jsxs("select",{id:"edit-lead-school_id",name:"school_id",className:`elm-select${p.school_id?" error":""}`,value:o.school_id,onChange:N,disabled:b||S,children:[e.jsx("option",{value:"",children:S?"Loading schools…":"Select school…"}),R.length>0&&e.jsx("optgroup",{label:"Feeder Schools",children:R.map(s=>e.jsx("option",{value:s.id,children:s.name},s.id))}),l.length>0&&e.jsx("optgroup",{label:"Other Tracked Schools",children:l.map(s=>e.jsx("option",{value:s.id,children:s.name},s.id))}),g.length>0&&e.jsx("optgroup",{label:"Other",children:g.map(s=>e.jsx("option",{value:s.id,children:s.name},s.id))}),e.jsx("optgroup",{label:"──────────────",children:e.jsx("option",{value:q,children:"Another school — search all schools"})})]}),$&&!b&&e.jsxs("div",{style:{marginTop:8,display:"grid",gap:6},children:[e.jsx(be,{educationLevel:"any",inputClassName:`elm-input${p.school_other?" error":""}`,value:o.school_other?{schoolName:o.school_other,schoolSource:"custom"}:null,onChange:s=>{r(j=>({...j,school_other:s.schoolName||""})),n("school_other")}}),p.school_other&&e.jsx("div",{className:"elm-field-error",children:p.school_other}),e.jsx("div",{className:"elm-school-hint",style:{fontSize:10},children:"Pick the school from the list, or use what you typed if it isn't there. The name is saved with the lead for School Origin."})]})]}),e.jsxs(B,{name:"notes",label:"Notes",optional:!0,error:p.notes,span2:!0,children:[e.jsx("textarea",{id:"edit-lead-notes",maxLength:G.notes.max,name:"notes",className:`elm-textarea${p.notes?" error":""}`,placeholder:"Add any relevant notes about this lead…",value:o.notes,onChange:N,rows:3,disabled:b,style:{resize:"vertical",minHeight:72}}),e.jsxs("div",{className:"elm-notes-counter",style:{fontSize:10,marginTop:4,textAlign:"right",color:J>Q?"#dc2626":void 0},children:[J," / ",Q]})]})]}),p.submit&&e.jsxs("div",{className:"elm-submit-error",children:[e.jsx(ie,{icon:re}),p.submit]})]}),e.jsxs("div",{className:"elm-footer",children:[e.jsx("button",{className:"elm-btn-outline sm",onClick:z,disabled:x,type:"button",children:"Cancel"}),e.jsx("button",{className:"elm-btn-primary sm",onClick:A,disabled:x||b||!F||!D,title:D?void 0:"No changes to save",type:"button",children:x?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"elm-spinner"}),"Saving…"]}):"Save Changes"})]})]})}),E,e.jsx(ge,{open:h,onDiscard:i,onKeep:()=>L(!1)})]}),document.body)}function st(t,i){if(!t||t.length===0)return;const a=[{header:"First Name",key:c=>c.first_name??""},{header:"Last Name",key:c=>c.last_name??""},{header:"Email",key:c=>c.email??""},{header:"Phone",key:c=>c.phone??""},{header:"School",key:c=>c.schools?.name??"N/A"},{header:"Source",key:c=>c.source??""},{header:"Status",key:c=>c.status??""},{header:"Date Added",key:c=>c.created_at?new Date(c.created_at).toLocaleDateString("en-PH"):""}],o=c=>{const m=String(c).replace(/"/g,'""');return/[,"\n\r]/.test(m)?`"${m}"`:m},r=a.map(c=>o(c.header)).join(","),f=t.map(c=>a.map(m=>o(m.key(c))).join(",")),u=[r,...f].join(`\r
`),x=new Blob([u],{type:"text/csv;charset=utf-8;"}),_=URL.createObjectURL(x),v=document.createElement("a"),E=new Date().toISOString().slice(0,10);v.href=_,v.download=`leads_${E}.csv`,document.body.appendChild(v),v.click(),document.body.removeChild(v),URL.revokeObjectURL(_)}const je={feeder_school:"Feeder Schools",social_media:"Social Media",walk_in:"Walk-ins",referral:"Referrals",other:"Other"},de={feeder_school:{fill:"#3b82f6",light:"rgba(59,130,246,0.12)",text:"#2563eb"},social_media:{fill:"#a855f7",light:"rgba(168,85,247,0.12)",text:"#9333ea"},walk_in:{fill:"#10b981",light:"rgba(16,185,129,0.12)",text:"#059669"},referral:{fill:"#f59e0b",light:"rgba(245,158,11,0.12)",text:"#d97706"},other:{fill:"#94a3b8",light:"rgba(148,163,184,0.12)",text:"#64748b"}},_e={new:"New",contacted:"Contacted",qualified:"Qualified",pending_documents:"Pending Docs",enrolled:"Enrolled",lost:"Lost",rejected:"Rejected"},nt={new:"#3b82f6",contacted:"#8b5cf6",qualified:"#10b981",pending_documents:"#f59e0b",enrolled:"#059669",lost:"#ef4444",rejected:"#94a3b8"},it=[{value:"all",label:"All"},{value:"new",label:"New"},{value:"contacted",label:"Contacted"},{value:"qualified",label:"Qualified"},{value:"pending_documents",label:"Pending Docs"},{value:"enrolled",label:"Enrolled"},{value:"lost",label:"Lost"},{value:"rejected",label:"Rejected"}];function rt(t,i){return i?t.map(({key:a,count:o})=>({key:a,label:je[a]||a,count:o,pct:parseFloat((o/i*100).toFixed(1)),color:de[a]||de.other})):[]}function ct(t,i){return i?t.map(({key:a,count:o})=>({key:a,label:_e[a]||a,count:o,pct:parseFloat((o/i*100).toFixed(1)),color:nt[a]||"#94a3b8"})):[]}function dt({segments:t,size:i=120,thickness:a=22,activeIdx:o,onHover:r}){const f=(i-a)/2,u=i/2,x=i/2,_=2*Math.PI*f,v=t.map(S=>S.pct/100*_),E=v.map((S,w)=>v.slice(0,w).reduce((h,L)=>h+L+_*.01,-.25*_)),c=t.map((S,w)=>{const h=v[w],L=_-h,b=E[w];return e.jsx("circle",{cx:u,cy:x,r:f,fill:"none",stroke:S.color.fill,strokeWidth:o===w?a+4:a,strokeDasharray:`${h} ${L}`,strokeDashoffset:-b,strokeLinecap:"round",style:{transition:"stroke-width 0.2s, opacity 0.2s",opacity:o===null||o===w?1:.35,cursor:"pointer"},onMouseEnter:()=>r(w),onMouseLeave:()=>r(null)},S.key)}),m=o!==null?t[o]:null;return e.jsxs("svg",{width:i,height:i,viewBox:`0 0 ${i} ${i}`,style:{overflow:"visible"},children:[e.jsx("circle",{cx:u,cy:x,r:f,fill:"none",stroke:"#f1f5f9",strokeWidth:a}),c,e.jsx("text",{x:u,y:x-8,textAnchor:"middle",fontSize:"11",fill:"#94a3b8",fontFamily:"inherit",children:m?m.label.split(" ")[0]:"Sources"}),e.jsx("text",{x:u,y:x+10,textAnchor:"middle",fontSize:"18",fontWeight:"700",fill:"#111827",fontFamily:"inherit",children:m?`${m.pct}%`:t.length}),e.jsx("text",{x:u,y:x+25,textAnchor:"middle",fontSize:"10",fill:"#94a3b8",fontFamily:"inherit",children:m?`${m.count} lead${m.count!==1?"s":""}`:"types"})]})}function mt({statuses:t,total:i}){const[a,o]=d.useState(null);return!t.length||i===0?null:e.jsxs("div",{children:[e.jsx("div",{style:{display:"flex",height:10,borderRadius:99,overflow:"hidden",gap:1,marginBottom:10},children:t.map((r,f)=>e.jsx("div",{title:`${r.label}: ${r.count} (${r.pct}%)`,style:{flex:r.count,background:r.color,transition:"opacity 0.15s",opacity:a===null||a===f?1:.4,cursor:"default"},onMouseEnter:()=>o(f),onMouseLeave:()=>o(null)},r.key))}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px 14px"},children:t.map((r,f)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:5,opacity:a===null||a===f?1:.4,cursor:"default",transition:"opacity 0.15s"},onMouseEnter:()=>o(f),onMouseLeave:()=>o(null),children:[e.jsx("span",{style:{width:8,height:8,borderRadius:2,background:r.color,flexShrink:0}}),e.jsx("span",{style:{fontSize:11,color:"#374151",fontWeight:500},children:r.label}),e.jsx("span",{style:{fontSize:11,color:"#9ca3af",fontWeight:600},children:r.count})]},r.key))})]})}function ht({stats:t}){const[i,a]=d.useState(null),o=t?.total??0,r=rt(t?.by_source??[],o),f=ct(t?.by_status??[],o);return o===0?e.jsx("div",{style:{padding:"28px 16px",textAlign:"center",color:"#9ca3af",fontSize:13},children:"Add leads with a source to see the breakdown."}):e.jsxs("div",{style:{padding:"16px 18px",display:"flex",flexDirection:"column",gap:18},children:[e.jsxs("div",{style:{display:"flex",gap:20,alignItems:"flex-start",flexWrap:"wrap"},children:[e.jsx("div",{style:{flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",padding:"4px 0"},children:e.jsx(dt,{segments:r,size:128,thickness:20,activeIdx:i,onHover:a})}),e.jsx("div",{style:{flex:1,minWidth:180,display:"flex",flexDirection:"column",gap:8,justifyContent:"center"},children:r.map((u,x)=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4,padding:"8px 10px",borderRadius:10,background:i===x?u.color.light:"transparent",border:`1.5px solid ${i===x?u.color.fill+"44":"#f1f5f9"}`,transition:"background 0.15s, border-color 0.15s",cursor:"default",opacity:i===null||i===x?1:.5},onMouseEnter:()=>a(x),onMouseLeave:()=>a(null),children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:7},children:[e.jsx("span",{style:{width:10,height:10,borderRadius:3,background:u.color.fill,flexShrink:0}}),e.jsx("span",{style:{fontSize:12,fontWeight:600,color:"#111827"},children:u.label})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsxs("span",{style:{fontSize:11,fontWeight:700,color:u.color.text,background:u.color.light,padding:"2px 8px",borderRadius:20},children:[u.pct,"%"]}),e.jsx("span",{style:{fontSize:12,fontWeight:700,color:"#374151",minWidth:28,textAlign:"right"},children:u.count})]})]}),e.jsx("div",{style:{height:4,borderRadius:99,background:"#f1f5f9",overflow:"hidden"},children:e.jsx("div",{style:{height:"100%",borderRadius:99,width:`${u.pct}%`,background:u.color.fill,transition:"width 0.5s cubic-bezier(0.16,1,0.3,1)"}})})]},u.key))})]}),e.jsx("div",{style:{height:1,background:"#f1f5f9"}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:11,fontWeight:700,color:"#9ca3af",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10},children:"Status Distribution"}),e.jsx(mt,{statuses:f,total:o})]}),r[0]&&e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:10,background:r[0].color.light,border:`1px solid ${r[0].color.fill}33`},children:[e.jsx("span",{style:{display:"inline-flex",color:"#d97706"},children:e.jsx(Me,{size:22})}),e.jsxs("div",{children:[e.jsxs("div",{style:{fontSize:12,fontWeight:700,color:r[0].color.text},children:["Top source: ",r[0].label]}),e.jsxs("div",{style:{fontSize:11,color:"#6b7280",marginTop:1},children:[r[0].count," lead",r[0].count!==1?"s":""," · ",r[0].pct,"% of all leads"]})]})]})]})}function pt(t,i=300){const[a,o]=d.useState(t);return d.useEffect(()=>{const r=window.setTimeout(()=>o(t),i);return()=>window.clearTimeout(r)},[t,i]),a}const me="id, first_name, last_name, suffix, email, phone, status, source, created_at, school_id, school_name, school_type",he=t=>({...t,schools:t.school_id||t.school_name?{id:t.school_id??null,name:t.school_name,type:t.school_type??null}:null});function Wt({onLeadAdded:t,onLeadUpdated:i,onImportLeads:a,onShowToast:o}){const[r,f]=d.useState(!1),[u,x]=d.useState(null),[_,v]=d.useState(null),[E,c]=d.useState("all"),[m,S]=d.useState(""),[w,h]=d.useState(null),L=d.useCallback(async()=>{const{data:l,error:g}=await P.rpc("marketing_lead_stats");if(g){console.error("[LeadsTab] stats error:",g);return}h(l)},[]);d.useEffect(()=>{L()},[L]);const b=pt(m),X=we(()=>{let l=P.from("leads_list_v").select(me,{count:"exact"}).order("created_at",{ascending:!1}).order("id");return E!=="all"&&(l=l.eq("status",E)),Ne(l,"search_text",b)},{deps:[E,b]}),N=X.rows.map(he),D=X.refetch,z=d.useCallback(()=>{L(),D()},[L,D]);Ce(["leads","schools"],z,{paused:!!u||r});const H=l=>w?.by_status?.find(g=>g.key===l)?.count??0,C=w?.total??0,p=w?.feeder_schools??0,F=H("enrolled"),n=async()=>{const{data:l,error:g}=await ke(()=>P.from("leads_list_v").select(me).order("created_at",{ascending:!1}).order("id"));if(g){o({message:"Export failed: "+g.message,type:"error"});return}const $=(l||[]).map(he);if(!$.length){o({message:"No leads to export.",type:"error"});return}st($),o({message:`${$.length} leads exported to CSV.`,type:"success"})},k=l=>{z(),t?.(l),f(!1),o({message:`Lead "${le(l)}" added!`,type:"success"})},I=l=>{z(),i?.(l),x(null),v(null),o({message:`Lead "${le(l)}" updated!`,type:"success"})},A=()=>{z(),v(null),o({message:"Lead archived.",type:"success"})};return e.jsxs(e.Fragment,{children:[e.jsxs("div",{children:[e.jsxs("div",{className:"sti-kpi-grid",style:{gridTemplateColumns:"repeat(3, 1fr)",marginBottom:18},children:[e.jsx(oe,{label:"Total Leads",value:C,sub:`${H("new")} new`}),e.jsx(oe,{label:"Feeder Schools",value:p,sub:"Active partners"}),e.jsx(oe,{label:"Enrolled",value:F,sub:`${C>0?(F/C*100).toFixed(1):0}% rate`})]}),e.jsxs("div",{className:"sti-tbl-card",style:{marginBottom:14},children:[e.jsxs("div",{className:"sti-tbl-head",children:[e.jsx("span",{className:"sti-tbl-title",children:"All Leads"}),e.jsxs("div",{style:{display:"flex",gap:6,alignItems:"center"},children:[e.jsx("button",{className:"sti-btn-primary sm",onClick:()=>f(!0),children:"＋ Add"}),e.jsx("button",{className:"sti-btn-outline sm",onClick:a,children:"Import"}),e.jsx("button",{className:"sti-btn-outline sm",onClick:n,children:"↓ Export"})]})]}),e.jsxs("div",{style:{padding:"10px 14px",borderBottom:"1px solid rgba(255,255,255,.06)",display:"flex",flexDirection:"column",gap:8},children:[e.jsxs("div",{style:{position:"relative"},children:[e.jsx("span",{style:{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",opacity:.5,display:"inline-flex"},children:e.jsx(Pe,{size:13})}),e.jsx("input",{placeholder:"Search name or school…",value:m,onChange:l=>S(l.target.value),className:"sti-input",style:{paddingLeft:30,width:"100%",boxSizing:"border-box"}})]}),e.jsx("div",{style:{display:"flex",gap:6,overflowX:"auto",paddingBottom:2,scrollbarWidth:"none"},children:it.map(l=>{const g=l.value==="all"?C:H(l.value),$=E===l.value;return e.jsxs("button",{onClick:()=>c(l.value),"aria-pressed":$,style:{padding:"4px 10px",whiteSpace:"nowrap",flexShrink:0,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"},children:[l.label," ",e.jsxs("span",{style:{opacity:.5},children:["(",g,")"]})]},l.value)})})]}),e.jsx("div",{className:"sti-tbl-wrap",children:e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Name"}),e.jsx("th",{children:"School"}),e.jsx("th",{children:"Source"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Date Added"})]})}),e.jsx("tbody",{children:X.ready?N.length===0?e.jsx("tr",{children:e.jsxs("td",{colSpan:5,className:"sti-empty",children:[m||E!=="all"?"No leads match your filter. ":"No leads yet. ",m||E!=="all"?e.jsx("button",{onClick:()=>{S(""),c("all")},"data-variant":"text",style:{background:"none",border:"none",color:"#60a5fa",cursor:"pointer",fontSize:13,padding:0},children:"Clear filters →"}):e.jsx("button",{onClick:()=>f(!0),"data-variant":"text",style:{background:"none",border:"none",color:"#60a5fa",cursor:"pointer",fontSize:13,padding:0},children:"Add your first lead →"})]})}):N.map(l=>e.jsxs("tr",{onClick:()=>R(l),title:"Click to view details",style:{cursor:"pointer"},children:[e.jsxs("td",{className:"sti-td-name",children:[le(l),l.email&&e.jsx("div",{style:{fontSize:10,fontWeight:400,marginTop:1,opacity:.6},children:l.email})]}),e.jsx("td",{children:l.schools?.name?e.jsxs(e.Fragment,{children:[l.schools.name,l.schools.type&&e.jsx("span",{className:`sti-badge ${l.schools.type==="feeder"?"sti-b-blue":"sti-b-gray"}`,style:{fontSize:9,padding:"1px 6px",marginLeft:6},children:l.schools.type})]}):e.jsx("span",{style:{opacity:.4},children:"N/A"})}),e.jsx("td",{style:{fontSize:12},children:l.source?je[l.source]||l.source:e.jsx("span",{style:{opacity:.4},children:"—"})}),e.jsx("td",{children:e.jsx("span",{className:`sti-badge sti-status-${l.status}`,children:_e[l.status]??l.status})}),e.jsx("td",{style:{whiteSpace:"nowrap",fontSize:12},children:new Date(l.created_at).toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"})})]},l.id)):e.jsx(Re,{rows:8,columns:["stack","text","badge","badge","date"],cellPadding:null})})]})}),e.jsx(Oe,{...X,label:"leads"})]}),e.jsxs("div",{className:"sti-tbl-card",children:[e.jsxs("div",{className:"sti-tbl-head",children:[e.jsx("span",{className:"sti-tbl-title",children:"Source Breakdown"}),e.jsxs("span",{className:"sti-badge sti-b-gray",children:[C," lead",C!==1?"s":""]})]}),e.jsx(ht,{stats:w})]})]}),r&&e.jsx(Je,{onClose:()=>f(!1),onSaved:k}),u&&e.jsx(at,{lead:u,onClose:()=>x(null),onSaved:I}),_&&e.jsx(Ae,{lead:_,onClose:()=>v(null),onEdit:l=>{v(null),x(l)},onSaved:I,onArchived:A})]});function R(l){v(l)}}export{Wt as default};

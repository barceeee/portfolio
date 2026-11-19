import{r as x,j as e}from"./index-D3Nqo7Vt.js";import{I as n}from"./InlineIcon-CofZrkIi.js";import{u as k}from"./useArchive-CeIw2nIK.js";import{U as N}from"./UnsavedChangesDialog-DzvcVmKq.js";import{f as m}from"./personName-D3dh8C-S.js";import{P as S}from"./Portal-xrIY5Poj.js";import{A as h}from"./archive-DeTdWmhi.js";import{U as A}from"./lazyTab-Az7b0gc9.js";import{T as L}from"./triangle-alert-7Pgj65oc.js";import{G as z}from"./graduation-cap-CmvBn3tN.js";import{L as C}from"./lock-BDBoB_GM.js";import{P as E}from"./pencil-D_8kq8TV.js";const _=new Set(["enrolled","lost"]),b={new:"New",contacted:"Contacted",qualified:"Qualified",pending_documents:"Pending Docs",enrolled:"Enrolled",lost:"Lost",rejected:"Rejected"},D={feeder_school:"Feeder School",social_media:"Social Media",walk_in:"Walk-in",referral:"Referral",other:"Other"},P=`

  /* ══════════════════════
     MODAL CHROME  (self-contained so this
     modal works without AddLeadModal)
  ══════════════════════ */
  .sti-modal-overlay {
    position: fixed; inset: 0; z-index: 9000;
    background: rgba(0,0,0,.45); backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .sti-modal {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    width: 100%;
    box-shadow: 0 16px 48px rgba(0,0,0,.12);
    display: flex; flex-direction: column;
    /* Fits the screen: header and footer stay, only the body scrolls. */
    max-height: calc(100vh - 40px); max-height: calc(100dvh - 40px); overflow: hidden;
  }
  .sti-modal-header {
    display: flex; align-items: center; gap: 10px;
    padding: 16px 20px;
    border-bottom: 1px solid #f1f5f9;
    flex-shrink: 0;
  }
  .sti-modal-title {
    display: flex; align-items: center; gap: 8px;
    font-size: 15px; font-weight: 700; color: #0f172a;
    flex: 1;
  }
  .sti-modal-title-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: #fce7f3;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px;
  }
  .sti-modal-close {
    font-size: 18px; line-height: 1;
    padding: 4px 6px;
  }

  .sti-modal-body-scroll {
    padding: 20px 24px; flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain;
    scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent;
  }
  .sti-modal-body-scroll::-webkit-scrollbar { width: 4px; }
  .sti-modal-body-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

  .sti-modal-footer {
    display: flex; align-items: center; justify-content: flex-end; gap: 8px;
    padding: 14px 20px;
    border-top: 1px solid #f1f5f9;
    flex-shrink: 0;
  }

  /* ── Section headers ── */
  .sti-step-header {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 14px; margin-top: 4px;
  }
  .sti-step-dot {
    width: 22px; height: 22px; border-radius: 50%;
    background: #ec4899;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .sti-step-label {
    font-size: 10px; font-weight: 700; letter-spacing: .8px;
    text-transform: uppercase; color: #64748b;
  }

  /* ── Divider ── */
  .sti-divider { height: 1px; background: #e2e8f0; margin: 18px 0; }

  /* ── Buttons ── */
  .sti-btn-outline {
    padding: 8px 16px;
    font-size: 13px; font-weight: 500;
    font-family: inherit;
  }

  .sti-btn-primary {
    padding: 8px 16px;
    font-size: 13px; font-weight: 600;
    font-family: inherit;
    display: inline-flex; align-items: center; gap: 6px;
  }

  .sti-btn-danger {
    padding: 8px 16px;
    font-size: 13px; font-weight: 600;
    font-family: inherit;
    display: inline-flex; align-items: center; gap: 6px;
    margin-right: auto;
  }

  /* ══════════════════════
     VIEW-SPECIFIC STYLES
  ══════════════════════ */
  .sti-view-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 16px;
  }
  .sti-view-form-grid .sti-view-field.span-2 { grid-column: 1 / -1; }
  @media (max-width: 640px) {
    .sti-view-form-grid { grid-template-columns: minmax(0, 1fr); }
  }

  .sti-view-field { margin-bottom: 14px; }

  .sti-view-field-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: #64748b;
    margin-bottom: 6px;
    display: block;
  }

  .sti-view-field-value {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 36px;
    padding: 7px 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 13px;
    color: #0f172a;
    font-weight: 400;
  }

  .sti-view-field-value.muted {
    color: #94a3b8;
    font-style: italic;
  }

  /* ── Status pills ── */
  .sti-view-status-pill {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .03em;
    border: 1px solid transparent;
  }
  .sti-view-status-pill.new               { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
  .sti-view-status-pill.contacted         { background: #faf5ff; color: #7c3aed; border-color: #ddd6fe; }
  .sti-view-status-pill.qualified         { background: #fffbeb; color: #b45309; border-color: #fde68a; }
  .sti-view-status-pill.pending_documents { background: #fff7ed; color: #c2410c; border-color: #fed7aa; }
  .sti-view-status-pill.enrolled          { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
  .sti-view-status-pill.lost              { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
  .sti-view-status-pill.rejected          { background: #f8fafc; color: #475569; border-color: #cbd5e1; }

  /* ── Hero card ── */
  .sti-view-avatar {
    width: 42px; height: 42px; border-radius: 50%;
    background: #fce7f3;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: #be185d;
    flex-shrink: 0;
  }

  .sti-view-lead-hero {
    display: flex; align-items: center; gap: 12px;
    padding: 13px 15px;
    background: #f8fafc; border: 1px solid #e2e8f0;
    border-radius: 10px; margin-bottom: 20px;
  }

  .sti-view-lead-hero-name  { font-size: 15px; font-weight: 700; color: #0f172a; }
  .sti-view-lead-hero-email { font-size: 11px; color: #94a3b8; margin-top: 2px; }

  /* ── Lock banners ── */
  .sti-view-lock-banner {
    display: flex; align-items: flex-start; gap: 8px;
    border-radius: 8px; padding: 10px 13px;
    font-size: 11.5px; margin-bottom: 16px; line-height: 1.5;
  }
  .sti-view-lock-banner.enrolled { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
  .sti-view-lock-banner.lost     { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }

  /* ── Archive banner ── */
  .sti-archive-banner {
    display: flex; align-items: flex-start; gap: 8px;
    border-radius: 8px; padding: 10px 13px;
    font-size: 11.5px; margin-bottom: 16px; line-height: 1.5;
    background: #fff7ed; border: 1px solid #fed7aa; color: #c2410c;
  }

`;function T(){if(document.getElementById("sti-view-modal-styles"))return;const i=document.createElement("style");i.id="sti-view-modal-styles",i.textContent=P,document.head.appendChild(i)}function s({label:i,value:t,span2:r,children:a}){return e.jsxs("div",{className:`sti-view-field${r?" span-2":""}`,children:[e.jsx("span",{className:"sti-view-field-label",children:i}),a?e.jsx("div",{className:"sti-view-field-value",children:a}):e.jsx("div",{className:`sti-view-field-value${t?"":" muted"}`,children:t||"—"})]})}function G({lead:i,onClose:t,onEdit:r,onArchived:a}){T();const{archiveRecord:g,loading:d}=k(),[c,p]=x.useState(null),[u,o]=x.useState(!1),f=_.has(i.status),v=`${i.first_name?.[0]??""}${i.last_name?.[0]??""}`.toUpperCase(),w=i.created_at?new Date(i.created_at).toLocaleDateString("en-PH",{month:"long",day:"numeric",year:"numeric"}):null,j=l=>{l.target===l.currentTarget&&t()},y=async()=>{o(!1),p(null);try{await g({sourceTable:"leads",sourceId:i.id,reason:"Manually archived by user",deleteAfterArchive:!0}),a?.(i.id),t()}catch(l){p(l?.message??"Archive failed. Please try again.")}};return e.jsx(S,{children:e.jsxs(e.Fragment,{children:[e.jsx(N,{open:u,onDiscard:y,onKeep:()=>o(!1),icon:e.jsx(h,{size:24,strokeWidth:1.8}),title:`Archive ${m(i)}?`,description:"This lead will be removed from the list and kept in the Archive.",confirmLabel:"Yes, Archive",cancelLabel:"Cancel"}),e.jsx("div",{className:"sti-modal-overlay",onClick:j,children:e.jsxs("div",{className:"sti-modal",role:"dialog","aria-modal":"true","aria-labelledby":"sti-view-lead-modal-title",style:{maxWidth:540},children:[e.jsxs("div",{className:"sti-modal-header",children:[e.jsxs("div",{className:"sti-modal-title",id:"sti-view-lead-modal-title",children:[e.jsx("div",{className:"sti-modal-title-icon",children:e.jsx(A,{size:20,strokeWidth:2})}),"Lead Profile"]}),e.jsx("button",{className:"sti-modal-close",onClick:t,"aria-label":"Close",children:"✕"})]}),e.jsxs("div",{className:"sti-modal-body-scroll",children:[c&&e.jsxs("div",{className:"sti-archive-banner",children:[e.jsx(n,{icon:L}),c]}),f&&e.jsxs("div",{className:`sti-view-lock-banner ${i.status}`,children:[e.jsx("span",{style:{display:"inline-flex"},children:i.status==="enrolled"?e.jsx(z,{size:16}):e.jsx(C,{size:16})}),e.jsxs("span",{children:["This lead is ",e.jsx("strong",{children:b[i.status]})," and can no longer be edited.",i.status==="enrolled"&&" Enrollment is permanent.",i.status==="lost"&&" Lost leads are archived and cannot be modified."]})]}),e.jsxs("div",{className:"sti-view-lead-hero",children:[e.jsx("div",{className:"sti-view-avatar",children:v}),e.jsxs("div",{children:[e.jsx("div",{className:"sti-view-lead-hero-name",children:m(i)}),i.email?e.jsx("div",{className:"sti-view-lead-hero-email",children:i.email}):e.jsx("div",{className:"sti-view-lead-hero-email",children:"No email on file"})]})]}),e.jsxs("div",{className:"sti-step-header",children:[e.jsx("div",{className:"sti-step-dot",children:"1"}),e.jsx("span",{className:"sti-step-label",children:"Personal Information"})]}),e.jsxs("div",{className:"sti-view-form-grid",children:[e.jsx(s,{label:"First Name",value:i.first_name}),e.jsx(s,{label:"Last Name",value:i.last_name}),e.jsx(s,{label:"Suffix",value:i.suffix}),e.jsx(s,{label:"Email",value:i.email}),e.jsx(s,{label:"Phone",value:i.phone})]}),e.jsx("div",{className:"sti-divider"}),e.jsxs("div",{className:"sti-step-header",children:[e.jsx("div",{className:"sti-step-dot",children:"2"}),e.jsx("span",{className:"sti-step-label",children:"Lead Details"})]}),e.jsxs("div",{className:"sti-view-form-grid",children:[e.jsx(s,{label:"Status",children:e.jsx("span",{className:`sti-view-status-pill ${i.status}`,children:b[i.status]??i.status})}),e.jsx(s,{label:"Lead Source",value:i.source?D[i.source]||i.source:null}),e.jsx(s,{label:"School",span2:!0,children:i.schools?.name?e.jsxs(e.Fragment,{children:[i.schools.name,i.schools.type&&e.jsx("span",{className:`sti-badge ${i.schools.type==="feeder"?"sti-b-blue":"sti-b-gray"}`,style:{fontSize:9,padding:"2px 7px"},children:i.schools.type})]}):e.jsx("span",{className:"muted",children:"—"})}),e.jsx(s,{label:"Date Added",value:w}),i.notes&&e.jsx(s,{label:"Notes",span2:!0,children:e.jsx("span",{style:{whiteSpace:"pre-wrap",lineHeight:1.6},children:i.notes})})]})]}),e.jsxs("div",{className:"sti-modal-footer",children:[e.jsxs("button",{className:"sti-btn-danger","data-variant":"danger",onClick:()=>o(!0),disabled:d,title:"Archive this lead",children:[e.jsx(n,{icon:h}),d?"Archiving…":"Archive"]}),e.jsx("button",{className:"sti-btn-outline",onClick:t,children:"Close"}),!f&&e.jsxs("button",{className:"sti-btn-primary",onClick:()=>r(i),children:[e.jsx(n,{icon:E}),"Edit Lead"]})]})]})})]})})}export{G as V};

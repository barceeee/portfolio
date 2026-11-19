import{c as C,j as e,r as c}from"./index-D3Nqo7Vt.js";import{s as E}from"./supabase-DrDKJ_9s.js";import{u as ne}from"./useServerPagination-Bw09DdrV.js";import{u as le}from"./useLiveRefresh-CPJrLllO.js";import{P as oe}from"./Pagination-CPz2hTLp.js";import{u as de}from"./useFariCounseling-DZbuTul_.js";import{F as pe}from"./file-text-DzwPba_H.js";import{U as ce}from"./UnsavedChangesDialog-DzvcVmKq.js";import{f as A}from"./personName-D3dh8C-S.js";import{i as me,S as K,b as ge}from"./SkeletonLoader-DjOiN1TB.js";import{B as V}from"./AdminDashboard-CD6rSino.js";import{S as he}from"./search-DK4dsrHa.js";import{R as Y}from"./refresh-cw-B1Xi0lyH.js";import{C as Z}from"./circle-check-wgng9OM9.js";import{R as J}from"./rotate-ccw-BtVdBDVB.js";import{T as xe}from"./triangle-alert-7Pgj65oc.js";import"./queryCache-w5HkREVU.js";import"./useCachedQuery-jsvtVpO2.js";import"./atRiskCases-DsfIUIFV.js";import"./validators-C1Gad3mA.js";import"./lazyTab-Az7b0gc9.js";import"./search-x-C2jN_qZX.js";import"./useAuthGuard-6HeA-jon.js";import"./useFieldErrors-Bhgxkuro.js";import"./textInput-OZwu5ktJ.js";import"./Modal-BHtgS2BU.js";import"./x-OoJvVtv7.js";import"./shield-check-PFakXQU9.js";import"./layout-dashboard-CjrVVn5y.js";import"./book-open-CUmnt-gY.js";import"./users-ld6q4exq.js";import"./graduation-cap-CmvBn3tN.js";import"./clipboard-list-lOnM7G9c.js";import"./archive-DeTdWmhi.js";import"./inbox-XSloXYZI.js";const ue=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],D=C("circle-alert",ue);const fe=[["path",{d:"M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528",key:"1jaruq"}]],be=C("flag",fe);const ye=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],M=C("loader-circle",ye);const je=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],H=C("sparkles",je),Q={consistent:{label:"Grades and FARI agree",cls:"green"},mixed:{label:"Mostly aligned",cls:"blue"},divergent:{label:"Grades and FARI diverge",cls:"amber"},unavailable:{label:"Not comparable",cls:"gray"}},X={aligned:{label:"Aligned",cls:"green"},grades_above_test:{label:"Grade higher than test",cls:"amber"},test_above_grades:{label:"Test higher than grade",cls:"violet"}},ve={lrn:"LRN",exam_account:"exam account",name:"student name"},G=s=>s==="high"?"high":s==="mid"?"mid":"low",we={high:"green",mid:"blue",low:"amber"},Ne={math:"Math",english:"English",science:"Science",ict:"ICT",filipino:"Filipino",other:"Other"};function _e({form138:s,crosscheck:t,narrative:n}){if(!s)return null;if(!s.status)return e.jsxs("div",{className:"ap-card ap-empty",style:{borderStyle:"dashed"},children:[e.jsx("span",{className:"ap-intro-icon",children:e.jsx(pe,{size:16,"aria-hidden":"true"})}),e.jsx("p",{children:"No Form 138 is linked to this student yet. Upload the report card in the Documents tab and the grades will be cross-checked against these FARI results."})]});if(!s.available)return e.jsxs("div",{className:"ap-card ap-card--warn",children:[e.jsx("div",{className:"ap-card-title",style:{"--ap-title-accent":"#b45309"},children:"Form 138 awaiting review"}),e.jsx("p",{className:"ap-text",children:"A report card was scanned for this student, but its grades were flagged (for example a name mismatch or a hard-to-read page), so they are not used in the analysis. Open the Documents tab, compare the grades with the file, and confirm them to include them here."})]});const l=Q[t?.verdict]??Q.unavailable,x=t?.rows??[],o=t?.profile??null,v=t?.subjects??[];return e.jsxs("div",{className:"ap-card",children:[e.jsxs("div",{className:"ap-row",style:{alignItems:"flex-start",marginBottom:12},children:[e.jsx("div",{className:"ap-card-title",style:{"--ap-title-accent":"#0e7490",marginBottom:0},children:"Form 138 cross-check"}),e.jsx("span",{className:`ap-badge ap-badge--${l.cls}`,children:l.label})]}),e.jsx("div",{style:{display:"grid",gap:12},children:x.map(i=>{const u=X[i.alignment]??X.aligned;return e.jsxs("div",{className:"ap-stat",children:[e.jsxs("div",{className:"ap-row",style:{alignItems:"center"},children:[e.jsx("div",{className:"ap-domain-name",style:{fontSize:14},children:i.area}),e.jsx("span",{className:`ap-badge ap-badge--${u.cls}`,style:{fontSize:12},children:u.label})]}),e.jsxs("div",{className:"ap-muted",style:{marginTop:6},children:[i.shs_label,": ",e.jsx("strong",{style:{color:"var(--ap-text)"},children:i.shs_grade})," (",G(i.shs_tier),")"," · ",i.fari_label,": ",e.jsxs("strong",{style:{color:"var(--ap-text)"},children:[i.fari_score,"/",i.fari_max]})," · ",i.fari_percent,"% (",G(i.fari_tier),")"]}),i.shs_subjects?.length>0&&i.shs_subjects.length<(o?.subject_count??1/0)&&e.jsxs("div",{className:"ap-muted",style:{marginTop:4,fontSize:12},children:["From: ",i.shs_subjects.join(", ")]})]},i.area)})}),o&&o.subject_count>0&&e.jsxs("div",{className:"ap-stat",style:{marginTop:12},children:[e.jsx("div",{className:"ap-domain-name",style:{fontSize:14},children:"Whole report card"}),e.jsxs("div",{className:"ap-muted",style:{marginTop:6},children:[o.subject_count," subjects · average ",e.jsx("strong",{style:{color:"var(--ap-text)"},children:o.whole_card_average}),o.printed_general_average!=null&&e.jsxs(e.Fragment,{children:[" (printed general average ",o.printed_general_average,")"]})," · ",o.tiers.high," high (90+), ",o.tiers.mid," mid (80–89), ",o.tiers.low," below 80"]}),o.strongest?.length>0&&e.jsxs("div",{className:"ap-muted",style:{marginTop:4},children:["Strongest: ",o.strongest.map(i=>`${i.subject} ${i.grade}`).join(", "),o.weakest?.length>0&&e.jsxs(e.Fragment,{children:[" · Weakest: ",o.weakest.map(i=>`${i.subject} ${i.grade}`).join(", ")]})]}),e.jsxs("details",{style:{marginTop:8},children:[e.jsx("summary",{className:"ap-muted",style:{cursor:"pointer",fontWeight:600},children:"All subjects on the card"}),e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",marginTop:8,fontSize:13},children:[e.jsx("thead",{children:e.jsx("tr",{children:["Subject","Group","Final grade","Level"].map(i=>e.jsx("th",{style:{textAlign:"left",padding:"4px 6px",color:"var(--ap-text-2)",fontWeight:600,borderBottom:"1px solid var(--ap-border)"},children:i},i))})}),e.jsx("tbody",{children:v.map((i,u)=>e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"4px 6px",color:"var(--ap-text)"},children:i.subject}),e.jsx("td",{style:{padding:"4px 6px",color:"var(--ap-text-2)"},children:Ne[i.area]??"Other"}),e.jsx("td",{style:{padding:"4px 6px",color:"var(--ap-text)",fontVariantNumeric:"tabular-nums"},children:i.grade}),e.jsx("td",{style:{padding:"4px 6px"},children:e.jsx("span",{className:`ap-badge ap-badge--${we[i.tier]??"gray"}`,style:{fontSize:11},children:G(i.tier)})})]},`${i.subject}-${u}`))})]})]})]}),n?.summary&&e.jsx("p",{className:"ap-text",style:{marginTop:14},children:n.summary}),n?.observations?.length>0&&e.jsx("ul",{className:"ap-list",style:{marginTop:8},children:n.observations.map((i,u)=>e.jsx("li",{children:i},u))}),e.jsxs("p",{className:"ap-muted",style:{marginTop:12},children:["Grades were read on this device from the uploaded Form 138",s.school_year?` (SY ${s.school_year}${s.grade_level?`, Grade ${s.grade_level}`:""})`:"",s.status==="verified"?" and confirmed by staff":" and have not been confirmed by staff",". Every subject is compared by its group: Math → Numerical, English → Reading & Verbal, Science → Abstract Reasoning, ICT → Digital Literacy, and all subjects → Academic total. Linked by ",ve[s.link_method]??"record match","."]})]})}const ze={raw_reading_verbal:"Reading & Verbal",raw_numerical:"Numerical",raw_abstract:"Abstract Reasoning",raw_digital_literacy:"Digital Literacy",raw_psychometric_sum:"Psychometric"},R={interpretation:[],flags:[],notes:[],model:"",crosscheck:null,form138:null},Se=`
.analysis-page {
  --ap-bg: #f6f8fb;
  --ap-card: #ffffff;
  --ap-card-alt: #f8fafc;
  --ap-border: #dbe2ea;
  --ap-text: #0f1b2d;
  --ap-text-2: #475467;
  --ap-accent: #1d4ed8;
  --ap-accent-hover: #1e40af;
  --ap-accent-soft: #eff4ff;
  --ap-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
  --ap-focus: 0 0 0 3px rgba(29, 78, 216, 0.35);

  color-scheme: light;
  background: var(--ap-bg) !important;
  color: var(--ap-text) !important;
  font-family: Inter, "Segoe UI", system-ui, -apple-system, Roboto, sans-serif;
  line-height: 1.6;
  padding: 16px 16px 32px;
  min-height: 100%;
  box-sizing: border-box;
}
.analysis-page *, .analysis-page *::before, .analysis-page *::after { box-sizing: border-box; }
.analysis-page .ap-inner { width: 100%; display: grid; gap: 16px; }

.analysis-page h1, .analysis-page h2, .analysis-page h3, .analysis-page p { margin: 0; }
.analysis-page .ap-title { font-size: 28px; font-weight: 700; letter-spacing: -0.01em; color: var(--ap-text); }
.analysis-page .ap-subtitle { font-size: 15px; color: var(--ap-text-2); margin-top: 4px; }

.analysis-page .ap-card {
  background: var(--ap-card) !important;
  color: var(--ap-text);
  border: 1px solid var(--ap-border);
  border-radius: 10px;
  padding: 20px;
  box-shadow: var(--ap-shadow);
}
.analysis-page .ap-card--warn  { border-color: #f1c36d; background: #fffaf0 !important; }
.analysis-page .ap-card--error { border-color: #f2a5a5; background: #fff5f5 !important; }

.analysis-page .ap-intro-head { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.analysis-page .ap-intro-icon {
  width: 36px; height: 36px; border-radius: 8px; display: grid; place-items: center;
  background: var(--ap-accent-soft); color: var(--ap-accent); flex: none;
}
.analysis-page .ap-h2 { font-size: 18px; font-weight: 700; color: var(--ap-text); }
.analysis-page .ap-desc { font-size: 14px; color: var(--ap-text-2); max-width: 760px; }

.analysis-page .ap-picker { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 16px; align-items: center; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--ap-border); }
.analysis-page .ap-picked { font-size: 14px; color: var(--ap-text-2); }
.analysis-page .ap-picked strong { color: var(--ap-text); }

.analysis-page .ap-finder { display: grid; gap: 12px; margin-top: 18px; }
.analysis-page .ap-search {
  display: flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 12px;
  background: #ffffff !important; border: 1px solid #aab4c3; border-radius: 8px; color: var(--ap-text-2);
}
.analysis-page .ap-search:focus-within { border-color: var(--ap-accent); box-shadow: var(--ap-focus); }
.analysis-page .ap-search input {
  flex: 1; min-width: 0; border: 0; outline: none; background: transparent !important;
  color: var(--ap-text) !important; font: inherit; font-size: 14px; padding: 10px 0;
}
.analysis-page .ap-filters { display: flex; flex-wrap: wrap; gap: 12px 20px; }
.analysis-page .ap-chip-group { display: flex; flex-wrap: wrap; gap: 8px; }
.analysis-page .ap-chip { padding: 6px 14px; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; }

.analysis-page .ap-table-wrap { margin-top: 14px; overflow-x: auto; border: 1px solid var(--ap-border); border-radius: 8px; background: #ffffff !important; }
.analysis-page .ap-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.analysis-page .ap-table th {
  text-align: left; padding: 10px 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em;
  color: var(--ap-text-2); background: var(--ap-card-alt) !important; border-bottom: 1px solid var(--ap-border); white-space: nowrap;
}
.analysis-page .ap-table td { padding: 10px 12px; border-bottom: 1px solid var(--ap-border); color: var(--ap-text); white-space: nowrap; }
.analysis-page .ap-table tbody tr:last-child td { border-bottom: 0; }
.analysis-page .ap-table tbody tr[tabindex] { cursor: pointer; }
.analysis-page .ap-table tbody tr[tabindex]:hover td { background: var(--ap-card-alt) !important; }
.analysis-page .ap-table tbody tr.is-selected td { background: var(--ap-accent-soft) !important; }
.analysis-page .ap-table tbody tr.is-selected td:first-child { box-shadow: inset 3px 0 0 var(--ap-accent); }
.analysis-page .ap-table tbody tr:focus-visible { outline: 2px solid var(--ap-accent); outline-offset: -2px; }
.analysis-page .ap-table .ap-td-name { font-weight: 600; white-space: normal; min-width: 180px; }
.analysis-page .ap-table .ap-num { text-align: right; font-variant-numeric: tabular-nums; }
.analysis-page .ap-table-empty { text-align: center; color: var(--ap-text-2) !important; padding: 24px 12px !important; }
.analysis-page .ap-badge--sm { padding: 2px 10px; font-size: 12px; text-transform: capitalize; }
.analysis-page .ap-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.analysis-page .ap-label { display: grid; gap: 8px; font-size: 13px; font-weight: 600; color: var(--ap-text); }

.analysis-page select {
  appearance: auto;
  width: 100%; min-height: 44px; padding: 10px 12px;
  background: #ffffff !important; color: var(--ap-text) !important;
  border: 1px solid #aab4c3; border-radius: 8px;
  font: inherit; font-size: 14px;
}
.analysis-page select option { background: #ffffff; color: var(--ap-text); }
.analysis-page select:hover { border-color: #6b7a90; }
.analysis-page select:focus-visible { outline: none; border-color: var(--ap-accent); box-shadow: var(--ap-focus); }

.analysis-page .ap-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 18px;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}
.analysis-page .ap-btn:disabled { cursor: not-allowed; }
.analysis-page .ap-btn[aria-busy="true"] { cursor: progress; }
.analysis-page .ap-spin {
  animation: ap-spin 1s linear infinite;
  display: inline-block;
  flex-shrink: 0;
}
@keyframes ap-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .analysis-page .ap-spin { animation-duration: 3s; } }

.analysis-page .ap-summary-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; padding-bottom: 16px; margin-bottom: 18px; border-bottom: 1px solid var(--ap-border); }
.analysis-page .ap-eyebrow { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: var(--ap-text-2); }
.analysis-page .ap-student { font-size: 20px; font-weight: 700; margin-top: 2px; color: var(--ap-text); }
.analysis-page .ap-badges { display: flex; gap: 8px; flex-wrap: wrap; }

.analysis-page .ap-badge {
  display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 999px;
  font-size: 13px; font-weight: 600; border: 1px solid; white-space: nowrap;
}
.analysis-page .ap-badge--blue   { background: #eaf1ff; color: #12358f; border-color: #bcd0fb; }
.analysis-page .ap-badge--red    { background: #fdecec; color: #8c1d1d; border-color: #f3b8b8; }
.analysis-page .ap-badge--amber  { background: #fff4de; color: #7a4a00; border-color: #f1d08d; }
.analysis-page .ap-badge--green  { background: #e8f6ee; color: #14532d; border-color: #b2dcc2; }
.analysis-page .ap-badge--violet { background: #f1ecfe; color: #4a2a9b; border-color: #d3c5f7; }
.analysis-page .ap-badge--gray   { background: #eef1f5; color: #344054; border-color: #d0d7e2; }
.analysis-page .ap-badge .ap-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }

.analysis-page .ap-scores { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
.analysis-page .ap-stat { background: var(--ap-card-alt) !important; border: 1px solid var(--ap-border); border-radius: 8px; padding: 14px 16px; }
.analysis-page .ap-stat-label { font-size: 13px; font-weight: 600; color: var(--ap-text-2); }
.analysis-page .ap-stat-value { font-size: 30px; font-weight: 700; line-height: 1.15; margin-top: 6px; color: var(--ap-text); font-variant-numeric: tabular-nums; }
@media (max-width: 1024px) { .analysis-page .ap-scores { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 640px) {
  .analysis-page { padding: 20px 14px 36px; }
  .analysis-page .ap-title { font-size: 24px; }
  .analysis-page .ap-picker { grid-template-columns: 1fr; }
  .analysis-page .ap-picker .ap-btn { width: 100%; }
  .analysis-page .ap-scores { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .analysis-page .ap-card { padding: 16px; }
}
@media (max-width: 380px) { .analysis-page .ap-scores { grid-template-columns: 1fr; } }

.analysis-page .ap-empty { display: flex; gap: 12px; align-items: flex-start; font-size: 14px; color: var(--ap-text-2); background: #ffffff !important; border-style: dashed; border-color: #b8c2d0; }
.analysis-page .ap-empty .ap-intro-icon { width: 32px; height: 32px; }

/* Results */
.analysis-page .ap-grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
.analysis-page .ap-card-title { font-size: 14px; font-weight: 700; margin-bottom: 10px; color: var(--ap-text); display: flex; align-items: center; gap: 8px; }
.analysis-page .ap-card-title::before { content: ""; width: 4px; height: 16px; border-radius: 2px; background: var(--ap-title-accent, var(--ap-accent)); }
.analysis-page .ap-list { margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.7; color: var(--ap-text); }
.analysis-page .ap-list li + li { margin-top: 4px; }
.analysis-page .ap-text { font-size: 14px; line-height: 1.7; color: var(--ap-text); }
.analysis-page .ap-muted { font-size: 13px; line-height: 1.6; color: var(--ap-text-2); }
.analysis-page .ap-row { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }

.analysis-page .ap-bar { height: 8px; border-radius: 999px; background: #e4e9f0; margin: 8px 0 6px; overflow: hidden; }
.analysis-page .ap-bar > div { height: 100%; border-radius: 999px; }
.analysis-page .ap-bar-good { background: #15803d; }
.analysis-page .ap-bar-mid  { background: #b45309; }
.analysis-page .ap-bar-low  { background: #b91c1c; }
.analysis-page .ap-bar-none { background: #94a3b8; }
.analysis-page .ap-domain-head { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; font-size: 14px; }
.analysis-page .ap-domain-name { font-weight: 600; }
.analysis-page .ap-domain-score { font-weight: 600; font-variant-numeric: tabular-nums; }
.analysis-page .ap-domain-good { color: #14532d; }
.analysis-page .ap-domain-mid  { color: #7a4a00; }
.analysis-page .ap-domain-low  { color: #8c1d1d; }
.analysis-page .ap-domain-none { color: var(--ap-text-2); }

.analysis-page .ap-plan { display: grid; gap: 12px; }
.analysis-page .ap-plan-row { display: grid; grid-template-columns: 140px minmax(0, 1fr); gap: 14px; font-size: 14px; padding-top: 12px; border-top: 1px solid var(--ap-border); }
.analysis-page .ap-plan-row:first-child { border-top: 0; padding-top: 0; }
.analysis-page .ap-plan-time { font-weight: 700; color: var(--ap-accent); }
@media (max-width: 560px) { .analysis-page .ap-plan-row { grid-template-columns: 1fr; gap: 2px; } }

.analysis-page .ap-callout { display: flex; gap: 10px; align-items: flex-start; }
.analysis-page .ap-callout svg { flex: none; margin-top: 2px; }
.analysis-page .ap-callout--warn { color: #6b4200; }
.analysis-page .ap-callout--error { color: #7f1d1d; }
.analysis-page .ap-flag-title { display: flex; align-items: center; gap: 7px; color: #8c1d1d; font-weight: 700; font-size: 14px; margin-bottom: 8px; }
.analysis-page .ap-watch { margin-top: 10px; font-size: 13px; line-height: 1.55; color: var(--ap-text-2); }
.analysis-page .ap-watch strong { color: #7a4a00; }
.analysis-page .ap-status {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 24px 0;
  font-size: 14px;
  color: var(--ap-text-2);
  text-align: center;
}
`,ke=s=>s==null?"none":s>=75?"good":s>=50?"mid":"low",ee={strong:{label:"Strong fit",cls:"green"},moderate:{label:"Moderate fit",cls:"blue"},exploratory:{label:"Exploratory",cls:"amber"},needs_support:{label:"Needs support",cls:"red"}},ae=s=>{const t=String(s??"").toLowerCase();return t==="red"?"red":t==="yellow"||t==="amber"||t==="orange"?"amber":t==="green"?"green":"gray"};function I({title:s,items:t,accent:n="#1d4ed8"}){return t?.length?e.jsxs("div",{className:"ap-card",style:{"--ap-title-accent":n},children:[e.jsx("div",{className:"ap-card-title",children:s}),e.jsx("ul",{className:"ap-list",children:t.map((l,x)=>e.jsx("li",{children:l},`${s}-${x}`))})]}):null}function Ae({interpretation:s}){return s?.length?e.jsxs("div",{className:"ap-card",children:[e.jsx("div",{className:"ap-card-title",children:"FARI domain interpretation"}),e.jsx("div",{style:{display:"grid",gap:18},children:s.map(t=>{const n=ke(t.percent),l=t.max===5;return e.jsxs("div",{children:[e.jsxs("div",{className:"ap-domain-head",children:[e.jsx("span",{className:"ap-domain-name",children:t.domain}),e.jsxs("span",{className:`ap-domain-score ap-domain-${n}`,children:[t.score===null?"n/a":l?`${t.score} / 5 avg`:`${t.score} / ${t.max}`," · ",t.band]})]}),e.jsx("div",{className:"ap-bar",role:"presentation",children:e.jsx("div",{className:`ap-bar-${n}`,style:{width:`${t.percent??0}%`}})}),e.jsx("div",{className:"ap-muted",children:t.meaning})]},t.domain)})})]}):null}function Re({items:s}){return s?.length?e.jsxs("div",{children:[e.jsx("div",{className:"ap-card-title",style:{"--ap-title-accent":"#1d4ed8"},children:"Program fit at STI College Alabang"}),e.jsx("div",{className:"ap-grid",children:s.map((t,n)=>{const l=ee[t.fit_level]??ee.exploratory;return e.jsxs("div",{className:"ap-card",children:[e.jsxs("div",{className:"ap-row",style:{alignItems:"flex-start",marginBottom:10},children:[e.jsx("div",{style:{fontWeight:700,fontSize:15},children:t.program}),e.jsx("span",{className:`ap-badge ap-badge--${l.cls}`,style:{fontSize:12},children:l.label})]}),e.jsx("p",{className:"ap-text",children:t.rationale}),t.watch_out&&e.jsxs("p",{className:"ap-watch",children:[e.jsx("strong",{children:"Watch out:"})," ",t.watch_out]})]},`${t.program}-${n}`)})})]}):null}function Ie({items:s}){return s?.length?e.jsxs("div",{className:"ap-card",children:[e.jsx("div",{className:"ap-card-title",children:"Suggested action plan"}),e.jsx("div",{className:"ap-plan",children:s.map((t,n)=>e.jsxs("div",{className:"ap-plan-row",children:[e.jsx("div",{className:"ap-plan-time",children:t.timeframe}),e.jsx("div",{children:t.action})]},n))})]}):null}const Fe=["fari_submissions"],Ce="id, student_name, student_lrn, wss, zone, raw_reading_verbal, raw_numerical, raw_abstract, raw_digital_literacy, raw_psychometric_sum, submitted_at, status, reviewed_at, reviewed_by_email, counseling_case_key",Te=[["all","All zones"],["green","Green"],["yellow","Yellow"],["red","Red"]],$e=[["all","All"],["pending","Needs review"],["finalized","Finalized"]];function Le(s,t=150){const[n,l]=c.useState(s);return c.useEffect(()=>{const x=window.setTimeout(()=>l(s),t);return()=>window.clearTimeout(x)},[s,t]),n}function fa(){const[s,t]=c.useState(null),n=s?.id??"",[l,x]=c.useState(!1),[o,v]=c.useState(""),[i,u]=c.useState(""),[w,se]=c.useState("all"),[N,te]=c.useState("all"),_=Le(i),m=ne(()=>{let a=E.from("fari_submissions").select(Ce,{count:"exact"}).order("submitted_at",{ascending:!1}).order("id");w!=="all"&&(a=a.eq("zone",w)),N==="finalized"?a=a.eq("status","finalized"):N!=="all"&&(a=a.neq("status","finalized"));const r=_.replace(/[%_*\\,()]/g," ").trim();return r?a.or(`student_name.ilike.%${r}%,student_lrn.ilike.%${r}%`):a},{deps:[w,N,_],cacheKey:"analysis-submissions"}),ie=w!=="all"||N!=="all"||_.trim()!=="",T=i.replace(/[%_*\\,()]/g," ").trim().toLowerCase(),W=i!==_||m.loading&&T!=="",B=T&&i!==_?m.rows.filter(a=>`${a.student_name||""} ${a.student_lrn||""}`.toLowerCase().includes(T)):m.rows;le(Fe,m.refetch),c.useEffect(()=>{if(!n)return;const a=m.rows.find(r=>r.id===n);a&&t(r=>r&&r.id===a.id?{...r,...a}:r)},[m.rows,n]);const[d,z]=c.useState(null),[y,S]=c.useState(R),[$,O]=c.useState(!1),[f,F]=c.useState(null),[q,U]=c.useState(""),j=de(),re=async(a,r)=>{O(!0),U("");const{data:p,error:h}=await E.from("fari_submissions").update({status:r}).eq("id",a).select("id, status, reviewed_at, reviewed_by_email").maybeSingle();if(O(!1),h||!p){U("Could not update the review status"+(h?": "+h.message:"."));return}t(g=>g&&g.id===a?{...g,...p}:g),m.refetch()};c.useEffect(()=>{if(!n){z(null),S(R);return}const a=`fari_analysis_${n}`,r=sessionStorage.getItem(a);if(r)try{const p=JSON.parse(r);z(p.analysis),S({...R,...p.meta});return}catch{sessionStorage.removeItem(a)}z(null),S(R)},[n]);const L=async(a=!1)=>{if(!n)return;const r=`fari_analysis_${n}`;if(!a){const g=sessionStorage.getItem(r);if(g)try{const b=JSON.parse(g);z(b.analysis),S({...R,...b.meta});return}catch{sessionStorage.removeItem(r)}}x(!0),v("");const{data:p,error:h}=await E.functions.invoke("analyze-assessment",{body:{submission_id:n,force_reload:a}});if(h){let g=h.message;try{const b=await h.context?.json?.();b?.error&&(g=b.error)}catch{}v(g||"Gemini analysis could not be completed.")}else if(p?.error)v(p.error);else{const g=p?.analysis??null,b={interpretation:p?.interpretation??[],flags:p?.flags??[],notes:p?.data_quality_notes??[],model:p?.model??"",crosscheck:p?.crosscheck??null,form138:p?.form138??null};z(g),S(b),g&&sessionStorage.setItem(r,JSON.stringify({analysis:g,meta:b}))}x(!1)},k=a=>e.jsxs("div",{className:"analysis-page",children:[e.jsx("style",{children:Se}),e.jsx("div",{className:"ap-inner",children:a})]});if(!m.ready)return k(e.jsxs("section",{className:"ap-card",role:"status","aria-busy":"true","aria-label":"Loading FARI assessment submissions",children:[e.jsxs("div",{className:"ap-intro-head",children:[e.jsx("span",{className:"ap-intro-icon",children:e.jsx(V,{size:20,"aria-hidden":"true"})}),e.jsx("h2",{className:"ap-h2",children:"AI Assessment Analysis"})]}),e.jsx(me,{lines:2,height:11,lastWidth:"55%",style:{margin:"8px 0 16px"}}),e.jsxs("div",{style:{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14},children:[e.jsx(K,{height:38,width:280,radius:10}),[0,1,2,3,4].map(a=>e.jsx(K,{height:30,width:70+a%2*20,radius:999},a))]}),e.jsx("div",{className:"ap-table-wrap",children:e.jsxs("table",{className:"ap-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{scope:"col",children:"Student"}),e.jsx("th",{scope:"col",children:"LRN"}),e.jsx("th",{scope:"col",className:"ap-num",children:"WSS"}),e.jsx("th",{scope:"col",children:"Zone"}),e.jsx("th",{scope:"col",children:"Review"}),e.jsx("th",{scope:"col",children:"Counseling"}),e.jsx("th",{scope:"col",children:"Submitted"})]})}),e.jsx("tbody",{children:e.jsx(ge,{rows:8,columns:["stack","short","number","badge","badge","badge","date"],cellPadding:null})})]})})]}));if(o&&!s)return k(e.jsxs("div",{className:"ap-card ap-card--error ap-callout ap-callout--error",role:"alert",children:[e.jsx(D,{size:18}),e.jsx("div",{children:o})]}));if(m.error&&!m.rows.length&&!s)return k(e.jsxs("div",{className:"ap-card ap-card--error ap-callout ap-callout--error",role:"alert",children:[e.jsx(D,{size:18}),e.jsxs("div",{children:["Could not load the FARI submissions: ",m.error.message||String(m.error)]})]}));if(!m.total&&!ie&&!s)return k(e.jsx("div",{className:"ap-status",children:"No completed FARI assessment submissions are available yet."}));const P=!!(n&&sessionStorage.getItem(`fari_analysis_${n}`));return k(e.jsxs(e.Fragment,{children:[e.jsxs("section",{className:"ap-card","aria-labelledby":"ap-ai-heading",children:[e.jsxs("div",{className:"ap-intro-head",children:[e.jsx("span",{className:"ap-intro-icon",children:e.jsx(V,{size:20,"aria-hidden":"true"})}),e.jsx("h2",{id:"ap-ai-heading",className:"ap-h2",children:"AI Assessment Analysis"})]}),e.jsx("p",{className:"ap-desc",children:"Select a completed FARI assessment and generate a Gemini-assisted interpretation based on the FARI scoring guide. When the student's Form 138 has been uploaded, their senior high school grades are cross-checked against the FARI results. Results support counselor review and do not determine admissions or eligibility."}),e.jsxs("div",{className:"ap-finder",children:[e.jsxs("label",{className:"ap-search",children:[e.jsx(he,{size:16,"aria-hidden":"true"}),e.jsx("input",{type:"search",value:i,onChange:a=>u(a.target.value),placeholder:"Search by student name or LRN","aria-label":"Search assessment submissions by student name or LRN"}),W&&e.jsxs("span",{role:"status",style:{display:"inline-flex",alignItems:"center",gap:4,fontSize:12,color:"var(--ap-text-2)",whiteSpace:"nowrap"},children:[e.jsx(M,{size:13,className:"ap-spin","aria-hidden":"true"}),"Searching…"]})]}),e.jsxs("div",{className:"ap-filters",children:[e.jsx("div",{className:"ap-chip-group",role:"group","aria-label":"Filter by zone",children:Te.map(([a,r])=>e.jsx("button",{type:"button",className:"ap-chip","aria-pressed":w===a,"data-tone":a==="all"?void 0:a,onClick:()=>se(a),children:r},a))}),e.jsx("div",{className:"ap-chip-group",role:"group","aria-label":"Filter by review status",children:$e.map(([a,r])=>e.jsx("button",{type:"button",className:"ap-chip","aria-pressed":N===a,onClick:()=>te(a),children:r},a))})]})]}),e.jsx("div",{className:"ap-table-wrap",children:e.jsxs("table",{className:"ap-table",children:[e.jsx("caption",{className:"ap-sr-only",children:"Assessment submissions. Choose a row to analyse that student."}),e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{scope:"col",children:"Student"}),e.jsx("th",{scope:"col",children:"LRN"}),e.jsx("th",{scope:"col",className:"ap-num",children:"WSS"}),e.jsx("th",{scope:"col",children:"Zone"}),e.jsx("th",{scope:"col",children:"Review"}),e.jsx("th",{scope:"col",children:"Counseling"}),e.jsx("th",{scope:"col",children:"Submitted"})]})}),e.jsx("tbody",{children:B.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:7,className:"ap-table-empty",children:W?"Searching…":"No submissions match these filters."})}):B.map(a=>{const r=a.id===n,p=j(a);return e.jsxs("tr",{className:r?"is-selected":void 0,"aria-selected":r,tabIndex:0,onClick:()=>t(a),onKeyDown:h=>{(h.key==="Enter"||h.key===" ")&&(h.preventDefault(),t(a))},children:[e.jsx("td",{className:"ap-td-name",children:A(a.student_name,"Unnamed student")}),e.jsx("td",{children:a.student_lrn||"—"}),e.jsx("td",{className:"ap-num",children:a.wss!=null?Number(a.wss).toFixed(1):"—"}),e.jsx("td",{children:e.jsxs("span",{className:`ap-badge ap-badge--sm ap-badge--${ae(a.zone)}`,children:[e.jsx("span",{className:"ap-dot","aria-hidden":"true"}),a.zone||"unclassified"]})}),e.jsx("td",{children:e.jsx("span",{className:`ap-badge ap-badge--sm ap-badge--${a.status==="finalized"?"green":"amber"}`,children:a.status==="finalized"?"Finalized":"Needs review"})}),e.jsx("td",{children:p?e.jsx("span",{title:p.summary,children:p.label}):"—"}),e.jsx("td",{children:a.submitted_at?new Date(a.submitted_at).toLocaleDateString():"—"})]},a.id)})})]})}),e.jsx(oe,{...m,label:"students"}),e.jsxs("div",{className:"ap-picker",children:[e.jsx("div",{className:"ap-picked","aria-live":"polite",children:s?e.jsxs(e.Fragment,{children:["Selected: ",e.jsx("strong",{children:A(s.student_name,"Unnamed student")})]}):"Choose a student in the table to analyse their assessment."}),e.jsxs("div",{style:{display:"flex",gap:8},children:[e.jsxs("button",{type:"button",className:"ap-btn ap-btn--primary",onClick:()=>L(!1),disabled:l||!n,"aria-busy":l,children:[l?e.jsx(M,{size:16,className:"ap-spin","aria-hidden":"true"}):e.jsx(H,{size:16,"aria-hidden":"true"}),l?"Analyzing...":P?"Analysis loaded":"Generate AI analysis"]}),P&&e.jsxs("button",{type:"button",className:"ap-btn ap-btn--secondary",onClick:()=>L(!0),disabled:l||!n,title:"Force reload and regenerate analysis from Gemini",children:[e.jsx(Y,{size:15,className:l?"ap-spin":"","aria-hidden":"true"}),"Reload"]})]})]})]}),s&&e.jsxs("section",{className:"ap-card","aria-label":"Selected assessment summary",children:[e.jsxs("div",{className:"ap-summary-head",children:[e.jsxs("div",{children:[e.jsx("div",{className:"ap-eyebrow",children:"Selected assessment"}),e.jsx("div",{className:"ap-student",children:A(s.student_name,"Unnamed student")})]}),e.jsxs("div",{className:"ap-badges",children:[e.jsx("span",{className:`ap-badge ap-badge--${s.status==="finalized"?"green":"amber"}`,children:s.status==="finalized"?"Review finalized":"Needs review"}),j(s)&&e.jsxs("span",{className:"ap-badge ap-badge--violet",title:j(s).summary,children:["Counseling: ",j(s).label]}),e.jsxs("span",{className:"ap-badge ap-badge--blue",children:["WSS: ",s.wss??"—"]}),e.jsxs("span",{className:`ap-badge ap-badge--${ae(s.zone)}`,children:[e.jsx("span",{className:"ap-dot","aria-hidden":"true"}),"Zone: ",s.zone??"unclassified"]})]})]}),e.jsx("div",{className:"ap-scores",children:Object.entries(ze).map(([a,r])=>e.jsxs("div",{className:"ap-stat",children:[e.jsx("div",{className:"ap-stat-label",children:r}),e.jsx("div",{className:"ap-stat-value",children:s[a]??0})]},a))}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",marginTop:16,paddingTop:14,borderTop:"1px solid var(--ap-border)"},children:[e.jsxs("div",{style:{fontSize:13,color:"var(--ap-text-2)",maxWidth:620},children:[s.status==="finalized"?e.jsxs(e.Fragment,{children:["Review finalized by ",e.jsx("strong",{children:s.reviewed_by_email||"staff"}),s.reviewed_at?` on ${new Date(s.reviewed_at).toLocaleString()}`:"","."]}):d?"Read the analysis below. When you're done, finalize the review so this student no longer shows as unreviewed.":"Generate the AI analysis first; you can finalize the review after reading it.",e.jsx("div",{style:{marginTop:4},children:j(s)?e.jsxs(e.Fragment,{children:["Guidance: ",e.jsx("strong",{children:j(s).summary}),"."]}):"Guidance hasn't opened a counseling case for this student. Logging a session there finalizes this review too."}),q&&e.jsx("div",{style:{color:"#b42318",marginTop:4},children:q})]}),e.jsx(ce,{open:!!f,onDiscard:()=>{const a=f;F(null),re(a.id,a.status)},onKeep:()=>F(null),icon:f?.status==="finalized"?e.jsx(Z,{size:24,strokeWidth:1.8}):e.jsx(J,{size:24,strokeWidth:1.8}),title:f?.status==="finalized"?"Finalize this review?":"Reopen this review?",description:f?.status==="finalized"?`Mark the result of "${f?.name}" as reviewed. Your name and the time will be recorded.`:`Set the result of "${f?.name}" back to pending review.`,confirmLabel:f?.status==="finalized"?"Yes, Finalize":"Yes, Reopen",cancelLabel:"Cancel",tone:"neutral"}),s.status==="finalized"?e.jsxs("button",{type:"button",className:"ap-btn ap-btn--secondary",onClick:()=>F({id:s.id,status:"pending",name:A(s.student_name,"Unnamed student")}),disabled:$,children:[e.jsx(J,{size:15,"aria-hidden":"true"})," Reopen review"]}):e.jsxs("button",{type:"button",className:"ap-btn ap-btn--primary",onClick:()=>F({id:s.id,status:"finalized",name:A(s.student_name,"Unnamed student")}),disabled:$||!d,title:d?"Mark this result as reviewed":"Generate the AI analysis first",children:[$?e.jsx(M,{size:15,className:"ap-spin","aria-hidden":"true"}):e.jsx(Z,{size:15,"aria-hidden":"true"}),"Finalize review"]})]})]}),o&&e.jsxs("div",{className:"ap-card ap-card--error ap-callout ap-callout--error",role:"alert",children:[e.jsx(D,{size:18,"aria-hidden":"true"}),e.jsx("div",{children:o})]}),d?e.jsxs("div",{style:{display:"grid",gap:16},children:[y.notes.length>0&&e.jsxs("div",{className:"ap-card ap-card--warn ap-callout ap-callout--warn",children:[e.jsx(xe,{size:18,"aria-hidden":"true"}),e.jsxs("div",{className:"ap-text",style:{color:"inherit"},children:[e.jsx("strong",{children:"Data check:"})," some stored scores look unusual, so the analysis was adjusted.",e.jsx("ul",{className:"ap-list",style:{marginTop:6},children:y.notes.map((a,r)=>e.jsx("li",{children:a},r))})]})]}),e.jsxs("div",{className:"ap-card",children:[e.jsxs("div",{className:"ap-row",style:{gap:20},children:[e.jsxs("div",{style:{flex:"1 1 420px"},children:[e.jsx("div",{className:"ap-card-title",style:{"--ap-title-accent":"#6d3fd6"},children:"Gemini decision-support summary"}),e.jsx("p",{className:"ap-text",children:d.summary})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:8,alignItems:"flex-start"},children:[e.jsx("span",{className:"ap-badge ap-badge--violet",style:{textTransform:"capitalize"},children:d.readiness_level||"review needed"}),d.fari_profile?.name&&e.jsxs("span",{className:"ap-badge ap-badge--blue",children:["Profile: ",d.fari_profile.name]})]})]}),d.fari_profile?.rationale&&e.jsx("p",{className:"ap-muted",style:{marginTop:12},children:d.fari_profile.rationale})]}),y.flags.length>0&&e.jsxs("div",{className:"ap-card ap-card--error",children:[e.jsxs("div",{className:"ap-flag-title",children:[e.jsx(be,{size:15,"aria-hidden":"true"})," FARI flags triggered"]}),e.jsx("ul",{className:"ap-list",children:y.flags.map((a,r)=>e.jsx("li",{children:a},r))})]}),e.jsx(Ae,{interpretation:y.interpretation}),e.jsx(_e,{form138:y.form138,crosscheck:y.crosscheck,narrative:d.grades_crosscheck}),e.jsxs("div",{className:"ap-grid",children:[e.jsx(I,{title:"Identified strengths",items:d.strengths,accent:"#15803d"}),e.jsx(I,{title:"Development areas",items:d.development_areas,accent:"#b45309"}),e.jsx(I,{title:"Deeper insights",items:d.insights,accent:"#be185d"}),e.jsx(I,{title:"Recommended supports",items:d.recommended_supports,accent:"#1d4ed8"})]}),e.jsx(Re,{items:d.program_fit}),e.jsx(I,{title:"Overall program-fit takeaway",items:d.course_fit_observations,accent:"#6d3fd6"}),e.jsx(Ie,{items:d.action_plan}),e.jsxs("div",{className:"ap-card",children:[e.jsx("div",{className:"ap-card-title",children:"Counselor review note"}),e.jsx("p",{className:"ap-text",children:d.counselor_note}),e.jsx("p",{className:"ap-muted",style:{marginTop:12},children:d.disclaimer})]}),e.jsxs("button",{type:"button",className:"ap-btn ap-btn--secondary",onClick:()=>L(!0),disabled:l,style:{width:"fit-content"},children:[e.jsx(Y,{size:15,className:l?"ap-spin":"","aria-hidden":"true"})," Regenerate AI analysis"]})]}):!l&&!o?e.jsxs("div",{className:"ap-card ap-empty",children:[e.jsx("span",{className:"ap-intro-icon",children:e.jsx(H,{size:16,"aria-hidden":"true"})}),e.jsx("p",{children:"Generate an analysis to receive FARI score interpretation, strengths, development areas, deeper insights, program fit (IT, Tourism, Hospitality, Business Administration) and an action plan for counselor review. If the student's Form 138 is on file, you will also get a grades cross-check."})]}):null]}))}export{fa as default};

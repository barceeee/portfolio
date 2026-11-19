import{r as h,j as e}from"./index-D3Nqo7Vt.js";import{I}from"./InlineIcon-CofZrkIi.js";import{s as c,f as v}from"./supabase-DrDKJ_9s.js";import{r as P}from"./retention-DnVelIrw.js";import{w as z}from"./studentClassification-D9fURarb.js";import{P as T}from"./Pagination-CPz2hTLp.js";import{R as q,f as F,a as M,s as O,b as Y,g as H}from"./moduleReports-osOdSVnS.js";import{t as b}from"./toast-ooe9A0-5.js";import{u as U}from"./useServerPagination-Bw09DdrV.js";import{f as D}from"./personName-D3dh8C-S.js";import{b as B}from"./SkeletonLoader-DjOiN1TB.js";import{u as V}from"./useConfirm-BMB5Yoa5.js";import{C as K}from"./calendar-clock-xvRnYdm8.js";import"./Modal-BHtgS2BU.js";import"./x-OoJvVtv7.js";import"./search-DK4dsrHa.js";import"./download-luo3v72T.js";import"./fariInterventions-C8YXMkj-.js";import"./standingRules-DXIGXmmH.js";import"./queryCache-w5HkREVU.js";import"./UnsavedChangesDialog-DzvcVmKq.js";import"./triangle-alert-7Pgj65oc.js";const W={marketing:[{type:"feeder_performance",title:"School Origin Performance",desc:"Leads and students per school, grouped as feeder, non-feeder and competitor.",label:"School Origin Performance Report"},{type:"conversion_report",title:"Lead Conversion Report",desc:"How many leads became students, as a conversion funnel.",label:"Lead Conversion Report"},{type:"leads_summary",title:"Leads Summary",desc:"Total leads by source, status, and school for the current period.",label:"Leads Summary Report"}],frontdesk:[{type:"enrollment_summary",title:"Student Records Summary",desc:"Students per semester by program and year level, from the registrar's list.",label:"Student Records Summary Report"},{type:"semester_retention",title:"Semester Retention",desc:"Students who re-enrolled from one semester to the next, and who did not return, split by Regular and Irregular students.",label:"Semester Retention Report"},{type:"document_compliance",title:"Document Compliance",desc:"Every enrolled student and whether their Form 138 has been received or is still to follow.",label:"Document Compliance Report"}],admin:[{type:"graduate_status_summary",title:"Graduation Status",desc:"Graduating students per school year and program, with the graduation rate.",label:"Graduation Status Report"},{type:"scholarship_summary",title:"Scholarship Summary",desc:"Each scholarship's slots and how many scholars are active, pending, inactive or graduated.",label:"Scholarship Summary Report"},{type:"scholar_list",title:"Scholar List",desc:"Every scholar from Scholar Upload with their scholarship and status.",label:"Scholar List Report"},{type:"academic_standing_report",title:"Academic Standing",desc:"Irregular students and students with delayed graduation, with the rules (I1–I5, D1–D3) that flagged them.",label:"Academic Standing Report"},{type:"fari_results_report",title:"FARI Results",desc:"Every FARI result with its zone, score, section bands, emergency flags, and the enrolled program with whether the analysis finds the student aligned with it.",label:"FARI Results Report"}],guidance:[{type:"student_profiles_summary",title:"Student Profiles Summary",desc:"Demographic breakdown of enrolled students.",label:"Student Profiles Summary Report"}]};async function N(m){switch(m){case"graduate_status_summary":return H();case"scholarship_summary":return Y();case"scholar_list":return O();case"academic_standing_report":return M();case"fari_results_report":return F();case"feeder_performance":{const[{data:s,error:o},{data:a,error:t}]=await Promise.all([c.from("schools").select("id, name, type, city"),c.from("leads").select("status, school_id")]);if(o||t)throw new Error(`Database error: ${(o||t).message}`);const i={};(a||[]).forEach(l=>{if(!l.school_id)return;const d=i[l.school_id]||(i[l.school_id]={total:0,enrolled:0});d.total+=1,l.status==="enrolled"&&(d.enrolled+=1)});const n={feeder:0,"non-feeder":1,competitor:2};return(s||[]).map(l=>{const d=i[l.id]||{total:0,enrolled:0};return{school:l.name,category:l.type==="competition"?"competitor":l.type,city:l.city||"—",total_leads:d.total,enrolled:d.enrolled,conversion_rate:d.total?(d.enrolled/d.total*100).toFixed(1)+"%":"—"}}).sort((l,d)=>(n[l.category]??9)-(n[d.category]??9)||d.total_leads-l.total_leads||l.school.localeCompare(d.school))}case"conversion_report":{const{data:s,error:o}=await c.from("leads").select("status, source, created_at");if(o)throw new Error(`Database error: ${o.message}`);const a=["new","contacted","qualified","pending_documents","enrolled","lost","rejected"],t=Object.fromEntries(a.map(n=>[n,0]));(s||[]).forEach(n=>{t[n.status]!==void 0&&t[n.status]++});const i=(s||[]).length;return a.map(n=>({stage:n,count:t[n],share:i?(t[n]/i*100).toFixed(1)+"%":"0%"}))}case"leads_summary":{const{data:s,error:o}=await c.from("leads").select("first_name, last_name, status, source, schools(name)");if(o)throw new Error(`Database error: ${o.message}`);return(s||[]).map(a=>({name:D(a,"—"),status:a.status,source:a.source,school:a.schools?.name||"—"}))}case"enrollment_summary":{const{data:s,error:o}=await v(()=>c.from("enrollments").select("course, year_level, grade_level, education_level, school_year, semester").order("id"));if(o)throw new Error(`Database error: ${o.message}`);const a={};return(s||[]).forEach(t=>{const i=`${t.school_year||"—"} · ${t.semester||"—"}`,n=t.year_level||t.grade_level||"—",l=`${i}|${t.course||"—"}|${n}`,d=a[l]||(a[l]={term:i,program:t.course||"—",year_level:n,education:t.education_level,enrollees:0});d.enrollees+=1}),Object.values(a).sort((t,i)=>i.term.localeCompare(t.term)||t.program.localeCompare(i.program)||String(t.year_level).localeCompare(String(i.year_level)))}case"semester_retention":{const[{data:s,error:o},{data:a}]=await Promise.all([v(()=>c.from("enrollments").select("id, student_id, first_name, last_name, course, year_level, grade_level, school_year, semester, student_type").order("id")),c.from("semester_settings").select("school_year, semester").eq("id",1).maybeSingle()]);if(o)throw new Error(`Database error: ${o.message}`);return P(await z(s),{activeTerm:a})}case"document_compliance":{const{data:s,error:o}=await v(()=>c.from("form138_students_v").select("id, name, student_id, course, year_level, grade_level, status_key, received_at, extracted_gwa").order("name").order("id"));if(o)throw new Error(`Database error: ${o.message}`);const a={missing:"To follow",received:"Received",scanned:"Received · grades read",review:"Received · needs review",verified:"Received · verified"};return(s||[]).map(t=>({student:D(t.name,"—"),student_id:t.student_id||"",course:t.course||"—",year_level:t.year_level||t.grade_level||"",form_138:a[t.status_key]||t.status_key||"",received:t.received_at?new Date(t.received_at).toLocaleDateString():"",gwa:t.extracted_gwa??""}))}case"student_profiles_summary":{const{data:s,error:o}=await c.from("student_profiles").select("program, year_level, gender, city, student_type");if(o)throw new Error(`Database error: ${o.message}`);return(s||[]).map(a=>({program:a.program,year_level:a.year_level,gender:a.gender,city:a.city,type:a.student_type}))}default:return[]}}const $="rg-styles";function J(){const m=document.getElementById($);m&&m.remove();const s=document.createElement("style");s.id=$,s.textContent=`
    /* ══ Card grid — cards always fill the full row width at every breakpoint ══ */

    /* Mobile first: 1 column */
    .rg-cards-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    /* Small tablet and up: 2 equal columns */
    @media (min-width: 480px) {
      .rg-cards-grid { grid-template-columns: repeat(2, 1fr); }
    }

    /* Desktop and up: 3 equal columns — cards stretch to fill all available width */
    @media (min-width: 768px) {
      .rg-cards-grid { grid-template-columns: repeat(3, 1fr); }
    }

    /* Wide desktop: 4 columns when there are 4+ cards (frontdesk/guidance use case) */
    @media (min-width: 1200px) {
      .rg-cards-grid { grid-template-columns: repeat(auto-fit, minmax(0, 1fr)); }
    }


    /* ══ DARK (default) ══ */
    .rg-card {
      background: rgba(255,255,255,.045);
      backdrop-filter: blur(20px) saturate(1.6);
      border: 1px solid rgba(255,255,255,.09);
      border-radius: 16px;
      padding: 1.25rem 1.4rem;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 4px 24px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.07);
      transition: background .2s, border-color .2s, box-shadow .2s, transform .2s;
      min-width: 0;
      word-break: break-word;
    }
    .rg-card:hover {
      background: rgba(255,255,255,.065);
      border-color: rgba(255,255,255,.13);
      box-shadow: 0 8px 32px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.10);
      transform: translateY(-1px);
    }
    .rg-card-title { font-weight: 700; font-size: 0.95rem; color: #e2e8f0; line-height: 1.35; }
    .rg-card-desc  { font-size: 0.82rem; color: #64748b; line-height: 1.55; flex: 1; }


    /* ══ Table ══ */
    .rg-tbl-wrap {
      background: rgba(255,255,255,.04);
      backdrop-filter: blur(20px) saturate(1.6);
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 16px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      box-shadow: 0 4px 24px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.06);
    }
    .rg-table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
    .rg-th {
      background: rgba(255,255,255,.04);
      padding: 0.55rem 0.85rem;
      text-align: left;
      color: #64748b;
      font-weight: 600;
      font-size: 0.75rem;
      letter-spacing: .4px;
      text-transform: uppercase;
      border-bottom: 1px solid rgba(255,255,255,.07);
      white-space: nowrap;
    }
    .rg-td {
      padding: 0.55rem 0.85rem;
      border-bottom: 1px solid rgba(255,255,255,.045);
      color: #94a3b8;
      white-space: nowrap;
    }
    .rg-td-name { color: #e2e8f0; font-weight: 500; }
    .rg-tr:last-child .rg-td { border-bottom: none; }
    .rg-tr:hover .rg-td { background: rgba(255,255,255,.03); }

    .rg-tag {
      font-size: 0.72rem;
      border-radius: 5px;
      padding: 2px 8px;
      font-weight: 600;
      display: inline-block;
      white-space: nowrap;
    }
    .rg-tag-auto   { background: rgba(14,165,233,.15); color: #38bdf8; }
    .rg-tag-manual { background: rgba(34,197,94,.12);  color: #4ade80; }

    .rg-section-title {
      font-weight: 700;
      font-size: 0.78rem;
      color: #64748b;
      letter-spacing: .6px;
      text-transform: uppercase;
      margin-bottom: 0.75rem;
    }
    .rg-page-title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: #e2e8f0;
      text-transform: capitalize;
    }
    .rg-subtitle { font-size: 0.78rem; color: #64748b; margin-top: 3px; }

    /* ══ Header row ══ */
    .rg-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 10px;
    }
    @media (max-width: 540px) {
      .rg-header-row { flex-direction: column; align-items: stretch; }
      .rg-header-row > .rg-btn-role { width: 100%; justify-content: center; }
    }

    /* ══ Button ══ */
    .rg-btn-role {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 0.44rem 1.1rem;
      cursor: pointer;
      font-size: 0.82rem;
      font-weight: 600;
      font-family: inherit;
      white-space: nowrap;
    }
    .rg-btn-role:disabled { opacity: .4; cursor: not-allowed; }

    /* ══ Modal ══ */
    .rg-empty { color: #475569; text-align: center; padding: 2rem; font-size: 0.85rem; }

    /* ══ LIGHT MODE ══ */
    :root[data-theme="light"] .rg-card {
      background: rgba(255,255,255,.75);
      border-color: rgba(255,255,255,.90);
      box-shadow: 0 2px 16px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.95);
    }
    :root[data-theme="light"] .rg-card:hover {
      background: rgba(255,255,255,.92);
      box-shadow: 0 6px 24px rgba(0,0,0,.09), inset 0 1px 0 #fff;
    }
    :root[data-theme="light"] .rg-card-title { color: #0f172a; }
    :root[data-theme="light"] .rg-card-desc  { color: #64748b; }
    :root[data-theme="light"] .rg-tbl-wrap {
      background: rgba(255,255,255,.75);
      border-color: rgba(255,255,255,.90);
      box-shadow: 0 2px 16px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.95);
    }
    :root[data-theme="light"] .rg-th {
      background: rgba(0,0,0,.02); color: #94a3b8;
      border-bottom-color: rgba(0,0,0,.06);
    }
    :root[data-theme="light"] .rg-td { color: #475569; border-bottom-color: rgba(0,0,0,.04); }
    :root[data-theme="light"] .rg-td-name { color: #0f172a; }
    :root[data-theme="light"] .rg-tr:hover .rg-td { background: rgba(0,0,0,.02); }
    :root[data-theme="light"] .rg-tag-auto   { background: #e0f2fe; color: #0369a1; }
    :root[data-theme="light"] .rg-tag-manual { background: #f0fdf4; color: #15803d; }
    :root[data-theme="light"] .rg-section-title { color: #94a3b8; }
    :root[data-theme="light"] .rg-page-title    { color: #0f172a; }
    :root[data-theme="light"] .rg-subtitle      { color: #94a3b8; }
    :root[data-theme="light"] .rg-empty { color: #94a3b8; }
  `,document.head.appendChild(s)}function we({role:m="marketing",showHistory:s=!0}){const[o,a]=h.useState(null),t=U(()=>c.from("reports").select("*",{count:"exact"}).eq("role_target",m).order("created_at",{ascending:!1}).order("id"),{deps:[m],enabled:s}),[i,n]=h.useState(null),{confirm:l,confirmDialog:d}=V(),[y,_]=h.useState(null),[S,C]=h.useState(null),R=W[m]||[];h.useEffect(()=>{J()},[]),h.useEffect(()=>{c.auth.getSession().then(({data:{session:u}})=>a(u?.user??null));const{data:{subscription:r}}=c.auth.onAuthStateChange((u,g)=>a(g?.user??null));return()=>r.unsubscribe()},[]);const w=h.useCallback(async()=>{const{data:r}=await c.from("reports").select("created_at").eq("role_target",m).eq("is_auto",!0).order("created_at",{ascending:!1}).limit(1);C(r?.[0]?new Date(r[0].created_at).toLocaleDateString():null)},[m]);h.useEffect(()=>{w()},[w]);const j=t.refetch,k=h.useCallback(async()=>{w(),s&&await j()},[w,j,s]);async function A(r,u){if(o&&await l({title:"Generate this report?",description:`${u} will be generated from the current data and saved to the report history.`,confirmLabel:"Generate"})){n(r);try{const g=await N(r),f=new Date,x=`${f.toLocaleString("default",{month:"long"})} ${f.getFullYear()}`,{error:p}=await c.from("reports").insert({title:u,type:r,generated_by:o.id,data:g,status:"completed",role_target:m,period_label:x,is_auto:!1,scheduled_month:f.getMonth()+1,scheduled_year:f.getFullYear()});if(p)throw p;_({title:u,rows:g}),await k(),b.success("Report ready",`${u} was generated successfully.`)}catch(g){console.error("Generation failed:",g),b.error("Generation failed",g.message)}finally{n(null)}}}async function L(){if(!o)return;const r=new Date,u=r.getMonth()+1,g=r.getFullYear(),{data:f}=await c.from("reports").select("id").eq("role_target",m).eq("is_auto",!0).eq("scheduled_month",u).eq("scheduled_year",g).limit(1);if(f?.length){const p=r.toLocaleString("default",{month:"long"});b.info("Already generated",`Auto-report for ${p} ${g} already exists.`);return}if(!await l({title:"Generate the monthly reports?",description:`All monthly reports for ${r.toLocaleString("default",{month:"long"})} ${g} will be generated and saved to the report history.`,confirmLabel:"Generate"}))return;n("auto");const x=`${r.toLocaleString("default",{month:"long"})} ${g}`;try{for(const p of R){const G=await N(p.type),{error:E}=await c.from("reports").insert({title:p.label,type:p.type,generated_by:o.id,data:G,status:"completed",role_target:m,period_label:x,is_auto:!0,scheduled_month:u,scheduled_year:g});if(E)throw E}await k(),b.success("Auto-reports complete",`All ${m} reports for ${x} are ready.`)}catch(p){b.error("Auto-report failed",p.message)}finally{n(null)}}return e.jsxs("div",{children:[d,e.jsxs("div",{className:"rg-header-row",children:[e.jsxs("div",{children:[e.jsxs("h2",{className:"rg-page-title",children:[m," Reports"]}),S&&e.jsxs("div",{className:"rg-subtitle",children:["Last auto-report: ",e.jsx("strong",{children:S})]})]}),e.jsx("button",{className:"rg-btn-role",onClick:L,disabled:i==="auto",children:i==="auto"?"Generating…":e.jsxs(e.Fragment,{children:[e.jsx(I,{icon:K}),"Run Monthly Auto-Report"]})})]}),e.jsx("div",{className:"rg-cards-grid",children:R.map(r=>e.jsxs("div",{className:"rg-card",children:[e.jsx("div",{className:"rg-card-title",children:r.title}),e.jsx("div",{className:"rg-card-desc",children:r.desc}),e.jsx("button",{className:"rg-btn-role",style:{marginTop:"auto",alignSelf:"flex-start"},onClick:()=>A(r.type,r.label),disabled:i===r.type,children:i===r.type?"Generating…":"Generate →"})]},r.type))}),s&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"rg-section-title",children:"Report History"}),e.jsx("div",{className:"rg-tbl-wrap",children:e.jsxs("table",{className:"rg-table",children:[e.jsx("thead",{children:e.jsx("tr",{children:["Title","Period","Type","Mode","Date","Action"].map(r=>e.jsx("th",{className:"rg-th",children:r},r))})}),e.jsx("tbody",{children:t.ready?t.total===0?e.jsx("tr",{children:e.jsx("td",{colSpan:6,className:"rg-td rg-empty",children:"No reports generated yet."})}):t.rows.map(r=>e.jsxs("tr",{className:"rg-tr",children:[e.jsx("td",{className:"rg-td rg-td-name",children:r.title}),e.jsx("td",{className:"rg-td",children:r.period_label||"—"}),e.jsx("td",{className:"rg-td",children:r.type}),e.jsx("td",{className:"rg-td",children:r.is_auto?e.jsx("span",{className:"rg-tag rg-tag-auto",children:"Auto"}):e.jsx("span",{className:"rg-tag rg-tag-manual",children:"Manual"})}),e.jsx("td",{className:"rg-td",children:new Date(r.created_at).toLocaleDateString()}),e.jsx("td",{className:"rg-td",children:e.jsx("button",{type:"button",className:"rg-btn-role",onClick:()=>_({title:r.title,rows:Array.isArray(r.data)?r.data:[]}),children:"View / Export"})})]},r.id)):e.jsx(B,{rows:8,columns:["text","short","badge","badge","date","button"],cellPadding:null})})]})}),e.jsx(T,{...t,label:"reports"})]}),y&&e.jsx(q,{title:y.title,rows:y.rows,onClose:()=>_(null),onExported:()=>b.success("CSV exported",`${y.title} downloaded successfully.`)})]})}export{we as default};

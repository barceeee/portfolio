import{r as m,j as e}from"./index-D3Nqo7Vt.js";import{c as ue,l as he,b as we,M as ye,T as ke,a as oe,d as D,L as A}from"./leaflet-CMmctJ4H.js";import{s as M}from"./supabase-DrDKJ_9s.js";import{u as ae}from"./useLiveRefresh-CPJrLllO.js";import{S as ve}from"./SchoolLeadsModal-CjHqFEqQ.js";import{V as je}from"./ViewLeadModal-CXjiLj4q.js";import"./InlineIcon-CofZrkIi.js";import"./personName-D3dh8C-S.js";import"./SkeletonLoader-DjOiN1TB.js";import"./MarketingDashboard-Dfsic2jQ.js";import"./useAuthGuard-6HeA-jon.js";import"./lazyTab-Az7b0gc9.js";import"./search-x-C2jN_qZX.js";import"./useCachedQuery-jsvtVpO2.js";import"./queryCache-w5HkREVU.js";import"./toast-ooe9A0-5.js";import"./target-ontmMqnS.js";import"./school-C0fqWDdn.js";import"./trending-up-CWQfvB36.js";import"./phone-PYytuTmE.js";import"./calendar-Dg8l0vYZ.js";import"./useArchive-CeIw2nIK.js";import"./UnsavedChangesDialog-DzvcVmKq.js";import"./triangle-alert-7Pgj65oc.js";import"./Portal-xrIY5Poj.js";import"./archive-DeTdWmhi.js";import"./graduation-cap-CmvBn3tN.js";import"./lock-BDBoB_GM.js";import"./pencil-D_8kq8TV.js";const te=ue(function(t,r){const l=new he.Popup(t,r.overlayContainer);return we(l,r)},function(t,r,{position:l},d){m.useEffect(function(){const{instance:i}=t;function g(c){c.popup===i&&(i.update(),d(!0))}function s(c){c.popup===i&&d(!1)}return r.map.on({popupopen:g,popupclose:s}),r.overlayContainer==null?(l!=null&&i.setLatLng(l),i.openOn(r.map)):r.overlayContainer.bindPopup(i),function(){r.map.off({popupopen:g,popupclose:s}),r.overlayContainer?.unbindPopup(),r.map.removeLayer(i)}},[t,r,d,l])});delete A.Icon.Default.prototype._getIconUrl;A.Icon.Default.mergeOptions({iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"});const S=[14.41975,121.04678],re=[[14.28,120.94],[14.56,121.16]],Se=1100;function H([a,t],[r,l]){const x=(r-a)*Math.PI/180,i=(l-t)*Math.PI/180,g=Math.sin(x/2)**2+Math.cos(a*Math.PI/180)*Math.cos(r*Math.PI/180)*Math.sin(i/2)**2;return 6371*2*Math.atan2(Math.sqrt(g),Math.sqrt(1-g))}function O(a){return a<1?`${(a*1e3).toFixed(0)} m`:`${a.toFixed(2)} km`}function T(a){const t=[],r=a.offers_secondary||!a.offers_college&&!a.offers_secondary;return a.offers_college&&t.push("competition"),r&&a.type==="feeder"&&t.push("feeder"),r&&a.type==="non-feeder"&&t.push("nonFeeder"),t}function N({color:a,pulse:t=!1,active:r=!1}){const x=t||r?18:10,i=40+x*2,g=52+x*2,s=x,c=x,p=`<ellipse cx="${s+40*.38}" cy="${c+52*.22}" rx="${40*.18}" ry="${52*.11}" fill="white" opacity="0.25" transform="rotate(-20,${s+40*.38},${c+52*.22})"/>`,b=t?`<circle cx="${s+40/2}" cy="${c+52*.38}" r="${40*.62}" fill="none" stroke="${a}" stroke-width="2" opacity="0.45" style="animation:cmap-pulse-ring 1.8s ease-out infinite;"/><circle cx="${s+40/2}" cy="${c+52*.38}" r="${40*.82}" fill="none" stroke="${a}" stroke-width="1.5" opacity="0.22" style="animation:cmap-pulse-ring 1.8s ease-out infinite .45s;"/>`:"",u=r?`<circle cx="${s+40/2}" cy="${c+52*.38}" r="${40*.68}" fill="${a}" opacity="0.15" style="animation:cmap-pulse-ring 1.4s ease-out infinite;"/><circle cx="${s+40/2}" cy="${c+52*.38}" r="${40*.56}" fill="none" stroke="${a}" stroke-width="2.5" opacity="0.5"/>`:"",v=r?`filter:drop-shadow(0 4px 10px ${a}cc) drop-shadow(0 1px 3px rgba(0,0,0,.5));`:"filter:drop-shadow(0 3px 6px rgba(0,0,0,.55)) drop-shadow(0 1px 2px rgba(0,0,0,.4));",y=`M ${s+20},${c+50} C ${s+20},${c+50} ${s+2},${c+32} ${s+2},${c+20} A 18,18 0 1 1 ${s+38},${c+20} C ${s+38},${c+32} ${s+20},${c+50} ${s+20},${c+50} Z`,j=7.5,C=s+20,L=c+20,E=`<div style="position:relative;width:${i}px;height:${g}px;"><svg width="${i}" height="${g}" viewBox="0 0 ${i} ${g}" xmlns="http://www.w3.org/2000/svg" style="${v}">${b}${u}<path d="${y}" fill="${a}" stroke="rgba(0,0,0,0.55)" stroke-width="1.5"/><circle cx="${C}" cy="${L}" r="${j}" fill="white" stroke="rgba(0,0,0,0.45)" stroke-width="1.5"/><circle cx="${C}" cy="${L}" r="${j-2}" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="1.5"/>${p}</svg></div>`;return A.divIcon({html:E,className:"",iconSize:[i,g],iconAnchor:[i/2,g-x],popupAnchor:[0,-(g-x)]})}const z={sti:N({color:"#f59e0b",pulse:!0}),feeder:N({color:"#2563eb"}),"non-feeder":N({color:"#475569"}),competition:N({color:"#dc2626"}),feederActive:N({color:"#2563eb",active:!0}),"non-feederActive":N({color:"#475569",active:!0}),competitionActive:N({color:"#dc2626",active:!0})},$e=`
  @keyframes cmap-pulse-ring {
    0%  { transform-origin:center; transform:scale(1); opacity:.55; }
    70% { transform-origin:center; transform:scale(1.6); opacity:0; }
    100%{ transform-origin:center; transform:scale(1); opacity:0; }
  }
  @keyframes cmap-slide-in {
    from{ transform:translateX(100%); opacity:0; }
    to  { transform:translateX(0); opacity:1; }
  }
  .cmap-popup .leaflet-popup-content-wrapper {
    background:#0d1421; border:1px solid rgba(255,255,255,.12);
    border-radius:14px; box-shadow:0 12px 32px rgba(0,0,0,.65);
    padding:0; overflow:hidden; min-width:210px;
  }
  .cmap-popup .leaflet-popup-content { margin:0; }
  .cmap-popup .leaflet-popup-tip { background:#0d1421; }
  .cmap-popup .leaflet-popup-close-button { color:#475569!important; top:8px!important; right:10px!important; font-size:16px!important; }
  .cmap-filters {
    display:flex; align-items:center; gap:6px; flex-wrap:wrap;
    padding:10px 14px; background:rgba(11,16,25,.9); backdrop-filter:blur(8px);
    border-bottom:1px solid rgba(255,255,255,.06);
  }
  .cmap-filter-btn {
    display:inline-flex; align-items:center; gap:5px; padding:5px 12px;
    font-size:11px; font-weight:600; cursor:pointer;
    font-family:'DM Sans',sans-serif; user-select:none;
  }
  .cmap-filter-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; border:1.5px solid rgba(255,255,255,.5); }
  .cmap-filter-count { background:rgba(255,255,255,.1); border-radius:10px; padding:0 5px; font-size:9px; font-weight:700; }
  .cmap-filter-label { font-size:10px; font-weight:700; letter-spacing:.7px; text-transform:uppercase; color:#475569; margin-right:4px; }
  .cmap-filter-summary { margin-left:auto; font-size:10px; color:#475569; }

  .cmap-sti-pill {
    display:inline-flex; align-items:center; gap:5px; padding:5px 12px;
    border-radius:20px; font-size:11px; font-weight:600;
    background:#f59e0b22; border:1.5px solid #f59e0b60; color:#fbbf24;
    font-family:'DM Sans',sans-serif; user-select:none; cursor:default;
  }

  .cmap-legend {
    position:absolute; bottom:16px; left:16px; z-index:1001;
    background:rgba(9,13,21,.95); backdrop-filter:blur(8px);
    border:1px solid rgba(255,255,255,.1); border-radius:12px; padding:12px 14px;
    pointer-events:all !important;
  }
  .cmap-legend-title { font-size:9px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#64748b; margin-bottom:8px; padding-bottom:7px; border-bottom:1px solid rgba(255,255,255,.05); }
  .cmap-legend-row { display:flex; align-items:center; gap:7px; margin-bottom:4px; border-radius:7px; padding:6px 8px; cursor:pointer !important; transition:background .15s,opacity .2s; user-select:none; pointer-events:all !important; }
  .cmap-legend-row:last-of-type { margin-bottom:0; }
  .cmap-legend-row:hover { background:rgba(255,255,255,.07); }
  .cmap-legend-row.hidden { opacity:.35; }
  .cmap-legend-row-sti { display:flex; align-items:center; gap:7px; margin-bottom:4px; border-radius:7px; padding:6px 8px; background:rgba(245,158,11,.07); border:1px solid rgba(245,158,11,.18); cursor:pointer !important; user-select:none; pointer-events:all !important; transition:background .15s; }
  .cmap-legend-row-sti:hover { background:rgba(245,158,11,.16); }
  .cmap-legend-dot { width:11px; height:11px; border-radius:50%; flex-shrink:0; border:1.5px solid rgba(255,255,255,.3); transition:background .2s; }
  .cmap-legend-label { font-size:11px; color:#94a3b8; font-weight:500; flex:1; }
  .cmap-legend-count { font-size:10px; color:#475569; margin-left:2px; }
  .cmap-legend-arrow { font-size:10px; width:14px; text-align:center; flex-shrink:0; }
  .cmap-legend-hint { font-size:9px; color:#475569; margin-top:7px; text-align:center; border-top:1px solid rgba(255,255,255,.04); padding-top:6px; }

  .cmap-panel {
    position:absolute; top:0; right:0; bottom:0; z-index:1002;
    width:330px; background:#0b1019;
    border-left:1px solid rgba(255,255,255,.08);
    display:flex; flex-direction:column;
    animation:cmap-slide-in .22s ease-out;
    box-shadow:-8px 0 32px rgba(0,0,0,.6);
    pointer-events:all;
  }
  .cmap-panel-header { display:flex; align-items:center; gap:10px; padding:14px 16px 12px; border-bottom:1px solid rgba(255,255,255,.06); flex-shrink:0; }
  .cmap-panel-icon { width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; }
  .cmap-panel-title { font-size:13px; font-weight:700; color:#f1f5f9; flex:1; }
  .cmap-panel-sub { font-size:10px; color:#94a3b8; margin-top:1px; }
  .cmap-panel-close { background:none; border:none; cursor:pointer; color:#475569; font-size:18px; line-height:1; transition:color .15s; padding:4px; border-radius:6px; }
  .cmap-panel-close:hover { color:#f1f5f9; background:rgba(255,255,255,.07); }
  .cmap-panel-body { flex:1; overflow-y:auto; padding:12px; scrollbar-width:thin; scrollbar-color:#1e293b transparent; }
  .cmap-panel-body::-webkit-scrollbar { width:4px; }
  .cmap-panel-body::-webkit-scrollbar-thumb { background:#1e293b; border-radius:2px; }

  .cmap-school-block { border:1px solid rgba(255,255,255,.06); border-radius:10px; margin-bottom:10px; overflow:hidden; }
  .cmap-school-head { display:flex; align-items:flex-start; gap:8px; padding:10px 12px; background:rgba(255,255,255,.03); border-bottom:1px solid rgba(255,255,255,.04); cursor:pointer; transition:background .15s; }
  .cmap-school-head:hover { background:rgba(255,255,255,.06); }
  .cmap-school-name { font-size:12px; font-weight:700; color:#e2e8f0; flex:1; line-height:1.35; }
  .cmap-school-meta { font-size:10px; color:#94a3b8; margin-top:2px; }
  .cmap-school-count { display:inline-flex; align-items:center; gap:3px; padding:2px 8px; border-radius:10px; font-size:9px; font-weight:700; flex-shrink:0; margin-top:1px; }
  .cmap-chevron { font-size:9px; color:#475569; transition:transform .2s; flex-shrink:0; margin-top:3px; }
  .cmap-chevron.open { transform:rotate(90deg); }

  /* ── Lead card (clickable) ── */
  .cmap-lead-card {
    display:flex; align-items:center; gap:10px; padding:10px 12px;
    border-radius:10px; margin-bottom:6px;
    background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.05);
    transition:background .15s, border-color .15s;
    cursor:pointer;
  }
  .cmap-lead-card:last-child { margin-bottom:0; }
  .cmap-lead-card:hover { background:rgba(255,255,255,.07); border-color:rgba(255,255,255,.12); }
  .cmap-lead-card-avatar { width:36px; height:36px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:#fff; }
  .cmap-lead-card-name { font-size:13px; font-weight:700; color:#e2e8f0; line-height:1.2; }
  .cmap-lead-card-meta { font-size:10px; color:#94a3b8; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:160px; }
  .cmap-lead-card-status { padding:3px 9px; border-radius:20px; font-size:9px; font-weight:700; white-space:nowrap; flex-shrink:0; margin-left:auto; }
  .cmap-lead-card-arrow { font-size:12px; color:#334155; transition:color .15s, transform .15s; flex-shrink:0; }
  .cmap-lead-card:hover .cmap-lead-card-arrow { color:#ec4899; transform:translateX(2px); }

  .cmap-lead-row { display:flex; align-items:center; gap:8px; padding:7px 8px; border-radius:8px; margin-bottom:4px; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.04); transition:background .12s; }
  .cmap-lead-row:last-child { margin-bottom:0; }
  .cmap-lead-row:hover { background:rgba(255,255,255,.05); }
  .cmap-lead-avatar { width:28px; height:28px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#fff; }
  .cmap-lead-name { font-size:12px; font-weight:600; color:#cbd5e1; line-height:1.2; }
  .cmap-lead-meta { font-size:10px; color:#94a3b8; margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:140px; }
  .cmap-lead-status { padding:2px 7px; border-radius:10px; font-size:9px; font-weight:700; white-space:nowrap; flex-shrink:0; }

  .cmap-panel-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:8px; padding:24px; }
  .cmap-panel-empty-icon { font-size:36px; }
  .cmap-panel-empty-text { font-size:12px; color:#475569; text-align:center; line-height:1.5; }
  .cmap-geocoding-pill { position:absolute; top:12px; right:12px; z-index:999; background:rgba(11,16,25,.92); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,.08); border-radius:10px; padding:7px 12px; display:flex; align-items:center; gap:7px; font-size:11px; color:#60a5fa; font-weight:500; }
  .cmap-spinner { width:12px; height:12px; border-radius:50%; border:2px solid #3b82f630; border-top-color:#60a5fa; animation:cmap-spin .7s linear infinite; flex-shrink:0; }
  @keyframes cmap-spin { to { transform:rotate(360deg); } }
  .cmap-dist-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:20px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); font-size:10px; font-weight:600; color:#94a3b8; }
  .cmap-school-banner { padding:16px; border-bottom:1px solid rgba(255,255,255,.06); background:linear-gradient(135deg,rgba(255,255,255,.03),rgba(255,255,255,.01)); }
  .cmap-school-banner-name { font-size:15px; font-weight:800; color:#f1f5f9; line-height:1.3; margin-bottom:6px; }
  .cmap-school-banner-meta { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
  .cmap-school-banner-pill { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:20px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.08); font-size:10px; font-weight:600; color:#94a3b8; }
  .cmap-level-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:9px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; margin-bottom:6px; margin-right:4px; }
  .cmap-status-summary { display:flex; flex-wrap:wrap; gap:5px; padding:10px 12px; border-bottom:1px solid rgba(255,255,255,.05); background:rgba(255,255,255,.01); }
  .cmap-status-chip { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:20px; font-size:9px; font-weight:700; cursor:pointer; border:none; transition:opacity .15s,transform .1s; user-select:none; }
  .cmap-status-chip:hover { opacity:.8; transform:scale(.97); }
  .cmap-status-chip.dimmed { opacity:.3; }
  .cmap-status-chip-dot { width:6px; height:6px; border-radius:50%; }
  .cmap-back-btn { display:inline-flex; align-items:center; gap:5px; background:none; border:none; cursor:pointer; color:#64748b; font-size:11px; font-weight:600; padding:4px 6px; border-radius:6px; transition:color .15s,background .15s; font-family:inherit; }
  .cmap-back-btn:hover { color:#94a3b8; background:rgba(255,255,255,.05); }
  .cmap-no-leads-block { display:flex; flex-direction:column; align-items:center; gap:8px; padding:32px 16px; text-align:center; }
  .cmap-no-leads-icon { font-size:32px; opacity:.4; }
  .cmap-no-leads-text { font-size:12px; color:#64748b; line-height:1.6; }
  .cmap-comp-card { border:1px solid rgba(220,38,38,.15); border-radius:10px; margin-bottom:8px; padding:10px 12px; background:rgba(220,38,38,.04); cursor:pointer; transition:background .15s; }
  .cmap-comp-card:hover { background:rgba(220,38,38,.09); }
  .cmap-comp-card-name { font-size:12px; font-weight:700; color:#e2e8f0; margin-bottom:3px; }
  .cmap-comp-card-meta { font-size:10px; color:#94a3b8; }
  .cmap-comp-card-badges { display:flex; flex-wrap:wrap; gap:4px; margin-top:6px; }
  .cmap-no-leads { font-size:11px; color:#64748b; text-align:center; padding:14px 0; }

  .cmap-flyto-toast {
    position:absolute; top:12px; left:50%; transform:translateX(-50%);
    z-index:1005; pointer-events:none;
    background:rgba(9,13,21,.92); backdrop-filter:blur(8px);
    border:1px solid rgba(255,255,255,.1); border-radius:10px;
    padding:7px 14px; display:flex; align-items:center; gap:7px;
    font-size:11px; color:#e2e8f0; font-weight:500; white-space:nowrap;
    animation:cmap-toast-in .2s ease both;
  }
  @keyframes cmap-toast-in {
    from { opacity:0; transform:translateX(-50%) translateY(-6px); }
    to   { opacity:1; transform:translateX(-50%) translateY(0); }
  }

  @media (max-width: 640px) {
    .cmap-panel {
      position: fixed !important; top: auto !important;
      left: 0 !important; right: 0 !important; bottom: 60px !important;
      width: 100% !important; max-height: 60vh;
      border-left: none !important; border-top: 1px solid rgba(255,255,255,.1);
      border-radius: 16px 16px 0 0;
      box-shadow: 0 -8px 32px rgba(0,0,0,.5) !important;
      animation: cmap-slide-up-mobile .22s ease-out !important;
    }
    @keyframes cmap-slide-up-mobile {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }
  }

  /* ── LIGHT MODE ── */
  .sti-wrap.light .cmap-outer-card { border-color: #cbd5e1 !important; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
  .sti-wrap.light .cmap-filters { background: #ffffff; border-bottom-color: #e2e8f0; }
  .sti-wrap.light .cmap-filter-label { color: #64748b; }
  .sti-wrap.light .cmap-filter-summary { color: #64748b; }
  .sti-wrap.light .cmap-filter-dot { border-color: rgba(0,0,0,.2); }
  .sti-wrap.light .cmap-filter-count { background: rgba(0,0,0,.06); color: #374151; }
  .sti-wrap.light .cmap-sti-pill { background: #fffbeb; border-color: #f59e0b80; color: #b45309; }
  .sti-wrap.light .cmap-legend { background: #ffffff; border-color: #cbd5e1; box-shadow: 0 4px 16px rgba(0,0,0,.1); }
  .sti-wrap.light .cmap-legend-title { color: #64748b; border-bottom-color: #e2e8f0; }
  .sti-wrap.light .cmap-legend-row:hover { background: #f1f5f9; }
  .sti-wrap.light .cmap-legend-label { color: #1e293b; }
  .sti-wrap.light .cmap-legend-count { color: #64748b; }
  .sti-wrap.light .cmap-legend-hint { color: #64748b; border-top-color: #e2e8f0; }
  .sti-wrap.light .cmap-legend-dot { border-color: rgba(0,0,0,.15); }
  .sti-wrap.light .cmap-legend-row-sti { background: #fffbeb; border-color: #f59e0b40; }
  .sti-wrap.light .cmap-legend-row-sti:hover { background: #fff3cd; }
  .sti-wrap.light .cmap-popup .leaflet-popup-content-wrapper { background: #ffffff; border-color: #e2e8f0; box-shadow: 0 8px 24px rgba(0,0,0,.12); }
  .sti-wrap.light .cmap-popup .leaflet-popup-tip { background: #ffffff; }
  /* Panel container */
  .sti-wrap.light .cmap-panel { background: #ffffff; border-left-color: #e2e8f0; box-shadow: -4px 0 20px rgba(0,0,0,.08); }
  .sti-wrap.light .cmap-panel-header { border-bottom-color: #e2e8f0; background: #f8fafc; }
  .sti-wrap.light .cmap-panel-title { color: #0f172a; }
  .sti-wrap.light .cmap-panel-sub { color: #374151; }
  .sti-wrap.light .cmap-panel-close { color: #64748b; }
  .sti-wrap.light .cmap-panel-close:hover { color: #0f172a; background: #f1f5f9; }
  .sti-wrap.light .cmap-panel-body { scrollbar-color: #cbd5e1 transparent; background: #f8fafc; }
  .sti-wrap.light .cmap-panel-body::-webkit-scrollbar-thumb { background: #cbd5e1; }
  /* School blocks */
  .sti-wrap.light .cmap-school-block { border-color: #cbd5e1; background: #ffffff; }
  .sti-wrap.light .cmap-school-head { background: #f1f5f9; border-bottom-color: #e2e8f0; }
  .sti-wrap.light .cmap-school-head:hover { background: #e2e8f0; }
  .sti-wrap.light .cmap-school-name { color: #0f172a; }
  .sti-wrap.light .cmap-school-meta { color: #374151; }
  .sti-wrap.light .cmap-chevron { color: #64748b; }
  /* School banner (detail view) */
  .sti-wrap.light .cmap-school-banner { background: #f1f5f9; border-bottom-color: #e2e8f0; }
  .sti-wrap.light .cmap-school-banner-name { color: #0f172a; }
  .sti-wrap.light .cmap-school-banner-pill { background: #e2e8f0; border-color: #cbd5e1; color: #1e293b; }
  .sti-wrap.light .cmap-dist-badge { background: #e2e8f0; border-color: #cbd5e1; color: #1e293b; }
  /* Status summary */
  .sti-wrap.light .cmap-status-summary { background: #f1f5f9; border-bottom-color: #e2e8f0; }
  /* Lead cards */
  .sti-wrap.light .cmap-lead-card { background: #ffffff; border-color: #e2e8f0; }
  .sti-wrap.light .cmap-lead-card:hover { background: #fdf4ff; border-color: #e9d5ff; }
  .sti-wrap.light .cmap-lead-card-name { color: #0f172a; }
  .sti-wrap.light .cmap-lead-card-meta { color: #374151; }
  .sti-wrap.light .cmap-lead-card-arrow { color: #94a3b8; }
  /* Lead rows */
  .sti-wrap.light .cmap-lead-row { background: #f8fafc; border-color: #e2e8f0; }
  .sti-wrap.light .cmap-lead-row:hover { background: #f1f5f9; }
  .sti-wrap.light .cmap-lead-name { color: #0f172a; }
  .sti-wrap.light .cmap-lead-meta { color: #374151; }
  /* Competition cards */
  .sti-wrap.light .cmap-comp-card { background: #fff5f5; border-color: #fecaca; }
  .sti-wrap.light .cmap-comp-card:hover { background: #fee2e2; }
  .sti-wrap.light .cmap-comp-card-name { color: #0f172a; }
  .sti-wrap.light .cmap-comp-card-meta { color: #374151; }
  /* Back button & misc */
  .sti-wrap.light .cmap-back-btn { color: #374151; }
  .sti-wrap.light .cmap-back-btn:hover { color: #0f172a; background: #f1f5f9; }
  .sti-wrap.light .cmap-no-leads { color: #374151; }
  .sti-wrap.light .cmap-no-leads-text { color: #374151; }
  .sti-wrap.light .cmap-panel-empty-text { color: #374151; }
  .sti-wrap.light .cmap-geocoding-pill { background: rgba(255,255,255,.95); border-color: #e2e8f0; color: #2563eb; }
  .sti-wrap.light .cmap-flyto-toast { background: rgba(255,255,255,.95); border-color: #e2e8f0; color: #0f172a; }
`;function Ne(){const a=document.getElementById("cmap-styles-v6");a&&a.remove();const t=document.createElement("style");t.id="cmap-styles-v6",t.textContent=$e,document.head.appendChild(t)}function ze({target:a}){const t=D();return m.useEffect(()=>{a&&t.flyTo([a.lat,a.lng],a.zoom??16,{animate:!0,duration:1.2})},[a]),null}function Ce({school:a,distKm:t,leadsCount:r}){const l=a.offers_college,d=a.offers_secondary||!a.offers_college&&!a.offers_secondary,x=a.type==="feeder"?"Feeder School":"Non-Feeder",i=a.type==="feeder"?"#60a5fa":"#94a3b8";return e.jsxs("div",{style:{padding:"14px 16px"},children:[e.jsxs("div",{style:{display:"flex",gap:5,flexWrap:"wrap",marginBottom:9},children:[l&&e.jsx("span",{style:{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,background:"#dc262622",color:"#f87171",fontSize:9,fontWeight:700,letterSpacing:".6px",textTransform:"uppercase",border:"1px solid #dc262630"},children:" Competitor"}),d&&e.jsx("span",{style:{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,background:`${i}22`,color:i,fontSize:9,fontWeight:700,letterSpacing:".6px",textTransform:"uppercase",border:`1px solid ${i}30`},children:x})]}),e.jsx("div",{style:{fontSize:14,fontWeight:700,color:"#f1f5f9",lineHeight:1.3,marginBottom:8},children:a.name}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:5},children:[a.city&&e.jsx("div",{style:{fontSize:11,color:"#475569"},children:a.city}),t!=null&&e.jsxs("div",{className:"cmap-dist-badge",style:{width:"fit-content"},children:[O(t)," from STI Alabang"]}),r>0&&e.jsxs("div",{className:"cmap-dist-badge",style:{width:"fit-content",color:"#60a5fa",borderColor:"#3b82f630"},children:[r," lead",r!==1?"s":""," · Click pin for details"]}),l&&e.jsx("div",{style:{fontSize:10,color:"#475569",marginTop:2},children:"Offers college programs — enrollment competitor"})]})]})}function Le({label:a,color:t,count:r,active:l,onClick:d}){return e.jsxs("button",{className:"cmap-filter-btn",onClick:d,"aria-pressed":l,children:[e.jsx("span",{className:"cmap-filter-dot",style:{background:l?t:"#334155"}}),e.jsxs("span",{children:[" ",a]}),e.jsx("span",{className:"cmap-filter-count",children:r})]})}async function Pe(a,t){const r=t?`${a}, ${t}, Philippines`:`${a}, Muntinlupa, Philippines`,l=`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(r)}&limit=1&countrycodes=ph`;try{const x=await(await fetch(l,{headers:{"Accept-Language":"en"}})).json();if(x.length>0)return{lat:parseFloat(x[0].lat),lng:parseFloat(x[0].lon)}}catch{}return null}function Me(a){return new Promise(t=>setTimeout(t,a))}function Te({markers:a}){const t=D(),r=m.useRef(!1);return m.useEffect(()=>{if(r.current)return;const l=a.filter(d=>d.lat&&d.lng).map(d=>[d.lat,d.lng]);l.length>0&&(t.fitBounds([...l,S],{padding:[48,48],maxZoom:14}),r.current=!0)},[a]),null}function ne({targetRef:a}){const t=D();return m.useEffect(()=>{a.current&&(A.DomEvent.disableClickPropagation(a.current),A.DomEvent.disableScrollPropagation(a.current))},[t,a]),null}function Ae({school:a,leads:t,categoryColor:r,onSchoolClick:l}){const d=a.lat&&a.lng?H(S,[a.lat,a.lng]):null;return e.jsx("div",{className:"cmap-school-block",children:e.jsxs("div",{className:"cmap-school-head",onClick:()=>l?.(a),children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{className:"cmap-school-name",children:a.name}),e.jsxs("div",{className:"cmap-school-meta",children:[a.city||"Muntinlupa",d!=null?` · ${O(d)} away`:" · locating…"]})]}),e.jsx("span",{className:"cmap-school-count",style:{background:`${r}18`,color:r,border:`1px solid ${r}30`},children:t.length}),e.jsx("span",{className:"cmap-chevron",children:"▶"})]})})}function Fe({school:a,onClose:t,onBack:r,onLeadClick:l}){return e.jsx("div",{className:"cmap-panel",children:e.jsx(ve,{school:a,onBack:r,onClose:t,variant:"panel",onLeadClick:l})})}function _e({category:a,schools:t,leads:r,onClose:l,onSchoolSelect:d}){const i={feeder:{label:"Feeder Schools",color:"#2563eb"},nonFeeder:{label:"Non-Feeder Schools",color:"#475569"},competition:{label:"Competitors",color:"#dc2626"}}[a],g=a==="competition",s={};r.forEach(p=>{const b=p.schools?.id;b&&(s[b]||(s[b]=[]),s[b].push(p))});const c=g?0:t.reduce((p,b)=>p+(s[b.id]?.length??0),0);return e.jsxs("div",{className:"cmap-panel",children:[e.jsxs("div",{className:"cmap-panel-header",children:[e.jsx("div",{className:"cmap-panel-icon",style:{background:`${i.color}18`,border:`1px solid ${i.color}30`}}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{className:"cmap-panel-title",children:i.label}),e.jsxs("div",{className:"cmap-panel-sub",children:[t.length," school",t.length!==1?"s":"",!g&&` · ${c} lead${c!==1?"s":""}`]})]}),e.jsx("button",{className:"cmap-panel-close","data-variant":"text",onClick:l,children:"✕"})]}),e.jsx("div",{className:"cmap-panel-body",children:t.length===0?e.jsxs("div",{className:"cmap-panel-empty",children:[e.jsx("div",{className:"cmap-panel-empty-icon"}),e.jsxs("div",{className:"cmap-panel-empty-text",children:["No ",i.label.toLowerCase()," found."]})]}):g?t.map(p=>{const b=p.lat&&p.lng?H(S,[p.lat,p.lng]):null,u=p.offers_secondary||!p.offers_college&&!p.offers_secondary;return e.jsxs("div",{className:"cmap-comp-card",onClick:()=>d(p),children:[e.jsx("div",{className:"cmap-comp-card-name",children:p.name}),e.jsxs("div",{className:"cmap-comp-card-meta",children:[p.city||"—",b!=null?` · ${O(b)} away`:""]}),e.jsxs("div",{className:"cmap-comp-card-badges",children:[e.jsx("span",{className:"cmap-level-badge",style:{background:"#dc262618",color:"#f87171",border:"1px solid #dc262630",fontSize:9,marginBottom:0},children:" Offers College"}),u&&e.jsx("span",{className:"cmap-level-badge",style:{background:"#47556918",color:"#94a3b8",border:"1px solid #47556930",fontSize:9,marginBottom:0},children:" Also Secondary"})]})]},p.id)}):t.slice().sort((p,b)=>(s[b.id]?.length??0)-(s[p.id]?.length??0)).map(p=>e.jsx(Ae,{school:p,leads:s[p.id]??[],categoryColor:i.color,onSchoolClick:d},p.id))})]})}function Ie(){const[a,t]=m.useState([]),[r,l]=m.useState(0),[d,x]=m.useState([]),[i,g]=m.useState(!1),[s,c]=m.useState(""),[p,b]=m.useState({}),[u,v]=m.useState(null),[y,j]=m.useState(null),[C,L]=m.useState(null),[E,G]=m.useState(null),[U,F]=m.useState(null),_=m.useRef(null),X=m.useRef(null),V=m.useRef(null),[k,Y]=m.useState({feeder:!0,nonFeeder:!0,competition:!0});m.useEffect(()=>{Ne()},[]);const Z=o=>{!o?.lat||!o?.lng||(G({lat:o.lat,lng:o.lng,name:o.name}),F(o.name),clearTimeout(_.current),_.current=setTimeout(()=>F(null),2200))},ie=o=>{o.stopPropagation(),G({lat:S[0],lng:S[1],zoom:17,name:"STI College Alabang"}),F("STI College Alabang"),clearTimeout(_.current),_.current=setTimeout(()=>F(null),2200)},le=o=>Y(n=>({...n,[o]:!n[o]})),se=(o,n)=>{n.stopPropagation(),j(null),v(f=>f===o?null:o),Y(f=>({...f,[o]:!0}))},pe=o=>{j(o),v(null),Z(o)},ce=o=>{j(o),v(null),Z(o)},de=o=>{const n=T(o),f=n.includes("competition")?"competition":n.includes("feeder")?"feeder":"nonFeeder";j(null),v(f)},me=o=>L(o),K=()=>L(null),fe=async(o,n)=>{g(!0);const f=[...n];for(let h=0;h<o.length;h++){const w=o[h];c(`Locating ${h+1}/${o.length}: ${w.name}`);const $=await Pe(w.name,w.city);$&&(await M.from("schools").update({lat:$.lat,lng:$.lng}).eq("id",w.id),f.push({...w,...$}),t([...f])),h<o.length-1&&await Me(Se)}g(!1),c("")};m.useEffect(()=>{(async()=>{const{data:n,error:f}=await M.from("schools").select("id, name, type, city, lat, lng, offers_college, offers_secondary").order("name");if(f){console.error(f);return}const h=n||[];l(h.length);const w=h.filter(P=>P.lat&&P.lng),$=h.filter(P=>!P.lat||!P.lng);t(w),$.length>0&&fe($,w)})()},[]);const[q,ge]=m.useState(0);ae(["leads","schools"],()=>ge(o=>o+1),{paused:i}),ae(["schools"],async()=>{const{data:o,error:n}=await M.from("schools").select("id, name, type, city, lat, lng, offers_college, offers_secondary").order("name");n||(l((o||[]).length),t((o||[]).filter(f=>f.lat&&f.lng)))},{paused:i,delay:1500}),m.useEffect(()=>{M.from("leads").select("id, first_name, last_name, email, phone, status, source, created_at, schools(id, name, type)").order("created_at",{ascending:!1}).then(({data:o,error:n})=>{n?console.error(n):x(o||[])})},[q]),m.useEffect(()=>{M.from("leads_per_school").select("id, total_leads").then(({data:o})=>{const n={};(o||[]).forEach(f=>{n[f.id]=f.total_leads}),b(n)})},[q]);const I=a.filter(o=>o.lat&&o.lng),W=I.filter(o=>T(o).includes("feeder")),B=I.filter(o=>T(o).includes("nonFeeder")),R=I.filter(o=>T(o).includes("competition")),J=[...new Map(I.map(o=>[o.id,o])).values()],Q=[{key:"feeder",color:"#2563eb",label:"Feeder Schools",count:W.length},{key:"nonFeeder",color:"#475569",label:"Non-Feeder Schools",count:B.length},{key:"competition",color:"#dc2626",label:"Competitors",count:R.length}],xe={feeder:W,nonFeeder:B,competition:R},be=o=>{const n=y?.id===o.id;return o.offers_college?n?z.competitionActive:z.competition:o.type==="feeder"?n?z.feederActive:z.feeder:n?z["non-feederActive"]:z["non-feeder"]},ee=o=>{const n=T(o);return n.includes("competition")&&k.competition||n.includes("feeder")&&k.feeder||n.includes("nonFeeder")&&k.nonFeeder};return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"cmap-outer-card",style:{borderRadius:14,overflow:"hidden",border:"1px solid rgba(255,255,255,.08)"},children:[e.jsxs("div",{className:"cmap-filters",children:[e.jsx("span",{className:"cmap-filter-label",children:"Show:"}),e.jsxs("div",{className:"cmap-sti-pill",children:[e.jsx("span",{style:{width:9,height:9,borderRadius:"50%",background:"#f59e0b",flexShrink:0,border:"1.5px solid rgba(255,255,255,.4)",display:"inline-block"}}),e.jsx("span",{children:" STI Alabang"})]}),Q.map(({key:o,color:n,label:f,count:h})=>e.jsx(Le,{label:f,color:n,count:h,active:k[o],onClick:()=>le(o)},o)),e.jsx("span",{className:"cmap-filter-summary",children:[k.feeder&&`${W.length} feeder`,k.nonFeeder&&`${B.length} non-feeder`,k.competition&&`${R.length} competitors`,!i&&r>a.length&&`${r-a.length} not yet on map (no location found)`].filter(Boolean).join(" · ")})]}),e.jsxs("div",{style:{position:"relative"},children:[i&&e.jsxs("div",{className:"cmap-geocoding-pill",children:[e.jsx("div",{className:"cmap-spinner"}),e.jsx("span",{children:s||"Locating schools…"})]}),U&&e.jsxs("div",{className:"cmap-flyto-toast",children:[e.jsx("span",{}),e.jsxs("span",{children:["Centering on ",e.jsx("strong",{children:U})]})]}),e.jsxs(ye,{center:S,bounds:re,maxBounds:re,maxBoundsViscosity:.8,minZoom:11,maxZoom:17,scrollWheelZoom:!0,zoomControl:!0,worldCopyJump:!1,style:{height:"560px",width:"100%"},children:[e.jsx(ke,{attribution:"© OpenStreetMap contributors",url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",noWrap:!0}),e.jsx(Te,{markers:J.filter(ee)}),e.jsx(ne,{targetRef:X}),e.jsx(ne,{targetRef:V}),e.jsx(ze,{target:E}),e.jsx(oe,{position:S,icon:z.sti,children:e.jsx(te,{className:"cmap-popup",children:e.jsxs("div",{style:{padding:"14px 16px"},children:[e.jsx("div",{style:{fontSize:14,fontWeight:700,color:"#f1f5f9",marginBottom:4},children:"STI College Alabang"}),e.jsx("div",{style:{fontSize:11,color:"#f59e0b",fontWeight:600,marginBottom:6},children:" Reference Point"}),e.jsx("div",{style:{fontSize:11,color:"#475569"},children:"Alabang, Muntinlupa City"}),e.jsx("div",{style:{fontSize:10,color:"#334155",marginTop:6,padding:"5px 8px",background:"rgba(245,158,11,.08)",borderRadius:6,border:"1px solid rgba(245,158,11,.15)"},children:"All distances on this map are measured from this location."})]})})}),J.filter(ee).map(o=>e.jsx(oe,{position:[o.lat,o.lng],icon:be(o),eventHandlers:{click:()=>pe(o)},children:e.jsx(te,{className:"cmap-popup",children:e.jsx(Ce,{school:o,distKm:H(S,[o.lat,o.lng]),leadsCount:p[o.id]??0})})},o.id))]}),e.jsxs("div",{className:"cmap-legend",ref:X,children:[e.jsx("div",{className:"cmap-legend-title",children:"Map Legend"}),e.jsxs("div",{className:"cmap-legend-row-sti",onClick:ie,onMouseDown:o=>o.stopPropagation(),title:"Click to zoom in to STI Alabang",children:[e.jsx("div",{className:"cmap-legend-dot",style:{background:"#f59e0b"}}),e.jsx("span",{className:"cmap-legend-label",style:{color:"#fbbf24"},children:"STI Alabang"}),e.jsx("span",{className:"cmap-legend-arrow",style:{color:"#f59e0b"},children:"⊕"})]}),Q.map(({key:o,color:n,label:f,count:h})=>e.jsxs("div",{className:`cmap-legend-row${k[o]?"":" hidden"}`,style:u===o?{background:`${n}15`,outline:`1px solid ${n}35`,borderRadius:7}:{},onClick:w=>se(o,w),onMouseDown:w=>w.stopPropagation(),children:[e.jsx("div",{className:"cmap-legend-dot",style:{background:k[o]?n:"#1e293b"}}),e.jsxs("span",{className:"cmap-legend-label",children:[f," ",e.jsxs("span",{className:"cmap-legend-count",children:["(",h,")"]})]}),e.jsx("span",{className:"cmap-legend-arrow",style:{color:u===o?n:"#64748b"},children:u===o?"◀":"▶"})]},o)),e.jsx("div",{className:"cmap-legend-hint",children:"Click pin or legend to explore schools"})]}),e.jsxs("div",{ref:V,style:{position:"absolute",top:0,right:0,bottom:0,zIndex:1002,width:y||u?330:0,pointerEvents:y||u?"all":"none"},children:[y&&e.jsx(Fe,{school:y,onClose:()=>{j(null),v(null)},onBack:()=>de(y),onLeadClick:me},y.id),!y&&u&&e.jsx(_e,{category:u,schools:xe[u],leads:d,leadsPerSchool:p,onClose:()=>v(null),onSchoolSelect:ce},u)]})]})]}),C&&e.jsx(je,{lead:C,onClose:K,onEdit:()=>{K()}})]})}function fo(){return e.jsxs("div",{className:"sti-gc",children:[e.jsx("div",{className:"sti-gc-label",children:"Competition Map — STI Alabang"}),e.jsx(Ie,{})]})}export{fo as default};

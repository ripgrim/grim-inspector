(function(C,u){typeof exports=="object"&&typeof module<"u"?module.exports=u():typeof define=="function"&&define.amd?define(u):(C=typeof globalThis<"u"?globalThis:C||self,C.GrimInspector=u())})(this,function(){"use strict";var A=Object.defineProperty;var z=(C,u,v)=>u in C?A(C,u,{enumerable:!0,configurable:!0,writable:!0,value:v}):C[u]=v;var b=(C,u,v)=>z(C,typeof u!="symbol"?u+"":u,v);const C=()=>{const v=document.createElement("style");return v.textContent=`
    /* Base Widget Styles */
    .grim-inspector-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      --primary-color: #3b82f6;
      --primary-dark: #2563eb;
      --primary-light: #93c5fd;
      --secondary-color: #10b981;
      --dark-bg: #1f2937;
      --light-bg: #ffffff;
      --text-dark: #111827;
      --text-light: #f9fafb;
      --border-color: #e5e7eb;
      --shadow-color: rgba(0, 0, 0, 0.1);
      --error-color: #ef4444;
      --warning-color: #f59e0b;
      --info-color: #3b82f6;
      --success-color: #10b981;
      --transition-bezier: cubic-bezier(0.175, 0.885, 0.32, 1.275);
      color: var(--text-dark);
    }
    
    /* Toggle Button */
    .grim-inspector-toggle {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--primary-color);
      border: none;
      box-shadow: 0 4px 6px var(--shadow-color);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: transform 0.3s var(--transition-bezier), 
                  box-shadow 0.3s ease, 
                  background-color 0.3s ease;
      position: relative;
      outline: none;
    }
    
    .grim-inspector-toggle:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
      background: var(--primary-dark);
    }
    
    .grim-inspector-toggle:active {
      transform: scale(0.95);
    }
    
    .grim-inspector-toggle::before {
      content: '';
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      position: absolute;
      transition: transform 0.3s ease;
    }
    
    .grim-inspector-toggle.active::before {
      transform: scale(0.8);
    }
    
    /* Main Panel */
    .grim-inspector-panel {
      position: absolute;
      bottom: 60px;
      right: 0;
      width: 500px;
      height: 600px;
      background: var(--light-bg);
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      transform-origin: bottom right;
      transition: transform 0.4s var(--transition-bezier), 
                  opacity 0.3s ease;
      overflow: hidden;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--border-color);
    }
    
    .grim-inspector-panel.hidden {
      transform: scale(0.8) translateY(10px);
      opacity: 0;
      pointer-events: none;
    }
    
    /* Header */
    .grim-inspector-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
      padding: 15px 20px;
    }
    
    .grim-inspector-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-dark);
      margin: 0;
    }
    
    /* Tabs */
    .grim-inspector-tabs {
      display: flex;
      border-bottom: 1px solid var(--border-color);
      background: #f9fafb;
      padding: 0 10px;
    }
    
    .grim-inspector-tab {
      padding: 12px 15px;
      font-size: 14px;
      font-weight: 500;
      color: #6b7280;
      border: none;
      background: transparent;
      cursor: pointer;
      transition: color 0.2s ease, border-color 0.2s ease;
      position: relative;
      margin: 0 5px;
    }
    
    .grim-inspector-tab::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--primary-color);
      transform: scaleX(0);
      transition: transform 0.2s ease;
    }
    
    .grim-inspector-tab:hover {
      color: var(--primary-color);
    }
    
    .grim-inspector-tab.active {
      color: var(--primary-color);
    }
    
    .grim-inspector-tab.active::after {
      transform: scaleX(1);
    }
    
    /* Tab Content */
    .grim-inspector-tab-contents {
      flex: 1;
      overflow: hidden;
      position: relative;
    }
    
    .grim-inspector-tab-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 15px;
      overflow-y: auto;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    
    .grim-inspector-tab-content.active {
      opacity: 1;
      pointer-events: auto;
    }
    
    /* Common elements */
    .grim-inspector-empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #9ca3af;
      text-align: center;
    }
    
    .grim-inspector-empty-state-icon {
      font-size: 24px;
      margin-bottom: 10px;
    }
    
    /* Entry styling */
    .grim-inspector-entry {
      border-radius: 6px;
      margin-bottom: 10px;
      padding: 12px;
      background: #f9fafb;
      border-left: 3px solid #d1d5db;
    }
    
    .grim-inspector-entry-error {
      border-left-color: var(--error-color);
      background-color: rgba(239, 68, 68, 0.05);
    }
    
    .grim-inspector-entry-warning {
      border-left-color: var(--warning-color);
      background-color: rgba(245, 158, 11, 0.05);
    }
    
    .grim-inspector-entry-info {
      border-left-color: var(--info-color);
      background-color: rgba(59, 130, 246, 0.05);
    }
    
    /* Buttons */
    .grim-inspector-btn {
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .grim-inspector-btn-primary {
      background-color: var(--primary-color);
      color: white;
    }
    
    .grim-inspector-btn-primary:hover {
      background-color: var(--primary-dark);
    }
    
    .grim-inspector-btn-ghost {
      background-color: transparent;
      color: #6b7280;
    }
    
    .grim-inspector-btn-ghost:hover {
      background-color: #f3f4f6;
      color: var(--text-dark);
    }
    
    /* Code block */
    .grim-inspector-code {
      font-family: 'Fira Code', monospace;
      font-size: 12px;
      background: #f3f4f6;
      border-radius: 4px;
      padding: 10px;
      overflow-x: auto;
      margin: 8px 0;
      max-height: 200px;
      overflow-y: auto;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
      70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
      100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    }
    
    .grim-inspector-toggle.pulse {
      animation: pulse 1.5s infinite;
    }
  `,v};class u{constructor(){b(this,"container");b(this,"toggle");b(this,"panel");b(this,"isOpen",!1);b(this,"activeTab","components");b(this,"components",[]);b(this,"logs",[]);b(this,"errors",[]);b(this,"events",[]);b(this,"network",[]);b(this,"metrics",{});this.container=document.createElement("div"),this.container.classList.add("grim-inspector-widget"),this.toggle=document.createElement("button"),this.toggle.classList.add("grim-inspector-toggle","pulse"),this.toggle.setAttribute("aria-label","Open Shopify Inspector"),this.panel=document.createElement("div"),this.panel.classList.add("grim-inspector-panel","hidden"),this.buildPanelContent(),this.container.appendChild(this.toggle),this.container.appendChild(this.panel),this.toggle.addEventListener("click",this.togglePanel.bind(this)),document.body.appendChild(C()),document.body.appendChild(this.container),this.initPerformanceMetrics(),this.initConsoleMonitoring(),this.initEventMonitoring(),this.initNetworkMonitoring(),this.initComponentDetection(),setTimeout(()=>{this.toggle.classList.remove("pulse")},5e3)}buildPanelContent(){const e=document.createElement("div");e.classList.add("grim-inspector-header");const i=document.createElement("h2");i.classList.add("grim-inspector-title"),i.textContent="Shopify Inspector",e.appendChild(i);const s=document.createElement("div");s.classList.add("grim-inspector-tabs");const r=["Components","Logs","Errors","Events","Network","Metrics"];r.forEach(t=>{const n=document.createElement("button");n.classList.add("grim-inspector-tab"),n.textContent=t,n.dataset.tab=t.toLowerCase(),t.toLowerCase()===this.activeTab&&n.classList.add("active"),n.addEventListener("click",()=>this.switchTab(t.toLowerCase())),s.appendChild(n)});const o=document.createElement("div");o.classList.add("grim-inspector-tab-contents"),r.forEach(t=>{const n=document.createElement("div");n.classList.add("grim-inspector-tab-content"),n.dataset.content=t.toLowerCase(),t.toLowerCase()===this.activeTab&&n.classList.add("active");const a=document.createElement("div");a.classList.add("grim-inspector-empty-state");const d=document.createElement("div");d.classList.add("grim-inspector-empty-state-icon"),d.textContent="📊";const c=document.createElement("p");c.textContent=`No ${t.toLowerCase()} data yet`,a.appendChild(d),a.appendChild(c),n.appendChild(a),o.appendChild(n)}),this.panel.appendChild(e),this.panel.appendChild(s),this.panel.appendChild(o)}switchTab(e){if(this.activeTab=e,this.panel.querySelectorAll(".grim-inspector-tab").forEach(r=>{r.dataset.tab===e?r.classList.add("active"):r.classList.remove("active")}),this.panel.querySelectorAll(".grim-inspector-tab-content").forEach(r=>{r.dataset.content===e?r.classList.add("active"):r.classList.remove("active")}),e==="events"){const r=this.panel.querySelector('.grim-inspector-tab-content[data-content="events"]');if(r){Array.from(r.children).forEach(t=>{t.classList.contains("grim-inspector-empty-state")||t.remove()});const o=document.createElement("div");o.style.display="flex",o.style.justifyContent="center",o.style.alignItems="center",o.style.height="100%",o.style.color="#6b7280",o.textContent="Loading events...",r.appendChild(o),setTimeout(()=>{this.refreshTabContent(e)},50)}}else this.refreshTabContent(e)}refreshTabContent(e){const i=this.panel.querySelector(`.grim-inspector-tab-content[data-content="${e}"]`);if(!i)return;const s=i.querySelector(".grim-inspector-empty-state");switch(e){case"components":this.renderComponentsTab(i,s);break;case"logs":this.renderLogsTab(i,s);break;case"errors":this.renderErrorsTab(i,s);break;case"events":this.renderEventsTab(i,s);break;case"network":this.renderNetworkTab(i,s);break;case"metrics":this.renderMetricsTab(i,s);break}}renderComponentsTab(e,i){if(this.components.length===0){i.style.display="flex";return}i.style.display="none",Array.from(e.children).forEach(o=>{o.classList.contains("grim-inspector-empty-state")||o.remove()});const s={};this.components.forEach(o=>{s[o.type]||(s[o.type]=[]),s[o.type].push(o)});const r=document.createElement("div");r.classList.add("grim-inspector-components-container"),Object.entries(s).forEach(([o,t])=>{const n=document.createElement("div");n.classList.add("grim-inspector-component-section"),n.style.marginBottom="20px";const a=document.createElement("h3");a.style.fontSize="14px",a.style.fontWeight="600",a.style.marginBottom="10px",a.style.padding="0 0 5px 0",a.style.borderBottom="1px solid #e5e7eb";let d=o.charAt(0).toUpperCase()+o.slice(1);o==="shopify-section"?d="Shopify Sections":o==="library"?d="Libraries":o==="shopify"?d="Shopify Scripts":d=`${d}s`,a.textContent=d,n.appendChild(a),t.forEach(c=>{const l=document.createElement("div");l.classList.add("grim-inspector-component-item"),l.style.padding="10px",l.style.borderRadius="6px",l.style.marginBottom="8px",l.style.background="#f9fafb";const h=document.createElement("div");h.style.display="flex",h.style.justifyContent="space-between",h.style.alignItems="flex-start";const f=document.createElement("div");f.style.fontWeight="500",f.textContent=c.name;const m=document.createElement("div");if(m.style.display="flex",m.style.gap="5px",c.isAsync){const p=document.createElement("span");p.style.fontSize="10px",p.style.padding="2px 5px",p.style.borderRadius="4px",p.style.backgroundColor="rgba(16, 185, 129, 0.1)",p.style.color="#10b981",p.textContent="async",m.appendChild(p)}if(c.isDeferred){const p=document.createElement("span");p.style.fontSize="10px",p.style.padding="2px 5px",p.style.borderRadius="4px",p.style.backgroundColor="rgba(59, 130, 246, 0.1)",p.style.color="#3b82f6",p.textContent="defer",m.appendChild(p)}if(h.appendChild(f),h.appendChild(m),c.path){const p=document.createElement("div");p.style.fontSize="11px",p.style.color="#6b7280",p.style.marginTop="5px",p.style.fontFamily="'Fira Code', monospace",p.style.wordBreak="break-all",p.textContent=c.path,l.appendChild(h),l.appendChild(p)}else l.appendChild(h);n.appendChild(l)}),r.appendChild(n)}),e.appendChild(r)}renderLogsTab(e,i){if(this.logs.length===0){i.style.display="flex";return}i.style.display="none",Array.from(e.children).forEach(t=>{t.classList.contains("grim-inspector-empty-state")||t.remove()});const s=document.createElement("div");s.classList.add("grim-inspector-toolbar"),s.style.display="flex",s.style.justifyContent="flex-end",s.style.marginBottom="10px";const r=document.createElement("button");r.classList.add("grim-inspector-btn","grim-inspector-btn-ghost"),r.textContent="Clear Logs",r.addEventListener("click",()=>{this.logs=[],this.refreshTabContent("logs")}),s.appendChild(r),e.appendChild(s);const o=document.createElement("div");o.classList.add("grim-inspector-logs-container"),this.logs.slice().reverse().forEach(t=>{const n=document.createElement("div");n.classList.add("grim-inspector-entry"),t.type==="warn"?n.classList.add("grim-inspector-entry-warning"):t.type==="info"&&n.classList.add("grim-inspector-entry-info");const a=document.createElement("div");a.style.display="flex",a.style.justifyContent="space-between",a.style.alignItems="center",a.style.marginBottom="5px";const d=document.createElement("span");switch(d.style.fontWeight="bold",d.style.textTransform="uppercase",d.style.fontSize="10px",t.type){case"log":d.textContent="Log",d.style.color="#6b7280";break;case"warn":d.textContent="Warning",d.style.color="var(--warning-color)";break;case"info":d.textContent="Info",d.style.color="var(--info-color)";break}const c=document.createElement("span");c.style.fontSize="10px",c.style.color="#6b7280";const l=new Date(t.timestamp);c.textContent=l.toLocaleTimeString(),a.appendChild(d),a.appendChild(c);const h=document.createElement("div");h.textContent=t.message;const f=document.createElement("div");f.style.marginTop="5px",f.style.display="flex",f.style.justifyContent="flex-end";const m=document.createElement("button");m.classList.add("grim-inspector-btn","grim-inspector-btn-ghost"),m.textContent="Copy",m.style.fontSize="10px",m.style.padding="4px 8px",m.addEventListener("click",()=>{navigator.clipboard.writeText(t.message).then(()=>{const p=m.textContent;m.textContent="Copied!",setTimeout(()=>{m.textContent=p},1e3)})}),f.appendChild(m),n.appendChild(a),n.appendChild(h),n.appendChild(f),o.appendChild(n)}),e.appendChild(o)}renderErrorsTab(e,i){if(this.errors.length===0){i.style.display="flex";return}i.style.display="none",Array.from(e.children).forEach(t=>{t.classList.contains("grim-inspector-empty-state")||t.remove()});const s=document.createElement("div");s.classList.add("grim-inspector-toolbar"),s.style.display="flex",s.style.justifyContent="flex-end",s.style.marginBottom="10px";const r=document.createElement("button");r.classList.add("grim-inspector-btn","grim-inspector-btn-ghost"),r.textContent="Clear All",r.addEventListener("click",()=>{this.errors=[],this.refreshTabContent("errors")}),s.appendChild(r),e.appendChild(s);const o=document.createElement("div");o.classList.add("grim-inspector-errors-container"),this.errors.slice().reverse().forEach(t=>{const n=document.createElement("div");n.classList.add("grim-inspector-entry","grim-inspector-entry-error");const a=document.createElement("div");a.style.display="flex",a.style.justifyContent="space-between",a.style.alignItems="center",a.style.marginBottom="5px";const d=document.createElement("span");d.style.fontWeight="bold",d.textContent="Error",d.style.color="var(--error-color)";const c=document.createElement("span");c.style.fontSize="10px",c.style.color="#6b7280";const l=new Date(t.timestamp);c.textContent=l.toLocaleTimeString(),a.appendChild(d),a.appendChild(c);const h=document.createElement("div");if(h.textContent=t.message,h.style.marginBottom="8px",t.stack){const p=document.createElement("pre");p.classList.add("grim-inspector-code"),p.textContent=t.stack;const g=document.createElement("div");g.style.fontSize="11px",g.style.fontWeight="500",g.style.marginTop="8px",g.style.color="#4b5563",g.textContent="Stack Trace:",h.appendChild(g),h.appendChild(p)}const f=document.createElement("div");f.style.marginTop="8px",f.style.display="flex",f.style.justifyContent="flex-end";const m=document.createElement("button");m.classList.add("grim-inspector-btn","grim-inspector-btn-ghost"),m.textContent="Copy",m.addEventListener("click",()=>{const p=t.stack?`${t.message}

${t.stack}`:t.message;navigator.clipboard.writeText(p).then(()=>{const g=m.textContent;m.textContent="Copied!",setTimeout(()=>{m.textContent=g},1e3)})}),f.appendChild(m),n.appendChild(a),n.appendChild(h),n.appendChild(f),o.appendChild(n)}),e.appendChild(o)}renderEventsTab(e,i){if(this.events.length===0){i.style.display="flex";return}i.style.display="none",Array.from(e.children).forEach(n=>{n.classList.contains("grim-inspector-empty-state")||n.remove()});const s=document.createElement("div");s.classList.add("grim-inspector-toolbar"),s.style.display="flex",s.style.justifyContent="flex-end",s.style.marginBottom="10px";const r=document.createElement("button");r.classList.add("grim-inspector-btn","grim-inspector-btn-ghost"),r.textContent="Clear Events",r.addEventListener("click",()=>{this.events=[],this.refreshTabContent("events")}),s.appendChild(r),e.appendChild(s);const o=document.createElement("div");if(o.classList.add("grim-inspector-events-container"),this.events.slice(-25).reverse().forEach(n=>{const a=document.createElement("div");a.classList.add("grim-inspector-entry");const d=document.createElement("div");d.style.display="flex",d.style.justifyContent="space-between",d.style.alignItems="center",d.style.marginBottom="5px";const c=document.createElement("span");c.style.fontWeight="600",c.textContent=n.type,c.style.color="var(--primary-color)";const l=document.createElement("span");l.style.fontSize="10px",l.style.color="#6b7280";const h=new Date(n.timestamp);l.textContent=h.toLocaleTimeString(),d.appendChild(c),d.appendChild(l);const f=document.createElement("div");f.style.fontSize="12px",f.style.marginBottom="5px";const m=document.createElement("span");m.style.fontWeight="500",m.style.color="#4b5563",m.textContent="Target: ";const p=document.createElement("span");p.style.fontFamily="'Fira Code', monospace",p.style.color="#111827",p.textContent=n.target,f.appendChild(m),f.appendChild(p);const g=document.createElement("div");if(g.appendChild(f),n.details&&Object.keys(n.details).length>0){const y=document.createElement("div");if(y.style.fontSize="12px",Object.entries(n.details).slice(0,5).forEach(([E,w])=>{if(w!=null){const L=document.createElement("div");L.style.display="flex",L.style.marginBottom="2px";const k=document.createElement("span");k.style.fontWeight="500",k.style.color="#4b5563",k.style.minWidth="80px",k.textContent=`${E}: `;const T=document.createElement("span");if(T.style.fontFamily="'Fira Code', monospace",T.style.color="#111827",T.style.whiteSpace="pre-wrap",typeof w=="object")try{T.textContent=w instanceof Node?"DOM Node":Array.isArray(w)?`Array(${w.length})`:"{...}"}catch{T.textContent="Object"}else T.textContent=String(w);L.appendChild(k),L.appendChild(T),y.appendChild(L)}}),Object.keys(n.details).length>5){const E=document.createElement("div");E.style.fontSize="11px",E.style.fontStyle="italic",E.style.color="#6b7280",E.textContent=`...and ${Object.keys(n.details).length-5} more properties`,y.appendChild(E)}g.appendChild(y)}a.appendChild(d),a.appendChild(g),o.appendChild(a)}),this.events.length>25){const n=document.createElement("div");n.style.textAlign="center",n.style.padding="10px",n.style.fontSize="12px",n.style.color="#6b7280",n.textContent=`Showing most recent 25 of ${this.events.length} events`,o.appendChild(n)}e.appendChild(o)}renderNetworkTab(e,i){if(this.network.length===0){i.style.display="flex";return}i.style.display="none",Array.from(e.children).forEach(t=>{t.classList.contains("grim-inspector-empty-state")||t.remove()});const s=document.createElement("div");s.classList.add("grim-inspector-toolbar"),s.style.display="flex",s.style.justifyContent="flex-end",s.style.marginBottom="10px";const r=document.createElement("button");r.classList.add("grim-inspector-btn","grim-inspector-btn-ghost"),r.textContent="Clear Network",r.addEventListener("click",()=>{this.network=[],this.refreshTabContent("network")}),s.appendChild(r),e.appendChild(s);const o=document.createElement("div");o.classList.add("grim-inspector-network-container"),this.network.slice().reverse().forEach(t=>{const n=document.createElement("div");n.classList.add("grim-inspector-entry"),t.status?t.status>=400?n.classList.add("grim-inspector-entry-error"):t.status>=300?n.classList.add("grim-inspector-entry-warning"):t.status>=200&&(n.style.borderLeftColor="var(--success-color)"):t.status===0&&n.classList.add("grim-inspector-entry-error");const a=document.createElement("div");a.style.display="flex",a.style.justifyContent="space-between",a.style.alignItems="center",a.style.marginBottom="5px";const d=document.createElement("div");d.style.display="flex",d.style.alignItems="center";const c=document.createElement("span");switch(c.style.fontWeight="bold",c.style.marginRight="8px",c.style.textTransform="uppercase",c.textContent=t.method,t.method.toUpperCase()){case"GET":c.style.color="#3b82f6";break;case"POST":c.style.color="#10b981";break;case"PUT":c.style.color="#f59e0b";break;case"DELETE":c.style.color="#ef4444";break;default:c.style.color="#6b7280"}const l=document.createElement("span");l.style.marginRight="8px",l.style.borderRadius="4px",l.style.padding="2px 6px",l.style.fontSize="10px",l.style.fontWeight="600",t.status?(l.textContent=String(t.status),t.status>=400?(l.style.backgroundColor="rgba(239, 68, 68, 0.1)",l.style.color="#ef4444"):t.status>=300?(l.style.backgroundColor="rgba(245, 158, 11, 0.1)",l.style.color="#f59e0b"):t.status>=200?(l.style.backgroundColor="rgba(16, 185, 129, 0.1)",l.style.color="#10b981"):(l.style.backgroundColor="rgba(107, 114, 128, 0.1)",l.style.color="#6b7280")):t.status===0?(l.textContent="ERROR",l.style.backgroundColor="rgba(239, 68, 68, 0.1)",l.style.color="#ef4444"):(l.textContent="PENDING",l.style.backgroundColor="rgba(107, 114, 128, 0.1)",l.style.color="#6b7280"),d.appendChild(c),d.appendChild(l);const h=document.createElement("span");h.style.fontSize="10px",h.style.color="#6b7280";const f=new Date(t.timestamp);h.textContent=f.toLocaleTimeString(),a.appendChild(d),a.appendChild(h);const m=document.createElement("div");m.style.marginBottom="5px",m.style.wordBreak="break-all",m.style.fontFamily="'Fira Code', monospace",m.style.fontSize="12px",m.textContent=t.url;const p=document.createElement("div");if(p.style.fontSize="12px",p.style.display="flex",p.style.flexWrap="wrap",p.style.gap="8px",t.duration!==void 0){const g=document.createElement("div"),y=document.createElement("span");y.style.fontWeight="500",y.style.color="#4b5563",y.style.marginRight="4px",y.textContent="Duration:";const x=document.createElement("span");x.style.fontFamily="'Fira Code', monospace",x.textContent=`${Math.round(t.duration)}ms`,g.appendChild(y),g.appendChild(x),p.appendChild(g)}if(t.contentType){const g=document.createElement("div"),y=document.createElement("span");y.style.fontWeight="500",y.style.color="#4b5563",y.style.marginRight="4px",y.textContent="Content-Type:";const x=document.createElement("span");x.style.fontFamily="'Fira Code', monospace",x.textContent=t.contentType,g.appendChild(y),g.appendChild(x),p.appendChild(g)}n.appendChild(a),n.appendChild(m),n.appendChild(p),o.appendChild(n)}),e.appendChild(o)}renderMetricsTab(e,i){i.style.display="none",Array.from(e.children).forEach(c=>{c.classList.contains("grim-inspector-empty-state")||c.remove()});const s=document.createElement("div");s.classList.add("grim-inspector-metrics-container");const r=document.createElement("div");r.classList.add("grim-inspector-metrics-overview"),r.style.padding="15px",r.style.marginBottom="20px",r.style.borderRadius="8px",r.style.backgroundColor="#f9fafb",r.style.border="1px solid #e5e7eb";const o=document.createElement("h3");o.textContent="Performance Overview",o.style.fontSize="16px",o.style.fontWeight="600",o.style.marginBottom="15px",o.style.color="#111827",r.appendChild(o);const t=document.createElement("div");t.style.display="grid",t.style.gridTemplateColumns="repeat(2, 1fr)",t.style.gap="15px",[{label:"Total Load Time",value:this.metrics.totalLoadTime,unit:"ms"},{label:"DOM Content Loaded",value:this.metrics.domContentLoadTime,unit:"ms"},{label:"DOM Interactive",value:this.metrics.domInteractiveTime,unit:"ms"},{label:"First Paint",value:this.metrics.firstPaint,unit:"ms"},{label:"First Contentful Paint",value:this.metrics.firstContentfulPaint,unit:"ms"},{label:"Network Latency",value:this.metrics.networkLatency,unit:"ms"}].forEach(c=>{const l=document.createElement("div");l.style.padding="10px",l.style.borderRadius="6px";const h=document.createElement("div");h.style.fontSize="12px",h.style.fontWeight="500",h.style.color="#6b7280",h.style.marginBottom="5px",h.textContent=c.label;const f=document.createElement("div");f.style.fontSize="20px",f.style.fontWeight="600",f.style.color="#111827",c.value!==void 0?(f.textContent=`${Math.round(c.value)}${c.unit}`,(c.label.includes("Paint")||c.label.includes("Load"))&&(c.value<1e3?f.style.color="#10b981":c.value<3e3?f.style.color="#f59e0b":f.style.color="#ef4444")):(f.textContent="N/A",f.style.color="#9ca3af"),l.appendChild(h),l.appendChild(f),t.appendChild(l)}),r.appendChild(t),s.appendChild(r);const a=document.createElement("div");a.classList.add("grim-inspector-metrics-timeline"),a.style.padding="15px",a.style.borderRadius="8px",a.style.backgroundColor="#f9fafb",a.style.border="1px solid #e5e7eb";const d=document.createElement("h3");if(d.textContent="Performance Timeline",d.style.fontSize="16px",d.style.fontWeight="600",d.style.marginBottom="15px",d.style.color="#111827",a.appendChild(d),this.metrics.totalLoadTime&&this.metrics.dnsLookupTime&&this.metrics.connectionTime&&this.metrics.requestResponseTime&&this.metrics.domProcessingTime){const c=this.metrics.totalLoadTime,l=document.createElement("div");l.style.position="relative",l.style.height="50px",l.style.marginBottom="20px",l.style.backgroundColor="#e5e7eb",l.style.borderRadius="4px",l.style.overflow="hidden";const h=this.metrics.dnsLookupTime/c*100,f=this.metrics.connectionTime/c*100,m=this.metrics.requestResponseTime/c*100,p=this.metrics.domProcessingTime/c*100,g=(this.metrics.loadEventTime||0)/c*100,y=2,x=Math.max(h,y),E=Math.max(f,y),w=Math.max(m,y),L=Math.max(p,y),k=Math.max(g,y),T=this.createTimelineSegment("DNS Lookup",`${Math.round(this.metrics.dnsLookupTime)}ms`,x,"#3b82f6"),D=this.createTimelineSegment("Connection",`${Math.round(this.metrics.connectionTime)}ms`,E,"#8b5cf6"),j=this.createTimelineSegment("Request/Response",`${Math.round(this.metrics.requestResponseTime)}ms`,w,"#ec4899"),B=this.createTimelineSegment("DOM Processing",`${Math.round(this.metrics.domProcessingTime)}ms`,L,"#f59e0b"),R=this.createTimelineSegment("Load Event",`${Math.round(this.metrics.loadEventTime||0)}ms`,k,"#10b981");l.appendChild(T),l.appendChild(D),l.appendChild(j),l.appendChild(B),l.appendChild(R),a.appendChild(l);const S=document.createElement("div");S.style.display="flex",S.style.flexWrap="wrap",S.style.gap="10px",S.style.fontSize="12px",[{color:"#3b82f6",label:"DNS Lookup"},{color:"#8b5cf6",label:"Connection"},{color:"#ec4899",label:"Request/Response"},{color:"#f59e0b",label:"DOM Processing"},{color:"#10b981",label:"Load Event"}].forEach(P=>{const M=document.createElement("div");M.style.display="flex",M.style.alignItems="center";const I=document.createElement("div");I.style.width="12px",I.style.height="12px",I.style.backgroundColor=P.color,I.style.marginRight="5px",I.style.borderRadius="2px";const O=document.createElement("span");O.textContent=P.label,M.appendChild(I),M.appendChild(O),S.appendChild(M)}),a.appendChild(S)}else{const c=document.createElement("div");c.style.padding="20px",c.style.textAlign="center",c.style.color="#6b7280",c.textContent="Performance metrics not available yet. Refresh the page to collect metrics.",a.appendChild(c)}s.appendChild(a),e.appendChild(s)}createTimelineSegment(e,i,s,r){const o=document.createElement("div");return o.style.position="absolute",o.style.height="100%",o.style.width=`${s}%`,o.style.backgroundColor=r,o.style.left=`${document.querySelectorAll(".timeline-segment").length>0?Array.from(document.querySelectorAll(".timeline-segment")).map(t=>parseFloat(t.style.width)).reduce((t,n)=>t+n,0):0}%`,o.classList.add("timeline-segment"),o.title=`${e}: ${i}`,o}togglePanel(){this.isOpen=!this.isOpen,this.isOpen?(this.panel.classList.remove("hidden"),this.toggle.classList.add("active"),this.refreshTabContent(this.activeTab)):(this.panel.classList.add("hidden"),this.toggle.classList.remove("active"))}initPerformanceMetrics(){window.addEventListener("load",()=>{setTimeout(()=>{this.collectPerformanceMetrics()},0)})}collectPerformanceMetrics(){if(!window.performance||!window.performance.timing)return;const e=window.performance.timing;this.metrics={totalLoadTime:e.loadEventEnd-e.navigationStart,domContentLoadTime:e.domContentLoadedEventEnd-e.navigationStart,domInteractiveTime:e.domInteractive-e.navigationStart,dnsLookupTime:e.domainLookupEnd-e.domainLookupStart,connectionTime:e.connectEnd-e.connectStart,requestResponseTime:e.responseEnd-e.requestStart,domProcessingTime:e.domComplete-e.domLoading,loadEventTime:e.loadEventEnd-e.loadEventStart},this.metrics.networkLatency=e.responseStart-e.requestStart,window.performance&&"getEntriesByType"in window.performance&&window.performance.getEntriesByType("paint").forEach(s=>{s.name==="first-paint"&&(this.metrics.firstPaint=s.startTime),s.name==="first-contentful-paint"&&(this.metrics.firstContentfulPaint=s.startTime)}),this.isOpen&&this.activeTab==="metrics"&&this.refreshTabContent("metrics")}initConsoleMonitoring(){const e={log:console.log,error:console.error,warn:console.warn,info:console.info};console.log=(...i)=>{this.addLogEntry("log",i),e.log(...i)},console.error=(...i)=>{this.addLogEntry("error",i),e.error(...i)},console.warn=(...i)=>{this.addLogEntry("warn",i),e.warn(...i)},console.info=(...i)=>{this.addLogEntry("info",i),e.info(...i)},window.addEventListener("error",i=>{this.addErrorEntry(i)}),window.addEventListener("unhandledrejection",i=>{this.addErrorEntry(i)})}addLogEntry(e,i){const s=i.map(t=>{if(typeof t=="object")try{return JSON.stringify(t,null,2)}catch{return String(t)}return String(t)}).join(" "),r=new Date().toISOString(),o={type:e,message:s,timestamp:r};e==="error"?(this.errors.push(o),this.errors.length>100&&this.errors.shift()):(this.logs.push(o),this.logs.length>100&&this.logs.shift()),this.isOpen&&(e==="error"&&this.activeTab==="errors"?this.refreshTabContent("errors"):e!=="error"&&this.activeTab==="logs"&&this.refreshTabContent("logs"))}addErrorEntry(e){var t;const i=new Date().toISOString();let s="",r="";if(e instanceof ErrorEvent)s=e.message,r=((t=e.error)==null?void 0:t.stack)||"";else{const n=e.reason;s=n instanceof Error?n.message:String(n),r=n instanceof Error&&n.stack||""}const o={type:"error",message:s,timestamp:i,stack:r};this.errors.push(o),this.errors.length>100&&this.errors.shift(),this.isOpen&&this.activeTab==="errors"&&this.refreshTabContent("errors")}initEventMonitoring(){const e=["click","submit","change","focus","blur","load","unload","visibilitychange"],s=((t,n)=>{let a=!1;return function(...d){a||(t.apply(this,d),a=!0,setTimeout(()=>{a=!1},n))}})(t=>{const n=t.target;let a="unknown";try{n instanceof HTMLElement||n instanceof SVGElement||n instanceof Element?a=this.getElementInfo(n):n instanceof Node?a=n.nodeName||"unknown-node":n&&(a=String(n))}catch(c){a="error-getting-target-info",console.warn("Error getting target info:",c)}const d={type:t.type,target:a,details:this.getEventDetails(t),timestamp:new Date().toISOString()};this.events.push(d),this.events.length>100&&this.events.shift(),this.isOpen&&this.activeTab==="events"&&this.refreshTabContent("events")},200);e.forEach(t=>{document.addEventListener(t,s,{capture:!0,passive:!0})});const r=this;setTimeout(()=>{EventTarget.prototype.addEventListener=o},3e4);const o=EventTarget.prototype.addEventListener;EventTarget.prototype.addEventListener=function(t,n,a){const d=["click","submit","change","load"];if((this instanceof HTMLElement||this instanceof Document||this instanceof Window)&&d.includes(t)){const c=this instanceof HTMLElement?this:this,l=this instanceof HTMLElement?r.getElementInfo(c):String(this),h={type:`Added ${t} listener`,target:l,details:{eventType:t,passive:a&&typeof a=="object"?a.passive:!1,capture:a&&typeof a=="object"?a.capture:!!a},timestamp:new Date().toISOString()};r.events.push(h),r.events.length>100&&r.events.shift(),r.isOpen&&r.activeTab==="events"&&r.refreshTabContent("events")}return o.call(this,t,n,a)}}getElementInfo(e){if(!e)return"unknown";try{let i="";if(e.tagName)i=e.tagName.toLowerCase();else return"unknown-element";if("id"in e&&e.id&&(i+=`#${e.id}`),"className"in e&&e.className!==null&&e.className!==void 0){const s=e.className;if(typeof s=="string")i+=`.${s.split(" ").join(".")}`;else if(typeof s=="object"&&s){const r=s;"baseVal"in r&&r.baseVal&&(i+=`.${r.baseVal.split(" ").join(".")}`)}}return i}catch(i){return console.warn("Error getting element info:",i),"error-getting-element-info"}}getEventDetails(e){const i={};return e instanceof MouseEvent&&(i.position={x:e.clientX,y:e.clientY},e.type==="click"&&(i.button=e.button,(e.altKey||e.ctrlKey||e.shiftKey)&&(i.modifiers={alt:e.altKey,ctrl:e.ctrlKey,shift:e.shiftKey}))),e.type==="submit"&&e.target instanceof HTMLFormElement&&(i.action=e.target.action,i.method=e.target.method),(e.type==="change"||e.type==="input")&&e.target instanceof HTMLInputElement&&(i.inputType=e.target.type,e.target.type==="password"?i.valueType="password":e.target.type==="file"?i.valueType="file":e.target.value&&(i.hasValue=!0)),i}initNetworkMonitoring(){this.monitorFetch(),this.monitorXHR()}monitorFetch(){const e=window.fetch;window.fetch=async(i,s)=>{const r=performance.now(),o=(s==null?void 0:s.method)||"GET",t=typeof i=="string"?i:i instanceof URL?i.toString():i.url,n={method:o,url:t,timestamp:new Date().toISOString()};try{const a=await e(i,s),d=performance.now();return n.status=a.status,n.contentType=a.headers.get("content-type")||void 0,n.duration=d-r,this.network.push(n),this.network.length>100&&this.network.shift(),this.isOpen&&this.activeTab==="network"&&this.refreshTabContent("network"),a}catch(a){const d=performance.now();throw n.status=0,n.duration=d-r,this.network.push(n),this.network.length>100&&this.network.shift(),this.isOpen&&this.activeTab==="network"&&this.refreshTabContent("network"),a}}}monitorXHR(){const e=XMLHttpRequest.prototype.open,i=XMLHttpRequest.prototype.send;XMLHttpRequest.prototype.open=function(r,o,t=!0,n,a){return this._grimInspectorData={method:r,url:o.toString(),startTime:0},e.call(this,r,o,t,n,a)},XMLHttpRequest.prototype.send=function(r){if(this._grimInspectorData){this._grimInspectorData.startTime=performance.now();const o={method:this._grimInspectorData.method,url:this._grimInspectorData.url,timestamp:new Date().toISOString()};this.addEventListener("load",function(){const t=performance.now();o.status=this.status,o.contentType=this.getResponseHeader("content-type")||void 0,this._grimInspectorData&&this._grimInspectorData.startTime&&(o.duration=t-this._grimInspectorData.startTime),s.network.push(o),s.network.length>100&&s.network.shift(),s.isOpen&&s.activeTab==="network"&&s.refreshTabContent("network")}),this.addEventListener("error",function(){const t=performance.now();o.status=0,this._grimInspectorData&&this._grimInspectorData.startTime&&(o.duration=t-this._grimInspectorData.startTime),s.network.push(o),s.network.length>100&&s.network.shift(),s.isOpen&&s.activeTab==="network"&&s.refreshTabContent("network")})}return i.call(this,r)};const s=this}initComponentDetection(){this.detectShopifySections(),this.detectJSComponents(),this.observeComponentChanges()}detectShopifySections(){document.querySelectorAll("[data-section-type], [data-section-id]").forEach(i=>{const s=i.getAttribute("data-section-type")||"unknown",r=i.getAttribute("data-section-id")||"",o={name:`Section: ${s}`,type:"shopify-section",path:r};this.components.push(o)}),this.isOpen&&this.activeTab==="components"&&this.refreshTabContent("components")}detectJSComponents(){document.querySelectorAll("script").forEach(i=>{if(i.src){const s=i.src.split("/"),r=s[s.length-1];let o="script",t=r;r.includes("jquery")?(o="library",t="jQuery"):r.includes("swiper")?(o="library",t="Swiper"):r.includes("slick")?(o="library",t="Slick Slider"):r.includes("shopify")&&(o="shopify");const n={name:t,type:o,path:i.src,isAsync:i.async,isDeferred:i.defer};this.components.push(n)}}),this.isOpen&&this.activeTab==="components"&&this.refreshTabContent("components")}observeComponentChanges(){new MutationObserver(i=>{let s=!1;i.forEach(r=>{r.type==="childList"&&r.addedNodes.forEach(o=>{if(o instanceof HTMLElement){if(o.hasAttribute("data-section-type")||o.hasAttribute("data-section-id")){s=!0;const n=o.getAttribute("data-section-type")||"unknown",a=o.getAttribute("data-section-id")||"",d={name:`Section: ${n}`,type:"shopify-section",path:a};this.components.push(d)}const t=o.querySelectorAll("script");t.length>0&&(s=!0,t.forEach(n=>{if(n.src){const a=n.src.split("/"),d=a[a.length-1];let c="script",l=d;d.includes("jquery")?(c="library",l="jQuery"):d.includes("swiper")?(c="library",l="Swiper"):d.includes("slick")?(c="library",l="Slick Slider"):d.includes("shopify")&&(c="shopify");const h={name:l,type:c,path:n.src,isAsync:n.async,isDeferred:n.defer};this.components.push(h)}}))}})}),s&&this.isOpen&&this.activeTab==="components"&&this.refreshTabContent("components")}).observe(document.body,{childList:!0,subtree:!0})}}return typeof window<"u"&&(document.readyState==="complete"||document.readyState==="interactive"?new u:document.addEventListener("DOMContentLoaded",()=>new u)),u});

var R = Object.defineProperty;
var A = (b, e, s) => e in b ? R(b, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : b[e] = s;
var u = (b, e, s) => A(b, typeof e != "symbol" ? e + "" : e, s);
const z = () => {
  const b = document.createElement("style");
  return b.textContent = `
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
  `, b;
};
class P {
  constructor() {
    u(this, "container");
    u(this, "toggle");
    u(this, "panel");
    u(this, "isOpen", !1);
    u(this, "activeTab", "components");
    // Data stores
    u(this, "components", []);
    u(this, "logs", []);
    u(this, "errors", []);
    u(this, "events", []);
    u(this, "network", []);
    u(this, "metrics", {});
    this.container = document.createElement("div"), this.container.classList.add("grim-inspector-widget"), this.toggle = document.createElement("button"), this.toggle.classList.add("grim-inspector-toggle", "pulse"), this.toggle.setAttribute("aria-label", "Open Shopify Inspector"), this.panel = document.createElement("div"), this.panel.classList.add("grim-inspector-panel", "hidden"), this.buildPanelContent(), this.container.appendChild(this.toggle), this.container.appendChild(this.panel), this.toggle.addEventListener("click", this.togglePanel.bind(this)), document.body.appendChild(z()), document.body.appendChild(this.container), this.initPerformanceMetrics(), this.initConsoleMonitoring(), this.initEventMonitoring(), this.initNetworkMonitoring(), this.initComponentDetection(), setTimeout(() => {
      this.toggle.classList.remove("pulse");
    }, 5e3);
  }
  buildPanelContent() {
    const e = document.createElement("div");
    e.classList.add("grim-inspector-header");
    const s = document.createElement("h2");
    s.classList.add("grim-inspector-title"), s.textContent = "Shopify Inspector", e.appendChild(s);
    const o = document.createElement("div");
    o.classList.add("grim-inspector-tabs");
    const r = ["Components", "Logs", "Errors", "Events", "Network", "Metrics"];
    r.forEach((t) => {
      const n = document.createElement("button");
      n.classList.add("grim-inspector-tab"), n.textContent = t, n.dataset.tab = t.toLowerCase(), t.toLowerCase() === this.activeTab && n.classList.add("active"), n.addEventListener("click", () => this.switchTab(t.toLowerCase())), o.appendChild(n);
    });
    const i = document.createElement("div");
    i.classList.add("grim-inspector-tab-contents"), r.forEach((t) => {
      const n = document.createElement("div");
      n.classList.add("grim-inspector-tab-content"), n.dataset.content = t.toLowerCase(), t.toLowerCase() === this.activeTab && n.classList.add("active");
      const a = document.createElement("div");
      a.classList.add("grim-inspector-empty-state");
      const d = document.createElement("div");
      d.classList.add("grim-inspector-empty-state-icon"), d.textContent = "📊";
      const c = document.createElement("p");
      c.textContent = `No ${t.toLowerCase()} data yet`, a.appendChild(d), a.appendChild(c), n.appendChild(a), i.appendChild(n);
    }), this.panel.appendChild(e), this.panel.appendChild(o), this.panel.appendChild(i);
  }
  switchTab(e) {
    if (this.activeTab = e, this.panel.querySelectorAll(".grim-inspector-tab").forEach((r) => {
      r.dataset.tab === e ? r.classList.add("active") : r.classList.remove("active");
    }), this.panel.querySelectorAll(".grim-inspector-tab-content").forEach((r) => {
      r.dataset.content === e ? r.classList.add("active") : r.classList.remove("active");
    }), e === "events") {
      const r = this.panel.querySelector('.grim-inspector-tab-content[data-content="events"]');
      if (r) {
        Array.from(r.children).forEach((t) => {
          t.classList.contains("grim-inspector-empty-state") || t.remove();
        });
        const i = document.createElement("div");
        i.style.display = "flex", i.style.justifyContent = "center", i.style.alignItems = "center", i.style.height = "100%", i.style.color = "#6b7280", i.textContent = "Loading events...", r.appendChild(i), setTimeout(() => {
          this.refreshTabContent(e);
        }, 50);
      }
    } else
      this.refreshTabContent(e);
  }
  refreshTabContent(e) {
    const s = this.panel.querySelector(`.grim-inspector-tab-content[data-content="${e}"]`);
    if (!s) return;
    const o = s.querySelector(".grim-inspector-empty-state");
    switch (e) {
      case "components":
        this.renderComponentsTab(s, o);
        break;
      case "logs":
        this.renderLogsTab(s, o);
        break;
      case "errors":
        this.renderErrorsTab(s, o);
        break;
      case "events":
        this.renderEventsTab(s, o);
        break;
      case "network":
        this.renderNetworkTab(s, o);
        break;
      case "metrics":
        this.renderMetricsTab(s, o);
        break;
    }
  }
  renderComponentsTab(e, s) {
    if (this.components.length === 0) {
      s.style.display = "flex";
      return;
    }
    s.style.display = "none", Array.from(e.children).forEach((i) => {
      i.classList.contains("grim-inspector-empty-state") || i.remove();
    });
    const o = {};
    this.components.forEach((i) => {
      o[i.type] || (o[i.type] = []), o[i.type].push(i);
    });
    const r = document.createElement("div");
    r.classList.add("grim-inspector-components-container"), Object.entries(o).forEach(([i, t]) => {
      const n = document.createElement("div");
      n.classList.add("grim-inspector-component-section"), n.style.marginBottom = "20px";
      const a = document.createElement("h3");
      a.style.fontSize = "14px", a.style.fontWeight = "600", a.style.marginBottom = "10px", a.style.padding = "0 0 5px 0", a.style.borderBottom = "1px solid #e5e7eb";
      let d = i.charAt(0).toUpperCase() + i.slice(1);
      i === "shopify-section" ? d = "Shopify Sections" : i === "library" ? d = "Libraries" : i === "shopify" ? d = "Shopify Scripts" : d = `${d}s`, a.textContent = d, n.appendChild(a), t.forEach((c) => {
        const l = document.createElement("div");
        l.classList.add("grim-inspector-component-item"), l.style.padding = "10px", l.style.borderRadius = "6px", l.style.marginBottom = "8px", l.style.background = "#f9fafb";
        const h = document.createElement("div");
        h.style.display = "flex", h.style.justifyContent = "space-between", h.style.alignItems = "flex-start";
        const g = document.createElement("div");
        g.style.fontWeight = "500", g.textContent = c.name;
        const m = document.createElement("div");
        if (m.style.display = "flex", m.style.gap = "5px", c.isAsync) {
          const p = document.createElement("span");
          p.style.fontSize = "10px", p.style.padding = "2px 5px", p.style.borderRadius = "4px", p.style.backgroundColor = "rgba(16, 185, 129, 0.1)", p.style.color = "#10b981", p.textContent = "async", m.appendChild(p);
        }
        if (c.isDeferred) {
          const p = document.createElement("span");
          p.style.fontSize = "10px", p.style.padding = "2px 5px", p.style.borderRadius = "4px", p.style.backgroundColor = "rgba(59, 130, 246, 0.1)", p.style.color = "#3b82f6", p.textContent = "defer", m.appendChild(p);
        }
        if (h.appendChild(g), h.appendChild(m), c.path) {
          const p = document.createElement("div");
          p.style.fontSize = "11px", p.style.color = "#6b7280", p.style.marginTop = "5px", p.style.fontFamily = "'Fira Code', monospace", p.style.wordBreak = "break-all", p.textContent = c.path, l.appendChild(h), l.appendChild(p);
        } else
          l.appendChild(h);
        n.appendChild(l);
      }), r.appendChild(n);
    }), e.appendChild(r);
  }
  renderLogsTab(e, s) {
    if (this.logs.length === 0) {
      s.style.display = "flex";
      return;
    }
    s.style.display = "none", Array.from(e.children).forEach((t) => {
      t.classList.contains("grim-inspector-empty-state") || t.remove();
    });
    const o = document.createElement("div");
    o.classList.add("grim-inspector-toolbar"), o.style.display = "flex", o.style.justifyContent = "flex-end", o.style.marginBottom = "10px";
    const r = document.createElement("button");
    r.classList.add("grim-inspector-btn", "grim-inspector-btn-ghost"), r.textContent = "Clear Logs", r.addEventListener("click", () => {
      this.logs = [], this.refreshTabContent("logs");
    }), o.appendChild(r), e.appendChild(o);
    const i = document.createElement("div");
    i.classList.add("grim-inspector-logs-container"), this.logs.slice().reverse().forEach((t) => {
      const n = document.createElement("div");
      n.classList.add("grim-inspector-entry"), t.type === "warn" ? n.classList.add("grim-inspector-entry-warning") : t.type === "info" && n.classList.add("grim-inspector-entry-info");
      const a = document.createElement("div");
      a.style.display = "flex", a.style.justifyContent = "space-between", a.style.alignItems = "center", a.style.marginBottom = "5px";
      const d = document.createElement("span");
      switch (d.style.fontWeight = "bold", d.style.textTransform = "uppercase", d.style.fontSize = "10px", t.type) {
        case "log":
          d.textContent = "Log", d.style.color = "#6b7280";
          break;
        case "warn":
          d.textContent = "Warning", d.style.color = "var(--warning-color)";
          break;
        case "info":
          d.textContent = "Info", d.style.color = "var(--info-color)";
          break;
      }
      const c = document.createElement("span");
      c.style.fontSize = "10px", c.style.color = "#6b7280";
      const l = new Date(t.timestamp);
      c.textContent = l.toLocaleTimeString(), a.appendChild(d), a.appendChild(c);
      const h = document.createElement("div");
      h.textContent = t.message;
      const g = document.createElement("div");
      g.style.marginTop = "5px", g.style.display = "flex", g.style.justifyContent = "flex-end";
      const m = document.createElement("button");
      m.classList.add("grim-inspector-btn", "grim-inspector-btn-ghost"), m.textContent = "Copy", m.style.fontSize = "10px", m.style.padding = "4px 8px", m.addEventListener("click", () => {
        navigator.clipboard.writeText(t.message).then(() => {
          const p = m.textContent;
          m.textContent = "Copied!", setTimeout(() => {
            m.textContent = p;
          }, 1e3);
        });
      }), g.appendChild(m), n.appendChild(a), n.appendChild(h), n.appendChild(g), i.appendChild(n);
    }), e.appendChild(i);
  }
  renderErrorsTab(e, s) {
    if (this.errors.length === 0) {
      s.style.display = "flex";
      return;
    }
    s.style.display = "none", Array.from(e.children).forEach((t) => {
      t.classList.contains("grim-inspector-empty-state") || t.remove();
    });
    const o = document.createElement("div");
    o.classList.add("grim-inspector-toolbar"), o.style.display = "flex", o.style.justifyContent = "flex-end", o.style.marginBottom = "10px";
    const r = document.createElement("button");
    r.classList.add("grim-inspector-btn", "grim-inspector-btn-ghost"), r.textContent = "Clear All", r.addEventListener("click", () => {
      this.errors = [], this.refreshTabContent("errors");
    }), o.appendChild(r), e.appendChild(o);
    const i = document.createElement("div");
    i.classList.add("grim-inspector-errors-container"), this.errors.slice().reverse().forEach((t) => {
      const n = document.createElement("div");
      n.classList.add("grim-inspector-entry", "grim-inspector-entry-error");
      const a = document.createElement("div");
      a.style.display = "flex", a.style.justifyContent = "space-between", a.style.alignItems = "center", a.style.marginBottom = "5px";
      const d = document.createElement("span");
      d.style.fontWeight = "bold", d.textContent = "Error", d.style.color = "var(--error-color)";
      const c = document.createElement("span");
      c.style.fontSize = "10px", c.style.color = "#6b7280";
      const l = new Date(t.timestamp);
      c.textContent = l.toLocaleTimeString(), a.appendChild(d), a.appendChild(c);
      const h = document.createElement("div");
      if (h.textContent = t.message, h.style.marginBottom = "8px", t.stack) {
        const p = document.createElement("pre");
        p.classList.add("grim-inspector-code"), p.textContent = t.stack;
        const f = document.createElement("div");
        f.style.fontSize = "11px", f.style.fontWeight = "500", f.style.marginTop = "8px", f.style.color = "#4b5563", f.textContent = "Stack Trace:", h.appendChild(f), h.appendChild(p);
      }
      const g = document.createElement("div");
      g.style.marginTop = "8px", g.style.display = "flex", g.style.justifyContent = "flex-end";
      const m = document.createElement("button");
      m.classList.add("grim-inspector-btn", "grim-inspector-btn-ghost"), m.textContent = "Copy", m.addEventListener("click", () => {
        const p = t.stack ? `${t.message}

${t.stack}` : t.message;
        navigator.clipboard.writeText(p).then(() => {
          const f = m.textContent;
          m.textContent = "Copied!", setTimeout(() => {
            m.textContent = f;
          }, 1e3);
        });
      }), g.appendChild(m), n.appendChild(a), n.appendChild(h), n.appendChild(g), i.appendChild(n);
    }), e.appendChild(i);
  }
  renderEventsTab(e, s) {
    if (this.events.length === 0) {
      s.style.display = "flex";
      return;
    }
    s.style.display = "none", Array.from(e.children).forEach((n) => {
      n.classList.contains("grim-inspector-empty-state") || n.remove();
    });
    const o = document.createElement("div");
    o.classList.add("grim-inspector-toolbar"), o.style.display = "flex", o.style.justifyContent = "flex-end", o.style.marginBottom = "10px";
    const r = document.createElement("button");
    r.classList.add("grim-inspector-btn", "grim-inspector-btn-ghost"), r.textContent = "Clear Events", r.addEventListener("click", () => {
      this.events = [], this.refreshTabContent("events");
    }), o.appendChild(r), e.appendChild(o);
    const i = document.createElement("div");
    if (i.classList.add("grim-inspector-events-container"), this.events.slice(-25).reverse().forEach((n) => {
      const a = document.createElement("div");
      a.classList.add("grim-inspector-entry");
      const d = document.createElement("div");
      d.style.display = "flex", d.style.justifyContent = "space-between", d.style.alignItems = "center", d.style.marginBottom = "5px";
      const c = document.createElement("span");
      c.style.fontWeight = "600", c.textContent = n.type, c.style.color = "var(--primary-color)";
      const l = document.createElement("span");
      l.style.fontSize = "10px", l.style.color = "#6b7280";
      const h = new Date(n.timestamp);
      l.textContent = h.toLocaleTimeString(), d.appendChild(c), d.appendChild(l);
      const g = document.createElement("div");
      g.style.fontSize = "12px", g.style.marginBottom = "5px";
      const m = document.createElement("span");
      m.style.fontWeight = "500", m.style.color = "#4b5563", m.textContent = "Target: ";
      const p = document.createElement("span");
      p.style.fontFamily = "'Fira Code', monospace", p.style.color = "#111827", p.textContent = n.target, g.appendChild(m), g.appendChild(p);
      const f = document.createElement("div");
      if (f.appendChild(g), n.details && Object.keys(n.details).length > 0) {
        const y = document.createElement("div");
        if (y.style.fontSize = "12px", Object.entries(n.details).slice(0, 5).forEach(([x, v]) => {
          if (v != null) {
            const w = document.createElement("div");
            w.style.display = "flex", w.style.marginBottom = "2px";
            const T = document.createElement("span");
            T.style.fontWeight = "500", T.style.color = "#4b5563", T.style.minWidth = "80px", T.textContent = `${x}: `;
            const E = document.createElement("span");
            if (E.style.fontFamily = "'Fira Code', monospace", E.style.color = "#111827", E.style.whiteSpace = "pre-wrap", typeof v == "object")
              try {
                E.textContent = v instanceof Node ? "DOM Node" : Array.isArray(v) ? `Array(${v.length})` : "{...}";
              } catch {
                E.textContent = "Object";
              }
            else
              E.textContent = String(v);
            w.appendChild(T), w.appendChild(E), y.appendChild(w);
          }
        }), Object.keys(n.details).length > 5) {
          const x = document.createElement("div");
          x.style.fontSize = "11px", x.style.fontStyle = "italic", x.style.color = "#6b7280", x.textContent = `...and ${Object.keys(n.details).length - 5} more properties`, y.appendChild(x);
        }
        f.appendChild(y);
      }
      a.appendChild(d), a.appendChild(f), i.appendChild(a);
    }), this.events.length > 25) {
      const n = document.createElement("div");
      n.style.textAlign = "center", n.style.padding = "10px", n.style.fontSize = "12px", n.style.color = "#6b7280", n.textContent = `Showing most recent 25 of ${this.events.length} events`, i.appendChild(n);
    }
    e.appendChild(i);
  }
  renderNetworkTab(e, s) {
    if (this.network.length === 0) {
      s.style.display = "flex";
      return;
    }
    s.style.display = "none", Array.from(e.children).forEach((t) => {
      t.classList.contains("grim-inspector-empty-state") || t.remove();
    });
    const o = document.createElement("div");
    o.classList.add("grim-inspector-toolbar"), o.style.display = "flex", o.style.justifyContent = "flex-end", o.style.marginBottom = "10px";
    const r = document.createElement("button");
    r.classList.add("grim-inspector-btn", "grim-inspector-btn-ghost"), r.textContent = "Clear Network", r.addEventListener("click", () => {
      this.network = [], this.refreshTabContent("network");
    }), o.appendChild(r), e.appendChild(o);
    const i = document.createElement("div");
    i.classList.add("grim-inspector-network-container"), this.network.slice().reverse().forEach((t) => {
      const n = document.createElement("div");
      n.classList.add("grim-inspector-entry"), t.status ? t.status >= 400 ? n.classList.add("grim-inspector-entry-error") : t.status >= 300 ? n.classList.add("grim-inspector-entry-warning") : t.status >= 200 && (n.style.borderLeftColor = "var(--success-color)") : t.status === 0 && n.classList.add("grim-inspector-entry-error");
      const a = document.createElement("div");
      a.style.display = "flex", a.style.justifyContent = "space-between", a.style.alignItems = "center", a.style.marginBottom = "5px";
      const d = document.createElement("div");
      d.style.display = "flex", d.style.alignItems = "center";
      const c = document.createElement("span");
      switch (c.style.fontWeight = "bold", c.style.marginRight = "8px", c.style.textTransform = "uppercase", c.textContent = t.method, t.method.toUpperCase()) {
        case "GET":
          c.style.color = "#3b82f6";
          break;
        case "POST":
          c.style.color = "#10b981";
          break;
        case "PUT":
          c.style.color = "#f59e0b";
          break;
        case "DELETE":
          c.style.color = "#ef4444";
          break;
        default:
          c.style.color = "#6b7280";
      }
      const l = document.createElement("span");
      l.style.marginRight = "8px", l.style.borderRadius = "4px", l.style.padding = "2px 6px", l.style.fontSize = "10px", l.style.fontWeight = "600", t.status ? (l.textContent = String(t.status), t.status >= 400 ? (l.style.backgroundColor = "rgba(239, 68, 68, 0.1)", l.style.color = "#ef4444") : t.status >= 300 ? (l.style.backgroundColor = "rgba(245, 158, 11, 0.1)", l.style.color = "#f59e0b") : t.status >= 200 ? (l.style.backgroundColor = "rgba(16, 185, 129, 0.1)", l.style.color = "#10b981") : (l.style.backgroundColor = "rgba(107, 114, 128, 0.1)", l.style.color = "#6b7280")) : t.status === 0 ? (l.textContent = "ERROR", l.style.backgroundColor = "rgba(239, 68, 68, 0.1)", l.style.color = "#ef4444") : (l.textContent = "PENDING", l.style.backgroundColor = "rgba(107, 114, 128, 0.1)", l.style.color = "#6b7280"), d.appendChild(c), d.appendChild(l);
      const h = document.createElement("span");
      h.style.fontSize = "10px", h.style.color = "#6b7280";
      const g = new Date(t.timestamp);
      h.textContent = g.toLocaleTimeString(), a.appendChild(d), a.appendChild(h);
      const m = document.createElement("div");
      m.style.marginBottom = "5px", m.style.wordBreak = "break-all", m.style.fontFamily = "'Fira Code', monospace", m.style.fontSize = "12px", m.textContent = t.url;
      const p = document.createElement("div");
      if (p.style.fontSize = "12px", p.style.display = "flex", p.style.flexWrap = "wrap", p.style.gap = "8px", t.duration !== void 0) {
        const f = document.createElement("div"), y = document.createElement("span");
        y.style.fontWeight = "500", y.style.color = "#4b5563", y.style.marginRight = "4px", y.textContent = "Duration:";
        const C = document.createElement("span");
        C.style.fontFamily = "'Fira Code', monospace", C.textContent = `${Math.round(t.duration)}ms`, f.appendChild(y), f.appendChild(C), p.appendChild(f);
      }
      if (t.contentType) {
        const f = document.createElement("div"), y = document.createElement("span");
        y.style.fontWeight = "500", y.style.color = "#4b5563", y.style.marginRight = "4px", y.textContent = "Content-Type:";
        const C = document.createElement("span");
        C.style.fontFamily = "'Fira Code', monospace", C.textContent = t.contentType, f.appendChild(y), f.appendChild(C), p.appendChild(f);
      }
      n.appendChild(a), n.appendChild(m), n.appendChild(p), i.appendChild(n);
    }), e.appendChild(i);
  }
  renderMetricsTab(e, s) {
    s.style.display = "none", Array.from(e.children).forEach((c) => {
      c.classList.contains("grim-inspector-empty-state") || c.remove();
    });
    const o = document.createElement("div");
    o.classList.add("grim-inspector-metrics-container");
    const r = document.createElement("div");
    r.classList.add("grim-inspector-metrics-overview"), r.style.padding = "15px", r.style.marginBottom = "20px", r.style.borderRadius = "8px", r.style.backgroundColor = "#f9fafb", r.style.border = "1px solid #e5e7eb";
    const i = document.createElement("h3");
    i.textContent = "Performance Overview", i.style.fontSize = "16px", i.style.fontWeight = "600", i.style.marginBottom = "15px", i.style.color = "#111827", r.appendChild(i);
    const t = document.createElement("div");
    t.style.display = "grid", t.style.gridTemplateColumns = "repeat(2, 1fr)", t.style.gap = "15px", [
      { label: "Total Load Time", value: this.metrics.totalLoadTime, unit: "ms" },
      { label: "DOM Content Loaded", value: this.metrics.domContentLoadTime, unit: "ms" },
      { label: "DOM Interactive", value: this.metrics.domInteractiveTime, unit: "ms" },
      { label: "First Paint", value: this.metrics.firstPaint, unit: "ms" },
      { label: "First Contentful Paint", value: this.metrics.firstContentfulPaint, unit: "ms" },
      { label: "Network Latency", value: this.metrics.networkLatency, unit: "ms" }
    ].forEach((c) => {
      const l = document.createElement("div");
      l.style.padding = "10px", l.style.borderRadius = "6px";
      const h = document.createElement("div");
      h.style.fontSize = "12px", h.style.fontWeight = "500", h.style.color = "#6b7280", h.style.marginBottom = "5px", h.textContent = c.label;
      const g = document.createElement("div");
      g.style.fontSize = "20px", g.style.fontWeight = "600", g.style.color = "#111827", c.value !== void 0 ? (g.textContent = `${Math.round(c.value)}${c.unit}`, (c.label.includes("Paint") || c.label.includes("Load")) && (c.value < 1e3 ? g.style.color = "#10b981" : c.value < 3e3 ? g.style.color = "#f59e0b" : g.style.color = "#ef4444")) : (g.textContent = "N/A", g.style.color = "#9ca3af"), l.appendChild(h), l.appendChild(g), t.appendChild(l);
    }), r.appendChild(t), o.appendChild(r);
    const a = document.createElement("div");
    a.classList.add("grim-inspector-metrics-timeline"), a.style.padding = "15px", a.style.borderRadius = "8px", a.style.backgroundColor = "#f9fafb", a.style.border = "1px solid #e5e7eb";
    const d = document.createElement("h3");
    if (d.textContent = "Performance Timeline", d.style.fontSize = "16px", d.style.fontWeight = "600", d.style.marginBottom = "15px", d.style.color = "#111827", a.appendChild(d), this.metrics.totalLoadTime && this.metrics.dnsLookupTime && this.metrics.connectionTime && this.metrics.requestResponseTime && this.metrics.domProcessingTime) {
      const c = this.metrics.totalLoadTime, l = document.createElement("div");
      l.style.position = "relative", l.style.height = "50px", l.style.marginBottom = "20px", l.style.backgroundColor = "#e5e7eb", l.style.borderRadius = "4px", l.style.overflow = "hidden";
      const h = this.metrics.dnsLookupTime / c * 100, g = this.metrics.connectionTime / c * 100, m = this.metrics.requestResponseTime / c * 100, p = this.metrics.domProcessingTime / c * 100, f = (this.metrics.loadEventTime || 0) / c * 100, y = 2, C = Math.max(h, y), x = Math.max(g, y), v = Math.max(m, y), w = Math.max(p, y), T = Math.max(f, y), E = this.createTimelineSegment(
        "DNS Lookup",
        `${Math.round(this.metrics.dnsLookupTime)}ms`,
        C,
        "#3b82f6"
      ), I = this.createTimelineSegment(
        "Connection",
        `${Math.round(this.metrics.connectionTime)}ms`,
        x,
        "#8b5cf6"
      ), O = this.createTimelineSegment(
        "Request/Response",
        `${Math.round(this.metrics.requestResponseTime)}ms`,
        v,
        "#ec4899"
      ), j = this.createTimelineSegment(
        "DOM Processing",
        `${Math.round(this.metrics.domProcessingTime)}ms`,
        w,
        "#f59e0b"
      ), B = this.createTimelineSegment(
        "Load Event",
        `${Math.round(this.metrics.loadEventTime || 0)}ms`,
        T,
        "#10b981"
      );
      l.appendChild(E), l.appendChild(I), l.appendChild(O), l.appendChild(j), l.appendChild(B), a.appendChild(l);
      const L = document.createElement("div");
      L.style.display = "flex", L.style.flexWrap = "wrap", L.style.gap = "10px", L.style.fontSize = "12px", [
        { color: "#3b82f6", label: "DNS Lookup" },
        { color: "#8b5cf6", label: "Connection" },
        { color: "#ec4899", label: "Request/Response" },
        { color: "#f59e0b", label: "DOM Processing" },
        { color: "#10b981", label: "Load Event" }
      ].forEach((M) => {
        const S = document.createElement("div");
        S.style.display = "flex", S.style.alignItems = "center";
        const k = document.createElement("div");
        k.style.width = "12px", k.style.height = "12px", k.style.backgroundColor = M.color, k.style.marginRight = "5px", k.style.borderRadius = "2px";
        const D = document.createElement("span");
        D.textContent = M.label, S.appendChild(k), S.appendChild(D), L.appendChild(S);
      }), a.appendChild(L);
    } else {
      const c = document.createElement("div");
      c.style.padding = "20px", c.style.textAlign = "center", c.style.color = "#6b7280", c.textContent = "Performance metrics not available yet. Refresh the page to collect metrics.", a.appendChild(c);
    }
    o.appendChild(a), e.appendChild(o);
  }
  createTimelineSegment(e, s, o, r) {
    const i = document.createElement("div");
    return i.style.position = "absolute", i.style.height = "100%", i.style.width = `${o}%`, i.style.backgroundColor = r, i.style.left = `${// Calculate left position based on previous segments
    document.querySelectorAll(".timeline-segment").length > 0 ? Array.from(document.querySelectorAll(".timeline-segment")).map((t) => parseFloat(t.style.width)).reduce((t, n) => t + n, 0) : 0}%`, i.classList.add("timeline-segment"), i.title = `${e}: ${s}`, i;
  }
  togglePanel() {
    this.isOpen = !this.isOpen, this.isOpen ? (this.panel.classList.remove("hidden"), this.toggle.classList.add("active"), this.refreshTabContent(this.activeTab)) : (this.panel.classList.add("hidden"), this.toggle.classList.remove("active"));
  }
  initPerformanceMetrics() {
    window.addEventListener("load", () => {
      setTimeout(() => {
        this.collectPerformanceMetrics();
      }, 0);
    });
  }
  collectPerformanceMetrics() {
    if (!window.performance || !window.performance.timing)
      return;
    const e = window.performance.timing;
    this.metrics = {
      // Overall timing metrics
      totalLoadTime: e.loadEventEnd - e.navigationStart,
      domContentLoadTime: e.domContentLoadedEventEnd - e.navigationStart,
      domInteractiveTime: e.domInteractive - e.navigationStart,
      // Detailed timing metrics
      dnsLookupTime: e.domainLookupEnd - e.domainLookupStart,
      connectionTime: e.connectEnd - e.connectStart,
      requestResponseTime: e.responseEnd - e.requestStart,
      domProcessingTime: e.domComplete - e.domLoading,
      loadEventTime: e.loadEventEnd - e.loadEventStart
    }, this.metrics.networkLatency = e.responseStart - e.requestStart, window.performance && "getEntriesByType" in window.performance && window.performance.getEntriesByType("paint").forEach((o) => {
      o.name === "first-paint" && (this.metrics.firstPaint = o.startTime), o.name === "first-contentful-paint" && (this.metrics.firstContentfulPaint = o.startTime);
    }), this.isOpen && this.activeTab === "metrics" && this.refreshTabContent("metrics");
  }
  initConsoleMonitoring() {
    const e = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info
    };
    console.log = (...s) => {
      this.addLogEntry("log", s), e.log(...s);
    }, console.error = (...s) => {
      this.addLogEntry("error", s), e.error(...s);
    }, console.warn = (...s) => {
      this.addLogEntry("warn", s), e.warn(...s);
    }, console.info = (...s) => {
      this.addLogEntry("info", s), e.info(...s);
    }, window.addEventListener("error", (s) => {
      this.addErrorEntry(s);
    }), window.addEventListener("unhandledrejection", (s) => {
      this.addErrorEntry(s);
    });
  }
  addLogEntry(e, s) {
    const o = s.map((t) => {
      if (typeof t == "object")
        try {
          return JSON.stringify(t, null, 2);
        } catch {
          return String(t);
        }
      return String(t);
    }).join(" "), r = (/* @__PURE__ */ new Date()).toISOString(), i = {
      type: e,
      message: o,
      timestamp: r
    };
    e === "error" ? (this.errors.push(i), this.errors.length > 100 && this.errors.shift()) : (this.logs.push(i), this.logs.length > 100 && this.logs.shift()), this.isOpen && (e === "error" && this.activeTab === "errors" ? this.refreshTabContent("errors") : e !== "error" && this.activeTab === "logs" && this.refreshTabContent("logs"));
  }
  addErrorEntry(e) {
    var t;
    const s = (/* @__PURE__ */ new Date()).toISOString();
    let o = "", r = "";
    if (e instanceof ErrorEvent)
      o = e.message, r = ((t = e.error) == null ? void 0 : t.stack) || "";
    else {
      const n = e.reason;
      o = n instanceof Error ? n.message : String(n), r = n instanceof Error && n.stack || "";
    }
    const i = {
      type: "error",
      message: o,
      timestamp: s,
      stack: r
    };
    this.errors.push(i), this.errors.length > 100 && this.errors.shift(), this.isOpen && this.activeTab === "errors" && this.refreshTabContent("errors");
  }
  initEventMonitoring() {
    const e = [
      "click",
      "submit",
      "change",
      "focus",
      "blur",
      "load",
      "unload",
      "visibilitychange"
    ], o = ((t, n) => {
      let a = !1;
      return function(...d) {
        a || (t.apply(this, d), a = !0, setTimeout(() => {
          a = !1;
        }, n));
      };
    })((t) => {
      const n = t.target;
      let a = "unknown";
      try {
        n instanceof HTMLElement || n instanceof SVGElement || n instanceof Element ? a = this.getElementInfo(n) : n instanceof Node ? a = n.nodeName || "unknown-node" : n && (a = String(n));
      } catch (c) {
        a = "error-getting-target-info", console.warn("Error getting target info:", c);
      }
      const d = {
        type: t.type,
        target: a,
        details: this.getEventDetails(t),
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.events.push(d), this.events.length > 100 && this.events.shift(), this.isOpen && this.activeTab === "events" && this.refreshTabContent("events");
    }, 200);
    e.forEach((t) => {
      document.addEventListener(t, o, {
        capture: !0,
        // Capture events during the capture phase
        passive: !0
        // Don't interfere with normal behavior
      });
    });
    const r = this;
    setTimeout(() => {
      EventTarget.prototype.addEventListener = i;
    }, 3e4);
    const i = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(t, n, a) {
      const d = ["click", "submit", "change", "load"];
      if ((this instanceof HTMLElement || this instanceof Document || this instanceof Window) && d.includes(t)) {
        const c = this instanceof HTMLElement ? this : this, l = this instanceof HTMLElement ? r.getElementInfo(c) : String(this), h = {
          type: `Added ${t} listener`,
          target: l,
          details: {
            eventType: t,
            passive: a && typeof a == "object" ? a.passive : !1,
            capture: a && typeof a == "object" ? a.capture : !!a
          },
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        r.events.push(h), r.events.length > 100 && r.events.shift(), r.isOpen && r.activeTab === "events" && r.refreshTabContent("events");
      }
      return i.call(this, t, n, a);
    };
  }
  getElementInfo(e) {
    if (!e) return "unknown";
    try {
      let s = "";
      if (e.tagName)
        s = e.tagName.toLowerCase();
      else
        return "unknown-element";
      if ("id" in e && e.id && (s += `#${e.id}`), "className" in e && e.className !== null && e.className !== void 0) {
        const o = e.className;
        if (typeof o == "string")
          s += `.${o.split(" ").join(".")}`;
        else if (typeof o == "object" && o) {
          const r = o;
          "baseVal" in r && r.baseVal && (s += `.${r.baseVal.split(" ").join(".")}`);
        }
      }
      return s;
    } catch (s) {
      return console.warn("Error getting element info:", s), "error-getting-element-info";
    }
  }
  getEventDetails(e) {
    const s = {};
    return e instanceof MouseEvent && (s.position = {
      x: e.clientX,
      y: e.clientY
    }, e.type === "click" && (s.button = e.button, (e.altKey || e.ctrlKey || e.shiftKey) && (s.modifiers = {
      alt: e.altKey,
      ctrl: e.ctrlKey,
      shift: e.shiftKey
    }))), e.type === "submit" && e.target instanceof HTMLFormElement && (s.action = e.target.action, s.method = e.target.method), (e.type === "change" || e.type === "input") && e.target instanceof HTMLInputElement && (s.inputType = e.target.type, e.target.type === "password" ? s.valueType = "password" : e.target.type === "file" ? s.valueType = "file" : e.target.value && (s.hasValue = !0)), s;
  }
  initNetworkMonitoring() {
    this.monitorFetch(), this.monitorXHR();
  }
  monitorFetch() {
    const e = window.fetch;
    window.fetch = async (s, o) => {
      const r = performance.now(), i = (o == null ? void 0 : o.method) || "GET", t = typeof s == "string" ? s : s instanceof URL ? s.toString() : s.url, n = {
        method: i,
        url: t,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      try {
        const a = await e(s, o), d = performance.now();
        return n.status = a.status, n.contentType = a.headers.get("content-type") || void 0, n.duration = d - r, this.network.push(n), this.network.length > 100 && this.network.shift(), this.isOpen && this.activeTab === "network" && this.refreshTabContent("network"), a;
      } catch (a) {
        const d = performance.now();
        throw n.status = 0, n.duration = d - r, this.network.push(n), this.network.length > 100 && this.network.shift(), this.isOpen && this.activeTab === "network" && this.refreshTabContent("network"), a;
      }
    };
  }
  monitorXHR() {
    const e = XMLHttpRequest.prototype.open, s = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(r, i, t = !0, n, a) {
      return this._grimInspectorData = {
        method: r,
        url: i.toString(),
        startTime: 0
      }, e.call(this, r, i, t, n, a);
    }, XMLHttpRequest.prototype.send = function(r) {
      if (this._grimInspectorData) {
        this._grimInspectorData.startTime = performance.now();
        const i = {
          method: this._grimInspectorData.method,
          url: this._grimInspectorData.url,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        this.addEventListener("load", function() {
          const t = performance.now();
          i.status = this.status, i.contentType = this.getResponseHeader("content-type") || void 0, this._grimInspectorData && this._grimInspectorData.startTime && (i.duration = t - this._grimInspectorData.startTime), o.network.push(i), o.network.length > 100 && o.network.shift(), o.isOpen && o.activeTab === "network" && o.refreshTabContent("network");
        }), this.addEventListener("error", function() {
          const t = performance.now();
          i.status = 0, this._grimInspectorData && this._grimInspectorData.startTime && (i.duration = t - this._grimInspectorData.startTime), o.network.push(i), o.network.length > 100 && o.network.shift(), o.isOpen && o.activeTab === "network" && o.refreshTabContent("network");
        });
      }
      return s.call(this, r);
    };
    const o = this;
  }
  initComponentDetection() {
    this.detectShopifySections(), this.detectJSComponents(), this.observeComponentChanges();
  }
  detectShopifySections() {
    document.querySelectorAll("[data-section-type], [data-section-id]").forEach((s) => {
      const o = s.getAttribute("data-section-type") || "unknown", r = s.getAttribute("data-section-id") || "", i = {
        name: `Section: ${o}`,
        type: "shopify-section",
        path: r
      };
      this.components.push(i);
    }), this.isOpen && this.activeTab === "components" && this.refreshTabContent("components");
  }
  detectJSComponents() {
    document.querySelectorAll("script").forEach((s) => {
      if (s.src) {
        const o = s.src.split("/"), r = o[o.length - 1];
        let i = "script", t = r;
        r.includes("jquery") ? (i = "library", t = "jQuery") : r.includes("swiper") ? (i = "library", t = "Swiper") : r.includes("slick") ? (i = "library", t = "Slick Slider") : r.includes("shopify") && (i = "shopify");
        const n = {
          name: t,
          type: i,
          path: s.src,
          isAsync: s.async,
          isDeferred: s.defer
        };
        this.components.push(n);
      }
    }), this.isOpen && this.activeTab === "components" && this.refreshTabContent("components");
  }
  observeComponentChanges() {
    new MutationObserver((s) => {
      let o = !1;
      s.forEach((r) => {
        r.type === "childList" && r.addedNodes.forEach((i) => {
          if (i instanceof HTMLElement) {
            if (i.hasAttribute("data-section-type") || i.hasAttribute("data-section-id")) {
              o = !0;
              const n = i.getAttribute("data-section-type") || "unknown", a = i.getAttribute("data-section-id") || "", d = {
                name: `Section: ${n}`,
                type: "shopify-section",
                path: a
              };
              this.components.push(d);
            }
            const t = i.querySelectorAll("script");
            t.length > 0 && (o = !0, t.forEach((n) => {
              if (n.src) {
                const a = n.src.split("/"), d = a[a.length - 1];
                let c = "script", l = d;
                d.includes("jquery") ? (c = "library", l = "jQuery") : d.includes("swiper") ? (c = "library", l = "Swiper") : d.includes("slick") ? (c = "library", l = "Slick Slider") : d.includes("shopify") && (c = "shopify");
                const h = {
                  name: l,
                  type: c,
                  path: n.src,
                  isAsync: n.async,
                  isDeferred: n.defer
                };
                this.components.push(h);
              }
            }));
          }
        });
      }), o && this.isOpen && this.activeTab === "components" && this.refreshTabContent("components");
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
}
typeof window < "u" && (document.readyState === "complete" || document.readyState === "interactive" ? new P() : document.addEventListener("DOMContentLoaded", () => new P()));
export {
  P as default
};

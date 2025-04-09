// Types
interface LogEntry {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: string;
  stack?: string;
}

interface EventEntry {
  type: string;
  target: string;
  details?: Record<string, any>;
  timestamp: string;
}

interface NetworkEntry {
  method: string;
  url: string;
  status?: number;
  contentType?: string;
  timestamp: string;
  duration?: number;
}

interface Component {
  name: string;
  type: string;
  isAsync?: boolean;
  isDeferred?: boolean;
  path?: string;
}

interface PerformanceMetrics {
  totalLoadTime?: number;
  domContentLoadTime?: number;
  domInteractiveTime?: number;
  networkLatency?: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
  dnsLookupTime?: number;
  connectionTime?: number;
  requestResponseTime?: number;
  domProcessingTime?: number;
  loadEventTime?: number;
}

// Extend XMLHttpRequest type to include our custom data
declare global {
  interface XMLHttpRequest {
    _grimInspectorData?: {
      method: string;
      url: string;
      startTime: number;
    };
  }
  
  interface Performance {
    getEntriesByType(type: string): {
      name: string;
      startTime: number;
    }[];
  }
}

// Create isolated styles to avoid affecting the host page
const createStyles = (): HTMLStyleElement => {
  const style = document.createElement('style');
  style.textContent = `
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
  `;
  return style;
};

class GrimInspector {
  private container: HTMLDivElement;
  private toggle: HTMLButtonElement;
  private panel: HTMLDivElement;
  private isOpen = false;
  private activeTab = 'components';
  
  // Data stores
  private components: Component[] = [];
  private logs: LogEntry[] = [];
  private errors: LogEntry[] = [];
  private events: EventEntry[] = [];
  private network: NetworkEntry[] = [];
  private metrics: PerformanceMetrics = {};

  constructor() {
    // Create container for our widget
    this.container = document.createElement('div');
    this.container.classList.add('grim-inspector-widget');
    
    // Create the toggle button
    this.toggle = document.createElement('button');
    this.toggle.classList.add('grim-inspector-toggle', 'pulse');
    this.toggle.setAttribute('aria-label', 'Open Shopify Inspector');
    
    // Create the panel
    this.panel = document.createElement('div');
    this.panel.classList.add('grim-inspector-panel', 'hidden');
    
    // Build panel content
    this.buildPanelContent();
    
    // Assemble the widget
    this.container.appendChild(this.toggle);
    this.container.appendChild(this.panel);
    
    // Add event listener
    this.toggle.addEventListener('click', this.togglePanel.bind(this));
    
    // Add to DOM
    document.body.appendChild(createStyles());
    document.body.appendChild(this.container);

    // Initialize collectors
    this.initPerformanceMetrics();
    this.initConsoleMonitoring();
    this.initEventMonitoring();
    this.initNetworkMonitoring();
    this.initComponentDetection();

    // Stop pulsing after 5 seconds
    setTimeout(() => {
      this.toggle.classList.remove('pulse');
    }, 5000);
  }
  
  private buildPanelContent(): void {
    // Create header
    const header = document.createElement('div');
    header.classList.add('grim-inspector-header');
    
    const title = document.createElement('h2');
    title.classList.add('grim-inspector-title');
    title.textContent = 'Shopify Inspector';
    
    header.appendChild(title);
    
    // Create tabs
    const tabs = document.createElement('div');
    tabs.classList.add('grim-inspector-tabs');
    
    const tabNames = ['Components', 'Logs', 'Errors', 'Events', 'Network', 'Metrics'];
    
    tabNames.forEach(tabName => {
      const tab = document.createElement('button');
      tab.classList.add('grim-inspector-tab');
      tab.textContent = tabName;
      tab.dataset.tab = tabName.toLowerCase();
      
      if (tabName.toLowerCase() === this.activeTab) {
        tab.classList.add('active');
      }
      
      tab.addEventListener('click', () => this.switchTab(tabName.toLowerCase()));
      
      tabs.appendChild(tab);
    });
    
    // Create tab contents
    const tabContents = document.createElement('div');
    tabContents.classList.add('grim-inspector-tab-contents');
    
    tabNames.forEach(tabName => {
      const content = document.createElement('div');
      content.classList.add('grim-inspector-tab-content');
      content.dataset.content = tabName.toLowerCase();
      
      if (tabName.toLowerCase() === this.activeTab) {
        content.classList.add('active');
      }
      
      // Add empty state initially
      const emptyState = document.createElement('div');
      emptyState.classList.add('grim-inspector-empty-state');
      
      const emptyIcon = document.createElement('div');
      emptyIcon.classList.add('grim-inspector-empty-state-icon');
      emptyIcon.textContent = '📊';
      
      const emptyText = document.createElement('p');
      emptyText.textContent = `No ${tabName.toLowerCase()} data yet`;
      
      emptyState.appendChild(emptyIcon);
      emptyState.appendChild(emptyText);
      
      content.appendChild(emptyState);
      tabContents.appendChild(content);
    });
    
    // Assemble panel
    this.panel.appendChild(header);
    this.panel.appendChild(tabs);
    this.panel.appendChild(tabContents);
  }
  
  private switchTab(tabName: string): void {
    this.activeTab = tabName;
    
    // Update tab buttons
    const tabs = this.panel.querySelectorAll('.grim-inspector-tab');
    tabs.forEach(tab => {
      if ((tab as HTMLElement).dataset.tab === tabName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // Update tab contents
    const contents = this.panel.querySelectorAll('.grim-inspector-tab-content');
    contents.forEach(content => {
      if ((content as HTMLElement).dataset.content === tabName) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
    
    // Refresh content using a small delay for events tab to avoid blocking the UI
    if (tabName === 'events') {
      // Show a loading message first
      const contentElement = this.panel.querySelector(`.grim-inspector-tab-content[data-content="events"]`) as HTMLElement;
      if (contentElement) {
        // Clear content except empty state
        Array.from(contentElement.children).forEach(child => {
          if (!child.classList.contains('grim-inspector-empty-state')) {
            child.remove();
          }
        });
        
        // Add loading indicator
        const loading = document.createElement('div');
        loading.style.display = 'flex';
        loading.style.justifyContent = 'center';
        loading.style.alignItems = 'center';
        loading.style.height = '100%';
        loading.style.color = '#6b7280';
        loading.textContent = 'Loading events...';
        contentElement.appendChild(loading);
        
        // Refresh content after a short delay
        setTimeout(() => {
          this.refreshTabContent(tabName);
        }, 50);
      }
    } else {
      // Refresh other tabs immediately
      this.refreshTabContent(tabName);
    }
  }
  
  private refreshTabContent(tabName: string): void {
    const contentElement = this.panel.querySelector(`.grim-inspector-tab-content[data-content="${tabName}"]`);
    if (!contentElement) return;
    
    // Clear existing content except empty state
    const emptyState = contentElement.querySelector('.grim-inspector-empty-state');
    
    switch (tabName) {
      case 'components':
        this.renderComponentsTab(contentElement as HTMLElement, emptyState as HTMLElement);
        break;
      case 'logs':
        this.renderLogsTab(contentElement as HTMLElement, emptyState as HTMLElement);
        break;
      case 'errors':
        this.renderErrorsTab(contentElement as HTMLElement, emptyState as HTMLElement);
        break;
      case 'events':
        this.renderEventsTab(contentElement as HTMLElement, emptyState as HTMLElement);
        break;
      case 'network':
        this.renderNetworkTab(contentElement as HTMLElement, emptyState as HTMLElement);
        break;
      case 'metrics':
        this.renderMetricsTab(contentElement as HTMLElement, emptyState as HTMLElement);
        break;
    }
  }
  
  private renderComponentsTab(contentElement: HTMLElement, emptyState: HTMLElement): void {
    if (this.components.length === 0) {
      emptyState.style.display = 'flex';
      return;
    }
    
    emptyState.style.display = 'none';
    
    // Clear previous contents except empty state
    Array.from(contentElement.children).forEach(child => {
      if (!child.classList.contains('grim-inspector-empty-state')) {
        child.remove();
      }
    });
    
    // Group components by type
    const groupedComponents: Record<string, Component[]> = {};
    
    this.components.forEach(component => {
      if (!groupedComponents[component.type]) {
        groupedComponents[component.type] = [];
      }
      
      groupedComponents[component.type].push(component);
    });
    
    // Create components container
    const componentsContainer = document.createElement('div');
    componentsContainer.classList.add('grim-inspector-components-container');
    
    // Create sections for each component type
    Object.entries(groupedComponents).forEach(([type, components]) => {
      const section = document.createElement('div');
      section.classList.add('grim-inspector-component-section');
      section.style.marginBottom = '20px';
      
      const sectionTitle = document.createElement('h3');
      sectionTitle.style.fontSize = '14px';
      sectionTitle.style.fontWeight = '600';
      sectionTitle.style.marginBottom = '10px';
      sectionTitle.style.padding = '0 0 5px 0';
      sectionTitle.style.borderBottom = '1px solid #e5e7eb';
      
      // Format type for display
      let displayType = type.charAt(0).toUpperCase() + type.slice(1);
      if (type === 'shopify-section') {
        displayType = 'Shopify Sections';
      } else if (type === 'library') {
        displayType = 'Libraries';
      } else if (type === 'shopify') {
        displayType = 'Shopify Scripts';
      } else {
        displayType = `${displayType}s`;
      }
      
      sectionTitle.textContent = displayType;
      section.appendChild(sectionTitle);
      
      // Add components
      components.forEach(component => {
        const item = document.createElement('div');
        item.classList.add('grim-inspector-component-item');
        item.style.padding = '10px';
        item.style.borderRadius = '6px';
        item.style.marginBottom = '8px';
        item.style.background = '#f9fafb';
        
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'flex-start';
        
        const nameEl = document.createElement('div');
        nameEl.style.fontWeight = '500';
        nameEl.textContent = component.name;
        
        const badges = document.createElement('div');
        badges.style.display = 'flex';
        badges.style.gap = '5px';
        
        // Add async/defer badges if applicable
        if (component.isAsync) {
          const asyncBadge = document.createElement('span');
          asyncBadge.style.fontSize = '10px';
          asyncBadge.style.padding = '2px 5px';
          asyncBadge.style.borderRadius = '4px';
          asyncBadge.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
          asyncBadge.style.color = '#10b981';
          asyncBadge.textContent = 'async';
          
          badges.appendChild(asyncBadge);
        }
        
        if (component.isDeferred) {
          const deferBadge = document.createElement('span');
          deferBadge.style.fontSize = '10px';
          deferBadge.style.padding = '2px 5px';
          deferBadge.style.borderRadius = '4px';
          deferBadge.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
          deferBadge.style.color = '#3b82f6';
          deferBadge.textContent = 'defer';
          
          badges.appendChild(deferBadge);
        }
        
        header.appendChild(nameEl);
        header.appendChild(badges);
        
        // Add path information if available
        if (component.path) {
          const pathEl = document.createElement('div');
          pathEl.style.fontSize = '11px';
          pathEl.style.color = '#6b7280';
          pathEl.style.marginTop = '5px';
          pathEl.style.fontFamily = "'Fira Code', monospace";
          pathEl.style.wordBreak = 'break-all';
          pathEl.textContent = component.path;
          
          item.appendChild(header);
          item.appendChild(pathEl);
        } else {
          item.appendChild(header);
        }
        
        section.appendChild(item);
      });
      
      componentsContainer.appendChild(section);
    });
    
    contentElement.appendChild(componentsContainer);
  }
  
  private renderLogsTab(contentElement: HTMLElement, emptyState: HTMLElement): void {
    if (this.logs.length === 0) {
      emptyState.style.display = 'flex';
      return;
    }
    
    emptyState.style.display = 'none';
    
    // Clear previous contents except empty state
    Array.from(contentElement.children).forEach(child => {
      if (!child.classList.contains('grim-inspector-empty-state')) {
        child.remove();
      }
    });
    
    // Add toolbar
    const toolbar = document.createElement('div');
    toolbar.classList.add('grim-inspector-toolbar');
    toolbar.style.display = 'flex';
    toolbar.style.justifyContent = 'flex-end';
    toolbar.style.marginBottom = '10px';
    
    const clearButton = document.createElement('button');
    clearButton.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
    clearButton.textContent = 'Clear Logs';
    clearButton.addEventListener('click', () => {
      this.logs = [];
      this.refreshTabContent('logs');
    });
    
    toolbar.appendChild(clearButton);
    contentElement.appendChild(toolbar);
    
    // Create log entries container
    const logsContainer = document.createElement('div');
    logsContainer.classList.add('grim-inspector-logs-container');
    
    // Add each log entry
    this.logs.slice().reverse().forEach(log => {
      const entry = document.createElement('div');
      entry.classList.add('grim-inspector-entry');
      
      if (log.type === 'warn') {
        entry.classList.add('grim-inspector-entry-warning');
      } else if (log.type === 'info') {
        entry.classList.add('grim-inspector-entry-info');
      }
      
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      header.style.marginBottom = '5px';
      
      const typeSpan = document.createElement('span');
      typeSpan.style.fontWeight = 'bold';
      typeSpan.style.textTransform = 'uppercase';
      typeSpan.style.fontSize = '10px';
      
      switch (log.type) {
        case 'log':
          typeSpan.textContent = 'Log';
          typeSpan.style.color = '#6b7280';
          break;
        case 'warn':
          typeSpan.textContent = 'Warning';
          typeSpan.style.color = 'var(--warning-color)';
          break;
        case 'info':
          typeSpan.textContent = 'Info';
          typeSpan.style.color = 'var(--info-color)';
          break;
      }
      
      const timeSpan = document.createElement('span');
      timeSpan.style.fontSize = '10px';
      timeSpan.style.color = '#6b7280';
      const logTime = new Date(log.timestamp);
      timeSpan.textContent = logTime.toLocaleTimeString();
      
      header.appendChild(typeSpan);
      header.appendChild(timeSpan);
      
      const message = document.createElement('div');
      message.textContent = log.message;
      
      const actions = document.createElement('div');
      actions.style.marginTop = '5px';
      actions.style.display = 'flex';
      actions.style.justifyContent = 'flex-end';
      
      const copyBtn = document.createElement('button');
      copyBtn.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
      copyBtn.textContent = 'Copy';
      copyBtn.style.fontSize = '10px';
      copyBtn.style.padding = '4px 8px';
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(log.message)
          .then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
              copyBtn.textContent = originalText;
            }, 1000);
          });
      });
      
      actions.appendChild(copyBtn);
      
      entry.appendChild(header);
      entry.appendChild(message);
      entry.appendChild(actions);
      
      logsContainer.appendChild(entry);
    });
    
    contentElement.appendChild(logsContainer);
  }
  
  private renderErrorsTab(contentElement: HTMLElement, emptyState: HTMLElement): void {
    if (this.errors.length === 0) {
      emptyState.style.display = 'flex';
      return;
    }
    
    emptyState.style.display = 'none';
    
    // Clear previous contents except empty state
    Array.from(contentElement.children).forEach(child => {
      if (!child.classList.contains('grim-inspector-empty-state')) {
        child.remove();
      }
    });
    
    // Add toolbar
    const toolbar = document.createElement('div');
    toolbar.classList.add('grim-inspector-toolbar');
    toolbar.style.display = 'flex';
    toolbar.style.justifyContent = 'flex-end';
    toolbar.style.marginBottom = '10px';
    
    const clearButton = document.createElement('button');
    clearButton.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
    clearButton.textContent = 'Clear All';
    clearButton.addEventListener('click', () => {
      this.errors = [];
      this.refreshTabContent('errors');
    });
    
    toolbar.appendChild(clearButton);
    contentElement.appendChild(toolbar);
    
    // Create error entries container
    const errorsContainer = document.createElement('div');
    errorsContainer.classList.add('grim-inspector-errors-container');
    
    // Add each error entry
    this.errors.slice().reverse().forEach(error => {
      const entry = document.createElement('div');
      entry.classList.add('grim-inspector-entry', 'grim-inspector-entry-error');
      
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      header.style.marginBottom = '5px';
      
      const typeSpan = document.createElement('span');
      typeSpan.style.fontWeight = 'bold';
      typeSpan.textContent = 'Error';
      typeSpan.style.color = 'var(--error-color)';
      
      const timeSpan = document.createElement('span');
      timeSpan.style.fontSize = '10px';
      timeSpan.style.color = '#6b7280';
      const errorTime = new Date(error.timestamp);
      timeSpan.textContent = errorTime.toLocaleTimeString();
      
      header.appendChild(typeSpan);
      header.appendChild(timeSpan);
      
      const message = document.createElement('div');
      message.textContent = error.message;
      message.style.marginBottom = '8px';
      
      // Add stack trace if available
      if (error.stack) {
        const stackContainer = document.createElement('pre');
        stackContainer.classList.add('grim-inspector-code');
        stackContainer.textContent = error.stack;
        
        const stackHeader = document.createElement('div');
        stackHeader.style.fontSize = '11px';
        stackHeader.style.fontWeight = '500';
        stackHeader.style.marginTop = '8px';
        stackHeader.style.color = '#4b5563';
        stackHeader.textContent = 'Stack Trace:';
        
        message.appendChild(stackHeader);
        message.appendChild(stackContainer);
      }
      
      const actions = document.createElement('div');
      actions.style.marginTop = '8px';
      actions.style.display = 'flex';
      actions.style.justifyContent = 'flex-end';
      
      const copyBtn = document.createElement('button');
      copyBtn.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
      copyBtn.textContent = 'Copy';
      copyBtn.addEventListener('click', () => {
        const textToCopy = error.stack ? `${error.message}\n\n${error.stack}` : error.message;
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
              copyBtn.textContent = originalText;
            }, 1000);
          });
      });
      
      actions.appendChild(copyBtn);
      
      entry.appendChild(header);
      entry.appendChild(message);
      entry.appendChild(actions);
      
      errorsContainer.appendChild(entry);
    });
    
    contentElement.appendChild(errorsContainer);
  }
  
  private renderEventsTab(contentElement: HTMLElement, emptyState: HTMLElement): void {
    if (this.events.length === 0) {
      emptyState.style.display = 'flex';
      return;
    }
    
    emptyState.style.display = 'none';
    
    // Clear previous contents except empty state
    Array.from(contentElement.children).forEach(child => {
      if (!child.classList.contains('grim-inspector-empty-state')) {
        child.remove();
      }
    });
    
    // Add toolbar
    const toolbar = document.createElement('div');
    toolbar.classList.add('grim-inspector-toolbar');
    toolbar.style.display = 'flex';
    toolbar.style.justifyContent = 'flex-end';
    toolbar.style.marginBottom = '10px';
    
    const clearButton = document.createElement('button');
    clearButton.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
    clearButton.textContent = 'Clear Events';
    clearButton.addEventListener('click', () => {
      this.events = [];
      this.refreshTabContent('events');
    });
    
    toolbar.appendChild(clearButton);
    contentElement.appendChild(toolbar);
    
    // Create events container
    const eventsContainer = document.createElement('div');
    eventsContainer.classList.add('grim-inspector-events-container');
    
    // Add each event entry - limit to most recent 25 to prevent freezing
    const recentEvents = this.events.slice(-25).reverse();
    
    recentEvents.forEach(event => {
      const entry = document.createElement('div');
      entry.classList.add('grim-inspector-entry');
      
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      header.style.marginBottom = '5px';
      
      const typeSpan = document.createElement('span');
      typeSpan.style.fontWeight = '600';
      typeSpan.textContent = event.type;
      typeSpan.style.color = 'var(--primary-color)';
      
      const timeSpan = document.createElement('span');
      timeSpan.style.fontSize = '10px';
      timeSpan.style.color = '#6b7280';
      const eventTime = new Date(event.timestamp);
      timeSpan.textContent = eventTime.toLocaleTimeString();
      
      header.appendChild(typeSpan);
      header.appendChild(timeSpan);
      
      const targetInfo = document.createElement('div');
      targetInfo.style.fontSize = '12px';
      targetInfo.style.marginBottom = '5px';
      
      const targetLabel = document.createElement('span');
      targetLabel.style.fontWeight = '500';
      targetLabel.style.color = '#4b5563';
      targetLabel.textContent = 'Target: ';
      
      const targetValue = document.createElement('span');
      targetValue.style.fontFamily = "'Fira Code', monospace";
      targetValue.style.color = '#111827';
      targetValue.textContent = event.target;
      
      targetInfo.appendChild(targetLabel);
      targetInfo.appendChild(targetValue);
      
      const entryContent = document.createElement('div');
      entryContent.appendChild(targetInfo);
      
      // Add details if available - only show up to 5 properties to prevent overload
      if (event.details && Object.keys(event.details).length > 0) {
        const detailsContainer = document.createElement('div');
        detailsContainer.style.fontSize = '12px';
        
        // Limit number of detail properties to prevent performance issues
        const detailEntries = Object.entries(event.details).slice(0, 5);
        
        detailEntries.forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            const detailItem = document.createElement('div');
            detailItem.style.display = 'flex';
            detailItem.style.marginBottom = '2px';
            
            const keySpan = document.createElement('span');
            keySpan.style.fontWeight = '500';
            keySpan.style.color = '#4b5563';
            keySpan.style.minWidth = '80px';
            keySpan.textContent = `${key}: `;
            
            const valueSpan = document.createElement('span');
            valueSpan.style.fontFamily = "'Fira Code', monospace";
            valueSpan.style.color = '#111827';
            valueSpan.style.whiteSpace = 'pre-wrap';
            
            // Simplified value rendering to avoid deep stringification
            if (typeof value === 'object') {
              try {
                // For objects, just show a simplified representation
                valueSpan.textContent = value instanceof Node 
                  ? 'DOM Node' 
                  : Array.isArray(value)
                    ? `Array(${value.length})`
                    : '{...}';
              } catch (e) {
                valueSpan.textContent = 'Object';
              }
            } else {
              valueSpan.textContent = String(value);
            }
            
            detailItem.appendChild(keySpan);
            detailItem.appendChild(valueSpan);
            
            detailsContainer.appendChild(detailItem);
          }
        });
        
        // Show indication if more properties were truncated
        if (Object.keys(event.details).length > 5) {
          const moreDetails = document.createElement('div');
          moreDetails.style.fontSize = '11px';
          moreDetails.style.fontStyle = 'italic';
          moreDetails.style.color = '#6b7280';
          moreDetails.textContent = `...and ${Object.keys(event.details).length - 5} more properties`;
          detailsContainer.appendChild(moreDetails);
        }
        
        entryContent.appendChild(detailsContainer);
      }
      
      entry.appendChild(header);
      entry.appendChild(entryContent);
      
      eventsContainer.appendChild(entry);
    });
    
    // Add count indicator if events were truncated
    if (this.events.length > 25) {
      const countIndicator = document.createElement('div');
      countIndicator.style.textAlign = 'center';
      countIndicator.style.padding = '10px';
      countIndicator.style.fontSize = '12px';
      countIndicator.style.color = '#6b7280';
      countIndicator.textContent = `Showing most recent 25 of ${this.events.length} events`;
      eventsContainer.appendChild(countIndicator);
    }
    
    contentElement.appendChild(eventsContainer);
  }
  
  private renderNetworkTab(contentElement: HTMLElement, emptyState: HTMLElement): void {
    if (this.network.length === 0) {
      emptyState.style.display = 'flex';
      return;
    }
    
    emptyState.style.display = 'none';
    
    // Clear previous contents except empty state
    Array.from(contentElement.children).forEach(child => {
      if (!child.classList.contains('grim-inspector-empty-state')) {
        child.remove();
      }
    });
    
    // Add toolbar
    const toolbar = document.createElement('div');
    toolbar.classList.add('grim-inspector-toolbar');
    toolbar.style.display = 'flex';
    toolbar.style.justifyContent = 'flex-end';
    toolbar.style.marginBottom = '10px';
    
    const clearButton = document.createElement('button');
    clearButton.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
    clearButton.textContent = 'Clear Network';
    clearButton.addEventListener('click', () => {
      this.network = [];
      this.refreshTabContent('network');
    });
    
    toolbar.appendChild(clearButton);
    contentElement.appendChild(toolbar);
    
    // Create network container
    const networkContainer = document.createElement('div');
    networkContainer.classList.add('grim-inspector-network-container');
    
    // Add each network entry
    this.network.slice().reverse().forEach(req => {
      const entry = document.createElement('div');
      entry.classList.add('grim-inspector-entry');
      
      // Add status-based styling
      if (req.status) {
        if (req.status >= 400) {
          entry.classList.add('grim-inspector-entry-error');
        } else if (req.status >= 300) {
          entry.classList.add('grim-inspector-entry-warning');
        } else if (req.status >= 200) {
          entry.style.borderLeftColor = 'var(--success-color)';
        }
      } else if (req.status === 0) {
        entry.classList.add('grim-inspector-entry-error');
      }
      
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      header.style.marginBottom = '5px';
      
      const typeContainer = document.createElement('div');
      typeContainer.style.display = 'flex';
      typeContainer.style.alignItems = 'center';
      
      const methodSpan = document.createElement('span');
      methodSpan.style.fontWeight = 'bold';
      methodSpan.style.marginRight = '8px';
      methodSpan.style.textTransform = 'uppercase';
      methodSpan.textContent = req.method;
      
      switch (req.method.toUpperCase()) {
        case 'GET':
          methodSpan.style.color = '#3b82f6';
          break;
        case 'POST':
          methodSpan.style.color = '#10b981';
          break;
        case 'PUT':
          methodSpan.style.color = '#f59e0b';
          break;
        case 'DELETE':
          methodSpan.style.color = '#ef4444';
          break;
        default:
          methodSpan.style.color = '#6b7280';
      }
      
      const statusSpan = document.createElement('span');
      statusSpan.style.marginRight = '8px';
      statusSpan.style.borderRadius = '4px';
      statusSpan.style.padding = '2px 6px';
      statusSpan.style.fontSize = '10px';
      statusSpan.style.fontWeight = '600';
      
      if (req.status) {
        statusSpan.textContent = String(req.status);
        
        if (req.status >= 400) {
          statusSpan.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
          statusSpan.style.color = '#ef4444';
        } else if (req.status >= 300) {
          statusSpan.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
          statusSpan.style.color = '#f59e0b';
        } else if (req.status >= 200) {
          statusSpan.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
          statusSpan.style.color = '#10b981';
        } else {
          statusSpan.style.backgroundColor = 'rgba(107, 114, 128, 0.1)';
          statusSpan.style.color = '#6b7280';
        }
      } else if (req.status === 0) {
        statusSpan.textContent = 'ERROR';
        statusSpan.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        statusSpan.style.color = '#ef4444';
      } else {
        statusSpan.textContent = 'PENDING';
        statusSpan.style.backgroundColor = 'rgba(107, 114, 128, 0.1)';
        statusSpan.style.color = '#6b7280';
      }
      
      typeContainer.appendChild(methodSpan);
      typeContainer.appendChild(statusSpan);
      
      const timeSpan = document.createElement('span');
      timeSpan.style.fontSize = '10px';
      timeSpan.style.color = '#6b7280';
      const reqTime = new Date(req.timestamp);
      timeSpan.textContent = reqTime.toLocaleTimeString();
      
      header.appendChild(typeContainer);
      header.appendChild(timeSpan);
      
      const urlContainer = document.createElement('div');
      urlContainer.style.marginBottom = '5px';
      urlContainer.style.wordBreak = 'break-all';
      urlContainer.style.fontFamily = "'Fira Code', monospace";
      urlContainer.style.fontSize = '12px';
      urlContainer.textContent = req.url;
      
      const details = document.createElement('div');
      details.style.fontSize = '12px';
      details.style.display = 'flex';
      details.style.flexWrap = 'wrap';
      details.style.gap = '8px';
      
      // Add duration if available
      if (req.duration !== undefined) {
        const durationItem = document.createElement('div');
        
        const durationLabel = document.createElement('span');
        durationLabel.style.fontWeight = '500';
        durationLabel.style.color = '#4b5563';
        durationLabel.style.marginRight = '4px';
        durationLabel.textContent = 'Duration:';
        
        const durationValue = document.createElement('span');
        durationValue.style.fontFamily = "'Fira Code', monospace";
        durationValue.textContent = `${Math.round(req.duration)}ms`;
        
        durationItem.appendChild(durationLabel);
        durationItem.appendChild(durationValue);
        
        details.appendChild(durationItem);
      }
      
      // Add content type if available
      if (req.contentType) {
        const typeItem = document.createElement('div');
        
        const typeLabel = document.createElement('span');
        typeLabel.style.fontWeight = '500';
        typeLabel.style.color = '#4b5563';
        typeLabel.style.marginRight = '4px';
        typeLabel.textContent = 'Content-Type:';
        
        const typeValue = document.createElement('span');
        typeValue.style.fontFamily = "'Fira Code', monospace";
        typeValue.textContent = req.contentType;
        
        typeItem.appendChild(typeLabel);
        typeItem.appendChild(typeValue);
        
        details.appendChild(typeItem);
      }
      
      entry.appendChild(header);
      entry.appendChild(urlContainer);
      entry.appendChild(details);
      
      networkContainer.appendChild(entry);
    });
    
    contentElement.appendChild(networkContainer);
  }
  
  private renderMetricsTab(contentElement: HTMLElement, emptyState: HTMLElement): void {
    // Always show metrics, even if empty
    emptyState.style.display = 'none';
    
    // Clear previous contents except empty state
    Array.from(contentElement.children).forEach(child => {
      if (!child.classList.contains('grim-inspector-empty-state')) {
        child.remove();
      }
    });
    
    // Create metrics container
    const metricsContainer = document.createElement('div');
    metricsContainer.classList.add('grim-inspector-metrics-container');
    
    // Create overview card
    const overviewCard = document.createElement('div');
    overviewCard.classList.add('grim-inspector-metrics-overview');
    overviewCard.style.padding = '15px';
    overviewCard.style.marginBottom = '20px';
    overviewCard.style.borderRadius = '8px';
    overviewCard.style.backgroundColor = '#f9fafb';
    overviewCard.style.border = '1px solid #e5e7eb';
    
    const overviewTitle = document.createElement('h3');
    overviewTitle.textContent = 'Performance Overview';
    overviewTitle.style.fontSize = '16px';
    overviewTitle.style.fontWeight = '600';
    overviewTitle.style.marginBottom = '15px';
    overviewTitle.style.color = '#111827';
    
    overviewCard.appendChild(overviewTitle);
    
    // Create grid for overview metrics
    const overviewGrid = document.createElement('div');
    overviewGrid.style.display = 'grid';
    overviewGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    overviewGrid.style.gap = '15px';
    
    // Add key metrics
    const keyMetrics = [
      { label: 'Total Load Time', value: this.metrics.totalLoadTime, unit: 'ms' },
      { label: 'DOM Content Loaded', value: this.metrics.domContentLoadTime, unit: 'ms' },
      { label: 'DOM Interactive', value: this.metrics.domInteractiveTime, unit: 'ms' },
      { label: 'First Paint', value: this.metrics.firstPaint, unit: 'ms' },
      { label: 'First Contentful Paint', value: this.metrics.firstContentfulPaint, unit: 'ms' },
      { label: 'Network Latency', value: this.metrics.networkLatency, unit: 'ms' }
    ];
    
    keyMetrics.forEach(metric => {
      const metricItem = document.createElement('div');
      metricItem.style.padding = '10px';
      metricItem.style.borderRadius = '6px';
      
      const metricLabel = document.createElement('div');
      metricLabel.style.fontSize = '12px';
      metricLabel.style.fontWeight = '500';
      metricLabel.style.color = '#6b7280';
      metricLabel.style.marginBottom = '5px';
      metricLabel.textContent = metric.label;
      
      const metricValue = document.createElement('div');
      metricValue.style.fontSize = '20px';
      metricValue.style.fontWeight = '600';
      metricValue.style.color = '#111827';
      
      if (metric.value !== undefined) {
        metricValue.textContent = `${Math.round(metric.value)}${metric.unit}`;
        
        // Add color coding based on performance
        if (metric.label.includes('Paint') || metric.label.includes('Load')) {
          if (metric.value < 1000) {
            metricValue.style.color = '#10b981'; // Good - green
          } else if (metric.value < 3000) {
            metricValue.style.color = '#f59e0b'; // Warning - yellow
          } else {
            metricValue.style.color = '#ef4444'; // Bad - red
          }
        }
      } else {
        metricValue.textContent = 'N/A';
        metricValue.style.color = '#9ca3af';
      }
      
      metricItem.appendChild(metricLabel);
      metricItem.appendChild(metricValue);
      
      overviewGrid.appendChild(metricItem);
    });
    
    overviewCard.appendChild(overviewGrid);
    metricsContainer.appendChild(overviewCard);
    
    // Create detailed timeline visualization
    const timelineCard = document.createElement('div');
    timelineCard.classList.add('grim-inspector-metrics-timeline');
    timelineCard.style.padding = '15px';
    timelineCard.style.borderRadius = '8px';
    timelineCard.style.backgroundColor = '#f9fafb';
    timelineCard.style.border = '1px solid #e5e7eb';
    
    const timelineTitle = document.createElement('h3');
    timelineTitle.textContent = 'Performance Timeline';
    timelineTitle.style.fontSize = '16px';
    timelineTitle.style.fontWeight = '600';
    timelineTitle.style.marginBottom = '15px';
    timelineTitle.style.color = '#111827';
    
    timelineCard.appendChild(timelineTitle);
    
    // Create timeline visualization
    if (
      this.metrics.totalLoadTime && 
      this.metrics.dnsLookupTime && 
      this.metrics.connectionTime && 
      this.metrics.requestResponseTime && 
      this.metrics.domProcessingTime
    ) {
      const totalTime = this.metrics.totalLoadTime;
      
      const timelineContainer = document.createElement('div');
      timelineContainer.style.position = 'relative';
      timelineContainer.style.height = '50px';
      timelineContainer.style.marginBottom = '20px';
      timelineContainer.style.backgroundColor = '#e5e7eb';
      timelineContainer.style.borderRadius = '4px';
      timelineContainer.style.overflow = 'hidden';
      
      // Calculate percentages for each phase
      const dnsPercent = (this.metrics.dnsLookupTime / totalTime) * 100;
      const connectionPercent = (this.metrics.connectionTime / totalTime) * 100;
      const requestPercent = (this.metrics.requestResponseTime / totalTime) * 100;
      const processingPercent = (this.metrics.domProcessingTime / totalTime) * 100;
      const loadPercent = (this.metrics.loadEventTime || 0) / totalTime * 100;
      
      // Ensure percentages are at least visible (minimum 2%)
      const minPercent = 2;
      const adjustedDnsPercent = Math.max(dnsPercent, minPercent);
      const adjustedConnectionPercent = Math.max(connectionPercent, minPercent);
      const adjustedRequestPercent = Math.max(requestPercent, minPercent);
      const adjustedProcessingPercent = Math.max(processingPercent, minPercent);
      const adjustedLoadPercent = Math.max(loadPercent, minPercent);
      
      // Create timeline segments
      const dnsSegment = this.createTimelineSegment(
        'DNS Lookup', 
        `${Math.round(this.metrics.dnsLookupTime!)}ms`, 
        adjustedDnsPercent, 
        '#3b82f6'
      );
      
      const connectionSegment = this.createTimelineSegment(
        'Connection', 
        `${Math.round(this.metrics.connectionTime!)}ms`, 
        adjustedConnectionPercent, 
        '#8b5cf6'
      );
      
      const requestSegment = this.createTimelineSegment(
        'Request/Response', 
        `${Math.round(this.metrics.requestResponseTime!)}ms`, 
        adjustedRequestPercent, 
        '#ec4899'
      );
      
      const processingSegment = this.createTimelineSegment(
        'DOM Processing', 
        `${Math.round(this.metrics.domProcessingTime!)}ms`, 
        adjustedProcessingPercent, 
        '#f59e0b'
      );
      
      const loadSegment = this.createTimelineSegment(
        'Load Event', 
        `${Math.round(this.metrics.loadEventTime || 0)}ms`, 
        adjustedLoadPercent, 
        '#10b981'
      );
      
      timelineContainer.appendChild(dnsSegment);
      timelineContainer.appendChild(connectionSegment);
      timelineContainer.appendChild(requestSegment);
      timelineContainer.appendChild(processingSegment);
      timelineContainer.appendChild(loadSegment);
      
      timelineCard.appendChild(timelineContainer);
      
      // Add legend
      const legend = document.createElement('div');
      legend.style.display = 'flex';
      legend.style.flexWrap = 'wrap';
      legend.style.gap = '10px';
      legend.style.fontSize = '12px';
      
      const legendItems = [
        { color: '#3b82f6', label: 'DNS Lookup' },
        { color: '#8b5cf6', label: 'Connection' },
        { color: '#ec4899', label: 'Request/Response' },
        { color: '#f59e0b', label: 'DOM Processing' },
        { color: '#10b981', label: 'Load Event' }
      ];
      
      legendItems.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.style.display = 'flex';
        legendItem.style.alignItems = 'center';
        
        const legendColor = document.createElement('div');
        legendColor.style.width = '12px';
        legendColor.style.height = '12px';
        legendColor.style.backgroundColor = item.color;
        legendColor.style.marginRight = '5px';
        legendColor.style.borderRadius = '2px';
        
        const legendLabel = document.createElement('span');
        legendLabel.textContent = item.label;
        
        legendItem.appendChild(legendColor);
        legendItem.appendChild(legendLabel);
        
        legend.appendChild(legendItem);
      });
      
      timelineCard.appendChild(legend);
    } else {
      // No data available
      const noData = document.createElement('div');
      noData.style.padding = '20px';
      noData.style.textAlign = 'center';
      noData.style.color = '#6b7280';
      noData.textContent = 'Performance metrics not available yet. Refresh the page to collect metrics.';
      
      timelineCard.appendChild(noData);
    }
    
    metricsContainer.appendChild(timelineCard);
    contentElement.appendChild(metricsContainer);
  }
  
  private createTimelineSegment(
    label: string, 
    value: string, 
    widthPercent: number, 
    color: string
  ): HTMLElement {
    const segment = document.createElement('div');
    segment.style.position = 'absolute';
    segment.style.height = '100%';
    segment.style.width = `${widthPercent}%`;
    segment.style.backgroundColor = color;
    segment.style.left = `${
      // Calculate left position based on previous segments
      document.querySelectorAll('.timeline-segment').length > 0
        ? Array.from(document.querySelectorAll('.timeline-segment'))
            .map(el => parseFloat((el as HTMLElement).style.width))
            .reduce((a, b) => a + b, 0)
        : 0
    }%`;
    segment.classList.add('timeline-segment');
    
    // Add tooltip
    segment.title = `${label}: ${value}`;
    
    return segment;
  }
  
  private togglePanel(): void {
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      this.panel.classList.remove('hidden');
      this.toggle.classList.add('active');
      // Refresh current tab
      this.refreshTabContent(this.activeTab);
    } else {
      this.panel.classList.add('hidden');
      this.toggle.classList.remove('active');
    }
  }
  
  private initPerformanceMetrics(): void {
    // Collect initial metrics when the page loads
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.collectPerformanceMetrics();
      }, 0);
    });
  }
  
  private collectPerformanceMetrics(): void {
    if (!window.performance || !window.performance.timing) {
      return;
    }
    
    const timing = window.performance.timing;
    
    this.metrics = {
      // Overall timing metrics
      totalLoadTime: timing.loadEventEnd - timing.navigationStart,
      domContentLoadTime: timing.domContentLoadedEventEnd - timing.navigationStart,
      domInteractiveTime: timing.domInteractive - timing.navigationStart,
      
      // Detailed timing metrics
      dnsLookupTime: timing.domainLookupEnd - timing.domainLookupStart,
      connectionTime: timing.connectEnd - timing.connectStart,
      requestResponseTime: timing.responseEnd - timing.requestStart,
      domProcessingTime: timing.domComplete - timing.domLoading,
      loadEventTime: timing.loadEventEnd - timing.loadEventStart
    };
    
    // Calculate network latency (time to first byte)
    this.metrics.networkLatency = timing.responseStart - timing.requestStart;
    
    // Collect paint timing metrics if available
    if (window.performance && 'getEntriesByType' in window.performance) {
      const paintMetrics = window.performance.getEntriesByType('paint');
      
      paintMetrics.forEach(entry => {
        if (entry.name === 'first-paint') {
          this.metrics.firstPaint = entry.startTime;
        }
        if (entry.name === 'first-contentful-paint') {
          this.metrics.firstContentfulPaint = entry.startTime;
        }
      });
    }
    
    // Refresh metrics tab if it's open
    if (this.isOpen && this.activeTab === 'metrics') {
      this.refreshTabContent('metrics');
    }
  }
  
  private initConsoleMonitoring(): void {
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info
    };
    
    // Override console.log
    console.log = (...args: any[]) => {
      this.addLogEntry('log', args);
      originalConsole.log(...args);
    };
    
    // Override console.error
    console.error = (...args: any[]) => {
      this.addLogEntry('error', args);
      originalConsole.error(...args);
    };
    
    // Override console.warn
    console.warn = (...args: any[]) => {
      this.addLogEntry('warn', args);
      originalConsole.warn(...args);
    };
    
    // Override console.info
    console.info = (...args: any[]) => {
      this.addLogEntry('info', args);
      originalConsole.info(...args);
    };
    
    // Listen for uncaught errors
    window.addEventListener('error', (event) => {
      this.addErrorEntry(event);
    });
    
    // Listen for unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.addErrorEntry(event);
    });
  }
  
  private addLogEntry(type: LogEntry['type'], args: any[]): void {
    const message = args.map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (e) {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');
    
    const timestamp = new Date().toISOString();
    
    const logEntry: LogEntry = {
      type,
      message,
      timestamp
    };
    
    // Add to appropriate collection
    if (type === 'error') {
      this.errors.push(logEntry);
      // Limit collection size
      if (this.errors.length > 100) this.errors.shift();
    } else {
      this.logs.push(logEntry);
      // Limit collection size
      if (this.logs.length > 100) this.logs.shift();
    }
    
    // Refresh the UI if the tab is open
    if (this.isOpen) {
      if (type === 'error' && this.activeTab === 'errors') {
        this.refreshTabContent('errors');
      } else if (type !== 'error' && this.activeTab === 'logs') {
        this.refreshTabContent('logs');
      }
    }
  }
  
  private addErrorEntry(event: ErrorEvent | PromiseRejectionEvent): void {
    const timestamp = new Date().toISOString();
    let message = '';
    let stack = '';
    
    if (event instanceof ErrorEvent) {
      message = event.message;
      stack = event.error?.stack || '';
    } else {
      // PromiseRejectionEvent
      const reason = event.reason;
      message = reason instanceof Error ? reason.message : String(reason);
      stack = reason instanceof Error ? reason.stack || '' : '';
    }
    
    const logEntry: LogEntry = {
      type: 'error',
      message,
      timestamp,
      stack
    };
    
    this.errors.push(logEntry);
    
    // Limit collection size
    if (this.errors.length > 100) this.errors.shift();
    
    // Refresh the UI if the tab is open
    if (this.isOpen && this.activeTab === 'errors') {
      this.refreshTabContent('errors');
    }
  }
  
  private initEventMonitoring(): void {
    // Create a more focused list of events to monitor
    const commonEvents = [
      'click', 'submit', 'change', 'focus', 'blur',
      'load', 'unload', 'visibilitychange'
    ];
    
    // Throttle event handler to prevent too many events
    const throttle = (callback: Function, limit: number) => {
      let waiting = false;
      return function(this: any, ...args: any[]) {
        if (!waiting) {
          callback.apply(this, args);
          waiting = true;
          setTimeout(() => {
            waiting = false;
          }, limit);
        }
      };
    };
    
    // Create a throttled function to handle events
    const eventHandler = throttle((event: Event): void => {
      // More safely handle various target types
      const target = event.target;
      let targetInfo = 'unknown';
      
      try {
        if (target instanceof HTMLElement || target instanceof SVGElement || target instanceof Element) {
          targetInfo = this.getElementInfo(target as HTMLElement);
        } else if (target instanceof Node) {
          targetInfo = target.nodeName || 'unknown-node';
        } else if (target) {
          targetInfo = String(target);
        }
      } catch (e) {
        targetInfo = 'error-getting-target-info';
        console.warn('Error getting target info:', e);
      }
      
      const eventEntry: EventEntry = {
        type: event.type,
        target: targetInfo,
        details: this.getEventDetails(event),
        timestamp: new Date().toISOString()
      };
      
      this.events.push(eventEntry);
      
      // Limit collection size to 100 events
      if (this.events.length > 100) this.events.shift();
      
      // Only refresh UI if tab is open and not too frequently
      if (this.isOpen && this.activeTab === 'events') {
        this.refreshTabContent('events');
      }
    }, 200); // Throttle to at most one event per 200ms
    
    // Listen for all common events
    commonEvents.forEach(eventType => {
      document.addEventListener(eventType, eventHandler as EventListener, { 
        capture: true, // Capture events during the capture phase
        passive: true  // Don't interfere with normal behavior
      });
    });
    
    // Store a reference to this instance for the prototype override
    const instanceInspector = this;
    
    // Only monitor listener additions for the first 30 seconds of page load
    // to avoid excessive event entries
    const stopListenerMonitoring = setTimeout(() => {
      // Restore original method after 30 seconds
      EventTarget.prototype.addEventListener = originalAddEventListener;
    }, 30000);
    
    // Monitor event listeners being added
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(
      type: string, 
      listener: EventListenerOrEventListenerObject, 
      options?: boolean | AddEventListenerOptions
    ): void {
      // Only record certain types of event listeners
      const trackableEvents = ['click', 'submit', 'change', 'load'];
      
      // Record when event listeners are added
      if ((this instanceof HTMLElement || this instanceof Document || this instanceof Window) && 
          trackableEvents.includes(type)) {
        const target = this instanceof HTMLElement ? this as HTMLElement : this;
        const targetInfo = this instanceof HTMLElement ? instanceInspector.getElementInfo(target as HTMLElement) : String(this);
        
        const eventEntry: EventEntry = {
          type: `Added ${type} listener`,
          target: targetInfo,
          details: {
            eventType: type,
            passive: options && typeof options === 'object' ? options.passive : false,
            capture: options && typeof options === 'object' ? options.capture : !!options
          },
          timestamp: new Date().toISOString()
        };
        
        instanceInspector.events.push(eventEntry);
        
        // Limit collection size
        if (instanceInspector.events.length > 100) instanceInspector.events.shift();
        
        // Only refresh the UI if the tab is open
        if (instanceInspector.isOpen && instanceInspector.activeTab === 'events') {
          instanceInspector.refreshTabContent('events');
        }
      }
      
      return originalAddEventListener.call(this, type, listener, options);
    };
  }
  
  private getElementInfo(element: HTMLElement | Element | null): string {
    if (!element) return 'unknown';
    
    try {
      let info = '';
      
      // Safely access tagName
      if (element.tagName) {
        info = element.tagName.toLowerCase();
      } else {
        return 'unknown-element';
      }
      
      // Check for id attribute
      if ('id' in element && element.id) {
        info += `#${element.id}`;
      }
      
      // Safely check for className
      if ('className' in element && element.className !== null && element.className !== undefined) {
        const className = element.className;
        if (typeof className === 'string') {
          info += `.${className.split(' ').join('.')}`;
        } else if (typeof className === 'object' && className) {
          // Handle SVGAnimatedString
          const svgClassName = className as SVGAnimatedString;
          if ('baseVal' in svgClassName && svgClassName.baseVal) {
            info += `.${svgClassName.baseVal.split(' ').join('.')}`;
          }
        }
      }
      
      return info;
    } catch (e) {
      console.warn('Error getting element info:', e);
      return 'error-getting-element-info';
    }
  }
  
  private getEventDetails(event: Event): Record<string, any> {
    const details: Record<string, any> = {};
    
    // Only collect minimal details to avoid performance issues
    
    // For mouse events, only capture position
    if (event instanceof MouseEvent) {
      details.position = {
        x: event.clientX,
        y: event.clientY
      };
      
      // For click events, include key modifiers
      if (event.type === 'click') {
        details.button = event.button;
        if (event.altKey || event.ctrlKey || event.shiftKey) {
          details.modifiers = {
            alt: event.altKey,
            ctrl: event.ctrlKey,
            shift: event.shiftKey
          };
        }
      }
    }
    
    // For form events, only capture basic info
    if (event.type === 'submit' && event.target instanceof HTMLFormElement) {
      details.action = event.target.action;
      details.method = event.target.method;
    }
    
    // For input events, only capture type and basic value info
    if ((event.type === 'change' || event.type === 'input') && 
        event.target instanceof HTMLInputElement) {
      details.inputType = event.target.type;
      
      // Don't collect actual values for security/privacy
      if (event.target.type === 'password') {
        details.valueType = 'password';
      } else if (event.target.type === 'file') {
        details.valueType = 'file';
      } else if (event.target.value) {
        details.hasValue = true;
      }
    }
    
    return details;
  }
  
  private initNetworkMonitoring(): void {
    // Use fetch API monitoring
    this.monitorFetch();
    
    // Use XMLHttpRequest monitoring
    this.monitorXHR();
  }
  
  private monitorFetch(): void {
    const originalFetch = window.fetch;
    
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const startTime = performance.now();
      const method = init?.method || 'GET';
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      
      const networkEntry: NetworkEntry = {
        method,
        url,
        timestamp: new Date().toISOString()
      };
      
      try {
        const response = await originalFetch(input, init);
        const endTime = performance.now();
        
        // Update with response info
        networkEntry.status = response.status;
        networkEntry.contentType = response.headers.get('content-type') || undefined;
        networkEntry.duration = endTime - startTime;
        
        this.network.push(networkEntry);
        
        // Limit collection size
        if (this.network.length > 100) this.network.shift();
        
        // Refresh the UI if the tab is open
        if (this.isOpen && this.activeTab === 'network') {
          this.refreshTabContent('network');
        }
        
        return response;
      } catch (error) {
        const endTime = performance.now();
        
        // Update with error info
        networkEntry.status = 0; // Error status
        networkEntry.duration = endTime - startTime;
        
        this.network.push(networkEntry);
        
        // Limit collection size
        if (this.network.length > 100) this.network.shift();
        
        // Refresh the UI if the tab is open
        if (this.isOpen && this.activeTab === 'network') {
          this.refreshTabContent('network');
        }
        
        throw error; // Re-throw the error to maintain original behavior
      }
    };
  }
  
  private monitorXHR(): void {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(
      method: string, 
      url: string | URL, 
      async: boolean = true, 
      username?: string | null, 
      password?: string | null
    ): void {
      // Store request data
      this._grimInspectorData = {
        method,
        url: url.toString(),
        startTime: 0
      };
      
      return originalOpen.call(this, method, url, async, username, password);
    };
    
    XMLHttpRequest.prototype.send = function(body?: Document | XMLHttpRequestBodyInit | null): void {
      if (this._grimInspectorData) {
        this._grimInspectorData.startTime = performance.now();
        
        const networkEntry: NetworkEntry = {
          method: this._grimInspectorData.method,
          url: this._grimInspectorData.url,
          timestamp: new Date().toISOString()
        };
        
        // Set up response handlers
        this.addEventListener('load', function() {
          const endTime = performance.now();
          
          // Update with response info
          networkEntry.status = this.status;
          networkEntry.contentType = this.getResponseHeader('content-type') || undefined;
          
          // Use startTime from _grimInspectorData safely
          if (this._grimInspectorData && this._grimInspectorData.startTime) {
            networkEntry.duration = endTime - this._grimInspectorData.startTime;
          }
          
          instanceInspector.network.push(networkEntry);
          
          // Limit collection size
          if (instanceInspector.network.length > 100) instanceInspector.network.shift();
          
          // Refresh the UI if the tab is open
          if (instanceInspector.isOpen && instanceInspector.activeTab === 'network') {
            instanceInspector.refreshTabContent('network');
          }
        });
        
        this.addEventListener('error', function() {
          const endTime = performance.now();
          
          // Update with error info
          networkEntry.status = 0; // Error status
          
          // Use startTime from _grimInspectorData safely
          if (this._grimInspectorData && this._grimInspectorData.startTime) {
            networkEntry.duration = endTime - this._grimInspectorData.startTime;
          }
          
          instanceInspector.network.push(networkEntry);
          
          // Limit collection size
          if (instanceInspector.network.length > 100) instanceInspector.network.shift();
          
          // Refresh the UI if the tab is open
          if (instanceInspector.isOpen && instanceInspector.activeTab === 'network') {
            instanceInspector.refreshTabContent('network');
          }
        });
      }
      
      return originalSend.call(this, body);
    };
    
    // Store a reference to this instance for the prototype override
    const instanceInspector = this;
  }
  
  private initComponentDetection(): void {
    // Look for Shopify sections
    this.detectShopifySections();
    
    // Look for JavaScript libraries and components
    this.detectJSComponents();
    
    // Observe DOM for new components being added
    this.observeComponentChanges();
  }
  
  private detectShopifySections(): void {
    // Find Shopify sections in the DOM
    const sectionElements = document.querySelectorAll('[data-section-type], [data-section-id]');
    
    sectionElements.forEach(section => {
      const type = section.getAttribute('data-section-type') || 'unknown';
      const id = section.getAttribute('data-section-id') || '';
      
      const component: Component = {
        name: `Section: ${type}`,
        type: 'shopify-section',
        path: id
      };
      
      this.components.push(component);
    });
    
    // Refresh components tab if it's open
    if (this.isOpen && this.activeTab === 'components') {
      this.refreshTabContent('components');
    }
  }
  
  private detectJSComponents(): void {
    // Find script tags
    const scripts = document.querySelectorAll('script');
    
    scripts.forEach(script => {
      if (script.src) {
        // Get the filename from the src
        const srcParts = script.src.split('/');
        const filename = srcParts[srcParts.length - 1];
        
        // Try to detect what kind of script it is
        let type = 'script';
        let name = filename;
        
        // Check for common libraries
        if (filename.includes('jquery')) {
          type = 'library';
          name = 'jQuery';
        } else if (filename.includes('swiper')) {
          type = 'library';
          name = 'Swiper';
        } else if (filename.includes('slick')) {
          type = 'library';
          name = 'Slick Slider';
        } else if (filename.includes('shopify')) {
          type = 'shopify';
        }
        
        const component: Component = {
          name: name,
          type: type,
          path: script.src,
          isAsync: script.async,
          isDeferred: script.defer
        };
        
        this.components.push(component);
      }
    });
    
    // Refresh components tab if it's open
    if (this.isOpen && this.activeTab === 'components') {
      this.refreshTabContent('components');
    }
  }
  
  private observeComponentChanges(): void {
    // Create a mutation observer to detect new components
    const observer = new MutationObserver((mutations) => {
      let shouldRefresh = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
              // Check if it's a Shopify section
              if (node.hasAttribute('data-section-type') || node.hasAttribute('data-section-id')) {
                shouldRefresh = true;
                
                const type = node.getAttribute('data-section-type') || 'unknown';
                const id = node.getAttribute('data-section-id') || '';
                
                const component: Component = {
                  name: `Section: ${type}`,
                  type: 'shopify-section',
                  path: id
                };
                
                this.components.push(component);
              }
              
              // Check for scripts within the added node
              const scripts = node.querySelectorAll('script');
              if (scripts.length > 0) {
                shouldRefresh = true;
                
                scripts.forEach(script => {
                  if (script.src) {
                    const srcParts = script.src.split('/');
                    const filename = srcParts[srcParts.length - 1];
                    
                    // Try to detect what kind of script it is
                    let type = 'script';
                    let name = filename;
                    
                    // Check for common libraries
                    if (filename.includes('jquery')) {
                      type = 'library';
                      name = 'jQuery';
                    } else if (filename.includes('swiper')) {
                      type = 'library';
                      name = 'Swiper';
                    } else if (filename.includes('slick')) {
                      type = 'library';
                      name = 'Slick Slider';
                    } else if (filename.includes('shopify')) {
                      type = 'shopify';
                    }
                    
                    const component: Component = {
                      name: name,
                      type: type,
                      path: script.src,
                      isAsync: script.async,
                      isDeferred: script.defer
                    };
                    
                    this.components.push(component);
                  }
                });
              }
            }
          });
        }
      });
      
      if (shouldRefresh && this.isOpen && this.activeTab === 'components') {
        this.refreshTabContent('components');
      }
    });
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Export our widget class
export default GrimInspector;

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  // Create a function to initialize the widget
  const initGrimInspector = (): void => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      new GrimInspector();
    } else {
      document.addEventListener('DOMContentLoaded', () => new GrimInspector());
    }
  };

  // Initialize
  initGrimInspector();
}

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
  requestData?: any;
  responseData?: any;
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
  private _errorPagination: { currentPage: number } | null = null;
  private _logPagination: { currentPage: number } | null = null;
  private _networkPagination: { currentPage: number } | null = null;

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
    
    // Get the current active content
    const contentElement = this.panel.querySelector(`.grim-inspector-tab-content[data-content="${tabName}"]`) as HTMLElement;
    
    // Check if the tab might be heavy to render
    const potentiallyHeavyTabs = ['events', 'errors', 'network'];
    const isHeavyTab = potentiallyHeavyTabs.includes(tabName);
    
    if (contentElement) {
      // If it's a potentially heavy tab, show loading indicator first
      if (isHeavyTab) {
        // Clear content except empty state
        const emptyState = contentElement.querySelector('.grim-inspector-empty-state');
        Array.from(contentElement.children).forEach(child => {
          if (!child.classList.contains('grim-inspector-empty-state')) {
            child.remove();
          }
        });
        
        // Check if tab has data that needs rendering
        let hasData = false;
        if (tabName === 'events' && this.events.length > 0) hasData = true;
        if (tabName === 'errors' && this.errors.length > 0) hasData = true;
        if (tabName === 'network' && this.network.length > 0) hasData = true;
        
        // Only show loading if there's data to render
        if (hasData) {
          // Add loading indicator
          const loading = document.createElement('div');
          loading.style.display = 'flex';
          loading.style.justifyContent = 'center';
          loading.style.alignItems = 'center';
          loading.style.height = '100px';
          loading.style.color = '#6b7280';
          loading.textContent = `Loading ${tabName}...`;
          contentElement.appendChild(loading);
          
          // Use timeout to avoid freezing UI
          setTimeout(() => {
            this.refreshTabContent(tabName);
          }, 50);
          return;
        }
      }
    }
    
    // For non-heavy tabs or tabs without data, refresh immediately
    this.refreshTabContent(tabName);
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
    
    // Add search and filter capabilities
    const controlsContainer = document.createElement('div');
    controlsContainer.style.marginBottom = '15px';
    controlsContainer.style.display = 'flex';
    controlsContainer.style.gap = '10px';
    controlsContainer.style.alignItems = 'center';
    controlsContainer.style.flexWrap = 'wrap';
    
    // Search box
    const searchContainer = document.createElement('div');
    searchContainer.style.flex = '1';
    searchContainer.style.minWidth = '200px';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search components...';
    searchInput.style.width = '100%';
    searchInput.style.padding = '6px 10px';
    searchInput.style.borderRadius = '4px';
    searchInput.style.border = '1px solid #e5e7eb';
    searchInput.style.fontSize = '14px';
    
    searchContainer.appendChild(searchInput);
    controlsContainer.appendChild(searchContainer);
    
    const statsContainer = document.createElement('div');
    statsContainer.style.fontSize = '12px';
    statsContainer.style.color = '#6b7280';
    statsContainer.textContent = `${this.components.length} components found`;
    controlsContainer.appendChild(statsContainer);
    
    contentElement.appendChild(controlsContainer);
    
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
    
    // Counter for lazy loading
    let sectionCount = 0;
    const INITIAL_SECTIONS_TO_SHOW = 2; // Show only first two sections initially
    
    // For very large component sets, use a virtualized approach
    const MAX_COMPONENTS_PER_SECTION = 20;
    
    // Create sections for each component type
    Object.entries(groupedComponents).forEach(([type, components]) => {
      const section = document.createElement('div');
      section.classList.add('grim-inspector-component-section');
      section.style.marginBottom = '20px';
      section.dataset.componentType = type;
      
      const sectionHeader = document.createElement('div');
      sectionHeader.style.cursor = 'pointer';
      sectionHeader.style.userSelect = 'none';
      
      const sectionTitle = document.createElement('h3');
      sectionTitle.style.fontSize = '14px';
      sectionTitle.style.fontWeight = '600';
      sectionTitle.style.marginBottom = '10px';
      sectionTitle.style.padding = '0 0 5px 0';
      sectionTitle.style.borderBottom = '1px solid #e5e7eb';
      sectionTitle.style.display = 'flex';
      sectionTitle.style.justifyContent = 'space-between';
      sectionTitle.style.alignItems = 'center';
      
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
      
      const titleText = document.createElement('span');
      titleText.textContent = `${displayType} (${components.length})`;
      
      const expandIcon = document.createElement('span');
      expandIcon.textContent = sectionCount < INITIAL_SECTIONS_TO_SHOW ? '▼' : '▶';
      expandIcon.style.fontSize = '12px';
      
      sectionTitle.appendChild(titleText);
      sectionTitle.appendChild(expandIcon);
      sectionHeader.appendChild(sectionTitle);
      section.appendChild(sectionHeader);
      
      // Create container for components
      const componentsListContainer = document.createElement('div');
      componentsListContainer.style.display = sectionCount < INITIAL_SECTIONS_TO_SHOW ? 'block' : 'none';
      componentsListContainer.dataset.expanded = sectionCount < INITIAL_SECTIONS_TO_SHOW ? 'true' : 'false';
      
      // Handle large component lists
      let displayedComponents = components;
      
      // If there are too many components, show a subset and add "Show More" button
      if (components.length > MAX_COMPONENTS_PER_SECTION) {
        displayedComponents = components.slice(0, MAX_COMPONENTS_PER_SECTION);
        
        const showMoreContainer = document.createElement('div');
        showMoreContainer.style.textAlign = 'center';
        showMoreContainer.style.padding = '10px 0';
        
        const showMoreButton = document.createElement('button');
        showMoreButton.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
        showMoreButton.textContent = `Show ${components.length - MAX_COMPONENTS_PER_SECTION} More`;
        showMoreButton.style.fontSize = '12px';
        
        showMoreButton.addEventListener('click', () => {
          // When clicked, render all components
          componentsListContainer.innerHTML = '';
          this.renderComponentItems(components, componentsListContainer);
          showMoreContainer.remove();
        });
        
        showMoreContainer.appendChild(showMoreButton);
        componentsListContainer.appendChild(this.renderComponentItems(displayedComponents, document.createElement('div')));
        componentsListContainer.appendChild(showMoreContainer);
      } else {
        // Render all components if under the limit
        this.renderComponentItems(components, componentsListContainer);
      }
      
      // Toggle section expansion on click
      sectionHeader.addEventListener('click', () => {
        const isExpanded = componentsListContainer.dataset.expanded === 'true';
        componentsListContainer.style.display = isExpanded ? 'none' : 'block';
        componentsListContainer.dataset.expanded = isExpanded ? 'false' : 'true';
        expandIcon.textContent = isExpanded ? '▶' : '▼';
      });
      
      section.appendChild(componentsListContainer);
      componentsContainer.appendChild(section);
      
      sectionCount++;
    });
    
    contentElement.appendChild(componentsContainer);
    
    // Add search functionality
    searchInput.addEventListener('input', (e) => {
      const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
      
      // Get all component items
      const items = contentElement.querySelectorAll('.grim-inspector-component-item');
      const sections = contentElement.querySelectorAll('.grim-inspector-component-section');
      
      if (searchTerm === '') {
        // Reset everything if search is cleared
        items.forEach(item => {
          (item as HTMLElement).style.display = 'block';
        });
        
        // Reset section visibility and counters
        sections.forEach((section, index) => {
          (section as HTMLElement).style.display = 'block';
          const expandIcon = section.querySelector('h3 span:last-child');
          const componentsContainer = section.querySelector('div[data-expanded]');
          
          if (index < INITIAL_SECTIONS_TO_SHOW) {
            (componentsContainer as HTMLElement).style.display = 'block';
            (componentsContainer as HTMLElement).dataset.expanded = 'true';
            expandIcon.textContent = '▼';
          } else {
            (componentsContainer as HTMLElement).style.display = 'none';
            (componentsContainer as HTMLElement).dataset.expanded = 'false';
            expandIcon.textContent = '▶';
          }
          
          // Update the counter
          const titleText = section.querySelector('h3 span:first-child');
          const type = (section as HTMLElement).dataset.componentType;
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
          
          const componentCount = section.querySelectorAll('.grim-inspector-component-item').length;
          titleText.textContent = `${displayType} (${componentCount})`;
        });
        
        // Update the stats
        statsContainer.textContent = `${this.components.length} components found`;
        return;
      }
      
      // Track statistics
      let matchedCount = 0;
      
      // Check each component against search
      items.forEach(item => {
        const name = item.querySelector('div[style*="font-weight: 500"]').textContent.toLowerCase();
        const path = item.querySelector('div[style*="font-family"]')?.textContent?.toLowerCase() || '';
        
        if (name.includes(searchTerm) || path.includes(searchTerm)) {
          (item as HTMLElement).style.display = 'block';
          matchedCount++;
        } else {
          (item as HTMLElement).style.display = 'none';
        }
      });
      
      // Update section visibility and expand all that have matches
      sections.forEach(section => {
        const visibleItems = Array.from(section.querySelectorAll('.grim-inspector-component-item'))
          .filter(item => (item as HTMLElement).style.display !== 'none');
        
        if (visibleItems.length === 0) {
          (section as HTMLElement).style.display = 'none';
        } else {
          (section as HTMLElement).style.display = 'block';
          
          // Expand the section if it has matches
          const expandIcon = section.querySelector('h3 span:last-child');
          const componentsContainer = section.querySelector('div[data-expanded]');
          
          (componentsContainer as HTMLElement).style.display = 'block';
          (componentsContainer as HTMLElement).dataset.expanded = 'true';
          expandIcon.textContent = '▼';
          
          // Update the counter to show only matching items
          const titleText = section.querySelector('h3 span:first-child');
          const type = (section as HTMLElement).dataset.componentType;
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
          
          titleText.textContent = `${displayType} (${visibleItems.length})`;
        }
      });
      
      // Update stats
      statsContainer.textContent = `${matchedCount} of ${this.components.length} components found`;
    });
  }
  
  // Helper function to render component items
  private renderComponentItems(components: Component[], container: HTMLElement): HTMLElement {
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
      
      container.appendChild(item);
    });
    
    return container;
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
    toolbar.style.justifyContent = 'space-between';
    toolbar.style.marginBottom = '10px';
    
    // Add pagination info
    const pageInfo = document.createElement('div');
    pageInfo.style.fontSize = '12px';
    pageInfo.style.color = '#6b7280';
    
    // Only show a page of logs at a time to prevent freezing - max 20 at a time
    const MAX_LOGS_PER_PAGE = 20;
    const totalLogs = this.logs.length;
    const totalPages = Math.ceil(totalLogs / MAX_LOGS_PER_PAGE);
    
    // Add pagination state
    if (!this._logPagination) {
      this._logPagination = { currentPage: 1 };
    }
    
    // Ensure current page is valid
    if (this._logPagination.currentPage > totalPages) {
      this._logPagination.currentPage = 1;
    }
    
    const currentPage = this._logPagination.currentPage;
    
    if (totalLogs > MAX_LOGS_PER_PAGE) {
      pageInfo.textContent = `Showing ${MAX_LOGS_PER_PAGE} of ${totalLogs} logs (Page ${currentPage}/${totalPages})`;
      toolbar.appendChild(pageInfo);
    }
    
    // Add pagination controls if needed
    if (totalPages > 1) {
      const paginationControls = document.createElement('div');
      paginationControls.style.display = 'flex';
      paginationControls.style.gap = '8px';
      paginationControls.style.marginRight = '10px';
      
      const prevButton = document.createElement('button');
      prevButton.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
      prevButton.textContent = '← Prev';
      prevButton.style.fontSize = '12px';
      prevButton.style.padding = '4px 8px';
      prevButton.disabled = currentPage === 1;
      prevButton.style.opacity = currentPage === 1 ? '0.5' : '1';
      prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
          this._logPagination.currentPage--;
          this.renderLogsTab(contentElement, emptyState);
        }
      });
      
      const nextButton = document.createElement('button');
      nextButton.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
      nextButton.textContent = 'Next →';
      nextButton.style.fontSize = '12px';
      nextButton.style.padding = '4px 8px';
      nextButton.disabled = currentPage === totalPages;
      nextButton.style.opacity = currentPage === totalPages ? '0.5' : '1';
      nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
          this._logPagination.currentPage++;
          this.renderLogsTab(contentElement, emptyState);
        }
      });
      
      paginationControls.appendChild(prevButton);
      paginationControls.appendChild(nextButton);
      toolbar.appendChild(paginationControls);
    }
    
    const clearButton = document.createElement('button');
    clearButton.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
    clearButton.textContent = 'Clear Logs';
    clearButton.addEventListener('click', () => {
      this.logs = [];
      this._logPagination = { currentPage: 1 };
      this.refreshTabContent('logs');
    });
    
    toolbar.appendChild(clearButton);
    contentElement.appendChild(toolbar);
    
    // Create log entries container
    const logsContainer = document.createElement('div');
    logsContainer.classList.add('grim-inspector-logs-container');
    
    // Calculate slice of logs to show based on current page
    const startIndex = (currentPage - 1) * MAX_LOGS_PER_PAGE;
    const endIndex = Math.min(startIndex + MAX_LOGS_PER_PAGE, totalLogs);
    
    // Only render visible logs for current page
    const visibleLogs = this.logs.slice().reverse().slice(startIndex, endIndex);
    
    // Add each log entry for the current page only
    visibleLogs.forEach(log => {
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
      
      // For very long log messages, truncate them initially
      const isVeryLong = log.message && log.message.length > 1000;
      
      const message = document.createElement('div');
      
      if (isVeryLong) {
        // For long messages, show a truncated version with an expand option
        const truncatedMessage = log.message.substring(0, 1000) + '...';
        message.textContent = truncatedMessage;
        
        const expandButton = document.createElement('button');
        expandButton.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
        expandButton.textContent = 'Show Full Message';
        expandButton.style.fontSize = '10px';
        expandButton.style.marginTop = '5px';
        expandButton.style.display = 'block';
        expandButton.addEventListener('click', () => {
          message.textContent = log.message;
          expandButton.style.display = 'none';
        });
        
        const expandContainer = document.createElement('div');
        expandContainer.appendChild(expandButton);
        message.appendChild(expandContainer);
      } else {
        message.textContent = log.message;
      }
      
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
    toolbar.style.justifyContent = 'space-between';
    toolbar.style.marginBottom = '10px';
    
    // Add pagination info if needed
    const pageInfo = document.createElement('div');
    pageInfo.style.fontSize = '12px';
    pageInfo.style.color = '#6b7280';
    
    // Only show most recent errors to prevent freezing - max 15 at a time
    const MAX_ERRORS_PER_PAGE = 15;
    const totalErrors = this.errors.length;
    const totalPages = Math.ceil(totalErrors / MAX_ERRORS_PER_PAGE);
    
    // Add pagination state
    if (!this._errorPagination) {
      this._errorPagination = { currentPage: 1 };
    }
    
    // Ensure current page is valid
    if (this._errorPagination.currentPage > totalPages) {
      this._errorPagination.currentPage = 1;
    }
    
    const currentPage = this._errorPagination.currentPage;
    
    if (totalErrors > MAX_ERRORS_PER_PAGE) {
      pageInfo.textContent = `Showing ${MAX_ERRORS_PER_PAGE} of ${totalErrors} errors (Page ${currentPage}/${totalPages})`;
      toolbar.appendChild(pageInfo);
    }
    
    // Add pagination controls if needed
    if (totalPages > 1) {
      const paginationControls = document.createElement('div');
      paginationControls.style.display = 'flex';
      paginationControls.style.gap = '8px';
      paginationControls.style.marginRight = '10px';
      
      const prevButton = document.createElement('button');
      prevButton.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
      prevButton.textContent = '← Prev';
      prevButton.style.fontSize = '12px';
      prevButton.style.padding = '4px 8px';
      prevButton.disabled = currentPage === 1;
      prevButton.style.opacity = currentPage === 1 ? '0.5' : '1';
      prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
          this._errorPagination.currentPage--;
          this.renderErrorsTab(contentElement, emptyState);
        }
      });
      
      const nextButton = document.createElement('button');
      nextButton.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
      nextButton.textContent = 'Next →';
      nextButton.style.fontSize = '12px';
      nextButton.style.padding = '4px 8px';
      nextButton.disabled = currentPage === totalPages;
      nextButton.style.opacity = currentPage === totalPages ? '0.5' : '1';
      nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
          this._errorPagination.currentPage++;
          this.renderErrorsTab(contentElement, emptyState);
        }
      });
      
      paginationControls.appendChild(prevButton);
      paginationControls.appendChild(nextButton);
      toolbar.appendChild(paginationControls);
    }
    
    const clearButton = document.createElement('button');
    clearButton.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
    clearButton.textContent = 'Clear All';
    clearButton.addEventListener('click', () => {
      this.errors = [];
      this._errorPagination = { currentPage: 1 };
      this.refreshTabContent('errors');
    });
    
    toolbar.appendChild(clearButton);
    contentElement.appendChild(toolbar);
    
    // Create error entries container
    const errorsContainer = document.createElement('div');
    errorsContainer.classList.add('grim-inspector-errors-container');
    
    // Calculate slice of errors to show based on current page
    const startIndex = (currentPage - 1) * MAX_ERRORS_PER_PAGE;
    const endIndex = Math.min(startIndex + MAX_ERRORS_PER_PAGE, totalErrors);
    
    // Only render visible errors for current page
    const visibleErrors = this.errors.slice().reverse().slice(startIndex, endIndex);
    
    // Add each error entry
    visibleErrors.forEach(error => {
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
      
      // Add stack trace if available - but limit its initial display
      if (error.stack) {
        const stackHeader = document.createElement('div');
        stackHeader.style.fontSize = '11px';
        stackHeader.style.fontWeight = '500';
        stackHeader.style.marginTop = '8px';
        stackHeader.style.color = '#4b5563';
        stackHeader.style.display = 'flex';
        stackHeader.style.justifyContent = 'space-between';
        stackHeader.style.alignItems = 'center';
        stackHeader.style.cursor = 'pointer';
        
        const stackLabel = document.createElement('span');
        stackLabel.textContent = 'Stack Trace:';
        
        const toggleButton = document.createElement('span');
        toggleButton.style.fontSize = '10px';
        toggleButton.style.color = '#3b82f6';
        toggleButton.textContent = 'Show';
        
        // Limit stack trace display to prevent performance issues
        const stackContainer = document.createElement('pre');
        stackContainer.classList.add('grim-inspector-code');
        stackContainer.style.display = 'none';
        stackContainer.style.maxHeight = '200px';
        stackContainer.style.overflow = 'auto';
        
        // Determine if stack trace is very long
        const isVeryLong = error.stack.length > 1000;
        
        // For very long stack traces, use a more efficient approach
        if (isVeryLong) {
          stackContainer.textContent = error.stack.substring(0, 1000) + '...\n\n(Stack trace truncated for performance)';
          
          // Add a "view full" button for long stack traces
          const viewFullButton = document.createElement('button');
          viewFullButton.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
          viewFullButton.textContent = 'View Full Stack';
          viewFullButton.style.fontSize = '10px';
          viewFullButton.style.marginTop = '5px';
          viewFullButton.addEventListener('click', (e) => {
            e.stopPropagation();
            stackContainer.textContent = error.stack;
            viewFullButton.style.display = 'none';
          });
          
          const buttonContainer = document.createElement('div');
          buttonContainer.style.textAlign = 'center';
          buttonContainer.appendChild(viewFullButton);
          
          stackContainer.appendChild(buttonContainer);
        } else {
          stackContainer.textContent = error.stack;
        }
        
        stackHeader.addEventListener('click', () => {
          if (stackContainer.style.display === 'none') {
            stackContainer.style.display = 'block';
            toggleButton.textContent = 'Hide';
          } else {
            stackContainer.style.display = 'none';
            toggleButton.textContent = 'Show';
          }
        });
        
        stackHeader.appendChild(stackLabel);
        stackHeader.appendChild(toggleButton);
        
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
    toolbar.style.justifyContent = 'space-between';
    toolbar.style.marginBottom = '10px';
    
    // Add pagination info
    const pageInfo = document.createElement('div');
    pageInfo.style.fontSize = '12px';
    pageInfo.style.color = '#6b7280';
    
    // Only show a page of network requests at a time - max 15 at a time
    const MAX_REQUESTS_PER_PAGE = 15;
    const totalRequests = this.network.length;
    const totalPages = Math.ceil(totalRequests / MAX_REQUESTS_PER_PAGE);
    
    // Add pagination state
    if (!this._networkPagination) {
      this._networkPagination = { currentPage: 1 };
    }
    
    // Ensure current page is valid
    if (this._networkPagination.currentPage > totalPages) {
      this._networkPagination.currentPage = 1;
    }
    
    const currentPage = this._networkPagination.currentPage;
    
    if (totalRequests > MAX_REQUESTS_PER_PAGE) {
      pageInfo.textContent = `Showing ${MAX_REQUESTS_PER_PAGE} of ${totalRequests} requests (Page ${currentPage}/${totalPages})`;
      toolbar.appendChild(pageInfo);
    }
    
    // Add pagination controls if needed
    if (totalPages > 1) {
      const paginationControls = document.createElement('div');
      paginationControls.style.display = 'flex';
      paginationControls.style.gap = '8px';
      paginationControls.style.marginRight = '10px';
      
      const prevButton = document.createElement('button');
      prevButton.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
      prevButton.textContent = '← Prev';
      prevButton.style.fontSize = '12px';
      prevButton.style.padding = '4px 8px';
      prevButton.disabled = currentPage === 1;
      prevButton.style.opacity = currentPage === 1 ? '0.5' : '1';
      prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
          this._networkPagination.currentPage--;
          this.renderNetworkTab(contentElement, emptyState);
        }
      });
      
      const nextButton = document.createElement('button');
      nextButton.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
      nextButton.textContent = 'Next →';
      nextButton.style.fontSize = '12px';
      nextButton.style.padding = '4px 8px';
      nextButton.disabled = currentPage === totalPages;
      nextButton.style.opacity = currentPage === totalPages ? '0.5' : '1';
      nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
          this._networkPagination.currentPage++;
          this.renderNetworkTab(contentElement, emptyState);
        }
      });
      
      paginationControls.appendChild(prevButton);
      paginationControls.appendChild(nextButton);
      toolbar.appendChild(paginationControls);
    }
    
    const clearButton = document.createElement('button');
    clearButton.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
    clearButton.textContent = 'Clear Requests';
    clearButton.addEventListener('click', () => {
      this.network = [];
      this._networkPagination = { currentPage: 1 };
      this.refreshTabContent('network');
    });
    
    toolbar.appendChild(clearButton);
    contentElement.appendChild(toolbar);
    
    // Create network entries container
    const networkContainer = document.createElement('div');
    networkContainer.classList.add('grim-inspector-network-container');
    
    // Calculate slice of network requests to show based on current page
    const startIndex = (currentPage - 1) * MAX_REQUESTS_PER_PAGE;
    const endIndex = Math.min(startIndex + MAX_REQUESTS_PER_PAGE, totalRequests);
    
    // Only render visible network requests for current page
    const visibleRequests = this.network.slice().reverse().slice(startIndex, endIndex);
    
    // Add each network entry
    visibleRequests.forEach(request => {
      const entry = document.createElement('div');
      entry.classList.add('grim-inspector-entry');
      
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      header.style.marginBottom = '5px';
      
      const methodStatus = document.createElement('div');
      methodStatus.style.display = 'flex';
      methodStatus.style.alignItems = 'center';
      
      const methodBadge = document.createElement('span');
      methodBadge.style.fontFamily = "'Fira Code', monospace";
      methodBadge.style.fontSize = '10px';
      methodBadge.style.fontWeight = '600';
      methodBadge.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
      methodBadge.style.color = '#3b82f6';
      methodBadge.style.borderRadius = '4px';
      methodBadge.style.padding = '2px 6px';
      methodBadge.style.marginRight = '8px';
      methodBadge.textContent = request.method;
      
      const statusBadge = document.createElement('span');
      statusBadge.style.marginRight = '8px';
      statusBadge.style.borderRadius = '4px';
      statusBadge.style.padding = '2px 6px';
      statusBadge.style.fontSize = '10px';
      statusBadge.style.fontWeight = '600';
      
      if (request.status) {
        statusBadge.textContent = String(request.status);
        
        if (request.status >= 400) {
          statusBadge.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
          statusBadge.style.color = '#ef4444';
        } else if (request.status >= 300) {
          statusBadge.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
          statusBadge.style.color = '#f59e0b';
        } else if (request.status >= 200) {
          statusBadge.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
          statusBadge.style.color = '#10b981';
        } else {
          statusBadge.style.backgroundColor = 'rgba(107, 114, 128, 0.1)';
          statusBadge.style.color = '#6b7280';
        }
      } else if (request.status === 0) {
        statusBadge.textContent = 'ERROR';
        statusBadge.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        statusBadge.style.color = '#ef4444';
      } else {
        statusBadge.textContent = 'PENDING';
        statusBadge.style.backgroundColor = 'rgba(107, 114, 128, 0.1)';
        statusBadge.style.color = '#6b7280';
      }
      
      methodStatus.appendChild(methodBadge);
      methodStatus.appendChild(statusBadge);
      
      const timeSpan = document.createElement('span');
      timeSpan.style.fontSize = '10px';
      timeSpan.style.color = '#6b7280';
      const requestTime = new Date(request.timestamp);
      timeSpan.textContent = requestTime.toLocaleTimeString();
      
      header.appendChild(methodStatus);
      header.appendChild(timeSpan);
      
      // Display the URL with max length to prevent very long URLs from breaking layout
      const url = document.createElement('div');
      url.style.marginBottom = '5px';
      url.style.wordBreak = 'break-all';
      url.style.fontFamily = "'Fira Code', monospace";
      url.style.fontSize = '12px';
      
      // Trim very long URLs for display purposes
      const MAX_URL_LENGTH = 200;
      if (request.url.length > MAX_URL_LENGTH) {
        const trimmedUrl = request.url.substring(0, MAX_URL_LENGTH) + '...';
        
        // Create a tooltip element for hover
        url.title = request.url;
        url.textContent = trimmedUrl;
        url.style.cursor = 'pointer';
        
        // Add a "copy full URL" button for very long URLs
        const copyUrlBtn = document.createElement('button');
        copyUrlBtn.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
        copyUrlBtn.textContent = 'Copy Full URL';
        copyUrlBtn.style.fontSize = '10px';
        copyUrlBtn.style.padding = '2px 6px';
        copyUrlBtn.style.marginLeft = '8px';
        copyUrlBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(request.url)
            .then(() => {
              const originalText = copyUrlBtn.textContent;
              copyUrlBtn.textContent = 'Copied!';
              setTimeout(() => {
                copyUrlBtn.textContent = originalText;
              }, 1000);
            });
        });
        
        const urlContainer = document.createElement('div');
        urlContainer.style.display = 'flex';
        urlContainer.style.alignItems = 'center';
        urlContainer.appendChild(url);
        urlContainer.appendChild(copyUrlBtn);
        
        entry.appendChild(header);
        entry.appendChild(urlContainer);
      } else {
        url.textContent = request.url;
        entry.appendChild(header);
        entry.appendChild(url);
      }
      
      // Add metadata (duration, content type, etc.)
      const metadata = document.createElement('div');
      metadata.style.fontSize = '12px';
      metadata.style.display = 'flex';
      metadata.style.flexWrap = 'wrap';
      metadata.style.gap = '8px';
      
      // Add duration if available
      if (request.duration !== undefined) {
        const durationItem = document.createElement('div');
        const durationLabel = document.createElement('span');
        durationLabel.style.fontWeight = '500';
        durationLabel.style.color = '#4b5563';
        durationLabel.style.marginRight = '4px';
        durationLabel.textContent = 'Duration:';
        
        const durationValue = document.createElement('span');
        durationValue.style.fontFamily = "'Fira Code', monospace";
        durationValue.textContent = `${Math.round(request.duration)}ms`;
        
        durationItem.appendChild(durationLabel);
        durationItem.appendChild(durationValue);
        metadata.appendChild(durationItem);
      }
      
      // Add content type if available
      if (request.contentType) {
        const contentTypeItem = document.createElement('div');
        const contentTypeLabel = document.createElement('span');
        contentTypeLabel.style.fontWeight = '500';
        contentTypeLabel.style.color = '#4b5563';
        contentTypeLabel.style.marginRight = '4px';
        contentTypeLabel.textContent = 'Content-Type:';
        
        const contentTypeValue = document.createElement('span');
        contentTypeValue.style.fontFamily = "'Fira Code', monospace";
        
        // Shorten very long content types
        if (request.contentType.length > 30) {
          contentTypeValue.textContent = request.contentType.substring(0, 30) + '...';
          contentTypeValue.title = request.contentType;
        } else {
          contentTypeValue.textContent = request.contentType;
        }
        
        contentTypeItem.appendChild(contentTypeLabel);
        contentTypeItem.appendChild(contentTypeValue);
        metadata.appendChild(contentTypeItem);
      }
      
      // Add data preview with toggle button
      if (request.requestData || request.responseData) {
        const toggleContainer = document.createElement('div');
        toggleContainer.style.marginTop = '8px';
        
        const toggleButton = document.createElement('button');
        toggleButton.classList.add('grim-inspector-btn', 'grim-inspector-btn-ghost');
        toggleButton.textContent = 'Show Details';
        toggleButton.style.fontSize = '11px';
        
        const detailsContainer = document.createElement('div');
        detailsContainer.style.display = 'none';
        detailsContainer.style.marginTop = '8px';
        
        toggleButton.addEventListener('click', () => {
          if (detailsContainer.style.display === 'none') {
            detailsContainer.style.display = 'block';
            toggleButton.textContent = 'Hide Details';
          } else {
            detailsContainer.style.display = 'none';
            toggleButton.textContent = 'Show Details';
          }
        });
        
        toggleContainer.appendChild(toggleButton);
        
        // Add request data if available
        if (request.requestData) {
          const requestDataContainer = document.createElement('div');
          requestDataContainer.style.marginBottom = '8px';
          
          const requestDataHeader = document.createElement('div');
          requestDataHeader.style.fontSize = '11px';
          requestDataHeader.style.fontWeight = '500';
          requestDataHeader.style.marginBottom = '4px';
          requestDataHeader.style.color = '#4b5563';
          requestDataHeader.textContent = 'Request Data:';
          
          const requestDataContent = document.createElement('pre');
          requestDataContent.classList.add('grim-inspector-code');
          requestDataContent.style.maxHeight = '150px';
          requestDataContent.style.overflow = 'auto';
          
          try {
            // Format and limit request data for performance
            const formattedData = this.formatNetworkData(request.requestData);
            requestDataContent.textContent = formattedData;
          } catch (e) {
            requestDataContent.textContent = String(request.requestData);
          }
          
          requestDataContainer.appendChild(requestDataHeader);
          requestDataContainer.appendChild(requestDataContent);
          detailsContainer.appendChild(requestDataContainer);
        }
        
        // Add response data if available
        if (request.responseData) {
          const responseDataContainer = document.createElement('div');
          
          const responseDataHeader = document.createElement('div');
          responseDataHeader.style.fontSize = '11px';
          responseDataHeader.style.fontWeight = '500';
          responseDataHeader.style.marginBottom = '4px';
          responseDataHeader.style.color = '#4b5563';
          responseDataHeader.textContent = 'Response Data:';
          
          const responseDataContent = document.createElement('pre');
          responseDataContent.classList.add('grim-inspector-code');
          responseDataContent.style.maxHeight = '150px';
          responseDataContent.style.overflow = 'auto';
          
          try {
            // Format and limit response data for performance
            const formattedData = this.formatNetworkData(request.responseData);
            responseDataContent.textContent = formattedData;
          } catch (e) {
            responseDataContent.textContent = String(request.responseData);
          }
          
          responseDataContainer.appendChild(responseDataHeader);
          responseDataContainer.appendChild(responseDataContent);
          detailsContainer.appendChild(responseDataContainer);
        }
        
        entry.appendChild(metadata);
        entry.appendChild(toggleContainer);
        entry.appendChild(detailsContainer);
      } else {
        entry.appendChild(metadata);
      }
      
      networkContainer.appendChild(entry);
    });
    
    contentElement.appendChild(networkContainer);
  }
  
  // Helper to format network data while preventing large objects from freezing the browser
  private formatNetworkData(data: any): string {
    if (typeof data === 'string') {
      try {
        // Try to parse as JSON if it's a string
        const parsedData = JSON.parse(data);
        const jsonString = JSON.stringify(parsedData, null, 2);
        
        // Truncate very large response bodies
        if (jsonString.length > 5000) {
          return jsonString.substring(0, 5000) + '\n\n... (truncated for performance)';
        }
        return jsonString;
      } catch (e) {
        // If not valid JSON, just return the string
        if (data.length > 5000) {
          return data.substring(0, 5000) + '\n\n... (truncated for performance)';
        }
        return data;
      }
    } else if (typeof data === 'object' && data !== null) {
      try {
        const jsonString = JSON.stringify(data, null, 2);
        if (jsonString.length > 5000) {
          return jsonString.substring(0, 5000) + '\n\n... (truncated for performance)';
        }
        return jsonString;
      } catch (e) {
        return '[Complex object - cannot display]';
      }
    }
    
    return String(data);
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

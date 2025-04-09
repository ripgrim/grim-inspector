// Dynamically load the inspector script
(function() {
  // Detect if we're on GitHub Pages or local development
  const isGitHubPages = window.location.hostname.includes('github.io');
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Choose the appropriate script URL
  let scriptUrl;
  if (isGitHubPages) {
    // Use the GitHub Pages version
    scriptUrl = '/grim-inspector/grim-inspector.umd.js';
  } else if (isDev) {
    // Use the local development version
    scriptUrl = '/dist/grim-inspector.umd.js';
  } else {
    // Fallback to CDN
    scriptUrl = 'https://cdn.jsdelivr.net/gh/ripgrim/grim-inspector@main/dist/grim-inspector.umd.js';
  }
  
  // Create and append the script element
  const script = document.createElement('script');
  script.src = scriptUrl;
  script.defer = true;
  script.onerror = function() {
    console.error('Failed to load Grim Inspector script from', scriptUrl);
    
    // Fallback to CDN if local loading fails
    if (!scriptUrl.includes('cdn.jsdelivr.net')) {
      console.log('Falling back to CDN...');
      const fallbackScript = document.createElement('script');
      fallbackScript.src = 'https://cdn.jsdelivr.net/gh/ripgrim/grim-inspector@main/dist/grim-inspector.umd.js';
      fallbackScript.defer = true;
      document.body.appendChild(fallbackScript);
    }
  };
  
  document.body.appendChild(script);
})(); 
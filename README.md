# Grim Inspector

A comprehensive debugging and inspection tool for web pages. This inspector provides real-time insights into your page's components, logs, errors, events, network activity, and performance metrics.

![Build Status](https://github.com/ripgrim/grim-inspector/actions/workflows/build.yml/badge.svg)

## Features

- 👁️ **Visual Isolation**: Styles are completely isolated from your page - it won't affect or be affected by existing CSS
- 🎭 **Components Tab**: Lists all sections and JavaScript components, including async/defer properties
- 📝 **Logs Tab**: Captures console logs for easy debugging
- ⚠️ **Errors Tab**: Displays console errors with detailed stack traces and timestamps
- 🔄 **Events Tab**: Monitors DOM events and event listeners being added
- 📡 **Network Tab**: Tracks API calls and fetch requests
- 📊 **Metrics Tab**: Provides detailed performance metrics with visual timeline

## Installation

### Option 1: Direct script include (Recommended)

This option will always use the latest version from the GitHub repository:

```html
<script src="https://cdn.jsdelivr.net/gh/ripgrim/grim-inspector@main/dist/grim-inspector.umd.js"></script>
```

For a specific version:

```html
<script src="https://cdn.jsdelivr.net/gh/ripgrim/grim-inspector@v1.0.0/dist/grim-inspector.umd.js"></script>
```

### Option 2: Use from GitHub Pages

We automatically deploy to GitHub Pages on each push to main:

```html
<script src="https://ripgrim.github.io/grim-inspector/grim-inspector.umd.js"></script>
```

### Option 3: Manual download

1. Download the `dist/grim-inspector.umd.js` file from this repository
2. Upload it to your site's assets
3. Include it in your HTML file:

```html
<script src="path/to/grim-inspector.umd.js"></script>
```

## Usage

Once installed, the inspector appears as a blue circle in the bottom-right corner of your page. Click on it to open the debug panel with the following tabs:

### Components Tab

Shows all sections and JavaScript components detected on your page:
- Section types and IDs
- Scripts with async/defer properties
- External libraries

### Logs Tab

Captures all console logs (excluding errors):
- Log level (log, info, warn)
- Timestamp
- Message
- Copy functionality

### Errors Tab

Dedicated tab for error monitoring:
- Error messages
- Stack traces
- Timestamps
- Copy functionality for easy sharing

### Events Tab

Tracks DOM events and added event listeners:
- Event type
- Target element
- Additional details (like mouse coordinates)
- Timestamp

### Network Tab

Monitors all network requests:
- HTTP method
- URL
- Status code
- Content type
- Duration
- Color coding by status

### Metrics Tab

Performance dashboard with key metrics:
- Total load time
- DOM content loaded time
- First paint / First contentful paint
- Visual timeline showing phases:
  - DNS lookup
  - Connection
  - Request/Response
  - DOM Processing
  - Load Event

## Continuous Integration

This repository uses GitHub Actions to automatically build the project when changes are pushed to the main branch. The workflow:

1. Installs dependencies
2. Builds the project
3. Uploads the build artifacts
4. Deploys to GitHub Pages (for easy linking)

You can access the latest build at:
- https://ripgrim.github.io/grim-inspector/grim-inspector.umd.js

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The build output will be in the `dist` directory.

## Customization

You can modify the `src/main.ts` file to customize the inspector's appearance and behavior, or extend it with additional functionality.

## License

MIT 
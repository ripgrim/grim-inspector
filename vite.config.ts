import { defineConfig } from 'vite';

export default defineConfig({
  // Set the base path for GitHub Pages deployment
  // Use relative paths in production, absolute for GitHub Pages
  base: process.env.GITHUB_ACTIONS ? '/grim-inspector/' : './',
  build: {
    lib: {
      entry: './src/main.ts',
      name: 'GrimInspector',
      fileName: 'grim-inspector'
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'grim-inspector.css';
          return assetInfo.name || 'asset-[hash]';
        }
      }
    }
  }
}); 
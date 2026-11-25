import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

// Self-hosted fonts (bundled locally as .woff2, zero external CDN requests)
import '@fontsource/big-shoulders-display';
import '@fontsource/syne';
import '@fontsource/inter';

// Pairing B fonts (loaded for Phase 1 Specimen — unused pairing removed after lock)
import '@fontsource/anton';
import '@fontsource/unbounded';
import '@fontsource/geist-sans';

import './styles/global.css';
import { App } from './App';

const rootEl = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

if (rootEl.hasChildNodes() && !rootEl.innerHTML.includes('<!--app-html-->')) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}

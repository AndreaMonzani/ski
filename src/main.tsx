import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

// Self-hosted fonts (bundled locally as .woff2, zero external CDN requests)
import '@fontsource/big-shoulders-display/800.css';
import '@fontsource/big-shoulders-display/900.css';
import '@fontsource/syne/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';

// Pairing B fonts (loaded for Phase 1 Specimen — unused pairing removed after lock)
import '@fontsource/anton/400.css';
import '@fontsource/unbounded/600.css';
import '@fontsource/unbounded/700.css';
import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';

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
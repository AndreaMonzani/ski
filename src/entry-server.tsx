import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from './App';
import { getContent, getLocaleFromPath } from './hooks/useI18n';

export function render(url: string) {
  const locale = getLocaleFromPath(url);
  const content = getContent(locale);

  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );

  const origin = process.env.VITE_SITE_URL || 'https://ski.andreamonzani.com';
  const canonical = `${origin}${url === '/' ? '' : url}`;

  const head = [
    `<title>${content.meta.title}</title>`,
    `<meta name="description" content="${content.meta.description}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<link rel="alternate" hreflang="it" href="${origin}/" />`,
    `<link rel="alternate" hreflang="en" href="${origin}/en/" />`,
    `<link rel="alternate" hreflang="x-default" href="${origin}/" />`,
  ].join('\n    ');

  return { html, head, locale };
}
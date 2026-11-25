import { useLocation } from 'react-router';
import { contentIt } from '../content/it';
import { contentEn } from '../content/en';
import type { Locale, SiteContent } from '../content/types';

export function getLocaleFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'it';
}

export function getContent(locale: Locale): SiteContent {
  return locale === 'en' ? contentEn : contentIt;
}

export function useI18n(): SiteContent {
  const { pathname } = useLocation();
  return getContent(getLocaleFromPath(pathname));
}
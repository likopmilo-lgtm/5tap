import type {MetadataRoute} from 'next';
import {getSiteData} from './supabase-server';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const data = await getSiteData();
  const base = data.settings.siteUrl.replace(/\/$/, '');
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout', '/panier', '/confidentialite'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}

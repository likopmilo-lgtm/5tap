import type {MetadataRoute} from 'next';
import {getSiteData} from './supabase-server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getSiteData();
  const base = data.settings.siteUrl.replace(/\/$/, '');
  const now = new Date();
  const staticRoutes = ['/', '/boutique', '/faq', '/contact'].map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1 : 0.8,
  }));
  const productRoutes = data.products.map((product) => ({
    url: `${base}/produit/${product.slug || product.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: product.isFeatured ? 0.9 : 0.75,
  }));
  return [...staticRoutes, ...productRoutes];
}

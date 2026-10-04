import {env} from 'cloudflare:workers';
import {fallbackSiteData, normalizeSiteData, SiteData, SiteProduct} from './site-data';

type EnvShape = {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
};

function getSupabaseConfig(): EnvShape {
  const workerEnv = env as unknown as EnvShape;
  return {
    SUPABASE_URL: workerEnv.SUPABASE_URL || process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    SUPABASE_ANON_KEY:
      workerEnv.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY,
  };
}

export function hasSupabaseConfig() {
  const config = getSupabaseConfig();
  return Boolean(config.SUPABASE_URL && config.SUPABASE_ANON_KEY);
}

async function supabaseFetch(path: string, init: RequestInit = {}) {
  const config = getSupabaseConfig();
  if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
    throw new Error('Supabase is not configured.');
  }
  const url = `${config.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${path}`;
  return fetch(url, {
    ...init,
    headers: {
      apikey: config.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${config.SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
}

function asArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function normalizeProduct(row: Record<string, unknown>): SiteProduct {
  const id = String(row.slug || row.id);
  const metadata = (row.metadata || {}) as Record<string, unknown>;
  const seo = (row.seo || {}) as SiteProduct['seo'];
  const images = Array.isArray(row.images)
    ? (row.images as SiteProduct['images'])
    : row.image_url
      ? [
          {
            url: String(row.image_url),
            alt: String(row.image_alt || row.name || id),
            width: Number(row.image_width || 1200),
            height: Number(row.image_height || 800),
            title: String(row.image_title || row.name || id),
            metadata: (row.image_metadata || {}) as Record<string, unknown>,
          },
        ]
      : undefined;
  return {
    id,
    slug: id,
    name: String(row.name || id),
    price: Number(row.price || 0),
    category: String(row.category || 'packs'),
    label: String(row.label || ''),
    desc: String(row.description || row.desc || ''),
    items: asArray(row.items),
    custom: Boolean(row.is_custom || row.custom),
    sortOrder: Number(row.sort_order || 0),
    isActive: row.is_active !== false,
    isFeatured: Boolean(row.is_featured),
    imageUrl: images?.[0]?.url,
    imageAlt: images?.[0]?.alt,
    images,
    seo,
    metadata,
  } as SiteProduct;
}

export async function getSiteData(): Promise<SiteData> {
  if (!hasSupabaseConfig()) return fallbackSiteData;
  try {
    const [productResponse, faqResponse, settingsResponse, pagesResponse] = await Promise.all([
      supabaseFetch('products?select=*&is_active=eq.true&order=sort_order.asc'),
      supabaseFetch('faqs?select=question,answer,is_active,sort_order&is_active=eq.true&order=sort_order.asc'),
      supabaseFetch('site_settings?select=key,value'),
      supabaseFetch('content_pages?select=slug,title,description,body,seo&is_active=eq.true'),
    ]);
    if (!productResponse.ok) throw new Error('Product query failed.');
    const productRows = (await productResponse.json()) as Record<string, unknown>[];
    const faqRows = faqResponse.ok ? ((await faqResponse.json()) as Record<string, unknown>[]) : [];
    const settingRows = settingsResponse.ok ? ((await settingsResponse.json()) as {key: string; value: unknown}[]) : [];
    const pageRows = pagesResponse.ok ? ((await pagesResponse.json()) as Record<string, unknown>[]) : [];
    const settings = Object.fromEntries(settingRows.map((row) => [row.key, row.value]));
    const pages = Object.fromEntries(
      pageRows.map((row) => [
        String(row.slug),
        {
          title: row.title ? String(row.title) : undefined,
          description: row.description ? String(row.description) : undefined,
          body: row.body ? String(row.body) : undefined,
          seo: (row.seo || {}) as SiteProduct['seo'],
        },
      ]),
    );
    return normalizeSiteData({
      products: productRows.map(normalizeProduct),
      faqs: faqRows.map((row) => [String(row.question), String(row.answer)] as [string, string]),
      settings: settings as SiteData['settings'],
      pages,
    });
  } catch (error) {
    console.error('supabase_catalog_fallback', error instanceof Error ? error.message : 'Unknown error');
    return fallbackSiteData;
  }
}

export async function getProductBySlug(slug: string) {
  const data = await getSiteData();
  return data.products.find((product) => product.id === slug || product.slug === slug) || null;
}

export async function writeSupabase(path: string, body: unknown, prefer = 'return=representation') {
  const response = await supabaseFetch(path, {
    method: 'POST',
    headers: {Prefer: prefer},
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

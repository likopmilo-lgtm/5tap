import {faqs as fallbackFaqs, products as fallbackProducts, whatsapp} from './catalog';

export type ProductImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  title?: string;
  caption?: string;
  metadata?: Record<string, unknown>;
};

export type ProductSeo = {
  title?: string;
  description?: string;
  canonicalPath?: string;
  keywords?: string[];
  ogImage?: string;
  noindex?: boolean;
};

export type SiteProduct = (typeof fallbackProducts)[number] & {
  slug?: string;
  sortOrder?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  imageUrl?: string;
  imageAlt?: string;
  images?: ProductImage[];
  seo?: ProductSeo;
  metadata?: Record<string, unknown>;
};

export type SiteSettings = {
  siteUrl: string;
  brandName: string;
  tagline: string;
  whatsappUrl: string;
  instagramUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  metaPixelId?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  currency: string;
  tangierShipping: number;
  moroccoShipping: number;
};

export type SiteData = {
  products: SiteProduct[];
  faqs: [string, string][];
  settings: SiteSettings;
  pages: Record<string, {title?: string; description?: string; body?: string; seo?: ProductSeo}>;
};

export const fallbackSettings: SiteSettings = {
  siteUrl: 'https://5tap.ma',
  brandName: '5Tap',
  tagline: '5 étoiles, un seul tap',
  whatsappUrl: whatsapp,
  instagramUrl: 'https://www.instagram.com/5tap.ma/',
  defaultTitle: '5Tap — Cartes de visite digitales et avis Google',
  defaultDescription:
    'Cartes de visite digitales NFC personnalisées et supports avis Google dès 150 DH. Installation à Tanger et paiement à la livraison.',
  currency: 'MAD',
  tangierShipping: 20,
  moroccoShipping: 40,
};

export const fallbackSiteData: SiteData = {
  products: fallbackProducts.map((product, index) => {
    const isBusinessCard = product.id === 'carte-visite';
    const isEssentialPack = product.id === 'essentiel';
    const imageUrl = isBusinessCard
      ? '/carte-visite-digitale.jpg'
      : isEssentialPack
        ? '/pack-essentiel-stand.png'
        : '/product-concept.webp';
    const imageAlt = isBusinessCard
      ? 'Carte de visite digitale NFC 5Tap avec profil mobile'
      : isEssentialPack
        ? 'Pack Essentiel 5Tap avec stand avis Google NFC et carte review'
        : `Illustration de la gamme 5Tap — ${product.name}`;
    return {
      ...product,
      slug: product.id,
      sortOrder: index + 1,
      isActive: true,
      isFeatured: product.category === 'packs',
      imageUrl,
      imageAlt,
      images: [
        {
          url: imageUrl,
          alt: imageAlt,
          width: isBusinessCard ? 2410 : isEssentialPack ? 1536 : 1200,
          height: isBusinessCard ? 1760 : isEssentialPack ? 1024 : 800,
          title: product.name,
          caption: isBusinessCard
            ? 'Carte de visite digitale NFC 5Tap — visuel de présentation.'
            : isEssentialPack
              ? 'Pack Essentiel 5Tap — stand avis Google NFC avec carte Review.'
              : undefined,
          metadata: isBusinessCard
            ? {source: '5Tap supplied product image', usage: 'digital business card gallery'}
            : isEssentialPack
              ? {source: '5Tap approved product visual', usage: 'essential pack gallery'}
              : {source: '5Tap concept image', usage: 'product gallery placeholder'},
        },
      ],
      seo: {
        title: `${product.name} — ${product.price} DH`,
        description: product.desc,
        canonicalPath: `/produit/${product.id}`,
        ogImage: imageUrl,
      },
    };
  }),
  faqs: fallbackFaqs.map(([question, answer]) => [question, answer] as [string, string]),
  settings: fallbackSettings,
  pages: {
    home: {
      title: fallbackSettings.defaultTitle,
      description: fallbackSettings.defaultDescription,
      seo: {canonicalPath: '/'},
    },
    shop: {
      title: 'Boutique NFC — Cartes et packs',
      description:
        'Comparez les cartes et stands NFC 5Tap : 150 à 400 DH. Commande sans compte et paiement à la livraison partout au Maroc.',
      seo: {canonicalPath: '/boutique'},
    },
    faq: {
      title: 'FAQ 5Tap',
      description: 'Réponses sur les cartes NFC, les avis Google, la livraison au Maroc et le paiement à la livraison.',
      seo: {canonicalPath: '/faq'},
    },
    contact: {
      title: 'Contact 5Tap Tanger',
      description: 'Contactez 5Tap sur WhatsApp pour commander une carte NFC, un stand avis Google ou une démo à Tanger.',
      seo: {canonicalPath: '/contact'},
    },
  },
};

export function normalizeSiteData(data: Partial<SiteData> | null | undefined): SiteData {
  if (!data) return fallbackSiteData;
  return {
    products: Array.isArray(data.products) && data.products.length ? data.products : fallbackSiteData.products,
    faqs: Array.isArray(data.faqs) && data.faqs.length ? data.faqs : fallbackSiteData.faqs,
    settings: {...fallbackSiteData.settings, ...(data.settings || {})},
    pages: {...fallbackSiteData.pages, ...(data.pages || {})},
  };
}

export function primaryImage(product: SiteProduct): ProductImage {
  return (
    product.images?.[0] || {
      url: product.imageUrl || '/product-concept.webp',
      alt: product.imageAlt || `Illustration de la gamme 5Tap — ${product.name}`,
      width: 1200,
      height: 800,
      title: product.name,
    }
  );
}


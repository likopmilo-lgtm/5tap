import Store from '../store';
import {getSiteData} from '../supabase-server';
export async function generateMetadata(){const data=await getSiteData();const page=data.pages.shop;return {title:page?.title||'Boutique NFC — Cartes et packs',description:page?.description||data.settings.defaultDescription,alternates:{canonical:page?.seo?.canonicalPath||'/boutique'}}}
export default async function Page(){const data=await getSiteData();return <Store view="shop" initialData={data}/>}

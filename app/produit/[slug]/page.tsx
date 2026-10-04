import Store from '../../store';
import {products as fallbackProducts} from '../../catalog';
import {getProductBySlug,getSiteData} from '../../supabase-server';
import {primaryImage} from '../../site-data';
import {notFound} from 'next/navigation';
export function generateStaticParams(){return fallbackProducts.map(p=>({slug:p.id}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=await getProductBySlug(slug);if(!p)return {title:'Produit 5Tap'};const image=primaryImage(p);return {title:p.seo?.title||`${p.name} — ${p.price} DH`,description:p.seo?.description||p.desc,alternates:{canonical:p.seo?.canonicalPath||`/produit/${p.id}`},openGraph:{title:p.seo?.title||p.name,description:p.seo?.description||p.desc,images:[{url:p.seo?.ogImage||image.url,alt:image.alt,width:image.width||1200,height:image.height||800}]},twitter:{card:'summary_large_image',title:p.seo?.title||p.name,description:p.seo?.description||p.desc,images:[p.seo?.ogImage||image.url]}}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const data=await getSiteData();if(!data.products.some(p=>p.id===slug||p.slug===slug))notFound();return <Store view="product" productId={slug} initialData={data}/>}

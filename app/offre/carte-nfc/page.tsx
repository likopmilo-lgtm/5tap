import NfcLanding from '../../nfc-landing';
import {landingCopy,LandingLanguage} from '../../nfc-landing-copy';
import {getSiteData} from '../../supabase-server';
import {notFound} from 'next/navigation';
import {landingProduct} from '../../nfc-landing-offer';
const path='/offre/carte-nfc';
function language(value:unknown):LandingLanguage{return typeof value==='string'&&Object.prototype.hasOwnProperty.call(landingCopy,value)?value as LandingLanguage:'fr'}
export async function generateMetadata({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const query=await searchParams;const lang=language(query.lang);const data=await getSiteData();const product=data.products.find(p=>p.id==='carte-visite-personnalisee');
  return {title:`${landingCopy[lang].title} — ${product?.price??249} DH`,description:landingCopy[lang].intro,alternates:{canonical:path,languages:{fr:`${path}?lang=fr`,ar:`${path}?lang=ar`,en:`${path}?lang=en`,es:`${path}?lang=es`}},robots:{index:false,follow:true},openGraph:{title:landingCopy[lang].title,description:landingCopy[lang].intro,images:[product?.imageUrl||'/images/carte-visite-personnalisee.webp']}};
}
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const [data,query]=await Promise.all([getSiteData(),searchParams]);const product=data.products.find(p=>p.id==='carte-visite-personnalisee'&&p.isActive!==false&&p.custom);if(!product)notFound();
  const standard=data.products.find(p=>p.id==='carte-visite'&&p.isActive!==false&&!p.custom);
  return <NfcLanding product={landingProduct(product,data.settings)} alternative={standard?landingProduct(standard,data.settings):undefined} settings={data.settings} initialLanguage={language(query.lang)}/>;
}

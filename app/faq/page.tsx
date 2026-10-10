import Store from '../store';
import {getSiteData} from '../supabase-server';
export const metadata={title:'FAQ — Cartes NFC et Google Review',description:'Tout savoir sur les cartes NFC 5Tap, la personnalisation, les paiements et la livraison incluse partout au Maroc.'};
export default async function Page(){const data=await getSiteData();return <Store view="faq" initialData={data}/>}

import Store from '../store';
import {getSiteData} from '../supabase-server';
export const metadata={title:'Contact et démonstration à Tanger',description:'Contactez 5Tap à Tanger au +212 672 606 072 pour une démonstration, une personnalisation ou votre commande NFC.'};
export default async function Page(){const data=await getSiteData();return <Store view="contact" initialData={data}/>}

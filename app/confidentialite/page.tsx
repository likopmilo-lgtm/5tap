import Store from '../store';
import {getSiteData} from '../supabase-server';
export const metadata={title:'Confidentialité et commande'};
export default async function Page(){const data=await getSiteData();return <Store view="privacy" initialData={data}/>}

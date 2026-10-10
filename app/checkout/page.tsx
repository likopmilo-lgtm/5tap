import Store from '../store';
import {getSiteData} from '../supabase-server';
export const metadata={title:'Finaliser ma commande',description:'Finalisez votre commande 5Tap sans créer de compte.',robots:{index:false,follow:false}};
export default async function Page(){const data=await getSiteData();return <Store view="checkout" initialData={data}/>}

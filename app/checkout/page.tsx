import Store from '../store';
import {getSiteData} from '../supabase-server';
export const metadata={title:'Checkout',robots:{index:false,follow:false}};
export default async function Page(){const data=await getSiteData();return <Store view="checkout" initialData={data}/>}

import Store from '../store';
import {getSiteData} from '../supabase-server';
import {CartItem} from '../catalog';
export const metadata={title:'Finaliser ma commande',description:'Finalisez votre commande 5Tap sans créer de compte.',robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const[data,query]=await Promise.all([getSiteData(),searchParams]);const product=typeof query.product==='string'?query.product:'';const quantity=Number(typeof query.quantity==='string'?query.quantity:'1');const initialCheckoutItem:CartItem|null=data.products.some(p=>p.id===product||p.slug===product)&&Number.isInteger(quantity)&&quantity>=1&&quantity<=50?{id:product,quantity}:null;return <Store view="checkout" initialData={data} initialCheckoutItem={initialCheckoutItem}/>}

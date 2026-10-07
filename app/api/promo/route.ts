import {getSiteData} from '../../supabase-server';
import {quotePromo,PromoError} from '../../promotions';
export async function POST(request:Request){
 try{
  if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Origine non autorisée.'},{status:403});
  const raw=await request.text();if(raw.length>4000)return Response.json({error:'Panier invalide.'},{status:413});
  const body=JSON.parse(raw);if(!Array.isArray(body.items)||body.items.length<1||body.items.length>5)throw new PromoError('Panier invalide.');
  const {products}=await getSiteData();const seen=new Set();let subtotal=0;
  for(const item of body.items){const p=products.find(p=>p.id===item?.id);if(!p||seen.has(p.id)||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>50)throw new PromoError('Panier invalide.');seen.add(p.id);subtotal+=p.price*item.quantity;}
  const promo=await quotePromo(body.code,subtotal);if(!promo.code)throw new PromoError('Saisissez votre code promo.');
  return Response.json({...promo,subtotal,total:Math.round((subtotal-promo.discount)*100)/100},{headers:{'Cache-Control':'no-store'}});
 }catch(error){return Response.json({error:error instanceof PromoError?error.message:'Vérification du code indisponible. Réessayez.'},{status:400,headers:{'Cache-Control':'no-store'}})}
}

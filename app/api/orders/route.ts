import {env} from 'cloudflare:workers';
import {getSiteData, hasSupabaseConfig, writeSupabase} from '../../supabase-server';
function fail(message:string,status=400){return Response.json({error:message},{status})}
export async function POST(request:Request){
 try{
  if(request.headers.get('origin') && request.headers.get('origin')!==new URL(request.url).origin)return fail('Origine non autorisée.',403);
  if(Number(request.headers.get('content-length')||0)>16000)return fail('Commande trop volumineuse.',413);
  const raw=await request.text();if(raw.length>16000)return fail('Commande trop volumineuse.',413);
  let b;try{b=JSON.parse(raw)}catch{return fail('Données invalides.')}
  if(!b||typeof b!=='object'||Array.isArray(b))return fail('Données invalides.');
  for(const key of ['id','name','phone','city','address','notes'])if(typeof b[key]!=='string')return fail('Veuillez vérifier vos coordonnées.');
  if(!/^[0-9a-f-]{36}$/i.test(b.id)||b.name.trim().length<2||b.name.length>100||b.city.trim().length<2||b.city.length>100||b.address.trim().length<8||b.address.length>500||b.notes.length>1000||!/^\+?[0-9\s()-]{9,20}$/.test(b.phone))return fail('Veuillez vérifier votre nom, téléphone et adresse.');
  if(b.website)return fail('Commande non acceptée.');
  if(!Array.isArray(b.items)||b.items.length<1||b.items.length>5)return fail('Votre panier est vide ou invalide.');
  const site=await getSiteData();const products=site.products;const ids=new Set();const items=[];
  for(const item of b.items){const p=products.find(p=>p.id===item?.id||p.slug===item?.id);if(!p||ids.has(p.id)||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>50)return fail('Quantité ou produit invalide.');ids.add(p.id);items.push({id:p.id,name:p.name,price:p.price,quantity:item.quantity});}
  const subtotal=items.reduce((s,p)=>s+p.price*p.quantity,0);const city=b.city.trim();const isTangier=['tanger','tangier','طنجة'].includes(city.toLowerCase());const shipping=isTangier?20:40;const total=subtotal+shipping;
  let row:any=null;
  if(hasSupabaseConfig()){
   const order={id:b.id,name:b.name.trim(),phone:b.phone.trim(),city,address:b.address.trim(),items,subtotal,shipping,total,notes:b.notes.trim(),status:'awaiting_whatsapp_confirmation',source:'website',created_at:new Date().toISOString()};
   try{await writeSupabase('orders',order,'return=minimal');row=order;}catch(error){console.error('supabase_order_failed',error instanceof Error?error.message:'Unknown');return fail('La commande est momentanément indisponible. Réessayez ou contactez-nous sur WhatsApp.',503)}
  }else{
  const db=(env as unknown as {DB:D1Database}).DB;if(!db)return fail('La commande est momentanément indisponible. Réessayez ou contactez-nous sur WhatsApp.',503);
  await db.prepare('INSERT INTO orders (id,name,phone,city,address,items,subtotal,shipping,total,notes,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(b.id,b.name.trim(),b.phone.trim(),city,b.address.trim(),JSON.stringify(items),subtotal,shipping,total,b.notes.trim(),'awaiting_whatsapp_confirmation',new Date().toISOString()).run();
  row=await db.prepare('SELECT id,name,phone,city,address,items,subtotal,shipping,total,notes FROM orders WHERE id=?').bind(b.id).first<any>();
  }
  if(!row)return fail('Impossible de confirmer l’enregistrement. Réessayez.',503);
  // A repeated request may only retrieve its own exact payload; never disclose an existing order.
  const storedItems=typeof row.items==='string'?row.items:JSON.stringify(row.items);
  if(row.name!==b.name.trim()||row.phone!==b.phone.trim()||row.address!==b.address.trim()||row.city!==city||storedItems!==JSON.stringify(items)||row.notes!==b.notes.trim())return fail('Cette référence a déjà été utilisée. Rechargez la page pour une nouvelle commande.',409);
  return Response.json({id:row.id,total,shipping},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch(error){console.error('order_failed',error instanceof Error?error.message:'Unknown');return fail('Votre commande n’a pas pu être confirmée. Vos informations sont conservées à l’écran. Réessayez ou contactez-nous sur WhatsApp.',503)}
}

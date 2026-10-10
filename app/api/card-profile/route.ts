import {writeSupabase} from '../../supabase-server';

const codePattern=/^5TAP-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
const fields=['displayName','jobTitle','company','bio','phone','whatsapp','email','website','address','instagram','linkedin','facebook','customLabel','customUrl'] as const;

function fail(error:string,status=400){return Response.json({error},{status,headers:{'Cache-Control':'no-store'}})}
function clean(value:unknown,max:number){return typeof value==='string'?value.trim().slice(0,max):''}

export async function POST(request:Request){
 try{
  if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return fail('Origine non autorisée.',403);
  const raw=await request.text();if(raw.length>20000)return fail('Données trop volumineuses.',413);
  const body=JSON.parse(raw);const code=clean(body.code,32).toUpperCase();const cardSlug=clean(body.cardSlug,64).toLowerCase();
  if(!codePattern.test(code))return fail('Code d’activation invalide.');
  if(body.action==='load'){
   const profile=await writeSupabase('rpc/get_card_profile',{p_activation_code:code});
   if(!profile)return fail('Code introuvable ou désactivé.',404);
   if(cardSlug&&profile.public_slug!==cardSlug)return fail('Ce code ne correspond pas à cette carte.',403);
   return Response.json({profile},{headers:{'Cache-Control':'no-store'}});
  }
  if(body.action!=='save'||!body.profile||typeof body.profile!=='object')return fail('Demande invalide.');
  if(cardSlug){const current=await writeSupabase('rpc/get_card_profile',{p_activation_code:code});if(!current||current.public_slug!==cardSlug)return fail('Ce code ne correspond pas à cette carte.',403)}
  const profile:Record<string,string>={};
  for(const field of fields)profile[field]=clean(body.profile[field],field==='bio'?500:field==='address'?300:field.toLowerCase().includes('url')||['website','linkedin','facebook'].includes(field)?500:200);
  profile.destinationMode=['profile','whatsapp','instagram','custom'].includes(body.profile.destinationMode)?body.profile.destinationMode:'profile';
  if(profile.displayName.length<2)return fail('Ajoutez votre nom complet.');
  const saved=await writeSupabase('rpc/update_card_profile',{p_activation_code:code,p_profile:profile});
  if(!saved)return fail('Code introuvable ou désactivé.',404);
  return Response.json({profile:saved},{headers:{'Cache-Control':'no-store'}});
 }catch(error){console.error('card_profile_failed',error instanceof Error?error.message:'Unknown');return fail('L’espace profil est momentanément indisponible.',503)}
}

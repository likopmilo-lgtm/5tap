import {writeSupabase} from '../../supabase-server';
import {cleanPortfolio,coverNumber,imageData,mediaIdPattern} from '../../profile-media';
import {cleanProfileDocument,PROFILE_REQUEST_MAX_BYTES} from '../../profile-document';

const codePattern=/^5TAP-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
const fields=['displayName','jobTitle','company','bio','phone','whatsapp','email','website','address','mapUrl','instagram','linkedin','facebook','customLabel','customUrl'] as const;
const allowedPlatforms=new Set(['instagram','facebook','linkedin','tiktok','youtube','x','snapchat','telegram','pinterest','github','behance','dribbble','twitch','spotify','other']);

function fail(error:string,status=400){return Response.json({error},{status,headers:{'Cache-Control':'no-store'}})}
function clean(value:unknown,max:number){return typeof value==='string'?value.trim().slice(0,max):''}
function cleanAvatar(value:unknown){const image=clean(value,360000);return /^data:image\/(?:webp|jpeg|png);base64,[a-z0-9+/=]+$/i.test(image)?image:''}
function cleanSocialLinks(value:unknown){
 if(!Array.isArray(value))return [];
 return value.slice(0,12).map(item=>({
  platform:allowedPlatforms.has(clean(item?.platform,20).toLowerCase())?clean(item?.platform,20).toLowerCase():'other',
  label:clean(item?.label,40),url:clean(item?.url,500),
 })).filter(item=>item.url);
}
function toClient(row:Record<string,unknown>){
 const document=row.cv_document?cleanProfileDocument(row.cv_document):null;
 const cvDocument=document?{id:document.id,name:document.name,mimeType:document.mimeType,size:document.size,label:document.label}:null;
 const savedLinks=Array.isArray(row.social_links)?row.social_links:[];
 const legacy=savedLinks.length?savedLinks:[
  row.instagram&&{platform:'instagram',label:'Instagram',url:String(row.instagram)},
  row.linkedin&&{platform:'linkedin',label:'LinkedIn',url:String(row.linkedin)},
  row.facebook&&{platform:'facebook',label:'Facebook',url:String(row.facebook)},
 ].filter(Boolean);
 return {
  publicSlug:String(row.public_slug||''),publishedAt:row.published_at?String(row.published_at):null,
  displayName:String(row.display_name||''),jobTitle:String(row.job_title||''),company:String(row.company||''),bio:String(row.bio||''),
  phone:String(row.phone||''),whatsapp:String(row.whatsapp||''),email:String(row.email||''),website:String(row.website||''),
  address:String(row.address||''),mapUrl:String(row.map_url||''),instagram:String(row.instagram||''),linkedin:String(row.linkedin||''),facebook:String(row.facebook||''),
  customLabel:String(row.custom_label||''),customUrl:String(row.custom_url||''),avatarDataUrl:String(row.avatar_data_url||''),
  socialLinks:legacy,destinationMode:String(row.destination_mode||'profile'),
  coverDataUrl:String(row.cover_data_url||''),coverId:String(row.cover_media_id||''),
  coverHeight:coverNumber(row.cover_height,120,320,180),coverZoom:coverNumber(row.cover_zoom,100,200,100),
  coverPositionX:coverNumber(row.cover_position_x,0,100,50),coverPositionY:coverNumber(row.cover_position_y,0,100,50),
  portfolioImages:Array.isArray(row.portfolio_images)?row.portfolio_images:[],
  cvDocument,
 };
}

export async function POST(request:Request){
 try{
  if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return fail('Origine non autorisée.',403);
  if(Number(request.headers.get('content-length')||0)>PROFILE_REQUEST_MAX_BYTES)return fail('Le profil est trop volumineux. Réduisez la taille du document ou des images.',413);
  const reader=request.body?.getReader();const decoder=new TextDecoder();let raw='',size=0;
  if(reader){while(true){const chunk=await reader.read();if(chunk.done)break;size+=chunk.value.byteLength;if(size>PROFILE_REQUEST_MAX_BYTES){await reader.cancel();return fail('Le profil est trop volumineux. Réduisez la taille du document ou des images.',413)}raw+=decoder.decode(chunk.value,{stream:true})}raw+=decoder.decode()}
  const body=JSON.parse(raw);const code=clean(body.code,32).toUpperCase();const cardSlug=clean(body.cardSlug,64).toLowerCase();
  if(!codePattern.test(code))return fail('Code d’activation invalide.');
  if(body.action==='load'){
   const profile=await writeSupabase('rpc/get_card_profile',{p_activation_code:code}) as Record<string,unknown>|null;
   if(!profile)return fail('Code introuvable ou désactivé.',404);
   if(cardSlug&&profile.public_slug!==cardSlug)return fail('Ce code ne correspond pas à cette carte.',403);
   return Response.json({profile:toClient(profile)},{headers:{'Cache-Control':'no-store'}});
  }
  if(body.action!=='save'||!body.profile||typeof body.profile!=='object')return fail('Demande invalide.');
  if(cardSlug){const current=await writeSupabase('rpc/get_card_profile',{p_activation_code:code});if(!current||current.public_slug!==cardSlug)return fail('Ce code ne correspond pas à cette carte.',403)}
  const profile:Record<string,unknown>={};
  for(const field of fields)profile[field]=clean(body.profile[field],field==='bio'?500:field==='address'?300:field.toLowerCase().includes('url')||['website','linkedin','facebook'].includes(field)?500:200);
  profile.avatarDataUrl=cleanAvatar(body.profile.avatarDataUrl);
  profile.socialLinks=cleanSocialLinks(body.profile.socialLinks);
  if('coverDataUrl' in body.profile){
   const cover=body.profile.coverDataUrl;
   if(cover!==''&&!imageData(cover))return fail('Image de couverture invalide ou trop volumineuse.');
   if(cover&&!mediaIdPattern.test(body.profile.coverId||''))return fail('Référence de couverture invalide.');
   profile.coverDataUrl=cover;profile.coverId=cover?body.profile.coverId:'';
   profile.coverHeight=coverNumber(body.profile.coverHeight,120,320,180);profile.coverZoom=coverNumber(body.profile.coverZoom,100,200,100);
   profile.coverPositionX=coverNumber(body.profile.coverPositionX,0,100,50);profile.coverPositionY=coverNumber(body.profile.coverPositionY,0,100,50);
  }
  if('portfolioImages' in body.profile){try{profile.portfolioImages=cleanPortfolio(body.profile.portfolioImages)}catch(error){return fail(error instanceof Error?error.message:'Portfolio invalide.')}}
  if('cvDocument' in body.profile){try{profile.cvDocument=cleanProfileDocument(body.profile.cvDocument)}catch(error){return fail(error instanceof Error?error.message:'Document invalide.')}}
  profile.destinationMode=['profile','whatsapp','instagram','custom'].includes(body.profile.destinationMode)?body.profile.destinationMode:'profile';
  if(String(profile.displayName).length<2)return fail('Ajoutez votre nom complet.');
  const saved=await writeSupabase('rpc/update_card_profile',{p_activation_code:code,p_profile:profile}) as Record<string,unknown>|null;
  if(!saved)return fail('Code introuvable ou désactivé.',404);
  return Response.json({profile:toClient(saved)},{headers:{'Cache-Control':'no-store'}});
 }catch(error){console.error('card_profile_failed',error instanceof Error?error.message:'Unknown');return fail('L’espace profil est momentanément indisponible.',503)}
}

import {writeSupabase} from '../../../../supabase-server';
import {imageData,mediaIdPattern} from '../../../../profile-media';

export async function GET(_request:Request,{params}:{params:Promise<{slug:string;mediaId:string}>}){
 const {slug,mediaId}=await params;
 if(!/^[a-z0-9-]{3,64}$/.test(slug)||!mediaIdPattern.test(mediaId))return new Response('Image introuvable.',{status:404});
 try{
  const value=await writeSupabase('rpc/get_public_card_media',{p_slug:slug,p_media_id:mediaId});
  const source=imageData(value);if(!source)return new Response('Image introuvable.',{status:404,headers:{'Cache-Control':'no-store'}});
  const [header,data]=source.split(',');const mime=header.slice(5,header.indexOf(';'));
  const bytes=Uint8Array.from(atob(data),char=>char.charCodeAt(0));
  return new Response(bytes,{headers:{'Content-Type':mime,'Cache-Control':'public, max-age=300, must-revalidate','X-Content-Type-Options':'nosniff'}});
 }catch{return new Response('Image momentanément indisponible.',{status:503,headers:{'Cache-Control':'no-store'}})}
}

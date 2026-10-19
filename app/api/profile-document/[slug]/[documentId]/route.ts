import {writeSupabase} from '../../../../supabase-server';
import {parseProfileDocument,documentDisposition} from '../../../../profile-document';

const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow, noarchive'};
export async function GET(request:Request,{params}:{params:Promise<{slug:string;documentId:string}>}){
 const {slug,documentId}=await params;
 if(!/^[a-z0-9-]{3,64}$/.test(slug)||!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(documentId))return new Response('Document introuvable.',{status:404,headers});
 try{
  const value=await writeSupabase('rpc/get_public_card_document',{p_slug:slug,p_document_id:documentId});
  if(!value)return new Response('Document introuvable.',{status:404,headers});
  const {document,bytes}=parseProfileDocument(value);
  if(!document?.dataUrl||!bytes||document.id!==documentId)return new Response('Document introuvable.',{status:404,headers});
  return new Response(bytes,{headers:{...headers,'Content-Type':document.mimeType,'Content-Length':String(bytes.length),'Content-Disposition':documentDisposition(document,new URL(request.url).searchParams.get('download')==='1'),'Content-Security-Policy':'sandbox','Referrer-Policy':'no-referrer'}});
 }catch{return new Response('Document momentanément indisponible.',{status:503,headers})}
}

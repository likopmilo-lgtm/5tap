import {getPublicCardProfile} from '../../../card-profile';
import {buildContactVCard,contactFilename,contactPhoto} from '../../../contact-vcard';

type Context={params:Promise<{slug:string}>};
async function download({params}:Context,photo?:string){
 const{slug}=await params;const profile=await getPublicCardProfile(slug);if(!profile)return new Response('Profil introuvable',{status:404});
 return new Response(buildContactVCard(profile,photo),{headers:{'Content-Type':'text/vcard; charset=utf-8','Content-Disposition':`attachment; filename="${contactFilename(profile.display_name)}"`,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}

export async function GET(_request:Request,context:Context){return download(context)}

export async function POST(request:Request,context:Context){
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return new Response('Origine non autorisée.',{status:403});
 if(Number(request.headers.get('content-length')||0)>600000)return new Response('Photo trop volumineuse.',{status:413});
 if(!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded'))return new Response('Format invalide.',{status:415});
 const body=await request.text();if(body.length>600000)return new Response('Photo trop volumineuse.',{status:413});
 const photo=new URLSearchParams(body).get('photo')||'';
 const image=contactPhoto(photo);if(!image||!['JPEG','PNG'].includes(image.type))return new Response('Photo invalide.',{status:400});
 return download(context,photo);
}

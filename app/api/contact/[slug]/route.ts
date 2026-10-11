import {getPublicCardProfile} from '../../../card-profile';

function v(value:string){return value.replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/([,;])/g,'\\$1')}
export async function GET(_request:Request,{params}:{params:Promise<{slug:string}>}){
 const{slug}=await params;const profile=await getPublicCardProfile(slug);if(!profile)return new Response('Profil introuvable',{status:404});
 const lines=['BEGIN:VCARD','VERSION:3.0',`FN:${v(profile.display_name)}`];
 if(profile.company)lines.push(`ORG:${v(profile.company)}`);
 if(profile.job_title)lines.push(`TITLE:${v(profile.job_title)}`);
 if(profile.phone)lines.push(`TEL;TYPE=CELL:${v(profile.phone)}`);
 if(profile.whatsapp&&profile.whatsapp!==profile.phone)lines.push(`TEL;TYPE=CELL:${v(profile.whatsapp)}`);
 if(profile.email)lines.push(`EMAIL;TYPE=INTERNET:${v(profile.email)}`);
 if(profile.website)lines.push(`URL:${v(profile.website)}`);
 if(profile.address)lines.push(`ADR;TYPE=WORK:;;${v(profile.address)};;;;`);
 if(profile.bio)lines.push(`NOTE:${v(profile.bio)}`);
 lines.push(`URL:https://5tap.ma/p/${profile.public_slug}`,'END:VCARD');
 const safeName=profile.display_name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase()||'contact-5tap';
 return new Response(lines.join('\r\n'),{headers:{'Content-Type':'text/vcard; charset=utf-8','Content-Disposition':`attachment; filename="${safeName}.vcf"`,'Cache-Control':'public, max-age=300'}});
}

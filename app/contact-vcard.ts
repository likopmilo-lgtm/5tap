import type {PublicCardProfile} from './card-profile';

function escapeValue(value:string){return value.replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/([,;])/g,'\\$1')}

// vCard 3.0 uses CRLF and continuation lines of at most 75 UTF-8 octets.
function foldLine(value:string){
 const lines:string[]=[];let line='',bytes=0;
 for(const char of value){
  const code=char.codePointAt(0)!;const size=code<0x80?1:code<0x800?2:code<0x10000?3:4;
  if(bytes+size>75){lines.push(line);line=' ';bytes=1}
  line+=char;bytes+=size;
 }
 lines.push(line);return lines.join('\r\n');
}

export function contactPhoto(value:string){
 if(value.length>360000)return null;
 const match=/^data:image\/(jpeg|png|webp);base64,([a-z0-9+/]+={0,2})$/i.exec(value);
 if(!match)return null;
 const type=match[1].toUpperCase(),data=match[2];
 if(type==='JPEG'&&!data.startsWith('/9j/'))return null;
 if(type==='PNG'&&!data.startsWith('iVBORw0KGgo'))return null;
 if(type==='WEBP'&&!data.startsWith('UklGR'))return null;
 return {type,data};
}

export function buildContactVCard(profile:PublicCardProfile,photo=profile.avatar_data_url||''){
 const v=escapeValue;
 const lines=['BEGIN:VCARD','VERSION:3.0',`N:;${v(profile.display_name)};;;`,`FN:${v(profile.display_name)}`];
 if(profile.company)lines.push(`ORG:${v(profile.company)}`);
 if(profile.job_title)lines.push(`TITLE:${v(profile.job_title)}`);
 if(profile.phone)lines.push(`TEL;TYPE=CELL:${v(profile.phone)}`);
 if(profile.whatsapp&&profile.whatsapp!==profile.phone)lines.push(`TEL;TYPE=CELL:${v(profile.whatsapp)}`);
 if(profile.email)lines.push(`EMAIL;TYPE=INTERNET:${v(profile.email)}`);
 if(profile.website)lines.push(`URL:${v(profile.website)}`);
 if(profile.address)lines.push(`ADR;TYPE=WORK:;;${v(profile.address)};;;;`);
 if(profile.bio)lines.push(`NOTE:${v(profile.bio)}`);
 const image=contactPhoto(photo);
 if(image)lines.push(`PHOTO;ENCODING=b;TYPE=${image.type}:${image.data}`);
 lines.push(`URL:https://5tap.ma/p/${profile.public_slug}`,'END:VCARD');
 return lines.map(foldLine).join('\r\n')+'\r\n';
}

export function contactFilename(name:string){return (name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase()||'contact-5tap')+'.vcf'}

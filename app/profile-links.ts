export function externalUrl(value:string){if(!value)return '';const candidate=/^https?:\/\//i.test(value)?value:`https://${value}`;try{const url=new URL(candidate);return ['http:','https:'].includes(url.protocol)?url.href:''}catch{return ''}}
export function whatsappUrl(value:string){let digits=value.replace(/\D/g,'');if(/^0[5-7]\d{8}$/.test(digits))digits=`212${digits.slice(1)}`;else if(/^[5-7]\d{8}$/.test(digits))digits=`212${digits}`;return digits?`https://wa.me/${digits}`:''}
export function instagramUrl(value:string){if(!value)return '';if(/^https?:\/\//i.test(value))return externalUrl(value);return `https://instagram.com/${value.replace(/^@/,'')}`}
export function mapsUrl(profile:{map_url:string}){return externalUrl(profile.map_url)}

export function tiktokUrl(value:string){
 const input=value.trim();if(!input)return '';
 if(/^https?:\/\//i.test(input)||/^(?:[a-z0-9-]+\.)*tiktok\.com(?:[/:?#]|$)/i.test(input)){
  try{
   const url=new URL(/^https?:\/\//i.test(input)?input:`https://${input}`);
   if(url.username||url.password||url.port||!(url.hostname==='tiktok.com'||url.hostname.endsWith('.tiktok.com')))return '';
   url.protocol='https:';return url.href;
  }catch{return ''}
 }
 const username=input.replace(/^@/,'');
 return /^[a-z0-9_.]+$/i.test(username)?`https://www.tiktok.com/@${username}`:'';
}

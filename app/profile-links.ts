export function externalUrl(value:string){if(!value)return '';const candidate=/^https?:\/\//i.test(value)?value:`https://${value}`;try{const url=new URL(candidate);return ['http:','https:'].includes(url.protocol)?url.href:''}catch{return ''}}
export function whatsappUrl(value:string){let digits=value.replace(/\D/g,'');if(/^0[5-7]\d{8}$/.test(digits))digits=`212${digits.slice(1)}`;else if(/^[5-7]\d{8}$/.test(digits))digits=`212${digits}`;return digits?`https://wa.me/${digits}`:''}
export function instagramUrl(value:string){if(!value)return '';if(/^https?:\/\//i.test(value))return externalUrl(value);return `https://instagram.com/${value.replace(/^@/,'')}`}
export function mapsUrl(profile:{map_url:string}){return externalUrl(profile.map_url)}

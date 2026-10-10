import {writeSupabase} from './supabase-server';

export type PublicCardProfile={public_slug:string;display_name:string;job_title:string;company:string;bio:string;phone:string;whatsapp:string;email:string;website:string;address:string;instagram:string;linkedin:string;facebook:string;custom_label:string;custom_url:string;destination_mode:'profile'|'whatsapp'|'instagram'|'custom';is_active:boolean;published_at:string|null};

export async function getPublicCardProfile(slug:string){
 try{return await writeSupabase('rpc/get_public_card_profile',{p_slug:slug}) as PublicCardProfile|null}catch{return null}
}
export function externalUrl(value:string){if(!value)return '';const candidate=/^https?:\/\//i.test(value)?value:`https://${value}`;try{const url=new URL(candidate);return ['http:','https:'].includes(url.protocol)?url.href:''}catch{return ''}}
export function whatsappUrl(value:string){const digits=value.replace(/\D/g,'');return digits?`https://wa.me/${digits}`:''}
export function instagramUrl(value:string){if(!value)return '';if(/^https?:\/\//i.test(value))return externalUrl(value);return `https://instagram.com/${value.replace(/^@/,'')}`}
export function destinationUrl(profile:PublicCardProfile){if(profile.destination_mode==='whatsapp')return whatsappUrl(profile.whatsapp);if(profile.destination_mode==='instagram')return instagramUrl(profile.instagram);if(profile.destination_mode==='custom')return externalUrl(profile.custom_url);return ''}

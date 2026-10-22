import {writeSupabase} from './supabase-server';
import {externalUrl,instagramUrl,whatsappUrl} from './profile-links';
import type {PortfolioImage} from './profile-media';
import type {ProfileDocument} from './profile-document';
export {externalUrl,instagramUrl,mapsUrl,whatsappUrl} from './profile-links';

export type SocialLink={platform:string;label:string;url:string};
export type PublicCardProfile={
 public_slug:string;display_name:string;job_title:string;company:string;bio:string;
 phone:string;whatsapp:string;email:string;website:string;address:string;map_url:string;
 instagram:string;linkedin:string;facebook:string;custom_label:string;custom_url:string;
 avatar_data_url:string;social_links:SocialLink[];
 cover_media_id?:string;cover_height?:number;cover_zoom?:number;cover_position_x?:number;cover_position_y?:number;
 cover_fit?:'cover'|'contain';
 portfolio_images?:PortfolioImage[];
 cv_document?:ProfileDocument|null;
 destination_mode:'profile'|'whatsapp'|'instagram'|'custom';is_active:boolean;published_at:string|null;
};

export async function getPublicCardProfile(slug:string){
 try{return await writeSupabase('rpc/get_public_card_profile',{p_slug:slug}) as PublicCardProfile|null}catch{return null}
}
export function destinationUrl(profile:PublicCardProfile){if(profile.destination_mode==='whatsapp')return whatsappUrl(profile.whatsapp);if(profile.destination_mode==='instagram')return instagramUrl(profile.instagram);if(profile.destination_mode==='custom')return externalUrl(profile.custom_url);return ''}

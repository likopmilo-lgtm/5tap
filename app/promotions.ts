import {hasSupabaseConfig,writeSupabase} from './supabase-server';
export class PromoError extends Error {}
export function normalizePromo(value:unknown){if(value===undefined||value===null||value==='')return '';if(typeof value!=='string'||value.length>32)throw new PromoError('Code promo invalide.');const code=value.trim().toUpperCase();if(!/^[A-Z0-9_-]{1,32}$/.test(code))throw new PromoError('Code promo invalide.');return code}
export async function quotePromo(value:unknown,subtotal:number){
 const code=normalizePromo(value);if(!code)return {code:'',discount:0};
 if(!Number.isFinite(subtotal)||subtotal<=0)throw new PromoError('Panier invalide.');
 if(hasSupabaseConfig()){
  try{
   const result=await writeSupabase('rpc/quote_promo',{p_code:code,p_subtotal:subtotal});
   if(!result||!Number.isFinite(Number(result.discount))||Number(result.discount)<=0||Number(result.discount)>subtotal)throw new PromoError('Code promo invalide ou non applicable.');
   const total=Math.floor(subtotal-Number(result.discount));
   return {code,discount:subtotal-total};
  }catch(error){
   if(error instanceof PromoError)throw error;
   // Only the missing migration enables the user-approved launch promotion.
   // Once installed, Supabase is authoritative, including disabled codes.
   if(!(error instanceof Error)||!error.message.includes('PGRST202'))throw new PromoError('Vérification du code indisponible. Réessayez.');
  }
 }
 if(code!=='STATI')throw new PromoError('Code promo invalide ou non applicable.');
 const total=Math.floor(subtotal*0.85);
 return {code,discount:subtotal-total};
}

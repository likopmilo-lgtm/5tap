import {orderWhatsAppText} from './pricing';
import {landingCopy,type LandingLanguage} from './nfc-landing-copy';

export type SavedLandingOrder={id:string;items:{id:string;name:string;price:number;quantity:number}[];subtotal:number;shipping:number;total:number};
export type LandingOrderConfirmation=SavedLandingOrder&{whatsappUrl:string};
type ConfirmationStorage=Pick<Storage,'getItem'|'setItem'|'removeItem'>;
const confirmationKey='5tap-nfc-order-confirmation';

export function clearLandingConfirmation(storage:ConfirmationStorage){try{storage.removeItem(confirmationKey)}catch{}}
export function rememberLandingConfirmation(storage:ConfirmationStorage,productId:string,result:LandingOrderConfirmation,now=Date.now()){
 try{storage.setItem(confirmationKey,JSON.stringify({productId,result,savedAt:now}))}catch{}
}
export function restoreLandingConfirmation(storage:ConfirmationStorage,allowedProducts:string[],now=Date.now()):{productId:string;result:LandingOrderConfirmation}|null{
 try{
  const saved=JSON.parse(storage.getItem(confirmationKey)||'null'),order=saved?.result;
  const url=new URL(order?.whatsappUrl||'');
  if(!allowedProducts.includes(saved.productId)||!Number.isFinite(saved.savedAt)||saved.savedAt>now||now-saved.savedAt>30*60*1000||!/^[0-9a-f-]{36}$/i.test(order.id)||!Array.isArray(order.items)||order.items.length!==1||!order.items.every((item:SavedLandingOrder['items'][number])=>item.id===saved.productId&&Number.isInteger(item.quantity)&&item.quantity>=1&&item.quantity<=50&&Number.isFinite(item.price)&&item.price>=0)||![order.subtotal,order.shipping,order.total].every(value=>Number.isFinite(value)&&value>=0)||url.protocol!=='https:'||!['wa.me','api.whatsapp.com','web.whatsapp.com'].includes(url.hostname))throw new Error('Invalid or expired confirmation');
  return {productId:saved.productId,result:order};
 }catch{clearLandingConfirmation(storage);return null}
}

export function landingConfirmation(order:SavedLandingOrder,customer:{name:string;phone:string;city:string},custom:boolean,language:LandingLanguage,destination:string){
 const t=landingCopy[language];
 const reference='5TAP-'+order.id.replace(/-/g,'').slice(0,6).toUpperCase();
 const text=orderWhatsAppText({
  ...customer,...order,reference,
  items:order.items.map(item=>({...item,name:custom?t.title:t.standardTitle})),
  personalization:custom?t.customIncludes[0]:t.standardIncludes[0],
  paymentTerms:custom?t.customPayment:t.standardPayment,
 },language);
 let url:URL;
 try{
  url=new URL(destination);
  if(url.protocol!=='https:'||!['wa.me','api.whatsapp.com','web.whatsapp.com'].includes(url.hostname))throw new Error('Invalid WhatsApp destination');
 }catch{url=new URL('https://wa.me/212672606072')}
 url.searchParams.set('text',text);
 return {reference,whatsappUrl:url.href};
}

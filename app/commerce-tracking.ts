// Customer contact details and activation links must never enter advertising events.
export type CommerceEvent = 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Lead' | 'Contact';
type Item = {id:string; price:number; quantity:number};
export type TrackingConfig = {metaPixelId?:string; googleAnalyticsId?:string; googleTagManagerId?:string};
type TrackerWindow = Window & {
  fbq?: ((...args:unknown[])=>void) & {queue?:unknown[][]; loaded?:boolean; version?:string; callMethod?:(...args:unknown[])=>void; push?:unknown};
  _fbq?: unknown;
  gtag?: (...args:unknown[])=>void;
  dataLayer?: unknown[];
};
const seen = new Set<string>();
let active = false;
let currentConsent:'granted'|'denied'|null=null;
let initializedPixel='',initializedGA='',initializedGTM='';
let config:TrackingConfig = {};
const queue:{event:CommerceEvent;items:Item[];eventId?:string}[] = [];
const consentKey = '5tap-marketing-consent-v1';

export function sanitizeTrackingConfig(value:TrackingConfig):TrackingConfig {
  return {
    metaPixelId: /^\d{5,25}$/.test(value.metaPixelId||'') ? value.metaPixelId : undefined,
    googleAnalyticsId: /^G-[A-Z0-9]{4,20}$/.test(value.googleAnalyticsId||'') ? value.googleAnalyticsId : undefined,
    googleTagManagerId: /^GTM-[A-Z0-9]{4,20}$/.test(value.googleTagManagerId||'') ? value.googleTagManagerId : undefined,
  };
}
export function isCommercePath(path:string) {
  return ['/', '/boutique', '/checkout', '/panier', '/contact', '/faq', '/confidentialite', '/offre/carte-nfc'].includes(path)
    || /^\/produit\/[a-z0-9-]+\/?$/.test(path);
}
export function marketingConsent(): 'granted'|'denied'|null {
  if(currentConsent)return currentConsent;
  try {const value=localStorage.getItem(consentKey);return value==='granted'||value==='denied'?value:null} catch {return null}
}
export function saveMarketingConsent(value:'granted'|'denied') {
  currentConsent=value;
  try {localStorage.setItem(consentKey,value)} catch { /* The current choice still works without storage. */ }
  if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('5tap-consent',{detail:value}));
}
export function commercePayload(items:Item[]) {
  const clean=items.filter(p=>/^[a-z0-9-]{1,100}$/.test(p.id)&&Number.isFinite(p.price)&&p.price>=0&&Number.isInteger(p.quantity)&&p.quantity>0&&p.quantity<=50);
  return {content_type:'product',content_ids:clean.map(p=>p.id),contents:clean.map(p=>({id:p.id,quantity:p.quantity,item_price:p.price})),num_items:clean.reduce((n,p)=>n+p.quantity,0),value:Math.round(clean.reduce((n,p)=>n+p.price*p.quantity,0)*100)/100,currency:'MAD'};
}
function emit(event:CommerceEvent,items:Item[],eventId?:string) {
  try {
  const w=window as TrackerWindow;
  const data=commercePayload(items);
  if(config.metaPixelId)w.fbq?.('track',event,data,...(eventId?[{eventID:eventId}]:[]));
  const names:Record<CommerceEvent,string>={ViewContent:'view_item',AddToCart:'add_to_cart',InitiateCheckout:'begin_checkout',Lead:'generate_lead',Contact:'contact'};
  const analytics={currency:'MAD',value:data.value,items:data.contents.map(p=>({item_id:p.id,price:p.item_price,quantity:p.quantity})),...(eventId?{event_id:eventId}:{})};
  if(config.googleAnalyticsId)w.gtag?.('event',names[event],analytics);
  if(config.googleTagManagerId)w.dataLayer?.push({event:`5tap_${names[event]}`,ecommerce:analytics});
  } catch { /* Advertising tools must never interrupt a customer's order. */ }
}
export function trackCommerce(event:CommerceEvent,items:Item[],options:{once?:string;eventId?:string}={}) {
  if(typeof window==='undefined'||!isCommercePath(window.location.pathname)||!['ViewContent','AddToCart','InitiateCheckout','Lead','Contact'].includes(event))return;
  if(options.once&&seen.has(options.once))return;
  if(options.once)seen.add(options.once);
  // No historical advertising events are retained after an explicit refusal.
  if(marketingConsent()==='denied')return;
  const safeItems=commercePayload(items).contents.map(p=>({id:p.id,quantity:p.quantity,price:p.item_price}));
  if(active)emit(event,safeItems,options.eventId);
  else if(queue.length<30)queue.push({event,items:safeItems,eventId:options.eventId});
}
function addScript(id:string,src:string) {
  if(document.getElementById(id))return;
  const script=document.createElement('script');script.id=id;script.async=true;script.src=src;document.head.appendChild(script);
}
export function startMarketingTracking(settings:TrackingConfig) {
  if(typeof window==='undefined'||active||marketingConsent()!=='granted'||!isCommercePath(window.location.pathname))return;
  config=sanitizeTrackingConfig(settings);
  if(!Object.values(config).some(Boolean))return;
  const w=window as TrackerWindow;
  if(config.metaPixelId) {
    if(!w.fbq) {
      const fbq=((...args:unknown[])=>{if(fbq.callMethod)fbq.callMethod(...args);else fbq.queue!.push(args)}) as NonNullable<TrackerWindow['fbq']>;
      fbq.queue=[];fbq.loaded=true;fbq.version='2.0';fbq.push=fbq;w.fbq=fbq;w._fbq=fbq;
      addScript('5tap-meta-pixel','https://connect.facebook.net/en_US/fbevents.js');
    }
    w.fbq('consent','grant');
    if(initializedPixel!==config.metaPixelId){w.fbq('init',config.metaPixelId);w.fbq('set','autoConfig',false,config.metaPixelId);w.fbq('track','PageView');initializedPixel=config.metaPixelId;}
  }
  if(config.googleAnalyticsId||config.googleTagManagerId)w.dataLayer ||= [];
  if(config.googleAnalyticsId) {
    w.gtag ||= function(){w.dataLayer!.push(arguments)};
    addScript('5tap-google-analytics',`https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`);
    w.gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});
    if(initializedGA!==config.googleAnalyticsId){w.gtag('js',new Date());w.gtag('config',config.googleAnalyticsId,{send_page_view:false});w.gtag('event','page_view',{page_path:window.location.pathname});initializedGA=config.googleAnalyticsId;}
  }
  if(config.googleTagManagerId) {
    if(initializedGTM!==config.googleTagManagerId){w.dataLayer!.push({'gtm.start':Date.now(),event:'gtm.js'});addScript('5tap-google-tag-manager',`https://www.googletagmanager.com/gtm.js?id=${config.googleTagManagerId}`);initializedGTM=config.googleTagManagerId;}
  }
  active=true;
  for(const entry of queue.splice(0))emit(entry.event,entry.items,entry.eventId);
}
export function stopMarketingTracking() {
  active=false;queue.length=0;
  if(typeof window!=='undefined') {
    const w=window as TrackerWindow;
    w.fbq?.('consent','revoke');
    w.gtag?.('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  }
}

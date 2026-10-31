'use client';
import {FormEvent,useEffect,useRef,useState} from 'react';
import {ArrowRight,Check,CheckCircle2,ChevronDown,Mail,MessageCircle,Nfc,Phone,QrCode,ShieldCheck,Truck,UserRound} from 'lucide-react';
import {InstagramIcon} from './profile-brand-icons';
import {Flag} from './language-flag';
import {primaryImage,SiteProduct,SiteSettings} from './site-data';
import {compareAtPrice,deliveryFee,orderTotals} from './pricing';
import {trackCommerce} from './commerce-tracking';
import {landingCopy,LandingLanguage} from './nfc-landing-copy';
import './nfc-landing.css';
type OrderResult={id:string;items:{id:string;name:string;price:number;quantity:number}[];subtotal:number;shipping:number;total:number};
const locale={fr:'fr-MA',ar:'ar-MA',en:'en-GB',es:'es-ES'};
function newOrderId(){
 if(typeof crypto.randomUUID==='function')return crypto.randomUUID();
 const bytes=crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
 const hex=Array.from(bytes,value=>value.toString(16).padStart(2,'0')).join('');
 return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
export default function NfcLanding({product:initialProduct,alternative,settings,initialLanguage='fr'}:{product:SiteProduct;alternative?:SiteProduct;settings:SiteSettings;initialLanguage?:LandingLanguage}){
 const [lang,setLang]=useState(initialLanguage),[product,setProduct]=useState(initialProduct),[gallery,setGallery]=useState<'card'|'profile'>('card'),[quantity,setQuantity]=useState(1),[city,setCity]=useState(''),[shippingSettings,setShippingSettings]=useState(settings);
 const [busy,setBusy]=useState(false),[error,setError]=useState<''|'error'|'priceChanged'>(''),[result,setResult]=useState<OrderResult|null>(null),[formInView,setFormInView]=useState(false);
 const busyRef=useRef(false),requestId=useRef(''),lastPayload=useRef(''),successRef=useRef<HTMLDivElement>(null),formArea=useRef<HTMLDivElement>(null);
 const t=landingCopy[lang],image=primaryImage(product),old=compareAtPrice(product),custom=product.custom;
 const productTitle=custom?t.title:t.standardTitle,productLabel=custom?t.custom:t.standard;
 const imageAlt=lang==='fr'?image.alt:`${productLabel} · NFC + QR`;
 const subtotal=product.price*quantity,shipping=deliveryFee(shippingSettings,city),{total}=orderTotals(subtotal,shipping);
 const freeEverywhere=deliveryFee(shippingSettings)===0&&deliveryFee(shippingSettings,'Tanger')===0;
 const money=(n:number)=>`${n.toLocaleString(locale[lang],{maximumFractionDigits:2})} DH`;
 const item=[{id:product.id,price:product.price,quantity}],whatsapp=settings.whatsappUrl||'https://wa.me/212672606072';
 useEffect(()=>{document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.title=`${productTitle} — ${product.price} DH | 5Tap`;document.querySelector('meta[name="description"]')?.setAttribute('content',custom?t.intro:t.standardIntro);try{localStorage.setItem('5tap-lang',lang)}catch{}window.dispatchEvent(new CustomEvent('5tap-language',{detail:lang}));},[lang,product.price,productTitle,t,custom]);
 useEffect(()=>{trackCommerce('ViewContent',[{id:product.id,price:product.price,quantity:1}],{once:'landing-view:'+product.id})},[product.id,product.price]);
 useEffect(()=>{if(!formArea.current||typeof IntersectionObserver==='undefined')return;const observer=new IntersectionObserver(entries=>setFormInView(entries[0].isIntersecting),{threshold:.05});observer.observe(formArea.current);return()=>observer.disconnect()},[]);
 useEffect(()=>{if(result){successRef.current?.focus();successRef.current?.scrollIntoView({block:'center',behavior:'auto'})}},[result]);
 function chooseLanguage(code:LandingLanguage){setLang(code);const url=new URL(location.href);url.searchParams.set('lang',code);history.replaceState(null,'',url)}
 function chooseVersion(next:SiteProduct){if(busy||result)return;setProduct(next);setGallery('card');setError('')}
 function begin(){trackCommerce('InitiateCheckout',item,{once:'landing-checkout:'+product.id})}
 function support(){trackCommerce('Contact',item)}
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(busyRef.current)return;busyRef.current=true;setBusy(true);setError('');begin();
  const form=new FormData(e.currentTarget),name=String(form.get('name')||'').trim(),phone=String(form.get('phone')||'').trim();
  const notes=`Landing carte NFC. Personnalisation : ${custom?'oui, logo client ; visuel à valider avant préparation.':'non, logo 5Tap.'} Paiement : ${custom?'avance requise ; montant et moyen à confirmer avec le client.':'à la livraison.'} Le support doit contacter le client pour confirmer l’adresse et les détails.`;
  const data={name,phone,city:city.trim(),address:`Ville : ${city.trim()}. Adresse complète à confirmer avec le support.`,notes,website:form.get('website'),items:[{id:product.id,quantity}],expectedTotal:total};
  const signature=JSON.stringify(data);const controller=new AbortController();let timeout:ReturnType<typeof setTimeout>|undefined;
  try{
   if(signature!==lastPayload.current){requestId.current=newOrderId();lastPayload.current=signature}
   timeout=setTimeout(()=>controller.abort(),20000);
   const response=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,id:requestId.current}),signal:controller.signal});
   const saved=await response.json() as OrderResult&{code?:string;unitPrice?:number};
   if(!response.ok){if(saved.code==='PRICE_CHANGED'&&Number.isFinite(saved.unitPrice)&&Number.isFinite(saved.shipping)){setProduct(p=>({...p,price:saved.unitPrice!}));setShippingSettings(s=>({...s,tangierShipping:saved.shipping,moroccoShipping:saved.shipping}));throw new Error('PRICE_CHANGED')}throw new Error('ORDER_FAILED')}
   if(!saved.id||!Array.isArray(saved.items)||!Number.isFinite(saved.total))throw new Error('ORDER_FAILED');
   setResult(saved);trackCommerce('Lead',saved.items,{once:`order:${saved.id}`,eventId:`order-${saved.id}`});
   void fetch('/api/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'order_request',path:'/offre/carte-nfc',productId:product.id,payload:{orderId:saved.id,value:saved.total,currency:'MAD',quantity,language:lang}}),keepalive:true}).catch(()=>{});
  }catch(error){setError(error instanceof Error&&error.message==='PRICE_CHANGED'?'priceChanged':'error')}finally{if(timeout)clearTimeout(timeout);busyRef.current=false;setBusy(false)}
 }
 const price=<div className="nfc-price-row"><div className="nfc-current-price"><strong><bdi>{money(product.price)}</bdi></strong>{old&&<del><bdi>{money(old)}</bdi></del>}<span>{t.each}</span></div>{old&&<span className="nfc-savings"><bdi>−{money(old-product.price)}</bdi></span>}</div>;
 const profileExample=<div className="nfc-example-card"><div className="nfc-example-cover"><Nfc size={24}/><span>5Tap</span></div><div className="nfc-example-body"><div className="nfc-example-avatar"><UserRound size={35}/></div><h3>{t.previewName}</h3><p>{t.previewJob}</p><div className="nfc-example-save"><UserRound size={17}/>{t.saveContact}</div><div className="nfc-example-socials"><span><Phone/>{t.call}</span><span><MessageCircle/>WhatsApp</span><span><InstagramIcon/>Instagram</span></div><div className="nfc-example-email"><Mail size={18}/>contact@example.com</div></div></div>;
 return <div className="nfc-landing" data-no-translate lang={lang} dir={lang==='ar'?'rtl':'ltr'}>
  <div className="nfc-top"><Truck size={15}/>{freeEverywhere?t.free:t.delivery}</div>
  <header className="nfc-header"><div className="nfc-container"><a href="/" aria-label="5Tap"><img src="/logo-5tap.png" width="150" height="60" alt="5Tap"/></a><a href="#questions" className="nfc-header-help">{t.faqLink}</a><nav className="nfc-languages" aria-label="Language">{(['fr','ar','en','es'] as const).map(code=><button key={code} type="button" className={lang===code?'selected':''} aria-pressed={lang===code} aria-label={{fr:'Français',ar:'العربية · الدارجة',en:'English',es:'Español'}[code]} onClick={()=>chooseLanguage(code)}><Flag code={code}/>{code.toUpperCase()}</button>)}</nav></div></header>
  <main>
   <section className="nfc-container nfc-product-layout">
    <div className="nfc-gallery-column">
     <div className={'nfc-gallery-main '+(gallery==='profile'?'is-profile':'')} id="nfc-product-gallery">{gallery==='card'?<><img src={image.url} alt={imageAlt} width={image.width||1536} height={image.height||1024} fetchPriority="high"/><span className="nfc-gallery-label"><Nfc size={16}/>NFC + QR</span></>:<figure className="nfc-profile-example"><figcaption>{t.preview}</figcaption>{profileExample}</figure>}</div>
     <div className="nfc-gallery-tabs" role="group" aria-label={lang==='ar'?'صور المنتوج':lang==='en'?'Product views':lang==='es'?'Vistas del producto':'Vues du produit'}><button type="button" aria-pressed={gallery==='card'} onClick={()=>setGallery('card')}><img src={image.url} alt="" width="70" height="46"/>{t.cardView}</button><button type="button" aria-pressed={gallery==='profile'} onClick={()=>setGallery('profile')}><span className="nfc-profile-thumb"><UserRound size={24}/></span>{t.profileView}</button></div>
     <div className="nfc-gallery-notes"><details open><summary>{t.cardDetail}<ChevronDown size={18}/></summary><ul>{(custom?t.customIncludes:t.standardIncludes).map(label=><li key={label}><Check size={16}/>{label}</li>)}</ul></details><details><summary>{t.profileDetail}<ChevronDown size={18}/></summary><p>{t.profileText}</p></details><details><summary>{t.deliveryDetail}<ChevronDown size={18}/></summary><p>{custom?t.customTiming:t.standardTiming}</p><p>{custom?t.customSupport:t.standardSupport}</p></details></div>
    </div>
    <article className="nfc-purchase-card" id="commander">
     <p className="nfc-eyebrow"><span/>{custom?t.eyebrow:t.standardEyebrow}</p><h1>{productTitle}</h1><p className="nfc-intro">{custom?t.intro:t.standardIntro}</p>
     <div className="nfc-quick-features">{t.features.map((label,index)=><span key={label}>{index===0?<Nfc size={15}/>:index===1?<UserRound size={15}/>:<CheckCircle2 size={15}/>} {label}</span>)}</div>
     <div className="nfc-offer"><div className="nfc-offer-top"><span>{t.offer}</span>{custom&&<strong>{t.recommended}</strong>}</div>{price}<p className="nfc-delivery-tag"><Truck size={15}/>{freeEverywhere?t.free:t.delivery}</p></div>
     {alternative&&!result&&<fieldset className="nfc-version-picker" aria-label={t.version}><legend>{t.version}</legend><div className="nfc-version-options">{[initialProduct,alternative].map(p=><label key={p.id}><input type="radio" name="card-version" value={p.id} checked={product.id===p.id} disabled={busy} onChange={()=>chooseVersion(p)}/><span><strong>{p.custom?t.custom:t.standard}</strong><small>{p.custom?t.customIncludes[0]:t.standardIncludes[0]}</small></span><span className="nfc-version-price"><strong><bdi>{money(p.price)}</bdi></strong>{compareAtPrice(p)&&<del><bdi>{money(compareAtPrice(p)!)}</bdi></del>}</span></label>)}</div></fieldset>}
     <div ref={formArea} className="nfc-form-area">
      {result?<div ref={successRef} tabIndex={-1} className="nfc-order-success" role="status"><CheckCircle2 size={40}/><h2>{t.successTitle}</h2><p>{custom?t.successCustom:t.successStandard}</p><dl><div><dt>{t.reference}</dt><dd><bdi>5TAP-{result.id.replace(/-/g,'').slice(0,6).toUpperCase()}</bdi></dd></div><div><dt>{t.quantity}</dt><dd>{result.items.reduce((sum,p)=>sum+p.quantity,0)}</dd></div><div><dt>{t.successTotal}</dt><dd><bdi>{money(result.total)}</bdi></dd></div></dl><p className="nfc-payment-note">{custom?t.customPayment:t.standardPayment}</p><a className="nfc-text-link" href={whatsapp} target="_blank" rel="noreferrer" onClick={support}><MessageCircle size={17}/>{t.support}</a></div>:<form className="nfc-order-form" onSubmit={submit} onFocus={begin}>
       <h2>{t.formTitle}</h2><div className="nfc-form-fields"><label className="nfc-full-field">{t.name}<input name="name" autoComplete="name" required minLength={2} maxLength={100} disabled={busy}/></label><label>{t.phone}<input name="phone" type="tel" inputMode="tel" dir="ltr" autoComplete="tel" required pattern="\+?[0-9\s()\-]{9,20}" maxLength={20} placeholder="06 00 00 00 00" disabled={busy}/></label><label>{t.city}<input name="city" autoComplete="address-level2" required minLength={2} maxLength={100} placeholder={t.cityPlaceholder} value={city} onChange={e=>setCity(e.currentTarget.value)} disabled={busy}/></label></div>
       <div className="nfc-order-quantity"><span>{t.quantity}</span><div><button type="button" aria-label={t.less} disabled={busy||quantity<=1} onClick={()=>setQuantity(q=>q-1)}>−</button><output aria-live="polite">{quantity}</output><button type="button" aria-label={t.more} disabled={busy||quantity>=50} onClick={()=>setQuantity(q=>q+1)}>+</button></div></div>
       <dl className="nfc-order-totals"><div><dt>{t.subtotal}</dt><dd><bdi>{money(subtotal)}</bdi></dd></div><div><dt>{t.shipping}</dt><dd>{shipping===0?<span className="nfc-free">{t.freeShort}</span>:<bdi>{money(shipping)}</bdi>}</dd></div><div className="nfc-order-total"><dt>{t.total}</dt><dd><bdi>{money(total)}</bdi></dd></div></dl>
       <p className="nfc-payment-note"><ShieldCheck size={18}/><span>{custom?t.customPayment:t.standardPayment}</span></p><p className="nfc-personalization-note">{custom?t.customSupport:t.standardSupport}</p>
       <div hidden aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>{error&&<p className="error" role="alert">{t[error]}</p>}<button className="nfc-button" type="submit" disabled={busy}>{busy?t.busy:t.submit}{!busy&&<ArrowRight size={19}/>}</button><p className="nfc-form-notice">{t.notice}</p><p className="nfc-form-privacy">{t.privacyText} <a href={`/confidentialite?lang=${lang}`}>{t.privacy}</a></p>
      </form>}
     </div>
    </article>
   </section>
   <section className="nfc-how" id="comment"><div className="nfc-container nfc-section"><p className="nfc-eyebrow">5Tap · NFC + QR</p><h2>{t.stepsTitle}</h2><div className="nfc-step-grid">{t.steps.map(([title,description],index)=><article key={title}><span className="nfc-step-number">0{index+1}</span><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>
   <section className="nfc-container nfc-section nfc-faq-section" id="questions"><h2>{t.faqTitle}</h2>{t.faq.map(([question,answer])=><details key={question}><summary>{question}<ChevronDown size={18}/></summary><p>{answer}</p></details>)}<a className="nfc-button nfc-final-order" href="#commander" onClick={begin}>{t.order} · <bdi>{money(product.price)}</bdi><ArrowRight size={18}/></a><a className="nfc-text-link nfc-help-link" href={whatsapp} target="_blank" rel="noreferrer" onClick={support}><MessageCircle size={18}/>{t.support}</a></section>
  </main>
  <footer className="nfc-footer"><div className="nfc-container"><a href={`/?lang=${lang}`}><img src="/logo-5tap.png" width="130" height="52" alt="5Tap"/></a><p>{t.footer}</p><a href={`/confidentialite?lang=${lang}`}>{t.privacy}</a><a href={settings.instagramUrl} target="_blank" rel="noreferrer">Instagram</a></div></footer>
  {!result&&!formInView&&<div className="nfc-mobile-order"><div><strong><bdi>{money(product.price)}</bdi>{old&&<del>{money(old)}</del>}</strong><small>{freeEverywhere?t.shipping+' '+t.freeShort:t.delivery}</small></div><a href="#commander" className="nfc-button" onClick={begin}>{t.order}<ArrowRight size={17}/></a></div>}
 </div>;
}

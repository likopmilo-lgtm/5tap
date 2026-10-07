'use client';
import {useRef,useState} from 'react';
import {Tag} from 'lucide-react';
import {CartItem} from './catalog';
import {getInitialLanguage,LanguageCode} from './client-translations';
export type AppliedPromo={code:string;discount:number;subtotal:number;total:number;itemsKey:string};
type PromoResponse={code:string;discount:number;subtotal:number;total:number;error?:string};
const copy={fr:['Code promo','Votre code','Appliquer','Vérification…','Retirer','Code appliqué','Code invalide ou indisponible.'],en:['Promo code','Your code','Apply','Checking…','Remove','Code applied','Invalid or unavailable code.'],ar:['كود التخفيض','دخل الكود','طبق','كنتحققو…','حيد','تطبق الكود','الكود ما صالحش ولا ما متوفرش.'],es:['Código promocional','Tu código','Aplicar','Verificando…','Quitar','Código aplicado','Código no válido o no disponible.']};
export default function PromoField({items,applied,onApply}:{items:CartItem[];applied:AppliedPromo|null;onApply:(value:AppliedPromo|null)=>void}){
 const [code,setCode]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[lang]=useState<LanguageCode>(()=>typeof window==='undefined'?'fr':getInitialLanguage());const revision=useRef(0);const key=JSON.stringify(items);
 const t=copy[lang];
 async function apply(){const request=++revision.current;setBusy(true);setError('');try{const r=await fetch('/api/promo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,items})});const data=await r.json() as PromoResponse;if(request!==revision.current)return;if(!r.ok||!data.code||!Number.isFinite(data.discount))throw new Error(data.error);onApply({code:data.code,discount:data.discount,subtotal:data.subtotal,total:data.total,itemsKey:key});}catch{if(request===revision.current)setError(t[6])}finally{if(request===revision.current)setBusy(false)}}
 return <div className="promo-box" data-no-translate><label htmlFor="promo-code"><Tag size={18}/>{t[0]}</label><div className="promo-controls"><input id="promo-code" placeholder={t[1]} value={code} maxLength={32} autoComplete="off" autoCapitalize="characters" spellCheck={false} onChange={e=>{revision.current++;setBusy(false);setCode(e.target.value.toUpperCase());setError('');onApply(null)}} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();if(code.trim()&&!busy)void apply()}}}/><button type="button" disabled={busy||!code.trim()} onClick={()=>applied?(onApply(null),setCode('')):void apply()}>{busy?t[3]:applied?t[4]:t[2]}</button></div><p className="promo-status" role="status">{error|| (applied?`${t[5]} : ${applied.code} (−${applied.discount.toLocaleString()} DH)`:'')}</p></div>
}

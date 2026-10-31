'use client';
import {useEffect,useState} from 'react';
import {isCommercePath,marketingConsent,saveMarketingConsent,sanitizeTrackingConfig,startMarketingTracking,stopMarketingTracking,TrackingConfig} from './commerce-tracking';
type Lang='fr'|'ar'|'en'|'es';
const copy={
  fr:['Mesure publicitaire','Avec votre accord, Meta et Google nous aident à mesurer nos publicités. Votre choix ne change pas votre commande.','Accepter','Refuser','Confidentialité','Préférences de confidentialité'],
  ar:['قياس الإعلانات','بالموافقة ديالك، Meta وGoogle كيعاونونا نقيسو الإعلانات. الاختيار ديالك ما كيبدل والو فالطلب.','نوافق','نرفض','الخصوصية','اختيارات الخصوصية'],
  en:['Advertising measurement','With your permission, Meta and Google help us measure our ads. Your choice does not affect your order.','Accept','Decline','Privacy','Privacy preferences'],
  es:['Medición publicitaria','Con tu permiso, Meta y Google nos ayudan a medir los anuncios. Tu elección no afecta a tu pedido.','Aceptar','Rechazar','Privacidad','Preferencias de privacidad'],
};
export default function MarketingTracking({settings}:{settings:TrackingConfig}) {
  const [visible,setVisible]=useState(false),[enabled,setEnabled]=useState(false),[lang,setLang]=useState<Lang>('fr');
  useEffect(()=>{
    if(!isCommercePath(location.pathname)||!Object.values(sanitizeTrackingConfig(settings)).some(Boolean))return;
    setEnabled(true);
    const language=new URLSearchParams(location.search).get('lang')||document.documentElement.lang;
    if(language==='ar'||language==='en'||language==='es')setLang(language);
    if(marketingConsent()==='granted')startMarketingTracking(settings);
    else if(marketingConsent()===null)setVisible(true);
    const onChoice=(e:Event)=>{try{if((e as CustomEvent).detail==='granted')startMarketingTracking(settings);else stopMarketingTracking()}catch{}setVisible(false)};
    const onLanguage=(e:Event)=>{const code=(e as CustomEvent).detail;if(code==='fr'||code==='ar'||code==='en'||code==='es')setLang(code)};
    window.addEventListener('5tap-consent',onChoice);
    window.addEventListener('5tap-language',onLanguage);
    return()=>{window.removeEventListener('5tap-consent',onChoice);window.removeEventListener('5tap-language',onLanguage)};
  },[settings]);
  if(!enabled)return null;
  const t=copy[lang];
  return <div data-no-translate dir={lang==='ar'?'rtl':'ltr'}>{visible?<aside className="marketing-consent" aria-label={t[0]}><strong>{t[0]}</strong><p>{t[1]} <a href={`/confidentialite?lang=${lang}`}>{t[4]}</a></p><div><button type="button" onClick={()=>saveMarketingConsent('granted')}>{t[2]}</button><button type="button" onClick={()=>saveMarketingConsent('denied')}>{t[3]}</button></div></aside>:<button type="button" className="marketing-preferences" onClick={()=>setVisible(true)}>{t[5]}</button>}</div>;
}

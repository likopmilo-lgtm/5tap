'use client';
import {useEffect,useRef,useState} from 'react';
import {languages,LanguageCode} from './client-translations';
import {ChevronDown,X} from 'lucide-react';
import {Flag} from './language-flag';

export {Flag} from './language-flag';
export default function LanguageSelector({lang}:{lang:LanguageCode}){
 const dialog=useRef<HTMLDialogElement>(null);const [open,setOpen]=useState(()=>{if(typeof window==='undefined')return false;try{const saved=localStorage.getItem('5tap-lang');const query=new URLSearchParams(location.search).get('lang');return !languages.some(l=>l.code===saved||l.code===query)}catch{return true}});
 useEffect(()=>{const el=dialog.current;if(!el)return;if(open&&!el.open)el.showModal();else if(!open&&el.open)el.close();},[open]);
 function choose(code:LanguageCode){try{localStorage.setItem('5tap-lang',code)}catch{}const url=new URL(location.href);url.searchParams.set('lang',code);setOpen(false);location.assign(url.href)}
 return <div className="language-picker" data-no-translate><button className="language-trigger" type="button" aria-label="Choisir la langue / Choose language" aria-haspopup="dialog" onClick={()=>setOpen(true)}><Flag code={lang}/><span>{lang.toUpperCase()}</span><ChevronDown size={14}/></button><dialog ref={dialog} className="language-dialog" aria-labelledby="language-title" onCancel={()=>choose(lang)} onClose={()=>setOpen(false)}><button type="button" className="language-close" aria-label="Fermer / Close" onClick={()=>choose(lang)}><X size={20}/></button><img src="/logo-5tap.png" width="125" height="50" alt="5Tap"/><h2 id="language-title">Bienvenue chez 5Tap</h2><p>Choisissez votre langue<br/><span lang="ar" dir="rtl">اختار اللغة ديالك</span></p><div className="language-options">{languages.map(l=><button key={l.code} type="button" lang={l.code} onClick={()=>choose(l.code)}><Flag code={l.code}/><span>{l.code==='ar'?'العربية · الدارجة':l.label}</span><small>{l.short}</small></button>)}</div><p className="language-hint">Vous pourrez changer de langue à tout moment.<br/>You can change your language anytime.</p></dialog></div>
}

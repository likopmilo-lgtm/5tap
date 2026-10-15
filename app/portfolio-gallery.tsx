'use client';

import {useRef,useState} from 'react';
import {ChevronLeft,ChevronRight,Expand,X} from 'lucide-react';

export type GalleryPhoto={id:string;src:string;caption:string;width:number;height:number};
export default function PortfolioGallery({photos,compact=false}:{photos:GalleryPhoto[];compact?:boolean}){
 const dialog=useRef<HTMLDialogElement>(null);
 const[selected,setSelected]=useState(0);
 if(!photos.length)return null;
 const photo=photos[Math.min(selected,photos.length-1)];
 function open(index:number){setSelected(index);dialog.current?.showModal()}
 function move(direction:number){setSelected(current=>(current+direction+photos.length)%photos.length)}
 return <section className={'profile-portfolio '+(compact?'portfolio-preview':'')} aria-label="Portfolio">
  <div className="portfolio-heading"><span>MON TRAVAIL</span><h2>Portfolio</h2></div>
  <div className="portfolio-grid">{photos.map((item,index)=><figure key={item.id}><button type="button" onClick={()=>open(index)} aria-label={`Agrandir ${item.caption||`la photo ${index+1}`}`}><img src={item.src} alt={item.caption||`Photo ${index+1} du portfolio`} width={item.width} height={item.height} loading="lazy" decoding="async"/><span><Expand size={18}/></span></button>{item.caption&&<figcaption>{item.caption}</figcaption>}</figure>)}</div>
  <dialog ref={dialog} className="portfolio-lightbox" aria-label="Photo du portfolio" onClick={event=>{if(event.target===event.currentTarget)dialog.current?.close()}} onKeyDown={event=>{if(event.key==='ArrowLeft')move(-1);if(event.key==='ArrowRight')move(1)}}>
   <div className="portfolio-lightbox-body"><button type="button" className="portfolio-close" onClick={()=>dialog.current?.close()} aria-label="Fermer la photo"><X/></button><img src={photo.src} alt={photo.caption||`Photo ${selected+1} du portfolio`}/>{photo.caption&&<p>{photo.caption}</p>}<div className="portfolio-lightbox-navigation">{photos.length>1&&<button type="button" onClick={()=>move(-1)} aria-label="Photo précédente"><ChevronLeft/></button>}<span>{selected+1} / {photos.length}</span>{photos.length>1&&<button type="button" onClick={()=>move(1)} aria-label="Photo suivante"><ChevronRight/></button>}</div></div>
  </dialog>
 </section>;
}

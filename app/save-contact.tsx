'use client';

import {useEffect,useState} from 'react';
import {UserPlus} from 'lucide-react';

export default function SaveContact({slug,photo}:{slug:string;photo:string}){
 const[prepared,setPrepared]=useState({source:'',jpeg:''});
 const needsConversion=photo.startsWith('data:image/webp;');
 useEffect(()=>{
  if(!needsConversion)return;
  let cancelled=false;
  const complete=(jpeg='')=>{if(!cancelled)setPrepared({source:photo,jpeg})};
  const image=new Image();
  image.onload=()=>{
   const canvas=document.createElement('canvas');
   const scale=Math.min(1,512/Math.max(image.naturalWidth,image.naturalHeight));
   canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
   const context=canvas.getContext('2d');if(!context){complete();return}
   context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);
   context.drawImage(image,0,0,canvas.width,canvas.height);
   let jpeg=canvas.toDataURL('image/jpeg',.85);
   if(jpeg.length>360000)jpeg=canvas.toDataURL('image/jpeg',.65);
   complete(jpeg.length<=360000?jpeg:'');
  };
  image.onerror=()=>complete();
  image.src=photo;
  return ()=>{cancelled=true;image.onload=null;image.onerror=null};
 },[photo,needsConversion]);

 const href=`/api/contact/${slug}`;
 // A normal form response lets the phone handle the .vcf, without a blob URL.
 // Existing WebP avatars are converted locally; nothing is stored or changed.
 if(needsConversion&&prepared.source!==photo)return <button type="button" className="public-save-contact" disabled aria-busy="true"><UserPlus/>Préparation du contact…</button>;
 if(needsConversion&&prepared.jpeg)return <form className="public-save-contact-form" action={href} method="post"><input type="hidden" name="photo" value={prepared.jpeg}/><button type="submit" className="public-save-contact"><UserPlus/>Enregistrer dans mes contacts</button></form>;
 return <a className="public-save-contact" href={href}><UserPlus/>Enregistrer dans mes contacts</a>;
}

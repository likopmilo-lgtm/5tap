'use client';
import {useEffect,useState} from 'react';
import QRCode from 'qrcode';

export default function ProfileQr({value,name='profil-5tap',download=true}:{value:string;name?:string;download?:boolean}){
 const[src,setSrc]=useState('');
 useEffect(()=>{let active=true;QRCode.toDataURL(value,{width:512,margin:2,errorCorrectionLevel:'H',color:{dark:'#1A1A1A',light:'#FFFFFF'}}).then(url=>{if(active)setSrc(url)}).catch(()=>setSrc(''));return()=>{active=false}},[value]);
 if(!src)return <div className="profile-qr-loading">Création du QR code…</div>;
 return <div className="profile-qr-card"><div className="profile-qr-image"><img src={src} width="180" height="180" alt={`QR code du profil ${name}`}/><span>5TAP</span></div><div><strong>QR code personnel</strong><p>Il ouvre la même destination que la carte NFC et reste valable après chaque modification.</p>{download&&<a href={src} download={`${name.replace(/[^a-z0-9-]+/gi,'-').toLowerCase()}-qr.png`}>Télécharger le QR</a>}</div></div>
}

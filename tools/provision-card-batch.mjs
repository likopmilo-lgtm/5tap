import {createHash,randomInt} from 'node:crypto';
import {existsSync} from 'node:fs';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import QRCode from 'qrcode';

const root=process.cwd();
const batch='batch-001';
const output=join(root,'provisioning','private',batch);
const seedFile=join(root,'supabase','20261010-seed-first-50-cards.sql');
if(existsSync(join(output,'lot-001-cartes.csv')))throw new Error('Le lot 001 existe déjà. Aucune donnée n’a été remplacée.');
await mkdir(join(output,'qr-png'),{recursive:true});
await mkdir(join(output,'qr-svg'),{recursive:true});
const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const used=new Set();
function code(){let value;do{let token='';for(let i=0;i<8;i++)token+=alphabet[randomInt(alphabet.length)];value=`5TAP-${token.slice(0,4)}-${token.slice(4)}`}while(used.has(value));used.add(value);return value}
const rows=[];
for(let number=1;number<=50;number++){
 const ref=String(number).padStart(4,'0');const slug=`5tap-${ref}`;const activation=code();const url=`https://5tap.ma/go/${slug}`;
 const basename=`${ref}-${slug}`;
 await QRCode.toFile(join(output,'qr-png',`${basename}.png`),url,{width:1200,margin:4,errorCorrectionLevel:'H',color:{dark:'#1A1A1A',light:'#FFFFFF'}});
 await writeFile(join(output,'qr-svg',`${basename}.svg`),await QRCode.toString(url,{type:'svg',margin:4,errorCorrectionLevel:'H',color:{dark:'#1A1A1A',light:'#FFFFFF'}}),'utf8');
 rows.push({number,ref,slug,activation,url,hash:createHash('sha256').update(activation).digest('hex')});
}
const csv=['Numero;Reference;Slug;Lien_NFC_et_QR;Code_activation;Statut',...rows.map(r=>`${r.number};5TAP-${r.ref};${r.slug};${r.url};${r.activation};A_PROGRAMMER`)].join('\r\n');
await writeFile(join(output,'lot-001-cartes.csv'),'\ufeff'+csv,'utf8');
await writeFile(join(output,'liens-nfc.txt'),rows.map(r=>`5TAP-${r.ref}\t${r.url}`).join('\r\n'),'utf8');
await writeFile(join(output,'codes-clients.txt'),rows.map(r=>`Carte 5TAP-${r.ref}\nCode privé : ${r.activation}\nActivation : ${r.url}\n`).join('\n'),'utf8');
const cards=rows.map(r=>`<article><img src="qr-png/${r.ref}-${r.slug}.png"><strong>5TAP-${r.ref}</strong><small>${r.url}</small></article>`).join('');
await writeFile(join(output,'planches-qr.html'),`<!doctype html><html lang="fr"><meta charset="utf-8"><title>5Tap — Lot 001</title><style>@page{size:A4;margin:10mm}*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif}.sheet{display:grid;grid-template-columns:repeat(4,1fr);gap:5mm}article{break-inside:avoid;border:1px dashed #aaa;padding:3mm;text-align:center}img{display:block;width:32mm;height:32mm;margin:auto}strong,small{display:block}strong{font-size:10pt;margin-top:1mm}small{font-size:5pt;overflow-wrap:anywhere}</style><div class="sheet">${cards}</div></html>`,'utf8');
await writeFile(join(output,'LIRE-MOI.txt'),`LOT 001 — 50 CARTES 5TAP\n\n1. Programmez dans la puce NFC le lien indiqué dans lot-001-cartes.csv.\n2. Utilisez le QR portant la même référence au verso de la carte.\n3. Remettez séparément au client le code privé correspondant.\n4. Avant publication, le NFC et le QR ouvrent la page d’activation.\n5. Après publication, ils ouvrent la carte de visite digitale du client.\n6. Ne jamais imprimer le code privé sur la carte ou dans le QR.\n\nLes SVG sont recommandés pour l’impression. Les PNG font 1200 px.\n`,'utf8');
const values=rows.map(r=>`  ('${r.hash}','${r.slug}')`).join(',\n');
await writeFile(seedFile,`-- Lot 001 : 50 cartes préprovisionnées. Les codes en clair restent dans le dossier privé ignoré par Git.\nbegin;\ninsert into public.card_profiles (activation_code_hash,public_slug) values\n${values}\non conflict (public_slug) do nothing;\ncommit;\n`,'utf8');
console.log(`Lot créé : ${output}`);

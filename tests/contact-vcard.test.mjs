import assert from 'node:assert/strict';
import test from 'node:test';
import {buildContactVCard,contactFilename,contactPhoto} from '../app/contact-vcard.ts';
import {mapsUrl} from '../app/profile-links.ts';

const profile={public_slug:'5tap-test',display_name:'Amine El Idrissi',job_title:'Photographe',company:'Studio',bio:'',phone:'+212600000000',whatsapp:'',email:'',website:'',address:'Casablanca',map_url:'',avatar_data_url:''};
const unfold=value=>value.replace(/\r\n[ \t]/g,'');

test('exports both the structured contact name and the displayed full name with the phone',()=>{
 const card=unfold(buildContactVCard(profile));
 assert.ok(card.includes('N:;Amine El Idrissi;;;\r\n'));
 assert.ok(card.includes('FN:Amine El Idrissi\r\n'));
 assert.ok(card.includes('TEL;TYPE=CELL:+212600000000\r\n'));
 assert.ok(card.endsWith('END:VCARD\r\n'));
});

test('keeps the whole photo on its own line for Android contact handoffs',()=>{
 const data='/9j/'+Buffer.from('photo-payload'.repeat(300)).toString('base64');
 const card=buildContactVCard({...profile,avatar_data_url:`data:image/jpeg;base64,${data}`});
 const lines=card.split('\r\n');
 const photoLine=lines.findIndex(line=>line.startsWith('PHOTO;'));
 assert.equal(lines[photoLine],`PHOTO;ENCODING=b;TYPE=JPEG:${data}`);
 assert.equal(lines[photoLine+1],'');
 assert.equal(lines[photoLine+2],'END:VCARD');
 assert.ok(lines.every((line,index)=>index===photoLine||Buffer.byteLength(line,'utf8')<=75));
 assert.deepEqual(Buffer.from(lines[photoLine].split(':')[1],'base64'),Buffer.from(data,'base64'));
});

test('photo data cannot leak into address or notes in a line-based importer',()=>{
 const data='/9j/'+Buffer.from('photo-payload'.repeat(2000)).toString('base64');
 const card=buildContactVCard({...profile,address:'123 Rue de test, Martil',bio:'Mon activité',avatar_data_url:`data:image/jpeg;base64,${data}`});
 // Importers that do not unfold PHOTO must never see raw continuation lines.
 const lines=card.split('\r\n').filter(Boolean);
 assert.ok(lines.every(line=>/^[A-Z][A-Z0-9-]*(?:;[^:]*)?:/.test(line)));
 assert.equal(lines.find(line=>line.startsWith('ADR;')),'ADR;TYPE=WORK:;;123 Rue de test\\, Martil;;;;');
 assert.equal(lines.find(line=>line.startsWith('NOTE:')),'NOTE:Mon activité');
 assert.equal(lines.filter(line=>line.includes(data.slice(4,100))).length,1);
 assert.ok(card.includes('N:;Amine El Idrissi;;;\r\nFN:Amine El Idrissi\r\n'));
});

test('supports PNG and legacy WebP photos without folding binary data',()=>{
 for(const [mime,type,prefix] of [['png','PNG','iVBORw0KGgo'],['webp','WEBP','UklGR']]){
  const data=prefix+Buffer.from('photo-payload'.repeat(300)).toString('base64');
  const card=buildContactVCard(profile,`data:image/${mime};base64,${data}`);
  assert.ok(card.includes(`PHOTO;ENCODING=b;TYPE=${type}:${data}\r\n\r\nEND:VCARD\r\n`));
 }
});

test('keeps Arabic and accented names intact across UTF-8 line folding',()=>{
 const name='محمد الإدريسي '.repeat(8)+'Élodie';
 const card=buildContactVCard({...profile,display_name:name,bio:'Conseil; réseaux, photos\nNouvelle ligne'});
 assert.ok(unfold(card).includes(`FN:${name}\r\n`));
 assert.ok(unfold(card).includes('NOTE:Conseil\\; réseaux\\, photos\\nNouvelle ligne'));
 assert.ok(card.split('\r\n').every(line=>Buffer.byteLength(line,'utf8')<=75));
});

test('rejects invalid photo content and exports contacts without a photo',()=>{
 assert.equal(contactPhoto('data:image/jpeg;base64,not-a-photo'),null);
 assert.equal(contactPhoto('https://example.com/photo.jpg'),null);
 assert.ok(!buildContactVCard(profile).includes('PHOTO;'));
 assert.equal(contactFilename('Élodie Dupont'),'elodie-dupont.vcf');
});

test('a city alone never creates a Maps block or a directions link',()=>{
 assert.equal(mapsUrl({map_url:'',address:'Tanger'}),'');
 assert.equal(mapsUrl({map_url:'https://maps.app.goo.gl/Example'}),'https://maps.app.goo.gl/Example');
});

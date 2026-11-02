import test from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';

const hook=registerHooks({resolve(specifier,context,next){
 if(specifier==='./pricing'||specifier==='./nfc-landing-copy')return {url:new URL('../app/'+specifier.slice(2)+'.ts',import.meta.url).href,shortCircuit:true};
 return next(specifier,context);
}});
const {landingConfirmation,clearLandingConfirmation,rememberLandingConfirmation,restoreLandingConfirmation}=await import('../app/landing-checkout.ts');
const {landingCopy}=await import('../app/nfc-landing-copy.ts');
hook.deregister();

const customer={name:'TEST 5Tap & équipe',phone:'+212600000000',city:'Rabat'};
const saved={id:'01234567-89ab-4cde-8f01-23456789abcd',items:[{id:'carte-visite-personnalisee',name:'Carte personnalisée',price:249,quantity:2}],subtotal:498,shipping:0,total:498};

test('custom orders include the saved reference, quantity, total and advance terms in WhatsApp',()=>{
 const result=landingConfirmation(saved,customer,true,'fr','https://wa.me/212672606072');
 const url=new URL(result.whatsappUrl),text=url.searchParams.get('text');
 assert.equal(result.reference,'5TAP-012345');
 assert.equal(url.origin+url.pathname,'https://wa.me/212672606072');
 for(const value of [result.reference,customer.name,customer.phone,customer.city,'× 2 — 498 DH','Total : 498 DH',landingCopy.fr.customPayment])assert.ok(text.includes(value),value);
 assert.ok(text.includes('Votre logo imprimé sur la carte'));
 assert.equal(url.searchParams.getAll('text').length,1);
});

test('every language gives standard cards the correct logo and cash-on-delivery terms',()=>{
 for(const lang of ['fr','ar','en','es']){
  const t=landingCopy[lang],text=new URL(landingConfirmation(saved,customer,false,lang,'https://wa.me/212672606072').whatsappUrl).searchParams.get('text');
  assert.ok(text.includes(t.standardTitle));assert.ok(text.includes(t.standardIncludes[0]));assert.ok(text.includes(t.standardPayment));assert.ok(!text.includes(t.customPayment));
  assert.ok(t.notice.includes('WhatsApp')||t.notice.includes('واتساب'));
  assert.ok(t.sendNotice&&t.openWhatsApp);
 }
});

test('the WhatsApp summary uses the server response including quantity and delivery charges',()=>{
 const order={...saved,items:[{...saved.items[0],price:271,quantity:3}],subtotal:813,shipping:35,total:848};
 const text=new URL(landingConfirmation(order,customer,true,'fr','https://wa.me/212672606072').whatsappUrl).searchParams.get('text');
 assert.ok(text.includes('× 3 — 813 DH'));assert.ok(text.includes('Livraison : 35 DH'));assert.ok(text.includes('Total : 848 DH'));
});

test('the configured WhatsApp recipient is preserved and invalid destinations have a safe fallback',()=>{
 const url=new URL(landingConfirmation(saved,customer,true,'en','https://api.whatsapp.com/send?phone=212672606072&text=old').whatsappUrl);
 assert.equal(url.searchParams.get('phone'),'212672606072');assert.equal(url.searchParams.getAll('text').length,1);assert.ok(!url.searchParams.get('text').includes('old'));
 for(const invalid of ['javascript:alert(1)','https://example.com','not a URL']){
  const target=new URL(landingConfirmation(saved,customer,true,'fr',invalid).whatsappUrl);
  assert.equal(target.origin+target.pathname,'https://wa.me/212672606072');
 }
});

test('returning from WhatsApp restores the same saved order without a new submission',()=>{
 const data=new Map(),storage={getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value),removeItem:key=>data.delete(key)};
 const result={...saved,...landingConfirmation(saved,customer,true,'fr','https://wa.me/212672606072')};
 rememberLandingConfirmation(storage,'carte-visite-personnalisee',result,1000000);
 const restored=restoreLandingConfirmation(storage,['carte-visite-personnalisee'],1005000);
 assert.deepEqual(restored.result,result);
 clearLandingConfirmation(storage);assert.equal(restoreLandingConfirmation(storage,['carte-visite-personnalisee'],1005000),null);
 rememberLandingConfirmation(storage,'carte-visite-personnalisee',result,1000000);
 assert.equal(restoreLandingConfirmation(storage,['carte-visite-personnalisee'],2800001),null);assert.equal(data.size,0);
});

test('blocked browser storage or corrupted confirmations cannot break a saved order',()=>{
 const unavailable={getItem(){throw new Error('Blocked')},setItem(){throw new Error('Quota')},removeItem(){throw new Error('Blocked')}};
 assert.doesNotThrow(()=>rememberLandingConfirmation(unavailable,'carte-visite-personnalisee',saved));
 assert.equal(restoreLandingConfirmation(unavailable,['carte-visite-personnalisee']),null);
 const data=new Map(),storage={getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value),removeItem:key=>data.delete(key)};
 const result={...saved,whatsappUrl:'https://example.com'};
 rememberLandingConfirmation(storage,'carte-visite-personnalisee',result);
 assert.equal(restoreLandingConfirmation(storage,['carte-visite-personnalisee']),null);assert.equal(data.size,0);
});

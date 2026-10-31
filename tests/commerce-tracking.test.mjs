import test from 'node:test';
import assert from 'node:assert/strict';
const stored=new Map(),scripts=[];
globalThis.localStorage={getItem:key=>stored.get(key)||null,setItem:(key,value)=>stored.set(key,value)};
globalThis.window={location:{pathname:'/offre/carte-nfc'},dispatchEvent(){}};
globalThis.document={getElementById:id=>scripts.find(s=>s.id===id),createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}};
const tracking=await import('../app/commerce-tracking.ts');
const item={id:'carte-visite',price:179,quantity:2,name:'NEVER SEND CUSTOMER NAME',phone:'PRIVATE'};

test('only validated tracking identifiers and commerce paths are accepted',()=>{
 assert.equal(tracking.sanitizeTrackingConfig({metaPixelId:"12');alert(1)//"}).metaPixelId,undefined);
 assert.equal(tracking.sanitizeTrackingConfig({metaPixelId:'123456789012345',googleAnalyticsId:'G-ABC12345',googleTagManagerId:'GTM-ABCD123'}).metaPixelId,'123456789012345');
 for(const path of ['/mon-profil','/mon-profil?card=5tap-0051','/p/5tap-0051','/go/5tap-0051','/api/card-profile'])assert.equal(tracking.isCommercePath(path),false);
});
test('events wait for consent, initialize once, and never count a request as Purchase',()=>{
 tracking.trackCommerce('ViewContent',[item],{once:'view'});
 tracking.startMarketingTracking({metaPixelId:'123456789012345'});
 assert.equal(scripts.length,0);
 tracking.saveMarketingConsent('granted');tracking.startMarketingTracking({metaPixelId:'123456789012345'});
 assert.equal(scripts.length,1);let calls=window.fbq.queue;
 assert.equal(calls.filter(c=>c[0]==='init').length,1);
 assert.equal(calls.filter(c=>c[1]==='PageView').length,1);
 assert.equal(calls.filter(c=>c[1]==='ViewContent').length,1);
 tracking.trackCommerce('ViewContent',[item],{once:'view'});
 assert.equal(calls.filter(c=>c[1]==='ViewContent').length,1);
 tracking.trackCommerce('Lead',[item],{once:'order:1',eventId:'order-1'});
 tracking.trackCommerce('Lead',[item],{once:'order:1',eventId:'order-1'});
 tracking.trackCommerce('Purchase',[item]);
 assert.equal(calls.filter(c=>c[1]==='Lead').length,1);assert.equal(calls.filter(c=>c[1]==='Purchase').length,0);
 assert.equal(calls.find(c=>c[1]==='Lead')[2].value,358);
 assert.equal(JSON.stringify(calls).includes('PRIVATE'),false);assert.equal(JSON.stringify(calls).includes('CUSTOMER'),false);
});
test('refusal stops events and restoring consent does not duplicate initialization',()=>{
 tracking.saveMarketingConsent('denied');tracking.stopMarketingTracking();const before=window.fbq.queue.length;
 tracking.trackCommerce('Contact',[item]);assert.equal(window.fbq.queue.length,before);
 tracking.saveMarketingConsent('granted');tracking.startMarketingTracking({metaPixelId:'123456789012345'});
 assert.equal(window.fbq.queue.filter(c=>c[0]==='init').length,1);assert.equal(window.fbq.queue.filter(c=>c[1]==='PageView').length,1);
 window.location.pathname='/p/5tap-0051';tracking.trackCommerce('Contact',[item]);
 assert.equal(window.fbq.queue.filter(c=>c[1]==='Contact').length,0);
 window.location.pathname='/offre/carte-nfc';
});
test('a failed advertising library cannot interrupt the order journey',()=>{
 window.fbq=()=>{throw new Error('blocked')};
 assert.doesNotThrow(()=>tracking.trackCommerce('Lead',[item],{once:'order:2'}));
});

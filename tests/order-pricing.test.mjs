import assert from 'node:assert/strict';
import test from 'node:test';
import {registerHooks} from 'node:module';
import {randomUUID} from 'node:crypto';
import {products} from '../app/catalog.ts';

const fixture={saved:null,products,settings:{tangierShipping:35,moroccoShipping:35}};
const key=Symbol.for('5tap.order-pricing-test');globalThis[key]=fixture;
const hook=registerHooks({
 resolve(specifier,context,next){
  if(specifier==='cloudflare:workers')return {url:'test:cloudflare',shortCircuit:true};
  if(specifier.endsWith('/supabase-server'))return {url:'test:supabase',shortCircuit:true};
  if(specifier.endsWith('/pricing'))return {url:new URL('../app/pricing.ts',import.meta.url).href,shortCircuit:true};
  if(specifier.endsWith('/promotions'))return {url:new URL('../app/promotions.ts',import.meta.url).href,shortCircuit:true};
  return next(specifier,context);
 },
 load(url,context,next){
  if(url==='test:cloudflare')return {format:'module',source:'export const env={};',shortCircuit:true};
  if(url==='test:supabase')return {format:'module',source:`const f=globalThis[Symbol.for('5tap.order-pricing-test')];export async function getSiteData(){return f}export function hasSupabaseConfig(){return true}export async function writeSupabase(path,data){if(path==='rpc/quote_promo')return {discount:data.p_subtotal*.15};if(path!=='orders')throw new Error('Unexpected write');f.saved=data;}`,shortCircuit:true};
  return next(url,context);
 }
});
const {POST}=await import('../app/api/orders/route.ts');hook.deregister();
const request=(items,promoCode)=>new Request('https://5tap.ma/api/orders',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://5tap.ma'},body:JSON.stringify({id:randomUUID(),name:'TEST EN MEMOIRE',phone:'+212600000000',city:'Tanger',address:'TEST LOCAL uniquement',notes:'Aucune commande réelle.',items,promoCode,total:1,shipping:0})});

test('order API ignores client prices and saves the real discounted total plus one delivery',async()=>{
 const response=await POST(request([{id:'essentiel',quantity:2,price:1}]));
 assert.equal(response.status,201);const result=await response.json();
 assert.equal(result.subtotal,418);assert.equal(result.shipping,35);assert.equal(result.total,453);
 assert.equal(fixture.saved.items[0].price,209);assert.equal(fixture.saved.shipping,35);assert.equal(fixture.saved.total,453);
});

test('order API stacks STATI on merchandise while retaining the 35 DH delivery fee',async()=>{
 const response=await POST(request([{id:'essentiel',quantity:1}],'STATI'));
 assert.equal(response.status,201);const result=await response.json();
 assert.equal(result.discount,32);assert.equal(result.shipping,35);assert.equal(result.total,212);
 assert.equal(fixture.saved.total,212);
});

test('all six catalogue products can be ordered together with a single delivery',async()=>{
 const response=await POST(request(products.map(p=>({id:p.id,quantity:1}))));
 assert.equal(response.status,201);const result=await response.json();
 assert.equal(result.items.length,6);assert.equal(result.shipping,35);assert.equal(result.total,products.reduce((sum,p)=>sum+p.price,0)+35);
});

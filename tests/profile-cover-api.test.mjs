import assert from 'node:assert/strict';
import test from 'node:test';
import {registerHooks} from 'node:module';
const fixture={row:{public_slug:'qa-fit',display_name:'Client test',job_title:'Designer',cover_fit:'cover',cover_data_url:'',cover_zoom:125,cover_position_x:34,cover_position_y:10},saved:null};
globalThis[Symbol.for('5tap.cover-api-test')]=fixture;
const hook=registerHooks({
 resolve(specifier,context,next){
  if(specifier.endsWith('/supabase-server'))return {url:'test:cover-supabase',shortCircuit:true};
  if(specifier.endsWith('/profile-media'))return {url:new URL('../app/profile-media.ts',import.meta.url).href,shortCircuit:true};
  if(specifier.endsWith('/profile-document'))return {url:new URL('../app/profile-document.ts',import.meta.url).href,shortCircuit:true};
  return next(specifier,context);
 },
 load(url,context,next){if(url==='test:cover-supabase')return {format:'module',source:`const f=globalThis[Symbol.for('5tap.cover-api-test')];export async function writeSupabase(method,body){if(method==='rpc/get_card_profile')return f.row;if(method==='rpc/update_card_profile'){f.saved=body.p_profile;f.row={...f.row,cover_fit:body.p_profile.coverFit??f.row.cover_fit};return f.row;}throw new Error('Unexpected RPC')}`,shortCircuit:true};return next(url,context)}
});
const {POST}=await import('../app/api/card-profile/route.ts');hook.deregister();
const request=profile=>new Request('https://5tap.ma/api/card-profile',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://5tap.ma'},body:JSON.stringify({action:profile?'save':'load',code:'5TAP-TEST-FIT1',profile})});

test('full-photo mode survives save and reload without resetting the original crop',async()=>{
 const response=await POST(request({displayName:'Client test',coverFit:'contain'}));assert.equal(response.status,200);assert.equal(fixture.saved.coverFit,'contain');
 const saved=await response.json();assert.equal(saved.profile.coverFit,'contain');assert.equal(saved.profile.coverZoom,125);assert.equal(saved.profile.coverPositionX,34);
 const loaded=await(await POST(request(null))).json();assert.equal(loaded.profile.coverFit,'contain');assert.equal(loaded.profile.displayName,'Client test');
});

test('invalid fit values are refused before reaching the database',async()=>{
 fixture.saved=null;assert.equal((await POST(request({displayName:'Client test',coverFit:'invalid'}))).status,400);assert.equal(fixture.saved,null);
});

test('legacy clients which omit the option preserve the saved full-photo mode',async()=>{
 assert.equal((await POST(request({displayName:'Client test'}))).status,200);assert.equal(fixture.saved.coverFit,undefined);
 assert.equal((await(await POST(request(null))).json()).profile.coverFit,'contain');
});

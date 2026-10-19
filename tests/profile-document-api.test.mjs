import assert from 'node:assert/strict';
import test from 'node:test';
import {registerHooks} from 'node:module';
const id='00000000-0000-4000-8000-000000000001';
const bytes=Buffer.from('%PDF-1.4\nSynthetic CV\n%%EOF\n');
const document={id,name:'cv-test.pdf',mimeType:'application/pdf',size:bytes.length,label:'Mon CV',dataUrl:'data:application/pdf;base64,'+bytes.toString('base64')};
const fixture={document,profile:{public_slug:'qa-cv',display_name:'Client test',job_title:'Designer',cv_document:document},saved:null,calls:0};
globalThis[Symbol.for('5tap.cv-api-test')]=fixture;
const hook=registerHooks({
 resolve(specifier,context,next){
  if(specifier.endsWith('/supabase-server'))return {url:'test:cv-supabase',shortCircuit:true};
  if(specifier.endsWith('/profile-media'))return {url:new URL('../app/profile-media.ts',import.meta.url).href,shortCircuit:true};
  if(specifier.endsWith('/profile-document'))return {url:new URL('../app/profile-document.ts',import.meta.url).href,shortCircuit:true};
  return next(specifier,context);
 },
 load(url,context,next){if(url==='test:cv-supabase')return {format:'module',source:`const f=globalThis[Symbol.for('5tap.cv-api-test')];export async function writeSupabase(path,data){f.calls++;if(path==='rpc/get_public_card_document')return f.document;if(path==='rpc/get_card_profile')return f.profile;if(path==='rpc/update_card_profile'){f.saved=data.p_profile;return {...f.profile,display_name:data.p_profile.displayName,cv_document:data.p_profile.cvDocument};}throw new Error('Unexpected RPC');}`,shortCircuit:true};return next(url,context)}
});
const {POST}=await import('../app/api/card-profile/route.ts');
const {GET}=await import('../app/api/profile-document/[slug]/[documentId]/route.ts');hook.deregister();
const request=(profile,action='save')=>new Request('https://5tap.ma/api/card-profile',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://5tap.ma'},body:JSON.stringify({action,code:'5TAP-TEST-CV01',profile})});
const download=(query='',slug='qa-cv',documentId=id)=>GET(new Request(`https://5tap.ma/api/profile-document/${slug}/${documentId}${query}`),{params:Promise.resolve({slug,documentId})});
test('save/load keeps identity and returns document metadata without base64',async()=>{
 const response=await POST(request({displayName:'Client test',jobTitle:'Designer',cvDocument:document}));assert.equal(response.status,200);
 const result=await response.json();assert.equal(result.profile.displayName,'Client test');assert.equal(result.profile.jobTitle,'Designer');assert.equal(result.profile.cvDocument.id,id);assert.equal(result.profile.cvDocument.dataUrl,undefined);assert.equal(fixture.saved.cvDocument.dataUrl,document.dataUrl);
 const loaded=await(await POST(request(null,'load'))).json();assert.equal(loaded.profile.cvDocument.dataUrl,undefined);assert.equal(loaded.profile.cvDocument.name,document.name);
});
test('invalid file and cross-origin save are refused before persistence',async()=>{
 fixture.saved=null;const response=await POST(request({displayName:'Test',cvDocument:{...document,mimeType:'text/html'}}));assert.equal(response.status,400);assert.equal(fixture.saved,null);
 const foreign=new Request('https://5tap.ma/api/card-profile',{method:'POST',headers:{Origin:'https://other.example'},body:'{}'});assert.equal((await POST(foreign)).status,403);
});
test('bounded streaming body rejects oversized requests without trusting content-length',async()=>{
 const oversized=new Request('https://5tap.ma/api/card-profile',{method:'POST',body:' '.repeat(10_000_001)});assert.equal((await POST(oversized)).status,413);
});
test('existing document metadata is passed through and null removes it',async()=>{
 const {dataUrl,...metadata}=document;assert.equal((await POST(request({displayName:'Test',cvDocument:metadata}))).status,200);assert.equal(fixture.saved.cvDocument.dataUrl,undefined);
 const deleted=await POST(request({displayName:'Test',cvDocument:null}));assert.equal(deleted.status,200);assert.equal((await deleted.json()).profile.cvDocument,null);
});
test('serves exact PDF bytes with separate view/download and no cached copy',async()=>{
 const inline=await download();assert.equal(inline.status,200);assert.equal(inline.headers.get('Content-Type'),'application/pdf');assert.match(inline.headers.get('Content-Disposition'),/^inline;/);assert.equal(inline.headers.get('Cache-Control'),'no-store');assert.equal(inline.headers.get('X-Content-Type-Options'),'nosniff');assert.equal(inline.headers.get('Content-Security-Policy'),'sandbox');assert.deepEqual(Buffer.from(await inline.arrayBuffer()),bytes);
 assert.match((await download('?download=1')).headers.get('Content-Disposition'),/^attachment;/);
});
test('removed, mismatched and invalid references return 404',async()=>{
 const before=fixture.calls;assert.equal((await download('','qa-cv','bad')).status,404);assert.equal(fixture.calls,before);
 fixture.document=null;assert.equal((await download()).status,404);fixture.document={...document,id:'00000000-0000-4000-8000-000000000002'};assert.equal((await download()).status,404);fixture.document=document;
});

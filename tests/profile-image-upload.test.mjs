import assert from 'node:assert/strict';
import test from 'node:test';
import {optimizeProfileImage,PROFILE_IMAGE_MAX_BYTES} from '../app/profile-image-upload.ts';

async function browserFixture(run,{encode,decodeError=false,width=4160,height=6240}={}){
 const old={Image:globalThis.Image,document:globalThis.document,create:URL.createObjectURL,revoke:URL.revokeObjectURL};
 const calls=[],revoked=[];let canvas;
 globalThis.Image=class{naturalWidth=width;naturalHeight=height;set src(value){queueMicrotask(()=>decodeError?this.onerror():this.onload())}};
 globalThis.document={createElement(tag){assert.equal(tag,'canvas');canvas={width:0,height:0,getContext(){return {fillRect(){},drawImage(){},fillStyle:''}},toDataURL(format,quality){calls.push({format,quality,width:this.width,height:this.height});return encode.call(this,format,quality)}};return canvas}};
 URL.createObjectURL=()=> 'blob:synthetic-image';URL.revokeObjectURL=url=>revoked.push(url);
 try{return await run({calls,revoked,get canvas(){return canvas}})}finally{
  globalThis.Image=old.Image;globalThis.document=old.document;URL.createObjectURL=old.create;URL.revokeObjectURL=old.revoke;
 }
}
const source={name:'photo-iphone.heic',type:'image/heic',size:12*1024*1024};
const encoded=(type,length)=>`data:image/${type};base64,`+(type==='jpeg'?'/9j/':type==='png'?'iVBORw0KGgo':'UklGR')+'A'.repeat(length);

test('an iPhone PNG fallback is recompressed as JPEG and a source above 8 MB is accepted',async()=>{
 await browserFixture(async({calls,revoked,canvas})=>{
  const image=await optimizeProfileImage(source,1600,360000);
  assert.match(image.dataUrl,/^data:image\/jpeg/);assert.ok(image.dataUrl.length<=360000);
  assert.equal(image.height,1600);assert.equal(image.width,1067);
  assert.deepEqual(calls.map(c=>c.format),['image/webp','image/jpeg']);
  assert.deepEqual(revoked,['blob:synthetic-image']);
 },{encode(format){return format==='image/webp'?encoded('png',this.width*this.height*3):encoded('jpeg',Math.round(this.width*this.height*.1))}});
});

test('detailed images shrink progressively and stay within the upload budget',async()=>{
 await browserFixture(async({calls})=>{
  const image=await optimizeProfileImage({...source,type:'image/jpeg'},1600,220000);
  assert.ok(calls.length>1);assert.ok(image.dataUrl.length<=220000);
  assert.ok(calls.every(c=>Math.max(c.width,c.height)<=1600));
  assert.ok(Math.abs(image.width/image.height-4160/6240)<.002);
 },{encode(format,quality){return encoded('webp',Math.ceil(this.width*this.height*quality))}});
});

test('decode and encoder failures release temporary image resources',async()=>{
 await browserFixture(async({revoked})=>{await assert.rejects(optimizeProfileImage(source,1600,360000),/version JPG/);assert.deepEqual(revoked,['blob:synthetic-image'])},{decodeError:true});
 await browserFixture(async(context)=>{await assert.rejects(optimizeProfileImage(source,1600,360000),/Encoder failed/);assert.deepEqual(context.revoked,['blob:synthetic-image']);assert.equal(context.canvas.width,1);assert.equal(context.canvas.height,1)},{encode(){throw new Error('Encoder failed')}});
});

test('invalid formats and original files above 25 MB are rejected before decoding',async()=>{
 await assert.rejects(optimizeProfileImage({...source,type:'image/svg+xml'},1600,360000),/Choisissez une photo/);
 await assert.rejects(optimizeProfileImage({...source,size:PROFILE_IMAGE_MAX_BYTES+1},1600,360000),/25 Mo/);
});

test('empty canvas output is never accepted as an uploaded photo',async()=>{
 await browserFixture(async()=>{await assert.rejects(optimizeProfileImage(source,1600,360000),/version JPG/)},{encode(){return 'data:,'}});
});

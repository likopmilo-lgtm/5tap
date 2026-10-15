import assert from 'node:assert/strict';
import test from 'node:test';
import {cleanPortfolio,coverNumber,imageData,profileMediaUrl} from '../app/profile-media.ts';

const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l4sAAAAASUVORK5CYII=';
const image=index=>({id:`00000000-0000-4000-8000-${String(index).padStart(12,'0')}`,dataUrl:png,caption:`  Projet ${index}  `,width:1280,height:800});

test('keeps the owner-selected photo order and cleans captions',()=>{
 const result=cleanPortfolio([image(2),image(1)]);
 assert.equal(result[0].id,image(2).id);assert.equal(result[1].caption,'Projet 1');
 assert.equal(result[0].dataUrl,png);assert.equal(result[0].width,1280);
});
test('limits image count, image size and duplicate references',()=>{
 assert.equal(cleanPortfolio(Array.from({length:6},(_,i)=>image(i))).length,6);
 assert.throws(()=>cleanPortfolio(Array.from({length:7},(_,i)=>image(i))),/maximum 6/);
 assert.throws(()=>cleanPortfolio([image(1),image(1)]),/invalide/);
 assert.throws(()=>cleanPortfolio([{...image(1),dataUrl:'data:image/png;base64,'+'A'.repeat(220001)}]),/volumineuse/);
});
test('accepts only bounded inline raster images',()=>{
 assert.equal(imageData(png),png);
 assert.equal(imageData('data:image/svg+xml;base64,PHN2Zz4='),'');
 assert.equal(imageData('https://example.com/photo.jpg'),'');
 assert.equal(imageData('data:image/png;base64,AAAAAAAAAAAA'),'');
});
test('bounds cover settings and safely encodes media addresses',()=>{
 assert.equal(coverNumber(700,120,320,180),320);
 assert.equal(coverNumber(-10,0,100,50),0);
 assert.equal(coverNumber(Number.NaN,0,100,50),50);
 assert.equal(profileMediaUrl('5tap-0001',image(1).id),`/api/profile-media/5tap-0001/${image(1).id}`);
});

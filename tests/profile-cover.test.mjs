import assert from 'node:assert/strict';
import test from 'node:test';
import {coverDragPosition,coverImageStyle} from '../app/profile-cover.ts';

test('portrait photos can move vertically without introducing empty edges',()=>{
 const image={width:236,height:419},frame={width:350,height:170};
 const moved=coverDragPosition(image,frame,125,{x:50,y:50},{x:0,y:80});
 assert.equal(moved.x,50);assert.ok(moved.y<50);assert.ok(moved.y>=0);
 assert.deepEqual(coverDragPosition(image,frame,125,{x:50,y:50},{x:10000,y:-10000}),{x:0,y:100});
});

test('wide photos can be moved horizontally while an uncropped axis stays fixed',()=>{
 const image={width:1600,height:400},frame={width:400,height:200};
 assert.deepEqual(coverDragPosition(image,frame,100,{x:50,y:50},{x:100,y:80}),{x:25,y:50});
});

test('zoom creates room to pan an otherwise fitted image',()=>{
 const image={width:800,height:400},frame={width:400,height:200};
 assert.deepEqual(coverDragPosition(image,frame,100,{x:50,y:50},{x:20,y:20}),{x:50,y:50});
 assert.deepEqual(coverDragPosition(image,frame,200,{x:50,y:50},{x:100,y:50}),{x:25,y:25});
});

test('unloaded or invalid dimensions leave the existing position intact',()=>{
 for(const width of [0,NaN,Infinity])assert.deepEqual(coverDragPosition({width,height:100},{width:400,height:200},125,{x:25,y:75},{x:100,y:100}),{x:25,y:75});
});

test('equivalent drags on mobile and desktop produce the same focal point',()=>{
 const image={width:800,height:400},start={x:50,y:50};
 const desktop=coverDragPosition(image,{width:400,height:200},150,start,{x:40,y:-20});
 const mobile=coverDragPosition(image,{width:200,height:100},150,start,{x:20,y:-10});
 assert.deepEqual(mobile,desktop);
});

test('full-photo mode ignores previous zoom and crop so all four image edges stay visible',()=>{
 for(const crop of [{coverZoom:200,coverPositionX:0,coverPositionY:100},{coverZoom:100,coverPositionX:50,coverPositionY:50}]){
  const style=coverImageStyle({...crop,coverFit:'contain'});
  assert.equal(style.objectFit,'contain');assert.equal(style.transform,'none');assert.equal(style.objectPosition,'50% 50%');
 }
 const legacy=coverImageStyle({coverZoom:125,coverPositionX:34,coverPositionY:10});
 assert.equal(legacy.objectFit,'cover');assert.equal(legacy.transform,'scale(1.25)');assert.equal(legacy.objectPosition,'34% 10%');
});

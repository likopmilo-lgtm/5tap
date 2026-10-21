import assert from 'node:assert/strict';
import test from 'node:test';
import {tiktokUrl} from '../app/profile-links.ts';

test('TikTok usernames work with or without @, including the account saved by card 40',()=>{
 for(const value of ['la_morsure_patisserie','@la_morsure_patisserie','  @la_morsure_patisserie  ']){
  assert.equal(tiktokUrl(value),'https://www.tiktok.com/@la_morsure_patisserie');
 }
});

test('TikTok profile URLs and mobile share URLs keep their path and query',()=>{
 for(const value of ['https://www.tiktok.com/@example?lang=fr','https://vm.tiktok.com/ABC123/','https://vt.tiktok.com/XYZ123/'])assert.equal(tiktokUrl(value),value);
 assert.equal(tiktokUrl('www.tiktok.com/@example'),'https://www.tiktok.com/@example');
 assert.equal(tiktokUrl('tiktok.com/@example'),'https://tiktok.com/@example');
 assert.equal(tiktokUrl('http://www.tiktok.com/@example'),'https://www.tiktok.com/@example');
});

test('empty, malformed and unsafe TikTok destinations do not produce clickable links',()=>{
 for(const value of ['', '  ', '@', 'two accounts', 'javascript:alert(1)', 'https://tiktok.com.evil.example/@test','https://eviltiktok.com/@test','https://example.com','https://tiktok.com@evil.example','https://user:pass@tiktok.com/@test','https://tiktok.com:8443/@test'])assert.equal(tiktokUrl(value),'',value);
});

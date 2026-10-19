import assert from 'node:assert/strict';
import test from 'node:test';
import {cleanProfileDocument,documentBytes,documentDisposition,documentMime,DOCUMENT_MAX_BYTES,profileDocumentUrl} from '../app/profile-document.ts';

const id='00000000-0000-4000-8000-000000000001';
const pdf=Buffer.from('%PDF-1.4\nA synthetic CV for tests only.\n%%EOF\n');
const make=(bytes=pdf,name='cv-test.pdf',mimeType='application/pdf')=>({id,name,mimeType,size:bytes.length,label:'  Mon CV  ',dataUrl:`data:${mimeType};base64,${bytes.toString('base64')}`});
test('PDF bytes, metadata-only retention, label and explicit removal',()=>{
 const doc=cleanProfileDocument(make());assert.equal(doc.label,'Mon CV');assert.deepEqual(Buffer.from(documentBytes(doc.dataUrl,doc.mimeType)),pdf);
 const {dataUrl,...metadata}=doc;assert.deepEqual(cleanProfileDocument(metadata),metadata);assert.equal(cleanProfileDocument(null),null);
 assert.equal(cleanProfileDocument({...make(),label:' '}).label,'Mon CV');
});
test('validates Word signatures and rejects other ZIP formats and macros',()=>{
 const doc=Buffer.from([208,207,17,224,161,177,26,225,0,0]);
 assert.equal(cleanProfileDocument(make(doc,'cv.doc','application/msword')).mimeType,'application/msword');
 const mime='application/vnd.openxmlformats-officedocument.wordprocessingml.document';
 const zip=Buffer.concat([Buffer.from([80,75,3,4]),Buffer.from('[Content_Types].xml word/document.xml')]);
 assert.equal(cleanProfileDocument(make(zip,'cv.docx',mime)).mimeType,mime);
 assert.throws(()=>cleanProfileDocument(make(Buffer.from('PK archive of something else'),'cv.docx',mime)));
 assert.throws(()=>cleanProfileDocument(make(Buffer.concat([zip,Buffer.from('vbaProject.bin')]),'cv.docx',mime)));
});
test('rejects disguised files, invalid padding, wrong length and header injection',()=>{
 for(const value of [make(Buffer.from('<html>bad</html>')), {...make(),mimeType:'text/html'}, {...make(),size:10}, {...make(),id:'../private'}, {...make(),name:'bad\r\nname.pdf'}, {...make(),name:'../cv.pdf'}, {...make(),dataUrl:'data:application/pdf;base64,AAAA='}])assert.throws(()=>cleanProfileDocument(value));
 assert.equal(documentMime('CV.PDF'),'application/pdf');assert.equal(documentMime('cv.html'),'');
});
test('allows the 5 MB boundary and rejects excess before decoding',()=>{
 const bytes=Buffer.alloc(DOCUMENT_MAX_BYTES,32);pdf.copy(bytes);Buffer.from('%%EOF').copy(bytes,bytes.length-5);
 assert.equal(cleanProfileDocument(make(bytes)).size,DOCUMENT_MAX_BYTES);
 assert.throws(()=>cleanProfileDocument({...make(),size:DOCUMENT_MAX_BYTES+1}),/5 Mo/);
 assert.throws(()=>documentBytes('data:application/pdf;base64,'+'A'.repeat(4*Math.ceil(DOCUMENT_MAX_BYTES/3)+4),'application/pdf'),/5 Mo/);
});
test('encodes public URLs and safe inline/download filenames',()=>{
 const doc=cleanProfileDocument({...make(),name:'CV été "2026".pdf'});
 assert.match(documentDisposition(doc,false),/^inline; filename="document.pdf"; filename\*=UTF-8''CV/);
 assert.match(documentDisposition(doc,true),/^attachment;/);
 assert.match(documentDisposition({...doc,mimeType:'application/msword',name:'cv.doc'},false),/^attachment;/);
 assert.equal(profileDocumentUrl('qa-cv',id,true),`/api/profile-document/qa-cv/${id}?download=1`);
});

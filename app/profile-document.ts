export const DOCUMENT_MAX_BYTES=5*1024*1024;
export const PROFILE_REQUEST_MAX_BYTES=10_000_000;
export const DOCUMENT_ACCEPT='.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const mimeByExtension:Record<string,string>={pdf:'application/pdf',doc:'application/msword',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'};
export type ProfileDocument={id:string;name:string;mimeType:string;size:number;label:string;dataUrl?:string};

export function documentMime(name:string){return mimeByExtension[name.split('.').pop()?.toLowerCase()||'']||''}
export function documentBytes(dataUrl:string,mime:string):Uint8Array<ArrayBuffer>{
 const prefix=`data:${mime};base64,`;
 if(!dataUrl.startsWith(prefix))throw new Error('Format de document invalide.');
 const base64=dataUrl.slice(prefix.length);
 if(base64.length>4*Math.ceil(DOCUMENT_MAX_BYTES/3))throw new Error('Le document doit faire 5 Mo maximum.');
 if(!base64||base64.length%4!==0||!/^[a-z0-9+/]+={0,2}$/i.test(base64))throw new Error('Document illisible.');
 try{
  const native=(Uint8Array as unknown as {fromBase64?:(value:string)=>Uint8Array<ArrayBuffer>}).fromBase64;
  if(native)return native.call(Uint8Array,base64);
  const binary=atob(base64),bytes=new Uint8Array(binary.length);
  for(let index=0;index<binary.length;index++)bytes[index]=binary.charCodeAt(index);
  return bytes;
 }catch{throw new Error('Document illisible.')}
}
function validSignature(bytes:Uint8Array,mime:string){
 const starts=(values:number[])=>values.every((value,index)=>bytes[index]===value);
 const text=(slice:Uint8Array)=>new TextDecoder().decode(slice);
 if(mime==='application/pdf')return starts([37,80,68,70,45])&&text(bytes.slice(-1024)).includes('%%EOF');
 if(mime==='application/msword')return starts([208,207,17,224,161,177,26,225]);
 const zip=text(bytes);
 return starts([80,75,3,4])&&zip.includes('[Content_Types].xml')&&zip.includes('word/document.xml')&&!zip.includes('vbaProject.bin');
}
export function parseProfileDocument(value:unknown):{document:ProfileDocument|null;bytes?:Uint8Array<ArrayBuffer>}{
 if(value===null)return {document:null};
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Document invalide.');
 const item=value as Record<string,unknown>;
 if(typeof item.id!=='string'||!uuid.test(item.id))throw new Error('Référence de document invalide.');
 if(typeof item.name!=='string'||item.name.length>120||/[\u0000-\u001f\u007f/\\]/.test(item.name))throw new Error('Nom de fichier invalide.');
 const name=item.name.trim(),mime=documentMime(name);
 if(!mime||item.mimeType!==mime)throw new Error('Choisissez un document PDF, DOC ou DOCX.');
 if(typeof item.size!=='number'||!Number.isInteger(item.size)||item.size<1||item.size>DOCUMENT_MAX_BYTES)throw new Error('Le document doit faire 5 Mo maximum.');
 const label=typeof item.label==='string'?item.label.trim().slice(0,60):'';
 const result:ProfileDocument={id:item.id,name,mimeType:mime,size:item.size,label:label||'Mon CV'};
 let bytes:Uint8Array<ArrayBuffer>|undefined;
 if('dataUrl' in item){
  if(typeof item.dataUrl!=='string')throw new Error('Document illisible.');
  bytes=documentBytes(item.dataUrl,mime);
  if(bytes.length!==item.size||!validSignature(bytes,mime))throw new Error('Le contenu du document ne correspond pas à son format.');
  result.dataUrl=item.dataUrl;
 }
 return {document:result,bytes};
}
export function cleanProfileDocument(value:unknown):ProfileDocument|null{return parseProfileDocument(value).document}
export async function readProfileDocument(file:File){
 const mime=documentMime(file.name);
 if(!mime)throw new Error('Choisissez un document PDF, DOC ou DOCX.');
 if(file.size<1||file.size>DOCUMENT_MAX_BYTES)throw new Error('Le document doit faire 5 Mo maximum.');
 const dataUrl=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('Impossible de lire ce document.'));reader.readAsDataURL(new Blob([file],{type:mime}))});
 return cleanProfileDocument({id:crypto.randomUUID(),name:file.name,mimeType:mime,size:file.size,label:'Mon CV',dataUrl})!;
}
export function profileDocumentUrl(slug:string,id:string,download=false){return `/api/profile-document/${encodeURIComponent(slug)}/${encodeURIComponent(id)}${download?'?download=1':''}`}
export function documentSize(size:number){return size<1024*1024?`${Math.max(1,Math.ceil(size/1024))} Ko`:`${(size/(1024*1024)).toLocaleString('fr-FR',{maximumFractionDigits:1})} Mo`}
export function documentDisposition(document:ProfileDocument,download:boolean){
 const extension=document.name.split('.').pop()!.toLowerCase();
 const encoded=encodeURIComponent(document.name).replace(/[!'()*]/g,char=>'%'+char.charCodeAt(0).toString(16).toUpperCase());
 return `${download||document.mimeType!=='application/pdf'?'attachment':'inline'}; filename="document.${extension}"; filename*=UTF-8''${encoded}`;
}

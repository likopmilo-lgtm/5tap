export const PROFILE_IMAGE_MAX_BYTES=25*1024*1024;
export const PROFILE_IMAGE_ACCEPT='image/jpeg,image/png,image/webp,image/heic,image/heif,image/avif';

export async function optimizeProfileImage(file:File,maxEdge:number,maxLength:number){
 const supported=/^image\/(jpeg|png|webp|heic|heif|avif)$/i.test(file.type)||(!file.type&&/\.(jpe?g|png|webp|heic|heif|avif)$/i.test(file.name));
 if(!supported)throw new Error('Choisissez une photo JPG, PNG, WebP, HEIC ou AVIF.');
 if(file.size>PROFILE_IMAGE_MAX_BYTES)throw new Error('Cette photo dépasse 25 Mo. Choisissez une version plus légère.');
 const url=URL.createObjectURL(file);
 let canvas:HTMLCanvasElement|undefined;
 try{
  const image=await new Promise<HTMLImageElement>((resolve,reject)=>{
   const element=new Image();element.onload=()=>resolve(element);element.onerror=()=>reject(new Error('Cette photo ne peut pas être lue. Essayez une version JPG.'));element.src=url;
  });
  if(!image.naturalWidth||!image.naturalHeight)throw new Error('Cette photo ne peut pas être lue. Essayez une version JPG.');
  canvas=document.createElement('canvas');const ctx=canvas.getContext('2d');
  if(!ctx)throw new Error('Impossible de préparer cette image.');
  let scale=Math.min(1,maxEdge/Math.max(image.naturalWidth,image.naturalHeight));
  let format='image/webp';
  for(let attempt=0;attempt<12;attempt++){
   canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
   ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);
   const quality=Math.max(.5,.84-attempt*.06);
   let dataUrl=canvas.toDataURL(format,quality);
   // Safari can return PNG when asked for WebP. PNG ignores the quality argument.
   if(format==='image/webp'&&!dataUrl.startsWith('data:image/webp;')){format='image/jpeg';dataUrl=canvas.toDataURL(format,quality)}
   if(/^data:image\/(webp|jpeg|png);base64,/.test(dataUrl)&&dataUrl.length<=maxLength)return {dataUrl,width:canvas.width,height:canvas.height};
   scale*=.8;
   await new Promise(resolve=>setTimeout(resolve,0));
  }
  throw new Error('Impossible de préparer cette photo. Essayez une version JPG.');
 }finally{if(canvas){canvas.width=1;canvas.height=1}URL.revokeObjectURL(url)}
}

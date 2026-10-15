export async function optimizeProfileImage(file:File,maxEdge:number,maxLength:number){
 if(!/^image\/(jpeg|png|webp)$/i.test(file.type)||file.size>8*1024*1024)throw new Error('Choisissez une image JPG, PNG ou WebP de moins de 8 Mo.');
 const url=URL.createObjectURL(file);
 try{
  const image=await new Promise<HTMLImageElement>((resolve,reject)=>{
   const element=new Image();element.onload=()=>resolve(element);element.onerror=()=>reject(new Error('Cette image ne peut pas être lue.'));element.src=url;
  });
  const canvas=document.createElement('canvas');const ctx=canvas.getContext('2d');
  if(!ctx)throw new Error('Impossible de préparer cette image.');
  let scale=Math.min(1,maxEdge/Math.max(image.naturalWidth,image.naturalHeight));
  for(let attempt=0;attempt<6;attempt++){
   canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
   ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);
   const dataUrl=canvas.toDataURL('image/webp',attempt<2?.82:.72);
   if(dataUrl.length<=maxLength)return {dataUrl,width:canvas.width,height:canvas.height};
   scale*=.8;
  }
  throw new Error('Cette image reste trop volumineuse. Essayez une photo plus légère.');
 }finally{URL.revokeObjectURL(url)}
}

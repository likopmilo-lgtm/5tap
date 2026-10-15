export const PORTFOLIO_LIMIT=6;
export const PORTFOLIO_IMAGE_LIMIT=220000;
export const COVER_IMAGE_LIMIT=360000;
export type PortfolioImage={id:string;caption:string;width:number;height:number;dataUrl?:string};
export const mediaIdPattern=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

export function imageData(value:unknown,max=COVER_IMAGE_LIMIT){
 if(typeof value!=='string'||value.length>max)return '';
 const match=/^data:image\/(jpeg|png|webp);base64,([a-z0-9+/]+={0,2})$/i.exec(value);
 if(!match)return '';
 const signatures:Record<string,string>={jpeg:'/9j/',png:'iVBORw0KGgo',webp:'UklGR'};
 return match[2].startsWith(signatures[match[1].toLowerCase()])?value:'';
}

export function coverNumber(value:unknown,min:number,max:number,fallback:number){
 return typeof value==='number'&&Number.isFinite(value)?Math.min(max,Math.max(min,Math.round(value))):fallback;
}

export function cleanPortfolio(value:unknown):PortfolioImage[]{
 if(!Array.isArray(value)||value.length>PORTFOLIO_LIMIT)throw new Error('Ajoutez au maximum 6 photos au portfolio.');
 const ids=new Set<string>();
 return value.map(item=>{
  if(!item||typeof item!=='object'||!mediaIdPattern.test(item.id)||ids.has(item.id))throw new Error('Photo du portfolio invalide.');
  ids.add(item.id);
  const dataUrl=imageData(item.dataUrl,PORTFOLIO_IMAGE_LIMIT);
  if(!dataUrl)throw new Error('Une photo du portfolio est invalide ou trop volumineuse.');
  return {id:item.id,dataUrl,caption:typeof item.caption==='string'?item.caption.trim().slice(0,120):'',width:coverNumber(item.width,1,2000,1200),height:coverNumber(item.height,1,2000,800)};
 });
}

export function profileMediaUrl(slug:string,id:string){return `/api/profile-media/${encodeURIComponent(slug)}/${encodeURIComponent(id)}`}

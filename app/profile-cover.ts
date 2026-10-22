export type CoverSettings={coverHeight:number;coverZoom:number;coverPositionX:number;coverPositionY:number};
type Size={width:number;height:number};
type Point={x:number;y:number};

export function coverImageStyle(settings:Pick<CoverSettings,'coverZoom'|'coverPositionX'|'coverPositionY'>){
 const position=`${settings.coverPositionX}% ${settings.coverPositionY}%`;
 return {objectPosition:position,transform:`scale(${settings.coverZoom/100})`,transformOrigin:position};
}

export function coverDragPosition(image:Size,frame:Size,zoom:number,start:Point,delta:Point):Point{
 if(![image.width,image.height,frame.width,frame.height,zoom].every(value=>Number.isFinite(value)&&value>0))return start;
 const scale=Math.max(frame.width/image.width,frame.height/image.height)*zoom/100;
 const move=(position:number,distance:number,overflow:number)=>overflow>0.5?Math.max(0,Math.min(100,Math.round(position-distance/overflow*100))):position;
 return {x:move(start.x,delta.x,image.width*scale-frame.width),y:move(start.y,delta.y,image.height*scale-frame.height)};
}

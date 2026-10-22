'use client';
import {useId,useRef,useState,type PointerEvent} from 'react';
import {Move} from 'lucide-react';
import {coverDragPosition,coverImageStyle,type CoverSettings} from './profile-cover';

type Drag={pointerId:number;clientX:number;clientY:number;image:{width:number;height:number};frame:{width:number;height:number};zoom:number;start:{x:number;y:number}};

export default function ProfileCoverEditor({src,value,onChange,disabled=false}:{src:string;value:CoverSettings;onChange:(patch:Partial<CoverSettings>)=>void;disabled?:boolean}){
 const imageRef=useRef<HTMLImageElement>(null),drag=useRef<Drag|null>(null);
 const[dragging,setDragging]=useState(false);const helpId=useId();
 function startDrag(event:PointerEvent<HTMLDivElement>){
  const image=imageRef.current;
  if(disabled||!event.isPrimary||event.button!==0||!image?.naturalWidth)return;
  event.preventDefault();
  drag.current={pointerId:event.pointerId,clientX:event.clientX,clientY:event.clientY,image:{width:image.naturalWidth,height:image.naturalHeight},frame:{width:event.currentTarget.clientWidth,height:event.currentTarget.clientHeight},zoom:value.coverZoom,start:{x:value.coverPositionX,y:value.coverPositionY}};
  event.currentTarget.setPointerCapture(event.pointerId);setDragging(true);
 }
 function moveDrag(event:PointerEvent<HTMLDivElement>){
  const current=drag.current;if(!current||current.pointerId!==event.pointerId||disabled)return;
  const position=coverDragPosition(current.image,current.frame,current.zoom,current.start,{x:event.clientX-current.clientX,y:event.clientY-current.clientY});
  onChange({coverPositionX:position.x,coverPositionY:position.y});
 }
 function endDrag(event:PointerEvent<HTMLDivElement>){
  if(drag.current?.pointerId!==event.pointerId)return;
  drag.current=null;setDragging(false);
  if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
 }
 return <div className="cover-editor">
  <p className="cover-editor-help" id={helpId}><Move size={16}/><span>Faites glisser la photo pour la repositionner, ou utilisez les curseurs.</span></p>
  <div className={'cover-editor-canvas'+(dragging?' is-dragging':'')} role="group" aria-label="Cadrage de la couverture" aria-describedby={helpId} aria-disabled={disabled} style={{height:value.coverHeight}} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={()=>{drag.current=null;setDragging(false)}}>
   <img ref={imageRef} src={src} alt="Votre couverture" draggable={false} style={coverImageStyle(value)}/>
  </div>
  <div className="cover-controls">
   <label>Hauteur <strong>{value.coverHeight} px</strong><input aria-label="Hauteur de la couverture" type="range" min={120} max={320} step={10} value={value.coverHeight} disabled={disabled} onChange={event=>onChange({coverHeight:Number(event.target.value)})}/></label>
   <label>Zoom <strong>{value.coverZoom} %</strong><input aria-label="Zoom de la couverture" type="range" min={100} max={200} step={5} value={value.coverZoom} disabled={disabled} onChange={event=>onChange({coverZoom:Number(event.target.value)})}/></label>
   <label>Gauche / droite <strong>{value.coverPositionX} %</strong><input aria-label="Position horizontale de la couverture" type="range" min={0} max={100} value={value.coverPositionX} disabled={disabled} onChange={event=>onChange({coverPositionX:Number(event.target.value)})}/></label>
   <label>Haut / bas <strong>{value.coverPositionY} %</strong><input aria-label="Position verticale de la couverture" type="range" min={0} max={100} value={value.coverPositionY} disabled={disabled} onChange={event=>onChange({coverPositionY:Number(event.target.value)})}/></label>
  </div>
 </div>;
}

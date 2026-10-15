import {notFound} from 'next/navigation';
import type {ReactNode} from 'react';
import {AtSign,BriefcaseBusiness,Camera,Globe,Headphones,Mail,MapPin,Music2,Palette,Phone,Send,Share2,Video} from 'lucide-react';
import {externalUrl,getPublicCardProfile,mapsUrl,whatsappUrl} from '../../card-profile';
import {InstagramIcon,WhatsAppIcon} from '../../profile-brand-icons';
import SaveContact from '../../save-contact';
import PortfolioGallery from '../../portfolio-gallery';
import {profileMediaUrl} from '../../profile-media';
export const dynamic='force-dynamic';

const socialBases:Record<string,string>={instagram:'https://instagram.com/',facebook:'https://facebook.com/',linkedin:'https://linkedin.com/in/',tiktok:'https://tiktok.com/@',youtube:'https://youtube.com/@',x:'https://x.com/',snapchat:'https://snapchat.com/add/',telegram:'https://t.me/',pinterest:'https://pinterest.com/',github:'https://github.com/',behance:'https://behance.net/',dribbble:'https://dribbble.com/',twitch:'https://twitch.tv/',spotify:'https://open.spotify.com/'};
function socialHref(platform:string,value:string){if(/^https?:\/\//i.test(value))return externalUrl(value);const clean=value.replace(/^@/,'').replace(/^\//,'');return socialBases[platform]?`${socialBases[platform]}${clean}`:externalUrl(value)}
function socialIcon(platform:string){const icons:Record<string,ReactNode>={instagram:<InstagramIcon/>,facebook:<Share2/>,linkedin:<BriefcaseBusiness/>,tiktok:<Music2/>,youtube:<Video/>,x:<AtSign/>,snapchat:<Camera/>,telegram:<Send/>,pinterest:<Palette/>,github:<Globe/>,behance:<Palette/>,dribbble:<Palette/>,twitch:<Video/>,spotify:<Headphones/>};return icons[platform]||<Share2/>}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const p=await getPublicCardProfile(slug);return {title:p?.display_name||'Profil 5Tap',description:p?.bio||'Profil digital partagé avec une carte NFC 5Tap',robots:{index:Boolean(p),follow:Boolean(p)}}}
export default async function Page({params}:{params:Promise<{slug:string}>}){
 const{slug}=await params;const p=await getPublicCardProfile(slug);if(!p)notFound();
 const initials=p.display_name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
 const storedSocials=Array.isArray(p.social_links)?p.social_links:[];
 const legacySocials=storedSocials.length?[]:[p.instagram&&{platform:'instagram',label:'Instagram',url:p.instagram},p.facebook&&{platform:'facebook',label:'Facebook',url:p.facebook},p.linkedin&&{platform:'linkedin',label:'LinkedIn',url:p.linkedin}].filter(Boolean) as {platform:string;label:string;url:string}[];
 const instagram=storedSocials.find(item=>item.platform==='instagram'&&item.url)?.url||p.instagram;
 const instagramLink=instagram?socialHref('instagram',instagram):'';
 const socials=[...storedSocials,...legacySocials].filter(item=>item?.url&&item.platform!=='instagram').map((item,index)=>({href:socialHref(item.platform,item.url),icon:socialIcon(item.platform),label:item.label||item.platform,key:`${item.platform}-${index}`})).filter(item=>item.href);
 const mapLink=mapsUrl(p);
 const hasLocation=Boolean(mapLink);const locationLabel=p.address||'Voir la localisation';
 const coverUrl=p.cover_media_id?profileMediaUrl(p.public_slug,p.cover_media_id):'';
 const portfolio=(Array.isArray(p.portfolio_images)?p.portfolio_images:[]).map(item=>({...item,src:profileMediaUrl(p.public_slug,item.id)}));
 const details=[p.email&&{href:`mailto:${p.email}`,icon:<Mail/>,label:'Email',value:p.email},p.website&&{href:externalUrl(p.website),icon:<Globe/>,label:'Site web',value:p.website.replace(/^https?:\/\//,'')},p.custom_url&&{href:externalUrl(p.custom_url),icon:<Globe/>,label:p.custom_label||'Autre lien',value:'Ouvrir'}].filter(Boolean) as {href:string;icon:ReactNode;label:string;value:string}[];
 return <main className="public-profile-page"><section className="public-profile-shell">
  <div className={'public-profile-cover '+(coverUrl?'has-custom-cover':'')} style={coverUrl?{height:p.cover_height||180}:undefined}>{coverUrl&&<img className="profile-cover-image" src={coverUrl} alt="" style={{objectPosition:`${p.cover_position_x??50}% ${p.cover_position_y??50}%`,transform:`scale(${(p.cover_zoom||100)/100})`,transformOrigin:`${p.cover_position_x??50}% ${p.cover_position_y??50}%`}} fetchPriority="high"/>}<div className="public-profile-top"><img src="/logo-5tap.png" width="110" height="44" alt="5Tap"/><span>PROFIL DIGITAL</span></div></div>
  <div className="public-profile-avatar">{p.avatar_data_url?<img src={p.avatar_data_url} alt={`Photo de ${p.display_name}`}/>:initials||'5T'}</div>
  <div className="public-profile-identity"><h1>{p.display_name}</h1><p className="public-profile-role">{[p.job_title,p.company].filter(Boolean).join(' · ')}</p>{p.address&&<p className="public-profile-city"><MapPin/>{p.address}</p>}{p.bio&&<p className="public-profile-bio">{p.bio}</p>}</div>
  <SaveContact slug={p.public_slug} photo={p.avatar_data_url||''}/>
  {(p.phone||p.whatsapp||instagramLink)&&<div className="public-quick-actions" aria-label="Contacter et suivre">
   {p.phone&&<a className="profile-action-call" href={`tel:${p.phone}`}><span><Phone/></span><small>Appeler</small></a>}
   {p.whatsapp&&<a className="profile-action-whatsapp" href={whatsappUrl(p.whatsapp)} target="_blank" rel="noreferrer"><span><WhatsAppIcon/></span><small>WhatsApp</small></a>}
   {instagramLink&&<a className="profile-action-instagram" href={instagramLink} target="_blank" rel="noreferrer"><span><InstagramIcon/></span><small>Instagram</small></a>}
  </div>}
  <div className="public-profile-links">{details.map(link=><a href={link.href} key={link.label} target={link.href.startsWith('http')?'_blank':undefined} rel="noreferrer"><span>{link.icon}</span><span><small>{link.label}</small><strong>{link.value}</strong></span></a>)}</div>
  {hasLocation&&<a className="public-location-action" href={mapLink} target="_blank" rel="noreferrer"><MapPin/>Itinéraire</a>}
  {socials.length>0&&<div className="public-socials" aria-label="Autres réseaux sociaux">{socials.map(item=><a href={item.href} key={item.key} target="_blank" rel="noreferrer" aria-label={item.label}>{item.icon}<small>{item.label}</small></a>)}</div>}
  {hasLocation&&<div className="public-map-card"><div><MapPin/><span><small>LOCALISATION</small><strong>{locationLabel}</strong></span></div><a href={mapLink} target="_blank" rel="noreferrer">Ouvrir dans Google Maps</a></div>}
  <PortfolioGallery photos={portfolio}/>
  <footer>Profil digital créé avec <strong>5Tap</strong></footer>
 </section></main>
}

import {ArrowUpRight,Download,FileText} from 'lucide-react';
import {documentSize,type ProfileDocument} from './profile-document';

export default function ProfileDocumentCard({document,href,downloadHref}:{document:ProfileDocument;href:string;downloadHref?:string}){
 const isPdf=document.mimeType==='application/pdf';
 return <div className="profile-document-card"><a className="profile-document-open" href={href} target="_blank" rel="noopener noreferrer" aria-label={`${isPdf?'Consulter':'Télécharger'} ${document.label}`}><span className="profile-document-icon"><FileText size={24}/></span><span className="profile-document-info"><strong>{document.label}</strong><small>{document.name}</small><span>{document.name.split('.').pop()?.toUpperCase()} · {documentSize(document.size)}</span></span>{isPdf?<ArrowUpRight size={20}/>:<Download size={20}/>}</a>{isPdf&&downloadHref&&<a className="profile-document-download" href={downloadHref} aria-label={`Télécharger ${document.label}`}><Download size={19}/></a>}</div>;
}

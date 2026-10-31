import type {LanguageCode} from './client-translations';

export function Flag({code}:{code:LanguageCode}){
 return <svg className="language-flag" viewBox="0 0 60 40" aria-hidden="true">{code==='fr'?<><path fill="#002395" d="M0 0h20v40H0z"/><path fill="#fff" d="M20 0h20v40H20z"/><path fill="#ed2939" d="M40 0h20v40H40z"/></>:code==='ar'?<><path fill="#c1272d" d="M0 0h60v40H0z"/><path d="m30 9 6.5 21-17-13h21l-17 13Z" fill="none" stroke="#006233" strokeWidth="2"/></>:code==='es'?<><path fill="#aa151b" d="M0 0h60v40H0z"/><path fill="#f1bf00" d="M0 10h60v20H0z"/><path fill="#aa151b" d="M16 16h6v9h-6z"/></>:<><path fill="#012169" d="M0 0h60v40H0z"/><path stroke="#fff" strokeWidth="8" d="m0 0 60 40M60 0 0 40"/><path stroke="#c8102e" strokeWidth="3" d="m0 0 60 40M60 0 0 40"/><path stroke="#fff" strokeWidth="13" d="M30 0v40M0 20h60"/><path stroke="#c8102e" strokeWidth="7" d="M30 0v40M0 20h60"/></>}</svg>
}

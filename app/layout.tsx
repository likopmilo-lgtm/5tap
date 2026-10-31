import type {Metadata} from 'next';
import './globals.css';
import {getSiteData} from './supabase-server';
import MarketingTracking from './marketing-tracking';
export const metadata:Metadata={title:{default:'5Tap — Cartes de visite digitales NFC et Google Review',template:'%s | 5Tap'},description:'Cartes de visite digitales NFC dès 179 DH et supports Google Review dès 149 DH. Livraison gratuite partout au Maroc.',icons:{icon:'/favicon.svg'},metadataBase:new URL('https://5tap.ma')};
async function TrackingScripts(){const data=await getSiteData();return <MarketingTracking settings={{metaPixelId:data.settings.metaPixelId,googleAnalyticsId:data.settings.googleAnalyticsId,googleTagManagerId:data.settings.googleTagManagerId}}/>}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/></head><body>{children}<TrackingScripts/></body></html>}

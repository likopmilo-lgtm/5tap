import Store from './store';
import {getSiteData} from './supabase-server';
export async function generateMetadata(){const data=await getSiteData();const page=data.pages.home;return {title:page?.title||data.settings.defaultTitle,description:page?.description||data.settings.defaultDescription,alternates:{canonical:page?.seo?.canonicalPath||'/'}}}
export default async function Home(){const data=await getSiteData();return <Store view="home" initialData={data}/>}

import type {Metadata} from 'next';
import {business} from '@/lib/content';
import {Header} from '@/components/irha/header';
import {Footer} from '@/components/irha/shared';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL(business.siteUrl),title:{default:'IRHA ANSARI TRAVELS | B2B Umrah Visa Specialists',template:'%s | IRHA ANSARI TRAVELS'},description:'Specialist B2B support for travel agents: group and individual Umrah visa assistance, hotel and catering BRN coordination, and transport.',openGraph:{type:'website',siteName:business.name,title:'IRHA ANSARI TRAVELS — Umrah Visa Specialists',description:'Your agency’s partner for Umrah visa assistance and ground coordination.',images:[{url:'/images/kaaba.webp',width:1600,height:1067,alt:'The Kaaba at Masjid al-Haram'}]},twitter:{card:'summary_large_image'},icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/></body></html>}

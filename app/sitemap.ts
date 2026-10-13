import {business} from '@/lib/content';
export default function sitemap(){return ['','/visa-services','/ground-services','/about','/contact','/privacy'].map(path=>({url:business.siteUrl+path}))}

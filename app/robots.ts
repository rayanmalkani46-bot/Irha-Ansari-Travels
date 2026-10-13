import {business} from '@/lib/content';
export default function robots(){return {rules:{userAgent:'*',allow:'/',disallow:'/api/'},sitemap:business.siteUrl+'/sitemap.xml'}}

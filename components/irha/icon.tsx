import { UsersRound, BookOpenCheck, FileCheck2, Building2, Utensils, BusFront, ArrowUpRight, ArrowRight, Check, Sparkles, ShieldCheck } from 'lucide-react';
const icons={users:UsersRound,passport:BookOpenCheck,file:FileCheck2,building:Building2,dining:Utensils,bus:BusFront,arrow:ArrowUpRight,right:ArrowRight,check:Check,spark:Sparkles,shield:ShieldCheck};
export function Icon({name,className=''}:{name:keyof typeof icons;className?:string}){const Component=icons[name];return <Component aria-hidden="true" size={24} strokeWidth={1.4} className={className}/>;}

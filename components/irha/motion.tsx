'use client';
import {useEffect} from 'react';
export function Motion(){useEffect(()=>{const q=window.matchMedia('(prefers-reduced-motion: reduce)'); if(q.matches)return;const hero=document.querySelector<HTMLElement>('.hero-photo');let ticking=false;function update(){if(!ticking){requestAnimationFrame(()=>{if(hero&&innerWidth>768)hero.style.transform=`translateY(${Math.min(scrollY*.12,75)}px) scale(1.1)`;ticking=false});ticking=true}}window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update)},[]);return null}

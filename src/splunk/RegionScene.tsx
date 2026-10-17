import { useId } from 'react';
import { LandscapeLandmark } from '../components/adventure/LandscapeLandmark';

// Decorative, local vectors only. No controls or learning state live in scenery.
export default function RegionScene({ theme }: { theme: string }) {
  const water = useId();
  return <svg className="sp-harbor sp-region-scene" viewBox="0 0 540 330" aria-hidden="true" focusable="false" data-scene={theme}>
    <defs><linearGradient id={water} x2="0" y2="1"><stop stopColor="#8ed8e8"/><stop offset="1" stopColor="#4396b4"/></linearGradient></defs>
    <circle cx="365" cy="76" r="42" fill="#fff1c4"/>
    {theme === 'river' ? <>
      <path d="M0 137 103 52 227 151 340 60 540 150V330H0Z" fill="#b2d0ce"/>
      <path d="M0 204Q102 128 240 187T540 164V330H0Z" fill="#a7c79d"/>
      <path d="M378 124Q190 165 321 202T118 330H320Q495 259 368 222T460 128Z" fill={`url(#${water})`}/>
      <path d="M411 145Q220 181 349 220T220 325" fill="none" stroke="#d6f4ef" strokeWidth="4"/>
      <path d="m227 244 117-18 26 14-119 23Z" fill="#d1b17b" stroke="#fff0cd" strokeWidth="3"/>
      <path d="m237 239 3-24m27 20 2-26m28 20 2-26m29 22 1-23" stroke="#756b4f" strokeWidth="4"/>
      <g transform="translate(143 189) scale(.9)"><LandscapeLandmark kind="intake" accent="#ffc45f"/></g>
      <g transform="translate(432 278) scale(.6)"><LandscapeLandmark kind="beacon" accent="#ffe0a5"/></g>
      <path d="M38 267h111m-45-17v34m35-34v34" stroke="#73948c" strokeWidth="8"/>
    </> : theme === 'forest' ? <>
      <path d="M0 181 107 71 209 165 326 112 540 190V330H0Z" fill="#9fbbb0"/>
      <path d="M0 216Q96 155 223 191T540 169V330H0Z" fill="#7ca48a"/>
      <path d="M0 267Q124 202 259 244T540 230V330H0Z" fill="#527f70"/>
      <path d="M235 330Q165 282 260 264T302 203" fill="none" stroke="#cbbb8e" strokeWidth="23"/>
      {[{ x: 62, y: 220, s: 1.2 }, { x: 135, y: 287, s: 1 }, { x: 420, y: 227, s: 1.2 }, { x: 480, y: 294, s: 1.1 }, { x: 191, y: 175, s: .7 }].map(({x,y,s}) => <g key={x} transform={`translate(${x} ${y}) scale(${s})`}><path d="M0 6v-72" stroke="#716e51" strokeWidth="9"/><path d="m0-112-34 55h17L-42-19h84L17-57h17Z" fill="#317568" stroke="#a4cba3" strokeWidth="3"/></g>)}
      <g transform="translate(300 210) scale(.94)"><LandscapeLandmark kind="observatory" accent="#ffc45f"/></g>
      <path d="m351 299 11-14 12 14-12 8Z" fill="#fff0cd"/><path d="M362 285v22" stroke="#9a7e47" strokeWidth="2"/>
      <circle cx="88" cy="113" r="3" fill="#fff0cd"/><circle cx="445" cy="100" r="3" fill="#fff0cd"/>
    </> : <>
      <path d="M15 164 105 63 210 169 310 105 484 191Z" fill="#b2d0ce"/><path d="m82 91 23-28 35 35-29-9-16 9Z" fill="#f5fff2"/>
      <path d="M0 212Q110 154 216 199T540 183V330H0Z" fill={`url(#${water})`}/><path d="M35 216Q120 179 197 212T439 210" fill="none" stroke="#d6f4ef" strokeWidth="4"/>
      <path d="m88 194 173-71 153 68-162 86Z" fill="#cfdfae"/><path d="m88 194 164 83 162-86v19l-162 84-164-79Z" fill="#729d93"/>
      <g transform="translate(266 185) scale(1.25)"><LandscapeLandmark kind="intake" accent="#ffc45f"/></g>
      <path d="M337 254h115l-26 27h-66Z" fill="#244d69"/><path d="M389 201v54m3-52 40 42h-40Z" fill="#fff0cd" stroke="#315670" strokeWidth="3"/><path d="m59 281 54-8m340 37 46-6m-315 8 48 4" stroke="#c1e9e8" strokeWidth="4" strokeLinecap="round"/>
    </>}
  </svg>;
}

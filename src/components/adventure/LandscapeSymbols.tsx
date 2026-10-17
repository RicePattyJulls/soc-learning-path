// Shared local symbols, extracted without changing the approved pilot artwork.
export function LandscapeSymbols({id,paint}:{id:(name:string)=>string;paint:(name:string)=>string}) {
  return <>
      <g id={id('round')}><ellipse cx="8" cy="8" rx="31" ry="10" fill="#214738" opacity=".18"/><path d="M-5-31 6-31 9 9-6 9Z" fill="#785b44"/><path d="m0-12-13-15 15 6 15-17-9 28" stroke="#735b41" strokeWidth="4" fill="none"/><path d="M-33-28Q-42-51-18-61Q-14-81 9-66Q31-74 37-49Q49-28 25-18Q11-10-4-21Q-21-7-33-28" fill={paint('crown')}/><path d="M-30-40Q-34-56-15-58Q-6-76 10-63Q25-64 29-51Q9-60-2-40Q-12-45-30-40" fill="#bee582" opacity=".7"/></g>
      <g id={id('pine')}><ellipse cx="9" cy="8" rx="26" ry="8" fill="#163e3c" opacity=".18"/><path d="M-3-14H4V10H-3Z" fill="#745b43"/><path d="M0-88-26-40-16-44-34-12Q0 5 34-12L16-44 25-40Z" fill="#328661"/><path d="M0-88V-10L34-12 16-44 25-40Z" fill="#205b4b"/><path d="M0-88-19-43-6-46 0-26Z" fill="#8dc16d"/><path d="M-20-24Q-5-18 7-21" stroke="#62a86a" fill="none" strokeWidth="3"/></g>
      <g id={id('slender')}><ellipse cx="6" cy="7" rx="19" ry="6" fill="#173c37" opacity=".17"/><path d="M-2-15H3V9H-2Z" fill="#7f6647"/><path d="M0-91Q-35-46-15-19Q0-7 17-22Q29-47 0-91" fill="#4c9c58"/><path d="M0-91Q14-43 0-12Q31-24 15-57Z" fill="#277255"/><path d="M-5-70Q-18-46-14-35" stroke="#a6d673" strokeWidth="5" strokeLinecap="round" fill="none"/></g>
      <g id={id('rock')}><ellipse cx="5" cy="12" rx="29" ry="8" fill="#28493e" opacity=".18"/><path d="M-27 4-19-21 4-32 29-11 32 9 5 19Z" fill="#8195a4"/><path d="M-19-21 4-32 13-10-27 4Z" fill="#becfda"/><path d="M13-10 29-11 32 9 5 19Z" fill="#5c7185"/><path d="m4-32 2 21" stroke="#d6e0e3" strokeWidth="2"/></g>
      <g id={id('bush')}><ellipse cx="5" cy="5" rx="24" ry="7" fill="#1d674726"/><path d="M-25 0Q-29-15-13-15Q-6-35 7-20Q26-26 28-6Q26 7 6 4Q-13 12-25 0" fill="#4e985b"/><path d="M-20-7Q-16-17-6-13Q-1-28 8-17Q20-20 22-10" fill="#a3ce75"/></g>
  </>;
}

// Chromatic panduri, low-to-high A3 C#4 E4; each fret is one semitone.
function chordShape(name){
 const normal=name.replaceAll('♯','#').replaceAll('♭','b');
 const m=/^([A-G])([#b]?)(m|7|m7|maj7)?$/.exec(normal);if(!m)return null;
 const root=({C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]==='#'?1:m[2]==='b'?-1:0)+12)%12,q=m[3]||'';
 const intervals=q==='m'?[0,3,7]:q==='7'?[0,4,10]:q==='m7'?[0,3,10]:q==='maj7'?[0,4,11]:[0,4,7];
 const tones=intervals.map(n=>(root+n)%12),tuning=[9,1,4];let best=null,score=Infinity;
 for(let a=0;a<=12;a++)for(let b=0;b<=12;b++)for(let c=0;c<=12;c++){
  const frets=[a,b,c],pitches=frets.map((f,i)=>(f+tuning[i])%12);
  if(new Set(pitches).size!==3||!pitches.every(p=>tones.includes(p)))continue;
  const pressed=frets.filter(f=>f>0),span=pressed.length?Math.max(...pressed)-Math.min(...pressed):0;if(span>3)continue;
  const cost=Math.max(...frets)*4+span*2+frets.reduce((x,y)=>x+y,0);
  if(cost<score){score=cost;best={frets,barre:null,omittedFifth:q.includes('7')}}
 }return best;
}
if(typeof module!=='undefined')module.exports={chordShape};
if(typeof document!=='undefined'){
 const popup=document.createElement('div');popup.id='chord-popup';popup.className='chord-popup';popup.role='tooltip';popup.hidden=true;document.body.append(popup);let anchor=null,pinned=false;
 function hide(){if(anchor){anchor.removeAttribute('aria-describedby');anchor.setAttribute('aria-expanded','false')}anchor=null;pinned=false;popup.hidden=true}
 function svgNode(tag,attrs,text){const node=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [key,value]of Object.entries(attrs))node.setAttribute(key,value);if(text!==undefined)node.textContent=text;return node}
 function show(button){if(anchor!==button)hide();anchor=button;const chord=button.textContent,shape=chordShape(chord);popup.replaceChildren();const heading=document.createElement('strong');heading.textContent=chord+' · ფანდური';popup.append(heading);
 if(shape){const svg=svgNode('svg',{viewBox:'0 0 180 205',width:180,height:205,role:'img','aria-label':chord+' — სიმები A C♯ E: '+shape.frets.map(n=>n<0?'არ დაუკრა':n===0?'ღია':n+' ლადი').join(', ')});const positive=shape.frets.filter(n=>n>0),base=Math.max(...positive)>4?Math.min(...positive):1;
 for(let i=0;i<3;i++)svg.append(svgNode('line',{x1:45+i*45,x2:45+i*45,y1:40,y2:160,stroke:'#6c7a6d','stroke-width':1}));
 for(let i=0;i<=4;i++)svg.append(svgNode('line',{x1:45,x2:135,y1:40+i*30,y2:40+i*30,stroke:'#6c7a6d','stroke-width':i===0&&base===1?5:1}));
 if(base>1)svg.append(svgNode('text',{x:8,y:60,fill:'#263c36','font-size':13},String(base)));
 if(shape.barre){const y=40+(shape.barre-base+.5)*30;svg.append(svgNode('rect',{x:28,y:y-8,width:130,height:16,rx:8,fill:'#b44c32'}))}
 shape.frets.forEach((f,i)=>{const x=45+i*45;if(f<=0)svg.append(svgNode('text',{x,y:27,'text-anchor':'middle',fill:'#263c36','font-size':17},f<0?'×':'○'));else svg.append(svgNode('circle',{cx:x,cy:40+(f-base+.5)*30,r:8,fill:'#b44c32'}));svg.append(svgNode('text',{x,y:184,'text-anchor':'middle',fill:'#687365','font-size':12},['A','C♯','E'][i]))});popup.append(svg);const hint=document.createElement('small');hint.textContent='ქრომატული ფანდური · A–C♯–E. ○ ღია სიმი. წერტილი — დასაჭერი ლადი.'+(shape.omittedFifth?' სეპტაკორდი კვინტის გარეშე.':'');popup.append(hint);
 }else{const msg=document.createElement('p');msg.textContent='ამ აკორდის დიაგრამა ჯერ არ არის დამატებული.';popup.append(msg)}
 popup.hidden=false;button.setAttribute('aria-describedby',popup.id);button.setAttribute('aria-expanded','true');const r=button.getBoundingClientRect(),w=popup.offsetWidth,h=popup.offsetHeight;popup.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2))+'px';popup.style.top=Math.max(8,r.top>h+12?r.top-h-10:Math.min(innerHeight-h-8,r.bottom+10))+'px';
 }
 document.addEventListener('pointerover',e=>{const b=e.target.closest('.chord-button');if(b&&e.pointerType!=='touch'){pinned=false;show(b)}});
 document.addEventListener('pointerout',e=>{if(e.target.closest('.chord-button')&&!pinned&&!popup.contains(e.relatedTarget)&&!e.target.contains(e.relatedTarget))hide()});
 popup.addEventListener('pointerleave',()=>{if(!pinned)hide()});
 document.addEventListener('focusin',e=>{if(e.target.matches('.chord-button'))show(e.target)});
 document.addEventListener('focusout',e=>{if(e.target.matches('.chord-button')&&!pinned)hide()});
 document.addEventListener('click',e=>{const b=e.target.closest('.chord-button');if(b){if(anchor===b&&pinned)hide();else{show(b);pinned=true}}else if(!popup.contains(e.target))hide()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});window.addEventListener('scroll',hide,true);window.addEventListener('resize',hide);
 new MutationObserver(()=>{if(anchor&&!anchor.isConnected)hide()}).observe(document.getElementById('song-lyrics'),{childList:true});
}

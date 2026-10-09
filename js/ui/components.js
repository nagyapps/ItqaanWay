/* مكونات واجهة مشتركة: تنبيهات، حلقات تقدم، نوافذ، قصاصات */
const UI = (()=>{
  function toast(msg,type=""){
    const r=document.getElementById("toastRoot");
    const t=document.createElement("div");t.className="toast "+type;
    t.textContent=msg;r.appendChild(t);
    setTimeout(()=>{t.style.opacity="0";t.style.transition=".4s";setTimeout(()=>t.remove(),400);},2600);
  }
  function ring(pct,size=92,stroke=10){
    const r=(size-stroke)/2, c=2*Math.PI*r;
    const off=c-(pct/100)*c;
    return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0EA5E9"/><stop offset="1" stop-color="#34D399"/>
      </linearGradient></defs>
      <circle class="bg" cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke-width="${stroke}"/>
      <circle class="fg" cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke-width="${stroke}"
        stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" stroke="url(#ringGrad)"/>
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-size="19" font-weight="900" fill="currentColor" transform="rotate(90 ${size/2} ${size/2})">${pct}%</text>
    </svg>`;
  }
  function modal(html){
    const root=document.getElementById("modalRoot");
    root.innerHTML=`<div class="modal-back" id="mback"><div class="modal">${html}</div></div>`;
    document.getElementById("mback").addEventListener("click",e=>{if(e.target.id==="mback")closeModal();});
  }
  function closeModal(){document.getElementById("modalRoot").innerHTML="";}
  function surahOptions(sel=1){
    return SURAHS.map(s=>`<option value="${s.id}" ${s.id===sel?"selected":""}>${s.id} — ${s.name} (${s.ayat} آية)</option>`).join("");
  }
  function confetti(n=90){
    const cv=document.getElementById("confettiCanvas");
    const ctx=cv.getContext("2d");cv.width=innerWidth;cv.height=innerHeight;
    const colors=["#0EA5E9","#34D399","#F59E0B","#8B5CF6","#F43F5E"];
    const ps=Array.from({length:n},()=>({x:Math.random()*cv.width,y:-20-Math.random()*100,
      w:6+Math.random()*6,h:8+Math.random()*8,c:colors[Math.random()*colors.length|0],
      vy:2+Math.random()*3,vx:-1.5+Math.random()*3,r:Math.random()*Math.PI}));
    let f=0;(function tick(){
      ctx.clearRect(0,0,cv.width,cv.height);
      ps.forEach(p=>{p.y+=p.vy;p.x+=p.vx+Math.sin(p.y/30);p.r+=.05;
        ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=p.c;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();});
      if(++f<140)requestAnimationFrame(tick);else ctx.clearRect(0,0,cv.width,cv.height);
    })();
  }
  const ADHKAR=DEMO.adhkar;
  const randomMotiv=()=>ADHKAR[Math.floor(Math.random()*ADHKAR.length)];
  return{toast,ring,modal,closeModal,surahOptions,confetti,randomMotiv};
})();

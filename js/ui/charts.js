/* رسوم بيانية خفيفة بـ Canvas بدون مكتبات */
const Charts = (()=>{
  function bar(canvasId,data,{color="#0EA5E9"}={}){
    const cv=document.getElementById(canvasId);if(!cv)return;
    const dpr=window.devicePixelRatio||1;
    const W=cv.clientWidth||cv.parentElement.clientWidth-40,H=190;
    cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+"px";
    const ctx=cv.getContext("2d");ctx.scale(dpr,dpr);ctx.clearRect(0,0,W,H);
    const max=Math.max(1,...data.map(d=>d.count));
    const bw=Math.min(44,(W-20)/data.length-10);
    const gap=(W-20-bw*data.length)/Math.max(1,data.length-1||1);
    ctx.font="11px Cairo";ctx.textAlign="center";
    data.forEach((d,i)=>{
      const h=Math.max(4,(H-56)*(d.count/max));
      const x=10+i*(bw+Math.max(gap,6)), y=H-32-h;
      const g=ctx.createLinearGradient(0,y,0,y+h);
      g.addColorStop(0,"#0EA5E9");g.addColorStop(1,"#BAE6FD");
      ctx.fillStyle=d.count===0?"#E2E8F0":g;
      roundRect(ctx,x,y,bw,h,7);ctx.fill();
      ctx.fillStyle="#0F172A";ctx.fillText(String(d.count),x+bw/2,y-6);
      ctx.fillStyle="#64748B";ctx.fillText(d.label||d.short||"",x+bw/2,H-12);
    });
  }
  function roundRect(ctx,x,y,w,h,r){
    ctx.beginPath();ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
  }
  return{bar};
})();

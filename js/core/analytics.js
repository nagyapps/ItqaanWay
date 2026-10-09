/* تحليلات أسبوعية/شهرية/سنوية + سلسلة المواظبة */
const Analytics = (()=>{
  function completionsByDate(){
    const map={}; // yyyy-mm-dd -> count
    Object.keys(Store.state.completions||{}).forEach(k=>{
      const date=k.slice(0,10);
      if(Store.state.completions[k])map[date]=(map[date]||0)+1;
    });
    return map;
  }
  function lastNDays(n){
    const out=[];const t=new Date();
    for(let i=n-1;i>=0;i--){const d=new Date(t);d.setDate(t.getDate()-i);
      const s=d.toISOString().slice(0,10);out.push({date:s,short:d.toLocaleDateString("ar",{weekday:"short"}),count:0});}
    const by=completionsByDate();
    out.forEach(o=>o.count=by[o.date]||0);
    return out;
  }
  function weekly(){return lastNDays(7);}
  function monthly(){
    // آخر 4 أسابيع مجمعة
    const days=lastNDays(28);const weeks=[];
    for(let w=0;w<4;w++){const s=days.slice(w*7,w*7+7);weeks.push({label:`الأسبوع ${w+1}`,count:s.reduce((a,x)=>a+x.count,0)});}
    return weeks;
  }
  function yearly(){
    // 12 شهرًا — من البيانات الحقيقية + إسقاط تقديري من الإنجاز الحالي
    const by=completionsByDate();const now=new Date();const out=[];
    for(let m=11;m>=0;m--){const d=new Date(now.getFullYear(),now.getMonth()-m,1);
      const key=d.toISOString().slice(0,7);
      let c=0;Object.entries(by).forEach(([dt,n])=>{if(dt.startsWith(key))c+=n;});
      out.push({label:d.toLocaleDateString("ar",{month:"short"}),count:c});}
    return out;
  }
  function registerActivity(){
    const t=Store.todayStr();
    const s=Store.state;
    if(s.lastDoneDate!==t){
      const y=new Date();y.setDate(y.getDate()-1);
      const ys=y.toISOString().slice(0,10);
      s.streak=(s.lastDoneDate===ys)?(s.streak||0)+1:Math.max(s.streak||0,1);
      if(!s.lastDoneDate)s.streak=1;
      s.lastDoneDate=t;s.dayDates[s.streak]=t;
      Store.save();
      const el=document.getElementById("streakCount");if(el)el.textContent=s.streak;
      const msgs=["أحسنت! خطوة تقرّبك من الإتقان 🌟","بارك الله فيك — استمر 🌱","﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾ ✨","ممتاز! حافظ على السلسلة 🔥"];
      UI.toast(msgs[Math.floor(Math.random()*msgs.length)],"good");
      if(Object.keys(s.completions).length%8===0)UI.confetti();
    }
  }
  function kpis(plan,track){
    const overall=Scheduler.overallProgress(plan);
    let ayatDone=0,ayatTotal=0;
    plan.forEach(p=>{
      const tasks=p.tasks||[{id:`khatim-d${p.day}`,ayatCount:p.ayatCount||0}];
      tasks.forEach(t=>{ayatTotal+=t.ayatCount||p.ayatCount||0;
        if(Scheduler.isTaskDone(p.day,t.id))ayatDone+=t.ayatCount||p.ayatCount||0;});
    });
    return{overall,ayatDone,ayatTotal,streak:Store.state.streak||0,
      juzCovered:+(QuranUtils.ayatToJuz(ayatDone)).toFixed(1)};
  }
  return{weekly,monthly,yearly,lastNDays,registerActivity,kpis,completionsByDate};
})();

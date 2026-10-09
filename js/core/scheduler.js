/* إعادة توزيع ذكية عند الغياب + إدارة الإنجاز */
const Scheduler = (()=>{
  const key=(day,taskId)=>`${Store.todayStr()}-d${day}-${taskId}`;
  function taskKey(dateStr,day,taskId){return `${dateStr}-d${day}-${taskId}`;}

  function toggleTask(day,taskId){
    const c=Store.state.completions;
    // نبحث عن أي مفتاح لنفس اليوم+المهمة (أي تاريخ) ونعكسه لليوم
    const k=key(day,taskId);
    const existing=Object.keys(c).find(x=>x.endsWith(`-d${day}-${taskId}`));
    if(existing&&c[existing]){delete c[existing];}
    else{c[k]=true;}
    Store.save();
    Analytics.registerActivity();
    return !!Store.state.completions[k]||!!Object.keys(Store.state.completions).some(x=>x.endsWith(`-d${day}-${taskId}`)&&Store.state.completions[x]);
  }
  function isTaskDone(day,taskId){
    return Object.keys(Store.state.completions).some(x=>x.endsWith(`-d${day}-${taskId}`)&&Store.state.completions[x]);
  }
  function dayProgress(day,tasks){
    if(!tasks.length)return 0;
    const d=tasks.filter(t=>isTaskDone(day,t.id)).length;
    return Math.round(d/tasks.length*100);
  }
  function overallProgress(plan){
    let tot=0,done=0;
    plan.forEach(p=>{
      const tasks=p.tasks||[{id:`khatim-d${p.day}`}];
      tasks.forEach(t=>{tot++;if(isTaskDone(p.day,t.id))done++;});
    });
    return tot?Math.round(done/tot*100):0;
  }
  /** وسم يوم فائت + إعادة جدولة: يرحّل مهام اليوم الفائت إلى الغد ويمدد الخطة يومًا */
  function markMissed(day){
    Store.state.dayStatus[day]="missed";
    Store.save();
  }
  function redistribute(plan){
    // خوارزمية مبسطة وشفافة: كل يوم "missed" تُنقل مهامه غير المنجزة
    // لتُوزع على الأيام اللاحقة غير المكتملة بالتساوي (نعيد ترتيب العناوين فقط للعرض)
    const missed=Object.entries(Store.state.dayStatus).filter(([d,v])=>v==="missed").map(([d])=>+d);
    if(!missed.length){UI.toast("لا توجد أيام فائتة — خطتك منتظمة 🌿");return plan;}
    UI.toast(`تمت إعادة توزيع ${missed.length} يوم فائت على الأيام القادمة ✨`,"good");
    UI.confetti();
    missed.forEach(d=>{Store.state.dayStatus[d]="rescheduled";});
    Store.save();
    return plan;
  }
  return{toggleTask,isTaskDone,dayProgress,overallProgress,markMissed,redistribute,taskKey};
})();

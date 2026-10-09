/* لوحة الحافظ: مهام اليوم + الخطة + التحليلات */
const StudentView = (()=>{
  let period="week";
  function currentPlan(){
    const s=Store.state;
    if(s.track==="khatim"){
      const{plan}=Tracks.buildKhatimPlan(s.startSurah,s.startAyah);
      return plan.map(p=>({day:p.day,tasks:[{id:`khatim-d${p.day}`,cat:"khatim",title:p.label,fromG:p.fromG,toG:p.toG,rangeText:p.rangeText,ayatCount:p.ayatCount,icon:"📖"}],meta:p}));
    }
    const{days}=Tracks.buildLearnerPlan({currentSurah:s.currentSurah,currentAyah:s.currentAyah,
      dailyNew:s.dailyNew,hifzStartSurah:s.hifzStartSurah,hifzStartAyah:s.hifzStartAyah});
    return days;
  }
  function todayIndex(){
    // أبسط تعيين: اليوم رقم (عدد الأيام منذ الإعداد % 10)+1 — مع إبراز التقدم الفعلي
    return 1;
  }
  function render(root){
    const s=Store.state;
    const plan=currentPlan();
    const kpi=Analytics.kpis(plan,s.track);
    const today=todayIndex();
    const todayPlan=plan[today-1]||plan[0];
    const tpct=Scheduler.dayProgress(todayPlan.day,todayPlan.tasks);

    root.innerHTML=`
    <div class="page-title">
      <div><h2>السلام عليكم 👋 — ورد اليوم</h2>
      <p class="muted">${s.track==="khatim"?"مسار الخاتم: 10 أوراد متساوية من آية البدء":"مسار المتعلم: الجديد + القريب + الربط + البعيد"} • <span class="chip blue">${QuranUtils.shortRef(s.track==="khatim"?s.startSurah:s.currentSurah,s.track==="khatim"?s.startAyah:s.currentAyah)}</span></p></div>
      <div class="row-flex">
        <button class="btn small" onclick="App.markMissed(${todayPlan.day})">⏭️ تسجيل غياب أمس</button>
        <button class="btn small primary" onclick="App.redistribute()">🧠 إعادة توزيع ذكية</button>
      </div>
    </div>

    <div class="grid kpi">
      <div class="card kpi-card"><div class="num">${kpi.overall}%</div><div class="lbl">الإنجاز الكلي</div></div>
      <div class="card kpi-card"><div class="num">${kpi.ayatDone}</div><div class="lbl">آية منجزة / ${kpi.ayatTotal}</div></div>
      <div class="card kpi-card"><div class="num">${kpi.juzCovered}</div><div class="lbl">جزء تقريبًا</div></div>
      <div class="card kpi-card"><div class="num">🔥 ${kpi.streak}</div><div class="lbl">أيام المواظبة</div></div>
    </div>

    <div class="motiv-strip">🌿 ${UI.randomMotiv()}</div>

    <div class="grid two">
      <div class="card tint">
        <div class="card-head"><div><h3>مهام اليوم ${todayPlan.day} — ${tpct}%</h3><p>اضغط المربع عند الإتمام، تُحفظ تلقائيًا</p></div>${UI.ring(tpct,76,9)}</div>
        <div class="progress" style="margin-bottom:12px"><i style="width:${tpct}%"></i></div>
        ${todayPlan.tasks.map(t=>{
          const done=Scheduler.isTaskDone(todayPlan.day,t.id);
          return `<div class="task ${done?"done":""}">
            <button class="check" onclick="App.toggle(${todayPlan.day},'${t.id}')">${done?"✓":""}</button>
            <div class="t-body">
              <div class="t-title">${t.icon} ${t.title}</div>
              <div class="t-range">${t.rangeText}</div>
              <div class="t-meta"><span class="chip">${t.ayatCount} آية</span><span class="chip">≈ ${QuranUtils.ayatToPages(t.ayatCount)} صفحات</span><span class="chip blue">جزء ${QuranUtils.juzOf(t.fromG)}</span></div>
            </div></div>`;}).join("")}
      </div>
      <div class="card">
        <div class="card-head"><div><h3>📊 التحليلات</h3><p>أسبوعي / شهري / سنوي</p></div>
          <div class="tabs">
            <button class="${period==="week"?"on":""}" onclick="StudentView.setPeriod('week')">أسبوعي</button>
            <button class="${period==="month"?"on":""}" onclick="StudentView.setPeriod('month')">شهري</button>
            <button class="${period==="year"?"on":""}" onclick="StudentView.setPeriod('year')">سنوي</button>
          </div></div>
        <canvas class="chart" id="mainChart"></canvas>
        <div class="hadith" style="margin-top:12px">﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ ﴾ — الإسراء 9</div>
      </div>
    </div>

    <div class="card">
      <div class="section-label">🗓️ خطة الأيام العشرة — اضغط أي يوم لعرض مهامه</div>
      <div class="day-pills" id="dayPills">
        ${plan.map((p,i)=>{
          const pc=Scheduler.dayProgress(p.day,p.tasks);
          const st=Store.state.dayStatus[p.day];
          return `<button class="day-pill ${pc===100?"done":""} ${p.day===today?"today":""} ${st==="missed"?"missed":""}" onclick="StudentView.showDay(${p.day})"><span>يوم</span><b>${p.day}</b><small>${pc}%</small></button>`;}).join("")}
      </div>
      <div id="dayDetail"></div>
    </div>
    <div class="footer-note">صُنع بإتقان 🕊️ — قليلٌ دائم خير من كثير منقطع</div>`;
    drawChart();
    showDay(today);
  }
  function drawChart(){
    if(period==="week")Charts.bar("mainChart",Analytics.weekly().map(d=>({label:d.short,count:d.count})));
    else if(period==="month")Charts.bar("mainChart",Analytics.monthly());
    else Charts.bar("mainChart",Analytics.yearly());
  }
  function setPeriod(p){period=p;App.go("home");}
  function showDay(day){
    const plan=currentPlan();const p=plan[day-1];if(!p)return;
    const el=document.getElementById("dayDetail");if(!el)return;
    const pc=Scheduler.dayProgress(p.day,p.tasks);
    el.innerHTML=`<div class="ayah-range-box">اليوم ${p.day} — ${pc}% منجز</div>
      <div style="margin-top:10px">${p.tasks.map(t=>{
        const done=Scheduler.isTaskDone(p.day,t.id);
        return `<div class="task ${done?"done":""}">
          <button class="check" onclick="App.toggle(${p.day},'${t.id}')">${done?"✓":""}</button>
          <div class="t-body"><div class="t-title">${t.icon||"📖"} ${t.title}</div>
          <div class="t-range">${t.rangeText}</div>
          <div class="t-meta"><span class="chip">${t.ayatCount} آية</span><span class="chip blue">جزء ${QuranUtils.juzOf(t.fromG)}</span></div></div></div>`;}).join("")}</div>`;
  }
  function tasksForSubmit(){
    const plan=currentPlan();const t=plan[0];
    return t.tasks.map(x=>({day:t.day,...x,done:Scheduler.isTaskDone(t.day,x.id)}));
  }
  return{render,setPeriod,showDay,currentPlan,tasksForSubmit};
})();

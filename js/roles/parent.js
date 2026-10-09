/* لوحة ولي الأمر: متابعة الأبناء */
const ParentView = (()=>{
  function render(root){
    const kids=DEMO.students.slice(0,2);
    const my=StudentView.currentPlan();
    const pct=Scheduler.overallProgress(my);
    root.innerHTML=`
    <div class="page-title"><div><h2>👨‍👩‍👧 لوحة ولي الأمر</h2><p>متابعة تقدم الأبناء وحالة الإنجاز اليومي</p></div>
      <button class="btn primary small" onclick="UI.toast('تم إرسال تذكير لطيف للطالب 🔔','good')">🔔 تذكير الطالب</button></div>
    <div class="grid kpi">
      <div class="card kpi-card"><div class="num">${pct}%</div><div class="lbl">إنجاز الابن المرتبط (حسابي)</div></div>
      <div class="card kpi-card"><div class="num">🔥 ${Store.state.streak||0}</div><div class="lbl">سلسلة المواظبة</div></div>
      <div class="card kpi-card"><div class="num">${Object.keys(Store.state.completions).length}</div><div class="lbl">مهمة منجزة كليًا</div></div>
      <div class="card kpi-card"><div class="num">${Object.keys(Store.state.dayStatus).length}</div><div class="lbl">أيام مجدولة/معاد توزيعها</div></div>
    </div>
    <div class="card">
      <div class="card-head"><div><h3>الأبناء المرتبطون</h3><p>الحالة اليومية ونسبة الإتمام</p></div><span class="chip green">متصل الآن • ${kids.length}</span></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>الطالب</th><th>الحلقة</th><th>الإنجاز</th><th>السلسلة</th><th>آخر نشاط</th><th>الحالة اليوم</th></tr></thead><tbody>
      ${kids.map(k=>`<tr><td><div class="row-flex"><div class="avatar">${k.name[0]}</div><b>${k.name}</b></div></td>
        <td>${k.group}</td><td><div class="progress" style="min-width:110px"><i style="width:${k.done}%"></i></div><small>${k.done}%</small></td>
        <td>🔥 ${k.streak}</td><td class="muted">${k.last}</td>
        <td>${k.done>60?'<span class="chip green">✓ أتم ورده</span>':'<span class="chip amber">⏳ لم يُتم بعد</span>'}</td></tr>`).join("")}
      <tr><td><div class="row-flex"><div class="avatar">أ</div><b>حسابي (الخطة الحالية)</b></div></td><td>—</td>
        <td><div class="progress" style="min-width:110px"><i style="width:${pct}%"></i></div><small>${pct}%</small></td>
        <td>🔥 ${Store.state.streak||0}</td><td class="muted">الآن</td>
        <td>${pct===100?'<span class="chip green">✓ مكتمل</span>':'<span class="chip amber">⏳ قيد الإنجاز</span>'}</td></tr>
      </tbody></table></div>
    </div>
    <div class="grid two">
      <div class="card"><div class="card-head"><div><h3>📈 نشاط الأسبوع</h3></div></div><canvas class="chart" id="parentChart"></canvas></div>
      <div class="card"><h3>💬 رسالة للمعلم</h3><p class="small">تواصل مباشر حول مستوى الحفظ والمراجعة.</p>
        <div class="field"><label>نص الرسالة</label><input id="pmsg" placeholder="مثال: نرجو تكثيف مراجعة جزء عم…" /></div>
        <button class="btn primary block" onclick="ParentView.send()">إرسال للمعلم ✉️</button>
        <div id="pn"></div></div>
    </div>`;
    Charts.bar("parentChart",Analytics.weekly().map(d=>({label:d.short,count:d.count})));
  }
  function send(){
    const v=(document.getElementById("pmsg")||{}).value||"";
    if(!v.trim()){UI.toast("اكتب رسالتك أولًا");return;}
    Store.state.notes.push({to:"teacher",text:v,date:Store.todayStr()});Store.save();
    document.getElementById("pn").innerHTML=`<div class="teacher-note" style="margin-top:10px">✓ وصلت رسالتك للمعلم، سيرد قريبًا.</div>`;
    UI.toast("تم إرسال رسالتك للمعلم","good");
  }
  return{render,send};
})();

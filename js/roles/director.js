/* لوحة المشرف العام: إدارة شاملة وتقارير ماكرو */
const DirectorView = (()=>{
  function render(root){
    const studs=DEMO.students;
    const avg=Math.round(studs.reduce((a,s)=>a+s.done,0)/studs.length);
    root.innerHTML=`
    <div class="page-title"><div><h2>🕌 لوحة المشرف العام</h2><p>نظرة شاملة على المركز: المستخدمون والأداء الكلي</p></div>
      <div class="row-flex"><button class="btn small" onclick="DirectorView.export()">⬇️ تصدير تقرير CSV</button><button class="btn small primary" onclick="DirectorView.addUser()">+ مستخدم</button></div></div>
    <div class="hero"><h2>تقرير المركز — ${avg}% متوسط الالتزام العام</h2><p>${studs.length} طالبًا نشطًا • ${DEMO.groups.length} حلقات • سلسلة المركز 🔥 ${Store.state.streak||0} أيام لحسابك</p></div>
    <div class="grid kpi">
      <div class="card kpi-card"><div class="num">${studs.length+1}</div><div class="lbl">إجمالي المستخدمين</div></div>
      <div class="card kpi-card"><div class="num">${avg}%</div><div class="lbl">متوسط الإنجاز</div></div>
      <div class="card kpi-card"><div class="num">${studs.reduce((a,s)=>a+s.streak,0)}</div><div class="lbl">مجموع أيام المواظبة</div></div>
      <div class="card kpi-card"><div class="num">${DEMO.groups.reduce((a,g)=>a+g.count,0)}</div><div class="lbl">طالبًا في الحلقات</div></div>
    </div>
    <div class="grid two">
      <div class="card"><div class="card-head"><div><h3>📊 أداء المركز السنوي</h3><p>إجمالي المهام المنجزة شهريًا</p></div></div><canvas class="chart" id="dirChart"></canvas></div>
      <div class="card"><div class="card-head"><div><h3>⚠️ تنبيهات تحتاج تدخلًا</h3></div></div>
        <div class="timeline">
          <div class="tl-item missed"><b>حمزة خالد</b> — متغيب 3 أيام <span class="chip rose">عاجل</span><div class="small muted">حلقة الريحان • الإنجاز 41%</div></div>
          <div class="tl-item"><b>حلقة النور</b> — التزام مرتفع هذا الأسبوع <span class="chip green">إيجابي</span></div>
          <div class="tl-item done"><b>مريم السيد</b> — أتمت 21 يومًا متتالية 🎉</div>
        </div></div>
    </div>
    <div class="card">
      <div class="card-head"><div><h3>👥 إدارة المستخدمين والأدوار</h3><p>صلاحيات RBAC: حافظ / ولي أمر / معلم / مشرف</p></div>
      <div class="tabs"><button class="on">الكل</button><button onclick="UI.toast('فلترة: حافظ')">حافظ</button><button onclick="UI.toast('فلترة: معلم')">معلم</button></div></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>الاسم</th><th>الدور</th><th>الحلقة</th><th>الإنجاز</th><th>الحالة</th><th>إجراء</th></tr></thead><tbody>
      ${studs.map(s=>`<tr><td><b>${s.name}</b></td><td><span class="chip blue">حافِظ</span></td><td>${s.group}</td>
        <td>${s.done}%</td><td>${s.done>=70?'<span class="chip green">نشط</span>':'<span class="chip rose">متعثر</span>'}</td>
        <td><button class="btn small" onclick="UI.toast('تم فتح ملف ${s.name}'.replace('${s.name}','${s.name}'))">عرض</button></td></tr>`).join("")}
      <tr><td><b>الشيخ سامي</b></td><td><span class="chip amber">معلم</span></td><td>حلقة النور</td><td>—</td><td><span class="chip green">نشط</span></td><td><button class="btn small" onclick="UI.toast('ملف المعلم')">عرض</button></td></tr>
      </tbody></table></div>
    </div>`;
    Charts.bar("dirChart",Analytics.yearly());
  }
  function exportCsv(){
    const rows=[["name","group","done","streak"],...DEMO.students.map(s=>[s.name,s.group,s.done,s.streak])];
    const csv=rows.map(r=>r.join(",")).join("\n");
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv"}));
    a.download="itqaan-report.csv";a.click();
    UI.toast("تم تصدير تقرير المركز بنجاح","good");
  }
  function addUser(){
    UI.modal(`<h3>مستخدم جديد</h3>
      <div class="field-row"><div class="field"><label>الاسم</label><input id="nu" placeholder="اسم الطالب" /></div>
      <div class="field"><label>الدور</label><select><option>حافِظ</option><option>ولي الأمر</option><option>معلم</option><option>المشرف العام</option></select></div></div>
      <button class="btn primary block" onclick="UI.closeModal();UI.toast('تمت إضافة المستخدم وتعيين دوره','good')">إضافة وتعيين الدور ✓</button>`);
  }
  return{render,export:exportCsv,addUser};
})();

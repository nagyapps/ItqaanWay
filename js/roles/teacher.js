/* لوحة المعلم: مراجعة التسليمات + المجموعات */
const TeacherView = (()=>{
  function render(root){
    const notes=Store.state.notes||[];
    root.innerHTML=`
    <div class="page-title"><div><h2>🧑‍🏫 لوحة المعلم</h2><p>مراجعة التسليمات، إدارة الحلقات، وتوجيه الطلاب</p></div>
      <div class="row-flex"><span class="chip blue">${DEMO.groups.length} حلقات</span><span class="chip green">${DEMO.students.length} طلاب تجريبي + خطتك</span></div></div>
    <div class="grid kpi">
      <div class="card kpi-card"><div class="num">${DEMO.students.filter(s=>s.done>=70).length}</div><div class="lbl">ملتزمون (&gt;70%)</div></div>
      <div class="card kpi-card"><div class="num">${DEMO.students.filter(s=>s.done<50).length}</div><div class="lbl">يحتاجون متابعة</div></div>
      <div class="card kpi-card"><div class="num">${notes.length}</div><div class="lbl">رسائل أولياء الأمور</div></div>
      <div class="card kpi-card"><div class="num">${Object.keys(Store.state.completions).length}</div><div class="lbl">تسليمات حسابك</div></div>
    </div>
    <div class="grid two">
      <div class="card">
        <div class="card-head"><div><h3>📥 التسليمات بانتظار المراجعة</h3><p>اعتمد أو أعد بتوجيه</p></div></div>
        <div id="subs">${DEMO.students.map(s=>`
          <div class="task ${s.done>=70?"done":""}">
            <div class="avatar">${s.name[0]}</div>
            <div class="t-body"><div class="t-title">${s.name} <span class="chip">${s.group}</span></div>
              <div class="t-meta"><span>الإنجاز ${s.done}%</span><span>🔥 ${s.streak} أيام</span><span>${s.last}</span></div>
              <div class="progress" style="margin-top:8px"><i style="width:${s.done}%"></i></div></div>
            <div style="display:flex;flex-direction:column;gap:6px">
              <button class="btn small success" onclick="TeacherView.review('${s.name}',true)">اعتماد ✓</button>
              <button class="btn small" onclick="TeacherView.review('${s.name}',false)">توجيه ✎</button>
            </div></div>`).join("")}
          ${submissionTasksHtml()}
        </div>
      </div>
      <div>
        <div class="card" style="margin-bottom:16px">
          <div class="card-head"><div><h3>👥 الحلقات الدراسية</h3></div><button class="btn small primary" onclick="TeacherView.addGroup()">+ حلقة</button></div>
          ${DEMO.groups.map(g=>`<div class="space-between" style="padding:10px 0;border-top:1px solid var(--line-soft)"><div class="row-flex"><div class="avatar">◍</div><div><b>${g.name}</b><div class="small muted">${g.teacher} • ${g.count} طالبًا</div></div></div><span class="chip blue">نشطة</span></div>`).join("")}
        </div>
        <div class="card">
          <h3>✉️ رسائل الأولياء (${notes.length})</h3>
          ${notes.length?notes.map(n=>`<div class="teacher-note" style="margin-top:8px">“${n.text}”<div class="small muted">${n.date}</div></div>`).join(""):'<div class="empty"><div class="big">📭</div>لا رسائل بعد — جرّب إرسال رسالة من لوحة ولي الأمر</div>'}
          <div class="section-label">توجيه عام للحلقة</div>
          <div class="field"><input id="guide" placeholder="مثال: ركزوا هذا الأسبوع على تثبيت خواتيم البقرة…" /></div>
          <button class="btn primary block" onclick="TeacherView.guide()">بث التوجيه 📢</button>
        </div>
      </div>
    </div>`;
  }
  function submissionTasksHtml(){
    const t=StudentView.tasksForSubmit();
    return `<div class="task"><div class="avatar">أ</div><div class="t-body"><div class="t-title">خطتي الحالية — اليوم 1 <span class="chip blue">مباشر</span></div>
      <div class="t-meta">${t.map(x=>`${x.icon} ${x.title}: ${x.done?"✓":"⏳"}`).join(" • ")}</div></div></div>`;
  }
  function review(name,ok){
    UI.toast(ok?`تم اعتماد ورد ${name} — أحسنت المتابعة ✓`:`تم إرسال توجيه إلى ${name} ✎`,ok?"good":"");
    if(ok)UI.confetti(50);
  }
  function addGroup(){UI.modal(`<h3>حلقة جديدة</h3><div class="field"><label>اسم الحلقة</label><input id="g" placeholder="مثال: حلقة الفرقان" /></div><button class="btn primary block" onclick="UI.closeModal();UI.toast('تم إنشاء الحلقة بنجاح','good')">إنشاء</button>`);}
  function guide(){
    const v=(document.getElementById("guide")||{}).value||"";
    if(!v.trim()){UI.toast("اكتب التوجيه أولًا");return;}
    UI.toast("تم بث التوجيه لجميع الطلاب 📢","good");UI.confetti(40);
  }
  return{render,review,addGroup,guide};
})();

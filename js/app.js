/* الموجّه الرئيسي + معالج الإعداد الأولي */
const App = (()=>{
  let view="home";
  let ob={step:1,role:null,track:null,startSurah:1,startAyah:1,currentSurah:2,currentAyah:10,dailyNew:5,hifzStartSurah:1,hifzStartAyah:1};

  const ROLES={
    student:{name:"حافِظ",icon:"📖",desc:"مهامي اليومية وتثبيت حفظي"},
    parent:{name:"ولي الأمر",icon:"👨‍👩‍👧",desc:"متابعة الأبناء أولًا بأول"},
    teacher:{name:"معلم",icon:"🧑‍🏫",desc:"مراجعة التسليمات والحلقات"},
    director:{name:"المشرف العام",icon:"🕌",desc:"إدارة المركز والتقارير"},
  };

  function init(){
    document.getElementById("themeBtn").onclick=()=>{
      const h=document.documentElement;
      h.dataset.theme=h.dataset.theme==="dim"?"":"dim";
      document.getElementById("themeBtn").textContent=h.dataset.theme==="dim"?"☀️":"🌙";
    };
    document.getElementById("resetBtn").onclick=()=>{
      if(confirm("إعادة الإعداد من البداية؟")){Store.reset();view="home";ob.step=1;render();}
    };
    document.getElementById("streakCount").textContent=Store.state.streak||0;
    render();
    window.addEventListener("resize",()=>{if(Store.state.setupDone&&view==="home")render(false);});
  }

  function render(resetView=true){
    const s=Store.state;
    document.getElementById("roleBadge").textContent=s.role?ROLES[s.role].icon+" "+ROLES[s.role].name:"زائر";
    if(!s.setupDone){renderOnboarding();renderNav([]);return;}
    if(resetView){/* keep */}
    renderNav(navFor(s.role));
    const root=document.getElementById("view");
    if(view==="settings")return renderSettings(root);
    if(s.role==="student")StudentView.render(root);
    else if(s.role==="parent")ParentView.render(root);
    else if(s.role==="teacher")TeacherView.render(root);
    else DirectorView.render(root);
    if(view==="plan"&&s.role==="student"){StudentView.showDay(1);document.getElementById("view").scrollIntoView();}
  }

  function navFor(role){
    if(role==="student")return[{id:"home",t:"الرئيسية",i:"🏠"},{id:"plan",t:"خطتي",i:"🗓️"},{id:"settings",t:"الإعداد",i:"⚙️"}];
    if(role==="parent")return[{id:"home",t:"المتابعة",i:"👨‍👩‍👧"},{id:"settings",t:"الإعداد",i:"⚙️"}];
    if(role==="teacher")return[{id:"home",t:"التسليمات",i:"📥"},{id:"settings",t:"الإعداد",i:"⚙️"}];
    return[{id:"home",t:"التقارير",i:"🕌"},{id:"settings",t:"الإعداد",i:"⚙️"}];
  }
  function renderNav(items){
    const html=items.map(n=>`<button class="nav-link ${view===n.id?"active":""}" onclick="App.go('${n.id}')"><span class="ico">${n.i}</span>${n.t}</button>`).join("")
      + (Store.state.setupDone?`<button class="nav-link" onclick="App.switchRole()"><span class="ico">🔄</span>تبديل الدور</button>`:"");
    document.getElementById("sideNav").innerHTML=html;
    document.getElementById("topNav").innerHTML=html;
    document.getElementById("bottomNav").innerHTML=html;
  }

  /* ===== الإعداد الأولي ===== */
  function renderOnboarding(){
    const root=document.getElementById("view");
    let body="";
    if(ob.step===1){
      body=`<div class="card tint"><div class="card-head"><div><h3>👋 أهلًا بك في إتقان — من أنت؟</h3><p>اختر دورك لتجهيز لوحتك الخاصة (يمكن التبديل لاحقًا)</p></div></div>
      <div class="role-grid">${Object.entries(ROLES).map(([k,r])=>`
        <div class="role-opt ${ob.role===k?"sel":""}" onclick="App.pickRole('${k}')"><div class="e">${r.icon}</div><b>${r.name}</b><span>${r.desc}</span></div>`).join("")}</div>
      <div style="margin-top:14px"><button class="btn primary block" ${ob.role?"":"disabled"} onclick="App.obNext()">التالي ←</button></div></div>`;
    }else if(ob.step===2){
      body=`<div class="card tint"><h3>🛤️ اختر مسارك في المراجعة</h3><p class="small">يُحسب وردك تلقائيًا فور تحديد نقطة البداية</p>
      <div class="track-grid" style="margin-top:12px">
        <div class="track-opt ${ob.track==="khatim"?"sel":""}" onclick="App.pickTrack('khatim')"><h4>📖 أ — الخاتم</h4><p class="small">أتممت الحفظ — يُقسَّم محفوظك الكلي إلى <b>10 أوراد متساوية</b> من آية البدء + تحليلات أسبوعية/شهرية/سنوية.</p></div>
        <div class="track-opt ${ob.track==="learner"?"sel":""}" onclick="App.pickTrack('learner')"><h4>🌱 ب — المتعلم النشط</h4><p class="small">ما زلت تحفظ — ورد يومي من 4 فئات: <b>الجديد • القريب (10 أيام) • الربط (نصف جزء) • البعيد (على 10 أيام)</b>.</p></div>
      </div>
      <div class="field-row" style="margin-top:14px"><button class="btn ghost" onclick="App.obBack()">→ رجوع</button><button class="btn primary" ${ob.track?"":"disabled"} onclick="App.obNext()">التالي ←</button></div></div>`;
    }else{
      const isKh=ob.track==="khatim";
      body=`<div class="card tint"><h3>📍 ${isKh?"من أين تبدأ مراجعة الختمة؟":"أين وصلت في حفظك؟"}</h3>
        <p class="small">${isKh?"سنقسم ما تبقى من المصحف (6236 آية) إلى 10 أوراد متساوية بدقة.":"نحسب الفئات الأربع تلقائيًا من موضعك الحالي ومقدار الجديد اليومي."}</p>
        ${isKh?`
        <div class="field-row"><div class="field"><label>سورة البداية</label><select id="ob_s" onchange="App.obRead()">${UI.surahOptions(ob.startSurah)}</select></div>
        <div class="field"><label>رقم الآية</label><input id="ob_a" type="number" min="1" max="286" value="${ob.startAyah}" oninput="App.obRead()" /></div></div>
        <div class="ayah-range-box" id="obPrev"></div>`
        :`
        <div class="field-row"><div class="field"><label>بداية الحفظ (من)</label><select id="ob_hs" onchange="App.obRead()">${UI.surahOptions(ob.hifzStartSurah)}</select></div>
        <div class="field"><label>السور الحالية: وصلت سورة</label><select id="ob_cs" onchange="App.obRead()">${UI.surahOptions(ob.currentSurah)}</select></div></div>
        <div class="field-row"><div class="field"><label>وصلت الآية</label><input id="ob_ca" type="number" min="1" value="${ob.currentAyah}" oninput="App.obRead()" /></div>
        <div class="field"><label>مقدار الجديد يوميًا (آية)</label><input id="ob_n" type="number" min="1" max="50" value="${ob.dailyNew}" oninput="App.obRead()" /></div></div>
        <div class="ayah-range-box" id="obPrev"></div>`}
        <div class="field-row" style="margin-top:14px"><button class="btn ghost" onclick="App.obBack()">→ رجوع</button><button class="btn primary" onclick="App.finish()">🚀 ابدأ خطتي</button></div></div>`;
    }
    root.innerHTML=`<div class="wizard"><div class="page-title"><div><h2>۞ إتقان — إعداد دقيقتين</h2><p class="muted">نظام المراجعة الذكي لحفظة القرآن الكريم</p></div><span class="chip blue">خطوة ${ob.step} / 3</span></div>
      <div class="steps"><i class="on"></i><i class="${ob.step>=2?"on":""}"></i><i class="${ob.step>=3?"on":""}"></i></div>${body}
      <div class="hadith" style="margin-top:14px">${UI.randomMotiv()}</div></div>`;
    if(ob.step===3)previewCalc();
  }
  function previewCalc(){
    const el=document.getElementById("obPrev");if(!el)return;
    try{
      if(ob.track==="khatim"){
        const r=Tracks.buildKhatimPlan(ob.startSurah,ob.startAyah);
        el.innerHTML=`المتبقي <b>${r.total}</b> آية ≈ <b>${QuranUtils.ayatToJuz(r.total).toFixed(1)}</b> جزء — الورد اليومي ≈ <b>${r.chunk}</b> آية (≈ ${QuranUtils.ayatToPages(r.chunk)} صفحات) × 10 أيام`;
      }else{
        const{meta}=Tracks.buildLearnerPlan({currentSurah:ob.currentSurah,currentAyah:ob.currentAyah,dailyNew:ob.dailyNew,hifzStartSurah:ob.hifzStartSurah,hifzStartAyah:1});
        el.innerHTML=`جديد <b>${meta.dailyNew}</b> • قريب <b>${meta.recentLen}</b> • ربط <b>${meta.linkLen}</b> • بعيد <b>${meta.distantTotal}</b> (يوميًا ${meta.distantPerDay})`;
      }
    }catch(e){el.textContent="أدخل بيانات صحيحة لعرض الحسبة…";}
  }

  function renderSettings(root){
    const s=Store.state;
    root.innerHTML=`<div class="page-title"><div><h2>⚙️ الإعداد</h2><p>تعديل المسار والموضع والدور</p></div></div>
    <div class="grid two">
      <div class="card"><h3>المسار والموضع</h3>
        <div class="field"><label>المسار</label><select id="set_track"><option value="khatim" ${s.track==="khatim"?"selected":""}>أ — الخاتم (10 أوراد)</option><option value="learner" ${s.track==="learner"?"selected":""}>ب — المتعلم (4 فئات)</option></select></div>
        <div class="field-row"><div class="field"><label>سورة البدء/الموضع</label><select id="set_s">${UI.surahOptions(s.track==="khatim"?s.startSurah:s.currentSurah)}</select></div>
        <div class="field"><label>الآية</label><input id="set_a" type="number" value="${s.track==="khatim"?s.startAyah:s.currentAyah}" /></div></div>
        <div class="field"><label>الجديد اليومي (للمتعلم)</label><input id="set_n" type="number" min="1" max="50" value="${s.dailyNew}" /></div>
        <button class="btn primary block" onclick="App.saveSettings()">حفظ وإعادة توليد الخطة ✓</button></div>
      <div class="card"><h3>الحساب</h3><p class="small">الدور الحالي: <b>${ROLES[s.role].name}</b> • المسار: <b>${s.track==="khatim"?"الخاتم":"المتعلم"}</b></p>
        <button class="btn block" onclick="App.switchRole()">🔄 تبديل الدور</button><div style="height:8px"></div>
        <button class="btn block" onclick="if(confirm('حذف كل التقدم؟')){Store.reset();location.reload()}">🗑️ حذف كل البيانات</button></div>
    </div>`;
  }

  return{
    init,
    go(v){view=v;render(false);window.scrollTo({top:0,behavior:"smooth"});},
    pickRole(r){ob.role=r;renderOnboarding();},
    pickTrack(t){ob.track=t;renderOnboarding();},
    obNext(){ob.step=Math.min(3,ob.step+1);renderOnboarding();},
    obBack(){ob.step=Math.max(1,ob.step-1);renderOnboarding();},
    obRead(){
      const g=id=>document.getElementById(id);
      if(g("ob_s")){ob.startSurah=+g("ob_s").value;ob.startAyah=+g("ob_a").value||1;}
      if(g("ob_cs")){ob.currentSurah=+g("ob_cs").value;ob.currentAyah=+g("ob_ca").value||1;ob.dailyNew=+g("ob_n").value||5;ob.hifzStartSurah=+g("ob_hs").value;}
      previewCalc();
    },
    finish(){
      App.obRead();
      Store.set({setupDone:true,role:ob.role,track:ob.track,startSurah:ob.startSurah,startAyah:ob.startAyah,
        currentSurah:ob.currentSurah,currentAyah:ob.currentAyah,dailyNew:ob.dailyNew,hifzStartSurah:ob.hifzStartSurah,hifzStartAyah:1});
      view="home";render();UI.confetti();UI.toast("تم إنشاء خطتك بنجاح — بالتوفيق 🌟","good");
    },
    saveSettings(){
      const s=Store.state;
      s.track=document.getElementById("set_track").value;
      const sv=+document.getElementById("set_s").value, av=+document.getElementById("set_a").value||1;
      s.dailyNew=+document.getElementById("set_n").value||5;
      if(s.track==="khatim"){s.startSurah=sv;s.startAyah=av;}else{s.currentSurah=sv;s.currentAyah=av;}
      Store.save();view="home";render();UI.toast("حُفظت الإعدادات وأُعيد توليد الخطة","good");
    },
    switchRole(){
      const names=Object.entries(ROLES).map(([k,r])=>`<div class="role-opt" onclick="App.setRole('${k}')"><div class="e">${r.icon}</div><b>${r.name}</b></div>`).join("");
      UI.modal(`<h3>تبديل الدور (RBAC)</h3><p class="small">معاينة فورية لصلاحيات كل دور — البيانات محفوظة.</p><div class="role-grid" style="margin-top:10px">${names}</div>`);
    },
    setRole(r){Store.set({role:r});UI.closeModal();view="home";render();UI.toast("أنت الآن: "+ROLES[r].name,"good");},
    toggle(day,id){Scheduler.toggleTask(day,id);render(false);},
    markMissed(day){Scheduler.markMissed(day);UI.toast("سُجّل الغياب — استخدم إعادة التوزيع الذكية","warn");render(false);},
    redistribute(){const p=StudentView.currentPlan();Scheduler.redistribute(p);render(false);},
  };
})();
document.addEventListener("DOMContentLoaded",App.init);

/* منطق المسارين الأساسي */
const Tracks = (()=>{
  /** المسار أ: الخاتم — تقسيم المحفوظ الكلي إلى 10 أوراد متساوية من آية البداية */
  function buildKhatimPlan(startSurah,startAyah){
    const startG=QuranUtils.toGlobal(startSurah,startAyah);
    const total=TOTAL_AYAT-startG+1;
    const chunk=Math.ceil(total/10);
    const plan=[];
    for(let d=0;d<10;d++){
      const fromG=startG+d*chunk;
      if(fromG>TOTAL_AYAT)break;
      const toG=Math.min(TOTAL_AYAT,fromG+chunk-1);
      const jr=QuranUtils.juzRangeOf(fromG);
      plan.push({
        day:d+1, kind:"khatim",
        fromG,toG,
        rangeText:QuranUtils.rangeText(fromG,toG),
        ayatCount:toG-fromG+1,
        pages:QuranUtils.ayatToPages(toG-fromG+1),
        juz:QuranUtils.juzOf(fromG),
        label:`الورد ${d+1} من 10`,
      });
    }
    return{plan,total,chunk,startG};
  }

  /**
   * المسار ب: المتعلم النشط — 4 فئات يومية
   * 1) الجديد: dailyNew آيات من الموضع الحالي
   * 2) الماضي القريب: مراجعة 10 أيام سابقة للجديد = dailyNew*10 قبل الجديد
   * 3) الربط: آخر نصف جزء قبل نقطة الوصل ≈ 104 آيات قبل الماضي القريب
   * 4) الماضي البعيد: باقي المحفوظ موزعًا على 10 أيام
   */
  function buildLearnerPlan({currentSurah,currentAyah,dailyNew,hifzStartSurah,hifzStartAyah}){
    dailyNew=Math.max(1,Math.min(50,+dailyNew||5));
    const curG=QuranUtils.toGlobal(currentSurah,currentAyah);
    const hifzG=QuranUtils.toGlobal(hifzStartSurah||1,hifzStartAyah||1);
    const memorized=Math.max(0,curG-hifzG); // ما قبل الجديد

    const newFrom=curG, newTo=Math.min(TOTAL_AYAT,curG+dailyNew-1);
    const recentLen=Math.min(memorized,dailyNew*10);
    const recentTo=curG-1, recentFrom=Math.max(hifzG,recentTo-recentLen+1);
    const HALF_JUZ=Math.round(TOTAL_AYAT/60); // ≈104
    const linkAvail=Math.max(0,recentFrom-hifzG);
    const linkLen=Math.min(linkAvail,HALF_JUZ);
    const linkTo=recentFrom-1, linkFrom=linkTo-linkLen+1;
    const distantTotal=Math.max(0,linkAvail-linkLen);
    const distantPerDay=Math.ceil(distantTotal/10);

    const days=[];
    for(let d=0;d<10;d++){
      const tasks=[];
      // الجديد يتقدم يوميًا
      const nf=newFrom+d*dailyNew, nt=Math.min(TOTAL_AYAT,nf+dailyNew-1);
      if(nf<=TOTAL_AYAT) tasks.push({id:`d${d+1}-new`,cat:"new",title:"الجديد — حفظ أول مرة",fromG:nf,toG:nt,rangeText:QuranUtils.rangeText(nf,nt),ayatCount:nt-nf+1,icon:"🌱"});
      if(recentLen>0) tasks.push({id:`d${d+1}-recent`,cat:"recent",title:"الماضي القريب — آخر 10 أيام",fromG:recentFrom,toG:recentTo,rangeText:QuranUtils.rangeText(recentFrom,recentTo),ayatCount:recentLen,icon:"📘"});
      if(linkLen>0) tasks.push({id:`d${d+1}-link`,cat:"link",title:"الربط — آخر نصف جزء قبل الوصلة",fromG:linkFrom,toG:linkTo,rangeText:QuranUtils.rangeText(linkFrom,linkTo),ayatCount:linkLen,icon:"🔗"});
      if(distantTotal>0){
        // شريحة اليوم d من الماضي البعيد
        const slice=distantSlice(hifzG,distantTotal,distantPerDay,d);
        if(slice) tasks.push({id:`d${d+1}-distant`,cat:"distant",title:"الماضي البعيد — ورد العشرة",fromG:slice[0],toG:slice[1],rangeText:QuranUtils.rangeText(slice[0],slice[1]),ayatCount:slice[1]-slice[0]+1,icon:"📚"});
      }
      days.push({day:d+1,tasks,newRef:QuranUtils.rangeText(nf,nt)});
    }
    return{days,meta:{memorized,recentLen,linkLen,distantTotal,distantPerDay,dailyNew,curG,hifzG,newFrom,newTo}};
    function distantSlice(base,total,per,d){
      const a=base+d*per; if(a>=base+total)return null;
      const b=Math.min(base+total-1,a+per-1); return[a,b];
    }
  }

  return{buildKhatimPlan,buildLearnerPlan};
})();

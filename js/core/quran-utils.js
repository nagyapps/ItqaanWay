/* أدوات التحويل بين (سورة:آية) والترتيب العام */
const QuranUtils = (()=>{
  const cum=[0];
  SURAHS.forEach(s=>cum.push(cum[cum.length-1]+s.ayat));

  const toGlobal=(surah,ayah)=>{
    surah=Math.min(114,Math.max(1,+surah||1));
    const max=SURAHS[surah-1].ayat;
    ayah=Math.min(max,Math.max(1,+ayah||1));
    return cum[surah-1]+ayah;
  };
  const fromGlobal=(g)=>{
    g=Math.min(TOTAL_AYAT,Math.max(1,Math.round(g)));
    let lo=1,hi=114;
    while(lo<=hi){const m=(lo+hi)>>1;if(g>cum[m])lo=m+1;else if(g<=cum[m-1])hi=m-1;else{return{surah:m,ayah:g-cum[m-1],name:SURAHS[m-1].name};}}
    return{surah:114,ayah:6,name:"الناس"};
  };
  const ref=(surah,ayah)=>`سورة ${SURAHS[surah-1].name} — آية ${ayah}`;
  const shortRef=(surah,ayah)=>`${SURAHS[surah-1].name} ${ayah}`;
  const rangeText=(a,b)=>{
    const A=fromGlobal(a),B=fromGlobal(b);
    if(A.surah===B.surah) return `سورة ${A.name} من آية ${A.ayah} إلى ${B.ayah}`;
    return `من ${A.name} ${A.ayah} إلى ${B.name} ${B.ayah}`;
  };
  const juzStartsGlobal=JUZ_STARTS.map(([s,a])=>toGlobal(s,a));
  const juzOf=(g)=>{let j=1;for(let i=0;i<30;i++){if(g>=juzStartsGlobal[i])j=i+1;}return j;};
  const juzRangeOf=(g)=>{const j=juzOf(g);const s=juzStartsGlobal[j-1];const e=j<30?juzStartsGlobal[j]-1:TOTAL_AYAT;return{juz:j,start:s,end:e};};
  const ayatToPages=(n)=>Math.max(1,Math.round(n/15)); // تقدير: ~15 آية/صفحة
  const ayatToJuz=(n)=>(n/TOTAL_AYAT*30);

  return{toGlobal,fromGlobal,ref,shortRef,rangeText,juzOf,juzRangeOf,ayatToPages,ayatToJuz,cum};
})();

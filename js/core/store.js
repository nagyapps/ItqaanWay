/* مخزن الحالة — localStorage مع بنية قابلة للتوسع */
const Store = (()=>{
  const KEY="itqaan_state_v1";
  const fresh=()=>({
    setupDone:false, role:null, track:null,
    startSurah:1,startAyah:1,
    currentSurah:2,currentAyah:1,dailyNew:5,
    hifzStartSurah:1,hifzStartAyah:1,
    plan:[],           // عناصر الخطة المولدة
    completions:{},    // {"2026-..-dayIndex-taskId": true}
    dayStatus:{},      // dayIndex -> "done"|"missed"|"partial"
    dayDates:{},       // dayIndex -> yyyy-mm-dd
    streak:0,lastDoneDate:null,
    submissions:[], notes:[],
  });
  let s;
  try{s=JSON.parse(localStorage.getItem(KEY))||fresh();}catch{s=fresh();}
  const save=()=>localStorage.setItem(KEY,JSON.stringify(s));
  const reset=()=>{s=fresh();save();};
  const todayStr=(d=new Date())=>d.toISOString().slice(0,10);
  return{
    get state(){return s;},
    save,reset,todayStr,
    set(patch){Object.assign(s,patch);save();},
  };
})();

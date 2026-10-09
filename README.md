# إتقان — منظومة الحافظ للمراجعة والتثبيت 🕊️

تطبيق ويب عربي كامل (RTL) لمساعدة حفاظ القرآن على تنظيم المراجعة، يعمل **بدون أي build أو مكتبات خارجية** — افتح `index.html` مباشرة.

## التشغيل
- افتح `index.html` في المتصفح (أو `npx serve .` ثم زر http://localhost:3000).
- أول تشغيل: معالج 3 خطوات → اختر **الدور** → اختر **المسار** → حدد **الموضع** → تُولَّد خطتك.

## المسارات (Business Logic)
| المسار | القاعدة |
|---|---|
| **أ — الخاتم** | `buildKhatimPlan(startSurah,startAyah)` يقسم المتبقي من المصحف (6236 آية) إلى **10 أوراد متساوية** مع نطاق السور والجزء وعدد الصفحات. `js/core/tracks.js` |
| **ب — المتعلم** | `buildLearnerPlan(...)` يولّد 10 أيام، كل يوم 4 مهام: **الجديد** (N آية من الموضع) • **الماضي القريب** (آخر 10×N آية) • **الربط** (آخر نصف جزء ≈104 آيات قبل الوصلة) • **البعيد** (الباقي ÷ 10). |

## الأدوار (RBAC)
- **📖 حافِظ** (`js/roles/student.js`): مهام اليوم + حلقة تقدم + تحليلات أسبوعي/شهري/سنوي (Canvas) + أيام العشرة.
- **👨‍👩‍👧 ولي الأمر** (`parent.js`): متابعة الأبناء، حالة اليوم، رسالة للمعلم.
- **🧑‍🏫 معلم** (`teacher.js`): اعتماد التسليمات، الحلقات، بث توجيه.
- **🕌 المشرف** (`director.js`): متوسط الالتزام، إدارة المستخدمين، تصدير CSV.

## الميزات الذكية
- **إعادة توزيع الغياب**: `Scheduler.markMissed(day)` + `redistribute()` — زر "🧠 إعادة توزيع ذكية".
- **سلسلة المواظبة 🔥 + قصاصات احتفالية + رسائل تحفيزية** (`Analytics.registerActivity`, `UI.confetti/toast`).
- حفظ تلقائي في `localStorage` (`itqaan_state_v1`)، وضع ليلي خافت، تصميم mobile-first.

## البنية
```
index.html
css/ variables.css base.css components.css dashboards.css
js/
  data/quran-data.js      # 114 سورة + بدايات الأجزاء + بيانات تجريبية
  core/ quran-utils.js store.js tracks.js scheduler.js analytics.js
  ui/ components.js charts.js
  roles/ student.js parent.js teacher.js director.js
  app.js                  # الموجّه + الإعداد الأولي
```

## التوسعة المقترحة
- ربط API حقيقي (Supabase/Firebase) بدل localStorage — واجهة `Store` جاهزة للاستبدال.
- Web Push لتذكير الورد، وPWA (أضف manifest + service worker).
- اختبارات لمنطق التقسيم: `chunk = ceil(total/10)`، ومجموع الشرائح = المحفوظ.

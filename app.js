(() => {
  'use strict';
  const STORE_KEY = 'nightshift-roadmap-v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clone = (value) => JSON.parse(JSON.stringify(value));

  const LANGUAGE_KEY = 'nightshift-language-v3';
  let currentLanguage = 'en'; // English is the default; Persian is the secondary language.
  try { currentLanguage = localStorage.getItem(LANGUAGE_KEY) === 'fa' ? 'fa' : 'en'; } catch (_) { currentLanguage = 'en'; }
  const originalTextNodes = new WeakMap();
  const originalAttributes = new WeakMap();
  const UI_FA = {
    'WORKSPACE':'فضای کار', 'Overview':'نمای کلی', '12-week roadmap':'نقشه راه ۱۲ هفته‌ای', 'Skill tree':'درخت مهارت',
    'Lessons library':'کتابخانه درس‌ها', 'Study room':'اتاق مطالعه', 'Reports & progress':'گزارش‌ها و پیشرفت', 'Learning guide':'راهنمای یادگیری',
    'Stay in scope':'در محدوده مجاز بمان', 'Practice only where you have permission.':'فقط در محیط‌هایی تمرین کن که برای آن‌ها اجازه داری.',
    'LOCAL PROGRESS STORAGE':'ذخیره محلی پیشرفت', 'ON DEVICE':'روی همین دستگاه', 'YOUR LEARNING SPACE':'فضای یادگیری شما',
    'Open menu':'باز کردن منو', 'Profile and local settings':'نمایه و تنظیمات محلی',
    'OVERVIEW':'نمای کلی', '12-WEEK ROADMAP':'نقشه راه ۱۲ هفته‌ای', 'SKILL TREE':'درخت مهارت', 'LESSONS LIBRARY':'کتابخانه درس‌ها',
    'LESSON DETAILS':'جزئیات درس', 'STUDY ROOM':'اتاق مطالعه', 'REPORTS & PROGRESS':'گزارش‌ها و پیشرفت', 'LEARNING GUIDE':'راهنمای یادگیری',
    'THE 12-WEEK PLAN':'برنامه ۱۲ هفته‌ای', 'Browse all lessons':'مشاهده همه درس‌ها', 'CURRICULUM LIBRARY':'کتابخانه برنامه آموزشی',
    'Fourteen skills. One coherent foundation.':'چهارده مهارت؛ یک مسیر منسجم.', 'All lessons':'همه درس‌ها', 'Not started':'شروع‌نشده',
    'In progress':'در حال انجام', 'Completed':'تکمیل‌شده', 'Open lesson ↗':'باز کردن درس ↗', 'Back to lessons':'بازگشت به درس‌ها',
    'VIDEO PICK':'ویدیوی منتخب', 'REFERENCE':'منبع تکمیلی', 'LEARNING RESOURCE':'منبع یادگیری', 'Watch video ↗':'تماشای ویدیو ↗',
    'Next resource ↗':'منبع بعدی ↗', 'What this lesson teaches':'این درس چه چیزی آموزش می‌دهد', 'Why you should learn it':'چرا یادگیری این موضوع مهم است',
    'What you should be able to do afterwards':'پس از پایان درس چه توانایی‌هایی خواهی داشت', 'Requirements before you start':'پیش‌نیازهای شروع',
    'Practice deliverable':'خروجی تمرین', 'Your lesson notes':'یادداشت‌های درس', 'Notes save locally as you type.':'یادداشت‌ها هنگام نوشتن به‌صورت محلی ذخیره می‌شوند.',
    'Open Study Room for this lesson ↗':'باز کردن اتاق مطالعه برای این درس ↗', 'Mark as not complete':'لغو تکمیل درس', 'Mark lesson complete ✓':'علامت‌گذاری به‌عنوان درس تکمیل‌شده ✓',
    'Practice this lesson':'تمرین این درس', 'Direct links to guided environments':'پیوندهای مستقیم به محیط‌های آموزشی هدایت‌شده',
    'Your time on this module':'زمان صرف‌شده برای این بخش', 'Time saved through the Study Room':'زمان ثبت‌شده از طریق اتاق مطالعه',
    'hours remaining in the suggested budget.':'ساعت از زمان پیشنهادی باقی مانده است.', 'Save daily target':'ذخیره هدف روزانه',
    'How to get real results':'چطور نتیجه واقعی بگیری', 'Use an active learning loop':'از چرخه یادگیری فعال استفاده کن',
    'Watch with a question':'با یک سؤال مشخص تماشا کن', 'Practice before you feel ready':'قبل از اینکه کاملاً آماده شوی تمرین کن',
    'Keep an evidence notebook':'دفترچه شواهد داشته باش', 'Teach it back':'آن را با زبان خودت توضیح بده', 'Review weekly':'هر هفته مرور کن',
    'Make learning less repetitive':'یادگیری را متنوع‌تر کن', 'Use small missions to keep momentum':'برای حفظ پیوستگی از مأموریت‌های کوچک استفاده کن',
    'Professional boundaries are a core skill':'رعایت مرزهای حرفه‌ای یک مهارت اساسی است',
    'Every practical exercise in this course should follow these rules':'تمام تمرین‌های عملی این دوره باید از این قواعد پیروی کنند',
    'BUILT FOR CURIOUS MINDS · RUN SAFE · STAY SHARP':'برای ذهن‌های کنجکاو · ایمن تمرین کن · هوشیار بمان',
    'YOUR DATA STAYS IN THIS BROWSER':'داده‌های شما در همین مرورگر می‌مانند', 'ON DEVICE':'روی همین دستگاه',
    'Search topics, skills or categories…':'جست‌وجوی موضوع، مهارت یا دسته‌بندی…', 'Filter lessons':'فیلتر درس‌ها',
    'All lessons':'همه درس‌ها', 'No modules match this search. Try another topic or reset the filter.':'هیچ بخشی با این جست‌وجو پیدا نشد. موضوع دیگری را جست‌وجو یا فیلتر را پاک کن.',
    'WEEKLY CHECKPOINT':'نقطه بررسی هفتگی', 'WEEK COMPLETED':'هفته تکمیل شد', 'CURRENT FOCUS':'تمرکز فعلی', 'UPCOMING STUDY BLOCK':'بخش مطالعاتی بعدی',
    'PLANNED':'برنامه‌ریزی‌شده', 'MODULES':'بخش', 'COMPLETED':'تکمیل‌شده', 'NOT STARTED':'شروع‌نشده', 'IN PROGRESS':'در حال انجام',
    'Study safely and only in authorized environments.':'ایمن و فقط در محیط‌های دارای مجوز مطالعه و تمرین کن.',
    'A 12-WEEK PRACTICE-LED CURRICULUM':'برنامه آموزشی ۱۲ هفته‌ای مبتنی بر تمرین',
    'protect systems.':'از سامانه‌ها محافظت کن.',
    'Build skills that':'مهارت‌هایی بساز که',
    'A structured route from operating-system fundamentals to authorized security assessments. Learn the why, practice in dedicated labs, and keep evidence of what you can do.':'مسیر آموزشی منسجم از مبانی سیستم‌عامل تا ارزیابی امنیتی مجاز. دلیل هر موضوع را یاد بگیر، در آزمایشگاه‌های اختصاصی تمرین کن و از توانایی‌هایت مستندات نگه دار.',
    'Continue learning':'ادامه یادگیری', 'Explore the roadmap':'مرور نقشه راه', 'TOTAL COURSE TIME':'زمان کل دوره',
    'GUIDED HOURS':'ساعت آموزش هدایت‌شده', 'TIME INVESTED':'زمان صرف‌شده', 'LESSONS COMPLETE':'درس‌های تکمیل‌شده',
    'CURRENT STREAK':'پیوستگی فعلی', 'EXPERIENCE POINTS':'امتیاز تجربه', 'of ':'از ', 'planned course hours':'ساعت برنامه‌ریزی‌شده دوره',
    ' days':' روز', 'Course progress':'پیشرفت دوره', 'Your tracked learning time against the 140-hour plan':'زمان مطالعه ثبت‌شده در مقایسه با برنامه ۱۴۰ ساعته',
    'Course time target reached':'هدف زمانی دوره تکمیل شد', 'hours left in your plan':'ساعت تا پایان برنامه باقی مانده',
    'Use the stopwatch or focus timer in the Study Room to record time. Mark a lesson complete when you can explain the concept and finish its practice tasks.':'برای ثبت زمان از کرنومتر یا تایمر تمرکز در اتاق مطالعه استفاده کن. وقتی بتوانی مفهوم را توضیح بدهی و تمرین‌های آن را کامل کنی، درس را تکمیل‌شده علامت بزن.',
    'Weekly rhythm':'برنامه هفتگی', 'Choose a week to open its study plan':'برای مشاهده برنامه مطالعه، یک هفته را انتخاب کن',
    'Completed week':'هفته تکمیل‌شده', 'Upcoming week':'هفته پیش‌رو', 'Up next':'مرحله بعدی', 'Keep the sequence moving':'مسیر را ادامه بده',
    'NEXT STEPS':'مراحل بعدی', 'Lesson time tracker':'ردیاب زمان درس‌ها',
    'Planned study time compared with time you have logged for each module':'زمان مطالعه برنامه‌ریزی‌شده در مقایسه با زمان ثبت‌شده برای هر بخش',
    'View full report ↗':'مشاهده گزارش کامل ↗', 'A path, not a playlist.':'یک مسیر یادگیری، نه فهرستی بی‌پایان از ویدیوها.',
    'Each week has a clear learning outcome, a realistic time budget and a checkpoint. The capstone runs in parallel from week 3 so your reporting skills grow alongside the technical work.':'هر هفته هدف یادگیری روشن، زمان‌بندی واقع‌بینانه و نقطه ارزیابی مشخص دارد. پروژه پایانی از هفته سوم هم‌زمان پیش می‌رود تا مهارت گزارش‌نویسی نیز همراه با مهارت فنی رشد کند.',
    'Browse all lessons':'مرور همه درس‌ها', 'Fourteen skills. One coherent foundation.':'چهارده مهارت؛ یک پایه منسجم.',
    'Every module includes what it teaches, why it matters, requirements, expected outcomes, a video pick and a direct lab route.':'هر بخش شامل محتوای آموزشی، اهمیت موضوع، پیش‌نیازها، نتایج مورد انتظار، ویدیوی منتخب و مسیر مستقیم تمرین است.',
    'Search topics, skills or categories…':'جست‌وجوی موضوع، مهارت یا دسته‌بندی…', 'Filter lessons':'فیلتر درس‌ها',
    'Open lesson ↗':'باز کردن درس ↗', 'Open lesson library':'باز کردن کتابخانه درس‌ها',
    'FOCUS TOOLS':'ابزارهای تمرکز', 'Make focused time visible.':'زمان تمرکزت را قابل مشاهده کن.',
    'Use the stopwatch for flexible study blocks and the Pomodoro timer for repeatable focus cycles. Both can attach time to a lesson and update your course totals.':'از کرنومتر برای بازه‌های مطالعه دلخواه و از تایمر پومودورو برای چرخه‌های تمرکز استفاده کن. هر دو زمان را به یک درس اختصاص می‌دهند و مجموع دوره را به‌روزرسانی می‌کنند.',
    'Current lesson':'درس فعلی', 'Choose which module should receive your tracked focus time.':'انتخاب کن زمان تمرکز ثبت‌شده به کدام بخش اختصاص یابد.',
    'Stopwatch':'کرنومتر', 'Flexible study tracking':'ثبت زمان مطالعه دلخواه', 'Start':'شروع', 'Pause':'مکث',
    'Save session':'ذخیره جلسه', 'Reset':'بازنشانی', 'Pomodoro':'پومودورو', 'Focus, then take a real break':'تمرکز کن، سپس استراحت واقعی داشته باش',
    'Focus':'تمرکز', 'Short break':'استراحت کوتاه', 'Long break':'استراحت طولانی', 'Start focus':'شروع تمرکز',
    'Pause the active timer before switching lessons.':'پیش از تغییر درس، تایمر فعال را متوقف کن.',
    'YOUR LEARNING ANALYTICS':'گزارش تحلیلی یادگیری', 'Progress you can prove.':'پیشرفتی که می‌توانی نشان بدهی.',
    'A private view of your course time, completed modules and daily activity. Export it when you want to keep a backup or review your learning.':'نمایی خصوصی از زمان دوره، بخش‌های تکمیل‌شده و فعالیت روزانه. هر زمان خواستی برای پشتیبان‌گیری یا مرور روند یادگیری آن را صادر کن.',
    'Export CSV ↓':'خروجی CSV ↓', 'Backup data ↓':'پشتیبان‌گیری از داده‌ها ↓', 'TOTAL STUDY TIME':'مجموع زمان مطالعه',
    'MODULE COMPLETION':'تکمیل بخش‌ها', 'POMODORO STARTS':'دفعات شروع پومودورو', 'This week':'این هفته',
    'Hours recorded by day':'ساعت‌های ثبت‌شده در هر روز', 'DAILY ACTIVITY':'فعالیت روزانه', 'Time by lesson':'زمان هر درس',
    'Top eight modules by tracked time':'هشت بخش برتر بر اساس زمان ثبت‌شده', 'Milestones':'نقاط عطف',
    'Small wins that reinforce consistent practice':'موفقیت‌های کوچک برای تقویت تمرین مستمر', 'Module completion report':'گزارش تکمیل بخش‌ها',
    'Mark a module complete only after you can explain it and finish its lab practice.':'فقط زمانی یک بخش را تکمیل‌شده علامت بزن که بتوانی آن را توضیح بدهی و تمرین آزمایشگاهی‌اش را به پایان برسانی.',
    'HOW TO STUDY':'روش مطالعه', 'Consistency beats marathon sessions.':'پیوستگی از جلسات طولانی و فرسایشی بهتر است.',
    'This path is designed for steady skill-building. Your goal is not to watch every minute of every video; it is to understand a concept, apply it in a safe lab and explain your evidence.':'این مسیر برای ساخت تدریجی مهارت طراحی شده است. هدف تماشای تمام دقایق ویدیوها نیست؛ هدف درک مفهوم، به‌کارگیری آن در آزمایشگاه امن و توضیح شواهد است.',
    'Open study room ↗':'باز کردن اتاق مطالعه ↗', 'A realistic daily routine':'برنامه روزانه واقع‌بینانه',
    'Recommended target:':'هدف پیشنهادی:', 'focused hours':'ساعت تمرکز', '6 DAYS / WEEK':'۶ روز در هفته',
    'Recall yesterday':'مرور آموخته‌های دیروز', 'Learn one concept':'یادگیری یک مفهوم', 'Take a real break':'استراحت واقعی',
    'Apply it in a lab':'به‌کارگیری در آزمایشگاه', 'Write a mini report':'نوشتن گزارش کوتاه', 'Plan the next session':'برنامه‌ریزی جلسه بعد',
    'Set your daily study target (minutes)':'هدف روزانه مطالعه را تعیین کن (دقیقه)', 'Save daily target':'ذخیره هدف روزانه',
    'How to get real results':'چطور به نتیجه واقعی برسی', 'Use an active learning loop':'از چرخه یادگیری فعال استفاده کن',
    'Watch with a question':'با یک سؤال تماشا کن', 'Practice before you feel ready':'پیش از احساس آمادگی کامل تمرین کن',
    'Keep an evidence notebook':'دفترچه شواهد داشته باش', 'Teach it back':'آن را با زبان خودت توضیح بده', 'Review weekly':'مرور هفتگی',
    'Make learning less repetitive':'یادگیری را از یکنواختی خارج کن', 'Use small missions to keep momentum':'برای حفظ انگیزه از مأموریت‌های کوچک استفاده کن',
    'Professional boundaries are a core skill':'رعایت مرزهای حرفه‌ای یک مهارت اساسی است',
    'Every practical exercise in this course should follow these rules':'تمام تمرین‌های عملی این دوره باید از این قواعد پیروی کنند',
    'Progress is stored in this browser.':'پیشرفت در همین مرورگر ذخیره می‌شود.', 'lessons completed':'درس تکمیل‌شده',
    'DONE':'تکمیل', 'NOT STARTED':'شروع‌نشده', 'IN PROGRESS':'در حال انجام', 'COMPLETED':'تکمیل‌شده',
    'WORKSPACE':'فضای کار', 'Main navigation':'ناوبری اصلی', 'VERSION':'نسخه', 'WEEK':'هفته', 'Nightshift home':'صفحه اصلی نایت‌شیفت',
    'Profile and local settings':'نمایه و تنظیمات محلی'
  };
  const UI_EXTRA_FA = {
    'Overview':'نمای کلی','12-week roadmap':'نقشه راه ۱۲ هفته‌ای','Skill tree':'درخت مهارت','Lessons library':'کتابخانه درس‌ها','Study room':'اتاق مطالعه','Reports & progress':'گزارش‌ها و پیشرفت','Learning guide':'راهنمای یادگیری',
    'Nightshift home':'صفحه اصلی نایت‌شیفت','Main navigation':'ناوبری اصلی', 'VERSION':'نسخه', 'WEEK':'هفته','ETHICAL SECURITY PATH':'مسیر امنیت اخلاقی','WORKSPACE':'فضای کار','Stay in scope':'در محدوده مجاز بمان','Practice only where you have permission.':'فقط در محیط‌هایی تمرین کن که مجوز انجام آن‌ها را داری.','LOCAL PROGRESS STORAGE':'ذخیره محلی پیشرفت','ON DEVICE':'روی همین دستگاه','YOUR LEARNING SPACE':'فضای یادگیری تو','Open menu':'باز کردن منو','Profile and local settings':'نمایه و تنظیمات محلی',
    'A 12-WEEK PRACTICE-LED CURRICULUM':'برنامه آموزشی ۱۲ هفته‌ای مبتنی بر تمرین','Build skills that':'مهارت‌هایی بساز که','protect systems.':'از سامانه‌ها محافظت کنند.','A structured route from operating-system fundamentals to authorized security assessments. Learn the why, practice in dedicated labs, and keep evidence of what you can do.':'مسیر آموزشی منسجم از مبانی سیستم‌عامل تا ارزیابی‌های امنیتی مجاز. دلیل هر موضوع را یاد بگیر، در آزمایشگاه‌های اختصاصی تمرین کن و شواهد توانایی‌هایت را ثبت کن.','Continue learning':'ادامه یادگیری','Explore the roadmap':'مرور نقشه راه','TOTAL COURSE TIME':'زمان کل دوره','GUIDED HOURS':'ساعت آموزش هدایت‌شده','TIME INVESTED':'زمان صرف‌شده','LESSONS COMPLETE':'درس‌های تکمیل‌شده','CURRENT STREAK':'پیوستگی فعلی','EXPERIENCE POINTS':'امتیاز تجربه','planned course hours':'ساعت برنامه‌ریزی‌شده دوره','Course progress':'پیشرفت دوره','Your tracked learning time against the 140-hour plan':'زمان مطالعه ثبت‌شده در مقایسه با برنامه ۱۴۰ ساعته','Course time target reached':'هدف زمانی دوره تکمیل شد','hours left in your plan':'ساعت تا پایان برنامه باقی مانده','Use the stopwatch or focus timer in the Study Room to record time. Mark a lesson complete when you can explain the concept and finish its practice tasks.':'برای ثبت زمان از کرنومتر یا تایمر تمرکز در اتاق مطالعه استفاده کن. وقتی بتوانی مفهوم را توضیح بدهی و تمرین‌های آن را کامل کنی، درس را تکمیل‌شده علامت بزن.','Weekly rhythm':'برنامه هفتگی','Choose a week to open its study plan':'برای دیدن برنامه مطالعه، یک هفته را انتخاب کن','Completed week':'هفته تکمیل‌شده','Upcoming week':'هفته پیش‌رو','Up next':'مرحله بعدی','Keep the sequence moving':'مسیر را ادامه بده','NEXT STEPS':'مراحل بعدی','Lesson time tracker':'ردیاب زمان درس‌ها','Planned study time compared with time you have logged for each module':'زمان مطالعه برنامه‌ریزی‌شده در مقایسه با زمان ثبت‌شده برای هر بخش','View full report ↗':'مشاهده گزارش کامل ↗','Today’s target: ':'هدف امروز: ',' hours':' ساعت',' hours left in this week’s 12-hour baseline. Keep one day lighter for review or catch-up.':' ساعت تا پایان برنامه پایه این هفته باقی مانده است. یک روز را برای مرور یا جبران سبک‌تر در نظر بگیر.',' priority':' · اولویت',' priority · ':' · اولویت · ',' logged of ':' ثبت‌شده از ',' logged':' ثبت‌شده',' to go':' باقی‌مانده',' days':' روز','12 weeks':'۱۲ هفته','~2 h / day · 6 days / week':'حدود ۲ ساعت در روز · ۶ روز در هفته','of ':'از ',
    'THE 12-WEEK PLAN':'برنامه ۱۲ هفته‌ای','A path, not a playlist.':'یک مسیر یادگیری، نه فهرستی بی‌پایان از ویدیوها.','Each week has a clear learning outcome, a realistic time budget and a checkpoint. The capstone runs in parallel from week 3 so your reporting skills grow alongside the technical work.':'هر هفته هدف یادگیری روشن، زمان‌بندی واقع‌بینانه و نقطه ارزیابی مشخص دارد. پروژه پایانی از هفته سوم هم‌زمان پیش می‌رود تا مهارت گزارش‌نویسی نیز همراه با مهارت فنی رشد کند.','Browse all lessons':'مرور همه درس‌ها','140 guided hours · 12 weeks · roughly 12 hours per week':'۱۴۰ ساعت آموزش هدایت‌شده · ۱۲ هفته · حدود ۱۲ ساعت در هفته','A practical baseline is 2 hours a day, 6 days a week. Some later weeks are heavier; split them across the week rather than cramming. Use the lighter day to review, rest or catch up.':'برنامه پایه، روزی ۲ ساعت در ۶ روز هفته است. بعضی هفته‌های پایانی سنگین‌ترند؛ زمان آن‌ها را در طول هفته تقسیم کن و همه را در یک روز فشرده نکن. روز سبک‌تر را برای مرور، استراحت یا جبران عقب‌ماندگی بگذار.','WEEK COMPLETED':'هفته تکمیل شد','CURRENT FOCUS':'تمرکز فعلی','UPCOMING STUDY BLOCK':'بخش مطالعاتی پیش‌رو','PLANNED':'برنامه‌ریزی‌شده','WEEKLY CHECKPOINT':'نقطه ارزیابی هفتگی','WEEKLY CHECKPOINT':'نقطه ارزیابی هفتگی','Lesson ↗':'مشاهده درس ↗','Week ':'هفته ','W':'هفته ',
    'CURRICULUM LIBRARY':'کتابخانه برنامه آموزشی','Fourteen skills. One coherent foundation.':'چهارده مهارت؛ یک پایه منسجم.','Every module includes what it teaches, why it matters, requirements, expected outcomes, a video pick and a direct lab route.':'هر بخش شامل محتوای آموزشی، اهمیت موضوع، پیش‌نیازها، نتیجه مورد انتظار، ویدیوی منتخب و مسیر مستقیم تمرین است.','Search topics, skills or categories…':'جست‌وجوی موضوع، مهارت یا دسته‌بندی…','Filter lessons':'فیلتر درس‌ها','All lessons':'همه درس‌ها','Not started':'شروع‌نشده','In progress':'در حال انجام','Completed':'تکمیل‌شده','Open lesson ↗':'باز کردن درس ↗','No modules match this search. Try another topic or reset the filter.':'هیچ بخشی با این جست‌وجو پیدا نشد. موضوع دیگری را جست‌وجو کن یا فیلتر را پاک کن.','MODULE ':'بخش ','MODULE':'بخش','PRIORITY':'اولویت','Critical':'بحرانی','High':'بالا','Specialist':'تخصصی','H PLANNED':'ساعت برنامه‌ریزی‌شده',' SHOWN / ':' نمایش‌داده‌شده از ',' TOTAL':' کل','Shown':'نمایش‌داده‌شده','Open lesson library':'باز کردن کتابخانه درس‌ها','Back to lessons':'بازگشت به درس‌ها','LESSON DETAILS':'جزئیات درس','WEEK ':'هفته ','VIDEO PICK':'ویدیوی منتخب','REFERENCE':'منبع مرجع','LEARNING RESOURCE':'منبع یادگیری','Watch video ↗':'تماشای ویدیو ↗','Next resource ↗':'منبع بعدی ↗','What this lesson teaches':'این درس چه چیزی آموزش می‌دهد','Why you should learn it':'چرا یادگیری این موضوع مهم است','What you should be able to do afterwards':'پس از پایان درس چه توانایی‌هایی خواهی داشت','Requirements before you start':'پیش‌نیازهای شروع','Practice deliverable':'خروجی تمرین','Your lesson notes':'یادداشت‌های درس','Capture discoveries, questions and the evidence you would include in a report.':'یافته‌ها، پرسش‌ها و شواهدی را که در گزارش می‌آوری ثبت کن.','What did you understand? What needs another pass?':'چه چیزی را یاد گرفتی؟ کدام بخش به مرور دوباره نیاز دارد؟','Notes save locally as you type.':'یادداشت‌ها هنگام نوشتن به‌صورت محلی ذخیره می‌شوند.','Open Study Room for this lesson ↗':'باز کردن اتاق مطالعه برای این درس ↗','Mark as not complete':'لغو تکمیل درس','Mark lesson complete ✓':'علامت‌گذاری درس به‌عنوان تکمیل‌شده ✓','COMPLETED':'تکمیل‌شده','Practice this lesson':'تمرین این درس','Direct links to guided environments':'پیوندهای مستقیم به محیط‌های آموزشی هدایت‌شده','OPEN ↗':'باز کردن ↗','LABS':'آزمایشگاه‌ها','Some platforms may require a free account or a subscription for selected rooms. Check the room’s current access terms.':'برخی پلتفرم‌ها برای اتاق‌های منتخب به حساب رایگان یا اشتراک نیاز دارند. شرایط دسترسی فعلی هر اتاق را بررسی کن.','Your time on this module':'زمان صرف‌شده برای این بخش','Time saved through the Study Room':'زمان ثبت‌شده از طریق اتاق مطالعه','TRACKED':'ثبت‌شده','of ':'از ','hours remaining in the suggested budget.':'ساعت از زمان پیشنهادی باقی مانده است.',
    'FOCUS TOOLS':'ابزارهای تمرکز','Make focused time visible.':'زمان تمرکزت را قابل مشاهده کن.','Use the stopwatch for flexible study blocks and the Pomodoro timer for repeatable focus cycles. Both can attach time to a lesson and update your course totals.':'از کرنومتر برای بازه‌های مطالعه دلخواه و از تایمر پومودورو برای چرخه‌های تمرکز استفاده کن. هر دو زمان را به یک درس اختصاص می‌دهند و مجموع دوره را به‌روزرسانی می‌کنند.','SESSION HISTORY ENABLED':'تاریخچه جلسه فعال است','Current lesson':'درس فعلی','Choose which module should receive your tracked focus time.':'انتخاب کن زمان تمرکز ثبت‌شده به کدام بخش اختصاص یابد.','TIME ATTRIBUTION':'اختصاص زمان','Current module: ':'بخش فعلی: ','Stopwatch':'کرنومتر','Flexible study tracking':'ثبت زمان مطالعه دلخواه','STOPWATCH':'کرنومتر','Start':'شروع','Pause':'مکث','Save session':'ذخیره جلسه','Reset':'بازنشانی','TIME LOGGED WHEN SAVED':'زمان مطالعه هنگام ذخیره ثبت می‌شود','ON THIS LESSON':'برای این درس','Pomodoro':'پومودورو','Focus, then take a real break':'تمرکز کن، سپس استراحت واقعی داشته باش','FOCUS CYCLE':'چرخه تمرکز','Focus':'تمرکز','Short break':'استراحت کوتاه','Long break':'استراحت طولانی','Start focus':'شروع تمرکز','Running':'در حال اجرا','Start next':'شروع چرخه بعدی','Resume':'ادامه','Stop & log':'توقف و ثبت','START EVENTS ARE SAVED':'دفعات شروع ذخیره می‌شوند','TOTAL STARTS':'مجموع دفعات شروع','min':'دقیقه','Apply':'اعمال','Pomodoro start history':'تاریخچه شروع پومودورو','Each Pomodoro start is recorded with its timestamp, planned duration and status.':'هر بار شروع پومودورو همراه با زمان، مدت برنامه‌ریزی‌شده و وضعیت آن ثبت می‌شود.','Clear history':'پاک کردن تاریخچه','STARTED':'شروع','MODE':'حالت','PLANNED':'برنامه‌ریزی‌شده','STATUS':'وضعیت','No Pomodoro sessions yet. Every first start is recorded here on this device.':'هنوز جلسه پومودورو ثبت نشده است. هر بار شروع، در همین دستگاه ثبت خواهد شد.','Recent study sessions':'جلسه‌های مطالعه اخیر','Sessions that have been saved into your course total.':'جلسه‌هایی که در مجموع زمان دوره ذخیره شده‌اند.','LOGS':'ثبت‌ها','Your course time is still at zero. Start the stopwatch or a focus Pomodoro, then save or complete it.':'زمان دوره هنوز صفر است. کرنومتر یا پومودوروی تمرکز را شروع کن و سپس آن را ذخیره یا تکمیل کن.','DATE':'تاریخ','SESSION':'جلسه','LESSON':'درس','DURATION':'مدت','RUNNING':'در حال اجرا','READY TO START':'آماده شروع','FOCUS SESSION':'جلسه تمرکز','SHORT BREAK':'استراحت کوتاه','LONG BREAK':'استراحت طولانی','PAUSED':'متوقف‌شده موقت','STOPPED':'متوقف‌شده',
    'YOUR LEARNING ANALYTICS':'گزارش تحلیلی یادگیری','Progress you can prove.':'پیشرفتی که می‌توانی نشان بدهی.','A private view of your course time, completed modules and daily activity. Export it when you want to keep a backup or review your learning.':'نمایی خصوصی از زمان دوره، بخش‌های تکمیل‌شده و فعالیت روزانه. هر زمان خواستی برای پشتیبان‌گیری یا مرور روند یادگیری آن را صادر کن.','Export CSV ↓':'دریافت فایل CSV ↓','Backup data ↓':'پشتیبان‌گیری از داده‌ها ↓','TOTAL STUDY TIME':'مجموع زمان مطالعه','remaining to course target':'تا رسیدن به هدف دوره باقی مانده','MODULE COMPLETION':'تکمیل بخش‌ها','marked complete':'علامت‌گذاری‌شده به‌عنوان تکمیل','POMODORO STARTS':'دفعات شروع پومودورو','Each start saved with a timestamp':'هر شروع همراه با زمان ثبت می‌شود','This week':'این هفته','Hours recorded by day':'ساعت‌های ثبت‌شده در هر روز','DAILY ACTIVITY':'فعالیت روزانه','Time by lesson':'زمان صرف‌شده برای هر درس','Top eight modules by tracked time':'هشت بخش برتر بر اساس زمان ثبت‌شده','EFFORT':'میزان تلاش','The baseline is about 12 hours per week. A steady rhythm is more useful than one exhausting catch-up day.':'برنامه پایه حدود ۱۲ ساعت در هفته است. ریتم منظم از یک روز جبرانیِ فرساینده مفیدتر است.','Use the module target as a guide, not a stopwatch test. Move on when you can explain the topic and complete the practice task.':'هدف زمانی هر بخش را راهنما در نظر بگیر، نه آزمونی با کرنومتر. وقتی بتوانی موضوع را توضیح بدهی و تمرین را کامل کنی، به مرحله بعد برو.','Milestones':'نقاط عطف','Small wins that reinforce consistent practice':'موفقیت‌های کوچک برای تقویت تمرین مستمر','UNLOCKED':'فعال‌شده','First focus block':'اولین بازه تمرکز','Complete your first saved session.':'اولین جلسه ذخیره‌شده‌ات را تکمیل کن.','Three-day rhythm':'پیوستگی سه‌روزه','Log study on three consecutive days.':'در سه روز پیاپی زمان مطالعه ثبت کن.','First lesson done':'اولین درس تکمیل‌شده','Mark a module as complete.':'یک بخش را تکمیل‌شده علامت بزن.','Notebook habit':'عادت یادداشت‌برداری','Write a lesson note longer than 20 characters.':'یادداشتی بیش از ۲۰ نویسه برای یک درس بنویس.','Ten focus hours':'ده ساعت تمرکز','Accumulate ten tracked study hours.':'مجموع زمان مطالعه ثبت‌شده را به ده ساعت برسان.','Halfway there':'رسیدن به نیمه مسیر','Complete seven modules.':'هفت بخش را تکمیل کن.','Module completion report':'گزارش تکمیل بخش‌ها','Mark a module complete only after you can explain it and finish its lab practice.':'فقط وقتی یک بخش را تکمیل‌شده علامت بزن که بتوانی آن را توضیح بدهی و تمرین آزمایشگاهی‌اش را تمام کنی.','Open':'باز','DONE':'تکمیل','IN PROGRESS':'در حال انجام',
    'HOW TO STUDY':'روش مطالعه','Consistency beats marathon sessions.':'پیوستگی از جلسات طولانی و فرسایشی بهتر است.','This path is designed for steady skill-building. Your goal is not to watch every minute of every video; it is to understand a concept, apply it in a safe lab and explain your evidence.':'این مسیر برای ساخت تدریجی مهارت طراحی شده است. هدف تماشای تمام دقایق ویدیوها نیست؛ هدف درک مفهوم، به‌کارگیری آن در آزمایشگاه امن و توضیح شواهد است.','Open study room ↗':'باز کردن اتاق مطالعه ↗','A realistic daily routine':'برنامه روزانه واقع‌بینانه','Recommended target:':'هدف پیشنهادی:','focused hours':'ساعت تمرکز','6 DAYS / WEEK':'۶ روز در هفته','MIN':'دقیقه','Recall yesterday':'مرور آموخته‌های دیروز','Close your notes and write what you remember. Then check what you missed.':'یادداشت‌ها را ببند و آنچه به خاطر داری بنویس. سپس موارد جاافتاده را بررسی کن.','Learn one concept':'یادگیری یک مفهوم','Use the short video or lesson text. Pause to sketch a diagram or define a term in your own words.':'از ویدیوی کوتاه یا متن درس استفاده کن. برای رسم نمودار یا تعریف اصطلاح با زبان خودت مکث کن.','Take a real break':'استراحت واقعی','Step away from the screen. A break helps the next practice block stay focused.':'از صفحه‌نمایش فاصله بگیر. استراحت کمک می‌کند بازه تمرین بعدی متمرکز بماند.','Apply it in a lab':'به‌کارگیری در آزمایشگاه','Use only the named training room. Record the steps you took, the result and what it means.':'فقط از اتاق آموزشی مشخص‌شده استفاده کن. مراحل انجام‌شده، نتیجه و معنای آن را ثبت کن.','Write a mini report':'نوشتن گزارش کوتاه','Explain what you learned, what remains unclear and how the issue could be prevented.':'آنچه یاد گرفتی، موارد نامشخص و راه پیشگیری از مشکل را توضیح بده.','Plan the next session':'برنامه‌ریزی جلسه بعد','Choose one small next action instead of opening ten tabs and losing your focus.':'به‌جای باز کردن ده زبانه و از دست دادن تمرکز، یک اقدام کوچک برای جلسه بعد انتخاب کن.','Set your daily study target (minutes)':'هدف روزانه مطالعه را تعیین کن (دقیقه)','Save daily target':'ذخیره هدف روزانه','A useful starting point is 90–120 minutes on six days per week. Reduce the target during exam weeks or busy periods; consistency matters more than a fixed number.':'نقطه شروع مناسب، ۹۰ تا ۱۲۰ دقیقه در شش روز هفته است. در هفته‌های امتحان یا دوره‌های شلوغ هدف را کاهش بده؛ پیوستگی از عدد ثابت مهم‌تر است.','How to get real results':'چطور به نتیجه واقعی برسی','Use an active learning loop':'از چرخه یادگیری فعال استفاده کن','Watch with a question':'با یک سؤال تماشا کن','Before pressing play, write one thing you need to understand. Stop when you can answer it.':'پیش از شروع ویدیو، یک موضوعی را که باید بفهمی بنویس. وقتی توانستی پاسخ بدهی، تماشا را متوقف کن.','Practice before you feel ready':'پیش از احساس آمادگی کامل تمرین کن','Try the lab after the explanation. Look up documentation when you are stuck; do not jump straight to a walkthrough.':'پس از توضیح، آزمایشگاه را امتحان کن. هنگام گیر کردن مستندات را بخوان و مستقیم سراغ راهنمای حل نرو.','Keep an evidence notebook':'دفترچه شواهد داشته باش','Record the target scope, observation, evidence, uncertainty and remediation—not just commands.':'محدوده هدف، مشاهده، شواهد، موارد نامطمئن و راهکار اصلاح را ثبت کن، نه فقط فرمان‌ها را.','Teach it back':'آن را با زبان خودت توضیح بده','Explain the concept in three sentences as if you were briefing a teammate. If you cannot, revisit the gap.':'مفهوم را در سه جمله، انگار برای هم‌تیمی‌ات توضیح می‌دهی، بیان کن. اگر نتوانستی، به بخش نامفهوم برگرد.','Review weekly':'هر هفته مرور کن','Spend one lighter session revisiting notes, completing unfinished labs and updating your report.':'یک جلسه سبک‌تر را به مرور یادداشت‌ها، تکمیل آزمایشگاه‌های ناتمام و به‌روزرسانی گزارش اختصاص بده.','Make learning less repetitive':'یادگیری را از یکنواختی خارج کن','Use small missions to keep momentum':'برای حفظ انگیزه از مأموریت‌های کوچک استفاده کن','SIDE QUESTS':'مأموریت‌های جانبی','Explain it simply':'ساده توضیح بده','Describe a protocol or vulnerability without using jargon.':'یک پروتکل یا آسیب‌پذیری را بدون اصطلاحات پیچیده توضیح بده.','Draw the flow':'مسیر را ترسیم کن','Sketch a login, network request or permission boundary.':'فرایند ورود، درخواست شبکه یا مرز دسترسی را رسم کن.','Fix, then retest':'اصلاح کن و دوباره بیازما','Turn one lab finding into a remediation checklist.':'یک یافته آزمایشگاهی را به چک‌لیست اصلاح تبدیل کن.','Professional boundaries are a core skill':'رعایت مرزهای حرفه‌ای یک مهارت اساسی است','Every practical exercise in this course should follow these rules':'تمام تمرین‌های عملی این دوره باید از این قواعد پیروی کنند','NON-NEGOTIABLE':'غیرقابل‌چشم‌پوشی','Only test systems that you own or that are explicitly provided for training, and follow the platform’s written scope. Never scan or access a real organization, person, account or public service without explicit written authorization. Do not collect real credentials or personal data. Stop if a lab behaves outside its stated scope. Ethical testing means minimizing impact and reporting clearly.':'فقط سامانه‌هایی را آزمایش کن که مالک آن‌ها هستی یا مشخصاً برای آموزش در اختیارت قرار گرفته‌اند و محدوده مکتوب پلتفرم را رعایت کن. بدون مجوز کتبی و صریح، سازمان، فرد، حساب یا سرویس عمومی واقعی را اسکن نکن و به آن دسترسی نگیر. اعتبارنامه یا داده شخصی واقعی جمع‌آوری نکن. اگر آزمایشگاه از محدوده اعلام‌شده خارج شد، متوقف شو. آزمون اخلاقی یعنی کاهش اثر و گزارش‌دهی روشن.',
    'Progress is stored in this browser.':'پیشرفت در همین مرورگر ذخیره می‌شود.','lessons completed':'درس تکمیل‌شده','DONE':'تکمیل','NOT STARTED':'شروع‌نشده','IN PROGRESS':'در حال انجام','RUNNING':'در حال اجرا','READY TO START':'آماده شروع','FOCUS SESSION':'جلسه تمرکز','SHORT BREAK':'استراحت کوتاه','LONG BREAK':'استراحت طولانی','PAUSED':'متوقف‌شده موقت','STOPPED':'متوقف‌شده',
    'Pause the active timer before switching lessons.':'پیش از تغییر درس، تایمر فعال را متوقف کن.','Pause the stopwatch before starting a Pomodoro.':'پیش از شروع پومودورو، کرنومتر را متوقف کن.','Pause the Pomodoro before starting the stopwatch.':'پیش از شروع کرنومتر، پومودورو را متوقف کن.','Stopwatch is already running.':'کرنومتر در حال اجراست.','Pause or stop the active timer before switching modes.':'پیش از تغییر حالت، تایمر فعال را مکث یا متوقف کن.','Pause the active timer before changing durations.':'پیش از تغییر مدت زمان، تایمر فعال را متوقف کن.','Pause the active timer before switching lessons.':'پیش از تغییر درس، تایمر فعال را متوقف کن.','Start the stopwatch before saving a session.':'پیش از ذخیره جلسه، کرنومتر را شروع کن.','Discard this unsaved stopwatch time?':'این زمان ذخیره‌نشده کرنومتر کنار گذاشته شود؟','Switching modes will stop the paused timer. Keep its elapsed time in history?':'تغییر حالت، تایمر مکث‌شده را متوقف می‌کند. زمان سپری‌شده آن در تاریخچه باقی بماند؟','Clear the Pomodoro start history? Your saved course time will remain.':'تاریخچه شروع پومودورو پاک شود؟ زمان ذخیره‌شده دوره باقی می‌ماند.','Reset all local Nightshift progress, notes, timers and history? This cannot be undone.':'تمام پیشرفت محلی، یادداشت‌ها، تایمرها و تاریخچه نایت‌شیفت بازنشانی شود؟ این کار قابل بازگشت نیست.','Local workspace reset.':'فضای کار محلی بازنشانی شد.','Progress backup exported.':'نسخه پشتیبان پیشرفت صادر شد.','Lesson progress exported.':'گزارش پیشرفت درس‌ها صادر شد.','Pomodoro history cleared.':'تاریخچه پومودورو پاک شد.','Pomodoro durations updated.':'مدت زمان‌های پومودورو به‌روزرسانی شد.','Daily target saved.':'هدف روزانه ذخیره شد.','Use focus 5–90, short break 1–30 and long break 5–60 minutes.':'برای تمرکز ۵ تا ۹۰، استراحت کوتاه ۱ تا ۳۰ و استراحت طولانی ۵ تا ۶۰ دقیقه وارد کن.','Set a daily target between 30 and 360 minutes.':'هدف روزانه را بین ۳۰ تا ۳۶۰ دقیقه تعیین کن.','Focus block complete. Take a short break.':'بازه تمرکز تمام شد. کمی استراحت کن.','Break complete. Ready for the next block?':'استراحت تمام شد. برای بازه بعدی آماده‌ای؟','Pomodoro stopped.':'پومودورو متوقف شد.',' saved from the Pomodoro timer.':' از تایمر پومودورو ذخیره شد.','Pause the stopwatch before starting a Pomodoro.':'پیش از شروع پومودورو، کرنومتر را متوقف کن.','Start the stopwatch before saving a session.':'پیش از ذخیره جلسه، کرنومتر را شروع کن.','Switching modes will stop the paused timer. Keep its elapsed time in history?':'تغییر حالت، تایمر مکث‌شده را متوقف می‌کند. زمان سپری‌شده آن در تاریخچه باقی بماند؟','Progress is stored in this browser. A lesson turns green as soon as you mark it complete in its lesson page.':'پیشرفت در همین مرورگر ذخیره می‌شود. به‌محض تکمیل هر درس در صفحه خودش، برگ مربوط به آن درخت سبز می‌شود.',
    'BUILT FOR CURIOUS MINDS · RUN SAFE · STAY SHARP':'برای ذهن‌های کنجکاو · ایمن تمرین کن · هوشیار بمان','YOUR DATA STAYS IN THIS BROWSER':'داده‌های تو در همین مرورگر می‌مانند','A 12-WEEK PLAN':'برنامه ۱۲ هفته‌ای',' percent course completion':' درصد تکمیل دوره','LESSONS LIBRARY':'کتابخانه درس‌ها','STUDY ROOM':'اتاق مطالعه','REPORTS & PROGRESS':'گزارش‌ها و پیشرفت','LEARNING GUIDE':'راهنمای یادگیری','OVERVIEW':'نمای کلی','SKILL TREE':'درخت مهارت','YOUR LEARNING PATH':'مسیر یادگیری تو','A living map of every lesson.':'نقشه‌ای زنده از تمام درس‌ها.','Each leaf is one lesson. Open it, study it and mark it complete—the tree updates automatically from your saved lesson progress.':'هر برگ نشان‌دهنده یک درس است. آن را باز کن، مطالعه کن و پس از پایان علامت تکمیل بزن؛ درخت به‌صورت خودکار بر اساس پیشرفت ذخیره‌شده به‌روزرسانی می‌شود.','Ethical security foundations':'پایه‌های امنیت اخلاقی','lessons completed':'درس تکمیل‌شده','NIGHTSHIFT · SKILL TREE':'نایت‌شیفت · درخت مهارت','A path, not a playlist.':'یک مسیر یادگیری، نه فهرستی بی‌پایان از ویدیوها.'
  };
  const UI_FINAL_FA = {
    '12 WEEKS':'۱۲ هفته','Short':'کوتاه','Long':'طولانی','METHOD':'روش',' remaining':' باقی‌مانده',' modules':' بخش‌ها','learning modules':'بخش‌های آموزشی','Study activity logged on consecutive days':'فعالیت مطالعه در روزهای پیاپی ثبت شده است','Earned through focus time, notes and completions':'از زمان تمرکز، یادداشت‌ها و تکمیل درس‌ها به دست آمده است','of the learning modules':'از بخش‌های آموزشی','h planned':'ساعت برنامه‌ریزی‌شده','WEEK COMPLETED':'هفته تکمیل شد',
    'Lesson marked complete.':'درس به‌عنوان تکمیل‌شده ثبت شد.','Completion status updated.':'وضعیت تکمیل به‌روزرسانی شد.','started':'شروع‌شده','running':'در حال اجرا','paused':'متوقف‌شده موقت','completed':'تکمیل‌شده','stopped':'متوقف‌شده','Pomodoro focus':'تمرکز پومودورو','Pomodoro focus (stopped)':'تمرکز پومودورو (متوقف‌شده)','Stopwatch':'کرنومتر','Stopwatch is already running.':'کرنومتر در حال اجراست.',' saved to ':' برای درس ','No Pomodoro sessions yet.':'هنوز جلسه پومودورو ثبت نشده است.',
    'WEEK ':'هفته ','Week ':'هفته ','DATE':'تاریخ','SESSION':'جلسه','LESSON':'درس','DURATION':'مدت','OF ':'از ','of ':'از ','PRIORITY':'اولویت','Critical priority':'اولویت بحرانی','High priority':'اولویت بالا','Specialist priority':'اولویت تخصصی',
    'COMPLETION STATUS':'وضعیت تکمیل','A private view of your course time, completed modules and daily activity. Export it when you want to keep a backup or review your learning.':'نمایی خصوصی از زمان دوره، بخش‌های تکمیل‌شده و فعالیت روزانه. هر زمان خواستی برای پشتیبان‌گیری یا مرور روند یادگیری آن را صادر کن.',
    'The baseline is about 12 hours per week. A steady rhythm is more useful than one exhausting catch-up day.':'برنامه پایه حدود ۱۲ ساعت در هفته است. ریتم منظم از یک روز جبرانیِ فرساینده مفیدتر است.','Based on days with saved study time':'بر اساس روزهایی که زمان مطالعه در آن‌ها ذخیره شده است','Each start saved with a timestamp':'هر بار شروع همراه با زمان ثبت می‌شود','remaining to course target':'تا رسیدن به هدف دوره باقی مانده','marked complete':'علامت‌گذاری‌شده به‌عنوان تکمیل',
    'First focus block':'اولین بازه تمرکز','Complete your first saved session.':'اولین جلسه ذخیره‌شده‌ات را تکمیل کن.','Three-day rhythm':'پیوستگی سه‌روزه','Log study on three consecutive days.':'در سه روز پیاپی زمان مطالعه ثبت کن.','First lesson done':'اولین درس تکمیل‌شده','Mark a module as complete.':'یک بخش را تکمیل‌شده علامت بزن.','Notebook habit':'عادت یادداشت‌برداری','Write a lesson note longer than 20 characters.':'یادداشتی بیش از ۲۰ نویسه برای یک درس بنویس.','Ten focus hours':'ده ساعت تمرکز','Accumulate ten tracked study hours.':'مجموع زمان مطالعه ثبت‌شده را به ده ساعت برسان.','Halfway there':'رسیدن به نیمه مسیر','Complete seven modules.':'هفت بخش را تکمیل کن.',
    'Reset all local Nightshift progress, notes, timers and history? This cannot be undone.':'تمام پیشرفت محلی، یادداشت‌ها، تایمرها و تاریخچه نایت‌شیفت بازنشانی شود؟ این کار قابل بازگشت نیست.',
    'Progress backup exported.':'نسخه پشتیبان پیشرفت صادر شد.','Lesson progress exported.':'گزارش پیشرفت درس‌ها صادر شد.','Local workspace reset.':'فضای کار محلی بازنشانی شد.','Pomodoro history cleared.':'تاریخچه پومودورو پاک شد.','Pomodoro durations updated.':'مدت زمان‌های پومودورو به‌روزرسانی شد.','Daily target saved.':'هدف روزانه ذخیره شد.'
  };
  Object.assign(UI_FA, { 'Ethical security path':'مسیر امنیت اخلاقی', 'Choose language':'انتخاب زبان', 'Running':'در حال اجرا', 'Ready to start':'آماده شروع', 'Focus session':'جلسه تمرکز', 'Start next cycle':'شروع چرخه بعدی', 'Resume':'ادامه', 'Paused':'متوقف‌شده', 'Stopped':'متوقف‌شده', 'Module':'بخش', 'Priority':'اولویت', 'Planned hours':'ساعت برنامه‌ریزی‌شده', 'Logged hours':'ساعت ثبت‌شده', 'Status':'وضعیت', 'Notes':'یادداشت' });
  const UI_TRANSLATIONS = { ...UI_FA, ...UI_EXTRA_FA, ...UI_FINAL_FA };

  Object.assign(UI_TRANSLATIONS, {
    'Today’s target: ':'هدف امروز: ',
    ' hours left in this week’s 12-hour baseline. Keep one day lighter for review or catch-up.':' ساعت تا پایان برنامه پایه ۱۲ ساعته این هفته باقی مانده است. یک روز را برای مرور یا جبران سبک‌تر نگه دار.',
    ' logged of ':' ثبت‌شده از ',
    ' logged':' ثبت‌شده',
    ' SHOWN / ':' نمایش‌داده‌شده از ',
    ' TOTAL':' کل',
    'FOCUS SESSION · READY':'جلسه تمرکز · آماده شروع',
    'SUPPLEMENTARY RESOURCE':'منبع تکمیلی',
    'PRIMARY VIDEO':'ویدیوی اصلی',
    'SECOND VIDEO':'ویدیوی دوم',
    'Open resource ↗':'باز کردن منبع ↗',
    'Lesson checklist':'چک‌لیست درس',
    'Tick each item as you complete it. Progress is saved on this device.':'پس از انجام هر مورد، آن را علامت بزن. پیشرفت در همین دستگاه ذخیره می‌شود.',
    'completed':'تکمیل‌شده',
    'Checklist':'چک‌لیست',
    'Checklist progress':'پیشرفت چک‌لیست',
    'Today’s target: ':'هدف امروز: ',
    ' hours left in this week’s 12-hour baseline. Keep one day lighter for review or catch-up.':' ساعت تا پایان برنامه پایه ۱۲ ساعته این هفته باقی مانده است. یک روز را برای مرور یا جبران سبک‌تر نگه دار.',
    ' logged of ':' ثبت‌شده از ',
    ' logged':' ثبت‌شده',
    ' SHOWN / ':' نمایش‌داده‌شده از ',
    ' TOTAL':' کل',
    'FOCUS SESSION · READY':'جلسه تمرکز · آماده شروع',
    'Module completion report':'گزارش تکمیل بخش‌ها',
    'Mark a module complete only after you can explain it and finish its lab practice.':'فقط زمانی یک بخش را تکمیل‌شده علامت بزن که بتوانی آن را توضیح بدهی و تمرین آزمایشگاهی‌اش را به پایان برسانی.',
    'hours planned':'ساعت برنامه‌ریزی‌شده',
    'SIDE QUESTS':'تمرین‌های جانبی',
    'FOCUS CYCLE':'چرخه تمرکز',
    'START EVENTS ARE SAVED':'دفعات شروع ذخیره می‌شوند',
    'TOTAL STARTS':'مجموع دفعات شروع',
    'No Pomodoro sessions yet. Every first start is recorded here on this device.':'هنوز جلسه پومودورو ثبت نشده است. هر شروع در همین دستگاه ثبت می‌شود.',
    'Some platforms may require a free account or a subscription for selected rooms. Check the room’s current access terms.':'برخی پلتفرم‌ها برای اتاق‌های منتخب به حساب رایگان یا اشتراک نیاز دارند. شرایط دسترسی فعلی هر اتاق را بررسی کن.'
  });

  const UI_EN = Object.fromEntries(Object.entries(UI_TRANSLATIONS).map(([en, fa]) => [fa, en]));
  const faDigitMap = '۰۱۲۳۴۵۶۷۸۹';
  function toFaDigits(value) { return currentLanguage === 'fa' ? String(value).replace(/[0-9]/g, digit => faDigitMap[Number(digit)]) : String(value); }
  function translateFaText(value) {
    let text = String(value ?? '');
    if (currentLanguage !== 'fa') return text;
    // Replace compact English hour notation such as 12h with a Persian unit.
    text = text.replace(/(\d(?:[\d,.]*))h\b/g, '$1 ساعت');
    const entries = Object.entries(UI_TRANSLATIONS).sort((a, b) => b[0].length - a[0].length);
    for (const [english, persian] of entries) {
      if (!english || english.length < 2) continue;
      const escaped = english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`(?<![A-Za-z0-9])${escaped}(?![A-Za-z0-9])`, 'g');
      text = text.replace(pattern, persian);
    }
    return toFaDigits(text);
  }
  const TREE_BRANCHES = [
    {title:'Core foundations',fa:'پایه‌های اصلی',subtitle:'Operating systems, networking and scripting',faSubtitle:'سیستم‌عامل، شبکه و اسکریپت‌نویسی',ids:['linux-windows','networking','python']},
    {title:'Research & awareness',fa:'پژوهش و آگاهی',subtitle:'OSINT, privacy and human factors',faSubtitle:'OSINT، حریم خصوصی و عوامل انسانی',ids:['osint-opsec','social-engineering']},
    {title:'Application security',fa:'امنیت برنامه‌ها',subtitle:'Web applications and APIs',faSubtitle:'برنامه‌های وب و APIها',ids:['web-security','api-security']},
    {title:'Assessment & validation',fa:'ارزیابی و اعتبارسنجی',subtitle:'Findings, evidence and safe validation',faSubtitle:'یافته‌ها، شواهد و اعتبارسنجی ایمن',ids:['vulnerability-assessment','exploitation']},
    {title:'Systems & specialist topics',fa:'سیستم‌ها و موضوعات تخصصی',subtitle:'Permissions, AI, reverse engineering and cryptography',faSubtitle:'مجوزها، هوش مصنوعی، مهندسی معکوس و رمزنگاری',ids:['privilege-escalation','ai-security','reverse-engineering','cryptography']},
    {title:'Capstone',fa:'پروژه پایانی',subtitle:'Scope, assess, report and retest',faSubtitle:'تعیین محدوده، ارزیابی، گزارش و بازآزمایی',ids:['pentest-labs']}
  ];
  const tr = (english, persian) => currentLanguage === 'fa' ? persian : english;
  const activeLessons = () => currentLanguage === 'fa' ? LESSONS : ENGLISH_LESSONS;
  const activeWeeks = () => currentLanguage === 'fa' ? WEEKS : ENGLISH_WEEKS;
  const englishLesson = (item) => ENGLISH_LESSONS.find(source => source.id === item.id) || item;
  const lessonTitle = (item) => englishLesson(item).title;
  const lessonTitleHtml = (item) => `<span class="english-title" data-keep-en dir="ltr">${esc(lessonTitle(item))}</span>`;
  const weekTitle = (week) => (ENGLISH_WEEKS.find(source => source.week === week.week) || week).theme;

  function applySiteLanguage() {
    const isFa = currentLanguage === 'fa';
    document.documentElement.lang = isFa ? 'fa' : 'en';
    document.documentElement.dir = isFa ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl-site', isFa);
    document.body.classList.toggle('ltr-site', !isFa);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.nodeValue.trim()) continue;
      if (node.parentElement?.closest('[data-keep-en]')) continue;
      if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue);
      const original = originalTextNodes.get(node);
      node.nodeValue = isFa ? translateFaText(original) : original;
    }
    const attrs = ['placeholder', 'aria-label', 'title'];
    attrs.forEach(attr => $$(`[${attr}]`).forEach(el => {
      let stored = originalAttributes.get(el);
      if (!stored) { stored = {}; originalAttributes.set(el, stored); }
      if (!(attr in stored)) stored[attr] = el.getAttribute(attr);
      const original = stored[attr];
      if (original !== null) el.setAttribute(attr, isFa ? translateFaText(original) : original);
    }));
    document.title = 'NIGHTSHIFT — Ethical Security Roadmap';
    const today = $('#todayLabel');
    if (today) today.textContent = new Intl.DateTimeFormat(isFa ? 'fa-IR' : 'en-US',{weekday:'short',month:'short',day:'numeric'}).format(new Date());
    const description = $('meta[name="description"]');
    if (description) description.content = isFa ? 'نقشه راه فارسی و کاربردی یادگیری امنیت سایبری اخلاقی همراه با برنامه ۱۲ هفته‌ای، آزمایشگاه‌ها و پیگیری پیشرفت.' : 'A practical ethical cybersecurity learning roadmap with a 12-week plan, labs and progress tracking.';
    $$('[data-language]').forEach(button => {
      const selected = button.dataset.language === currentLanguage;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }


  const defaultState = () => ({
    completed: [], notes: {}, lessonSeconds: {}, checklists: {}, studySessions: [], pomodoroHistory: [],
    pomodoro: null,
    stopwatch: { elapsedSeconds: 0, running: false, startedAt: null, lessonId: 'linux-windows' },
    settings: { focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15, dailyGoalMinutes: 120 }
  });
  let state = loadState();
  let currentPage = 'home';
  let selectedLesson = 'linux-windows';
  let lessonQuery = '';
  let lessonFilter = 'all';
  let timerInterval = null;
  let toastTimer = null;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (!saved || typeof saved !== 'object') return defaultState();
      const base = defaultState();
      return {
        ...base, ...saved,
        completed: Array.isArray(saved.completed) ? saved.completed : [],
        notes: saved.notes && typeof saved.notes === 'object' ? saved.notes : {},
        checklists: saved.checklists && typeof saved.checklists === 'object' && !Array.isArray(saved.checklists) ? saved.checklists : {},
        lessonSeconds: saved.lessonSeconds && typeof saved.lessonSeconds === 'object' ? saved.lessonSeconds : {},
        studySessions: Array.isArray(saved.studySessions) ? saved.studySessions : [],
        pomodoroHistory: Array.isArray(saved.pomodoroHistory) ? saved.pomodoroHistory : [],
        settings: { ...base.settings, ...(saved.settings || {}) },
        stopwatch: { ...base.stopwatch, ...(saved.stopwatch || {}) }
      };
    } catch (error) {
      console.warn('Nightshift local data could not be read; starting a fresh workspace.', error);
      return defaultState();
    }
  }
  function persist() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch (error) { console.warn('Progress could not be saved in this browser.', error); }
  }
  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function safeUrl(url) {
    try { const parsed = new URL(url, window.location.href); return ['https:','http:'].includes(parsed.protocol) ? parsed.href : '#'; }
    catch { return '#'; }
  }
  function lesson(id) { return activeLessons().find(item => item.id === id) || activeLessons()[0]; }
  function isComplete(id) { return state.completed.includes(id); }
  function hoursFromSeconds(seconds) { return (Math.max(0, seconds || 0) / 3600); }
  function fmtHours(seconds) { const value = toFaDigits(hoursFromSeconds(seconds).toFixed(1)); return currentLanguage === 'fa' ? `${value} ساعت` : `${value} h`; }
  function fmtClock(seconds) {
    seconds = Math.max(0, Math.floor(seconds || 0));
    const h = Math.floor(seconds / 3600); const m = Math.floor((seconds % 3600) / 60); const s = seconds % 60;
    return toFaDigits(h > 0 ? `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
  }
  function fmtCountdown(seconds) {
    seconds = Math.max(0, Math.floor(seconds || 0));
    return toFaDigits(`${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(seconds % 60).padStart(2,'0')}`);
  }
  function fmtDate(timestamp, includeTime = false) {
    if (!timestamp) return '—';
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return '—';
    const options = includeTime ? { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' } : { month:'short', day:'numeric' };
    return new Intl.DateTimeFormat(currentLanguage === 'fa' ? 'fa-IR' : 'en-US', options).format(date);
  }
  function totalLoggedSeconds() { return state.studySessions.reduce((sum, item) => sum + (item.seconds || 0), 0); }
  function getStopwatchSeconds() {
    const timer = state.stopwatch;
    if (!timer.running || !timer.startedAt) return timer.elapsedSeconds || 0;
    return (timer.elapsedSeconds || 0) + Math.max(0, Math.floor((Date.now() - timer.startedAt) / 1000));
  }
  function getPomodoroRemaining() {
    const timer = state.pomodoro;
    if (!timer) return 0;
    if (!timer.running || !timer.lastStartedAt) return Math.max(0, timer.remainingSeconds || 0);
    return Math.max(0, (timer.remainingSeconds || 0) - Math.floor((Date.now() - timer.lastStartedAt) / 1000));
  }
  function getPomodoroElapsed() {
    const timer = state.pomodoro;
    if (!timer) return 0;
    const liveElapsed = timer.running && timer.lastStartedAt ? Math.max(0, Math.floor((Date.now() - timer.lastStartedAt) / 1000)) : 0;
    return Math.max(0, timer.elapsedSeconds || 0) + liveElapsed;
  }
  function showToast(message) {
    const toast = $('#toast'); if (!toast) return;
    toast.textContent = translateFaText(message); toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }
  function priorityClass(priority) {
    if (priority === 'Critical') return 'critical';
    if (priority === 'High') return 'high';
    return 'specialist';
  }
  function lessonStatusLabel(item) {
    if (isComplete(item.id)) return 'Completed';
    const seconds = state.lessonSeconds[item.id] || 0;
    return seconds > 0 ? 'In progress' : 'Not started';
  }
  function nextLesson() { return activeLessons().find(item => !isComplete(item.id)) || activeLessons()[0]; }
  function streakDays() {
    const days = new Set(state.studySessions.filter(s => s.seconds > 0).map(s => new Date(s.timestamp).toDateString()));
    let count = 0; const cursor = new Date(); cursor.setHours(0,0,0,0);
    if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
    while (days.has(cursor.toDateString())) { count++; cursor.setDate(cursor.getDate() - 1); }
    return count;
  }
  function xpPoints() {
    const completedXp = state.completed.length * 100;
    const studyXp = Math.floor(totalLoggedSeconds() / 1500) * 10;
    const noteXp = Object.values(state.notes).filter(v => String(v).trim().length > 20).length * 15;
    return completedXp + studyXp + noteXp;
  }
  function weeklyHours() {
    const now = new Date(); const start = new Date(now); start.setHours(0,0,0,0); start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    return Array.from({length: 7}, (_, i) => {
      const day = new Date(start); day.setDate(start.getDate() + i);
      const key = day.toDateString();
      const seconds = state.studySessions.filter(s => new Date(s.timestamp).toDateString() === key).reduce((sum,s) => sum + s.seconds, 0);
      return { label: (currentLanguage === 'fa' ? ['د','س','چ','پ','ج','ش','ی'] : ['M','T','W','T','F','S','S'])[i], seconds };
    });
  }
  function setPage(page) {
    currentPage = page;
    if (page !== 'lesson-detail') selectedLesson = selectedLesson || nextLesson().id;
    render();
    $$('.nav-link').forEach(button => button.classList.toggle('active', button.dataset.page === (page === 'lesson-detail' ? 'lessons' : page)));
    const crumb = ({home:'OVERVIEW',roadmap:'12-WEEK ROADMAP',tree:'SKILL TREE',lessons:'LESSONS LIBRARY','lesson-detail':'LESSON DETAILS',study:'STUDY ROOM',reports:'REPORTS & PROGRESS',guide:'LEARNING GUIDE'})[page] || 'OVERVIEW';
    $('#currentCrumb').textContent = crumb;
    applySiteLanguage();
    $('#sidebar').classList.remove('open');
    window.scrollTo({top:0, behavior:'smooth'});
  }
  function render() {
    const root = $('#pageContent');
    const renderers = {home:renderHome, roadmap:renderRoadmap, tree:renderTree, lessons:renderLessons, 'lesson-detail':renderLessonDetail, study:renderStudy, reports:renderReports, guide:renderGuide};
    root.innerHTML = (renderers[currentPage] || renderHome)();
    applySiteLanguage();
    root.classList.remove('reveal'); void root.offsetWidth; root.classList.add('reveal');
    bindPageControls(); observeScrollItems(); updateLiveTimers();
  }
  function observeScrollItems() {
    const nodes = $$('.lesson-card, .week-card, .report-card, .milestone, .advice-item');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach(node => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    nodes.forEach(node => { node.classList.add('scroll-reveal'); observer.observe(node); });
  }
  function renderPageHead(eyebrow, title, description, action = '') {
    return `<div class="page-head"><div><div class="eyebrow">${esc(eyebrow)}</div><h1>${title}</h1><p>${description}</p></div>${action ? `<div class="head-actions">${action}</div>` : ''}</div>`;
  }
  function ring(percent) {
    const r = 48, circumference = 2 * Math.PI * r, offset = circumference - circumference * Math.max(0, Math.min(100, percent)) / 100;
    return `<div class="ring-wrap"><svg viewBox="0 0 110 110" aria-label="${Math.round(percent)} percent course completion"><circle class="ring-bg" cx="55" cy="55" r="${r}"/><circle class="ring-fill" cx="55" cy="55" r="${r}" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/></svg><div class="ring-center"><strong>${Math.round(percent)}%</strong><small>COMPLETED</small></div></div>`;
  }
  function renderHome() {
    const loggedSeconds = totalLoggedSeconds();
    const loggedHours = hoursFromSeconds(loggedSeconds);
    const percent = Math.min(100, loggedHours / COURSE_HOURS * 100);
    const done = state.completed.length;
    const next = nextLesson();
    const weekDone = Math.max(0, Math.floor(done / activeLessons().length * 12));
    const dueHours = Math.max(0, COURSE_HOURS - loggedHours);
    const weekTarget = 12;
    const remainingWeek = Math.max(0, weekTarget - weeklyHours().reduce((s,d) => s+d.seconds,0)/3600);
    const perLesson = activeLessons().map(item => {
      const secs = state.lessonSeconds[item.id] || 0;
      return `<div class="week-module"><div class="week-module-main"><strong>${lessonTitleHtml(item)}</strong><p>${esc(item.priority)} priority · ${fmtHours(secs)} logged of ${item.hours}h planned</p><div class="lesson-progress"><span style="width:${Math.min(100, hoursFromSeconds(secs)/item.hours*100)}%"></span></div></div><div class="week-module-hours">${fmtHours(secs)} / ${item.hours}h</div></div>`;
    }).join('');
    const nextThree = activeLessons().filter(item => !isComplete(item.id)).slice(0,3);
    return `${`<section class="hero reveal"><div class="hero-content"><div class="eyebrow">A 12-WEEK PRACTICE-LED CURRICULUM</div><h1>Build skills that <span>protect systems.</span></h1><p>A structured route from operating-system fundamentals to authorized security assessments. Learn the why, practice in dedicated labs, and keep evidence of what you can do.</p><div class="hero-actions"><button class="btn primary" data-action="open-next">Continue learning <span>↗</span></button><button class="btn ghost" data-nav="roadmap">Explore the roadmap</button></div></div><div class="hero-aside"><div class="label">TOTAL COURSE TIME</div><div class="hero-hours"><strong>140</strong><span>GUIDED HOURS</span></div><div class="mini-track"><span style="width:${percent}%"></span></div><div class="hero-foot"><span>${fmtHours(loggedSeconds)} logged</span><span>${fmtHours(Math.max(0, COURSE_HOURS*3600-loggedSeconds))} to go</span></div><div class="divider"></div><div class="hero-foot"><span>12 weeks</span><span>~2 h / day · 6 days / week</span></div></div></section>`}
      <section class="stat-grid">
        <article class="card stat-card"><div class="stat-top"><span class="stat-label">TIME INVESTED</span><span class="stat-symbol">◷</span></div><div class="stat-value">${fmtHours(loggedSeconds)}</div><div class="stat-sub">of ${COURSE_HOURS} planned course hours</div></article>
        <article class="card stat-card"><div class="stat-top"><span class="stat-label">LESSONS COMPLETE</span><span class="stat-symbol">✓</span></div><div class="stat-value">${done}<span class="muted" style="font-size:14px"> / ${activeLessons().length}</span></div><div class="stat-sub">${Math.round(done/activeLessons().length*100)}% of the learning modules</div></article>
        <article class="card stat-card"><div class="stat-top"><span class="stat-label">CURRENT STREAK</span><span class="stat-symbol">✳</span></div><div class="stat-value">${streakDays()}<span class="muted" style="font-size:14px"> days</span></div><div class="stat-sub">Study activity logged on consecutive days</div></article>
        <article class="card stat-card"><div class="stat-top"><span class="stat-label">EXPERIENCE POINTS</span><span class="stat-symbol">⌁</span></div><div class="stat-value">${xpPoints().toLocaleString()}</div><div class="stat-sub">Earned through focus time, notes and completions</div></article>
      </section>
      <section class="dashboard-grid">
        <article class="card card-pad"><div class="panel-head"><div><h2>Course progress</h2><p>Your tracked learning time against the 140-hour plan</p></div><span class="pill">ON DEVICE</span></div><div class="progress-shell">${ring(percent)}<div class="progress-copy"><h3>${loggedHours >= COURSE_HOURS ? 'Course time target reached' : `${dueHours.toFixed(1)} hours left in your plan`}</h3><p>Use the stopwatch or focus timer in the Study Room to record time. Mark a lesson complete when you can explain the concept and finish its practice tasks.</p><div class="inline-stats"><span><b>${fmtHours(loggedSeconds)}</b> logged</span><span><b>${fmtHours(Math.max(0, COURSE_HOURS*3600-loggedSeconds))}</b> remaining</span><span><b>${done}/${activeLessons().length}</b> modules</span></div></div></div><div class="divider"></div><div class="panel-head"><div><h3>Weekly rhythm</h3><p>Choose a week to open its study plan</p></div><span class="tiny muted mono">12 WEEKS</span></div><div class="week-strip">${activeWeeks().map(w => `<button class="week-cell ${isWeekDone(w.week)?'done':''} ${!isWeekDone(w.week)&&w.week===firstActiveWeek()?'current':''}" data-week="${w.week}" title="Week ${w.week}: ${esc(weekTitle(w))}">${String(w.week).padStart(2,'0')}</button>`).join('')}</div><div class="week-legend"><span><i class="legend-dot"></i>Completed week</span><span><i class="legend-dot pending"></i>Upcoming week</span></div></article>
        <article class="card card-pad"><div class="panel-head"><div><h2>Up next</h2><p>Keep the sequence moving</p></div><span class="pill">NEXT STEPS</span></div><div class="next-list">${nextThree.map((item,i)=>`<div class="next-row"><span class="next-num">${item.number}</span><div class="next-info"><strong>${lessonTitleHtml(item)}</strong><small>${item.hours}h planned · ${esc(item.priority)} priority</small></div><span class="priority-dot ${priorityClass(item.priority)}"></span></div>`).join('')}</div><div class="divider"></div><div class="callout"><span class="callout-icon">✳</span><div><strong>Today’s target: ${Math.round(state.settings.dailyGoalMinutes/60*10)/10} hours</strong><p>${remainingWeek.toFixed(1)} hours left in this week’s 12-hour baseline. Keep one day lighter for review or catch-up.</p></div></div><div style="margin-top:14px"><button class="btn primary" data-action="open-next">Open ${lessonTitle(next)} <span>↗</span></button></div></article>
      </section>
      <section class="card card-pad"><div class="panel-head"><div><h2>Lesson time tracker</h2><p>Planned study time compared with time you have logged for each module</p></div><button class="btn ghost small" data-nav="reports">View full report ↗</button></div><div class="resource-list">${perLesson}</div></section>`;
  }
  function isWeekDone(weekNo) {
    const week = activeWeeks().find(w => w.week === weekNo); if (!week) return false;
    return week.modules.every(module => isComplete(module.id));
  }
  function firstActiveWeek() {
    const week = activeWeeks().find(w => !w.modules.every(m => isComplete(m.id)));
    return week ? week.week : 12;
  }
  function renderRoadmap() {
    const cards = activeWeeks().map(week => {
      const complete = week.modules.every(m => isComplete(m.id));
      const current = !complete && week.week === firstActiveWeek();
      return `<article class="card week-card"><div class="week-top"><div class="week-no">${tr('WEEK','هفته')} ${toFaDigits(String(week.week).padStart(2,'0'))}</div><div class="week-title"><h3><span class="english-title" data-keep-en dir="ltr">${esc(weekTitle(week))}</span></h3><p>${complete ? '<span class="complete-banner">✓ WEEK COMPLETED</span>' : current ? '<span class="green">CURRENT FOCUS</span>' : 'UPCOMING STUDY BLOCK'}</p></div><div class="week-meta"><strong>${week.hours}h</strong>PLANNED</div></div><div class="week-detail">${week.modules.map(m=>{const item=lesson(m.id);return `<div class="week-module"><div class="week-module-main"><strong>${lessonTitleHtml(item)} <span class="muted">· ${m.hours}h</span></strong><p>${esc(m.task)}</p></div><button class="btn ghost small" data-open-lesson="${item.id}">Lesson ↗</button></div>`}).join('')}<div class="checkpoint"><b>WEEKLY CHECKPOINT</b> · ${esc(week.checkpoint)}</div></div></article>`;
    }).join('');
    return `${renderPageHead('THE 12-WEEK PLAN','A path, not a playlist.','Each week has a clear learning outcome, a realistic time budget and a checkpoint. The capstone runs in parallel from week 3 so your reporting skills grow alongside the technical work.', '<button class="btn ghost" data-nav="lessons">Browse all lessons</button>')}<div class="callout" style="margin-bottom:15px"><span class="callout-icon">◷</span><div><strong>140 guided hours · 12 weeks · roughly 12 hours per week</strong><p>A practical baseline is 2 hours a day, 6 days a week. Some later weeks are heavier; split them across the week rather than cramming. Use the lighter day to review, rest or catch up.</p></div></div><div class="roadmap-list">${cards}</div>`;
  }
  function renderTree() {
    const completed = state.completed.filter(id => activeLessons().some(item => item.id === id)).length;
    const percent = Math.round(completed / activeLessons().length * 100);
    const branches = TREE_BRANCHES.map((branch, index) => {
      const branchLessons = branch.ids.map(id => lesson(id));
      const branchDone = branch.ids.filter(isComplete).length;
      const leaves = branchLessons.map(item => {
        const done = isComplete(item.id);
        const started = !done && (state.lessonSeconds[item.id] || 0) > 0;
        const status = done ? tr('Completed','تکمیل‌شده') : started ? tr('In progress','در حال انجام') : tr('Not started','شروع‌نشده');
        return `<button class="tree-leaf ${done ? 'is-done' : started ? 'is-started' : ''}" data-open-lesson="${item.id}" aria-label="${esc(lessonTitle(item))} — ${status}">
          <span class="tree-leaf-check" aria-hidden="true">${done ? '✓' : started ? '◐' : '○'}</span>
          <span class="tree-leaf-copy"><strong>${item.number} · ${lessonTitleHtml(item)}</strong><small>${status} <i>·</i> ${item.hours}h</small></span>
          <span class="tree-leaf-arrow" aria-hidden="true">↗</span>
        </button>`;
      }).join('');
      return `<section class="tree-branch ${branchDone === branch.ids.length ? 'branch-done' : ''}">
        <div class="tree-branch-head"><span class="tree-branch-index">${String(index + 1).padStart(2,'0')}</span><div class="tree-branch-title"><h3><span class="english-title" data-keep-en dir="ltr">${esc(branch.title)}</span></h3><p>${tr(branch.subtitle, branch.faSubtitle)}</p></div><div class="tree-branch-progress"><strong>${branchDone}/${branch.ids.length}</strong><small>${tr('DONE','تکمیل')}</small></div></div>
        <div class="tree-leaves">${leaves}</div>
      </section>`;
    }).join('');
    return `${renderPageHead(tr('YOUR LEARNING PATH','مسیر یادگیری شما'), tr('A living map of every lesson.','نقشه‌ای زنده از تمام درس‌ها.'), tr('Each leaf is one lesson. Open it, study it and mark it complete—the tree updates automatically from your saved lesson progress.','هر برگ یک درس است. آن را باز کن، مطالعه کن و پس از پایان علامت تکمیل بزن؛ وضعیت درخت به‌صورت خودکار از پیشرفت ذخیره‌شده به‌روزرسانی می‌شود.'), `<button class="btn ghost" data-nav="lessons">${tr('Open lesson library','باز کردن کتابخانه درس‌ها')}</button>`)}
      <div class="tree-summary card"><div class="tree-summary-mark">✳</div><div class="tree-summary-copy"><small>${tr('NIGHTSHIFT · SKILL TREE','نایت‌شیفت · درخت مهارت')}</small><strong><span class="english-title" data-keep-en dir="ltr">Ethical security foundations</span></strong><span>${completed} / ${activeLessons().length} ${tr('lessons completed','درس تکمیل‌شده')}</span></div><div class="tree-summary-meter"><strong>${percent}%</strong><div class="mini-track"><span style="width:${percent}%"></span></div></div></div>
      <div class="tree-trunk"><div class="tree-trunk-line"></div><div class="tree-branches">${branches}</div></div>
      <p class="tree-footnote">${tr('Progress is stored in this browser. A lesson turns green as soon as you mark it complete in its lesson page.','پیشرفت در همین مرورگر ذخیره می‌شود. به‌محض اینکه یک درس را در صفحه خودش تکمیل‌شده علامت بزنی، برگ آن درخت سبز می‌شود.')}</p>`;
  }

  function renderLessons() {
    const visible = activeLessons().filter(item => {
      const q = lessonQuery.toLowerCase();
      const match = !q || `${lessonTitle(item)} ${item.short} ${item.category} ${item.summary}`.toLowerCase().includes(q);
      const status = lessonFilter === 'all' || (lessonFilter === 'complete' && isComplete(item.id)) || (lessonFilter === 'in-progress' && !isComplete(item.id) && (state.lessonSeconds[item.id]||0)>0) || (lessonFilter === 'not-started' && !isComplete(item.id) && (state.lessonSeconds[item.id]||0)===0);
      return match && status;
    });
    const cards = visible.map(item => {
      const secs = state.lessonSeconds[item.id] || 0;
      const status = lessonStatusLabel(item);
      const percent = Math.min(100, hoursFromSeconds(secs)/item.hours*100);
      return `<article class="card lesson-card"><div class="lesson-card-top"><span class="lesson-number">MODULE ${item.number}</span><span class="priority-tag ${priorityClass(item.priority)}">${esc(item.priority)} PRIORITY</span></div><h3>${lessonTitleHtml(item)}</h3><p class="lesson-short">${esc(item.short)}</p><div class="lesson-card-bottom"><span class="lesson-hours">${item.hours}H PLANNED</span><span class="lesson-status ${isComplete(item.id)?'green':''}">${status}</span></div><div class="lesson-progress"><span style="width:${percent}%"></span></div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px"><span class="tiny muted">${fmtHours(secs)} logged</span><button class="btn ghost small" data-open-lesson="${item.id}">Open lesson ↗</button></div></article>`;
    }).join('');
    return `${renderPageHead('CURRICULUM LIBRARY','Fourteen skills. One coherent foundation.','Every module includes what it teaches, why it matters, requirements, expected outcomes, a video pick and a direct lab route.', '<span class="pill">14 MODULES</span>')}<div class="filters"><label class="search-wrap"><span>⌕</span><input id="lessonSearch" type="search" placeholder="Search topics, skills or categories…" value="${esc(lessonQuery)}" /></label><select class="filter-select" id="lessonFilter" aria-label="Filter lessons"><option value="all" ${lessonFilter==='all'?'selected':''}>All lessons</option><option value="not-started" ${lessonFilter==='not-started'?'selected':''}>Not started</option><option value="in-progress" ${lessonFilter==='in-progress'?'selected':''}>In progress</option><option value="complete" ${lessonFilter==='complete'?'selected':''}>Completed</option></select><span class="tiny muted mono">${visible.length} SHOWN / ${activeLessons().length} TOTAL</span></div><div class="lesson-grid">${cards || '<div class="empty-state" style="grid-column:1/-1">No modules match this search. Try another topic or reset the filter.</div>'}</div>`;
  }
  function renderResource(item, englishItem = item) {
    const officialName = englishItem?.name || item?.name || (Array.isArray(item) ? item[0] : 'Learning resource');
    const officialProvider = englishItem?.provider || item?.provider || '';
    const url = englishItem?.url || item?.url;
    const time = item?.time || (Array.isArray(item) ? item[1] : englishItem?.time) || '';
    const note = item?.note || (Array.isArray(item) ? item[2] : englishItem?.note) || '';
    return `<div class="resource-item"><div class="resource-item-top"><div><strong data-keep-en dir="ltr">${esc(officialName)}</strong><small><span data-keep-en dir="ltr">${esc(officialProvider)}</span>${officialProvider ? ' · ' : ''}${esc(time)}</small></div><a class="resource-link" href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">OPEN ↗</a></div><p>${esc(note)}</p></div>`;
  }
  function renderVideoCard(localVideo, englishVideo, index = 0) {
    if (!englishVideo) return '';
    const isReference = englishVideo.kind === 'reference';
    const kicker = isReference ? tr('SUPPLEMENTARY RESOURCE', 'منبع تکمیلی') : (index === 0 ? tr('PRIMARY VIDEO', 'ویدیوی اصلی') : tr('SECOND VIDEO', 'ویدیوی دوم'));
    const action = isReference ? tr('Open resource ↗', 'باز کردن منبع ↗') : tr('Watch video ↗', 'تماشای ویدیو ↗');
    const duration = localVideo?.duration || englishVideo.duration || '';
    const signal = localVideo?.signal || englishVideo.signal || '';
    const note = localVideo?.note || englishVideo.note || '';
    const url = safeUrl(englishVideo.url);
    return `<article class="card video-card"><div class="card-kicker">${kicker} · ${tr('LEARNING RESOURCE','منبع یادگیری')}</div><h3><span data-keep-en dir="ltr">${esc(englishVideo.title)}</span></h3><div class="video-meta"><span data-keep-en dir="ltr">${esc(englishVideo.creator || '')}</span>${duration ? `<span>·</span><span>${esc(duration)}</span>` : ''}${signal ? `<span>·</span><span>${esc(signal)}</span>` : ''}</div><p>${esc(note)}</p><div class="video-actions"><a class="btn ${index === 0 ? 'primary' : 'ghost'} small" href="${url}" target="_blank" rel="noopener noreferrer">${action}</a></div></article>`;
  }
  function checklistData(id) {
    const record = LESSON_CHECKLISTS?.[id];
    const items = record?.[currentLanguage] || record?.en || [];
    const checked = Array.isArray(state.checklists?.[id]) ? state.checklists[id] : [];
    return { items, checked, done: items.reduce((total, _, i) => total + (checked[i] === true ? 1 : 0), 0) };
  }
  function renderLessonChecklist(item) {
    const { items, checked, done } = checklistData(item.id);
    if (!items.length) return '';
    const percent = Math.round(done / items.length * 100);
    const count = `${toFaDigits(done)} / ${toFaDigits(items.length)} ${tr('completed', 'تکمیل‌شده')}`;
    return `<div class="detail-section lesson-checklist"><div class="checklist-header"><div><h3>${tr('Lesson checklist','چک‌لیست درس')}</h3><p>${tr('Tick each item as you complete it. Progress is saved on this device.','پس از انجام هر مورد، آن را علامت بزن. پیشرفت در همین دستگاه ذخیره می‌شود.')}</p></div><strong class="checklist-count" data-checklist-count="${item.id}">${count}</strong></div><div class="checklist-progress" data-checklist-progress="${item.id}"><span style="width:${percent}%"></span></div><div class="checklist-list">${items.map((label, index) => `<label class="checklist-row ${checked[index] === true ? 'done' : ''}"><input type="checkbox" data-checklist-lesson="${item.id}" data-checklist-index="${index}" ${checked[index] === true ? 'checked' : ''}><span>${esc(label)}</span></label>`).join('')}</div></div>`;
  }
  function renderLessonDetail() {
    const item = lesson(selectedLesson);
    const seconds = state.lessonSeconds[item.id] || 0;
    const complete = isComplete(item.id);
    const sourceLesson = englishLesson(item);
    return `<div class="lesson-detail-top"><button class="back-link" data-nav="lessons">← Back to lessons</button><span class="muted">/</span><span class="tiny mono muted">MODULE ${item.number}</span></div><div class="detail-grid"><section class="detail-main"><div class="eyebrow">${esc(item.category)} · ${esc(item.level)}</div><h1>${lessonTitleHtml(item)}</h1><p class="lead">${esc(item.summary)}</p><div class="detail-badges"><span class="priority-tag ${priorityClass(item.priority)}">${esc(item.priority)} PRIORITY</span><span class="pill">${item.hours}H PLANNED</span><span class="pill">WEEK ${item.weeks.join(' / ')}</span>${complete?'<span class="status-tag complete">COMPLETED</span>':''}</div>
      <div class="detail-section"><h3>What this lesson teaches</h3><p>${esc(item.teaches)}</p></div>
      <div class="detail-section"><h3>Why you should learn it</h3><p>${esc(item.why)}</p></div>
      <div class="detail-section"><h3>What you should be able to do afterwards</h3><p>${esc(item.outcome)}</p></div>
      <div class="detail-section"><h3>Requirements before you start</h3><ul>${item.requirements.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="detail-section"><h3>Practice deliverable</h3><div class="deliverable">${esc(item.deliverable)}</div></div>
      ${renderLessonChecklist(item)}
      <div class="detail-section"><h3>Your lesson notes</h3><p style="margin-bottom:9px">Capture discoveries, questions and the evidence you would include in a report.</p><textarea class="notes-area" id="lessonNotes" data-note-id="${item.id}" placeholder="What did you understand? What needs another pass?">${esc(state.notes[item.id] || '')}</textarea><div class="tiny muted" style="margin-top:6px">Notes save locally as you type.</div></div>
      <div class="lesson-actions"><button class="btn primary" data-start-for-lesson="${item.id}">Open Study Room for this lesson ↗</button><button class="btn ${complete?'ghost':'primary'}" data-toggle-complete="${item.id}">${complete?'Mark as not complete':'Mark lesson complete ✓'}</button></div>
    </section><aside class="side-sticky">
      ${renderVideoCard(item.video, sourceLesson.video, 0)}
      ${item.extraVideo && sourceLesson.extraVideo ? renderVideoCard(item.extraVideo, sourceLesson.extraVideo, 1) : ''}
      <article class="card card-pad"><div class="panel-head"><div><h3>Practice this lesson</h3><p>Direct links to guided environments</p></div><span class="pill">LABS</span></div><div class="resource-list">${item.practice.map((resource,index)=>renderResource(resource, englishLesson(item).practice[index])).join('')}</div><div class="subtle-rule" style="margin-top:11px">Some platforms may require a free account or a subscription for selected rooms. Check the room’s current access terms.</div></article>
      <article class="card card-pad"><div class="panel-head"><div><h3>Your time on this module</h3><p>Time saved through the Study Room</p></div><span class="pill">TRACKED</span></div><div class="report-metric"><strong>${fmtHours(seconds)}</strong><span>of ${item.hours}h planned</span></div><div class="mini-track"><span style="width:${Math.min(100,hoursFromSeconds(seconds)/item.hours*100)}%"></span></div><div class="tiny muted">${Math.max(0,item.hours-hoursFromSeconds(seconds)).toFixed(1)} hours remaining in the suggested budget.</div></article>
    </aside></div>`;
  }
  function selectedLessonOptions() {
    return activeLessons().map(item => `<option value="${item.id}" ${item.id===selectedLesson?'selected':''}>${item.number} · ${lessonTitle(item)}</option>`).join('');
  }
  function renderStudy() {
    const sw = getStopwatchSeconds();
    const p = state.pomodoro;
    const activeMode = p ? p.mode : 'focus';
    const modeNames = {focus:'FOCUS SESSION',short:'SHORT BREAK',long:'LONG BREAK'};
    const timerHistory = state.pomodoroHistory.slice().reverse().slice(0,12);
    const historyHtml = timerHistory.length ? `<table class="history-table"><thead><tr><th>STARTED</th><th>MODE</th><th>PLANNED</th><th>STATUS</th></tr></thead><tbody>${timerHistory.map(h=>`<tr><td>${fmtDate(h.startedAt,true)}</td><td>${esc((h.mode||'focus').toUpperCase())}</td><td>${fmtClock(h.plannedSeconds)}</td><td><span class="history-status ${h.status==='completed'?'completed':h.status==='stopped'?'stopped':''}">${esc(h.status||'started')}</span></td></tr>`).join('')}</tbody></table>` : '<div class="history-empty">No Pomodoro sessions yet. Every first start is recorded here on this device.</div>';
    return `${renderPageHead('FOCUS TOOLS','Make focused time visible.','Use the stopwatch for flexible study blocks and the Pomodoro timer for repeatable focus cycles. Both can attach time to a lesson and update your course totals.', '<span class="pill">SESSION HISTORY ENABLED</span>')}<div class="card card-pad" style="margin-bottom:14px"><div class="panel-head"><div><h3>Current lesson</h3><p>Choose which module should receive your tracked focus time.</p></div><span class="tiny mono muted">TIME ATTRIBUTION</span></div><select class="filter-select" id="studyLessonSelect" style="width:min(100%,520px)">${selectedLessonOptions()}</select><span class="tiny muted" style="display:block;margin-top:8px">Current module: ${lessonTitle(lesson(selectedLesson))} · ${lesson(selectedLesson).hours}h planned</span></div>
      <div class="study-grid">
        <article class="card timer-card"><div class="timer-top"><div class="timer-title"><span class="timer-icon">◷</span><div><h2>Stopwatch</h2><small>Flexible study tracking</small></div></div><span class="pill">STOPWATCH</span></div><div class="timer-display" id="stopwatchDisplay">${fmtClock(sw)}</div><div class="timer-sub" id="stopwatchState">${state.stopwatch.running?'RUNNING':'READY TO START'}</div><div class="timer-controls"><button class="btn primary" id="swStart" ${state.stopwatch.running?'disabled':''}>Start</button><button class="btn ghost" id="swPause" ${!state.stopwatch.running?'disabled':''}>Pause</button><button class="btn ghost" id="swSave" ${sw<1?'disabled':''}>Save session</button><button class="btn danger" id="swReset" ${sw<1?'disabled':''}>Reset</button></div><div class="timer-foot"><span>TIME LOGGED WHEN SAVED</span><span>${fmtHours(state.lessonSeconds[selectedLesson]||0)} ON THIS LESSON</span></div></article>
        <article class="card timer-card"><div class="timer-top"><div class="timer-title"><span class="timer-icon">✳</span><div><h2>Pomodoro</h2><small>Focus, then take a real break</small></div></div><span class="pill">FOCUS CYCLE</span></div><div class="timer-display" id="pomodoroDisplay">${fmtCountdown(p?getPomodoroRemaining():state.settings.focusMinutes*60)}</div><div class="timer-sub" id="pomodoroState">${p&&p.running?modeNames[p.mode]+' · RUNNING':p&&!p.running?modeNames[p.mode]+' · PAUSED':'FOCUS SESSION · READY'}</div><div class="timer-controls"><button class="btn ghost small mode-button" data-pom-mode="focus">Focus</button><button class="btn ghost small mode-button" data-pom-mode="short">Short break</button><button class="btn ghost small mode-button" data-pom-mode="long">Long break</button></div><div class="timer-controls"><button class="btn primary" id="pomStart">${p&&p.running?'Running':p&&!p.running?'Resume':'Start focus'}</button><button class="btn ghost" id="pomPause" ${!p||!p.running?'disabled':''}>Pause</button><button class="btn danger" id="pomStop" ${!p?'disabled':''}>Stop & log</button></div><div class="timer-foot"><span>START EVENTS ARE SAVED</span><span>${state.pomodoroHistory.length} TOTAL STARTS</span></div><div class="divider"></div><div class="timer-settings"><label>Focus <input type="number" min="5" max="90" id="focusMinutes" value="${state.settings.focusMinutes}" /> min</label><label>Short <input type="number" min="1" max="30" id="shortMinutes" value="${state.settings.shortBreakMinutes}" /> min</label><label>Long <input type="number" min="5" max="60" id="longMinutes" value="${state.settings.longBreakMinutes}" /> min</label><button class="btn ghost small" id="savePomSettings">Apply</button></div></article>
      </div>
      <section class="card card-pad timer-history"><div class="panel-head"><div><h3>Pomodoro start history</h3><p>Each Pomodoro start is recorded with its timestamp, planned duration and status.</p></div><button class="btn ghost small" id="clearPomHistory">Clear history</button></div>${historyHtml}</section>
      <section class="card card-pad timer-history"><div class="panel-head"><div><h3>Recent study sessions</h3><p>Sessions that have been saved into your course total.</p></div><span class="pill">${state.studySessions.length} LOGS</span></div>${renderSessionHistory()}</section>`;
  }
  function renderSessionHistory() {
    const sessions = state.studySessions.slice().reverse().slice(0,10);
    if (!sessions.length) return '<div class="history-empty">Your course time is still at zero. Start the stopwatch or a focus Pomodoro, then save or complete it.</div>';
    return `<table class="history-table"><thead><tr><th>DATE</th><th>SESSION</th><th>LESSON</th><th>DURATION</th></tr></thead><tbody>${sessions.map(s=>`<tr><td>${fmtDate(s.timestamp,true)}</td><td>${esc(s.type)}</td><td>${lessonTitle(lesson(s.lessonId))}</td><td>${fmtClock(s.seconds)}</td></tr>`).join('')}</tbody></table>`;
  }
  function renderReports() {
    const total = totalLoggedSeconds(); const totalHours = hoursFromSeconds(total);
    const complete = state.completed.length; const pct = Math.round(complete/activeLessons().length*100);
    const week = weeklyHours(); const max = Math.max(1,...week.map(d=>d.seconds));
    const weekBars = week.map(d=>`<div class="bar-row"><label>${d.label}</label><div class="bar-track"><span style="width:${Math.min(100,d.seconds/max*100)}%"></span></div><b>${(d.seconds/3600).toFixed(1)}h</b></div>`).join('');
    const lessonBars = activeLessons().map(item=>({item,secs:state.lessonSeconds[item.id]||0})).sort((a,b)=>b.secs-a.secs).slice(0,8).map(x=>`<div class="bar-row"><label title="${esc(lessonTitle(x.item))}">${x.item.number}</label><div class="bar-track"><span style="width:${Math.min(100,hoursFromSeconds(x.secs)/x.item.hours*100)}%"></span></div><b>${fmtHours(x.secs)}</b></div>`).join('');
    const achievements = [
      {icon:'◷',name:'First focus block',desc:'Complete your first saved session.',ok:state.studySessions.length>0},
      {icon:'✳',name:'Three-day rhythm',desc:'Log study on three consecutive days.',ok:streakDays()>=3},
      {icon:'▤',name:'First lesson done',desc:'Mark a module as complete.',ok:complete>=1},
      {icon:'⌁',name:'Notebook habit',desc:'Write a lesson note longer than 20 characters.',ok:Object.values(state.notes).some(v=>String(v).trim().length>20)},
      {icon:'◆',name:'Ten focus hours',desc:'Accumulate ten tracked study hours.',ok:totalHours>=10},
      {icon:'⬡',name:'Halfway there',desc:'Complete seven modules.',ok:complete>=7}
    ];
    return `${renderPageHead('YOUR LEARNING ANALYTICS','Progress you can prove.','A private view of your course time, completed modules and daily activity. Export it when you want to keep a backup or review your learning.', '<button class="btn ghost" id="exportCsv">Export CSV ↓</button><button class="btn primary" id="exportJson">Backup data ↓</button>')}<div class="stat-grid"><article class="card stat-card"><div class="stat-label">TOTAL STUDY TIME</div><div class="stat-value">${fmtHours(total)}</div><div class="stat-sub">${fmtHours(Math.max(0,COURSE_HOURS*3600-total))} remaining to course target</div></article><article class="card stat-card"><div class="stat-label">MODULE COMPLETION</div><div class="stat-value">${pct}%</div><div class="stat-sub">${complete} of ${activeLessons().length} marked complete</div></article><article class="card stat-card"><div class="stat-label">POMODORO STARTS</div><div class="stat-value">${state.pomodoroHistory.length}</div><div class="stat-sub">Each start saved with a timestamp</div></article><article class="card stat-card"><div class="stat-label">CURRENT STREAK</div><div class="stat-value">${streakDays()} days</div><div class="stat-sub">Based on days with saved study time</div></article></div>
      <div class="report-grid"><article class="card report-card"><div class="panel-head"><div><h3>This week</h3><p>Hours recorded by day</p></div><span class="pill">DAILY ACTIVITY</span></div><div class="bar-chart">${weekBars}</div><div class="report-footnote">The baseline is about 12 hours per week. A steady rhythm is more useful than one exhausting catch-up day.</div></article><article class="card report-card"><div class="panel-head"><div><h3>Time by lesson</h3><p>Top eight modules by tracked time</p></div><span class="pill">EFFORT</span></div><div class="bar-chart">${lessonBars}</div><div class="report-footnote">Use the module target as a guide, not a stopwatch test. Move on when you can explain the topic and complete the practice task.</div></article></div>
      <section class="card card-pad" style="margin-top:14px"><div class="panel-head"><div><h3>Milestones</h3><p>Small wins that reinforce consistent practice</p></div><span class="pill">${achievements.filter(a=>a.ok).length} / ${achievements.length} UNLOCKED</span></div><div class="achievement-grid">${achievements.map(a=>`<div class="achievement ${a.ok?'unlocked':''}"><span class="badge-icon">${a.icon}</span><strong>${esc(a.name)} ${a.ok?'✓':''}</strong><small>${esc(a.desc)}</small></div>`).join('')}</div></section>
      <section class="card card-pad" style="margin-top:14px"><div class="panel-head"><div><h3>Module completion report</h3><p>Mark a module complete only after you can explain it and finish its lab practice.</p></div></div><div class="resource-list">${activeLessons().map(item=>`<div class="week-module"><div class="week-module-main"><strong>${lessonTitleHtml(item)}</strong><p>${isComplete(item.id)?'Completed':'Open'} · ${fmtHours(state.lessonSeconds[item.id]||0)} logged of ${item.hours}h planned</p></div><span class="${isComplete(item.id)?'complete-banner':'tiny muted'}">${isComplete(item.id)?'✓ DONE':'IN PROGRESS'}</span></div>`).join('')}</div></section>`;
  }
  function renderGuide() {
    const dailyHours = state.settings.dailyGoalMinutes / 60;
    return `${renderPageHead('HOW TO STUDY','Consistency beats marathon sessions.','This path is designed for steady skill-building. Your goal is not to watch every minute of every video; it is to understand a concept, apply it in a safe lab and explain your evidence.', '<button class="btn ghost" data-nav="study">Open study room ↗</button>')}<div class="guide-grid"><article class="card card-pad"><div class="panel-head"><div><h3>A realistic daily routine</h3><p>Recommended target: ${dailyHours.toFixed(1)} focused hours</p></div><span class="pill">6 DAYS / WEEK</span></div><div class="routine"><div class="routine-step"><div class="routine-time">10 MIN</div><div><strong>Recall yesterday</strong><p>Close your notes and write what you remember. Then check what you missed.</p></div></div><div class="routine-step"><div class="routine-time">35 MIN</div><div><strong>Learn one concept</strong><p>Use the short video or lesson text. Pause to sketch a diagram or define a term in your own words.</p></div></div><div class="routine-step"><div class="routine-time">10 MIN</div><div><strong>Take a real break</strong><p>Step away from the screen. A break helps the next practice block stay focused.</p></div></div><div class="routine-step"><div class="routine-time">45 MIN</div><div><strong>Apply it in a lab</strong><p>Use only the named training room. Record the steps you took, the result and what it means.</p></div></div><div class="routine-step"><div class="routine-time">15 MIN</div><div><strong>Write a mini report</strong><p>Explain what you learned, what remains unclear and how the issue could be prevented.</p></div></div><div class="routine-step"><div class="routine-time">5 MIN</div><div><strong>Plan the next session</strong><p>Choose one small next action instead of opening ten tabs and losing your focus.</p></div></div></div><div class="divider"></div><label class="tiny muted" for="dailyGoal">Set your daily study target (minutes)</label><div style="display:flex;gap:8px;align-items:center;margin-top:8px"><input class="filter-select" type="number" id="dailyGoal" min="30" max="360" step="15" value="${state.settings.dailyGoalMinutes}" style="width:110px"/><button class="btn primary small" id="saveDailyGoal">Save daily target</button></div><div class="subtle-rule" style="margin-top:8px">A useful starting point is 90–120 minutes on six days per week. Reduce the target during exam weeks or busy periods; consistency matters more than a fixed number.</div></article>
      <div style="display:grid;gap:14px"><article class="card card-pad"><div class="panel-head"><div><h3>How to get real results</h3><p>Use an active learning loop</p></div><span class="pill">METHOD</span></div><div class="advice-list"><div class="advice-item"><span class="advice-no">01</span><div><strong>Watch with a question</strong><p>Before pressing play, write one thing you need to understand. Stop when you can answer it.</p></div></div><div class="advice-item"><span class="advice-no">02</span><div><strong>Practice before you feel ready</strong><p>Try the lab after the explanation. Look up documentation when you are stuck; do not jump straight to a walkthrough.</p></div></div><div class="advice-item"><span class="advice-no">03</span><div><strong>Keep an evidence notebook</strong><p>Record the target scope, observation, evidence, uncertainty and remediation—not just commands.</p></div></div><div class="advice-item"><span class="advice-no">04</span><div><strong>Teach it back</strong><p>Explain the concept in three sentences as if you were briefing a teammate. If you cannot, revisit the gap.</p></div></div><div class="advice-item"><span class="advice-no">05</span><div><strong>Review weekly</strong><p>Spend one lighter session revisiting notes, completing unfinished labs and updating your report.</p></div></div></div></article>
      <article class="card card-pad"><div class="panel-head"><div><h3>Make learning less repetitive</h3><p>Use small missions to keep momentum</p></div><span class="pill">SIDE QUESTS</span></div><div class="milestone-grid"><div class="milestone"><strong>Explain it simply</strong><p>Describe a protocol or vulnerability without using jargon.</p></div><div class="milestone"><strong>Draw the flow</strong><p>Sketch a login, network request or permission boundary.</p></div><div class="milestone"><strong>Fix, then retest</strong><p>Turn one lab finding into a remediation checklist.</p></div></div></article></div></div>
      <article class="card card-pad" style="margin-top:14px"><div class="panel-head"><div><h3>Professional boundaries are a core skill</h3><p>Every practical exercise in this course should follow these rules</p></div><span class="pill">NON-NEGOTIABLE</span></div><div class="safety-note">Only test systems that you own or that are explicitly provided for training, and follow the platform’s written scope. Never scan or access a real organization, person, account or public service without explicit written authorization. Do not collect real credentials or personal data. Stop if a lab behaves outside its stated scope. Ethical testing means minimizing impact and reporting clearly.</div></article>`;
  }
  function bindPageControls() {
    $$('.nav-link').forEach(btn => btn.addEventListener('click', () => setPage(btn.dataset.page)));
    $$('[data-nav]').forEach(btn => btn.addEventListener('click', () => setPage(btn.dataset.nav)));
    $$('[data-open-lesson]').forEach(btn => btn.addEventListener('click', () => { selectedLesson = btn.dataset.openLesson; setPage('lesson-detail'); }));
    $$('[data-action="open-next"]').forEach(btn => btn.addEventListener('click', () => { selectedLesson = nextLesson().id; setPage('lesson-detail'); }));
    $$('[data-week]').forEach(btn => btn.addEventListener('click', () => { setPage('roadmap'); const target = $$('.week-card')[Number(btn.dataset.week)-1]; if (target) {target.scrollIntoView({behavior:'smooth',block:'center'}); target.style.borderColor='#65d98f'; setTimeout(()=>target.style.borderColor='',1500);} }));
    const search = $('#lessonSearch'); if (search) search.addEventListener('input', () => { lessonQuery=search.value; const pos=search.selectionStart; render(); const field=$('#lessonSearch'); field.focus(); field.setSelectionRange(pos,pos); });
    const filter = $('#lessonFilter'); if (filter) filter.addEventListener('change', () => { lessonFilter=filter.value; render(); });
    const notes = $('#lessonNotes'); if (notes) notes.addEventListener('input', () => {state.notes[notes.dataset.noteId]=notes.value;persist();});
    $$('[data-checklist-lesson]').forEach(input => input.addEventListener('change', () => {
      const id = input.dataset.checklistLesson;
      const index = Number(input.dataset.checklistIndex);
      if (!Array.isArray(state.checklists[id])) state.checklists[id] = [];
      state.checklists[id][index] = input.checked;
      persist();
      const record = checklistData(id);
      const label = `${toFaDigits(record.done)} / ${toFaDigits(record.items.length)} ${tr('completed', 'تکمیل‌شده')}`;
      const count = $(`[data-checklist-count="${id}"]`);
      const bar = $(`[data-checklist-progress="${id}"] span`);
      if (count) count.textContent = label;
      if (bar) bar.style.width = `${Math.round(record.done / Math.max(1, record.items.length) * 100)}%`;
      input.closest('.checklist-row')?.classList.toggle('done', input.checked);
    }));
    $$('[data-toggle-complete]').forEach(btn => btn.addEventListener('click', () => {
      const id=btn.dataset.toggleComplete;
      if (isComplete(id)) state.completed=state.completed.filter(x=>x!==id); else state.completed.push(id);
      persist(); render(); showToast(isComplete(id)?'Lesson marked complete.':'Completion status updated.');
    }));
    $$('[data-start-for-lesson]').forEach(btn => btn.addEventListener('click', () => {selectedLesson=btn.dataset.startForLesson; state.stopwatch.lessonId=selectedLesson; persist(); if(state.stopwatch.running){showToast('Stopwatch is already running.');setPage('study');return;} setPage('study');}));
    bindStudyControls(); bindReportControls(); bindGuideControls();
  }
  function bindStudyControls() {
    const select = $('#studyLessonSelect');
    if (select) select.addEventListener('change', () => {if(state.stopwatch.running || (state.pomodoro && state.pomodoro.running)){showToast('Pause the active timer before switching lessons.');render();return;} selectedLesson=select.value;state.stopwatch.lessonId=select.value;persist();render();});
    const start = $('#swStart'); if (start) start.addEventListener('click', () => { if (state.pomodoro && state.pomodoro.running) {showToast('Pause the Pomodoro before starting the stopwatch.'); return;} if (!state.stopwatch.running) {state.stopwatch.running=true;state.stopwatch.startedAt=Date.now();state.stopwatch.lessonId=selectedLesson;persist();updateLiveTimers();} });
    const pause = $('#swPause'); if (pause) pause.addEventListener('click', () => { if(state.stopwatch.running){state.stopwatch.elapsedSeconds=getStopwatchSeconds();state.stopwatch.running=false;state.stopwatch.startedAt=null;persist();updateLiveTimers();} });
    const save = $('#swSave'); if (save) save.addEventListener('click', saveStopwatchSession);
    const reset = $('#swReset'); if (reset) reset.addEventListener('click', () => {if(getStopwatchSeconds()>0&&!window.confirm(translateFaText('Discard this unsaved stopwatch time?')))return;state.stopwatch={elapsedSeconds:0,running:false,startedAt:null,lessonId:selectedLesson};persist();updateLiveTimers();});
    $$('[data-pom-mode]').forEach(btn => btn.addEventListener('click', () => setPomodoroMode(btn.dataset.pomMode)));
    const pomStart=$('#pomStart'); if(pomStart) pomStart.addEventListener('click', startPomodoro);
    const pomPause=$('#pomPause'); if(pomPause) pomPause.addEventListener('click', pausePomodoro);
    const pomStop=$('#pomStop'); if(pomStop) pomStop.addEventListener('click', stopPomodoro);
    const saveSettings=$('#savePomSettings'); if(saveSettings) saveSettings.addEventListener('click', savePomodoroSettings);
    const clear=$('#clearPomHistory'); if(clear) clear.addEventListener('click', () => {if(window.confirm(translateFaText('Clear the Pomodoro start history? Your saved course time will remain.'))){state.pomodoroHistory=[];persist();render();showToast('Pomodoro history cleared.');}});
  }
  function saveStopwatchSession() {
    const seconds=getStopwatchSeconds();
    if(seconds<1){showToast('Start the stopwatch before saving a session.');return;}
    const id=state.stopwatch.lessonId||selectedLesson;
    addStudySession({type:'Stopwatch',seconds,lessonId:id,timestamp:Date.now()});
    state.stopwatch={elapsedSeconds:0,running:false,startedAt:null,lessonId:id};persist();render();showToast(`${fmtClock(seconds)} saved to ${lessonTitle(lesson(id))}.`);
  }
  function addStudySession(session) {
    state.studySessions.push({...session,seconds:Math.max(0,Math.floor(session.seconds||0))});
    state.lessonSeconds[session.lessonId]=(state.lessonSeconds[session.lessonId]||0)+Math.max(0,Math.floor(session.seconds||0));
    if(state.studySessions.length>600) state.studySessions=state.studySessions.slice(-600);
    persist();
  }
  function setPomodoroMode(mode) {
    if(!['focus','short','long'].includes(mode))return;
    if(state.pomodoro&&state.pomodoro.running){showToast('Pause or stop the active timer before switching modes.');return;}
    if(state.pomodoro&&state.pomodoro.historyId&&state.pomodoro.status!=='completed'&&state.pomodoro.status!=='stopped'){
      if(!window.confirm(translateFaText('Switching modes will stop the paused timer. Keep its elapsed time in history?')))return;
      stopPomodoro();
    }
    const mins={focus:state.settings.focusMinutes,short:state.settings.shortBreakMinutes,long:state.settings.longBreakMinutes}[mode];
    state.pomodoro={mode,remainingSeconds:mins*60,elapsedSeconds:0,running:false,lastStartedAt:null,startedAt:null,historyId:null,lessonId:selectedLesson,status:'ready'};
    persist();render();
  }
  function startPomodoro() {
    if(state.stopwatch.running){showToast('Pause the stopwatch before starting a Pomodoro.');return;}
    if(!state.pomodoro){state.pomodoro={mode:'focus',remainingSeconds:state.settings.focusMinutes*60,elapsedSeconds:0,running:false,lastStartedAt:null,startedAt:null,historyId:null,lessonId:selectedLesson,status:'ready'};}
    const timer=state.pomodoro;
    if(timer.running)return;
    if((timer.remainingSeconds||0)<=0){timer.remainingSeconds=state.settings[timer.mode==='focus'?'focusMinutes':timer.mode==='short'?'shortBreakMinutes':'longBreakMinutes']*60;timer.elapsedSeconds=0;timer.historyId=null;}
    const now=Date.now();
    if(!timer.historyId){
      const history={id:`p-${now}-${Math.random().toString(36).slice(2,7)}`,mode:timer.mode,startedAt:now,plannedSeconds:timer.remainingSeconds,elapsedSeconds:0,status:'running',lessonId:timer.mode==='focus'?selectedLesson:null};
      state.pomodoroHistory.push(history); if(state.pomodoroHistory.length>300) state.pomodoroHistory=state.pomodoroHistory.slice(-300);
      timer.historyId=history.id;timer.startedAt=now;timer.elapsedSeconds=0;timer.lessonId=selectedLesson;
    }
    timer.lastStartedAt=now;timer.running=true;timer.status='running';persist();updateLiveTimers();
  }
  function updatePomHistory(status, elapsed) {
    const timer=state.pomodoro; if(!timer||!timer.historyId)return;
    const history=state.pomodoroHistory.find(h=>h.id===timer.historyId);
    if(history){history.status=status;history.elapsedSeconds=Math.max(0,Math.floor(elapsed));history.finishedAt=(status==='completed'||status==='stopped')?Date.now():history.finishedAt;}
  }
  function pausePomodoro() {
    const timer=state.pomodoro;if(!timer||!timer.running)return;
    const remaining=getPomodoroRemaining();const elapsed=getPomodoroElapsed();
    timer.remainingSeconds=remaining;timer.elapsedSeconds=elapsed;timer.running=false;timer.lastStartedAt=null;timer.status='paused';
    updatePomHistory('paused',elapsed);persist();updateLiveTimers();
  }
  function completePomodoro() {
    const timer=state.pomodoro;if(!timer)return;
    const elapsed=timer.remainingSeconds||0;
    timer.remainingSeconds=0;timer.elapsedSeconds+=elapsed;timer.running=false;timer.lastStartedAt=null;timer.status='completed';
    updatePomHistory('completed',timer.elapsedSeconds);
    if(timer.mode==='focus'&&timer.elapsedSeconds>0){addStudySession({type:'Pomodoro focus',seconds:timer.elapsedSeconds,lessonId:timer.lessonId||selectedLesson,timestamp:timer.startedAt||Date.now()});}
    persist();updateLiveTimers();showToast(timer.mode==='focus'?'Focus block complete. Take a short break.':'Break complete. Ready for the next block?');
  }
  function stopPomodoro() {
    const timer=state.pomodoro;if(!timer)return;
    const elapsed=getPomodoroElapsed();
    timer.elapsedSeconds=elapsed;timer.remainingSeconds=getPomodoroRemaining();timer.running=false;timer.lastStartedAt=null;timer.status='stopped';
    updatePomHistory('stopped',elapsed);
    if(timer.mode==='focus'&&elapsed>0){addStudySession({type:'Pomodoro focus (stopped)',seconds:elapsed,lessonId:timer.lessonId||selectedLesson,timestamp:timer.startedAt||Date.now()});}
    state.pomodoro=null;persist();render();showToast(elapsed>0?`${fmtClock(elapsed)} saved from the Pomodoro timer.`:'Pomodoro stopped.');
  }
  function savePomodoroSettings() {
    const focus=Number($('#focusMinutes')?.value||25), short=Number($('#shortMinutes')?.value||5), long=Number($('#longMinutes')?.value||15);
    if(!Number.isInteger(focus)||focus<5||focus>90||!Number.isInteger(short)||short<1||short>30||!Number.isInteger(long)||long<5||long>60){showToast('Use focus 5–90, short break 1–30 and long break 5–60 minutes.');return;}
    if(state.pomodoro&&state.pomodoro.running){showToast('Pause the active timer before changing durations.');return;}
    state.settings.focusMinutes=focus;state.settings.shortBreakMinutes=short;state.settings.longBreakMinutes=long;
    if(!state.pomodoro||state.pomodoro.status==='ready')state.pomodoro={mode:'focus',remainingSeconds:focus*60,elapsedSeconds:0,running:false,lastStartedAt:null,historyId:null,lessonId:selectedLesson,status:'ready'};
    persist();render();showToast('Pomodoro durations updated.');
  }
  function bindReportControls() {
    const csv=$('#exportCsv');if(csv)csv.addEventListener('click',exportCsv);
    const json=$('#exportJson');if(json)json.addEventListener('click',exportJson);
  }
  function bindGuideControls() {
    const save=$('#saveDailyGoal');if(save)save.addEventListener('click',()=>{
      const minutes=Number($('#dailyGoal')?.value||120);
      if(!Number.isInteger(minutes)||minutes<30||minutes>360){showToast('Set a daily target between 30 and 360 minutes.');return;}
      state.settings.dailyGoalMinutes=minutes;persist();render();showToast('Daily target saved.');
    });
  }
  function updateLiveTimers() {
    const sw=$('#stopwatchDisplay');if(sw)sw.textContent=fmtClock(getStopwatchSeconds());
    const swState=$('#stopwatchState');if(swState)swState.textContent=state.stopwatch.running?tr('Running','در حال اجرا'):tr('Ready to start','آماده شروع');
    const pDisplay=$('#pomodoroDisplay');if(pDisplay)pDisplay.textContent=fmtCountdown(state.pomodoro?getPomodoroRemaining():state.settings.focusMinutes*60);
    const pState=$('#pomodoroState');if(pState){const p=state.pomodoro;const mode=p?({focus:tr('Focus session','جلسه تمرکز'),short:tr('Short break','استراحت کوتاه'),long:tr('Long break','استراحت طولانی')}[p.mode]):tr('Focus session','جلسه تمرکز');pState.textContent=p?`${mode} · ${p.running?tr('Running','در حال اجرا'):p.status==='completed'?tr('Completed','تکمیل‌شده'):p.status==='stopped'?tr('Stopped','متوقف‌شده'):tr('Paused','متوقف‌شده موقت')}`:tr('Focus session · ready','جلسه تمرکز · آماده');}
    const swStart=$('#swStart');if(swStart)swStart.disabled=state.stopwatch.running;
    const swPause=$('#swPause');if(swPause)swPause.disabled=!state.stopwatch.running;
    const swSave=$('#swSave');if(swSave)swSave.disabled=getStopwatchSeconds()<1;
    const swReset=$('#swReset');if(swReset)swReset.disabled=getStopwatchSeconds()<1;
    const pomStart=$('#pomStart');if(pomStart){pomStart.textContent=state.pomodoro&&state.pomodoro.running?tr('Running','در حال اجرا'):state.pomodoro&&state.pomodoro.status==='completed'?tr('Start next cycle','شروع چرخه بعدی'):state.pomodoro&&!state.pomodoro.running?tr('Resume','ادامه'):tr('Start focus','شروع تمرکز');pomStart.disabled=!!(state.pomodoro&&state.pomodoro.running);}
    const pomPause=$('#pomPause');if(pomPause)pomPause.disabled=!(state.pomodoro&&state.pomodoro.running);
    const pomStop=$('#pomStop');if(pomStop)pomStop.disabled=!state.pomodoro;
  }
  function timerTick() {
    if(state.pomodoro&&state.pomodoro.running&&getPomodoroRemaining()<=0){completePomodoro();}
    updateLiveTimers();
  }
  function exportFile(filename, content, mime) {
    const blob=new Blob([content],{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  }
  function exportJson() {
    const payload={exportedAt:new Date().toISOString(),courseHours:COURSE_HOURS,completed:state.completed,lessonSeconds:state.lessonSeconds,notes:state.notes,checklists:state.checklists,studySessions:state.studySessions,pomodoroHistory:state.pomodoroHistory,settings:state.settings};
    exportFile('nightshift-progress-backup.json',JSON.stringify(payload,null,2),'application/json');showToast('Progress backup exported.');
  }
  function exportCsv() {
    const rows=[[tr('Module','بخش'),tr('Priority','اولویت'),tr('Planned hours','ساعت برنامه‌ریزی‌شده'),tr('Logged hours','ساعت ثبت‌شده'),tr('Status','وضعیت'),tr('Checklist','چک‌لیست'),tr('Notes','یادداشت')]];
    activeLessons().forEach(item=>rows.push([lessonTitle(item),translateFaText(item.priority),item.hours,hoursFromSeconds(state.lessonSeconds[item.id]||0).toFixed(2),isComplete(item.id)?tr('Completed','تکمیل‌شده'):tr('In progress','در حال انجام'),`${checklistData(item.id).done}/${checklistData(item.id).items.length}`,(state.notes[item.id]||'').replace(/\s+/g,' ').slice(0,180)]));
    const csv=rows.map(row=>row.map(cell=>`"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
    exportFile('nightshift-lesson-progress.csv',csv,'text/csv;charset=utf-8');showToast('Lesson progress exported.');
  }
  function setup() {
    $('#todayLabel').textContent=new Intl.DateTimeFormat(currentLanguage === 'fa' ? 'fa-IR' : 'en-US',{weekday:'short',month:'short',day:'numeric'}).format(new Date());
    $('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
    $$('[data-language]').forEach(button => button.addEventListener('click', () => {
      const nextLanguage = button.dataset.language === 'en' ? 'en' : 'fa';
      if (nextLanguage === currentLanguage) return;
      currentLanguage = nextLanguage;
      try { localStorage.setItem(LANGUAGE_KEY, currentLanguage); } catch (_) {}
      $('#todayLabel').textContent = new Intl.DateTimeFormat(currentLanguage === 'fa' ? 'fa-IR' : 'en-US',{weekday:'short',month:'short',day:'numeric'}).format(new Date());
      const crumb = ({home:'OVERVIEW',roadmap:'12-WEEK ROADMAP',tree:'SKILL TREE',lessons:'LESSONS LIBRARY','lesson-detail':'LESSON DETAILS',study:'STUDY ROOM',reports:'REPORTS & PROGRESS',guide:'LEARNING GUIDE'})[currentPage] || 'OVERVIEW';
      $('#currentCrumb').textContent = crumb;
      render();
      applySiteLanguage();
    }));
    $('#profileButton').addEventListener('click',()=>{if(window.confirm(translateFaText('Reset all local Nightshift progress, notes, timers and history? This cannot be undone.'))){localStorage.removeItem(STORE_KEY);state=defaultState();selectedLesson='linux-windows';setPage('home');showToast('Local workspace reset.');}});
    $('#lessonCount').textContent=activeLessons().length;
    applySiteLanguage();
    if(state.stopwatch.running&&!state.stopwatch.startedAt){state.stopwatch.running=false;persist();}
    if(state.pomodoro&&state.pomodoro.running&&getPomodoroRemaining()<=0){completePomodoro();}
    render();
    timerInterval=setInterval(timerTick,500);
    document.addEventListener('click',event=>{
      const side=$('#sidebar');if(side.classList.contains('open')&&!side.contains(event.target)&&!$('#mobileMenu').contains(event.target)){side.classList.remove('open');}
    });
  }
  document.addEventListener('DOMContentLoaded',setup);
})();

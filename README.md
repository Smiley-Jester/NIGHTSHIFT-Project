# Nightshift — Ethical Security Roadmap

A responsive, bilingual cybersecurity learning dashboard built with plain HTML, CSS and JavaScript. English is the default language; English is available as a secondary language. No build step or external framework is required.

## Run locally

1. Unzip the folder.
2. Open `index.html` in a recent browser.
3. For the smoothest local experience, serve the folder with any static file server (for example `python -m http.server 8000`) and open `http://localhost:8000`.

## Features

- Overview dashboard with a 140-hour course target, per-lesson time budgets, lesson completion, study streak and XP.
- 12-week roadmap with week-by-week outcomes and a capstone integrated from week 3 onward.
- Persian-first / English-second language switcher. The full interface, lessons, roadmap, study tools, reports, notices and feedback change language; lesson titles, official video titles, resource names and essential technical terms remain in English. Persian uses right-to-left layout and Vazirmatn typography; English uses left-to-right layout and Inter.
- Interactive skill tree with six branches and one leaf per lesson. Each leaf reflects not-started, in-progress or completed status from the same saved lesson progress used elsewhere in the site.
- Fourteen detailed lesson pages with teaching points, why the topic matters, expected outcomes, requirements, deliverables, videos and direct lab links.
- Stopwatch and Pomodoro focus timer. Every Pomodoro start is recorded in the Study Room history. Completed/stopped focus time is added to course and lesson totals.
- Reports with weekly activity, module effort, milestone badges, CSV export and JSON backup.
- Notes, completion state, settings and timer history stored in browser `localStorage`.
- Responsive layout, reduced-motion support and SVG favicon.

## Curriculum sizing

The course is planned for 140 guided hours over 12 weeks. A practical default is about two hours per day, six days per week (roughly 12 hours weekly). Some late weeks are heavier; split those tasks into shorter sessions and use one lighter day for review or catch-up.

## Resource selection notes

Every lesson has a named primary learning resource. Generic YouTube search links and channel-homepage links have been removed. Companion resources are specific videos or focused official course / documentation pages. The curriculum keeps useful longer-form content when it adds real instructional value; assigned video courses and series are below 10 hours. Short, coherent series are preferred over very large playlists. For example, the Python-for-investigation course is about 3 hours 38 minutes across nine focused lessons, and the cryptography companion course is about 1 hour 22 minutes.

The resource choices prioritize instructional relevance, clear explanations, practical outcomes and credible educators or primary project sources. Popularity and ratings are included where they could be checked, but a view count is not treated as proof of quality. A few specialist topics (such as AI security and the Metasploit project overview) have smaller audiences; in those cases, the linked material is presented as a focused introduction and paired with an authoritative OWASP or vendor reference rather than being described as a universally top-rated course.

The Python module is specifically oriented toward digital-investigation and defensive scripting: reading supplied files, parsing logs, organizing evidence and producing reports. OSINT exercises must use fictional targets, learner-owned data or assets explicitly provided for training. OPSEC is a separate, named video resource. Metasploit is covered through a project-level industry interview and official product reference; the curriculum does not ask learners to apply exploitation techniques to real systems.

Practice links point to purpose-built training rooms, official project pages and documentation. Some platforms can change access requirements or room URLs; check each platform's current rules before starting. Some content may require a platform account or paid access.

## Safety and scope

All practical work is intended for systems explicitly provided for training or systems the learner owns and is authorized to test. Do not scan, access, exploit or collect data from public systems or real people without explicit written permission. Social-engineering content is framed as awareness and defence, not as instructions to deceive people. Reverse-engineering exercises should use benign course-provided samples; do not run unknown files on a personal device.

## Data and privacy

Progress is stored locally in the browser under the key `nightshift-roadmap-v1`. It is not sent to a server. Clearing browser site data or using the Reset control removes it. Use the JSON backup button in Reports before moving browsers or devices.

- The selected site language is saved separately in browser storage; the default is Persian. Progress data is preserved when switching languages.

## Known limitations

- This is a static front-end prototype, not an account-based service. Progress is local to one browser/device.
- External resource availability, platform access tiers, YouTube video titles and lab room details can change.
- External video titles, durations, ratings and access conditions can change; check the linked page before beginning a lesson.


## Languages and progress

- English is the default and primary interface language. Persian is available as the secondary language.
- Lesson, course and video titles remain in English in both modes; explanatory text and interface labels follow the selected language.
- The browser tab title remains `NIGHTSHIFT — Ethical Security Roadmap` in both languages.
- Lesson checklists are saved locally per lesson and are included in the JSON backup and CSV progress export.
- The default language is English on a fresh install; the selected language is remembered on the device.

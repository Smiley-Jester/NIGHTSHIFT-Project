/* Curated curriculum data. External resources are opened in a new tab. */
const LESSONS = [
  {
    id: 'linux-windows', number: '01', title: 'Linux & Windows Fundamentals', short: 'Operating systems, shells and permissions', category: 'Foundation', priority: 'Critical', hours: 12, weeks: [1], level: 'Beginner',
    summary: 'Learn how the two operating-system families you will meet most often are structured, administered and secured.',
    teaches: 'Filesystem navigation, users and groups, permissions, processes, services, logs, PowerShell basics, package management, shell pipelines and the difference between a normal user and an administrator.',
    why: 'Security work is mostly careful observation of systems. Without OS fluency, command output, permissions and logs look like noise and you cannot explain what a finding means.',
    outcome: 'Move confidently around a Linux and Windows terminal, inspect processes and services, explain file permissions, locate relevant logs and write a short baseline checklist.',
    requirements: ['Comfort using a computer and installing software', 'A virtual machine or browser-based lab (no personal system changes required)', 'Basic file and folder concepts'],
    video: {"title": "Linux for Hackers (and Everyone) — Beginner Course", "creator": "NetworkChuck", "duration": "3 h 28 min · 10 focused videos", "signal": "3.6M views on episode 1 · 5.45M-subscriber verified channel", "url": "https://www.youtube.com/playlist?list=PLIHvC56v63IJIujb5cyE13oLuyORZpdkL", "kind": "verified", "note": "A compact 10-part Linux course covering terminal basics, the filesystem, users and sudo, package management, services and processes. It totals 3h28—not a huge playlist—and the first episode alone has more than 3.6M views. Pair it with the Windows Fundamentals walkthrough below."},
    extraVideo: {"title": "TryHackMe Windows Fundamentals 1 — Walkthrough", "creator": "The Helpful Hacker", "duration": "34 min", "signal": "49k views · 732 likes", "url": "https://www.youtube.com/watch?v=Ssa2W1bUoAg", "kind": "verified", "note": "A focused walkthrough of TryHackMe Windows Fundamentals 1, covering the desktop, NTFS, user accounts, UAC and core Windows tools. Complete the supplied TryHackMe room alongside it."},
    practice: [
      {name: 'TryHackMe — Linux Fundamentals Part 1', provider: 'TryHackMe', url: 'https://tryhackme.com/room/linuxfundamentalspart1', time: '45–60 min', note: 'Terminal navigation, files, users and basic commands.'},
      {name: 'TryHackMe — Windows Fundamentals 1', provider: 'TryHackMe', url: 'https://tryhackme.com/room/windowsfundamentals1xbx', time: '45–60 min', note: 'Windows desktop, filesystem and core system tools.'},
      {name: 'OverTheWire — Bandit', provider: 'OverTheWire', url: 'https://overthewire.org/wargames/bandit/', time: 'Start with levels 0–5', note: 'Beginner command-line puzzles. Work through the levels at your own pace.'}
    ],
    deliverable: 'A one-page Linux/Windows command and permissions cheat sheet.'
  },
  {
    id: 'networking', number: '02', title: 'Networking & Protocols', short: 'How data actually moves', category: 'Foundation', priority: 'Critical', hours: 10, weeks: [2], level: 'Beginner',
    summary: 'Build a mental model of how hosts find each other and exchange information across local networks and the internet.',
    teaches: 'IPv4/IPv6, subnet and gateway concepts, MAC and ARP, TCP vs UDP, ports, DNS, DHCP, HTTP/S, TLS, routing, common service protocols and packet flow.',
    why: 'Almost every security alert has a network story behind it. Understanding normal traffic helps you distinguish expected behavior from a misconfiguration or suspicious event.',
    outcome: 'Explain what happens after entering a URL, identify common ports and protocols, read a basic packet capture and sketch a simple client-to-server flow.',
    requirements: ['Lesson 01 recommended', 'Comfort with binary numbers is helpful, but not required', 'A notebook for drawing packet flows'],
    video: {"title": "How Data Moves Through the Internet", "creator": "Practical Networking", "duration": "27 min", "signal": "525k views · 14k likes", "url": "https://www.youtube.com/watch?v=YJGGYKAV4pA", "kind": "verified", "note": "A clear visual explanation of routing, ARP and packet forwarding from a trusted networking educator."},
    extraVideo: {"title": "Network Protocols — ARP, DNS, DHCP, HTTP, TLS & more", "creator": "Practical Networking", "duration": "12 min", "signal": "2.3M views · 57k likes", "url": "https://www.youtube.com/watch?v=E5bSumTAHZE", "kind": "verified", "note": "A concise, exceptionally widely viewed explanation of common network protocols and how they fit together."},
    practice: [
      {name: 'TryHackMe — What is Networking?', provider: 'TryHackMe', url: 'https://tryhackme.com/room/whatisnetworking', time: '45–60 min', note: 'Interactive basics covering networks, IP and MAC addresses.'},
      {name: 'TryHackMe — Further Nmap', provider: 'TryHackMe', url: 'https://tryhackme.com/room/furthernmap', time: '60–90 min', note: 'Focus on the discovery and interpretation tasks; the target is supplied for scanning practice.'}
    ],
    deliverable: 'A labeled diagram of a browser request, including DNS, TCP, TLS and HTTP.'
  },
  {
    id: 'python', number: '03', title: 'Python for Security Scripting', short: 'Small scripts, useful automation', category: 'Programming', priority: 'Critical', hours: 10, weeks: [3], level: 'Beginner',
    summary: 'Use Python as a practical assistant for parsing, organizing and validating information during defensive security work.',
    teaches: 'Variables, conditionals, loops, functions, lists and dictionaries, reading files, exceptions, JSON, regular expressions, HTTP concepts and clean output.',
    why: 'A small script can turn repetitive manual checking into a consistent workflow. The aim is readable, testable automation—not building tools that act on systems without permission.',
    outcome: 'Write a script that parses a supplied log or CSV, summarizes events, validates structured input and produces a clear report with error handling.',
    requirements: ['Lessons 01 and 02 recommended', 'Python 3 and a code editor, or the TryHackMe browser editor', 'No prior programming experience needed'],
    video: {"title": "How Ethical Hackers Actually Break Into Systems — Python for Hackers Chapter", "creator": "freeCodeCamp.org · Declan Middleton", "duration": "2 h 37 min total · Python chapter about 33 min", "signal": "200k+ views · verified 12M-subscriber channel", "url": "https://www.youtube.com/watch?v=cqfl38Ip1ho&t=7412s", "kind": "verified", "note": "This course uses a dedicated local CTF lab. The link starts at the Python section (2:03:32), which covers Python fundamentals, conditionals and loops, then socket/requests and a small lab-scoped automation script. It is a focused practical introduction—not a generic app-development course. Keep any practice inside the supplied local training lab."},
    extraVideo: {"title": "Introduction to Python Programming for Digital Investigators", "creator": "DFIRScience", "duration": "3 h 38 min · 9 focused lessons", "signal": "Supplementary beginner course", "url": "https://dfir.science/python/", "kind": "reference", "note": "A useful second explanation of Python fundamentals, file handling and small scripts for reading supplied logs and evidence files. This is a course page with focused video lessons, not a single YouTube upload."},
    practice: [
      {name: 'TryHackMe — Python Basics', provider: 'TryHackMe', url: 'https://tryhackme.com/room/pythonbasics', time: '60–90 min', note: 'Practice variables, loops, functions, data structures and files in the browser.'},
      {name: 'OverTheWire — Bandit', provider: 'OverTheWire', url: 'https://overthewire.org/wargames/bandit/', time: 'Levels 6–10', note: 'Reinforce file handling and command-line problem solving.'}
    ],
    deliverable: 'A read-only log summarizer that groups events by type and writes a CSV summary.'
  },
  {
    id: 'osint-opsec', number: '04', title: 'OSINT & OpSec', short: 'Public information and privacy discipline', category: 'Investigation', priority: 'High', hours: 8, weeks: [4], level: 'Beginner',
    summary: 'Learn how to research publicly available information responsibly while protecting privacy and keeping a clear evidence trail.',
    teaches: 'Source evaluation, search operators, domain and certificate transparency concepts, metadata awareness, verification, note taking, source citations, data minimization and personal privacy practices.',
    why: 'Good investigations are reproducible and proportionate. Weak source handling creates false leads, while careless collection can expose people’s personal information.',
    outcome: 'Produce a small, sourced profile of a fictional organization or a domain explicitly provided for a training exercise, separate facts from assumptions and explain privacy risks.',
    requirements: ['Basic web browsing and networking concepts', 'Use fictional data or a platform-provided training target', 'Do not investigate private individuals or expose personal information'],
    video: {"title": "Learn Open-Source Intelligence (OSINT)!", "creator": "John Hammond", "duration": "1 h 14 min", "signal": "Beginner · 5.0/5 on Class Central (1 review only)", "url": "https://www.youtube.com/watch?v=HcCukCE1-K4", "kind": "verified", "note": "A dedicated beginner OSINT lesson by a widely known cybersecurity educator. The Class Central score is based on just one review, so treat it as a positive signal rather than a robust rating. Limit exercises to fictional data, your own accounts or explicitly supplied training targets."},
    extraVideo: {"title": "OPSEC: How To Stay Anonymous Online", "creator": "CyberFlow", "duration": "About 7 min", "signal": "63k views · 3.8k likes", "url": "https://www.youtube.com/watch?v=U0e51hzy1zU", "kind": "verified", "note": "A more substantial OPSEC-focused explainer covering threat modelling, compartmentalization, metadata and the limits of privacy tools. Use it to improve personal privacy and safety; no tool guarantees anonymity."},
    practice: [
      {name: 'TryHackMe — OhSINT', provider: 'TryHackMe', url: 'https://tryhackme.com/room/ohsint', time: '45–60 min', note: 'A deliberately scoped OSINT exercise. Keep notes on where each finding came from.'},
      {name: 'Bellingcat — Online Investigation Toolkit', provider: 'Bellingcat', url: 'https://bellingcat.gitbook.io/toolkit', time: 'Reference', note: 'Use the verification and source-evaluation sections as a reference, not as a mandate to investigate real people.'}
    ],
    deliverable: 'A sourced OSINT worksheet for a fictional training target, with confidence labels and a privacy review.'
  },
  {
    id: 'web-security', number: '05', title: 'Web Application Security', short: 'Understand common web weaknesses', category: 'Application Security', priority: 'Critical', hours: 16, weeks: [5, 6], level: 'Beginner → Intermediate',
    summary: 'Understand how web applications handle identity, input, sessions and data—and how common design mistakes create security risk.',
    teaches: 'HTTP requests and responses, cookies and sessions, authentication vs authorization, access control, input handling, injection concepts, security headers, file upload risks and secure design patterns.',
    why: 'Web applications are central to modern services. A tester must understand the feature and business logic before interpreting a scanner result or reporting a weakness.',
    outcome: 'Navigate the OWASP Top 10, document a finding in a deliberately vulnerable training app, explain its impact and propose a practical fix.',
    requirements: ['Lessons 01–03 recommended', 'Basic HTML, browser developer tools and HTTP familiarity', 'Use PortSwigger labs or the supplied training application only'],
    video: {"title": "Getting Started with Burp Suite — Gin & Juice Shop", "creator": "CryptoCat", "duration": "18 min", "signal": "Focused practical demo", "url": "https://www.youtube.com/watch?v=FPzoD_nUQYU", "kind": "verified", "note": "A concise Burp Suite introduction using an intentionally vulnerable training application. Keep all practice inside that supplied demo or another explicitly authorized lab."},
    extraVideo: {"title": "Web Security Academy — Burp Suite Video Tutorials", "creator": "PortSwigger", "duration": "Focused tutorial collection", "signal": "Official training from the Burp Suite team", "url": "https://portswigger.net/burp/pro/video-tutorials", "kind": "reference", "note": "Official short tutorials on HTTP interception, request/response inspection, Repeater, scope and Burp basics. Pair them with PortSwigger Web Security Academy beginner labs."},
    practice: [
      {name: 'PortSwigger — Web Security Academy', provider: 'PortSwigger', url: 'https://portswigger.net/web-security', time: '6–8 h across selected beginner labs', note: 'Free, frequently updated training and interactive labs. Start with HTTP, authentication and access control.'},
      {name: 'OWASP Juice Shop', provider: 'OWASP', url: 'https://owasp.org/www-project-juice-shop/', time: '2–3 h selected beginner challenges', note: 'An intentionally insecure app made for security training. Use the hosted demo or your own local instance.'},
      {name: 'TryHackMe — OWASP Top 10', provider: 'TryHackMe', url: 'https://tryhackme.com/room/owasptop10', time: '60–90 min', note: 'A guided overview; follow with the relevant PortSwigger labs.'}
    ],
    deliverable: 'Two concise lab reports: one access-control issue and one input-handling issue, each with impact and remediation.'
  },
  {
    id: 'api-security', number: '06', title: 'API Security Testing', short: 'Secure data exchange between services', category: 'Application Security', priority: 'Critical', hours: 8, weeks: [6, 7], level: 'Intermediate',
    summary: 'Learn how APIs expose application data and functionality, and how to review authorization, validation and resource controls.',
    teaches: 'REST and JSON, endpoint inventories, authentication tokens, object-level and function-level authorization, schema validation, rate limiting, error handling and API documentation.',
    why: 'APIs often connect mobile apps, web front ends and internal services. Their risks can be different from traditional page-based web vulnerabilities.',
    outcome: 'Read an API specification, map endpoints in a lab, identify an authorization or data-exposure risk and write a safe recommendation.',
    requirements: ['Lesson 02 and lesson 05 recommended', 'Comfort reading JSON and HTTP requests', 'Use only training APIs and accounts created for the lab'],
    video: {"title": "API Security Fundamentals — Course for Beginners", "creator": "freeCodeCamp.org · APIsec University", "duration": "1 h 49 min", "signal": "94k views · 2.4k likes · verified 12M-subscriber channel", "url": "https://www.youtube.com/watch?v=R-4_DbV1Su4", "kind": "verified", "note": "A structured beginner course covering the OWASP API Security Top 10, API risk analysis and defensive controls. It is a solid primary lesson from a large, established educational channel."},
    extraVideo: {"title": "OWASP API Security Top 10 — Course for Beginners", "creator": "freeCodeCamp.org", "duration": "1 h 22 min", "signal": "Supplementary focused course", "url": "https://www.youtube.com/watch?v=YYe0FdfdgDU", "kind": "verified", "note": "A second, focused explanation of the API risk categories and mitigations. Treat the 2023 list as a learning baseline and check the current OWASP project for later updates."},
    practice: [
      {name: 'OWASP crAPI', provider: 'OWASP', url: 'https://github.com/OWASP/crAPI', time: '2–3 h selected modules', note: 'A deliberately vulnerable API training project. Follow its setup and safety guidance.'},
      {name: 'OWASP API Security Project', provider: 'OWASP', url: 'https://owasp.org/www-project-api-security/', time: 'Reference', note: 'Use the current API Security Top 10 as your checklist.'}
    ],
    deliverable: 'An endpoint inventory with authentication, authorization and data-validation notes.'
  },
  {
    id: 'vulnerability-assessment', number: '07', title: 'Vulnerability Assessment', short: 'Find, validate and prioritize risk', category: 'Assessment', priority: 'Critical', hours: 8, weeks: [7, 8], level: 'Intermediate',
    summary: 'Learn the difference between discovering a possible weakness and confirming a meaningful, reportable risk.',
    teaches: 'Asset inventory, scan scope, service identification, scanner limitations, false positives, CVE/CVSS concepts, evidence capture, severity vs business impact and remediation verification.',
    why: 'A raw scan is not a security assessment. Professionals validate findings, explain uncertainty and prioritize the issues that matter to the organization.',
    outcome: 'Review a lab scan, manually verify a small set of findings, rank them with context and produce a remediation-first summary.',
    requirements: ['Lessons 01 and 02', 'Basic understanding of services and ports', 'Only scan the machine explicitly assigned by the lab'],
    video: {"title": "Nmap Tutorial for Beginners — What is Nmap?", "creator": "HackerSploit", "duration": "Beginner tutorial", "signal": "1.56M views · 28k likes", "url": "https://www.youtube.com/watch?v=5MTZdN9TEO4", "kind": "verified", "note": "A very widely watched introduction to asset and service discovery. It covers only one part of vulnerability assessment, so use the Nessus lesson beside it for scanner results and risk review. Only use the tool against lab assets you are authorized to assess."},
    extraVideo: {"title": "Nessus Tutorial for Beginners: Vulnerability Management", "creator": "Josh Madakor", "duration": "27 min 47 sec", "signal": "176k views · 5.8k likes · verified 230k-subscriber channel", "url": "https://www.youtube.com/watch?v=lT6Px9zJM3s", "kind": "verified", "note": "A focused vulnerability-management walkthrough showing a scan, how to interpret findings and how remediation changes the results. The original demonstration uses an intentionally isolated Windows lab and older configuration choices; do not copy its security-disabling settings onto your everyday device or expose a lab VM to the public internet."},
    practice: [
      {name: 'TryHackMe — Nmap', provider: 'TryHackMe', url: 'https://tryhackme.com/room/furthernmap', time: '60–90 min', note: 'The room supplies a purpose-built scanning target. No exploitation is required for this exercise.'},
      {name: 'Nmap Reference Guide', provider: 'Nmap', url: 'https://nmap.org/book/man.html', time: 'Reference', note: 'Look up scan output and terminology; follow the lab scope.'}
    ],
    deliverable: 'A prioritized findings table with evidence, confidence, impact and remediation.'
  },
  {
    id: 'exploitation', number: '08', title: 'Exploitation Fundamentals', short: 'Understand impact in safe test environments', category: 'Assessment', priority: 'High', hours: 10, weeks: [8, 9], level: 'Intermediate',
    summary: 'Study the concept of exploitability and how a validated weakness can affect a system, without moving beyond a controlled training target.',
    teaches: 'Vulnerability-to-impact reasoning, proof-of-concept boundaries, exploit preconditions, safe validation, evidence minimization, rollback planning and responsible disclosure.',
    why: 'A professional must show that a finding is real while avoiding unnecessary access, data exposure or disruption. Restraint is part of technical skill.',
    outcome: 'In a guided lab, explain the preconditions and impact of a supplied vulnerability, validate only the intended proof and document a safe remediation path.',
    requirements: ['Lessons 02, 05 and 07', 'An isolated TryHackMe/HTB lab instance', 'Read the room rules and scope before starting'],
    video: {"title": "What is Metasploit? | Rapid7", "creator": "Rapid7 · Metasploit Team", "duration": "Short explainer", "signal": "Official project video · 48k views", "url": "https://www.youtube.com/watch?v=EN87ixzSxpI", "kind": "verified", "note": "An official introduction by a member of the Metasploit team explaining what the framework is and what its versions do. It is an overview, not a complete hands-on course; keep any tool practice inside provider-supplied vulnerable labs."},
    extraVideo: {"title": "The Past, Present and Future of Metasploit", "creator": "Spencer McIntyre · Rapid7", "duration": "Video interview", "signal": "Interview with a Metasploit project lead researcher", "url": "https://www.helpnetsecurity.com/2022/07/20/past-present-future-metasploit-video/", "kind": "reference", "note": "A useful follow-up interview about the framework’s history and role in professional security work. This opens an article page containing the video."},
    practice: [
      {name: 'TryHackMe — Metasploit: Exploitation', provider: 'TryHackMe', url: 'https://tryhackme.com/room/metasploitexploitation', time: '60–90 min', note: 'An explicitly provided practice environment. Stay within its deployed machine and tasks.'},
      {name: 'HTB Academy — Penetration Testing Process', provider: 'Hack The Box', url: 'https://academy.hackthebox.com/course/preview/penetration-testing-process', time: 'Reference + guided practice', note: 'Read the pre-engagement and exploitation sections before attempting proof-of-concept work.'}
    ],
    deliverable: 'A lab note that states scope, preconditions, minimum proof, impact and a fix.'
  },
  {
    id: 'social-engineering', number: '09', title: 'Social Engineering Awareness', short: 'Recognize manipulation and strengthen people-first security', category: 'Human Security', priority: 'High', hours: 6, weeks: [4, 9], level: 'Beginner',
    summary: 'Understand common manipulation patterns so you can recognize, report and help prevent social-engineering attempts.',
    teaches: 'Urgency and authority cues, impersonation red flags, suspicious links and attachments, verification channels, reporting workflows, SPF/DKIM/DMARC and awareness design.',
    why: 'Security depends on people and process as well as technology. A calm verification habit can stop an incident before technical controls are involved.',
    outcome: 'Analyze sample messages supplied by a training room, identify warning signs and write a safe escalation/reporting checklist.',
    requirements: ['Basic email and web literacy', 'Use sample messages supplied by a training platform', 'Do not create or send deceptive messages, collect credentials or contact real people'],
    video: {"title": "Social Engineering — How Bad Guys Hack Users", "creator": "IBM Technology · Jeff Crume", "duration": "Video explainer", "signal": "IBM Distinguished Engineer", "url": "https://mediacenter.ibm.com/media/Social%2BEngineering%2B-%2BHow%2BBad%2BGuys%2BHack%2BUsers/1_scngjugh", "kind": "verified", "note": "A defender-focused explanation from IBM Distinguished Engineer Jeff Crume about common social-engineering methods and how people can recognize and resist manipulation."},
    extraVideo: {"title": "Phishing Explained", "creator": "IBM Technology · Jeff Crume", "duration": "Video explainer", "signal": "IBM Technology", "url": "https://www.ibm.com/think/videos/phishing", "kind": "reference", "note": "A focused companion explaining phishing, spear phishing and whaling, with practical emphasis on recognizing suspicious requests and avoiding traps."},
    practice: [
      {name: 'TryHackMe — Phishing Prevention', provider: 'TryHackMe', url: 'https://tryhackme.com/room/phishingemails4gkxh', time: '60–90 min', note: 'Defensive email controls including SPF, DKIM, DMARC and analysis.'},
      {name: 'TryHackMe — Phishing Emails in Action', provider: 'TryHackMe', url: 'https://tryhackme.com/room/phishingemails2rytmuv', time: '45–60 min', note: 'Recognize indicators in provided sample messages. Do not interact with live suspicious links or attachments.'}
    ],
    deliverable: 'A one-page “pause, verify, report” checklist for suspicious messages.'
  },
  {
    id: 'privilege-escalation', number: '10', title: 'Privilege Escalation & Least Privilege', short: 'Understand identity boundaries and misconfiguration risk', category: 'System Security', priority: 'High', hours: 10, weeks: [9, 10], level: 'Intermediate',
    summary: 'Understand how excessive permissions and system misconfigurations create privilege-escalation risk, and how least-privilege controls reduce it.',
    teaches: 'Standard versus administrator accounts, Linux ownership and permissions, Windows UAC, service and account boundaries, common misconfiguration categories, least privilege and defensive remediation.',
    why: 'A secure system limits what each account and service can do. Auditors need to spot where permission boundaries are weaker than intended.',
    outcome: 'Review a deliberately misconfigured lab machine, identify the configuration issue, describe its impact and propose a least-privilege fix.',
    requirements: ['Lesson 01 strongly recommended', 'Comfort with shell commands and permissions', 'Use only the dedicated training VM; do not apply lab changes to shared or personal devices'],
    video: {"title": "Linux Privilege Escalation for Beginners", "creator": "The Cyber Mentor · TCM Security", "duration": "2 h 53 min", "signal": "198k views · 4.4k likes · verified 1M-subscriber channel", "url": "https://www.youtube.com/watch?v=ZTnwg3qCdVM", "kind": "verified", "note": "A well-known, structured beginner course covering Linux privilege boundaries and common misconfiguration classes. Follow only in an isolated training VM or platform-provided lab; never test techniques on a device or account without explicit authorization."},
    extraVideo: {"title": "Linux File Permissions: chmod, umask & ACLs Explained", "creator": "WhiteboardDoodles", "duration": "17 min 29 sec", "signal": "9.6k views · 425 likes", "url": "https://www.youtube.com/watch?v=o_2aXxEqtao", "kind": "verified", "note": "A clear, beginner-friendly companion on users, groups, ownership, permissions and access-control lists. It reinforces the defensive understanding needed to prevent privilege misconfiguration."},
    practice: [
      {name: 'TryHackMe — Linux Privilege Escalation: Basics', provider: 'TryHackMe', url: 'https://tryhackme.com/room/linprivbasics', time: '60–90 min', note: 'A dedicated, intentionally misconfigured lab. Follow its stated prerequisites.'},
      {name: 'TryHackMe — Privilege Escalation module', provider: 'TryHackMe', url: 'https://tryhackme.com/module/privilege-escalation', time: 'Selected Linux and Windows rooms', note: 'Use the module to compare operating-system permission models and remediation.'}
    ],
    deliverable: 'A permission-review checklist with the risky setting and the least-privilege correction.'
  },
  {
    id: 'ai-security', number: '11', title: 'AI Security & Prompt Injection', short: 'Treat model inputs and tool access as untrusted', category: 'Emerging Security', priority: 'Specialist', hours: 8, weeks: [11], level: 'Intermediate',
    summary: 'Explore how AI applications process instructions, documents and tool calls, and why clear trust boundaries matter.',
    teaches: 'Direct and indirect prompt injection concepts, untrusted context, data exposure, excessive agency, output validation, least privilege, human approval and layered mitigations.',
    why: 'AI systems increasingly connect to files, APIs and business workflows. Their security depends on limiting what untrusted inputs can influence and what actions a model can take.',
    outcome: 'Explain a prompt-injection risk in a simulated application, map the trust boundary and recommend controls such as least privilege, constrained tools and human review.',
    requirements: ['Basic understanding of web apps and APIs', 'A general idea of how an LLM receives context', 'Use the TryHackMe simulation; do not test third-party AI services or accounts'],
    video: {"title": "Explained: The OWASP Top 10 for Large Language Model Applications", "creator": "IBM Technology · Jeff Crume", "duration": "About 12 min", "signal": "74k views · 1.6k likes · verified 1.83M-subscriber channel", "url": "https://www.youtube.com/watch?v=cYuesqIKf9A", "kind": "verified", "note": "A reputable, concise overview of LLM application risks including direct and indirect prompt injection, plus defensive mitigations. The video covers the 2023 OWASP list; check the current OWASP GenAI project for later changes."},
    extraVideo: {"title": "OWASP GenAI Security Project — LLM Top 10", "creator": "OWASP Foundation", "duration": "Current reference", "signal": "Official project guidance", "url": "https://genai.owasp.org/llm-top-10/", "kind": "reference", "note": "The official living reference for current LLM application risks and mitigations. It is documentation, not a video."},
    practice: [
      {name: 'TryHackMe — Prompt Injection', provider: 'TryHackMe', url: 'https://tryhackme.com/room/promptinjectionls', time: '45–75 min', note: 'A simulated exercise covering direct and indirect prompt injection concepts.'},
      {name: 'OWASP — Top 10 for LLM Applications', provider: 'OWASP', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', time: 'Reference', note: 'Read the current project guidance and focus on mitigations and threat boundaries.'}
    ],
    deliverable: 'A threat model for a fictional AI assistant, including assets, trust boundaries and safeguards.'
  },
  {
    id: 'reverse-engineering', number: '12', title: 'Reverse Engineering', short: 'Read software behavior from compiled programs', category: 'Specialist', priority: 'Specialist', hours: 8, weeks: [11, 12], level: 'Intermediate',
    summary: 'Learn how analysts inspect compiled software to understand its structure and behavior, even when source code is unavailable.',
    teaches: 'Executable formats, strings and metadata, basic CPU and assembly concepts, static analysis, decompiler limitations, function mapping and safe malware-analysis principles.',
    why: 'Reverse engineering supports software assurance, incident response and compatibility research. It helps analysts understand what a program appears to do and what evidence supports that conclusion.',
    outcome: 'Load a benign training binary into Ghidra, identify its entry point and key functions, and write a behavior summary with evidence and uncertainty.',
    requirements: ['Python basics recommended', 'A basic idea of memory, functions and binary/hex notation', 'Use benign crackme or course-provided sample files only; never run unknown samples on a personal machine'],
    video: {"title": "Reverse Engineering Made EASY with Ghidra! — Beginner Tutorial", "creator": "Cyber Ryan", "duration": "Short beginner introduction", "signal": "184k views · 6.2k likes", "url": "https://www.youtube.com/watch?v=4DpV0zdJEk0", "kind": "verified", "note": "A beginner-friendly introduction to loading and analyzing a program in Ghidra. Work with harmless sample files supplied by a course; do not run unknown executables on your everyday device."},
    extraVideo: {"title": "Reverse Engineering with Ghidra — Beginner Course", "creator": "Hackaday", "duration": "About 1 h 05 min", "signal": "Focused course listing", "url": "https://www.classcentral.com/course/youtube-hackadayu-reverse-engineering-with-ghidra-class-1-139514", "kind": "reference", "note": "A short, structured course covering software and x86_64 fundamentals with Ghidra. The link opens the course listing, which provides access to its video lessons."},
    practice: [
      {name: 'TryHackMe — Reversing ELF', provider: 'TryHackMe', url: 'https://tryhackme.com/room/reverselfiles', time: '60–90 min', note: 'Beginner reverse-engineering puzzles using provided training binaries.'},
      {name: 'Ghidra — Official project', provider: 'NSA / Ghidra', url: 'https://github.com/NationalSecurityAgency/ghidra', time: 'Reference', note: 'Official project source and documentation. Download only from the official release channel.'}
    ],
    deliverable: 'A short static-analysis note explaining three observed functions and the evidence for each.'
  },
  {
    id: 'cryptography', number: '13', title: 'Cryptography', short: 'Understand how digital trust is built', category: 'Foundation', priority: 'High', hours: 8, weeks: [10, 11, 12], level: 'Beginner → Intermediate',
    summary: 'Understand the security properties behind hashing, encryption, key exchange and digital signatures.',
    teaches: 'Encoding vs encryption vs hashing, symmetric and asymmetric cryptography, salts, key management, signatures, certificates, TLS concepts and common implementation mistakes.',
    why: 'Security professionals must know what cryptography can guarantee, what it cannot guarantee and why key handling matters as much as the algorithm.',
    outcome: 'Choose an appropriate cryptographic primitive for a stated goal, explain a TLS handshake at a high level and identify unsafe practices such as storing passwords with plain hashes.',
    requirements: ['Basic networking concepts', 'Comfort with binary and hexadecimal notation is useful', 'No advanced mathematics required for this module'],
    video: {"title": "Cryptography Essentials — A Practical Approach to Real-World Digital Security", "creator": "Practical Networking", "duration": "1 h 22 min · 16 focused videos", "signal": "Focused course; no mega-playlist", "url": "https://www.youtube.com/playlist?list=PLIFyRwBY_4bQvq5PuJASilkHSVGLZtceZ", "kind": "verified", "note": "A compact, coherent 16-part series covering hashing, symmetric and asymmetric encryption, signatures and key exchange. At about 82 minutes total, it fits your limit and is much more complete than a five-minute RSA clip."},
    extraVideo: {"title": "RSA & Asymmetric Encryption — Cryptography Essentials", "creator": "Practical Networking", "duration": "5 min", "signal": "Standalone concept recap", "url": "https://www.youtube.com/watch?v=9ukUYMcEh3Y", "kind": "verified", "note": "A short standalone recap of asymmetric encryption. Watch it after the full series, not instead of it."},
    practice: [
      {name: 'TryHackMe — Cryptography Basics', provider: 'TryHackMe', url: 'https://tryhackme.com/room/cryptographybasics', time: '45–60 min', note: 'An introductory room on symmetric encryption and secure communication.'},
      {name: 'Crypto 101', provider: 'Crypto 101', url: 'https://crypto101.io/', time: 'Selected chapters', note: 'A free, readable introduction to cryptographic concepts.'}
    ],
    deliverable: 'A comparison sheet for hashing, symmetric encryption, public-key encryption and signatures.'
  },
  {
    id: 'pentest-labs', number: '14', title: 'Real-World Penetration Testing Labs', short: 'Scope, assess, report and retest', category: 'Capstone', priority: 'Critical', hours: 18, weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12], level: 'Intermediate',
    summary: 'Bring the roadmap together in a simulated engagement that follows professional boundaries from authorization through reporting.',
    teaches: 'Rules of engagement, scope confirmation, asset inventory, evidence handling, risk validation, impact statements, remediation, retesting and executive reporting.',
    why: 'Employable security work is not a collection of tricks. It is a disciplined process that protects the client, produces trustworthy evidence and helps teams fix risk.',
    outcome: 'Complete an authorized training engagement, stay inside a written scope, produce a prioritized report and explain how you would verify the fixes.',
    requirements: ['Lessons 01–10 recommended; revisit topics as needed', 'Read and follow each platform’s rules and scope', 'Never test public or personal systems without explicit written permission'],
    video: {"title": "How To Learn Hacking — A Practical Demo", "creator": "The Hacker Academy", "duration": "24 min 40 sec", "signal": "982k views · 37k likes · 236k-subscriber channel", "url": "https://www.youtube.com/watch?v=uPbQNFuDGUs", "kind": "verified", "note": "A concise five-phase methodology demonstration covering reconnaissance, scanning, validation, controlled lab access and reporting. The video says its demonstrations use intentionally vulnerable practice machines. Watch as a process overview and keep all practice inside provider-supplied labs with written authorization; never reproduce testing on public or third-party systems."},
    extraVideo: {"title": "Ethical Hacking Fundamentals: Core Concepts and Techniques in Penetration Testing", "creator": "O’Reilly · Gabrielle Botbol", "duration": "1 h 49 min", "signal": "Beginner course · includes quizzes and a sandbox · subscription may be required", "url": "https://www.oreilly.com/videos/ethical-hacking-fundamentals/0642572062811/", "kind": "verified", "note": "A structured beginner course covering ethical principles, the penetration-testing lifecycle, standards, methodology and professional reporting. O’Reilly access may require a subscription; the short Hacker Academy video is the free primary overview."},
    practice: [
      {name: 'HTB Academy — Penetration Testing Process', provider: 'Hack The Box', url: 'https://academy.hackthebox.com/course/preview/penetration-testing-process', time: '4–6 h selected sections', note: 'Covers pre-engagement, information gathering, assessment, proof-of-concept and post-engagement.'},
      {name: 'HTB Academy — Penetration Tester Path', provider: 'Hack The Box', url: 'https://academy.hackthebox.com/path/preview/penetration-tester', time: 'Use selected beginner modules', note: 'A larger career path. This roadmap uses selected modules rather than asking you to complete the entire path in 12 weeks.'},
      {name: 'TryHackMe — Jr Penetration Tester path', provider: 'TryHackMe', url: 'https://tryhackme.com/path/outline/jrpenetrationtester', time: 'Selected rooms', note: 'A structured path to revisit key web and network concepts in a guided environment.'}
    ],
    deliverable: 'A professional-style report with scope, executive summary, evidence, severity, fixes and retest status.'
  }
];

const WEEKS = [
  {week: 1, theme: 'Build your workstation literacy', hours: 12, modules: [{id:'linux-windows', hours:12, task:'Linux and Windows navigation, accounts, permissions, logs and services.'}], checkpoint:'Navigate both shells and explain who can read, write and execute a file.'},
  {week: 2, theme: 'Learn how networks communicate', hours: 10, modules: [{id:'networking', hours:10, task:'IP addressing, DNS, ports, TCP/UDP, TLS and packet flow.'}], checkpoint:'Draw a browser request and identify each protocol in the path.'},
  {week: 3, theme: 'Make Python useful', hours: 11, modules: [{id:'python', hours:10, task:'Core syntax, functions, files, JSON and log parsing.'},{id:'pentest-labs',hours:1,task:'Start a reusable lab notebook and engagement scope template.'}], checkpoint:'Write a small script that summarizes supplied sample logs.'},
  {week: 4, theme: 'Investigate carefully; recognize manipulation', hours: 11, modules: [{id:'osint-opsec',hours:8,task:'Source verification, privacy, search methods and evidence notes.'},{id:'social-engineering',hours:2,task:'Spot urgency, impersonation and suspicious-message red flags.'},{id:'pentest-labs',hours:1,task:'Write rules of engagement for a fictional training scenario.'}], checkpoint:'Separate verified facts from assumptions and create a “pause, verify, report” checklist.'},
  {week: 5, theme: 'Understand the web application surface', hours: 10, modules: [{id:'web-security',hours:9,task:'HTTP, sessions, authentication, access control and OWASP Top 10 orientation.'},{id:'pentest-labs',hours:1,task:'Define an application test scope and capture baseline evidence.'}], checkpoint:'Explain the difference between authentication and authorization.'},
  {week: 6, theme: 'Web security into APIs', hours: 10, modules: [{id:'web-security',hours:7,task:'Input handling, security headers and beginner PortSwigger labs.'},{id:'api-security',hours:2,task:'REST, JSON, endpoint inventories and object authorization.'},{id:'pentest-labs',hours:1,task:'Add an endpoint inventory to the report template.'}], checkpoint:'Map a sample API endpoint to its data, identity and authorization checks.'},
  {week: 7, theme: 'Assess, validate and prioritize', hours: 11, modules: [{id:'api-security',hours:6,task:'API Top 10, error handling, rate limits and data exposure.'},{id:'vulnerability-assessment',hours:4,task:'Asset inventory, Nmap basics, CVE/CVSS and false positives.'},{id:'pentest-labs',hours:1,task:'Create a findings register with confidence and remediation columns.'}], checkpoint:'Explain why a scanner result needs manual validation.'},
  {week: 8, theme: 'Understand findings in controlled labs', hours: 11, modules: [{id:'vulnerability-assessment',hours:3,task:'Review and rank sample findings with business context.'},{id:'exploitation',hours:7,task:'Exploitability concepts, preconditions and safe proof-of-concept boundaries.'},{id:'pentest-labs',hours:1,task:'Document the minimum proof needed for a finding.'}], checkpoint:'Write a safe proof-of-concept note without collecting unnecessary data.'},
  {week: 9, theme: 'People, permissions and system boundaries', hours: 12, modules: [{id:'exploitation',hours:3,task:'Review lab evidence and remediation for a validated weakness.'},{id:'social-engineering',hours:4,task:'Analyze sample phishing messages and defensive email controls.'},{id:'privilege-escalation',hours:3,task:'Linux and Windows permission models; least privilege.'},{id:'pentest-labs',hours:2,task:'Review your scope and evidence trail.'}], checkpoint:'Identify the permission boundary that a sample misconfiguration violates.'},
  {week: 10, theme: 'Harden identity and data protection', hours: 12, modules: [{id:'privilege-escalation',hours:7,task:'Audit a supplied lab configuration and write the least-privilege fix.'},{id:'cryptography',hours:3,task:'Hashing, symmetric/asymmetric encryption and signatures.'},{id:'pentest-labs',hours:2,task:'Draft impact statements and remediation notes.'}], checkpoint:'Choose the correct cryptographic primitive for four common security goals.'},
  {week: 11, theme: 'Explore emerging and specialist areas', hours: 14, modules: [{id:'ai-security',hours:8,task:'Prompt injection, trust boundaries, constrained tool access and mitigations.'},{id:'cryptography',hours:3,task:'TLS, certificates, key management and common mistakes.'},{id:'reverse-engineering',hours:1,task:'Executable formats, strings and what static analysis can establish.'},{id:'pentest-labs',hours:2,task:'Review report structure and evidence quality.'}], checkpoint:'Threat-model a fictional AI assistant and recommend controls.'},
  {week: 12, theme: 'Analyze software and deliver the engagement', hours: 16, modules: [{id:'reverse-engineering',hours:7,task:'Ghidra orientation, static analysis of benign training binaries and findings notes.'},{id:'cryptography',hours:2,task:'Consolidate crypto concepts with a final comparison sheet.'},{id:'pentest-labs',hours:7,task:'Complete the capstone report, remediation plan and retest checklist.'}], checkpoint:'Deliver a scoped report and explain what was tested, what was not tested and why.'}
];

const COURSE_HOURS = LESSONS.reduce((sum, lesson) => sum + lesson.hours, 0);

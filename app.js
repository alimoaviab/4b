// If opened via VS Code Live Server (port 5500) locally, redirect to Node server
if ((location.hostname === '127.0.0.1' || location.hostname === 'localhost') && location.port && location.port !== '3000') {
  window.location.replace(`http://${location.hostname}:3000/`);
}

// 4Bit Academy — public site script (admin panel lives in admin.html / admin.js)
document.querySelectorAll('[data-reveal]').forEach(l=>l.addEventListener('click',()=>{const s=document.getElementById(l.dataset.reveal);if(s)s.hidden=false}));
const ACADEMY="4Bit Academy";
let courses=[
 {name:"Office Management Course",short:"Office Management",icon:"📊",c1:"#2874e8",c2:"#27c4d4",desc:"Build practical skills for modern office administration and workplace productivity.",
  adv:["Work confidently in offices, shops and companies","Prepare professional letters, sheets and presentations","Manage records, emails and schedules efficiently","A strong base for CIT, DIT and data entry work"],
  topics:["Computer basics and typing","MS Word — letters, CVs and mail merge","MS Excel — formulas, tables and charts","MS PowerPoint — presentations","Email, internet and office communication","Records, filing and final office project"]},
 {name:"Graphic Designing Course",short:"Graphic Designing",icon:"🎨",c1:"#8b5cf6",c2:"#ec4899",desc:"Turn creative ideas into professional visual designs for print and digital platforms.",
  adv:["Create logos, posts and banners for real businesses","Build a portfolio for jobs and freelancing","Learn industry-standard design tools","Start earning through local clients and online marketplaces"],
  topics:["Design principles — colour, layout, typography","Photoshop — editing and social media posts","Illustrator — logos and vector artwork","Canva — quick branding and marketing material","Print design — cards, flyers and banners","Portfolio and client project"]},
 {name:"Web Development Course",short:"Web Development",icon:"💻",c1:"#0f766e",c2:"#2dd4bf",desc:"Learn how websites are structured, styled and made interactive.",
  adv:["Build real, responsive websites","Learn skills in demand for jobs and freelancing","Understand how the web works end to end","Publish your own portfolio website"],
  topics:["Web basics and HTML5","CSS3, Flexbox and Grid","Responsive design for mobile","JavaScript fundamentals and the DOM","Forms, APIs and mini projects","Hosting, publishing and final website"]},
 {name:"SEO Course",short:"SEO",icon:"🔎",c1:"#ea580c",c2:"#fbbf24",desc:"Understand how to improve website visibility and organic search performance.",
  adv:["Help websites rank higher on Google","Offer SEO services to local businesses","Understand keywords, content and traffic","Useful for freelancing and digital marketing jobs"],
  topics:["How search engines work","Keyword research and search intent","On-page SEO and content optimisation","Technical SEO and site speed","Link building and local SEO","Google Analytics, Search Console and reporting"]},
 {name:"Trading Course",short:"Trading",icon:"📈",c1:"#14532d",c2:"#4ade80",desc:"Learn market terminology, chart reading and risk management. Trading involves risk; profits are not guaranteed.",
  adv:["Understand market basics and chart reading","Learn risk management before using real money","Practise on demo accounts","Make disciplined, informed decisions (no profit guarantee)"],
  topics:["Market basics and terminology","Candlesticks and chart patterns","Trend, support and resistance","Indicators and trading strategies","Risk management and trading psychology","Demo trading practice"]},
 {name:"CIT Course",short:"CIT",icon:"🧩",c1:"#475569",c2:"#94a3b8",desc:"Certificate in Information Technology — a practical foundation in computers and everyday IT skills.",
  adv:["Strong IT foundation for beginners","Useful for jobs, higher courses and daily computing","Certificate-level practical training","Pathway to DIT and advanced IT courses"],
  topics:["Computer fundamentals and Windows","Typing and MS Office","Internet, email and online safety","Basic hardware and software","File management and printing","Practical assignments and final test"]},
 {name:"DIT Course",short:"DIT",icon:"🖥️",c1:"#1d4ed8",c2:"#60a5fa",desc:"Diploma in Information Technology — a broad foundation in IT and everyday computing.",
  adv:["Broader diploma-level IT knowledge","Prepares you for office, IT support and technical roles","Theory combined with hands-on practice","Builds confidence for advanced study"],
  topics:["Computer fundamentals and operating systems","Advanced MS Office","Internet and networking basics","Introduction to web and programming basics","Database basics","Projects and final assessment"]},
 {name:"CCA Course",short:"CCA",icon:"⌨️",c1:"#be123c",c2:"#fb7185",desc:"Certificate in Computer Applications — core computer applications and essential digital tools.",
  adv:["Learn essential computer applications quickly","Ideal for students and job seekers","Build confidence with digital tools","Foundation for CIT, DIT and office roles"],
  topics:["Computer basics and file management","MS Word","MS Excel","MS PowerPoint","Internet, email and cloud tools","Practical exercises and final test"]},
 {name:"Assistant IT Assistant Course",short:"IT Assistant",icon:"🛠️",c1:"#4338ca",c2:"#818cf8",desc:"An introduction to day-to-day IT support, troubleshooting and user assistance.",
  adv:["Learn day-to-day IT support skills","Fix common hardware and software problems","Prepare for help-desk and technician roles","Help offices and customers with practical solutions"],
  topics:["Computer hardware components","Installing Windows and software","Troubleshooting common problems","Networking and Wi-Fi basics","Antivirus, backup and safe computing","Help-desk basics and practical lab"]},
 {name:"Freelancing Course",short:"Freelancing",icon:"🌐",c1:"#0369a1",c2:"#38bdf8",desc:"Learn to present your skills, build a portfolio and understand freelance marketplace workflows.",
  adv:["Learn to earn online from Pakistan","Build a profile, portfolio and winning proposals","Learn client communication and project delivery","Avoid scams and work professionally"],
  topics:["Freelancing basics and choosing a skill","Profile and portfolio creation","Fiverr / Upwork workflow","Proposals and client communication","Pricing, delivery and reviews","Payments, scam awareness and growth"]},
 {name:"Data Entry Course",short:"Data Entry",icon:"⌨️",c1:"#7c3aed",c2:"#c084fc",desc:"Develop accurate data entry, spreadsheet and digital record-keeping skills.",
  adv:["Improve typing speed and accuracy","Work with Excel and Sheets professionally","Suitable for office and online data jobs","Learn data privacy and quality checking"],
  topics:["Typing practice and speed building","MS Word formatting","Excel data entry, sorting and validation","Google Sheets and online forms","Accuracy and quality checks","Practical data-entry projects"]}
];
const courseImages = [
 ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80"],
 ["https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=900&q=80"],
 ["https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1555062837-6c6d5f9e9f6f?auto=format&fit=crop&w=900&q=80"],
 ["https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1686191128892-3b4f1c1e4b8a?auto=format&fit=crop&w=900&q=80"],
 ["https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=900&q=80"],
 ["https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1574377111022-6e2b2c1f6f0d?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=900&q=80"],
 ["https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=900&q=80"],
 ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1455390582262-044c7803a2df?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80"],
 ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80"],
 ["https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80"],
 ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80"],
 ["https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=80"]
];

const imgs=i=>courses[i].images&&courses[i].images.length?courses[i].images:courseImages[i%courseImages.length];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const safe=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let articles=[];
const api=async(url,body)=>{const r=await fetch(url,body?{method:"POST",headers:{"Content-Type":"application/json","X-Requested-With":"fetch"},body:JSON.stringify(body)}:undefined);const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||"Request failed");return d};

// Broken image fallback (inline onerror is blocked by CSP, so use one delegated listener)
document.addEventListener("error",e=>{const im=e.target;if(im.tagName!=="IMG")return;im.style.display="none";const ph=im.closest(".article-photo");if(ph){ph.classList.add("image-fallback");}},true);

function renderCourseMarquee(){
 const track=$("#courseMarqueeTrack");if(!track)return;
 track.innerHTML=courses.map((c,i)=>`<a class="marquee-course" href="#courses" data-marquee-course="${i}"><img src="${imgs(i)[0]}" alt="" loading="lazy"><span>${safe(c.short)}</span></a>`).join("");
 const fit=()=>{const shift=Math.max(0,track.scrollWidth-track.parentElement.clientWidth);track.style.setProperty("--shift",shift+"px");track.style.setProperty("--dur",Math.max(12,shift/60)+"s")};
 fit();window._fit=fit;if(!window._fitBound){window._fitBound=1;addEventListener("resize",()=>window._fit());addEventListener("load",()=>window._fit())}
 track.onclick=e=>{const a=e.target.closest("[data-marquee-course]");if(a){e.preventDefault();openCourse(+a.dataset.marqueeCourse)}};
}
function renderCourses(){
 $("#courseGrid").innerHTML=courses.map((c,i)=>`<article class="course-card" tabindex="0" role="button" data-course="${i}"><div class="course-visual" style="--c1:${c.c1};--c2:${c.c2}"><img src="${imgs(i)[0]}" alt="${safe(c.name)}" loading="lazy"><span class="course-number">COURSE ${String(i+1).padStart(2,"0")}</span><span class="course-emoji">${c.icon}</span></div><div class="course-body"><h3>${safe(c.name)}</h3><p>${safe(c.desc)}</p><span class="course-more">Advantages &amp; Outline ↗</span></div></article>`).join("");
 $("#admissionCourse").innerHTML='<option value="">Select a course</option>'+courses.map(c=>`<option>${safe(c.name)}</option>`).join("");
}
function openCourse(i){
 const c=courses[i];if(!c)return;
 const intro=c.article||`${c.desc} At ${ACADEMY}, this course is taught through practical, hands-on lessons so you learn by doing. Please confirm the current fee, duration and eligibility with the academy before enrolment.`;
 const pics=imgs(i);
 $("#courseDialogContent").innerHTML=`<div class="course-dialog-content"><span class="eyebrow">${ACADEMY.toUpperCase()} • COURSE DETAILS</span><h2>${safe(c.name)}</h2>
 <p class="academy-line">Offered by <b>${ACADEMY}</b> — Institute of 4B Information Technology, Abdul Hakim, Multan Road.</p>
 <div class="article-gallery">${pics.slice(0,4).map((u,j)=>`<div class="article-photo"><img src="${safe(u)}" alt="${safe(c.name)}" loading="lazy"><small>${safe((c.topics[j%Math.max(1,c.topics.length)]||''))}</small></div>`).join("")}</div>
 <h3>About This Course</h3><p>${safe(intro)}</p>
 <h3>Advantages — Why learn this at ${ACADEMY}?</h3><ul class="course-advantages">${c.adv.map(a=>`<li>${safe(a)}</li>`).join("")}</ul>
 <h3>Course Outline</h3><ol class="course-outline">${c.topics.map((t,j)=>`<li><b>Module ${j+1}:</b> ${safe(t)}</li>`).join("")}</ol>
 <p class="form-hint">${ACADEMY} does not guarantee a job, income or trading profits. Fee, duration and certificate details: please ask the academy.</p>
 <div class="course-contact-actions"><button class="btn primary" id="applyThisCourse">Enroll Now →</button><a class="btn ghost" target="_blank" rel="noopener" href="https://wa.me/923016571821?text=${encodeURIComponent("I would like to ask about "+c.name+" at 4Bit Academy")}">WhatsApp Us</a></div></div>`;
 $("#courseDialog").showModal();
 $("#applyThisCourse").onclick=()=>{$("#courseDialog").close();const s=$("#admission");s.hidden=false;$("#admissionCourse").value=c.name;s.scrollIntoView({behavior:"smooth"})};
}
// Click the picture → picture animates. Click anywhere else on the card → advantages + outline.
$("#courseGrid").addEventListener("click",e=>{
 const card=e.target.closest("[data-course]");if(!card)return;
 const vis=e.target.closest(".course-visual");
 if(vis){const im=vis.querySelector("img");im.classList.remove("pop");void im.offsetWidth;im.classList.add("pop");im.addEventListener("animationend",()=>im.classList.remove("pop"),{once:true});return}
 openCourse(+card.dataset.course);
});
$("#courseGrid").addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-course]")){e.preventDefault();openCourse(+e.target.dataset.course)}});
$("#closeDialog").onclick=()=>$("#courseDialog").close();
$("#menuToggle").onclick=()=>$("#mainNav").classList.toggle("open");
$$("#mainNav a").forEach(a=>a.addEventListener("click",()=>$("#mainNav").classList.remove("open")));

$("#admissionForm").addEventListener("submit",async e=>{
 e.preventDefault();const f=e.currentTarget,fd=Object.fromEntries(new FormData(f));
 try{const d=await api("/api/apply",fd);$("#applicationNumber").textContent=d.applicationNo;$("#applicationDialog").showModal();f.reset()}catch(err){alert(err.message)}
});
$("#closeApplication").onclick=()=>$("#applicationDialog").close();
$("#copyApplication").onclick=async()=>{const n=$("#applicationNumber").textContent;try{await navigator.clipboard.writeText(n);$("#copyApplication").textContent="Copied ✓"}catch{$("#copyApplication").textContent=n}};
const field=(k,v)=>`<div class="result-field"><small>${safe(k)}</small><b>${safe(v||"—")}</b></div>`;
const none=(t,s)=>`<div class="empty-result"><span>!</span><b>${t}</b><small>${s}</small></div>`;
$("#lookupForm").addEventListener("submit",async e=>{e.preventDefault();
 try{const a=await api("/api/lookup?q="+encodeURIComponent($("#lookupNumber").value.trim()));const has=a.marks!==""&&a.totalMarks!=="";
  $("#lookupResult").innerHTML=`<div class="result-card"><div class="result-card-head"><div><small>4BIT ACADEMY • STUDENT RECORD</small><h3>${has?"Student Result Card":"Application Verification"}</h3></div><span class="status">${safe(a.status)}</span></div><div class="result-grid">${field("Student name",a.studentName)}${field("Father's name",a.fatherName)}${field("Application no.",a.applicationNo)}${field("Roll number",a.rollNo||"Not assigned")}${field("Registration no.",a.registrationNo||"Not assigned")}${field("Course",a.course)}${field("Phone",a.phone)}${field("CNIC / B-Form",a.cnic)}${field("Submitted",a.submittedAt)}${has?field("Marks",a.marks+" / "+a.totalMarks)+field("Grade",a.grade)+field("Remarks",a.remarks):""}</div>${has?'<div class="result-actions no-print"><button type="button" class="btn primary" id="printResult">🖨️ Print / Save as PDF</button></div>':""}</div>`}
 catch(err){$("#lookupResult").innerHTML=none("No matching record found",safe(err.message))}});
$("#verifyForm").addEventListener("submit",async e=>{e.preventDefault();
 try{const a=await api("/api/lookup?type=verify&q="+encodeURIComponent($("#verifyNumber").value.trim()));
  $("#verifyResult").innerHTML=`<div class="result-card"><div class="result-card-head"><div><small>4BIT ACADEMY • STUDENT VERIFICATION</small><h3>${safe(a.studentName)}</h3></div><span class="status">VERIFIED ✓</span></div><div class="result-grid">${field("Student name",a.studentName)}${field("Father's name",a.fatherName)}${field("Roll number",a.rollNo)}${field("Course",a.course)}${field("Admission status",a.status)}</div></div>`}
 catch(err){$("#verifyResult").innerHTML=none("Record not verified","No student with that roll number was found.")}});

renderCourses();renderCourseMarquee();
api("/api/courses").then(d=>{if(Array.isArray(d.courses)){courses=d.courses;renderCourses();renderCourseMarquee()}}).catch(()=>{});
api("/api/posts").then(d=>{if(d.posts&&d.posts.length){$("#newsGrid").innerHTML=d.posts.map(p=>`<article class="news-card"><small>${safe(p.category||"News")} • ${safe(p.date)}</small><h3>${safe(p.title)}</h3><p>${safe(p.body)}</p></article>`).join("");$("#news").hidden=false}}).catch(()=>{});

document.addEventListener("click",e=>{if(e.target.closest("#printResult")){document.body.classList.add("printing-result");window.print();setTimeout(()=>document.body.classList.remove("printing-result"),500)}});

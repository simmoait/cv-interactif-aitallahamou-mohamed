
document.getElementById('year').textContent = new Date().getFullYear();

/* ====== SECTION NAV (smooth scroll + active) ====== */
const navLinks = document.querySelectorAll('.nav-link[data-target]');
navLinks.forEach(link=>{
  link.addEventListener('click', e=>{
    e.preventDefault();
    const id = link.getAttribute('data-target');
    showSection(id);
  });
});

function showSection(sectionId){
  const sections = document.querySelectorAll('.cv-section');
  sections.forEach(s=> s.classList.remove('active'));
  const selected = document.getElementById(sectionId);
  if(selected) selected.classList.add('active');

  // animate with GSAP: fade in
  gsap.fromTo(selected, {y:20, opacity:0}, {y:0, opacity:1, duration:0.7, ease:"power2.out"});
  // Scroll to selected on smaller screens:
  selected.scrollIntoView({behavior:'smooth', block:'start'});
}

/* ===== THEME SWITCH ===== */
const themeBtn = document.getElementById('themeBtn');
themeBtn.addEventListener('click', ()=>{
  document.body.classList.toggle('dark-mode');
  const icon = themeBtn.querySelector('i');
  if(document.body.classList.contains('dark-mode')){
    icon.className = 'bi bi-sun';
  } else {
    icon.className = 'bi bi-moon-stars';
  }
});

/* ===== SMOOTH APPEAR FOR SECTIONS AT LOAD ===== */
gsap.from('.header-card', {duration: .8, y: 18, opacity:0, ease: 'power2.out'});
gsap.from('.cv-section', {duration: .8, y: 18, opacity:0, stagger: .12, delay: .15, ease: 'power2.out'});

/* ===== 3D CARD subtle parallax on mouse move ===== */
const cards = document.querySelectorAll('.card-3d');
cards.forEach(card=>{
  card.addEventListener('mousemove', (e)=>{
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (y - 0.5) * 10; // rotateX
    const ry = (x - 0.5) * -10; // rotateY
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', ()=> card.style.transform = '');
});

/* ===== TIMELINE: reveal on scroll with smooth slide from left/right ===== */
const timelineItems = document.querySelectorAll('.timeline-item');
function checkTimeline(){
  timelineItems.forEach(item=>{
    const rect = item.getBoundingClientRect();
    if(rect.top < window.innerHeight - 80){
      if(!item.classList.contains('visible')){
        item.classList.add('visible');
        // slide animation using GSAP: from left or right
        const fromX = item.classList.contains('left') ? -120 : 120;
        gsap.fromTo(item, {x:fromX, opacity:0}, {x:0, opacity:1, duration:.8, ease:'power3.out'});
      }
    }
  });
}
window.addEventListener('scroll', checkTimeline);
window.addEventListener('load', checkTimeline);

/* ===== SKILL BARS GROW ON VIEW ===== */
const skillBars = document.querySelectorAll('.skill .bar > div');
function animateSkills(){
  const skills = document.querySelectorAll('.skill .bar > div');
  skills.forEach((bar)=>{
    const rect = bar.getBoundingClientRect();
    if(rect.top < window.innerHeight - 80){
      const w = bar.style.width || '0%';
      // animate width smoothly
      gsap.fromTo(bar, {width:'0%'}, {width:w, duration:1.2, ease:'power2.out'});
    }
  });
}
window.addEventListener('scroll', animateSkills);
window.addEventListener('load', animateSkills);

/* ===== CHATBOT (mini rule-based + placeholder for real API) ===== */
const chatbotBtn = document.getElementById('chatbotBtn');
const chatbotBox = document.getElementById('chatbotBox');
const closeChatbot = document.getElementById('closeChatbot');
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatContent = document.getElementById('chatContent');

chatbotBtn.addEventListener('click', ()=> {
  chatbotBox.style.display = 'flex';
  chatbotBox.setAttribute('aria-hidden','false');
  userInput.focus();
});
closeChatbot.addEventListener('click', ()=> {
  chatbotBox.style.display = 'none';
  chatbotBox.setAttribute('aria-hidden','true');
});

/* Simple intent matching */
function botReply(text){
  const t = text.toLowerCase();
  if(t.includes('télécharger') || t.includes('pdf') || t.includes('cv')){
    return 'Tu veux télécharger le CV ? Clique sur "Télécharger PDF" en haut à droite — je peux aussi préparer un PDF personnalisé si tu veux.';
  }
  if(t.includes('compétence') || t.includes('skills')){
    return 'Mes compétences: Frontend (HTML/CSS/JS), Backend (Java/Python), Outils: Git, Docker (bases). Veux-tu un exemple de projet ?';
  }
  if(t.includes('expérience') || t.includes('stage')){
    return 'Stage 2024: Développement d’une application interne et maintenance réseau. Tu veux la description technique complète ?';
  }
  if(t.includes('conseil') || t.includes('cv') && t.includes('conseil')){
    return 'Conseil rapide: personnalise ton CV pour chaque poste, mets en avant les résultats mesurables et garde une mise en page claire.';
  }
  // fallback
  return "Bonne question ! Pour une réponse plus avancée, tu peux intégrer une vraie API (OpenAI). Veux-tu que j'ajoute le code d'intégration pour appeler une API d'IA ?";
}

/* send handler */
function appendMessage(who, text){
  const el = document.createElement('div');
  el.className = who === 'bot' ? 'bot-msg' : 'user-msg';
  el.textContent = text;
  chatContent.appendChild(el);
  chatContent.scrollTop = chatContent.scrollHeight;
}

sendBtn.addEventListener('click', ()=>{
  const text = userInput.value.trim();
  if(!text) return;
  appendMessage('user', text);
  userInput.value='';
  setTimeout(()=> appendMessage('bot', botReply(text)), 600);
});

/* allow enter key */
userInput.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter'){ e.preventDefault(); sendBtn.click(); }
});

/* ===== PDF DOWNLOAD using html2pdf ===== */
const downloadBtn = document.getElementById('downloadPdf');
downloadBtn.addEventListener('click', ()=>{
  // options
  const opt = {
    margin:       0.4,
    filename:     'CV-Mohamed-Aytallah.pdf',
    image:        { type: 'jpeg', quality: 0.95 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  // choose the node
  const element = document.getElementById('cvRoot');
  // smooth animation to ensure cards are in final state
  gsap.to(window, {scrollTo: 0, duration: 0.5, onComplete: ()=>{
    html2pdf().set(opt).from(element).save();
  }});
});

/* ===== Accessibility: focus styles keyboard navigation ===== */
document.addEventListener('keyup', (e)=>{
  if(e.key === 'Escape'){
    // close chatbot
    chatbotBox.style.display = 'none';
    chatbotBox.setAttribute('aria-hidden','true');
  }
});



// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});

// Reveal on scroll
const items = document.querySelectorAll('.timeline-item');

const reveal = () => {
    items.forEach(item => {
        let itemTop = item.getBoundingClientRect().top;
        if (itemTop < window.innerHeight - 100) {
            item.classList.add("show");
        }
    });
};

window.addEventListener("scroll", reveal);
reveal();

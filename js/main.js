
/* ---------- HERO 3D DATA GLOBE ---------- */
(function(){
  const canvas = document.getElementById('hero-canvas');
  const visual = document.querySelector('.hero-visual');
  let renderer, scene, camera, globe, particles;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init(){
    const w = visual.clientWidth, h = visual.clientHeight;
    renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
    renderer.setSize(w,h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(48, w/h, 0.1, 100);
    camera.position.z = 8.5;

    const wireGeo = new THREE.IcosahedronGeometry(2.9, 2);
    const wireMat = new THREE.MeshBasicMaterial({color:0x2A5D80, wireframe:true, transparent:true, opacity:0.3});
    globe = new THREE.Mesh(wireGeo, wireMat);
    scene.add(globe);

    const dotCount = 900;
    const dotGeo = new THREE.BufferGeometry();
    const dotPos = new Float32Array(dotCount*3);
    for(let i=0;i<dotCount;i++){
      const r = 2.9;
      const theta = Math.random()*Math.PI*2;
      const phi = Math.acos((Math.random()*2)-1);
      dotPos[i*3] = r*Math.sin(phi)*Math.cos(theta);
      dotPos[i*3+1] = r*Math.sin(phi)*Math.sin(theta);
      dotPos[i*3+2] = r*Math.cos(phi);
    }
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos,3));
    const dotMat = new THREE.PointsMaterial({color:0xF3F6FA, size:0.03, transparent:true, opacity:0.75});
    const dotCloud = new THREE.Points(dotGeo, dotMat);
    globe.add(dotCloud);

    const starGeo = new THREE.BufferGeometry();
    const starCount = 200;
    const starPos = new Float32Array(starCount*3);
    for(let i=0;i<starCount;i++){
      starPos[i*3] = (Math.random()-0.5)*16;
      starPos[i*3+1] = (Math.random()-0.5)*12;
      starPos[i*3+2] = (Math.random()-0.5)*10 - 3;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos,3));
    const starMat = new THREE.PointsMaterial({color:0x38BDF8, size:0.025, transparent:true, opacity:0.5});
    particles = new THREE.Points(starGeo, starMat);
    scene.add(particles);

    window.addEventListener('resize', onResize);
    if(!reduceMotion){
      visual.addEventListener('mousemove', onMouse);
      animate();
    } else {
      renderer.render(scene, camera);
    }
  }

  let targetX = 0, targetY = 0;
  function onMouse(e){
    const rect = visual.getBoundingClientRect();
    targetX = ((e.clientX - rect.left)/rect.width - 0.5) * 0.7;
    targetY = ((e.clientY - rect.top)/rect.height - 0.5) * 0.7;
  }
  function onResize(){
    const w = visual.clientWidth, h = visual.clientHeight;
    camera.aspect = w/h; camera.updateProjectionMatrix();
    renderer.setSize(w,h);
  }
  function animate(){
    requestAnimationFrame(animate);
    globe.rotation.y += 0.0022;
    globe.rotation.y += (targetX - globe.rotation.y*0.05)*0.01;
    globe.rotation.x += (targetY - globe.rotation.x*0.05)*0.01;
    particles.rotation.y += 0.0004;
    renderer.render(scene, camera);
  }
  if(typeof THREE !== 'undefined'){ init(); }
})();


document.addEventListener('DOMContentLoaded', () => {

    /* ---------- CERTIFICATE GLOW + LIGHTBOX ---------- */
  const certOverlay = document.getElementById('cert-modal-overlay');
  const certModalImg = document.getElementById('cert-modal-img');
  const certClose = document.getElementById('cert-modal-close');

  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.cert-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      certModalImg.src = card.dataset.img;
      certOverlay.classList.add('open');
    });
  });
  function closeCertModal(){
    certOverlay.classList.remove('open');
    document.querySelectorAll('.cert-card').forEach(c => c.classList.remove('active'));
  }
  certClose.addEventListener('click', closeCertModal);
  certOverlay.addEventListener('click', (e) => { if(e.target === certOverlay) closeCertModal(); });
  const revealEls = document.querySelectorAll('.reveal, .skill-card');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('in-view'); } });
  }, {threshold:0.15});
  revealEls.forEach(el=>io.observe(el));

  /* ---------- SKILLS ---------- */
  const skills = [
    {name:'Python', tag:'Pandas · NumPy', lvl:0.92, pct:92, color:'amber'},
    {name:'SQL', tag:'Querying & data cleaning', lvl:0.88, pct:88},
    {name:'Power BI', tag:'DAX · data modeling', lvl:0.87, pct:87},
    {name:'Tableau', tag:'Storytelling dashboards', lvl:0.82, pct:82},
    {name:'Excel', tag:'Automation & pivot analysis', lvl:0.9, pct:90},
    {name:'Data Cleaning', tag:'Workflow design', lvl:0.85, pct:85},
  ];
  const skillsGrid = document.getElementById('skills-grid');
  skills.forEach(s=>{
    const card = document.createElement('div');
    card.className = 'skill-card reveal';
    card.style.setProperty('--lvl', s.lvl);
    card.innerHTML = `
      <div class="sk-top">
        <span class="sk-name">${s.name}</span>
        <span class="sk-pct" style="color:${s.color==='amber' ? 'var(--amber)' : 'var(--cyan)'}">${s.pct}<small>%</small></span>
      </div>
      <div class="sk-tag">${s.tag}</div>
      <div class="skill-bar"><i></i></div>`;
    skillsGrid.appendChild(card);
    io.observe(card);
  });

 /* ---------- GITHUB PROJECTS (curated list) ---------- */
const GITHUB_USER = 'theakash07';

// List only the repos you want shown, in the order you want them to appear.
const FEATURED_REPOS = [
  'Dashboards',
  'Portfolio',
  // add more repo names here
];
const CATEGORY_OVERRIDES = {
  'Dashboards': 'dashboard',
  'Portfolio':'automation',
  // 'some-other-repo-name': 'machine learning',
};

const projectGrid = document.getElementById('project-grid');
const projStatus = document.getElementById('proj-status');
const langColors = {Python:'#3572A5','Jupyter Notebook':'#DA5B0B',JavaScript:'#f1e05a',HTML:'#e34c26',CSS:'#563d7c',SQL:'#e38c00',TypeScript:'#3178c6',default:'#8FA0B8'};
let allRepos = [];

function categorize(repo){
  const text = `${repo.name} ${repo.description||''}`.toLowerCase();
  if(/dashboard|visual|chart|report/.test(text)) return 'dashboard';
  if(/clean|wrangle|etl/.test(text)) return 'data cleaning';
  if(/automat|script|pipeline/.test(text)) return 'automation';
  if(/model|predict|ml|learning|neural/.test(text)) return 'machine learning';
  return 'analysis';
}

function renderProjects(repos){
  projectGrid.innerHTML = '';
  if(!repos.length){ projectGrid.innerHTML = '<div class="empty-state">No repositories match this filter.</div>'; return; }
  repos.forEach(repo=>{
    const cat = categorize(repo);
    const langColor = langColors[repo.language] || langColors.default;
    const card = document.createElement('div');
    card.className = 'project-card reveal in-view';
    card.innerHTML = `
      <div class="p-top">
        <div class="p-icon">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="#8FA0B8"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
        </div>
        <span class="p-ext">↗</span>
      </div>
      <h3>${repo.name}</h3>
      <p>${repo.description ? repo.description : 'No description provided for this repository.'}</p>
      <div class="cat-pill">${cat}</div>
      <div class="p-meta">
        <span><i class="lang-dot" style="background:${langColor}"></i>${repo.language || 'N/A'}</span>
        <span>★ ${repo.stargazers_count}</span>
        <span>⑂ ${repo.forks_count}</span>
      </div>`;
    card.addEventListener('click', ()=> window.open(repo.html_url, '_blank'));
    projectGrid.appendChild(card);
  });
}

document.querySelectorAll('.filter-pill').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.filter-pill').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    const filtered = f === 'all' ? allRepos : allRepos.filter(r=> categorize(r) === f);
    renderProjects(filtered);
  });
});

projStatus.innerHTML = `<span class="dot"></span> Loading selected repos…`;
Promise.all(
  FEATURED_REPOS.map(name =>
    fetch(`https://api.github.com/repos/${GITHUB_USER}/${name}`).then(res => res.ok ? res.json() : null)
  )
).then(results=>{
  allRepos = results.filter(r => r !== null);
  if(!allRepos.length){
    projStatus.innerHTML = `<span class="dot" style="background:#F76A6A;box-shadow:0 0 8px #F76A6A;"></span> Couldn't load the selected repos — check the names in FEATURED_REPOS.`;
    return;
  }
  projStatus.innerHTML = `<span class="dot"></span> Selected repos from github.com/${GITHUB_USER}`;
  renderProjects(allRepos);
}).catch(()=>{
  projStatus.innerHTML = `<span class="dot" style="background:#F76A6A;box-shadow:0 0 8px #F76A6A;"></span> Could not reach GitHub.`;
});

  /* ---------- BLOG (persistent storage) ---------- */
  const blogList = document.getElementById('blog-list');
  const blogTitle = document.getElementById('blog-title');
  const blogBody = document.getElementById('blog-body');
  const blogPublish = document.getElementById('blog-publish');
  const BLOG_KEY = 'blog:posts';

  async function loadPosts(){
    try{ const res = await window.storage.get(BLOG_KEY, false); return res ? JSON.parse(res.value) : []; }
    catch(e){ return []; }
  }
  async function savePosts(posts){
    try{ await window.storage.set(BLOG_KEY, JSON.stringify(posts), false); }
    catch(e){ console.error('Could not save blog posts', e); }
  }
  function renderPosts(posts){
    if(!posts.length){ blogList.innerHTML = '<div class="empty-state">No entries yet — publish your first note.</div>'; return; }
    blogList.innerHTML = '';
    posts.slice().reverse().forEach(post=>{
      const el = document.createElement('div');
      el.className = 'blog-post';
      el.innerHTML = `
        <div class="b-meta"><span>${new Date(post.date).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})}</span><button class="b-del" data-id="${post.id}">Delete</button></div>
        <h4>${post.title}</h4>
        <div class="b-body">${post.body}</div>`;
      blogList.appendChild(el);
    });
    blogList.querySelectorAll('.b-del').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        let posts = await loadPosts();
        posts = posts.filter(p=> String(p.id) !== btn.dataset.id);
        await savePosts(posts);
        renderPosts(posts);
      });
    });
  }
  loadPosts().then(renderPosts);
  blogPublish.addEventListener('click', async ()=>{
    const title = blogTitle.value.trim();
    const body = blogBody.value.trim();
    if(!title || !body) return;
    const posts = await loadPosts();
    posts.push({id:Date.now(), title, body, date:new Date().toISOString()});
    await savePosts(posts);
    renderPosts(posts);
    blogTitle.value=''; blogBody.value='';
  });

/* ---------- YOUTUBE (static list — edit this array to add videos) ---------- */
const videoGrid = document.getElementById('video-grid');

// Add a new video by copying a line below.
// Get the videoId from the YouTube URL: youtube.com/watch?v=THIS_PART
//https://youtu.be/zGm8i_WWDc4?
const videos = [
  { title: "Cleaning messy sales data with Pandas", videoId: "==aCYLLZygMGYG-pMQ" },
  { title: "Building my first Power BI dashboard", videoId: "dQw4w9WgXcQ" },
];

function renderVideos(list){
  if(!list.length){ videoGrid.innerHTML = '<div class="empty-state">No videos yet — check back soon.</div>'; return; }
  videoGrid.innerHTML = '';
  list.forEach(v=>{
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
      <div class="video-frame"><iframe src="https://www.youtube.com/embed/${v.videoId}" title="${v.title}" allowfullscreen loading="lazy"></iframe></div>
      <div class="video-info"><span>${v.title}</span></div>`;
    videoGrid.appendChild(card);
  });
}
renderVideos(videos);

  /* ---------- CONTACT FORM (mailto) ---------- */
  document.getElementById('contact-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    const inputs = e.target.querySelectorAll('input, textarea');
    const [name, email, message] = inputs;
    const subject = encodeURIComponent(`Portfolio contact from ${name.value}`);
    const body = encodeURIComponent(`${message.value}\n\n— ${name.value} (${email.value})`);
    window.location.href = `mailto:theakash.bussiness07@gmail.com?subject=${subject}&body=${body}`;
  });

  

});

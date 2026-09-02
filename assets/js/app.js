async function getProjects(){
  const res = await fetch("data/projects.json");
  return await res.json();
}

function setYear(){
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

function projectCard(p){
  const tech = (p.tech || []).map(t => `<span class="badge">${t}</span>`).join("");
  const url = `project.html?id=${encodeURIComponent(p.id)}`;

  return `
    <article class="project">
      <div class="badge">${p.category || "App"}</div>
      <h3 style="margin:10px 0 6px;">${p.title}</h3>
      <p class="muted" style="margin:0 0 10px;">${p.desc || ""}</p>
      <div class="tech">${tech}</div>
      <div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap;">
        <a class="btn btn-ghost" href="${url}">Details</a>
        ${p.demo ? `<a class="btn" href="${p.demo}" target="_blank" rel="noreferrer">Demo</a>` : ``}
      </div>
    </article>
  `;
}

async function loadFeaturedProjects(targetId, limit=3){
  const grid = document.getElementById(targetId);
  if (!grid) return;
  const all = await getProjects();
  const featured = all.slice(0, limit);
  grid.innerHTML = featured.map(projectCard).join("");
}

async function setupProjectsPage(){
  const grid = document.getElementById("projectsGrid");
  const searchInput = document.getElementById("searchInput");
  const categorySelect = document.getElementById("categorySelect");

  const all = await getProjects();

  // fill categories
  const cats = Array.from(new Set(all.map(p => p.category).filter(Boolean)));
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    categorySelect.appendChild(opt);
  });

  function render(){
    const q = (searchInput.value || "").toLowerCase().trim();
    const cat = categorySelect.value;

    const filtered = all.filter(p => {
      const inCat = (cat === "all") ? true : (p.category === cat);
      const text = `${p.title} ${p.desc} ${(p.tech||[]).join(" ")}`.toLowerCase();
      const inSearch = q ? text.includes(q) : true;
      return inCat && inSearch;
    });

    grid.innerHTML = filtered.map(projectCard).join("") || `<p class="muted">No projects found.</p>`;
  }

  searchInput.addEventListener("input", render);
  categorySelect.addEventListener("change", render);

  render();
}

async function setupProjectDetailsPage(){
  const detail = document.getElementById("detail");
  if (!detail) return;

  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  const all = await getProjects();
  const p = all.find(x => x.id === id) || all[0];

  if (!p){
    detail.innerHTML = `<h1>Project not found</h1>`;
    return;
  }

  const tech = (p.tech || []).map(t => `<span class="badge">${t}</span>`).join("");
  const links = `
    ${p.demo ? `<a class="btn" href="${p.demo}" target="_blank" rel="noreferrer">Live Demo</a>` : ``}
    ${p.github ? `<a class="btn btn-ghost" href="${p.github}" target="_blank" rel="noreferrer">GitHub</a>` : ``}
  `;

  detail.innerHTML = `
    <h1 style="margin-bottom:6px;">${p.title}</h1>
    <p class="muted" style="margin-top:0;">${p.category || "App"} project</p>

    <div class="card" style="margin-top:14px;">
      <h3>Overview</h3>
      <p class="muted">${p.longDesc || p.desc || ""}</p>

      <h3 style="margin-top:14px;">Tech Stack</h3>
      <div class="tech">${tech}</div>

      <h3 style="margin-top:14px;">Links</h3>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">${links || `<span class="muted">No links added.</span>`}</div>
    </div>
  `;
}

function fakeSubmit(e){
  e.preventDefault();
  const el = document.getElementById("contactMsg");
  if (el) el.textContent = "Thanks! (This is a demo form. Tell me if you want real email submission.)";
      }

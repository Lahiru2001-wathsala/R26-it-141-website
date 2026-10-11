/* =========================================================
   EDIT YOUR CONTENT HERE
   Update dates, marks, status and file links in these lists.
   Files can be added in two ways:
   1. Team upload panel on the live Vercel site (footer > Team upload).
   2. Put a PDF in /documents or /slides and set "link",
      e.g. "documents/proposal.pdf". Uploaded files take priority.
   Items with no file show "Pending submission".
   ========================================================= */

const MILESTONES = [
  {
    name: "Project Proposal",
    date: "January 2026",
    marks: "To be updated",
    status: "Completed",
    details: "Topic Assessment Form approval, proposal document and proposal presentation describing the research problem, gap, objectives and individual components."
  },
  {
    name: "Progress Presentation 1",
    date: "To be updated",
    marks: "To be updated",
    status: "Completed",
    details: "Demonstration of about 50% completion: data collection, preprocessing pipeline, initial models and the system architecture."
  },
  {
    name: "Progress Presentation 2",
    date: "To be updated",
    marks: "To be updated",
    status: "Upcoming",
    details: "Demonstration of about 90% completion: trained and evaluated models, integrated backend services and working user interfaces."
  },
  {
    name: "Research Paper",
    date: "To be updated",
    marks: "To be updated",
    status: "Upcoming",
    details: "Group research paper submitted to a conference or journal describing the system and its evaluation."
  },
  {
    name: "Final Report",
    date: "To be updated",
    marks: "To be updated",
    status: "Upcoming",
    details: "Group final report and individual theses for each research component."
  },
  {
    name: "Final Presentation and Viva",
    date: "To be updated",
    marks: "To be updated",
    status: "Upcoming",
    details: "Final demonstration of the complete integrated system followed by individual viva examinations."
  },
  {
    name: "Website Assessment",
    date: "To be updated",
    marks: "To be updated",
    status: "In progress",
    details: "Project website presenting the domain, milestones, documents, presentations and the research team."
  }
];

const DOCUMENTS = [
  { title: "Topic Assessment Form", type: "PDF", link: "", note: "Revised version V2.1" },
  { title: "Project Charter", type: "PDF", link: "" },
  { title: "Proposal Document", type: "PDF", link: "" },
  { title: "Status / Check List Documents", type: "PDF", link: "" },
  { title: "Research Paper", type: "PDF", link: "" },
  { title: "Final Group Report", type: "PDF", link: "" },
  { title: "Individual Thesis – IT22176356", type: "PDF", link: "" },
  { title: "Individual Thesis – IT22137746", type: "PDF", link: "" },
  { title: "Individual Thesis – IT22540126", type: "PDF", link: "" },
  { title: "Individual Thesis – IT22905390", type: "PDF", link: "" }
];

const SLIDES = [
  { title: "Proposal Presentation", type: "Slides", link: "" },
  { title: "Progress Presentation 1", type: "Slides", link: "" },
  { title: "Progress Presentation 2", type: "Slides", link: "" },
  { title: "Final Presentation", type: "Slides", link: "" }
];

const TEAM_EMAIL = "it22176356@my.sliit.lk"; // address used by the contact form

/* ================= Do not edit below unless needed ================= */

// Mobile navigation
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".main-nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}));

// Highlight the current section in the navigation
const links = [...nav.querySelectorAll("a")];
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach(s => observer.observe(s));

// Domain tabs
const tabs = [...document.querySelectorAll('[role="tab"]')];
tabs.forEach(tab => tab.addEventListener("click", () => selectTab(tab)));
tabs.forEach((tab, i) => tab.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") { tabs[(i + 1) % tabs.length].focus(); selectTab(tabs[(i + 1) % tabs.length]); }
  if (e.key === "ArrowLeft") { tabs[(i - 1 + tabs.length) % tabs.length].focus(); selectTab(tabs[(i - 1 + tabs.length) % tabs.length]); }
}));
function selectTab(tab) {
  tabs.forEach(t => {
    const active = t === tab;
    t.setAttribute("aria-selected", active);
    document.getElementById(t.getAttribute("aria-controls")).hidden = !active;
  });
}

// Milestones
const statusClass = s => s.toLowerCase().replace(/\s+/g, "-");
const select = document.getElementById("milestone-select");
const detail = document.getElementById("milestone-detail");
const timeline = document.getElementById("milestone-timeline");

MILESTONES.forEach((m, i) => {
  select.insertAdjacentHTML("beforeend", `<option value="${i}">${m.name}</option>`);
  timeline.insertAdjacentHTML("beforeend",
    `<li class="${statusClass(m.status)}"><button data-i="${i}"><span class="tl-name">${m.name}</span><span class="tl-date">${m.date}</span></button></li>`);
});
function showMilestone(i) {
  const m = MILESTONES[i];
  select.value = i;
  detail.innerHTML = `
    <div class="milestone-top"><h3>${m.name}</h3><span class="status ${statusClass(m.status)}">${m.status}</span></div>
    <p>${m.details}</p>
    <dl><div><dt>Date</dt><dd>${m.date}</dd></div><div><dt>Marks allocated</dt><dd>${m.marks}</dd></div></dl>`;
  timeline.querySelectorAll("li").forEach((li, k) => li.classList.toggle("current", k === i));
}
select.addEventListener("change", () => showMilestone(Number(select.value)));
timeline.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (b) showMilestone(Number(b.dataset.i));
});
showMilestone(0);

// ================= Documents and slides =================
const BLOB_VERSION = "0.27.0"; // must match package.json
const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
let REMOTE = [];        // files uploaded through the admin panel (Vercel Blob)
let API_OK = false;     // true only when the site runs on Vercel with the API

function latestFor(folder, title) {
  const prefix = `${folder}/${slug(title)}`;
  return REMOTE.filter(f => f.pathname.startsWith(prefix + "-") || f.pathname.startsWith(prefix + "."))
               .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];
}
const fmtSize = b => b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB";

function renderCards(list, el, folder) {
  el.innerHTML = list.map(d => {
    const r = latestFor(folder, d.title);
    const view = r ? r.url : d.link;
    const down = r ? r.downloadUrl : d.link;
    const meta = r ? `Updated ${new Date(r.uploadedAt).toLocaleDateString()} · ${fmtSize(r.size)}` : (d.note || "");
    return `
    <article class="doc-card">
      <div class="doc-icon" aria-hidden="true">${folder === "slides" ? "&#9638;" : "&#9776;"}</div>
      <div class="doc-body">
        <h3>${d.title}</h3>
        ${meta ? `<p>${meta}</p>` : ""}
        ${view ? "" : `<span class="doc-pending">Pending submission</span>`}
        <div class="doc-actions">
          ${view ? `<a class="doc-link" href="${view}" target="_blank" rel="noopener">View</a><a class="doc-link" href="${down}" download>Download</a>` : ""}
          <button type="button" class="doc-upload" data-upload="${folder}|${d.title}">${view ? "Replace" : "Upload"}</button>
        </div>
      </div>
    </article>`;
  }).join("");
}
function renderAll() {
  renderCards(DOCUMENTS, document.getElementById("doc-grid"), "documents");
  renderCards(SLIDES, document.getElementById("slide-grid"), "slides");
  renderAdminList();
}
async function loadRemote() {
  try {
    const res = await fetch("/api/files");
    if (!res.ok) throw new Error();
    REMOTE = (await res.json()).files || [];
    API_OK = true;
  } catch { API_OK = false; }
  renderAll();
}
renderAll();
loadRemote();

// ================= Team upload panel =================
const dialog = document.getElementById("admin-dialog");
const targetSel = document.getElementById("admin-target");
const adminMsg = document.getElementById("admin-msg");
const progress = document.getElementById("admin-progress");

targetSel.innerHTML =
  `<optgroup label="Documents">${DOCUMENTS.map(d => `<option value="documents|${d.title}">${d.title}</option>`).join("")}</optgroup>` +
  `<optgroup label="Presentations">${SLIDES.map(d => `<option value="slides|${d.title}">${d.title}</option>`).join("")}</optgroup>`;

function openAdmin(target) {
  if (target) targetSel.value = target;
  adminMsg.textContent = API_OK ? "" : "You opened the site from your computer. Uploading starts working after the site is deployed on Vercel with Blob storage connected (see README).";
  adminMsg.className = API_OK ? "admin-msg" : "admin-msg warn";
  dialog.showModal();
}
document.querySelectorAll("[data-open-admin]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); openAdmin(); }));
document.addEventListener("click", e => {
  const b = e.target.closest("[data-upload]");
  if (b) openAdmin(b.dataset.upload);
});
document.getElementById("admin-close").addEventListener("click", () => dialog.close());

function say(text, kind = "") { adminMsg.textContent = text; adminMsg.className = "admin-msg " + kind; }

document.getElementById("admin-form").addEventListener("submit", async e => {
  e.preventDefault();
  const password = e.target.password.value;
  const file = e.target.file.files[0];
  if (!file) return say("Choose a file to upload.", "warn");
  const [folder, title] = targetSel.value.split("|");
  const ext = (file.name.split(".").pop() || "pdf").toLowerCase();
  const btn = e.target.querySelector("button[type=submit]");
  btn.disabled = true; progress.hidden = false; progress.value = 0;
  say(`Uploading ${file.name}...`);
  try {
    const { upload } = await import(`https://esm.sh/@vercel/blob@${BLOB_VERSION}/client`);
    await upload(`${folder}/${slug(title)}.${ext}`, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
      clientPayload: JSON.stringify({ password }),
      multipart: file.size > 5 * 1024 * 1024,
      onUploadProgress: p => { progress.value = p.percentage; }
    });
    say(`Uploaded. "${title}" is now available to view and download.`, "ok");
    e.target.file.value = "";
    await loadRemote();
  } catch (err) {
    say("Upload failed: " + (err.message || err), "warn");
  } finally {
    btn.disabled = false; progress.hidden = true;
  }
});

function renderAdminList() {
  const box = document.getElementById("admin-files");
  if (!box) return;
  if (!REMOTE.length) { box.innerHTML = '<p class="form-hint">No uploaded files yet.</p>'; return; }
  box.innerHTML = REMOTE.slice().sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)).map(f => `
    <li><a href="${f.url}" target="_blank" rel="noopener">${f.pathname}</a>
      <span>${fmtSize(f.size)}</span>
      <button type="button" class="link-btn" data-del="${f.url}">Delete</button></li>`).join("");
}
document.getElementById("admin-files").addEventListener("click", async e => {
  const url = e.target.dataset.del;
  if (!url) return;
  const password = document.querySelector("#admin-form [name=password]").value;
  if (!password) return say("Enter the team password first.", "warn");
  if (!confirm("Delete this file?")) return;
  const res = await fetch("/api/files", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password, url }) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return say("Delete failed: " + (data.error || res.status), "warn");
  say("File deleted.", "ok");
  loadRemote();
});

// Contact form: opens the visitor's email app with a filled template
document.getElementById("contact-form").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = `Dear R26-IT-141 team,\n\n${f.get("message")}\n\nKind regards,\n${f.get("name")}\n${f.get("email")}`;
  window.location.href = `mailto:${TEAM_EMAIL}?subject=${encodeURIComponent(f.get("subject"))}&body=${encodeURIComponent(body)}`;
});

document.getElementById("year").textContent = new Date().getFullYear();

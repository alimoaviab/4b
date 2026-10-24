// 4Bit Academy — Complete Admin Dashboard Logic
// Handles Admissions, Results, Announcements, Courses, and Security with Vector SVG Icons

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

// ─── Crisp SVG Icon Library (Zero Emojis) ───────────────────────────────────
const ICONS = {
  admissions: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  results: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>`,
  posts: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>`,
  courses: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg>`,
  security: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  logout: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>`,
  search: `<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  check: `<svg class="svg-icon" viewBox="0 0 24 24" stroke-width="2.3"><polyline points="20 6 9 17 4 12"/></svg>`,
  cross: `<svg class="svg-icon" viewBox="0 0 24 24" stroke-width="2.3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  details: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  edit: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
  trash: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>`,
  print: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>`,
  copy: `<svg class="svg-icon" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  clock: `<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  fileText: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  save: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
  key: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="m21 2-2 2m-1.5 1.5L16 7l-1.5 1.5M16 4l4 4-9.5 9.5a5 5 0 1 1-4-4L16 4z"/></svg>`,
  plus: `<svg class="svg-icon" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  folder: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  bolt: `<svg class="svg-icon" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  settings: `<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  eye: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`,
  user: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  lock: `<svg class="svg-icon" viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  shield: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  checkCircle: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
};

let state = { apps: [], posts: [], courses: [] };
let curTab = "applications";
let filterStatus = "all";
let searchQuery = "";
let edit = { post: null, course: null, result: null };

// ─── API Helper ─────────────────────────────────────────────────────────────
async function api(url, body) {
  let r;
  const token = localStorage.getItem("4b_token") || "";
  const headers = {
    "X-Requested-With": "fetch"
  };
  if (token) {
    headers["X-Session-Token"] = token;
    headers["Authorization"] = "Bearer " + token;
  }
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  try {
    r = await fetch(url, {
      method: body !== undefined ? "POST" : "GET",
      credentials: "include",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch (e) {
    throw new Error(location.protocol === "file:"
      ? "Yeh page file ki tarah khula hai. Isay http://localhost:3000/admin.html se kholein."
      : "Server se rabta nahi hua. Check karein server port 3000 par chal raha hai.");
  }

  const d = await r.json().catch(() => ({}));
  if (r.status === 401 && url.startsWith("/api/admin/") && !/login|password/.test(url)) {
    localStorage.removeItem("4b_token");
    showLoginView();
  }
  if (!r.ok) {
    const err = new Error(d.error || ("Request failed with status " + r.status));
    err.status = r.status;
    throw err;
  }
  return d;
}

function showLoginView() {
  localStorage.removeItem("4b_token");
  $("#dash").hidden = true;
  $("#authWrap").hidden = false;
  $$(".msg").forEach(m => m.className = "msg");
}

function showDashView() {
  $("#authWrap").hidden = true;
  $("#dash").hidden = false;
}

const showMsg = (id, text, ok = false) => {
  const el = $("#" + id);
  if (!el) return;
  el.textContent = text;
  el.className = "msg " + (ok ? "ok" : "err");
};

// ─── Password Strength & Generator ──────────────────────────────────────────
function genPassword(len = 20) {
  const sets = ["ABCDEFGHJKLMNPQRSTUVWXYZ", "abcdefghijkmnopqrstuvwxyz", "23456789", "!@#$%^&*-_?"];
  const all = sets.join("");
  const pick = s => {
    const m = Math.floor(256 / s.length) * s.length;
    let b;
    do { b = crypto.getRandomValues(new Uint8Array(1))[0]; } while (b >= m);
    return s[b % s.length];
  };
  const out = sets.map(pick);
  while (out.length < len) out.push(pick(all));
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(crypto.getRandomValues(new Uint8Array(1))[0] / 256 * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.join("");
}

function calcStrength(p) {
  let s = 0;
  if (!p) return 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 5);
}

// ─── Data Loading & Dashboard Initialization ────────────────────────────────
async function loadDashData(tabToOpen = curTab) {
  try {
    const [dashData, coursesData, meData] = await Promise.all([
      api("/api/admin/apps"),
      api("/api/courses").catch(() => ({ courses: [] })),
      api("/api/admin/me").catch(() => null)
    ]);

    state = {
      apps: Array.isArray(dashData.apps) ? dashData.apps : [],
      posts: Array.isArray(dashData.posts) ? dashData.posts : [],
      courses: Array.isArray(coursesData.courses) && coursesData.courses.length
        ? coursesData.courses
        : (Array.isArray(dashData.courses) ? dashData.courses : []),
      adminUsername: (meData && meData.username) || state.adminUsername || localStorage.getItem("4b_user") || "admin",
      adminUpdatedAt: (meData && meData.updatedAt) || state.adminUpdatedAt || null
    };

    updateBadgeCounts();
    showDashView();
    renderTab(tabToOpen);
  } catch (err) {
    console.error("[loadDashData error]", err);
    showLoginView();
    showMsg("mLogin", "Please sign in to access the Academy dashboard.");
  }
}

function updateBadgeCounts() {
  const apps = state.apps || [];
  const resultsCount = apps.filter(a => a.marks !== "" && a.marks !== undefined && a.marks !== null).length;
  const bApps = $("#bCountApps");
  const bRes = $("#bCountResults");
  const bPosts = $("#bCountPosts");
  const bCourses = $("#bCountCourses");

  if (bApps) bApps.textContent = apps.length;
  if (bRes) bRes.textContent = resultsCount;
  if (bPosts) bPosts.textContent = (state.posts || []).length;
  if (bCourses) bCourses.textContent = (state.courses || []).length;
}

// ─── Tab Rendering Router ───────────────────────────────────────────────────
function renderTab(tab) {
  curTab = tab;
  localStorage.setItem("4b_admin_tab", tab);
  if (location.hash !== "#" + tab) {
    try { history.replaceState(null, "", "#" + tab); } catch {}
  }
  $$(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  const root = $("#tabBody");
  if (!root) return;

  try {
    if (tab === "applications") renderApplicationsTab(root);
    else if (tab === "results") renderResultsTab(root);
    else if (tab === "posts") renderPostsTab(root);
    else if (tab === "courses") renderCoursesTab(root);
    else if (tab === "settings") renderSettingsTab(root);
  } catch (e) {
    console.error("[renderTab error]", e);
    root.innerHTML = `<div class="msg err" style="display:block">Error rendering tab: ${esc(e.message)}</div>`;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// TAB 1: ADMISSIONS / APPLICATIONS
// ═════════════════════════════════════════════════════════════════════════════
function renderApplicationsTab(root) {
  const apps = state.apps || [];
  const pendingCount = apps.filter(a => (a.status || 'Pending').toLowerCase() === 'pending').length;
  const acceptedCount = apps.filter(a => (a.status || '').toLowerCase() === 'accepted').length;
  const rejectedCount = apps.filter(a => (a.status || '').toLowerCase() === 'rejected').length;

  // Filter apps
  const filtered = apps.filter(a => {
    const statusMatch = filterStatus === "all" || (a.status || "Pending").toLowerCase() === filterStatus.toLowerCase();
    if (!statusMatch) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (a.applicationNo || "").toLowerCase().includes(q) ||
      (a.studentName || "").toLowerCase().includes(q) ||
      (a.fatherName || "").toLowerCase().includes(q) ||
      (a.phone || "").toLowerCase().includes(q) ||
      (a.cnic || "").toLowerCase().includes(q) ||
      (a.course || "").toLowerCase().includes(q)
    );
  });

  root.innerHTML = `
    <!-- Metrics Cards -->
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-icon blue">${ICONS.fileText}</div>
        <div>
          <div class="stat-val">${apps.length}</div>
          <div class="stat-lbl">Total Applications</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon yellow">${ICONS.clock}</div>
        <div>
          <div class="stat-val">${pendingCount}</div>
          <div class="stat-lbl">Pending Review</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">${ICONS.check}</div>
        <div>
          <div class="stat-val">${acceptedCount}</div>
          <div class="stat-lbl">Accepted Students</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red">${ICONS.cross}</div>
        <div>
          <div class="stat-val">${rejectedCount}</div>
          <div class="stat-lbl">Rejected</div>
        </div>
      </div>
    </div>

    <!-- Toolbar: Filter Pills & Search -->
    <div class="filter-bar">
      <div class="filter-pills">
        <button class="fpill ${filterStatus === 'all' ? 'active' : ''}" data-filter="all">All (${apps.length})</button>
        <button class="fpill ${filterStatus === 'pending' ? 'active' : ''}" data-filter="pending">Pending (${pendingCount})</button>
        <button class="fpill ${filterStatus === 'accepted' ? 'active' : ''}" data-filter="accepted">Accepted (${acceptedCount})</button>
        <button class="fpill ${filterStatus === 'rejected' ? 'active' : ''}" data-filter="rejected">Rejected (${rejectedCount})</button>
      </div>
      <div class="search-box">
        <span class="search-icon">${ICONS.search}</span>
        <input id="appSearch" type="text" placeholder="Search by name, app #, CNIC, phone..." value="${esc(searchQuery)}">
      </div>
    </div>

    <!-- Applications Table -->
    ${filtered.length ? `
      <div class="table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Student &amp; Application</th>
              <th>Course Applied</th>
              <th>Contact &amp; CNIC</th>
              <th>Assigned IDs</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(a => {
              const st = (a.status || 'Pending').toLowerCase();
              return `
                <tr>
                  <td>
                    <b>${esc(a.studentName || 'Unnamed Student')}</b>
                    <br><span class="app-badge" title="Click to copy" data-copy-text="${esc(a.applicationNo)}">${esc(a.applicationNo)} ${ICONS.copy}</span>
                    <br><small style="color:#64748b">Father: ${esc(a.fatherName || '—')}</small>
                    <br><small style="color:#94a3b8;font-size:10px">${esc(a.submittedAt || '')}</small>
                  </td>
                  <td>
                    <b style="color:#0369a1">${esc(a.course || '—')}</b>
                    <br><small style="color:#64748b">${esc(a.education || '')}</small>
                  </td>
                  <td>
                    <b>${esc(a.phone || '—')}</b>
                    <br><small style="color:#64748b">${esc(a.cnic || '—')}</small>
                    ${a.address ? `<br><small style="color:#94a3b8">${esc(a.address)}</small>` : ''}
                  </td>
                  <td>
                    ${a.rollNo || a.registrationNo ? `
                      <span style="font-weight:700;color:#0f172a">Roll: ${esc(a.rollNo || '—')}</span><br>
                      <small style="color:#64748b">Reg: ${esc(a.registrationNo || '—')}</small><br>
                      <button class="action-btn" data-action="assign-ids" data-no="${esc(a.applicationNo)}" style="margin-top:4px">${ICONS.edit} Edit IDs</button>
                    ` : `
                      <button class="action-btn primary" data-action="assign-ids" data-no="${esc(a.applicationNo)}">${ICONS.plus} Assign IDs</button>
                    `}
                  </td>
                  <td>
                    <span class="pill-status ${st}">${esc(a.status || 'Pending')}</span>
                  </td>
                  <td>
                    <div class="action-group">
                      ${st !== 'accepted' ? `<button class="action-btn accept" data-action="status" data-st="Accepted" data-no="${esc(a.applicationNo)}">${ICONS.check} Accept</button>` : ''}
                      ${st !== 'rejected' ? `<button class="action-btn reject" data-action="status" data-st="Rejected" data-no="${esc(a.applicationNo)}">${ICONS.cross} Reject</button>` : ''}
                      <button class="action-btn" data-action="view-details" data-no="${esc(a.applicationNo)}">${ICONS.details} Details</button>
                      <button class="action-btn primary" data-action="go-result" data-no="${esc(a.applicationNo)}">${ICONS.results} Result</button>
                      <button class="action-btn reject" data-action="del-app" data-no="${esc(a.applicationNo)}">${ICONS.trash} Delete</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    ` : `
      <div style="text-align:center;padding:50px 20px;background:#fff;border:1px dashed #cbd5e1;border-radius:14px;color:#64748b">
        <div style="font-size:32px;margin-bottom:8px;color:#94a3b8">${ICONS.folder}</div>
        <b style="font-size:16px;color:#0f172a">No applications found</b>
        <p style="font-size:13px;margin:6px 0 0">No records match the current filter or search criteria.</p>
      </div>
    `}
  `;
}

// ═════════════════════════════════════════════════════════════════════════════
// TAB 2: RESULTS MANAGEMENT & CERTIFICATES
// ═════════════════════════════════════════════════════════════════════════════
function renderResultsTab(root) {
  const apps = state.apps || [];
  const r = edit.result || {};
  const hasEdit = Boolean(edit.result);

  // Applications that have results entered
  const withResults = apps.filter(a => a.marks !== "" && a.marks !== undefined && a.marks !== null);

  root.innerHTML = `
    <div class="two-col-grid" style="align-items:start">
      <!-- Result Entry / Edit Form -->
      <div class="adm-card adm-card-pad" style="border:1px solid #cbd5e1">
        <h3 class="section-title">
          ${hasEdit ? ICONS.edit : ICONS.plus}
          <span>${hasEdit ? "Edit Student Result" : "Add / Update Student Result"}</span>
          ${hasEdit ? `<span class="pill-status accepted" style="margin-left:auto">Editing ${esc(r.applicationNo)}</span>` : ""}
        </h3>

        <!-- Student Selector Quick Dropdown -->
        <label style="display:grid;gap:6px;font-size:12px;font-weight:700;color:#334155;margin-bottom:14px">
          Quick-select student from applications:
          <select id="quickStudentSelect" style="padding:10px;border-radius:8px;border:1px solid #cbd5e1;background:#fff;font-size:13px">
            <option value="">-- Choose a student to auto-fill --</option>
            ${apps.map(a => `
              <option value="${esc(a.applicationNo)}" ${a.applicationNo === r.applicationNo ? 'selected' : ''}>
                ${esc(a.applicationNo)} — ${esc(a.studentName)} (${esc(a.course)})
              </option>
            `).join("")}
          </select>
        </label>

        <form class="adm-form" id="fResult">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <label>
              Application Number *
              <input name="applicationNo" id="resAppNo" required placeholder="4B-2026-0001" value="${esc(r.applicationNo || '')}">
            </label>
            <label>
              Student Name (Preview)
              <input id="resStudentPreview" readonly placeholder="Auto-filled from records" style="background:#f1f5f9;color:#475569" value="${esc(r.studentName || '')}">
            </label>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <label>
              Roll Number
              <input name="rollNo" id="resRollNo" placeholder="e.g. 1001" value="${esc(r.rollNo || '')}">
            </label>
            <label>
              Registration Number
              <input name="registrationNo" id="resRegNo" placeholder="e.g. REG-4B-2026-01" value="${esc(r.registrationNo || '')}">
            </label>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
            <label>
              Marks Obtained *
              <input name="marks" id="resMarks" type="number" min="0" required placeholder="85" value="${esc(r.marks ?? '')}">
            </label>
            <label>
              Total Marks *
              <input name="totalMarks" id="resTotal" type="number" min="1" required placeholder="100" value="${esc(r.totalMarks || 100)}">
            </label>
            <label>
              Grade
              <input name="grade" id="resGrade" placeholder="A+" value="${esc(r.grade || '')}">
            </label>
          </div>

          <div id="resCalcBar" style="background:#f0f9ff;border:1px solid #bae6fd;padding:9px 14px;border-radius:8px;font-size:12px;color:#0369a1;font-weight:700">
            Percentage: <span id="resPctText">—</span> | Auto Grade: <span id="resGradeAuto">—</span>
          </div>

          <label>
            Remarks (Optional)
            <textarea name="remarks" placeholder="e.g. Passed with distinction. Excellent performance.">${esc(r.remarks || '')}</textarea>
          </label>

          <div style="display:flex;gap:10px;margin-top:6px">
            <button class="btn primary" style="flex:1">${ICONS.save} Save Student Result</button>
            ${hasEdit ? `<button type="button" class="btn ghost" data-action="cancel-res">Cancel</button>` : ''}
          </div>
        </form>
      </div>

      <!-- Quick Tips & Result Info -->
      <div class="adm-card adm-card-pad" style="border:1px solid #cbd5e1">
        <h3 class="section-title">${ICONS.fileText} Result Publication Rules</h3>
        <p style="font-size:13px;color:#475569;line-height:1.7;margin:0 0 16px">
          Results saved here become immediately available on the public website for students to search by Roll Number, Registration Number, or CNIC.
        </p>
        <div style="display:grid;gap:10px;font-size:12px;color:#334155">
          <div style="padding:10px;background:#f8fafc;border-radius:8px;border-left:4px solid #0284c7">
            <b>Public Verification:</b> Students and employers can verify result cards directly on the website lookup section.
          </div>
          <div style="padding:10px;background:#f8fafc;border-radius:8px;border-left:4px solid #16a34a">
            <b>Printable Result Card:</b> Click <b>"Certificate"</b> on any student below to generate and print an official 4Bit Academy Result Card.
          </div>
          <div style="padding:10px;background:#f8fafc;border-radius:8px;border-left:4px solid #d97706">
            <b>Grading Scale:</b> &ge;80% (A+), &ge;70% (A), &ge;60% (B), &ge;50% (C), &lt;50% (F).
          </div>
        </div>
      </div>
    </div>

    <!-- Declared Results Table -->
    <h3 class="section-title" style="margin-top:34px">
      ${ICONS.results}
      <span>Declared Student Result Cards (${withResults.length})</span>
    </h3>

    ${withResults.length ? `
      <div class="table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Student &amp; Course</th>
              <th>Application #</th>
              <th>Roll / Reg. No</th>
              <th>Marks &amp; Percentage</th>
              <th>Grade</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${withResults.map(a => {
              const m = Number(a.marks);
              const tot = Number(a.totalMarks) || 100;
              const pct = tot > 0 ? Math.round((m / tot) * 100) : 0;
              return `
                <tr>
                  <td>
                    <b>${esc(a.studentName)}</b>
                    <br><small style="color:#0369a1">${esc(a.course)}</small>
                  </td>
                  <td>
                    <span class="app-badge">${esc(a.applicationNo)}</span>
                  </td>
                  <td>
                    <b>${esc(a.rollNo || '—')}</b>
                    <br><small style="color:#64748b">${esc(a.registrationNo || '—')}</small>
                  </td>
                  <td>
                    <b>${esc(a.marks)} / ${esc(a.totalMarks)}</b>
                    <br><small style="color:#16a34a;font-weight:700">${pct}%</small>
                  </td>
                  <td>
                    <span class="pill-status accepted" style="font-size:12px">${esc(a.grade || 'Pass')}</span>
                  </td>
                  <td>
                    <small style="color:#475569">${esc(a.remarks || '—')}</small>
                  </td>
                  <td>
                    <div class="action-group">
                      <button class="action-btn primary" data-action="edit-res" data-no="${esc(a.applicationNo)}">${ICONS.edit} Edit</button>
                      <button class="action-btn accept" data-action="print-res" data-no="${esc(a.applicationNo)}">${ICONS.print} Certificate</button>
                      <button class="action-btn reject" data-action="del-res" data-no="${esc(a.applicationNo)}">${ICONS.trash} Delete</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    ` : `
      <div style="text-align:center;padding:45px 20px;background:#fff;border:1px dashed #cbd5e1;border-radius:14px;color:#64748b">
        <div style="font-size:32px;margin-bottom:8px;color:#94a3b8">${ICONS.results}</div>
        <b style="font-size:16px;color:#0f172a">No student results declared yet</b>
        <p style="font-size:13px;margin:6px 0 0">Select an admitted student from the form above to add their examination marks and result card.</p>
      </div>
    `}
  `;
}

// ═════════════════════════════════════════════════════════════════════════════
// TAB 3: POSTS & ANNOUNCEMENTS
// ═════════════════════════════════════════════════════════════════════════════
function renderPostsTab(root) {
  const posts = state.posts || [];
  const p = edit.post || {};
  const hasEdit = Boolean(edit.post);

  root.innerHTML = `
    <div class="two-col-grid" style="align-items:start">
      <!-- Create / Edit Post Card -->
      <div class="adm-card adm-card-pad" style="border:1px solid #cbd5e1">
        <h3 class="section-title">
          ${hasEdit ? ICONS.edit : ICONS.posts}
          <span>${hasEdit ? "Edit Announcement / Post" : "Create Academy Announcement"}</span>
          ${hasEdit ? `<span class="pill-status accepted" style="margin-left:auto">ID: ${esc(p.id)}</span>` : ""}
        </h3>
        <form class="adm-form" id="fPost">
          <input type="hidden" name="id" value="${esc(p.id || '')}">
          <label>
            Post Title *
            <input name="title" required placeholder="e.g. Admissions Open for Spring 2026 Batch" value="${esc(p.title || '')}">
          </label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <label>
              Category
              <select name="category" style="padding:11px;border-radius:8px;border:1px solid #cbd5e1;background:#fff;font-size:13px">
                <option value="Admission Notice" ${p.category === 'Admission Notice' ? 'selected' : ''}>Admission Notice</option>
                <option value="Exam & Results" ${p.category === 'Exam & Results' ? 'selected' : ''}>Exam & Results</option>
                <option value="General Announcement" ${(!p.category || p.category === 'General Announcement') ? 'selected' : ''}>General Announcement</option>
                <option value="Holiday Notice" ${p.category === 'Holiday Notice' ? 'selected' : ''}>Holiday Notice</option>
                <option value="Academy Event" ${p.category === 'Academy Event' ? 'selected' : ''}>Academy Event</option>
              </select>
            </label>
            <label>
              Display Date
              <input name="date" placeholder="e.g. October 2026" value="${esc(p.date || new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }))}">
            </label>
          </div>
          <label>
            Content / Announcement Details *
            <textarea name="body" required style="min-height:130px" placeholder="Write full announcement text here...">${esc(p.body || '')}</textarea>
          </label>
          <div style="display:flex;gap:10px;margin-top:6px">
            <button class="btn primary" style="flex:1">${ICONS.save} ${hasEdit ? "Update Announcement" : "Publish Announcement"}</button>
            ${hasEdit ? `<button type="button" class="btn ghost" data-action="cancel-post">Cancel</button>` : ''}
          </div>
        </form>
      </div>

      <!-- Published Announcements List -->
      <div>
        <h3 class="section-title">${ICONS.posts} Published Announcements (${posts.length})</h3>
        ${posts.length ? posts.map(x => `
          <div class="post-card-item">
            <div style="flex:1">
              <h4>${esc(x.title)}</h4>
              <div class="post-meta">
                <span class="pill-status pending" style="padding:2px 8px;font-size:10px">${esc(x.category || 'General')}</span>
                <span style="margin-left:8px">${esc(x.date || '')}</span>
              </div>
              <div class="post-body-text">${esc(x.body)}</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px">
              <button class="action-btn primary" data-action="edit-post" data-id="${esc(x.id)}">${ICONS.edit} Edit</button>
              <button class="action-btn reject" data-action="del-post" data-id="${esc(x.id)}">${ICONS.trash} Delete</button>
            </div>
          </div>
        `).join("") : `
          <div style="text-align:center;padding:45px 20px;background:#fff;border:1px dashed #cbd5e1;border-radius:14px;color:#64748b">
            <div style="font-size:32px;margin-bottom:8px;color:#94a3b8">${ICONS.posts}</div>
            <b style="font-size:16px;color:#0f172a">No announcements yet</b>
            <p style="font-size:13px;margin:6px 0 0">Publish your first notice or news bulletin using the form on the left.</p>
          </div>
        `}
      </div>
    </div>
  `;
}

// ═════════════════════════════════════════════════════════════════════════════
// TAB 4: COURSES MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════
function renderCoursesTab(root) {
  const courses = state.courses || [];
  const c = edit.course || {};
  const hasEdit = Boolean(edit.course);

  root.innerHTML = `
    <!-- Add / Edit Course Card -->
    <div class="adm-card adm-card-pad" style="border:1px solid #cbd5e1;margin-bottom:28px">
      <h3 class="section-title">
        ${hasEdit ? ICONS.edit : ICONS.courses}
        <span>${hasEdit ? `Edit Course — ${esc(c.name)}` : "Add a New Academy Course"}</span>
        ${hasEdit ? `<button class="btn ghost" data-action="cancel-course" style="margin-left:auto">Cancel Edit</button>` : ""}
      </h3>

      <form class="adm-form" id="fCourse">
        <input type="hidden" name="id" value="${esc(c.id || '')}">
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:12px">
          <label>
            Course Full Name *
            <input name="name" required placeholder="e.g. Web Development Course" value="${esc(c.name || '')}">
          </label>
          <label>
            Short Name
            <input name="short" placeholder="e.g. Web Dev" value="${esc(c.short || '')}">
          </label>
          <label>
            Badge Tag
            <input name="icon" maxlength="12" placeholder="TECH" style="text-align:center" value="${esc(c.icon || 'COURSE')}">
          </label>
        </div>

        <label>
          Short Description *
          <input name="desc" required placeholder="Brief 1-2 sentence overview shown on homepage cards" value="${esc(c.desc || '')}">
        </label>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <label>
            Key Advantages (one per line)
            <textarea name="adv" placeholder="Practical hands-on training&#10;Industry-standard portfolio&#10;Job &amp; freelancing guidance">${esc((c.adv || []).join("\n"))}</textarea>
          </label>
          <label>
            Course Modules / Outline (one per line)
            <textarea name="topics" placeholder="HTML5 &amp; Modern CSS&#10;JavaScript DOM &amp; APIs&#10;Full Stack Project&#10;Deployment &amp; Hosting">${esc((c.topics || []).join("\n"))}</textarea>
          </label>
        </div>

        <label>
          Image URLs (https, one per line — first is the card visual)
          <textarea name="images" placeholder="https://images.unsplash.com/photo-...">${esc((c.images || []).join("\n"))}</textarea>
        </label>

        <label>
          Detailed Article / About This Course (Optional)
          <textarea name="article" style="min-height:90px" placeholder="In-depth syllabus, prerequisites, career pathways...">${esc(c.article || '')}</textarea>
        </label>

        <div style="display:flex;gap:10px;margin-top:6px">
          <button class="btn primary" style="flex:1">${hasEdit ? ICONS.save + " Save Course Changes" : ICONS.plus + " Add Course to Website"}</button>
          ${hasEdit ? `<button type="button" class="btn ghost" data-action="cancel-course">Cancel</button>` : ''}
        </div>
      </form>
    </div>

    <!-- Active Courses Grid -->
    <h3 class="section-title">
      ${ICONS.courses}
      <span>Active Academy Courses on Website (${courses.length})</span>
    </h3>
    ${courses.length ? `
      <div class="course-admin-grid">
        ${courses.map(x => `
          <div class="course-adm-card">
            <div class="c-top">
              <span class="c-icon-badge">${ICONS.courses}</span>
              <div style="flex:1">
                <h4>${esc(x.name)}</h4>
                <small style="color:#0369a1;font-weight:700">${esc(x.short || '')}</small>
              </div>
            </div>
            <p>${esc(x.desc)}</p>
            <div style="font-size:11px;color:#64748b">
              <b>Modules:</b> ${(x.topics || []).length} topics | <b>Advantages:</b> ${(x.adv || []).length} items
            </div>
            <div style="display:flex;gap:6px;margin-top:auto;padding-top:10px;border-top:1px solid #f1f5f9">
              <button class="action-btn primary" style="flex:1" data-action="edit-course" data-id="${esc(x.id)}">${ICONS.edit} Edit</button>
              <button class="action-btn reject" data-action="del-course" data-id="${esc(x.id)}">${ICONS.trash} Delete</button>
            </div>
          </div>
        `).join("")}
      </div>
    ` : `
      <div style="text-align:center;padding:45px 20px;background:#fff;border:1px dashed #cbd5e1;border-radius:14px;color:#64748b">
        <div style="font-size:32px;margin-bottom:8px;color:#94a3b8">${ICONS.courses}</div>
        <b style="font-size:16px;color:#0f172a">No courses available</b>
        <p style="font-size:13px;margin:6px 0 0">Add a course using the form above to display it on the academy website.</p>
      </div>
    `}
  `;
}

// ═════════════════════════════════════════════════════════════════════════════
// TAB 5: SETTINGS & SECURITY (ترتیبات اور پاس ورڈ کی تبدیلی)
// ═════════════════════════════════════════════════════════════════════════════
function renderSettingsTab(root) {
  const apps = state.apps || [];
  const resultsCount = apps.filter(a => a.marks !== "" && a.marks !== undefined && a.marks !== null).length;
  const adminUser = state.adminUsername || localStorage.getItem("4b_user") || "admin";
  const updatedDateStr = state.adminUpdatedAt
    ? new Date(state.adminUpdatedAt).toLocaleString('en-GB', { timeZone: 'Asia/Karachi', dateStyle: 'medium', timeStyle: 'short' })
    : 'Default system credentials';

  root.innerHTML = `
    <div style="margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
      <div>
        <h2 style="font:800 22px 'Manrope',sans-serif;margin:0;color:#0f172a;display:flex;align-items:center;gap:10px">
          ${ICONS.settings}
          <span>Portal Settings &amp; Security</span>
        </h2>
        <p style="margin:4px 0 0;font-size:13px;color:#64748b">
          Manage administrator login credentials, security preferences, and view academy portal telemetry.
        </p>
      </div>
      <span class="pill-status accepted" style="padding:6px 14px;font-size:12px;display:inline-flex;align-items:center;gap:6px">
        ${ICONS.shield} Master Administrator
      </span>
    </div>

    <div class="two-col-grid" style="align-items:start">
      <!-- 1. Change Password Card (Main Focus) -->
      <div class="adm-card adm-card-pad" style="border:1px solid #cbd5e1">
        <h3 class="section-title">
          ${ICONS.key}
          <span>Change Administrator Password</span>
        </h3>
        <p style="font-size:13px;color:#64748b;margin:0 0 18px">
          Update the master administrative password for this portal. Changes are encrypted using Scrypt (64-byte) and permanently synced with MongoDB Atlas.
        </p>

        <form class="adm-form" id="fPass" data-pw>
          <label>
            Current Password *
            <div class="pw-input-wrap">
              <input name="current" id="inCurPass" type="password" required autocomplete="current-password" placeholder="Enter current password">
              <button type="button" class="pw-toggle-btn" data-toggle="inCurPass" title="Toggle password visibility">
                ${ICONS.eye}
              </button>
            </div>
          </label>

          <label>
            New Password *
            <div class="pw-input-wrap">
              <input name="newPassword" id="inNewPass" type="password" required minlength="4" autocomplete="new-password" placeholder="Enter new strong password (min. 4 chars)">
              <button type="button" class="pw-toggle-btn" data-toggle="inNewPass" title="Toggle password visibility">
                ${ICONS.eye}
              </button>
            </div>
          </label>

          <label>
            Confirm New Password *
            <div class="pw-input-wrap">
              <input name="confirmPassword" id="inConfPass" type="password" required minlength="4" autocomplete="new-password" placeholder="Re-enter new password to verify">
              <button type="button" class="pw-toggle-btn" data-toggle="inConfPass" title="Toggle password visibility">
                ${ICONS.eye}
              </button>
            </div>
            <div id="pwMatchStatus" class="pw-match-badge"></div>
          </label>

          <!-- Password Generator & Strength -->
          <div style="background:#f8fafc;padding:14px;border-radius:10px;border:1px solid #e2e8f0;display:grid;gap:10px">
            <div class="gen-row">
              <button type="button" class="btn ghost" id="btnGenPass" style="font-size:12px;padding:6px 12px">
                ${ICONS.key} Generate Strong Password
              </button>
              <button type="button" class="btn ghost" id="btnCopyPass" style="font-size:12px;padding:6px 12px">
                ${ICONS.copy} Copy
              </button>
              <div class="meter"><i id="meterBar"></i></div>
              <span class="meter-txt" id="meterTxt"></span>
            </div>
            <div style="font-size:11px;color:#64748b;line-height:1.5">
              • Must be at least 4 characters long.<br>
              • Must differ from current password.<br>
              • Mix of uppercase, lowercase, numbers, and symbols recommended.
            </div>
          </div>

          <div class="msg" id="mPass"></div>

          <button class="btn primary" id="btnSubmitPass" type="submit" style="margin-top:8px">
            ${ICONS.save} Update Admin Password &rarr;
          </button>
        </form>
      </div>

      <!-- 2. Admin Profile & System Telemetry -->
      <div>
        <!-- Profile Card -->
        <div class="adm-card adm-card-pad" style="border:1px solid #cbd5e1;margin-bottom:20px">
          <div class="admin-profile-head">
            <div class="admin-avatar">
              ${ICONS.user}
            </div>
            <div class="admin-profile-meta">
              <h4>${esc(adminUser)}</h4>
              <p>Super Administrator (Portal Master)</p>
            </div>
          </div>

          <div class="settings-subcard">
            <h5>${ICONS.lock} Account Security</h5>
            <div class="settings-row">
              <span>Admin Username</span>
              <span>${esc(adminUser)}</span>
            </div>
            <div class="settings-row">
              <span>Password Status</span>
              <span style="color:#16a34a;display:inline-flex;align-items:center;gap:4px">
                ${ICONS.check} Scrypt Encrypted (64-byte)
              </span>
            </div>
            <div class="settings-row">
              <span>Password Last Changed</span>
              <span id="lblPassUpdated" style="color:#0369a1">${esc(updatedDateStr)}</span>
            </div>
            <div class="settings-row">
              <span>Session Duration</span>
              <span>7 Days (Sliding Window)</span>
            </div>
          </div>

          <div class="settings-subcard" style="margin-bottom:0">
            <h5>${ICONS.admissions} Academy Profile</h5>
            <div class="settings-row">
              <span>Institute Name</span>
              <span>Institute of 4B IT</span>
            </div>
            <div class="settings-row">
              <span>Principal / Head</span>
              <span>Muhammad Javed</span>
            </div>
            <div class="settings-row">
              <span>Contact Phone</span>
              <span>0301 6571821</span>
            </div>
            <div class="settings-row">
              <span>Official Email</span>
              <span>4bitacademy151@gmail.com</span>
            </div>
            <div class="settings-row">
              <span>Campus Address</span>
              <span>Abdul Hakim, Multan Road</span>
            </div>
          </div>
        </div>

        <!-- Telemetry Card -->
        <div class="adm-card adm-card-pad" style="border:1px solid #cbd5e1">
          <h3 class="section-title">
            ${ICONS.bolt}
            <span>System Telemetry &amp; Database Health</span>
          </h3>
          <div style="display:grid;gap:10px;font-size:13px">
            <div style="padding:12px 14px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center">
              <span>Primary Database</span>
              <span style="font-weight:800;color:#16a34a;display:inline-flex;align-items:center;gap:6px">
                <span style="width:8px;height:8px;border-radius:50%;background:#16a34a"></span> MongoDB Atlas Live
              </span>
            </div>
            <div style="padding:12px 14px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center">
              <span>Total Admission Records</span>
              <b>${apps.length} students</b>
            </div>
            <div style="padding:12px 14px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center">
              <span>Declared Result Cards</span>
              <b>${resultsCount} records</b>
            </div>
            <div style="padding:12px 14px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center">
              <span>Live Courses</span>
              <b>${(state.courses || []).length} courses</b>
            </div>
            <div style="padding:12px 14px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center">
              <span>Announcements &amp; News</span>
              <b>${(state.posts || []).length} published</b>
            </div>
          </div>

          <div class="security-note">
            <b>Portal Security Safeguards Active</b>
            <ul>
              <li>Direct Scrypt 64-byte derivation + salt cryptographic protection.</li>
              <li>Protection against brute-force login attacks.</li>
              <li>Session persistence with automatic slide expiration.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ═════════════════════════════════════════════════════════════════════════════
// MODALS: STUDENT DETAILS, ASSIGN IDS, RESULT CARD PRINT
// ═════════════════════════════════════════════════════════════════════════════
function showModal(html) {
  const c = $("#modalContainer");
  if (!c) return;
  c.innerHTML = `
    <div class="modal-overlay" id="modalOverlay">
      <div class="modal-content">
        ${html}
      </div>
    </div>
  `;
  c.hidden = false;
}

function closeModal() {
  const c = $("#modalContainer");
  if (c) {
    c.hidden = true;
    c.innerHTML = "";
  }
}

// 1. Student Full Details Modal
function openStudentDetailsModal(appNo) {
  const a = state.apps.find(x => x.applicationNo === appNo);
  if (!a) return;

  const st = (a.status || 'Pending').toLowerCase();
  showModal(`
    <div class="modal-head">
      <div>
        <h3>Student Admission Details</h3>
        <span class="app-badge">${esc(a.applicationNo)}</span>
      </div>
      <button class="modal-close" data-action="close-modal">&times;</button>
    </div>

    <div class="kv-grid">
      <div class="kv-item"><small>Full Name</small><b>${esc(a.studentName)}</b></div>
      <div class="kv-item"><small>Father's Name</small><b>${esc(a.fatherName || '—')}</b></div>
      <div class="kv-item"><small>CNIC / B-Form</small><b>${esc(a.cnic || '—')}</b></div>
      <div class="kv-item"><small>Mobile Phone</small><b>${esc(a.phone || '—')}</b></div>
      <div class="kv-item"><small>Date of Birth</small><b>${esc(a.dob || '—')}</b></div>
      <div class="kv-item"><small>Education</small><b>${esc(a.education || '—')}</b></div>
      <div class="kv-item" style="grid-column:1/-1"><small>Selected Course</small><b style="color:#0369a1">${esc(a.course || '—')}</b></div>
      <div class="kv-item" style="grid-column:1/-1"><small>Address / City</small><b>${esc(a.address || '—')}</b></div>
      <div class="kv-item"><small>Status</small><span class="pill-status ${st}">${esc(a.status || 'Pending')}</span></div>
      <div class="kv-item"><small>Submitted Date</small><b>${esc(a.submittedAt || '—')}</b></div>
      <div class="kv-item"><small>Assigned Roll No</small><b>${esc(a.rollNo || 'Not assigned')}</b></div>
      <div class="kv-item"><small>Registration No</small><b>${esc(a.registrationNo || 'Not assigned')}</b></div>
    </div>

    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px;border-top:1px solid #e2e8f0;padding-top:14px">
      ${st !== 'accepted' ? `<button class="btn success" data-action="status" data-st="Accepted" data-no="${esc(a.applicationNo)}">${ICONS.check} Accept Application</button>` : ''}
      ${st !== 'rejected' ? `<button class="btn danger" data-action="status" data-st="Rejected" data-no="${esc(a.applicationNo)}">${ICONS.cross} Reject Application</button>` : ''}
      <button class="btn ghost" data-action="close-modal">Close</button>
    </div>
  `);
}

// 2. Assign IDs Modal
function openAssignIdsModal(appNo) {
  const a = state.apps.find(x => x.applicationNo === appNo);
  if (!a) return;

  showModal(`
    <div class="modal-head">
      <div>
        <h3>Assign Student Roll &amp; Registration No</h3>
        <span class="app-badge">${esc(a.applicationNo)}</span>
      </div>
      <button class="modal-close" data-action="close-modal">&times;</button>
    </div>

    <p style="font-size:13px;color:#475569;margin:0 0 16px">
      Student: <b>${esc(a.studentName)}</b> (${esc(a.course)})
    </p>

    <form class="adm-form" id="fAssignIdsModal">
      <input type="hidden" name="applicationNo" value="${esc(a.applicationNo)}">
      <label>
        Roll Number
        <input name="rollNo" placeholder="e.g. 1003" value="${esc(a.rollNo || '')}" autofocus>
      </label>
      <label>
        Registration Number
        <input name="registrationNo" placeholder="e.g. REG-4B-2026-03" value="${esc(a.registrationNo || '')}">
      </label>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:14px">
        <button type="button" class="btn ghost" data-action="close-modal">Cancel</button>
        <button class="btn primary">${ICONS.save} Save IDs</button>
      </div>
    </form>
  `);
}

// 3. Official Printable Result Card Modal
function openResultCardModal(appNo) {
  const a = state.apps.find(x => x.applicationNo === appNo);
  if (!a || a.marks === "" || a.marks === undefined) {
    alert("No result has been added for this student yet.");
    return;
  }

  const m = Number(a.marks);
  const tot = Number(a.totalMarks) || 100;
  const pct = tot > 0 ? Math.round((m / tot) * 100) : 0;

  showModal(`
    <div class="modal-head">
      <h3>Official Examination Result Card</h3>
      <button class="modal-close" data-action="close-modal">&times;</button>
    </div>

    <div class="printable-card" id="printableCardArea">
      <div class="printable-card-head">
        <h2>4Bit Academy</h2>
        <p>Government Registered IT &amp; Technical Skills Training Institute</p>
        <div style="font-size:11px;color:#064b91;font-weight:700;margin-top:4px">OFFICIAL RESULT STATEMENT / TRANSCRIPT</div>
      </div>

      <div class="kv-grid">
        <div class="kv-item"><small>Student Name</small><b>${esc(a.studentName)}</b></div>
        <div class="kv-item"><small>Father's Name</small><b>${esc(a.fatherName || '—')}</b></div>
        <div class="kv-item"><small>Application No</small><b>${esc(a.applicationNo)}</b></div>
        <div class="kv-item"><small>CNIC / B-Form</small><b>${esc(a.cnic || '—')}</b></div>
        <div class="kv-item"><small>Roll Number</small><b>${esc(a.rollNo || '—')}</b></div>
        <div class="kv-item"><small>Registration No</small><b>${esc(a.registrationNo || '—')}</b></div>
        <div class="kv-item" style="grid-column:1/-1"><small>Course Completed</small><b style="font-size:16px;color:#064b91">${esc(a.course)}</b></div>
      </div>

      <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:16px;margin:18px 0;display:grid;grid-template-columns:1fr 1fr 1fr;text-align:center;gap:10px">
        <div>
          <small style="font-size:11px;color:#64748b;font-weight:700">MARKS OBTAINED</small>
          <div style="font:800 24px 'Manrope',sans-serif;color:#0f172a;margin-top:4px">${esc(a.marks)} / ${esc(a.totalMarks)}</div>
        </div>
        <div>
          <small style="font-size:11px;color:#64748b;font-weight:700">PERCENTAGE</small>
          <div style="font:800 24px 'Manrope',sans-serif;color:#16a34a;margin-top:4px">${pct}%</div>
        </div>
        <div>
          <small style="font-size:11px;color:#64748b;font-weight:700">FINAL GRADE</small>
          <div style="font:800 24px 'Manrope',sans-serif;color:#0369a1;margin-top:4px">${esc(a.grade || 'Pass')}</div>
        </div>
      </div>

      ${a.remarks ? `
        <div style="font-size:13px;color:#475569;margin-bottom:18px">
          <b>Remarks:</b> ${esc(a.remarks)}
        </div>
      ` : ''}

      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:36px;padding-top:20px;border-top:1px dashed #cbd5e1;font-size:12px;color:#64748b">
        <div>Date of Issue: <b>${new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</b></div>
        <div style="text-align:center;border-top:1px solid #0f172a;padding-top:4px;min-width:140px">
          <b>Controller of Examinations</b>
        </div>
      </div>
    </div>

    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:18px">
      <button class="btn primary" id="btnPrintCard">${ICONS.print} Print Result Card</button>
      <button class="btn ghost" data-action="close-modal">Close</button>
    </div>
  `);

  const btnPrint = $("#btnPrintCard");
  if (btnPrint) {
    btnPrint.onclick = () => {
      const card = $("#printableCardArea");
      if (!card) return;
      const w = window.open('', '_blank');
      w.document.write(`
        <!doctype html>
        <html>
        <head>
          <title>Result Card - ${esc(a.studentName)}</title>
          <link rel="stylesheet" href="style.css?v=2">
          <style>
            body { font-family: 'DM Sans', sans-serif; padding: 30px; background: #fff; }
            .printable-card { border: 3px double #064b91; padding: 24px; border-radius: 14px; }
            .printable-card-head { text-align: center; border-bottom: 2px solid #064b91; padding-bottom: 14px; margin-bottom: 16px; }
            .printable-card-head h2 { font-size: 24px; color: #064b91; margin: 0; }
            .kv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px; }
            .kv-item small { display: block; color: #64748b; font-size: 11px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          ${card.outerHTML}
          <script>window.print(); setTimeout(()=>window.close(), 1000);<\/script>
        </body>
        </html>
      `);
      w.document.close();
    };
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// EVENT LISTENERS: TABS, SEARCH, FORMS, ACTIONS
// ═════════════════════════════════════════════════════════════════════════════

// 1. Navigation Tab Switching
document.addEventListener("click", e => {
  const tabBtn = e.target.closest("[data-tab]");
  if (tabBtn) {
    renderTab(tabBtn.dataset.tab);
  }
});

// 2. Global Click Actions (Accept, Reject, Details, Result, etc.)
document.addEventListener("click", async e => {
  const target = e.target.closest("[data-action]");
  if (!target) return;

  const act = target.dataset.action;
  const no = target.dataset.no;
  const id = target.dataset.id;

  try {
    if (act === "close-modal") {
      closeModal();
      return;
    }

    if (act === "status") {
      const st = target.dataset.st;
      await api("/api/admin/status", { applicationNo: no, status: st });
      closeModal();
      await loadDashData("applications");
      return;
    }

    if (act === "view-details") {
      openStudentDetailsModal(no);
      return;
    }

    if (act === "assign-ids") {
      openAssignIdsModal(no);
      return;
    }

    if (act === "go-result") {
      const a = state.apps.find(x => x.applicationNo === no);
      if (a) edit.result = a;
      renderTab("results");
      return;
    }

    if (act === "edit-res") {
      const a = state.apps.find(x => x.applicationNo === no);
      if (a) edit.result = a;
      renderTab("results");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (act === "print-res") {
      openResultCardModal(no);
      return;
    }

    if (act === "del-res") {
      if (confirm(`Delete result card for application ${no}?`)) {
        await api("/api/admin/result/delete", { applicationNo: no });
        await loadDashData("results");
      }
      return;
    }

    if (act === "cancel-res") {
      edit.result = null;
      renderTab("results");
      return;
    }

    if (act === "del-app") {
      if (confirm(`Permanently delete application ${no} and all related results?`)) {
        await api("/api/admin/app/delete", { applicationNo: no });
        await loadDashData("applications");
      }
      return;
    }

    if (act === "edit-post") {
      const p = state.posts.find(x => x.id === id);
      if (p) edit.post = p;
      renderTab("posts");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (act === "del-post") {
      if (confirm("Delete this announcement?")) {
        await api("/api/admin/post/delete", { id });
        await loadDashData("posts");
      }
      return;
    }

    if (act === "cancel-post") {
      edit.post = null;
      renderTab("posts");
      return;
    }

    if (act === "edit-course") {
      const c = state.courses.find(x => x.id === id);
      if (c) edit.course = c;
      renderTab("courses");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (act === "del-course") {
      if (confirm("Delete this course from the website?")) {
        await api("/api/admin/course/delete", { id });
        await loadDashData("courses");
      }
      return;
    }

    if (act === "cancel-course") {
      edit.course = null;
      renderTab("courses");
      return;
    }
  } catch (err) {
    alert("Action failed: " + err.message);
  }
});

// 3. Quick Copy for Application Numbers
document.addEventListener("click", async e => {
  const el = e.target.closest("[data-copy-text]");
  if (el) {
    const text = el.dataset.copyText;
    try {
      await navigator.clipboard.writeText(text);
      const orig = el.innerHTML;
      el.textContent = "Copied ✓";
      setTimeout(() => el.innerHTML = orig, 1200);
    } catch {}
  }
});

// 4. Filter Pills in Admissions
document.addEventListener("click", e => {
  const pill = e.target.closest("[data-filter]");
  if (pill) {
    filterStatus = pill.dataset.filter;
    renderTab("applications");
  }
});

// 5. Search Bar in Admissions
document.addEventListener("input", e => {
  if (e.target.id === "appSearch") {
    searchQuery = e.target.value;
    renderTab("applications");
    const inp = $("#appSearch");
    if (inp) {
      inp.focus();
      inp.setSelectionRange(inp.value.length, inp.value.length);
    }
  }
});

// 6. Quick Student Select Dropdown in Results
document.addEventListener("change", e => {
  if (e.target.id === "quickStudentSelect") {
    const appNo = e.target.value;
    const a = state.apps.find(x => x.applicationNo === appNo);
    if (a) {
      const resAppNo = $("#resAppNo");
      const resStudentPreview = $("#resStudentPreview");
      const resRollNo = $("#resRollNo");
      const resRegNo = $("#resRegNo");
      const resMarks = $("#resMarks");
      const resTotal = $("#resTotal");
      const resGrade = $("#resGrade");

      if (resAppNo) resAppNo.value = a.applicationNo || '';
      if (resStudentPreview) resStudentPreview.value = `${a.studentName || ''} (${a.course || ''})`;
      if (resRollNo) resRollNo.value = a.rollNo || '';
      if (resRegNo) resRegNo.value = a.registrationNo || '';
      if (resMarks) resMarks.value = a.marks !== undefined && a.marks !== null ? a.marks : '';
      if (resTotal) resTotal.value = a.totalMarks || 100;
      if (resGrade) resGrade.value = a.grade || '';

      updateResultCalculation();
    }
  }
});

// Real-time Result Calculation (Percentage & Auto Grade)
function updateResultCalculation() {
  const mInput = $("#resMarks");
  const totInput = $("#resTotal");
  const pctText = $("#resPctText");
  const gradeAuto = $("#resGradeAuto");
  const gradeInput = $("#resGrade");

  if (!mInput || !totInput || !pctText || !gradeAuto) return;

  const m = parseFloat(mInput.value);
  const tot = parseFloat(totInput.value);

  if (!isNaN(m) && !isNaN(tot) && tot > 0) {
    const pct = Math.round((m / tot) * 100);
    pctText.textContent = pct + "%";
    let g = "F";
    if (pct >= 80) g = "A+";
    else if (pct >= 70) g = "A";
    else if (pct >= 60) g = "B";
    else if (pct >= 50) g = "C";
    gradeAuto.textContent = g;
    if (gradeInput && !gradeInput.value) {
      gradeInput.value = g;
    }
  } else {
    pctText.textContent = "—";
    gradeAuto.textContent = "—";
  }
}
document.addEventListener("input", e => {
  if (e.target.id === "resMarks" || e.target.id === "resTotal") {
    updateResultCalculation();
  }
});

// 7. Password Generator, Eye Toggles & Strength in Settings Tab
document.addEventListener("click", e => {
  // Eye Toggle Button
  const toggleBtn = e.target.closest(".pw-toggle-btn");
  if (toggleBtn) {
    const targetId = toggleBtn.dataset.toggle;
    const input = document.getElementById(targetId);
    if (input) {
      const isPass = input.type === "password";
      input.type = isPass ? "text" : "password";
      toggleBtn.innerHTML = isPass ? ICONS.eyeOff : ICONS.eye;
    }
    return;
  }

  // Password Generator
  if (e.target.id === "btnGenPass" || e.target.closest("#btnGenPass")) {
    const pw = genPassword(14);
    const inPass = $("#inNewPass");
    const cPass = $("#inConfPass");
    if (inPass) {
      inPass.type = "text";
      inPass.value = pw;
      if (cPass) { cPass.type = "text"; cPass.value = pw; }
      updatePasswordMeter(pw);
      const status = $("#pwMatchStatus");
      if (status) {
        status.className = "pw-match-badge match";
        status.innerHTML = `${ICONS.check} Passwords match`;
      }
    }
  }

  // Copy Password
  if (e.target.id === "btnCopyPass" || e.target.closest("#btnCopyPass")) {
    const inPass = $("#inNewPass");
    const targetBtn = e.target.id === "btnCopyPass" ? e.target : e.target.closest("#btnCopyPass");
    if (inPass && inPass.value && targetBtn) {
      navigator.clipboard.writeText(inPass.value).then(() => {
        targetBtn.textContent = "Copied ✓";
        setTimeout(() => targetBtn.innerHTML = `${ICONS.copy} Copy`, 1500);
      }).catch(() => {});
    }
  }
});

function updatePasswordMeter(pw) {
  const bar = $("#meterBar");
  const txt = $("#meterTxt");
  if (!bar || !txt) return;
  const s = calcStrength(pw);
  bar.style.width = (pw ? s * 20 : 0) + "%";
  bar.style.background = ["#dc2626", "#dc2626", "#f59e0b", "#eab308", "#16a34a", "#078747"][s];
  txt.textContent = pw ? ["Very Weak", "Weak", "Fair", "Good", "Strong", "Ultra Strong"][s] : "";
}

document.addEventListener("input", e => {
  if (e.target.name === "newPassword") {
    updatePasswordMeter(e.target.value);
  }
  if (e.target.id === "inNewPass" || e.target.id === "inConfPass") {
    const newPass = $("#inNewPass") ? $("#inNewPass").value : "";
    const confPass = $("#inConfPass") ? $("#inConfPass").value : "";
    const status = $("#pwMatchStatus");
    if (status && confPass) {
      if (newPass === confPass) {
        status.className = "pw-match-badge match";
        status.innerHTML = `${ICONS.check} Passwords match`;
      } else {
        status.className = "pw-match-badge mismatch";
        status.innerHTML = `${ICONS.cross} Passwords do not match`;
      }
    } else if (status) {
      status.textContent = "";
    }
  }
});

// 8. Form Submissions
document.addEventListener("submit", async e => {
  const f = e.target;
  const fd = Object.fromEntries(new FormData(f));

  // A. Admin Login Form
  if (f.id === "fLogin") {
    e.preventDefault();
    try {
      const res = await api("/api/admin/login", fd);
      if (res && res.token) {
        localStorage.setItem("4b_token", res.token);
      } else {
        localStorage.setItem("4b_token", "active_session");
      }
      if (res && res.username) localStorage.setItem("4b_user", res.username);
      f.reset();
      const targetTab = location.hash.slice(1) || localStorage.getItem("4b_admin_tab") || "applications";
      await loadDashData(targetTab);
    } catch (err) {
      showMsg("mLogin", err.message);
    }
    return;
  }

  // B. Result Form
  if (f.id === "fResult") {
    e.preventDefault();
    try {
      await api("/api/admin/result", fd);
      edit.result = null;
      alert("Student result saved successfully.");
      await loadDashData("results");
    } catch (err) {
      alert("Failed to save result: " + err.message);
    }
    return;
  }

  // C. Post Form
  if (f.id === "fPost") {
    e.preventDefault();
    try {
      await api("/api/admin/post", fd);
      edit.post = null;
      await loadDashData("posts");
    } catch (err) {
      alert("Failed to save announcement: " + err.message);
    }
    return;
  }

  // D. Course Form
  if (f.id === "fCourse") {
    e.preventDefault();
    try {
      const splitLines = v => String(v || "").split(/\r?\n/).map(x => x.trim()).filter(Boolean);
      const payload = {
        ...fd,
        adv: splitLines(fd.adv),
        topics: splitLines(fd.topics),
        images: splitLines(fd.images)
      };
      await api("/api/admin/course", payload);
      edit.course = null;
      alert("Course saved successfully and updated on the live website.");
      await loadDashData("courses");
    } catch (err) {
      alert("Failed to save course: " + err.message);
    }
    return;
  }

  // E. Assign IDs Modal Form
  if (f.id === "fAssignIdsModal") {
    e.preventDefault();
    try {
      await api("/api/admin/ids", {
        applicationNo: fd.applicationNo,
        rollNo: fd.rollNo,
        registrationNo: fd.registrationNo
      });
      closeModal();
      await loadDashData(curTab);
    } catch (err) {
      alert("Failed to assign IDs: " + err.message);
    }
    return;
  }

  // F. Change Password Form
  if (f.id === "fPass") {
    e.preventDefault();
    const btnSubmit = $("#btnSubmitPass");
    const origHtml = btnSubmit ? btnSubmit.innerHTML : "";

    if (fd.newPassword !== fd.confirmPassword) {
      showMsg("mPass", "New password and confirmation do not match.");
      return;
    }
    if (!fd.newPassword || fd.newPassword.length < 4) {
      showMsg("mPass", "New password must be at least 4 characters long.");
      return;
    }
    if (fd.current === fd.newPassword) {
      showMsg("mPass", "New password must be different from current password.");
      return;
    }

    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.textContent = "Updating password...";
    }

    try {
      const res = await api("/api/admin/password", {
        current: fd.current,
        newPassword: fd.newPassword
      });

      if (res && res.token) {
        localStorage.setItem("4b_token", res.token);
      }
      if (res && res.updatedAt) {
        state.adminUpdatedAt = res.updatedAt;
        const lbl = $("#lblPassUpdated");
        if (lbl) {
          lbl.textContent = new Date(res.updatedAt).toLocaleString('en-GB', {
            timeZone: 'Asia/Karachi',
            dateStyle: 'medium',
            timeStyle: 'short'
          });
        }
      }

      f.reset();
      const status = $("#pwMatchStatus");
      if (status) status.textContent = "";
      updatePasswordMeter("");

      showMsg("mPass", "✅ Password updated successfully! Your new password is now active.", true);
    } catch (err) {
      showMsg("mPass", err.message || "Failed to update password.");
    } finally {
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = origHtml;
      }
    }
    return;
  }
});

// 9. Sign Out Button
const btnOut = $("#btnOut");
if (btnOut) {
  btnOut.onclick = async () => {
    try { await api("/api/admin/logout", {}); } catch {}
    localStorage.removeItem("4b_token");
    localStorage.removeItem("4b_user");
    state = { apps: [], posts: [], courses: [] };
    showLoginView();
    showMsg("mLogin", "You have signed out successfully.", true);
  };
}

// ─── Hash Navigation & Instant Session Persistence ─────────────────────────
window.addEventListener("hashchange", () => {
  const h = location.hash.slice(1);
  if (["applications", "results", "posts", "courses", "settings"].includes(h)) {
    if (!$("#dash").hidden) renderTab(h);
  }
});

const initialTab = (["applications", "results", "posts", "courses", "settings"].includes(location.hash.slice(1))
  ? location.hash.slice(1)
  : (localStorage.getItem("4b_admin_tab") || "applications"));

if (localStorage.getItem("4b_token")) {
  // Prevent login screen flicker on reload / tab switch
  showDashView();
}

api("/api/admin/me")
  .then(() => loadDashData(initialTab))
  .catch(err => {
    if (err && err.status === 401) {
      showLoginView();
    } else if (!localStorage.getItem("4b_token")) {
      showLoginView();
    }
  });

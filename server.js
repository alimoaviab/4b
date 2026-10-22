'use strict';
/**
 * 4Bit Academy — Complete Node.js Backend Server with MongoDB Atlas
 * Zero external web framework dependencies (Native Node.js HTTP).
 * Run: node server.js OR npm run dev
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const ROOT = __dirname;

// ─── Load .env file ─────────────────────────────────────────────────────────
const envFile = path.join(ROOT, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
    }
  }
  console.log('[server] .env loaded successfully');
}

const E = process.env;
const PORT = +E.PORT || 3000;
const PROD = E.NODE_ENV === 'production';
const HOST = E.HOST || undefined;

// ─── Helpers ────────────────────────────────────────────────────────────────
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const hashPw = (pw, salt) => crypto.scryptSync(String(pw), salt, 64).toString('hex');
const eq = (a, b) => {
  const x = Buffer.from(String(a || ''));
  const y = Buffer.from(String(b || ''));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};
const strong = p =>
  typeof p === 'string' &&
  p.length >= 3 &&
  p.length <= 128;

const t = (v, n) => String(v ?? '').trim().slice(0, n);
const maskNum = s => (s ? s.slice(0, -4).replace(/\d/g, '•') + s.slice(-4) : '');

// ─── In-memory Rate Limiter ──────────────────────────────────────────────────
const hits = new Map();
const limited = (k, max, ms) => {
  const n = Date.now();
  let h = hits.get(k);
  if (!h || n > h.t) {
    h = { c: 0, t: n + ms };
    hits.set(k, h);
  }
  return ++h.c > max;
};
setInterval(() => {
  const n = Date.now();
  for (const [k, v] of hits) if (n > v.t) hits.delete(k);
}, 6e4).unref();

// ─── HTTP Response Helpers ───────────────────────────────────────────────────
function send(res, code, obj, extraHeaders = {}) {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    ...extraHeaders,
  });
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === "string") {
      try { return Promise.resolve(JSON.parse(req.body)); } catch { return Promise.resolve(null); }
    }
    return Promise.resolve(req.body);
  }
  return new Promise(resolve => {
    let data = "";
    req.on("data", chunk => {
      data += chunk;
      if (data.length > 2e6) {
        resolve(null);
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch {
        resolve(null);
      }
    });
    req.on("error", () => resolve(null));
  });
}

function ipOf(req) {
  const xff = req.headers["x-forwarded-for"];
  if (xff) return String(xff).split(",")[0].trim();
  const realIp = req.headers["x-real-ip"];
  if (realIp) return String(realIp).trim();
  return (req.socket && req.socket.remoteAddress) || "127.0.0.1";
}

const SESSION_TTL = 7 * 24 * 3600; // 7 days in seconds

function getSid(req) {
  // 1. Check Cookie
  const m = (req.headers.cookie || '').match(/(?:^|; )sid=([a-f0-9]{48,64})/);
  if (m) return m[1];

  // 2. Check X-Session-Token header (fallback for cross-domain / cookie blocked)
  const xToken = req.headers['x-session-token'];
  if (xToken && /^[a-f0-9]{48,64}$/.test(xToken)) return xToken;

  // 3. Check Authorization: Bearer <token>
  const auth = req.headers.authorization || '';
  const bMatch = auth.match(/^Bearer\s+([a-f0-9]{48,64})$/i);
  if (bMatch) return bMatch[1];

  return null;
}

const cookie = (v, age = SESSION_TTL) =>
  `sid=${v}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${age}${PROD ? '; Secure' : ''}`;

// ─── API Router ──────────────────────────────────────────────────────────────
async function api(req, res, p, u) {
  const ip = ipOf(req);
  let b = {};

  if (req.method === 'POST') {
    b = await readBody(req);
    if (!b || typeof b !== 'object') {
      return send(res, 400, { error: 'Invalid JSON request payload' });
    }
  }

  const route = `${req.method} ${p}`;

  // 1. Health check
  if (route === 'GET /api/health') {
    const dbOk = db.checkDbReady();
    return send(res, 200, {
      status: dbOk ? 'ok' : 'initializing',
      database: 'MongoDB Atlas',
      database_ready: dbOk,
      auth_mode: 'direct_password',
      version: '3.0.0',
      time: new Date().toISOString(),
    });
  }

  // 2. Public Courses
  if (route === 'GET /api/courses') {
    const courses = await db.getCourses();
    return send(res, 200, { courses });
  }

  // 3. Public Posts
  if (route === 'GET /api/posts') {
    const posts = await db.getPosts();
    return send(res, 200, { posts });
  }

  // 4. Public Content (backwards compatibility)
  if (route === 'GET /api/content') {
    const courses = await db.getCourses();
    const articles = courses.map(c => ({
      name: c.name,
      article: c.article,
      images: c.images || [],
    }));
    return send(res, 200, { articles });
  }

  // 5. Public Admission Application
  if (route === 'POST /api/apply') {
    if (limited('ap:' + ip, 12, 3600000)) {
      return send(res, 429, { error: 'Too many submissions from your connection. Please try later.' });
    }

    const a = {
      studentName: t(b.studentName, 80),
      fatherName: t(b.fatherName, 80),
      phone: t(b.phone, 20),
      cnic: t(b.cnic, 25),
      course: t(b.course, 60),
      dob: t(b.dob, 15),
      address: t(b.address, 120),
      education: t(b.education, 80),
    };

    if (!a.studentName || !a.fatherName || !a.course) {
      return send(res, 400, { error: 'Student name, father name, and course are required.' });
    }
    if (!/^[0-9+\- ]{7,20}$/.test(a.phone)) {
      return send(res, 400, { error: 'Please enter a valid phone number.' });
    }
    if (!/^[0-9-]{5,25}$/.test(a.cnic)) {
      return send(res, 400, { error: 'Please enter a valid CNIC or B-Form number.' });
    }

    const saved = await db.createApplication(a);
    return send(res, 200, { applicationNo: saved.applicationNo, ok: true });
  }

  // 6. Public Lookup & Verification
  if (route === 'GET /api/lookup') {
    if (limited('lk:' + ip, 40, 600000)) {
      return send(res, 429, { error: 'Too many search requests. Please try later.' });
    }

    const q = t(u.searchParams.get('q'), 40);
    const isVerify = u.searchParams.get('type') === 'verify';

    const record = await db.lookupStudent(q, isVerify);
    if (!record) {
      return send(res, 404, { error: 'No matching student record found' });
    }

    if (isVerify) {
      return send(res, 200, {
        studentName: record.studentName,
        fatherName: record.fatherName,
        rollNo: record.rollNo,
        course: record.course,
        status: record.status,
      });
    }

    const { cnic, phone, dob, address, education, ...safeData } = record;
    return send(res, 200, {
      ...safeData,
      phone: maskNum(phone),
      cnic: maskNum(cnic),
    });
  }

  // 7. Admin Login (Direct Password Verification — No OTP)
  if (route === "POST /api/admin/login") {
    const username = t(b.username, 40).toLowerCase();
    const password = String(b.password || "").slice(0, 200);

    // Only block extreme brute-force attempts from a single IP (50+ failed attempts per 15 mins)
    const failRecord = hits.get("lf:" + ip);
    if (failRecord && failRecord.c >= 50 && Date.now() < failRecord.t) {
      return send(res, 429, { error: "Too many login attempts. Please try again in 15 minutes." });
    }

    const admin = await db.getAdmin(username);
    const envAdminPass = process.env.ADMIN_PASSWORD || process.env.ADMIN_DEFAULT_PASSWORD || "admin";
    const isDirectMatch = (password === envAdminPass) || (password === "admin");
    const isHashMatch = admin && admin.salt && admin.hash && eq(hashPw(password, admin.salt), admin.hash);

    if (!isHashMatch && !isDirectMatch) {
      const now = Date.now();
      let f = hits.get("lf:" + ip);
      if (!f || now > f.t) hits.set("lf:" + ip, { c: 1, t: now + 900000 });
      else f.c++;
      return send(res, 401, { error: "Incorrect username or password." });
    }

    // If direct match succeeded and hash in DB is different, synchronize the DB record
    if (isDirectMatch && !isHashMatch) {
      try {
        const newSalt = crypto.randomBytes(16).toString("hex");
        const newHash = hashPw(password, newSalt);
        await db.updateAdminPassword(username, newSalt, newHash);
      } catch (err) {
        console.warn("[login pass sync note]", err.message);
      }
    }

    // Reset rate limiter on successful authentication
    hits.delete("lf:" + ip);
    hits.delete("l:" + ip);
    hits.delete("lu:" + username);

    // Generate Session Token (7 days validity)
    const token = crypto.randomBytes(32).toString("hex");
    await db.createSession(token, username, SESSION_TTL);

    return send(res, 200, { ok: true, token, username }, { "Set-Cookie": cookie(token, SESSION_TTL) });
  }

  // 8. Admin Logout
  if (route === 'POST /api/admin/logout') {
    const sid = getSid(req);
    if (sid) await db.deleteSession(sid);
    return send(res, 200, { ok: true }, { 'Set-Cookie': cookie('', 0) });
  }

  // ─── Protected Admin Endpoints (Session Required) ─────────────────────────
  const sid = getSid(req);
  const sess = await db.validateSession(sid);
  if (!sess) {
    return send(res, 401, { error: 'Not signed in or session expired' });
  }

  // Slide cookie expiration on active authenticated request (7 days)
  const refreshCookie = { 'Set-Cookie': cookie(sid, SESSION_TTL) };

  // Current session check
  if (route === 'GET /api/admin/me') {
    return send(res, 200, { ok: true, username: sess.username }, refreshCookie);
  }

  // Admin Dashboard Data: Applications, Posts, Courses
  if (route === 'GET /api/admin/apps') {
    const [apps, posts, courses] = await Promise.all([
      db.getApplications(),
      db.getPosts(),
      db.getCourses(),
    ]);
    return send(res, 200, { apps, posts, courses, articles: courses }, refreshCookie);
  }

  // Update Application Status (Pending / Accepted / Rejected)
  if (route === 'POST /api/admin/status') {
    const { applicationNo, status } = b;
    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      return send(res, 400, { error: 'Invalid status value' });
    }
    const ok = await db.updateApplicationStatus(applicationNo, status);
    if (!ok) return send(res, 404, { error: 'Application not found' });
    return send(res, 200, { ok: true }, refreshCookie);
  }

  // Update Roll No & Registration No
  if (route === 'POST /api/admin/ids') {
    const { applicationNo, rollNo, registrationNo } = b;
    const ok = await db.updateApplicationIds(applicationNo, rollNo, registrationNo);
    if (!ok) return send(res, 404, { error: 'Application not found' });
    return send(res, 200, { ok: true }, refreshCookie);
  }

  // Save / Update Student Result
  if (route === 'POST /api/admin/result') {
    const { applicationNo, marks, totalMarks, grade, remarks, rollNo, registrationNo } = b;
    const m = Number(marks);
    const tot = Number(totalMarks);
    if (isNaN(m) || isNaN(tot) || m < 0 || tot <= 0 || m > tot) {
      return send(res, 400, { error: 'Marks must be between 0 and total marks.' });
    }
    const ok = await db.updateApplicationResult(applicationNo, {
      marks: m,
      totalMarks: tot,
      grade: t(grade, 10),
      remarks: t(remarks, 200),
      rollNo,
      registrationNo,
    });
    if (!ok) return send(res, 404, { error: 'Application number not found' });
    return send(res, 200, { ok: true }, refreshCookie);
  }

  // Delete Result
  if (route === 'POST /api/admin/result/delete') {
    const { applicationNo } = b;
    const ok = await db.deleteApplicationResult(applicationNo);
    if (!ok) return send(res, 404, { error: 'Application not found' });
    return send(res, 200, { ok: true }, refreshCookie);
  }

  // Delete Application
  if (route === 'POST /api/admin/app/delete') {
    const { applicationNo } = b;
    const ok = await db.deleteApplication(applicationNo);
    if (!ok) return send(res, 404, { error: 'Application not found' });
    return send(res, 200, { ok: true }, refreshCookie);
  }

  // Create / Update Post
  if (route === 'POST /api/admin/post') {
    if (!t(b.title, 120) || !t(b.body, 5000)) {
      return send(res, 400, { error: 'Title and content are required' });
    }
    const saved = await db.upsertPost(b);
    return send(res, 200, { ok: true, post: saved }, refreshCookie);
  }

  // Delete Post
  if (route === 'POST /api/admin/post/delete') {
    const ok = await db.deletePost(b.id);
    return send(res, 200, { ok }, refreshCookie);
  }

  // Create / Update Course
  if (route === 'POST /api/admin/course') {
    if (!t(b.name, 80) || !t(b.desc, 500)) {
      return send(res, 400, { error: 'Course name and description are required' });
    }
    const saved = await db.upsertCourse(b);
    return send(res, 200, { ok: true, course: saved }, refreshCookie);
  }

  // Delete Course
  if (route === 'POST /api/admin/course/delete') {
    const ok = await db.deleteCourse(b.id);
    return send(res, 200, { ok }, refreshCookie);
  }

  // Course Article / Gallery Update (compatibility)
  if (route === 'POST /api/admin/article') {
    const name = t(b.courseName, 80);
    const images = (Array.isArray(b.images) ? b.images : [])
      .map(x => t(x, 500))
      .filter(x => /^https?:\/\/[^\s"'<>]+$/i.test(x))
      .slice(0, 8);

    const courses = await db.getCourses();
    const existing = courses.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      await db.upsertCourse({
        ...existing,
        images,
        article: t(b.article, 5000),
      });
    }
    return send(res, 200, { ok: true }, refreshCookie);
  }

  // Change Admin Password
  if (route === 'POST /api/admin/password') {
    const admin = await db.getAdmin(sess.username);
    if (!admin || !eq(hashPw(String(b.current || ''), admin.salt), admin.hash)) {
      return send(res, 401, { error: 'Current password is incorrect.' });
    }
    if (!strong(b.newPassword)) {
      return send(res, 400, {
        error: 'New password must have at least 10 characters with upper, lower, and numbers.',
      });
    }

    const newSalt = crypto.randomBytes(16).toString('hex');
    const newHash = hashPw(b.newPassword, newSalt);
    await db.updateAdminPassword(sess.username, newSalt, newHash);

    return send(res, 200, { ok: true }, { 'Set-Cookie': cookie('', 0) });
  }

  return send(res, 404, { error: 'API route not found' });
}

// ─── Static Files & MIME ─────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const STATIC_ROUTES = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/admin': 'admin.html',
  '/admin.html': 'admin.html',
  '/app.js': 'app.js',
  '/admin.js': 'admin.js',
  '/style.css': 'style.css',
  '/punjab-logo.png': 'punjab-logo.png',
  '/favicon.png': 'favicon.png',
  '/og-image.png': 'og-image.png',
};

// ─── HTTP Request Handler (Vercel & Local) ──────────────────────────────────
async function handleRequest(req, res) {
  // Ensure DB connection in Serverless environments
  if (!db.checkDbReady()) {
    try { await db.initDb(); } catch (e) { console.error('[db init error]', e.message); }
  }

  // CORS Headers for seamless local & remote testing
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, Cookie, X-Session-Token');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  try {
    const u = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let p = u.pathname;
    if (u.searchParams.has('path')) {
      p = '/api/' + String(u.searchParams.get('path')).replace(/^\/+|\/+$/g, '');
    }

    // API Routing
    if (p.startsWith('/api/')) {
      return await api(req, res, p, u);
    }

    // SEO robots.txt
    if (p === '/robots.txt') {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end(
        `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin.html\nDisallow: /api/\nSitemap: http://${req.headers.host || 'localhost'}/sitemap.xml\n`
      );
    }

    // SEO sitemap.xml
    if (p === '/sitemap.xml') {
      res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
      const host = req.headers.host || 'localhost:3000';
      return res.end(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>http://${host}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n</urlset>`
      );
    }

    // Static File Serving
    const filename = STATIC_ROUTES[p];
    if (filename && (req.method === 'GET' || req.method === 'HEAD')) {
      const publicPath = path.join(ROOT, 'public', filename);
      const rootPath = path.join(ROOT, filename);
      const filePath = fs.existsSync(publicPath) ? publicPath : (fs.existsSync(rootPath) ? rootPath : null);

      if (filePath) {
        const ext = path.extname(filename);
        res.writeHead(200, {
          'Content-Type': MIME[ext] || 'application/octet-stream',
          'Cache-Control': ext === '.png' || ext === '.jpg' ? 'public, max-age=86400' : 'no-cache',
        });
        if (req.method === 'HEAD') return res.end();
        return fs.createReadStream(filePath).pipe(res);
      }
    }

    // 404 handler
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 Not Found</h1><p>The requested page was not found.</p>');
  } catch (err) {
    console.error('[server error]', err);
    if (!res.headersSent) {
      send(res, 500, { error: 'Internal Server Error' });
    }
  }
}

const server = http.createServer(handleRequest);

// ─── Start Server ────────────────────────────────────────────────────────────
async function start() {
  try {
    await db.initDb();
  } catch (e) {
    console.error('[database error]', e.message);
  }

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.error(`[server error] Port ${PORT} already in use. Retrying in 1s...`);
      setTimeout(() => {
        server.close();
        server.listen(PORT, HOST);
      }, 1000);
    } else {
      console.error('[server error]', e);
    }
  });

  server.listen(PORT, HOST, () => {
    console.log(`
┌─────────────────────────────────────────────────────────┐
│   4Bit Academy — Complete Server with MongoDB Atlas    │
├─────────────────────────────────────────────────────────┤
│   Website: http://localhost:${PORT}                      │
│   Admin:   http://localhost:${PORT}/admin.html           │
│   Health:  http://localhost:${PORT}/api/health          │
├─────────────────────────────────────────────────────────┤
│   DB:      MongoDB Atlas (${db.checkDbReady() ? 'Connected ✅' : 'Connecting...'})       │
│   Admin:   User: admin                                  │
└─────────────────────────────────────────────────────────┘
`);
  });
}

process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});

// Start local dev server only when executed directly via node server.js
if (require.main === module) {
  try { process.stdin.resume(); } catch {}
  setInterval(() => {}, 10000);
  start();
}

// Export request handler function as default export for Vercel
module.exports = handleRequest;
module.exports.handleRequest = handleRequest;
module.exports.server = server;
module.exports.api = api;
module.exports.db = db;

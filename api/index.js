'use strict';
/**
 * 4Bit Academy — Vercel Serverless Function API Entrypoint
 * Handles all /api/* routes on Vercel using MongoDB Atlas.
 */

const crypto = require('crypto');
const path = require('path');
const db = require('../db');

const E = process.env;
const PROD = Boolean(E.VERCEL || E.NODE_ENV === 'production');

const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const hashPw = (pw, salt) => crypto.scryptSync(String(pw), salt, 64).toString('hex');
const eq = (a, b) => {
  const x = Buffer.from(String(a || ''));
  const y = Buffer.from(String(b || ''));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};
const strong = p =>
  typeof p === 'string' &&
  p.length >= 10 &&
  p.length <= 128 &&
  /[a-z]/.test(p) &&
  /[A-Z]/.test(p) &&
  /\d/.test(p);

const t = (v, n) => String(v ?? '').trim().slice(0, n);
const maskNum = s => (s ? s.slice(0, -4).replace(/\d/g, '•') + s.slice(-4) : '');

// In-memory rate limiter for serverless instance
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

function send(res, code, obj, extraHeaders = {}) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  for (const k in extraHeaders) res.setHeader(k, extraHeaders[k]);
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return null;
      }
    }
    return req.body;
  }
  return new Promise(resolve => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 2e6) {
        resolve(null);
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch {
        resolve(null);
      }
    });
  });
}

function ipOf(req) {
  return (
    String(req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || '')
      .split(',')[0]
      .trim() || '127.0.0.1'
  );
}

function getSid(req) {
  const m = (req.headers.cookie || '').match(/(?:^|; )sid=([a-f0-9]{48,64})/);
  return m ? m[1] : null;
}

const cookie = (v, age) =>
  `sid=${v}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${age}${PROD ? '; Secure' : ''}`;

module.exports = async (req, res) => {
  // CORS Headers
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, Cookie');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  try {
    const u = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let p = u.pathname;

    // Vercel rewrite handling
    if (u.searchParams.has('path')) {
      p = '/api/' + String(u.searchParams.get('path')).replace(/^\/+|\/+$/g, '');
    }

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
      await db.initDb();
      const dbOk = db.checkDbReady();
      return send(res, 200, {
        status: dbOk ? 'ok' : 'initializing',
        database: 'MongoDB Atlas',
        database_ready: dbOk,
        auth_mode: 'direct_password',
        deployment: 'Vercel Serverless',
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

    // 4. Public Content
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
        return send(res, 429, { error: 'Too many submissions. Please try later.' });
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

    // 7. Admin Login
    if (route === 'POST /api/admin/login') {
      const username = t(b.username, 40).toLowerCase();
      const password = String(b.password || '').slice(0, 200);

      if (limited('l:' + ip, 10, 900000) || limited('lu:' + username, 15, 900000)) {
        return send(res, 429, { error: 'Too many login attempts. Please try again in 15 minutes.' });
      }

      const admin = await db.getAdmin(username);
      if (!admin || !admin.salt || !admin.hash) {
        return send(res, 401, { error: 'Incorrect username or password.' });
      }

      const inputHash = hashPw(password, admin.salt);
      if (!eq(inputHash, admin.hash)) {
        return send(res, 401, { error: 'Incorrect username or password.' });
      }

      const token = crypto.randomBytes(32).toString('hex');
      await db.createSession(token, username, 1800);

      return send(res, 200, { ok: true }, { 'Set-Cookie': cookie(token, 1800) });
    }

    // 8. Admin Logout
    if (route === 'POST /api/admin/logout') {
      const sid = getSid(req);
      if (sid) await db.deleteSession(sid);
      return send(res, 200, { ok: true }, { 'Set-Cookie': cookie('', 0) });
    }

    // ─── Protected Admin Endpoints ──────────────────────────────────────────
    const sid = getSid(req);
    const sess = await db.validateSession(sid);
    if (!sess) {
      return send(res, 401, { error: 'Not signed in or session expired' });
    }

    const refreshCookie = { 'Set-Cookie': cookie(sid, 1800) };

    if (route === 'GET /api/admin/me') {
      return send(res, 200, { ok: true, username: sess.username }, refreshCookie);
    }

    if (route === 'GET /api/admin/apps') {
      const [apps, posts, courses] = await Promise.all([
        db.getApplications(),
        db.getPosts(),
        db.getCourses(),
      ]);
      return send(res, 200, { apps, posts, courses, articles: courses }, refreshCookie);
    }

    if (route === 'POST /api/admin/status') {
      const { applicationNo, status } = b;
      if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
        return send(res, 400, { error: 'Invalid status value' });
      }
      const ok = await db.updateApplicationStatus(applicationNo, status);
      if (!ok) return send(res, 404, { error: 'Application not found' });
      return send(res, 200, { ok: true }, refreshCookie);
    }

    if (route === 'POST /api/admin/ids') {
      const { applicationNo, rollNo, registrationNo } = b;
      const ok = await db.updateApplicationIds(applicationNo, rollNo, registrationNo);
      if (!ok) return send(res, 404, { error: 'Application not found' });
      return send(res, 200, { ok: true }, refreshCookie);
    }

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

    if (route === 'POST /api/admin/result/delete') {
      const { applicationNo } = b;
      const ok = await db.deleteApplicationResult(applicationNo);
      if (!ok) return send(res, 404, { error: 'Application not found' });
      return send(res, 200, { ok: true }, refreshCookie);
    }

    if (route === 'POST /api/admin/app/delete') {
      const { applicationNo } = b;
      const ok = await db.deleteApplication(applicationNo);
      if (!ok) return send(res, 404, { error: 'Application not found' });
      return send(res, 200, { ok: true }, refreshCookie);
    }

    if (route === 'POST /api/admin/post') {
      if (!t(b.title, 120) || !t(b.body, 5000)) {
        return send(res, 400, { error: 'Title and content are required' });
      }
      const saved = await db.upsertPost(b);
      return send(res, 200, { ok: true, post: saved }, refreshCookie);
    }

    if (route === 'POST /api/admin/post/delete') {
      const ok = await db.deletePost(b.id);
      return send(res, 200, { ok }, refreshCookie);
    }

    if (route === 'POST /api/admin/course') {
      if (!t(b.name, 80) || !t(b.desc, 500)) {
        return send(res, 400, { error: 'Course name and description are required' });
      }
      const saved = await db.upsertCourse(b);
      return send(res, 200, { ok: true, course: saved }, refreshCookie);
    }

    if (route === 'POST /api/admin/course/delete') {
      const ok = await db.deleteCourse(b.id);
      return send(res, 200, { ok }, refreshCookie);
    }

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
  } catch (err) {
    console.error('[api error]', err);
    return send(res, 500, { error: 'Internal Server Error' });
  }
};

'use strict';
/**
 * 4Bit Academy — Complete MongoDB Atlas Database Module
 * Handles connections, schema indexing, automatic migration, and CRUD operations.
 */

// Node.js v26 compatibility patch for net.Socket.setKeepAlive
const net = require('net');
if (net.Socket.prototype.setKeepAlive) {
  const _orig = net.Socket.prototype.setKeepAlive;
  net.Socket.prototype.setKeepAlive = function (enable, initialDelay) {
    try {
      return _orig.call(this, enable, initialDelay || 0);
    } catch {
      /* ignore */
    }
  };
}

const { MongoClient } = require('mongodb');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://4dadmin:4badmin@cluster0.rzbr0ll.mongodb.net/';
const DB_NAME = process.env.MONGODB_DB || process.env.MONGO_DB || '4bitacademy';

let client = null;
let db = null;
let isConnected = false;
let initPromise = null;

// Collections
let colApps = null;
let colCourses = null;
let colPosts = null;
let colAdmin = null;
let colSessions = null;

// Helpers
const hashPw = (pw, salt) => crypto.scryptSync(String(pw), salt, 64).toString('hex');

/**
 * Connect to MongoDB and set up collections and indexes.
 */
async function initDb() {
  if (isConnected && db) return db;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    let uri = MONGO_URI;
    if (!uri.includes('retryWrites')) {
      uri += (uri.includes('?') ? '&' : '?') + 'retryWrites=true&w=majority';
    }

    const clientOpts = {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    };
    if (process.platform === 'darwin') {
      clientOpts.family = 4;
    }

    client = new MongoClient(uri, clientOpts);

    await client.connect();
    db = client.db(DB_NAME);
    isConnected = true;

    colApps = db.collection('applications');
    colCourses = db.collection('courses');
    colPosts = db.collection('posts');
    colAdmin = db.collection('admin');
    colSessions = db.collection('sessions');

    // ─── Create Indexes (Non-blocking background) ─────────────────────
    Promise.all([
      colApps.createIndex({ applicationNo: 1 }, { unique: true }),
      colApps.createIndex({ rollNo: 1 }),
      colApps.createIndex({ registrationNo: 1 }),
      colCourses.createIndex({ id: 1 }, { unique: true }),
      colPosts.createIndex({ id: 1 }, { unique: true }),
      colPosts.createIndex({ createdAt: -1 }),
      colAdmin.createIndex({ username: 1 }, { unique: true }),
      colSessions.createIndex({ token: 1 }, { unique: true }),
      colSessions.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0, sparse: true }),
    ]).catch(e => console.warn('[database index note]', e.message));

    // ─── Automatic Data Migration from old kvstore ───────────────────
    try {
      const kvCol = db.collection('kvstore');
      const oldKv = await kvCol.findOne({ key: '4b:db' });
      if (oldKv && oldKv.value) {
        console.log('[database] 🔄 Found legacy kvstore data, migrating to collections...');
        const legacyData = typeof oldKv.value === 'string' ? JSON.parse(oldKv.value) : oldKv.value;

        // 1. Migrate applications
        if (Array.isArray(legacyData.apps) && legacyData.apps.length > 0) {
          for (const app of legacyData.apps) {
            if (app.applicationNo) {
              const { _id, ...cleanApp } = app;
              await colApps.updateOne(
                { applicationNo: app.applicationNo },
                { $set: cleanApp },
                { upsert: true }
              );
            }
          }
          console.log(`[database] ✅ Migrated ${legacyData.apps.length} applications from legacy kvstore.`);
        }

        // 2. Migrate courses
        if (Array.isArray(legacyData.courses) && legacyData.courses.length > 0) {
          for (const c of legacyData.courses) {
            if (c.id || c.name) {
              const id = c.id || crypto.randomBytes(6).toString('hex');
              const { _id, ...cleanCourse } = c;
              await colCourses.updateOne(
                { id },
                { $set: { ...cleanCourse, id } },
                { upsert: true }
              );
            }
          }
          console.log(`[database] ✅ Migrated ${legacyData.courses.length} courses from legacy kvstore.`);
        }

        // 3. Migrate posts
        if (Array.isArray(legacyData.posts) && legacyData.posts.length > 0) {
          for (const p of legacyData.posts) {
            if (p.id) {
              const { _id, ...cleanPost } = p;
              await colPosts.updateOne(
                { id: p.id },
                { $set: cleanPost },
                { upsert: true }
              );
            }
          }
        }

        // 4. Migrate admin
        if (legacyData.admin && legacyData.admin.username && legacyData.admin.hash) {
          const { _id, ...cleanAdmin } = legacyData.admin;
          await colAdmin.updateOne(
            { username: legacyData.admin.username },
            { $set: cleanAdmin },
            { upsert: true }
          );
        }
      }
    } catch (migErr) {
      console.warn('[database] Note on legacy migration:', migErr.message);
    }

    // ─── Initial Admin Seeding & Env Sync ───────────────────────────
    const adminUser = (process.env.ADMIN_USER || 'admin').toLowerCase();
    const adminPass = process.env.ADMIN_PASSWORD || process.env.ADMIN_DEFAULT_PASSWORD || 'admin';
    const existingAdmin = await colAdmin.findOne({ username: adminUser });

    if (!existingAdmin) {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = hashPw(adminPass, salt);
      await colAdmin.insertOne({
        username: adminUser,
        salt,
        hash,
        createdAt: new Date(),
      });
      console.log(`[database] 👤 Admin account seeded: ${adminUser}`);
    } else {
      const targetPass = process.env.ADMIN_PASSWORD || process.env.ADMIN_DEFAULT_PASSWORD;
      if (targetPass) {
        const currentExpectedHash = hashPw(targetPass, existingAdmin.salt);
        if (currentExpectedHash !== existingAdmin.hash) {
          const newSalt = crypto.randomBytes(16).toString('hex');
          const newHash = hashPw(targetPass, newSalt);
          await colAdmin.updateOne(
            { username: adminUser },
            { $set: { salt: newSalt, hash: newHash, updatedAt: new Date() } }
          );
          console.log(`[database] 🔑 Admin password synchronized with ADMIN_PASSWORD env variable`);
        }
      }
    }

    // ─── Initial Courses Seeding ─────────────────────────────────────
    const coursesCount = await colCourses.countDocuments();
    if (coursesCount === 0) {
      const defaultCoursesPath = path.join(__dirname, 'default-courses.json');
      if (fs.existsSync(defaultCoursesPath)) {
        try {
          const raw = fs.readFileSync(defaultCoursesPath, 'utf8');
          const defaultCourses = JSON.parse(raw);
          const docs = defaultCourses.map(c => ({
            id: crypto.randomBytes(6).toString('hex'),
            ...c,
            createdAt: new Date(),
          }));
          await colCourses.insertMany(docs);
          console.log(`[database] 📚 Seeded ${docs.length} default courses.`);
        } catch (e) {
          console.error('[database] Failed to load default-courses.json:', e.message);
        }
      }
    }

    console.log('[database] ✅ Connected to MongoDB Atlas & Ready!');
    return db;
  })();

  return initPromise;
}

// Ensure DB is initialized before executing operations
async function getDb() {
  if (!isConnected || !db) {
    await initDb();
  }
  return db;
}

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATIONS CRUD
// ─────────────────────────────────────────────────────────────────────────────

async function getApplications() {
  await getDb();
  return colApps.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
}

async function getApplicationByNo(applicationNo) {
  await getDb();
  return colApps.findOne({ applicationNo }, { projection: { _id: 0 } });
}

async function lookupStudent(query, isVerify = false) {
  await getDb();
  const q = String(query || '').trim();
  if (!q) return null;

  const regex = new RegExp(`^${q}$`, 'i');
  let filter;
  if (isVerify) {
    filter = { rollNo: regex };
  } else {
    filter = {
      $or: [
        { applicationNo: regex },
        { rollNo: regex },
        { registrationNo: regex },
      ],
    };
  }

  return colApps.findOne(filter, { projection: { _id: 0 } });
}

async function getNextApplicationNo() {
  await getDb();
  const currentYear = new Date().getFullYear();
  const prefix = `4B-${currentYear}-`;

  const apps = await colApps
    .find({ applicationNo: { $regex: `^${prefix}` } }, { projection: { applicationNo: 1, _id: 0 } })
    .toArray();

  let maxNum = 0;
  for (const app of apps) {
    const parts = String(app.applicationNo).split('-');
    const num = parseInt(parts[2], 10);
    if (!isNaN(num) && num > maxNum) maxNum = num;
  }

  const nextNum = String(maxNum + 1).padStart(4, '0');
  return `${prefix}${nextNum}`;
}

async function createApplication(data) {
  await getDb();
  const applicationNo = data.applicationNo || (await getNextApplicationNo());
  const now = new Date();

  const record = {
    applicationNo,
    studentName: String(data.studentName || '').trim(),
    fatherName: String(data.fatherName || '').trim(),
    phone: String(data.phone || '').trim(),
    cnic: String(data.cnic || '').trim(),
    course: String(data.course || '').trim(),
    dob: String(data.dob || '').trim(),
    address: String(data.address || '').trim(),
    education: String(data.education || '').trim(),
    status: 'Pending',
    rollNo: '',
    registrationNo: '',
    marks: '',
    totalMarks: '',
    grade: '',
    remarks: '',
    submittedAt: now.toLocaleString('en-GB', { timeZone: 'Asia/Karachi' }),
    createdAt: now,
  };

  await colApps.insertOne(record);
  return record;
}

async function updateApplicationStatus(applicationNo, status) {
  await getDb();
  const res = await colApps.updateOne(
    { applicationNo },
    { $set: { status, updatedAt: new Date() } }
  );
  return res.matchedCount > 0;
}

async function updateApplicationIds(applicationNo, rollNo, registrationNo) {
  await getDb();
  const res = await colApps.updateOne(
    { applicationNo },
    {
      $set: {
        rollNo: String(rollNo || '').trim(),
        registrationNo: String(registrationNo || '').trim(),
        updatedAt: new Date(),
      },
    }
  );
  return res.matchedCount > 0;
}

async function updateApplicationResult(applicationNo, { marks, totalMarks, grade, remarks, rollNo, registrationNo }) {
  await getDb();
  const updateData = {
    marks: Number(marks),
    totalMarks: Number(totalMarks),
    grade: String(grade || '').trim(),
    remarks: String(remarks || '').trim(),
    updatedAt: new Date(),
  };

  if (rollNo !== undefined) updateData.rollNo = String(rollNo || '').trim();
  if (registrationNo !== undefined) updateData.registrationNo = String(registrationNo || '').trim();

  const res = await colApps.updateOne({ applicationNo }, { $set: updateData });
  return res.matchedCount > 0;
}

async function deleteApplicationResult(applicationNo) {
  await getDb();
  const res = await colApps.updateOne(
    { applicationNo },
    {
      $set: {
        marks: '',
        totalMarks: '',
        grade: '',
        remarks: '',
        updatedAt: new Date(),
      },
    }
  );
  return res.matchedCount > 0;
}

async function deleteApplication(applicationNo) {
  await getDb();
  const res = await colApps.deleteOne({ applicationNo });
  return res.deletedCount > 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// COURSES CRUD
// ─────────────────────────────────────────────────────────────────────────────

async function getCourses() {
  await getDb();
  return colCourses.find({}, { projection: { _id: 0 } }).toArray();
}

async function upsertCourse(courseData) {
  await getDb();
  const id = courseData.id || crypto.randomBytes(6).toString('hex');
  const clean = {
    id,
    name: String(courseData.name || '').trim(),
    short: String(courseData.short || courseData.name || '').trim(),
    icon: String(courseData.icon || '📘').trim(),
    c1: courseData.c1 || '#2874e8',
    c2: courseData.c2 || '#27c4d4',
    desc: String(courseData.desc || '').trim(),
    adv: Array.isArray(courseData.adv) ? courseData.adv : [],
    topics: Array.isArray(courseData.topics) ? courseData.topics : [],
    images: Array.isArray(courseData.images) ? courseData.images : [],
    article: String(courseData.article || '').trim(),
    updatedAt: new Date(),
  };

  await colCourses.updateOne({ id }, { $set: clean }, { upsert: true });
  return clean;
}

async function deleteCourse(id) {
  await getDb();
  const res = await colCourses.deleteOne({ id });
  return res.deletedCount > 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// POSTS CRUD
// ─────────────────────────────────────────────────────────────────────────────

async function getPosts() {
  await getDb();
  return colPosts.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
}

async function upsertPost(postData) {
  await getDb();
  const id = postData.id || crypto.randomBytes(6).toString('hex');
  const now = new Date();
  const clean = {
    id,
    title: String(postData.title || '').trim(),
    category: String(postData.category || 'News').trim(),
    body: String(postData.body || '').trim(),
    date: postData.date || now.toLocaleDateString('en-GB'),
    updatedAt: now,
  };

  if (!postData.id) {
    clean.createdAt = now;
  }

  await colPosts.updateOne({ id }, { $set: clean }, { upsert: true });
  return clean;
}

async function deletePost(id) {
  await getDb();
  const res = await colPosts.deleteOne({ id });
  return res.deletedCount > 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN & AUTH CRUD
// ─────────────────────────────────────────────────────────────────────────────

async function getAdmin(username) {
  await getDb();
  return colAdmin.findOne({ username }, { projection: { _id: 0 } });
}

async function updateAdminPassword(username, salt, hash) {
  await getDb();
  const res = await colAdmin.updateOne(
    { username },
    { $set: { salt, hash, updatedAt: new Date() } },
    { upsert: true }
  );
  // Also clear all active sessions for security
  await colSessions.deleteMany({ username });
  return res.matchedCount > 0 || res.upsertedCount > 0;
}

async function createSession(token, username, ttlSeconds = 604800) {
  await getDb();
  const expireAt = new Date(Date.now() + ttlSeconds * 1000);
  await colSessions.updateOne(
    { token },
    { $set: { token, username, expireAt, createdAt: new Date() } },
    { upsert: true }
  );
  return { token, expireAt };
}

async function validateSession(token) {
  if (!token) return null;
  await getDb();
  const sess = await colSessions.findOne({ token, expireAt: { $gt: new Date() } });
  if (!sess) return null;

  // Slide expiration (keep alive for 7 days on active use)
  const newExpireAt = new Date(Date.now() + 604800 * 1000);
  await colSessions.updateOne({ token }, { $set: { expireAt: newExpireAt } });
  return sess;
}

async function deleteSession(token) {
  if (!token) return;
  await getDb();
  await colSessions.deleteOne({ token });
}

function checkDbReady() {
  return isConnected && db !== null;
}

module.exports = {
  initDb,
  getDb,
  checkDbReady,
  // Applications
  getApplications,
  getApplicationByNo,
  lookupStudent,
  getNextApplicationNo,
  createApplication,
  updateApplicationStatus,
  updateApplicationIds,
  updateApplicationResult,
  deleteApplicationResult,
  deleteApplication,
  // Courses
  getCourses,
  upsertCourse,
  deleteCourse,
  // Posts
  getPosts,
  upsertPost,
  deletePost,
  // Admin & Auth
  getAdmin,
  updateAdminPassword,
  createSession,
  validateSession,
  deleteSession,
};

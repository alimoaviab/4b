'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { MongoClient } = require('mongodb');

// Node.js v26 compatibility patch
const net = require('net');
if (net.Socket.prototype.setKeepAlive) {
  const _orig = net.Socket.prototype.setKeepAlive;
  net.Socket.prototype.setKeepAlive = function (enable, initialDelay) {
    try { return _orig.call(this, enable, initialDelay || 0); } catch {}
  };
}

const envFile = path.join(__dirname, '..', '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }
}

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || '4bitacademy';

async function resetDb() {
  console.log(`[reset] 🍃 Connecting to MongoDB Atlas (${DB_NAME})...`);
  const client = new MongoClient(MONGO_URI, { family: 4 });
  await client.connect();
  const db = client.db(DB_NAME);

  const colApps = db.collection('applications');
  const colCourses = db.collection('courses');
  const colPosts = db.collection('posts');
  const colAdmin = db.collection('admin');
  const colSessions = db.collection('sessions');
  const colKv = db.collection('kvstore');

  // 1. Delete all student applications & test results
  const delApps = await colApps.deleteMany({});
  console.log(`[reset] 🗑️  Cleared applications: ${delApps.deletedCount} removed.`);

  // 2. Delete all active sessions
  const delSess = await colSessions.deleteMany({});
  console.log(`[reset] 🗑️  Cleared sessions: ${delSess.deletedCount} removed.`);

  // 3. Clear legacy kvstore so old data does not migrate back
  const delKv = await colKv.deleteMany({});
  console.log(`[reset] 🗑️  Cleared legacy kvstore: ${delKv.deletedCount} items removed.`);

  // 4. Reset default courses
  await colCourses.deleteMany({});
  const defaultCourses = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'default-courses.json'), 'utf8'));
  const courseDocs = defaultCourses.map((c, i) => ({
    id: crypto.randomBytes(6).toString('hex'),
    ...c,
    createdAt: new Date(),
    order: i + 1,
  }));
  await colCourses.insertMany(courseDocs);
  console.log(`[reset] 📚 Seeded fresh courses: ${courseDocs.length} courses loaded.`);

  // 5. Reset admin credentials (admin / admin)
  await colAdmin.deleteMany({});
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync('admin', salt, 64).toString('hex');
  await colAdmin.insertOne({
    username: 'admin',
    salt,
    hash,
    updatedAt: new Date(),
    createdAt: new Date(),
  });
  console.log(`[reset] 👤 Admin account reset: username=admin, password=admin`);

  // 6. Reset announcements / posts
  await colPosts.deleteMany({});
  const defaultPosts = [
    {
      id: 'post-01',
      title: 'New Batch Admissions Open — Spring 2026',
      category: 'Admissions',
      body: 'Applications are now open for all certificate and diploma IT courses including Web Development, Graphic Design, SEO, Office Management, and CIT/DIT. Apply online or visit our campus on Multan Road, Abdul Hakim.',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdAt: new Date(),
    },
    {
      id: 'post-02',
      title: 'Student Verification & Online Result Portal Live',
      category: 'Examination',
      body: 'Official student verification and printable result cards are now available online. Enrolled students can verify their credentials using their Roll Number or Application Number.',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdAt: new Date(),
    }
  ];
  await colPosts.insertMany(defaultPosts);
  console.log(`[reset] 📢 Seeded default posts: ${defaultPosts.length} announcements.`);

  await client.close();
  console.log(`[reset] ✅ Database reset completed successfully!`);
}

resetDb().catch(e => {
  console.error('[reset error]', e);
  process.exit(1);
});

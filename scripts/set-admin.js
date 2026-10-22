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

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://4dadmin:4badmin@cluster0.rzbr0ll.mongodb.net/';
const DB_NAME = process.env.MONGODB_DB || '4bitacademy';
const targetUser = (process.env.ADMIN_USER || 'admin').toLowerCase();
const targetPass = process.env.ADMIN_PASSWORD || 'admin';

const hashPw = (pw, salt) => crypto.scryptSync(String(pw), salt, 64).toString('hex');

async function setAdmin() {
  console.log(`[set-admin] 🍃 Connecting to MongoDB Atlas (${DB_NAME})...`);
  const client = new MongoClient(MONGO_URI, { family: 4 });
  await client.connect();
  const db = client.db(DB_NAME);
  const colAdmin = db.collection('admin');
  const colSessions = db.collection('sessions');

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPw(targetPass, salt);

  const res = await colAdmin.updateOne(
    { username: targetUser },
    {
      $set: {
        username: targetUser,
        salt,
        hash,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      }
    },
    { upsert: true }
  );

  // Clear existing sessions so stale sessions do not linger
  const delSess = await colSessions.deleteMany({});

  console.log(`[set-admin] ✅ Admin credentials updated successfully!`);
  console.log(`[set-admin] 👤 Username: ${targetUser}`);
  console.log(`[set-admin] 🔑 Password: ${targetPass}`);
  console.log(`[set-admin] 🧹 Sessions cleared: ${delSess.deletedCount}`);

  await client.close();
}

setAdmin().catch(err => {
  console.error('[set-admin error]', err);
  process.exit(1);
});

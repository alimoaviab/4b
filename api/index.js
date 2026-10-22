'use strict';
/**
 * 4Bit Academy — Vercel Serverless Function API Entrypoint
 * Bridges Vercel serverless requests directly to the unified request handler in server.js
 */
const { handleRequest, db } = require('../server');

module.exports = async (req, res) => {
  try {
    await db.initDb();
    await handleRequest(req, res);
  } catch (err) {
    console.error('[Vercel Serverless Function Error]', err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Server error: ' + err.message }));
    }
  }
};

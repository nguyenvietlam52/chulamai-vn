#!/usr/bin/env node
// Zalo Contacts Manager — backend
// Web app quản lý danh bạ Zalo cá nhân chú Lãm (profile openzca: chulam)
// Bind 127.0.0.1 ONLY. Xóa tuần tự có delay. Audit log JSONL.

import http from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 23388);
const PROFILE = process.env.ZALO_PROFILE || 'chulam';
const AUDIT_LOG = path.join(__dirname, 'audit-removed.jsonl');
const DELETE_DELAY_MS = 2500; // delay giữa các lệnh xóa — tránh Zalo rate-ban
const pexecFile = promisify(execFile);

function runZca(args, timeoutMs = 60000) {
  return pexecFile('openzca', ['--profile', PROFILE, ...args], {
    timeout: timeoutMs,
    shell: process.platform === 'win32',
    maxBuffer: 64 * 1024 * 1024,
  });
}

// ---- friends cache (đỡ gọi CLI liên tục) ----
let friendsCache = { at: 0, data: null };

async function getFriends(force = false) {
  if (!force && friendsCache.data && Date.now() - friendsCache.at < 60_000) {
    return friendsCache.data;
  }
  const { stdout } = await runZca(['friend', 'list', '--json'], 120000);
  const parsed = JSON.parse(stdout);
  const arr = Array.isArray(parsed) ? parsed : parsed.friends || parsed.data || [];
  friendsCache = { at: Date.now(), data: arr };
  return arr;
}

// ---- delete queue (tuần tự, có delay, trạng thái theo dõi được) ----
const job = {
  running: false,
  total: 0,
  done: 0,
  ok: [],
  failed: [], // {userId, displayName, error}
  current: null,
  startedAt: null,
  finishedAt: null,
  stopRequested: false,
};

function auditWrite(entry) {
  fs.appendFileSync(AUDIT_LOG, JSON.stringify(entry) + '\n');
}

async function processQueue(items) {
  job.running = true;
  job.total = items.length;
  job.done = 0;
  job.ok = [];
  job.failed = [];
  job.startedAt = new Date().toISOString();
  job.finishedAt = null;
  job.stopRequested = false;

  for (const it of items) {
    if (job.stopRequested) break;
    job.current = it;
    try {
      const { stdout, stderr } = await runZca(['friend', 'remove', it.userId], 60000);
      const out = (stdout + stderr).trim();
      // openzca in lỗi ra stdout đôi khi — check heuristic
      if (/error|fail/i.test(out) && !/success/i.test(out)) {
        throw new Error(out.slice(0, 300));
      }
      job.ok.push(it);
      auditWrite({
        ts: new Date().toISOString(),
        action: 'remove',
        userId: it.userId,
        displayName: it.displayName,
        result: 'ok',
      });
    } catch (e) {
      job.failed.push({ ...it, error: String(e.message || e).slice(0, 300) });
      auditWrite({
        ts: new Date().toISOString(),
        action: 'remove',
        userId: it.userId,
        displayName: it.displayName,
        result: 'error',
        error: String(e.message || e).slice(0, 300),
      });
    }
    job.done++;
    job.current = null;
    if (job.done < job.total) {
      await new Promise((r) => setTimeout(r, DELETE_DELAY_MS));
    }
  }

  job.running = false;
  job.finishedAt = new Date().toISOString();
  friendsCache = { at: 0, data: null }; // invalidate
}

// ---- http helpers ----
function json(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => {
      data += c;
      if (data.length > 5e6) reject(new Error('body too large'));
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  try {
    if (req.method === 'GET' && url.pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fs.readFileSync(path.join(__dirname, 'index.html')));
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/status') {
      let auth = null;
      try {
        const { stdout } = await runZca(['auth', 'status'], 30000);
        auth = stdout.trim();
      } catch (e) {
        auth = 'error: ' + e.message;
      }
      json(res, 200, { profile: PROFILE, auth, job });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/friends') {
      const force = url.searchParams.get('force') === '1';
      const friends = await getFriends(force);
      json(res, 200, { count: friends.length, friends });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/remove') {
      if (job.running) {
        json(res, 409, { error: 'Đang có đợt xóa chạy — chờ xong đã' });
        return;
      }
      const body = JSON.parse(await readBody(req));
      const items = (body.items || []).filter((x) => x && x.userId);
      if (!items.length) {
        json(res, 400, { error: 'Không có ai được chọn' });
        return;
      }
      if (body.confirm !== 'XOA') {
        json(res, 400, { error: 'Thiếu xác nhận' });
        return;
      }
      processQueue(items); // chạy nền, client poll /api/job
      json(res, 200, { started: true, total: items.length });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/stop') {
      job.stopRequested = true;
      json(res, 200, { stopping: true });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/job') {
      json(res, 200, job);
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/audit') {
      let lines = [];
      if (fs.existsSync(AUDIT_LOG)) {
        lines = fs
          .readFileSync(AUDIT_LOG, 'utf8')
          .trim()
          .split('\n')
          .filter(Boolean)
          .map((l) => JSON.parse(l));
      }
      json(res, 200, { entries: lines.reverse().slice(0, 500) });
      return;
    }

    json(res, 404, { error: 'not found' });
  } catch (e) {
    json(res, 500, { error: String(e.message || e).slice(0, 500) });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Zalo Contacts Manager: http://127.0.0.1:${PORT} (profile=${PROFILE})`);
});

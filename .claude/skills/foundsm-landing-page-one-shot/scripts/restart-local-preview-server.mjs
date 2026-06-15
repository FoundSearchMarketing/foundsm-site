#!/usr/bin/env node

import { execFileSync, spawn, spawnSync } from 'node:child_process';
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const args = parseArgs(process.argv.slice(2));
const port = Number(args.port || process.env.FOUNDSM_PAGE_BUILDER_PORT || 4321);
const host = String(args.host || '127.0.0.1');
const slug = args.slug ? String(args.slug).replace(/^\/+|\/+$/g, '') : '';
const shouldBuild = Boolean(args.build);
const timeoutMs = Number(args.timeout || 60000);
const root = process.cwd();
const stateDir = path.join(root, '.astro', 'page-builder-preview');
const logPath = path.join(stateDir, `server-${port}.log`);
const pidPath = path.join(stateDir, `server-${port}.json`);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error(`Invalid port: ${args.port}`);
}

if (args.help) {
  printUsage();
  process.exit(0);
}

mkdirSync(stateDir, { recursive: true });

const killedPids = await restartOwnedPort(port);

if (shouldBuild) {
  runBuild();
}

const child = startServer();
const routePath = slug ? `/lp/${slug}/` : '/';
const url = `http://${host}:${port}${routePath}`;

try {
  await waitForHttp200(url, timeoutMs);
} catch (error) {
  const logTail = readLogTail(logPath);
  console.error(JSON.stringify({
    error: error.message,
    port,
    pid: child.pid,
    url,
    logPath,
    logTail,
  }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  port,
  pid: child.pid,
  url,
  killedPids,
  buildRan: shouldBuild,
  logPath,
  pidPath,
}, null, 2));

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith('--')) {
      continue;
    }

    const key = item.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}

function printUsage() {
  console.log(`
Usage:
  bun scripts/restart-local-preview-server.mjs --slug <slug> [--port 4321] [--build]

Restarts the selected helper-owned preview port, optionally runs bun run build,
starts bun run dev on that same port, and verifies /lp/<slug>/ returns HTTP 200.
If the port is occupied by an unknown process, choose a free port or pass --force-kill-port.
`);
}

function pidsForPort(targetPort) {
  try {
    const output = execFileSync('lsof', ['-nP', '-ti', `tcp:${targetPort}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return [...new Set(output.split(/\s+/).filter(Boolean).map(Number).filter(Boolean))];
  } catch {
    return [];
  }
}

function hasHelperStateForPort(targetPort) {
  if (!existsSync(pidPath)) {
    return false;
  }

  try {
    const state = JSON.parse(readFileSync(pidPath, 'utf8'));
    return Number(state.port) === targetPort && String(state.command || '').startsWith('bun run dev');
  } catch {
    return false;
  }
}

async function restartOwnedPort(targetPort) {
  const pids = pidsForPort(targetPort);
  if (pids.length === 0) {
    return [];
  }

  const forceKillPort = Boolean(args['force-kill-port']);
  if (!forceKillPort && !hasHelperStateForPort(targetPort)) {
    throw new Error(`Port ${targetPort} is occupied by PID(s): ${pids.join(', ')}. Choose a free port or pass --force-kill-port.`);
  }

  for (const pid of pids) {
    try {
      process.kill(pid, 'SIGTERM');
    } catch {
      // Already gone.
    }
  }

  const deadline = Date.now() + 5000;
  while (Date.now() < deadline && pidsForPort(targetPort).length > 0) {
    await delay(250);
  }

  for (const pid of pidsForPort(targetPort)) {
    try {
      process.kill(pid, 'SIGKILL');
    } catch {
      // Already gone.
    }
  }

  const killDeadline = Date.now() + 5000;
  let remaining = pidsForPort(targetPort);
  while (Date.now() < killDeadline && remaining.length > 0) {
    await delay(250);
    remaining = pidsForPort(targetPort);
  }

  if (remaining.length > 0) {
    throw new Error(`Port ${targetPort} is still occupied by PID(s): ${remaining.join(', ')}`);
  }

  return pids;
}

function runBuild() {
  const result = spawnSync('bun', ['run', 'build'], {
    cwd: root,
    env: {
      ...process.env,
      SANITY_DATASET: process.env.SANITY_DATASET || 'staging',
    },
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function startServer() {
  const logFd = openSync(logPath, 'a');
  writeFileSync(logFd, `\n\n--- Restart ${new Date().toISOString()} port ${port} ---\n`);

  const child = spawn('bun', ['run', 'dev', '--', '--host', host, '--port', String(port)], {
    cwd: root,
    detached: true,
    env: {
      ...process.env,
      SANITY_DATASET: process.env.SANITY_DATASET || 'staging',
    },
    stdio: ['ignore', logFd, logFd],
  });

  child.unref();
  closeSync(logFd);

  writeFileSync(pidPath, JSON.stringify({
    pid: child.pid,
    port,
    host,
    startedAt: new Date().toISOString(),
    command: `bun run dev -- --host ${host} --port ${port}`,
    logPath,
  }, null, 2));

  return child;
}

async function waitForHttp200(url, timeout) {
  const deadline = Date.now() + timeout;
  let lastStatus = 'no response';

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { redirect: 'follow' });
      lastStatus = `${response.status} ${response.statusText}`;
      if (response.status === 200) {
        return;
      }
    } catch (error) {
      lastStatus = error.message;
    }

    await delay(1000);
  }

  throw new Error(`Timed out waiting for ${url}; last status: ${lastStatus}`);
}

function readLogTail(filePath) {
  if (!existsSync(filePath)) {
    return '';
  }
  const contents = readFileSync(filePath, 'utf8');
  return contents.split('\n').slice(-80).join('\n');
}

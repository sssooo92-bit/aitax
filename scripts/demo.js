/* eslint-disable no-console */
const { spawn } = require('node:child_process');
const net = require('node:net');
const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');

function bin(name) {
  // Use local binary if present (npm install), otherwise fall back to npx.
  const local = `${process.cwd()}/node_modules/.bin/${name}`;
  return local;
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', ...opts });
    p.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} failed with code ${code}`));
    });
    p.on('error', reject);
  });
}

function tryOpenBrowser(url) {
  if (process.env.AITAX_NO_OPEN === '1') return;

  const platform = process.platform;
  try {
    if (platform === 'win32') {
      // Use cmd's "start" to open default browser
      const p = spawn('cmd', ['/c', 'start', '', url], { stdio: 'ignore', detached: true });
      p.unref();
      return;
    }
    if (platform === 'darwin') {
      const p = spawn('open', [url], { stdio: 'ignore', detached: true });
      p.unref();
      return;
    }
    // linux and others
    const p = spawn('xdg-open', [url], { stdio: 'ignore', detached: true });
    p.unref();
  } catch {
    // ignore
  }
}

function tryListen(port, host = '0.0.0.0') {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.unref();
    srv.on('error', () => resolve(false));
    srv.listen(port, host, () => {
      srv.close(() => resolve(true));
    });
  });
}

async function findOpenPort(start = 3000, end = 3010, host = '0.0.0.0') {
  for (let p = start; p <= end; p++) {
    // eslint-disable-next-line no-await-in-loop
    const ok = await tryListen(p, host);
    if (ok) return p;
  }
  return null;
}

function guessLanIp() {
  try {
    const ifs = os.networkInterfaces();
    for (const name of Object.keys(ifs)) {
      for (const info of ifs[name] || []) {
        if (info && info.family === 'IPv4' && !info.internal) return info.address;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

async function main() {
  // DO NOT use process.env.HOSTNAME: many environments set it to a container name (e.g. "cursor")
  // which breaks binding. Always default to 0.0.0.0 and allow an explicit override.
  const host = process.env.AITAX_HOST || '0.0.0.0';
  const preferredPort = Number(process.env.PORT || process.env.AITAX_PORT || 3000);
  const port = (await findOpenPort(preferredPort, preferredPort + 20, host)) || preferredPort;

  console.log('');
  console.log('ai세금 데모를 준비하는 중… (build -> start)');
  console.log('');

  // Build first so "production-start-no-build-id" never happens
  try {
    await run(bin('next'), ['build']);
  } catch (e) {
    // If local binary is missing (no npm install), fall back to npx next
    await run('npx', ['next', 'build']);
  }

  console.log('');
  console.log('서버를 시작합니다…');
  console.log('');

  const lan = guessLanIp();
  const localUrl = `http://localhost:${port}`;
  console.log(`- Local:   ${localUrl}`);
  console.log(`- Network: http://${host}:${port}${lan ? ` (LAN: http://${lan}:${port})` : ''}`);
  console.log('');
  console.log('원격/컨테이너 환경이면 “Ports/Preview”에서 열린 주소로 접속해야 합니다.');
  console.log('');

  // Write a small file so people can easily find the URL.
  try {
    const out = {
      app: 'ai세금',
      startedAt: new Date().toISOString(),
      host,
      port,
      localUrl
    };
    fs.writeFileSync(path.join(process.cwd(), '.aitax-demo.json'), JSON.stringify(out, null, 2));
  } catch {
    // ignore
  }

  // Open browser automatically (especially helpful on Windows)
  tryOpenBrowser(localUrl);

  try {
    await run(bin('next'), ['start', '-H', host, '-p', String(port)]);
  } catch (e) {
    await run('npx', ['next', 'start', '-H', host, '-p', String(port)]);
  }
}

main().catch((e) => {
  console.error(e?.stack || String(e));
  process.exit(1);
});


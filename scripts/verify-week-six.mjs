#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const requiredFiles = [
  '20 周的執行計劃.md',
  'docs/week-05-local-docker-desktop.md',
  'docs/week-06-npm-vs-docker-single-container.md',
  'artifacts/week-06-npm-launch-record.json',
  'scripts/verify-week-five.mjs',
  'scripts/verify-week-six.mjs',
  'package.json'
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function run(label, command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    timeout: options.timeout ?? 180000,
    env: {
      ...process.env,
      ...(options.env ?? {})
    }
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${label} failed:\n${result.stdout}\n${result.stderr}`.trim());
  }

  return {
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim()
  };
}

async function readText(file) {
  return fs.readFile(path.join(root, file), 'utf8');
}

async function readJson(file) {
  return JSON.parse(await readText(file));
}

async function assertFileExists(file) {
  const target = path.join(root, file);
  const stat = await fs.stat(target).catch(() => null);
  assert(stat?.isFile(), `Missing required file: ${file}`);
}

async function assertPathMissing(file) {
  const target = path.join(root, file);
  const stat = await fs.stat(target).catch(() => null);
  assert(!stat, `Temporary npm runtime path should have been removed: ${file}`);
}

async function verifyPlanScope() {
  const plan = await readText('20 周的執行計劃.md');
  const weekSix = plan.match(/### Week 06[\s\S]*?### Week 07/);
  assert(weekSix, 'Could not find Week 06 scope in plan');

  const requiredPlanText = [
    'Week 06｜npm 與單容器路線比較',
    '執行 `npx n8n` 或 `npm install -g n8n`',
    '比較 Node.js 版本、全域依賴、升級、隔離性',
    '回頭比較 Docker single-container 的穩定性',
    'npm vs Docker 比較表',
    '本機啟動命令筆記',
    '不適合 production 的原因清單',
    '能說明 npm quick start 的價值，也能說明何時該停止使用它當長期方案'
  ];

  for (const text of requiredPlanText) {
    assert(weekSix[0].includes(text), `Week 06 plan missing required text: ${text}`);
  }
}

async function verifyDocument() {
  const doc = await readText('docs/week-06-npm-vs-docker-single-container.md');

  const requiredText = [
    'Week 06｜npm 與單容器路線比較',
    'npm vs Docker 比較表',
    '本機啟動命令筆記',
    '不適合 production 的原因清單',
    'Node.js',
    'v24.13.1',
    'npm',
    '11.8.0',
    'npx --yes n8n --version',
    'npx --yes n8n start',
    '2.22.4',
    'N8N_USER_FOLDER',
    'N8N_PORT=5686',
    'npm_http_status=200',
    'docker.n8n.io/n8nio/n8n',
    'n8n_data:/home/node/.n8n',
    'ERESOLVE overriding peer dependency',
    'deprecated package warning',
    'Docker single-container',
    'Docker Compose + PostgreSQL',
    'https://docs.n8n.io/hosting/installation/npm/',
    'https://docs.n8n.io/hosting/installation/docker/',
    'https://docs.npmjs.com/cli/v11/commands/npx/',
    'https://docs.docker.com/engine/storage/volumes/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/deployment/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/database/'
  ];

  for (const text of requiredText) {
    assert(doc.includes(text), `Week six document missing required text: ${text}`);
  }

  const requiredSections = [
    /^## 1\. 本週交付物總覽/m,
    /^## 2\. 官方來源核對/m,
    /^## 3\. 實測環境與結果/m,
    /^## 4\. 交付物一：npm vs Docker 比較表/m,
    /^## 5\. 交付物二：本機啟動命令筆記/m,
    /^## 6\. 交付物三：不適合 production 的原因清單/m,
    /^## 7\. 路線決策圖/m,
    /^## 8\. 驗收條件說明/m,
    /^## 9\. Week 06 完成檢查/m,
    /^## 10\. 下一週銜接/m
  ];

  for (const pattern of requiredSections) {
    assert(pattern.test(doc), `Week six document missing section matching ${pattern}`);
  }

  const bannedPatterns = [
    /for brevity/i,
    /the rest follows/i,
    /similarly for the remaining/i,
    /Let me know if you want me to continue/i,
    /I'll leave that as an exercise/i
  ];

  for (const pattern of bannedPatterns) {
    assert(!pattern.test(doc), `Week six document contains banned placeholder pattern: ${pattern}`);
  }
}

async function verifyLaunchRecord() {
  const record = await readJson('artifacts/week-06-npm-launch-record.json');

  assert(record.week === 6, 'Launch record week must be 6');
  assert(record.localRuntime.node === 'v24.13.1', 'Launch record must include tested Node.js version');
  assert(record.localRuntime.npm === '11.8.0', 'Launch record must include tested npm version');
  assert(record.localRuntime.npx === '11.8.0', 'Launch record must include tested npx version');
  assert(record.n8n.npxVersionResult === '2.22.4', 'Launch record must include tested n8n version');
  assert(record.n8n.npxPort === 5686, 'Launch record must include tested npm port');
  assert(record.n8n.npxHttpStatus === 200, 'Launch record must include tested HTTP status');
  assert(record.n8n.npxProcessStopped === true, 'Launch record must confirm npm process stopped');
  assert(record.n8n.npxUserFolderRemovedAfterRecord === true, 'Launch record must confirm user folder cleanup');
  assert(
    record.observedNpmInstallSignals.peerDependencyWarningsObserved === true,
    'Launch record must capture peer dependency warnings'
  );
  assert(
    record.observedNpmInstallSignals.deprecatedPackageWarningsObserved === true,
    'Launch record must capture deprecated package warnings'
  );
  assert(
    record.observedN8nUserFolderFiles.includes('.n8n/config') &&
      record.observedN8nUserFolderFiles.includes('.n8n/database.sqlite'),
    'Launch record must capture n8n user folder state files'
  );
  assert(record.dockerBaselineFromWeek05.volumeName === 'n8n_data', 'Launch record must include Docker baseline volume');
  assert(
    record.decision.stopUsingNpmAsLongTermPlanWhen.includes('uptime') &&
      record.decision.defaultLongerTermRecommendation.includes('Docker Compose plus PostgreSQL'),
    'Launch record must include the Week 06 route decision'
  );
}

async function verifyPackageScripts() {
  const pkg = await readJson('package.json');
  assert(pkg.scripts['verify:week6'] === 'node scripts/verify-week-six.mjs', 'package.json missing verify:week6 script');
}

function verifyLocalNodeRuntime() {
  const nodeVersion = run('Node.js version check', 'node', ['--version']).stdout;
  const npmVersion = run('npm version check', 'npm', ['--version']).stdout;
  const npxVersion = run('npx version check', 'npx', ['--version']).stdout;

  assert(nodeVersion === 'v24.13.1', `Unexpected Node.js version: ${nodeVersion}`);
  assert(npmVersion === '11.8.0', `Unexpected npm version: ${npmVersion}`);
  assert(npxVersion === '11.8.0', `Unexpected npx version: ${npxVersion}`);
}

function verifyNpxN8nVersion() {
  const userFolder = path.join(root, 'artifacts', 'week-06-npm-version-check-user-folder');
  const result = run(
    'npx n8n version check',
    'npx',
    ['--yes', 'n8n@2.22.4', '--version'],
    {
      timeout: 240000,
      env: {
        N8N_USER_FOLDER: userFolder,
        N8N_PORT: '5686',
        GENERIC_TIMEZONE: 'Asia/Taipei',
        TZ: 'Asia/Taipei'
      }
    }
  );

  assert(result.stdout.endsWith('2.22.4'), `Unexpected npx n8n version output: ${result.stdout}`);
}

function verifyNoNpmN8nListener() {
  const result = spawnSync('lsof', ['-nP', '-iTCP:5686', '-sTCP:LISTEN'], {
    cwd: root,
    encoding: 'utf8'
  });

  assert(result.status !== 0, `Port 5686 should not have a leftover npm n8n listener:\n${result.stdout}`);
}

async function main() {
  await Promise.all(requiredFiles.map(assertFileExists));

  run('Week five verification', process.execPath, ['scripts/verify-week-five.mjs'], {
    timeout: 300000
  });

  await verifyPlanScope();
  await verifyDocument();
  await verifyLaunchRecord();
  await verifyPackageScripts();
  await assertPathMissing('artifacts/week-06-npm-user-folder');
  verifyLocalNodeRuntime();
  verifyNpxN8nVersion();
  verifyNoNpmN8nListener();

  console.log('Week six verification passed: npm quick start and Docker single-container comparison is complete.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

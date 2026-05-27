#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const capstoneDir = 'artifacts/week-19-capstone';
const packageDir = `${capstoneDir}/deployment-package`;
const manifestFile = `${capstoneDir}/week-19-deployment-package-manifest.json`;
const packageReadmeFile = `${packageDir}/README.md`;
const composeFile = `${packageDir}/compose.yaml`;
const envTemplateFile = `${packageDir}/.env.template`;
const caddyFile = `${packageDir}/Caddyfile`;
const backupRunbookFile = `${packageDir}/backup-restore-runbook.md`;
const updateRunbookFile = `${packageDir}/update-runbook.md`;
const troubleshootingFile = `${packageDir}/troubleshooting-playbook.md`;
const finalDemoChecklistFile = `${packageDir}/final-demo-checklist.csv`;

const requiredFiles = [
  '20 周的執行計劃.md',
  'docs/week-19-capstone-replicable-deployment-package.md',
  manifestFile,
  packageReadmeFile,
  composeFile,
  envTemplateFile,
  caddyFile,
  backupRunbookFile,
  updateRunbookFile,
  troubleshootingFile,
  finalDemoChecklistFile,
  'scripts/verify-week-eighteen.mjs',
  'scripts/verify-week-nineteen.mjs',
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
    timeout: options.timeout ?? 240000,
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
  const stat = await fs.stat(path.join(root, file)).catch(() => null);
  assert(stat?.isFile(), `Missing required file: ${file}`);
}

function assertNoBannedPatterns(label, content) {
  const bannedPatterns = [
    /for brevity/i,
    /the rest follows/i,
    /similarly for the remaining/i,
    /Let me know if you want me to continue/i,
    /I'll leave that as an exercise/i,
    /TODO/i,
    /待補/,
    /\.\.\./
  ];

  for (const pattern of bannedPatterns) {
    assert(!pattern.test(content), `${label} contains banned placeholder pattern: ${pattern}`);
  }
}

async function verifyPlanScope() {
  const plan = await readText('20 周的執行計劃.md');
  const weekNineteen = plan.match(/### Week 19[\s\S]*?### Week 20/);
  assert(weekNineteen, 'Could not find Week 19 scope in plan');

  const requiredPlanText = [
    'Week 19｜Capstone：建立可複製部署作品',
    '如何把 18 週學到的內容變成別人可以接手的部署作品包',
    '選一條主部署路線',
    '整理 architecture、env template、DNS/TLS notes、backup/update/troubleshooting',
    '準備期末展示資料',
    '部署作品包',
    'README-style handoff',
    'final demo checklist',
    '架構、啟動方式、備份方式、風險與下一步'
  ];

  for (const text of requiredPlanText) {
    assert(weekNineteen[0].includes(text), `Week 19 plan missing required text: ${text}`);
  }
}

async function verifyDocument() {
  const doc = await readText('docs/week-19-capstone-replicable-deployment-package.md');
  assertNoBannedPatterns('Week nineteen document', doc);

  const requiredText = [
    'Week 19｜Capstone：建立可複製部署作品',
    'VPS Docker Compose + PostgreSQL + Caddy',
    '部署作品包',
    'README-style handoff',
    'final demo checklist',
    'architecture',
    'env template',
    'DNS/TLS notes',
    'backup/update/troubleshooting',
    '架構、啟動方式、備份方式、風險與下一步',
    'compose.yaml',
    '.env.template',
    'Caddyfile',
    'backup-restore-runbook.md',
    'update-runbook.md',
    'troubleshooting-playbook.md',
    'final-demo-checklist.csv',
    'N8N_ENCRYPTION_KEY',
    'WEBHOOK_URL',
    'N8N_PROXY_HOPS=1',
    'N8N_SECURE_COOKIE=true',
    'DB_TYPE=postgresdb',
    '/healthz/readiness',
    'https://docs.n8n.io/hosting/installation/docker/',
    'https://docs.n8n.io/hosting/installation/server-setups/docker-compose/',
    'https://docs.n8n.io/hosting/installation/server-setups/digital-ocean/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/',
    'https://docs.n8n.io/hosting/securing/set-up-ssl/',
    'https://docs.n8n.io/hosting/configuration/supported-databases-settings/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/encryption-key/',
    'https://docs.n8n.io/hosting/installation/updating/',
    'https://docs.n8n.io/hosting/logging-monitoring/logging/',
    'https://docs.n8n.io/hosting/logging-monitoring/monitoring/',
    'https://docs.n8n.io/hosting/scaling/execution-data/',
    'https://docs.n8n.io/hosting/scaling/binary-data/'
  ];

  for (const text of requiredText) {
    assert(doc.includes(text), `Week nineteen document missing required text: ${text}`);
  }

  const requiredSections = [
    /^## 1\. 本週交付物總覽/m,
    /^## 2\. 官方來源核對/m,
    /^## 3\. 主部署路線與架構/m,
    /^## 4\. 部署作品包內容/m,
    /^## 5\. env template、DNS\/TLS notes/m,
    /^## 6\. backup、update、troubleshooting 交接/m,
    /^## 7\. final demo checklist 摘要/m,
    /^## 8\. Week 19 完成檢查/m,
    /^## 9\. 下一週銜接/m
  ];

  for (const pattern of requiredSections) {
    assert(pattern.test(doc), `Week nineteen document missing section matching ${pattern}`);
  }
}

async function verifyManifest() {
  const manifest = await readJson(manifestFile);
  assert(manifest.week === 19, 'Manifest must identify week 19');
  assert(manifest.primaryRoute === 'VPS Docker Compose + PostgreSQL + Caddy', 'Manifest primary route is wrong');
  assert(
    manifest.acceptanceTarget.includes('architecture') &&
      manifest.acceptanceTarget.includes('startup') &&
      manifest.acceptanceTarget.includes('backup') &&
      manifest.acceptanceTarget.includes('risks') &&
      manifest.acceptanceTarget.includes('next steps'),
    'Manifest acceptance target must mention architecture, startup, backup, risks, and next steps'
  );

  const sourceValues = Object.values(manifest.officialSources);
  for (const source of [
    'https://docs.n8n.io/hosting/installation/docker/',
    'https://docs.n8n.io/hosting/installation/server-setups/docker-compose/',
    'https://docs.n8n.io/hosting/installation/server-setups/digital-ocean/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/',
    'https://docs.n8n.io/hosting/securing/set-up-ssl/',
    'https://docs.n8n.io/hosting/configuration/supported-databases-settings/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/encryption-key/',
    'https://docs.n8n.io/hosting/installation/updating/',
    'https://docs.n8n.io/hosting/logging-monitoring/logging/',
    'https://docs.n8n.io/hosting/logging-monitoring/monitoring/',
    'https://docs.n8n.io/hosting/scaling/execution-data/',
    'https://docs.n8n.io/hosting/scaling/binary-data/'
  ]) {
    assert(sourceValues.includes(source), `Manifest missing source: ${source}`);
  }

  assert(manifest.packageFiles.length === 8, `Expected eight package files, found ${manifest.packageFiles.length}`);
  const packagePaths = manifest.packageFiles.map((item) => item.path);
  for (const packagePath of [
    'deployment-package/README.md',
    'deployment-package/compose.yaml',
    'deployment-package/.env.template',
    'deployment-package/Caddyfile',
    'deployment-package/backup-restore-runbook.md',
    'deployment-package/update-runbook.md',
    'deployment-package/troubleshooting-playbook.md',
    'deployment-package/final-demo-checklist.csv'
  ]) {
    assert(packagePaths.includes(packagePath), `Manifest missing package file: ${packagePath}`);
  }

  for (const item of manifest.packageFiles) {
    assert(item.role, `${item.path} missing role`);
    assert(item.requiredForHandoff === true, `${item.path} must be required for handoff`);
  }

  const architecture = JSON.stringify(manifest.architecture);
  for (const text of [
    'DNS',
    'Caddy',
    'n8n:5678',
    'PostgreSQL',
    'postgres_data',
    'n8n_data',
    'backup-restore-runbook.md',
    'troubleshooting-playbook.md'
  ]) {
    assert(architecture.includes(text), `Manifest architecture missing text: ${text}`);
  }

  assert(manifest.handoffReadiness.length >= 5, 'Manifest must include handoff readiness checks');
}

async function verifyPackageReadme() {
  const readme = await readText(packageReadmeFile);
  assertNoBannedPatterns('Week nineteen package README', readme);

  for (const text of [
    'n8n Deployment Package',
    'VPS Docker Compose + PostgreSQL + Caddy',
    'Architecture',
    'Package Files',
    'Startup',
    'State Ownership',
    'Environment Rules',
    'DNS and TLS Notes',
    'Backup Summary',
    'Update Summary',
    'Troubleshooting Summary',
    'Handoff Risks',
    'Next Steps',
    'docker compose --env-file .env -f compose.yaml up -d',
    'N8N_ENCRYPTION_KEY',
    'WEBHOOK_URL=https://N8N_DOMAIN/',
    'N8N_PROXY_HOPS=1',
    'N8N_SECURE_COOKIE=true',
    '/healthz/readiness',
    'wrong webhook URL',
    'lost credentials',
    'database connection failed',
    'secure cookie error'
  ]) {
    assert(readme.includes(text), `Package README missing text: ${text}`);
  }
}

async function verifyComposeAndEnv() {
  const compose = await readText(composeFile);
  const envTemplate = await readText(envTemplateFile);
  const caddy = await readText(caddyFile);
  assertNoBannedPatterns('Week nineteen compose file', compose);
  assertNoBannedPatterns('Week nineteen env template', envTemplate);
  assertNoBannedPatterns('Week nineteen Caddyfile', caddy);

  for (const text of [
    'postgres:',
    'n8n:',
    'caddy:',
    'postgres:16-alpine',
    'docker.n8n.io/n8nio/n8n:stable',
    'caddy:2-alpine',
    'DB_TYPE: postgresdb',
    'DB_POSTGRESDB_HOST: postgres',
    'WEBHOOK_URL: https://${N8N_DOMAIN}/',
    'N8N_EDITOR_BASE_URL: https://${N8N_DOMAIN}/',
    'N8N_PROXY_HOPS: 1',
    'N8N_SECURE_COOKIE: "true"',
    'N8N_ENCRYPTION_KEY: ${N8N_ENCRYPTION_KEY}',
    'N8N_DEFAULT_BINARY_DATA_MODE: database',
    'N8N_LOG_FORMAT: json',
    'postgres_data:',
    'n8n_data:',
    'caddy_data:',
    'caddy_config:',
    'healthcheck:'
  ]) {
    assert(compose.includes(text), `compose.yaml missing text: ${text}`);
  }

  for (const text of [
    'N8N_DOMAIN=n8n.example.com',
    'POSTGRES_PASSWORD=CHANGE_ME_LONG_RANDOM_POSTGRES_PASSWORD',
    'N8N_ENCRYPTION_KEY=CHANGE_ME_64_CHARACTER_RANDOM_INSTANCE_KEY',
    'N8N_IMAGE=docker.n8n.io/n8nio/n8n:stable',
    'WEBHOOK_URL=https://n8n.example.com/',
    'N8N_EDITOR_BASE_URL=https://n8n.example.com/',
    'N8N_PROXY_HOPS=1',
    'N8N_SECURE_COOKIE=true',
    'N8N_DEFAULT_BINARY_DATA_MODE=database'
  ]) {
    assert(envTemplate.includes(text), `.env.template missing text: ${text}`);
  }

  for (const text of [
    '{$N8N_DOMAIN}',
    'reverse_proxy n8n:5678',
    'X-Forwarded-Host',
    'X-Forwarded-Proto',
    'X-Forwarded-For'
  ]) {
    assert(caddy.includes(text), `Caddyfile missing text: ${text}`);
  }
}

async function verifyRunbooksAndChecklist() {
  const backup = await readText(backupRunbookFile);
  const update = await readText(updateRunbookFile);
  const troubleshooting = await readText(troubleshootingFile);
  const checklist = await readText(finalDemoChecklistFile);
  assertNoBannedPatterns('Week nineteen backup runbook', backup);
  assertNoBannedPatterns('Week nineteen update runbook', update);
  assertNoBannedPatterns('Week nineteen troubleshooting playbook', troubleshooting);
  assertNoBannedPatterns('Week nineteen final demo checklist', checklist);

  for (const text of [
    'Backup Scope',
    'Backup Commands',
    'Secret Backup Rules',
    'Restore Order',
    'Restore Verification',
    'N8N_ENCRYPTION_KEY',
    'pg_dump',
    '/healthz/readiness'
  ]) {
    assert(backup.includes(text), `backup-restore-runbook.md missing text: ${text}`);
  }

  for (const text of [
    'Update Policy',
    'Pre-update Checklist',
    'Update Steps',
    'Rollback Steps',
    'Post-update Verification',
    'release notes',
    'N8N_IMAGE',
    '/healthz/readiness'
  ]) {
    assert(update.includes(text), `update-runbook.md missing text: ${text}`);
  }

  for (const text of [
    'Fixed Check Order',
    'log',
    'env',
    'DNS',
    'proxy',
    'DB',
    'wrong webhook URL',
    'lost credentials',
    'database connection failed',
    'secure cookie error',
    'N8N_ENCRYPTION_KEY',
    'N8N_SECURE_COOKIE',
    'N8N_LOG_FORMAT=json'
  ]) {
    assert(troubleshooting.includes(text), `troubleshooting-playbook.md missing text: ${text}`);
  }

  assert(
    checklist.startsWith('"order","demo_item","expected_evidence","pass_condition"'),
    'final-demo-checklist.csv header is wrong'
  );

  for (const text of [
    'Show deployment package directory',
    'Explain chosen route',
    'Explain architecture',
    'Explain env template',
    'Explain DNS/TLS',
    'Explain startup',
    'Explain health checks',
    'Explain backup',
    'Explain restore',
    'Explain update',
    'Explain troubleshooting',
    'Answer wrong webhook URL',
    'Answer lost credentials',
    'Answer database connection failed',
    'Answer secure cookie error',
    'Explain risks',
    'Explain next steps'
  ]) {
    assert(checklist.includes(text), `final-demo-checklist.csv missing text: ${text}`);
  }

  const rowCount = checklist.trim().split('\n').length - 1;
  assert(rowCount === 17, `Expected 17 final demo checklist rows, found ${rowCount}`);
}

async function verifyPackageScripts() {
  const pkg = await readJson('package.json');
  assert(pkg.scripts['verify:week18'] === 'node scripts/verify-week-eighteen.mjs', 'package.json missing verify:week18 script');
  assert(pkg.scripts['verify:week19'] === 'node scripts/verify-week-nineteen.mjs', 'package.json missing verify:week19 script');
}

function verifyLiveLocalStackStillClean() {
  const httpStatus = run('n8n local HTTP readiness after Week 19', 'curl', [
    '-s',
    '-o',
    '/dev/null',
    '-w',
    '%{http_code}',
    'http://localhost:5687'
  ]).stdout;
  assert(httpStatus === '200', `Expected existing local n8n HTTP 200 after Week 19, got ${httpStatus}`);

  const cloudflaredContainers = run('Week nineteen cloudflared cleanup check', 'docker', [
    'ps',
    '--filter',
    'name=week8-cloudflared',
    '--format',
    '{{.Names}}'
  ]).stdout;
  assert(cloudflaredContainers === '', 'Week eight quick tunnel container should not be running during Week 19');
}

async function main() {
  await Promise.all(requiredFiles.map(assertFileExists));

  run('Week eighteen verification', process.execPath, ['scripts/verify-week-eighteen.mjs'], {
    timeout: 900000
  });

  await verifyPlanScope();
  await verifyDocument();
  await verifyManifest();
  await verifyPackageReadme();
  await verifyComposeAndEnv();
  await verifyRunbooksAndChecklist();
  await verifyPackageScripts();
  verifyLiveLocalStackStillClean();

  console.log('Week nineteen verification passed: deployment package, README-style handoff, and final demo checklist let a teammate understand architecture, startup, backup, risks, and next steps.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const recoveryDir = 'artifacts/week-14-recovery';
const backupRunbookFile = `${recoveryDir}/week-14-backup-runbook.json`;
const restoreRunbookFile = `${recoveryDir}/week-14-restore-runbook.json`;
const updateChecklistFile = `${recoveryDir}/week-14-update-rollback-checklist.csv`;

const requiredFiles = [
  '20 周的執行計劃.md',
  'docs/week-14-backup-restore-update-runbook.md',
  backupRunbookFile,
  restoreRunbookFile,
  updateChecklistFile,
  'scripts/verify-week-thirteen.mjs',
  'scripts/verify-week-fourteen.mjs',
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

async function verifyPlanScope() {
  const plan = await readText('20 周的執行計劃.md');
  const weekFourteen = plan.match(/### Week 14[\s\S]*?### Week 15/);
  assert(weekFourteen, 'Could not find Week 14 scope in plan');

  const requiredPlanText = [
    'Week 14｜備份、還原與更新流程',
    '如何讓 n8n 不只會跑，還能在升級失敗或資料遺失時回得來',
    'pg_dump 與 volume archive',
    'restore command 與演練',
    'release notes、image pinning、pull、restart、test、rollback',
    'backup runbook',
    'restore runbook',
    'update / rollback checklist',
    'database、volume、encryption key、Compose/env/proxy config',
    '還原演練設計'
  ];

  for (const text of requiredPlanText) {
    assert(weekFourteen[0].includes(text), `Week 14 plan missing required text: ${text}`);
  }
}

async function verifyDocument() {
  const doc = await readText('docs/week-14-backup-restore-update-runbook.md');

  const requiredText = [
    'Week 14｜備份、還原與更新流程',
    'backup runbook',
    'restore runbook',
    'update / rollback checklist',
    'pg_dump 與 volume archive',
    'restore command 與演練',
    'release notes、image pinning、pull、restart、test、rollback',
    'database、volume、encryption key、Compose/env/proxy config',
    'database.dump',
    'n8n_data.tgz',
    'caddy_data.tgz',
    'caddy_config.tgz',
    'n8n-encryption-key.txt',
    'compose.yaml',
    '.env',
    'Caddyfile',
    'docker-compose.rendered.yaml',
    'SHA256SUMS',
    'N8N_ENCRYPTION_KEY',
    'DB_TYPE=postgresdb',
    'WEBHOOK_URL',
    'N8N_EDITOR_BASE_URL',
    'N8N_PROXY_HOPS',
    'docker compose pull',
    'docker compose up -d',
    'docker compose down',
    'pg_dump -U',
    'pg_restore -U',
    'tar -czf',
    'tar -xzf',
    'image pinning',
    'rollback',
    'restore drill',
    'https://docs.n8n.io/hosting/installation/docker/',
    'https://docs.n8n.io/hosting/installation/docker/#updating-docker-compose',
    'https://docs.n8n.io/release-notes/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/encryption-key/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/database/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/',
    'https://docs.n8n.io/hosting/scaling/binary-data/',
    'https://www.postgresql.org/docs/current/app-pgdump.html',
    'https://www.postgresql.org/docs/current/app-pgrestore.html',
    'https://docs.docker.com/engine/storage/volumes/',
    'https://docs.docker.com/reference/cli/docker/compose/pull/',
    'https://docs.docker.com/reference/cli/docker/compose/up/',
    'https://docs.docker.com/reference/cli/docker/compose/down/'
  ];

  for (const text of requiredText) {
    assert(doc.includes(text), `Week fourteen document missing required text: ${text}`);
  }

  const requiredSections = [
    /^## 1\. 本週交付物總覽/m,
    /^## 2\. 官方來源核對/m,
    /^## 3\. 交付物一：backup runbook/m,
    /^## 4\. 交付物二：restore runbook/m,
    /^## 5\. 交付物三：update \/ rollback checklist/m,
    /^## 6\. 還原演練設計/m,
    /^## 7\. 更新與 rollback runbook/m,
    /^## 8\. 不可遺失資產清單/m,
    /^## 9\. Week 14 完成檢查/m,
    /^## 10\. 下一週銜接/m
  ];

  for (const pattern of requiredSections) {
    assert(pattern.test(doc), `Week fourteen document missing section matching ${pattern}`);
  }

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
    assert(!pattern.test(doc), `Week fourteen document contains banned placeholder pattern: ${pattern}`);
  }
}

async function verifyBackupRunbook() {
  const runbook = await readJson(backupRunbookFile);
  assert(runbook.week === 14, 'Backup runbook must identify week 14');
  assert(runbook.acceptanceTarget.includes('database, volume, encryption key, and Compose/env/proxy config'), 'Backup runbook acceptance target is incomplete');

  const sourceValues = Object.values(runbook.officialSources);
  for (const source of [
    'https://docs.n8n.io/hosting/installation/docker/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/encryption-key/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/database/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/',
    'https://www.postgresql.org/docs/current/app-pgdump.html',
    'https://docs.docker.com/engine/storage/volumes/'
  ]) {
    assert(sourceValues.includes(source), `Backup runbook missing source: ${source}`);
  }

  const requiredBackupSetIds = [
    'database',
    'volume',
    'proxy-volumes',
    'encryption-key',
    'compose-env-proxy-config',
    'checksum-manifest'
  ];

  const backupSetIds = runbook.backupSet.map((item) => item.id);
  for (const id of requiredBackupSetIds) {
    assert(backupSetIds.includes(id), `Backup runbook missing backup set item: ${id}`);
  }

  const commandText = runbook.commands.map((item) => item.command).join('\n');
  for (const text of [
    'pg_dump',
    '-Fc',
    'N8N_ENCRYPTION_KEY',
    'docker compose',
    'compose.yaml',
    '.env',
    'Caddyfile',
    'docker-compose.rendered.yaml',
    'tar -czf',
    'n8n_data.tgz',
    'caddy_data.tgz',
    'caddy_config.tgz',
    'shasum -a 256'
  ]) {
    assert(commandText.includes(text), `Backup runbook commands missing: ${text}`);
  }

  assert(runbook.commands.every((command) => command.mustPass === true), 'Every backup command must be marked mustPass');
  assert(runbook.verification.length >= 6, 'Backup runbook needs at least six verification checks');
  assert(runbook.failureRules.length >= 5, 'Backup runbook needs failure rules');
}

async function verifyRestoreRunbook() {
  const runbook = await readJson(restoreRunbookFile);
  assert(runbook.week === 14, 'Restore runbook must identify week 14');
  assert(runbook.drill.id === 'week-14-restore-drill-small-business-compose-postgres', 'Restore drill id is wrong');
  assert(runbook.drill.mustNotTouchProduction === true, 'Restore drill must not touch production');

  const sourceValues = Object.values(runbook.officialSources);
  for (const source of [
    'https://www.postgresql.org/docs/current/app-pgrestore.html',
    'https://www.postgresql.org/docs/current/app-pgdump.html',
    'https://docs.docker.com/engine/storage/volumes/',
    'https://docs.n8n.io/hosting/installation/docker/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/encryption-key/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/'
  ]) {
    assert(sourceValues.includes(source), `Restore runbook missing source: ${source}`);
  }

  for (const file of [
    'database.dump',
    'n8n_data.tgz',
    'caddy_data.tgz',
    'caddy_config.tgz',
    'n8n-encryption-key.txt',
    'compose.yaml',
    '.env',
    'Caddyfile',
    'docker-compose.rendered.yaml',
    'SHA256SUMS'
  ]) {
    assert(runbook.drill.backupSetRequiredFiles.includes(file), `Restore drill missing required backup file: ${file}`);
  }

  const stepIds = runbook.restoreSteps.map((step) => step.id);
  for (const id of [
    'verify-checksums',
    'stop-isolated-project',
    'create-restore-volumes',
    'restore-n8n-volume',
    'restore-proxy-volumes',
    'start-postgres',
    'prepare-database',
    'restore-database',
    'start-n8n',
    'inspect-logs'
  ]) {
    assert(stepIds.includes(id), `Restore runbook missing step: ${id}`);
  }

  const commandText = runbook.restoreSteps.map((step) => step.command).join('\n');
  for (const text of [
    'pg_restore',
    '--exit-on-error',
    'tar -xzf',
    'n8n_data.tgz',
    'caddy_data.tgz',
    'caddy_config.tgz',
    'N8N_ENCRYPTION_KEY',
    'docker compose',
    'n8n-week14-restore-drill'
  ]) {
    assert(commandText.includes(text) || JSON.stringify(runbook).includes(text), `Restore runbook missing text: ${text}`);
  }

  assert(runbook.acceptanceChecks.length >= 9, 'Restore runbook needs at least nine acceptance checks');
  assert(runbook.failureDiagnosis.length >= 5, 'Restore runbook needs failure diagnosis entries');
}

async function verifyUpdateChecklist() {
  const csv = await readText(updateChecklistFile);
  assert(
    csv.startsWith('"phase","check","pass_signal","fail_signal","required_action","evidence"'),
    'Update rollback checklist CSV header is wrong'
  );

  const requiredPhases = [
    'release_notes',
    'semantic_versioning',
    'image_pinning',
    'database_backup',
    'volume_archive',
    'encryption_key',
    'compose_env_proxy_config',
    'checksum',
    'restore_drill',
    'pull',
    'restart',
    'smoke_test_editor',
    'smoke_test_workflows',
    'smoke_test_execution',
    'smoke_test_webhook',
    'logs',
    'monitoring',
    'rollback_image',
    'full_restore',
    'release_record'
  ];

  for (const phase of requiredPhases) {
    assert(csv.includes(`"${phase}"`), `Update rollback checklist missing phase: ${phase}`);
  }

  for (const text of [
    'release notes',
    'docker compose config',
    'pg_dump -Fc',
    'N8N_ENCRYPTION_KEY',
    'compose.yaml, .env, Caddyfile',
    'docker compose pull n8n',
    'docker compose up -d n8n',
    'WEBHOOK_URL',
    'previous image',
    'full restore'
  ]) {
    assert(csv.includes(text), `Update rollback checklist missing text: ${text}`);
  }

  const rowCount = csv.trim().split('\n').length - 1;
  assert(rowCount >= 20, `Update rollback checklist should include at least 20 rows, found ${rowCount}`);
}

async function verifyPackageScripts() {
  const pkg = await readJson('package.json');
  assert(pkg.scripts['verify:week13'] === 'node scripts/verify-week-thirteen.mjs', 'package.json missing verify:week13 script');
  assert(pkg.scripts['verify:week14'] === 'node scripts/verify-week-fourteen.mjs', 'package.json missing verify:week14 script');
}

function verifyLiveLocalStackStillClean() {
  const httpStatus = run('n8n local HTTP readiness after Week 14', 'curl', [
    '-s',
    '-o',
    '/dev/null',
    '-w',
    '%{http_code}',
    'http://localhost:5687'
  ]).stdout;
  assert(httpStatus === '200', `Expected existing local n8n HTTP 200 after Week 14, got ${httpStatus}`);

  const cloudflaredContainers = run('Week fourteen cloudflared cleanup check', 'docker', [
    'ps',
    '--filter',
    'name=week8-cloudflared',
    '--format',
    '{{.Names}}'
  ]).stdout;
  assert(cloudflaredContainers === '', 'Week eight quick tunnel container should not be running during Week 14');
}

async function main() {
  await Promise.all(requiredFiles.map(assertFileExists));

  run('Week thirteen verification', process.execPath, ['scripts/verify-week-thirteen.mjs'], {
    timeout: 900000
  });

  await verifyPlanScope();
  await verifyDocument();
  await verifyBackupRunbook();
  await verifyRestoreRunbook();
  await verifyUpdateChecklist();
  await verifyPackageScripts();
  verifyLiveLocalStackStillClean();

  console.log('Week fourteen verification passed: backup, restore, update, and rollback runbooks preserve database, volume, encryption key, and Compose/env/proxy config with a restore drill design.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

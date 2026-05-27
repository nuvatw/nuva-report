#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const composeFile = 'artifacts/week-07-compose/compose.yaml';
const envFile = 'artifacts/week-07-compose/.env';

const requiredFiles = [
  '20 周的執行計劃.md',
  'docs/week-06-npm-vs-docker-single-container.md',
  'docs/week-07-docker-compose-postgresql.md',
  'artifacts/week-07-compose/.env',
  'artifacts/week-07-compose/compose.yaml',
  'artifacts/week-07-compose/week-07-marker.sql',
  'artifacts/week-07-compose/week-07-postgres-workflow.json',
  'artifacts/week-07-compose/week-07-launch-record.json',
  'scripts/verify-week-six.mjs',
  'scripts/verify-week-seven.mjs',
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

async function verifyPlanScope() {
  const plan = await readText('20 周的執行計劃.md');
  const weekSeven = plan.match(/### Week 07[\s\S]*?### Week 08/);
  assert(weekSeven, 'Could not find Week 07 scope in plan');

  const requiredPlanText = [
    'Week 07｜Docker Compose + PostgreSQL',
    '如何把單一 container 升級成 production-shaped local stack',
    '理解 Compose services、volumes、depends_on',
    '設定 DB_TYPE=postgresdb 與 DB_POSTGRESDB_*',
    '固定 N8N_ENCRYPTION_KEY',
    'Compose 架構解說',
    'env vars 對照表',
    'PostgreSQL-backed n8n 啟動紀錄',
    '能逐行說明 Compose 檔裡 n8n、postgres、volumes、environment 的用途'
  ];

  for (const text of requiredPlanText) {
    assert(weekSeven[0].includes(text), `Week 07 plan missing required text: ${text}`);
  }
}

async function verifyDocument() {
  const doc = await readText('docs/week-07-docker-compose-postgresql.md');

  const requiredText = [
    'Week 07｜Docker Compose + PostgreSQL',
    'Compose 架構解說',
    'env vars 對照表',
    'PostgreSQL-backed n8n 啟動紀錄',
    'DB_TYPE: postgresdb',
    'DB_POSTGRESDB_HOST: postgres',
    'DB_POSTGRESDB_DATABASE',
    'DB_POSTGRESDB_USER',
    'DB_POSTGRESDB_PASSWORD',
    'N8N_ENCRYPTION_KEY',
    'depends_on',
    'service_healthy',
    'postgres_data:/var/lib/postgresql/data',
    'n8n_data:/home/node/.n8n',
    '5687:5678',
    'week07PostgresProbe',
    'Week 07 PostgreSQL Probe',
    'public_table_count=93',
    'migration_count=184',
    'https://docs.docker.com/compose/',
    'https://docs.docker.com/reference/compose-file/services/#environment',
    'https://docs.docker.com/reference/compose-file/volumes/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/database/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/deployment/',
    'https://docs.n8n.io/hosting/installation/server-setups/docker-compose/',
    'https://hub.docker.com/_/postgres/'
  ];

  for (const text of requiredText) {
    assert(doc.includes(text), `Week seven document missing required text: ${text}`);
  }

  const requiredSections = [
    /^## 1\. 本週交付物總覽/m,
    /^## 2\. 官方來源核對/m,
    /^## 3\. 實測環境與結果/m,
    /^## 4\. 交付物一：Compose 架構解說/m,
    /^## 5\. 交付物二：env vars 對照表/m,
    /^## 6\. 交付物三：PostgreSQL-backed n8n 啟動紀錄/m,
    /^## 7\. production-shaped local stack 判斷/m,
    /^## 8\. 驗收條件說明/m,
    /^## 9\. Week 07 完成檢查/m,
    /^## 10\. 下一週銜接/m
  ];

  for (const pattern of requiredSections) {
    assert(pattern.test(doc), `Week seven document missing section matching ${pattern}`);
  }

  const bannedPatterns = [
    /for brevity/i,
    /the rest follows/i,
    /similarly for the remaining/i,
    /Let me know if you want me to continue/i,
    /I'll leave that as an exercise/i
  ];

  for (const pattern of bannedPatterns) {
    assert(!pattern.test(doc), `Week seven document contains banned placeholder pattern: ${pattern}`);
  }
}

async function verifyComposeArtifacts() {
  const compose = await readText(composeFile);
  const env = await readText(envFile);
  const workflow = await readJson('artifacts/week-07-compose/week-07-postgres-workflow.json');

  const requiredComposeText = [
    'name: n8n-week7',
    'postgres:',
    'image: postgres:16-alpine',
    'restart: unless-stopped',
    'POSTGRES_DB: ${POSTGRES_DB}',
    'POSTGRES_USER: ${POSTGRES_USER}',
    'POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}',
    'pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB',
    'postgres_data:/var/lib/postgresql/data',
    'n8n:',
    'image: docker.n8n.io/n8nio/n8n:2.22.4',
    'condition: service_healthy',
    '"5687:5678"',
    'DB_TYPE: postgresdb',
    'DB_POSTGRESDB_HOST: postgres',
    'N8N_ENCRYPTION_KEY: ${N8N_ENCRYPTION_KEY}',
    'n8n_data:/home/node/.n8n'
  ];

  for (const text of requiredComposeText) {
    assert(compose.includes(text), `Compose file missing required text: ${text}`);
  }

  const requiredEnvText = [
    'POSTGRES_DB=n8n_week7',
    'POSTGRES_USER=n8n_week7',
    'POSTGRES_PASSWORD=week7_local_postgres_password_do_not_reuse',
    'N8N_ENCRYPTION_KEY=week7_fixed_local_encryption_key_2026_05_27_do_not_reuse',
    'N8N_HOST=localhost',
    'N8N_PORT=5678',
    'N8N_PROTOCOL=http',
    'GENERIC_TIMEZONE=Asia/Taipei',
    'TZ=Asia/Taipei'
  ];

  for (const text of requiredEnvText) {
    assert(env.includes(text), `Week seven env file missing required text: ${text}`);
  }

  assert(workflow.id === 'week07PostgresProbe', 'Week seven workflow probe has the wrong id');
  assert(workflow.name === 'Week 07 PostgreSQL Probe', 'Week seven workflow probe has the wrong name');
  assert(
    workflow.nodes.some((node) => node.name === 'Manual Trigger') &&
      workflow.nodes.some((node) => node.name === 'PostgreSQL Marker'),
    'Week seven workflow probe missing required nodes'
  );

  const config = run('Docker Compose config', 'docker', [
    'compose',
    '--env-file',
    envFile,
    '-f',
    composeFile,
    'config'
  ]).stdout;

  const requiredConfigText = [
    'name: n8n-week7',
    'DB_TYPE: postgresdb',
    'DB_POSTGRESDB_HOST: postgres',
    'N8N_ENCRYPTION_KEY: week7_fixed_local_encryption_key_2026_05_27_do_not_reuse',
    'published: "5687"',
    'source: n8n_data',
    'source: postgres_data',
    'condition: service_healthy'
  ];

  for (const text of requiredConfigText) {
    assert(config.includes(text), `Rendered Compose config missing required text: ${text}`);
  }
}

async function verifyLaunchRecord() {
  const record = await readJson('artifacts/week-07-compose/week-07-launch-record.json');

  assert(record.week === 7, 'Launch record week must be 7');
  assert(record.compose.projectName === 'n8n-week7', 'Launch record must include project name');
  assert(record.compose.composeVersion === 'v5.1.0', 'Launch record must include tested Compose version');
  assert(record.services.postgres.container === 'n8n-week7-postgres-1', 'Launch record missing Postgres container');
  assert(record.services.postgres.health === 'healthy', 'Launch record must capture healthy Postgres');
  assert(record.services.postgres.publishedToHost === false, 'Postgres should not be published to host');
  assert(record.services.n8n.container === 'n8n-week7-n8n-1', 'Launch record missing n8n container');
  assert(record.services.n8n.n8nVersion === '2.22.4', 'Launch record missing n8n version');
  assert(record.services.n8n.hostPort === 5687, 'Launch record missing n8n host port');
  assert(record.services.n8n.httpStatus === 200, 'Launch record missing n8n HTTP readiness');
  assert(record.databaseVerification.dbType === 'postgresdb', 'Launch record missing postgresdb db type');
  assert(record.databaseVerification.publicTableCount === 93, 'Launch record missing table count');
  assert(record.databaseVerification.migrationCount === 184, 'Launch record missing migration count');
  assert(
    record.databaseVerification.requiredTablesObserved.includes('workflow_entity') &&
      record.databaseVerification.requiredTablesObserved.includes('credentials_entity') &&
      record.databaseVerification.requiredTablesObserved.includes('execution_entity') &&
      record.databaseVerification.requiredTablesObserved.includes('migrations'),
    'Launch record missing required tables'
  );
  assert(
    record.databaseVerification.workflowProbe.observedInPostgres === true &&
      record.databaseVerification.workflowProbe.observedAfterN8nRestart === true,
    'Launch record must confirm workflow probe persistence'
  );
}

async function verifyPackageScripts() {
  const pkg = await readJson('package.json');
  assert(pkg.scripts['verify:week7'] === 'node scripts/verify-week-seven.mjs', 'package.json missing verify:week7 script');
}

function composeArgs(args) {
  return ['compose', '--env-file', envFile, '-f', composeFile, ...args];
}

function verifyLiveStack() {
  const httpStatus = run('n8n Week 07 HTTP readiness', 'curl', [
    '-s',
    '-o',
    '/dev/null',
    '-w',
    '%{http_code}',
    'http://localhost:5687'
  ]).stdout;
  assert(httpStatus === '200', `Expected n8n Week 07 HTTP 200, got ${httpStatus}`);

  const ps = run('Docker Compose ps', 'docker', composeArgs(['ps'])).stdout;
  assert(ps.includes('n8n-week7-n8n-1'), 'Week seven n8n container is missing');
  assert(ps.includes('n8n-week7-postgres-1'), 'Week seven Postgres container is missing');
  assert(ps.includes('5687->5678'), 'Week seven n8n port mapping is missing');
  assert(ps.includes('healthy'), 'Week seven Postgres health is missing');

  const n8nVersion = run('n8n Week 07 version', 'docker', composeArgs(['exec', '-T', 'n8n', 'n8n', '--version'])).stdout;
  assert(n8nVersion === '2.22.4', `Unexpected Week seven n8n version: ${n8nVersion}`);

  const databaseSummary = run('Week seven database summary', 'docker', composeArgs([
    'exec',
    '-T',
    'postgres',
    'psql',
    '-U',
    'n8n_week7',
    '-d',
    'n8n_week7',
    '-At',
    '-c',
    "select current_database() || '|' || current_user || '|' || count(*) filter (where schemaname = 'public') from pg_tables;"
  ])).stdout;
  assert(databaseSummary === 'n8n_week7|n8n_week7|93', `Unexpected database summary: ${databaseSummary}`);

  const requiredTables = run('Week seven required table check', 'docker', composeArgs([
    'exec',
    '-T',
    'postgres',
    'psql',
    '-U',
    'n8n_week7',
    '-d',
    'n8n_week7',
    '-At',
    '-c',
    "select string_agg(tablename, ',' order by tablename) from pg_tables where schemaname='public' and tablename in ('workflow_entity','credentials_entity','execution_entity','migrations');"
  ])).stdout;
  assert(
    requiredTables === 'credentials_entity,execution_entity,migrations,workflow_entity',
    `Unexpected required tables: ${requiredTables}`
  );

  const workflowCount = run('Week seven workflow probe database check', 'docker', composeArgs([
    'exec',
    '-T',
    'postgres',
    'psql',
    '-U',
    'n8n_week7',
    '-d',
    'n8n_week7',
    '-At',
    '-c',
    "select count(*) from workflow_entity where id='week07PostgresProbe' and name='Week 07 PostgreSQL Probe';"
  ])).stdout;
  assert(workflowCount === '1', `Week seven workflow probe missing from PostgreSQL: ${workflowCount}`);

  const exportedWorkflow = run('Week seven workflow probe export', 'docker', composeArgs([
    'exec',
    '-T',
    'n8n',
    'n8n',
    'export:workflow',
    '--all'
  ])).stdout;
  assert(exportedWorkflow.includes('week07PostgresProbe'), 'n8n export missing Week 07 workflow probe id');
  assert(exportedWorkflow.includes('Week 07 PostgreSQL Probe'), 'n8n export missing Week 07 workflow probe name');
}

async function main() {
  await Promise.all(requiredFiles.map(assertFileExists));

  run('Week six verification', process.execPath, ['scripts/verify-week-six.mjs'], {
    timeout: 360000
  });

  await verifyPlanScope();
  await verifyDocument();
  await verifyComposeArtifacts();
  await verifyLaunchRecord();
  await verifyPackageScripts();
  verifyLiveStack();

  console.log('Week seven verification passed: Docker Compose and PostgreSQL-backed n8n stack is running.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

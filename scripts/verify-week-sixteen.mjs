#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const scalingDir = 'artifacts/week-16-scaling';
const scalingLadderFile = `${scalingDir}/week-16-scaling-ladder.json`;
const queueArchitectureFile = `${scalingDir}/week-16-queue-mode-architecture.json`;
const antiOverengineeringFile = `${scalingDir}/week-16-anti-overengineering-checklist.csv`;

const requiredFiles = [
  '20 周的執行計劃.md',
  'docs/week-16-scaling-single-queue-workers.md',
  scalingLadderFile,
  queueArchitectureFile,
  antiOverengineeringFile,
  'scripts/verify-week-fifteen.mjs',
  'scripts/verify-week-sixteen.mjs',
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
  const weekSixteen = plan.match(/### Week 16[\s\S]*?### Week 17/);
  assert(weekSixteen, 'Could not find Week 16 scope in plan');

  const requiredPlanText = [
    'Week 16｜Scaling：單機、Redis queue、workers',
    '何時該加大單機，何時該上 queue mode，何時才值得 Kubernetes',
    'single instance first',
    'PostgreSQL first',
    'Redis queue mode 與 workers',
    'separate webhook processors、managed DB/Redis、centralized logs',
    'scaling ladder',
    'queue mode architecture diagram',
    'anti-overengineering checklist',
    'single container + Postgres 到 Redis workers',
    '不是一開始就上 Kubernetes'
  ];

  for (const text of requiredPlanText) {
    assert(weekSixteen[0].includes(text), `Week 16 plan missing required text: ${text}`);
  }
}

async function verifyDocument() {
  const doc = await readText('docs/week-16-scaling-single-queue-workers.md');

  const requiredText = [
    'Week 16｜Scaling：單機、Redis queue、workers',
    'scaling ladder',
    'queue mode architecture diagram',
    'anti-overengineering checklist',
    'single instance first',
    'PostgreSQL first',
    'Redis queue mode 與 workers',
    'separate webhook processors、managed DB/Redis、centralized logs',
    'single container + Postgres 到 Redis workers',
    '而不是一開始就上 Kubernetes',
    'single container + PostgreSQL',
    'larger single instance + PostgreSQL',
    'Redis queue mode + workers',
    'separate webhook processors',
    'managed DB/Redis + centralized logs',
    'Kubernetes',
    'EXECUTIONS_MODE=queue',
    'QUEUE_BULL_REDIS_HOST',
    'QUEUE_BULL_REDIS_PORT',
    'N8N_CONCURRENCY_PRODUCTION_LIMIT',
    'N8N_ENCRYPTION_KEY',
    'N8N_DISABLE_PRODUCTION_MAIN_PROCESS',
    'N8N_DEFAULT_BINARY_DATA_MODE=database',
    'N8N_METRICS=true',
    'N8N_METRICS_INCLUDE_QUEUE_METRICS=true',
    '/webhook/*',
    '/webhook-waiting/*',
    '/webhook-test/*',
    'n8n worker --concurrency=5',
    'Postgres 13+',
    'https://docs.n8n.io/hosting/scaling/overview/',
    'https://docs.n8n.io/hosting/scaling/queue-mode/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/queue-mode/',
    'https://docs.n8n.io/hosting/scaling/concurrency-control/',
    'https://docs.n8n.io/hosting/scaling/execution-data/',
    'https://docs.n8n.io/hosting/scaling/binary-data/',
    'https://docs.n8n.io/hosting/scaling/external-storage/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/prometheus/',
    'https://docs.n8n.io/hosting/logging-monitoring/monitoring/',
    'https://docs.n8n.io/hosting/logging-monitoring/logging/',
    'https://docs.n8n.io/hosting/configuration/task-runners/',
    'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executecommand/',
    'https://docs.n8n.io/hosting/installation/server-setups/openshift-crc/'
  ];

  for (const text of requiredText) {
    assert(doc.includes(text), `Week sixteen document missing required text: ${text}`);
  }

  const requiredSections = [
    /^## 1\. 本週交付物總覽/m,
    /^## 2\. 官方來源核對/m,
    /^## 3\. 交付物一：scaling ladder/m,
    /^## 4\. 交付物二：queue mode architecture diagram/m,
    /^## 5\. 交付物三：anti-overengineering checklist/m,
    /^## 6\. single instance first 與 PostgreSQL first/m,
    /^## 7\. Redis queue mode 與 workers/m,
    /^## 8\. separate webhook processors、managed DB\/Redis、centralized logs/m,
    /^## 9\. Week 16 完成檢查/m,
    /^## 10\. 下一週銜接/m
  ];

  for (const pattern of requiredSections) {
    assert(pattern.test(doc), `Week sixteen document missing section matching ${pattern}`);
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
    assert(!pattern.test(doc), `Week sixteen document contains banned placeholder pattern: ${pattern}`);
  }
}

async function verifyScalingLadder() {
  const ladder = await readJson(scalingLadderFile);
  assert(ladder.week === 16, 'Scaling ladder must identify week 16');
  assert(
    ladder.acceptanceTarget.includes('single container + Postgres to Redis workers'),
    'Scaling ladder acceptance target must include gradual route'
  );

  const sourceValues = Object.values(ladder.officialSources);
  for (const source of [
    'https://docs.n8n.io/hosting/scaling/overview/',
    'https://docs.n8n.io/hosting/scaling/queue-mode/',
    'https://docs.n8n.io/hosting/scaling/concurrency-control/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/queue-mode/',
    'https://docs.n8n.io/hosting/scaling/execution-data/',
    'https://docs.n8n.io/hosting/scaling/binary-data/',
    'https://docs.n8n.io/hosting/scaling/external-storage/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/prometheus/',
    'https://docs.n8n.io/hosting/logging-monitoring/monitoring/',
    'https://docs.n8n.io/hosting/logging-monitoring/logging/',
    'https://docs.n8n.io/hosting/installation/server-setups/openshift-crc/'
  ]) {
    assert(sourceValues.includes(source), `Scaling ladder missing source: ${source}`);
  }

  for (const principle of [
    'single instance first',
    'PostgreSQL first',
    'Use queue mode when execution concurrency and worker separation are real bottlenecks',
    'Consider Kubernetes only after queue mode operations, managed DB/Redis, centralized logs, and platform skill are mature'
  ]) {
    assert(ladder.principles.includes(principle), `Scaling ladder missing principle: ${principle}`);
  }

  const stageIds = ladder.stages.map((stage) => stage.id);
  for (const id of [
    'stage-0-local-learning',
    'stage-1-single-container-postgres',
    'stage-2-larger-single-instance',
    'stage-3-observability-and-managed-state',
    'stage-4-redis-queue-workers',
    'stage-5-webhook-processors',
    'stage-6-managed-db-redis-centralized-logs',
    'stage-7-kubernetes'
  ]) {
    assert(stageIds.includes(id), `Scaling ladder missing stage: ${id}`);
  }
  assert(ladder.stages.length === 8, 'Scaling ladder must include exactly eight stages');

  for (const stage of ladder.stages) {
    assert(stage.architecture, `${stage.id} missing architecture`);
    assert(stage.entryCriteria?.length >= 3, `${stage.id} needs at least three entry criteria`);
    assert(stage.requiredSettings?.length >= 2, `${stage.id} needs required settings`);
    assert(stage.exitSignals?.length >= 2, `${stage.id} needs exit signals`);
    assert(stage.doNotSkip?.length >= 2, `${stage.id} needs doNotSkip checks`);
  }

  const stageFour = ladder.stages.find((stage) => stage.id === 'stage-4-redis-queue-workers');
  assert(stageFour.requiredSettings.includes('EXECUTIONS_MODE=queue'), 'Queue worker stage missing EXECUTIONS_MODE=queue');
  assert(stageFour.requiredSettings.includes('binary data mode database or S3'), 'Queue worker stage must mention database or S3 binary data');

  const kubernetes = ladder.stages.find((stage) => stage.id === 'stage-7-kubernetes');
  assert(
    kubernetes.doNotSkip.includes('Do not start with Kubernetes to avoid learning queue mode'),
    'Kubernetes stage must warn against starting with Kubernetes'
  );
}

async function verifyQueueArchitecture() {
  const architecture = await readJson(queueArchitectureFile);
  assert(architecture.week === 16, 'Queue architecture must identify week 16');
  assert(architecture.mermaid.includes('Redis: queue / message broker'), 'Queue architecture mermaid missing Redis');
  assert(architecture.mermaid.includes('worker 1: n8n worker --concurrency=5'), 'Queue architecture mermaid missing worker concurrency');
  assert(architecture.mermaid.includes('PostgreSQL: workflows, credentials, executions'), 'Queue architecture mermaid missing PostgreSQL');
  assert(architecture.mermaid.includes('webhook processor pool'), 'Queue architecture mermaid missing webhook processors');

  const sourceValues = Object.values(architecture.officialSources);
  for (const source of [
    'https://docs.n8n.io/hosting/scaling/queue-mode/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/queue-mode/',
    'https://docs.n8n.io/hosting/scaling/concurrency-control/',
    'https://docs.n8n.io/hosting/scaling/binary-data/',
    'https://docs.n8n.io/hosting/scaling/external-storage/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/prometheus/',
    'https://docs.n8n.io/hosting/configuration/task-runners/',
    'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executecommand/'
  ]) {
    assert(sourceValues.includes(source), `Queue architecture missing source: ${source}`);
  }

  const componentIds = architecture.components.map((component) => component.id);
  for (const id of [
    'main-process',
    'redis',
    'worker-pool',
    'webhook-processors',
    'postgresql',
    'binary-storage',
    'centralized-logs-and-metrics'
  ]) {
    assert(componentIds.includes(id), `Queue architecture missing component: ${id}`);
  }

  for (const component of architecture.components) {
    assert(component.role, `${component.id} missing role`);
    assert(component.requiredConfiguration?.length >= 3, `${component.id} missing required configuration`);
  }

  const routeTargets = architecture.routingRules.map((route) => `${route.path} -> ${route.target}`);
  for (const route of [
    '/webhook/* -> webhook processor pool',
    '/webhook-waiting/* -> webhook processor pool',
    '/webhook-test/* -> main process'
  ]) {
    assert(routeTargets.includes(route), `Queue architecture missing routing rule: ${route}`);
  }

  for (const warning of [
    'Do not add the main process to the webhook load balancer pool when webhook processors exist.',
    'Do not use filesystem binary data storage with queue mode.',
    'Do not run workers with a different N8N_ENCRYPTION_KEY than main.',
    'Do not start with Kubernetes before Redis queue mode and worker operations are understood.'
  ]) {
    assert(architecture.mustNotDo.includes(warning), `Queue architecture missing warning: ${warning}`);
  }
}

async function verifyAntiOverengineeringChecklist() {
  const csv = await readText(antiOverengineeringFile);
  assert(
    csv.startsWith('"category","question","if_no","if_yes","evidence_required","decision"'),
    'Anti-overengineering checklist CSV header is wrong'
  );

  const requiredCategories = [
    'state',
    'recovery',
    'observability',
    'regular_mode',
    'single_instance',
    'execution_data',
    'binary_data',
    'webhook_latency',
    'redis_readiness',
    'db_connections',
    'worker_logs',
    'webhook_processors',
    'load_balancer',
    'managed_state',
    'centralized_logs',
    'team_skill',
    'kubernetes_need',
    'cost',
    'security',
    'acceptance'
  ];

  for (const category of requiredCategories) {
    assert(csv.includes(`"${category}"`), `Anti-overengineering checklist missing category: ${category}`);
  }

  for (const text of [
    'PostgreSQL first',
    'Observe before scale',
    'N8N_CONCURRENCY_PRODUCTION_LIMIT',
    'N8N_DEFAULT_BINARY_DATA_MODE',
    'Redis readiness',
    'DB capacity gates workers',
    'Logs before distributed execution',
    'Route correctness',
    'Central logs before Kubernetes',
    'Kubernetes last',
    'single container + Postgres to Redis workers'
  ]) {
    assert(csv.includes(text), `Anti-overengineering checklist missing text: ${text}`);
  }

  const rowCount = csv.trim().split('\n').length - 1;
  assert(rowCount >= 20, `Anti-overengineering checklist should include at least 20 rows, found ${rowCount}`);
}

async function verifyPackageScripts() {
  const pkg = await readJson('package.json');
  assert(pkg.scripts['verify:week15'] === 'node scripts/verify-week-fifteen.mjs', 'package.json missing verify:week15 script');
  assert(pkg.scripts['verify:week16'] === 'node scripts/verify-week-sixteen.mjs', 'package.json missing verify:week16 script');
}

function verifyLiveLocalStackStillClean() {
  const httpStatus = run('n8n local HTTP readiness after Week 16', 'curl', [
    '-s',
    '-o',
    '/dev/null',
    '-w',
    '%{http_code}',
    'http://localhost:5687'
  ]).stdout;
  assert(httpStatus === '200', `Expected existing local n8n HTTP 200 after Week 16, got ${httpStatus}`);

  const cloudflaredContainers = run('Week sixteen cloudflared cleanup check', 'docker', [
    'ps',
    '--filter',
    'name=week8-cloudflared',
    '--format',
    '{{.Names}}'
  ]).stdout;
  assert(cloudflaredContainers === '', 'Week eight quick tunnel container should not be running during Week 16');
}

async function main() {
  await Promise.all(requiredFiles.map(assertFileExists));

  run('Week fifteen verification', process.execPath, ['scripts/verify-week-fifteen.mjs'], {
    timeout: 900000
  });

  await verifyPlanScope();
  await verifyDocument();
  await verifyScalingLadder();
  await verifyQueueArchitecture();
  await verifyAntiOverengineeringChecklist();
  await verifyPackageScripts();
  verifyLiveLocalStackStillClean();

  console.log('Week sixteen verification passed: scaling ladder, queue mode architecture, and anti-overengineering checklist define a gradual route from single container + Postgres to Redis workers without starting with Kubernetes.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

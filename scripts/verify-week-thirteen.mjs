#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const capacityDir = 'artifacts/week-13-capacity';
const sizingFile = `${capacityDir}/week-13-sizing-recommendation-table.json`;
const riskRegisterFile = `${capacityDir}/week-13-binary-heavy-risk-register.json`;
const metricsFile = `${capacityDir}/week-13-capacity-observation-metrics.csv`;

const requiredFiles = [
  '20 周的執行計劃.md',
  'docs/week-13-database-binary-capacity-planning.md',
  sizingFile,
  riskRegisterFile,
  metricsFile,
  'scripts/verify-week-twelve.mjs',
  'scripts/verify-week-thirteen.mjs',
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
  const weekThirteen = plan.match(/### Week 13[\s\S]*?### Week 14/);
  assert(weekThirteen, 'Could not find Week 13 scope in plan');

  const requiredPlanText = [
    'Week 13｜資料庫、binary data 與容量規劃',
    '如何為不同負載選擇初始規格，並避免 binary-heavy workflow 拖垮記憶體',
    '讀 server sizing table',
    'learning、personal、freelancer、small business、agency、AI-heavy',
    'frequency、concurrency、binary size、wait states、AI calls、browser automation',
    'sizing recommendation table',
    'binary-heavy workflow 風險說明',
    '容量觀察指標清單',
    '4 vCPU / 8 GB RAM / PostgreSQL / backup / monitoring'
  ];

  for (const text of requiredPlanText) {
    assert(weekThirteen[0].includes(text), `Week 13 plan missing required text: ${text}`);
  }
}

async function verifyDocument() {
  const doc = await readText('docs/week-13-database-binary-capacity-planning.md');

  const requiredText = [
    'Week 13｜資料庫、binary data 與容量規劃',
    'sizing recommendation table',
    'binary-heavy workflow 風險說明',
    '容量觀察指標清單',
    'server sizing table',
    'learning',
    'personal',
    'freelancer',
    'small business',
    'agency',
    'AI-heavy',
    'frequency',
    'concurrency',
    'binary size',
    'wait states',
    'AI calls',
    'browser automation',
    '4 vCPU / 8 GB RAM / PostgreSQL / backup / monitoring',
    'DB_TYPE=postgresdb',
    'N8N_DEFAULT_BINARY_DATA_MODE',
    'EXECUTIONS_DATA_PRUNE',
    'EXECUTIONS_DATA_MAX_AGE',
    'EXECUTIONS_DATA_PRUNE_MAX_COUNT',
    'N8N_CONCURRENCY_PRODUCTION_LIMIT',
    'queue mode',
    'Redis',
    'PostgreSQL',
    'S3',
    'https://docs.n8n.io/hosting/oem-deployment/prerequisites/',
    'https://docs.n8n.io/hosting/scaling/performance-benchmarking/',
    'https://docs.n8n.io/hosting/scaling/overview/',
    'https://docs.n8n.io/hosting/configuration/supported-databases-settings/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/database/',
    'https://docs.n8n.io/hosting/scaling/queue-mode/',
    'https://docs.n8n.io/hosting/scaling/concurrency-control/',
    'https://docs.n8n.io/hosting/scaling/execution-data/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/executions/',
    'https://docs.n8n.io/hosting/scaling/binary-data/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/binary-data/',
    'https://docs.n8n.io/hosting/scaling/external-storage/',
    'https://docs.n8n.io/hosting/scaling/memory-errors/',
    'https://docs.n8n.io/hosting/logging-monitoring/monitoring/',
    'https://docs.n8n.io/hosting/logging-monitoring/logging/',
    'https://docs.n8n.io/flow-logic/waiting/',
    'https://docs.n8n.io/advanced-ai/intro-tutorial/',
    'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executecommand/'
  ];

  for (const text of requiredText) {
    assert(doc.includes(text), `Week thirteen document missing required text: ${text}`);
  }

  const requiredSections = [
    /^## 1\. 本週交付物總覽/m,
    /^## 2\. 官方來源核對/m,
    /^## 3\. 交付物一：sizing recommendation table/m,
    /^## 4\. 交付物二：binary-heavy workflow 風險說明/m,
    /^## 5\. 交付物三：容量觀察指標清單/m,
    /^## 6\. 負載因素如何改變初始規格/m,
    /^## 7\. small business 起點建議/m,
    /^## 8\. 規格調整 runbook/m,
    /^## 9\. Week 13 完成檢查/m,
    /^## 10\. 下一週銜接/m
  ];

  for (const pattern of requiredSections) {
    assert(pattern.test(doc), `Week thirteen document missing section matching ${pattern}`);
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
    assert(!pattern.test(doc), `Week thirteen document contains banned placeholder pattern: ${pattern}`);
  }
}

async function verifySizingArtifact() {
  const sizing = await readJson(sizingFile);
  assert(sizing.week === 13, 'Sizing artifact must identify week 13');
  assert(
    sizing.acceptanceTarget.includes('4 vCPU / 8 GB RAM / PostgreSQL / backup / monitoring'),
    'Sizing artifact acceptance target must include small business baseline'
  );

  const sourceValues = Object.values(sizing.officialSources);
  for (const source of [
    'https://docs.n8n.io/hosting/oem-deployment/prerequisites/',
    'https://docs.n8n.io/hosting/scaling/performance-benchmarking/',
    'https://docs.n8n.io/hosting/scaling/queue-mode/',
    'https://docs.n8n.io/hosting/scaling/concurrency-control/',
    'https://docs.n8n.io/hosting/scaling/execution-data/',
    'https://docs.n8n.io/hosting/scaling/binary-data/',
    'https://docs.n8n.io/hosting/scaling/external-storage/',
    'https://docs.n8n.io/hosting/logging-monitoring/monitoring/'
  ]) {
    assert(sourceValues.includes(source), `Sizing artifact missing source: ${source}`);
  }

  const profileIds = sizing.profiles.map((profile) => profile.id);
  for (const id of ['learning', 'personal', 'freelancer', 'small-business', 'agency', 'ai-heavy']) {
    assert(profileIds.includes(id), `Sizing artifact missing profile: ${id}`);
  }
  assert(sizing.profiles.length === 6, 'Sizing artifact must include exactly six profiles');

  const driverNames = sizing.capacityDrivers.map((driver) => driver.name);
  for (const name of ['frequency', 'concurrency', 'binary size', 'wait states', 'AI calls', 'browser automation']) {
    assert(driverNames.includes(name), `Sizing artifact missing capacity driver: ${name}`);
  }

  const smallBusiness = sizing.profiles.find((profile) => profile.id === 'small-business');
  assert(smallBusiness.startingSpec.vcpu === 4, 'Small business vCPU must be 4');
  assert(smallBusiness.startingSpec.ramGb === 8, 'Small business RAM must be 8 GB');
  assert(
    smallBusiness.startingSpec.summary === '4 vCPU / 8 GB RAM / PostgreSQL / backup / monitoring',
    'Small business summary must match acceptance wording'
  );
  assert(smallBusiness.database.includes('PostgreSQL'), 'Small business database must be PostgreSQL');
  assert(smallBusiness.backup.includes('Daily automated PostgreSQL backup'), 'Small business backup must be explicit');
  assert(smallBusiness.monitoring.includes('webhook latency'), 'Small business monitoring must include webhook latency');
  assert(
    smallBusiness.acceptanceConclusion.includes('reasonable starting point'),
    'Small business acceptance conclusion must justify starting point'
  );

  for (const profile of sizing.profiles) {
    assert(profile.startingSpec?.summary, `${profile.id} missing startingSpec.summary`);
    assert(profile.database, `${profile.id} missing database`);
    assert(profile.backup, `${profile.id} missing backup`);
    assert(profile.monitoring, `${profile.id} missing monitoring`);
    assert(profile.concurrencyModel, `${profile.id} missing concurrencyModel`);
    assert(profile.binaryDataModel, `${profile.id} missing binaryDataModel`);
    assert(profile.warningSigns?.length >= 3, `${profile.id} needs at least three warning signs`);
    assert(profile.upgradeTriggers?.length >= 3, `${profile.id} needs at least three upgrade triggers`);
  }
}

async function verifyBinaryRiskRegister() {
  const riskRegister = await readJson(riskRegisterFile);
  assert(riskRegister.week === 13, 'Risk register must identify week 13');
  assert(riskRegister.acceptanceConclusion.includes('Binary-heavy workflows'), 'Risk register conclusion is missing');

  const sourceValues = Object.values(riskRegister.officialSources);
  for (const source of [
    'https://docs.n8n.io/hosting/scaling/binary-data/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/binary-data/',
    'https://docs.n8n.io/hosting/scaling/external-storage/',
    'https://docs.n8n.io/hosting/scaling/execution-data/',
    'https://docs.n8n.io/flow-logic/waiting/',
    'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executecommand/'
  ]) {
    assert(sourceValues.includes(source), `Risk register missing source: ${source}`);
  }

  const requiredRiskIds = [
    'memory-default-binary-mode',
    'filesystem-disk-growth',
    'database-bloat',
    'external-storage-drift',
    'ai-document-processing',
    'browser-automation-processes',
    'wait-states-retention',
    'large-webhook-payloads',
    'concurrency-burst',
    'backup-restore-window'
  ];

  const riskIds = riskRegister.risks.map((risk) => risk.id);
  for (const id of requiredRiskIds) {
    assert(riskIds.includes(id), `Risk register missing risk: ${id}`);
  }

  for (const risk of riskRegister.risks) {
    assert(risk.severity, `${risk.id} missing severity`);
    assert(risk.risk, `${risk.id} missing risk text`);
    assert(risk.symptoms?.length >= 3, `${risk.id} needs at least three symptoms`);
    assert(risk.indicators?.length >= 3, `${risk.id} needs at least three indicators`);
    assert(risk.mitigation?.length >= 3, `${risk.id} needs at least three mitigations`);
    assert(risk.verification, `${risk.id} missing verification`);
  }
}

async function verifyMetricsCsv() {
  const csv = await readText(metricsFile);
  assert(
    csv.startsWith('"metric","why_it_matters","healthy_signal","warning_signal","action","source_layer"'),
    'Metrics CSV header is wrong'
  );

  const requiredMetrics = [
    'cpu_usage_percent',
    'memory_rss_percent',
    'container_restart_count',
    'postgres_storage_bytes',
    'postgres_connection_count',
    'postgres_cpu_percent',
    'execution_count_per_hour',
    'execution_duration_p95_seconds',
    'failed_execution_rate',
    'active_execution_count',
    'waiting_executions_count',
    'queue_depth',
    'worker_memory_percent',
    'worker_health_status',
    'webhook_latency_p95_seconds',
    'http_5xx_rate',
    'binary_storage_bytes',
    'filesystem_disk_used_percent',
    'object_storage_error_count',
    'ai_api_latency_p95_seconds',
    'ai_api_error_rate',
    'browser_step_duration_seconds',
    'browser_temp_storage_bytes',
    'backup_success_status',
    'backup_duration_seconds',
    'restore_drill_duration_seconds',
    'log_error_rate'
  ];

  for (const metric of requiredMetrics) {
    assert(csv.includes(`"${metric}"`), `Metrics CSV missing metric: ${metric}`);
  }

  const rowCount = csv.trim().split('\n').length - 1;
  assert(rowCount >= 27, `Metrics CSV should include at least 27 metrics, found ${rowCount}`);
}

async function verifyPackageScripts() {
  const pkg = await readJson('package.json');
  assert(pkg.scripts['verify:week12'] === 'node scripts/verify-week-twelve.mjs', 'package.json missing verify:week12 script');
  assert(pkg.scripts['verify:week13'] === 'node scripts/verify-week-thirteen.mjs', 'package.json missing verify:week13 script');
}

function verifyLiveLocalStackStillClean() {
  const httpStatus = run('n8n local HTTP readiness after Week 13', 'curl', [
    '-s',
    '-o',
    '/dev/null',
    '-w',
    '%{http_code}',
    'http://localhost:5687'
  ]).stdout;
  assert(httpStatus === '200', `Expected existing local n8n HTTP 200 after Week 13, got ${httpStatus}`);

  const cloudflaredContainers = run('Week thirteen cloudflared cleanup check', 'docker', [
    'ps',
    '--filter',
    'name=week8-cloudflared',
    '--format',
    '{{.Names}}'
  ]).stdout;
  assert(cloudflaredContainers === '', 'Week eight quick tunnel container should not be running during Week 13');
}

async function main() {
  await Promise.all(requiredFiles.map(assertFileExists));

  run('Week twelve verification', process.execPath, ['scripts/verify-week-twelve.mjs'], {
    timeout: 900000
  });

  await verifyPlanScope();
  await verifyDocument();
  await verifySizingArtifact();
  await verifyBinaryRiskRegister();
  await verifyMetricsCsv();
  await verifyPackageScripts();
  verifyLiveLocalStackStillClean();

  console.log('Week thirteen verification passed: database, binary data, and capacity planning are complete, and the small business 4 vCPU / 8 GB RAM / PostgreSQL / backup / monitoring baseline is justified.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

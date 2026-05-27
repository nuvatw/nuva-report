#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const troubleshootingDir = 'artifacts/week-17-troubleshooting';
const cardsFile = `${troubleshootingDir}/week-17-troubleshooting-cards.json`;
const checkOrderFile = `${troubleshootingDir}/week-17-check-order.json`;
const incidentTemplateFile = `${troubleshootingDir}/week-17-incident-note-template.md`;

const requiredFiles = [
  '20 周的執行計劃.md',
  'docs/week-17-troubleshooting-drills.md',
  cardsFile,
  checkOrderFile,
  incidentTemplateFile,
  'scripts/verify-week-sixteen.mjs',
  'scripts/verify-week-seventeen.mjs',
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
  const weekSeventeen = plan.match(/### Week 17[\s\S]*?### Week 18/);
  assert(weekSeventeen, 'Could not find Week 17 scope in plan');

  const requiredPlanText = [
    'Week 17｜故障排除演練',
    'container、DB、URL、proxy、OAuth、security 還是 resource 問題',
    '逐項演練 troubleshooting table',
    '為常見問題寫第一檢查點',
    '把症狀轉成排查流程',
    '12 張故障排除卡',
    'log/env/DNS/proxy/DB 檢查順序',
    'incident note 範本',
    'wrong webhook URL',
    'lost credentials',
    'database connection failed',
    'secure cookie error'
  ];

  for (const text of requiredPlanText) {
    assert(weekSeventeen[0].includes(text), `Week 17 plan missing required text: ${text}`);
  }
}

async function verifyDocument() {
  const doc = await readText('docs/week-17-troubleshooting-drills.md');
  assertNoBannedPatterns('Week seventeen document', doc);

  const requiredText = [
    'Week 17｜故障排除演練',
    '12 張故障排除卡',
    'log/env/DNS/proxy/DB 檢查順序',
    'incident note 範本',
    'troubleshooting table',
    '第一檢查點',
    '症狀轉排查流程',
    'wrong webhook URL',
    'lost credentials',
    'database connection failed',
    'secure cookie error',
    'container、DB、URL、proxy、OAuth、security 還是 resource 問題',
    'WEBHOOK_URL',
    'N8N_PROXY_HOPS',
    'N8N_EDITOR_BASE_URL',
    'N8N_ENCRYPTION_KEY',
    'DB_TYPE=postgresdb',
    'DB_POSTGRESDB_HOST',
    'N8N_SECURE_COOKIE',
    'X-Forwarded-Proto=https',
    '/healthz/readiness',
    'N8N_LOG_LEVEL',
    'N8N_LOG_FORMAT=json',
    'EXECUTIONS_MODE=queue',
    'QUEUE_BULL_REDIS_HOST',
    'T01 wrong webhook URL',
    'T02 lost credentials',
    'T03 database connection failed',
    'T04 secure cookie error',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/',
    'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/common-issues/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/database/',
    'https://docs.n8n.io/hosting/logging-monitoring/logging/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/security/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/encryption-key/',
    'https://docs.n8n.io/integrations/builtin/credentials/httprequest/',
    'https://docs.n8n.io/hosting/scaling/memory-errors/',
    'https://docs.n8n.io/hosting/scaling/queue-mode/'
  ];

  for (const text of requiredText) {
    assert(doc.includes(text), `Week seventeen document missing required text: ${text}`);
  }

  const requiredSections = [
    /^## 1\. 本週交付物總覽/m,
    /^## 2\. 官方來源核對/m,
    /^## 3\. 症狀轉排查流程/m,
    /^## 4\. 交付物一：12 張故障排除卡/m,
    /^## 5\. 交付物二：log\/env\/DNS\/proxy\/DB 檢查順序/m,
    /^## 6\. 交付物三：incident note 範本/m,
    /^## 7\. troubleshooting table 演練/m,
    /^## 8\. Week 17 完成檢查/m,
    /^## 9\. 下一週銜接/m
  ];

  for (const pattern of requiredSections) {
    assert(pattern.test(doc), `Week seventeen document missing section matching ${pattern}`);
  }
}

async function verifyTroubleshootingCards() {
  const cardsArtifact = await readJson(cardsFile);
  assert(cardsArtifact.week === 17, 'Troubleshooting cards artifact must identify week 17');
  assert(
    cardsArtifact.acceptanceTarget.includes('wrong webhook URL') &&
      cardsArtifact.acceptanceTarget.includes('lost credentials') &&
      cardsArtifact.acceptanceTarget.includes('database connection failed') &&
      cardsArtifact.acceptanceTarget.includes('secure cookie error'),
    'Troubleshooting cards acceptance target must include all four required incidents'
  );

  const sourceValues = Object.values(cardsArtifact.officialSources);
  for (const source of [
    'https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/',
    'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/common-issues/',
    'https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.telegramtrigger/common-issues/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/database/',
    'https://docs.n8n.io/hosting/configuration/supported-databases-settings/',
    'https://docs.n8n.io/hosting/logging-monitoring/logging/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/logs/',
    'https://docs.n8n.io/hosting/logging-monitoring/monitoring/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/security/',
    'https://docs.n8n.io/hosting/securing/set-up-ssl/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/encryption-key/',
    'https://docs.n8n.io/hosting/securing/encryption-key-rotation/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/deployment/',
    'https://docs.n8n.io/integrations/builtin/credentials/httprequest/',
    'https://docs.n8n.io/hosting/scaling/memory-errors/',
    'https://docs.n8n.io/hosting/scaling/queue-mode/'
  ]) {
    assert(sourceValues.includes(source), `Troubleshooting cards missing source: ${source}`);
  }

  assert(cardsArtifact.cards.length === 12, `Expected exactly 12 troubleshooting cards, found ${cardsArtifact.cards.length}`);

  const cardNames = cardsArtifact.cards.map((card) => card.name);
  for (const name of [
    'wrong webhook URL',
    'lost credentials',
    'database connection failed',
    'secure cookie error',
    'OAuth callback mismatch',
    'proxy forwarded headers',
    'DNS or TLS failure',
    'container restart loop',
    'resource exhaustion',
    'queue worker stalled',
    'webhook path or method conflict',
    'missing logs or evidence'
  ]) {
    assert(cardNames.includes(name), `Troubleshooting cards missing card: ${name}`);
  }

  const requiredLayers = ['URL', 'security', 'DB', 'OAuth', 'proxy', 'DNS', 'container', 'resource', 'queue', 'workflow', 'observability'];
  const layers = new Set(cardsArtifact.cards.map((card) => card.layer));
  for (const layer of requiredLayers) {
    assert(layers.has(layer), `Troubleshooting cards missing layer: ${layer}`);
  }

  for (const card of cardsArtifact.cards) {
    assert(/^T\d{2}$/.test(card.id), `${card.name} has invalid id`);
    assert(card.symptom, `${card.name} missing symptom`);
    assert(card.likelyCauses?.length >= 3, `${card.name} needs at least three likely causes`);
    assert(card.firstCheck, `${card.name} missing firstCheck`);
    assert(card.checkCommands?.length >= 2, `${card.name} needs at least two check commands`);
    assert(card.repairDirection, `${card.name} missing repairDirection`);
    assert(card.prevention, `${card.name} missing prevention`);
    assert(card.evidenceRequired?.length >= 4, `${card.name} needs evidence requirements`);
  }

  const wrongWebhook = cardsArtifact.cards.find((card) => card.name === 'wrong webhook URL');
  assert(wrongWebhook.firstCheck.includes('WEBHOOK_URL'), 'wrong webhook URL card first check must mention WEBHOOK_URL');
  assert(wrongWebhook.repairDirection.includes('WEBHOOK_URL'), 'wrong webhook URL card repair must mention WEBHOOK_URL');

  const lostCredentials = cardsArtifact.cards.find((card) => card.name === 'lost credentials');
  assert(lostCredentials.firstCheck.includes('N8N_ENCRYPTION_KEY'), 'lost credentials card first check must mention N8N_ENCRYPTION_KEY');
  assert(lostCredentials.repairDirection.includes('original N8N_ENCRYPTION_KEY'), 'lost credentials card repair must mention original key');

  const dbFailure = cardsArtifact.cards.find((card) => card.name === 'database connection failed');
  assert(dbFailure.firstCheck.includes('DB_TYPE=postgresdb'), 'database connection failed card first check must mention DB_TYPE=postgresdb');
  assert(dbFailure.repairDirection.includes('PostgreSQL'), 'database connection failed card repair must mention PostgreSQL');

  const secureCookie = cardsArtifact.cards.find((card) => card.name === 'secure cookie error');
  assert(secureCookie.firstCheck.includes('X-Forwarded-Proto=https'), 'secure cookie error card first check must mention X-Forwarded-Proto=https');
  assert(secureCookie.repairDirection.includes('N8N_SECURE_COOKIE=false'), 'secure cookie error card repair must mention local-only override');
}

async function verifyCheckOrder() {
  const checkOrder = await readJson(checkOrderFile);
  assert(checkOrder.week === 17, 'Check order artifact must identify week 17');
  assert(checkOrder.sequence.length === 12, `Expected 12 check-order gates, found ${checkOrder.sequence.length}`);

  const expectedOrder = [
    'log',
    'env',
    'DNS',
    'proxy',
    'DB',
    'container',
    'credentials',
    'OAuth',
    'security',
    'resource',
    'queue',
    'workflow'
  ];

  const actualOrder = checkOrder.sequence.map((step) => step.gate);
  assert(JSON.stringify(actualOrder) === JSON.stringify(expectedOrder), `Check order mismatch: ${actualOrder.join(' -> ')}`);

  for (const step of checkOrder.sequence) {
    assert(Number.isInteger(step.step), `${step.gate} step number missing`);
    assert(step.purpose, `${step.gate} missing purpose`);
    assert(step.commands?.length >= 2, `${step.gate} needs at least two commands`);
    assert(step.passSignal, `${step.gate} missing pass signal`);
    assert(step.failAction, `${step.gate} missing fail action`);
  }

  const joined = JSON.stringify(checkOrder);
  for (const text of [
    'WEBHOOK_URL',
    'N8N_EDITOR_BASE_URL',
    'N8N_ENCRYPTION_KEY',
    'DB_POSTGRESDB_*',
    'X-Forwarded-Proto',
    '/healthz/readiness',
    'N8N_SECURE_COOKIE',
    'QUEUE_BULL_REDIS_HOST'
  ]) {
    assert(joined.includes(text), `Check order missing text: ${text}`);
  }
}

async function verifyIncidentTemplate() {
  const template = await readText(incidentTemplateFile);
  assertNoBannedPatterns('Week seventeen incident note template', template);

  const requiredSections = [
    /^# Incident Note Template｜n8n troubleshooting/m,
    /^## Incident Header/m,
    /^## Symptom/m,
    /^## Architecture Context/m,
    /^## Check Sequence/m,
    /^## Hypothesis Matrix/m,
    /^## Fix Applied/m,
    /^## Verification/m,
    /^## Root Cause/m,
    /^## Prevention/m,
    /^## Closure/m
  ];

  for (const pattern of requiredSections) {
    assert(pattern.test(template), `Incident note template missing section matching ${pattern}`);
  }

  for (const text of [
    'Incident ID',
    'Severity',
    'Affected workflow',
    'Exact error text',
    'Deployment type',
    'log',
    'env',
    'DNS',
    'proxy',
    'DB',
    'container',
    'credentials',
    'OAuth',
    'security',
    'resource',
    'queue',
    'workflow',
    '/healthz/readiness',
    'Credential decrypt',
    'Direct cause',
    'Prevention'
  ]) {
    assert(template.includes(text), `Incident note template missing text: ${text}`);
  }
}

async function verifyPackageScripts() {
  const pkg = await readJson('package.json');
  assert(pkg.scripts['verify:week16'] === 'node scripts/verify-week-sixteen.mjs', 'package.json missing verify:week16 script');
  assert(pkg.scripts['verify:week17'] === 'node scripts/verify-week-seventeen.mjs', 'package.json missing verify:week17 script');
}

function verifyLiveLocalStackStillClean() {
  const httpStatus = run('n8n local HTTP readiness after Week 17', 'curl', [
    '-s',
    '-o',
    '/dev/null',
    '-w',
    '%{http_code}',
    'http://localhost:5687'
  ]).stdout;
  assert(httpStatus === '200', `Expected existing local n8n HTTP 200 after Week 17, got ${httpStatus}`);

  const cloudflaredContainers = run('Week seventeen cloudflared cleanup check', 'docker', [
    'ps',
    '--filter',
    'name=week8-cloudflared',
    '--format',
    '{{.Names}}'
  ]).stdout;
  assert(cloudflaredContainers === '', 'Week eight quick tunnel container should not be running during Week 17');
}

async function main() {
  await Promise.all(requiredFiles.map(assertFileExists));

  run('Week sixteen verification', process.execPath, ['scripts/verify-week-sixteen.mjs'], {
    timeout: 900000
  });

  await verifyPlanScope();
  await verifyDocument();
  await verifyTroubleshootingCards();
  await verifyCheckOrder();
  await verifyIncidentTemplate();
  await verifyPackageScripts();
  verifyLiveLocalStackStillClean();

  console.log('Week seventeen verification passed: 12 troubleshooting cards, log/env/DNS/proxy/DB check order, and incident note template cover wrong webhook URL, lost credentials, database connection failed, and secure cookie error.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

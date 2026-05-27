#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const paasDir = 'artifacts/week-11-paas';
const matrixFile = `${paasDir}/week-11-paas-platform-matrix.json`;
const riskCardFile = `${paasDir}/week-11-persistent-storage-risk-card.json`;
const recommendationsFile = `${paasDir}/week-11-platform-selection-recommendations.csv`;

const requiredFiles = [
  '20 周的執行計劃.md',
  'docs/week-11-paas-persistence-platforms.md',
  matrixFile,
  riskCardFile,
  recommendationsFile,
  'scripts/verify-week-ten.mjs',
  'scripts/verify-week-eleven.mjs',
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
  const weekEleven = plan.match(/### Week 11[\s\S]*?### Week 12/);
  assert(weekEleven, 'Could not find Week 11 scope in plan');

  const requiredPlanText = [
    'Week 11｜Railway、Zeabur、Render、Fly.io',
    'PaaS 可以省下哪些維運，又在哪些地方最容易踩到持久化陷阱',
    'persistent volume、managed PostgreSQL、custom domain、TLS、env vars',
    'Render/Fly/Zeabur/Railway 的狀態保存模型',
    'usage pricing 與 always-on 成本',
    'PaaS 平台比較表',
    'persistent storage risk card',
    '平台選型建議',
    '能說明為什麼服務能啟動不代表 n8n state 能在 redeploy 後存活'
  ];

  for (const text of requiredPlanText) {
    assert(weekEleven[0].includes(text), `Week 11 plan missing required text: ${text}`);
  }
}

async function verifyDocument() {
  const doc = await readText('docs/week-11-paas-persistence-platforms.md');

  const requiredText = [
    'Week 11｜Railway、Zeabur、Render、Fly.io',
    'PaaS 平台比較表',
    'persistent storage risk card',
    '平台選型建議',
    'Railway',
    'Zeabur',
    'Render',
    'Fly.io',
    'persistent volume',
    'managed PostgreSQL',
    'custom domain',
    'TLS',
    'env vars',
    'usage pricing',
    'always-on',
    'WEBHOOK_URL',
    'N8N_EDITOR_BASE_URL',
    'N8N_ENCRYPTION_KEY',
    'DB_TYPE',
    'postgresdb',
    'ephemeral filesystem',
    'redeploy 後存活',
    '服務能啟動只代表 runtime 起來了',
    '不代表 n8n state 能在 redeploy 後存活',
    'https://docs.n8n.io/hosting/installation/docker/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/encryption-key/',
    'https://docs.railway.com/reference/volumes',
    'https://docs.railway.com/databases/postgresql/',
    'https://docs.railway.com/reference/public-networking',
    'https://docs.railway.com/variables',
    'https://render.com/docs/deploy-n8n/',
    'https://render.com/docs/disks',
    'https://render.com/docs/custom-domains/',
    'https://render.com/docs/configure-environment-variables/',
    'https://zeabur.com/docs/en-US/data-management/volumes',
    'https://zeabur.com/docs/en-US/networking/public',
    'https://zeabur.com/docs/en-US/deploy/special-variables',
    'https://zeabur.com/docs/template',
    'https://zeabur.com/docs/en-US/billing/pricing',
    'https://fly.io/docs/volumes/overview/',
    'https://fly.io/docs/mpg',
    'https://fly.io/docs/postgres/getting-started/what-you-should-know/',
    'https://fly.io/docs/networking/custom-domain/',
    'https://www.fly.io/docs/apps/secrets/'
  ];

  for (const text of requiredText) {
    assert(doc.includes(text), `Week eleven document missing required text: ${text}`);
  }

  const requiredSections = [
    /^## 1\. 本週交付物總覽/m,
    /^## 2\. 官方來源核對/m,
    /^## 3\. 交付物一：PaaS 平台比較表/m,
    /^## 4\. 交付物二：persistent storage risk card/m,
    /^## 5\. 交付物三：平台選型建議/m,
    /^## 6\. 四個平台的 n8n 狀態保存模型/m,
    /^## 7\. n8n PaaS env vars 檢查表/m,
    /^## 8\. 為什麼服務能啟動不代表 state 能在 redeploy 後存活/m,
    /^## 9\. Week 11 完成檢查/m,
    /^## 10\. 下一週銜接/m
  ];

  for (const pattern of requiredSections) {
    assert(pattern.test(doc), `Week eleven document missing section matching ${pattern}`);
  }

  const bannedPatterns = [
    /for brevity/i,
    /the rest follows/i,
    /similarly for the remaining/i,
    /Let me know if you want me to continue/i,
    /I'll leave that as an exercise/i,
    /TODO/i,
    /待補/
  ];

  for (const pattern of bannedPatterns) {
    assert(!pattern.test(doc), `Week eleven document contains banned placeholder pattern: ${pattern}`);
  }
}

async function verifyMatrixArtifact() {
  const matrix = await readJson(matrixFile);
  assert(matrix.week === 11, 'Matrix must identify week 11');
  assert(matrix.acceptanceQuestion.includes('PaaS 可以省下哪些維運'), 'Matrix acceptance question is wrong');

  const requiredSources = [
    'https://docs.n8n.io/hosting/installation/docker/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/',
    'https://docs.railway.com/reference/volumes',
    'https://render.com/docs/deploy-n8n/',
    'https://render.com/docs/disks',
    'https://zeabur.com/docs/en-US/data-management/volumes',
    'https://fly.io/docs/volumes/overview/',
    'https://fly.io/docs/mpg'
  ];

  const sourceValues = Object.values(matrix.officialSources);
  for (const source of requiredSources) {
    assert(sourceValues.includes(source), `Matrix missing source: ${source}`);
  }

  const platformNames = matrix.platforms.map((platform) => platform.name);
  for (const name of ['Railway', 'Zeabur', 'Render', 'Fly.io']) {
    assert(platformNames.includes(name), `Matrix missing platform: ${name}`);
  }

  assert(matrix.platforms.length === 4, 'Matrix must include exactly four platforms');

  for (const platform of matrix.platforms) {
    assert(platform.persistentStorage?.model, `${platform.name} missing persistentStorage.model`);
    assert(platform.persistentStorage?.durabilityWarning, `${platform.name} missing durability warning`);
    assert(platform.postgresModel?.type, `${platform.name} missing postgres model`);
    assert(platform.customDomainTls, `${platform.name} missing custom domain TLS summary`);
    assert(platform.envVars, `${platform.name} missing env vars summary`);
    assert(platform.pricingAlwaysOn, `${platform.name} missing pricing always-on summary`);
    assert(platform.stateSurvivalRisk, `${platform.name} missing state survival risk`);
    assert(platform.n8nRecommendation, `${platform.name} missing n8n recommendation`);
  }

  assert(
    matrix.responsibilitiesStillOwnedByUser.includes('N8N_ENCRYPTION_KEY custody'),
    'Matrix must include N8N_ENCRYPTION_KEY custody as user responsibility'
  );
  assert(
    matrix.acceptanceConclusion.canExplainStartupVersusPersistence === true,
    'Matrix acceptance conclusion must confirm startup versus persistence explanation'
  );
  assert(
    matrix.acceptanceConclusion.summary.includes('does not prove n8n workflows'),
    'Matrix acceptance conclusion must explain startup is not persistence'
  );
}

async function verifyRiskCards() {
  const riskCards = await readJson(riskCardFile);
  assert(riskCards.week === 11, 'Risk card artifact must identify week 11');
  assert(
    riskCards.acceptanceConclusion.includes('服務能啟動不代表 state 能在 redeploy 後存活'),
    'Risk card artifact must include acceptance conclusion'
  );

  const requiredRiskIds = [
    'ephemeral-filesystem',
    'managed-db-without-app-volume',
    'app-volume-without-db-backup',
    'free-or-sleeping-service',
    'single-region-local-volume',
    'redeploy-reset',
    'custom-domain-mismatch',
    'secret-loss-or-rotation',
    'binary-data-location',
    'execution-history-growth'
  ];

  const ids = riskCards.riskCards.map((card) => card.id);
  for (const id of requiredRiskIds) {
    assert(ids.includes(id), `Risk cards missing ${id}`);
  }

  for (const card of riskCards.riskCards) {
    assert(card.severity, `${card.id} missing severity`);
    assert(card.risk, `${card.id} missing risk`);
    assert(card.symptoms?.length >= 3, `${card.id} needs at least three symptoms`);
    assert(card.firstChecks?.length >= 3, `${card.id} needs at least three checks`);
    assert(card.mitigation?.length >= 3, `${card.id} needs at least three mitigations`);
  }
}

async function verifyRecommendations() {
  const csv = await readText(recommendationsFile);
  assert(
    csv.startsWith('scenario,primary_recommendation,secondary_recommendation,avoid,decision_reason,required_acceptance_test'),
    'Recommendations CSV header is wrong'
  );

  const requiredRows = [
    '"beginner_or_non_engineering_team","n8n Cloud","Render Postgres Blueprint"',
    '"solo_creator_public_webhooks","Railway with PostgreSQL and volume","Zeabur template with verified PostgreSQL and volume"',
    '"low_maintenance_paas_candidate","Render Postgres on paid plans","Railway PostgreSQL plus user-folder volume"',
    '"flyio_advanced_operator","Fly.io Machines with Managed Postgres","External managed PostgreSQL plus Fly Volume for local files"',
    '"zeabur_marketplace_speed","Zeabur n8n template after state-model inspection","Railway template after variable and volume inspection"',
    '"railway_usage_based_prototype","Railway app service plus PostgreSQL template plus volume","Render paid service plus Postgres"',
    '"self_host_fallback","Week 10 VPS plus Docker Compose plus Caddy","Small VPS with managed external PostgreSQL"'
  ];

  for (const row of requiredRows) {
    assert(csv.includes(row), `Recommendations CSV missing row: ${row}`);
  }

  assert(csv.includes('redeploy'), 'Recommendations CSV must include redeploy acceptance tests');
  assert(csv.includes('WEBHOOK_URL'), 'Recommendations CSV must include WEBHOOK_URL acceptance tests');
}

async function verifyPackageScripts() {
  const pkg = await readJson('package.json');
  assert(pkg.scripts['verify:week10'] === 'node scripts/verify-week-ten.mjs', 'package.json missing verify:week10 script');
  assert(pkg.scripts['verify:week11'] === 'node scripts/verify-week-eleven.mjs', 'package.json missing verify:week11 script');
}

function verifyLiveLocalStackStillClean() {
  const httpStatus = run('n8n local HTTP readiness after Week 11', 'curl', [
    '-s',
    '-o',
    '/dev/null',
    '-w',
    '%{http_code}',
    'http://localhost:5687'
  ]).stdout;
  assert(httpStatus === '200', `Expected existing local n8n HTTP 200 after Week 11, got ${httpStatus}`);

  const cloudflaredContainers = run('Week eleven cloudflared cleanup check', 'docker', [
    'ps',
    '--filter',
    'name=week8-cloudflared',
    '--format',
    '{{.Names}}'
  ]).stdout;
  assert(cloudflaredContainers === '', 'Week eight quick tunnel container should not be running during Week 11');
}

async function main() {
  await Promise.all(requiredFiles.map(assertFileExists));

  run('Week ten verification', process.execPath, ['scripts/verify-week-ten.mjs'], {
    timeout: 660000
  });

  await verifyPlanScope();
  await verifyDocument();
  await verifyMatrixArtifact();
  await verifyRiskCards();
  await verifyRecommendations();
  await verifyPackageScripts();
  verifyLiveLocalStackStillClean();

  console.log('Week eleven verification passed: PaaS platform matrix, persistent storage risk cards, and platform recommendations explain why startup is not redeploy-safe n8n state persistence.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const platformDir = 'artifacts/week-18-platform-selection';
const recommendationMatrixFile = `${platformDir}/week-18-deployment-recommendation-matrix.json`;
const costRiskWorksheetFile = `${platformDir}/week-18-cost-risk-worksheet.csv`;
const awsVsPaaSMemoFile = `${platformDir}/week-18-aws-vs-paas-decision-memo.md`;

const requiredFiles = [
  '20 周的執行計劃.md',
  'docs/week-18-platform-selection-cost-risk.md',
  recommendationMatrixFile,
  costRiskWorksheetFile,
  awsVsPaaSMemoFile,
  'scripts/verify-week-seventeen.mjs',
  'scripts/verify-week-eighteen.mjs',
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
  const weekEighteen = plan.match(/### Week 18[\s\S]*?### Week 19/);
  assert(weekEighteen, 'Could not find Week 18 scope in plan');

  const requiredPlanText = [
    'Week 18｜平台選型與成本風險評估',
    '不同使用者類型應該選哪條路',
    '成本與維運責任',
    '按 user type 閱讀 final recommendations',
    '比較 AWS 與 simpler cloud options',
    'usage-priced 平台的 RAM/CPU/storage/egress 變動風險',
    'deployment recommendation matrix',
    'cost-risk worksheet',
    'AWS vs PaaS decision memo',
    'beginner、freelancer、agency、production team',
    '首選、替代方案、避免事項'
  ];

  for (const text of requiredPlanText) {
    assert(weekEighteen[0].includes(text), `Week 18 plan missing required text: ${text}`);
  }
}

async function verifyDocument() {
  const doc = await readText('docs/week-18-platform-selection-cost-risk.md');
  assertNoBannedPatterns('Week eighteen document', doc);

  const requiredText = [
    'Week 18｜平台選型與成本風險評估',
    'deployment recommendation matrix',
    'cost-risk worksheet',
    'AWS vs PaaS decision memo',
    'beginner',
    'freelancer',
    'agency',
    'production team',
    '首選',
    '替代方案',
    '避免事項',
    'AWS 與 simpler cloud options',
    'usage-priced RAM/CPU/storage/egress',
    'n8n Cloud',
    'Local Docker Desktop',
    'VPS Docker Compose',
    'PostgreSQL',
    'Railway/Render/Fly',
    'AWS/GCP production architecture',
    'managed PostgreSQL',
    'Redis queue',
    'centralized logs',
    'RPO/RTO',
    'FinOps',
    'RAM',
    'CPU',
    'storage',
    'egress',
    'https://docs.n8n.io/hosting/installation/docker/',
    'https://docs.n8n.io/hosting/scaling/overview/',
    'https://docs.n8n.io/hosting/scaling/queue-mode/',
    'https://docs.n8n.io/hosting/scaling/execution-data/',
    'https://docs.n8n.io/hosting/scaling/binary-data/',
    'https://docs.n8n.io/hosting/scaling/external-storage/',
    'https://docs.n8n.io/hosting/logging-monitoring/logging/',
    'https://docs.n8n.io/hosting/logging-monitoring/monitoring/',
    'https://render.com/pricing',
    'https://render.com/free',
    'https://railway.com/pricing',
    'https://fly.io/pricing/',
    'https://cloud.google.com/run/pricing',
    'https://aws.amazon.com/fargate/pricing/',
    'https://aws.amazon.com/rds/pricing/',
    'https://aws.amazon.com/ec2/pricing/on-demand/#Data_Transfer',
    'https://aws.amazon.com/lightsail/pricing/'
  ];

  for (const text of requiredText) {
    assert(doc.includes(text), `Week eighteen document missing required text: ${text}`);
  }

  const requiredSections = [
    /^## 1\. 本週交付物總覽/m,
    /^## 2\. 官方來源核對/m,
    /^## 3\. 交付物一：deployment recommendation matrix/m,
    /^## 4\. 交付物二：cost-risk worksheet/m,
    /^## 5\. 交付物三：AWS vs PaaS decision memo/m,
    /^## 6\. 驗收：四類 user type 的首選、替代、避免事項/m,
    /^## 7\. Week 18 完成檢查/m,
    /^## 8\. 下一週銜接/m
  ];

  for (const pattern of requiredSections) {
    assert(pattern.test(doc), `Week eighteen document missing section matching ${pattern}`);
  }
}

async function verifyRecommendationMatrix() {
  const matrix = await readJson(recommendationMatrixFile);
  assert(matrix.week === 18, 'Recommendation matrix must identify week 18');
  assert(
    matrix.acceptanceTarget.includes('Beginner') &&
      matrix.acceptanceTarget.includes('freelancer') &&
      matrix.acceptanceTarget.includes('agency') &&
      matrix.acceptanceTarget.includes('production team'),
    'Recommendation matrix acceptance target must include all four user types'
  );

  const sourceValues = Object.values(matrix.officialSources);
  for (const source of [
    'https://docs.n8n.io/hosting/installation/docker/',
    'https://docs.n8n.io/hosting/scaling/overview/',
    'https://docs.n8n.io/hosting/scaling/queue-mode/',
    'https://docs.n8n.io/hosting/scaling/execution-data/',
    'https://docs.n8n.io/hosting/scaling/binary-data/',
    'https://docs.n8n.io/hosting/scaling/external-storage/',
    'https://docs.n8n.io/hosting/logging-monitoring/logging/',
    'https://docs.n8n.io/hosting/logging-monitoring/monitoring/',
    'https://render.com/pricing',
    'https://render.com/free',
    'https://railway.com/pricing',
    'https://fly.io/pricing/',
    'https://cloud.google.com/run/pricing',
    'https://aws.amazon.com/fargate/pricing/',
    'https://aws.amazon.com/rds/pricing/',
    'https://aws.amazon.com/ec2/pricing/on-demand/#Data_Transfer',
    'https://aws.amazon.com/lightsail/pricing/'
  ]) {
    assert(sourceValues.includes(source), `Recommendation matrix missing source: ${source}`);
  }

  assert(matrix.recommendations.length === 4, `Expected four recommendations, found ${matrix.recommendations.length}`);
  const expectedUserTypes = ['beginner', 'freelancer', 'agency', 'production team'];
  const userTypes = matrix.recommendations.map((item) => item.userType);
  assert(JSON.stringify(userTypes) === JSON.stringify(expectedUserTypes), `User type order mismatch: ${userTypes.join(', ')}`);

  for (const item of matrix.recommendations) {
    assert(item.primaryRecommendation, `${item.userType} missing primaryRecommendation`);
    assert(item.alternative, `${item.userType} missing alternative`);
    assert(item.avoid?.length >= 3, `${item.userType} needs at least three avoid items`);
    assert(item.why, `${item.userType} missing why`);
    assert(item.costRisk, `${item.userType} missing costRisk`);
    assert(item.operationalResponsibility?.length >= 3, `${item.userType} needs operational responsibility list`);
    assert(item.first90Days?.length >= 4, `${item.userType} needs first90Days list`);
  }

  const beginner = matrix.recommendations.find((item) => item.userType === 'beginner');
  assert(beginner.primaryRecommendation.includes('n8n Cloud'), 'beginner primary should be n8n Cloud');
  assert(beginner.alternative.includes('Local Docker Desktop'), 'beginner alternative should include Local Docker Desktop');
  assert(beginner.avoid.join(' ').includes('public tunnel'), 'beginner avoid list should mention public tunnel');

  const freelancer = matrix.recommendations.find((item) => item.userType === 'freelancer');
  assert(freelancer.primaryRecommendation.includes('VPS') && freelancer.primaryRecommendation.includes('Docker Compose'), 'freelancer primary should include VPS Docker Compose');
  assert(freelancer.alternative.includes('Railway') && freelancer.alternative.includes('Render') && freelancer.alternative.includes('Fly'), 'freelancer alternative should include Railway/Render/Fly');
  assert(freelancer.avoid.join(' ').includes('AWS ECS/RDS'), 'freelancer avoid list should mention AWS ECS/RDS');

  const agency = matrix.recommendations.find((item) => item.userType === 'agency');
  assert(agency.primaryRecommendation.includes('Standardized client blueprint'), 'agency primary should include standardized client blueprint');
  assert(agency.alternative.includes('n8n Cloud Business') || agency.alternative.includes('Enterprise'), 'agency alternative should include n8n Cloud Business or Enterprise');
  assert(agency.avoid.join(' ').includes('multiple clients'), 'agency avoid list should mention multiple clients on one instance');

  const production = matrix.recommendations.find((item) => item.userType === 'production team');
  assert(production.primaryRecommendation.includes('AWS') || production.primaryRecommendation.includes('GCP'), 'production team primary should include AWS or GCP');
  assert(production.alternative.includes('n8n Cloud Enterprise'), 'production team alternative should include n8n Cloud Enterprise');
  assert(production.avoid.join(' ').includes('single VM'), 'production team avoid list should mention single VM');
}

async function verifyCostRiskWorksheet() {
  const csv = await readText(costRiskWorksheetFile);
  assertNoBannedPatterns('Week eighteen cost-risk worksheet', csv);
  assert(
    csv.startsWith('"category","cost_driver","applies_to","risk_level","how_it_surprises","control","evidence_required"'),
    'Cost-risk worksheet CSV header is wrong'
  );

  const requiredCategories = [
    'app_ram',
    'app_cpu',
    'db_compute',
    'db_storage',
    'backup_storage',
    'object_storage',
    'egress',
    'logs',
    'metrics_alerts',
    'redis_queue',
    'queue_workers',
    'autoscaling',
    'persistent_disk',
    'public_endpoint_lb',
    'support_plan',
    'maintenance_labor',
    'security_compliance',
    'vendor_lock_in',
    'client_isolation',
    'free_tier_limits'
  ];

  for (const category of requiredCategories) {
    assert(csv.includes(`"${category}"`), `Cost-risk worksheet missing category: ${category}`);
  }

  for (const text of [
    'RAM',
    'CPU',
    'storage',
    'egress',
    'Railway',
    'Render',
    'Fly',
    'Cloud Run',
    'AWS Fargate',
    'RDS',
    'budget alerts',
    'execution pruning',
    'binary data',
    'maintenance'
  ]) {
    assert(csv.includes(text), `Cost-risk worksheet missing text: ${text}`);
  }

  const rowCount = csv.trim().split('\n').length - 1;
  assert(rowCount >= 20, `Cost-risk worksheet should include at least 20 rows, found ${rowCount}`);
}

async function verifyAwsVsPaaSMemo() {
  const memo = await readText(awsVsPaaSMemoFile);
  assertNoBannedPatterns('Week eighteen AWS vs PaaS memo', memo);

  const requiredSections = [
    /^# AWS vs PaaS Decision Memo｜Week 18/m,
    /^## Decision/m,
    /^## Recommended Default/m,
    /^## PaaS Advantages/m,
    /^## PaaS Risks/m,
    /^## AWS\/GCP Advantages/m,
    /^## AWS\/GCP Risks/m,
    /^## Decision Gates/m,
    /^## Final Recommendation/m,
    /^## Source Links/m
  ];

  for (const pattern of requiredSections) {
    assert(pattern.test(memo), `AWS vs PaaS memo missing section matching ${pattern}`);
  }

  for (const text of [
    'Use simpler cloud options by default',
    'Choose AWS or GCP only when',
    'n8n Cloud',
    'VPS Docker Compose + PostgreSQL',
    'Standardized isolated client blueprint',
    'AWS/GCP with managed PostgreSQL',
    'Redis queue',
    'centralized logs',
    'IaC',
    'budgets',
    'on-call',
    'Usage-priced RAM/CPU/storage/egress drift',
    'Free tier behavior',
    'VPC and private networking',
    'IAM and audit controls',
    'Autoscaling bill shock',
    'Beginner should use n8n Cloud',
    'Freelancer should use VPS Compose or a small PaaS',
    'Agency should standardize isolated client blueprints',
    'Production team should choose AWS/GCP'
  ]) {
    assert(memo.includes(text), `AWS vs PaaS memo missing text: ${text}`);
  }
}

async function verifyPackageScripts() {
  const pkg = await readJson('package.json');
  assert(pkg.scripts['verify:week17'] === 'node scripts/verify-week-seventeen.mjs', 'package.json missing verify:week17 script');
  assert(pkg.scripts['verify:week18'] === 'node scripts/verify-week-eighteen.mjs', 'package.json missing verify:week18 script');
}

function verifyLiveLocalStackStillClean() {
  const httpStatus = run('n8n local HTTP readiness after Week 18', 'curl', [
    '-s',
    '-o',
    '/dev/null',
    '-w',
    '%{http_code}',
    'http://localhost:5687'
  ]).stdout;
  assert(httpStatus === '200', `Expected existing local n8n HTTP 200 after Week 18, got ${httpStatus}`);

  const cloudflaredContainers = run('Week eighteen cloudflared cleanup check', 'docker', [
    'ps',
    '--filter',
    'name=week8-cloudflared',
    '--format',
    '{{.Names}}'
  ]).stdout;
  assert(cloudflaredContainers === '', 'Week eight quick tunnel container should not be running during Week 18');
}

async function main() {
  await Promise.all(requiredFiles.map(assertFileExists));

  run('Week seventeen verification', process.execPath, ['scripts/verify-week-seventeen.mjs'], {
    timeout: 900000
  });

  await verifyPlanScope();
  await verifyDocument();
  await verifyRecommendationMatrix();
  await verifyCostRiskWorksheet();
  await verifyAwsVsPaaSMemo();
  await verifyPackageScripts();
  verifyLiveLocalStackStillClean();

  console.log('Week eighteen verification passed: deployment recommendation matrix, cost-risk worksheet, and AWS vs PaaS memo cover beginner, freelancer, agency, and production team recommendations.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

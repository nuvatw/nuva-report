#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const cloudDir = 'artifacts/week-09-cloud';
const matrixFile = `${cloudDir}/week-09-cloud-fit-matrix.json`;
const estimatorFile = `${cloudDir}/week-09-execution-volume-estimator.csv`;

const requiredFiles = [
  '20 周的執行計劃.md',
  'docs/week-09-n8n-cloud-low-maintenance.md',
  matrixFile,
  estimatorFile,
  'scripts/verify-week-eight.mjs',
  'scripts/verify-week-nine.mjs',
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
  const stat = await fs.stat(path.join(root, file)).catch(() => null);
  assert(stat?.isFile(), `Missing required file: ${file}`);
}

async function verifyPlanScope() {
  const plan = await readText('20 周的執行計劃.md');
  const weekNine = plan.match(/### Week 09[\s\S]*?### Week 10/);
  assert(weekNine, 'Could not find Week 09 scope in plan');

  const requiredPlanText = [
    'Week 09｜n8n Cloud 與最低維運路線',
    '什麼情況下最好的部署就是不要 self-host',
    '理解 n8n Cloud 的 hosted plan 與 execution billing',
    '估算 schedule/webhook 的月執行量',
    '列出 self-host 才適合的需求：custom nodes、CLI、bash、host-level control',
    'Cloud 適用情境卡',
    'execution volume 估算表',
    'Cloud vs self-host 責任分界',
    '能為 beginner 或非工程團隊提出 n8n Cloud 優先的理由'
  ];

  for (const text of requiredPlanText) {
    assert(weekNine[0].includes(text), `Week 09 plan missing required text: ${text}`);
  }
}

async function verifyDocument() {
  const doc = await readText('docs/week-09-n8n-cloud-low-maintenance.md');

  const requiredText = [
    'Week 09｜n8n Cloud 與最低維運路線',
    '什麼情況下最好的部署就是不要 self-host',
    'Cloud 適用情境卡',
    'execution volume 估算表',
    'Cloud vs self-host 責任分界',
    'beginner 或非工程團隊',
    'custom nodes',
    'CLI',
    'bash',
    'host-level control',
    'Manual workflow testing',
    'Every 5 minute monitor',
    'Payment event webhook',
    'Support chatbot',
    'Starter',
    'Pro',
    'Enterprise',
    '2,500',
    '10,000',
    '8,928',
    '15,500',
    'https://n8n.io/pricing/',
    'https://docs.n8n.io/workflows/executions/',
    'https://docs.n8n.io/manage-cloud/cloud-data-management/',
    'https://docs.n8n.io/manage-cloud/concurrency/',
    'https://docs.n8n.io/hosting/updating/cloud/',
    'https://docs.n8n.io/manage-cloud/download-workflows/',
    'https://docs.n8n.io/user-management/rbac/projects/'
  ];

  for (const text of requiredText) {
    assert(doc.includes(text), `Week nine document missing required text: ${text}`);
  }

  const requiredSections = [
    /^## 1\. 本週交付物總覽/m,
    /^## 2\. 官方來源核對/m,
    /^## 3\. 交付物一：Cloud 適用情境卡/m,
    /^## 4\. 交付物二：execution volume 估算表/m,
    /^## 5\. 交付物三：Cloud vs self-host 責任分界/m,
    /^## 6\. Cloud 方案快照與限制/m,
    /^## 7\. beginner 或非工程團隊為什麼應 Cloud 優先/m,
    /^## 8\. 留在 Cloud vs 需要 self-host 的工作負載/m,
    /^## 9\. Week 09 完成檢查/m,
    /^## 10\. 下一週銜接/m
  ];

  for (const pattern of requiredSections) {
    assert(pattern.test(doc), `Week nine document missing section matching ${pattern}`);
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
    assert(!pattern.test(doc), `Week nine document contains banned placeholder pattern: ${pattern}`);
  }
}

async function verifyMatrixArtifact() {
  const matrix = await readJson(matrixFile);

  assert(matrix.week === 9, 'Week nine matrix must identify week 9');
  assert(matrix.sourceSnapshot.pricingUrl === 'https://n8n.io/pricing/', 'Matrix missing pricing source');
  assert(
    matrix.sourceSnapshot.executionQuotaUrl === 'https://docs.n8n.io/workflows/executions/',
    'Matrix missing execution quota source'
  );

  assert(matrix.cloudPlanSnapshot.starter.monthlyExecutionStartingPoint === 2500, 'Starter execution starting point is wrong');
  assert(matrix.cloudPlanSnapshot.starter.concurrentProductionExecutions === 5, 'Starter concurrency is wrong');
  assert(matrix.cloudPlanSnapshot.starter.sharedProjects === 1, 'Starter shared projects are wrong');
  assert(matrix.cloudPlanSnapshot.pro.monthlyExecutionStartingPoint === 10000, 'Pro execution starting point is wrong');
  assert(matrix.cloudPlanSnapshot.pro.concurrentProductionExecutions === 20, 'Pro concurrency is wrong');
  assert(matrix.cloudPlanSnapshot.pro.sharedProjects === 3, 'Pro shared projects are wrong');
  assert(matrix.cloudPlanSnapshot.enterprise.concurrentProductionExecutions === '200+', 'Enterprise concurrency is wrong');
  assert(matrix.cloudPlanSnapshot.enterprise.sharedProjects === 'unlimited', 'Enterprise shared projects are wrong');

  const decisions = matrix.workloadFitCards.map((card) => card.decision);
  assert(decisions.includes('Cloud first'), 'Matrix must include Cloud first card');
  assert(decisions.includes('Cloud with quota review'), 'Matrix must include Cloud with quota review card');
  assert(decisions.includes('Self-host candidate'), 'Matrix must include self-host candidate card');

  const selfHost = matrix.workloadFitCards.find((card) => card.id === 'self-host-needed');
  assert(selfHost.scenario.includes('custom nodes'), 'Self-host card must mention custom nodes');
  assert(selfHost.scenario.includes('CLI'), 'Self-host card must mention CLI');
  assert(selfHost.scenario.includes('bash'), 'Self-host card must mention bash');
  assert(selfHost.scenario.includes('host-level'), 'Self-host card must mention host-level control');

  assert(
    matrix.acceptanceConclusion.beginnerRecommendation.includes('start with n8n Cloud'),
    'Acceptance conclusion must recommend n8n Cloud for beginner teams'
  );
  assert(
    matrix.acceptanceConclusion.cloudPriorityReasons.some((reason) => reason.includes('Manual executions do not count')),
    'Acceptance conclusion must mention manual executions do not count toward quota'
  );
}

async function verifyEstimatorArtifact() {
  const csv = await readText(estimatorFile);
  const requiredRows = [
    '"Daily CRM cleanup","schedule","1 run/day * 31 days",31,true',
    '"Hourly support digest","schedule","24 runs/day * 31 days",744,true',
    '"Every 5 minute monitor","schedule","12 runs/hour * 24 hours/day * 31 days",8928,true',
    '"Lead intake webhook","webhook","80 events/day * 31 days",2480,true',
    '"Payment event webhook","webhook","500 events/day * 31 days",15500,true',
    '"Support chatbot","chatbot","120 conversations/week * 8 messages/conversation * 4.345 weeks/month",4172,true',
    '"AI document processing","webhook","50 documents/day * 31 days",1550,true',
    '"Manual workflow testing","manual","Manual test executions during development",0,false'
  ];

  assert(
    csv.startsWith('workload,trigger_type,formula,monthly_executions,counts_toward_quota,cloud_fit,watchouts'),
    'Estimator CSV header is wrong'
  );

  for (const row of requiredRows) {
    assert(csv.includes(row), `Estimator CSV missing row: ${row}`);
  }
}

async function verifyPackageScripts() {
  const pkg = await readJson('package.json');
  assert(pkg.scripts['verify:week8'] === 'node scripts/verify-week-eight.mjs', 'package.json missing verify:week8 script');
  assert(pkg.scripts['verify:week9'] === 'node scripts/verify-week-nine.mjs', 'package.json missing verify:week9 script');
}

function verifyLiveLocalStackStillClean() {
  const httpStatus = run('n8n local HTTP readiness after Week 09', 'curl', [
    '-s',
    '-o',
    '/dev/null',
    '-w',
    '%{http_code}',
    'http://localhost:5687'
  ]).stdout;
  assert(httpStatus === '200', `Expected n8n local HTTP 200 after Week 09, got ${httpStatus}`);

  const cloudflaredContainers = run('Week nine cloudflared cleanup check', 'docker', [
    'ps',
    '--filter',
    'name=week8-cloudflared',
    '--format',
    '{{.Names}}'
  ]).stdout;
  assert(cloudflaredContainers === '', 'Week eight quick tunnel container should not be running during Week 09');
}

async function main() {
  await Promise.all(requiredFiles.map(assertFileExists));

  run('Week eight verification', process.execPath, ['scripts/verify-week-eight.mjs'], {
    timeout: 480000
  });

  await verifyPlanScope();
  await verifyDocument();
  await verifyMatrixArtifact();
  await verifyEstimatorArtifact();
  await verifyPackageScripts();
  verifyLiveLocalStackStillClean();

  console.log('Week nine verification passed: n8n Cloud fit, execution volume estimation, and Cloud vs self-host boundaries are complete.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

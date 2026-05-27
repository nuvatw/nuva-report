#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const finalDir = 'artifacts/week-20-final';
const finalReportFile = `${finalDir}/final-recommendation-report.md`;
const maintenanceCadenceFile = `${finalDir}/week-20-90-day-maintenance-cadence.csv`;
const adoptionCandidatesFile = `${finalDir}/week-20-adoption-candidates-and-owners.csv`;
const showcaseAgendaFile = `${finalDir}/week-20-three-hour-showcase-agenda.json`;
const finalScorecardFile = `${finalDir}/week-20-final-scorecard.json`;

const requiredFiles = [
  '20 周的執行計劃.md',
  'docs/week-20-final-acceptance-next-stage.md',
  finalReportFile,
  maintenanceCadenceFile,
  adoptionCandidatesFile,
  showcaseAgendaFile,
  finalScorecardFile,
  'artifacts/week-19-capstone/deployment-package/README.md',
  'artifacts/week-19-capstone/deployment-package/compose.yaml',
  'artifacts/week-19-capstone/deployment-package/final-demo-checklist.csv',
  'scripts/verify-week-nineteen.mjs',
  'scripts/verify-week-twenty.mjs',
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
  const weekTwenty = plan.match(/### Week 20[\s\S]*?## 04/);
  assert(weekTwenty, 'Could not find Week 20 scope in plan');

  const requiredPlanText = [
    'Week 20｜期末驗收與下一階段導入排序',
    '最後如何把部署能力轉成下一階段導入判斷',
    '3 小時成果交流',
    '展示部署選型、架構、runbook、風險、成本',
    '排出 90 天後續維運與導入優先順序',
    '最終建議報告',
    '90 天維運節奏',
    '導入候選清單與 owner',
    '為什麼選這條路',
    '風險在哪',
    '如何備份',
    '如何更新',
    '何時擴展'
  ];

  for (const text of requiredPlanText) {
    assert(weekTwenty[0].includes(text), `Week 20 plan missing required text: ${text}`);
  }
}

async function verifyDocument() {
  const doc = await readText('docs/week-20-final-acceptance-next-stage.md');
  assertNoBannedPatterns('Week twenty document', doc);

  const requiredText = [
    'Week 20｜期末驗收與下一階段導入排序',
    '最終建議報告',
    '90 天維運節奏',
    '導入候選清單與 owner',
    '3 小時成果交流 agenda',
    'Gate 05 final scorecard',
    '為什麼選這條路',
    '風險在哪',
    '如何備份',
    '如何更新',
    '何時擴展',
    'VPS Docker Compose + PostgreSQL + Caddy',
    'n8n Cloud',
    'PaaS',
    'AWS/GCP',
    'N8N_ENCRYPTION_KEY',
    'WEBHOOK_URL',
    'N8N_PROXY_HOPS',
    '/healthz/readiness',
    'queue mode',
    '90-day maintenance',
    'https://n8n.io/pricing/',
    'https://docs.n8n.io/hosting/installation/docker/',
    'https://docs.n8n.io/hosting/installation/server-setups/docker-compose/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/',
    'https://docs.n8n.io/hosting/installation/updating/',
    'https://docs.n8n.io/hosting/securing/security-audit/',
    'https://docs.n8n.io/hosting/logging-monitoring/logging/',
    'https://docs.n8n.io/hosting/logging-monitoring/monitoring/',
    'https://docs.n8n.io/hosting/scaling/overview/',
    'https://docs.n8n.io/hosting/scaling/queue-mode/',
    'https://docs.n8n.io/hosting/scaling/concurrency-control/',
    'https://docs.n8n.io/hosting/scaling/execution-data/',
    'https://docs.n8n.io/hosting/scaling/binary-data/'
  ];

  for (const text of requiredText) {
    assert(doc.includes(text), `Week twenty document missing required text: ${text}`);
  }

  const requiredSections = [
    /^## 1\. 本週交付物總覽/m,
    /^## 2\. 官方來源核對與 3 小時成果交流/m,
    /^## 3\. 交付物一：最終建議報告摘要/m,
    /^## 4\. 交付物二：90 天維運節奏/m,
    /^## 5\. 交付物三：導入候選清單與 owner/m,
    /^## 6\. Gate 05 final scorecard/m,
    /^## 7\. Week 20 完成檢查/m,
    /^## 8\. 20 週結論/m
  ];

  for (const pattern of requiredSections) {
    assert(pattern.test(doc), `Week twenty document missing section matching ${pattern}`);
  }
}

async function verifyFinalReport() {
  const report = await readText(finalReportFile);
  assertNoBannedPatterns('Week twenty final recommendation report', report);

  const requiredSections = [
    /^# Final Recommendation Report｜Week 20/m,
    /^## Executive Recommendation/m,
    /^## Primary Path/m,
    /^## Why This Path/m,
    /^## Key Risks/m,
    /^## Backup Answer/m,
    /^## Update Answer/m,
    /^## Scaling Answer/m,
    /^## Final Decision Table/m,
    /^## Source Links/m
  ];

  for (const pattern of requiredSections) {
    assert(pattern.test(report), `Final recommendation report missing section matching ${pattern}`);
  }

  for (const text of [
    'VPS Docker Compose + PostgreSQL + Caddy',
    'n8n Cloud',
    'PaaS',
    'AWS/GCP',
    'wrong webhook URL',
    'lost credentials',
    'database connection failed',
    'secure cookie error',
    'N8N_ENCRYPTION_KEY',
    'PostgreSQL',
    'n8n_data',
    'Caddy',
    '/healthz/readiness',
    'release notes',
    'queue mode',
    'Redis queue workers',
    'https://n8n.io/pricing/',
    'https://docs.n8n.io/hosting/scaling/queue-mode/'
  ]) {
    assert(report.includes(text), `Final recommendation report missing text: ${text}`);
  }
}

async function verifyMaintenanceCadence() {
  const csv = await readText(maintenanceCadenceFile);
  assertNoBannedPatterns('Week twenty 90-day cadence', csv);
  assert(
    csv.startsWith('"phase","days","cadence","owner","activity","evidence","acceptance_gate"'),
    '90-day maintenance cadence CSV header is wrong'
  );

  const requiredPhases = ['stabilize', 'operate', 'measure', 'decide'];
  for (const phase of requiredPhases) {
    assert(csv.includes(`"${phase}"`), `90-day maintenance cadence missing phase: ${phase}`);
  }

  for (const text of [
    'deployment_owner',
    'operations_owner',
    'security_owner',
    'finance_owner',
    'platform_owner',
    'backup and restore drill',
    'security audit',
    'N8N_ENCRYPTION_KEY',
    '/healthz/readiness',
    'queue mode gate',
    'AWS/GCP',
    'Next-stage decision has owner, budget, and deadline'
  ]) {
    assert(csv.includes(text), `90-day maintenance cadence missing text: ${text}`);
  }

  const rowCount = csv.trim().split('\n').length - 1;
  assert(rowCount === 18, `Expected 18 cadence rows, found ${rowCount}`);
}

async function verifyAdoptionCandidates() {
  const csv = await readText(adoptionCandidatesFile);
  assertNoBannedPatterns('Week twenty adoption candidates', csv);
  assert(
    csv.startsWith('"priority","candidate","owner","why_now","entry_condition","first_action","success_metric","avoid_until"'),
    'Adoption candidates CSV header is wrong'
  );

  for (const text of [
    'Adopt Week 19 VPS package as self-hosted baseline',
    'Monthly backup restore drill',
    'Security audit cadence',
    'Execution data retention and DB pruning',
    'Centralized logs and incident notes',
    'Cost-risk budget alerts',
    'n8n Cloud fit check',
    'Queue mode evaluation',
    'AWS/GCP production architecture evaluation',
    'deployment_owner',
    'operations_owner',
    'security_owner',
    'data_owner',
    'finance_owner',
    'product_owner',
    'platform_owner',
    'business-critical workflows',
    'restore drill',
    'FinOps'
  ]) {
    assert(csv.includes(text), `Adoption candidates missing text: ${text}`);
  }

  const rowCount = csv.trim().split('\n').length - 1;
  assert(rowCount === 9, `Expected 9 adoption candidates, found ${rowCount}`);
}

async function verifyShowcaseAgenda() {
  const agenda = await readJson(showcaseAgendaFile);
  assert(agenda.week === 20, 'Showcase agenda must identify week 20');
  assert(agenda.durationMinutes === 180, 'Showcase agenda must be 180 minutes');
  assert(agenda.agenda.length === 6, `Expected six agenda sections, found ${agenda.agenda.length}`);

  for (const section of [
    'Executive summary',
    'Deployment package demo',
    'Runbook drill',
    'Risk and cost review',
    'Scaling gate',
    'Next-stage owner review'
  ]) {
    assert(agenda.agenda.some((item) => item.section === section), `Showcase agenda missing section: ${section}`);
  }

  const joined = JSON.stringify(agenda);
  for (const text of [
    'deployment selection',
    'architecture',
    'runbooks',
    'risk',
    'cost',
    'next-stage priorities',
    'final-recommendation-report.md',
    'deployment-package/README.md',
    'week-20-90-day-maintenance-cadence.csv',
    'week-20-adoption-candidates-and-owners.csv'
  ]) {
    assert(joined.includes(text), `Showcase agenda missing text: ${text}`);
  }
}

async function verifyFinalScorecard() {
  const scorecard = await readJson(finalScorecardFile);
  assert(scorecard.week === 20, 'Final scorecard must identify week 20');
  assert(scorecard.overallStatus === 'pass', 'Final scorecard must pass');
  assert(scorecard.mustAnswer.length === 5, `Expected five must-answer items, found ${scorecard.mustAnswer.length}`);

  for (const question of [
    'Why choose this route?',
    'Where are the risks?',
    'How do we back up?',
    'How do we update?',
    'When do we scale?'
  ]) {
    const item = scorecard.mustAnswer.find((entry) => entry.question === question);
    assert(item, `Final scorecard missing question: ${question}`);
    assert(item.answer, `${question} missing answer`);
    assert(item.evidence?.length >= 2, `${question} needs evidence`);
    assert(item.status === 'pass', `${question} status must pass`);
  }

  for (const file of [
    'artifacts/week-20-final/final-recommendation-report.md',
    'artifacts/week-20-final/week-20-90-day-maintenance-cadence.csv',
    'artifacts/week-20-final/week-20-adoption-candidates-and-owners.csv',
    'artifacts/week-20-final/week-20-three-hour-showcase-agenda.json'
  ]) {
    assert(scorecard.finalArtifacts.includes(file), `Final scorecard missing artifact: ${file}`);
  }

  const joined = JSON.stringify(scorecard);
  for (const text of [
    'VPS Docker Compose + PostgreSQL + Caddy',
    'n8n Cloud',
    'queue mode',
    'AWS/GCP',
    'N8N_ENCRYPTION_KEY',
    'readiness',
    'RPO/RTO',
    'FinOps'
  ]) {
    assert(joined.includes(text), `Final scorecard missing text: ${text}`);
  }
}

async function verifyPackageScripts() {
  const pkg = await readJson('package.json');
  assert(pkg.scripts.verify === 'node scripts/verify-week-twenty.mjs', 'package.json verify should point to week twenty');
  assert(pkg.scripts['release:check'] === 'node scripts/verify-week-twenty.mjs', 'package.json release:check should point to week twenty');
  assert(pkg.scripts['verify:week19'] === 'node scripts/verify-week-nineteen.mjs', 'package.json missing verify:week19 script');
  assert(pkg.scripts['verify:week20'] === 'node scripts/verify-week-twenty.mjs', 'package.json missing verify:week20 script');
}

function verifyLiveLocalStackStillClean() {
  const httpStatus = run('n8n local HTTP readiness after Week 20', 'curl', [
    '-s',
    '-o',
    '/dev/null',
    '-w',
    '%{http_code}',
    'http://localhost:5687'
  ]).stdout;
  assert(httpStatus === '200', `Expected existing local n8n HTTP 200 after Week 20, got ${httpStatus}`);

  const cloudflaredContainers = run('Week twenty cloudflared cleanup check', 'docker', [
    'ps',
    '--filter',
    'name=week8-cloudflared',
    '--format',
    '{{.Names}}'
  ]).stdout;
  assert(cloudflaredContainers === '', 'Week eight quick tunnel container should not be running during Week 20');
}

async function main() {
  await Promise.all(requiredFiles.map(assertFileExists));

  run('Week nineteen verification', process.execPath, ['scripts/verify-week-nineteen.mjs'], {
    timeout: 900000
  });

  await verifyPlanScope();
  await verifyDocument();
  await verifyFinalReport();
  await verifyMaintenanceCadence();
  await verifyAdoptionCandidates();
  await verifyShowcaseAgenda();
  await verifyFinalScorecard();
  await verifyPackageScripts();
  verifyLiveLocalStackStillClean();

  console.log('Week twenty verification passed: final recommendation report, 90-day maintenance cadence, adoption owners, showcase agenda, and Gate 05 scorecard answer why this route, where the risks are, how to back up, how to update, and when to scale.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const hyperscalerDir = 'artifacts/week-12-hyperscaler';
const cloudRunFile = `${hyperscalerDir}/week-12-cloud-run-durable-architecture.json`;
const awsEvolutionFile = `${hyperscalerDir}/week-12-aws-three-stage-evolution.json`;
const checklistFile = `${hyperscalerDir}/week-12-hyperscaler-adoption-checklist.csv`;

const requiredFiles = [
  '20 周的執行計劃.md',
  'docs/week-12-cloud-run-aws-hyperscaler.md',
  cloudRunFile,
  awsEvolutionFile,
  checklistFile,
  'scripts/verify-week-eleven.mjs',
  'scripts/verify-week-twelve.mjs',
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
  const weekTwelve = plan.match(/### Week 12[\s\S]*?### Week 13/);
  assert(weekTwelve, 'Could not find Week 12 scope in plan');

  const requiredPlanText = [
    'Week 12｜Cloud Run Durable 與 AWS 路線',
    '何時值得使用 hyperscaler，而不是普通 VPS 或 PaaS',
    'Cloud Run easy mode vs durable mode',
    'Cloud SQL、Secret Manager、service account',
    'AWS Lightsail/EC2/ECS/RDS/Secrets Manager/ALB/CloudWatch 階梯',
    'Cloud Run durable 架構圖',
    'AWS 三階段演進圖',
    'hyperscaler adoption checklist',
    'AWS 的強大來自 building blocks',
    '組裝與維運成本'
  ];

  for (const text of requiredPlanText) {
    assert(weekTwelve[0].includes(text), `Week 12 plan missing required text: ${text}`);
  }
}

async function verifyDocument() {
  const doc = await readText('docs/week-12-cloud-run-aws-hyperscaler.md');

  const requiredText = [
    'Week 12｜Cloud Run Durable 與 AWS 路線',
    'Cloud Run durable 架構圖',
    'AWS 三階段演進圖',
    'hyperscaler adoption checklist',
    'Cloud Run easy mode vs durable mode',
    'Cloud SQL、Secret Manager、service account',
    'AWS Lightsail/EC2/ECS/RDS/Secrets Manager/ALB/CloudWatch 階梯',
    'Cloud Run',
    'Cloud SQL PostgreSQL',
    'Secret Manager',
    'service account',
    'roles/cloudsql.client',
    'roles/secretmanager.secretAccessor',
    'N8N_ENDPOINT_HEALTH',
    'WEBHOOK_URL',
    'N8N_EDITOR_BASE_URL',
    'N8N_ENCRYPTION_KEY',
    'DB_TYPE',
    'postgresdb',
    'Lightsail',
    'EC2',
    'ECS',
    'Fargate',
    'RDS',
    'Secrets Manager',
    'ALB',
    'CloudWatch',
    'AWS 的強大來自 building blocks',
    '組裝與維運成本',
    'https://docs.n8n.io/hosting/installation/server-setups/google-cloud-run/',
    'https://docs.cloud.google.com/sql/docs/postgres/connect-run',
    'https://docs.cloud.google.com/run/docs/configuring/services/secrets',
    'https://docs.cloud.google.com/run/docs/configuring/services/service-identity',
    'https://docs.cloud.google.com/run/docs/configuring/services/environment-variables',
    'https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-container-services.html',
    'https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-enabling-container-services-custom-domains.html',
    'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html',
    'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-tasks-services.html',
    'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ManagingAutomatedBackups.html',
    'https://docs.aws.amazon.com/secretsmanager/',
    'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html',
    'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_awslogs.html',
    'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html'
  ];

  for (const text of requiredText) {
    assert(doc.includes(text), `Week twelve document missing required text: ${text}`);
  }

  const requiredSections = [
    /^## 1\. 本週交付物總覽/m,
    /^## 2\. 官方來源核對/m,
    /^## 3\. 交付物一：Cloud Run durable 架構圖/m,
    /^## 4\. 交付物二：AWS 三階段演進圖/m,
    /^## 5\. 交付物三：hyperscaler adoption checklist/m,
    /^## 6\. Cloud Run 與 AWS 路線比較/m,
    /^## 7\. 成本與維運摘要/m,
    /^## 8\. 驗收說明：AWS 的強大與代價/m,
    /^## 9\. Week 12 完成檢查/m,
    /^## 10\. 下一週銜接/m
  ];

  for (const pattern of requiredSections) {
    assert(pattern.test(doc), `Week twelve document missing section matching ${pattern}`);
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
    assert(!pattern.test(doc), `Week twelve document contains banned placeholder pattern: ${pattern}`);
  }
}

async function verifyCloudRunArtifact() {
  const architecture = await readJson(cloudRunFile);
  assert(architecture.week === 12, 'Cloud Run artifact must identify week 12');
  assert(architecture.title.includes('Cloud Run durable'), 'Cloud Run artifact title is wrong');

  const sourceValues = Object.values(architecture.officialSources);
  for (const source of [
    'https://docs.n8n.io/hosting/installation/server-setups/google-cloud-run/',
    'https://docs.cloud.google.com/sql/docs/postgres/connect-run',
    'https://docs.cloud.google.com/run/docs/configuring/services/secrets',
    'https://docs.cloud.google.com/run/docs/configuring/services/service-identity'
  ]) {
    assert(sourceValues.includes(source), `Cloud Run artifact missing source: ${source}`);
  }

  assert(architecture.mermaid.includes('Cloud Run service: n8n'), 'Cloud Run mermaid missing n8n service');
  assert(architecture.mermaid.includes('Cloud SQL PostgreSQL'), 'Cloud Run mermaid missing Cloud SQL');
  assert(architecture.mermaid.includes('Secret Manager'), 'Cloud Run mermaid missing Secret Manager');
  assert(architecture.mermaid.includes('service account'), 'Cloud Run mermaid missing service account');
  assert(architecture.modes.easyMode.stateModel.includes('Not suitable'), 'Easy mode risk must be explicit');
  assert(architecture.modes.durableMode.stateModel.includes('Cloud SQL PostgreSQL'), 'Durable mode must use Cloud SQL PostgreSQL');

  const componentIds = architecture.components.map((component) => component.id);
  for (const id of ['cloud-run-service', 'cloud-sql-postgres', 'secret-manager', 'service-account', 'observability']) {
    assert(componentIds.includes(id), `Cloud Run artifact missing component: ${id}`);
  }

  for (const value of [
    'DB_TYPE=postgresdb',
    'N8N_ENCRYPTION_KEY=<Secret Manager reference>',
    'WEBHOOK_URL=https://n8n.example.com/',
    'N8N_ENDPOINT_HEALTH=health'
  ]) {
    assert(architecture.envVarBaseline.includes(value), `Cloud Run env baseline missing ${value}`);
  }

  assert(
    architecture.acceptanceChecks.some((check) => check.includes('Redeploy test confirms workflows')),
    'Cloud Run artifact must include redeploy persistence check'
  );
}

async function verifyAwsEvolutionArtifact() {
  const evolution = await readJson(awsEvolutionFile);
  assert(evolution.week === 12, 'AWS evolution artifact must identify week 12');
  assert(evolution.title.includes('AWS three-stage'), 'AWS evolution title is wrong');

  const sourceValues = Object.values(evolution.officialSources);
  for (const source of [
    'https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-container-services.html',
    'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-tasks-services.html',
    'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ManagingAutomatedBackups.html',
    'https://docs.aws.amazon.com/secretsmanager/',
    'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html',
    'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html'
  ]) {
    assert(sourceValues.includes(source), `AWS evolution artifact missing source: ${source}`);
  }

  assert(evolution.stages.length === 3, 'AWS evolution must contain exactly three stages');
  const ids = evolution.stages.map((stage) => stage.id);
  for (const id of [
    'stage-1-lightsail-or-ec2',
    'stage-2-ec2-rds-secrets-alb-cloudwatch',
    'stage-3-ecs-fargate-rds-alb-cloudwatch'
  ]) {
    assert(ids.includes(id), `AWS evolution missing stage: ${id}`);
  }

  const allBlocks = evolution.stages.flatMap((stage) => stage.buildingBlocks);
  for (const block of ['Lightsail container service or EC2 instance', 'RDS PostgreSQL', 'Secrets Manager', 'Application Load Balancer', 'CloudWatch Logs awslogs driver']) {
    assert(allBlocks.includes(block), `AWS evolution missing building block: ${block}`);
  }

  assert(
    evolution.acceptanceConclusion.awsPowerSource.includes('building blocks'),
    'AWS acceptance must explain building blocks'
  );
  assert(
    evolution.acceptanceConclusion.costOfPower.includes('IAM permissions'),
    'AWS acceptance must explain assembly and operations cost'
  );
  assert(
    evolution.acceptanceConclusion.canExplainBuildingBlocksAndOpsCost === true,
    'AWS acceptance flag must be true'
  );
}

async function verifyChecklist() {
  const csv = await readText(checklistFile);
  assert(
    csv.startsWith('category,question,pass_signal,fail_signal,recommended_action,related_building_blocks'),
    'Hyperscaler checklist CSV header is wrong'
  );

  const requiredRows = [
    '"durable_state","Do workflows credentials and executions need managed PostgreSQL with tested restore?"',
    '"secrets","Do N8N_ENCRYPTION_KEY DB password and OAuth secrets need managed storage or rotation?"',
    '"runtime_identity","Can the team explain deployer identity runtime service account and task role?"',
    '"ingress_tls","Do you need managed ingress health checks TLS termination and target routing?"',
    '"observability","Will someone maintain logs metrics dashboards and alerts?"',
    '"scaling","Is autoscaling or worker separation based on measured execution volume?"',
    '"cost_guardrails","Can compute database load balancer logs secrets egress and backup costs be estimated?"',
    '"operations","Are patch upgrade rollback backup restore and incident runbooks ready?"',
    '"compliance","Are audit private networking IAM boundaries or data residency requirements explicit?"',
    '"team_skill","Can at least two people debug VPC security groups IAM target groups DB connections and logs?"',
    '"release_management","Do you need immutable revisions rolling deployment and rollback history?"',
    '"database_connections","Can the team manage DB connection limits under serverless/container scaling?"',
    '"backup_restore","Has restore been tested from an actual backup or snapshot?"',
    '"webhook_reliability","Do public webhooks require stable always-on behavior and fast response?"',
    '"exit_criteria","Can you name what would make you leave hyperscaler and return to simpler hosting?"'
  ];

  for (const row of requiredRows) {
    assert(csv.includes(row), `Hyperscaler checklist missing row: ${row}`);
  }

  for (const term of ['Cloud SQL', 'RDS', 'Secret Manager', 'AWS Secrets Manager', 'ALB', 'CloudWatch', 'ECS', 'Cloud Run']) {
    assert(csv.includes(term), `Hyperscaler checklist missing term: ${term}`);
  }
}

async function verifyPackageScripts() {
  const pkg = await readJson('package.json');
  assert(pkg.scripts['verify:week11'] === 'node scripts/verify-week-eleven.mjs', 'package.json missing verify:week11 script');
  assert(pkg.scripts['verify:week12'] === 'node scripts/verify-week-twelve.mjs', 'package.json missing verify:week12 script');
}

function verifyLiveLocalStackStillClean() {
  const httpStatus = run('n8n local HTTP readiness after Week 12', 'curl', [
    '-s',
    '-o',
    '/dev/null',
    '-w',
    '%{http_code}',
    'http://localhost:5687'
  ]).stdout;
  assert(httpStatus === '200', `Expected existing local n8n HTTP 200 after Week 12, got ${httpStatus}`);

  const cloudflaredContainers = run('Week twelve cloudflared cleanup check', 'docker', [
    'ps',
    '--filter',
    'name=week8-cloudflared',
    '--format',
    '{{.Names}}'
  ]).stdout;
  assert(cloudflaredContainers === '', 'Week eight quick tunnel container should not be running during Week 12');
}

async function main() {
  await Promise.all(requiredFiles.map(assertFileExists));

  run('Week eleven verification', process.execPath, ['scripts/verify-week-eleven.mjs'], {
    timeout: 780000
  });

  await verifyPlanScope();
  await verifyDocument();
  await verifyCloudRunArtifact();
  await verifyAwsEvolutionArtifact();
  await verifyChecklist();
  await verifyPackageScripts();
  verifyLiveLocalStackStillClean();

  console.log('Week twelve verification passed: Cloud Run durable architecture, AWS three-stage evolution, and hyperscaler adoption checklist explain building-block power and assembly/operations cost.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

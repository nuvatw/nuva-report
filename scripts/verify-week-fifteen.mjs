#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const securityDir = 'artifacts/week-15-security';
const responsibilityMatrixFile = `${securityDir}/week-15-security-responsibility-matrix.json`;
const hardeningChecklistFile = `${securityDir}/week-15-public-exposure-hardening-checklist.csv`;
const patchCadenceFile = `${securityDir}/week-15-patch-cadence-policy.json`;

const requiredFiles = [
  '20 周的執行計劃.md',
  'docs/week-15-security-responsibility-patch-cadence.md',
  responsibilityMatrixFile,
  hardeningChecklistFile,
  patchCadenceFile,
  'scripts/verify-week-fourteen.mjs',
  'scripts/verify-week-fifteen.mjs',
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
  const weekFifteen = plan.match(/### Week 15[\s\S]*?### Week 16/);
  assert(weekFifteen, 'Could not find Week 15 scope in plan');

  const requiredPlanText = [
    'Week 15｜安全責任、使用者管理與 patch cadence',
    '公開 self-hosted n8n 時，哪些責任會回到自己身上',
    'Cloud/local/tunnel/VPS/PaaS/hyperscaler 責任分界',
    'HTTPS-only、secure cookies、SMTP/user management、2FA、SSO、secrets',
    '2026 之後 public instance 的 aggressively update 原則',
    'security responsibility matrix',
    'public exposure hardening checklist',
    'patch cadence policy',
    '公開 instance 不更新就是安全邊界破洞，升級不是只有新功能'
  ];

  for (const text of requiredPlanText) {
    assert(weekFifteen[0].includes(text), `Week 15 plan missing required text: ${text}`);
  }
}

async function verifyDocument() {
  const doc = await readText('docs/week-15-security-responsibility-patch-cadence.md');

  const requiredText = [
    'Week 15｜安全責任、使用者管理與 patch cadence',
    'security responsibility matrix',
    'public exposure hardening checklist',
    'patch cadence policy',
    'Cloud/local/tunnel/VPS/PaaS/hyperscaler 責任分界',
    'HTTPS-only',
    'secure cookies',
    'SMTP/user management',
    '2FA',
    'SSO',
    'secrets',
    '2026 之後 public instance 的 aggressively update 原則',
    '公開 instance 不更新就是安全邊界破洞，升級不是只有新功能',
    'n8n Cloud',
    'local only',
    'local tunnel',
    'VPS + Docker Compose + Caddy',
    'PaaS',
    'hyperscaler',
    'N8N_SECURE_COOKIE',
    'N8N_SAMESITE_COOKIE',
    'N8N_EMAIL_MODE',
    'N8N_SMTP_HOST',
    'N8N_INVITE_LINKS_EMAIL_ONLY',
    'N8N_MFA_ENABLED',
    'N8N_MFA_ENFORCED_ENABLED',
    'N8N_ENCRYPTION_KEY',
    'N8N_BLOCK_ENV_ACCESS_IN_NODE',
    'N8N_BLOCK_FILE_ACCESS_TO_N8N_FILES',
    'N8N_SSRF_PROTECTION_ENABLED',
    'N8N_PUBLIC_API_DISABLED',
    'N8N_PUBLIC_API_SWAGGERUI_DISABLED',
    'NODES_EXCLUDE',
    'N8N_COMMUNITY_PACKAGES_ENABLED',
    'n8n audit',
    '24 到 48 小時',
    '7 天內',
    '30 天內',
    'https://docs.n8n.io/choose-n8n/',
    'https://docs.n8n.io/choose-n8n/cloud/',
    'https://docs.n8n.io/manage-cloud/update-cloud-version/',
    'https://docs.n8n.io/hosting/installation/docker/',
    'https://docs.n8n.io/hosting/installation/updating/',
    'https://docs.n8n.io/release-notes/',
    'https://docs.n8n.io/hosting/securing/overview/',
    'https://docs.n8n.io/hosting/securing/security-audit/',
    'https://docs.n8n.io/hosting/securing/disable-public-api/',
    'https://docs.n8n.io/user-management/',
    'https://docs.n8n.io/hosting/configuration/user-management-self-hosted/',
    'https://docs.n8n.io/user-management/manage-users/',
    'https://docs.n8n.io/user-management/account-types/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/user-management-smtp-2fa/',
    'https://docs.n8n.io/hosting/securing/set-up-sso/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/security/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/ssrf-protection/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/nodes/',
    'https://docs.n8n.io/integrations/community-nodes/risks/',
    'https://docs.n8n.io/external-secrets/'
  ];

  for (const text of requiredText) {
    assert(doc.includes(text), `Week fifteen document missing required text: ${text}`);
  }

  const requiredSections = [
    /^## 1\. 本週交付物總覽/m,
    /^## 2\. 官方來源核對/m,
    /^## 3\. 交付物一：security responsibility matrix/m,
    /^## 4\. 交付物二：public exposure hardening checklist/m,
    /^## 5\. 交付物三：patch cadence policy/m,
    /^## 6\. Cloud\/local\/tunnel\/VPS\/PaaS\/hyperscaler 責任分界/m,
    /^## 7\. 公開 instance hardening runbook/m,
    /^## 8\. 2026 之後 aggressively update 實務節奏/m,
    /^## 9\. Week 15 完成檢查/m,
    /^## 10\. 下一週銜接/m
  ];

  for (const pattern of requiredSections) {
    assert(pattern.test(doc), `Week fifteen document missing section matching ${pattern}`);
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
    assert(!pattern.test(doc), `Week fifteen document contains banned placeholder pattern: ${pattern}`);
  }
}

async function verifyResponsibilityMatrix() {
  const matrix = await readJson(responsibilityMatrixFile);
  assert(matrix.week === 15, 'Security responsibility matrix must identify week 15');
  assert(
    matrix.acceptanceConclusion === '公開 instance 不更新就是安全邊界破洞，升級不是只有新功能。',
    'Security responsibility matrix acceptance conclusion is wrong'
  );

  const sourceValues = Object.values(matrix.officialSources);
  for (const source of [
    'https://docs.n8n.io/choose-n8n/',
    'https://docs.n8n.io/choose-n8n/cloud/',
    'https://docs.n8n.io/manage-cloud/update-cloud-version/',
    'https://docs.n8n.io/hosting/installation/docker/',
    'https://docs.n8n.io/hosting/installation/updating/',
    'https://docs.n8n.io/hosting/securing/overview/',
    'https://docs.n8n.io/user-management/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/security/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/ssrf-protection/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/nodes/',
    'https://docs.n8n.io/external-secrets/'
  ]) {
    assert(sourceValues.includes(source), `Security responsibility matrix missing source: ${source}`);
  }

  const modelIds = matrix.hostingModels.map((model) => model.id);
  for (const id of ['cloud', 'local', 'tunnel', 'vps', 'paas', 'hyperscaler']) {
    assert(modelIds.includes(id), `Security responsibility matrix missing hosting model: ${id}`);
  }
  assert(matrix.hostingModels.length === 6, 'Security responsibility matrix must include exactly six hosting models');

  for (const model of matrix.hostingModels) {
    assert(model.platformOwned?.length >= 2 || model.id === 'tunnel', `${model.id} needs platform-owned responsibilities`);
    assert(model.userOwned?.length >= 5, `${model.id} needs user-owned responsibilities`);
    assert(model.hardeningFocus?.length >= 3, `${model.id} needs hardening focus items`);
    assert(model.misconceptionToAvoid, `${model.id} needs misconceptionToAvoid`);
  }

  for (const category of [
    'HTTPS-only',
    'secure cookies',
    'SMTP/user management',
    '2FA',
    'SSO',
    'secrets',
    'SSRF protection',
    'patch cadence'
  ]) {
    assert(matrix.responsibilityCategories.includes(category), `Security responsibility matrix missing category: ${category}`);
  }
}

async function verifyHardeningChecklist() {
  const csv = await readText(hardeningChecklistFile);
  assert(
    csv.startsWith('"category","control","required_setting_or_evidence","pass_signal","fail_signal","source"'),
    'Public exposure hardening checklist CSV header is wrong'
  );

  const requiredControls = [
    'HTTPS-only editor and webhook URLs',
    'Reverse proxy hop correctness',
    'Secure cookies',
    'SameSite cookies',
    'Owner daily-use separation',
    'User lifecycle',
    'SMTP for invites and password resets',
    'Invite link exposure',
    '2FA availability',
    '2FA enforcement where supported',
    'SSO for organizations with IdP',
    'Encryption key custody',
    'External secret store',
    'Block env access in workflow code',
    'Restrict file access',
    'SSRF protection',
    'Disable unused public REST API',
    'Disable API playground',
    'Exclude high-risk nodes',
    'Community node supply chain',
    'Security audit cadence',
    'Sensitive execution data policy',
    'Webhook authentication and path hygiene',
    'Backup and restore before security changes',
    'Patch cadence',
    'Monitoring and logs'
  ];

  for (const control of requiredControls) {
    assert(csv.includes(`"${control}"`), `Hardening checklist missing control: ${control}`);
  }

  for (const text of [
    'N8N_SECURE_COOKIE=true',
    'N8N_SAMESITE_COOKIE=lax',
    'N8N_EMAIL_MODE=smtp',
    'N8N_INVITE_LINKS_EMAIL_ONLY=true',
    'N8N_MFA_ENABLED=true',
    'N8N_MFA_ENFORCED_ENABLED=true',
    'N8N_ENCRYPTION_KEY',
    'N8N_BLOCK_ENV_ACCESS_IN_NODE=true',
    'N8N_SSRF_PROTECTION_ENABLED=true',
    'N8N_PUBLIC_API_DISABLED=true',
    'N8N_PUBLIC_API_SWAGGERUI_DISABLED=true',
    'NODES_EXCLUDE',
    'N8N_COMMUNITY_PACKAGES_ENABLED=false',
    'n8n audit',
    'critical 24-48h'
  ]) {
    assert(csv.includes(text), `Hardening checklist missing text: ${text}`);
  }

  const rowCount = csv.trim().split('\n').length - 1;
  assert(rowCount >= 26, `Hardening checklist should include at least 26 rows, found ${rowCount}`);
}

async function verifyPatchCadencePolicy() {
  const policy = await readJson(patchCadenceFile);
  assert(policy.week === 15, 'Patch cadence policy must identify week 15');
  assert(policy.effectiveDate === '2026-05-28', 'Patch cadence policy effective date is wrong');
  assert(policy.policyName.includes('Aggressively update'), 'Patch cadence policy name is wrong');
  assert(
    policy.acceptanceConclusion === '公開 instance 不更新就是安全邊界破洞，升級不是只有新功能。',
    'Patch cadence acceptance conclusion is wrong'
  );

  const sourceValues = Object.values(policy.officialSources);
  for (const source of [
    'https://docs.n8n.io/hosting/installation/updating/',
    'https://docs.n8n.io/release-notes/',
    'https://docs.n8n.io/manage-cloud/update-cloud-version/',
    'https://docs.n8n.io/hosting/securing/overview/',
    'https://docs.n8n.io/hosting/securing/security-audit/',
    'https://docs.n8n.io/hosting/securing/disable-public-api/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/security/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/ssrf-protection/',
    'https://docs.n8n.io/integrations/community-nodes/risks/'
  ]) {
    assert(sourceValues.includes(source), `Patch cadence policy missing source: ${source}`);
  }

  const severities = policy.cadence.map((item) => item.severity);
  for (const severity of ['critical', 'high', 'medium', 'routine', 'deferred']) {
    assert(severities.includes(severity), `Patch cadence policy missing severity: ${severity}`);
  }

  const critical = policy.cadence.find((item) => item.severity === 'critical');
  const high = policy.cadence.find((item) => item.severity === 'high');
  const routine = policy.cadence.find((item) => item.severity === 'routine');
  assert(critical.sla === '24-48 hours', 'Critical SLA must be 24-48 hours');
  assert(high.sla === '7 days', 'High SLA must be 7 days');
  assert(routine.sla === '30 days', 'Routine SLA must be 30 days');

  assert(policy.weeklyTriage.length >= 5, 'Patch cadence policy needs weekly triage items');
  assert(policy.preUpdateGate.length >= 6, 'Patch cadence policy needs pre-update gates');
  assert(policy.postUpdateEvidence.length >= 7, 'Patch cadence policy needs post-update evidence');
  assert(policy.securityBoundaryStatement.includes('public n8n instance exposes login'), 'Patch cadence security boundary statement is incomplete');
}

async function verifyPackageScripts() {
  const pkg = await readJson('package.json');
  assert(pkg.scripts['verify:week14'] === 'node scripts/verify-week-fourteen.mjs', 'package.json missing verify:week14 script');
  assert(pkg.scripts['verify:week15'] === 'node scripts/verify-week-fifteen.mjs', 'package.json missing verify:week15 script');
}

function verifyLiveLocalStackStillClean() {
  const httpStatus = run('n8n local HTTP readiness after Week 15', 'curl', [
    '-s',
    '-o',
    '/dev/null',
    '-w',
    '%{http_code}',
    'http://localhost:5687'
  ]).stdout;
  assert(httpStatus === '200', `Expected existing local n8n HTTP 200 after Week 15, got ${httpStatus}`);

  const cloudflaredContainers = run('Week fifteen cloudflared cleanup check', 'docker', [
    'ps',
    '--filter',
    'name=week8-cloudflared',
    '--format',
    '{{.Names}}'
  ]).stdout;
  assert(cloudflaredContainers === '', 'Week eight quick tunnel container should not be running during Week 15');
}

async function main() {
  await Promise.all(requiredFiles.map(assertFileExists));

  run('Week fourteen verification', process.execPath, ['scripts/verify-week-fourteen.mjs'], {
    timeout: 900000
  });

  await verifyPlanScope();
  await verifyDocument();
  await verifyResponsibilityMatrix();
  await verifyHardeningChecklist();
  await verifyPatchCadencePolicy();
  await verifyPackageScripts();
  verifyLiveLocalStackStillClean();

  console.log('Week fifteen verification passed: security responsibility, public exposure hardening, and patch cadence policy make clear that an unpatched public instance is a security boundary gap.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

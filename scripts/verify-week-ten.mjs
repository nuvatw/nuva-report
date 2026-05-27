#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const vpsDir = 'artifacts/week-10-vps-caddy';
const composeFile = `${vpsDir}/compose.yaml`;
const envExampleFile = `${vpsDir}/.env.example`;
const caddyfile = `${vpsDir}/Caddyfile`;
const checklistFile = `${vpsDir}/firewall-dns-https-checklist.csv`;
const blueprintFile = `${vpsDir}/vps-deployment-blueprint.json`;

const requiredFiles = [
  '20 周的執行計劃.md',
  'docs/week-10-vps-docker-compose-caddy.md',
  composeFile,
  envExampleFile,
  caddyfile,
  checklistFile,
  blueprintFile,
  'scripts/verify-week-nine.mjs',
  'scripts/verify-week-ten.mjs',
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
  const weekTen = plan.match(/### Week 10[\s\S]*?### Week 11/);
  assert(weekTen, 'Could not find Week 10 scope in plan');

  const requiredPlanText = [
    'Week 10｜VPS + Docker Compose + Caddy',
    '如何建立最平衡的 self-hosted n8n production 起點',
    'VPS、DNS A record、firewall ports 80/443',
    'Caddy reverse proxy 與 automatic HTTPS',
    'Postgres + n8n + Caddy Compose 架構',
    'VPS 部署藍圖',
    'Caddyfile 與 env vars 解說',
    'firewall / DNS / HTTPS 檢查表',
    '能部署或完整模擬一個 `https://n8n.example.com` 架構',
    'webhook URL 不會指回 localhost'
  ];

  for (const text of requiredPlanText) {
    assert(weekTen[0].includes(text), `Week 10 plan missing required text: ${text}`);
  }
}

async function verifyDocument() {
  const doc = await readText('docs/week-10-vps-docker-compose-caddy.md');

  const requiredText = [
    'Week 10｜VPS + Docker Compose + Caddy',
    'VPS 部署藍圖',
    'Caddyfile 與 env vars 解說',
    'firewall / DNS / HTTPS 檢查表',
    'https://n8n.example.com',
    'n8n.example.com',
    'WEBHOOK_URL=https://n8n.example.com/',
    'N8N_EDITOR_BASE_URL=https://n8n.example.com/',
    'N8N_PROXY_HOPS=1',
    '不應顯示 `localhost`',
    'DB_TYPE=postgresdb',
    'DB_POSTGRESDB_HOST=postgres',
    'N8N_ENCRYPTION_KEY',
    'caddy:2-alpine',
    'docker.n8n.io/n8nio/n8n:2.22.4',
    'postgres:16-alpine',
    '80:80',
    '443:443',
    '5678:5678',
    '5432:5432',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/',
    'https://docs.n8n.io/hosting/installation/docker/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/deployment/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/database/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/security/',
    'https://docs.docker.com/compose/',
    'https://docs.docker.com/reference/compose-file/services/',
    'https://caddyserver.com/docs/caddyfile/directives/reverse_proxy',
    'https://caddyserver.com/docs/automatic-https',
    'https://caddyserver.com/docs/quick-starts/reverse-proxy',
    'https://ubuntu.com/server/docs/how-to/security/firewalls/',
    'https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/'
  ];

  for (const text of requiredText) {
    assert(doc.includes(text), `Week ten document missing required text: ${text}`);
  }

  const requiredSections = [
    /^## 1\. 本週交付物總覽/m,
    /^## 2\. 官方來源核對/m,
    /^## 3\. 交付物一：VPS 部署藍圖/m,
    /^## 4\. Docker Compose 架構解說/m,
    /^## 5\. 交付物二：Caddyfile 與 env vars 解說/m,
    /^## 6\. 交付物三：firewall \/ DNS \/ HTTPS 檢查表/m,
    /^## 7\. `https:\/\/n8n\.example\.com` 模擬與驗收/m,
    /^## 8\. VPS 部署 runbook/m,
    /^## 9\. 故障排除入口/m,
    /^## 10\. 下一週銜接/m
  ];

  for (const pattern of requiredSections) {
    assert(pattern.test(doc), `Week ten document missing section matching ${pattern}`);
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
    assert(!pattern.test(doc), `Week ten document contains banned placeholder pattern: ${pattern}`);
  }
}

async function verifyArtifacts() {
  const compose = await readText(composeFile);
  const env = await readText(envExampleFile);
  const caddy = await readText(caddyfile);
  const checklist = await readText(checklistFile);
  const blueprint = await readJson(blueprintFile);

  const requiredComposeText = [
    'name: n8n-week10-vps',
    'caddy:',
    'image: caddy:2-alpine',
    '"80:80"',
    '"443:443"',
    'source: ./Caddyfile',
    'target: /etc/caddy/Caddyfile',
    'caddy_data:/data',
    'caddy_config:/config',
    'n8n:',
    'image: docker.n8n.io/n8nio/n8n:2.22.4',
    'condition: service_healthy',
    'DB_TYPE: postgresdb',
    'DB_POSTGRESDB_HOST: postgres',
    'N8N_PROTOCOL: https',
    'WEBHOOK_URL: ${N8N_PUBLIC_URL}',
    'N8N_EDITOR_BASE_URL: ${N8N_PUBLIC_URL}',
    'N8N_PROXY_HOPS: 1',
    'N8N_SECURE_COOKIE: "true"',
    'n8n_data:/home/node/.n8n',
    'postgres:',
    'image: postgres:16-alpine',
    'pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB',
    'postgres_data:/var/lib/postgresql/data',
    'internal: true'
  ];

  for (const text of requiredComposeText) {
    assert(compose.includes(text), `Compose artifact missing required text: ${text}`);
  }

  assert(!compose.includes('"5678:5678"'), 'Compose must not publish n8n 5678 to the VPS host');
  assert(!compose.includes('"5432:5432"'), 'Compose must not publish PostgreSQL 5432 to the VPS host');

  const requiredEnvText = [
    'N8N_DOMAIN=n8n.example.com',
    'N8N_PUBLIC_URL=https://n8n.example.com/',
    'POSTGRES_DB=n8n',
    'POSTGRES_USER=n8n',
    'POSTGRES_PASSWORD=CHANGE_ME_postgres_password_32_chars_minimum',
    'N8N_ENCRYPTION_KEY=CHANGE_ME_fixed_n8n_encryption_key_32_chars_minimum'
  ];

  for (const text of requiredEnvText) {
    assert(env.includes(text), `Env example missing required text: ${text}`);
  }

  assert(caddy.includes('n8n.example.com {'), 'Caddyfile must target n8n.example.com');
  assert(caddy.includes('reverse_proxy n8n:5678'), 'Caddyfile must reverse proxy to n8n:5678');
  assert(caddy.includes('X-Forwarded-For'), 'Caddyfile must set X-Forwarded-For');
  assert(caddy.includes('X-Forwarded-Host'), 'Caddyfile must set X-Forwarded-Host');
  assert(caddy.includes('X-Forwarded-Proto'), 'Caddyfile must set X-Forwarded-Proto');

  const requiredChecklistText = [
    'Create A record n8n.example.com -> VPS_PUBLIC_IPV4',
    'Allow tcp/80 from 0.0.0.0/0 and ::/0',
    'Allow tcp/443 from 0.0.0.0/0 and ::/0',
    'Do not allow tcp/5678 from the internet',
    'Do not allow tcp/5432 from the internet',
    'WEBHOOK_URL=https://n8n.example.com/',
    'Production webhook URL and editor URL do not show localhost'
  ];

  for (const text of requiredChecklistText) {
    assert(checklist.includes(text), `Checklist missing required text: ${text}`);
  }

  assert(blueprint.week === 10, 'Blueprint must identify week 10');
  assert(blueprint.publicUrl === 'https://n8n.example.com/', 'Blueprint public URL is wrong');
  assert(blueprint.architecture.dns.recordType === 'A', 'Blueprint must use a DNS A record');
  assert(blueprint.architecture.firewall.allowInboundTcp.join(',') === '22,80,443', 'Blueprint firewall allow list is wrong');
  assert(blueprint.architecture.firewall.denyPublicTcp.join(',') === '5432,5678', 'Blueprint firewall deny list is wrong');
  assert(blueprint.architecture.reverseProxy.upstream === 'n8n:5678', 'Blueprint Caddy upstream is wrong');
  assert(blueprint.architecture.application.hostPortPublished === false, 'Blueprint must not publish n8n host port');
  assert(blueprint.architecture.database.hostPortPublished === false, 'Blueprint must not publish Postgres host port');
  assert(blueprint.architecture.application.publicEnvironment.WEBHOOK_URL === 'https://n8n.example.com/', 'Blueprint WEBHOOK_URL is wrong');
  assert(
    blueprint.architecture.application.publicEnvironment.N8N_EDITOR_BASE_URL === 'https://n8n.example.com/',
    'Blueprint N8N_EDITOR_BASE_URL is wrong'
  );
  assert(blueprint.acceptance.webhookUrlMustNotContainLocalhost === true, 'Blueprint must require webhook URL not to contain localhost');
}

function verifyComposeConfig() {
  const rendered = run('Week ten Docker Compose config', 'docker', [
    'compose',
    '--env-file',
    envExampleFile,
    '-f',
    composeFile,
    'config'
  ]).stdout;

  const requiredRenderedText = [
    'name: n8n-week10-vps',
    'caddy:',
    'published: "80"',
    'published: "443"',
    'source: caddy_data',
    'source: caddy_config',
    'source: n8n_data',
    'source: postgres_data',
    'WEBHOOK_URL: https://n8n.example.com/',
    'N8N_EDITOR_BASE_URL: https://n8n.example.com/',
    'N8N_HOST: n8n.example.com',
    'N8N_PROTOCOL: https',
    'N8N_PROXY_HOPS: "1"',
    'DB_TYPE: postgresdb',
    'DB_POSTGRESDB_HOST: postgres',
    'condition: service_healthy'
  ];

  for (const text of requiredRenderedText) {
    assert(rendered.includes(text), `Rendered Compose config missing required text: ${text}`);
  }

  assert(!/WEBHOOK_URL:\s*https?:\/\/(localhost|127\.0\.0\.1)/.test(rendered), 'Rendered WEBHOOK_URL must not point to localhost');
  assert(!/N8N_EDITOR_BASE_URL:\s*https?:\/\/(localhost|127\.0\.0\.1)/.test(rendered), 'Rendered editor URL must not point to localhost');
  assert(!rendered.includes('published: "5678"'), 'Rendered config must not publish n8n 5678');
  assert(!rendered.includes('published: "5432"'), 'Rendered config must not publish Postgres 5432');
}

function verifyCaddyfileSyntax() {
  const caddyPath = path.join(root, caddyfile);
  run('Week ten Caddyfile validation', 'docker', [
    'run',
    '--rm',
    '-v',
    `${caddyPath}:/etc/caddy/Caddyfile:ro`,
    'caddy:2-alpine',
    'caddy',
    'validate',
    '--config',
    '/etc/caddy/Caddyfile',
    '--adapter',
    'caddyfile'
  ], {
    timeout: 300000
  });
}

async function verifyPackageScripts() {
  const pkg = await readJson('package.json');
  assert(pkg.scripts['verify:week9'] === 'node scripts/verify-week-nine.mjs', 'package.json missing verify:week9 script');
  assert(pkg.scripts['verify:week10'] === 'node scripts/verify-week-ten.mjs', 'package.json missing verify:week10 script');
}

function verifyLiveLocalStackStillClean() {
  const httpStatus = run('n8n local HTTP readiness after Week 10', 'curl', [
    '-s',
    '-o',
    '/dev/null',
    '-w',
    '%{http_code}',
    'http://localhost:5687'
  ]).stdout;
  assert(httpStatus === '200', `Expected existing local n8n HTTP 200 after Week 10, got ${httpStatus}`);

  const cloudflaredContainers = run('Week ten cloudflared cleanup check', 'docker', [
    'ps',
    '--filter',
    'name=week8-cloudflared',
    '--format',
    '{{.Names}}'
  ]).stdout;
  assert(cloudflaredContainers === '', 'Week eight quick tunnel container should not be running during Week 10');
}

async function main() {
  await Promise.all(requiredFiles.map(assertFileExists));

  run('Week nine verification', process.execPath, ['scripts/verify-week-nine.mjs'], {
    timeout: 540000
  });

  await verifyPlanScope();
  await verifyDocument();
  await verifyArtifacts();
  verifyComposeConfig();
  verifyCaddyfileSyntax();
  await verifyPackageScripts();
  verifyLiveLocalStackStillClean();

  console.log('Week ten verification passed: VPS + Docker Compose + Caddy blueprint renders, Caddyfile validates, and public webhook URL does not point to localhost.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

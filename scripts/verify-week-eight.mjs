#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const composeFile = 'artifacts/week-07-compose/compose.yaml';
const envFile = 'artifacts/week-07-compose/.env';
const weekEightDir = 'artifacts/week-08-tunnel';
const overrideFile = `${weekEightDir}/compose.public-url.override.yaml`;
const weekEightEnvFile = `${weekEightDir}/.env`;
const workflowFile = `${weekEightDir}/week-08-public-webhook-workflow.json`;
const recordFile = `${weekEightDir}/week-08-public-webhook-record.json`;

const requiredFiles = [
  '20 周的執行計劃.md',
  'docs/week-08-tunnel-public-webhook.md',
  overrideFile,
  weekEightEnvFile,
  workflowFile,
  recordFile,
  'scripts/verify-week-seven.mjs',
  'scripts/verify-week-eight.mjs',
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
  const weekEight = plan.match(/### Week 08[\s\S]*?### Week 09/);
  assert(weekEight, 'Could not find Week 08 scope in plan');

  const requiredPlanText = [
    'Week 08｜本機公開：Tunnel 與穩定網域',
    '如何讓外部服務碰到本機 n8n',
    '比較 n8n built-in tunnel、Cloudflare Quick Tunnel、named tunnel、ngrok、Tailscale Funnel、DDNS',
    '設定 WEBHOOK_URL 與 EDITOR_BASE_URL',
    '做一個外部 POST webhook 測試',
    'tunnel comparison table',
    'public webhook 測試紀錄',
    'learning-only vs production-ready 判斷表',
    '能指出 random tunnel URL 對 OAuth callback 與長期 webhook 的風險'
  ];

  for (const text of requiredPlanText) {
    assert(weekEight[0].includes(text), `Week 08 plan missing required text: ${text}`);
  }
}

async function verifyDocument() {
  const doc = await readText('docs/week-08-tunnel-public-webhook.md');

  const requiredText = [
    'Week 08｜本機公開：Tunnel 與穩定網域',
    'Cloudflare Quick Tunnel',
    'n8n built-in tunnel',
    'Cloudflare named tunnel',
    'ngrok',
    'Tailscale Funnel',
    'DDNS',
    'WEBHOOK_URL',
    'N8N_EDITOR_BASE_URL',
    'N8N_PROXY_HOPS',
    'week08PublicWebhookProbe',
    'week-08-public-post',
    'public webhook 測試紀錄',
    'learning-only vs production-ready 判斷表',
    'random tunnel URL 對 OAuth callback 與長期 webhook 的風險',
    'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/workflow-development/',
    'https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/',
    'https://docs.n8n.io/hosting/configuration/environment-variables/deployment/',
    'https://docs.n8n.io/hosting/installation/docker/',
    'https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/',
    'https://developers.cloudflare.com/tunnel/routing/',
    'https://ngrok.com/docs/universal-gateway/domains',
    'https://tailscale.com/docs/features/tailscale-funnel',
    'https://developers.cloudflare.com/dns/manage-dns-records/how-to/managing-dynamic-ip-addresses/'
  ];

  for (const text of requiredText) {
    assert(doc.includes(text), `Week eight document missing required text: ${text}`);
  }

  const requiredSections = [
    /^## 1\. 本週交付物總覽/m,
    /^## 2\. 官方來源核對/m,
    /^## 3\. 實測環境與結果/m,
    /^## 4\. 交付物一：tunnel comparison table/m,
    /^## 5\. 交付物二：public webhook 測試紀錄/m,
    /^## 6\. 交付物三：learning-only vs production-ready 判斷表/m,
    /^## 7\. random tunnel URL 風險說明/m,
    /^## 8\. Week 08 完成檢查/m,
    /^## 9\. 下一週銜接/m
  ];

  for (const pattern of requiredSections) {
    assert(pattern.test(doc), `Week eight document missing section matching ${pattern}`);
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
    assert(!pattern.test(doc), `Week eight document contains banned placeholder pattern: ${pattern}`);
  }
}

async function verifyArtifacts() {
  const override = await readText(overrideFile);
  const env = await readText(weekEightEnvFile);
  const workflow = await readJson(workflowFile);
  const record = await readJson(recordFile);

  assert(override.includes('WEBHOOK_URL: ${WEEK8_PUBLIC_URL}'), 'Override file missing WEBHOOK_URL');
  assert(override.includes('N8N_EDITOR_BASE_URL: ${WEEK8_PUBLIC_URL}'), 'Override file missing N8N_EDITOR_BASE_URL');
  assert(override.includes('N8N_PROXY_HOPS: "1"'), 'Override file missing N8N_PROXY_HOPS');
  assert(/^WEEK8_PUBLIC_URL=https:\/\/[a-z0-9-]+\.trycloudflare\.com$/m.test(env), 'Week eight env must contain a TryCloudflare public URL');

  assert(workflow.id === 'week08PublicWebhookProbe', 'Week eight workflow has the wrong id');
  assert(workflow.name === 'Week 08 Public Webhook Probe', 'Week eight workflow has the wrong name');

  const webhook = workflow.nodes.find((node) => node.name === 'Public POST Webhook');
  const code = workflow.nodes.find((node) => node.name === 'Return Week 08 Result');
  assert(webhook, 'Week eight workflow missing Webhook node');
  assert(code, 'Week eight workflow missing response Code node');
  assert(webhook.type === 'n8n-nodes-base.webhook', 'Week eight Webhook node has the wrong type');
  assert(webhook.parameters.httpMethod === 'POST', 'Week eight Webhook node must use POST');
  assert(webhook.parameters.path === 'week-08-public-post', 'Week eight Webhook path is wrong');
  assert(webhook.parameters.responseMode === 'lastNode', 'Week eight Webhook must respond after the last node');
  assert(webhook.parameters.responseData === 'firstEntryJson', 'Week eight Webhook must return first JSON entry');
  assert(code.parameters.jsCode.includes('cloudflare-quick-tunnel'), 'Week eight Code node must mark the tunnel provider');
  assert(code.parameters.jsCode.includes('receivedSource'), 'Week eight Code node must echo received source');

  assert(record.week === 8, 'Webhook record week must be 8');
  assert(record.tunnel.provider === 'cloudflare_quick_tunnel', 'Webhook record must identify Cloudflare Quick Tunnel');
  assert(/^https:\/\/[a-z0-9-]+\.trycloudflare\.com$/.test(record.tunnel.publicUrl), 'Webhook record must contain TryCloudflare public URL');
  assert(record.webhook.path === '/webhook/week-08-public-post', 'Webhook record path is wrong');
  assert(
    record.webhook.productionUrl === `${record.tunnel.publicUrl}${record.webhook.path}`,
    'Webhook production URL must combine the public URL and webhook path'
  );
  assert(record.request.method === 'POST', 'Webhook record request method must be POST');
  assert(record.response.httpStatus === 200, 'Webhook record must capture HTTP 200');
  assert(record.response.body.ok === true, 'Webhook response must confirm ok=true');
  assert(record.response.body.week === 8, 'Webhook response must confirm week=8');
  assert(record.response.body.receivedSource === 'week08-external-post', 'Webhook response must echo the request source');
  assert(record.cleanup.tunnelStopped === true, 'Webhook record must confirm the quick tunnel was stopped');
  assert(record.cleanup.workflowUnpublished === true, 'Webhook record must confirm the test workflow was unpublished');
  assert(record.cleanup.liveN8nRevertedToLocalOnly === true, 'Webhook record must confirm live n8n was reverted to local-only');
}

async function verifyPackageScripts() {
  const pkg = await readJson('package.json');
  assert(pkg.scripts['verify:week7'] === 'node scripts/verify-week-seven.mjs', 'package.json missing verify:week7 script');
  assert(pkg.scripts['verify:week8'] === 'node scripts/verify-week-eight.mjs', 'package.json missing verify:week8 script');
}

function composeArgs(args) {
  return ['compose', '--env-file', envFile, '-f', composeFile, ...args];
}

function verifyLiveStackCleanedUp() {
  const httpStatus = run('n8n Week 08 local HTTP readiness', 'curl', [
    '-s',
    '-o',
    '/dev/null',
    '-w',
    '%{http_code}',
    'http://localhost:5687'
  ]).stdout;
  assert(httpStatus === '200', `Expected n8n local HTTP 200 after cleanup, got ${httpStatus}`);

  const ps = run('Docker Compose ps after cleanup', 'docker', composeArgs(['ps'])).stdout;
  assert(ps.includes('n8n-week7-n8n-1'), 'n8n container missing after Week 08 cleanup');
  assert(ps.includes('n8n-week7-postgres-1'), 'Postgres container missing after Week 08 cleanup');
  assert(ps.includes('healthy'), 'Postgres should remain healthy after Week 08 cleanup');

  const n8nEnv = run('n8n environment after cleanup', 'docker', composeArgs([
    'exec',
    '-T',
    'n8n',
    'env'
  ])).stdout;
  assert(!/WEBHOOK_URL=https:\/\/[a-z0-9-]+\.trycloudflare\.com/.test(n8nEnv), 'Live n8n still has a TryCloudflare WEBHOOK_URL');
  assert(!/N8N_EDITOR_BASE_URL=https:\/\/[a-z0-9-]+\.trycloudflare\.com/.test(n8nEnv), 'Live n8n still has a TryCloudflare editor URL');

  const cloudflaredContainers = run('Cloudflared cleanup check', 'docker', [
    'ps',
    '--filter',
    'name=week8-cloudflared',
    '--format',
    '{{.Names}}'
  ]).stdout;
  assert(cloudflaredContainers === '', 'Week eight quick tunnel container is still running');

  const workflowCount = run('Week eight workflow database check', 'docker', composeArgs([
    'exec',
    '-T',
    'postgres',
    'psql',
    '-U',
    'n8n_week7',
    '-d',
    'n8n_week7',
    '-At',
    '-c',
    "select count(*) from workflow_entity where id='week08PublicWebhookProbe' and name='Week 08 Public Webhook Probe';"
  ])).stdout;
  assert(workflowCount === '1', `Week eight workflow missing from PostgreSQL: ${workflowCount}`);

  const exportedWorkflow = run('Week eight workflow export', 'docker', composeArgs([
    'exec',
    '-T',
    'n8n',
    'n8n',
    'export:workflow',
    '--id=week08PublicWebhookProbe'
  ])).stdout;
  assert(exportedWorkflow.includes('week08PublicWebhookProbe'), 'n8n export missing Week 08 workflow id');
  assert(exportedWorkflow.includes('Week 08 Public Webhook Probe'), 'n8n export missing Week 08 workflow name');
}

async function main() {
  await Promise.all(requiredFiles.map(assertFileExists));

  run('Week seven verification', process.execPath, ['scripts/verify-week-seven.mjs'], {
    timeout: 420000
  });

  await verifyPlanScope();
  await verifyDocument();
  await verifyArtifacts();
  await verifyPackageScripts();
  verifyLiveStackCleanedUp();

  console.log('Week eight verification passed: public tunnel POST was recorded, and the live stack was cleaned back to local-only.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const requiredFiles = [
  'index.html',
  'README.md',
  'package.json',
  'vercel.json',
  'scripts/build-report-index.mjs',
  'scripts/dev-server.mjs',
  'scripts/check-links.mjs',
  'scripts/mobile-visual-check.mjs',
  'scripts/audit-maintenance.mjs',
  'scripts/verify-week-one.mjs',
  'scripts/verify-week-two.mjs',
  'scripts/verify-week-three.mjs',
  'scripts/verify-week-four.mjs',
  'scripts/verify-week-five.mjs',
  'docs/report-metadata.schema.json',
  'docs/report-categories.json',
  'docs/report-delivery-standard.md',
  'docs/homepage-browsing-standard.md',
  'docs/release-process.md',
  'docs/static-deploy-guide.md',
  'docs/expansion-roadmap.md',
  'docs/maintenance-playbook.md',
  'docs/feedback-log-template.md',
  'docs/week-05-local-docker-desktop.md',
  'docs/week-1-handoff.md',
  'docs/week-2-handoff.md',
  'docs/week-3-handoff.md',
  'docs/week-4-handoff.md',
  'docs/week-5-handoff.md',
  'artifacts/week-05-persistence-workflow.json',
  'artifacts/week-05-persistence-credential.json',
  'templates/report-template.html',
  'assets/favicon.svg',
  'assets/report-reader.js',
  'assets/report-actions.js'
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function assertFileExists(file) {
  const target = path.join(root, file);
  const stat = await fs.stat(target).catch(() => null);
  assert(stat?.isFile(), `Missing required file: ${file}`);
}

async function readText(file) {
  return fs.readFile(path.join(root, file), 'utf8');
}

function run(label, command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8'
  });

  if (result.status !== 0) {
    throw new Error(`${label} failed:\n${result.stdout}\n${result.stderr}`.trim());
  }

  return result.stdout.trim();
}

async function verifyN8nWeekFiveDocument() {
  const doc = await readText('docs/week-05-local-docker-desktop.md');

  const requiredText = [
    'Week 05｜本機快速啟動：Docker Desktop',
    'docker volume create n8n_data',
    'docker.n8n.io/n8nio/n8n',
    '-p 5678:5678',
    '-v n8n_data:/home/node/.n8n',
    'Week 05 Persistence Probe',
    'Week 05 Credential Probe',
    'docker stop n8n-week5-local',
    'docker rm n8n-week5-local',
    'n8n export:workflow --all',
    'n8n export:credentials --all',
    'http_status=200',
    'https://docs.n8n.io/hosting/installation/docker/',
    'https://docs.n8n.io/hosting/cli-commands/',
    'https://docs.docker.com/engine/storage/volumes/',
    'https://docs.docker.com/reference/cli/docker/volume/create/',
    'https://docs.docker.com/desktop/setup/install/mac-install/',
    'https://docs.docker.com/desktop/setup/install/windows-install/'
  ];

  for (const text of requiredText) {
    assert(doc.includes(text), `Week five Docker document missing required text: ${text}`);
  }

  const banned = [
    /\bTODO\b/i,
    /for brevity/i,
    /the rest follows/i,
    /similarly for the remaining/i,
    /Let me know if you want me to continue/i
  ];

  for (const pattern of banned) {
    assert(!pattern.test(doc), `Week five Docker document contains banned placeholder pattern: ${pattern}`);
  }
}

async function verifyProbeArtifacts() {
  const workflow = JSON.parse(await readText('artifacts/week-05-persistence-workflow.json'));
  assert(workflow.id === 'week05PersistenceProbe', 'Persistence workflow probe has the wrong id');
  assert(workflow.name === 'Week 05 Persistence Probe', 'Persistence workflow probe has the wrong name');
  assert(Array.isArray(workflow.nodes), 'Persistence workflow probe must have nodes');
  assert(
    workflow.nodes.some((node) => node.name === 'Manual Trigger'),
    'Persistence workflow probe missing Manual Trigger node'
  );
  assert(
    workflow.nodes.some((node) => node.name === 'Persistence Marker'),
    'Persistence workflow probe missing Persistence Marker node'
  );

  const credentials = JSON.parse(await readText('artifacts/week-05-persistence-credential.json'));
  assert(Array.isArray(credentials) && credentials.length === 1, 'Persistence credential probe must contain one credential');
  const [credential] = credentials;
  assert(credential.id === 'week05CredentialProbe', 'Persistence credential probe has the wrong id');
  assert(credential.name === 'Week 05 Credential Probe', 'Persistence credential probe has the wrong name');
  assert(credential.type === 'httpBasicAuth', 'Persistence credential probe must use httpBasicAuth');
  assert(credential.data?.user === 'week5_probe_user', 'Persistence credential probe must use dummy user data');
  assert(credential.data?.password === 'week5_probe_password', 'Persistence credential probe must use dummy password data');
}

async function verifyLiveN8nDocker() {
  const dockerVersion = run('Docker version check', 'docker', [
    'version',
    '--format',
    'client={{.Client.Version}} server={{.Server.Version}}'
  ]);
  assert(dockerVersion.includes('client=') && dockerVersion.includes('server='), 'Docker daemon is not available');

  const container = run('n8n container check', 'docker', [
    'ps',
    '--filter',
    'name=^/n8n-week5-local$',
    '--format',
    '{{.Names}}|{{.Status}}|{{.Ports}}'
  ]);
  assert(container.includes('n8n-week5-local'), 'n8n-week5-local container is not running');
  assert(container.includes('5678'), 'n8n-week5-local container is missing port 5678 mapping');

  const volume = run('n8n volume check', 'docker', [
    'volume',
    'inspect',
    'n8n_data',
    '--format',
    '{{.Name}}|{{.Driver}}|{{.Mountpoint}}'
  ]);
  assert(volume.startsWith('n8n_data|'), 'n8n_data volume is missing');

  const n8nVersion = run('n8n version check', 'docker', [
    'exec',
    'n8n-week5-local',
    'n8n',
    '--version'
  ]);
  assert(/^\d+\.\d+\.\d+/.test(n8nVersion), `Unexpected n8n version output: ${n8nVersion}`);

  const workflows = run('n8n workflow persistence check', 'docker', [
    'exec',
    'n8n-week5-local',
    'n8n',
    'export:workflow',
    '--all'
  ]);
  assert(workflows.includes('week05PersistenceProbe'), 'Recreated n8n container cannot export workflow probe');
  assert(workflows.includes('Week 05 Persistence Probe'), 'Recreated n8n container cannot export workflow probe name');

  const credentials = run('n8n credential persistence check', 'docker', [
    'exec',
    'n8n-week5-local',
    'n8n',
    'export:credentials',
    '--all'
  ]);
  assert(credentials.includes('week05CredentialProbe'), 'Recreated n8n container cannot export credential probe');
  assert(credentials.includes('Week 05 Credential Probe'), 'Recreated n8n container cannot export credential probe name');
}

async function verifyOptionalIndexFields() {
  const raw = await fs.readFile(path.join(root, 'data', 'reports.json'), 'utf8');
  const payload = JSON.parse(raw);

  assert(payload.count >= 2, 'Week five expects at least the migrated reports');
  for (const report of payload.reports) {
    assert(report.clientGroup, `${report.id} missing clientGroup in generated data`);
    assert(Array.isArray(report.tags) && report.tags.length > 0, `${report.id} missing tags in generated data`);
    assert(report.visibility, `${report.id} missing visibility in generated data`);
    for (const tag of report.tags) {
      assert(report.search.includes(tag.toLowerCase()), `${report.id} search text missing tag: ${tag}`);
    }
  }
}

async function verifyReportActions() {
  const reportFiles = (await fs.readdir(path.join(root, 'reports')))
    .filter((file) => file.toLowerCase().endsWith('.html'))
    .sort();

  assert(reportFiles.length > 0, 'No report HTML files found');

  for (const file of reportFiles) {
    const html = await fs.readFile(path.join(root, 'reports', file), 'utf8');
    assert(
      !html.includes('../assets/site-auth.js'),
      `${file} should not include the retired site auth script`
    );
    assert(
      html.includes('../assets/report-reader.js'),
      `${file} missing shared report reader script`
    );
    assert(
      html.includes('../assets/report-actions.js'),
      `${file} missing shared report actions script`
    );
  }
}

async function main() {
  await Promise.all(requiredFiles.map(assertFileExists));

  run('Week four verification', process.execPath, ['scripts/verify-week-four.mjs']);
  run('Maintenance audit', process.execPath, ['scripts/audit-maintenance.mjs']);

  await assertFileExists('data/maintenance-summary.json');
  await verifyOptionalIndexFields();
  await verifyReportActions();
  await verifyN8nWeekFiveDocument();
  await verifyProbeArtifacts();
  await verifyLiveN8nDocker();

  console.log('Week five verification passed: maintenance checks and n8n Docker Desktop persistence checks are ready.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

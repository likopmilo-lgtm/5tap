import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const blake3Wasm = require('blake3-wasm');

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
const scriptName = process.env.CLOUDFLARE_SCRIPT_NAME || '5tap';
const root = process.cwd();
const clientDir = path.join(root, 'dist', 'client');
const serverDir = path.join(root, 'dist', 'server');

if (!accountId || !token) {
  throw new Error('Missing Cloudflare credentials');
}

async function cf(pathname, init = {}) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!res.ok || data.success === false) {
    throw new Error(`${init.method || 'GET'} ${pathname} failed: ${res.status} ${text}`);
  }
  return data;
}

async function listFiles(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === '.assetsignore') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(full, base));
    else if (entry.isFile()) files.push({ full, rel: '/' + path.relative(base, full).replaceAll(path.sep, '/') });
  }
  return files;
}

function contentType(file) {
  const ext = path.extname(file).toLowerCase();
  return {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript+module',
    '.mjs': 'application/javascript+module',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
  }[ext] || 'application/octet-stream';
}

function assetContentType(file) {
  const type = contentType(file);
  return type === 'application/javascript+module'
    ? 'text/javascript; charset=utf-8'
    : type;
}

async function buildAssetManifest() {
  const files = await listFiles(clientDir);
  const manifest = {};
  const byHash = new Map();
  for (const file of files) {
    const buffer = await readFile(file.full);
    const ext = path.extname(file.rel).toLowerCase().replace('.', '') || 'bin';
    const key = blake3Wasm.hash(buffer.toString('base64') + ext + '5tap-mime-v2').toString('hex').slice(0, 32);
    manifest[file.rel] = { hash: key, size: buffer.length };
    byHash.set(key, { ...file, buffer });
  }
  return { manifest, byHash };
}

async function uploadAssets() {
  const { manifest, byHash } = await buildAssetManifest();
  const session = await cf(`/accounts/${accountId}/workers/scripts/${scriptName}/assets-upload-session`, {
    method: 'POST',
    body: JSON.stringify({ manifest }),
  });
  const result = session.result || session;
  const buckets = result.buckets || [];
  let completionJwt = result.jwt || "";
  for (const bucket of buckets) {
    const form = new FormData();
    for (const hash of bucket) {
      const asset = byHash.get(hash);
      if (!asset) throw new Error(`Missing asset ${hash}`);
      form.append(hash, new Blob([asset.buffer.toString('base64')], {
        type: assetContentType(asset.full),
      }));
    }
    const uploaded = await cf(`/accounts/${accountId}/workers/assets/upload?base64=true`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${result.jwt}` },
      body: form,
    });
    completionJwt = uploaded.result?.jwt || uploaded.jwt || completionJwt;
  }
  return completionJwt;
}

async function collectModules() {
  const files = (await listFiles(serverDir)).filter((file) => /\.(mjs|js)$/.test(file.rel));
  return files;
}

async function uploadVersion(assetsJwt) {
  const modules = await collectModules();
  const metadata = {
    main_module: 'index.js',
    compatibility_date: '2026-05-15',
    compatibility_flags: ['nodejs_compat'],
    keep_bindings: ['json', 'secret_text', 'secret_key'],
    assets: { jwt: assetsJwt, config: {} },
    bindings: [
      { name: 'ASSETS', type: 'assets' },
      { name: 'SUPABASE_URL', type: 'plain_text', text: process.env.SUPABASE_URL_VALUE || '' },
      { name: 'SUPABASE_ANON_KEY', type: 'plain_text', text: process.env.SUPABASE_ANON_KEY_VALUE || '' },
    ].filter((binding) => binding.type !== 'plain_text' || binding.text),
    annotations: {
      'workers/message': 'Deploy 5Tap production website',
      'workers/tag': 'production',
    },
  };
  const form = new FormData();
  form.append('metadata', JSON.stringify(metadata));
  for (const module of modules) {
    const buffer = await readFile(module.full);
    const name = module.rel.slice(1);
    const type = contentType(module.full);
    form.append(name, new Blob([buffer], { type }), name);
  }
  const version = await cf(`/accounts/${accountId}/workers/scripts/${scriptName}/versions?bindings_inherit=strict`, {
    method: 'POST',
    body: form,
  });
  return version.result;
}

async function deployVersion(versionId) {
  return cf(`/accounts/${accountId}/workers/scripts/${scriptName}/deployments`, {
    method: 'POST',
    body: JSON.stringify({
      strategy: 'percentage',
      versions: [{ version_id: versionId, percentage: 100 }],
      annotations: { 'workers/message': 'Deploy 5Tap production website' },
    }),
  });
}

const assetsJwt = await uploadAssets();
const version = await uploadVersion(assetsJwt);
await deployVersion(version.id);
console.log(JSON.stringify({ deployed: true, versionId: version.id }, null, 2));




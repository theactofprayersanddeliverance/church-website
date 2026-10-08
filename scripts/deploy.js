import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import https from 'https';

const FTP_HOST = process.env.FTP_HOST;
const FTP_USER = process.env.FTP_USER;
const FTP_PASS = process.env.FTP_PASS;
const FTP_PORT = process.env.FTP_PORT || '21';
const FTP_WEB_DIR = process.env.FTP_WEB_DIR || '';

console.log('--- CPANEL DEPLOYMENT STARTED ---');
console.log(`Target Host: ${FTP_HOST}`);
console.log(`Target Directory: ${FTP_WEB_DIR}`);
console.log(`Target User: ${FTP_USER}`);

if (!FTP_HOST || !FTP_USER || !FTP_PASS) {
  console.error('Error: Missing FTP credentials in environment variables.');
  process.exit(1);
}

console.log('Building project before deployment...');
const buildRes = spawnSync('npm', ['run', 'build'], { stdio: 'inherit' });
if (buildRes.status !== 0) {
  console.error('Build failed. Aborting deployment.');
  process.exit(1);
}

const distDir = path.resolve('dist');

// Function to recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const allDistFiles = getAllFiles(distDir);
console.log(`Found ${allDistFiles.length} files to upload from dist/`);

// Track created remote directories to avoid redundant MKCOL calls
const createdDirs = new Set();

function ensureRemoteDir(relDir) {
  if (!relDir || relDir === '.' || createdDirs.has(relDir)) return;

  const parts = relDir.split(path.sep);
  let current = '';
  for (const part of parts) {
    current = current ? `${current}/${part}` : part;
    if (!createdDirs.has(current)) {
      const dirUrl = `https://${FTP_HOST}:2078/${FTP_WEB_DIR}/${current}`;
      spawnSync('curl', [
        '-s', '-k',
        '-u', `${FTP_USER}:${FTP_PASS}`,
        '-X', 'MKCOL',
        dirUrl
      ]);
      createdDirs.add(current);
    }
  }
}

let uploadedCount = 0;
let failedCount = 0;

for (const filePath of allDistFiles) {
  const relPath = path.relative(distDir, filePath).replace(/\\/g, '/');
  const relDir = path.dirname(relPath).replace(/\\/g, '/');

  if (relDir && relDir !== '.') {
    ensureRemoteDir(relDir);
  }

  const targetUrl = `https://${FTP_HOST}:2078/${FTP_WEB_DIR}/${relPath}`;
  const res = spawnSync('curl', [
    '-s', '-k',
    '-u', `${FTP_USER}:${FTP_PASS}`,
    '-T', filePath,
    targetUrl
  ], { encoding: 'utf-8' });

  if (res.status === 0) {
    uploadedCount++;
    console.log(`[UPLOADED] ${relPath}`);
  } else {
    failedCount++;
    console.error(`[FAILED] ${relPath}: ${res.stderr || res.stdout}`);
  }
}

console.log(`\nDeployment summary: ${uploadedCount} uploaded, ${failedCount} failed.`);

if (failedCount > 0) {
  console.error('Some files failed to upload!');
  process.exit(1);
}

console.log('\n--- VERIFYING LIVE DEPLOYMENT ---');
// Verify HTTP response from the live website
const liveUrl = `https://${FTP_HOST}/`;

function verifyUrl(url, description) {
  return new Promise((resolve) => {
    https.get(url, { rejectUnauthorized: false, timeout: 8000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`Verified ${description}: Status ${res.statusCode} (${data.length} bytes)`);
        resolve({ statusCode: res.statusCode, body: data });
      });
    }).on('error', (err) => {
      console.error(`Failed to reach ${url}: ${err.message}`);
      resolve({ statusCode: 500, error: err.message });
    });
  });
}

async function runVerification() {
  const rootCheck = await verifyUrl(liveUrl, 'Root index.html');
  const bgCheck = await verifyUrl(`https://${FTP_HOST}/images/african_worship_bg.jpg`, 'African Worship BG Image (african_worship_bg.jpg)');
  const i1Check = await verifyUrl(`https://${FTP_HOST}/images/i1.jpg`, 'Pastor Israel Revelation Image (i1.jpg)');
  const i2Check = await verifyUrl(`https://${FTP_HOST}/images/i2.jpg`, 'Pastor & Pastor Mrs Image (i2.jpg)');
  const logoCheck = await verifyUrl(`https://${FTP_HOST}/images/logo.png`, 'Church Logo PNG (logo.png)');

  const hasReactRoot = rootCheck.body && rootCheck.body.includes('id="root"');
  const hasAppScript = rootCheck.body && rootCheck.body.includes('/assets/index-');

  if (rootCheck.statusCode === 200 && hasReactRoot && hasAppScript && i1Check.statusCode === 200 && i2Check.statusCode === 200 && logoCheck.statusCode === 200) {
    console.log('\nSUCCESS: React application confirmed LIVE on cPanel server!');
    console.log(`Live URL: ${liveUrl}`);
    process.exit(0);
  } else {
    console.warn('\nWarning: Check results:', {
      rootStatus: rootCheck.statusCode,
      hasReactRoot,
      hasAppScript,
      i1Status: i1Check.statusCode,
      i2Status: i2Check.statusCode
    });
    if (rootCheck.statusCode === 200) {
      console.log('The server responded with 200 OK.');
      process.exit(0);
    } else {
      process.exit(1);
    }
  }
}

runVerification();

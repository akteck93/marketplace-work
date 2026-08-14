const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- Starting Standalone Bundle Script ---');

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy .env
console.log('1. Copying .env to standalone...');
if (fs.existsSync('.env')) {
  fs.copyFileSync('.env', path.join('.next', 'standalone', '.env'));
}

// 2. Copy public
console.log('2. Copying public to standalone...');
copyDirSync('public', path.join('.next', 'standalone', 'public'));

// 3. Copy .next/static
console.log('3. Copying .next/static...');
copyDirSync(path.join('.next', 'static'), path.join('.next', 'standalone', '.next', 'static'));
copyDirSync(path.join('.next', 'static'), path.join('.next', 'standalone', 'public', '_next', 'static'));

// 4. Copy Prisma Engines
console.log('4. Copying Prisma binaries...');
copyDirSync(path.join('node_modules', '.prisma'), path.join('.next', 'standalone', 'node_modules', '.prisma'));
copyDirSync(path.join('node_modules', '@prisma'), path.join('.next', 'standalone', 'node_modules', '@prisma'));

// 5. Inject .env reader into server.js
console.log('5. Injecting .env loader in standalone server.js...');
const serverFile = path.join('.next', 'standalone', 'server.js');
if (fs.existsSync(serverFile)) {
  let serverCode = fs.readFileSync(serverFile, 'utf8');
  const envLoader = `
// --- AUTO-LOAD .ENV ---
const fs_env = require('fs');
const path_env = require('path');
try {
  const ep = path_env.join(__dirname, '.env');
  if (fs_env.existsSync(ep)) {
    fs_env.readFileSync(ep, 'utf8').split('\\n').forEach(l => {
      const t = l.trim();
      if (t && !t.startsWith('#')) {
        const i = t.indexOf('=');
        if (i !== -1) {
          const k = t.substring(0, i).trim();
          let v = t.substring(i + 1).trim();
          if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1);
          }
          process.env[k] = v;
        }
      }
    });
    console.log('.env successfully loaded from standalone directory');
  }
} catch(e) {
  console.error('Error loading .env:', e);
}
// ----------------------
`;
  if (!serverCode.includes('// --- AUTO-LOAD .ENV ---')) {
    fs.writeFileSync(serverFile, envLoader + '\n' + serverCode);
  }
}

// 6. Create Zip
console.log('6. Creating cpanel-deploy.zip via tar...');
try {
  if (fs.existsSync('cpanel-deploy.zip')) {
    fs.unlinkSync('cpanel-deploy.zip');
  }
  execSync('tar.exe -a -c -f cpanel-deploy.zip -C ./.next/standalone .', { stdio: 'inherit' });
  const sizeMB = (fs.statSync('cpanel-deploy.zip').size / (1024 * 1024)).toFixed(2);
  console.log(`--- SUCCESS: cpanel-deploy.zip created (${sizeMB} MB) ---`);
} catch (err) {
  console.error('Error creating zip:', err);
}


import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.join(__dirname, 'client-package.json');
const destDir = path.join(__dirname, 'dist');
const dest = path.join(destDir, 'client-package.json');

console.log('Post-build: Copying client-package.json to dist...');

if (!fs.existsSync(destDir)) {
    console.log('Creating dist directory...');
    fs.mkdirSync(destDir, { recursive: true });
}

try {
    fs.copyFileSync(src, dest);
    console.log('✅ Successfully copied client-package.json to dist/');
} catch (err) {
    console.error('❌ Error copying file:', err);
    process.exit(1);
}

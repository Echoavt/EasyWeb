import fs from 'fs/promises';
import assert from 'assert';

async function run() {
  const html = await fs.readFile('index.html', 'utf8');
  assert(html.includes('<link rel="manifest" href="manifest.json">'),
    'index.html should reference manifest.json');

  const manifest = JSON.parse(await fs.readFile('manifest.json', 'utf8'));
  assert(manifest.name, 'manifest.json should contain a name');
}

run().then(() => console.log('All tests passed')).catch(err => {
  console.error('Test failed:', err.message);
  process.exit(1);
});

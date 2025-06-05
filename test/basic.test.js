import fs from 'fs/promises';
import assert from 'assert';

async function run() {
  const html = await fs.readFile('index.html', 'utf8');
  assert(html.includes('simulator.js'), 'index.html should load simulator.js');
}

run().then(() => console.log('All tests passed')).catch(err => {
  console.error('Test failed:', err.message);
  process.exit(1);
});

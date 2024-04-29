import 'dotenv/config';

import { getPayload } from 'payload';
import { importConfig } from 'payload/node';

async function run() {
  const awaitedConfig = await importConfig('../../payload.config.ts');

  const payload = await getPayload({ config: awaitedConfig });

  const pages = await payload.find({
    collection: 'pages',
  });

  console.log(pages);
  process.exit(0);
}

run().catch(console.error);

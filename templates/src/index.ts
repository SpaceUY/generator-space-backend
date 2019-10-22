import * as express from 'express';
import * as bodyparser from 'body-parser';
import cors from './util/cors';

import features from './features';
import routes from './routes';

async function main(): Promise<void> {
  const app = express();

  app.use(
    cors({
      origin: '*',
      methods: [
        'GET',
        'PUT',
        'POST',
        'DELETE',
        'OPTIONS',
      ],
      headers: [
        'Content-Type',
        'Authorization',
        'Content-Length',
        'X-Requested-With',
        'Origin',
        'Accept',
        'Authorization',
      ],
    }),
  );
  app.use(bodyparser.json({ limit: '1mb' }));

  await features({ app });
  app.use(routes);

  app.listen(process.env.PORT, () => {
    console.log('Express Ready');
  });
}

main();

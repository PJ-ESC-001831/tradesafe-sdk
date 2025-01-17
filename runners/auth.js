import { config } from 'dotenv';

import GraphQLClient from '../src/client/index.js';

config();

(async () => {
  const client = new GraphQLClient()
    .config(process.env.TRADESAFE_CLIENT_ID, process.env.TRADESAFE_SECRET)
    .auth();
})();
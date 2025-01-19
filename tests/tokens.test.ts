import { listTokens } from '../src/tokens';
import GraphQLClient from '../src/client';

import { config } from 'dotenv';

config();

// jest.mock('./client');

describe('listTokens', () => {
  let mockClient: GraphQLClient;

  beforeAll(async () => {
    const client = new GraphQLClient();

    mockClient = await client
      .config(
        process.env.TRADESAFE_CLIENT_ID as string,
        process.env.TRADESAFE_SECRET as string,
      )
      .authenticate();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should authenticate the client', () => {
    expect(mockClient.isAuthenticated()).toBeTruthy();
  });

  it('should do a basic query to  list the tokens', async () => {
    const tokens = await listTokens(mockClient);

    expect(tokens).toBeTruthy();
  });
});

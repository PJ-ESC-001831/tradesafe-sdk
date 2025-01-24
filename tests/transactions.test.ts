import { listTransactions } from '../src/transactions';
import GraphQLClient from '../src/client';
import { config } from 'dotenv';

config();

describe('Token API functions', () => {
  let mockClient: GraphQLClient;

  beforeAll(async () => {
    mockClient = new GraphQLClient().config(
      process.env.TRADESAFE_CLIENT_ID as string,
      process.env.TRADESAFE_SECRET as string,
    );

    await mockClient.authenticate();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listTransactions', () => {
    it('should do a basic query to list the transactions', async () => {
      const transactions = await listTransactions(mockClient);
      expect(transactions).toBeTruthy();
    });
  });
});

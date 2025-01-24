import { createTransaction, listTransactions } from '../src/transactions';
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

  describe('createTransaction', () => {
    it('should do a basic query to create a transactions', async () => {
      const transactions = await createTransaction(mockClient, {
        title: 'Transaction Title',
        description: 'Transaction Description',
        industry: 'GENERAL_GOODS_SERVICES',
        currency: 'ZAR',
        feeAllocation: 'SELLER',
        allocations: [
          {
            title: 'Allocation Title',
            description: 'Allocation Description',
            value: 10000.0,
            daysToDeliver: 7,
            daysToInspect: 7,
          },
        ],
        parties: [
          {
            token: '2ysmz8wc9mpVjCJTM55e9',
            role: 'BUYER',
          },
          {
            token: '2ysGmerpmAyivgPzeeUcQ',
            role: 'SELLER',
          },
        ],
      });
      expect(transactions).toBeTruthy();
    });
  });
});

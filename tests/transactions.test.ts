import {
  createTransaction,
  getTransaction,
  listTransactions,
  updateTransaction,
} from '../src/transactions';
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
      /*
        {
          id: "2yxAxkx75wvtWjdJNUMAd",
        }
      */
      expect(transactions).toBeTruthy();
    });
  });

  describe('getTransaction', () => {
    it('should do a basic query to get a transaction', async () => {
      const transactions = await getTransaction(
        mockClient,
        '2yxAxkx75wvtWjdJNUMAd',
      );

      /*
        {
          title: "Transaction Title",
          description: "Transaction Description",
          industry: "GENERAL_GOODS_SERVICES",
          state: "CREATED",
          createdAt: "2025-01-30 09:41:46",
          parties: {
            "0": {
              id: "2yxAxlhJokLeFpwj8W6vr",
              role: "SELLER",
            },
            "1": {
              id: "2yxAxlfMuCtJ8PSVK3Fad",
              role: "BUYER",
            },
          },
          allocations: {
            "0": {
              id: "2yxAxle6PoRgZCwhDcAnQ",
              value: 10000,
              daysToDeliver: 7,
              daysToInspect: 7,
              createdAt: "2025-01-30 09:41:46",
              updatedAt: "2025-01-30 09:41:46",
            },
          },
        }
      */

      expect(transactions).toBeTruthy();
    });

    it('should return a null if the transaction does not exist', async () => {
      const transactions = await getTransaction(mockClient, '1234');
      expect(transactions).toBeNull();
    });
  });

  describe('updateTransaction', () => {
    it('should do a basic query to update a transactions', async () => {
      const transactions = await updateTransaction(
        mockClient,
        {
          title: 'Transaction Title',
          description: 'Transaction Description',
          industry: 'GENERAL_GOODS_SERVICES',
          currency: 'ZAR',
          feeAllocation: 'SELLER',
          allocations: [
            {
              id: '2yxAxle6PoRgZCwhDcAnQ',
              title: 'Allocation Title',
              description: 'Allocation Description',
              value: 10005.0,
              daysToDeliver: 7,
              daysToInspect: 7,
            },
          ],
          parties: [
            {
              id: '2yxAxlhJokLeFpwj8W6vr',
              token: '2ysmz8wc9mpVjCJTM55e9',
              role: 'BUYER',
            },
            {
              id: '2yxAxlfMuCtJ8PSVK3Fad',
              token: '2ysGmerpmAyivgPzeeUcQ',
              role: 'SELLER',
            },
          ],
        },
        '2yxAxkx75wvtWjdJNUMAd',
      );
      expect(transactions).toBeTruthy();
    });
  });
});

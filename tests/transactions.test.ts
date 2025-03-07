import {
  createCheckoutLink,
  createTransaction,
  getTransaction,
  listTransactions,
  updateTransaction,
} from '../src/transactions';
import GraphQLClient from '../src/client';
import { config } from 'dotenv';

config();

describe('Transaction API functions', () => {
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
    it('should return a non-empty list of transactions', async () => {
      const transactions = await listTransactions(mockClient);
      expect(transactions).toBeTruthy();
      expect(Array.isArray(transactions)).toBe(true);
      expect(transactions?.length).toBeGreaterThan(0);
    });

    it('should return an empty array when no transactions exist', async () => {
      jest.spyOn(mockClient, 'request').mockResolvedValue({ transactions: [] });
      const transactions = await listTransactions(mockClient);
      expect(transactions).toEqual([]);
    });
  });

  describe('createTransaction', () => {
    it('should successfully create a transaction', async () => {
      const transaction = await createTransaction(mockClient, {
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
      expect(transaction).toBeTruthy();
      expect(transaction?.id).toBeDefined();
    });

    it('should successfully create a transaction with the actual data', async () => {
      const transaction = await createTransaction(mockClient, {
        title: 'Changed title',
        description:
          'This is a second test product that I want to create and see whether it is creating on the database.',
        industry: 'GENERAL_GOODS_SERVICES',
        currency: 'ZAR',
        feeAllocation: 'SELLER',
        allocations: [
          {
            title: 'General Sales Allocation',
            description: 'General allocation.',
            value: 50.8,
            daysToDeliver: 7,
            daysToInspect: 7,
          },
        ],
        parties: [
          {
            token: '2z2GwRUaRj3dMaOcxW5De',
            role: 'BUYER',
          },
          {
            token: '2z2GwzPWYhbqb86I60Pmt',
            role: 'SELLER',
          },
        ],
      });
      expect(transaction).toBeTruthy();
      expect(transaction?.id).toBeDefined();
    });

    it('should fail to create a transaction with missing fields', async () => {
      jest
        .spyOn(mockClient, 'request')
        .mockRejectedValue(new Error('Missing required fields'));
      await expect(createTransaction(mockClient, {} as any)).rejects.toThrow(
        'Missing required fields',
      );
    });
  });

  describe('getTransaction', () => {
    it('should return a transaction by ID', async () => {
      const transaction = await getTransaction(
        mockClient,
        '2yxAxkx75wvtWjdJNUMAd',
      );
      expect(transaction).toBeTruthy();
    });

    it('should return null for a non-existent transaction', async () => {
      const transaction = await getTransaction(mockClient, '1234');
      expect(transaction).toBeNull();
    });
  });

  describe('updateTransaction', () => {
    it('should successfully update a transaction', async () => {
      const updatedTransaction = await updateTransaction(mockClient, {
        id: '2yxAxkx75wvtWjdJNUMAd',
        title: 'Updated Transaction Title',
        description: 'Updated Transaction Description',
        industry: 'GENERAL_GOODS_SERVICES',
        currency: 'ZAR',
        feeAllocation: 'SELLER',
        allocations: [
          {
            id: '2yxAxle6PoRgZCwhDcAnQ',
            title: 'Updated Allocation Title',
            description: 'Updated Allocation Description',
            value: 10500.0,
            daysToDeliver: 5,
            daysToInspect: 5,
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
      });
      expect(updatedTransaction).toBeTruthy();
      expect(updatedTransaction).toEqual({
        id: '2yxAxkx75wvtWjdJNUMAd',
      });
    });

    it('should fail to update a non-existent transaction', async () => {
      jest
        .spyOn(mockClient, 'request')
        .mockRejectedValue(new Error('Transaction not found'));
      await expect(
        updateTransaction(mockClient, { id: 'invalid-id' }),
      ).rejects.toThrow('Transaction not found');
    });
  });

  describe('createCheckoutLink', () => {
    it('should successfully create a checkout link for a valid transaction', async () => {
      const checkoutLink = await createCheckoutLink(
        mockClient,
        '2yxAxkx75wvtWjdJNUMAd',
      );
      expect(typeof checkoutLink).toEqual('string');
    });

    it('should should return a null for a non-existent transaction', async () => {
      const checkoutLink = await createCheckoutLink(mockClient, 'non-existent');
      expect(checkoutLink).toBeNull();
    });
  });

  describe('Error handling', () => {
    it('should handle API errors gracefully', async () => {
      const transaction = await getTransaction(mockClient, 'invalid-id');
      expect(transaction).toBeNull();
    });
  });
});
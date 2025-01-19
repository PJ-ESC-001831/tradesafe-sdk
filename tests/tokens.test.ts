import { listTokens, getTokenById } from '../src/tokens';
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

  describe('listTokens', () => {
    it('should do a basic query to list the tokens', async () => {
      const tokens = await listTokens(mockClient);
      expect(tokens).toBeTruthy();
    });
  });

  describe('getTokenById', () => {
    it('should fetch a specific token by ID', async () => {
      const tokenId = '2ypwPd6zArWyrz64Onbty';
      const token = await getTokenById(mockClient, tokenId);
      expect(token).toBeTruthy();
      expect(token?.id).toBe(tokenId);
    });

    it('should return a null if the token ID does not exist', async () => {
      const tokenId = '2ypwPdxxxxxWyrz64Onbty';
      const token = await getTokenById(mockClient, tokenId);
      expect(token).toBeNull();
    });
  });

  describe('Client Authentication', () => {
    it('should authenticate the client', () => {
      expect(mockClient.isAuthenticated()).toBeTruthy();
    });
  });
});

import {
  listTokens,
  getTokenById,
  createToken,
  updateToken,
  getTokenStatement,
} from '../src/tokens';
import GraphQLClient from '../src/client';
import { config } from 'dotenv';
import { Token } from '../src/types';

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
      /*
        {
          "0": {
            id: "2ysn0GOPN5yMOVukPVsGY",
            name: null,
            reference: "SIT-XFPQSYT3",
            user: {
              givenName: null,
              familyName: null,
              email: "test@email.com",
              mobile: null,
            },
            organization: null,
          },
          "1": {
            id: "2ysmz8wc9mpVjCJTM55e9",
            name: null,
            reference: "SIT-XSXQBXBK",
            user: {
              givenName: null,
              familyName: null,
              email: "test@email.com",
              mobile: null,
            },
            organization: null,
          },
          "2": {
            id: "2ysmwm7j8CRIHpufRfQPA",
            name: null,
            reference: "SIT-XFNWH837",
            user: {
              givenName: null,
              familyName: null,
              email: "test@email.com",
              mobile: null,
            },
            organization: null,
          },
        }
      */
      expect(tokens).toBeTruthy();
    });
  });

  describe('getTokenById', () => {
    it('should fetch a specific token by ID', async () => {
      const tokenId = '2ysn0GOPN5yMOVukPVsGY';
      const token = await getTokenById(mockClient, tokenId);
      /*
        Example response: {
          id: "2ypwPd6zArWyrz64Onbty",
          name: "co-maker t/a co-maker",
          reference: "SIT-XVPPH5GB",
          balance: 0,
          user: {
            givenName: "Jacques",
            familyName: "Barnard",
            email: "co-maker@tri2b.me",
            mobile: "+27721535649",
          },
          organization: {
            name: "co-maker",
            tradeName: "co-maker",
            type: "SOLE_PROP",
            registration: "9303265094085",
            taxNumber: null,
          },
        }
      */
      expect(token).toBeTruthy();
      expect(token?.id).toBe(tokenId);
    });

    it('should return a null if the token ID does not exist', async () => {
      const tokenId = '2ypwPdxxxxxWyrz64Onbty';
      const token = await getTokenById(mockClient, tokenId);
      expect(token).toBeNull();
    });
  });

  describe('createToken', () => {
    it('should create a new token', async () => {
      const email = 'test@email.com';
      const token = await createToken(mockClient, { user: { email } });

      /*
       *    Example response: {
       *      id: "2ysn0GOPN5yMOVukPVsGY",
       *      user: {
       *        email: "test@email.com",
       *      },
       *    }
       */

      expect(token).toBeTruthy();
    });
  });

  describe('updateToken', () => {
    it('should update a token', async () => {
      const update = {
        id: '2ysn0GOPN5yMOVukPVsGY',
        user: {
          givenName: 'Test User',
        },
      } as Partial<Token>;
      const token = await updateToken(mockClient, update);

      /**
       *    Example Response: {
       *      id: "2ysn0GOPN5yMOVukPVsGY",
       *    }
       */

      expect(token).toEqual({ id: update.id });
    });
  });

  describe('getTokenStatement', () => {
    it('should retrieve a list of payments for the token', async () => {
      const token = await getTokenStatement(
        mockClient,
        '2ysn0GOPN5yMOVukPVsGY',
      );

      /**
       *    Example Response: {
       *      id: "2ysn0GOPN5yMOVukPVsGY",
       *    }
       */

      expect(token).toBeTruthy();
    });
  });

  describe('Client Authentication', () => {
    it('should authenticate the client', () => {
      expect(mockClient.isAuthenticated()).toBeTruthy();
    });
  });
});

const fetchMock = jest.fn();

import GraphQLClient from '../src/client';
import {
  MissingEnvironmentVariablesError,
  AuthorisationFailedError,
} from '../src/errors/auth';

global.fetch = fetchMock;

describe('GraphQLClient', () => {
  let client: GraphQLClient;

  beforeEach(() => {
    client = new GraphQLClient();
    jest.clearAllMocks();
  });

  describe('config', () => {
    it('should configure the client with clientId and secret', () => {
      const result = client.config('testClientId', 'testSecret');
      expect(result).toBeInstanceOf(GraphQLClient);
    });

    it('should throw an error if clientId or secret is missing', () => {
      expect(() => client.config('', 'testSecret')).toThrow(
        MissingEnvironmentVariablesError,
      );
      expect(() => client.config('testClientId', '')).toThrow(
        MissingEnvironmentVariablesError,
      );
    });
  });

  describe('authenticate', () => {
    it('should authenticate and set the Authorization header', async () => {
      const mockAccessToken = 'mockAccessToken';
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ access_token: mockAccessToken }),
      });

      client.config('testClientId', 'testSecret');
      const result = await client.authenticate();

      expect(result).toBeInstanceOf(GraphQLClient);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://auth.tradesafe.co.za/oauth/token',
        expect.any(Object),
      );
      expect(client.isAuthenticated()).toBeTruthy();
    });

    it('should throw an error if authentication fails', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized',
      });

      client.config('testClientId', 'testSecret');

      await expect(client.authenticate()).rejects.toThrow(
        AuthorisationFailedError,
      );
      expect(fetchMock).toHaveBeenCalled();
    });

    it('should throw an error if access token is not received', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

      client.config('testClientId', 'testSecret');

      await expect(client.authenticate()).rejects.toThrow(
        AuthorisationFailedError,
      );
    });
  });

  describe('request', () => {
    it('should send a GraphQL request and return data', async () => {
      const mockQuery = '{ testQuery }';
      const mockVariables = { var1: 'value1' };
      const mockData = { data: { test: 'response' } };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      });

      client.setAccessToken('mockToken');
      const result = await client.request(mockQuery, mockVariables);

      expect(result).toEqual(mockData.data);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.tradesafe.co.za/graphql',
        expect.objectContaining({
          method: 'POST',
          headers: {
            ...client.headers,
            Authorization: 'Bearer mockToken',
          },
          body: JSON.stringify({ query: mockQuery, variables: mockVariables }),
        }),
      );
    });

    it('should throw an error if the request fails', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      });

      await expect(client.request('{ testQuery }')).rejects.toThrow(
        'GraphQL request failed: Internal Server Error',
      );
      expect(fetchMock).toHaveBeenCalled();
    });

    it('should throw an error if the response contains GraphQL errors', async () => {
      const mockErrors = [{ message: 'Error occurred' }];

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ errors: mockErrors }),
      });

      await expect(client.request('{ testQuery }')).rejects.toThrow(
        `GraphQL errors: ${JSON.stringify(mockErrors)}`,
      );
    });
  });
});

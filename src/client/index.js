import errors from '../errors/index.js';

/**
 * A lightweight GraphQL client with built-in authentication.
 */
class GraphQLClient {
  /**
   * @param {string} endpoint - The GraphQL API endpoint.
   */
  constructor(endpoint) {
    if (!endpoint) {
      throw new Error('Endpoint is required for GraphQLClient.');
    }
    this.endpoint = endpoint;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Configures the client with authentication credentials.
   * @param {string} clientId - The client ID for authentication.
   * @param {string} secret - The client secret for authentication.
   * @returns {GraphQLClient} The configured instance of GraphQLClient.
   * @throws {errors.auth.MissingEnvironmentVariablesError} If `clientId` or `secret` are not provided.
   */
  config(clientId, secret) {
    if (!clientId || !secret) {
      console.error(
        'Please ensure that you have both the clientId and secret variables set.',
      );
      throw new errors.auth.MissingEnvironmentVariablesError();
    }

    this.clientId = clientId;
    this.secret = secret;
    return this;
  }

  /**
   * Authenticates the client and sets the `Authorization` header.
   * @returns {Promise<GraphQLClient>} The authenticated instance of GraphQLClient.
   * @throws {errors.auth.AuthorisationFailedError} If authentication fails.
   */
  async auth() {
    try {
      const response = await fetch('https://auth.tradesafe.co.za/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.secret,
        }).toString(),
      });

      if (!response.ok) {
        throw new errors.auth.AuthorisationFailedError(
          `Authentication failed: ${response.statusText}`,
        );
      }

      const { access_token: accessToken } = await response.json();

      if (!accessToken) {
        throw new errors.auth.AuthorisationFailedError(
          'Authentication failed: No access token received.',
        );
      }

      this.headers = {
        ...this.headers,
        Authorization: `Bearer ${accessToken}`,
      };

      return this;
    } catch (error) {
      console.error('Authentication error:', error.message);
      throw error;
    }
  }

  /**
   * Sends a GraphQL request to the configured endpoint.
   * @param {string} query - The GraphQL query or mutation.
   * @param {Object} [variables={}] - An optional object containing query variables.
   * @returns {Promise<Object>} The data returned from the GraphQL API.
   * @throws Error if the request fails or the response contains errors.
   */
  async request(query, variables = {}) {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.statusText}`);
      }

      const json = await response.json();

      if (json.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
      }

      return json.data;
    } catch (error) {
      console.error('GraphQL request error:', error.message);
      throw error;
    }
  }
}

export default GraphQLClient;

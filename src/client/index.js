import errors from '../errors/index.js';

/**
 * A lightweight GraphQL client with built-in authentication.
 */
class GraphQLClient {
  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Configures the client with authentication credentials.
   * @param {string} clientId The client ID for authentication.
   * @param {string} secret The client secret for authentication.
   * @param {string} endpoint - The GraphQL API endpoint.
   * @returns {GraphQLClient} The configured instance of GraphQLClient.
   * @throws MissingEnvironmentVariablesError if `clientId` or `secret` are not provided.
   */
  config(clientId, secret, endpoint) {
    if (!clientId || !secret) {
      console.error(
        'Please ensure that you have both the clientId, secret, and endpoint variables set.',
      );
      throw new errors.auth.MissingEnvironmentVariablesError();
    }

    this.endpoint = endpoint;
    this.clientId = clientId;
    this.secret = secret;

    return this;
  }

  /**
   * Authenticates the client and sets the `Authorization` header.
   * @returns {Promise<GraphQLClient>} The authenticated instance of GraphQLClient.
   * @throws AuthorisationFailedError if authentication fails.
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
      console.error(error.message);
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
        body: new URLSearchParams({ query, variables }).toString(),
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
      console.error(error.message);
      throw error;
    }
  }
}

export default GraphQLClient;

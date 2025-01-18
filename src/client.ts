import {
  MissingEnvironmentVariablesError,
  AuthorisationFailedError,
} from './errors/auth';

/**
 * A lightweight GraphQL client with built-in authentication.
 */
class GraphQLClient {
  private headers: Record<string, string>;
  private endpoint?: string;
  private clientId?: string;
  private secret?: string;

  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Configures the client with authentication credentials.
   * @param clientId - The client ID for authentication.
   * @param secret - The client secret for authentication.
   * @param endpoint - The GraphQL API endpoint.
   * @returns The configured instance of GraphQLClient.
   * @throws MissingEnvironmentVariablesError if `clientId` or `secret` are not provided.
   */
  config(clientId: string, secret: string, endpoint: string): GraphQLClient {
    if (!clientId || !secret) {
      console.error(
        'Please ensure that you have both the clientId, secret, and endpoint variables set.',
      );
      throw new MissingEnvironmentVariablesError();
    }

    this.endpoint = endpoint;
    this.clientId = clientId;
    this.secret = secret;

    return this;
  }

  /**
   * Authenticates the client and sets the `Authorization` header.
   * @returns The authenticated instance of GraphQLClient.
   * @throws AuthorisationFailedError if authentication fails.
   */
  async auth(): Promise<GraphQLClient> {
    if (!this.clientId || !this.secret) {
      throw new MissingEnvironmentVariablesError(
        'Authentication configuration is incomplete.',
      );
    }

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
        throw new AuthorisationFailedError(
          `Authentication failed: ${response.statusText}`,
        );
      }

      const { access_token: accessToken } = (await response.json()) as {
        access_token: string;
      };

      if (!accessToken) {
        throw new AuthorisationFailedError(
          'Authentication failed: No access token received.',
        );
      }

      this.headers = {
        ...this.headers,
        Authorization: `Bearer ${accessToken}`,
      };

      return this;
    } catch (error: any) {
      console.error(error.message);
      throw error;
    }
  }

  /**
   * Sends a GraphQL request to the configured endpoint.
   * @param query - The GraphQL query or mutation.
   * @param variables - An optional object containing query variables.
   * @returns The data returned from the GraphQL API.
   * @throws Error if the request fails or the response contains errors.
   */
  async request<T>(
    query: string,
    variables: Record<string, any> = {},
  ): Promise<T> {
    if (!this.endpoint) {
      throw new Error('GraphQL endpoint is not configured.');
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.statusText}`);
      }

      const json = (await response.json()) as { data: T; errors?: any[] };

      if (json.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
      }

      return json.data;
    } catch (error: any) {
      console.error(error.message);
      throw error;
    }
  }
}

export default GraphQLClient;

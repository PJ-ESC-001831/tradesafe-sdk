import {
  MissingEnvironmentVariablesError,
  AuthorisationFailedError,
} from './errors/auth';
import {
  GraphQLEndpointNotConfiguredError,
  GraphQLRequestFailedError,
} from './errors/graphql';

/**
 * A lightweight GraphQL client with built-in authentication.
 */
class GraphQLClient {
  public headers: Record<string, string>;
  public endpoint?: string;
  private clientId?: string;
  private secret?: string;
  private accessToken?: string;

  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
    };
    this.endpoint =
      process.env.TRADESAFE_ENDPOINT ||
      'https://api-developer.tradesafe.dev/graphql';
  }

  /**
   * Configures the client with authentication credentials.
   *
   * @param clientId - The client ID for authentication.
   * @param secret - The client secret for authentication.
   * @returns The configured instance of GraphQLClient.
   * @throws MissingEnvironmentVariablesError if `clientId` or `secret` are not provided.
   */
  public config(clientId: string, secret: string): GraphQLClient {
    if (!clientId || !secret) {
      console.error(
        'Please ensure that you have both the clientId, secret, and endpoint variables set.',
      );
      throw new MissingEnvironmentVariablesError();
    }

    this.clientId = clientId;
    this.secret = secret;

    return this;
  }

  /**
   * Proxy for whether the client is authenticated without exposing the access token.
   */
  public isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * Authenticates the client and sets the `Authorization` header.
   *
   * @returns The authenticated instance of GraphQLClient.
   * @throws AuthorisationFailedError if authentication fails.
   */
  public async authenticate(): Promise<GraphQLClient> {
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

      this.setAccessToken(accessToken);

      return this;
    } catch (error: any) {
      console.error(error.message);
      throw error;
    }
  }

  /**
   * Allows you to set the token for testing purposes.
   * @param accessToken
   */
  public setAccessToken(accessToken: string): void {
    this.accessToken = accessToken;
  }

  /**
   * Sends a GraphQL request to the configured endpoint.
   *
   * @param query The GraphQL query or mutation.
   * @param operationName Name of the operation to read data from.
   * @param variables An optional object containing query variables.
   * @returns The data returned from the GraphQL API.
   * @throws Error if the request fails or the response contains errors.
   */
  public async request<T>(
    query: string,
    operationName: string,
    variables: Record<string, any> = {},
  ): Promise<T | null> {
    type ResponseType = {
      data: { [operationName: string]: T };
      errors?: any[];
    };

    if (!this.endpoint) {
      throw new GraphQLEndpointNotConfiguredError();
    }

    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          ...this.headers,
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({ query, variables }),
      };
      const response = await fetch(this.endpoint, requestOptions);

      if (!response.ok) {
        throw new GraphQLRequestFailedError(`${response.statusText}`);
      }

      const json = (await response.json()) as {
        data: T;
        errors?: any[];
      } as ResponseType;

      if (json.errors && !json.data[operationName]) {
          throw new GraphQLRequestFailedError(
            `GraphQL errors: ${JSON.stringify(json.errors)}`,
          );
        } else if (json.errors) {
          console.error(json.errors);
        }

      return (json.data as { [operationName: string]: T })[operationName];
    } catch (error: any) {
      // If the object being queried for does not give a response.
      if (error.message.includes('No query results')) return null;

      console.error(error.message);

      throw error;
    }
  }
}

export default GraphQLClient;

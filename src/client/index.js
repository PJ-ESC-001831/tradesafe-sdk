import {
  MissingEnvironmentVariablesError,
  AuthorisationFailedError,
} from '../errors';

class GraphQLClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.headers = {
      'Content-Type': 'application/json',
    };

    this.checkEnvVariables();
  }

  checkEnvVariables() {
    if (!process.env.TRADESAFE_CLIENT_ID || !process.env.TRADESAFE_SECRET) {
      console.error(
        'Please ensure that you have both the TRADESAFE_CLIENT_ID and TRADESAFE_SECRET environment variables set.',
      );
      throw new MissingEnvironmentVariablesError();
    }
  }

  async auth() {
    const authorisedResponse = await fetch(
      'https://auth.tradesafe.co.za/oauth/token',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: {
          grant_type: 'client_credentials',
          client_id: process.env.TRADESAFE_CLIENT_ID,
          client_secret: process.env.YOUR_CLIENT_SECRET,
        },
      },
    );

    if (!authorisedResponse.access_token) throw new AuthorisationFailedError();

    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${authorisedResponse.access_token}`,
    };
  }

  async request(query, variables = {}) {
    const body = JSON.stringify({ query, variables });

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: this.headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`GraphQL error: ${response.statusText}`);
    }

    const json = await response.json();
    if (json.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
    }

    return json.data;
  }
}

module.exports = GraphQLClient;

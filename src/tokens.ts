import GraphQLClient from './client';
import { Token } from './types';

/**
 * Fetches a list of tokens from the GraphQL API.
 *
 * @param {GraphQLClient} client - The GraphQL client instance to use for the request.
 * @returns {Promise<Token[]>} A promise that resolves to the list of tokens.
 */
export async function listTokens(
  client: GraphQLClient,
): Promise<Token[] | null> {
  const query = `
    query {
      tokens {
        data {
          id
          name
          reference
          user {
            givenName
            familyName
            email
            mobile
          }
          organization {
            name
            tradeName
            type
            registration
            taxNumber
          }
        }
      }
    }
  `;

  const response: { data: Token[] } | null = await client.request(
    query,
    'tokens',
  );
  if (!response) return null;

  return response.data;
}

/**
 * Fetches a specific token by ID from the GraphQL API.
 *
 * @param {GraphQLClient} client - The GraphQL client instance to use for the request.
 * @param {string} id - The ID of the token to fetch.
 * @returns {Promise<Token | null>} A promise that resolves to the token data.
 */
export async function getTokenById(
  client: GraphQLClient,
  id: string,
): Promise<Token | null> {
  const query = `
    query ($id: ID!) {
      token(id: $id) {
        id
        name
        reference
        balance
        user {
          givenName
          familyName
          email
          mobile
        }
        organization {
          name
          tradeName
          type
          registration
          taxNumber
        }
      }
    }
  `;

  const variables = { id };
  return client.request(query, 'token', variables);
}

/**
 * Creates a new token using the GraphQL API.
 *
 * @param {GraphQLClient} client - The GraphQL client instance to use for the request.
 * @param {object} input - The input data for creating the token.
 * @returns {Promise<Token | null>} A promise that resolves to the created token.
 */
export async function createToken(
  client: GraphQLClient,
  input: Partial<Token>,
): Promise<Token | null> {
  const mutation = `
    mutation ($input: TokenInput!) {
      tokenCreate(input: $input) {
        id
        user {
          email
        }
      }
    }
  `;

  const variables = { input };
  const response = await client.request(mutation, 'tokenCreate', variables) as Token|null;

  return response;
}

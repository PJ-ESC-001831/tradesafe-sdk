import GraphQLClient from './client';
import { Transaction } from './types';

/**
 * Fetches a list of transactions from the GraphQL API.
 *
 * @param {GraphQLClient} client - The GraphQL client instance to use for the request.
 * @returns {Promise<Transaction[]>} A promise that resolves to the list of transactions.
 */
export async function listTransactions(
  client: GraphQLClient,
): Promise<Transaction[] | null> {
  const query = `
    query transactions {
      transactions {
        data {
          title
          description
          industry
          state
          createdAt
        }
      }
    }
  `;

  const response: { data: Transaction[] } | null = await client.request(
    query,
    'transactions',
  );
  if (!response) return null;

  return response.data;
}

import GraphQLClient from './client';
import { Transaction, TransactionInput } from './types';

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

/**
 * Creates a new transaction using the GraphQL API.
 *
 * @param {GraphQLClient} client - The GraphQL client instance to use for the request.
 * @param {object} input - The transaction input data.
 * @returns {Promise<Transaction | null>} A promise that resolves to the created transaction.
 */
export async function createTransaction(
  client: GraphQLClient,
  input: TransactionInput,
): Promise<Transaction | null> {
  const mutation = `
    mutation transactionCreate($input: CreateTransactionInput!) {
      transactionCreate(input: $input) {
        id
      }
    }
  `;

  // Same endpoint to serve create and update functions.
  const inputWithActions = {
    ...input,
    allocations: {
      create: input.allocations,
    },
    parties: {
      create: input.parties,
    },
  };

  const response: Transaction | null = await client.request(
    mutation,
    'transactionCreate',
    {
      input: inputWithActions,
    },
  );
  if (!response) return null;

  return response;
}

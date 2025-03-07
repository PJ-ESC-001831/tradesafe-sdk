import GraphQLClient from './client';
import { GraphQLRequestFailedError } from './errors/graphql';
import { Transaction, TransactionInput, TransactionUpdateInput } from './types';

/**
 * Executes a GraphQL query or mutation and returns the response.
 *
 * @param {GraphQLClient} client - The GraphQL client instance.
 * @param {string} query - The GraphQL query or mutation string.
 * @param {string} key - The key to extract data from the response.
 * @param {object} [variables={}] - Optional variables for the request.
 * @returns {Promise<any | null>} The extracted data or null if the request fails.
 * @throws {GraphQLRequestFailedError} If the GraphQL request fails.
 */
async function executeRequest(
  client: GraphQLClient,
  query: string,
  key: string,
  variables: object = {},
): Promise<any | null> {
  try {
    const response = await client.request(query, key, variables);
    return response || null;
  } catch (error) {
    const { message = undefined } = error as unknown & { message?: string };

    throw new GraphQLRequestFailedError(message);
  }
}

/**
 * Fetches a list of transactions from the GraphQL API.
 *
 * @param {GraphQLClient} client - The GraphQL client instance.
 * @returns {Promise<Transaction[] | null>} A promise resolving to the list of transactions.
 */
export async function listTransactions(
  client: GraphQLClient,
): Promise<Transaction[] | null> {
  const query = `
    query {
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
  const response = await executeRequest(client, query, 'transactions');

  return response?.data || [];
}

/**
 * Retrieves a single transaction by ID from the GraphQL API.
 *
 * @param {GraphQLClient} client - The GraphQL client instance.
 * @param {string} id - The transaction ID.
 * @returns {Promise<Transaction | null>} The retrieved transaction or null if not found.
 */
export async function getTransaction(
  client: GraphQLClient,
  id: string,
): Promise<Transaction | null> {
  const query = `
    query ($id: ID!) {
      transaction(id: $id) {
        title
        description
        industry
        state
        createdAt
        parties { id role }
        allocations { id value daysToDeliver daysToInspect createdAt updatedAt }
      }
    }
  `;
  return executeRequest(client, query, 'transaction', { id });
}

/**
 * Creates a new transaction using the GraphQL API.
 *
 * @param {GraphQLClient} client - The GraphQL client instance.
 * @param {TransactionInput} input - The transaction input data.
 * @returns {Promise<Transaction | null>} The created transaction or null on failure.
 */
export async function createTransaction(
  client: GraphQLClient,
  input: TransactionInput,
): Promise<Pick<Transaction, 'id'>> {
  const mutation = `
    mutation ($input: CreateTransactionInput!) {
      transactionCreate(input: $input) { id }
    }
  `;
  const variables = {
    input: {
      ...input,
      allocations: { create: input.allocations },
      parties: { create: input.parties },
    },
  };
  const response = await executeRequest(
    client,
    mutation,
    'transactionCreate',
    variables,
  );

  return response;
}

/**
 * Updates an existing transaction using the GraphQL API.
 *
 * @param {GraphQLClient} client - The GraphQL client instance.
 * @param {TransactionInput} input - The transaction input data.
 * @returns {Promise<Transaction | null>} The updated transaction or null on failure.
 */
export function updateTransaction(
  client: GraphQLClient,
  input: TransactionUpdateInput,
): Promise<Transaction | null> {
  const mutation = `
    mutation ($input: UpdateTransactionInput!) {
      transactionUpdate(input: $input) { id }
    }
  `;
  const variables = {
    input: {
      ...input,
      allocations: { update: input.allocations },
      parties: { update: input.parties },
    },
  };
  return executeRequest(client, mutation, 'transactionUpdate', variables);
}

/**
 * Generates a checkout link for a given transaction.
 *
 * @param {GraphQLClient} client - The TradeSafe GraphQL client.
 * @param {string} transactionId - The ID of the transaction.
 * @returns {Promise<string>} The checkout link for the transaction.
 * @throws {Error} If the request fails or returns an invalid response.
 */
export async function createCheckoutLink(
  client: GraphQLClient,
  transactionId: string,
): Promise<string> {
  const mutation = `
    mutation ($transactionId: ID!) {
      checkoutLink(transactionId: $transactionId)
    }
  `;

  const variables = { transactionId };

  return await executeRequest(client, mutation, 'checkoutLink', variables);
}

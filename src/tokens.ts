import GraphQLClient from './client';
import { Token } from './types';

export async function listTokens(client: GraphQLClient): Promise<Token> {
  const query = `
    query tokens {
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

  return await client.request(query, 'tokens');
}

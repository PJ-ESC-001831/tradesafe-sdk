import BaseError from './base';

export class GraphQLResponseNotOkError extends BaseError {
  constructor(
    message: string = 'The response from the GraphQL request did not return an OK.',
  ) {
    super('GraphQLResponseNotOkError', message, 'graphql');
  }
}

export class GraphQLRequestFailedError extends BaseError {
  constructor(message: string = 'The request to the GraphQL client failed.') {
    super('GraphQLRequestFailedError', message, 'graphql');
  }
}

import BaseError from './base.js';

class GraphQLResponseNotOkError extends BaseError {
  constructor(
    message = 'The response from the GraphQL request did not return an OK.',
  ) {
    super('MissingEnvironmentVariablesError', message, 'graphql');
  }
}

class GraphQLRequestFailedError extends BaseError {
  constructor(message = 'The request to the GraphQL client failed.') {
    super('GraphQLRequestFailedError', message, 'graphql');
  }
}

export default {
  GraphQLResponseNotOkError,
  GraphQLRequestFailedError,
};

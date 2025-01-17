import BaseError from './base.js';

class MissingEnvironmentVariablesError extends BaseError {
  constructor(
    message = 'All of the required environment variables are not set.',
  ) {
    super('MissingEnvironmentVariablesError', message, 'auth');
  }
}

class AuthorisationFailedError extends BaseError {
  constructor(message = 'Failed to authorise on the Tradesafe service.') {
    super('AuthorisationFailedError', message, 'auth');
  }
}

export default {
  MissingEnvironmentVariablesError,
  AuthorisationFailedError,
};

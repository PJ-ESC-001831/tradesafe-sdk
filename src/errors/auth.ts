import BaseError from './base';

export class MissingEnvironmentVariablesError extends BaseError {
  constructor(
    message: string = 'All of the required environment variables are not set.',
  ) {
    super('MissingEnvironmentVariablesError', message, 'auth');
  }
}

export class AuthorisationFailedError extends BaseError {
  constructor(
    message: string = 'Failed to authorise on the Tradesafe service.',
  ) {
    super('AuthorisationFailedError', message, 'auth');
  }
}

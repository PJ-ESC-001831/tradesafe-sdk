class MissingEnvironmentVariablesError extends Error {
  constructor(
    message = 'All of the required environment variables are not set.',
  ) {
    super(message);
    this.name = 'MissingEnvironmentVariablesError';
  }
}

class AuthorisationFailedError extends Error {
  constructor(message = 'Failed to authorise on the Tradesafe service.') {
    super(message);
    this.name = 'AuthorisationFailedError';
  }
}

module.exports = {
  MissingEnvironmentVariablesError,
  AuthorisationFailedError,
};

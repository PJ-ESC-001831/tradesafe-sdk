class BaseError extends Error {
  constructor(name, message, namespace = 'DEFAULT') {
    super(message);
    this.name = name;
  }
}

export default BaseError;

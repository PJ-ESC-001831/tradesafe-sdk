export default class BaseError extends Error {
  public namespace: string;

  constructor(name: string, message: string, namespace: string = 'DEFAULT') {
    super(message);
    this.name = name;
    this.namespace = namespace;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

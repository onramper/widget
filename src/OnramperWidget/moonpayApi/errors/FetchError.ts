export default class FetchError extends Error {
  constructor(public errorObject: any) {
    super(JSON.stringify(errorObject));

    this.name = 'FetchError';
  }
}

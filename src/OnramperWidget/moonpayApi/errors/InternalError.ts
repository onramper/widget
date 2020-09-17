export default class Internal extends Error {
  constructor(...params: any[]) {
    super(...params);
    this.name = 'Internal';
  }
}

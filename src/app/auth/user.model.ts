export class User {
  constructor(
    public id: string,
    public email: string,
    public _token: string,
    public _tokenExpiration: Date
  ) {}

  get token() {
    if (!this._tokenExpiration || new Date() > this._tokenExpiration) {
      return null;
    }
    return this._token;
  }
}

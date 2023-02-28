export interface CustomError extends Error {
  statusCode: number;
  statusMessage: string;
}

export class HTTPError extends Error implements CustomError {
  constructor(
    public statusCode: number,
    public statusMessage: string,
    public message: string,
    public options?: ErrorOptions
  ) {
    super(message, options);
    this.name = 'HTTP Error';
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
  }
}

new HTTPError(450, 'Error de algo', 'Mas info', { cause: 'Esta misma' });

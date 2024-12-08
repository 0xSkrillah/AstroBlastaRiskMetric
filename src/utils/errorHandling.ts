export class PriceServiceError extends Error {
  constructor(message: string, public readonly symbol?: string) {
    super(message);
    this.name = 'PriceServiceError';
  }
}
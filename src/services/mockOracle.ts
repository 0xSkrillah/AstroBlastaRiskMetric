import { TokenPrice } from '../types/oracle';
import { generateMockPrice } from './mockPriceData';
import { PriceServiceError, handlePriceServiceError } from '../utils/errorHandling';

export class MockOracleService {
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  private simulateNetworkDelay(): Promise<void> {
    const delay = 100 + Math.random() * 200;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  private shouldSimulateError(): boolean {
    return Math.random() < 0.01; // 1% chance of error
  }

  private async retry<T>(operation: () => Promise<T>, symbol: string, attempt = 1): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= this.maxRetries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      return this.retry(operation, symbol, attempt + 1);
    }
  }

  async getTokenPrice(symbol: string): Promise<TokenPrice> {
    return this.retry(async () => {
      await this.simulateNetworkDelay();
      
      if (this.shouldSimulateError()) {
        throw new PriceServiceError(`Network error fetching price for ${symbol}`, symbol);
      }
      
      return generateMockPrice(symbol);
    }, symbol);
  }

  async getMultipleTokenPrices(symbols: string[]): Promise<TokenPrice[]> {
    try {
      const results = await Promise.allSettled(
        symbols.map(symbol => this.getTokenPrice(symbol))
      );
      
      const prices: TokenPrice[] = [];
      const errors: Error[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          prices.push(result.value);
        } else {
          errors.push(new PriceServiceError(`Failed to fetch ${symbols[index]}: ${result.reason.message}`));
        }
      });

      if (errors.length === symbols.length) {
        throw new PriceServiceError('Failed to fetch all token prices');
      }

      return prices;
    } catch (error) {
      throw handlePriceServiceError(error);
    }
  }
}
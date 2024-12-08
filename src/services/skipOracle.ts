import { TokenPrice } from '../types/oracle';
import { PriceServiceError } from '../utils/errorHandling';
import { withRetry } from '../utils/retry';
import { SkipClient } from './api/skipClient';
import { SKIP_API } from './api/endpoints';

interface SkipPriceResponse {
  price: string;
  timestamp: string;
}

export class SkipOracleService {
  private client: SkipClient;

  constructor() {
    this.client = new SkipClient();
  }

  async getTokenPrice(symbol: string): Promise<TokenPrice> {
    return withRetry(async () => {
      try {
        const data = await this.client.get<SkipPriceResponse>(
          SKIP_API.TOKEN_PRICE(symbol)
        );
        
        return {
          symbol,
          price: Number(data.price),
          timestamp: Date.now()
        };
      } catch (error) {
        throw new PriceServiceError(
          `Failed to fetch price for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          symbol
        );
      }
    });
  }

  async getMultipleTokenPrices(symbols: string[]): Promise<TokenPrice[]> {
    try {
      const results = await Promise.allSettled(
        symbols.map(symbol => this.getTokenPrice(symbol))
      );
      
      const prices: TokenPrice[] = [];
      const errors: PriceServiceError[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          prices.push(result.value);
        } else {
          errors.push(
            new PriceServiceError(
              `Failed to fetch ${symbols[index]}: ${result.reason.message}`,
              symbols[index]
            )
          );
        }
      });

      if (errors.length === symbols.length) {
        const errorMessages = errors.map(e => e.message).join('; ');
        throw new PriceServiceError(`Failed to fetch all token prices: ${errorMessages}`);
      }

      return prices;
    } catch (error) {
      if (error instanceof PriceServiceError) {
        throw error;
      }
      throw new PriceServiceError(`Error fetching multiple token prices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
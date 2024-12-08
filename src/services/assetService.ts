import axios, { AxiosError } from 'axios';
import { ENDPOINTS } from './api/endpoints';
import { AssetResponse, AstroAsset } from '../types/asset';
import { Cache } from '../utils/cache';
import { Throttle } from '../utils/throttle';

export class AssetService {
  private static cache = new Cache<AstroAsset[]>(30000); // 30 second cache
  private static throttle = new Throttle(2000); // 2 second minimum between requests
  private static retryDelay = 1000; // 1 second delay between retries
  private static maxRetries = 3;

  private static async fetchWithRetry(
    attempt: number = 1
  ): Promise<AstroAsset[]> {
    try {
      await this.throttle.throttle();

      const response = await axios.get<AssetResponse>(
        `${ENDPOINTS.ASTROVAULT.BASE_URL}${ENDPOINTS.ASTROVAULT.ASSETS}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data.ok || !Array.isArray(response.data.data)) {
        throw new Error('Invalid response format from Astrovault API');
      }

      const assets = response.data.data.filter(asset => 
        typeof asset.price === 'number' && 
        typeof asset.price_24h_change === 'number' &&
        !isNaN(asset.price) && 
        !isNaN(asset.price_24h_change)
      );

      this.cache.set(assets);
      return assets;

    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 429) {
        if (attempt < this.maxRetries) {
          await new Promise(resolve => 
            setTimeout(resolve, this.retryDelay * attempt)
          );
          return this.fetchWithRetry(attempt + 1);
        }
      }
      throw error;
    }
  }

  static async getAssetPrices(): Promise<AstroAsset[]> {
    try {
      const cachedData = this.cache.get();
      if (cachedData) {
        return cachedData;
      }

      return await this.fetchWithRetry();
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Network error: ${error.message}`);
      }
      if (error instanceof Error) {
        throw new Error(`Failed to fetch asset prices: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while fetching asset prices');
    }
  }
}
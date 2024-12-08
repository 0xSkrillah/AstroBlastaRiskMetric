import axios, { AxiosInstance } from 'axios';
import { SKIP_API } from './endpoints';

export class SkipClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: SKIP_API.BASE_URL,
      timeout: 5000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await this.client.get<T>(endpoint);
    return response.data;
  }
}
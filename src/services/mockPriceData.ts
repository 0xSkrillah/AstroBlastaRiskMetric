import { TokenPrice } from '../types/oracle';

// Initial price ranges for tokens
const BASE_PRICES: { [key: string]: number } = {
  BTC: 65000,
  ETH: 3500,
  SOL: 125,
  ATOM: 9
};

// Volatility factors for each token (percentage)
const VOLATILITY: { [key: string]: number } = {
  BTC: 2,
  ETH: 3,
  SOL: 5,
  ATOM: 4
};

export function generateMockPrice(symbol: string): TokenPrice {
  const basePrice = BASE_PRICES[symbol];
  const volatility = VOLATILITY[symbol];
  
  // Generate random price movement within volatility range
  const changePercent = (Math.random() - 0.5) * 2 * volatility;
  const newPrice = basePrice * (1 + changePercent / 100);
  
  return {
    symbol,
    price: Number(newPrice.toFixed(2)),
    timestamp: Date.now()
  };
}
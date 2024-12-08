import { TokenPrice } from '../types/oracle';

export interface PriceHistoryRecord {
  [key: string]: TokenPrice[];
}

export function updatePriceHistory(
  currentHistory: PriceHistoryRecord,
  newPrices: TokenPrice[],
  maxHistoryLength: number = 2
): PriceHistoryRecord {
  const newHistory = { ...currentHistory };
  
  newPrices.forEach(price => {
    const tokenHistory = newHistory[price.symbol] || [];
    newHistory[price.symbol] = [...tokenHistory, price].slice(-maxHistoryLength);
  });
  
  return newHistory;
}
export interface TokenPrice {
  symbol: string;
  price: number;
  timestamp: number;
}

export interface PriceHistory {
  symbol: string;
  prices: TokenPrice[];
}

export interface RiskAssessment {
  symbol: string;
  priceChangePercent: number;
  riskLevel: 1 | 2 | 3;
  currentPrice: number;
  previousPrice: number;
  timestamp: number;
}
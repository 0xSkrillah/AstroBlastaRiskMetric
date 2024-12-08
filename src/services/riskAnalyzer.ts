import { AstroAsset } from '../types/asset';

export interface RiskAssessment {
  symbol: string;
  currentPrice: number;
  priceChangePercent: number;
  riskLevel: 1 | 2 | 3;
  timestamp: number;
  chainId: string;
}

export interface RiskThresholds {
  low: number;
  medium: number;
  high: number;
}

export class RiskAnalyzer {
  static calculateRiskLevel(
    priceChangePercent: number,
    thresholds: RiskThresholds
  ): 1 | 2 | 3 {
    const absChange = Math.abs(priceChangePercent);
    if (absChange < thresholds.low) return 1;
    if (absChange < thresholds.medium) return 2;
    if (absChange < thresholds.high) return 3;
    return 3;
  }

  static analyzeAssetRisk(
    asset: AstroAsset,
    thresholds: RiskThresholds
  ): RiskAssessment {
    return {
      symbol: asset.symbol,
      currentPrice: asset.price,
      priceChangePercent: asset.price_24h_change,
      riskLevel: this.calculateRiskLevel(asset.price_24h_change, thresholds),
      timestamp: Date.now(),
      chainId: asset.contextChainId
    };
  }
}
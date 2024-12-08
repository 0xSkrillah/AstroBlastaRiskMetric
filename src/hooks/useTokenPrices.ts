import { useState, useEffect, useCallback } from 'react';
import { TokenPrice, RiskAssessment } from '../types/oracle';
import { SkipOracleService } from '../services/skipOracle';
import { RiskAnalyzer } from '../services/riskAnalyzer';
import { useSettings } from '../contexts/SettingsContext';
import { PriceHistoryRecord, updatePriceHistory } from '../utils/priceHistory';

export function useTokenPrices(symbols: string[]) {
  const { riskThresholds, pollingInterval } = useSettings();
  const [priceHistory, setPriceHistory] = useState<PriceHistoryRecord>({});
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchPrices = useCallback(async () => {
    const skipOracle = new SkipOracleService();
    
    try {
      setLoading(true);
      const prices = await skipOracle.getMultipleTokenPrices(symbols);
      
      if (prices.length > 0) {
        setPriceHistory(prev => updatePriceHistory(prev, prices));
        setRetryCount(0);

        const assessments = prices.map(currentPrice => {
          const history = priceHistory[currentPrice.symbol] || [];
          const previousPrice = history[0];
          return previousPrice 
            ? RiskAnalyzer.analyzeRisk(currentPrice, previousPrice, riskThresholds)
            : null;
        }).filter((assessment): assessment is RiskAssessment => assessment !== null);

        setRiskAssessments(assessments);
        setError(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch prices';
      setError(errorMessage);
      
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setTimeout(fetchPrices, 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [symbols, riskThresholds, priceHistory, retryCount]);

  useEffect(() => {
    fetchPrices();
    const intervalId = setInterval(fetchPrices, pollingInterval);
    return () => clearInterval(intervalId);
  }, [fetchPrices, pollingInterval]);

  return { priceHistory, riskAssessments, loading, error };
}
import { useState, useEffect, useCallback } from 'react';
import { AssetService } from '../services/assetService';
import { RiskAnalyzer, RiskAssessment } from '../services/riskAnalyzer';
import { useSettings } from '../contexts/SettingsContext';

export function useAssetRisk() {
  const { riskThresholds, pollingInterval } = useSettings();
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchAssetRisk = useCallback(async () => {
    try {
      if (!loading) setLoading(true);
      
      const assets = await AssetService.getAssetPrices();
      const newAssessments = assets.map(asset => ({
        ...RiskAnalyzer.analyzeAssetRisk(asset, riskThresholds),
        timestamp: Date.now()
      }));

      setAssessments(newAssessments);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch asset data';
      console.error('Asset risk fetch error:', errorMessage);
      setError(errorMessage);

      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setTimeout(fetchAssetRisk, 2000 * (retryCount + 1));
      }
    } finally {
      setLoading(false);
    }
  }, [riskThresholds, loading, retryCount]);

  useEffect(() => {
    fetchAssetRisk();
    const interval = setInterval(fetchAssetRisk, pollingInterval);
    return () => clearInterval(interval);
  }, [fetchAssetRisk, pollingInterval]);

  return { assessments, loading, error };
}
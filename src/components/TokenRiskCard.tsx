import React from 'react';
import { RiskAssessment } from '../services/riskAnalyzer';
import { RiskIndicator } from './RiskIndicator';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPrice, formatPercentage, formatTime } from '../utils/formatters';

interface TokenRiskCardProps {
  assessment: RiskAssessment;
}

export function TokenRiskCard({ assessment }: TokenRiskCardProps) {
  const isPositiveChange = assessment.priceChangePercent >= 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center">
            <h3 className="text-xl font-bold">{assessment.symbol}</h3>
            <span className="ml-2 text-sm text-gray-500">
              ({assessment.chainId})
            </span>
          </div>
          <p className="text-gray-600">
            ${formatPrice(assessment.currentPrice)}
          </p>
        </div>
        <RiskIndicator level={assessment.riskLevel} />
      </div>
      
      <div className="flex items-center">
        {isPositiveChange ? (
          <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
        ) : (
          <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
        )}
        <span className={`font-medium ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
          {formatPercentage(assessment.priceChangePercent)}
        </span>
      </div>
      
      <div className="mt-2 text-sm text-gray-500">
        Last updated: {formatTime(assessment.timestamp)}
      </div>
    </div>
  );
}
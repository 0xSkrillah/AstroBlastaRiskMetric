import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface RiskIndicatorProps {
  level: 1 | 2 | 3;
}

export function RiskIndicator({ level }: RiskIndicatorProps) {
  const colors = {
    1: 'text-green-500',
    2: 'text-yellow-500',
    3: 'text-red-500'
  };

  const labels = {
    1: 'Low Risk',
    2: 'Medium Risk',
    3: 'High Risk'
  };

  return (
    <div className={`flex items-center ${colors[level]}`}>
      <AlertTriangle className="w-5 h-5 mr-2" />
      <span className="font-medium">{labels[level]}</span>
    </div>
  );
}
import React, { createContext, useContext, useState } from 'react';

interface RiskThresholds {
  low: number;
  medium: number;
  high: number;
}

interface SettingsContextType {
  riskThresholds: RiskThresholds;
  pollingInterval: number;
  updateRiskThresholds: (thresholds: RiskThresholds) => void;
  updatePollingInterval: (interval: number) => void;
}

const defaultSettings: SettingsContextType = {
  riskThresholds: {
    low: 1,
    medium: 3,
    high: 5,
  },
  pollingInterval: 5 * 60 * 1000, // 5 minutes
  updateRiskThresholds: () => {},
  updatePollingInterval: () => {},
};

const SettingsContext = createContext<SettingsContextType>(defaultSettings);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(defaultSettings);

  const updateRiskThresholds = (thresholds: RiskThresholds) => {
    setSettings(prev => ({
      ...prev,
      riskThresholds: thresholds,
    }));
  };

  const updatePollingInterval = (interval: number) => {
    setSettings(prev => ({
      ...prev,
      pollingInterval: interval,
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        updateRiskThresholds,
        updatePollingInterval,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
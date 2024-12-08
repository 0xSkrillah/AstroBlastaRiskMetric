import React from 'react';
import { Settings } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export function SettingsPanel() {
  const { riskThresholds, pollingInterval, updateRiskThresholds, updatePollingInterval } = useSettings();

  const handleThresholdChange = (type: 'low' | 'medium' | 'high', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateRiskThresholds({
        ...riskThresholds,
        [type]: numValue,
      });
    }
  };

  const handleIntervalChange = (value: string) => {
    const minutes = parseInt(value, 10);
    if (!isNaN(minutes)) {
      updatePollingInterval(minutes * 60 * 1000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center mb-4">
        <Settings className="w-5 h-5 mr-2 text-gray-600" />
        <h2 className="text-xl font-bold">Risk Metrics Settings</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-2">Risk Thresholds (%)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Low Risk Threshold
              </label>
              <input
                type="number"
                value={riskThresholds.low}
                onChange={(e) => handleThresholdChange('low', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                step="0.1"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Medium Risk Threshold
              </label>
              <input
                type="number"
                value={riskThresholds.medium}
                onChange={(e) => handleThresholdChange('medium', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                step="0.1"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                High Risk Threshold
              </label>
              <input
                type="number"
                value={riskThresholds.high}
                onChange={(e) => handleThresholdChange('high', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                step="0.1"
                min="0"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Update Interval</h3>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Polling Interval (minutes)
            </label>
            <input
              type="number"
              value={pollingInterval / (60 * 1000)}
              onChange={(e) => handleIntervalChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              min="1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { useAssetRisk } from './hooks/useAssetRisk';
import { TokenRiskCard } from './components/TokenRiskCard';
import { SettingsPanel } from './components/SettingsPanel';
import { SettingsProvider } from './contexts/SettingsContext';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { assessments, loading, error } = useAssetRisk();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg shadow max-w-lg">
          <h2 className="font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Crypto Risk Monitor</h1>
          <p className="text-gray-600 mt-2">
            Real-time risk assessment based on price volatility across multiple chains
          </p>
        </header>

        <SettingsPanel />

        {loading && assessments.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading asset data...</span>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assessments.map((assessment) => (
              <TokenRiskCard 
                key={`${assessment.symbol}-${assessment.chainId}`}
                assessment={assessment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App;
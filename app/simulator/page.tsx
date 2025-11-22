'use client';

import { useState } from 'react';
import { runSimulation, SimulationInput, SimulationResult } from '@/lib/api';

export default function SimulatorPage() {
  const [inputs, setInputs] = useState<SimulationInput>({
    body_temperature: 38.5,
    imu_variance: 0.5,
    thi: 72,
  });
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const prediction = await runSimulation(inputs);
      setResult(prediction);
    } catch (err) {
      setError('Failed to run simulation. Please check your backend connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      normal: 'bg-green-600 text-white',
      warning: 'bg-yellow-600 text-white',
      'high-risk': 'bg-red-600 text-white',
    };
    return (
      <span
        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold ${
          styles[status as keyof typeof styles] || styles.normal
        }`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Anomaly Simulator</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Test predictions with custom parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Input Section */}
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-700">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Simulation Parameters</h2>

          {/* Body Temperature */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Body Temperature
              </label>
              <span className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                {inputs.body_temperature.toFixed(2)}°C
              </span>
            </div>
            <input
              type="range"
              min="35"
              max="42"
              step="0.1"
              value={inputs.body_temperature}
              onChange={(e) =>
                setInputs({ ...inputs, body_temperature: parseFloat(e.target.value) })
              }
              className="w-full h-3 sm:h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 touch-manipulation"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>35°C</span>
              <span>42°C</span>
            </div>
          </div>

          {/* IMU Variance */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                IMU Movement Variance
              </label>
              <span className="text-lg sm:text-xl font-bold text-yellow-600 dark:text-yellow-400">
                {inputs.imu_variance.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={inputs.imu_variance}
              onChange={(e) =>
                setInputs({ ...inputs, imu_variance: parseFloat(e.target.value) })
              }
              className="w-full h-3 sm:h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-600 touch-manipulation"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0 (Low)</span>
              <span>2 (High)</span>
            </div>
          </div>

          {/* THI */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                THI (Temperature-Humidity Index)
              </label>
              <span className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                {inputs.thi.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="90"
              step="0.5"
              value={inputs.thi}
              onChange={(e) =>
                setInputs({ ...inputs, thi: parseFloat(e.target.value) })
              }
              className="w-full h-3 sm:h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-600 touch-manipulation"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>60</span>
              <span>90</span>
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 font-semibold text-base sm:text-lg touch-manipulation"
          >
            {loading ? 'Running Simulation...' : 'Run Simulation'}
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-700">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Simulation Results</h2>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              <div className="flex items-center">
                <span className="text-xl mr-2">⚠️</span>
                <span className="font-semibold">{error}</span>
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8 sm:py-12">
              <div className="text-4xl sm:text-5xl mb-4 opacity-50">🔬</div>
              <div className="text-sm sm:text-base">Adjust parameters and click "Run Simulation" to see predictions</div>
            </div>
          )}

          {loading && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8 sm:py-12">
              <div className="inline-block animate-spin rounded-full h-10 sm:h-12 w-10 sm:w-12 border-b-2 border-blue-600 mb-4"></div>
              <div className="text-sm sm:text-base">Processing...</div>
            </div>
          )}

          {result && (
            <div className="space-y-4 sm:space-y-6">
              {/* Anomaly Score */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 sm:p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">Anomaly Score</div>
                <div className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-3">
                  {result.anomaly_score.toFixed(3)}
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      result.anomaly_score < 0.3
                        ? 'bg-green-600'
                        : result.anomaly_score < 0.7
                        ? 'bg-yellow-600'
                        : 'bg-red-600'
                    }`}
                    style={{ width: `${result.anomaly_score * 100}%` }}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="bg-gray-50 dark:bg-slate-700/50 p-4 sm:p-6 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-3">Status</div>
                <div className="flex justify-center">
                  {getStatusBadge(result.status)}
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-3">AI Explanation</div>
                <div className="p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-lg text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                  {result.explanation || 'No explanation available.'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

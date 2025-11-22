'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCowDetails, CowDetail } from '@/lib/api';
import TemperatureChart from '@/components/TemperatureChart';
import AnomalyChart from '@/components/AnomalyChart';
import IMUChart from '@/components/IMUChart';

export default function CowDetailsPage() {
  const searchParams = useSearchParams();
  const [cowId, setCowId] = useState(searchParams.get('id') || '');
  const [cowData, setCowData] = useState<CowDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async (id?: string) => {
    const targetId = id || cowId;
    if (!targetId.trim()) {
      setError('Please enter a cow ID');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getCowDetails(targetId);
      setCowData(data);
    } catch (err) {
      setError('Failed to fetch cow details. Please check the cow ID and backend connection.');
      setCowData(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setCowId(id);
      fetchDetails(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const getStatusBadge = (status: string) => {
    const styles = {
      normal: 'bg-green-600 text-white',
      warning: 'bg-yellow-600 text-white',
      'high-risk': 'bg-red-600 text-white',
    };
    return (
      <span
        className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Cow Details</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Individual cattle health analysis</p>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cow ID
            </label>
            <input
              type="text"
              value={cowId}
              onChange={(e) => setCowId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchDetails()}
              placeholder="Enter cow ID"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-base touch-manipulation"
            />
          </div>
          <button
            onClick={() => fetchDetails()}
            disabled={loading || !cowId.trim()}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 font-semibold text-sm sm:text-base touch-manipulation whitespace-nowrap"
          >
            {loading ? 'Loading...' : 'Fetch Details'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          <div className="flex items-center">
            <span className="text-xl mr-2">⚠️</span>
            <span className="font-semibold">{error}</span>
          </div>
        </div>
      )}

      {cowData && (
        <>
          {/* Summary Card */}
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
              <div className="flex items-center">
                <div className="text-3xl sm:text-4xl mr-3 sm:mr-4">🐄</div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    Cow ID: {cowData.id}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Health Monitoring</p>
                </div>
              </div>
              {getStatusBadge(cowData.status)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Current Temperature</div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {cowData.current_temperature.toFixed(2)}°C
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 sm:p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Anomaly Score</div>
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {cowData.current_anomaly_score.toFixed(3)}
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 sm:p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Status</div>
                <div className="mt-2">{getStatusBadge(cowData.status)}</div>
              </div>
            </div>
            {cowData.summary && (
              <div className="mt-4 p-3 sm:p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Summary</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{cowData.summary}</p>
              </div>
            )}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 card-hover">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Temperature Trend (24h)
              </h3>
              <div className="w-full" style={{ minHeight: '250px' }}>
                <TemperatureChart data={cowData.temperature_history} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 card-hover">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Anomaly Score Trend (24h)
              </h3>
              <div className="w-full" style={{ minHeight: '250px' }}>
                <AnomalyChart data={cowData.anomaly_score_history} />
              </div>
            </div>
          </div>

          {cowData.imu_history && cowData.imu_history.length > 0 && (
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 card-hover">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                IMU Movement Pattern (24h)
              </h3>
              <div className="w-full" style={{ minHeight: '250px' }}>
                <IMUChart data={cowData.imu_history} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

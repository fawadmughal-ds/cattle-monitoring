'use client';

import { useState, useEffect } from 'react';
import { getAllCows, Cow } from '@/lib/api';
import Link from 'next/link';

export default function AlertsPage() {
  const [cows, setCows] = useState<Cow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCows();
      setCows(data);
    } catch (err) {
      setError('Failed to load alerts data. Please check your backend connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const warningCows = cows.filter((c) => c.status === 'warning');
  const highRiskCows = cows.filter((c) => c.status === 'high-risk');

  const getStatusBadge = (status: string) => {
    const styles = {
      normal: 'bg-green-600 text-white',
      warning: 'bg-yellow-600 text-white',
      'high-risk': 'bg-red-600 text-white',
    };
    return (
      <span
        className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
          styles[status as keyof typeof styles] || styles.normal
        }`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Alerts</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor cattle health warnings and risks</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 font-semibold"
        >
          {loading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2">⚙️</span> Loading...
            </span>
          ) : (
            <span className="flex items-center">
              <span className="mr-2">🔄</span> Refresh
            </span>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <span className="text-xl mr-2">⚠️</span>
            <span className="font-semibold">{error}</span>
          </div>
        </div>
      )}

      {/* High-Risk Cows */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-red-200 dark:border-red-800 overflow-hidden">
        <div className="p-6 bg-red-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-3xl mr-4">🚨</span>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  High-Risk Cows ({highRiskCows.length})
                </h2>
                <p className="text-white/90 text-sm">Requires immediate attention</p>
              </div>
            </div>
            {highRiskCows.length > 0 && (
              <span className="px-4 py-2 bg-white text-red-600 rounded-full text-sm font-bold">
                URGENT
              </span>
            )}
          </div>
        </div>
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin text-4xl mb-4">⚙️</div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">Loading alerts...</div>
          </div>
        ) : highRiskCows.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <div className="text-gray-600 dark:text-gray-400 font-semibold">No high-risk cows detected. All clear!</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-red-50 dark:bg-red-900/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Cow ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Temperature (°C)</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Anomaly Score</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {highRiskCows.map((cow) => (
                  <tr key={cow.id} className="hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">🐄</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{cow.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {cow.temperature.toFixed(2)}°C
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600 dark:text-red-400">
                      {cow.anomaly_score.toFixed(3)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(cow.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/cow-details?id=${cow.id}`}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium text-sm"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Warning Cows */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-yellow-200 dark:border-yellow-800 overflow-hidden">
        <div className="p-6 bg-yellow-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-3xl mr-4">⚠️</span>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Warning Cows ({warningCows.length})
                </h2>
                <p className="text-white/90 text-sm">Monitor closely</p>
              </div>
            </div>
            {warningCows.length > 0 && (
              <span className="px-4 py-2 bg-white text-yellow-600 rounded-full text-sm font-bold">
                MONITOR
              </span>
            )}
          </div>
        </div>
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin text-4xl mb-4">⚙️</div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">Loading alerts...</div>
          </div>
        ) : warningCows.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <div className="text-gray-600 dark:text-gray-400 font-semibold">No warning cows detected. All clear!</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-yellow-50 dark:bg-yellow-900/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Cow ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Temperature (°C)</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Anomaly Score</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {warningCows.map((cow) => (
                  <tr key={cow.id} className="hover:bg-yellow-50/50 dark:hover:bg-yellow-900/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">🐄</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{cow.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {cow.temperature.toFixed(2)}°C
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                      {cow.anomaly_score.toFixed(3)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(cow.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/cow-details?id=${cow.id}`}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium text-sm"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

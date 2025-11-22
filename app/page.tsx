'use client';

import { useState, useEffect } from 'react';
import { getAllCows, Cow } from '@/lib/api';
import Link from 'next/link';

export default function Dashboard() {
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
      setError('Failed to load cattle data. Please check your backend connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = {
    total: cows.length,
    normal: cows.filter((c) => c.status === 'normal').length,
    warning: cows.filter((c) => c.status === 'warning').length,
    highRisk: cows.filter((c) => c.status === 'high-risk').length,
  };

  const avgTHI = cows.length > 0
    ? cows.reduce((sum, cow) => sum + (cow.thi || 0), 0) / cows.length
    : 0;

  const getTHIStatus = (thi: number) => {
    if (thi < 72) return { label: 'Comfortable', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-600' };
    if (thi < 78) return { label: 'Moderate', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-600' };
    if (thi < 83) return { label: 'High', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-yellow-600' };
    return { label: 'Dangerous', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-600' };
  };

  const thiStatus = getTHIStatus(avgTHI);

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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Smart Cattle Monitoring Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Real-time AI-powered health monitoring</p>
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">🐄</div>
            <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {stats.total}
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Total Cows</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">✅</div>
            <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold text-lg">
              {stats.normal}
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Normal Cows</div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.normal}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">⚠️</div>
            <div className="w-12 h-12 rounded-lg bg-yellow-600 flex items-center justify-center text-white font-bold text-lg">
              {stats.warning}
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Warning Cows</div>
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.warning}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">🚨</div>
            <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-lg">
              {stats.highRisk}
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">High-Risk Cows</div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.highRisk}</div>
        </div>
      </div>

      {/* THI Indicator */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Temperature-Humidity Index (THI)
        </h2>
        <div className="flex items-center space-x-6">
          <div className="flex-1">
            <div className="flex justify-between mb-3">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Average THI</span>
              <span className={`text-2xl font-bold ${thiStatus.color}`}>
                {avgTHI.toFixed(1)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${thiStatus.bg} transition-all duration-500`}
                style={{ width: `${Math.min((avgTHI / 90) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div className={`px-6 py-3 rounded-lg ${thiStatus.bg} text-white font-semibold`}>
            {thiStatus.label}
          </div>
        </div>
      </div>

      {/* Cows Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Cattle</h2>
        </div>
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin text-4xl mb-4">⚙️</div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">Loading cattle data...</div>
          </div>
        ) : cows.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">🐄</div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">No cattle data available</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Cow ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Temperature (°C)</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Anomaly Score</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {cows.map((cow) => (
                  <tr key={cow.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">🐄</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{cow.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {cow.temperature.toFixed(2)}°C
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
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

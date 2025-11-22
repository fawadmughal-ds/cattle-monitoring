'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  timestamp: string;
  value: number;
}

interface IMUChartProps {
  data: DataPoint[];
}

export default function IMUChart({ data }: IMUChartProps) {
  const chartData = data.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    variance: point.value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="imuGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
        <XAxis 
          dataKey="time" 
          stroke="#6b7280"
          style={{ fontSize: '12px', fontWeight: 500 }}
        />
        <YAxis 
          label={{ value: 'Variance', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontWeight: 600 } }} 
          stroke="#6b7280"
          style={{ fontSize: '12px', fontWeight: 500 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Line
          type="monotone"
          dataKey="variance"
          stroke="#10b981"
          strokeWidth={3}
          dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 8, fill: '#059669', strokeWidth: 2, stroke: '#fff' }}
          fill="url(#imuGradient)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}


"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PerformanceResults } from '@/components/simulation/types';

// This component now needs to know which simulation to fetch data for
export function PerformancePage({ simulationId }: { simulationId: string }) {
  const [history, setHistory] = useState<PerformanceResults[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!simulationId) return;

    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/simulations/${simulationId}/performance`);
        if (!response.ok) {
          throw new Error('Failed to fetch performance history.');
        }
        const data: { history?: PerformanceResults[] } = await response.json();
        setHistory(data.history || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [simulationId]);

  const formatCurrency = (value: number) => `$${(value / 1000).toFixed(0)}k`;

  if (loading) return <div>Loading performance data...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Performance Review</h1>

      {history.length < 1 ? (
        <p>No performance history available yet. Advance a few periods to see your results.</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Financials Over Time</CardTitle>
            <CardDescription>
              Your company's profit and revenue history, month by month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" tickFormatter={(p) => `P${p}`} />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip formatter={(value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                  <Line type="monotone" dataKey="profit" stroke="#82ca9d" name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
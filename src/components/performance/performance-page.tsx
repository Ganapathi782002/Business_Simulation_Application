"use client";

import React from 'react';
import { useSimulation } from '../simulation/simulation-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const formatCurrency = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '$0';
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function PerformancePage() {
  const { state, userCompany, loading, error } = useSimulation();

  if (loading) {
    return <div>Loading Performance Data...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (!state || !userCompany) {
    return <div>Loading...</div>;
  }

  const historicalPerformance = state.performanceResults.filter(p => p.period < state.currentPeriod);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl text-black font-bold">Performance Review</h1>

      {historicalPerformance.length === 0 ? (
        <p className="text-black">No performance history available yet. Advance a few periods to see your results.</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Income Statement</CardTitle>
            <CardDescription>A summary of your revenue, costs, and profit over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Period</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Costs</TableHead>
                  <TableHead className="text-right font-semibold">Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicalPerformance.map(p => (
                  <TableRow key={p.period}>
                    <TableCell className="font-medium">Period {p.period}</TableCell>
                    <TableCell className="text-right">{formatCurrency(p.revenue)}</TableCell>
                    <TableCell className="text-right text-red-400">({formatCurrency(p.costs)})</TableCell>
                    <TableCell className={`text-right font-semibold ${p.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(p.profit)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
          <CardHeader>
              <CardTitle>Balance Sheet (Current)</CardTitle>
              <CardDescription>A snapshot of your company's current assets and liabilities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Cash Balance:</span> <span className="font-medium">{formatCurrency(userCompany.cashBalance)}</span></div>
                <div className="flex justify-between"><span>Total Assets:</span> <span className="font-medium">{formatCurrency(userCompany.totalAssets)}</span></div>
                <div className="flex justify-between border-t pt-2 mt-2"><span>Total Liabilities:</span> <span className="font-medium">{formatCurrency(userCompany.totalLiabilities)}</span></div>
            </div>
          </CardContent>
      </Card>
    </div>
  );
}
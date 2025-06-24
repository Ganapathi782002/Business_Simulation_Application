"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PerformanceResults, Company } from '../simulation/types';
import { Megaphone, Target, TrendingUp } from 'lucide-react';

const formatCurrency = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '$0';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
};

interface MarketingPageProps {
    initialCompany: Company;
    initialHistory: PerformanceResults[];
}

export function MarketingPage({ initialCompany, initialHistory }: MarketingPageProps) {
  const company = initialCompany;
  const history = initialHistory;
  const latestPerf = history[history.length - 1] || { marketShare: 0, marketingCost: 0 };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-black font-bold">Marketing Department</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Market Share</CardTitle><Target className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{latestPerf.marketShare ? (latestPerf.marketShare * 100).toFixed(2) : '0.00'}%</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Brand Value</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{company?.brandValue.toFixed(1) || 'N/A'} / 100</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Last Period Marketing Cost</CardTitle><Megaphone className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(latestPerf.marketingCost ?? 0)}</div></CardContent></Card>
      </div>
    </div>
  );
}
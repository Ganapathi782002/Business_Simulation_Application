"use client";

import React from 'react';
import { useSimulation } from '../simulation/simulation-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ManageHrDialog } from './manage-hr-dialog';
import { Users, Smile, TrendingUp, UserMinus } from 'lucide-react';

export function HrPage() {
  const { state, userCompany } = useSimulation();

  if (!state || !userCompany) return <div className='p-6'>Loading HR Data...</div>;

  const history = state.performanceResults
    .filter(p => p.period < state.currentPeriod)
    .sort((a, b) => a.period - b.period);

  const companyData = userCompany.data ? JSON.parse(userCompany.data) : {};
  const hrData = companyData.humanResources || {};

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-black font-bold">Human Resources Department</h1>
        <ManageHrDialog />
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Employees</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{hrData.totalEmployees?.toLocaleString() || '-'}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Employee Satisfaction</CardTitle><Smile className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{hrData.employeeSatisfaction?.toFixed(1) || '-'}/100</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Productivity</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{hrData.productivity ? `${(hrData.productivity * 100).toFixed(0)}%` : '-'}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Turnover Rate</CardTitle><UserMinus className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{hrData.turnoverRate ? `${(hrData.turnoverRate * 100).toFixed(1)}%` : '-'}</div></CardContent></Card>
      </div>

      {/* Charts Section Will now be here */}
    </div>
  );
}
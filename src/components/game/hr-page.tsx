"use client";

import React from 'react';
import { useSimulation } from '../simulation/simulation-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ManageHrDialog } from './manage-hr-dialog';
import { Users, Smile, TrendingUp, UserMinus } from 'lucide-react';

export function HrPage() {
  const { state, userCompany } = useSimulation();

  if (!state || !userCompany) return <div className='text-black'>Loading HR Data...</div>;

  const history = state.performanceResults
    .filter(p => p.period < state.currentPeriod)
    .sort((a, b) => a.period - b.period);

  const latestPerf = history[history.length - 1];
  const companyData = userCompany.data ? JSON.parse(userCompany.data) : {};
  const hrData = companyData.humanResources || {};

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-black font-bold">Human Resources Department</h1>
        <ManageHrDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{hrData.totalEmployees?.toLocaleString() || 'N/A'}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employee Satisfaction</CardTitle>
            <Smile className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{hrData.employeeSatisfaction?.toFixed(1) || 'N/A'}/100</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{(hrData.productivity * 100)?.toFixed(0) || 'N/A'}%</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{(hrData.turnoverRate * 100)?.toFixed(1) || 'N/A'}%</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>HR Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={history}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="period"
                  tickFormatter={(p) => `P${p}`}
                  label={{ value: "Period", position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  domain={[0, 100]}
                  label={{ value: 'Satisfaction Score', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="employeeSatisfaction"
                  name="Satisfaction"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
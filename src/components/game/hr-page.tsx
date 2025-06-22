"use client";

import React from 'react';
import { useSimulation } from '../simulation/simulation-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ManageHrDialog } from './manage-hr-dialog';
import { Users, Smile, TrendingUp, UserMinus } from 'lucide-react';

export function HrPage() {
  const { state, userCompany } = useSimulation();

  if (!state || !userCompany) return <div className='p-6'>Loading HR Data...</div>;

  // Get historical performance results for charts
  const history = state.performanceResults
      .filter(p => p.period < state.currentPeriod)
      .sort((a, b) => a.period - b.period);
  
  // Get the absolute latest HR data for the KPI cards
  const companyData = userCompany.data ? JSON.parse(userCompany.data) : {};
  const hrData = companyData.humanResources || {};

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-black font-bold">Human Resources Department</h1>
        <ManageHrDialog />
      </div>

      {/* KPI Cards - This section is now robust */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Employees</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{hrData.totalEmployees?.toLocaleString() || 'N/A'}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Employee Satisfaction</CardTitle><Smile className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{hrData.employeeSatisfaction?.toFixed(1) || 'N/A'}/100</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Productivity</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{hrData.productivity ? `${(hrData.productivity * 100).toFixed(0)}%` : 'N/A'}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Turnover Rate</CardTitle><UserMinus className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{hrData.turnoverRate ? `${(hrData.turnoverRate * 100).toFixed(1)}%` : 'N/A'}</div></CardContent></Card>
      </div>

      {/* Charts Section - Now using Line Charts as requested */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Satisfaction vs. Average Salary</CardTitle>
            <CardDescription>How average salary affects employee satisfaction over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" tickFormatter={(p) => `P${p}`} label={{ value: "Period", position: 'insideBottom', offset: -10 }}/>
                  <YAxis yAxisId="left" dataKey="employeeSatisfaction" name="Satisfaction" stroke="#8884d8" domain={[0, 100]} />
                  <YAxis yAxisId="right" dataKey="avgSalary" name="Avg. Salary" orientation="right" stroke="#82ca9d" tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="employeeSatisfaction" stroke="#8884d8" />
                  <Line yAxisId="right" type="monotone" dataKey="avgSalary" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Productivity vs. Training Budget</CardTitle>
            <CardDescription>How your training budget affects productivity over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" tickFormatter={(p) => `P${p}`} label={{ value: "Period", position: 'insideBottom', offset: -10 }}/>
                  <YAxis yAxisId="left" dataKey="productivity" name="Productivity" stroke="#8884d8" domain={[0.8, 1.2]} tickFormatter={(val) => `${(val*100).toFixed(0)}%`} />
                  <YAxis yAxisId="right" dataKey="trainingBudget" name="Training Budget" orientation="right" stroke="#82ca9d" tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="productivity" stroke="#8884d8" />
                  <Line yAxisId="right" type="monotone" dataKey="trainingBudget" stroke="#82ca9d" />
                </LineChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
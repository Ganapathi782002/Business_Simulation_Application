"use client";

import React from 'react';
import { useSimulation } from '../simulation/simulation-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function CompetitorAnalysisPage() {
  const { state, userCompany } = useSimulation();

  if (!state || !userCompany) {
    return <div>Loading Competitor Data...</div>;
  }
  const competitors = state.companies.filter(c => c.id !== userCompany.id);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl text-gray-500 font-bold">Competitor Analysis</h1>

      <Card>
        <CardHeader>
          <CardTitle>Market Landscape</CardTitle>
          <CardDescription>An overview of all companies operating in this simulation.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Active Products</TableHead>
                <TableHead className="text-right">Brand Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-blue-900/50">
                <TableCell className="font-medium">{userCompany.name} (Your Company)</TableCell>
                <TableCell>{state.products.filter(p => p.companyId === userCompany.id && p.status === 'active').length}</TableCell>
                <TableCell className="text-right">{userCompany.brandValue.toFixed(1)}</TableCell>
              </TableRow>

              {competitors.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{state.products.filter(p => p.companyId === c.id && p.status === 'active').length}</TableCell>
                  <TableCell className="text-right">{c.brandValue.toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
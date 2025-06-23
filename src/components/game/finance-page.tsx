"use client";

import React, { useState} from 'react';
import { Button } from '@/components/ui/button';
import { TakeLoanDialog } from './take-loan-dialog';
import { useSimulation } from '../simulation/simulation-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { RepayLoanDialog } from './repay-loan-dialog';

// We are using the built-in International Number format
const formatCurrency = (value: number): string => {
    if (typeof value !== 'number' || isNaN(value)) {
        return '$0';
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export function FinancePage() {
  const { state, userCompany } = useSimulation();
  const [loanToRepay, setLoanToRepay] = useState<any | null>(null);

  if (!state || !userCompany) return <div className='p-6'>Loading Financial Data...</div>;

  const loans = userCompany.data ? JSON.parse(userCompany.data).loans || [] : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-black font-bold">Finance Department</h1>
        <TakeLoanDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Loans</CardTitle>
          <CardDescription>A summary of your current outstanding debt</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan ID</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Remaining Balance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.length > 0 ? (
                loans.map((loan: any) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-mono text-xs">{loan.id}</TableCell>
                    <TableCell>{formatCurrency(loan.amount)}</TableCell>
                    <TableCell>{(loan.interestRate * 100).toFixed(1)}%</TableCell>
                    <TableCell className="font-medium">{formatCurrency(loan.remainingAmount)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => setLoanToRepay(loan)}>
                        Repay
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    You have no active loans.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {loanToRepay && (
        <RepayLoanDialog 
            loan={loanToRepay} 
            companyCash={userCompany.cashBalance}
            isOpen={!!loanToRepay} 
            onClose={() => setLoanToRepay(null)} 
        />
      )}

    </div>
  );
}
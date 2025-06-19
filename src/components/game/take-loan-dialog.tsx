"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSimulation } from '../simulation/simulation-context';
import { toast } from 'sonner';

export function TakeLoanDialog() {
  const { submitDecision } = useSimulation();
  const [isOpen, setOpen] = useState(false);
  const [amount, setAmount] = useState(50000);

  // For now, interest rate and term are fixed, but could be inputs later
  const interestRate = 0.05; // 5%
  const term = 12; // 12 months

  const handleConfirmLoan = () => {
    if (amount <= 0) {
      toast.error("Invalid Amount", { description: "Loan amount must be greater than zero." });
      return;
    }

    const decisionData = {
      action: 'loan',
      amount: Number(amount),
      interestRate: interestRate,
      term: term
    };

    submitDecision({
        type: 'finance',
        data: JSON.stringify(decisionData)
    });

    toast.success("Loan Application Submitted", {
      description: `You have applied for a loan of $${amount.toLocaleString()}. Funds will be available next period.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Take Out New Loan</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply for a Loan</DialogTitle>
          <DialogDescription>
            Secure funding to grow your business. Loans are subject to interest and must be repaid.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Loan Amount ($)</Label>
            <Input id="amount" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
          </div>
           <div className="text-sm text-muted-foreground space-y-1">
              <p>Interest Rate: <span className="font-medium text-foreground">{(interestRate * 100).toFixed(1)}%</span></p>
              <p>Repayment Term: <span className="font-medium text-foreground">{term} Months</span></p>
            </div>
        </div>
        <div className="flex justify-end">
            <Button onClick={handleConfirmLoan}>Confirm Loan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
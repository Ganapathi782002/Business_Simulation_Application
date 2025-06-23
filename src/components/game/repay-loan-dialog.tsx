"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSimulation } from '../simulation/simulation-context';
import { toast } from 'sonner';

interface RepayLoanDialogProps {
    loan: any;
    companyCash: number;
    isOpen: boolean;
    onClose: () => void;
}

export function RepayLoanDialog({ loan, companyCash, isOpen, onClose }: RepayLoanDialogProps) {
    const { submitDecision } = useSimulation();
    const [repaymentAmount, setRepaymentAmount] = useState(loan.remainingAmount);

    const handleConfirmRepayment = () => {
        const amount = Number(repaymentAmount);

        if (amount <= 0) {
            toast.error("Invalid Amount", { description: "Repayment amount must be greater than zero." });
            return;
        }
        if (amount > loan.remainingAmount) {
            toast.error("Invalid Amount", { description: "You cannot repay more than the remaining balance." });
            return;
        }
        if (amount > companyCash) {
            toast.error("Insufficient Funds", { description: "You do not have enough cash to make this repayment." });
            return;
        }

        const decisionData = {
            action: 'repay_loan',
            loanId: loan.id,
            amount: amount,
        };

        submitDecision({
            type: 'finance',
            data: JSON.stringify(decisionData)
        });

        toast.success("Repayment Submitted", {
          description: `A payment of $${amount.toLocaleString()} for loan ${loan.id} has been scheduled in the next period.`,
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Repay Loan</DialogTitle>
                    <DialogDescription>
                        Make a payment on your outstanding loan.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="text-sm">
                        <p>Loan ID: <span className="font-mono text-xs">{loan.id}</span></p>
                        <p>Remaining Balance: <span className="font-semibold">${loan.remainingAmount.toLocaleString()}</span></p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Repayment Amount ($)</Label>
                        <Input 
                            id="amount" 
                            type="number" 
                            value={repaymentAmount} 
                            onChange={e => setRepaymentAmount(Number(e.target.value))} 
                            max={loan.remainingAmount}
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button onClick={onClose} variant="ghost" className="mr-2">Cancel</Button>
                    <Button onClick={handleConfirmRepayment}>Submit Repayment</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
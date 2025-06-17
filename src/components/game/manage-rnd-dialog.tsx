"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSimulation } from '../simulation/simulation-context';
import { toast } from 'sonner';

export function ManageRndDialog() {
  const { submitDecision } = useSimulation();
  const [isOpen, setOpen] = useState(false);
  const [investment, setInvestment] = useState(10000);

  const handleSaveChanges = () => {
    if (investment <= 0) {
      toast.error("Invalid Amount", { description: "R&D investment must be greater than zero." });
      return;
    }

    submitDecision({
        type: 'research',
        data: JSON.stringify({ amount: Number(investment) })
    });

    toast.success("R&D Decision Submitted", {
      description: `You have allocated $${investment.toLocaleString()} to research and development.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">R&D</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Research & Development</DialogTitle>
          <DialogDescription>
            Invest in R&D to improve product quality and innovation. Results will be seen in the next period.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="investment">R&D Investment Amount ($)</Label>
            <Input 
              id="investment" 
              type="number" 
              value={investment} 
              onChange={e => setInvestment(Number(e.target.value))} 
              placeholder="e.g., 10000"
            />
          </div>
        </div>
        <div className="flex justify-end">
            <Button onClick={handleSaveChanges}>Submit R&D Budget</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
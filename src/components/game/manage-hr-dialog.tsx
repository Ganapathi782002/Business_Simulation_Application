"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSimulation } from '../simulation/simulation-context';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function ManageHrDialog() {
  const { userCompany, submitDecision } = useSimulation();
  const [isOpen, setOpen] = useState(false);

  const companyData = userCompany?.data ? JSON.parse(userCompany.data) : {};

  const [initialEmployees, setInitialEmployees] = useState(100);
  const [initialSalary, setInitialSalary] = useState(50000);

  const [hireCount, setHireCount] = useState(0);
  const [averageSalary, setAverageSalary] = useState(initialSalary);
  const [trainingBudget, setTrainingBudget] = useState(0);
  const [hiringCost, setHiringCost] = useState(0);
  const [salaryImpact, setSalaryImpact] = useState(0);

  useEffect(() => {
    if (isOpen && userCompany?.data) {
      try {
        const companyData = JSON.parse(userCompany.data);
        const hrData = companyData.humanResources || {};
        setInitialEmployees(hrData.totalEmployees || 100);
        setInitialSalary(hrData.averageSalary || 50000);
        setAverageSalary(hrData.averageSalary || 50000);
      } catch (e) {
        console.error("Failed to parse HR data", e);
      }
    }
  }, [isOpen, userCompany?.data]);

  useEffect(() => {
    const newHires = Number(hireCount) || 0;
    const newAvgSalary = Number(averageSalary) || 0;
    const newHiringCost = (hireCount || 0) * (newAvgSalary * 0.2);
    setHiringCost(newHiringCost);
    const currentTotalSalary = (initialEmployees * initialSalary);
    const newTotalSalary = ((initialEmployees + (hireCount || 0)) * (averageSalary || 0));
    setSalaryImpact(newTotalSalary - currentTotalSalary);

  }, [hireCount, averageSalary, initialEmployees, initialSalary]);

  const handleSaveChanges = () => {
    const decisionData = {
      hiring: { newEmployees: Number(hireCount) },
      salary: { newAverageSalary: Number(averageSalary) },
      training: { budget: Number(trainingBudget) }
    };

    submitDecision({
      type: 'human_resources',
      data: JSON.stringify(decisionData)
    });

    toast.success("HR decisions submitted.", {
      description: `Hiring ${hireCount} new employees and setting training budget to $${trainingBudget.toLocaleString()}.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Human Resources</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Human Resources Management</DialogTitle>
          <DialogDescription>Make your HR decisions for the upcoming period.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="hiring">New Employees to Hire</Label>
            <Input id="hiring" type="number" value={hireCount} onChange={e => setHireCount(Number(e.target.value))} />
            <p className="text-xs text-muted-foreground">One-time hiring cost is 20% of avg. salary per employee.</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="salary">New Average Annual Salary ($)</Label>
            <Input id="salary" type="number" value={averageSalary} onChange={e => setAverageSalary(Number(e.target.value))} />
            <p className="text-xs text-muted-foreground">Current Employee Count: {initialEmployees}</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="training">Training & Development Budget ($)</Label>
            <Input id="training" type="number" value={trainingBudget} onChange={e => setTrainingBudget(Number(e.target.value))} />
            <p className="text-xs text-muted-foreground">This amount is a direct expense for this period.</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-2">
          <h4 className="font-medium text-gray-800">Estimated Financial Impact this Period</h4>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">One-time Hiring Costs:</span>
            <span className="font-semibold text-red-500">-${hiringCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Training Budget Expense:</span>
            <span className="font-semibold text-red-500">-${trainingBudget.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Change in Annual Salary Expense:</span>
            <span className={`font-semibold ${salaryImpact >= 0 ? 'text-red-500' : 'text-green-500'}`}>
              {salaryImpact >= 0 ? '-' : '+'}${Math.abs(salaryImpact).toLocaleString()}
            </span>
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Please Note</AlertTitle>
            <AlertDescription>
              Ongoing monthly salaries for ALL employees will be automatically deducted from your cash balance at the end of the period.
            </AlertDescription>
          </Alert>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSaveChanges}>Submit HR Decisions</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SimulationDetailsForm } from './simulation-details-form';
import { CompanyDetailsForm } from './company-details-form';
import { ProductCreationForm } from './product-creation-form';
import { toast } from 'sonner';

interface SimulationSetupWizardProps {
    startStep?: number;
    simulationId?: string;
    triggerButton?: React.ReactNode;
}

export function SimulationSetupWizard({ startStep = 1, simulationId, triggerButton }: SimulationSetupWizardProps) {
    const [isOpen, setOpen] = useState(false);
    const [step, setStep] = useState(startStep);
    const [wizardData, setWizardData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const goToNextStep = () => setStep(prev => prev + 1);
    const goToPreviousStep = () => setStep(prev => prev - 1);

    const handleStep1Next = (data: { simulationName: string; description: string }) => {
        setWizardData(prev => ({ ...prev, ...data }));
        goToNextStep();
    };

    const handleStep2Next = (data: { companyName: string }) => {
        setWizardData(prev => ({ ...prev, ...data }));
        goToNextStep();
    };

    const handleFinish = async (data: any) => {
        setLoading(true);
        setError(null);
        const finalData = { ...wizardData, product: data };
        console.log("Wizard Finished. Mode:", simulationId ? 'New Company' : 'New Simulation', "Data:", finalData);

        try {
            const apiEndpoint = simulationId
                ? `/api/simulations/${simulationId}/add-company`
                : '/api/setup/create-full-simulation';

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });

            if (!response.ok) {
                const errorData: { error?: string } = await response.json();
                throw new Error(errorData.error || 'An unknown error occurred.');
            }

            toast.success("Success! Reloading page...");
            setOpen(false);
            setTimeout(() => window.location.reload(), 1500);

        } catch (err) {
            toast.error("An error occurred", { description: (err as Error).message });
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerButton || <Button>Create New Simulation</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>New Simulation Setup</DialogTitle>
                    <DialogDescription>
                        Step {simulationId ? step + 1 : step} of 3
                    </DialogDescription>
                </DialogHeader>

                {step === 1 && <SimulationDetailsForm onNext={handleStep1Next} />}
                {step === 2 && <CompanyDetailsForm onNext={handleStep2Next} onPrevious={startStep === 1 ? goToPreviousStep : undefined} />}
                {step === 3 && <ProductCreationForm onFinish={handleFinish} onPrevious={goToPreviousStep} loading={loading} />}
            </DialogContent>
        </Dialog>
    );
}
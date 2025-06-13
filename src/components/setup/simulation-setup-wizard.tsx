"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SimulationDetailsForm } from './simulation-details-form';
import { CompanyDetailsForm } from './company-details-form';
import { ProductCreationForm } from './product-creation-form';

export function SimulationSetupWizard() {
    const [isOpen, setOpen] = useState(false);
    const [step, setStep] = useState(1);
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

        try {
            const response = await fetch('/api/setup/create-full-simulation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });

            if (!response.ok) {
                const errorData: { error: string} = await response.json();
                throw new Error(errorData.error || 'An unknown error occurred.');
            }
            setOpen(false);
            window.location.reload();

        } catch (err) {
            console.error("Wizard submission failed:", err);
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create New Simulation</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>New Simulation Setup</DialogTitle>
                    <DialogDescription>
                        Step {step} of 3: {step === 1 ? "Simulation Details" : step === 2 ? "Company Details" : "Initial Product Design"}
                    </DialogDescription>
                </DialogHeader>

                {step === 1 && (
                    <SimulationDetailsForm onNext={handleStep1Next} />
                )}

                {step === 2 && (
                    <CompanyDetailsForm onNext={handleStep2Next} onPrevious={goToPreviousStep} />
                )}

                {step === 3 && (
                    <ProductCreationForm
                        onFinish={handleFinish}
                        onPrevious={goToPreviousStep}
                        loading={loading}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
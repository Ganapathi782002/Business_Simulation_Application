"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CompanyDetailsForm } from '../setup/company-details-form';
import { toast } from 'sonner';

export function ManageCompany({ simulationId }: { simulationId: string }) {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCompanyCreate = async (data: { companyName: string }) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/simulations/${simulationId}/companies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyName: data.companyName }),
            });

            if (!response.ok) {
                const errorData: { error?: string } = await response.json();
                throw new Error(errorData.error || 'Failed to create company.');
            }
            toast.success(`Company '${data.companyName}' established successfully!`);
            setDialogOpen(false);
            window.location.reload();

        } catch (err) {
            setError((err as Error).message);
            toast.error("Failed to create company.", { description: (err as Error).message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button size="lg">Establish Your Company</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Establish Your Company</DialogTitle>
                    <DialogDescription>
                        Choose a name for your new company in this simulation.
                    </DialogDescription>
                </DialogHeader>
                <CompanyDetailsForm
                    onNext={handleCompanyCreate}
                    submitButtonText="Found Company"
                    loading={loading}
                />
            </DialogContent>
        </Dialog>
    );
}
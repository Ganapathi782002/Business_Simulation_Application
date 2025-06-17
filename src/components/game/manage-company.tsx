"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CompanyDetailsForm } from '../setup/company-details-form';

export function ManageCompany({ simulationId }: { simulationId: string }) {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCompanyCreate = async (data: { companyName: string }) => {
        setLoading(true);
        setError(null);
        await new Promise(r => setTimeout(r, 1000));

        setLoading(false);
        setDialogOpen(false);
        window.location.reload();
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
                        Choose a name for your new venture in this simulation.
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
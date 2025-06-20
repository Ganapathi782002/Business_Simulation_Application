"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { SimulationSetupWizard } from "../setup/simulation-setup-wizard";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Company, Simulation } from "../simulation/types";

interface LobbyClientProps {
    initialSimulation: Simulation;
    initialUserCompanies: Company[];
    simId: string;
}

export function LobbyClient({ initialSimulation, initialUserCompanies, simId }: LobbyClientProps) {
    const [companies, setCompanies] = useState<Company[]>(initialUserCompanies);

    const handleDelete = async (companyId: string, companyName: string) => {
        const originalCompanies = companies;
        setCompanies(current => current.filter(c => c.id !== companyId));
        toast.info(`Deleting ${companyName}...`);

        try {
            const response = await fetch(`/api/simulations/${simId}/companies/${companyId}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorData: { error?: string } = await response.json();
                throw new Error(errorData.error || 'Failed to delete company.');
            }
            toast.success("Company deleted successfully.");
        } catch (error) {
            toast.error((error as Error).message);
            setCompanies(originalCompanies); // Revert UI on error
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl text-black font-bold">Available Companies in: {initialSimulation.name}</h1>
                    <p className="text-muted-foreground">Select a company to manage or create a new one.</p>
                </div>
                <SimulationSetupWizard 
                    startStep={2} 
                    simulationId={simId} 
                    triggerButton={<Button>Establish New Company</Button>}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {companies.map((company) => (
                    <Card key={company.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>{company.name}</CardTitle>
                                <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive flex-shrink-0">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete "{company.name}" and all of its associated data.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(company.id, company.name)}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            {/* This now uses the correct camelCase property */}
                            <CardDescription>Cash: ${company.cashBalance}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Link href={`/simulations/${simId}/company/${company.id}`} className="w-full">
                                <Button className="w-full">Manage Company</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {companies.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold">You have no companies in this simulation.</h2>
                    <p className="text-gray-500 mt-2 mb-4">Click the button above to establish your first company.</p>
                </div>
            )}
        </div>
    );
}
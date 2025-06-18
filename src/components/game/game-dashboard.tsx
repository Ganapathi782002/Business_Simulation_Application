"use client";

import React, { useEffect, useState } from 'react';
import { useSimulation } from '../simulation/simulation-context';
import { Product, ProductStatus } from '../simulation/types';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ManageProductDialog } from './manage-product-dialog';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Zap } from "lucide-react";
import { ManageRndDialog } from './manage-rnd-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { AlertDialog, AlertDialogHeader, AlertDialogCancel, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogContent } from '../ui/alert-dialog';

export function GameDashboard() {
  const { state, userCompany, companyProducts, advancePeriod, loading, error, saveState, submitDecision } = useSimulation();
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [productToDiscontinue, setProductToDiscontinue] = useState<Product | null>(null);

  const handleStatusChange = (productId: string, newStatus: ProductStatus) => {
    const product = companyProducts.find(p => p.id === productId);
    if (product && product.status === newStatus) {
      toast.info(`Product is already ${newStatus}.`);
      return;
    }
    submitDecision({
      type: 'product_development',
      data: JSON.stringify({ action: 'update_status', productId, newStatus })
    });
    toast.info(`Product status for ${productId} updated to ${newStatus}.`);
  };

  const handleDiscontinueClick = (product: Product) => {
    setProductToDiscontinue(product);
    setAlertOpen(true);
  }

  useEffect(() => {
    if (state && state.currentPeriod === 11) {
      toast.warning("Final Round!", {});
    }
  }, [state?.currentPeriod]);

  if (loading || !state || !userCompany) {
    return (<div>Loading Simulation...</div>);
  }
  console.log(`[Dashboard] Rendering for period ${state.currentPeriod}. Received ${state.events.length} total events from context.`);
  const currentEvents = state.events.filter(event => event.period === state.currentPeriod);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (state.currentPeriod >= 12) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold">Simulation Completed!</h1>
        <p className="text-lg text-gray-500 mt-2">You have completed 12 months. Check the Performance page for your final results.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl text-black font-bold">Company Name: {userCompany.name}</h1>
          <p className="text-gray-500">Period {state.currentPeriod} - {state.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <ManageRndDialog />
          <Button variant="default" onClick={saveState} disabled={loading}>
            {loading ? 'Saving...' : 'Save Game'}
          </Button>
          <Button onClick={advancePeriod} disabled={loading || state.currentPeriod >= 11}>
            Advance to Next Period
          </Button>
        </div>
      </div>

      {currentEvents.length > 0 && (
        <div className="space-y-4">
          {currentEvents.map((event: any) => (
            <Alert key={event.id}>
              <Zap className="h-4 w-4" />
              <AlertTitle className="font-semibold">{event.name}</AlertTitle>
              <AlertDescription>
                {event.description}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Cash Balance</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">${userCompany.cashBalance.toLocaleString()}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Brand Value</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{userCompany.brandValue.toFixed(1)} / 100</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Credit Rating</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{userCompany.creditRating}</p></CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl text-black font-bold mb-4">Your Products</h2>
        {companyProducts.length > 0 ? (
          <div className="space-y-4">
            {companyProducts.map(p => (
              <Card key={p.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{p.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <ManageProductDialog product={p} />

                      {/* ADD THIS DROPDOWN MENU */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleStatusChange(p.id, ProductStatus.ACTIVE)}>
                            Set to Active
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(p.id, ProductStatus.DEVELOPMENT)}>
                            Back to Development
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500 hover:text-red-500 focus:text-red-500" onClick={() => handleDiscontinueClick(p)}>
                            Discontinue Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Status: <span className="font-medium text-foreground">{p.status}</span></p>
                    <p>Price: <span className="font-medium text-foreground">${p.sellingPrice.toLocaleString()}</span></p>
                    <p>Category: <span className="font-medium text-foreground">{p.category}</span></p>
                    <p>Current Inventory: <span className="font-medium text-foreground">{p.inventoryLevel.toLocaleString()} units</span></p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>You have not developed any products yet.</p>
        )}

      </div>
      <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will discontinue the product "{productToDiscontinue?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (productToDiscontinue) {
                  handleStatusChange(productToDiscontinue.id, ProductStatus.DISCONTINUED);
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
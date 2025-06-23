"use client";

import React, { useEffect, useState } from 'react';
import { useSimulation } from '../simulation/simulation-context';
import { Product, ProductStatus } from '../simulation/types';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ManageProductDialog } from './manage-product-dialog';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Zap } from "lucide-react";
import { ManageRndDialog } from './manage-rnd-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { AlertDialog, AlertDialogHeader, AlertDialogCancel, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogContent } from '../ui/alert-dialog';
import { ManageHrDialog } from './manage-hr-dialog';
import { DecisionCard } from './decision-card';
import { AddProductDialog } from './add-product-dialog';

export function GameDashboard() {
  const { state, userCompany, companyProducts, advancePeriod, loading, error, saveState, submitDecision, isStateDirty } = useSimulation();
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [productToDiscontinue, setProductToDiscontinue] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

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

  if (loading || !state || !userCompany) {
    return (<div>Loading Simulation...</div>);
  }
  console.log(`[Dashboard] Rendering for period ${state.currentPeriod}. Received ${state.events.length} total events from context.`);
  const currentEvents = state.events.filter(event => event.period === state.currentPeriod);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  const pendingDecisions = state.decisions.filter(
    d => d.companyId === userCompany.id && d.period === state.currentPeriod && !d.processed
  );

  const capitalize = (s: string) => {
    if (typeof s !== 'string' || s.length === 0) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const statusColors: { [key: string]: string } = {
    active: "text-green-500",
    development: "text-yellow-500",
    discontinued: "text-red-500",
  };

  return (
    <div className="p-6 space-y-6">
      <Alert variant="warning">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle className="font-semibold">How to Play a Turn</AlertTitle>
        <AlertDescription>
          1. Make decisions using the 'Manage', 'HR', and 'R&D' buttons below.
          2. Finance Side bar to take new loans / repay loans
          3. Click 'Advance to Next Period' to see the results.
          4. Click 'Save Game' to make your progress permanent!
        </AlertDescription>
      </Alert>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl text-black font-bold">Company Name: {userCompany.name}</h1>
          <p className="text-gray-500">Period {state.currentPeriod} - {state.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <ManageRndDialog />
          <ManageHrDialog />
          <Button variant="default" onClick={saveState} disabled={loading || !isStateDirty}>
            {loading ? 'Saving...' : 'Save Game'}
          </Button>
          <Button
            onClick={advancePeriod}
          >
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
        <h2 className="text-xl text-black font-bold mb-4">Pending Decisions for Period {state.currentPeriod}</h2>
        {pendingDecisions.length > 0 ? (
          <div className="space-y-3">
            {pendingDecisions.map(decision => (
              <DecisionCard key={decision.id} decision={decision} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground p-4 border-2 border-dashed rounded-lg text-center">
            No new pending decisions for this period yet.
          </p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-black font-bold">Your Products</h2>
          <AddProductDialog />
        </div>
        {companyProducts.length > 0 ? (
          <div className="space-y-4">
            {companyProducts.map(p => (
              <Card key={p.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{p.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <ManageProductDialog product={p} />

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="default" size="icon">
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
                          <DropdownMenuItem className="text-orange-500 hover:text-orange-900 focus:text-orange-500" onClick={() => handleDiscontinueClick(p)}>
                            Discontinue Product
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500 hover:text-red-900 focus:text-red-500">
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Status:
                      <span className={`font-medium ml-1 ${statusColors[p.status] || 'text-foreground'}`}>
                        {capitalize(p.status)}
                      </span>
                    </p>
                    <p>Price: <span className="font-medium text-foreground">${p.sellingPrice.toLocaleString()}</span></p>
                    <p>Category: <span className="font-medium text-foreground">{capitalize(p.category)}</span></p>
                    <p>Current Inventory: <span className="font-medium text-foreground">{p.inventoryLevel.toLocaleString()} units</span></p>
                    <p>Created at: <span className="font-medium text-foreground">{new Date(p.createdAt).toLocaleDateString()}</span></p>
                    <p>Updated at: <span className="font-medium text-foreground">{new Date(p.updatedAt).toLocaleDateString()}</span></p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You have not developed any products yet.</p>
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
      <AlertDialog open={!!productToDelete} onOpenChange={(isOpen) => !isOpen && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "{productToDelete?.name}" and all of its history. This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!productToDelete) return;
                try {
                  const response = await fetch(`/api/simulations/<span class="math-inline">\{state\.id\}/companies/</span>{userCompany.id}/products/${productToDelete.id}`, { method: 'DELETE' });
                  if (!response.ok) throw new Error("Failed to delete product.");
                  toast.success("Product deleted.");
                  window.location.reload();
                } catch (error) {
                  toast.error("Error deleting product.");
                }
              }}
            >
              Yes, Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
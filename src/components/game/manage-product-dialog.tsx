"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSimulation } from '../simulation/simulation-context';
import { Product } from '../simulation/types';

interface ManageProductDialogProps {
  product: Product;
}

export function ManageProductDialog({ product }: ManageProductDialogProps) {
  const { submitDecision } = useSimulation();
  const [isOpen, setOpen] = useState(false);

  const [price, setPrice] = useState(product.sellingPrice);
  const [productionVolume, setProductionVolume] = useState(1000);
  const [marketingBudget, setMarketingBudget] = useState(product.marketingBudget);

  const [totalProductionCost, setTotalProductionCost] = useState(0);

  useEffect(() => {
    const newProductionCost = (productionVolume || 0) * (product.productionCost || 0);
    setTotalProductionCost(newProductionCost);
  }, [productionVolume, product.productionCost]);

  const handleSaveChanges = () => {
    submitDecision({
      type: 'pricing',
      data: JSON.stringify({ productId: product.id, price: Number(price) })
    });

    submitDecision({
      type: 'production',
      data: JSON.stringify({ productId: product.id, productionVolume: Number(productionVolume) })
    });

    submitDecision({
      type: 'marketing',
      data: JSON.stringify({ productId: product.id, budget: Number(marketingBudget) })
    });

    console.log(`Decisions submitted for ${product.name}`);
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Manage</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage: {product.name}</DialogTitle>
          <DialogDescription>Set your decisions for this product for the upcoming period.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="price">Selling Price ($)</Label>
            <Input id="price" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="production">Production Volume (Units)</Label>
            <Input id="production" type="number" value={productionVolume} onChange={e => setProductionVolume(Number(e.target.value))} />
            <p className="text-xs text-muted-foreground">Cost per unit: ${product.productionCost.toLocaleString()}</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="marketing">Marketing Budget ($)</Label>
            <Input id="marketing" type="number" value={marketingBudget} onChange={e => setMarketingBudget(Number(e.target.value))} />
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-2">
            <h4 className="font-medium text-gray-800">Estimated Financial Impact this Period</h4>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Production Costs:</span>
              <span className="font-semibold text-red-500">-${totalProductionCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Marketing Budget Expense:</span>
              <span className="font-semibold text-red-500">-${Number(marketingBudget || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t pt-2 mt-2">
              <span className="text-gray-700">Total Immediate Cost:</span>
              <span className="text-red-600">-${(totalProductionCost + Number(marketingBudget || 0)).toLocaleString()}</span>
            </div>
          </div>

        </div>
        <div className="flex justify-end">
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
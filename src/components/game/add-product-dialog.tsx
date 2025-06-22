"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSimulation } from '../simulation/simulation-context';
import { toast } from 'sonner';
import { ProductCreationForm } from '../setup/product-creation-form';
import { PlusCircle } from 'lucide-react';

export function AddProductDialog() {
  const { state, userCompany } = useSimulation();
  const [isOpen, setOpen] = useState(false);

  const handleProductCreate = async (data: any) => {
    if (!state || !userCompany) return;

    try {
      const response = await fetch(`/api/simulations/${state.id}/companies/${userCompany.id}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create new product.");
      }

      toast.success("New Product in R&D!", { description: `"${data.productName}" is now in development.`});
      setOpen(false);
      window.location.reload();

    } catch (err) {
      toast.error("Failed to create product", { description: (err as Error).message });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Develop New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Product Development</DialogTitle>
        </DialogHeader>
        <ProductCreationForm 
          onFinish={handleProductCreate}
          loading={false}
        />
      </DialogContent>
    </Dialog>
  );
}
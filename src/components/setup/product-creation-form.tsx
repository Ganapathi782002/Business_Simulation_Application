"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface ProductData {
  productName: string;
  description: string;
  category: string;
  qualityRating: number;
  innovationRating: number;
  sustainabilityRating: number;
  sellingPrice: number;
  productionCost: number;
  rndCost: number;
}

interface ProductCreationFormProps {
  onFinish: (data: ProductData) => void;
  onPrevious: () => void;
  loading: boolean;
}

export function ProductCreationForm({ onFinish, onPrevious, loading }: ProductCreationFormProps) {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('mid-range');
  const [qualityRating, setQualityRating] = useState(5);
  const [innovationRating, setInnovationRating] = useState(5);
  const [sustainabilityRating, setSustainabilityRating] = useState(5);
  const [sellingPrice, setSellingPrice] = useState(150);
  const [productionCost, setProductionCost] = useState(0);
  const [rndCost, setRndCost] = useState(0);

  useEffect(() => {
    const baseCost = category === 'premium' ? 50 : category === 'mid-range' ? 30 : 15;
    const newProductionCost = baseCost + (qualityRating * 10) + (innovationRating * 5) + (sustainabilityRating * 3);
    setProductionCost(newProductionCost);

    const newRndCost = (qualityRating * 10000) + (innovationRating * 15000) + (sustainabilityRating * 8000);
    setRndCost(newRndCost);
  }, [qualityRating, innovationRating, sustainabilityRating, category]);

  const handleFinishClick = () => {
    onFinish({
      productName,
      description,
      category,
      qualityRating,
      innovationRating,
      sustainabilityRating,
      sellingPrice,
      productionCost,
      rndCost
    });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="product-name">Product Name</Label>
          <Input id="product-name" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., Lumel BI" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="mid-range">Mid-Range</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your initial product..." />
      </div>
      <div className="grid gap-2 pt-2">
        <Label>Quality Rating: {qualityRating.toFixed(1)}</Label>
        <Slider value={[qualityRating]} onValueChange={(value) => setQualityRating(value[0])} max={10} step={0.5} />
      </div>
      <div className="grid gap-2">
        <Label>Innovation Rating: {innovationRating.toFixed(1)}</Label>
        <Slider value={[innovationRating]} onValueChange={(value) => setInnovationRating(value[0])} max={10} step={0.5} />
      </div>
      <div className="grid gap-2">
        <Label>Sustainability Rating: {sustainabilityRating.toFixed(1)}</Label>
        <Slider value={[sustainabilityRating]} onValueChange={(value) => setSustainabilityRating(value[0])} max={10} step={0.5} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="selling-price">Selling Price ($)</Label>
        <Input id="selling-price" type="number" value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} />
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
        <h4 className="font-medium mb-2 text-gray-800">Calculated Stats</h4>
        <div className="flex justify-between text-sm"><span className="text-gray-600">Upfront R&D Cost:</span><span className="font-semibold text-gray-600">${rndCost.toLocaleString()}</span></div>
        <div className="flex justify-between text-sm mt-1"><span className="text-gray-600">Production Cost / Unit:</span><span className="font-semibold text-gray-600">${productionCost.toLocaleString()}</span></div>
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onPrevious} disabled={loading}>Previous</Button>
        <Button onClick={handleFinishClick} disabled={loading}>
          {loading ? 'Creating World...' : 'Finish & Create'}
        </Button>
      </div>
    </div>
  );
}
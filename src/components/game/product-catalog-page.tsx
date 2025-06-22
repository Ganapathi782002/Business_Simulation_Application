"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, CartesianGrid } from 'recharts';
import { AddProductDialog } from './add-product-dialog';
import { DollarSign, Package, TrendingUp } from 'lucide-react';
import { Product, ProductPerformance } from '../simulation/types';

const formatNum = (num: number) => {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
}

interface ProductWithHistory extends Product {
  performanceHistory: ProductPerformance[];
}

export function ProductCatalogPage({ companyId, simulationId }: { companyId: string, simulationId: string }) {
  const [products, setProducts] = useState<ProductWithHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId || !simulationId) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/simulations/${simulationId}/companies/${companyId}/products`);
        
        if (!response.ok) {
          const errorData: {error: string} = await response.json();
          throw new Error(errorData.error || 'Failed to fetch products.');
        }

        const data: { products?: ProductWithHistory[] } = await response.json();
        setProducts(data.products || []);

      } catch (err) {
        console.error(err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [companyId, simulationId]);

  if (loading) return <div className="p-6">Loading Product Catalog...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-black font-bold">Product Catalog & Management</h1>
        <AddProductDialog />
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {products.map(product => {
          const latestPerf = product.performanceHistory[product.performanceHistory.length - 1];
          return (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{product.name}</CardTitle>
                </div>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div><p className="text-xs text-muted-foreground">Price</p><p className="font-bold flex items-center justify-center"><DollarSign className="h-4 w-4 mr-1"/>{product.sellingPrice.toLocaleString()}</p></div>
                    <div><p className="text-xs text-muted-foreground">Inventory</p><p className="font-bold flex items-center justify-center"><Package className="h-4 w-4 mr-1"/>{product.inventoryLevel.toLocaleString()}</p></div>
                    <div><p className="text-xs text-muted-foreground">Last Period Profit</p><p className="font-bold flex items-center justify-center"><TrendingUp className="h-4 w-4 mr-1"/>{formatNum(latestPerf?.profit || 0)}</p></div>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={product.performanceHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                       <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" tickFormatter={(p) => `P${p}`} fontSize={10} />
                      <YAxis tickFormatter={(v) => formatNum(v)} fontSize={10} />
                      <Tooltip contentStyle={{ fontSize: '12px', padding: '2px 8px' }} formatter={(value:number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}/>
                      <Legend verticalAlign='top' height={30} />
                      <Line type="monotone" dataKey="profit" name="Profit" stroke="#82ca9d" strokeWidth={2} dot={{r: 3}} />
                      <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#8884d8" strokeWidth={2} dot={{r: 3}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      {!loading && products.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">No Products Found</h2>
            <p className="text-gray-500 mt-2 mb-4">Click the button above to develop your first product.</p>
        </div>
      )}
    </div>
  );
}
import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';
import { auth } from '@/lib/auth';
import { getDB } from '@/lib/get-db';
import { ProductStatus } from '@/components/simulation/types';

interface AddCompanyPayload {
  companyName: string;
  product: {
    productName: string;
    description: string;
    category: string;
    qualityRating: number;
    innovationRating: number;
    sustainabilityRating: number;
    sellingPrice: number;
    productionCost: number;
    rndCost: number;
  };
}

export async function POST(
  req: NextRequest,
  { params }: { params: { simId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload: AddCompanyPayload = await req.json();
    const { companyName, product } = payload;

    if (!companyName || !product) {
        return NextResponse.json({ error: 'Missing company or product details.'}, { status: 400 });
    }

    const now = new Date().toISOString();
    const companyId = `company_${Date.now()}`;

    const newCompany = {
      id: companyId,
      simulationId: params.simId,
      userId: session.user.id,
      name: companyName,
      description: `A new company founded in simulation ${params.simId}`,
      logoUrl: null,
      cashBalance: 10000000 - product.rndCost, // Starting cash includes R&D cost deduction
      totalAssets: 10000000 - product.rndCost,
      totalLiabilities: 0,
      creditRating: 'A',
      brandValue: 50,
      data: '{}',
      createdAt: now,
      updatedAt: now,
    };

    const newProduct = {
      id: `prod_${Date.now()}`,
      companyId: companyId,
      name: product.productName,
      description: product.description,
      category: product.category,
      qualityRating: product.qualityRating,
      innovationRating: product.innovationRating,
      sustainabilityRating: product.sustainabilityRating,
      productionCost: product.productionCost,
      sellingPrice: product.sellingPrice,
      inventoryLevel: 0,
      productionCapacity: 2000,
      developmentCost: product.rndCost,
      marketingBudget: 0,
      status: ProductStatus.DEVELOPMENT,
      launchPeriod: 0,
      discontinuePeriod: null,
      data: '{}',
      createdAt: now,
      updatedAt: now,
    };
    const db = await getDB();
    await db.createCompany(newCompany);
    await db.createProduct(newProduct);

    return NextResponse.json({ companyId }, { status: 201 });

  } catch (err) {
    console.error("Failed to add company:", err);
    return NextResponse.json({ error: 'Failed to add company' }, { status: 500 });
  }
}
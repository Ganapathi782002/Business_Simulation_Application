import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getDB } from '@/lib/get-db';
import { SimulationStatus, ProductStatus } from '@/components/simulation/types';

interface WizardData {
  simulationName: string;
  description: string;
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

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRETE!) as { id: string };
    const userId = decoded.id;

    const wizardData: WizardData = await req.json();
    const { simulationName, description, companyName, product } = wizardData;

    const now = new Date().toISOString();
    const simId = `sim_${Date.now()}`;
    const companyId = `company_${Date.now()}`;

    const newSimulation = {
      id: simId,
      name: simulationName,
      description: description,
      config: '{}',
      currentPeriod: 0,
      status: SimulationStatus.ACTIVE,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    };

    const newCompany = {
      id: companyId,
      simulationId: simId,
      userId: userId,
      name: companyName,
      description: `This company is present inside ${simulationName}`,
      logoUrl: null,
      cashBalance: 1000000 - product.rndCost,
      totalAssets: 1000000 - product.rndCost,
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
      developmentCost: product.rndCost,
      status: ProductStatus.ACTIVE,
      inventoryLevel: 0,
      productionCapacity: 2000,
      marketingBudget: 0,
      createdAt: now,
      updatedAt: now,
    };

    const db = await getDB();
    await db.createSimulation(newSimulation);
    await db.createCompany(newCompany);
    await db.createProduct(newProduct);

    return NextResponse.json({ simulationId: simId }, { status: 201 });

  } catch (err) {
    console.error("Full simulation creation failed:", err);
    return NextResponse.json({ error: 'Failed to create simulation' }, { status: 500 });
  }
}
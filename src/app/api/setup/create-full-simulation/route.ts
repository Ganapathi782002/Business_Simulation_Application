import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getDB } from '@/lib/get-db';
import { ProductStatus } from '@/components/simulation/types';
import { SimulationFactory } from '@/components/simulation/simulation-factory';

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
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRETE!) as { id: string };
    const userId = decoded.id;

    const wizardData: WizardData = await req.json();
    const { simulationName, description, companyName, product } = wizardData;

    const newSimulationState = SimulationFactory.create({
      simulationName: simulationName,
      description: description,
      userId: userId
    });

    const now = new Date().toISOString();
    const simId = `sim_${Date.now()}`;
    const companyId = `company_${Date.now()}`;

    const newSimulation = {
        id: newSimulationState.id,
        name: newSimulationState.name,
        description: newSimulationState.description,
        config: newSimulationState.config,
        currentPeriod: newSimulationState.currentPeriod,
        status: newSimulationState.status,
        createdBy: newSimulationState.createdBy,
        createdAt: newSimulationState.createdAt,
        updatedAt: newSimulationState.updatedAt,
    };
    

    const newCompany = {
      id: companyId,
      simulationId: newSimulation.id,
      userId: userId,
      name: companyName,
      description: `This company is present inside ${simulationName}`,
      logoUrl: null,
      cashBalance: 10000000 - product.rndCost,
      totalAssets: 10000000 - product.rndCost,
      totalLiabilities: 0,
      creditRating: 'A',
      brandValue: 50,
      data: '{}',
      createdAt: newSimulation.createdAt,
      updatedAt: newSimulation.updatedAt,
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
      status: ProductStatus.DEVELOPMENT,
      inventoryLevel: 0,
      productionCapacity: 2000,
      marketingBudget: 0,
      createdAt: newSimulation.createdBy,
      updatedAt: newSimulation.updatedAt,
    };

    const db = await getDB();
    await db.createSimulation(newSimulation);
    await db.createCompany(newCompany);
    await db.createProduct(newProduct);
    await db.createMarketConditions(newSimulationState.marketConditions[0]); 

    return NextResponse.json({ simulationId: newSimulation.id }, { status: 201 });

  } catch (err) {
    console.error("Full simulation creation failed:", err);
    return NextResponse.json({ error: 'Failed to create simulation' }, { status: 500 });
  }
}
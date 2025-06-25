import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';
import { auth } from '@/lib/auth';
import { getDB } from '@/lib/get-db';
import { ProductStatus } from '@/components/simulation/types';

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

export async function GET(
  req: NextRequest,
  { params }: { params: { simId: string, companyId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const db = await getDB();
    
    const company = await db.getCompany(params.companyId);
    if (!company || company.user_id !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [products, allPerformance] = await Promise.all([
      db.getProductsByCompany(params.companyId),
      db.getAllProductPerformanceByCompany(params.companyId)
    ]);
    
    // mapping the snake_case data from the database to camelCase for the frontend
    const productsWithHistory = products.map((p: any) => {
      const performanceHistory = allPerformance
        .filter(perf => perf.product_id === p.id)
        .map((perf: any) => ({
          id: perf.id,
          productId: perf.product_id,
          period: perf.period,
          salesVolume: perf.sales_volume,
          revenue: perf.revenue,
          costs: perf.costs,
          profit: perf.profit,
          marketShare: perf.market_share,
          customerSatisfaction: perf.customer_satisfaction,
          data: perf.data,
          createdAt: perf.created_at,
        }));

      return {
        id: p.id,
        companyId: p.company_id,
        name: p.name,
        description: p.description,
        category: p.category,
        qualityRating: p.quality_rating,
        innovationRating: p.innovation_rating,
        sustainabilityRating: p.sustainability_rating,
        productionCost: p.production_cost,
        sellingPrice: p.selling_price,
        inventoryLevel: p.inventory_level,
        productionCapacity: p.production_capacity,
        developmentCost: p.development_cost,
        marketingBudget: p.marketing_budget,
        status: p.status,
        launchPeriod: p.launch_period,
        discontinuePeriod: p.discontinue_period,
        data: p.data,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        performanceHistory: performanceHistory
      };
    });

    return NextResponse.json({ products: productsWithHistory });

  } catch (err) {
    console.error("Failed to fetch products:", err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { companyId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const productData: ProductData = await req.json();

    const db = await getDB();
    const company = await db.getCompany(params.companyId);
    if (!company || company.user_id !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const now = new Date().toISOString();
    const newProduct = {
      id: `prod_${Date.now()}`,
      companyId: params.companyId,
      name: productData.productName,
      description: productData.description,
      category: productData.category,
      qualityRating: productData.qualityRating,
      innovationRating: productData.innovationRating,
      sustainabilityRating: productData.sustainabilityRating,
      productionCost: productData.productionCost,
      sellingPrice: productData.sellingPrice,
      developmentCost: productData.rndCost,
      inventoryLevel: 0,
      productionCapacity: 2000,
      marketingBudget: 0,
      status: ProductStatus.DEVELOPMENT,
      launchPeriod: null,
      discontinuePeriod: null,
      data: '{}',
      createdAt: now,
      updatedAt: now,
    };

    await db.createProduct(newProduct);

    return NextResponse.json({ product: newProduct }, { status: 201 });

  } catch (err) {
    console.error("Failed to create product:", err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
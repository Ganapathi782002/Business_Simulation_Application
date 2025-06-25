import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDB } from '@/lib/get-db';
import { Company, Simulation } from '@/components/simulation/types';

export async function GET(
  req: NextRequest,
  { params }: { params: { simId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDB();
    const [simulation, allCompanies] = await Promise.all([
        db.getSimulation(params.simId),
        db.getCompaniesBySimulation(params.simId)
    ]);

    if (!simulation) {
        return NextResponse.json({ error: 'Simulation not found' }, { status: 404 });
    }

    const userCompanies = allCompanies.filter((c: any) => c.user_id === session.user.id);
    const formattedCompanies: Company[] = userCompanies.map((c: any) => ({
        id: c.id,
        simulationId: c.simulation_id,
        userId: c.user_id,
        name: c.name,
        description: c.description,
        logoUrl: c.logo_url,
        cashBalance: c.cash_balance,
        totalAssets: c.total_assets,
        totalLiabilities: c.total_liabilities,
        creditRating: c.credit_rating,
        brandValue: c.brand_value,
        data: c.data,
        createdAt: c.created_at,
        updatedAt: c.updated_at
    }));

    const formattedSimulation: Simulation = {
        id: simulation.id,
        name: simulation.name,
        description: simulation.description,
        config: simulation.config,
        currentPeriod: simulation.current_period,
        status: simulation.status,
        createdBy: simulation.created_by,
        createdAt: simulation.created_at,
        updatedAt: simulation.updated_at,
    }

    return NextResponse.json({ simulation: formattedSimulation, userCompanies: formattedCompanies });

  } catch (err) {
    console.error("Failed to fetch lobby data:", err);
    return NextResponse.json({ error: 'Failed to fetch lobby data' }, { status: 500 });
  }
}
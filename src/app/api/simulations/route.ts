import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';
import { auth } from '@/lib/auth';
import { getDB } from '@/lib/get-db';
import { Simulation } from '@/components/simulation/types';


export async function GET(req: NextRequest) {
  try {
    // Get the current user's session
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    //Fetch all simulations created by this user
    const db = await getDB();
    const simulationsFromDb = await db.getSimulationsByUser(userId);

    // 3. Format the data from snake_case to camelCase for the frontend
    const formattedSimulations: Simulation[] = simulationsFromDb.map((sim: any) => ({
      id: sim.id,
      name: sim.name,
      description: sim.description,
      config: sim.config,
      currentPeriod: sim.current_period,
      status: sim.status,
      createdBy: sim.created_by,
      createdAt: sim.created_at,
      updatedAt: sim.updated_at,
    }));

    return NextResponse.json({ simulations: formattedSimulations });

  } catch (err) {
    console.error("Failed to fetch simulations:", err);
    return NextResponse.json({ error: 'Failed to fetch simulations' }, { status: 500 });
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: { simId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const db = await getDB();
    const simulation = await db.getSimulation(params.simId);

    if (!simulation) {
      return NextResponse.json(
        { error: "Simulation not found" },
        { status: 404 }
      );
    }

    if (simulation.created_by !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.deleteSimulation(params.simId);

    return NextResponse.json({ message: "Simulation deleted successfully" });

  } catch (err) {
    console.error(`Failed to delete simulation ${params.simId}:`, err);
    return NextResponse.json(
      { error: "Failed to delete simulation" },
      { status: 500 }
    );
  }
}
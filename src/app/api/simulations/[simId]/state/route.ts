import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDB } from '@/lib/get-db';
import { saveSimulationState } from '@/lib/simulation-persistence';
import { SimulationState } from '@/components/simulation/types';

export async function POST(
  req: NextRequest,
  { params }: { params: { simId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedState: SimulationState = await req.json();

    if (params.simId !== updatedState.id) {
        return NextResponse.json({ error: 'Simulation ID mismatch' }, { status: 400 });
    }

    const db = await getDB();
    await saveSimulationState(updatedState, db);

    return NextResponse.json({ message: 'State saved successfully' });

  } catch (err) {
    console.error(`Failed to save state for simulation ${params.simId}:`, err);
    return NextResponse.json({ error: 'Failed to save simulation state' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/get-db';
import { SimulationFactory } from '@/components/simulation/simulation-factory';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { saveNewSimulation } from '@/lib/simulation-persistence';

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No session found' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRETE!) as { id: string };
    const userId = decoded.id;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }
    const { simulationName, description }: { simulationName: string, description: string } = await req.json();
    if (!simulationName && !description) {
      return NextResponse.json({ error: 'Simulation name and description is required' }, { status: 400 });
    }
    const newSimulationState = SimulationFactory.create({
      simulationName: simulationName,
      description: description,
      userId: userId
    });
    const db = getDB();
    await saveNewSimulation(newSimulationState,await db);
    //console.log("A new simulation was created in memory and is ready to be saved:", newSimulationState);
    
    return NextResponse.json({
      message: 'Simulation created successfully!',
      simulationId: newSimulationState.id
    }, { status: 201 });

  } catch (err) {
    console.error("Simulation creation failed:", err);
    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create simulation' }, { status: 500 });
  }
}
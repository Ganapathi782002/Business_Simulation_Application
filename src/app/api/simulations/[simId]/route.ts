import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/get-db";
import { loadSimulationState } from "@/lib/simulation-persistence";
import { auth } from "@/lib/auth";

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

export async function GET(
  req: NextRequest,
  { params }: { params: { simId: string } }
) {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRETE!) as {
      id: string;
    };
    const userId = decoded.id;

    const db = await getDB();
    const initialState = await loadSimulationState(params.simId, db);

    if (!initialState) {
      return NextResponse.json(
        { error: "Simulation not found" },
        { status: 404 }
      );
    }

    const userHasCompany = initialState.companies.some(
      (c) => c.userId === userId
    );

    return NextResponse.json({ initialState, userHasCompany });
  } catch (err) {
    console.error(`Failed to fetch simulation ${params.simId}:`, err);
    return NextResponse.json(
      { error: "Failed to fetch simulation data" },
      { status: 500 }
    );
  }
}

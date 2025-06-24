import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/get-db";
import { DecisionPayload } from "@/components/simulation/types";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { simId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { type, data, companyId }: DecisionPayload & { companyId: string } =
      await req.json();

    const db = await getDB();
    const company = await db.getCompany(companyId);
    if (!company || company.user_id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const simulation = await db.getSimulation(params.simId);

    if (!simulation) {
      return NextResponse.json(
        { error: "Simulation not found" },
        { status: 404 }
      );
    }

    const fullDecision = {
      companyId: companyId,
      period: simulation.current_period,
      type: type,
      data: data,
      submittedAt: new Date().toISOString(),
      processed: false,
      processedAt: null,
    };

    await db.createDecision(fullDecision);

    return NextResponse.json({ message: "Decision saved" }, { status: 201 });
  } catch (err) {
    console.error("Failed to save decision:", err);
    return NextResponse.json(
      { error: "Failed to save decision" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getDB } from '@/lib/get-db';
import { DecisionPayload } from '@/components/simulation/types';

export async function POST(
  req: NextRequest,
  { params }: { params: { simId: string } }
) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRETE!) as { id: string };
    const userId = decoded.id;
    const decisionPayload: DecisionPayload = await req.json();

    const db = await getDB();
    const companies = await db.getCompaniesBySimulation(params.simId);
    const userCompany = companies.find((c: any) => c.user_id === userId);

    if (!userCompany) {
      return NextResponse.json({ error: 'No company found for this user in this simulation' }, { status: 403 });
    }
    const fullDecision = {
      companyId: userCompany.id,
      period: 0,
      type: decisionPayload.type,
      data: decisionPayload.data,
    };

    await db.createDecision(fullDecision);

    return NextResponse.json({ message: 'Decision saved' }, { status: 201 });

  } catch (err) {
    console.error("Failed to save decision:", err);
    return NextResponse.json({ error: 'Failed to save decision' }, { status: 500 });
  }
}
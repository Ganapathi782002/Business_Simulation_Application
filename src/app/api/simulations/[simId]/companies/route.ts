import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDB } from '@/lib/get-db';

export async function POST(
  req: NextRequest,
  { params }: { params: { simId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { companyName }: { companyName: string} = await req.json();
    const { simId } = params;

    if (!companyName) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }
    const now = new Date().toISOString();
    const newCompany = {
      id: `company_${Date.now()}`,
      simulationId: simId,
      userId: session.user.id,
      name: companyName,
      description: `Player-founded company in simulation ${simId}`,
      logoUrl: null,
      cashBalance: 1000000,
      totalAssets: 1000000,
      totalLiabilities: 0,
      creditRating: 'A',
      brandValue: 50,
      data: '{}',
      createdAt: now,
      updatedAt: now,
    };
    const db = await getDB();
    await db.createCompany(newCompany);

    return NextResponse.json({ company: newCompany }, { status: 201 });

  } catch (err) {
    console.error("Company creation failed:", err);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
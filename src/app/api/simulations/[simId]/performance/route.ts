import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDB } from '@/lib/get-db';

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

    const companies = await db.getCompaniesBySimulation(params.simId);
    const userCompany = companies.find((c: any) => c.user_id === session.user.id);

    if (!userCompany) {
      return NextResponse.json({ history: [] });
    }

    const history = await db.getPerformanceHistory(userCompany.id);

    return NextResponse.json({ history });

  } catch (err) {
    console.error(`Failed to fetch performance for sim ${params.simId}:`, err);
    return NextResponse.json({ error: 'Failed to fetch performance data' }, { status: 500 });
  }
}
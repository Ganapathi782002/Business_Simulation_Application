import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';
import { auth } from '@/lib/auth';
import { getDB } from '@/lib/get-db';

export async function DELETE(
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

    await db.deleteCompany(params.companyId);

    return NextResponse.json({ message: 'Company deleted successfully' });

  } catch (err) {
    console.error(`Failed to delete company ${params.companyId}:`, err);
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
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

    // Security Check: Fetch the company first to ensure it belongs to the logged-in user
    const company = await db.getCompany(params.companyId);
    if (!company || company.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // If the check passes, delete the company
    await db.deleteCompany(params.companyId);

    return NextResponse.json({ message: 'Company deleted successfully' });

  } catch (err) {
    console.error(`Failed to delete company ${params.companyId}:`, err);
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
  }
}
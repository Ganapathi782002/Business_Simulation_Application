import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';
import { auth } from '@/lib/auth';
import { getDB } from '@/lib/get-db';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { companyId: string, productId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDB();
    const product = await db.getProduct(params.productId);
    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    const company = await db.getCompany(product.company_id);
    if (!company || company.user_id !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.deleteProduct(params.productId);

    return NextResponse.json({ message: 'Product deleted successfully' });

  } catch (err) {
    console.error(`Failed to delete product ${params.productId}:`, err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
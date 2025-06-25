import { ProductCatalogPage } from "@/components/game/product-catalog-page";
import { AppLayout } from "@/components/layout/app-layout";
export const runtime = 'edge';

export default function ViewProductsPage({ params }: { params: { simId: string; companyId: string } }) {
  return (
    <AppLayout>
      <ProductCatalogPage simulationId={params.simId} companyId={params.companyId} />
    </AppLayout>
  );
}
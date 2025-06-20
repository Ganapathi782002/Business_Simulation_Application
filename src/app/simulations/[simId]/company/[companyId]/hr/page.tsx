import { loadSimulationState } from '@/lib/simulation-persistence';
import { SimulationProvider } from '@/components/simulation/simulation-context';
import { HrPage } from '@/components/game/hr-page';
import { getDB } from '@/lib/get-db';
import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { auth } from '@/lib/auth';

export default async function HumanResourcesPage({ params }: { params: { simId: string; companyId: string } }) {
  const session = await auth();
  if (!session?.user) {
    return null; 
  }

  const db = await getDB();
  const initialState = await loadSimulationState(params.simId, db);

  if (!initialState) {
    notFound();
  }

  return (
    <AppLayout>
      <SimulationProvider initialState={initialState} activeCompanyId={params.companyId}>
        <HrPage />
      </SimulationProvider>
    </AppLayout>
  );
}
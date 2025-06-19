import { loadSimulationState } from '@/lib/simulation-persistence';
import { SimulationProvider } from '@/components/simulation/simulation-context';
import { PerformancePage } from '@/components/performance/performance-page';
import { getDB } from '@/lib/get-db';
import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';

export default async function ViewPerformancePage({ params }: { params: { simId: string; companyId: string } }) {

  const db = await getDB();
  const initialState = await loadSimulationState(params.simId, db);

  if (!initialState) {
    notFound();
  }

  return (
    <AppLayout>
      <SimulationProvider initialState={initialState} activeCompanyId={params.companyId}>
        <PerformancePage />
      </SimulationProvider>
    </AppLayout>
  );
}
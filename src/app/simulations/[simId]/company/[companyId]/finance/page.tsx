import { loadSimulationState } from '@/lib/simulation-persistence';
import { SimulationProvider } from '@/components/simulation/simulation-context';
import { FinancePage } from '@/components/game/finance-page';
import { getDB } from '@/lib/get-db';
import { notFound } from 'next/navigation';

export default async function ViewFinancePage({ params }: { params: { simId: string; companyId: string } }) {
  const db = await getDB();
  const initialState = await loadSimulationState(params.simId, db);

  if (!initialState) {
    notFound();
  }

  return (
    <SimulationProvider initialState={initialState} activeCompanyId={params.companyId}>
      <FinancePage />
    </SimulationProvider>
  );
}
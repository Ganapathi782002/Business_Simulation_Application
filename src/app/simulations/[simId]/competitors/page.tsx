import { loadSimulationState } from '@/lib/simulation-persistence';
import { SimulationProvider } from '@/components/simulation/simulation-context';
import { CompetitorAnalysisPage } from '@/components/game/competitor-analysis-page';
import { getDB } from '@/lib/get-db';
import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';

export default async function ViewCompetitorsPage({ params }: { params: { simId: string } }) {
  const db = await getDB();
  const initialState = await loadSimulationState(params.simId, db);

  if (!initialState) { notFound(); }

  return (
    <AppLayout>
      <SimulationProvider initialState={initialState}>
        <CompetitorAnalysisPage />
      </SimulationProvider>
    </AppLayout>
  );
}
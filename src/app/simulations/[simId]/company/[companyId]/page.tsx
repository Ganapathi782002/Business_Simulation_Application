import { loadSimulationState } from '@/lib/simulation-persistence';
import { SimulationProvider } from '@/components/simulation/simulation-context';
import { GameDashboard } from '@/components/game/game-dashboard';
import { getDB } from '@/lib/get-db';
import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';

export default async function CompanyDashboardPage({ params }: { params: { simId: string } }) {
  
  const db = await getDB();
  const initialState = await loadSimulationState(params.simId, db);
  
  if (!initialState) {
    notFound();
  }

  return (
    <AppLayout>
      <SimulationProvider initialState={initialState}>
        <GameDashboard />
      </SimulationProvider>
    </AppLayout>
  );
}
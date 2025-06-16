import { getDB } from '@/lib/get-db';
import { loadSimulationState } from '@/lib/simulation-persistence';
import { SimulationProvider } from '@/components/simulation/simulation-context';
import { ManageCompany } from '@/components/game/manage-company';
import { GameDashboard } from '@/components/game/game-dashboard';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function SimulationPage({ params }: { params: { simId: string } }) {

  const session = await auth();
  if (!session?.user) {
    return null;
  }
  const userId = session.user.id;

  const db = await getDB();
  const initialState = await loadSimulationState(params.simId, db);

  if (!initialState) {
    notFound();
  }

  const userCompany = initialState.companies.find(c => c.userId === userId);
  // if(!userCompany){
  //   notFound();
  // }

  return (
    <div>
      {userCompany ? (
        <SimulationProvider initialState={initialState}>
          <GameDashboard />
        </SimulationProvider>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold">Welcome to "{initialState.name}"</h2>
          <p className="text-gray-500 mt-2 mb-4">You haven't established a company in this simulation yet. Click the button below to found your company.</p>
          <ManageCompany simulationId={params.simId} />
        </div>
      )}
    </div>
  );
}
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect, notFound } from 'next/navigation';
import { getDB } from '@/lib/get-db';
import { loadSimulationState } from '@/lib/simulation-persistence';
import { SimulationProvider } from '@/components/simulation/simulation-context';
import { ManageCompany } from './manage-company';
import { GameDashboard } from '@/components/game/game-dashboard';

export async function SimulationView({ simId }: { simId: string }) {

  const token = cookies().get('token')?.value;
  if (!token) {
    redirect('/');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRETE!) as { id: string };
  const userId = decoded.id;

  const db = await getDB();
  const initialState = await loadSimulationState(simId, db);

  if (!initialState) {
    notFound();
  }

  const userCompany = initialState.companies.find(c => c.userId === userId);

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
          <ManageCompany simulationId={simId} />
        </div>
      )}
    </div>
  );
}
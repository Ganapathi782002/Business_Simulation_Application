import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect, notFound } from 'next/navigation';
import { getDB } from '@/lib/get-db';
import { loadSimulationState } from '@/lib/simulation-persistence';
import { SimulationProvider } from '@/components/simulation/simulation-context';
import { ManageCompany } from '@/components/game/manage-company';
import { GameDashboard } from '@/components/game/game-dashboard';
import { AppLayout } from '@/components/layout/app-layout'; // ADD THIS IMPORT

export default async function SimulationPage({ params }: { params: { simId: string } }) {
  
  const token = cookies().get('token')?.value;
  if (!token) {
    redirect('/');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRETE!) as { id: string };
  const userId = decoded.id;

  const db = await getDB();
  const initialState = await loadSimulationState(params.simId, db);
  
  if (!initialState) {
    notFound();
  }

  const userCompany = initialState.companies.find(c => c.userId === userId);

  return (
    // ADD THE APPLAYOUT WRAPPER HERE
    <AppLayout>
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
    </AppLayout>
  );
}
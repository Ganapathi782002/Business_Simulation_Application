import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import { getDB } from '@/lib/get-db';

export default async function SimulationPage({ params }: { params: { simId: string } }) {
  
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    redirect('/');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRETE!) as { id: string };
  const userId = decoded.id;

  const db = await getDB();
  const [simulation, companies] = await Promise.all([
    db.getSimulation(params.simId),
    db.getCompaniesBySimulation(params.simId)
  ]);
  
  if (!simulation) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-red-500">Simulation Not Found</h1>
            <p>The requested simulation does not exist.</p>
        </div>
    );
  }

  const userCompany = companies.find((c: any) => c.user_id === userId);

  return (
    <div className="p-6">
      {userCompany ? (
        // --- IF A COMPANY EXISTS, RENDER THIS ---
        //replace this with a full <GameDashboard /> component
        <div>
          <h1 className="text-3xl font-bold">Welcome back to {userCompany.name}</h1>
          <p className="text-lg text-gray-500">You are in Period {simulation.current_period}.</p>
          <div className="mt-8 p-4 bg-green-100 border border-green-300 rounded-lg">
            <p><strong>Next Step:</strong> Display the main game dashboard here.</p>
          </div>
        </div>

      ) : (
        // --- IF NO COMPANY EXISTS, RENDER THIS ---
        //replace this with a full <CreateCompanyForm />
        <div>
            <h1 className="text-3xl font-bold">Create Your Company</h1>
            <p className="text-lg text-gray-500">For the simulation: "{simulation.name}"</p>
            <div className="mt-8 p-4 bg-blue-100 border border-blue-300 rounded-lg">
                <p><strong>Next Step:</strong> Display the 'Create Company' form here.</p>
            </div>
        </div>
      )}
    </div>
  );
}
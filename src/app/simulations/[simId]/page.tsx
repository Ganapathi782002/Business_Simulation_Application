import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect, notFound } from 'next/navigation';
import { getDB } from '@/lib/get-db';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SimulationSetupWizard } from '@/components/setup/simulation-setup-wizard';

export default async function SimulationLobbyPage({ params }: { params: { simId: string } }) {
  const token = cookies().get('token')?.value;
  if (!token) { redirect('/'); }
  const decoded = jwt.verify(token, process.env.JWT_SECRETE!) as { id: string };
  const userId = decoded.id;

  const db = await getDB();
  const [simulation, companies] = await Promise.all([
    db.getSimulation(params.simId),
    db.getCompaniesBySimulation(params.simId)
  ]);

  if (!simulation) { notFound(); }
  const userCompanies = companies.filter((c: any) => c.user_id === userId);

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl text-black font-bold">Available companies in: {simulation.name}</h1>
            <p className="text-muted-foreground">Select a company to manage or create a new one.</p>
          </div>
          <SimulationSetupWizard
            startStep={2}
            simulationId={params.simId}
            triggerButton={<Button>Establish New Company</Button>}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userCompanies.map((company: any) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{company.name}</CardTitle>
                <CardDescription>Cash Balance: ${company.cash_balance.toLocaleString()}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href={`/simulations/${params.simId}/company/${company.id}`} className="w-full">
                  <Button className="w-full">Manage Company</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        {userCompanies.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold">You have no companies in this simulation.</h2>
            <p className="text-gray-500 mt-2 mb-4">Click the button above to establish your first company.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
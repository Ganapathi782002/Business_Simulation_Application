import { loadSharedSimulationState } from '@/lib/simulation-persistence';
import { SimulationProvider } from '@/components/simulation/simulation-context';
import { CompetitorAnalysisPage } from '@/components/game/competitor-analysis-page';
import { getDB } from '@/lib/get-db';
import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { auth } from '@/lib/auth';
import { SimulationState } from '@/components/simulation/types';

export default async function ViewCompetitorsPage({ params }: { params: { simId: string; companyId: string } }) {
  
  const session = await auth();
  if (!session?.user) {
    return null; 
  }

  const db = await getDB();
  
  // Load the shared data for the simulation
  const partialState = await loadSharedSimulationState(params.simId, db);
  if (!partialState) {
    notFound();
  }

  // fetch the data that is specific to this company
  const [decisions, performanceResults, productPerformance] = await Promise.all([
    db.getDecisionsByCompany(params.companyId),
    db.getPerformanceHistory(params.companyId),
    db.getProductPerformanceByCompany(params.companyId)
  ]);
  
  //Assemble the final, complete state for the provider, mapping all data correctly
  const initialState: SimulationState = {
    ...(partialState as SimulationState),
    decisions: decisions.map((d: any) => ({ id: d.id, companyId: d.company_id, period: d.period, type: d.type, data: d.data, submittedAt: d.submitted_at, processed: !!d.processed, processedAt: d.processed_at })),
    performanceResults: performanceResults.map((pr: any) => ({ id: pr.id, companyId: pr.company_id, period: pr.period, revenue: pr.revenue, costs: pr.costs, profit: pr.profit, marketShare: pr.market_share, cashFlow: pr.cash_flow, roi: pr.roi, customerSatisfaction: pr.customer_satisfaction, employeeSatisfaction: pr.employee_satisfaction, sustainabilityScore: pr.sustainability_score, innovationScore: pr.innovation_score, brandValueChange: pr.brand_value_change, data: pr.data, createdAt: pr.created_at })),
    productPerformance: productPerformance.map((pp: any) => ({ id: pp.id, productId: pp.product_id, period: pp.period, salesVolume: pp.sales_volume, revenue: pp.revenue, costs: pp.costs, profit: pp.profit, marketShare: pp.market_share, customerSatisfaction: pp.customer_satisfaction, data: pp.data, createdAt: pp.created_at })),
  };

  return (
    <AppLayout>
      <SimulationProvider initialState={initialState} activeCompanyId={params.companyId}>
        <CompetitorAnalysisPage />
      </SimulationProvider>
    </AppLayout>
  );
}
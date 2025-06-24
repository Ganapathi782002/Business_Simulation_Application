import { auth } from '@/lib/auth';
import { getDB } from '@/lib/get-db';
import { AppLayout } from '@/components/layout/app-layout';
import { MarketingPage } from '@/components/game/marketing-page';
import { notFound, redirect } from 'next/navigation';
import { Company, PerformanceResults } from '@/components/simulation/types';

async function getMarketingPageData(companyId: string) {
    const db = await getDB();
    const [company, history] = await Promise.all([
        db.getCompany(companyId),
        db.getPerformanceHistory(companyId)
    ]);

    const formattedHistory = history.map((pr: any) => ({
        id: pr.id, companyId: pr.company_id, period: pr.period, revenue: pr.revenue,
        costs: pr.costs, profit: pr.profit, marketShare: pr.market_share,
        cashFlow: pr.cash_flow, roi: pr.roi, customerSatisfaction: pr.customer_satisfaction,
        employeeSatisfaction: pr.employee_satisfaction, sustainabilityScore: pr.sustainability_score,
        innovationScore: pr.innovation_score, brandValueChange: pr.brand_value_change,
        data: pr.data, createdAt: pr.created_at, salaryCost: pr.salary_cost,
        marketingCost: pr.marketing_cost, rdCost: pr.rd_cost, avgSalary: pr.avg_salary,
        trainingBudget: pr.training_budget, totalEmployees: pr.total_employees,
        productivity: pr.productivity, turnoverRate: pr.turnover_rate
    }));
    
    const formattedCompany: Company | null = company ? {
        id: company.id, simulationId: company.simulation_id, userId: company.user_id,
        name: company.name, description: company.description, logoUrl: company.logo_url,
        cashBalance: company.cash_balance, totalAssets: company.total_assets,
        totalLiabilities: company.total_liabilities, creditRating: company.credit_rating,
        brandValue: company.brand_value, data: company.data, createdAt: company.created_at,
        updatedAt: company.updated_at
    } : null;

    return { company: formattedCompany, history: formattedHistory };
}

export default async function ViewMarketingPage({ params }: { params: { simId: string; companyId: string } }) {
  const session = await auth();
  if (!session?.user || session.user.id !== (await (await getDB()).getCompany(params.companyId))?.user_id) {
    redirect('/');
  }

  const { company, history } = await getMarketingPageData(params.companyId);

  if (!company) {
    notFound();
  }

  return (
    <AppLayout>
      <MarketingPage
        initialCompany={company}
        initialHistory={history}
      />
    </AppLayout>
  );
}
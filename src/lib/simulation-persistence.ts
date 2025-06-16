import { Product, SimulationState } from "@/components/simulation/types";
import { DatabaseService } from "./database";

export async function loadSimulationState(simulationId: string, db: DatabaseService): Promise<SimulationState | null> {
  const [simulation, companies, decisions, marketConditions, performanceResults, productPerformance, events] = await Promise.all([
    db.getSimulation(simulationId),
    db.getCompaniesBySimulation(simulationId),
    db.getDecisionsBySimulation(simulationId),
    db.getMarketConditionsBySimulation(simulationId),
    db.getPerformanceResultsBySimulation(simulationId),
    db.getProductPerformanceBySimulation(simulationId),
    db.getEvents(simulationId)
  ]);

  if (!simulation) {
    return null;
  }
  const allProducts: Product[] = [];
  for (const company of companies) {
      const products = await db.getProductsByCompany(company.id);
      allProducts.push(...products);
  }
  const state: SimulationState = {
    id: simulation.id,
    name: simulation.name,
    description: simulation.description,
    config: simulation.config,
    currentPeriod: simulation.current_period,
    status: simulation.status,
    createdBy: simulation.created_by,
    createdAt: simulation.created_at,
    updatedAt: simulation.updated_at,
    companies: companies.map((c: any) => ({
      id: c.id,
      simulationId: c.simulation_id,
      userId: c.user_id,
      name: c.name,
      description: c.description,
      logoUrl: c.logo_url,
      cashBalance: c.cash_balance,
      totalAssets: c.total_assets,
      totalLiabilities: c.total_liabilities,
      creditRating: c.credit_rating,
      brandValue: c.brand_value,
      data: c.data,
      createdAt: c.created_at,
      updatedAt: c.updated_at
    })),
    products: allProducts.map((p: any) => ({
        id: p.id,
        companyId: p.company_id,
        name: p.name,
        description: p.description,
        category: p.category,
        qualityRating: p.quality_rating,
        innovationRating: p.innovation_rating,
        sustainabilityRating: p.sustainability_rating,
        productionCost: p.production_cost,
        sellingPrice: p.selling_price,
        inventoryLevel: p.inventory_level,
        productionCapacity: p.production_capacity,
        developmentCost: p.development_cost,
        marketingBudget: p.marketing_budget,
        status: p.status,
        launchPeriod: p.launch_period,
        discontinuePeriod: p.discontinue_period,
        data: p.data,
        createdAt: p.created_at,
        updatedAt: p.updated_at
    })),
    decisions: decisions.map((d: any) => ({
        id: d.id,
        companyId: d.company_id,
        period: d.period,
        type: d.type,
        data: d.data,
        submittedAt: d.submitted_at,
        processed: !!d.processed,
        processedAt: d.processed_at
    })),
    marketConditions: marketConditions,
    performanceResults: performanceResults,
    productPerformance: productPerformance,
    events: events
  };

  return state;
}

export async function saveNewSimulation(state: SimulationState, db: DatabaseService): Promise<void> {
    try{
        await db.createSimulation(state)

        for(const company of state.companies){
            await db.createCompany(company);
        }
        for(const marketCondition of state.marketConditions){
            await db.createMarketConditions(marketCondition);
        }

    }catch(error){
        console.error("Error saving new simulation state to database:", error);
        throw error;
    }
}
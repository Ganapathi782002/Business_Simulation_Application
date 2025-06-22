import { SimulationState, Product, Decision, PerformanceResults, ProductPerformance } from '@/components/simulation/types';
import { DatabaseService } from './database';

// This function now inly loads data shared across the entire simulation
export async function loadSharedSimulationState(
  simulationId: string,
  db: DatabaseService
): Promise<Partial<SimulationState> | null> {
  const [
    simulation,
    allCompanies,
    marketConditions,
    events,
  ] = await Promise.all([
    db.getSimulation(simulationId),
    db.getCompaniesBySimulation(simulationId),
    db.getMarketConditionsBySimulation(simulationId),
    db.getEvents(simulationId),
  ]);

  if (!simulation) {
    return null;
  }
  
  const allProducts: Product[] = [];
  for (const company of allCompanies) {
    const products = await db.getProductsByCompany(company.id);
    allProducts.push(...products);
  }
  const partialState: Partial<SimulationState> = {
    id: simulation.id,
    name: simulation.name,
    description: simulation.description,
    config: simulation.config,
    currentPeriod: simulation.current_period,
    status: simulation.status,
    createdBy: simulation.created_by,
    createdAt: simulation.created_at,
    updatedAt: simulation.updated_at,
    companies: allCompanies.map((c: any) => ({ id: c.id, simulationId: c.simulation_id, userId: c.user_id, name: c.name, description: c.description, logoUrl: c.logo_url, cashBalance: c.cash_balance, totalAssets: c.total_assets, totalLiabilities: c.total_liabilities, creditRating: c.credit_rating, brandValue: c.brand_value, data: c.data, createdAt: c.created_at, updatedAt: c.updated_at })),
    products: allProducts.map((p: any) => ({ id: p.id, companyId: p.company_id, name: p.name, description: p.description, category: p.category, qualityRating: p.quality_rating, innovationRating: p.innovation_rating, sustainabilityRating: p.sustainability_rating, productionCost: p.production_cost, sellingPrice: p.selling_price, inventoryLevel: p.inventory_level, productionCapacity: p.production_capacity, developmentCost: p.development_cost, marketingBudget: p.marketing_budget, status: p.status, launchPeriod: p.launch_period, discontinuePeriod: p.discontinue_period, data: p.data, createdAt: p.created_at, updatedAt: p.updated_at })),
    marketConditions: marketConditions.map((mc: any) => ({ id: mc.id, simulationId: mc.simulation_id, period: mc.period, totalMarketSize: mc.total_market_size, segmentDistribution: mc.segment_distribution, economicIndicators: mc.economic_indicators, consumerPreferences: mc.consumer_preferences, technologyTrends: mc.technology_trends, sustainabilityImportance: mc.sustainability_importance, data: mc.data, createdAt: mc.created_at })),
    events: events,
  };
  
  return partialState;
}


export async function saveSimulationState(state: SimulationState, db: DatabaseService): Promise<void> {
  try {
    const databasePromises = [];
    const justCompletedPeriod = state.currentPeriod - 1;

    databasePromises.push(db.updateSimulation(state.id, state));

    for (const company of state.companies) {
      databasePromises.push(db.updateCompany(company.id, company));
    }

    for (const product of state.products) {
      databasePromises.push(db.updateProduct(product.id, product));
    }
    
    const newPerformanceResults = state.performanceResults.filter(pr => pr.period === justCompletedPeriod);
    for (const pr of newPerformanceResults) {
        databasePromises.push(db.createPerformanceResults(pr));
    }

    const newProductPerformance = state.productPerformance.filter(pp => pp.period === justCompletedPeriod);
    for (const pp of newProductPerformance) {
        databasePromises.push(db.createProductPerformance(pp));
    }
    
    const newEvents = state.events.filter(e => e.period === justCompletedPeriod);
    for (const event of newEvents) {
        databasePromises.push(db.createEvent(event));
    }

    const newMarketConditions = state.marketConditions.find(mc => mc.period === state.currentPeriod);
    if (newMarketConditions) {
        databasePromises.push(db.createMarketConditions(newMarketConditions));
    }

    const processedDecisions = state.decisions.filter(d => d.period === justCompletedPeriod && d.processed);
    for (const decision of processedDecisions) {
        databasePromises.push(db.updateDecision(decision.id, { 
            processed: decision.processed, 
            processedAt: decision.processedAt 
        }));
    }
    
    await Promise.all(databasePromises);

  } catch (error) {
    console.error("Error saving simulation state:", error);
    throw error;
  }
}
import { Product, SimulationState } from "@/components/simulation/types";
import { DatabaseService } from "./database";

export async function loadSimulationState(
  simulationId: string,
  db: DatabaseService
): Promise<SimulationState | null> {
  const [
    simulation,
    companies,
    decisions,
    marketConditions,
    performanceResults,
    productPerformance,
    events,
  ] = await Promise.all([
    db.getSimulation(simulationId),
    db.getCompaniesBySimulation(simulationId),
    db.getDecisionsBySimulation(simulationId),
    db.getMarketConditionsBySimulation(simulationId),
    db.getPerformanceResultsBySimulation(simulationId),
    db.getProductPerformanceBySimulation(simulationId),
    db.getEvents(simulationId),
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
      updatedAt: c.updated_at,
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
      updatedAt: p.updated_at,
    })),
    decisions: decisions.map((d: any) => ({
      id: d.id,
      companyId: d.company_id,
      period: d.period,
      type: d.type,
      data: d.data,
      submittedAt: d.submitted_at,
      processed: !!d.processed,
      processedAt: d.processed_at,
    })),
    marketConditions: marketConditions,
    performanceResults: performanceResults,
    productPerformance: productPerformance,
    events: events,
  };

  return state;
}

export async function saveSimulationState(
  state: SimulationState,
  db: DatabaseService
): Promise<void> {
  try {
    console.log(
      `--- [SAVE STATE] Saving state for sim ${state.id}. The game is now advancing to Period ${state.currentPeriod}. ---`
    );
    const databasePromises = [];
    const justCompletedPeriod = state.currentPeriod - 1;
    console.log(
      `[SAVE STATE] Looking for new records from the just-completed period: ${justCompletedPeriod}`
    );
    databasePromises.push(db.updateSimulation(state.id, state));
    for (const company of state.companies) {
      databasePromises.push(db.updateCompany(company.id, company));
    }
    for (const product of state.products) {
      databasePromises.push(db.updateProduct(product.id, product));
    }
    const newPerformanceResults = state.performanceResults.filter(
      (pr) => pr.period === justCompletedPeriod
    );
    console.log(
      `[SAVE STATE] Found ${newPerformanceResults.length} new 'performance_results' records to save:`,
      JSON.stringify(newPerformanceResults, null, 2)
    );

    for (const pr of newPerformanceResults) {
      try {
        console.log(
          "[SAVE STATE] Attempting to save this performance record:",
          pr
        );
        databasePromises.push(db.createPerformanceResults(pr));
      } catch (e) {
        console.error(
          "---!!! FAILED TO SAVE THIS SPECIFIC PERFORMANCE RECORD !!!---"
        );
        console.error("The problematic data object was:", pr);
        console.error("The error was:", e);
      }
    }
    const newProductPerformance = state.productPerformance.filter(
      (pp) => pp.period === justCompletedPeriod
    );
    console.log(
      `[SAVE STATE] Found ${newProductPerformance.length} new 'product_performance' records to save.`
    );
    for (const pp of newProductPerformance) {
      databasePromises.push(db.createProductPerformance(pp));
    }
    const newEvents = state.events.filter(
      (e) => e.period === justCompletedPeriod
    );
    console.log(`[SAVE STATE] Found ${newEvents.length} new events to save.`);
    for (const event of newEvents) {
      databasePromises.push(db.createEvent(event));
    }
    const newMarketConditions = state.marketConditions.find(
      (mc) => mc.period === state.currentPeriod
    );
    if (newMarketConditions) {
      console.log(
        `[SAVE STATE] Found 1 new market condition to save for upcoming period ${state.currentPeriod}.`
      );
      databasePromises.push(db.createMarketConditions(newMarketConditions));
    }
    await Promise.all(databasePromises);

    console.log(
      "--- [SAVE STATE] Game save API call finished successfully! ---"
    );
  } catch (error) {
    console.error("Error saving simulation state:", error);
    throw error;
  }
}

export async function saveNewSimulation(
  state: SimulationState,
  db: DatabaseService
): Promise<void> {
  try {
    await db.createSimulation(state);

    for (const company of state.companies) {
      await db.createCompany(company);
    }
    for (const marketCondition of state.marketConditions) {
      await db.createMarketConditions(marketCondition);
    }
  } catch (error) {
    console.error("Error saving new simulation state to database:", error);
    throw error;
  }
}

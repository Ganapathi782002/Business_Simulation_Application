import { D1Database } from "@cloudflare/workers-types";

export interface DatabaseService {
  // Simulation operations
  getSimulation(id: string): Promise<any>;
  createSimulation(simulation: any): Promise<string>;
  updateSimulation(id: string, simulation: any): Promise<void>;
  getSimulationsByUser(userId: string): Promise<any[]>;
  deleteSimulation(id: string): Promise<void>;

  // Company operations
  getCompany(id: string): Promise<any>;
  getCompaniesBySimulation(simulationId: string): Promise<any[]>;
  createCompany(company: any): Promise<string>;
  updateCompany(id: string, company: any): Promise<void>;
  deleteCompany(id: string): Promise<void>;
  getPerformanceResultsByCompany(companyId: string): Promise<any[]>;
  getProductPerformanceByCompany(companyId: string): Promise<any[]>;
  getAllProductPerformanceByCompany(companyId: string): Promise<any[]>;

  // Product operations
  getProduct(id: string): Promise<any>;
  getProductsByCompany(companyId: string): Promise<any[]>;
  createProduct(product: any): Promise<string>;
  updateProduct(id: string, product: any): Promise<void>;
  deleteProduct(id: string): Promise<void>;

  // Decision operations
  getDecision(id: string): Promise<any>;
  getDecisionsByCompany(companyId: string, period?: number): Promise<any[]>;
  createDecision(decision: any): Promise<string>;
  updateDecision(id: string, decision: any): Promise<void>;

  // Market conditions operations
  getMarketConditions(simulationId: string, period: number): Promise<any>;
  createMarketConditions(marketConditions: any): Promise<string>;

  // Performance results operations
  getPerformanceResults(companyId: string, period: number): Promise<any>;
  getPerformanceHistory(companyId: string): Promise<any[]>;
  createPerformanceResults(results: any): Promise<string>;

  // Product performance operations
  getProductPerformance(productId: string, period: number): Promise<any>;
  getProductPerformanceHistory(productId: string): Promise<any[]>;
  createProductPerformance(performance: any): Promise<string>;

  // Event operations
  getEvents(simulationId: string, period?: number): Promise<any[]>;
  createEvent(event: any): Promise<string>;

  // User operations
  getUser(id: string): Promise<any>;
  getUserByEmail(email: string): Promise<any>;
  createUser(user: any): Promise<string>;
  updateUser(id: string, user: any): Promise<void>;

  getDecisionsBySimulation(simulationId: string): Promise<any[]>;
  getMarketConditionsBySimulation(simulationId: string): Promise<any[]>;
  getPerformanceResultsBySimulation(simulationId: string): Promise<any[]>;
  getProductPerformanceBySimulation(simulationId: string): Promise<any[]>;
}

export class D1DatabaseService implements DatabaseService {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  // Simulation operations
  async getSimulation(id: string): Promise<any> {
    const result = await this.db
      .prepare("SELECT * FROM simulations WHERE id = ?")
      .bind(id)
      .first();

    return result;
  }

  async createSimulation(simulation: any): Promise<string> {
    const id = simulation.id || `sim_${Date.now()}`;

    await this.db
      .prepare(
        `INSERT INTO simulations (
        id, name, description, config, current_period, status, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        simulation.name,
        simulation.description,
        simulation.config,
        simulation.currentPeriod,
        simulation.status,
        simulation.createdBy,
        simulation.createdAt,
        simulation.updatedAt
      )
      .run();

    return id;
  }

  async updateSimulation(id: string, data: any): Promise<void> {
    await this.db
      .prepare(
        `UPDATE simulations SET 
        name = ?, 
        description = ?, 
        config = ?, 
        current_period = ?, 
        status = ?, 
        updated_at = ?
      WHERE id = ?`
      )
      .bind(
        data.name,
        data.description,
        data.config,
        data.currentPeriod,
        data.status,
        new Date().toISOString(),
        id
      )
      .run();
  }

  async getSimulationsByUser(userId: string): Promise<any[]> {
    const result = await this.db
      .prepare(
        "SELECT * from simulations where created_by = ? ORDER BY created_at DESC"
      )
      .bind(userId)
      .all();

    return result.results ?? [];
  }

  async deleteSimulation(id: string): Promise<void> {
    await this.db
      .prepare("DELETE FROM simulations WHERE id = ?")
      .bind(id)
      .run();
  }

  // Company operations
  async getCompany(id: string): Promise<any> {
    const result = await this.db
      .prepare("SELECT * FROM companies WHERE id = ?")
      .bind(id)
      .first();

    return result;
  }

  async getCompaniesBySimulation(simulationId: string): Promise<any[]> {
    const result = await this.db
      .prepare("SELECT * FROM companies WHERE simulation_id = ?")
      .bind(simulationId)
      .all();
    return result.results;
  }

  async createCompany(company: any): Promise<string> {
    const id = company.id || `company_${Date.now()}`;

    await this.db
      .prepare(
        `INSERT INTO companies (
        id, simulation_id, user_id, name, description, logo_url, cash_balance, 
        total_assets, total_liabilities, credit_rating, brand_value, data, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        company.simulationId,
        company.userId,
        company.name,
        company.description,
        company.logoUrl,
        company.cashBalance,
        company.totalAssets,
        company.totalLiabilities,
        company.creditRating,
        company.brandValue,
        company.data,
        company.createdAt,
        company.updatedAt
      )
      .run();

    return id;
  }

  async updateCompany(id: string, data: any): Promise<void> {
    await this.db
      .prepare(
        `UPDATE companies SET 
        name = ?, 
        description = ?, 
        logo_url = ?, 
        cash_balance = ?, 
        total_assets = ?, 
        total_liabilities = ?, 
        credit_rating = ?, 
        brand_value = ?, 
        data = ?, 
        updated_at = ?
      WHERE id = ?`
      )
      .bind(
        data.name,
        data.description,
        data.logoUrl,
        data.cashBalance,
        data.totalAssets,
        data.totalLiabilities,
        data.creditRating,
        data.brandValue,
        data.data,
        new Date().toISOString(),
        id
      )
      .run();
  }

  async deleteCompany(id: string): Promise<void> {
    await this.db.prepare("DELETE FROM companies WHERE id = ?").bind(id).run();
  }

  async getPerformanceResultsByCompany(companyId: string): Promise<any[]> {
    const result = await this.db
      .prepare("SELECT * FROM performance_results WHERE company_id = ?")
      .bind(companyId)
      .all();
    return result.results ?? [];
  }

  async getProductPerformanceByCompany(companyId: string): Promise<any[]> {
    const result = await this.db
      .prepare(
        `SELECT pp.* FROM product_performance pp JOIN products p ON pp.product_id = p.id WHERE p.company_id = ?`
      )
      .bind(companyId)
      .all();
    return result.results ?? [];
  }

  async getAllProductPerformanceByCompany(companyId: string): Promise<any[]> {
    const result = await this.db
      .prepare(
        `SELECT pp.* FROM product_performance pp JOIN products p ON pp.product_id = p.id WHERE p.company_id = ? ORDER BY pp.period ASC`
      )
      .bind(companyId)
      .all();
    return result.results ?? [];
  }

  // Product operations
  async getProduct(id: string): Promise<any> {
    const result = await this.db
      .prepare("SELECT * FROM products WHERE id = ?")
      .bind(id)
      .first();

    return result;
  }

  async getProductsByCompany(companyId: string): Promise<any[]> {
    const result = await this.db
      .prepare("SELECT * FROM products WHERE company_id = ?")
      .bind(companyId)
      .all();

    return result.results;
  }

  async createProduct(product: any): Promise<string> {
    const id = product.id || `product_${Date.now()}`;

    await this.db
      .prepare(
        `INSERT INTO products (
        id, company_id, name, description, category, quality_rating, 
        innovation_rating, sustainability_rating, production_cost, selling_price, 
        inventory_level, production_capacity, development_cost, marketing_budget, 
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        product.companyId,
        product.name,
        product.description,
        product.category,
        product.qualityRating,
        product.innovationRating,
        product.sustainabilityRating,
        product.productionCost,
        product.sellingPrice,
        0,
        2000,
        product.developmentCost,
        0,
        product.status,
        product.createdAt,
        product.updatedAt
      )
      .run();

    return id;
  }

  async updateProduct(id: string, product: any): Promise<void> {
    await this.db
      .prepare(
        `UPDATE products SET 
        name = ?, 
        description = ?, 
        category = ?, 
        quality_rating = ?, 
        innovation_rating = ?, 
        sustainability_rating = ?, 
        production_cost = ?, 
        selling_price = ?, 
        inventory_level = ?, 
        production_capacity = ?, 
        development_cost = ?, 
        marketing_budget = ?, 
        status = ?, 
        launch_period = ?, 
        discontinue_period = ?, 
        data = ?, 
        updated_at = ?
      WHERE id = ?`
      )
      .bind(
        product.name,
        product.description,
        product.category,
        product.qualityRating,
        product.innovationRating,
        product.sustainabilityRating,
        product.productionCost,
        product.sellingPrice,
        product.inventoryLevel,
        product.productionCapacity,
        product.developmentCost,
        product.marketingBudget,
        product.status,
        product.launchPeriod,
        product.discontinuePeriod,
        product.data,
        new Date().toISOString(),
        id
      )
      .run();
  }

  async deleteProduct(id: string): Promise<void> {
    await this.db.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
  }

  // Decision operations
  async getDecision(id: string): Promise<any> {
    const result = await this.db
      .prepare("SELECT * FROM decisions WHERE id = ?")
      .bind(id)
      .first();

    return result;
  }

  async getDecisionsByCompany(
    companyId: string,
    period?: number
  ): Promise<any[]> {
    let query = "SELECT * FROM decisions WHERE company_id = ?";
    let params: (string | number)[] = [companyId];

    if (period !== undefined) {
      query += " AND period = ?";
      params.push(period);
    }

    const result = await this.db
      .prepare(query)
      .bind(...params)
      .all();

    return result.results ?? [];
  }

  async createDecision(decision: any): Promise<string> {
    const id = decision.id || `decision_${Date.now()}`;

    await this.db
      .prepare(
        `INSERT INTO decisions (
        id, company_id, period, type, data, submitted_at, processed, processed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        decision.companyId,
        decision.period,
        decision.type,
        decision.data,
        decision.submittedAt,
        decision.processed ? 1 : 0,
        decision.processedAt
      )
      .run();

    return id;
  }

  async updateDecision(id: string, decision: any): Promise<void> {
    await this.db
      .prepare(
        `UPDATE decisions SET 
        processed = ?, 
        processed_at = ?
      WHERE id = ?`
      )
      .bind(decision.processed ? 1 : 0, decision.processedAt, id)
      .run();
  }

  // Market conditions operations
  async getMarketConditions(
    simulationId: string,
    period: number
  ): Promise<any> {
    const result = await this.db
      .prepare(
        "SELECT * FROM market_conditions WHERE simulation_id = ? AND period = ?"
      )
      .bind(simulationId, period)
      .first();

    return result;
  }

  async createMarketConditions(marketConditions: any): Promise<string> {
    const id = marketConditions.id || `market_${Date.now()}`;

    await this.db
      .prepare(
        `INSERT INTO market_conditions (
        id, simulation_id, period, total_market_size, segment_distribution, 
        economic_indicators, consumer_preferences, technology_trends, 
        sustainability_importance, data, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        marketConditions.simulationId,
        marketConditions.period,
        marketConditions.totalMarketSize,
        marketConditions.segmentDistribution,
        marketConditions.economicIndicators,
        marketConditions.consumerPreferences,
        marketConditions.technologyTrends,
        marketConditions.sustainabilityImportance,
        marketConditions.data,
        marketConditions.createdAt
      )
      .run();

    return id;
  }

  // Performance results operations
  async getPerformanceResults(companyId: string, period: number): Promise<any> {
    const result = await this.db
      .prepare(
        "SELECT * FROM performance_results WHERE company_id = ? AND period = ?"
      )
      .bind(companyId, period)
      .first();

    return result;
  }

  async getPerformanceHistory(companyId: string): Promise<any[]> {
    const result = await this.db
      .prepare(
        "SELECT * FROM performance_results WHERE company_id = ? ORDER BY period ASC"
      )
      .bind(companyId)
      .all();

    return result.results;
  }

  async createPerformanceResults(results: any): Promise<string> {
    const id = results.id || `perf_${Date.now()}`;

    await this.db
      .prepare(
        `INSERT INTO performance_results (
        id, company_id, period, revenue, costs, profit, market_share, 
        cash_flow, roi, customer_satisfaction, employee_satisfaction, 
        sustainability_score, innovation_score, brand_value_change, 
        data, created_at, salary_cost, marketing_cost, rd_cost,
        avg_salary, training_budget, total_employees, productivity, turnover_rate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        results.companyId,
        results.period,
        results.revenue,
        results.costs,
        results.profit,
        results.marketShare,
        results.cashFlow,
        results.roi,
        results.customerSatisfaction,
        results.employeeSatisfaction,
        results.sustainabilityScore,
        results.innovationScore,
        results.brandValueChange,
        results.data,
        results.createdAt,
        results.salaryCost ?? 0,
        results.marketingCost ?? 0,
        results.rdCost ?? 0,
        results.avgSalary ?? 0,
        results.trainingBudget ?? 0,
        results.totalEmployees ?? 0,
        results.productivity ?? 0,
        results.turnoverRate ?? 0
      )
      .run();

    return id;
  }

  // Product performance operations
  async getProductPerformance(productId: string, period: number): Promise<any> {
    const result = await this.db
      .prepare(
        "SELECT * FROM product_performance WHERE product_id = ? AND period = ?"
      )
      .bind(productId, period)
      .first();

    return result;
  }

  async getProductPerformanceHistory(productId: string): Promise<any[]> {
    const result = await this.db
      .prepare(
        "SELECT * FROM product_performance WHERE product_id = ? ORDER BY period ASC"
      )
      .bind(productId)
      .all();

    return result.results;
  }

  async createProductPerformance(performance: any): Promise<string> {
    const id = performance.id || `prod_perf_${Date.now()}`;

    await this.db
      .prepare(
        `INSERT INTO product_performance (
        id, product_id, period, sales_volume, revenue, costs, 
        profit, market_share, customer_satisfaction, data, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        performance.productId,
        performance.period,
        performance.salesVolume,
        performance.revenue,
        performance.costs,
        performance.profit,
        performance.marketShare,
        performance.customerSatisfaction,
        performance.data,
        performance.createdAt
      )
      .run();

    return id;
  }

  // Event operations
  async getEvents(simulationId: string, period?: number): Promise<any[]> {
    let query = "SELECT * FROM events WHERE simulation_id = ?";
    let params: (string | number)[] = [simulationId];

    if (period !== undefined) {
      query += " AND period = ?";
      params.push(period);
    }

    const result = await this.db
      .prepare(query)
      .bind(...params)
      .all();

    return result.results;
  }

  async createEvent(event: any): Promise<string> {
    const id = event.id || `event_${Date.now()}`;

    await this.db
      .prepare(
        `INSERT INTO events (
        id, simulation_id, period, type, name, description, 
        impact_area, impact_strength, affected_companies, data, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        event.simulationId,
        event.period,
        event.type,
        event.name,
        event.description,
        event.impactArea,
        event.impactStrength,
        event.affectedCompanies,
        event.data,
        event.createdAt
      )
      .run();

    return id;
  }

  // User operations
  async getUser(id: string): Promise<any> {
    const result = await this.db
      .prepare("SELECT * FROM users WHERE id = ?")
      .bind(id)
      .first();

    return result;
  }

  async getUserByEmail(email: string): Promise<any> {
    const result = await this.db
      .prepare("SELECT * FROM users WHERE email = ?")
      .bind(email)
      .first();

    return result;
  }

  async createUser(user: any): Promise<string> {
    const id = user.id || `user_${Date.now()}`;

    try {
      console.log("Preparing the query to insert user...");
      const result = await this.db
        .prepare(
          `INSERT INTO users (
        id, name, email, password_hash, role, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          id,
          user.name,
          user.email,
          user.passwordHash,
          user.role,
          user.createdAt,
          user.updatedAt
        )
        .run();

      if (result.success) {
        console.log(`User created with ID: ${id}`);
      } else {
        console.error("Failed to insert user:", result);
      }
    } catch (error) {
      console.error("Error while inserting user:", error);
    }

    return id;
  }

  async updateUser(id: string, user: any): Promise<void> {
    await this.db
      .prepare(
        `UPDATE users SET 
        name = ?, 
        email = ?, 
        password_hash = ?, 
        role = ?, 
        updated_at = ?
      WHERE id = ?`
      )
      .bind(
        user.name,
        user.email,
        user.passwordHash,
        user.role,
        user.updatedAt,
        id
      )
      .run();
  }

  async getDecisionsBySimulation(simulationId: string): Promise<any[]> {
    const result = await this.db
      .prepare(
        `SELECT d.* FROM decisions d JOIN companies c ON d.company_id = c.id WHERE c.simulation_id = ?`
      )
      .bind(simulationId)
      .all();
    return result.results ?? [];
  }

  async getMarketConditionsBySimulation(simulationId: string): Promise<any[]> {
    const result = await this.db
      .prepare(`SELECT * FROM market_conditions WHERE simulation_id = ?`)
      .bind(simulationId)
      .all();
    return result.results ?? [];
  }

  async getPerformanceResultsBySimulation(
    simulationId: string
  ): Promise<any[]> {
    const result = await this.db
      .prepare(
        `SELECT pr.* FROM performance_results pr JOIN companies c ON pr.company_id = c.id WHERE c.simulation_id = ?`
      )
      .bind(simulationId)
      .all();
    return result.results ?? [];
  }

  async getProductPerformanceBySimulation(
    simulationId: string
  ): Promise<any[]> {
    const result = await this.db
      .prepare(
        `SELECT pp.* FROM product_performance pp JOIN products p ON pp.product_id = p.id JOIN companies c ON p.company_id = c.id WHERE c.simulation_id = ?`
      )
      .bind(simulationId)
      .all();
    return result.results ?? [];
  }
}

// Create a mock database service for development
export class MockDatabaseService implements DatabaseService {
  private simulations: Map<string, any> = new Map();
  private companies: Map<string, any> = new Map();
  private products: Map<string, any> = new Map();
  private decisions: Map<string, any> = new Map();
  private marketConditions: Map<string, any> = new Map();
  private performanceResults: Map<string, any> = new Map();
  private productPerformance: Map<string, any> = new Map();
  private events: Map<string, any> = new Map();
  private users: Map<string, any> = new Map();

  // Simulation operations
  async getSimulation(id: string): Promise<any> {
    return this.simulations.get(id) || null;
  }

  async createSimulation(simulation: any): Promise<string> {
    const id = simulation.id || `sim_${Date.now()}`;
    simulation.id = id;
    this.simulations.set(id, simulation);
    return id;
  }

  async updateSimulation(id: string, simulation: any): Promise<void> {
    const existing = this.simulations.get(id);
    if (!existing) return;

    this.simulations.set(id, { ...existing, ...simulation });
  }

  async getSimulationsByUser(userId: string): Promise<any[]> {
    //const sims = Array.from(this.simulations.values().filter(sim => sim.createdBy === userId));
    return [];
  }

  async deleteSimulation(id: string): Promise<void> {
    this.simulations.delete(id);
  }

  // Company operations
  async getCompany(id: string): Promise<any> {
    return this.companies.get(id) || null;
  }

  async getCompaniesBySimulation(simulationId: string): Promise<any[]> {
    return Array.from(this.companies.values()).filter(
      (company) => company.simulationId === simulationId
    );
  }

  async createCompany(company: any): Promise<string> {
    const id = company.id || `company_${Date.now()}`;
    company.id = id;
    this.companies.set(id, company);
    return id;
  }

  async updateCompany(id: string, company: any): Promise<void> {
    const existing = this.companies.get(id);
    if (!existing) return;

    this.companies.set(id, { ...existing, ...company });
  }

  async deleteCompany(id: string): Promise<void> {
    this.companies.delete(id);
  }

  async getPerformanceResultsByCompany(companyId: string): Promise<any[]> {
    return Array.from(this.performanceResults.values())
      .filter((pr) => pr.companyId === companyId)
      .sort((a, b) => a.period - b.period);
  }

  async getProductPerformanceByCompany(companyId: string): Promise<any[]> {
    const productIds = Array.from(this.products.values())
      .filter((p) => p.companyId === companyId)
      .map((p) => p.id);
    return Array.from(this.productPerformance.values()).filter((pp) =>
      productIds.includes(pp.productId)
    );
  }

  async getAllProductPerformanceByCompany(companyId: string): Promise<any[]> {
    const productIds = Array.from(this.products.values())
      .filter((p) => p.companyId === companyId)
      .map((p) => p.id);
    return Array.from(this.productPerformance.values())
      .filter((pp) => productIds.includes(pp.productId))
      .sort((a, b) => a.period - b.period);
  }

  // Product operations
  async getProduct(id: string): Promise<any> {
    return this.products.get(id) || null;
  }

  async getProductsByCompany(companyId: string): Promise<any[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.companyId === companyId
    );
  }

  async createProduct(product: any): Promise<string> {
    const id = product.id || `product_${Date.now()}`;
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return id;
  }

  async updateProduct(id: string, product: any): Promise<void> {
    const existing = this.products.get(id);
    if (!existing) return;

    this.products.set(id, { ...existing, ...product });
  }

  async deleteProduct(id: string): Promise<void> {
    this.products.delete(id);
  }

  // Decision operations
  async getDecision(id: string): Promise<any> {
    return this.decisions.get(id) || null;
  }

  async getDecisionsByCompany(
    companyId: string,
    period?: number
  ): Promise<any[]> {
    let decisions = Array.from(this.decisions.values()).filter(
      (decision) => decision.companyId === companyId
    );

    if (period !== undefined) {
      decisions = decisions.filter((decision) => decision.period === period);
    }

    return decisions;
  }

  async createDecision(decision: any): Promise<string> {
    const id = decision.id || `decision_${Date.now()}`;
    decision.id = id;
    this.decisions.set(id, decision);
    return id;
  }

  async updateDecision(id: string, decision: any): Promise<void> {
    const existing = this.decisions.get(id);
    if (!existing) return;

    this.decisions.set(id, { ...existing, ...decision });
  }

  // Market conditions operations
  async getMarketConditions(
    simulationId: string,
    period: number
  ): Promise<any> {
    const key = `${simulationId}_${period}`;
    return this.marketConditions.get(key) || null;
  }

  async createMarketConditions(marketConditions: any): Promise<string> {
    const id = marketConditions.id || `market_${Date.now()}`;
    marketConditions.id = id;
    const key = `${marketConditions.simulationId}_${marketConditions.period}`;
    this.marketConditions.set(key, marketConditions);
    return id;
  }

  // Performance results operations
  async getPerformanceResults(companyId: string, period: number): Promise<any> {
    const key = `${companyId}_${period}`;
    return this.performanceResults.get(key) || null;
  }

  async getPerformanceHistory(companyId: string): Promise<any[]> {
    return Array.from(this.performanceResults.values())
      .filter((result) => result.companyId === companyId)
      .sort((a, b) => a.period - b.period);
  }

  async createPerformanceResults(results: any): Promise<string> {
    const id = results.id || `perf_${Date.now()}`;
    results.id = id;
    const key = `${results.companyId}_${results.period}`;
    this.performanceResults.set(key, results);
    return id;
  }

  // Product performance operations
  async getProductPerformance(productId: string, period: number): Promise<any> {
    const key = `${productId}_${period}`;
    return this.productPerformance.get(key) || null;
  }

  async getProductPerformanceHistory(productId: string): Promise<any[]> {
    return Array.from(this.productPerformance.values())
      .filter((perf) => perf.productId === productId)
      .sort((a, b) => a.period - b.period);
  }

  async createProductPerformance(performance: any): Promise<string> {
    const id = performance.id || `prod_perf_${Date.now()}`;
    performance.id = id;
    const key = `${performance.productId}_${performance.period}`;
    this.productPerformance.set(key, performance);
    return id;
  }

  // Event operations
  async getEvents(simulationId: string, period?: number): Promise<any[]> {
    let events = Array.from(this.events.values()).filter(
      (event) => event.simulationId === simulationId
    );

    if (period !== undefined) {
      events = events.filter((event) => event.period === period);
    }

    return events;
  }

  async createEvent(event: any): Promise<string> {
    const id = event.id || `event_${Date.now()}`;
    event.id = id;
    this.events.set(id, event);
    return id;
  }

  // User operations
  async getUser(id: string): Promise<any> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<any> {
    return (
      Array.from(this.users.values()).find((user) => user.email === email) ||
      null
    );
  }

  async createUser(user: any): Promise<string> {
    const id = user.id || `user_${Date.now()}`;
    user.id = id;
    this.users.set(id, user);
    return id;
  }

  async updateUser(id: string, user: any): Promise<void> {
    const existing = this.users.get(id);
    if (!existing) return;

    this.users.set(id, { ...existing, ...user });
  }

  //getting everything by using simulation_id
  async getDecisionsBySimulation(simulationId: string): Promise<any[]> {
    const companyIds = Array.from(this.companies.values())
      .filter((c) => c.simulationId === simulationId)
      .map((c) => c.id);
    return Array.from(this.decisions.values()).filter((d) =>
      companyIds.includes(d.companyId)
    );
  }

  async getMarketConditionsBySimulation(simulationId: string): Promise<any[]> {
    return Array.from(this.marketConditions.values()).filter(
      (mc) => mc.simulationId === simulationId
    );
  }

  async getPerformanceResultsBySimulation(
    simulationId: string
  ): Promise<any[]> {
    const companyIds = Array.from(this.companies.values())
      .filter((c) => c.simulationId === simulationId)
      .map((c) => c.id);
    return Array.from(this.performanceResults.values()).filter((pr) =>
      companyIds.includes(pr.companyId)
    );
  }

  async getProductPerformanceBySimulation(
    simulationId: string
  ): Promise<any[]> {
    const companyIds = Array.from(this.companies.values())
      .filter((c) => c.simulationId === simulationId)
      .map((c) => c.id);
    const productIds = Array.from(this.products.values())
      .filter((p) => companyIds.includes(p.companyId))
      .map((p) => p.id);
    return Array.from(this.productPerformance.values()).filter((pp) =>
      productIds.includes(pp.productId)
    );
  }
}

const globalForDb = globalThis as unknown as {
  mockDb: DatabaseService | null;
};
let mockDb = globalForDb.mockDb ?? null;

// Factory function to create the appropriate database service
export function createDatabaseService(db?: D1Database): DatabaseService {
  if (db) {
    console.log("using d1 db");
    return new D1DatabaseService(db);
  }
  if (!mockDb) {
    mockDb = new MockDatabaseService();
    if (process.env.NODE_ENV !== "production") {
      globalForDb.mockDb = mockDb;
    }
  }
  return mockDb;
}

import {
  SimulationState,
  SimulationStatus,
  ProductStatus,
  DecisionPayload,
  Company,
  Product,
  MarketConditions,
  Decision,
  PerformanceResults,
} from "./types";

/**
 * Core simulation engine that processes decisions and advances the simulation state
 */
export class SimulationEngine {
  private state: SimulationState;

  constructor(initialState: SimulationState) {
    this.state = initialState;
  }

  /**
   * Get the current simulation state
   */
  getState(): SimulationState {
    return this.state;
  }

  /**
   * Process all pending decisions and advance to the next period
   */
  public advancePeriod(): void {
    // 1. Process all pending decisions
    this.state = JSON.parse(JSON.stringify(this.state));
    const currentPeriod = this.state.currentPeriod;
    const nextPeriod = currentPeriod + 1;
    this.processDecisions(currentPeriod);

    // 2. Update market conditions
    this.updateMarketConditions(currentPeriod);

    // 3. Calculate performance for all companies
    this.calculatePerformance(currentPeriod);

    // 4. Advance to next period
    this.state.currentPeriod = nextPeriod;
    // console.log(
    //   `[Engine] End of advancePeriod. Final event count in state: ${this.state.events.length}`
    // );
  }

  /**
   * Process all pending decisions for the current period
   */
  private processDecisions(period: number): void {
    // Get all unprocessed decisions for the current period
    const pendingDecisions = this.state.decisions.filter(
      (decision) => decision.period === period && !decision.processed
    );

    // Group decisions by company
    pendingDecisions.forEach((decision) => {
      const company = this.state.companies.find(
        (c) => c.id === decision.companyId
      );
      if (company) {
        this.processDecision(company, decision);
        decision.processed = true;
        decision.processedAt = new Date().toISOString();
      }
    });
  }

  /**
   * Process a single decision for a company
   */
  private processDecision(company: Company, decision: Decision): void {
    const data = JSON.parse(decision.data);

    switch (decision.type) {
      case "product_development":
        this.processProductDevelopment(company, data);
        break;
      case "pricing":
        this.processPricing(company, data);
        break;
      case "production":
        this.processProduction(company, data);
        break;
      case "marketing":
        this.processMarketing(company, data);
        break;
      case "research":
        this.processResearch(company, data);
        break;
      case "human_resources":
        this.processHumanResources(company, data);
        break;
      case "finance":
        this.processFinance(company, data);
        break;
    }
  }

  /**
   * Process product development decisions
   */
  private processProductDevelopment(company: Company, data: any): void {
    if (data.action === "new_product") {
      // Create a new product
      const newProduct: Product = {
        id: `product_${Date.now()}`,
        companyId: company.id,
        name: data.name,
        description: data.description || "",
        category: data.category,
        qualityRating: data.qualityRating || 5,
        innovationRating: data.innovationRating || 5,
        sustainabilityRating: data.sustainabilityRating || 5,
        productionCost: data.productionCost,
        sellingPrice: data.sellingPrice,
        inventoryLevel: 0,
        productionCapacity: data.productionCapacity || 1000,
        developmentCost: data.developmentCost || 0,
        marketingBudget: 0,
        status: ProductStatus.DEVELOPMENT,
        launchPeriod: this.state.currentPeriod + (data.developmentTime || 1),
        data: JSON.stringify({
          features: data.features || [],
          targetAudience: data.targetAudience || "",
        }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        discontinuePeriod: null,
      };

      this.state.products.push(newProduct);

      // Deduct development cost from company cash
      company.cashBalance -= data.developmentCost || 0;
    } else if (data.action === "update_product") {
      // Update an existing product
      const product = this.state.products.find((p) => p.id === data.productId);
      if (!product) return;

      // Update product properties
      if (data.name) product.name = data.name;
      if (data.description) product.description = data.description;
      if (data.qualityRating) product.qualityRating = data.qualityRating;
      if (data.innovationRating)
        product.innovationRating = data.innovationRating;
      if (data.sustainabilityRating)
        product.sustainabilityRating = data.sustainabilityRating;
      if (data.productionCost) product.productionCost = data.productionCost;
      if (data.productionCapacity)
        product.productionCapacity = data.productionCapacity;

      // Update product data
      const productData = JSON.parse(product.data);
      if (data.features) productData.features = data.features;
      if (data.targetAudience) productData.targetAudience = data.targetAudience;
      product.data = JSON.stringify(productData);

      product.updatedAt = new Date().toISOString();

      // Deduct development cost from company cash if specified
      if (data.developmentCost) {
        company.cashBalance -= data.developmentCost;
      }
    } else if (data.action === "discontinue_product") {
      // Discontinue an existing product
      const product = this.state.products.find((p) => p.id === data.productId);
      if (!product) return;

      product.status = ProductStatus.DISCONTINUED;
      product.discontinuePeriod = this.state.currentPeriod;
      product.updatedAt = new Date().toISOString();
    } else if (data.action === "update_status") {
      const product = this.state.products.find((p) => p.id === data.productId);
      if (product) {
        product.status = data.newStatus;
        product.updatedAt = new Date().toISOString();
      }
    }
  }

  /**
   * Process pricing decisions
   */
  private processPricing(company: Company, data: any): void {
    if (data.productId) {
      // Update pricing for a specific product
      const product = this.state.products.find(
        (p) => p.id === data.productId && p.companyId === company.id
      );
      if (!product) return;

      product.sellingPrice = data.price;
      product.updatedAt = new Date().toISOString();
    } else if (data.products) {
      // Update pricing for multiple products
      data.products.forEach((productData: any) => {
        const product = this.state.products.find(
          (p) => p.id === productData.productId && p.companyId === company.id
        );
        if (!product) return;

        product.sellingPrice = productData.price;
        product.updatedAt = new Date().toISOString();
      });
    }
  }

  /**
   * Process production decisions
   */
  private processProduction(company: Company, data: any): void {
    if (data.productId) {
      // Update production for a specific product
      const product = this.state.products.find(
        p => p.id === data.productId && p.companyId === company.id
      );
      if (!product) return;

      // Calculate production cost
      const productionVolume = Math.min(
        data.productionVolume,
        product.productionCapacity
      );
      const totalProductionCost = productionVolume * product.productionCost;

      if (company.cashBalance >= totalProductionCost) {
        company.cashBalance -= totalProductionCost;
        product.inventoryLevel += productionVolume;
      } else {
        console.warn(
          `[Engine] ${company.name} could not afford production. Decision ignored.`
        );
      }
      product.updatedAt = new Date().toISOString();
    }
  }

  /**
   * Process marketing decisions
   */
  private processMarketing(company: Company, data: any): void {
    if (data.productId) {
      const product = this.state.products.find(
        (p) => p.id === data.productId && p.companyId === company.id
      );
      if (!product) return;

      if (company.cashBalance >= data.budget) {
        product.marketingBudget = data.budget;
        company.cashBalance -= data.budget;
      } else {
        console.warn(
          `[Engine] ${company.name} could not afford marketing budget. Decision ignored.`
        );
      }
      product.updatedAt = new Date().toISOString();
    }
  }

  /**
   * Process research decisions
   */
  private processResearch(company: Company, data: any): void {
    const investment = data.amount || 0;
    if (company.cashBalance >= investment) {
      company.cashBalance -= investment;
      const companyData = JSON.parse(company.data || "{}");
      if (!companyData.researchProjects) companyData.researchProjects = [];
      companyData.researchProjects.push({
        id: `research_${Date.now()}`,
        companyId: company.id,
        budget: investment,
        startPeriod: this.state.currentPeriod,
      });
      company.data = JSON.stringify(companyData);
    } else {
      console.warn(
        `[Engine] ${company.name} could not afford R&D investment. Decision ignored.`
      );
    }
  }

  /**
   * Process human resources decisions
   */
  private processHumanResources(company: Company, data: any): void {
    const companyData = JSON.parse(company.data || "{}");
    if (!companyData.humanResources) {
      companyData.humanResources = {
        totalEmployees: 100,
        averageSalary: 50000,
      };
    }
    const hr = companyData.humanResources;

    if (data.hiring && data.hiring.newEmployees > 0) {
      const hiringCost = data.hiring.newEmployees * (hr.averageSalary * 0.2);
      if (company.cashBalance >= hiringCost) {
        company.cashBalance -= hiringCost;
        hr.totalEmployees += data.hiring.newEmployees;
      } else {
        console.warn(
          `[Engine] Not enough cash to hire ${data.hiring.newEmployees} employees.`
        );
      }
    }

    if (data.training && data.training.budget > 0) {
      if (company.cashBalance >= data.training.budget) {
        company.cashBalance -= data.training.budget;
        hr.trainingBudget = (hr.trainingBudget || 0) + data.training.budget;
      } else {
        console.warn(`[Engine] Not enough cash for training budget.`);
      }
    }
    company.data = JSON.stringify(companyData);
  }

  /**
   * Process finance decisions
   */
  private processFinance(company: Company, data: any): void {
    if (data.action === "loan") {
      // Take a loan
      company.cashBalance += data.amount;
      company.totalLiabilities += data.amount;

      // Store loan data for future reference
      const companyData = JSON.parse(company.data);
      if (!companyData.loans) {
        companyData.loans = [];
      }
      companyData.loans.push({
        id: `loan_${Date.now()}`,
        amount: data.amount,
        interestRate: data.interestRate,
        term: data.term,
        startPeriod: this.state.currentPeriod,
        remainingAmount: data.amount,
      });
      company.data = JSON.stringify(companyData);
    } else if (data.action === "repay_loan") {
      // Repay a loan
      const companyData = JSON.parse(company.data);
      if (!companyData.loans) return;

      const loan = companyData.loans.find((l: any) => l.id === data.loanId);
      if (!loan) return;

      const repaymentAmount = Math.min(data.amount, loan.remainingAmount);
      loan.remainingAmount -= repaymentAmount;
      company.cashBalance -= repaymentAmount;
      company.totalLiabilities -= repaymentAmount;

      company.data = JSON.stringify(companyData);
    } else if (data.action === "dividend") {
      // Pay dividend
      company.cashBalance -= data.amount;

      // Store dividend data for future reference
      const companyData = JSON.parse(company.data);
      if (!companyData.dividends) {
        companyData.dividends = [];
      }
      companyData.dividends.push({
        period: this.state.currentPeriod,
        amount: data.amount,
      });
      company.data = JSON.stringify(companyData);
    }
  }

  /**
   * Update market conditions for the next period
   */
  private updateMarketConditions(currentPeriod: number): void {
    const currentConditions = this.state.marketConditions.find(
      (mc) => mc.period === currentPeriod
    );
    if (!currentConditions) return;

    // Create new market conditions for the next period
    const nextPeriod = currentPeriod + 1;

    // Base the new conditions on the current ones with some changes
    const segmentDistribution = JSON.parse(
      currentConditions.segmentDistribution
    );
    const economicIndicators = JSON.parse(currentConditions.economicIndicators);
    const consumerPreferences = JSON.parse(
      currentConditions.consumerPreferences
    );
    const technologyTrends = JSON.parse(currentConditions.technologyTrends);

    // Apply random changes to market size (±5%)
    const marketSizeChange = 1 + (Math.random() * 0.1 - 0.05);
    const newMarketSize = currentConditions.totalMarketSize * marketSizeChange;

    // Apply small random changes to segment distribution
    Object.keys(segmentDistribution).forEach((segment) => {
      const change = 1 + (Math.random() * 0.06 - 0.03); // ±3%
      segmentDistribution[segment] *= change;
    });

    // Normalize segment distribution to sum to 1
    const totalDistribution = Object.values(segmentDistribution).reduce(
      (sum: number, val: any) => sum + val,
      0
    );
    Object.keys(segmentDistribution).forEach((segment) => {
      segmentDistribution[segment] /= totalDistribution;
    });

    // Apply small changes to economic indicators
    economicIndicators.gdp_growth += Math.random() * 0.01 - 0.005; // ±0.5%
    economicIndicators.inflation_rate += Math.random() * 0.01 - 0.005; // ±0.5%
    economicIndicators.interest_rate += Math.random() * 0.01 - 0.005; // ±0.5%
    economicIndicators.unemployment_rate += Math.random() * 0.01 - 0.005; // ±0.5%
    economicIndicators.consumer_confidence += Math.random() * 5 - 2.5; // ±2.5 points
    economicIndicators.business_sentiment += Math.random() * 5 - 2.5; // ±2.5 points

    // Apply small changes to consumer preferences
    Object.keys(consumerPreferences).forEach((segment) => {
      Object.keys(consumerPreferences[segment]).forEach((preference) => {
        consumerPreferences[segment][preference] += Math.random() * 0.1 - 0.05; // ±0.05 points
        // Ensure values stay between 0 and 1
        consumerPreferences[segment][preference] = Math.max(
          0,
          Math.min(1, consumerPreferences[segment][preference])
        );
      });
    });

    // Adjust sustainability importance (trending upward)
    const sustainabilityChange = Math.random() * 0.05; // 0-5% increase
    const newSustainabilityImportance = Math.min(
      1,
      currentConditions.sustainabilityImportance + sustainabilityChange
    );

    // Create new market conditions
    const newMarketConditions: MarketConditions = {
      id: `market_${nextPeriod}`,
      simulationId: currentConditions.simulationId,
      period: nextPeriod,
      totalMarketSize: newMarketSize,
      segmentDistribution: JSON.stringify(segmentDistribution),
      economicIndicators: JSON.stringify(economicIndicators),
      consumerPreferences: JSON.stringify(consumerPreferences),
      technologyTrends: JSON.stringify(technologyTrends),
      sustainabilityImportance: newSustainabilityImportance,
      data: "{}",
      createdAt: new Date().toISOString(),
    };

    this.state.marketConditions.push(newMarketConditions);

    // Randomly generate market events
    this.generateMarketEvents(nextPeriod);
  }

  /**
   * Generate random market events for the given period
   */
  private generateMarketEvents(period: number): void {
    console.log(
      `[Engine] STEP A: generateMarketEvents called for period ${period}.`
    );
    const eventTypes = [
      "economic",
      "technological",
      "regulatory",
      "competitive",
      "consumer",
    ];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    console.log(`[Engine] STEP B: Random eventType chosen: "${eventType}"`);

    let event;

    switch (eventType) {
      case "economic":
        console.log("[Engine] STEP C: Entering 'economic' case.");
        event = this.generateEconomicEvent(period);
        break;
      case "technological":
        console.log("[Engine] STEP C: Entering 'technological' case.");
        event = this.generateTechnologicalEvent(period);
        break;
      case "regulatory":
        console.log("[Engine] STEP C: Entering 'regulatory' case.");
        event = this.generateRegulatoryEvent(period);
        break;
      case "competitive":
        console.log("[Engine] STEP C: Entering 'competitive' case.");
        event = this.generateCompetitiveEvent(period);
        break;
      case "consumer":
        console.log("[Engine] STEP C: Entering 'consumer' case.");
        event = this.generateConsumerEvent(period);
        break;
      default:
        console.error(
          "[Engine] STEP C: FAILED. Entered default case in switch. This should not happen."
        );
        return;
    }

    if (event) {
      // Add event to state
      this.state.events.push(event);
      console.log(
        `[Engine] Event PUSHED: "${event.name}". Events array now has ${this.state.events.length} item(s).`
      );
    } else {
      console.error(
        "[Engine] STEP E: FAILED. Event object was null or undefined after switch statement."
      );
    }
  }

  /**
   * Generate an economic event
   */
  private generateEconomicEvent(period: number): any {
    const economicEvents = [
      {
        name: "Economic Boom",
        description:
          "A strong economic growth period has begun, increasing consumer spending across all segments.",
        impactArea: "market_size",
        impactStrength: 0.15, // 15% increase in market size
        type: "economic",
      },
      {
        name: "Economic Recession",
        description:
          "An economic downturn has begun, reducing consumer spending across all segments.",
        impactArea: "market_size",
        impactStrength: -0.1, // 10% decrease in market size
        type: "economic",
      },
      {
        name: "Interest Rate Hike",
        description:
          "Central bank has increased interest rates, affecting borrowing costs.",
        impactArea: "finance",
        impactStrength: 0.02, // 2% increase in interest rates
        type: "economic",
      },
      {
        name: "Currency Fluctuation",
        description:
          "Significant currency value changes affecting import/export costs.",
        impactArea: "production_cost",
        impactStrength: Math.random() > 0.5 ? 0.08 : -0.08, // 8% change in production costs
        type: "economic",
      },
    ];

    const selectedEvent =
      economicEvents[Math.floor(Math.random() * economicEvents.length)];

    return {
      id: `event_${Date.now()}`,
      simulationId: this.state.id,
      period,
      type: "economic",
      name: selectedEvent.name,
      description: selectedEvent.description,
      impactArea: selectedEvent.impactArea,
      impactStrength: selectedEvent.impactStrength,
      affectedCompanies: null, // Affects all companies
      data: JSON.stringify(selectedEvent),
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Generate a technological event
   */
  private generateTechnologicalEvent(period: number): any {
    const technologicalEvents = [
      {
        name: "Technological Breakthrough",
        description:
          "A major technological breakthrough has occurred, creating new opportunities for innovation.",
        impactArea: "innovation",
        impactStrength: 0.2, // 20% boost to innovation potential
        type: "technological",
      },
      {
        name: "Manufacturing Innovation",
        description:
          "New manufacturing techniques have been developed, potentially reducing production costs.",
        impactArea: "production_cost",
        impactStrength: -0.1, // 10% reduction in production costs
        type: "technological",
      },
      {
        name: "Digital Transformation Trend",
        description:
          "Increasing consumer preference for digitally-enabled products and services.",
        impactArea: "consumer_preferences",
        impactStrength: 0.15, // 15% increase in digital preference
        type: "technological",
      },
    ];

    const selectedEvent =
      technologicalEvents[
        Math.floor(Math.random() * technologicalEvents.length)
      ];

    return {
      id: `event_${Date.now()}`,
      simulationId: this.state.id,
      period,
      type: "technological",
      name: selectedEvent.name,
      description: selectedEvent.description,
      impactArea: selectedEvent.impactArea,
      impactStrength: selectedEvent.impactStrength,
      affectedCompanies: null, // Affects all companies
      data: JSON.stringify(selectedEvent),
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Generate a regulatory event
   */
  private generateRegulatoryEvent(period: number): any {
    const regulatoryEvents = [
      {
        name: "Environmental Regulations",
        description:
          "New environmental regulations require changes to production processes.",
        impactArea: "sustainability",
        impactStrength: 0.25, // 25% increase in importance of sustainability
        type: "regulatory",
      },
      {
        name: "Tax Policy Change",
        description: "Changes in tax policy affecting corporate profits.",
        impactArea: "finance",
        impactStrength: -0.05, // 5% decrease in profits
        type: "regulatory",
      },
      {
        name: "Labor Law Changes",
        description: "New labor laws affecting employment costs and practices.",
        impactArea: "human_resources",
        impactStrength: 0.08, // 8% increase in labor costs
        type: "regulatory",
      },
    ];

    const selectedEvent =
      regulatoryEvents[Math.floor(Math.random() * regulatoryEvents.length)];

    return {
      id: `event_${Date.now()}`,
      simulationId: this.state.id,
      period,
      type: "regulatory",
      name: selectedEvent.name,
      description: selectedEvent.description,
      impactArea: selectedEvent.impactArea,
      impactStrength: selectedEvent.impactStrength,
      affectedCompanies: null, // Affects all companies
      data: JSON.stringify(selectedEvent),
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Generate a competitive event
   */
  private generateCompetitiveEvent(period: number): any {
    const competitiveEvents = [
      {
        name: "New Market Entrant",
        description:
          "A new competitor has entered the market with innovative products.",
        impactArea: "market_share",
        impactStrength: -0.05, // 5% decrease in market share
        type: "competitive",
      },
      {
        name: "Competitor Price War",
        description:
          "A major competitor has significantly reduced prices to gain market share.",
        impactArea: "pricing",
        impactStrength: -0.1, // 10% pressure on prices
        type: "competitive",
      },
      {
        name: "Industry Consolidation",
        description:
          "Merger between competitors creating a stronger market player.",
        impactArea: "competition",
        impactStrength: 0.15, // 15% increase in competitive pressure
        type: "competitive",
      },
    ];

    const selectedEvent =
      competitiveEvents[Math.floor(Math.random() * competitiveEvents.length)];

    return {
      id: `event_${Date.now()}`,
      simulationId: this.state.id,
      period,
      type: "competitive",
      name: selectedEvent.name,
      description: selectedEvent.description,
      impactArea: selectedEvent.impactArea,
      impactStrength: selectedEvent.impactStrength,
      affectedCompanies: null, // Affects all companies
      data: JSON.stringify(selectedEvent),
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Generate a consumer event
   */
  private generateConsumerEvent(period: number): any {
    const consumerEvents = [
      {
        name: "Shifting Consumer Preferences",
        description:
          "Consumers are showing stronger preference for sustainable products.",
        impactArea: "consumer_preferences",
        impactStrength: 0.2, // 20% increase in sustainability preference
        type: "consumer",
      },
      {
        name: "Quality Expectations Increase",
        description:
          "Consumers are demanding higher quality products across all segments.",
        impactArea: "quality",
        impactStrength: 0.15, // 15% increase in quality importance
        type: "consumer",
      },
      {
        name: "Brand Loyalty Shift",
        description:
          "Consumers are becoming less brand loyal and more value-focused.",
        impactArea: "marketing",
        impactStrength: -0.1, // 10% decrease in marketing effectiveness
        type: "consumer",
      },
    ];

    const selectedEvent =
      consumerEvents[Math.floor(Math.random() * consumerEvents.length)];

    return {
      id: `event_${Date.now()}`,
      simulationId: this.state.id,
      period,
      type: "consumer",
      name: selectedEvent.name,
      description: selectedEvent.description,
      impactArea: selectedEvent.impactArea,
      impactStrength: selectedEvent.impactStrength,
      affectedCompanies: null, // Affects all companies
      data: JSON.stringify(selectedEvent),
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Calculate performance for all companies
   */
  private calculatePerformance(currentPeriod: number): void {
    // Get market conditions for the current period
    const marketConditions = this.state.marketConditions.find(
      (mc) => mc.period === currentPeriod
    );
    if (!marketConditions) return;

    // Parse market data
    const segmentDistribution = JSON.parse(
      marketConditions.segmentDistribution
    );
    const consumerPreferences = JSON.parse(
      marketConditions.consumerPreferences
    );
    const totalMarketSize = marketConditions.totalMarketSize;

    // Calculate performance for each company
    this.state.companies.forEach((company) => {
      // Get active products for the company
      const activeProducts = this.state.products.filter(
        (p) => p.companyId === company.id && p.status === "active"
      );

      if (activeProducts.length === 0) {
        // No active products, create minimal performance results
        this.createMinimalPerformanceResults(company);
        return;
      }

      // Calculate product performance
      let totalRevenue = 0;
      let totalCosts = 0;
      let totalMarketShare = 0;

      activeProducts.forEach((product) => {
        const productPerformance = this.calculateProductPerformance(
          product,
          this.state.products,
          marketConditions
        );

        // Add to company totals
        totalRevenue += productPerformance.revenue;
        totalCosts += productPerformance.costs;
        totalMarketShare += productPerformance.marketShare;

        // Save product performance
        this.state.productPerformance.push({
          id: `prod_perf_${product.id}_${currentPeriod}`,
          productId: product.id,
          period: currentPeriod,
          salesVolume: productPerformance.salesVolume,
          revenue: productPerformance.revenue,
          costs: productPerformance.costs,
          profit: productPerformance.profit,
          marketShare: productPerformance.marketShare,
          customerSatisfaction: productPerformance.customerSatisfaction,
          data: JSON.stringify(productPerformance),
          createdAt: new Date().toISOString(),
        });

        // Update product inventory
        product.inventoryLevel = Math.max(
          0,
          product.inventoryLevel - productPerformance.salesVolume
        );
      });

      // Calculate company performance metrics
      const profit = totalRevenue - totalCosts;
      const cashFlow = profit; // Simplified cash flow calculation
      const roi = totalCosts > 0 ? profit / totalCosts : 0;

      // Get HR data for employee satisfaction
      const companyData = JSON.parse(company.data);
      const hr = companyData.humanResources || {
        employeeSatisfaction: 50,
      };

      // Calculate customer satisfaction (average of product satisfaction)
      const avgCustomerSatisfaction =
        this.state.productPerformance
          .filter((pp) => pp.period === currentPeriod)
          .filter((pp) => {
            const product = this.state.products.find(
              (p) => p.id === pp.productId
            );
            return product && product.companyId === company.id;
          })
          .reduce((sum, pp) => sum + pp.customerSatisfaction, 0) /
        activeProducts.length;

      // Calculate innovation score based on product innovation ratings
      const innovationScore =
        activeProducts.reduce((sum, p) => sum + p.innovationRating, 0) /
        activeProducts.length;

      // Calculate sustainability score based on product sustainability ratings
      const sustainabilityScore =
        activeProducts.reduce((sum, p) => sum + p.sustainabilityRating, 0) /
        activeProducts.length;

      // Calculate brand value change (simplified)
      const brandValueChange =
        totalMarketShare * 0.3 +
        avgCustomerSatisfaction * 0.3 +
        innovationScore * 0.2 +
        sustainabilityScore * 0.2 -
        5;

      // Update company financials
      company.cashBalance += cashFlow;
      company.totalAssets = company.cashBalance + totalRevenue * 0.5; // Simplified asset calculation
      company.brandValue = Math.max(
        1,
        Math.min(100, company.brandValue + brandValueChange)
      );

      // Create performance results
      const performanceResults: PerformanceResults = {
        id: `perf_${company.id}_${currentPeriod}`,
        companyId: company.id,
        period: currentPeriod,
        revenue: totalRevenue,
        costs: totalCosts,
        profit,
        marketShare: totalMarketShare,
        cashFlow,
        roi,
        customerSatisfaction: avgCustomerSatisfaction,
        employeeSatisfaction: hr.employeeSatisfaction,
        sustainabilityScore,
        innovationScore,
        brandValueChange,
        data: JSON.stringify({
          productBreakdown: activeProducts.map((p) => ({
            productId: p.id,
            name: p.name,
            revenue:
              this.state.productPerformance.find(
                (pp) =>
                  pp.productId === p.id &&
                  pp.period === this.state.currentPeriod
              )?.revenue || 0,
            marketShare:
              this.state.productPerformance.find(
                (pp) =>
                  pp.productId === p.id &&
                  pp.period === this.state.currentPeriod
              )?.marketShare || 0,
          })),
        }),
        createdAt: new Date().toISOString(),
      };

      this.state.performanceResults.push(performanceResults);
    });
  }

  /**
   * Create minimal performance results for a company with no active products
   */
  private createMinimalPerformanceResults(company: Company): void {
    // Get HR data for employee satisfaction
    const companyData = JSON.parse(company.data);
    const hr = companyData.humanResources || {
      employeeSatisfaction: 50,
    };

    // Fixed costs even with no products
    const fixedCosts = 50000;
    company.cashBalance -= fixedCosts;

    // Create performance results
    const performanceResults: PerformanceResults = {
      id: `perf_${company.id}_${this.state.currentPeriod}`,
      companyId: company.id,
      period: this.state.currentPeriod,
      revenue: 0,
      costs: fixedCosts,
      profit: -fixedCosts,
      marketShare: 0,
      cashFlow: -fixedCosts,
      roi: 0,
      customerSatisfaction: 0,
      employeeSatisfaction: hr.employeeSatisfaction,
      sustainabilityScore: 0,
      innovationScore: 0,
      brandValueChange: -5, // Brand value decreases with no products
      data: JSON.stringify({
        productBreakdown: [],
      }),
      createdAt: new Date().toISOString(),
    };

    this.state.performanceResults.push(performanceResults);

    // Update company brand value
    company.brandValue = Math.max(1, company.brandValue - 5);
  }

  /**
   * Calculate performance for a single product
   */
  private calculateProductPerformance(
    product: Product,
    allProducts: Product[],
    marketConditions: MarketConditions
  ): any {
    const segmentDistribution = JSON.parse(
      marketConditions.segmentDistribution
    );
    const consumerPreferences = JSON.parse(
      marketConditions.consumerPreferences
    );
    const totalMarketSize = marketConditions.totalMarketSize;

    const segment = product.category;
    const segmentShare = segmentDistribution[segment] || 0;
    const segmentSize = totalMarketSize * segmentShare;
    const segmentPreferences = consumerPreferences[segment] || {};

    const qualityScore =
      product.qualityRating * (segmentPreferences.quality_sensitivity ?? 0.5);
    const priceScore =
      product.sellingPrice > 0
        ? (10 - product.sellingPrice / 50) *
          (segmentPreferences.price_sensitivity ?? 0.5)
        : 0;
    const innovationScore =
      product.innovationRating *
      (segmentPreferences.innovation_preference ?? 0.5);
    const sustainabilityScore =
      product.sustainabilityRating *
      (segmentPreferences.sustainability_preference ?? 0.5);
    const marketingEffectiveness =
      Math.sqrt(product.marketingBudget ?? 0) * 0.5;

    const attractiveness =
      qualityScore +
      priceScore +
      innovationScore +
      sustainabilityScore +
      marketingEffectiveness;

    let segmentMarketShare = 0;
    const allCompetitorsInSegment = allProducts.filter(
      (p) => p.status === "active" && p.category === segment
    );

    const totalAttractiveness = allCompetitorsInSegment.reduce((sum, p) => {
      const compSegmentPrefs = consumerPreferences[p.category] || {};
      const compQualityScore =
        p.qualityRating * (compSegmentPrefs.quality_sensitivity ?? 0.5);
      const compPriceScore =
        p.sellingPrice > 0
          ? (10 - p.sellingPrice / 50) *
            (compSegmentPrefs.price_sensitivity ?? 0.5)
          : 0;
      const compInnovationScore =
        p.innovationRating * (compSegmentPrefs.innovation_preference ?? 0.5);
      const compSustainabilityScore =
        p.sustainabilityRating *
        (compSegmentPrefs.sustainability_preference ?? 0.5);
      const compMarketingEffectiveness =
        Math.sqrt(p.marketingBudget ?? 0) * 0.5;
      return (
        sum +
        compQualityScore +
        compPriceScore +
        compInnovationScore +
        compSustainabilityScore +
        compMarketingEffectiveness
      );
    }, 0);

    if (totalAttractiveness > 0) {
      segmentMarketShare = attractiveness / totalAttractiveness;
    }

    const overallMarketShare = segmentMarketShare * segmentShare;
    const potentialSales =
      product.sellingPrice > 0
        ? Math.round((segmentSize * segmentMarketShare) / product.sellingPrice)
        : 0;
    const actualSales = Math.min(potentialSales, product.inventoryLevel);

    const revenue = actualSales * product.sellingPrice;
    const productionCosts = actualSales * product.productionCost;
    const marketingCosts = product.marketingBudget;
    const totalCosts = productionCosts + marketingCosts;
    const profit = revenue - totalCosts;

    const inventorySatisfaction =
      potentialSales > 0 ? actualSales / potentialSales : 1;
    const valueSatisfaction =
      product.sellingPrice > 0
        ? product.qualityRating / (product.sellingPrice / 50)
        : 0;
    const customerSatisfaction =
      qualityScore * 0.4 +
      valueSatisfaction * 0.4 +
      inventorySatisfaction * 0.2;

    return {
      salesVolume: actualSales,
      revenue,
      costs: totalCosts,
      profit,
      marketShare: overallMarketShare,
      customerSatisfaction: Math.min(10, customerSatisfaction),
    };
  }

  /**
   * Submit a decision for a company
   */
  public submitDecision(companyId: string, decision: DecisionPayload): void {
    const newDecision: Decision = {
      id: `decision_${Date.now()}`,
      companyId,
      period: this.state.currentPeriod,
      type: decision.type,
      data: decision.data,
      submittedAt: new Date().toISOString(),
      processed: false,
      processedAt: null,
    };

    if (decision.type === "product_development") {
      const data = JSON.parse(decision.data);
      if (data.action === "update_status") {
        const company = this.state.companies.find((c) => c.id === companyId);
        if (company) {
          this.processProductDevelopment(company, data);
          newDecision.processed = true;
        }
      }
    }

    this.state.decisions.push(newDecision);
  }

  /**
   * Get performance results for a company
   */
  getCompanyPerformance(
    companyId: string,
    period?: number
  ): PerformanceResults | null {
    if (period !== undefined) {
      return (
        this.state.performanceResults.find(
          (pr) => pr.companyId === companyId && pr.period === period
        ) || null
      );
    }

    // Get the most recent performance results
    return (
      this.state.performanceResults
        .filter((pr) => pr.companyId === companyId)
        .sort((a, b) => b.period - a.period)[0] || null
    );
  }

  /**
   * Get all performance results for a company
   */
  getAllCompanyPerformance(companyId: string): PerformanceResults[] {
    return this.state.performanceResults
      .filter((pr) => pr.companyId === companyId)
      .sort((a, b) => a.period - b.period);
  }

  /**
   * Get product performance for a specific product
   */
  getProductPerformance(productId: string, period?: number): any {
    if (period !== undefined) {
      return (
        this.state.productPerformance.find(
          (pp) => pp.productId === productId && pp.period === period
        ) || null
      );
    }

    // Get the most recent product performance
    return (
      this.state.productPerformance
        .filter((pp) => pp.productId === productId)
        .sort((a, b) => b.period - a.period)[0] || null
    );
  }

  /**
   * Get all product performance for a specific product
   */
  getAllProductPerformance(productId: string): any[] {
    return this.state.productPerformance
      .filter((pp) => pp.productId === productId)
      .sort((a, b) => a.period - b.period);
  }

  /**
   * Get market conditions for a specific period
   */
  getMarketConditions(period?: number): MarketConditions | null {
    if (period !== undefined) {
      return (
        this.state.marketConditions.find((mc) => mc.period === period) || null
      );
    }

    // Get the most recent market conditions
    return (
      this.state.marketConditions.sort((a, b) => b.period - a.period)[0] || null
    );
  }

  /**
   * Get events for a specific period
   */
  getEvents(period?: number): any[] {
    if (period !== undefined) {
      return this.state.events.filter((e) => e.period === period);
    }

    // Get all events
    return this.state.events.sort((a, b) => a.period - b.period);
  }

  /**
   * Get a company by ID
   */
  getCompany(companyId: string): Company | null {
    return this.state.companies.find((c) => c.id === companyId) || null;
  }

  /**
   * Get all products for a company
   */
  getCompanyProducts(companyId: string): Product[] {
    return this.state.products.filter((p) => p.companyId === companyId);
  }

  /**
   * Get a product by ID
   */
  getProduct(productId: string): Product | null {
    return this.state.products.find((p) => p.id === productId) || null;
  }
}
